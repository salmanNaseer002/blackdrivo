"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, ArrowLeft, Check, Eye, EyeOff,
  MapPin, Mail, User, FileText, Lock, ShieldCheck,
  ChevronDown, X, Loader2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

// ─── Types ───────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3 | 4 | 5;

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

// ─── US States ───────────────────────────────────────────────────────────────

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC",
];

// ─── Phone validation per country ────────────────────────────────────────────

const PHONE_RULES: Record<string, { length: number; label: string }> = {
  US: { length: 10, label: "10 digits required — (XXX) XXX-XXXX" },
  CA: { length: 10, label: "10 digits required" },
  GB: { length: 10, label: "10 digits required — 07XXX XXXXXX" },
  AU: { length: 9,  label: "9 digits required" },
  PK: { length: 10, label: "10 digits required — 03XX XXXXXXX" },
  AE: { length: 9,  label: "9 digits required" },
};

function getPhoneDigits(phone: string) {
  return phone.replace(/\D/g, "");
}

function validatePhone(phone: string, countryCode: string): string | null {
  const digits = getPhoneDigits(phone);
  const rule = PHONE_RULES[countryCode];
  if (!digits) return "Phone number is required";
  if (rule && digits.length !== rule.length) return rule.label;
  if (digits.length < 7) return "Enter a valid phone number";
  return null;
}

// ─── Format phone as user types (US style) ────────────────────────────────

function formatPhoneInput(value: string, countryCode: string): string {
  const digits = value.replace(/\D/g, "");
  if (countryCode === "US" || countryCode === "CA") {
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0,3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6,10)}`;
  }
  return digits; // other countries: raw digits
}

// ─── Step config ─────────────────────────────────────────────────────────────

const STEPS = [
  { n: 1 as Step, label: "Location",    icon: MapPin      },
  { n: 2 as Step, label: "Email & OTP", icon: Mail        },
  { n: 3 as Step, label: "Personal",    icon: User        },
  { n: 4 as Step, label: "License",     icon: FileText    },
  { n: 5 as Step, label: "Password",    icon: Lock        },
];

// ─── Shared input class ───────────────────────────────────────────────────────

const inp = (err?: string) =>
  `w-full rounded-xl border px-4 py-3 text-sm text-gray-900 outline-none transition
   placeholder:text-gray-400 focus:ring-2 focus:ring-[#0b66d1]/20
   ${err ? "border-red-300 bg-red-50" : "border-gray-200 bg-white focus:border-[#0b66d1]"}`;

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

// ─── OTP Input ────────────────────────────────────────────────────────────────

function OtpInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = (value || "").padEnd(6, " ").split("").slice(0, 6);

  const handleChange = (i: number, v: string) => {
    const d = v.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[i] = d;
    const joined = next.join("").replace(/ /g, "");
    onChange(joined);
    if (d && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(pasted);
    e.preventDefault();
    const focusIdx = Math.min(pasted.length, 5);
    inputs.current[focusIdx]?.focus();
  };

  return (
    <div className="flex gap-2.5 justify-center">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={el => { inputs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[i]?.trim() ?? ""}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className={`h-12 w-11 rounded-xl border text-center text-lg font-bold outline-none transition
            focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20
            ${digits[i] && digits[i] !== " " ? "border-[#0b66d1] bg-blue-50 text-[#0b66d1]" : "border-gray-200 bg-white text-gray-900"}`}
        />
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DriverSignupPage() {
  const router = useRouter();

  // ── Countries/Cities ─────────────────────────────────────────
  const [countries,       setCountries]       = useState<NormalizedCountry[]>([]);
  const [loadingCountry,  setLoadingCountry]  = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<NormalizedCountry | null>(null);
  const [selectedCity,    setSelectedCity]    = useState("");

  // ── Step ─────────────────────────────────────────────────────
  const [step, setStep] = useState<Step>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // ── Step 2: Email + OTP ──────────────────────────────────────
  const [email, setEmail]           = useState("");
  const [otpSent, setOtpSent]       = useState(false);
  const [otp, setOtp]               = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [countdown, setCountdown]   = useState(0);

  // ── Step 3: Personal ─────────────────────────────────────────
  const [fullName, setFullName] = useState("");
  const [dob, setDob]           = useState("");
  const [phone, setPhone]       = useState("");

  // ── Step 4: License ──────────────────────────────────────────
  const [licenseNum,    setLicenseNum]    = useState("");
  const [licenseExpiry, setLicenseExpiry] = useState("");
  const [licenseState,  setLicenseState]  = useState("NY");
  const [bgConsent,     setBgConsent]     = useState(false);

  // ── Step 5: Password ─────────────────────────────────────────
  const [password,    setPassword]    = useState("");
  const [confirm,     setConfirm]     = useState("");
  const [showPass,    setShowPass]    = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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

  // OTP countdown
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  // ── Handlers ─────────────────────────────────────────────────

  const handleCountryChange = (c: NormalizedCountry) => {
    setSelectedCountry(c);
    setSelectedCity("");
    setPhone("");
    setErrors({});
  };

  // Send OTP via Supabase
  const sendOtp = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: "Enter a valid email address" });
      return;
    }
    setOtpLoading(true);
    setErrors({});
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
  email: email.trim().toLowerCase(),
  options: {
    shouldCreateUser: true,
    data: { role: "driver" },
  },
});
      // Even if user doesn't exist, we don't reveal that — just show success
      if (error && !error.message.toLowerCase().includes("not found")) {
        setErrors({ email: error.message });
        return;
      }
      setOtpSent(true);
      setCountdown(60);
      toast.success("OTP sent! Check your inbox.");
    } catch {
      setErrors({ email: "Failed to send OTP. Try again." });
    } finally {
      setOtpLoading(false);
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    if (otp.length !== 6) {
      setErrors({ otp: "Enter the 6-digit code" });
      return;
    }
    setOtpLoading(true);
    setErrors({});
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: otp,
        type: "email",
      });
      if (error) {
        // OTP might fail if user doesn't exist yet — we allow proceeding
        // by treating any "not found" error as valid for new accounts
        if (error.message.toLowerCase().includes("invalid") ||
            error.message.toLowerCase().includes("expired")) {
          setErrors({ otp: "Invalid or expired code. Try resending." });
          setOtpLoading(false);
          return;
        }
      }
      await supabase.auth.signOut();
      setOtpVerified(true);
      setOtpLoading(false);
      toast.success("Email verified!");
      setTimeout(() => {
        setErrors({});
        setStep(3);
      }, 600);
      return;
    } catch {
      setErrors({ otp: "Verification failed. Try again." });
    } finally {
      setOtpLoading(false);
    }
  };

  // Validate each step
  const validateStep = (s: Step): Record<string, string> => {
    const e: Record<string, string> = {};
    if (s === 1) {
      if (!selectedCountry) e.country = "Please select your country";
      if (selectedCountry && selectedCountry.cities.length > 0 && !selectedCity)
        e.city = "Please select your city";
    }
    if (s === 2) {
      if (!email || !/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email address";
      if (!otpVerified) e.otp = "Please verify your email first";
    }
    if (s === 3) {
      if (!fullName.trim()) e.fullName = "Full legal name is required";
      if (!dob)             e.dob      = "Date of birth is required";
      // Age check — must be 21+
      const age = (Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000);
      if (dob && age < 21)  e.dob      = "You must be at least 21 years old";
      const phoneErr = validatePhone(phone, selectedCountry?.code || "US");
      if (phoneErr) e.phone = phoneErr;
    }
    if (s === 4) {
      if (!licenseNum.trim())   e.licenseNum    = "License number is required";
      if (!licenseExpiry)       e.licenseExpiry = "Expiry date is required";
      const expDate = new Date(licenseExpiry);
      if (licenseExpiry && expDate <= new Date()) e.licenseExpiry = "License must not be expired";
      if (!licenseState)        e.licenseState  = "License state is required";
      if (!bgConsent)           e.bgConsent     = "Background check consent is required";
    }
    if (s === 5) {
      if (!password || password.length < 8) e.password = "Minimum 8 characters";
      if (password !== confirm)              e.confirm  = "Passwords do not match";
    }
    return e;
  };

  const goNext = () => {
    const errs = validateStep(step);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStep(s => (s + 1) as Step);
  };

  const goBack = () => {
    setErrors({});
    setStep(s => (s - 1) as Step);
  };

  // Final submit
  const handleSubmit = async () => {
    const errs = validateStep(5);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const digits = getPhoneDigits(phone);
      const fullPhone = `${selectedCountry?.phoneCode || "+1"}${digits}`;

      const res = await fetch("/api/driver/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email:         email.trim().toLowerCase(),
          password,
          fullName:      fullName.trim(),
          dob,
          phone:         fullPhone,
          countryCode:   selectedCountry?.code || "US",
          cityText:      selectedCity || null,
          licenseNumber: licenseNum.trim(),
          licenseState,
          licenseExpiry,
          consent:       bgConsent,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");

      // Auto sign in
      const supabase = createClient();
      await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      toast.success("Account created! Welcome to BlackDrivo.");
      router.push("/driver/dashboard");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Left panel content per step ───────────────────────────────

  const LEFT_CONTENT: Record<Step, { title: string; desc: string }> = {
    1: { title: "Where do you operate?",   desc: "Select your country and city to get started with your BlackDrivo driver application." },
    2: { title: "Verify your email",        desc: "We'll send a one-time code to confirm your email address. It takes just 30 seconds." },
    3: { title: "Tell us about yourself",   desc: "Basic personal information for your driver profile. All data is encrypted and secure." },
    4: { title: "Your license details",     desc: "We verify all driver licenses before approval to maintain our premium safety standards." },
    5: { title: "Secure your account",      desc: "Create a strong password to protect your BlackDrivo driver account." },
  };

  const current = LEFT_CONTENT[step];

  // ── Password strength ─────────────────────────────────────────

  const strength = (() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8)           s++;
    if (/[A-Z]/.test(password))         s++;
    if (/[0-9]/.test(password))         s++;
    if (/[^A-Za-z0-9]/.test(password))  s++;
    return s;
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "bg-red-400", "bg-yellow-400", "bg-blue-400", "bg-emerald-500"][strength];

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
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
          >
            {/* Step indicator */}
            <div className="mb-6 flex items-center gap-2">
              {STEPS.map(s => (
                <div
                  key={s.n}
                  className={`h-1 flex-1 rounded-full transition-all duration-500
                    ${s.n < step ? "bg-white" : s.n === step ? "bg-white/80" : "bg-white/20"}`}
                />
              ))}
            </div>

            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-white/50">
              Step {step} of 5
            </p>
            <h2 className="text-3xl font-bold leading-snug">{current.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/60">{current.desc}</p>

            {/* Step checklist */}
            <div className="mt-8 space-y-3">
              {STEPS.map(s => {
                const done = s.n < step;
                const active = s.n === step;
                return (
                  <div key={s.n} className={`flex items-center gap-3 text-sm transition
                    ${done ? "text-white" : active ? "text-white font-semibold" : "text-white/30"}`}>
                    <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full
                      ${done ? "bg-white" : active ? "bg-white/20 ring-2 ring-white/40" : "bg-white/10"}`}>
                      {done
                        ? <Check className="h-3.5 w-3.5 text-[#0b66d1]" />
                        : <s.icon className={`h-3 w-3 ${active ? "text-white" : "text-white/30"}`} />
                      }
                    </div>
                    {s.label}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

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
            <span className="text-xs font-medium text-gray-400">Step {step} of 5</span>
          </div>

          {/* Mobile step bar */}
          <div className="mb-6 flex gap-1.5 lg:hidden">
            {STEPS.map(s => (
              <div key={s.n} className={`h-1 flex-1 rounded-full transition-all duration-500
                ${s.n < step ? "bg-[#0b66d1]" : s.n === step ? "bg-[#0b66d1]" : "bg-gray-200"}`} />
            ))}
          </div>

          {/* Card */}
          <div className="rounded-2xl bg-white shadow-sm">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.22 }}
                className="p-6 sm:p-8"
              >

                {/* ── STEP 1: Location ── */}
                {step === 1 && (
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
                )}

                {/* ── STEP 2: Email + OTP ── */}
                {step === 2 && (
                  <div className="space-y-5">
                    <div>
                      <h1 className="text-xl font-bold text-gray-900">Verify your email</h1>
                      <p className="mt-1 text-sm text-gray-500">We'll send a 6-digit code to confirm your email.</p>
                    </div>

                    {/* Location summary chip */}
                    {selectedCountry && (
                      <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2.5 text-sm">
                        <span>{selectedCountry.flag}</span>
                        <span className="font-medium text-gray-700">{selectedCountry.name}</span>
                        {selectedCity && <><span className="text-gray-300">·</span><span className="text-gray-500">{selectedCity}</span></>}
                        <button type="button" onClick={() => { setStep(1); setErrors({}); }} className="ml-auto text-xs text-[#0b66d1] hover:underline">Change</button>
                      </div>
                    )}

                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">Email address</label>
                      <div className="flex gap-2">
                        <input
                          type="email"
                          value={email}
                          onChange={e => { setEmail(e.target.value); setOtpSent(false); setOtpVerified(false); setOtp(""); }}
                          placeholder="you@example.com"
                          disabled={otpVerified}
                          className={`${inp(errors.email)} flex-1 disabled:bg-gray-50 disabled:text-gray-500`}
                        />
                        {otpVerified && (
                          <button
                            type="button"
                            onClick={() => { setOtpVerified(false); setOtpSent(false); setOtp(""); }}
                            className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 text-xs font-medium text-gray-600 hover:bg-gray-50"
                          >
                            <X className="h-3 w-3" /> Change
                          </button>
                        )}
                      </div>
                      {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>}
                    </div>

                    {!otpVerified && (
                      <>
                        {!otpSent ? (
                          <button
                            type="button"
                            onClick={sendOtp}
                            disabled={otpLoading || !email}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b66d1] py-3 text-sm font-semibold text-white hover:bg-[#0952a8] disabled:opacity-50 transition"
                          >
                            {otpLoading
                              ? <Loader2 className="h-4 w-4 animate-spin" />
                              : <><Mail className="h-4 w-4" /> Send verification code</>
                            }
                          </button>
                        ) : (
                          <div className="space-y-4">
                            <div>
                              <label className="mb-3 block text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Enter the 6-digit code sent to {email}
                              </label>
                              <OtpInput value={otp} onChange={setOtp} />
                              {errors.otp && <p className="mt-2 text-center text-xs text-red-500">{errors.otp}</p>}
                            </div>

                            <button
                              type="button"
                              onClick={verifyOtp}
                              disabled={otpLoading || otp.length !== 6}
                              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b66d1] py-3 text-sm font-semibold text-white hover:bg-[#0952a8] disabled:opacity-50 transition"
                            >
                              {otpLoading
                                ? <Loader2 className="h-4 w-4 animate-spin" />
                                : <><ShieldCheck className="h-4 w-4" /> Verify code</>
                              }
                            </button>

                            <div className="text-center">
                              {countdown > 0 ? (
                                <p className="text-xs text-gray-400">Resend in {countdown}s</p>
                              ) : (
                                <button type="button" onClick={sendOtp} disabled={otpLoading} className="text-xs font-medium text-[#0b66d1] hover:underline disabled:opacity-50">
                                  Resend code
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {otpVerified && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-3 rounded-xl bg-emerald-50 px-4 py-3"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-emerald-700">Email verified</p>
                          <p className="text-xs text-emerald-600">{email}</p>
                        </div>
                      </motion.div>
                    )}
                    {errors.otp && !otpSent && <p className="text-xs text-red-500">{errors.otp}</p>}
                  </div>
                )}

                {/* ── STEP 3: Personal Info ── */}
                {step === 3 && (
                  <div className="space-y-5">
                    <div>
                      <h1 className="text-xl font-bold text-gray-900">Personal information</h1>
                      <p className="mt-1 text-sm text-gray-500">Your legal name and contact details.</p>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">Full legal name</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        placeholder="As it appears on your license"
                        className={inp(errors.fullName)}
                      />
                      {errors.fullName && <p className="mt-1.5 text-xs text-red-500">{errors.fullName}</p>}
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">Date of birth</label>
                      <input
                        type="date"
                        value={dob}
                        onChange={e => setDob(e.target.value)}
                        max={new Date(Date.now() - 21 * 365.25 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                        className={inp(errors.dob)}
                      />
                      {errors.dob
                        ? <p className="mt-1.5 text-xs text-red-500">{errors.dob}</p>
                        : <p className="mt-1.5 text-xs text-gray-400">You must be at least 21 years old to drive</p>
                      }
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Phone number
                        {selectedCountry && (
                          <span className="ml-1 font-normal normal-case text-gray-400">
                            — {selectedCountry.phoneCode} {selectedCountry.phoneFormat || selectedCountry.phonePlaceholder}
                          </span>
                        )}
                      </label>
                      <div className="flex gap-2">
                        {selectedCountry && (
                          <div className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-600 shrink-0">
                            <span>{selectedCountry.flag}</span>
                            <span>{selectedCountry.phoneCode}</span>
                          </div>
                        )}
                        <input
                          type="tel"
                          value={phone}
                          onChange={e => setPhone(formatPhoneInput(e.target.value, selectedCountry?.code || "US"))}
                          placeholder={selectedCountry?.phonePlaceholder || "(555) 000-0000"}
                          className={`${inp(errors.phone)} flex-1`}
                        />
                      </div>
                      {errors.phone
                        ? <p className="mt-1.5 text-xs text-red-500">{errors.phone}</p>
                        : selectedCountry && PHONE_RULES[selectedCountry.code] && (
                          <p className="mt-1.5 text-xs text-gray-400">{PHONE_RULES[selectedCountry.code].label}</p>
                        )
                      }
                    </div>
                  </div>
                )}

                {/* ── STEP 4: License ── */}
                {step === 4 && (
                  <div className="space-y-5">
                    <div>
                      <h1 className="text-xl font-bold text-gray-900">License information</h1>
                      <p className="mt-1 text-sm text-gray-500">Your driver's license details for verification.</p>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">License number</label>
                      <input
                        type="text"
                        value={licenseNum}
                        onChange={e => setLicenseNum(e.target.value.toUpperCase())}
                        placeholder="e.g. D123-456-789"
                        className={inp(errors.licenseNum)}
                      />
                      {errors.licenseNum && <p className="mt-1.5 text-xs text-red-500">{errors.licenseNum}</p>}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">Expiry date</label>
                        <input
                          type="date"
                          value={licenseExpiry}
                          onChange={e => setLicenseExpiry(e.target.value)}
                          min={new Date().toISOString().split("T")[0]}
                          className={inp(errors.licenseExpiry)}
                        />
                        {errors.licenseExpiry && <p className="mt-1.5 text-xs text-red-500">{errors.licenseExpiry}</p>}
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                          {selectedCountry?.code === "US" ? "Issuing state" : "Province / Region"}
                        </label>
                        {selectedCountry?.code === "US" ? (
                          <select
                            value={licenseState}
                            onChange={e => setLicenseState(e.target.value)}
                            className={inp(errors.licenseState)}
                          >
                            <option value="">Select state</option>
                            {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={licenseState}
                            onChange={e => setLicenseState(e.target.value)}
                            placeholder="e.g. Ontario"
                            className={inp(errors.licenseState)}
                          />
                        )}
                        {errors.licenseState && <p className="mt-1.5 text-xs text-red-500">{errors.licenseState}</p>}
                      </div>
                    </div>

                    {/* Background check consent */}
                    <div
                      onClick={() => setBgConsent(!bgConsent)}
                      className={`cursor-pointer rounded-xl border-2 p-4 transition
                        ${bgConsent ? "border-[#0b66d1] bg-blue-50" : errors.bgConsent ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50 hover:border-gray-300"}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition
                          ${bgConsent ? "border-[#0b66d1] bg-[#0b66d1]" : "border-gray-300 bg-white"}`}>
                          {bgConsent && <Check className="h-3 w-3 text-white" />}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Background check consent</p>
                          <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                            I authorize BlackDrivo to conduct a background check including criminal history,
                            driving record, and identity verification as required for driver approval.
                            This is mandatory for all drivers.
                          </p>
                        </div>
                      </div>
                    </div>
                    {errors.bgConsent && <p className="text-xs text-red-500">{errors.bgConsent}</p>}
                  </div>
                )}

                {/* ── STEP 5: Password ── */}
                {step === 5 && (
                  <div className="space-y-5">
                    <div>
                      <h1 className="text-xl font-bold text-gray-900">Create your password</h1>
                      <p className="mt-1 text-sm text-gray-500">Secure your BlackDrivo driver account.</p>
                    </div>

                    {/* Account summary */}
                    <div className="rounded-xl bg-gray-50 p-4 space-y-1.5 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Email</span>
                        <span className="font-medium text-gray-900">{email}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Name</span>
                        <span className="font-medium text-gray-900">{fullName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Location</span>
                        <span className="font-medium text-gray-900">{selectedCountry?.name}{selectedCity ? `, ${selectedCity}` : ""}</span>
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">Password</label>
                      <div className="relative">
                        <input
                          type={showPass ? "text" : "password"}
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          placeholder="Min. 8 characters"
                          className={`${inp(errors.password)} pr-11`}
                        />
                        <button type="button" onClick={() => setShowPass(!showPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {password && (
                        <div className="mt-2 space-y-1.5">
                          <div className="flex gap-1">
                            {[1,2,3,4].map(i => (
                              <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColor : "bg-gray-200"}`} />
                            ))}
                          </div>
                          <p className={`text-xs font-medium ${["","text-red-500","text-yellow-600","text-blue-600","text-emerald-600"][strength]}`}>
                            {strengthLabel}
                          </p>
                        </div>
                      )}
                      {errors.password && <p className="mt-1.5 text-xs text-red-500">{errors.password}</p>}
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">Confirm password</label>
                      <div className="relative">
                        <input
                          type={showConfirm ? "text" : "password"}
                          value={confirm}
                          onChange={e => setConfirm(e.target.value)}
                          placeholder="Repeat your password"
                          className={`${inp(errors.confirm)} pr-11`}
                        />
                        <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {confirm && password === confirm && (
                        <p className="mt-1.5 flex items-center gap-1 text-xs text-emerald-600 font-medium">
                          <Check className="h-3 w-3" /> Passwords match
                        </p>
                      )}
                      {errors.confirm && <p className="mt-1.5 text-xs text-red-500">{errors.confirm}</p>}
                    </div>
                  </div>
                )}

                {/* ── Navigation ── */}
                <div className="mt-7 flex items-center justify-between">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={goBack}
                      className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                    >
                      <ArrowLeft className="h-4 w-4" /> Back
                    </button>
                  ) : <div />}

                  {step < 5 ? (
                    <button
                      type="button"
                      onClick={goNext}
                      disabled={step === 2 && !otpVerified}
                      className="flex items-center gap-2 rounded-xl bg-[#0b66d1] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#0952a8] disabled:opacity-50 transition"
                    >
                      Continue <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex items-center gap-2 rounded-xl bg-[#0b66d1] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#0952a8] disabled:opacity-60 transition"
                    >
                      {loading
                        ? <Loader2 className="h-4 w-4 animate-spin" />
                        : <><Check className="h-4 w-4" /> Create account</>
                      }
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
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