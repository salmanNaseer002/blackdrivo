"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown, Loader2, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

// ─── Types ───────────────────────────────────────────────────────────────────

interface NormalizedCountry {
  code: string;
  name: string;
  flag: string;
  phoneCode: string;    // e.g. "+1"
  phoneFormat: string;  // e.g. "(###) ###-####"
  phonePlaceholder: string; // e.g. "(555) 000-0000"
  cities: string[];
}

interface DBCountry {
  code: string;
  name: string;
  flag: string;
  phone_code: string;
  phone_format: string;
  phone_placeholder: string;
  cities: string[];
}

// ─── Country Dropdown ─────────────────────────────────────────────────────────

function CountryDropdown({
  countries, value, onChange, loading,
}: {
  countries: NormalizedCountry[];
  value: NormalizedCountry | null;
  onChange: (c: NormalizedCountry) => void;
  loading: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const filtered = countries.filter(c =>
    c.name.toLowerCase().includes(q.toLowerCase()) ||
    c.code.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition focus:border-[#0b66d1] focus:outline-none focus:ring-2 focus:ring-[#0b66d1]/20"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
        ) : value ? (
          <>
            <span className="text-lg leading-none">{value.flag}</span>
            <span className="flex-1 text-left font-medium text-gray-900">{value.name}</span>
            <span className="text-xs text-gray-400">{value.phoneCode}</span>
          </>
        ) : (
          <span className="flex-1 text-left text-gray-400">Select your country</span>
        )}
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-2 w-full rounded-2xl border border-gray-100 bg-white shadow-xl"
          >
            <div className="p-2">
              <input
                autoFocus
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder="Search country..."
                className="w-full rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-[#0b66d1]"
              />
            </div>
            <div className="max-h-56 overflow-y-auto pb-2">
              {filtered.length === 0 ? (
                <p className="px-4 py-3 text-sm text-gray-400">No results</p>
              ) : (
                filtered.map(c => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => { onChange(c); setOpen(false); setQ(""); }}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm transition hover:bg-gray-50
                      ${value?.code === c.code ? "bg-blue-50 text-[#0b66d1] font-medium" : "text-gray-700"}`}
                  >
                    <span className="text-base leading-none">{c.flag}</span>
                    <span className="flex-1 text-left">{c.name}</span>
                    <span className="text-xs text-gray-400">{c.phoneCode}</span>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── City Dropdown ────────────────────────────────────────────────────────────

function CityDropdown({
  cities, value, onChange,
}: {
  cities: string[];
  value: string;
  onChange: (c: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const filtered = cities.filter(c => c.toLowerCase().includes(q.toLowerCase()));

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition focus:border-[#0b66d1] focus:outline-none focus:ring-2 focus:ring-[#0b66d1]/20"
      >
        <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
        <span className={`flex-1 text-left ${value ? "font-medium text-gray-900" : "text-gray-400"}`}>
          {value || "Select your city"}
        </span>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-2 w-full rounded-2xl border border-gray-100 bg-white shadow-xl"
          >
            <div className="p-2">
              <input
                autoFocus
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder="Search city..."
                className="w-full rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-[#0b66d1]"
              />
            </div>
            <div className="max-h-52 overflow-y-auto pb-2">
              {filtered.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => { onChange(c); setOpen(false); setQ(""); }}
                  className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-sm transition hover:bg-gray-50
                    ${value === c ? "bg-blue-50 text-[#0b66d1] font-medium" : "text-gray-700"}`}
                >
                  <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                  {c}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
// Only the Location step is live for now — the rest of driver signup
// (email/OTP verification, personal details, license, password) is being
// rebuilt against a fresh Supabase setup, so it's intentionally not wired
// up here yet. Submitting the location step shows a "coming soon" message
// instead of creating any account or writing to Supabase.

export default function DriverSignupPage() {
  // ── Countries/Cities ─────────────────────────────────────────
  const [countries,       setCountries]       = useState<NormalizedCountry[]>([]);
  const [loadingCountry,  setLoadingCountry]  = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<NormalizedCountry | null>(null);
  const [selectedCity,    setSelectedCity]    = useState("");

  // ── Step (Location only — see note above) ──────────────────────
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ─────────────────────────────────────────────────────────────

  // Load countries from Supabase
  useEffect(() => {
    const load = async () => {
      try {
        const supabase = createClient();
        const { data } = await (supabase as any)
          .from("countries_config")
          .select("code,name,flag,phone_code,cities,is_active,reflect_website")
          .eq("is_active", true)
          .eq("reflect_website", true)
          .order("name");

        if (data && data.length > 0) {
          setCountries(data.map((c: DBCountry) => ({
            code:             c.code,
            name:             c.name,
            flag:             c.flag,
            phoneCode:        c.phone_code,
            phoneFormat:      "",
phonePlaceholder: "",
            cities:           c.cities || [],
          })));
        }
      } catch {
        // silently fail — countries won't show
      } finally {
        setLoadingCountry(false);
      }
    };
    load();
  }, []);

  // ── Handlers ─────────────────────────────────────────────────

  const handleCountryChange = (c: NormalizedCountry) => {
    setSelectedCountry(c);
    setSelectedCity("");
    setErrors({});
  };

  const validate = (): Record<string, string> => {
    const e: Record<string, string> = {};
    if (!selectedCountry) e.country = "Please select your country";
    if (selectedCountry && selectedCountry.cities.length > 0 && !selectedCity)
      e.city = "Please select your city";
    return e;
  };

  // Rest of driver signup (email/OTP, personal details, license, password,
  // and the actual account/Supabase write) is being rebuilt — this just
  // confirms interest for now, no account is created yet.
  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    toast.success("Thanks for your interest!", {
      description: "Driver signup is being upgraded — we'll email you shortly to finish your application.",
    });
  };

  // ── Left panel content ──────────────────────────────────────────

  const current = { title: "Where do you operate?", desc: "Select your country and city to get started with your BlackDrivo driver application." };

  // ─────────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* ── Left Panel ── */}
      <div
        className="hidden lg:flex lg:w-[400px] xl:w-[460px] shrink-0 flex-col justify-between p-10 xl:p-12 text-white"
        style={{ background: "linear-gradient(160deg, #0b1f3a 0%, #0b66d1 100%)" }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src="/logo wb.png" alt="BlackDrivo" width={130} height={36} className="object-contain" style={{ height: "auto" }} />
        </Link>

        {/* Middle content */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-3xl font-bold leading-snug">{current.title}</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/60">{current.desc}</p>
        </motion.div>

        {/* Bottom note */}
        <p className="text-xs text-white/30 leading-relaxed">
          Your information is encrypted and never shared without your consent.
          BlackDrivo complies with all applicable data protection regulations.
        </p>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex flex-1 items-start justify-center overflow-y-auto px-4 py-8 sm:py-12">
        <div className="w-full max-w-[480px]">

          {/* Mobile logo */}
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <Link href="/">
              <Image src="/logo bb.png" alt="BlackDrivo" width={110} height={32} className="object-contain" style={{ height: "auto" }} />
            </Link>
          </div>

          {/* Card */}
          <div className="rounded-2xl bg-white shadow-sm">
              <div className="p-6 sm:p-8">

                <div className="space-y-5">
                    <div>
                      <h1 className="text-xl font-bold text-gray-900">Select your location</h1>
                      <p className="mt-1 text-sm text-gray-500">Where will you primarily be operating as a driver?</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">Country</label>
                        <CountryDropdown
                          countries={countries}
                          value={selectedCountry}
                          onChange={handleCountryChange}
                          loading={loadingCountry}
                        />
                        {errors.country && <p className="mt-1.5 text-xs text-red-500">{errors.country}</p>}
                      </div>

                      {selectedCountry && selectedCountry.cities.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          transition={{ duration: 0.2 }}
                        >
                          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">City</label>
                          <CityDropdown
                            cities={selectedCountry.cities}
                            value={selectedCity}
                            onChange={setSelectedCity}
                          />
                          {errors.city && <p className="mt-1.5 text-xs text-red-500">{errors.city}</p>}
                        </motion.div>
                      )}

                    </div>
                </div>

                {/* ── Navigation ── */}
                <div className="mt-7 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex items-center gap-2 rounded-xl bg-[#0b66d1] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#0952a8] transition"
                  >
                    Continue <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
          </div>

          {/* Footer links */}
          <p className="mt-5 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/driver/login" className="font-medium text-[#0b66d1] hover:text-[#0952a8]">Sign in</Link>
          </p>
          <p className="mt-2 text-center text-xs text-gray-400">
            By signing up you agree to our{" "}
            <Link href="/terms-of-service" className="text-[#0b66d1] hover:underline">Terms of Service</Link>
            {" "}and{" "}
            <Link href="/privacy-policy" className="text-[#0b66d1] hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}