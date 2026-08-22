"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Star, Download, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/lib/hooks/useUser";
import { useSiteCountry } from "@/components/providers/CountryProvider";
import { formatMoney, displayBookingId } from "@/lib/booking/money";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import RouteMap from "@/components/booking/RouteMap";

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending", dispatched: "Dispatched", on_the_way: "On The Way",
  arrived: "Arrived", active: "On Going", paused: "Paused",
  completed: "Completed", cancelled: "Cancelled",
};

function fmtDateTime(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleString(undefined, { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
function fmtTime(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}
function duration(start: string | null, end: string | null) {
  if (!start || !end) return null;
  const m = Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000);
  return m < 60 ? `${m} min` : `${Math.floor(m / 60)}h ${m % 60}m`;
}
const STAR_LABEL: Record<number, string> = { 1: "Very Bad", 2: "Bad", 3: "Could Be Better", 4: "Good", 5: "Excellent!" };

function RatingModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (stars: number, comment: string) => void }) {
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 sm:items-center" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-t-3xl bg-white p-6 sm:rounded-2xl">
        <h3 className="text-center text-lg font-bold text-gray-900">Rate your ride</h3>
        <div className="mt-5 flex justify-center gap-1.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} onClick={() => setStars(n)}>
              <Star className={`h-8 w-8 ${n <= stars ? "fill-gray-900 text-gray-900" : "text-gray-200"}`} />
            </button>
          ))}
        </div>
        {stars > 0 && <p className="mt-2 text-center text-sm font-semibold text-[#0b66d1]">{STAR_LABEL[stars]}</p>}
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a comment (optional)"
          className="mt-5 w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20"
          rows={3} />
        <button
          onClick={async () => { if (!stars) return; setSaving(true); await onSubmit(stars, comment); setSaving(false); }}
          disabled={!stars || saving}
          className="mt-4 w-full rounded-full bg-[#0b66d1] py-3 text-sm font-semibold text-white transition hover:bg-[#0952a8] disabled:opacity-40"
        >
          {saving ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : "Submit"}
        </button>
        <button onClick={onClose} className="mt-2 w-full py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Not now</button>
      </div>
    </div>
  );
}

export default function JourneyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { user, loading: userLoading } = useUser();
  const { country } = useSiteCountry();

  const [ride, setRide] = useState<any>(null);
  const [driver, setDriver] = useState<any>(null);
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showRate, setShowRate] = useState(false);

  useEffect(() => {
    if (userLoading) return;
    if (!user) { router.replace(`/login?redirect=/journey/${id}`); return; }

    const load = async () => {
      const supabase = createClient();
      // The URL uses the visible booking ref (e.g. "01186"), not the raw
      // UUID — old bookmarked links may still carry the UUID, so only try an
      // id lookup when the param actually looks like one (a malformed UUID
      // string thrown at a uuid-typed column errors instead of no-matching).
      const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      let b = null;
      if (UUID_RE.test(id)) {
        const { data } = await (supabase as any).from("bookings").select("*").eq("id", id).eq("passenger_id", user.id).maybeSingle();
        b = data;
      }
      if (!b) {
        const digits = String(id).replace(/\D/g, "");
        if (digits) {
          const { data } = await (supabase as any).from("bookings").select("*").eq("passenger_id", user.id).ilike("booking_ref", `%${digits}`).maybeSingle();
          b = data;
        }
      }
      if (!b) { setLoading(false); return; }
      setRide(b);
      if (b.driver_id) {
        const { data: d } = await (supabase as any).from("drivers").select("id, full_name, phone, driver_photo_url, rating").eq("id", b.driver_id).maybeSingle();
        setDriver(d);
        if (d) {
          const { data: v } = await (supabase as any).from("driver_vehicles").select("make, model, color, registration").eq("driver_id", d.id).eq("is_active", true).maybeSingle();
          setVehicle(v);
        }
      }
      setLoading(false);
    };
    load();
  }, [id, user, userLoading, router]);

  const submitRating = async (stars: number, comment: string) => {
    if (!ride) return;
    const supabase = createClient();
    await (supabase as any).from("bookings").update({
      passenger_rating: stars, rating_comment: comment, rated_at: new Date().toISOString(),
    }).eq("id", ride.id);
    setRide((r: any) => ({ ...r, passenger_rating: stars, rating_comment: comment }));
    setShowRate(false);
  };

  if (userLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#0b66d1]" />
      </div>
    );
  }

  if (!ride) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="mx-auto max-w-[1000px] px-4 sm:px-6 pt-40 text-center">
          <p className="text-sm text-gray-500">Ride not found.</p>
          <Link href="/journey" className="mt-3 inline-block text-sm font-semibold text-[#0b66d1]">Back to Journey</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const addons: any[] = Array.isArray(ride.addon_details) ? ride.addon_details : (() => { try { return JSON.parse(ride.addon_details || "[]"); } catch { return []; } })();
  const baseFare = ride.fare || 0;
  const addonTotal = addons.reduce((s, a) => s + (a?.price || 0), 0);
  const promoDisc = Number(ride.promo_discount || 0);
  const pointsDisc = Number(ride.points_discount || 0);
  const tipAmt = Number(ride.tip_amount || 0);
  const grandTotal = ride.fare_final || Math.max(0, baseFare + addonTotal - promoDisc - pointsDisc + tipAmt);
  const rideDur = duration(ride.ride_started_at, ride.ride_ended_at);

  const timeline = [
    { label: "Booking created", time: ride.created_at },
    { label: "Driver assigned", time: ride.driver_assigned_at },
    { label: "Driver on the way", time: ride.on_the_way_at },
    { label: "Driver arrived", time: ride.arrived_at },
    { label: "Ride started", time: ride.ride_started_at },
    { label: "Ride ended", time: ride.ride_ended_at },
  ].filter((i) => i.time);

  const tripRows = [
    { label: "Ride type", value: (ride.ride_type || "").replace(/_/g, " ") },
    { label: "Scheduled", value: ride.pickup_time ? fmtDateTime(ride.pickup_time) : null },
    { label: "Distance", value: ride.distance_km ? `${Number(ride.distance_km).toFixed(1)} km` : null },
    { label: "Duration", value: rideDur },
    { label: "Flight no.", value: ride.flight_number },
    { label: "Booked for", value: ride.for_someone_else && ride.someone_name ? `${ride.someone_name}${ride.someone_phone ? ` · ${ride.someone_phone}` : ""}` : null },
  ].filter((r) => r.value);

  const pickup = ride.pickup_lat ? { lat: Number(ride.pickup_lat), lng: Number(ride.pickup_lng), label: ride.pickup_address || "" } : null;
  const dropoff = ride.dropoff_lat ? { lat: Number(ride.dropoff_lat), lng: Number(ride.dropoff_lng), label: ride.dropoff_address || "" } : null;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="mx-auto max-w-[1000px] px-4 sm:px-6 pb-24 pt-32 md:px-6 md:pt-36 lg:px-8">
        <Link href="/journey" className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700">
          <ChevronLeft className="h-4 w-4" /> Journey
        </Link>

        <div className="mt-3 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{displayBookingId(ride.booking_ref)}</h1>
            <p className="mt-1 text-sm text-gray-500">{STATUS_LABEL[ride.status] || ride.status}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          {/* LEFT — map, route, driver, timeline */}
          <div>
            {pickup ? (
              <RouteMap pickup={pickup} dropoff={dropoff} />
            ) : (
              <div className="flex h-[280px] items-center justify-center rounded-3xl bg-gray-100 text-sm text-gray-400 sm:h-[360px]">
                No route data
              </div>
            )}

            <div className="mt-6">
              <div className="flex items-start gap-3">
                <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" />
                <p className="text-sm font-medium text-gray-900">{ride.pickup_address || "—"}</p>
              </div>
              {ride.dropoff_address && (
                <>
                  <div className="ml-[4px] my-1 h-3.5 w-px bg-gray-200" />
                  <div className="flex items-start gap-3">
                    <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-sm bg-gray-900" />
                    <p className="text-sm font-medium text-gray-900">{ride.dropoff_address}</p>
                  </div>
                </>
              )}
            </div>

            {driver && (
              <div className="mt-6 flex items-center gap-3 border-t border-gray-100 pt-6">
                {driver.driver_photo_url ? (
                  <img src={driver.driver_photo_url} alt={driver.full_name} className="h-12 w-12 rounded-full object-cover" />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-base font-bold text-gray-700">
                    {(driver.full_name || "D")[0].toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{driver.full_name}</p>
                  {vehicle && <p className="text-xs text-gray-500">{vehicle.color} {vehicle.make} {vehicle.model} · {vehicle.registration}</p>}
                </div>
                {driver.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-gray-900 text-gray-900" />
                    <span className="text-sm font-semibold text-gray-900">{Number(driver.rating).toFixed(1)}</span>
                  </div>
                )}
              </div>
            )}

            {timeline.length > 0 && (
              <div className="mt-8 border-t border-gray-100 pt-6">
                <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-400">Journey timeline</h2>
                {timeline.map((item, idx) => (
                  <div key={item.label} className="flex gap-3 pb-4 last:pb-0">
                    <div className="flex w-4 flex-col items-center">
                      <span className="h-2 w-2 shrink-0 rounded-full bg-[#0b66d1]" />
                      {idx < timeline.length - 1 && <span className="mt-1 w-px flex-1 bg-gray-200" />}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{item.label}</p>
                      <p className="text-sm font-semibold text-gray-900">{fmtTime(item.time)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — trip details, payment, rating, actions */}
          <div className="space-y-8">
            {tripRows.length > 0 && (
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wide text-gray-400">Trip details</h2>
                <div className="mt-4 divide-y divide-gray-100 border-t border-gray-100">
                  {tripRows.map((r) => (
                    <div key={r.label} className="flex items-center justify-between py-3">
                      <span className="text-sm text-gray-500">{r.label}</span>
                      <span className="text-sm font-medium capitalize text-gray-900">{r.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {grandTotal > 0 && (
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wide text-gray-400">Payment</h2>
                <div className="mt-4 divide-y divide-gray-100 border-t border-gray-100">
                  {baseFare > 0 && (
                    <div className="flex items-center justify-between py-3">
                      <span className="text-sm text-gray-500">Base fare</span>
                      <span className="text-sm font-medium text-gray-900">{formatMoney(baseFare, country.symbol, country.currency)}</span>
                    </div>
                  )}
                  {addons.map((a, i) => (
                    <div key={i} className="flex items-center justify-between py-3">
                      <span className="text-sm text-gray-500">{a.name || "Add-on"}</span>
                      <span className="text-sm font-medium text-gray-900">{a.price > 0 ? formatMoney(a.price, country.symbol, country.currency) : "Free"}</span>
                    </div>
                  ))}
                  {promoDisc > 0 && (
                    <div className="flex items-center justify-between py-3">
                      <span className="text-sm text-emerald-600">Promo {ride.promo_code ? `(${ride.promo_code})` : ""}</span>
                      <span className="text-sm font-medium text-emerald-600">-{formatMoney(promoDisc, country.symbol, country.currency)}</span>
                    </div>
                  )}
                  {pointsDisc > 0 && (
                    <div className="flex items-center justify-between py-3">
                      <span className="text-sm text-emerald-600">Points discount</span>
                      <span className="text-sm font-medium text-emerald-600">-{formatMoney(pointsDisc, country.symbol, country.currency)}</span>
                    </div>
                  )}
                  {tipAmt > 0 && (
                    <div className="flex items-center justify-between py-3">
                      <span className="text-sm text-gray-500">Driver tip</span>
                      <span className="text-sm font-medium text-gray-900">{formatMoney(tipAmt, country.symbol, country.currency)}</span>
                    </div>
                  )}
                  {ride.payment_method && (
                    <div className="flex items-center justify-between py-3">
                      <span className="text-sm text-gray-500">Payment</span>
                      <span className="text-sm font-medium capitalize text-gray-900">{ride.payment_method}</span>
                    </div>
                  )}
                </div>
                <div className="mt-2 flex items-center justify-between border-t border-gray-200 pt-3">
                  <span className="text-sm font-bold text-gray-900">Total paid</span>
                  <span className="text-lg font-extrabold text-gray-900">{formatMoney(grandTotal, country.symbol, country.currency)}</span>
                </div>
              </div>
            )}

            {ride.passenger_rating > 0 && (
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wide text-gray-400">Your rating</h2>
                <div className="mt-4 flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} className={`h-4 w-4 ${n <= ride.passenger_rating ? "fill-gray-900 text-gray-900" : "text-gray-200"}`} />
                  ))}
                  <span className="text-sm font-medium text-gray-500">{STAR_LABEL[ride.passenger_rating]}</span>
                </div>
                {ride.rating_comment && <p className="mt-2 text-sm italic text-gray-500">&ldquo;{ride.rating_comment}&rdquo;</p>}
              </div>
            )}

            {ride.dispute_status && (
              <div>
                <p className="text-sm font-bold text-red-500">Dispute — {ride.dispute_status === "open" ? "Under review" : ride.dispute_status}</p>
                {ride.dispute_reason && <p className="mt-1 text-sm text-red-500">{ride.dispute_reason}</p>}
              </div>
            )}

            {ride.status === "completed" && !ride.passenger_rating && (
              <button onClick={() => setShowRate(true)}
                className="w-full rounded-full bg-[#0b66d1] py-3 text-sm font-semibold text-white transition hover:bg-[#0952a8]">
                Rate this ride
              </button>
            )}
          </div>
        </div>
      </div>

      {showRate && <RatingModal onClose={() => setShowRate(false)} onSubmit={submitRating} />}
      <Footer />
    </div>
  );
}
