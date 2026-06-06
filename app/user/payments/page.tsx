"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, Calendar, MapPin, AlertCircle, User, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/lib/hooks/useUser";
import ProfileDropdown from "@/components/dashboard/ProfileDropdown";

interface Booking {
  id: string;
  status: string;
  pickup_address: string;
  dropoff_address: string;
  scheduled_at: string;
  vehicle_class: string;
  fare_estimate: number;
  fare_final: number | null;
  created_at: string;
}

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

export default function PaymentsPage() {
  const router = useRouter();
  const { user, loading, initials, displayName } = useUser();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push("/login?redirect=/user/payments");
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    supabase
      .from("bookings")
      .select("*")
      .eq("passenger_id", user.id)
      .eq("status", "completed")
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

  const total = bookings.reduce((sum, b) => sum + (b.fare_final ?? b.fare_estimate ?? 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
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
              className="hidden items-center gap-1.5 text-sm text-gray-500 transition hover:text-gray-900 md:flex"
            >
              <ArrowLeft className="h-4 w-4" /> My Bookings
            </Link>
          </div>
          <ProfileDropdown initials={initials} displayName={displayName} email={user.email ?? ""} />
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-10 md:px-6">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payment History</h1>
            <p className="mt-1 text-sm text-gray-500">All your completed rides and charges.</p>
          </div>
          {bookings.length > 0 && (
            <div className="rounded-2xl border border-gray-100 bg-white px-5 py-3 shadow-sm text-right">
              <p className="text-xs text-gray-400">Total spent</p>
              <p className="text-xl font-bold text-gray-900">${total.toLocaleString()}</p>
            </div>
          )}
        </div>

        {bookingsLoading ? (
          <div className="flex justify-center py-20">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#0b66d1]" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-16 text-center shadow-sm">
            <AlertCircle className="mx-auto mb-3 h-8 w-8 text-gray-300" />
            <p className="text-sm text-gray-500">No completed rides yet.</p>
            <Link
              href="/booking"
              className="mt-4 inline-block rounded-full bg-[#0b66d1] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#0952a8]"
            >
              Book a ride
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((booking, i) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(booking.scheduled_at || booking.created_at)}
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-700">
                      <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0b66d1]" />
                      <span className="line-clamp-1">{booking.pickup_address}</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-700">
                      <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-300" />
                      <span className="line-clamp-1">{booking.dropoff_address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <CreditCard className="h-3.5 w-3.5" />
                      <span className="capitalize">{booking.vehicle_class}</span>
                      <span>·</span>
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-medium text-emerald-600">
                        Completed
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">
                      ${(booking.fare_final ?? booking.fare_estimate)?.toLocaleString() ?? "—"}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-400">charged</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Mobile bottom tab bar */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-gray-100 bg-white lg:hidden">
        {[
          { href: "/user/dashboard", icon: Calendar,  label: "Bookings", active: false },
          { href: "/booking",        icon: Plus,       label: "Book",     active: false },
          { href: "/user/payments",  icon: CreditCard, label: "Payments", active: true  },
          { href: "/user/profile",   icon: User,       label: "Profile",  active: false },
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
