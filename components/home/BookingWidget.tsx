"use client";

import { useState } from "react";
import { MapPin, Calendar, Clock, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type BookingType = "one_way" | "hourly" | "city_to_city";

const TABS: { id: BookingType; label: string }[] = [
  { id: "one_way", label: "One Way" },
  { id: "hourly", label: "By the Hour" },
  { id: "city_to_city", label: "City to City" },
];

export default function BookingWidget() {
  const [type, setType] = useState<BookingType>("one_way");
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [hours, setHours] = useState("2");
  const [passengers, setPassengers] = useState("1");
  const router = useRouter();

  const handleSearch = () => {
    const params = new URLSearchParams({
      type,
      pickup,
      dropoff: type !== "hourly" ? dropoff : "",
      date,
      time,
      hours: type === "hourly" ? hours : "",
      passengers,
    });
    router.push(`/booking?${params.toString()}`);
  };

  return (
    <div className="mx-auto max-w-5xl rounded-2xl border border-white/12 bg-black/45 p-4 backdrop-blur-xl md:p-5">
      {/* Tabs */}
      <div className="mb-4 flex gap-1 rounded-xl bg-white/8 p-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setType(tab.id)}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${
              type === tab.id
                ? "bg-[#0b66d1] text-white shadow"
                : "text-white/60 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-[1fr_1fr_auto_auto_auto]">
        <div className="relative">
          <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0b66d1]" />
          <input
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            placeholder="Pickup location"
            className="w-full rounded-xl border border-white/12 bg-white/8 py-3.5 pl-10 pr-4 text-sm text-white placeholder-white/40 outline-none ring-[#0b66d1] focus:border-[#0b66d1]/50 focus:ring-2 transition"
          />
        </div>

        {type !== "hourly" ? (
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              value={dropoff}
              onChange={(e) => setDropoff(e.target.value)}
              placeholder="Drop-off location"
              className="w-full rounded-xl border border-white/12 bg-white/8 py-3.5 pl-10 pr-4 text-sm text-white placeholder-white/40 outline-none ring-[#0b66d1] focus:border-[#0b66d1]/50 focus:ring-2 transition"
            />
          </div>
        ) : (
          <div className="relative">
            <Clock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <select
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="w-full appearance-none rounded-xl border border-white/12 bg-white/8 py-3.5 pl-10 pr-4 text-sm text-white outline-none ring-[#0b66d1] focus:ring-2 transition"
            >
              {[2, 3, 4, 5, 6, 8, 10, 12, 24].map((h) => (
                <option key={h} value={h} className="bg-[#0b1117]">
                  {h} hours
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="relative">
          <Calendar className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="w-full rounded-xl border border-white/12 bg-white/8 py-3.5 pl-10 pr-4 text-sm text-white outline-none ring-[#0b66d1] focus:ring-2 transition [color-scheme:dark]"
          />
        </div>

        <div className="relative">
          <Clock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full rounded-xl border border-white/12 bg-white/8 py-3.5 pl-10 pr-4 text-sm text-white outline-none ring-[#0b66d1] focus:ring-2 transition [color-scheme:dark]"
          />
        </div>

        <button
          onClick={handleSearch}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#0b66d1] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#1a75e8] active:scale-95"
        >
          View options
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
