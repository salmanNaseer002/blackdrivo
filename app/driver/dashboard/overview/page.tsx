"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  DollarSign, TrendingUp, Car, Calendar, Star, ArrowRight,
  CheckCircle, User, FileText, ChevronRight, Clock,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { calcDriverCompletion } from "@/lib/utils/driverCompletion";

function curr(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}
function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

type ChartRange = "daily" | "weekly" | "monthly";

const RIDE_STATUS: Record<string, { label: string; color: string }> = {
  confirmed:   { label: "Confirmed",   color: "text-blue-600"    },
  in_progress: { label: "In Progress", color: "text-amber-600"   },
  completed:   { label: "Completed",   color: "text-emerald-600" },
  cancelled:   { label: "Cancelled",   color: "text-red-500"     },
  pending:     { label: "Pending",     color: "text-gray-400"    },
}

export default function OverviewPage() {
  const router = useRouter();
  const [driver,      setDriver]      = useState<any>(null);
  const [vehicle,     setVehicle]     = useState<any>(null);
  const [rides,       setRides]       = useState<any[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [chartRange,  setChartRange]  = useState<ChartRange>("weekly");

  useEffect(() => {
    const supabase = createClient();
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) { router.replace("/login"); return; }
      const [{ data: drv }, ] = await Promise.all([
        supabase.from("drivers").select("*").eq("user_id", user.id).maybeSingle(),
      ]);
      if (!drv) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const drvAny = drv as any;
      setDriver(drvAny);
      const [{ data: veh }, { data: bookings }] = await Promise.all([
        supabase.from("driver_vehicles").select("*").eq("driver_id", drvAny.id).eq("is_active", true).maybeSingle(),
        supabase.from("bookings").select("*").eq("driver_id", drvAny.id).order("scheduled_at", { ascending: false }).limit(100),
      ]);
      setVehicle(veh);
      setRides(bookings || []);
      setLoading(false);
    };
    load();
  }, [router]);

  const now  = new Date();
  const done = rides.filter(r => r.status === "completed");

  const todayE = done.filter(r => new Date(r.scheduled_at) >= new Date(now.getFullYear(), now.getMonth(), now.getDate())).reduce((s, r) => s + (r.fare_final ?? r.fare_estimate ?? 0), 0);
  const weekE  = done.filter(r => new Date(r.scheduled_at) >= new Date(now.getTime() - now.getDay() * 86400000)).reduce((s, r) => s + (r.fare_final ?? r.fare_estimate ?? 0), 0);
  const monthE = done.filter(r => new Date(r.scheduled_at) >= new Date(now.getFullYear(), now.getMonth(), 1)).reduce((s, r) => s + (r.fare_final ?? r.fare_estimate ?? 0), 0);
  const upcoming = rides.filter(r => ["confirmed", "in_progress", "pending"].includes(r.status));

  // Chart data
  const chartData = useMemo(() => {
    if (chartRange === "weekly") {
      return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(now); d.setDate(now.getDate() - (6 - i));
        const total = done.filter(r => new Date(r.scheduled_at).toDateString() === d.toDateString()).reduce((s, r) => s + (r.fare_final ?? r.fare_estimate ?? 0), 0);
        return { label: ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d.getDay()], total, isToday: d.toDateString() === now.toDateString() };
      });
    }
    if (chartRange === "daily") {
      return Array.from({ length: 8 }, (_, i) => {
        const hour = i * 3;
        const total = done.filter(r => {
          const d = new Date(r.scheduled_at);
          return d.toDateString() === now.toDateString() && d.getHours() >= hour && d.getHours() < hour + 3;
        }).reduce((s, r) => s + (r.fare_final ?? r.fare_estimate ?? 0), 0);
        return { label: `${hour}h`, total, isToday: false };
      });
    }
    // monthly
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const end = new Date(now.getFullYear(), now.getMonth() - (5 - i) + 1, 0);
      const total = done.filter(r => { const rd = new Date(r.scheduled_at); return rd >= d && rd <= end; }).reduce((s, r) => s + (r.fare_final ?? r.fare_estimate ?? 0), 0);
      return { label: d.toLocaleDateString("en-US", { month: "short" }), total, isToday: i === 5 };
    });
  }, [chartRange, rides]);

  const maxVal = Math.max(...chartData.map(d => d.total), 1);

  if (loading || !driver) return null;

  const completion   = calcDriverCompletion(driver, vehicle);
  const isIncomplete = completion.percentage < 100;
  const nextStep = !driver?.full_name || driver.full_name === "PENDING"
    ? { href: "/driver/onboarding/personal", label: "Complete Personal Info", icon: User }
    : !vehicle
    ? { href: "/driver/onboarding/vehicle",  label: "Add Your Vehicle",       icon: Car }
    : !driver?.driver_photo_url
    ? { href: "/driver/onboarding/documents",label: "Upload Documents",       icon: FileText }
    : null;

  return (
    <div className="p-5 md:p-6 space-y-5">

      {/* Profile completion — overview only */}
      {isIncomplete && (
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-[#0b66d1]/20 bg-white p-5">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <p className="font-semibold text-gray-900">Complete your profile</p>
              <p className="text-xs text-gray-400 mt-0.5">{completion.missing.length} items remaining to activate your account</p>
            </div>
            <div className="shrink-0 text-right">
              <span className="text-3xl font-bold text-[#0b66d1]">{completion.percentage}</span>
              <span className="text-sm text-gray-400">%</span>
            </div>
          </div>

          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 mb-4">
            <motion.div initial={{ width: 0 }} animate={{ width: `${completion.percentage}%` }} transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-1.5 rounded-full bg-[#0b66d1]" />
          </div>

          <div className="grid gap-2 sm:grid-cols-3 mb-3">
            {[
              { href: "/driver/onboarding/personal",  icon: User,     label: "Personal Info", done: !!(driver?.full_name && driver.full_name !== "PENDING" && driver?.phone) },
              { href: "/driver/onboarding/vehicle",   icon: Car,      label: "Add Vehicle",   done: !!vehicle },
              { href: "/driver/onboarding/documents", icon: FileText, label: "Upload Docs",   done: !!(driver?.driver_photo_url && driver?.license_front_url) },
            ].map(step => (
              <Link key={step.href} href={step.href}
                className={`flex items-center gap-2.5 rounded-xl border p-3 text-sm font-medium transition ${
                  step.done
                    ? "border-gray-100 bg-gray-50 text-gray-400 pointer-events-none"
                    : "border-[#0b66d1]/20 bg-[#0b66d1]/5 text-[#0b66d1] hover:bg-[#0b66d1]/10"
                }`}>
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${step.done ? "bg-gray-100" : "bg-[#0b66d1]"}`}>
                  {step.done ? <CheckCircle className="h-3.5 w-3.5 text-gray-400" /> : <step.icon className="h-3.5 w-3.5 text-white" />}
                </div>
                <span className="truncate">{step.label}</span>
                {!step.done && <ChevronRight className="ml-auto h-4 w-4 shrink-0" />}
              </Link>
            ))}
          </div>

          {nextStep && (
            <Link href={nextStep.href}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b66d1] py-2.5 text-sm font-semibold text-white hover:bg-[#0952a8] transition">
              Continue: {nextStep.label} <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </motion.div>
      )}

      {/* Earnings cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Today",       value: curr(todayE),  sub: "earnings",   icon: DollarSign, highlight: true  },
          { label: "This Week",   value: curr(weekE),   sub: "earnings",   icon: TrendingUp, highlight: false },
          { label: "This Month",  value: curr(monthE),  sub: "earnings",   icon: DollarSign, highlight: false },
          { label: "Total Rides", value: String(driver?.total_rides ?? 0), sub: "all time", icon: Car, highlight: false },
        ].map(s => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl border p-5 ${s.highlight ? "border-[#0b66d1]/20 bg-[#0b66d1]" : "border-gray-100 bg-white"}`}>
            <div className="flex items-center justify-between mb-3">
              <p className={`text-xs font-medium uppercase tracking-wide ${s.highlight ? "text-white/70" : "text-gray-400"}`}>{s.label}</p>
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${s.highlight ? "bg-white/20" : "bg-gray-50"}`}>
                <s.icon className={`h-4 w-4 ${s.highlight ? "text-white" : "text-gray-500"}`} />
              </div>
            </div>
            <p className={`text-2xl font-bold ${s.highlight ? "text-white" : "text-gray-900"}`}>{s.value}</p>
            <p className={`text-xs mt-0.5 ${s.highlight ? "text-white/60" : "text-gray-400"}`}>{s.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-4 flex items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50">
            <Star className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">{driver?.rating ? driver.rating.toFixed(2) : "—"}</p>
            <p className="text-xs text-gray-400">Driver Rating</p>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-4 flex items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50">
            <Calendar className="h-5 w-5 text-[#0b66d1]" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">{upcoming.length}</p>
            <p className="text-xs text-gray-400">Upcoming Rides</p>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-4 flex items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">
              {rides.length > 0 ? Math.round((done.length / rides.length) * 100) : 0}%
            </p>
            <p className="text-xs text-gray-400">Completion Rate</p>
          </div>
        </div>
      </div>

      {/* Chart + Active vehicle */}
      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        {/* Earnings chart */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm font-semibold text-gray-900">Earnings Overview</p>
            <div className="flex rounded-lg border border-gray-200 overflow-hidden">
              {(["daily", "weekly", "monthly"] as ChartRange[]).map(r => (
                <button key={r} onClick={() => setChartRange(r)}
                  className={`px-3 py-1.5 text-xs font-medium transition capitalize ${
                    chartRange === r ? "bg-[#0b66d1] text-white" : "text-gray-500 hover:bg-gray-50"
                  }`}>
                  {r === "daily" ? "Day" : r === "weekly" ? "Week" : "Month"}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-end gap-1.5 h-40">
            {chartData.map((d, i) => {
              const pct = maxVal > 0 ? Math.max((d.total / maxVal) * 100, d.total > 0 ? 6 : 0) : 0;
              return (
                <div key={i} className="group flex flex-1 flex-col items-center gap-1.5 relative">
                  {d.total > 0 && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-[10px] font-medium px-2 py-0.5 rounded whitespace-nowrap z-10">
                      {curr(d.total)}
                    </div>
                  )}
                  <div className="w-full flex items-end" style={{ height: "120px" }}>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(pct, 3)}%` }}
                      transition={{ duration: 0.5, delay: i * 0.05 }}
                      className={`w-full rounded-t-lg ${d.isToday ? "bg-[#0b66d1]" : d.total > 0 ? "bg-[#0b66d1]/20" : "bg-gray-100"}`}
                      style={{ height: `${Math.max(pct, 3)}%` }}
                    />
                  </div>
                  <span className={`text-[10px] font-medium ${d.isToday ? "text-[#0b66d1]" : "text-gray-400"}`}>{d.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active vehicle */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-gray-900">Active Vehicle</p>
            <Link href="/driver/dashboard/vehicle" className="text-xs text-[#0b66d1] hover:underline">Details →</Link>
          </div>
          {vehicle ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0b66d1]/10">
                  <Car className="h-5 w-5 text-[#0b66d1]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{vehicle.year} {vehicle.make} {vehicle.model}</p>
                  <p className="text-xs text-gray-400">{vehicle.color} · {vehicle.registration}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Status</span>
                <span className={`text-xs font-semibold ${vehicle.status === "approved" ? "text-emerald-600" : vehicle.status === "rejected" ? "text-red-500" : "text-amber-600"}`}>
                  {vehicle.status === "approved" ? "✓ Approved" : vehicle.status === "rejected" ? "✗ Rejected" : "⏳ Pending"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Class</span>
                <span className="text-xs font-medium capitalize text-gray-700">{vehicle.vehicle_class?.replace(/_/g, " ")}</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 mb-3">
                <Car className="h-6 w-6 text-gray-300" />
              </div>
              <p className="text-sm font-medium text-gray-500">No vehicle added</p>
              <Link href="/driver/onboarding/vehicle"
                className="mt-3 text-xs font-semibold text-[#0b66d1] hover:underline">
                Add vehicle →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Recent rides */}
      <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <p className="text-sm font-semibold text-gray-900">Recent Rides</p>
          <Link href="/driver/dashboard/rides" className="text-xs text-[#0b66d1] hover:underline">View all →</Link>
        </div>
        <div className="divide-y divide-gray-50">
          {rides.slice(0, 5).length === 0 ? (
            <div className="py-12 text-center">
              <Clock className="mx-auto mb-2 h-8 w-8 text-gray-100" />
              <p className="text-sm text-gray-400">No rides yet</p>
            </div>
          ) : rides.slice(0, 5).map(ride => (
            <div key={ride.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50/50 transition">
              <div className={`h-2 w-2 shrink-0 rounded-full ${
                ride.status === "completed" ? "bg-emerald-500"
                : ride.status === "cancelled" ? "bg-red-400"
                : ride.status === "in_progress" ? "bg-amber-500"
                : "bg-[#0b66d1]"
              }`} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">{ride.pickup_address || "—"}</p>
                <p className="text-xs text-gray-400">{ride.scheduled_at ? fmt(ride.scheduled_at) : "—"}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-bold text-gray-900">{curr(ride.fare_final ?? ride.fare_estimate ?? 0)}</p>
                <p className={`text-xs ${RIDE_STATUS[ride.status]?.color ?? "text-gray-400"}`}>
                  {RIDE_STATUS[ride.status]?.label ?? ride.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
