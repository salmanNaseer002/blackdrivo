import type { PlaceResult } from "./types";

export async function autocompletePlaces(query: string, countryCode?: string): Promise<PlaceResult[]> {
  if (!query || query.trim().length < 3) return [];
  const res = await fetch(
    `/api/places/autocomplete?q=${encodeURIComponent(query)}${countryCode ? `&country=${countryCode}` : ""}`
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.results || [];
}

export async function resolvePlaceCoords(placeId: string): Promise<{ lat: number; lng: number } | null> {
  const res = await fetch(`/api/places/details?placeId=${placeId}`);
  if (!res.ok) return null;
  const data = await res.json();
  if (data.lat == null) return null;
  return { lat: data.lat, lng: data.lng };
}

export async function getRouteInfo(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number }
): Promise<{ distanceKm: number; durationMin: number } | null> {
  const res = await fetch(
    `/api/places/directions?oLat=${origin.lat}&oLng=${origin.lng}&dLat=${destination.lat}&dLng=${destination.lng}`
  );
  if (!res.ok) return null;
  const data = await res.json();
  if (data.distanceKm == null) return null;
  return data;
}
