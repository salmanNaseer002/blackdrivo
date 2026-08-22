import { NextRequest, NextResponse } from "next/server";

const KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") || "";
  const countryCode = request.nextUrl.searchParams.get("country") || "";
  if (query.trim().length < 3) return NextResponse.json({ results: [] });

  // Bias results toward the visitor's currently-selected region without
  // hard-restricting to it, and skip per-result Place Details calls (the
  // previous N+1 detail lookup on every keystroke was the main source of
  // lag) — coordinates are resolved lazily only when a suggestion is picked.
  const autoUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
    query
  )}${countryCode ? `&components=country:${countryCode}` : ""}&key=${KEY}`;
  const autoRes = await fetch(autoUrl);
  const autoData = await autoRes.json();
  let predictions = (autoData.predictions || []).slice(0, 6);

  // If the country-restricted search comes back empty, fall back to worldwide.
  if (predictions.length === 0 && countryCode) {
    const worldUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&key=${KEY}`;
    const worldRes = await fetch(worldUrl);
    const worldData = await worldRes.json();
    predictions = (worldData.predictions || []).slice(0, 6);
  }

  const results = predictions.map((p: any) => ({
    short: p.structured_formatting?.main_text || p.description,
    full: p.description,
    placeId: p.place_id,
  }));

  return NextResponse.json({ results });
}
