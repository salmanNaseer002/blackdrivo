"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Briefcase, ChevronRight, Loader2, MoreVertical, Plus, X, AlertTriangle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/lib/hooks/useUser";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AccountTabs from "@/components/account/AccountTabs";
import { deriveB2BStage, STAGE_LABEL } from "@/lib/corporate/b2bStage";
import { addDays, dateLabel, todayIso } from "@/lib/corporate/dates";

interface B2BClient { id: string; name: string; status: string | null; }
interface Membership { id: string; b2b_client_id: string; exit_requested_at: string | null; exit_reason: string | null; b2b_clients: B2BClient; }
interface Route { name: string | null; direction: string | null; }
interface Trip { id: string; status: string; trip_code: string | null; trip_date: string; on_the_way_at: string | null; ride_started_at: string | null; dispute_status: string | null; b2b_routes: Route | null; }
interface Stop {
  id: string; status: string; stop_type: string | null;
  actual_pickup_at: string | null; arrived_at: string | null; notified_on_way_at: string | null; leg_eta_min: number | null;
  actual_drop_at: string | null; drop_arrived_at: string | null;
  b2b_trips: Trip;
}

const STATUS_LABEL: Record<string, string> = { scheduled: "Scheduled", dispatched: "On Schedule", completed: "Completed", cancelled: "Cancelled" };
const DIRECTION_LABEL: Record<string, string> = { outbound: "Outbound", return: "Return" };
const DIRECTION_ORDER: Record<string, number> = { outbound: 0, return: 1 };
const DISPUTE_REASONS = ["Driver was late", "Missed pickup", "Wrong route taken", "Vehicle not as described", "Driver behavior", "Other"];

function fmtTime(t: string | null) {
  if (!t) return "—";
  const [h, m] = t.split(":");
  const hh = ((Number(h) + 11) % 12) + 1;
  return `${hh}:${m} ${Number(h) >= 12 ? "PM" : "AM"}`;
}

function ExitReasonModal({ onClose, onSubmit, submitting }: { onClose: () => void; onSubmit: (reason: string) => void; submitting: boolean }) {
  const [reason, setReason] = useState("");
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 sm:items-center" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-t-3xl bg-white p-6 sm:rounded-2xl">
        <h3 className="text-lg font-bold text-gray-900">Exit Corporate Account</h3>
        <p className="mt-1.5 text-sm text-gray-500">Tell us why you&apos;re leaving — this goes to your company admin for approval.</p>
        <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason for exit..." rows={3}
          className="mt-4 w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20" />
        <div className="mt-4 flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-full bg-gray-100 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-200">Cancel</button>
          <button onClick={() => onSubmit(reason)} disabled={submitting || !reason.trim()}
            className="flex-1 rounded-full bg-red-500 py-2.5 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-40">
            {submitting ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : "Send Request"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DisputeModal({ onClose, onSubmit, submitting }: { onClose: () => void; onSubmit: (reason: string, detail: string) => void; submitting: boolean }) {
  const [reason, setReason] = useState("");
  const [detail, setDetail] = useState("");
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 sm:items-center" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-t-3xl bg-white p-6 sm:rounded-2xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Raise a dispute</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X className="h-4 w-4" /></button>
        </div>
        <div className="mt-4 divide-y divide-gray-100 border-y border-gray-100">
          {DISPUTE_REASONS.map((r) => (
            <button key={r} onClick={() => setReason(r)}
              className={`flex w-full items-center justify-between py-2.5 text-left text-sm ${reason === r ? "font-semibold text-gray-900" : "text-gray-600"}`}>
              {r}{reason === r && <span className="text-[#0b66d1]">✓</span>}
            </button>
          ))}
        </div>
        <textarea value={detail} onChange={(e) => setDetail(e.target.value)} placeholder="Describe the issue..." rows={3}
          className="mt-4 w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20" />
        <button onClick={() => onSubmit(reason, detail)} disabled={submitting || !reason}
          className="mt-4 w-full rounded-full bg-red-500 py-3 text-sm font-bold text-white hover:bg-red-600 disabled:opacity-40">
          {submitting ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : "Submit dispute"}
        </button>
      </div>
    </div>
  );
}

export default function CorporatePage() {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const userId = user?.id;

  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [tab, setTab] = useState<"upcoming" | "history">("upcoming");
  const [weekStops, setWeekStops] = useState<Stop[]>([]);
  const [stopsByTrip, setStopsByTrip] = useState<Record<string, Stop[]>>({});
  const [historyStops, setHistoryStops] = useState<Stop[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [exitOpen, setExitOpen] = useState(false);
  const [exitSubmitting, setExitSubmitting] = useState(false);
  const [disputeStop, setDisputeStop] = useState<Stop | null>(null);
  const [disputeSubmitting, setDisputeSubmitting] = useState(false);

  const activeMembership = memberships[activeIdx];

  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const supabase = createClient();

    const { data: mem } = await (supabase as any).from("passenger_b2b_clients")
      .select("*, b2b_clients(*)").eq("passenger_id", userId).order("created_at", { ascending: true });
    setMemberships(mem || []);

    const today = todayIso();
    const weekEnd = addDays(today, 6);

    const { data: week } = await (supabase as any).from("b2b_trip_stops")
      .select("*, b2b_trips!inner(*, b2b_routes(name, direction))")
      .eq("passenger_id", userId).neq("status", "cancelled")
      .gte("b2b_trips.trip_date", today).lte("b2b_trips.trip_date", weekEnd);
    const sortedWeek = (week || []).sort((a: Stop, b: Stop) => a.b2b_trips.trip_date.localeCompare(b.b2b_trips.trip_date));
    setWeekStops(sortedWeek);

    const dispatchedTripIds = [...new Set(sortedWeek.filter((s: Stop) => s.b2b_trips.status === "dispatched").map((s: Stop) => s.b2b_trips.id))] as string[];
    if (dispatchedTripIds.length) {
      const { data: allStops } = await (supabase as any).from("b2b_trip_stops")
        .select("b2b_trip_id, stop_type, actual_pickup_at, arrived_at, status")
        .in("b2b_trip_id", dispatchedTripIds).neq("status", "cancelled");
      const map: Record<string, Stop[]> = {};
      dispatchedTripIds.forEach((tripId) => { map[tripId] = (allStops || []).filter((s: any) => s.b2b_trip_id === tripId); });
      setStopsByTrip(map);
    } else {
      setStopsByTrip({});
    }

    const { data: hist } = await (supabase as any).from("b2b_trip_stops")
      .select("*, b2b_trips!inner(*, b2b_routes(name, direction))")
      .eq("passenger_id", userId).eq("b2b_trips.status", "completed")
      .order("trip_date", { referencedTable: "b2b_trips", ascending: false }).limit(50);
    setHistoryStops(hist || []);

    setLoading(false);
  }, [userId]);

  useEffect(() => {
    if (userLoading) return;
    if (!user) { router.replace("/login?redirect=/corporate"); return; }
    load();
  }, [user, userLoading, router, load]);

  const submitExit = async (reason: string) => {
    if (!activeMembership || !userId) return;
    setExitSubmitting(true);
    try {
      const supabase = createClient();
      await (supabase as any).from("passenger_b2b_clients")
        .update({ exit_requested_at: new Date().toISOString(), exit_reason: reason.trim() })
        .eq("id", activeMembership.id);
      const { data: passenger } = await (supabase as any).from("passengers").select("b2b_client_id").eq("id", userId).maybeSingle();
      if (passenger?.b2b_client_id === activeMembership.b2b_client_id) {
        await (supabase as any).from("passengers").update({ b2b_exit_requested_at: new Date().toISOString(), b2b_exit_reason: reason.trim() }).eq("id", userId);
      }
      setExitOpen(false);
      await load();
    } finally {
      setExitSubmitting(false);
    }
  };

  const cancelExit = async () => {
    if (!activeMembership || !userId) return;
    const supabase = createClient();
    await (supabase as any).from("passenger_b2b_clients").update({ exit_requested_at: null, exit_reason: null }).eq("id", activeMembership.id);
    const { data: passenger } = await (supabase as any).from("passengers").select("b2b_client_id").eq("id", userId).maybeSingle();
    if (passenger?.b2b_client_id === activeMembership.b2b_client_id) {
      await (supabase as any).from("passengers").update({ b2b_exit_requested_at: null, b2b_exit_reason: null }).eq("id", userId);
    }
    setMenuOpen(false);
    load();
  };

  const submitDispute = async (reason: string, detail: string) => {
    if (!disputeStop || !userId) return;
    setDisputeSubmitting(true);
    try {
      const supabase = createClient();
      await (supabase as any).from("b2b_trips").update({
        dispute_status: "open", dispute_reason: reason, dispute_detail: detail,
        dispute_opened_by: userId, dispute_opened_at: new Date().toISOString(),
      }).eq("id", disputeStop.b2b_trips.id);
      setDisputeStop(null);
      await load();
    } finally {
      setDisputeSubmitting(false);
    }
  };

  if (userLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#0b66d1]" />
      </div>
    );
  }

  if (memberships.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="mx-auto max-w-[1000px] px-4 pt-32 sm:px-6 md:px-6 md:pt-36 lg:px-8">
          <AccountTabs />
        </div>
        <div className="mx-auto flex max-w-[1000px] flex-col items-center px-4 pb-24 pt-10 text-center md:px-6">
          <Briefcase className="h-8 w-8 text-gray-300" />
          <p className="mt-3 text-sm text-gray-500">You&apos;re not linked to a corporate account.</p>
          <Link href="/corporate/join" className="mt-4 rounded-full bg-gray-900 px-6 py-2.5 text-sm font-bold text-white hover:bg-gray-800">
            Join Corporate Account
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const client = activeMembership.b2b_clients;
  const isActiveMember = !(client.status && client.status !== "active");
  const exitPending = !!activeMembership.exit_requested_at;
  const today = todayIso();

  const groupedWeek: { date: string; stops: Stop[] }[] = [];
  weekStops.forEach((s) => {
    const d = s.b2b_trips.trip_date;
    let g = groupedWeek.find((x) => x.date === d);
    if (!g) { g = { date: d, stops: [] }; groupedWeek.push(g); }
    g.stops.push(s);
  });
  groupedWeek.forEach((g) => {
    g.stops.sort((a, b) => (DIRECTION_ORDER[a.b2b_trips.b2b_routes?.direction || ""] ?? 2) - (DIRECTION_ORDER[b.b2b_trips.b2b_routes?.direction || ""] ?? 2));
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="mx-auto max-w-[1000px] px-4 sm:px-6 pb-24 pt-32 md:px-6 md:pt-36 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-bold text-gray-900">{client.name}</h1>
            <p className={`mt-1 text-sm ${isActiveMember ? "text-gray-500" : "text-red-500"}`}>{isActiveMember ? "Active member" : "Inactive"}</p>
          </div>
          <div className="relative shrink-0">
            <button onClick={() => setMenuOpen((v) => !v)} className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100">
              <MoreVertical className="h-4 w-4" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-gray-100 bg-white py-1.5 shadow-xl">
                  <button onClick={() => { setMenuOpen(false); exitPending ? cancelExit() : setExitOpen(true); }}
                    className="w-full px-4 py-2.5 text-left text-sm font-semibold text-red-500 hover:bg-gray-50">
                    {exitPending ? "Cancel Exit Request" : "Exit Corporate Account"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mt-6">
          <AccountTabs />
        </div>

        {/* Company switcher */}
        {memberships.length > 1 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {memberships.map((m, i) => (
              <button key={m.id} onClick={() => setActiveIdx(i)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${i === activeIdx ? "border-gray-900 bg-gray-900 text-white" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                {m.b2b_clients.name}
              </button>
            ))}
            <Link href="/corporate/join" className="flex items-center gap-1 rounded-lg border border-dashed border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-500 hover:bg-gray-50">
              <Plus className="h-3 w-3" /> Join Another
            </Link>
          </div>
        )}
        {memberships.length === 1 && (
          <Link href="/corporate/join" className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-800">
            <Plus className="h-3.5 w-3.5" /> Join Another Company
          </Link>
        )}

        {exitPending && (
          <p className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-amber-600">
            <AlertTriangle className="h-3.5 w-3.5" /> Exit request pending approval for {client.name}.
          </p>
        )}

        {/* Tabs */}
        <div className="mt-6 flex items-center gap-6 border-b border-gray-100">
          {[{ key: "upcoming", label: "This Week" }, { key: "history", label: "Ride History" }].map((t) => (
            <button key={t.key} onClick={() => setTab(t.key as typeof tab)}
              className={`-mb-px border-b-2 pb-3 text-sm font-semibold transition ${
                tab === t.key ? "border-[#0b66d1] text-[#0b66d1]" : "border-transparent text-gray-500 hover:text-gray-800"
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === "upcoming" ? (
          <div className="mt-6">
            {groupedWeek.length === 0 ? (
              <p className="py-10 text-center text-sm text-gray-500">No corporate rides scheduled for you this week.</p>
            ) : (
              groupedWeek.map((g) => (
                <div key={g.date} className="mb-6">
                  <div className="mb-2 flex items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-wide text-gray-900">{dateLabel(g.date, today)}</span>
                    <span className="h-px flex-1 bg-gray-100" />
                  </div>
                  <div className="divide-y divide-gray-100">
                    {g.stops.map((s) => {
                      const trip = s.b2b_trips;
                      const route = trip.b2b_routes;
                      const isMissed = s.status === "no_show";
                      const stage = trip.status === "dispatched" && !isMissed ? deriveB2BStage(s, stopsByTrip[trip.id], trip, route?.direction === "return") : null;
                      const statusText = isMissed ? "Missed" : stage ? STAGE_LABEL[stage] : (STATUS_LABEL[trip.status] || trip.status);
                      return (
                        <div key={s.id} className="flex items-center gap-3 py-3">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-gray-900">{route?.name || "Corporate Route"}</p>
                            <div className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-xs">
                              {route?.direction && <span className="font-semibold text-gray-600">{DIRECTION_LABEL[route.direction] || route.direction}</span>}
                              {!isMissed && (s as any).pickup_eta && <span className="text-gray-400">{route?.direction ? "· " : ""}Pickup {fmtTime((s as any).pickup_eta)}</span>}
                              <span className={`font-semibold ${isMissed ? "text-red-500" : "text-gray-900"}`}>
                                {(route?.direction || (!isMissed && (s as any).pickup_eta)) ? "· " : ""}{statusText}
                              </span>
                            </div>
                            {trip.trip_code && <p className="mt-0.5 text-xs text-gray-400">{trip.trip_code}</p>}
                          </div>
                          <ChevronRight className="h-4 w-4 shrink-0 text-gray-300" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="mt-6 divide-y divide-gray-100">
            {historyStops.length === 0 ? (
              <p className="py-10 text-center text-sm text-gray-500">No completed corporate rides yet.</p>
            ) : (
              historyStops.map((s) => {
                const trip = s.b2b_trips;
                const route = trip.b2b_routes;
                const canDispute = trip.status === "completed" && !trip.dispute_status;
                return (
                  <div key={s.id} className="flex items-center gap-3 py-3.5">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-gray-900">{route?.name || "Corporate Route"}</p>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-xs">
                        {route?.direction && <span className="font-semibold text-gray-600">{DIRECTION_LABEL[route.direction] || route.direction}</span>}
                        <span className={s.status === "no_show" ? "text-red-500" : "text-gray-400"}>
                          {route?.direction ? "· " : ""}{s.status === "no_show" ? "Missed" : new Date(`${trip.trip_date}T00:00:00`).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>
                      {trip.trip_code && <p className="mt-0.5 text-xs text-gray-400">{trip.trip_code}</p>}
                      {trip.dispute_status && <p className="mt-1 text-xs font-semibold text-red-500">Dispute {trip.dispute_status}</p>}
                    </div>
                    {canDispute && (
                      <button onClick={() => setDisputeStop(s)} className="shrink-0 text-xs font-semibold text-red-500 hover:text-red-600">
                        Dispute
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {exitOpen && <ExitReasonModal onClose={() => setExitOpen(false)} onSubmit={submitExit} submitting={exitSubmitting} />}
      {disputeStop && <DisputeModal onClose={() => setDisputeStop(null)} onSubmit={submitDispute} submitting={disputeSubmitting} />}

      <Footer />
    </div>
  );
}
