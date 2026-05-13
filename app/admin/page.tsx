"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Car, Users, Calendar, DollarSign, TrendingUp, CheckCircle, XCircle,
  AlertCircle, Search, Shield
} from "lucide-react";

const stats = [
  { label: "Total Bookings", value: "1,284", change: "+12%", icon: Calendar, color: "text-[#0b66d1]" },
  { label: "Active Drivers", value: "47", change: "+3", icon: Car, color: "text-emerald-600" },
  { label: "Total Revenue", value: "$58,420", change: "+8%", icon: DollarSign, color: "text-gray-900" },
  { label: "Active Users", value: "892", change: "+24", icon: Users, color: "text-gray-900" },
];

const recentBookings = [
  { id: "BD-2025-089", user: "Sarah Chen", driver: "Marcus J.", pickup: "JFK Airport", dropoff: "Midtown Manhattan", fare: 185, status: "completed", date: "Today, 2:00 PM" },
  { id: "BD-2025-088", user: "Michael Torres", driver: "David R.", pickup: "Newark Airport", dropoff: "Jersey City, NJ", fare: 95, status: "in_progress", date: "Today, 1:30 PM" },
  { id: "BD-2025-087", user: "Amanda Patel", driver: "Unassigned", pickup: "LaGuardia Airport", dropoff: "Brooklyn, NY", fare: 110, status: "pending", date: "Today, 3:00 PM" },
  { id: "BD-2025-086", user: "James Wright", driver: "Robert H.", pickup: "Grand Central", dropoff: "White Plains, NY", fare: 145, status: "confirmed", date: "Today, 4:30 PM" },
  { id: "BD-2025-085", user: "Rachel Foster", driver: "Chris M.", pickup: "Park Avenue", dropoff: "Boston, MA", fare: 480, status: "cancelled", date: "Yesterday" },
];

const pendingDrivers = [
  { name: "Anthony Rodriguez", vehicle: "2023 Mercedes E-Class", submitted: "Jan 18, 2025", docs: "3/4" },
  { name: "Jennifer Kim", vehicle: "2022 BMW 5 Series", submitted: "Jan 17, 2025", docs: "4/4" },
  { name: "Carlos Martinez", vehicle: "2021 Cadillac Escalade", submitted: "Jan 16, 2025", docs: "2/4" },
];

const statusStyles: Record<string, string> = {
  completed: "bg-emerald-50 text-emerald-600",
  in_progress: "bg-amber-50 text-amber-600",
  pending: "bg-gray-100 text-gray-500",
  confirmed: "bg-blue-50 text-[#0b66d1]",
  cancelled: "bg-red-50 text-red-500",
};

type AdminTab = "bookings" | "drivers" | "users" | "analytics";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("bookings");
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
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
            <span className="rounded-full border border-gray-200 bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Shield className="h-4 w-4 text-[#0b66d1]" />
            <span className="text-sm text-gray-500">admin@blackdrivo.com</span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:py-10">
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">Overview and management of all platform operations.</p>
        </div>

        {/* Stats */}
        <div className="mb-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5"
            >
              <div className="mb-3 flex items-center justify-between">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600">
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-5 flex gap-1 rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
          {(["bookings", "drivers", "users", "analytics"] as AdminTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 rounded-lg py-2.5 text-sm font-medium capitalize transition ${
                activeTab === tab
                  ? "bg-[#0b66d1] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="mb-5 relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${activeTab}...`}
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none ring-[#0b66d1] focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20 transition"
          />
        </div>

        {/* Bookings tab */}
        {activeTab === "bookings" && (
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase tracking-widest text-gray-400">
                    <th className="px-5 py-3.5">ID</th>
                    <th className="px-5 py-3.5">Passenger</th>
                    <th className="px-5 py-3.5 hidden md:table-cell">Driver</th>
                    <th className="px-5 py-3.5 hidden lg:table-cell">Route</th>
                    <th className="px-5 py-3.5">Fare</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5">Date</th>
                    <th className="px-5 py-3.5">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings
                    .filter((b) => !search || b.id.toLowerCase().includes(search.toLowerCase()) || b.user.toLowerCase().includes(search.toLowerCase()))
                    .map((booking, i) => (
                      <tr key={booking.id} className={`border-b border-gray-50 transition hover:bg-gray-50 ${i === recentBookings.length - 1 ? "border-0" : ""}`}>
                        <td className="px-5 py-4 font-mono text-xs text-gray-400">{booking.id}</td>
                        <td className="px-5 py-4 font-medium text-gray-900">{booking.user}</td>
                        <td className="hidden px-5 py-4 text-gray-600 md:table-cell">{booking.driver}</td>
                        <td className="hidden px-5 py-4 lg:table-cell">
                          <p className="text-xs text-gray-500 truncate max-w-[180px]">{booking.pickup} → {booking.dropoff}</p>
                        </td>
                        <td className="px-5 py-4 font-semibold text-gray-900">${booking.fare}</td>
                        <td className="px-5 py-4">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusStyles[booking.status]}`}>
                            {booking.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-xs text-gray-400">{booking.date}</td>
                        <td className="px-5 py-4">
                          <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 transition hover:border-gray-300 hover:bg-gray-50">
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Drivers tab */}
        {activeTab === "drivers" && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="h-4 w-4 text-[#0b66d1]" />
                <p className="text-sm font-semibold text-gray-900">{pendingDrivers.length} pending driver applications</p>
              </div>
              <div className="space-y-3">
                {pendingDrivers.map((driver) => (
                  <div key={driver.name} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white border border-gray-100 px-4 py-3 shadow-sm">
                    <div>
                      <p className="font-medium text-gray-900">{driver.name}</p>
                      <p className="text-xs text-gray-500">{driver.vehicle} · Submitted {driver.submitted}</p>
                      <p className="mt-0.5 text-xs text-gray-400">Documents: {driver.docs} uploaded</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex items-center gap-1.5 rounded-lg bg-[#0b66d1] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#0952a8]">
                        <CheckCircle className="h-3.5 w-3.5" /> Approve
                      </button>
                      <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50">
                        <XCircle className="h-3.5 w-3.5" /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
              <h3 className="mb-4 font-semibold text-gray-900">Active Drivers (47)</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-xl bg-gray-50 border border-gray-100 p-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-[#0b66d1]">
                        {["MJ", "DR", "RT", "CH", "JK", "SW"][i]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{["Marcus J.", "David R.", "Robert T.", "Chris H.", "James K.", "Steve W."][i]}</p>
                        <p className="text-xs text-gray-500">4.9 ★ · {[248, 189, 312, 156, 92, 445][i]} rides</p>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span className="text-xs text-emerald-600">Online</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users tab */}
        {activeTab === "users" && (
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
            <p className="mb-4 text-sm font-semibold text-gray-900">Registered Users (892)</p>
            <div className="space-y-2">
              {["Sarah Chen", "Michael Torres", "Amanda Patel", "James Wright", "Rachel Foster", "David Kim"].map((user, i) => (
                <div key={user} className="flex items-center justify-between rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-[#0b66d1]">
                      {user[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user}</p>
                      <p className="text-xs text-gray-500">{[12, 8, 24, 3, 17, 6][i]} rides · Joined 2024</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 transition hover:bg-gray-100">
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics tab */}
        {activeTab === "analytics" && (
          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-semibold text-gray-900">Revenue (Last 7 days)</p>
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                </div>
                <div className="flex items-end gap-1.5 h-32">
                  {[45, 68, 52, 89, 73, 95, 82].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full rounded-t bg-[#0b66d1]/30 transition hover:bg-[#0b66d1]"
                        style={{ height: `${h}%` }}
                      />
                      <span className="text-xs text-gray-400">{["M", "T", "W", "T", "F", "S", "S"][i]}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-between text-sm">
                  <p className="text-gray-500">Weekly total</p>
                  <p className="font-semibold text-gray-900">$12,480</p>
                </div>
              </div>

              <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
                <p className="mb-4 font-semibold text-gray-900">Ride Types Breakdown</p>
                <div className="space-y-3">
                  {[
                    { label: "Airport Transfers", pct: 45, value: "578" },
                    { label: "One Way Rides", pct: 30, value: "385" },
                    { label: "Hourly Service", pct: 15, value: "193" },
                    { label: "City-to-City", pct: 10, value: "128" },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="mb-1 flex justify-between text-xs text-gray-500">
                        <span>{item.label}</span>
                        <span>{item.value} rides ({item.pct}%)</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-gray-100">
                        <div
                          className="h-1.5 rounded-full bg-[#0b66d1]"
                          style={{ width: `${item.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "Avg. Ride Value", value: "$145", icon: DollarSign },
                { label: "Booking Conversion", value: "68%", icon: TrendingUp },
                { label: "Driver Utilization", value: "74%", icon: Car },
              ].map((m) => (
                <div key={m.label} className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
                  <m.icon className="mb-2 h-4 w-4 text-[#0b66d1]" />
                  <p className="text-2xl font-bold text-gray-900">{m.value}</p>
                  <p className="text-xs text-gray-500">{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
