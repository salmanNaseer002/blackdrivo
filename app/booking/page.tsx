"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ArrowRight, Loader2, Car, Users, Briefcase, User, UserPlus, Check, Tag, X, Plus, LocateFixed } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import RouteMap from "@/components/booking/RouteMap";
import { autocompletePlaces, getRouteInfo, resolvePlaceCoords } from "@/lib/booking/places";
import { fetchPricedCategories } from "@/lib/booking/pricing";
import { fetchAddons, type Addon } from "@/lib/booking/addons";
import { createClient } from "@/lib/supabase/client";
import { useSiteCountry } from "@/components/providers/CountryProvider";
import { getEarliestBookableDate } from "@/lib/booking/timeSlots";
import { formatPhone } from "@/lib/booking/phone";
import { formatMoney, to12Hour } from "@/lib/booking/money";
import { applyPromoCode, type PromoResult } from "@/lib/booking/promo";
import type { PlaceResult, PricedCategory, RideType } from "@/lib/booking/types";

const WHATS_INCLUDED = [
  "Personal meet & greet ( Paid )",
  "Includes up to 15 minutes of free wait time",
  "Free to cancel up to 6 hours before pickup",
  "Complimentary tissues & sanitizing wipes",
];

const TIP_OPTIONS = [10, 20, 30, 50, 100];

type BookingType = RideType | "rental" | "corporate";

function AddressField({
  label, value, onChange, onSelect, placeholder, countryCode, showLocate,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onSelect: (coords: { lat: number; lng: number } | null) => void;
  placeholder: string;
  countryCode?: string;
  showLocate?: boolean;
}) {
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);

  const useCurrentLocation = () => {
    if (!navigator.geolocation) { toast.error("Location isn't available on this device"); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(`/api/places/geocode?lat=${latitude}&lng=${longitude}`);
          const data = await res.json();
          onChange(data.formattedAddress || `${latitude}, ${longitude}`);
        } catch {
          onChange(`${latitude}, ${longitude}`);
        }
        onSelect({ lat: latitude, lng: longitude });
        setLocating(false);
      },
      () => { toast.error("Couldn't get your location"); setLocating(false); },
      { timeout: 8000 }
    );
  };

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(async () => {
      setLoading(true);
      setResults(await autocompletePlaces(value, countryCode));
      setLoading(false);
    }, 200);
    return () => clearTimeout(t);
  }, [value, open, countryCode]);

  const handleSelect = async (r: PlaceResult) => {
    onChange(r.full);
    setOpen(false);
    setResolvingId(r.placeId);
    const coords = await resolvePlaceCoords(r.placeId);
    setResolvingId(null);
    onSelect(coords);
  };

  return (
    <div className="relative">
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</label>
      <div className="relative">
        {showLocate ? (
          <button
            type="button"
            onClick={useCurrentLocation}
            disabled={locating}
            title="Use current location"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0b66d1] transition hover:text-[#0952a8] disabled:opacity-60"
          >
            {locating ? <Loader2 className="h-4 w-4 animate-spin" /> : <LocateFixed className="h-4 w-4" />}
          </button>
        ) : (
          <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0b66d1]" />
        )}
        <input
          value={value}
          onChange={(e) => { onChange(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20"
        />
      </div>
      {open && (loading || results.length > 0) && (
        <div className="absolute z-[200] mt-2 w-full rounded-2xl border border-gray-100 bg-white p-2 shadow-2xl">
          {loading ? (
            <div className="flex items-center gap-2 px-4 py-3 text-xs text-gray-400">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Searching...
            </div>
          ) : (
            results.map((r) => (
              <button
                key={r.placeId}
                type="button"
                onMouseDown={() => handleSelect(r)}
                className="flex w-full items-start gap-2.5 rounded-xl px-3 py-2.5 text-left transition hover:bg-blue-50"
              >
                {resolvingId === r.placeId ? (
                  <Loader2 className="mt-0.5 h-3.5 w-3.5 shrink-0 animate-spin text-gray-400" />
                ) : (
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">{r.short}</p>
                  <p className="text-xs text-gray-400">{r.full}</p>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function BookingFlow() {
  const params = useSearchParams();
  const router = useRouter();
  const { country: contextCountry, countries: siteCountries } = useSiteCountry();

  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);
  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => setIsSignedIn(!!data.user));
  }, []);

  const [rideType, setRideType] = useState<BookingType>((params.get("type") as BookingType) || "one_way");
  const [pickup, setPickup] = useState(params.get("pickup") || "");
  const [pickupCoords, setPickupCoords] = useState<{ lat: number; lng: number } | null>(
    params.get("pLat") ? { lat: Number(params.get("pLat")), lng: Number(params.get("pLng")) } : null
  );
  const [dropoff, setDropoff] = useState(params.get("dropoff") || "");
  const [dropoffCoords, setDropoffCoords] = useState<{ lat: number; lng: number } | null>(
    params.get("dLat") ? { lat: Number(params.get("dLat")), lng: Number(params.get("dLng")) } : null
  );
  const [date, setDate] = useState(params.get("date") || getEarliestBookableDate());
  const [time, setTime] = useState(params.get("time") || "");
  const [hours, setHours] = useState(params.get("hours") || "2");
  const [days, setDays] = useState(params.get("days") || "1");
  const countryCode = params.get("country") || contextCountry.code;
  const country = siteCountries.find((c) => c.code === countryCode) || contextCountry;

  const hasDropoff = rideType === "one_way" || rideType === "city_to_city" || rideType === "corporate";

  // The standalone "Plan your trip" step was removed — trip details are
  // only collected on the home widget now. Land here without them, bounce
  // straight back to home so booking always starts from the widget.
  useEffect(() => {
    if (!pickupCoords || !date || !time) router.replace("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [routeInfo, setRouteInfo] = useState<{ distanceKm: number; durationMin: number } | null>(null);
  const [categories, setCategories] = useState<PricedCategory[]>([]);
  const [loadingCats, setLoadingCats] = useState(false);
  const [selectedCat, setSelectedCat] = useState<PricedCategory | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [bookingFor, setBookingFor] = useState<"myself" | "someone">("myself");
  const [showSomeoneModal, setShowSomeoneModal] = useState(false);
  const [someoneTitle, setSomeoneTitle] = useState("Mr");
  const [someoneName, setSomeoneName] = useState("");
  const [someoneEmail, setSomeoneEmail] = useState("");
  const [someonePhone, setSomeonePhone] = useState("");

  const [tipId, setTipId] = useState<number | "custom" | null>(null);
  const [customTip, setCustomTip] = useState("");
  const [promoInput, setPromoInput] = useState("");
  const [promoResult, setPromoResult] = useState<PromoResult | null>(null);
  const [promoError, setPromoError] = useState("");
  const [applyingPromo, setApplyingPromo] = useState(false);

  const [addons, setAddons] = useState<Addon[]>([]);
  const [loadingAddons, setLoadingAddons] = useState(false);
  const [selectedAddonIds, setSelectedAddonIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!selectedCat) { setAddons([]); return; }
    setLoadingAddons(true);
    fetchAddons(selectedCat.category.id, countryCode)
      .then(setAddons)
      .finally(() => setLoadingAddons(false));
    setSelectedAddonIds(new Set());
  }, [selectedCat?.category.id, countryCode]);

  const toggleAddon = (id: string) => {
    setSelectedAddonIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const baseFare = selectedCat?.price || 0;
  const addonsTotal = addons.filter((a) => selectedAddonIds.has(a.id)).reduce((s, a) => s + a.price, 0);
  // Tax applies to add-ons too, not just the base fare (matches PassApp's
  // Payment.js, which recomputes tax on base+addons rather than reusing the
  // category's own pre-addon tax estimate) — add the extra tax on top of
  // the category price (which already includes the base-only tax).
  const addonTax = selectedCat && addonsTotal > 0
    ? Math.round(addonsTotal * (selectedCat.breakdown.taxPercent / 100) * 100) / 100
    : 0;
  const totalTax = (selectedCat?.breakdown.tax || 0) + addonTax;
  const tipAmount = tipId === "custom" ? Number(customTip) || 0 : typeof tipId === "number" ? tipId : 0;
  const promoDiscount = promoResult?.discountAmount || 0;
  const totalFare = Math.max(0, Math.round((baseFare + addonTax + addonsTotal + tipAmount - promoDiscount) * 100) / 100);

  const handleApplyPromo = async () => {
    if (!promoInput.trim() || !selectedCat) return;
    setApplyingPromo(true);
    setPromoError("");
    const { result, error } = await applyPromoCode(promoInput, baseFare, selectedCat.category.id, country.symbol, country.currency);
    if (error) { setPromoError(error); setPromoResult(null); }
    else { setPromoResult(result); toast.success(`Promo applied — ${formatMoney(result!.discountAmount, country.symbol, country.currency)} off`); }
    setApplyingPromo(false);
  };

  const loadVehicles = async () => {
    try {
      let distanceKm = 0;
      if (hasDropoff && pickupCoords && dropoffCoords) {
        const info = await getRouteInfo(pickupCoords, dropoffCoords);
        setRouteInfo(info);
        distanceKm = info?.distanceKm || 0;
      }
      setLoadingCats(true);
      const priced = await fetchPricedCategories({
        rideType,
        countryCode,
        distanceKm,
        hours: rideType === "hourly" ? Number(hours) : rideType === "rental" ? Number(days) : undefined,
        fromCity: pickup,
        toCity: dropoff,
        pickupCity: pickup,
      });
      setCategories(priced);
      if (priced.length > 0) setSelectedCat(priced[0]);
    } catch (e: any) {
      toast.error(e.message || "Failed to load vehicle options.");
    } finally {
      setLoadingCats(false);
    }
  };

  useEffect(() => {
    if (pickupCoords) loadVehicles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-recalculate the map + fare whenever the inline pickup/drop-off is
  // re-picked, debounced so it doesn't fire on every keystroke.
  useEffect(() => {
    if (!pickupCoords) return;
    const t = setTimeout(() => loadVehicles(), 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickupCoords, dropoffCoords]);

  const pickupTimeLabel = time ? to12Hour(time) : undefined;
  const dropoffTimeLabel = routeInfo ? computeArrival(time, routeInfo.durationMin) : undefined;

  // Memoized so RouteMap's props only change when the underlying values
  // actually change — otherwise every keystroke anywhere on the page (e.g.
  // typing in the "Book for someone" modal) creates new object references,
  // forcing the whole Google Map (markers/InfoWindows) to rebuild and
  // stealing focus from whatever input was being typed into.
  const mapPickup = useMemo(
    () => (pickupCoords ? { ...pickupCoords, label: pickup, time: pickupTimeLabel } : null),
    [pickupCoords, pickup, pickupTimeLabel]
  );
  const mapDropoff = useMemo(
    () => (hasDropoff && dropoffCoords ? { ...dropoffCoords, label: dropoff, time: dropoffTimeLabel } : null),
    [hasDropoff, dropoffCoords, dropoff, dropoffTimeLabel]
  );

  const handleReview = async () => {
    if (!selectedCat) { toast.error("Please select a vehicle"); return; }
    if (bookingFor === "someone") {
      if (!someoneName.trim()) { toast.error("Please enter the guest's name"); return; }
      if (!someonePhone.trim()) { toast.error("Please enter the guest's contact number"); return; }
    }
    setSubmitting(true);
    try {

    const pickupTimeIso = date && time ? new Date(`${date}T${time}:00`).toISOString() : null;
    const draft = {
      rideType,
      pickup, pickupCoords,
      dropoff: hasDropoff ? dropoff : null, dropoffCoords: hasDropoff ? dropoffCoords : null,
      pickupTimeIso, date, time,
      hours: rideType === "hourly" ? Number(hours) : null,
      days: rideType === "rental" ? Number(days) : null,
      categoryId: selectedCat.category.id,
      categoryName: selectedCat.category.name,
      fare: totalFare,
      fareBreakdown: { subtotal: selectedCat.breakdown.subtotal, tax: totalTax },
      baseFare,
      addons: addons.filter((a) => selectedAddonIds.has(a.id)).map((a) => ({ id: a.id, name: a.name, price: a.price })),
      addonsTotal,
      tipAmount,
      promoCode: promoResult?.code || null,
      promoDiscount,
      distanceKm: routeInfo?.distanceKm,
      durationMin: routeInfo?.durationMin,
      countryCode,
      bookingFor,
      someone: bookingFor === "someone" ? { title: someoneTitle, name: someoneName, email: someoneEmail, phone: someonePhone } : null,
    };
    sessionStorage.setItem("bd_booking_draft", JSON.stringify(draft));

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login?redirect=/booking/review");
    } else {
      router.push("/booking/review");
    }
    } catch (e: any) {
      toast.error(e.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Native `position: sticky` only gets "room" to freeze while its own
  // containing block (the grid row) is taller than itself — which fails
  // whenever the map+summary panel is naturally taller than the left
  // vehicle list. Rather than reimplement scroll physics by hand (fragile —
  // caused the panel to render behind the Navbar), just give the LEFT
  // column invisible bottom padding equal to the height difference, so the
  // grid row is always at least as tall as the right panel. That gives
  // sticky real room to freeze, and it naturally un-sticks exactly at the
  // row's bottom edge — right before the Footer, never overlapping it.
  const leftColRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const extraLeftHeightRef = useRef(0);
  const [extraLeftHeight, setExtraLeftHeight] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (!leftColRef.current || !panelRef.current || window.innerWidth < 768) { setExtraLeftHeight(0); return; }
      // Subtract the reserved padding itself before comparing, otherwise
      // each pass would compound the previous pass's own padding into leftH.
      const leftH = leftColRef.current.getBoundingClientRect().height - extraLeftHeightRef.current;
      const rightH = panelRef.current.getBoundingClientRect().height;
      const next = Math.max(0, Math.round(rightH - leftH));
      extraLeftHeightRef.current = next;
      setExtraLeftHeight(next);
    };
    const ro = new ResizeObserver(() => measure());
    if (leftColRef.current) ro.observe(leftColRef.current);
    if (panelRef.current) ro.observe(panelRef.current);
    measure();
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [categories.length, selectedCat, addons.length]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="mx-auto max-w-[1600px] px-4 pb-20 pt-32 md:px-6 md:pt-36 lg:px-8">
        <div className="grid gap-8 md:grid-cols-[1.05fr_0.95fr] md:items-start">
          {/* LEFT — flow (bottom padding reserves room for sticky, see extraLeftHeight above) */}
          <div ref={leftColRef} style={extraLeftHeight ? { paddingBottom: extraLeftHeight } : undefined}>
            <AnimatePresence mode="wait">
              {pickupCoords && (
                <motion.div key="s2" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
                  {/* Compact trip editor */}
                  <div className="mb-5 flex items-center gap-4">
                    <button onClick={() => router.push("/")} className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900">
                      ← Edit trip
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">Choose your experience</h1>
                  </div>

                  <div className="mb-5 rounded-2xl bg-white p-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <AddressField
                        label="Pickup"
                        value={pickup}
                        onChange={setPickup}
                        onSelect={setPickupCoords} countryCode={countryCode}
                        placeholder="Address, airport, hotel..."
                        showLocate
                      />
                      {hasDropoff && (
                        <AddressField
                          label={rideType === "city_to_city" ? "Destination city" : "Drop-off"}
                          value={dropoff}
                          onChange={setDropoff}
                          onSelect={setDropoffCoords} countryCode={countryCode}
                          placeholder="Address, airport, hotel..."
                        />
                      )}
                    </div>
                  </div>

                  {loadingCats ? (
                    <div className="flex items-center justify-center rounded-3xl bg-white py-24">
                      <Loader2 className="h-6 w-6 animate-spin text-[#0b66d1]" />
                    </div>
                  ) : categories.length === 0 ? (
                    <div className="rounded-3xl bg-white p-10 text-center text-sm text-gray-500">
                      No vehicle pricing available for this trip yet. Please call us at{" "}
                      <a href="tel:+18005550199" className="font-semibold text-[#0b66d1]">1 (800) 555-0199</a>.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                      {categories.map((pc) => {
                        const active = selectedCat?.category.id === pc.category.id;
                        return (
                          <button
                            key={pc.category.id}
                            onClick={() => setSelectedCat(pc)}
                            className={`group overflow-hidden rounded-2xl border-2 bg-white text-left transition hover:-translate-y-0.5 ${
                              active ? "border-[#0b66d1] bg-blue-50/30" : "border-transparent hover:bg-gray-50"
                            }`}
                          >
                            <div className="relative h-40 w-full overflow-hidden bg-gray-100 sm:h-48">
                              {pc.category.image_url ? (
                                <Image
                                  src={pc.category.image_url}
                                  alt={pc.category.name}
                                  fill
                                  className="object-cover transition duration-500 group-hover:scale-110"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center"><Car className="h-8 w-8 text-gray-300" /></div>
                              )}
                              {active && (
                                <div className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#0b66d1]">
                                  <Check className="h-3.5 w-3.5 text-white" />
                                </div>
                              )}
                            </div>
                            <div className="p-3">
                              <p className="text-sm font-semibold text-gray-900">{pc.category.name}</p>
                              <p className="text-sm font-bold text-[#0b66d1]">{formatMoney(pc.price, country.symbol, country.currency)}</p>
                              <div className="mt-1.5 flex items-center gap-3 text-[11px] text-gray-400">
                                <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {pc.category.max_pax || "—"}</span>
                                <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" /> {pc.category.max_luggage || "—"}</span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Selected vehicle detail */}
                  {selectedCat && (
                    <motion.div
                      key={selectedCat.category.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-5 rounded-2xl bg-gray-50 p-5"
                    >
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">What's included</p>
                      <ul className="space-y-1.5">
                        {WHATS_INCLUDED.map((inc) => (
                          <li key={inc} className="flex items-start gap-2 text-xs text-gray-600">
                            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0b66d1]" /> {inc}
                          </li>
                        ))}
                      </ul>

                      {/* Add-ons */}
                      {!loadingAddons && addons.length > 0 && (
                        <div className="mt-5 border-t border-gray-200 pt-5">
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Add-ons</p>
                          <div className="flex flex-wrap gap-2">
                            {addons.map((a) => {
                              const checked = selectedAddonIds.has(a.id);
                              return (
                                <button
                                  key={a.id}
                                  onClick={() => toggleAddon(a.id)}
                                  title={a.description || undefined}
                                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                                    checked ? "bg-[#0b66d1] text-white" : "bg-white text-gray-600 hover:bg-gray-100"
                                  }`}
                                >
                                  {checked ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                                  {a.name} &middot; {formatMoney(a.price, country.symbol, country.currency)}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT — map + price breakdown + booking */}
          <div ref={panelRef} className="mt-8 md:sticky md:top-32 md:mt-0">
            <RouteMap
              pickup={mapPickup}
              dropoff={mapDropoff}
            />

            {selectedCat && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-3xl bg-gray-50 p-6">
                {/* Price breakdown */}
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Price breakdown</p>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">{selectedCat.category.name}</span>
                    <span className="text-gray-900">{formatMoney(selectedCat.breakdown.subtotal, country.symbol, country.currency)}</span>
                  </div>
                  {totalTax > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Tax</span>
                      <span className="text-gray-900">{formatMoney(totalTax, country.symbol, country.currency)}</span>
                    </div>
                  )}
                  {addonsTotal > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Add-ons</span>
                      <span className="text-gray-900">{formatMoney(addonsTotal, country.symbol, country.currency)}</span>
                    </div>
                  )}
                  {tipAmount > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Tip</span>
                      <span className="text-gray-900">{formatMoney(tipAmount, country.symbol, country.currency)}</span>
                    </div>
                  )}
                  {promoDiscount > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Promo ({promoResult?.code})</span>
                      <span className="text-emerald-600">-{formatMoney(promoDiscount, country.symbol, country.currency)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between border-t border-gray-200 pt-2 text-base font-semibold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-[#0b66d1]">{formatMoney(totalFare, country.symbol, country.currency)}</span>
                  </div>
                </div>

                {/* Tip */}
                <div className="mt-5 border-t border-gray-200 pt-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Add a tip</p>
                  <div className="flex flex-wrap gap-2">
                    {TIP_OPTIONS.map((amt) => (
                      <button
                        key={amt}
                        onClick={() => { setTipId(tipId === amt ? null : amt); setCustomTip(""); }}
                        className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                          tipId === amt ? "bg-[#0b66d1] text-white" : "bg-white text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {formatMoney(amt, country.symbol, country.currency)}
                      </button>
                    ))}
                    <input
                      value={customTip}
                      onChange={(e) => {
                        const v = e.target.value.replace(/[^0-9.]/g, "");
                        setCustomTip(v);
                        setTipId(v ? "custom" : null);
                      }}
                      placeholder="Custom"
                      className={`w-20 rounded-full px-3.5 py-1.5 text-xs font-medium outline-none transition ${
                        tipId === "custom" ? "bg-[#0b66d1] text-white placeholder-white/60" : "bg-white text-gray-600"
                      }`}
                    />
                  </div>
                </div>

                {/* Promo code */}
                <div className="mt-5 border-t border-gray-200 pt-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Promo code</p>
                  {promoResult ? (
                    <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-3.5 py-2.5">
                      <span className="flex items-center gap-2 text-sm font-medium text-emerald-700">
                        <Tag className="h-3.5 w-3.5" /> {promoResult.code} applied
                      </span>
                      <button onClick={() => { setPromoResult(null); setPromoInput(""); }} className="text-emerald-700 hover:text-emerald-900">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        value={promoInput}
                        onChange={(e) => { setPromoInput(e.target.value.toUpperCase()); setPromoError(""); }}
                        placeholder="Enter code"
                        className="flex-1 rounded-xl bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#0b66d1]/20"
                      />
                      <button
                        onClick={handleApplyPromo}
                        disabled={applyingPromo || !promoInput.trim()}
                        className="rounded-xl bg-gray-900 px-4 text-sm font-semibold text-white transition hover:bg-gray-700 disabled:opacity-50"
                      >
                        {applyingPromo ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
                      </button>
                    </div>
                  )}
                  {promoError && <p className="mt-1.5 text-xs text-red-500">{promoError}</p>}
                </div>

                {/* Book for myself / someone */}
                <div className="mt-5 flex items-center gap-5 border-t border-gray-200 pt-5">
                  <button
                    onClick={() => setBookingFor("myself")}
                    className="flex items-center gap-1.5 border-b-2 pb-1 text-xs font-semibold transition"
                    style={{ borderColor: bookingFor === "myself" ? "#0b66d1" : "transparent", color: bookingFor === "myself" ? "#0b66d1" : "#6b7280" }}
                  >
                    <User className="h-3.5 w-3.5" /> Book for myself
                  </button>
                  <button
                    onClick={() => setShowSomeoneModal(true)}
                    className="flex items-center gap-1.5 border-b-2 pb-1 text-xs font-semibold transition"
                    style={{ borderColor: bookingFor === "someone" ? "#0b66d1" : "transparent", color: bookingFor === "someone" ? "#0b66d1" : "#6b7280" }}
                  >
                    <UserPlus className="h-3.5 w-3.5" /> Book for someone
                  </button>
                </div>

                {bookingFor === "someone" && someoneName && (
                  <p className="mt-3 rounded-xl bg-blue-50 px-3.5 py-2.5 text-xs text-[#0b66d1]">
                    Booking for {someoneTitle} {someoneName} &middot; {someonePhone}
                  </p>
                )}

                {isSignedIn === false && (
                  <p className="mt-3 text-center text-xs text-gray-500">
                    You'll need an account to book —{" "}
                    <Link href="/login?redirect=/booking/review" className="font-semibold text-[#0b66d1] hover:text-[#0952a8]">Sign in</Link>
                    {" "}or{" "}
                    <Link href="/signup?redirect=/booking/review" className="font-semibold text-[#0b66d1] hover:text-[#0952a8]">create an account</Link>
                  </p>
                )}

                <button
                  onClick={handleReview}
                  disabled={submitting}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#0b66d1] py-3.5 text-sm font-semibold text-white transition hover:bg-[#0952a8] disabled:opacity-60"
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Review & Payment <ArrowRight className="h-4 w-4" /></>}
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <Footer />

      {/* Book for someone — modal, does not close on outside click */}
      <AnimatePresence>
        {showSomeoneModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.97 }}
              className="w-full max-w-sm rounded-3xl bg-white p-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Book for someone</h3>
                <button onClick={() => setShowSomeoneModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-5 space-y-3">
                <div className="grid grid-cols-[80px_1fr] gap-2">
                  <select value={someoneTitle} onChange={(e) => setSomeoneTitle(e.target.value)}
                    className="rounded-xl bg-gray-50 px-2 py-2.5 text-xs text-gray-900 outline-none focus:ring-2 focus:ring-[#0b66d1]/20">
                    {["Mr", "Mrs", "Ms", "Dr"].map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <input value={someoneName} onChange={(e) => setSomeoneName(e.target.value)} placeholder="Guest name"
                    className="rounded-xl bg-gray-50 px-3 py-2.5 text-xs text-gray-900 outline-none focus:ring-2 focus:ring-[#0b66d1]/20" />
                </div>
                <input value={someoneEmail} onChange={(e) => setSomeoneEmail(e.target.value)} placeholder="Guest email" type="email"
                  className="w-full rounded-xl bg-gray-50 px-3 py-2.5 text-xs text-gray-900 outline-none focus:ring-2 focus:ring-[#0b66d1]/20" />
                <input
                  value={someonePhone}
                  onChange={(e) => setSomeonePhone(formatPhone(e.target.value, countryCode))}
                  placeholder="Guest contact number"
                  className="w-full rounded-xl bg-gray-50 px-3 py-2.5 text-xs text-gray-900 outline-none focus:ring-2 focus:ring-[#0b66d1]/20"
                />
              </div>
              <button
                onClick={() => {
                  if (!someoneName.trim() || !someonePhone.trim()) { toast.error("Please enter the guest's name and phone number"); return; }
                  setBookingFor("someone");
                  setShowSomeoneModal(false);
                }}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#0b66d1] py-3 text-sm font-semibold text-white transition hover:bg-[#0952a8]"
              >
                Save guest details
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function computeArrival(time: string, durationMin: number): string | undefined {
  if (!time) return undefined;
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + durationMin;
  const ah = Math.floor(total / 60) % 24;
  const am = total % 60;
  const period = ah >= 12 ? "PM" : "AM";
  const hh = ah % 12 === 0 ? 12 : ah % 12;
  return `${hh}:${String(am).padStart(2, "0")} ${period}`;
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-[#0b66d1]" /></div>}>
      <BookingFlow />
    </Suspense>
  );
}
