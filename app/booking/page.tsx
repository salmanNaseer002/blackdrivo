"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Calendar, Clock, Users, CreditCard, ChevronRight, CheckCircle, ArrowLeft, Plane } from "lucide-react";
import { VEHICLE_CLASSES, estimateFare } from "@/lib/fare";
import VehicleSelector from "@/components/booking/VehicleSelector";
import type { VehicleClass, RideType } from "@/lib/supabase/types";
import { useUser } from "@/lib/hooks/useUser";
import SignInModal from "@/components/auth/SignInModal";
import { createClient } from "@/lib/supabase/client";
import Navbar from "@/components/layout/Navbar";

type Step = "details" | "vehicle" | "passenger" | "payment";

const STEPS: { id: Step; label: string }[] = [
  { id: "details", label: "Trip Details" },
  { id: "vehicle", label: "Vehicle" },
  { id: "passenger", label: "Passenger Info" },
  { id: "payment", label: "Payment" },
];

function BookingContent() {
  const params = useSearchParams();
  const router = useRouter();

  const [step, setStep] = useState<Step>("details");
  const [rideType, setRideType] = useState<RideType>((params.get("type") as RideType) ?? "one_way");
  const [pickup, setPickup] = useState(params.get("pickup") ?? "");
  const [dropoff, setDropoff] = useState(params.get("dropoff") ?? "");
  const [date, setDate] = useState(params.get("date") ?? "");
  const [time, setTime] = useState(params.get("time") ?? "");
  const [hours, setHours] = useState(params.get("hours") ?? "2");
  const [passengers, setPassengers] = useState(params.get("passengers") ?? "1");
  const [vehicleClass, setVehicleClass] = useState<VehicleClass>("business");
  const [distanceMiles] = useState<number>(25);
  const [flightNumber, setFlightNumber] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState("");

  const { user, profile } = useUser();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const hasAutoFilled = useRef(false);
  useEffect(() => {
    if (!profile || hasAutoFilled.current) return;
    hasAutoFilled.current = true;
    if (profile.full_name) {
      const parts = profile.full_name.trim().split(/\s+/);
      setFirstName(parts[0] ?? "");
      setLastName(parts.slice(1).join(" "));
    }
    if (profile.email) setEmail(profile.email);
    if (profile.phone) setPhone(profile.phone);
  }, [profile]);

  const faresByClass = VEHICLE_CLASSES.reduce((acc, v) => {
    acc[v.id] = estimateFare(v.id, rideType, distanceMiles, Number(hours));
    return acc;
  }, {} as Record<VehicleClass, number>);

  const selectedFare = faresByClass[vehicleClass];

  const stepIndex = STEPS.findIndex((s) => s.id === step);

  const canProceed = {
    details: pickup.length > 2 && (rideType === "hourly" || dropoff.length > 2) && date && time,
    vehicle: true,
    passenger: firstName && lastName && email && phone,
    payment: true,
  };

  const handlePayment = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setSubmitting(true);
    setBookingError("");
    try {
      const supabase = createClient();

      // Ensure the public.users row exists — required by the bookings FK constraint.
      // This is a no-op if the row already exists (onConflict: "id").
      await (supabase as any).from("users").upsert({
        id: user.id,
        email: user.email ?? "",
        name: (user.user_metadata?.full_name as string) || (user.email ?? "").split("@")[0],
        full_name: (user.user_metadata?.full_name as string) ?? null,
        phone: (user.user_metadata?.phone as string) ?? null,
        // role omitted — DB uses column DEFAULT ('ops')
      }, { onConflict: "id" });

      // Build a proper UTC timestamp string so Postgres timestamptz accepts it
      const scheduledAt = date && time ? `${date}T${time}:00` : new Date().toISOString();

      const payload = {
        passenger_id: user.id,
        ride_type: rideType,
        vehicle_class: vehicleClass,
        pickup_address: pickup,
        pickup_lat: 0,
        pickup_lng: 0,
        dropoff_address: rideType === "hourly" ? pickup : dropoff,
        dropoff_lat: 0,
        dropoff_lng: 0,
        scheduled_at: scheduledAt,
        passengers: Number(passengers),
        fare_estimate: selectedFare,
        hours: rideType === "hourly" ? Number(hours) : null,
        flight_number: flightNumber || null,
        passenger_first_name: firstName,
        passenger_last_name: lastName,
        passenger_email: email,
        passenger_phone: phone,
        notes: notes || null,
        status: "pending",
      };

      const { data, error } = await supabase
        .from("bookings")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .insert(payload as any)
        .select("id")
        .single();
      if (error) {
        setBookingError(error.message);
      } else {
        router.push(`/booking/confirmation?bookingId=${(data as { id: string }).id}`);
      }
    } catch {
      setBookingError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
  src="/logo bb.png"
  alt="BlackDrivo"
  width={130}
  height={35}
  className="object-contain"
/>
          </Link>
          <Link href="/" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:py-12">
        {/* Progress */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <button
                onClick={() => i < stepIndex && setStep(s.id)}
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition ${
                  i < stepIndex
                    ? "bg-[#0b66d1] text-white cursor-pointer hover:bg-[#0952a8]"
                    : i === stepIndex
                    ? "bg-[#0b66d1] text-white ring-2 ring-[#0b66d1]/30"
                    : "bg-gray-200 text-gray-400 cursor-default"
                }`}
              >
                {i < stepIndex ? <CheckCircle className="h-4 w-4" /> : i + 1}
              </button>
              <span
                className={`hidden text-xs font-medium sm:block ${
                  i === stepIndex ? "text-gray-900" : i < stepIndex ? "text-[#0b66d1]" : "text-gray-400"
                }`}
              >
                {s.label}
              </span>
              {i < STEPS.length - 1 && (
                <div className={`h-px w-8 md:w-16 ${i < stepIndex ? "bg-[#0b66d1]" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* Main panel */}
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 md:p-8">
            <AnimatePresence mode="wait">
              {/* Step 1: Trip Details */}
              {step === "details" && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  <h2 className="text-xl font-bold text-gray-900">Trip Details</h2>
                  <p className="mt-1 text-sm text-gray-500">Where and when do you need a ride?</p>

                  {/* Ride type */}
                  <div className="mt-6 grid grid-cols-3 gap-2">
                    {(["one_way", "hourly", "city_to_city"] as RideType[]).map((t) => (
                      <button
                        key={t}
                        onClick={() => setRideType(t)}
                        className={`rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                          rideType === t
                            ? "bg-[#0b66d1] text-white"
                            : "border border-gray-200 text-gray-600 hover:border-[#0b66d1] hover:text-[#0b66d1]"
                        }`}
                      >
                        {t === "one_way" ? "One Way" : t === "hourly" ? "By the Hour" : "City to City"}
                      </button>
                    ))}
                  </div>

                  <div className="mt-5 space-y-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-gray-700">
                        Pickup Location *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0b66d1]" />
                        <input
                          value={pickup}
                          onChange={(e) => setPickup(e.target.value)}
                          placeholder="Address, airport, hotel..."
                          className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none ring-[#0b66d1] focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20 transition"
                        />
                      </div>
                    </div>

                    {rideType !== "hourly" ? (
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-gray-700">
                          Drop-off Location *
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          <input
                            value={dropoff}
                            onChange={(e) => setDropoff(e.target.value)}
                            placeholder="Address, airport, hotel..."
                            className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none ring-[#0b66d1] focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20 transition"
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-gray-700">
                          Duration *
                        </label>
                        <select
                          value={hours}
                          onChange={(e) => setHours(e.target.value)}
                          className="w-full rounded-xl border border-gray-200 bg-white py-3.5 px-4 text-sm text-gray-900 outline-none ring-[#0b66d1] focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20 transition"
                        >
                          {[2, 3, 4, 5, 6, 8, 10, 12, 24].map((h) => (
                            <option key={h} value={h}>
                              {h} hours
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-gray-700">
                          Date *
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            min={new Date().toISOString().split("T")[0]}
                            className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-10 pr-4 text-sm text-gray-900 outline-none ring-[#0b66d1] focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20 transition"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-gray-700">
                          Pickup Time *
                        </label>
                        <div className="relative">
                          <Clock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-10 pr-4 text-sm text-gray-900 outline-none ring-[#0b66d1] focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20 transition"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-gray-700">
                        Passengers
                      </label>
                      <div className="relative">
                        <Users className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <select
                          value={passengers}
                          onChange={(e) => setPassengers(e.target.value)}
                          className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-10 pr-4 text-sm text-gray-900 outline-none ring-[#0b66d1] focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20 transition"
                        >
                          {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                            <option key={n} value={n}>
                              {n} passenger{n > 1 ? "s" : ""}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {rideType === "one_way" && (
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-gray-700">
                          Flight Number (optional)
                        </label>
                        <div className="relative">
                          <Plane className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          <input
                            value={flightNumber}
                            onChange={(e) => setFlightNumber(e.target.value)}
                            placeholder="e.g. AA1234"
                            className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none ring-[#0b66d1] focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20 transition"
                          />
                        </div>
                        <p className="mt-1 text-xs text-gray-400">
                          We&apos;ll track your flight and adjust pickup time automatically
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Vehicle */}
              {step === "vehicle" && (
                <motion.div
                  key="vehicle"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  <h2 className="text-xl font-bold text-gray-900">Select Your Vehicle</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    All prices include driver, fuel, and gratuity.
                  </p>
                  <div className="mt-6">
                    <VehicleSelector
                      selected={vehicleClass}
                      onSelect={setVehicleClass}
                      faresByClass={faresByClass}
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 3: Passenger Info */}
              {step === "passenger" && (
                <motion.div
                  key="passenger"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  <h2 className="text-xl font-bold text-gray-900">Passenger Information</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Please provide the details of the passenger being picked up.
                  </p>
                  <div className="mt-6 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-gray-700">First Name *</label>
                        <input
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="John"
                          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none ring-[#0b66d1] focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20 transition"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-gray-700">Last Name *</label>
                        <input
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Smith"
                          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none ring-[#0b66d1] focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20 transition"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-gray-700">Email Address *</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none ring-[#0b66d1] focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20 transition"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-gray-700">Phone Number *</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none ring-[#0b66d1] focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20 transition"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-gray-700">
                        Special Instructions (optional)
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        placeholder="Any special requests or notes for your driver..."
                        className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none ring-[#0b66d1] focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20 transition"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Payment */}
              {step === "payment" && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  <h2 className="text-xl font-bold text-gray-900">Payment</h2>
                  <p className="mt-1 text-sm text-gray-500">Secure payment powered by Stripe.</p>

                  <div className="mt-6 space-y-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-gray-700">Card Number</label>
                      <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3.5">
                        <CreditCard className="h-4 w-4 text-gray-400" />
                        <input
                          placeholder="1234 5678 9012 3456"
                          className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none"
                        />
                        <span className="text-xs text-gray-400">Stripe</span>
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-gray-700">Expiry</label>
                        <input
                          placeholder="MM / YY"
                          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none ring-[#0b66d1] focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20 transition"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-gray-700">CVC</label>
                        <input
                          placeholder="123"
                          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none ring-[#0b66d1] focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20 transition"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-gray-700">Name on Card</label>
                      <input
                        placeholder="John Smith"
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none ring-[#0b66d1] focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20 transition"
                      />
                    </div>
                    <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-xs text-gray-600">
                      Your payment is secured with 256-bit SSL encryption via Stripe. BlackDrivo never stores your card details.
                    </div>
                    {bookingError && (
                      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {bookingError}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="mt-8 flex items-center justify-between">
              {stepIndex > 0 ? (
                <button
                  onClick={() => setStep(STEPS[stepIndex - 1].id)}
                  className="flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:border-gray-300 hover:text-gray-900"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
              ) : (
                <div />
              )}

              {step === "payment" ? (
                <button
                  onClick={handlePayment}
                  disabled={submitting}
                  className="flex items-center gap-2 rounded-xl bg-[#0b66d1] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#0952a8] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    <CreditCard className="h-4 w-4" />
                  )}
                  {submitting ? "Booking..." : `Confirm & Pay $${selectedFare}`}
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (!canProceed[step]) return;
                    if (step === "passenger" && !user) {
                      setShowAuthModal(true);
                      return;
                    }
                    setStep(STEPS[stepIndex + 1].id);
                  }}
                  disabled={!canProceed[step]}
                  className="flex items-center gap-2 rounded-xl bg-[#0b66d1] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0952a8] disabled:cursor-not-allowed disabled:opacity-40 active:scale-95"
                >
                  Continue <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Summary sidebar */}
          <div className="space-y-4">
            {/* Trip summary */}
            <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
              <h3 className="mb-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Trip Summary
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs text-gray-400">Ride Type</p>
                  <p className="font-medium text-gray-900 capitalize">
                    {rideType === "one_way" ? "One Way" : rideType === "hourly" ? `By the Hour (${hours}h)` : "City to City"}
                  </p>
                </div>
                {pickup && (
                  <div>
                    <p className="text-xs text-gray-400">Pickup</p>
                    <p className="font-medium text-gray-900 line-clamp-2">{pickup || "—"}</p>
                  </div>
                )}
                {dropoff && rideType !== "hourly" && (
                  <div>
                    <p className="text-xs text-gray-400">Drop-off</p>
                    <p className="font-medium text-gray-900 line-clamp-2">{dropoff || "—"}</p>
                  </div>
                )}
                {date && (
                  <div>
                    <p className="text-xs text-gray-400">Date & Time</p>
                    <p className="font-medium text-gray-900">
                      {date} {time && `at ${time}`}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-400">Passengers</p>
                  <p className="font-medium text-gray-900">{passengers}</p>
                </div>
              </div>
            </div>

            {/* Price */}
            {stepIndex >= 1 && (
              <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
                <h3 className="mb-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Price Estimate
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Base fare</span>
                    <span>${selectedFare - 5}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Gratuity included</span>
                    <span>$5</span>
                  </div>
                  <div className="mt-3 flex justify-between border-t border-gray-100 pt-3 text-base font-bold text-gray-900">
                    <span>Total</span>
                    <span>${selectedFare}</span>
                  </div>
                </div>
                <p className="mt-3 text-xs text-gray-400">
                  No hidden fees. Final price confirmed before payment.
                </p>
              </div>
            )}

            {/* Why BlackDrivo */}
            <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
              <h3 className="mb-3 text-sm font-semibold text-gray-700">Why BlackDrivo</h3>
              <ul className="space-y-2">
                {[
                  "Professional vetted chauffeurs",
                  "Flight tracking included",
                  "No cancellation fee (24h+)",
                  "24/7 live support",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-gray-600">
                    <CheckCircle className="h-3.5 w-3.5 shrink-0 text-[#0b66d1]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showAuthModal && (
          <SignInModal
            message="Sign in to continue with your booking."
            onSuccess={() => {
              setShowAuthModal(false);
              setStep(STEPS[stepIndex + 1].id);
            }}
            onClose={() => setShowAuthModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <BookingContent />
    </Suspense>
  );
}
