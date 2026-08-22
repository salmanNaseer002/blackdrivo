import { NextRequest, NextResponse } from "next/server";

const KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

export async function GET(request: NextRequest) {
  const lat = request.nextUrl.searchParams.get("lat");
  const lng = request.nextUrl.searchParams.get("lng");
  if (!lat || !lng) return NextResponse.json({ error: "Missing coordinates" }, { status: 400 });

  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  const result = data.results?.[0];
  const countryComp = (result?.address_components || []).find((c: any) => c.types?.includes("country"));

  return NextResponse.json({
    countryCode: countryComp?.short_name || null,
    countryName: countryComp?.long_name || null,
    formattedAddress: result?.formatted_address || null,
  });
}
