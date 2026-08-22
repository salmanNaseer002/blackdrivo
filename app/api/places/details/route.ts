import { NextRequest, NextResponse } from "next/server";

const KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

export async function GET(request: NextRequest) {
  const placeId = request.nextUrl.searchParams.get("placeId");
  if (!placeId) return NextResponse.json({ error: "Missing placeId" }, { status: 400 });

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry&key=${KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  const loc = data.result?.geometry?.location;
  if (!loc) return NextResponse.json({ lat: null, lng: null });

  return NextResponse.json({ lat: loc.lat, lng: loc.lng });
}
