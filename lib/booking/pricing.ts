import { createClient } from "@/lib/supabase/client";
import type { CategoryPricingRow, PricedCategory, RideType, VehicleCategory } from "./types";

export type BookingRideType = RideType | "rental";

// Returns true when `cityCode` (e.g. "Lahore") is mentioned in the free-text
// pickup address, so a region-specific pricing row can be preferred over the
// country-wide default.
function matchesCity(cityCode: string | null | undefined, pickupText: string | undefined): boolean {
  if (!cityCode || !pickupText) return false;
  return pickupText.toLowerCase().includes(cityCode.toLowerCase());
}

export async function fetchPricedCategories(params: {
  rideType: BookingRideType;
  countryCode?: string;
  distanceKm?: number;
  hours?: number;
  fromCity?: string;
  toCity?: string;
  pickupCity?: string;
}): Promise<PricedCategory[]> {
  const { rideType, countryCode = "US", distanceKm = 0, hours, fromCity, toCity, pickupCity } = params;
  const supabase = createClient();

  // "Rental" (multi-day) packages live in the same `hourly` pricing rows as
  // by-the-hour packages — they're distinguished by each variant's
  // `duration_unit` ('day' vs unset/'hours'), not by a separate pricing_type.
  const pricingType: RideType = rideType === "rental" ? "hourly" : rideType;

  const [{ data: categories }, { data: pricingRows }] = await Promise.all([
    (supabase as any)
      .from("vehicle_categories")
      .select("id,name,description,max_pax,max_luggage,image_url,includes")
      .eq("is_active", true)
      .eq("country_code", countryCode)
      .order("sort_order"),
    (supabase as any)
      .from("category_pricing")
      .select("*")
      .eq("country_code", countryCode)
      .eq("pricing_type", pricingType)
      .eq("is_active", true)
      .order("city_code", { ascending: true, nullsFirst: true }),
  ]);

  const cats: VehicleCategory[] = categories || [];
  const rows: CategoryPricingRow[] = pricingRows || [];

  const priced = cats
    .map((category) => {
      // Region-wise pricing: prefer a row whose city_code matches the pickup
      // location, then fall back to the country-wide (no city_code) row.
      const row = rows.find((r) => r.category_id === category.id && matchesCity(r.city_code, pickupCity)) ||
        rows.find((r) => r.category_id === category.id && !r.city_code) ||
        rows.find((r) => r.category_id === category.id);
      if (!row) return null;
      const { subtotal, tax } = calcFare(row, { rideType, distanceKm, hours, fromCity, toCity });
      const taxPercent = row.feat_tax ? row.tax_percent || 0 : 0;
      return { category, price: Math.round((subtotal + tax) * 100) / 100, breakdown: { subtotal, tax, taxPercent } };
    })
    .filter(Boolean) as PricedCategory[];

  return priced.sort((a, b) => a.price - b.price);
}

// Returns the hourly (duration_unit unset/'hours') or rental (duration_unit
// 'day') package options for a category, matching PassApp's inline package
// picker.
export async function fetchPackages(
  categoryId: string,
  countryCode: string,
  unit: "hours" | "day"
): Promise<{ hours: number; rate: number; included_km?: number }[]> {
  const supabase = createClient();
  const { data } = await (supabase as any)
    .from("category_pricing")
    .select("category_id,city_code,hourly_variants")
    .eq("country_code", countryCode)
    .eq("pricing_type", "hourly")
    .eq("category_id", categoryId)
    .eq("is_active", true)
    .order("city_code", { ascending: true, nullsFirst: true });

  const row = (data || []).find((r: any) => !r.city_code) || (data || [])[0];
  const variants = row?.hourly_variants || [];
  return variants.filter((v: any) => (unit === "day" ? v.duration_unit === "day" : !v.duration_unit || v.duration_unit === "hours"));
}

// Country-wide package picker (used before a specific vehicle is chosen, e.g.
// the home widget / trip step). Not every category has hourly/rental pricing
// configured, so this scans across all of a country's categories and returns
// the union of available durations rather than assuming the first category
// (by sort order) has data.
export async function fetchAvailablePackages(
  countryCode: string,
  unit: "hours" | "day",
  pickupCity?: string
): Promise<{ hours: number; rate: number; included_km?: number }[]> {
  const supabase = createClient();
  const { data } = await (supabase as any)
    .from("category_pricing")
    .select("city_code,hourly_variants")
    .eq("country_code", countryCode)
    .eq("pricing_type", "hourly")
    .eq("is_active", true)
    .order("city_code", { ascending: true, nullsFirst: true });

  const rows: { city_code: string | null; hourly_variants: any[] }[] = data || [];
  // Region-wise: if the pickup matches a city-specific row, only use that
  // city's packages; otherwise fall back to the country-wide (no city_code) rows.
  const cityRows = rows.filter((r) => matchesCity(r.city_code, pickupCity));
  const scoped = cityRows.length > 0 ? cityRows : rows.filter((r) => !r.city_code);
  const source = scoped.length > 0 ? scoped : rows;

  const seen = new Map<number, { hours: number; rate: number; included_km?: number }>();
  for (const row of source) {
    for (const v of row.hourly_variants || []) {
      const matches = unit === "day" ? v.duration_unit === "day" : !v.duration_unit || v.duration_unit === "hours";
      if (matches && !seen.has(v.hours)) seen.set(v.hours, v);
    }
  }
  return [...seen.values()].sort((a, b) => a.hours - b.hours);
}

function calcFare(
  row: CategoryPricingRow,
  opts: { rideType: BookingRideType; distanceKm: number; hours?: number; fromCity?: string; toCity?: string }
): { subtotal: number; tax: number } {
  const { rideType, distanceKm, hours, fromCity, toCity } = opts;
  let base = 0;

  if (rideType === "hourly" || rideType === "rental") {
    const unit = rideType === "rental" ? "day" : "hours";
    const variants = (row.hourly_variants || []).filter((v: any) =>
      unit === "day" ? v.duration_unit === "day" : !v.duration_unit || v.duration_unit === "hours"
    );
    const variant = variants.find((v) => v.hours === hours);
    base = variant?.rate || variants[0]?.rate || row.base_fare || 0;
  } else if (rideType === "city_to_city") {
    const route = (row.city_to_city_routes || []).find(
      (r) =>
        (fromCity && toCity && r.from?.toLowerCase().includes(fromCity.toLowerCase()) &&
          r.to?.toLowerCase().includes(toCity.toLowerCase())) ||
        (fromCity && toCity && r.from?.toLowerCase().includes(toCity.toLowerCase()) &&
          r.to?.toLowerCase().includes(fromCity.toLowerCase()))
    );
    if (route?.rate) {
      base = route.rate;
    } else {
      const perDist = row.per_km || row.per_mile || 0;
      base = Math.max(row.min_fare || 0, (row.base_fare || 0) + distanceKm * perDist);
    }
  } else {
    const perDist = row.per_km || row.per_mile || 0;
    base = Math.max(row.min_fare || 0, (row.base_fare || 0) + distanceKm * perDist);
  }

  const tax = row.feat_tax ? base * ((row.tax_percent || 0) / 100) : 0;
  return { subtotal: Math.round(base * 100) / 100, tax: Math.round(tax * 100) / 100 };
}
