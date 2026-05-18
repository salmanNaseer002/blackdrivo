"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Car, Calendar, MapPin, Clock, DollarSign, Settings, LogOut,
  CheckCircle, XCircle, AlertCircle, ToggleLeft, ToggleRight, Star,
  Loader2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { BookingRow, DriverRow, UserRow } from "@/lib/supabase/types";

const statusStyles: Record<string, string> = {
  confirmed:   "bg-blue-50 text-[#0b66d1]",
  in_progress: "bg-amber-50 text-amber-600",
  completed:   "bg-emerald-50 text-emerald-600",
  cancelled:   "bg-red-50 text-red-500",
  pending:     "bg-gray-100 text-gray-500",
};

const driverStatusStyles: Record<string, string> = {
  pending:   "bg-amber-50 text-amber-600 border border-amber-200",
  approved:  "bg-emerald-50 text-emerald-600 border border-emerald-200",
  rejected:  "bg-red-50 text-red-600 border border-red-200",
  suspended: "bg-gray-100 text-gray-500 border border-gray-200",
};

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function currency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

function startOfDay(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function startOfWeek(d = new Date()) {
  const day = d.getDay();
  return startOfDay(new Date(d.getTime() - day * 86400000));
}

function startOfMonth(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export default function DriverDashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  const [pageLoading, setPageLoading] = useState(true);
  const [driver, setDriver]         = useState<DriverRow | null>(null);
  const [userProfile, setUserProfile] = useState<UserRow | null>(null);
  const [rides, setRides]           = useState<BookingRow[]>([]);
  const [isAvailable, setIsAvailable] = useState(false);
  const [activeTab, setActiveTab]   = useState<"upcoming" | "history">("upcoming");

  const fetchData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.replace("/login?redirect=/driver/dashboard"); return; }

    // Parallel fetch: user profile + driver record
    const [{ data: profile }, { data: driverRecord }] = await Promise.all([
      supabase.from("users").select("*").eq("id", user.id).single(),
      supabase.from("drivers").select("*").eq("user_id", user.id).single(),
    ]);

    if (!driverRecord) {
      // User exists but has no driver record — redirect to register
      router.replace("/driver/register");
      return;
    }

    setUserProfile(profile as UserRow | null);
    setDriver(driverRecord as DriverRow);
    setIsAvailable((driverRecord as DriverRow).is_available);

    // Fetch this driver's bookings
    const { data: bookings } = await supabase
      .from("bookings")
      .select("*")
      .eq("driver_id", (driverRecord as DriverRow).id)
      .order("scheduled_at", { ascending: false })
      .limit(50);

    setRides((bookings as BookingRow[]) ?? []);
    setPageLoading(false);
  }, [supabase, router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const toggleAvailability = async () => {
    if (!driver) return;
    const next = !isAvailable;
    setIsAvailable(next);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("drivers") as any)
      .update({ is_available: next })
      .eq("id", driver.id);
    if (error) {
      setIsAvailable(!next);
      toast.error("Could not update availability");
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  // ── Derived data ──────────────────────────────────────
  const now = new Date();
  const completedRides = rides.filter((r) => r.status === "completed");

  const todayEarnings = completedRides
    .filter((r) => new Date(r.scheduled_at) >= startOfDay(now))
    .reduce((s, r) => s + (r.fare_final ?? r.fare_estimate), 0);

  const weekEarnings = completedRides
    .filter((r) => new Date(r.scheduled_at) >= startOfWeek(now))
    .reduce((s, r) => s + (r.fare_final ?? r.fare_estimate), 0);

  const monthEarnings = completedRides
    .filter((r) => new Date(r.scheduled_at) >= startOfMonth(now))
    .reduce((s, r) => s + (r.fare_final ?? r.fare_estimate), 0);

  const upcomingRides  = rides.filter((r) => r.status === "confirmed" || r.status === "in_progress");
  const historyRides   = rides.filter((r) => r.status === "completed" || r.status === "cancelled");
  const displayedRides = activeTab === "upcoming" ? upcomingRides : historyRides;

  const driverName = userProfile?.full_name ?? driver?.id?.slice(0, 8) ?? "Driver";

  // ── Loading ───────────────────────────────────────────
  if (pageLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-[#0b66d1]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0b66d1]">
              <Image src="/B Logo Black Theme.png" alt="BlackDrivo" width={18} height={18} className="object-contain invert mix-blend-screen" />
            </div>
            <span className="text-lg font-bold text-gray-900">BlackDrivo</span>
          </Link>
          <div className="flex items-center gap-3">
            {driver?.status === "approved" && (
              <button
                onClick={toggleAvailability}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  isAvailable
                    ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                    : "border-gray-200 bg-gray-100 text-gray-500"
                }`}
              >
                {isAvailable ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                {isAvailable ? "Online" : "Offline"}
              </button>
            )}
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-sm font-bold text-gray-600">
              {initials(driverName)}
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:py-12">

        {/* Pending approval banner */}
        {driver?.status === "pending" && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
            <div>
              <p className="font-semibold text-gray-900">Application under review</p>
              <p className="mt-1 text-sm text-gray-600">
                Your driver application is being reviewed by our team. You&apos;ll receive an email within 2–3 business days with the next steps.
              </p>
            </div>
          </div>
        )}

        {driver?.status === "rejected" && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5">
            <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
            <div>
              <p className="font-semibold text-gray-900">Application not approved</p>
              <p className="mt-1 text-sm text-gray-600">
                Unfortunately your application was not approved at this time. Please contact{" "}
                <a href="mailto:support@blackdrivo.com" className="text-[#0b66d1]">support@blackdrivo.com</a>{" "}
                for more information.
              </p>
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          {/* Sidebar */}
          <div className="space-y-3">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-[#0b66d1]">
                  {initials(driverName)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{driverName}</p>
                  <p className="text-xs text-gray-500">{userProfile?.email}</p>
                </div>
              </div>

              {/* Status badge */}
              <div className="mt-3">
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${driverStatusStyles[driver?.status ?? "pending"]}`}>
                  {driver?.status ?? "pending"}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-center">
                  <p className="text-lg font-bold text-gray-900">
                    {driver?.rating ? driver.rating.toFixed(2) : "—"}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center justify-center gap-0.5">
                    <Star className="h-3 w-3 text-amber-400" /> Rating
                  </p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-center">
                  <p className="text-lg font-bold text-gray-900">{driver?.total_rides ?? 0}</p>
                  <p className="text-xs text-gray-500">Total rides</p>
                </div>
              </div>

              {driver?.status === "approved" && (
                <div className={`mt-3 flex items-center justify-between rounded-xl p-3 ${isAvailable ? "border border-emerald-100 bg-emerald-50" : "border border-gray-100 bg-gray-50"}`}>
                  <span className="text-sm font-medium text-gray-900">Availability</span>
                  <button onClick={toggleAvailability}>
                    {isAvailable
                      ? <ToggleRight className="h-5 w-5 text-emerald-500" />
                      : <ToggleLeft className="h-5 w-5 text-gray-400" />}
                  </button>
                </div>
              )}
            </div>

            <nav className="rounded-2xl border border-gray-100 bg-white p-2 shadow-sm">
              {[
                { icon: Calendar, label: "My Rides",  active: true },
                { icon: DollarSign, label: "Earnings", active: false },
                { icon: Star,       label: "Reviews",  active: false },
                { icon: Car,        label: "My Vehicle", active: false },
                { icon: Settings,   label: "Settings", active: false },
              ].map((item) => (
                <button key={item.label} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${item.active ? "bg-blue-50 text-[#0b66d1]" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}>
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              ))}
              <div className="mt-1 border-t border-gray-100 pt-1">
                <button
                  onClick={signOut}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-400 transition hover:bg-gray-50 hover:text-gray-600"
                >
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </div>
            </nav>
          </div>

          {/* Main content */}
          <div className="space-y-5">
            {/* Earnings cards */}
            <div className="grid gap-4 sm:grid-cols-4">
              {[
                { label: "Today's Earnings",  value: currency(todayEarnings),         icon: DollarSign, highlight: true },
                { label: "This Week",          value: currency(weekEarnings),           icon: DollarSign, highlight: false },
                { label: "This Month",         value: currency(monthEarnings),          icon: DollarSign, highlight: false },
                { label: "Upcoming Rides",     value: String(upcomingRides.length),     icon: Calendar,   highlight: false },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <stat.icon className="mb-2 h-4 w-4 text-[#0b66d1]" />
                  <p className={`text-2xl font-bold ${stat.highlight ? "text-emerald-600" : "text-gray-900"}`}>{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Offline / not approved alerts */}
            {driver?.status === "approved" && !isAvailable && (
              <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <AlertCircle className="h-5 w-5 shrink-0 text-amber-500" />
                <div className="text-sm">
                  <p className="font-medium text-gray-900">You are currently offline</p>
                  <p className="text-gray-600">Toggle your availability to receive ride requests.</p>
                </div>
                <button onClick={() => toggleAvailability()} className="ml-auto rounded-full bg-amber-100 px-4 py-1.5 text-xs font-semibold text-amber-600 transition hover:bg-amber-200">
                  Go online
                </button>
              </div>
            )}

            {/* Rides table */}
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="flex border-b border-gray-100 px-5 pt-4">
                {(["upcoming", "history"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`mr-4 pb-3 text-sm font-medium capitalize transition ${activeTab === tab ? "border-b-2 border-[#0b66d1] text-[#0b66d1]" : "text-gray-500 hover:text-gray-700"}`}
                  >
                    {tab === "upcoming" ? `Upcoming rides (${upcomingRides.length})` : `Ride history (${historyRides.length})`}
                  </button>
                ))}
              </div>

              <div className="space-y-3 p-5">
                {displayedRides.length === 0 ? (
                  <div className="py-10 text-center">
                    <Clock className="mx-auto mb-3 h-7 w-7 text-gray-300" />
                    <p className="text-sm text-gray-500">
                      {activeTab === "upcoming" ? "No upcoming rides" : "No ride history yet"}
                    </p>
                  </div>
                ) : (
                  displayedRides.map((ride) => (
                    <motion.div
                      key={ride.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="rounded-xl border border-gray-100 bg-gray-50 p-4 transition hover:border-gray-200"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-gray-400">{ride.id.slice(0, 8).toUpperCase()}</span>
                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusStyles[ride.status] ?? "bg-gray-100 text-gray-500"}`}>
                              {ride.status.replace("_", " ")}
                            </span>
                          </div>
                          <div className="mt-1.5 flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(ride.scheduled_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                            </span>
                            {ride.distance_km && <span>{ride.distance_km.toFixed(1)} km</span>}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            {currency(ride.fare_final ?? ride.fare_estimate)}
                          </p>
                          {ride.passenger_first_name && (
                            <p className="text-xs text-gray-400">
                              {ride.passenger_first_name} {ride.passenger_last_name?.charAt(0)}.
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="mt-3 space-y-1.5">
                        <div className="flex items-start gap-2 text-sm text-gray-600">
                          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0b66d1]" />
                          <span className="line-clamp-1">{ride.pickup_address}</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm text-gray-600">
                          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-300" />
                          <span className="line-clamp-1">{ride.dropoff_address}</span>
                        </div>
                      </div>
                      {ride.status === "confirmed" && (
                        <div className="mt-3 flex gap-2">
                          <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#0b66d1] py-2 text-xs font-semibold text-white transition hover:bg-[#0952a8]">
                            <CheckCircle className="h-3.5 w-3.5" /> Accept ride
                          </button>
                          <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-50">
                            <XCircle className="h-3.5 w-3.5" /> Decline
                          </button>
                        </div>
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
