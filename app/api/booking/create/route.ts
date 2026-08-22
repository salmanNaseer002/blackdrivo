import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const {
    rideType,
    rawRideType,
    pickupAddress,
    pickupLat,
    pickupLng,
    dropoffAddress,
    dropoffLat,
    dropoffLng,
    pickupTime,
    hours,
    categoryId,
    categoryName,
    fare,
    baseFareSubtotal,
    taxAmount,
    addons,
    addonsTotal,
    tipAmount,
    promoCode,
    promoDiscount,
    distanceKm,
    durationMin,
    passengerId,
    passengerName,
    passengerEmail,
    passengerPhone,
    passengers,
    notes,
    countryCode,
    currency,
    paymentMethod,
    paymentTransferProof,
    forSomeoneElse,
    someoneTitle,
    someoneName,
    someoneEmail,
    someonePhone,
  } = body;

  if (!pickupAddress || !rideType || !fare || !passengerName || !passengerPhone) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Driver/vendor payout must match the exact logic PassApp/CapApp use at
  // booking time (see ActiveRideScreen.jsx's finalizeRideFare and Payment.js's
  // handleBook): the ride fare's `partner_rate`/`partner_rate_type` applies
  // ONLY to the base ride fare — each add-on can carry its OWN driver_share,
  // fetched fresh here (not trusted from the client) rather than blended
  // into one blanket rate, which previously left web bookings' driver_payout
  // at 0 with no partner_rate lookup at all.
  const baseSubtotal = Number(baseFareSubtotal) || 0;
  const addonList: { id: string; name: string; price: number }[] = addons && addons.length > 0 ? addons : [];

  let partnerRate = 0;
  let partnerType = "percent";
  if (categoryId) {
    // Same city-first matching as fetchPricedCategories() (lib/booking/pricing.ts)
    // used to price this ride — a city-specific category_pricing row can carry a
    // different partner_rate than the country-wide row, so picking "just the
    // first row ordered by city_code" silently used the wrong rate whenever a
    // city override existed, even though the customer's fare WAS priced off it.
    const { data: pricingRows } = await (supabase as any)
      .from("category_pricing")
      .select("partner_rate, partner_rate_type, city_code")
      .eq("category_id", categoryId)
      .eq("country_code", countryCode || "US")
      .order("city_code", { ascending: true, nullsFirst: true });
    const rows: { partner_rate: number; partner_rate_type: string; city_code: string | null }[] = pricingRows || [];
    const pricingRow =
      rows.find((r) => r.city_code && pickupAddress && pickupAddress.toLowerCase().includes(r.city_code.toLowerCase())) ||
      rows.find((r) => !r.city_code) ||
      rows[0];
    partnerRate = pricingRow?.partner_rate || 0;
    partnerType = pricingRow?.partner_rate_type || "percent";
  }

  let addonRecords: { id: string; price: number; driver_share: number; driver_share_type: string }[] = [];
  if (addonList.length > 0) {
    const { data: addonRows } = await (supabase as any)
      .from("booking_addons")
      .select("id, price, driver_share, driver_share_type")
      .in("id", addonList.map((a) => a.id));
    addonRecords = addonRows || [];
  }

  const baseDriverPayout = partnerType === "percent"
    ? Math.round(baseSubtotal * (partnerRate / 100) * 100) / 100
    : Math.min(partnerRate, baseSubtotal);
  const addonDriverPayout = addonList.reduce((sum, a) => {
    const rec = addonRecords.find((r) => r.id === a.id);
    const share = rec?.driver_share || 0;
    const shareType = rec?.driver_share_type || "percent";
    const price = a.price || 0;
    return sum + (shareType === "percent" ? Math.round(price * (share / 100) * 100) / 100 : Math.min(share, price));
  }, 0);
  const driverPayout = Math.round((baseDriverPayout + addonDriverPayout) * 100) / 100;

  // fare_estimate = base + add-ons, TAX EXCLUDED — matches PassApp's convention
  // (breakdown.base + addonSum). `fare` is the tax-included total.
  const fareEstimate = Math.round((baseSubtotal + (addonsTotal || 0)) * 100) / 100;

  const { data, error } = await (supabase as any)
    .from("bookings")
    .insert({
      ride_type: rawRideType || rideType,
      pickup_address: pickupAddress,
      pickup_lat: pickupLat || null,
      pickup_lng: pickupLng || null,
      dropoff_address: dropoffAddress || null,
      dropoff_lat: dropoffLat || null,
      dropoff_lng: dropoffLng || null,
      pickup_time: pickupTime || null,
      hours: hours || null,
      vehicle_category: categoryId || null,
      vehicle_class: categoryName || null,
      fare,
      fare_estimate: fareEstimate,
      tax_amount: taxAmount || 0,
      tip_amount: tipAmount || 0,
      promo_code: promoCode || null,
      promo_discount: promoDiscount || 0,
      // Store driver_share/driver_share_type alongside each add-on (not just
      // id/name/price) so anything reading addon_details later — CapApp's
      // ride-completion recompute, Admin — has the same shape PassApp writes.
      addon_details: addonList.length > 0
        ? addonList.map((a) => {
            const rec = addonRecords.find((r) => r.id === a.id);
            return { ...a, driver_share: rec?.driver_share || 0, driver_share_type: rec?.driver_share_type || "percent" };
          })
        : null,
      driver_payout: driverPayout,
      driver_payout_pct: partnerType === "percent" ? partnerRate : 0,
      distance_km: distanceKm || null,
      duration_min: durationMin ? String(durationMin) : null,
      passenger_id: passengerId || null,
      passenger_name: passengerName,
      passenger_email: passengerEmail || null,
      passenger_phone: passengerPhone,
      passengers: passengers || "1",
      notes: notes || null,
      payment_method: paymentMethod || "pending",
      payment_transfer_proof: paymentTransferProof || null,
      payment_transfer_status: paymentTransferProof ? "pending" : null,
      for_someone_else: !!forSomeoneElse,
      someone_title: someoneTitle || null,
      someone_name: someoneName || null,
      someone_email: someoneEmail || null,
      someone_phone: someonePhone || null,
      status: "pending",
      source: "web",
      country_code: countryCode || "US",
      currency: currency || "USD",
    })
    .select("id, booking_ref")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (promoCode) {
    await (supabase as any).rpc("increment_promo_usage", { p_code: promoCode }).catch(() => {});
  }

  return NextResponse.json({ id: data.id, bookingRef: data.booking_ref });
}
