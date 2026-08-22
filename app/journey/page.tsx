"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Search, X, MapPin, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/lib/hooks/useUser";
import { useSiteCountry } from "@/components/providers/CountryProvider";
import { formatMoney, displayBookingId } from "@/lib/booking/money";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AccountTabs from "@/components/account/AccountTabs";

interface Ride {
  id: string;
  booking_ref: string | null;
  ride_type: string | null;
  status: string | null;
  pickup_address: string | null;
  dropoff_address: string | null;
  fare: number | null;
  fare_estimate: number | null;
  fare_final: number | null;
  distance_km: number | null;
  passenger_rating: number | null;
  dispute_status: string | null;
  created_at: string;
}

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending", dispatched: "Dispatched", on_the_way: "On The Way",
  arrived: "Arrived", active: "On Going", paused: "Paused",
  completed: "Completed", cancelled: "Cancelled",
};
const ONGOING = ["pending", "dispatched", "on_the_way", "arrived", "active", "paused"];

const FILTERS = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

const PAGE_SIZES = [25, 50, 75, 100];

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

export default function JourneyPage() {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const { country } = useSiteCountry();

  const [rides, setRides] = useState<Ride[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "completed" | "cancelled">("all");
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const [activeRide, setActiveRide] = useState<Ride | null>(null);
  const [stats, setStats] = useState({ completed: 0, active: 0, cancelled: 0, totalSpent: 0 });

  const fetchRides = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    const supabase = createClient();
    let q = (supabase as any).from("bookings")
      .select("id, booking_ref, ride_type, status, pickup_address, dropoff_address, fare, fare_estimate, fare_final, distance_km, passenger_rating, dispute_status, created_at", { count: "exact" })
      .eq("passenger_id", user.id);

    if (filter === "active") q = q.in("status", ONGOING);
    else if (filter === "all") q = q.not("status", "in", `(${ONGOING.join(",")})`);
    else q = q.eq("status", filter);

    if (search.trim()) {
      const s = search.trim();
      q = q.or(`booking_ref.ilike.%${s}%,pickup_address.ilike.%${s}%,dropoff_address.ilike.%${s}%`);
    }

    q = q.order("created_at", { ascending: false }).range((page - 1) * pageSize, page * pageSize - 1);

    const { data, count } = await q;
    setRides(data || []);
    setTotal(count || 0);
    setLoading(false);
  }, [user?.id, filter, search, page, pageSize]);

  const fetchStats = useCallback(async () => {
    if (!user?.id) return;
    const supabase = createClient();
    const [{ data: ongoing }, { count: completedCount }, { count: cancelledCount }, { data: spent }] = await Promise.all([
      (supabase as any).from("bookings").select("id, booking_ref, ride_type, status, pickup_address, dropoff_address, created_at")
        .eq("passenger_id", user.id).in("status", ONGOING).order("created_at", { ascending: false }).limit(1),
      (supabase as any).from("bookings").select("id", { count: "exact", head: true }).eq("passenger_id", user.id).eq("status", "completed"),
      (supabase as any).from("bookings").select("id", { count: "exact", head: true }).eq("passenger_id", user.id).eq("status", "cancelled"),
      (supabase as any).from("bookings").select("fare, fare_final").eq("passenger_id", user.id).eq("status", "completed"),
    ]);
    setActiveRide(ongoing?.[0] || null);
    setStats({
      completed: completedCount || 0,
      active: ongoing?.length ? 1 : 0,
      cancelled: cancelledCount || 0,
      totalSpent: (spent || []).reduce((s: number, r: any) => s + (r.fare_final || r.fare || 0), 0),
    });
  }, [user?.id]);

  useEffect(() => {
    if (userLoading) return;
    if (!user) { router.replace("/login?redirect=/journey"); return; }
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, userLoading]);

  useEffect(() => {
    if (!user?.id) return;
    fetchRides();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, filter, search, page, pageSize]);

  useEffect(() => { setPage(1); }, [filter, search]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  if (userLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#0b66d1]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="mx-auto max-w-[1000px] px-4 sm:px-6 pb-24 pt-32 md:px-6 md:pt-36 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Journey</h1>
            {stats.completed > 0 && (
              <p className="mt-1 text-sm text-gray-500">
                {stats.completed} completed · {formatMoney(stats.totalSpent, country.symbol, country.currency)} spent
              </p>
            )}
          </div>
          <button onClick={() => setShowSearch((v) => !v)} className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100">
            {showSearch ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
          </button>
        </div>

        <div className="mt-6">
          <AccountTabs />
        </div>

        {showSearch && (
          <div className="mt-4 flex items-center gap-2 border-b border-gray-200 pb-3">
            <Search className="h-4 w-4 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} autoFocus
              placeholder="Search ref, pickup, drop-off..."
              className="flex-1 border-none bg-transparent text-sm text-gray-900 outline-none" />
          </div>
        )}

        {/* Flat underline filter tabs — no pills */}
        <div className="mt-6 flex items-center gap-6 border-b border-gray-100">
          {FILTERS.map((f) => {
            const active = filter === f.key;
            const count = f.key === "active" ? stats.active : f.key === "completed" ? stats.completed : f.key === "cancelled" ? stats.cancelled : null;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key as typeof filter)}
                className={`-mb-px flex items-center gap-1.5 border-b-2 pb-3 text-sm font-semibold transition ${
                  active ? "border-[#0b66d1] text-[#0b66d1]" : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                {f.label}
                {count != null && count > 0 && <span className="text-xs text-gray-400">{count}</span>}
              </button>
            );
          })}
        </div>

        {/* Active ride banner */}
        {activeRide && (
          <Link href={`/journey/${displayBookingId(activeRide.booking_ref)}`}
            className="mt-6 flex items-center justify-between border-b border-gray-100 pb-5 pt-1">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#0b66d1]" />
                <span className="text-sm font-semibold text-[#0b66d1]">{STATUS_LABEL[activeRide.status || ""] || "Active"}</span>
                <span className="text-xs text-gray-400">{displayBookingId(activeRide.booking_ref)}</span>
              </div>
              <p className="mt-1 truncate text-sm text-gray-700">{activeRide.pickup_address}</p>
              {activeRide.dropoff_address && <p className="truncate text-sm text-gray-700">{activeRide.dropoff_address}</p>}
            </div>
            <span className="shrink-0 text-sm font-semibold text-[#0b66d1]">Track →</span>
          </Link>
        )}

        {/* Ride list — flat rows, hairline dividers, no cards/pills */}
        <div className="mt-2 min-h-[200px] divide-y divide-gray-100">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-5 w-5 animate-spin text-gray-300" />
            </div>
          ) : rides.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-20 text-center">
              <MapPin className="h-7 w-7 text-gray-300" />
              <p className="text-base font-semibold text-gray-900">No rides found</p>
              <p className="text-sm text-gray-500">{search ? "Try a different search term" : "Your ride history will appear here"}</p>
            </div>
          ) : (
            rides.map((r) => {
              const fare = r.fare_final || r.fare_estimate || r.fare || 0;
              const statusColor = r.status === "cancelled" ? "text-red-500" : ["pending", "dispatched"].includes(r.status || "") ? "text-amber-500" : "text-gray-400";
              return (
                <Link key={r.id} href={`/journey/${displayBookingId(r.booking_ref)}`} className="flex items-center gap-6 py-5 transition hover:bg-gray-50">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">{displayBookingId(r.booking_ref)}</span>
                      <span className="text-xs text-gray-400 capitalize">{(r.ride_type || "").replace(/_/g, " ")} · {fmtDate(r.created_at)}</span>
                    </div>
                    <p className="mt-1.5 truncate text-sm text-gray-700">{r.pickup_address}</p>
                    {r.dropoff_address && <p className="truncate text-sm text-gray-500">{r.dropoff_address}</p>}
                    {r.passenger_rating ? (
                      <div className="mt-2 flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Star key={n} className={`h-3 w-3 ${n <= (r.passenger_rating || 0) ? "fill-gray-900 text-gray-900" : "text-gray-200"}`} />
                        ))}
                      </div>
                    ) : null}
                    {r.dispute_status && <p className="mt-2 text-xs font-semibold text-red-500">Dispute {r.dispute_status}</p>}
                  </div>
                  <div className="shrink-0 text-right">
                    <p className={`text-xs font-semibold ${statusColor}`}>{STATUS_LABEL[r.status || ""] || r.status}</p>
                    {fare > 0 && <p className="mt-1 text-sm font-bold text-gray-900">{formatMoney(fare, country.symbol, country.currency)}</p>}
                    {r.distance_km ? <p className="mt-0.5 text-xs text-gray-400">{Number(r.distance_km).toFixed(1)} km</p> : null}
                  </div>
                </Link>
              );
            })
          )}
        </div>

        {/* Pagination — same "Showing X–Y of Z" pattern as Admin's Bookings.jsx */}
        {total > 0 && (
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 py-4">
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-500">
                Showing {Math.min((page - 1) * pageSize + 1, total)}–{Math.min(page * pageSize, total)} of {total.toLocaleString()}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-500">Rows</span>
                <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                  className="h-7 rounded-md border border-gray-200 bg-white px-2 text-xs text-gray-700 outline-none">
                  {PAGE_SIZES.map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-1">
              <button onClick={() => setPage((p) => p - 1)} disabled={page === 1}
                className="rounded-md border border-gray-200 px-3 py-1 text-xs text-gray-600 disabled:opacity-40">
                ← Prev
              </button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)}
                  className={`rounded-md border px-2.5 py-1 text-xs ${p === page ? "border-[#0b66d1] bg-[#0b66d1] font-bold text-white" : "border-gray-200 text-gray-600"}`}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage((p) => p + 1)} disabled={page === totalPages}
                className="rounded-md border border-gray-200 px-3 py-1 text-xs text-gray-600 disabled:opacity-40">
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
