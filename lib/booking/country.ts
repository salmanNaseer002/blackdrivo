import { createClient } from "@/lib/supabase/client";

export interface SiteCountry {
  code: string;
  name: string;
  flag: string;
  currency: string;
  symbol: string;
  phone_code: string;
  helpline_number?: string | null;
}

const FALLBACK: SiteCountry = {
  code: "US",
  name: "United States",
  flag: "🇺🇸",
  currency: "USD",
  symbol: "$",
  phone_code: "+1",
  helpline_number: null,
};

export async function fetchActiveCountries(): Promise<SiteCountry[]> {
  const supabase = createClient();
  const { data } = await (supabase as any)
    .from("countries_config")
    .select("code,name,flag,currency,symbol,phone_code,helpline_number")
    .eq("is_active", true)
    .eq("reflect_website", true)
    .order("name");
  return data && data.length > 0 ? data : [FALLBACK];
}

// Detects the visitor's country via browser geolocation → reverse geocode,
// matches it against countries the business actually operates in, and
// falls back to USD/US when the visitor is outside all supported countries
// (or location access is denied/unavailable).
export async function detectCountry(activeCountries: SiteCountry[]): Promise<SiteCountry> {
  try {
    const coords = await getBrowserCoords();
    if (!coords) return FALLBACK;

    const res = await fetch(`/api/places/geocode?lat=${coords.lat}&lng=${coords.lng}`);
    if (!res.ok) return FALLBACK;
    const data = await res.json();
    const match = activeCountries.find((c) => c.code === data.countryCode);
    return match || FALLBACK;
  } catch {
    return FALLBACK;
  }
}

function getBrowserCoords(): Promise<{ lat: number; lng: number } | null> {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(null),
      { timeout: 5000 }
    );
  });
}

export { FALLBACK as FALLBACK_COUNTRY };
