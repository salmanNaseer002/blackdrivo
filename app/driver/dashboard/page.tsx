"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Car, Calendar, MapPin, Clock, DollarSign, Settings, LogOut,
  CheckCircle, XCircle, AlertCircle, ToggleLeft, ToggleRight, Star
} from "lucide-react";

type RideStatus = "assigned" | "in_progress" | "completed" | "declined";

const mockRides = [
  {
    id: "BD-2025-015",
    status: "assigned" as RideStatus,
    date: "Today",
    time: "3:30 PM",
    pickup: "JFK International Airport, Terminal 2",
    dropoff: "340 W 42nd St, New York, NY",
    vehicle: "Business Class",
    fare: 145,
    passenger: "Sarah M.",
    distance: "18 mi",
  },
  {
    id: "BD-2025-016",
    status: "assigned" as RideStatus,
    date: "Today",
    time: "7:00 PM",
    pickup: "The Plaza Hotel, New York, NY",
    dropoff: "Newark Liberty Airport, Terminal B",
    vehicle: "Business Class",
    fare: 120,
    passenger: "Robert T.",
    distance: "16 mi",
  },
  {
    id: "BD-2025-010",
    status: "completed" as RideStatus,
    date: "Yesterday",
    time: "9:00 AM",
    pickup: "LaGuardia Airport",
    dropoff: "Jersey City, NJ",
    vehicle: "Business Class",
    fare: 95,
    passenger: "Emily K.",
    distance: "14 mi",
  },
  {
    id: "BD-2025-008",
    status: "completed" as RideStatus,
    date: "Jan 17, 2025",
    time: "2:00 PM",
    pickup: "Midtown Manhattan",
    dropoff: "Brooklyn, NY",
    vehicle: "Business Class",
    fare: 80,
    passenger: "Michael P.",
    distance: "9 mi",
  },
];

const statusStyles: Record<RideStatus, string> = {
  assigned: "bg-blue-50 text-[#0b66d1]",
  in_progress: "bg-amber-50 text-amber-600",
  completed: "bg-emerald-50 text-emerald-600",
  declined: "bg-red-50 text-red-500",
};

export default function DriverDashboardPage() {
  const [isAvailable, setIsAvailable] = useState(true);
  const [activeTab, setActiveTab] = useState<"upcoming" | "history">("upcoming");

  const filtered = mockRides.filter((r) =>
    activeTab === "upcoming"
      ? r.status === "assigned" || r.status === "in_progress"
      : r.status === "completed" || r.status === "declined"
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
            <button
              onClick={() => setIsAvailable(!isAvailable)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                isAvailable
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                  : "bg-gray-100 text-gray-500 border border-gray-200"
              }`}
            >
              {isAvailable ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
              {isAvailable ? "Online" : "Offline"}
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-sm font-bold text-gray-600">
              MJ
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:py-12">
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          {/* Sidebar */}
          <div className="space-y-3">
            <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-[#0b66d1]">
                  MJ
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Marcus Johnson</p>
                  <p className="text-xs text-gray-500">driver@example.com</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-gray-50 border border-gray-100 p-3 text-center">
                  <p className="text-lg font-bold text-gray-900">4.97</p>
                  <p className="text-xs text-gray-500">Rating</p>
                </div>
                <div className="rounded-xl bg-gray-50 border border-gray-100 p-3 text-center">
                  <p className="text-lg font-bold text-gray-900">248</p>
                  <p className="text-xs text-gray-500">Total rides</p>
                </div>
              </div>
              <div className={`mt-3 flex items-center justify-between rounded-xl p-3 ${isAvailable ? "bg-emerald-50 border border-emerald-100" : "bg-gray-50 border border-gray-100"}`}>
                <span className="text-sm font-medium text-gray-900">Availability</span>
                <button onClick={() => setIsAvailable(!isAvailable)}>
                  {isAvailable
                    ? <ToggleRight className="h-5 w-5 text-emerald-500" />
                    : <ToggleLeft className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
            </div>

            <nav className="rounded-2xl bg-white border border-gray-100 shadow-sm p-2">
              {[
                { icon: Calendar, label: "My Rides", active: true },
                { icon: DollarSign, label: "Earnings", active: false },
                { icon: Star, label: "Reviews", active: false },
                { icon: Car, label: "My Vehicle", active: false },
                { icon: Settings, label: "Settings", active: false },
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
          <div className="space-y-5">
            {/* Earnings overview */}
            <div className="grid gap-4 sm:grid-cols-4">
              {[
                { label: "Today's Earnings", value: "$265", icon: DollarSign, highlight: true },
                { label: "This Week", value: "$1,420", icon: DollarSign, highlight: false },
                { label: "This Month", value: "$5,890", icon: DollarSign, highlight: false },
                { label: "Upcoming Rides", value: "2", icon: Calendar, highlight: false },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
                  <stat.icon className="mb-2 h-4 w-4 text-[#0b66d1]" />
                  <p className={`text-2xl font-bold ${stat.highlight ? "text-emerald-600" : "text-gray-900"}`}>{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Status alert if offline */}
            {!isAvailable && (
              <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                <div className="text-sm">
                  <p className="font-medium text-gray-900">You are currently offline</p>
                  <p className="text-gray-600">Toggle your availability to receive ride requests.</p>
                </div>
                <button
                  onClick={() => setIsAvailable(true)}
                  className="ml-auto rounded-full bg-amber-100 px-4 py-1.5 text-xs font-semibold text-amber-600 hover:bg-amber-200 transition"
                >
                  Go online
                </button>
              </div>
            )}

            {/* Rides table */}
            <div className="rounded-2xl bg-white border border-gray-100 shadow-sm">
              <div className="flex border-b border-gray-100 px-5 pt-4">
                {(["upcoming", "history"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`mr-4 pb-3 text-sm font-medium capitalize transition ${
                      activeTab === tab
                        ? "border-b-2 border-[#0b66d1] text-[#0b66d1]"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab === "upcoming" ? "Upcoming rides" : "Ride history"}
                  </button>
                ))}
              </div>

              <div className="p-5 space-y-3">
                {filtered.length === 0 ? (
                  <div className="py-10 text-center">
                    <Clock className="mx-auto mb-3 h-7 w-7 text-gray-300" />
                    <p className="text-sm text-gray-500">No rides to show</p>
                  </div>
                ) : (
                  filtered.map((ride) => (
                    <motion.div
                      key={ride.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="rounded-xl bg-gray-50 border border-gray-100 p-4 transition hover:border-gray-200"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-gray-400">{ride.id}</span>
                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusStyles[ride.status]}`}>
                              {ride.status.replace("_", " ")}
                            </span>
                          </div>
                          <div className="mt-1.5 flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{ride.date}, {ride.time}</span>
                            <span>{ride.distance}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">${ride.fare}</p>
                          <p className="text-xs text-gray-400">Passenger: {ride.passenger}</p>
                        </div>
                      </div>
                      <div className="mt-3 space-y-1.5">
                        <div className="flex items-start gap-2 text-sm text-gray-600">
                          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0b66d1]" />
                          <span className="line-clamp-1">{ride.pickup}</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm text-gray-600">
                          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-300" />
                          <span className="line-clamp-1">{ride.dropoff}</span>
                        </div>
                      </div>
                      {ride.status === "assigned" && (
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
