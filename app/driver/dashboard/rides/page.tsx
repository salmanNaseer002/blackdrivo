"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, User, Clock, DollarSign, Search, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { DRIVER_THEME, curr, fmtDateTime, getRideStatus } from "@/lib/driver/theme";

export default function RidesPage() {
  const router = useRouter();
  const [rides,   setRides]   = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab,     setTab]     = useState<"upcoming" | "history">("upcoming");
  const [search,  setSearch]  = useState("");

  useEffect(() => {
    const supabase = createClient();
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/login"); return; }
      const { data: drv } = await supabase.from("drivers").select("id").eq("user_id", user.id).maybeSingle();
      if (!drv) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const drvAny = drv as any;
      const { data: bookings } = await supabase.from("bookings").select("*").eq("driver_id", drvAny.id).order("scheduled_at", { ascending: false }).limit(100);
      setRides(bookings || []);
      setLoading(false);
    };
    load();
  }, [router]);

  if (loading) return null;

  const upcoming = rides.filter(r => ["confirmed","in_progress","pending"].includes(r.status));
  const history  = rides.filter(r => ["completed","cancelled"].includes(r.status));
  const current  = tab === "upcoming" ? upcoming : history;
  const filtered = current.filter(r =>
    !search || [r.pickup_address, r.dropoff_address, r.id, r.passenger_first_name]
      .some(v => v?.toLowerCase().includes(search.toLowerCase()))
  );

  const totalEarned    = history.filter(r => r.status === "completed").reduce((s, r) => s + (r.fare_final ?? r.fare_estimate ?? 0), 0);
  const completionRate = rides.length > 0 ? Math.round((history.filter(r => r.status === "completed").length / rides.length) * 100) : 0;

  return (
    <div className={DRIVER_THEME.pageWrapper}>
      <div>
        <h2 className={DRIVER_THEME.pageTitle}>My Rides</h2>
        <p className={DRIVER_THEME.pageSub}>Manage and track all your rides</p>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Total Earned",    value: curr(totalEarned),    icon: DollarSign, accent: true  },
          { label: "Completion Rate", value: `${completionRate}%`, icon: TrendingUp, accent: false },
          { label: "Total Rides",     value: String(rides.length), icon: Calendar,   accent: false },
        ].map(s => (
          <div key={s.label} className={`${DRIVER_THEME.card} p-4 flex items-center gap-3`}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: s.accent ? DRIVER_THEME.primary : "#f9fafb" }}>
              <s.icon className={`h-4 w-4 ${s.accent ? "text-white" : "text-gray-500"}`} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className={`${DRIVER_THEME.card} overflow-hidden`}>
        {/* Tabs + search */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3 gap-4 flex-wrap">
          <div className="flex gap-1 rounded-lg border border-gray-200 p-0.5">
            {(["upcoming", "history"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                  tab === t
                    ? "text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
                style={tab === t ? { backgroundColor: DRIVER_THEME.primary } : {}}>
                {t === "upcoming" ? `Upcoming (${upcoming.length})` : `History (${history.length})`}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search rides..."
              className="rounded-lg border border-gray-200 bg-gray-50 py-1.5 pl-8 pr-3 text-sm outline-none focus:border-gray-300 w-44 sm:w-52" />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }}>
            {filtered.length === 0 ? (
              <div className="py-16 text-center">
                <Clock className="mx-auto mb-3 h-10 w-10 text-gray-100" />
                <p className="text-sm font-medium text-gray-500">
                  {tab === "upcoming" ? "No upcoming rides" : "No ride history"}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {search ? "Try a different search" : tab === "upcoming" ? "New rides will appear here" : "Completed rides will appear here"}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {filtered.map(ride => {
                  const st = getRideStatus(ride.status);
                  return (
                    <div key={ride.id} className="p-5 hover:bg-gray-50/40 transition">
                      {/* Top row */}
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">
                            {ride.id?.slice(0, 8).toUpperCase()}
                          </span>
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${st.bg} ${st.text}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
                            {st.label}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <Calendar className="h-3 w-3" />
                            {fmtDateTime(ride.scheduled_at)}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">{curr(ride.fare_final ?? ride.fare_estimate ?? 0)}</p>
                          {ride.distance_km && <p className="text-xs text-gray-400">{ride.distance_km.toFixed(1)} km</p>}
                        </div>
                      </div>

                      {/* Route */}
                      <div className="rounded-xl bg-gray-50 p-3 space-y-2">
                        <div className="flex items-start gap-2.5">
                          <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: DRIVER_THEME.primary }} />
                          <div>
                            <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">Pickup</p>
                            <p className="text-sm text-gray-900">{ride.pickup_address || "—"}</p>
                          </div>
                        </div>
                        <div className="ml-[3px] h-4 border-l-2 border-dashed border-gray-200" />
                        <div className="flex items-start gap-2.5">
                          <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full border-2 border-gray-300 bg-white" />
                          <div>
                            <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">Dropoff</p>
                            <p className="text-sm text-gray-900">{ride.dropoff_address || "—"}</p>
                          </div>
                        </div>
                      </div>

                      {ride.passenger_first_name && (
                        <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                          <User className="h-3.5 w-3.5" />
                          {ride.passenger_first_name} {ride.passenger_last_name?.charAt(0)}.
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
