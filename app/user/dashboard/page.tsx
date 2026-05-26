"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Car, Calendar, MapPin, CreditCard, Settings,
  ChevronRight, Plus, Star, AlertCircle, User,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/lib/hooks/useUser";
import ProfileDropdown from "@/components/dashboard/ProfileDropdown";

type BookingStatus = "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";

interface Booking {
  id: string;
  status: BookingStatus;
  pickup_address: string;
  dropoff_address: string;
  scheduled_at: string;
  vehicle_class: string;
  fare_estimate: number;
  fare_final: number | null;
  created_at: string;
}

const UPCOMING_STATUSES: BookingStatus[] = ["pending", "confirmed", "in_progress"];

const statusColors: Record<BookingStatus, string> = {
  pending:     "bg-yellow-50 text-yellow-600",
  confirmed:   "bg-blue-50 text-[#0b66d1]",
  in_progress: "bg-orange-50 text-orange-600",
  completed:   "bg-emerald-50 text-emerald-600",
  cancelled:   "bg-red-50 text-red-500",
};

const statusLabels: Record<BookingStatus, string> = {
  pending:     "Pending",
  confirmed:   "Confirmed",
  in_progress: "In Progress",
  completed:   "Completed",
  cancelled:   "Cancelled",
};

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function memberSince(dateStr?: string | null) {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

export default function UserDashboardPage() {
  const router = useRouter();
  const { user, profile, loading, initials, displayName } = useUser();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/user/dashboard");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    supabase
      .from("bookings")
      .select("*")
      .eq("passenger_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setBookings((data as Booking[]) ?? []);
        setBookingsLoading(false);
      });
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#0b66d1]" />
      </div>
    );
  }

  if (!user) return null;

  const filtered = bookings.filter((b) =>
    activeTab === "upcoming"
      ? UPCOMING_STATUSES.includes(b.status)
      : !UPCOMING_STATUSES.includes(b.status)
  );

  const totalSpent = bookings
    .filter((b) => b.status === "completed")
    .reduce((sum, b) => sum + (b.fare_final ?? b.fare_estimate ?? 0), 0);

  const completedCount = bookings.filter((b) => b.status === "completed").length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-6">
            {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
          <Image
          src="/logo bb.png"
          alt="BlackDrivo"
          width={140}
          height={40}
          className="object-contain transition-all duration-300"/>
          </Link>
            <Link
              href="/user/dashboard"
              className="hidden text-sm font-medium text-[#0b66d1] md:block"
            >
              My Bookings
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/booking"
              className="hidden rounded-full bg-[#0b66d1] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0952a8] sm:block"
            >
              Book a ride
            </Link>
            <ProfileDropdown
              initials={initials}
              displayName={displayName}
              email={user.email ?? ""}
            />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:py-12">
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          {/* Sidebar */}
          <div className="space-y-2">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0b66d1] text-sm font-bold text-white">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-gray-900">{displayName}</p>
                  <p className="truncate text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-3">
                <p className="text-xs text-gray-400">Member since</p>
                <p className="text-sm font-medium text-gray-900">
                  {memberSince(profile?.created_at ?? user.created_at)}
                </p>
              </div>
            </div>

            <nav className="rounded-2xl border border-gray-100 bg-white p-2 shadow-sm">
              <Link
                href="/user/dashboard"
                className="flex w-full items-center gap-3 rounded-xl bg-blue-50 px-3 py-2.5 text-sm font-medium text-[#0b66d1] transition"
              >
                <Calendar className="h-4 w-4" />
                My Bookings
              </Link>
              <Link
                href="/user/payments"
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
              >
                <CreditCard className="h-4 w-4" />
                Payment History
              </Link>
              <Link
                href="/user/profile"
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
              >
                <User className="h-4 w-4" />
                Profile Settings
              </Link>
              <Link
                href="/user/profile#account"
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
              >
                <Settings className="h-4 w-4" />
                Account Details
              </Link>
            </nav>
          </div>

          {/* Main content */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "Total Rides", value: String(bookings.length), icon: Car, sub: "Lifetime" },
                {
                  label: "Total Spent",
                  value: `$${totalSpent.toLocaleString()}`,
                  icon: CreditCard,
                  sub: "Completed rides",
                },
                {
                  label: "Rides Completed",
                  value: String(completedCount),
                  icon: Star,
                  sub: "All time",
                },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
                >
                  <stat.icon className="mb-3 h-5 w-5 text-[#0b66d1]" />
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-xs text-gray-400">{stat.sub}</p>
                </motion.div>
              ))}
            </div>

            {/* Quick book */}
            <div className="flex items-center justify-between rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4">
              <div>
                <p className="font-semibold text-gray-900">Need a ride?</p>
                <p className="text-sm text-gray-600">Book a premium chauffeur in minutes.</p>
              </div>
              <Link
                href="/booking"
                className="flex items-center gap-2 rounded-full bg-[#0b66d1] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0952a8]"
              >
                <Plus className="h-4 w-4" /> New booking
              </Link>
            </div>

            {/* Bookings list */}
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="flex border-b border-gray-100 px-5 pt-4">
                {(["upcoming", "past"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`mr-4 pb-3 text-sm font-medium capitalize transition ${
                      activeTab === tab
                        ? "border-b-2 border-[#0b66d1] text-[#0b66d1]"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab} rides
                  </button>
                ))}
              </div>

              <div className="p-5">
                {bookingsLoading ? (
                  <div className="flex justify-center py-12">
                    <span className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-[#0b66d1]" />
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="py-12 text-center">
                    <AlertCircle className="mx-auto mb-3 h-8 w-8 text-gray-300" />
                    <p className="text-sm text-gray-500">No {activeTab} bookings</p>
                    <Link
                      href="/booking"
                      className="mt-4 inline-block rounded-full bg-[#0b66d1] px-5 py-2 text-sm font-semibold text-white"
                    >
                      Book a ride
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filtered.map((booking) => (
                      <motion.div
                        key={booking.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="rounded-xl border border-gray-100 bg-gray-50 p-4 transition hover:border-gray-200 hover:shadow-sm"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs text-gray-400">
                                {booking.id.slice(0, 12).toUpperCase()}
                              </span>
                              <span
                                className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[booking.status]}`}
                              >
                                {statusLabels[booking.status]}
                              </span>
                            </div>
                            <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
                              <Calendar className="h-3.5 w-3.5" />
                              {formatDate(booking.scheduled_at)}
                            </div>
                          </div>
                          <p className="text-lg font-bold text-gray-900">
                            ${(booking.fare_final ?? booking.fare_estimate)?.toLocaleString() ?? "—"}
                          </p>
                        </div>
                        <div className="mt-3 space-y-1.5 text-sm">
                          <div className="flex items-start gap-2 text-gray-600">
                            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0b66d1]" />
                            <span className="line-clamp-1">{booking.pickup_address}</span>
                          </div>
                          <div className="flex items-start gap-2 text-gray-600">
                            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-300" />
                            <span className="line-clamp-1">{booking.dropoff_address}</span>
                          </div>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400">
                          <span>{booking.vehicle_class}</span>
                          <button className="flex items-center gap-1 text-[#0b66d1] hover:text-[#0952a8]">
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
    </div>
  );
}
