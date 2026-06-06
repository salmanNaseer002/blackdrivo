"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Car, Calendar, MapPin, CreditCard, Settings,
  ChevronRight, Plus, Star, AlertCircle, User,
  ArrowRight, Check, ChevronDown,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/lib/hooks/useUser";
import ProfileDropdown from "@/components/dashboard/ProfileDropdown";

// ── Types ─────────────────────────────────────────────────────────
type BookingStatus = "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
interface Booking {
  id: string; status: BookingStatus;
  pickup_address: string; dropoff_address: string;
  scheduled_at: string; vehicle_class: string;
  fare_estimate: number; fare_final: number | null; created_at: string;
}

const UPCOMING: BookingStatus[] = ["pending", "confirmed", "in_progress"];
const STATUS_COLORS: Record<BookingStatus, string> = {
  pending:     "bg-yellow-50 text-yellow-600",
  confirmed:   "bg-blue-50 text-[#0b66d1]",
  in_progress: "bg-orange-50 text-orange-600",
  completed:   "bg-emerald-50 text-emerald-600",
  cancelled:   "bg-red-50 text-red-500",
};
const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: "Pending", confirmed: "Confirmed", in_progress: "In Progress",
  completed: "Completed", cancelled: "Cancelled",
};

function fmtDate(d: string) {
  try { return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }
  catch { return d; }
}
function memberSince(d?: string | null) {
  if (!d) return "—";
  try { return new Date(d).toLocaleDateString("en-US", { month: "long", year: "numeric" }); }
  catch { return "—"; }
}

const inputClass = "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20";

// ── Passenger Profile Completion Form ─────────────────────────────
function PassengerProfileForm({ user, onComplete }: { user: any; onComplete: () => void }) {
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || "");
  const [phone,    setPhone]    = useState(user?.user_metadata?.phone || "");
  const [gender,   setGender]   = useState<"male" | "female" | "">("");
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!fullName.trim()) { setError("Please enter your full name"); return; }
    if (!phone.trim())    { setError("Please enter your phone number"); return; }
    if (!gender)          { setError("Please select your gender"); return; }

    setSaving(true);
    try {
      const supabase = createClient();
      const { error: updateError } = await (supabase as any)
        .from("users")
        .update({
          full_name:  fullName.trim(),
          name:       fullName.trim(),
          phone:      phone.trim(),
          gender:     gender,
          user_type:  "passenger_driver",
        })
        .eq("id", user.id);

      if (updateError) throw updateError;
      onComplete();
    } catch (err: any) {
      setError(err.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md">

        <div className="mb-6 flex justify-center">
          <Link href="/">
            <Image src="/logo bb.png" alt="BlackDrivo" width={140} height={40} className="object-contain" />
          </Link>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">
          {/* Header */}
          <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0b66d1]">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Complete your passenger profile</p>
                <p className="text-xs text-gray-500 mt-0.5">You're logged in as a driver. Fill this to also use BlackDrivo as a passenger.</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">Full Name *</label>
              <input value={fullName} onChange={e => setFullName(e.target.value)}
                placeholder="John Smith" className={inputClass} />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">Phone Number *</label>
              <input value={phone} onChange={e => setPhone(e.target.value)}
                placeholder="+1 555 000 0000" className={inputClass} />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">Gender *</label>
              <div className="grid grid-cols-2 gap-3">
                {(["male", "female"] as const).map(g => (
                  <button key={g} type="button" onClick={() => setGender(g)}
                    className={`flex items-center justify-center rounded-xl border py-3 text-sm font-medium transition ${gender === g ? "border-[#0b66d1] bg-blue-50 text-[#0b66d1]" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b66d1] py-3.5 text-sm font-semibold text-white transition hover:bg-[#0952a8] disabled:opacity-60">
              {saving
                ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                : <><Check className="h-4 w-4" /> Complete Profile</>
              }
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────
export default function UserDashboardPage() {
  const router   = useRouter();
  const { user, profile, loading, userType, isDriver, initials, displayName } = useUser();

  const [bookings,        setBookings]        = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [activeTab,       setActiveTab]       = useState<"upcoming" | "past">("upcoming");
  const [profileComplete, setProfileComplete] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/login?redirect=/user/dashboard");
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    supabase.from("bookings").select("*")
      .eq("passenger_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setBookings((data as Booking[]) ?? []);
        setBookingsLoading(false);
      });
  }, [user]);

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#0b66d1]" />
    </div>
  );

  if (!user) return null;

  // Driver logged in as passenger — show profile completion form
  // unless they've already completed it (user_type = 'passenger_driver')
  // or just completed it this session
  if (isDriver && userType === "driver" && !profileComplete) {
    return <PassengerProfileForm user={user} onComplete={() => setProfileComplete(true)} />;
  }

  const filtered     = bookings.filter(b => activeTab === "upcoming" ? UPCOMING.includes(b.status) : !UPCOMING.includes(b.status));
  const totalSpent   = bookings.filter(b => b.status === "completed").reduce((s, b) => s + (b.fare_final ?? b.fare_estimate ?? 0), 0);
  const completedCnt = bookings.filter(b => b.status === "completed").length;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-gray-100 bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center shrink-0">
              <Image src="/logo bb.png" alt="BlackDrivo" width={140} height={40} className="object-contain" priority />
            </Link>
            <Link href="/user/dashboard" className="hidden text-sm font-medium text-[#0b66d1] md:block">My Bookings</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/booking" className="rounded-full bg-[#0b66d1] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0952a8]">
              Book a ride
            </Link>
            <ProfileDropdown initials={initials} displayName={displayName} email={user.email ?? ""} />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:py-12">
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">

          {/* Sidebar — full on desktop, compact on mobile */}
          <div className="space-y-2">
            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0b66d1] text-sm font-bold text-white">{initials}</div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-gray-900">{displayName}</p>
                  <p className="truncate text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="mt-3 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2">
                <p className="text-xs text-gray-400">Member since</p>
                <p className="text-sm font-medium text-gray-900">{memberSince(profile?.created_at ?? user.created_at)}</p>
              </div>
            </div>
            {/* Sidebar nav — hidden on mobile, replaced by bottom tab bar */}
            <nav className="hidden rounded-2xl border border-gray-100 bg-white p-2 shadow-sm lg:block">
              <Link href="/user/dashboard" className="flex w-full items-center gap-3 rounded-xl bg-blue-50 px-3 py-3 text-sm font-medium text-[#0b66d1] transition">
                <Calendar className="h-4 w-4" /> My Bookings
              </Link>
              <Link href="/user/payments" className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50">
                <CreditCard className="h-4 w-4" /> Payment History
              </Link>
              <Link href="/user/profile" className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50">
                <User className="h-4 w-4" /> Profile Settings
              </Link>
              <Link href="/user/profile#account" className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50">
                <Settings className="h-4 w-4" /> Account Details
              </Link>
            </nav>
          </div>

          {/* Main */}
          <div className="space-y-5">
            {/* Stats — 2 cols on mobile, 3 on sm+ */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:gap-4">
              {[
                { label: "Total Rides",     value: String(bookings.length),           icon: Car,        sub: "Lifetime"       },
                { label: "Total Spent",     value: `$${totalSpent.toLocaleString()}`,  icon: CreditCard, sub: "Completed rides" },
                { label: "Completed",       value: String(completedCnt),              icon: Star,       sub: "All time"       },
              ].map(s => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm lg:p-5">
                  <s.icon className="mb-2 h-5 w-5 text-[#0b66d1]" />
                  <p className="text-xl font-bold text-gray-900 lg:text-2xl">{s.value}</p>
                  <p className="text-xs font-medium text-gray-600 sm:text-sm">{s.label}</p>
                  <p className="text-xs text-gray-400">{s.sub}</p>
                </motion.div>
              ))}
            </div>

            {/* Quick book */}
            <div className="flex items-center justify-between rounded-2xl border border-blue-100 bg-blue-50 px-4 py-4 sm:px-5">
              <div>
                <p className="font-semibold text-gray-900">Need a ride?</p>
                <p className="text-sm text-gray-500">Book a premium chauffeur in minutes.</p>
              </div>
              <Link href="/booking" className="flex shrink-0 items-center gap-2 rounded-full bg-[#0b66d1] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0952a8] sm:px-5">
                <Plus className="h-4 w-4" /> <span className="hidden sm:inline">New booking</span><span className="sm:hidden">Book</span>
              </Link>
            </div>

            {/* Bookings list */}
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="flex border-b border-gray-100 px-4 pt-4 sm:px-5">
                {(["upcoming", "past"] as const).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`mr-5 pb-3 text-sm font-medium capitalize transition ${activeTab === tab ? "border-b-2 border-[#0b66d1] text-[#0b66d1]" : "text-gray-500 hover:text-gray-700"}`}>
                    {tab} rides
                  </button>
                ))}
              </div>
              <div className="p-4 sm:p-5">
                {bookingsLoading ? (
                  <div className="flex justify-center py-12">
                    <span className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-[#0b66d1]" />
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="py-12 text-center">
                    <AlertCircle className="mx-auto mb-3 h-8 w-8 text-gray-300" />
                    <p className="text-sm text-gray-500">No {activeTab} bookings</p>
                    <Link href="/booking" className="mt-4 inline-block rounded-full bg-[#0b66d1] px-5 py-2.5 text-sm font-semibold text-white">
                      Book a ride
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filtered.map(b => (
                      <motion.div key={b.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="rounded-xl border border-gray-100 bg-gray-50 p-4 transition hover:border-gray-200 hover:shadow-sm">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono text-xs text-gray-400">{b.id.slice(0, 10).toUpperCase()}</span>
                              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[b.status]}`}>{STATUS_LABELS[b.status]}</span>
                            </div>
                            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-500 sm:text-sm">
                              <Calendar className="h-3.5 w-3.5 shrink-0" />{fmtDate(b.scheduled_at)}
                            </div>
                          </div>
                          <p className="shrink-0 text-base font-bold text-gray-900 sm:text-lg">${(b.fare_final ?? b.fare_estimate)?.toLocaleString() ?? "—"}</p>
                        </div>
                        <div className="mt-3 space-y-1.5 text-sm">
                          <div className="flex items-start gap-2 text-gray-600">
                            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0b66d1]" />
                            <span className="line-clamp-1">{b.pickup_address}</span>
                          </div>
                          <div className="flex items-start gap-2 text-gray-600">
                            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-300" />
                            <span className="line-clamp-1">{b.dropoff_address}</span>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                          <span className="capitalize">{b.vehicle_class?.replace(/_/g, " ")}</span>
                          <button className="flex items-center gap-1 py-1 text-[#0b66d1] hover:text-[#0952a8]">
                            Details <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile bottom tab bar — hidden on desktop */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-gray-100 bg-white lg:hidden">
        {[
          { href: "/user/dashboard", icon: Calendar,   label: "Bookings", active: true  },
          { href: "/booking",        icon: Plus,        label: "Book",     active: false },
          { href: "/user/payments",  icon: CreditCard,  label: "Payments", active: false },
          { href: "/user/profile",   icon: User,        label: "Profile",  active: false },
        ].map(item => (
          <Link key={item.href} href={item.href}
            className={`flex flex-1 flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors ${
              item.active ? "text-[#0b66d1]" : "text-gray-400 hover:text-gray-600"
            }`}>
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
