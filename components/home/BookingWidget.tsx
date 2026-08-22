"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { MapPin, Calendar, Clock, ArrowRight, Loader2, LocateFixed } from "lucide-react";
import { toast } from "sonner";
import { autocompletePlaces, resolvePlaceCoords } from "@/lib/booking/places";
import { fetchAvailablePackages } from "@/lib/booking/pricing";
import { useSiteCountry } from "@/components/providers/CountryProvider";
import { getGroupedTimeSlots, getEarliestBookableDate } from "@/lib/booking/timeSlots";
import type { PlaceResult } from "@/lib/booking/types";

// The Hero section is `position: sticky` with its own stacking context (needed for the
// "App section slides up and covers it" scroll effect), which traps any z-index inside it —
// no z-index value on a dropdown panel here can ever paint above a sibling section. Portal
// the panel to <body> and position it with `fixed` + the trigger's live viewport rect instead.
function useDropdownPosition(open: boolean, triggerRef: React.RefObject<HTMLElement | null>) {
  const [rect, setRect] = useState<{ top: number; left: number; width: number } | null>(null);

  useEffect(() => {
    if (!open) { setRect(null); return; }
    const update = () => {
      const r = triggerRef.current?.getBoundingClientRect();
      if (r) setRect({ top: r.bottom, left: r.left, width: r.width });
    };
    update();
    window.addEventListener("scroll", update, { passive: true, capture: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, { capture: true });
      window.removeEventListener("resize", update);
    };
  }, [open, triggerRef]);

  return rect;
}

// Time field — a click-to-open panel of grouped slot pills (Early Morning /
// Morning / Midday / Afternoon / Evening / Night), matching PassApp's
// DateTimePicker.jsx TimeModal instead of a plain native <select>.
function TimePicker({
  date, time, onChange,
}: {
  date: string;
  time: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const groups = getGroupedTimeSlots(date);
  const label = groups.flatMap((g) => g.slots).find((s) => s.value === time)?.label;
  const rect = useDropdownPosition(open, ref);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (ref.current?.contains(t) || panelRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <Clock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex h-[52px] w-full items-center rounded-xl border border-white/12 bg-white/8 pl-10 pr-4 text-left text-sm outline-none ring-[#0b66d1] transition focus:ring-2 ${
          label ? "text-white" : "text-white/40"
        }`}
      >
        {label || "Select time"}
      </button>
      {open && rect && createPortal(
        <div
          ref={panelRef}
          style={{ position: "fixed", top: rect.top + 6, left: rect.left, width: Math.max(rect.width, 288) }}
          className="z-[200] max-h-72 overflow-y-auto rounded-xl border border-white/12 bg-[#0b1117] p-3 shadow-2xl"
        >
          {groups.length === 0 ? (
            <p className="px-2 py-2 text-xs text-white/40">No times available for this date.</p>
          ) : (
            groups.map((g) => (
              <div key={g.label} className="mb-3 last:mb-0">
                <p className="mb-1.5 px-1 text-[10px] font-bold uppercase tracking-wide text-white/40">{g.label}</p>
                <div className="flex flex-wrap gap-1.5">
                  {g.slots.map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => { onChange(s.value); setOpen(false); }}
                      className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                        time === s.value ? "bg-[#0b66d1] text-white" : "bg-white/10 text-white/70 hover:bg-white/20"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>,
        document.body
      )}
    </div>
  );
}

type BookingType = "one_way" | "hourly" | "city_to_city" | "rental";

const TABS: { id: BookingType; label: string }[] = [
  { id: "one_way", label: "One Way" },
  { id: "hourly", label: "By the Hour" },
  { id: "city_to_city", label: "City to City" },
  { id: "rental", label: "Rental" },
];

interface HourlyPkg {
  hours: number;
  rate?: number;
  included_km?: number;
}

function AddressInput({
  value, onChange, onSelect, placeholder, countryCode, showLocate,
}: {
  value: string;
  onChange: (v: string) => void;
  onSelect: (coords: { lat: number; lng: number } | null) => void;
  placeholder: string;
  countryCode?: string;
  showLocate?: boolean;
}) {
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [open, setOpen] = useState(false);
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const rect = useDropdownPosition(open && results.length > 0, wrapRef);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(async () => setResults(await autocompletePlaces(value, countryCode)), 200);
    return () => clearTimeout(t);
  }, [value, open, countryCode]);

  const handleSelect = async (r: PlaceResult) => {
    onChange(r.full);
    setOpen(false);
    setResolvingId(r.placeId);
    const coords = await resolvePlaceCoords(r.placeId);
    setResolvingId(null);
    onSelect(coords);
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) { toast.error("Location isn't available on this device"); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(`/api/places/geocode?lat=${latitude}&lng=${longitude}`);
          const data = await res.json();
          onChange(data.formattedAddress || `${latitude}, ${longitude}`);
        } catch {
          onChange(`${latitude}, ${longitude}`);
        }
        onSelect({ lat: latitude, lng: longitude });
        setLocating(false);
      },
      () => { toast.error("Couldn't get your location"); setLocating(false); },
      { timeout: 8000 }
    );
  };

  return (
    <div className="relative" ref={wrapRef}>
      {showLocate ? (
        <button
          type="button"
          onClick={useCurrentLocation}
          disabled={locating}
          title="Use current location"
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0b66d1] transition hover:text-[#1a75e8] disabled:opacity-60"
        >
          {locating ? <Loader2 className="h-4 w-4 animate-spin" /> : <LocateFixed className="h-4 w-4" />}
        </button>
      ) : (
        <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0b66d1]" />
      )}
      <input
        value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/12 bg-white/8 py-3.5 pl-10 pr-4 text-sm text-white placeholder-white/40 outline-none ring-[#0b66d1] focus:border-[#0b66d1]/50 focus:ring-2 transition"
      />
      {open && results.length > 0 && rect && createPortal(
        <div
          style={{ position: "fixed", top: rect.top + 6, left: rect.left, width: rect.width }}
          className="z-[200] rounded-2xl border border-gray-100 bg-white p-2 shadow-2xl"
        >
          {results.map((r) => (
            <button
              key={r.placeId}
              type="button"
              onMouseDown={() => handleSelect(r)}
              className="flex w-full items-start gap-2.5 rounded-xl px-3 py-2.5 text-left transition hover:bg-blue-50"
            >
              {resolvingId === r.placeId ? (
                <Loader2 className="mt-0.5 h-3.5 w-3.5 shrink-0 animate-spin text-gray-400" />
              ) : (
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" />
              )}
              <div>
                <p className="text-sm font-medium text-gray-900">{r.short}</p>
                <p className="text-xs text-gray-400">{r.full}</p>
              </div>
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
}

export default function BookingWidget() {
  const router = useRouter();
  const { country } = useSiteCountry();
  const [type, setType] = useState<BookingType>("one_way");

  const [pickup, setPickup] = useState("");
  const [pickupCoords, setPickupCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [dropoff, setDropoff] = useState("");
  const [dropoffCoords, setDropoffCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [date, setDate] = useState(getEarliestBookableDate());
  const [time, setTime] = useState("");
  const [days, setDays] = useState("1");
  const [selectedPkg, setSelectedPkg] = useState<HourlyPkg | null>(null);
  const [hourlyPkgs, setHourlyPkgs] = useState<HourlyPkg[]>([]);
  const [rentalPkgs, setRentalPkgs] = useState<HourlyPkg[]>([]);
  const [loadingPkgs, setLoadingPkgs] = useState(false);

  useEffect(() => {
    if (type !== "hourly" && type !== "rental") return;
    let cancelled = false;
    const loadPkgs = async () => {
      setLoadingPkgs(true);
      const pkgs = await fetchAvailablePackages(country.code, type === "rental" ? "day" : "hours", pickup);
      if (cancelled) return;
      if (type === "hourly") {
        setHourlyPkgs(pkgs);
        if (pkgs.length > 0) setSelectedPkg(pkgs[0]);
      } else {
        setRentalPkgs(pkgs);
        if (pkgs.length > 0) setDays(String(pkgs[0].hours));
      }
      setLoadingPkgs(false);
    };
    const t = setTimeout(loadPkgs, 300);
    return () => { cancelled = true; clearTimeout(t); };
  }, [type, country, pickup]);

  const handleSearch = () => {
    if (!pickup.trim()) { toast.error("Please enter a pickup location"); return; }
    if ((type === "one_way" || type === "city_to_city") && !dropoff.trim()) {
      toast.error("Please enter a drop-off location"); return;
    }
    if (!time) { toast.error("Please select a pickup time"); return; }

    const qs = new URLSearchParams({
      type,
      pickup,
      ...(pickupCoords ? { pLat: String(pickupCoords.lat), pLng: String(pickupCoords.lng) } : {}),
      ...(dropoffCoords ? { dLat: String(dropoffCoords.lat), dLng: String(dropoffCoords.lng) } : {}),
      ...(type !== "hourly" && type !== "rental" ? { dropoff } : {}),
      ...(type === "hourly" && selectedPkg ? { hours: String(selectedPkg.hours) } : {}),
      ...(type === "rental" ? { days } : {}),
      date, time,
      ...(country ? { country: country.code } : {}),
    });
    router.push(`/booking?${qs.toString()}`);
  };

  return (
    <div className="relative mx-auto max-w-6xl rounded-2xl border border-white/12 bg-black/45 p-4 backdrop-blur-xl md:p-6">
      {/* Tabs */}
      <div className="mb-4 flex flex-wrap gap-1 rounded-xl bg-white/8 p-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setType(tab.id)}
            className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition sm:text-sm ${
              type === tab.id ? "bg-[#0b66d1] text-white" : "text-white/60 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-[1fr_1fr_auto_auto_auto]">
        <AddressInput
          value={pickup}
          onChange={setPickup}
          onSelect={setPickupCoords}
          placeholder="Pickup location"
          countryCode={country.code}
          showLocate
        />

        {(type === "one_way" || type === "city_to_city") && (
          <AddressInput
            value={dropoff}
            onChange={setDropoff}
            onSelect={setDropoffCoords}
            placeholder="Drop-off location"
            countryCode={country.code}
          />
        )}

        {type === "hourly" && (
          <div className="relative">
            <Clock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            {loadingPkgs ? (
              <div className="flex h-[52px] items-center rounded-xl border border-white/12 bg-white/8 pl-10 text-xs text-white/40">Loading packages...</div>
            ) : hourlyPkgs.length === 0 ? (
              <div className="flex h-[52px] items-center rounded-xl border border-white/12 bg-white/8 pl-10 text-xs text-white/40">No packages available</div>
            ) : (
              <select
                value={selectedPkg?.hours ?? ""}
                onChange={(e) => setSelectedPkg(hourlyPkgs.find((p) => p.hours === Number(e.target.value)) || null)}
                className="w-full appearance-none rounded-xl border border-white/12 bg-white/8 py-3.5 pl-10 pr-4 text-sm text-white outline-none ring-[#0b66d1] focus:ring-2 transition"
              >
                {hourlyPkgs.map((pkg) => (
                  <option key={pkg.hours} value={pkg.hours} className="bg-[#0b1117]">
                    {pkg.hours} {pkg.hours === 1 ? "hour" : "hours"}{pkg.included_km ? ` — ${pkg.included_km} km included` : ""}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        {type === "rental" && (
          <div className="relative">
            <Clock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            {loadingPkgs ? (
              <div className="flex h-[52px] items-center rounded-xl border border-white/12 bg-white/8 pl-10 text-xs text-white/40">Loading packages...</div>
            ) : rentalPkgs.length === 0 ? (
              <div className="flex h-[52px] items-center rounded-xl border border-white/12 bg-white/8 pl-10 text-xs text-white/40">No rental packages available</div>
            ) : (
              <select
                value={days}
                onChange={(e) => setDays(e.target.value)}
                className="w-full appearance-none rounded-xl border border-white/12 bg-white/8 py-3.5 pl-10 pr-4 text-sm text-white outline-none ring-[#0b66d1] focus:ring-2 transition"
              >
                {rentalPkgs.map((p) => (
                  <option key={p.hours} value={p.hours} className="bg-[#0b1117]">
                    {p.hours} {p.hours === 1 ? "day" : "days"}{p.included_km ? ` — ${p.included_km} km included` : ""}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        <div className="relative">
          <Calendar className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input
            type="date"
            value={date}
            onChange={(e) => { setDate(e.target.value); setTime(""); }}
            min={getEarliestBookableDate()}
            className="w-full rounded-xl border border-white/12 bg-white/8 py-3.5 pl-10 pr-4 text-sm text-white outline-none ring-[#0b66d1] focus:ring-2 transition [color-scheme:dark]"
          />
        </div>

        <TimePicker date={date} time={time} onChange={setTime} />

        <button
          onClick={handleSearch}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#0b66d1] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#1a75e8] active:scale-95"
        >
          Book
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <p className="mt-3 text-center text-[11px] text-white/30 md:text-left">
        Bookings must be made at least 3 hours in advance.
      </p>
    </div>
  );
}
