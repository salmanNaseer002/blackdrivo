import { NextRequest, NextResponse } from "next/server";

const KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

export async function GET(request: NextRequest) {
  const originLat = request.nextUrl.searchParams.get("oLat");
  const originLng = request.nextUrl.searchParams.get("oLng");
  const destLat = request.nextUrl.searchParams.get("dLat");
  const destLng = request.nextUrl.searchParams.get("dLng");

  if (!originLat || !originLng || !destLat || !destLng) {
    return NextResponse.json({ error: "Missing coordinates" }, { status: 400 });
  }

  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originLat},${originLng}&destination=${destLat},${destLng}&departure_time=now&traffic_model=best_guess&key=${KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  const leg = data.routes?.[0]?.legs?.[0];
  if (!leg) return NextResponse.json({ distanceKm: null, durationMin: null });

  return NextResponse.json({
    distanceKm: (leg.distance?.value || 0) / 1000,
    durationMin: Math.round((leg.duration_in_traffic?.value || leg.duration?.value || 0) / 60),
  });
}
