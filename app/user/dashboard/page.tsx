"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Car, Calendar, MapPin, CreditCard, Settings, LogOut,
  ChevronRight, Plus, Star, AlertCircle
} from "lucide-react";

type BookingStatus = "upcoming" | "completed" | "cancelled";

const mockBookings = [
  {
    id: "BD-2025-001",
    status: "upcoming" as BookingStatus,
    date: "Jan 20, 2025",
    time: "8:00 AM",
    pickup: "JFK International Airport, Terminal 4",
    dropoff: "432 Park Avenue, New York, NY",
    vehicle: "First Class",
    fare: 185,
    driver: "Marcus J.",
    rating: null,
  },
  {
    id: "BD-2025-002",
    status: "upcoming" as BookingStatus,
    date: "Jan 23, 2025",
    time: "2:30 PM",
    pickup: "432 Park Avenue, New York, NY",
    dropoff: "Newark Liberty Airport, Terminal C",
    vehicle: "Business Class",
    fare: 95,
    driver: "Assigned soon",
    rating: null,
  },
  {
    id: "BD-2024-089",
    status: "completed" as BookingStatus,
    date: "Dec 18, 2024",
    time: "10:00 AM",
    pickup: "Manhattan, NY",
    dropoff: "Washington D.C.",
    vehicle: "Business SUV",
    fare: 480,
    driver: "David R.",
    rating: 5,
  },
  {
    id: "BD-2024-075",
    status: "completed" as BookingStatus,
    date: "Dec 5, 2024",
    time: "6:00 PM",
    pickup: "LaGuardia Airport",
    dropoff: "Jersey City, NJ",
    vehicle: "Business Class",
    fare: 110,
    driver: "James T.",
    rating: 5,
  },
];

const statusColors: Record<BookingStatus, string> = {
  upcoming: "bg-blue-50 text-[#0b66d1]",
  completed: "bg-emerald-50 text-emerald-600",
  cancelled: "bg-red-50 text-red-500",
};

export default function UserDashboardPage() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  const filtered = mockBookings.filter((b) =>
    activeTab === "upcoming" ? b.status === "upcoming" : b.status !== "upcoming"
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0b66d1]">
              <Image
                src="/B Logo Black Theme.png"
                alt="BlackDrivo"
                width={18}
                height={18}
                className="object-contain invert mix-blend-screen"
              />
            </div>
            <span className="text-lg font-bold text-gray-900">BlackDrivo</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/booking"
              className="rounded-full bg-[#0b66d1] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0952a8]"
            >
              Book a ride
            </Link>
            <button className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-sm font-bold text-gray-600">
              JS
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:py-12">
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          {/* Sidebar nav */}
          <div className="space-y-2">
            <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-[#0b66d1]">
                  JS
                </div>
                <div>
                  <p className="font-semibold text-gray-900">John Smith</p>
                  <p className="text-xs text-gray-500">john@example.com</p>
                </div>
              </div>
              <div className="mt-4 rounded-xl bg-gray-50 border border-gray-100 p-3">
                <p className="text-xs text-gray-400">Member since</p>
                <p className="text-sm font-medium text-gray-900">January 2024</p>
              </div>
            </div>

            <nav className="rounded-2xl bg-white border border-gray-100 shadow-sm p-2">
              {[
                { icon: Calendar, label: "My Bookings", active: true },
                { icon: CreditCard, label: "Payment Methods", active: false },
                { icon: MapPin, label: "Saved Locations", active: false },
                { icon: Settings, label: "Account Settings", active: false },
              ].map((item) => (
                <button
                  key={item.label}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    item.active
                      ? "bg-blue-50 text-[#0b66d1]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              ))}
              <div className="mt-1 border-t border-gray-100 pt-1">
                <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-400 transition hover:bg-gray-50 hover:text-gray-600">
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </nav>
          </div>

          {/* Main content */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "Total Rides", value: "24", icon: Car, sub: "Lifetime" },
                { label: "Total Spent", value: "$2,840", icon: CreditCard, sub: "All time" },
                { label: "Avg Rating Given", value: "4.9 ★", icon: Star, sub: "To drivers" },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5"
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

            {/* Bookings */}
            <div className="rounded-2xl bg-white border border-gray-100 shadow-sm">
              {/* Tabs */}
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
                {filtered.length === 0 ? (
                  <div className="py-12 text-center">
                    <AlertCircle className="mx-auto mb-3 h-8 w-8 text-gray-300" />
                    <p className="text-sm text-gray-500">No {activeTab} bookings</p>
                    <Link href="/booking" className="mt-4 inline-block rounded-full bg-[#0b66d1] px-5 py-2 text-sm font-semibold text-white">
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
                        className="rounded-xl bg-gray-50 border border-gray-100 p-4 transition hover:border-gray-200 hover:shadow-sm"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs text-gray-400">{booking.id}</span>
                              <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusColors[booking.status]}`}>
                                {booking.status}
                              </span>
                            </div>
                            <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
                              <Calendar className="h-3.5 w-3.5" />
                              {booking.date} at {booking.time}
                            </div>
                          </div>
                          <p className="text-lg font-bold text-gray-900">${booking.fare}</p>
                        </div>
                        <div className="mt-3 space-y-1.5 text-sm">
                          <div className="flex items-start gap-2 text-gray-600">
                            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0b66d1]" />
                            <span className="line-clamp-1">{booking.pickup}</span>
                          </div>
                          <div className="flex items-start gap-2 text-gray-600">
                            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-300" />
                            <span className="line-clamp-1">{booking.dropoff}</span>
                          </div>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400">
                          <div className="flex gap-3">
                            <span>{booking.vehicle}</span>
                            <span>·</span>
                            <span>Driver: {booking.driver}</span>
                            {booking.rating && <span>· {booking.rating} ★</span>}
                          </div>
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
