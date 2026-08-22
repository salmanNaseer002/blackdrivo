"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Loader2, ArrowLeft, CreditCard, Landmark, Banknote, MapPin, Calendar, Car, UploadCloud, X } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import RouteMap from "@/components/booking/RouteMap";
import { createClient } from "@/lib/supabase/client";
import { useSiteCountry } from "@/components/providers/CountryProvider";
import { formatMoney, to12Hour, displayBookingId } from "@/lib/booking/money";

interface BookingDraft {
  rideType: string;
  pickup: string;
  pickupCoords: { lat: number; lng: number } | null;
  dropoff: string | null;
  dropoffCoords: { lat: number; lng: number } | null;
  pickupTimeIso: string | null;
  date: string;
  time: string;
  hours: number | null;
  days: number | null;
  categoryId: string;
  categoryName: string;
  fare: number;
  fareBreakdown?: { subtotal: number; tax: number };
  baseFare?: number;
  addons?: { id: string; name: string; price: number }[];
  addonsTotal?: number;
  tipAmount?: number;
  promoCode?: string | null;
  promoDiscount?: number;
  distanceKm?: number;
  durationMin?: number;
  countryCode: string;
  bookingFor: "myself" | "someone";
  someone: { title: string; name: string; email: string; phone: string } | null;
}

const TYPE_LABELS: Record<string, string> = {
  one_way: "One Way", hourly: "By the Hour", city_to_city: "City to City",
  rental: "Rental", corporate: "Corporate",
};

const PAYMENT_OPTIONS: Record<string, { label: string; icon: any }> = {
  card: { label: "Card", icon: CreditCard },
  online_transfer: { label: "Transfer", icon: Landmark },
  cash: { label: "Cash", icon: Banknote },
};

export default function BookingReviewPage() {
  const router = useRouter();
  const { country: contextCountry, countries: siteCountries } = useSiteCountry();
  const [draft, setDraft] = useState<BookingDraft | null>(null);
  const country = draft ? siteCountries.find((c) => c.code === draft.countryCode) || contextCountry : contextCountry;
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const [passengerName, setPassengerName] = useState("");
  const [passengerEmail, setPassengerEmail] = useState("");
  const [passengerPhone, setPassengerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [saveCard, setSaveCard] = useState(true);
  const [transferProof, setTransferProof] = useState<string | null>(null);
  const [uploadingProof, setUploadingProof] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookingRef, setBookingRef] = useState<string | null>(null);

  // Memoized so RouteMap's props don't get new object references on every
  // keystroke (card fields, notes) — otherwise the whole map rebuilds and
  // steals focus from the field being typed into.
  const mapPickup = useMemo(
    () => (draft?.pickupCoords ? { ...draft.pickupCoords, label: draft.pickup } : null),
    [draft?.pickupCoords, draft?.pickup]
  );
  const mapDropoff = useMemo(
    () => (draft?.dropoffCoords ? { ...draft.dropoffCoords, label: draft.dropoff || "" } : null),
    [draft?.dropoffCoords, draft?.dropoff]
  );

  // Native `position: sticky` only gets "room" to freeze while its own
  // containing block (the grid row) is taller than itself — which fails
  // whenever the map+summary panel is naturally taller than the left
  // payment column. Rather than reimplement scroll physics by hand
  // (fragile — caused the panel to render behind the Navbar), just give
  // the LEFT column invisible bottom padding equal to the height
  // difference, so the grid row is always at least as tall as the right
  // panel. That gives sticky real room to freeze, and it naturally
  // un-sticks exactly at the row's bottom edge — right before the Footer.
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
  }, [draft]);

  useEffect(() => {
    const raw = sessionStorage.getItem("bd_booking_draft");
    if (!raw) { router.replace("/booking"); return; }
    const parsed: BookingDraft = JSON.parse(raw);
    setDraft(parsed);

    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/login?redirect=/booking/review"); return; }

      if (parsed.bookingFor === "someone" && parsed.someone) {
        setPassengerName(parsed.someone.name);
        setPassengerEmail(parsed.someone.email);
        setPassengerPhone(parsed.someone.phone);
      } else {
        setPassengerEmail(user.email || "");
        // `passengers` (not `users`) is the real profile table — bookings.passenger_id
        // foreign-keys to it. A profile row may still be missing/incomplete for
        // older accounts, so these fields stay editable below as a safety net.
        const { data: profile } = await (supabase as any).from("passengers").select("name,phone").eq("id", user.id).maybeSingle();
        setPassengerName(profile?.name || "");
        setPassengerPhone(profile?.phone || "");
      }

      const { data: countryRow } = await (supabase as any)
        .from("countries_config").select("payment_methods").eq("code", parsed.countryCode).maybeSingle();
      const methods: string[] = countryRow?.payment_methods || ["card"];
      setPaymentMethods(methods);
      setSelectedPayment(methods[0] || "card");
    };
    load();
  }, [router]);

  const handleProofUpload = async (file: File) => {
    setUploadingProof(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const fileName = `transfer-proofs/${user?.id || "guest"}-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("app-assets").upload(fileName, file, { upsert: true, contentType: file.type });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("app-assets").getPublicUrl(fileName);
      setTransferProof(data.publicUrl);
    } catch (e: any) {
      toast.error(e.message || "Screenshot upload failed. Please try again.");
    }
    setUploadingProof(false);
  };

  const submit = async () => {
    if (!draft) return;
    if (!passengerName.trim() || !passengerPhone.trim()) {
      toast.error("Passenger details are missing — please go back and try again.");
      return;
    }
    if (selectedPayment === "card") {
      if (!cardName.trim() || !cardNumber.trim() || !cardExpiry.trim() || !cardCvv.trim()) {
        toast.error("Please complete your card details");
        return;
      }
    }
    if (selectedPayment === "online_transfer" && !transferProof) {
      toast.error("Please upload a screenshot of your transfer");
      return;
    }
    setSubmitting(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (selectedPayment === "card" && saveCard && user) {
        await (supabase as any).from("cards").insert({
          passenger_id: user.id,
          cardholder_name: cardName,
          card_number: cardNumber.replace(/\s/g, "").slice(-4).padStart(cardNumber.replace(/\s/g, "").length, "•"),
          expiry: cardExpiry,
          card_type: "card",
        });
      }

      const res = await fetch("/api/booking/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rideType: draft.rideType === "rental" || draft.rideType === "corporate" ? "one_way" : draft.rideType,
          rawRideType: draft.rideType,
          pickupAddress: draft.pickup,
          pickupLat: draft.pickupCoords?.lat,
          pickupLng: draft.pickupCoords?.lng,
          dropoffAddress: draft.dropoff,
          dropoffLat: draft.dropoffCoords?.lat,
          dropoffLng: draft.dropoffCoords?.lng,
          pickupTime: draft.pickupTimeIso,
          hours: draft.hours,
          categoryId: draft.categoryId,
          categoryName: draft.categoryName,
          fare: draft.fare,
          baseFareSubtotal: draft.fareBreakdown?.subtotal ?? draft.baseFare ?? draft.fare,
          taxAmount: draft.fareBreakdown?.tax ?? 0,
          addons: draft.addons || [],
          addonsTotal: draft.addonsTotal || 0,
          tipAmount: draft.tipAmount || 0,
          promoCode: draft.promoCode || null,
          promoDiscount: draft.promoDiscount || 0,
          distanceKm: draft.distanceKm,
          durationMin: draft.durationMin,
          passengerId: user?.id,
          passengerName,
          passengerEmail,
          passengerPhone,
          passengers: "1",
          notes: notes || null,
          paymentMethod: selectedPayment,
          paymentTransferProof: selectedPayment === "online_transfer" ? transferProof : null,
          forSomeoneElse: draft.bookingFor === "someone",
          someoneTitle: draft.someone?.title,
          someoneName: draft.someone?.name,
          someoneEmail: draft.someone?.email,
          someonePhone: draft.someone?.phone,
          countryCode: draft.countryCode,
          currency: country.currency,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create booking");
      setBookingRef(data.bookingRef);
      sessionStorage.removeItem("bd_booking_draft");
    } catch (e: any) {
      toast.error(e.message || "Something went wrong. Please call us instead.");
    }
    setSubmitting(false);
  };

  if (!draft) {
    return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-[#0b66d1]" /></div>;
  }

  if (bookingRef) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="mx-auto max-w-xl px-4 pb-24 pt-28 md:px-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
              <Check className="h-8 w-8 text-[#0b66d1]" />
            </div>
            <h1 className="mt-5 text-2xl font-bold text-gray-900">Booking confirmed!</h1>
            <p className="mt-2 text-sm text-gray-500">Booking ID <span className="font-semibold text-gray-900">{displayBookingId(bookingRef)}</span></p>
            <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-gray-500">
              Our team will call {passengerName} at {passengerPhone} shortly to confirm details.
            </p>
            <Link href="/" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#0b66d1] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#0952a8]">
              Back to home
            </Link>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  // `draft.baseFare` (selectedCat.price) is TAX-INCLUSIVE — using it here
  // as "Subtotal" while also showing Tax as a separate line double-counts
  // tax. `fareBreakdown.subtotal` is the true tax-exclusive base, so it
  // must be preferred; baseFare is only a last-resort fallback for older
  // drafts that predate fareBreakdown being captured.
  const subtotal = draft.fareBreakdown?.subtotal ?? draft.baseFare ?? draft.fare;
  const tax = draft.fareBreakdown?.tax ?? 0;
  const tip = draft.tipAmount ?? 0;
  const discount = draft.promoDiscount ?? 0;
  const addonsTotal = draft.addonsTotal ?? 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="mx-auto max-w-[1600px] px-4 pb-20 pt-32 md:px-6 md:pt-36 lg:px-8">
        <div className="grid gap-8 md:grid-cols-[1.05fr_0.95fr] md:items-start">
          {/* LEFT — payment (bottom padding on the outer div reserves room
              for sticky, see extraLeftHeight above — kept outside the white
              card so it doesn't show as blank space inside it) */}
          <div ref={leftColRef} style={extraLeftHeight ? { paddingBottom: extraLeftHeight } : undefined}>
          <div className="rounded-3xl bg-white p-6 md:p-8">
            <h1 className="text-2xl font-bold text-gray-900">Confirm your reservation</h1>
            <p className="mt-1.5 text-sm text-gray-500">Choose how you'd like to pay</p>

            <div className="mt-6 flex items-center gap-5 border-b border-gray-100 pb-4">
              {paymentMethods.map((m) => {
                const opt = PAYMENT_OPTIONS[m] || { label: m, icon: CreditCard };
                const Icon = opt.icon;
                return (
                  <button
                    key={m}
                    onClick={() => setSelectedPayment(m)}
                    className="flex items-center gap-1.5 border-b-2 pb-1 text-xs font-semibold transition"
                    style={{ borderColor: selectedPayment === m ? "#0b66d1" : "transparent", color: selectedPayment === m ? "#0b66d1" : "#6b7280" }}
                  >
                    <Icon className="h-3.5 w-3.5" /> {opt.label}
                  </button>
                );
              })}
            </div>

            {selectedPayment === "card" ? (
              <div className="mt-5 space-y-3">
                <p className="text-sm font-semibold text-gray-900">Add a credit or debit card</p>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">Name on Card</label>
                  <input value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="John Doe"
                    className="w-full rounded-xl bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#0b66d1]/20" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">Card Number</label>
                  <input
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/[^\d\s]/g, ""))}
                    placeholder="1234 5678 9012 3456"
                    inputMode="numeric"
                    maxLength={19}
                    className="w-full rounded-xl bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#0b66d1]/20"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">Expiry date</label>
                    <input
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value.replace(/[^\d/]/g, ""))}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full rounded-xl bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#0b66d1]/20"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">Security code (CVV)</label>
                    <input
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                      placeholder="123"
                      inputMode="numeric"
                      maxLength={4}
                      className="w-full rounded-xl bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#0b66d1]/20"
                    />
                  </div>
                </div>
                <label className="flex items-center gap-2 text-xs text-gray-600">
                  <input type="checkbox" checked={saveCard} onChange={(e) => setSaveCard(e.target.checked)} className="h-3.5 w-3.5 rounded accent-[#0b66d1]" />
                  Save card to your account
                </label>
              </div>
            ) : selectedPayment === "online_transfer" ? (
              <div className="mt-5 space-y-3">
                <p className="text-sm font-semibold text-gray-900">Upload transfer screenshot</p>
                <p className="text-xs leading-5 text-gray-400">
                  Complete the bank/wallet transfer, then upload a full screenshot of the confirmation for our team to verify.
                </p>
                {transferProof ? (
                  <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
                    <img src={transferProof} alt="Transfer screenshot" className="max-h-80 w-full object-contain" />
                    <button
                      type="button"
                      onClick={() => setTransferProof(null)}
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 py-8 text-center transition hover:border-[#0b66d1]/40">
                    {uploadingProof ? (
                      <Loader2 className="h-6 w-6 animate-spin text-[#0b66d1]" />
                    ) : (
                      <>
                        <UploadCloud className="h-6 w-6 text-gray-400" />
                        <span className="text-xs font-medium text-gray-500">Tap to upload screenshot</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingProof}
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) handleProofUpload(f); e.target.value = ""; }}
                    />
                  </label>
                )}
              </div>
            ) : (
              <p className="mt-4 text-xs leading-5 text-gray-400">
                Payment is arranged after confirmation — our team will call you shortly to finalize your ride and collect payment via your selected method.
              </p>
            )}

            <div>
              <label className="mb-1.5 mt-5 block text-xs font-semibold uppercase tracking-wide text-gray-500">Special instructions (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Flight number, meet & greet, luggage notes..."
                className="w-full rounded-xl bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#0b66d1]/20"
              />
            </div>

            <div className="mt-6 space-y-3 border-t border-gray-100 pt-6">
              {draft.bookingFor === "someone" ? (
                <>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Passenger</span>
                    <span className="font-medium text-gray-900">{passengerName || "—"}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Contact</span>
                    <span className="font-medium text-gray-900">{passengerPhone || "—"}</span>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">Passenger name</label>
                    <input
                      value={passengerName}
                      onChange={(e) => setPassengerName(e.target.value)}
                      placeholder="Your name"
                      className="w-full rounded-xl bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#0b66d1]/20"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">Contact number</label>
                    <input
                      value={passengerPhone}
                      onChange={(e) => setPassengerPhone(e.target.value)}
                      placeholder="Your phone number"
                      className="w-full rounded-xl bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#0b66d1]/20"
                    />
                  </div>
                </>
              )}
              {draft.bookingFor === "someone" && (
                <p className="rounded-lg bg-blue-50 px-3 py-2 text-xs text-[#0b66d1]">
                  Booking on behalf of a guest
                </p>
              )}
            </div>

            <div className="mt-7 flex items-center justify-between">
              <button onClick={() => router.back()} className="flex items-center gap-2 rounded-full border border-gray-200 px-5 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <button onClick={submit} disabled={submitting || uploadingProof} className="flex items-center gap-2 rounded-full bg-[#0b66d1] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#0952a8] disabled:opacity-60">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Confirm booking <Check className="h-4 w-4" /></>}
              </button>
            </div>
          </div>
          </div>

          {/* RIGHT — map + booking details + fare breakdown */}
          <div ref={panelRef} className="mt-8 md:sticky md:top-32 md:mt-0">
            <RouteMap
              pickup={mapPickup}
              dropoff={mapDropoff}
            />

            <div className="mt-4 rounded-3xl bg-white p-6">
              <div className="space-y-3 divide-y divide-gray-100">
                <div className="flex items-center gap-3 pb-3">
                  <MapPin className="h-4 w-4 shrink-0 text-[#0b66d1]" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">{draft.pickup}</p>
                    {draft.dropoff && <p className="truncate text-xs text-gray-400">to {draft.dropoff}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-3 py-3">
                  <Calendar className="h-4 w-4 shrink-0 text-[#0b66d1]" />
                  <p className="text-sm text-gray-700">
                    {TYPE_LABELS[draft.rideType] || draft.rideType} &middot; {draft.date} at {to12Hour(draft.time)}
                    {draft.hours ? ` · ${draft.hours}h` : ""}
                    {draft.days ? ` · ${draft.days} day(s)` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3 py-3">
                  <Car className="h-4 w-4 shrink-0 text-[#0b66d1]" />
                  <p className="text-sm text-gray-700">{draft.categoryName}</p>
                </div>
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-gray-500">Price breakdown</p>
              <div className="mt-3 space-y-2 rounded-2xl bg-gray-50 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-900">{formatMoney(subtotal, country.symbol, country.currency)}</span>
                </div>
                {addonsTotal > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Add-ons</span>
                    <span className="text-gray-900">{formatMoney(addonsTotal, country.symbol, country.currency)}</span>
                  </div>
                )}
                {tax > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Tax</span>
                    <span className="text-gray-900">{formatMoney(tax, country.symbol, country.currency)}</span>
                  </div>
                )}
                {tip > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Tip</span>
                    <span className="text-gray-900">{formatMoney(tip, country.symbol, country.currency)}</span>
                  </div>
                )}
                {discount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Promo{draft.promoCode ? ` (${draft.promoCode})` : ""}</span>
                    <span className="text-emerald-600">-{formatMoney(discount, country.symbol, country.currency)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between border-t border-gray-200 pt-2 text-sm font-semibold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-lg text-[#0b66d1]">{formatMoney(draft.fare, country.symbol, country.currency)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
