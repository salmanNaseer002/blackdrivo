"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Info, HelpCircle, Tag, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/lib/hooks/useUser";
import { useSiteCountry } from "@/components/providers/CountryProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AccountTabs from "@/components/account/AccountTabs";

interface LoyaltyConfig {
  points_per_ride?: number;
  points_per_dollar?: number;
  redeem_batch_size?: number;
  redeem_value_dollars?: number;
  min_redeem?: number;
  max_redeem_per_booking?: number;
  enabled?: boolean;
  redeem_value_by_country?: Record<string, number>;
}
interface LoyaltyInfo {
  program_name?: string;
  tagline?: string;
  how_it_works?: { title: string; desc: string }[];
}
interface LoyaltyBanner {
  enabled?: boolean;
  type?: "text" | "image";
  image_url?: string;
  title?: string;
  subtitle?: string;
  promo_code?: string;
  bg_color?: string;
  link_url?: string;
}
interface Tx {
  id: string;
  points: number;
  type: string;
  status: string;
  description: string | null;
  created_at: string;
  bookings: { booking_ref: string | null } | null;
}

const DATE_FILTERS = [
  { key: "all", label: "All Time" },
  { key: "7d", label: "Last 7 Days" },
  { key: "30d", label: "Last 30 Days" },
  { key: "90d", label: "Last 3 Months" },
];

const DEFAULT_STEPS = [
  { title: "Book a Ride", desc: "Complete any ride to earn points" },
  { title: "Earn Points", desc: "Points credited when ride is complete" },
  { title: "Redeem Rewards", desc: "Collect points for a discount" },
  { title: "Unlock Next", desc: "After discount used, redeem again" },
];

function fmtNum(n: number) {
  return n.toLocaleString("en-US");
}

export default function OffersPage() {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const { country } = useSiteCountry();
  const sym = country.symbol;

  const [config, setConfig] = useState<LoyaltyConfig>({});
  const [info, setInfo] = useState<LoyaltyInfo>({});
  const [banner, setBanner] = useState<LoyaltyBanner | null>(null);
  const [points, setPoints] = useState(0);
  const [lifetime, setLifetime] = useState(0);
  const [activeRedemption, setActiveRedemption] = useState<Tx | null>(null);
  const [transactions, setTransactions] = useState<Tx[]>([]);
  const [dateFilter, setDateFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [redeemOpen, setRedeemOpen] = useState(false);
  const [redeeming, setRedeeming] = useState(false);
  const [tcOpen, setTcOpen] = useState(false);
  const [howOpen, setHowOpen] = useState(false);
  const [txPage, setTxPage] = useState(1);
  const TX_PAGE_SIZE = 25;

  const REDEEM_BATCH = config.redeem_batch_size || 200;
  const redeemValue = config.redeem_value_by_country?.[country.code] ?? config.redeem_value_dollars ?? 20;
  const POINTS_PER_RIDE = config.points_per_ride || 100;
  const POINTS_PER_DOLLAR = config.points_per_dollar || 10;
  const PROGRAM_ENABLED = config.enabled !== false;
  const canRedeem = PROGRAM_ENABLED && points >= REDEEM_BATCH && !activeRedemption;
  const progressPct = Math.min((points / REDEEM_BATCH) * 100, 100);
  const totalRedeemed = Math.abs(transactions.filter((t) => t.type === "redeem").reduce((s, t) => s + t.points, 0));
  const programName = info.program_name || "BlackDrivo Rewards";
  const steps = info.how_it_works?.length ? info.how_it_works : DEFAULT_STEPS;

  const fetchData = useCallback(async () => {
    if (!user?.id) return;
    const supabase = createClient();
    const [{ data: settings }, { data: pt }, { data: activeTx }] = await Promise.all([
      (supabase as any).from("app_settings").select("key, value").in("key", ["loyalty_points", "loyalty_info", "loyalty_banner"]),
      (supabase as any).from("passenger_points").select("points, lifetime_points").eq("passenger_id", user.id).maybeSingle(),
      (supabase as any).from("points_transactions").select("*, bookings(booking_ref)").eq("passenger_id", user.id).eq("type", "redeem").eq("status", "redeemed").order("created_at", { ascending: false }).limit(1).maybeSingle(),
    ]);
    (settings || []).forEach((row: any) => {
      if (row.key === "loyalty_points") setConfig(row.value || {});
      if (row.key === "loyalty_info") setInfo(row.value || {});
      if (row.key === "loyalty_banner") setBanner(row.value || null);
    });
    setPoints(Math.max(0, pt?.points || 0));
    setLifetime(pt?.lifetime_points || 0);
    setActiveRedemption(activeTx || null);

    let txQ = (supabase as any).from("points_transactions").select("*, bookings(booking_ref)").eq("passenger_id", user.id).order("created_at", { ascending: false });
    if (dateFilter === "7d") txQ = txQ.gte("created_at", new Date(Date.now() - 7 * 86400000).toISOString());
    if (dateFilter === "30d") txQ = txQ.gte("created_at", new Date(Date.now() - 30 * 86400000).toISOString());
    if (dateFilter === "90d") txQ = txQ.gte("created_at", new Date(Date.now() - 90 * 86400000).toISOString());
    const { data: tx } = await txQ;
    setTransactions(tx || []);
    setLoading(false);
  }, [user?.id, dateFilter]);

  useEffect(() => {
    if (userLoading) return;
    if (!user) { router.replace("/login?redirect=/offers"); return; }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, userLoading, dateFilter]);

  useEffect(() => { setTxPage(1); }, [dateFilter]);

  const txTotalPages = Math.max(1, Math.ceil(transactions.length / TX_PAGE_SIZE));
  const pagedTransactions = transactions.slice((txPage - 1) * TX_PAGE_SIZE, txPage * TX_PAGE_SIZE);

  const handleRedeem = async () => {
    if (!user || points < REDEEM_BATCH || activeRedemption) return;
    setRedeeming(true);
    try {
      const supabase = createClient();
      const newPoints = Math.max(0, points - REDEEM_BATCH);
      const { data: newTx, error } = await (supabase as any).from("points_transactions").insert({
        passenger_id: user.id, points: -REDEEM_BATCH, type: "redeem", status: "redeemed",
        description: `Redeemed ${REDEEM_BATCH} pts for ${sym} ${redeemValue} off`,
        redeemed_at: new Date().toISOString(),
      }).select().single();
      if (error) throw error;
      await (supabase as any).from("passenger_points").update({
        points: newPoints, active_redemption_points: REDEEM_BATCH, active_redemption_id: newTx.id,
      }).eq("passenger_id", user.id);
      setRedeemOpen(false);
      await fetchData();
    } catch {
      // no-op — fetchData below will reflect current server state either way
    }
    setRedeeming(false);
  };

  const fmtDate = (iso: string) => new Date(iso).toLocaleString(undefined, { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

  if (userLoading || loading) {
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
            <h1 className="text-2xl font-bold text-gray-900">{programName}</h1>
            <p className="mt-1 text-sm text-gray-500">{info.tagline || "Earn points on every ride"}</p>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setHowOpen(true)} title="How it works" className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-600">
              <HelpCircle className="h-4 w-4" />
            </button>
            <button onClick={() => setTcOpen(true)} title="Terms & Conditions" className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-600">
              <Info className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-6">
          <AccountTabs />
        </div>

        {!PROGRAM_ENABLED && (
          <p className="mt-4 text-sm font-semibold text-red-500">Loyalty program is currently paused</p>
        )}

        {/* Promo banner */}
        {banner?.enabled && (
          banner.type === "image" && banner.image_url ? (
            <a href={banner.link_url || undefined} target={banner.link_url ? "_blank" : undefined} rel="noreferrer"
              className="mt-6 block overflow-hidden rounded-2xl">
              <img src={banner.image_url} alt="Offer" className="h-32 w-full object-cover sm:h-40" />
            </a>
          ) : (banner.title || banner.subtitle || banner.promo_code) ? (
            <a href={banner.link_url || undefined} target={banner.link_url ? "_blank" : undefined} rel="noreferrer"
              className="mt-6 block rounded-2xl p-6" style={{ backgroundColor: banner.bg_color || "#0b66d1" }}>
              {banner.title && <p className="text-lg font-extrabold text-white">{banner.title}</p>}
              {banner.subtitle && <p className="mt-1 text-sm text-white/80">{banner.subtitle}</p>}
              {banner.promo_code && (
                <span className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-white/50 bg-white/20 px-3 py-1.5 text-sm font-extrabold tracking-wide text-white">
                  <Tag className="h-3.5 w-3.5" /> {banner.promo_code}
                </span>
              )}
            </a>
          ) : null
        )}

        {/* Active redemption */}
        {activeRedemption && (
          <div className="mt-8 border-b border-gray-100 pb-5">
            <p className="text-base font-bold text-gray-900">{sym} {redeemValue} discount active</p>
            <p className="mt-1 text-sm text-gray-500">Use it on your next booking — don&apos;t let it go to waste.</p>
          </div>
        )}

        {/* Hero */}
        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Available points</p>
          <p className="mt-1 text-5xl font-extrabold tracking-tight text-gray-900">{fmtNum(points)}</p>
          <p className="mt-2 text-sm text-gray-500">
            {activeRedemption
              ? `${sym} ${redeemValue} discount active on next ride`
              : canRedeem
                ? `Ready — redeem ${REDEEM_BATCH} pts for ${sym} ${redeemValue} off`
                : `${REDEEM_BATCH - points} more pts for ${sym} ${redeemValue} off`}
          </p>

          <div className="mt-4 h-1.5 rounded-full bg-gray-100">
            <div className="h-1.5 rounded-full bg-gray-900 transition-all" style={{ width: `${progressPct}%` }} />
          </div>
          <p className="mt-1.5 text-xs text-gray-400">{points}/{REDEEM_BATCH} pts</p>

          <button
            onClick={() => { if (canRedeem) setRedeemOpen(true); }}
            disabled={!canRedeem && !activeRedemption}
            className={`mt-5 w-full rounded-full py-3.5 text-sm font-bold transition sm:w-auto sm:px-8 ${
              canRedeem ? "bg-gray-900 text-white hover:bg-gray-800" : "cursor-not-allowed bg-gray-100 text-gray-400"
            }`}
          >
            {activeRedemption ? `${sym} ${redeemValue} discount active` : canRedeem ? `Redeem ${REDEEM_BATCH} pts → ${sym} ${redeemValue} off` : `Need ${Math.max(0, REDEEM_BATCH - points)} more pts`}
          </button>
        </div>

        {/* Stats */}
        <div className="mt-10 grid grid-cols-3 divide-x divide-gray-100 border-y border-gray-100 py-5">
          {[
            { label: "Lifetime earned", value: fmtNum(lifetime) },
            { label: "Total redeemed", value: fmtNum(totalRedeemed) },
            { label: "Per ride", value: `+${POINTS_PER_RIDE}` },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-lg font-bold text-gray-900">{s.value}</p>
              <p className="mt-1 text-[11px] text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>

        {/* History — full width */}
        <div className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wide text-gray-400">History</h2>
            <span className="text-xs text-gray-400">{transactions.length} transactions</span>
          </div>

          <div className="mt-4 flex items-center gap-5 border-b border-gray-100">
            {DATE_FILTERS.map((f) => (
              <button key={f.key} onClick={() => setDateFilter(f.key)}
                className={`-mb-px border-b-2 pb-2.5 text-xs font-semibold transition ${
                  dateFilter === f.key ? "border-[#0b66d1] text-[#0b66d1]" : "border-transparent text-gray-500 hover:text-gray-800"
                }`}>
                {f.label}
              </button>
            ))}
          </div>

          <div className="mt-2 divide-y divide-gray-100">
            {transactions.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-500">No transactions yet</p>
            ) : (
              pagedTransactions.map((tx) => {
                const isEarn = tx.points > 0;
                return (
                  <div key={tx.id} className="flex items-center justify-between py-3.5">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900">
                        {tx.type === "earn" ? "Points Earned" : tx.type === "redeem" ? "Points Redeemed" : "Points Expired"}
                      </p>
                      <p className="truncate text-xs text-gray-500">{tx.description || (tx.bookings?.booking_ref ? `Booking ${tx.bookings.booking_ref}` : "—")}</p>
                      <p className="mt-0.5 text-[11px] text-gray-400">{fmtDate(tx.created_at)}</p>
                    </div>
                    <span className={`shrink-0 text-base font-bold ${isEarn ? "text-gray-900" : "text-gray-400"}`}>
                      {isEarn ? "+" : ""}{Math.abs(tx.points)}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination — same "Showing X–Y of Z" pattern as Journey */}
          {transactions.length > 0 && (
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 py-4">
              <span className="text-xs text-gray-500">
                Showing {Math.min((txPage - 1) * TX_PAGE_SIZE + 1, transactions.length)}–{Math.min(txPage * TX_PAGE_SIZE, transactions.length)} of {transactions.length.toLocaleString()}
              </span>
              <div className="flex flex-wrap items-center gap-1">
                <button onClick={() => setTxPage((p) => p - 1)} disabled={txPage === 1}
                  className="rounded-md border border-gray-200 px-3 py-1 text-xs text-gray-600 disabled:opacity-40">
                  ← Prev
                </button>
                {Array.from({ length: Math.min(txTotalPages, 7) }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setTxPage(p)}
                    className={`rounded-md border px-2.5 py-1 text-xs ${p === txPage ? "border-[#0b66d1] bg-[#0b66d1] font-bold text-white" : "border-gray-200 text-gray-600"}`}>
                    {p}
                  </button>
                ))}
                <button onClick={() => setTxPage((p) => p + 1)} disabled={txPage === txTotalPages}
                  className="rounded-md border border-gray-200 px-3 py-1 text-xs text-gray-600 disabled:opacity-40">
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Redeem modal */}
      {redeemOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 sm:items-center" onClick={() => setRedeemOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-t-3xl bg-white p-6 sm:rounded-2xl">
            <h3 className="text-center text-lg font-bold text-gray-900">Redeem points</h3>
            <p className="mt-1.5 text-center text-sm text-gray-500">Redeem {REDEEM_BATCH} points for {sym} {redeemValue} off your next ride</p>
            <div className="mt-5 divide-y divide-gray-100 border-t border-gray-100">
              {[
                { label: "Points to redeem", value: `${REDEEM_BATCH} pts` },
                { label: "Discount value", value: `${sym} ${redeemValue} off next ride` },
                { label: "Remaining points", value: `${Math.max(0, points - REDEEM_BATCH)} pts` },
                { label: "Next redemption", value: "After discount is used" },
              ].map((r) => (
                <div key={r.label} className="flex items-center justify-between py-2.5">
                  <span className="text-sm text-gray-500">{r.label}</span>
                  <span className="text-sm font-semibold text-gray-900">{r.value}</span>
                </div>
              ))}
            </div>
            <button onClick={handleRedeem} disabled={redeeming}
              className="mt-5 w-full rounded-full bg-gray-900 py-3 text-sm font-bold text-white transition hover:bg-gray-800 disabled:opacity-60">
              {redeeming ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : "Confirm redeem"}
            </button>
            <button onClick={() => setRedeemOpen(false)} className="mt-2 w-full py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Cancel</button>
          </div>
        </div>
      )}

      {/* How it works modal */}
      {howOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 sm:items-center" onClick={() => setHowOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="max-h-[80vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-6 sm:rounded-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">How it works</h3>
              <button onClick={() => setHowOpen(false)} className="text-gray-400 hover:text-gray-700"><X className="h-4 w-4" /></button>
            </div>
            <div className="mt-4 divide-y divide-gray-100">
              {steps.map((step, i) => (
                <div key={i} className="py-3.5">
                  <p className="text-sm font-semibold text-gray-900">{i + 1}. {step.title}</p>
                  <p className="mt-0.5 text-sm text-gray-500">{step.desc}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setHowOpen(false)} className="mt-4 w-full rounded-full bg-gray-900 py-3 text-sm font-bold text-white hover:bg-gray-800">Got it</button>
          </div>
        </div>
      )}

      {/* T&C modal */}
      {tcOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 sm:items-center" onClick={() => setTcOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="max-h-[80vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-6 sm:rounded-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Terms & Conditions</h3>
              <button onClick={() => setTcOpen(false)} className="text-gray-400 hover:text-gray-700"><X className="h-4 w-4" /></button>
            </div>
            <div className="mt-4 space-y-4">
              {[
                { title: "Earning Points", body: `Earn ${POINTS_PER_RIDE} points per completed ride. 1 point = ${sym} ${(1 / POINTS_PER_DOLLAR).toFixed(2)}.` },
                { title: "Redemption", body: `Redeem ${REDEEM_BATCH} points for ${sym} ${redeemValue} off. Only one active redemption at a time.` },
                { title: "Active Discount", body: "Once redeemed, your discount stays active until used on a booking. Next redemption unlocks after current one is consumed." },
                { title: "Expiry", body: "Points expire after 12 consecutive months of inactivity. Redeemed points cannot be reversed." },
                { title: "Eligibility", body: "Points apply to completed rides only. Cancelled or disputed rides do not earn points." },
                { title: "Changes", body: "BlackDrivo reserves the right to modify the loyalty program at any time." },
              ].map((item) => (
                <div key={item.title}>
                  <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-gray-500">{item.body}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setTcOpen(false)} className="mt-6 w-full rounded-full bg-gray-900 py-3 text-sm font-bold text-white hover:bg-gray-800">Got it</button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
