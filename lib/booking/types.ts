export type RideType = "one_way" | "hourly" | "city_to_city" | "corporate";

export interface PlaceResult {
  short: string;
  full: string;
  placeId: string;
}

export interface HourlyVariant {
  hours: number;
  duration_unit?: string;
  rate: number;
  included_km?: number;
}

export interface VehicleCategory {
  id: string;
  name: string;
  description: string | null;
  max_pax: number | null;
  max_luggage: number | null;
  image_url: string | null;
  includes: string[] | null;
}

export interface CategoryPricingRow {
  id: string;
  category_id: string;
  city_code: string | null;
  base_fare: number | null;
  per_km: number | null;
  per_mile: number | null;
  min_fare: number | null;
  hourly_variants: HourlyVariant[] | null;
  city_to_city_routes: { from: string; to: string; rate: number }[] | null;
  feat_tax: boolean | null;
  tax_percent: number | null;
}

export interface PricedCategory {
  category: VehicleCategory;
  price: number;
  breakdown: { subtotal: number; tax: number; taxPercent: number };
}
