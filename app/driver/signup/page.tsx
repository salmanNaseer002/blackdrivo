"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, Car, Lock, AlertCircle, Check, ChevronDown, Search, MapPin } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_COUNTRIES } from "@/lib/data/locations";

// ── Types ─────────────────────────────────────────────────────────
interface DBCountry {
  code: string; name: string; flag: string; phone_code: string;
  currency: string; cities: string[]; is_active: boolean; reflect_website: boolean;
}
interface NormalizedCountry {
  code: string; name: string; flag: string; phoneCode: string; cities: string[];
}

const inputClass = "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20";

type Step = 1 | 2 | 3 | 4;

// ── Country Dropdown ──────────────────────────────────────────────
function CountryDropdown({ countries, value, onChange }: {
  countries: NormalizedCountry[]; value: NormalizedCountry | null; onChange: (c: NormalizedCountry) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const filtered = countries.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.code.toLowerCase().includes(query.toLowerCase())
  );
  return (
    <div className="relative">
      <button type="button" onClick={() => { setOpen(!open); setQuery(""); }}
        className={`${inputClass} flex items-center justify-between cursor-pointer`}>
        <span className={value ? "text-gray-900" : "text-gray-400"}>
          {value ? `${value.flag} ${value.name}` : "Select your country"}
        </span>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-1.5 w-full rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden">
            <div className="p-2.5 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <input autoFocus value={query} onChange={e => setQuery(e.target.value)}
                  placeholder="Search country..."
                  className="w-full rounded-lg border border-gray-100 bg-gray-50 py-2 pl-8 pr-3 text-sm outline-none" />
              </div>
            </div>
            <div className="max-h-52 overflow-y-auto p-1.5">
              {filtered.length === 0
                ? <p className="px-3 py-4 text-center text-sm text-gray-400">No results</p>
                : filtered.map(c => (
                  <button key={c.code} type="button" onClick={() => { onChange(c); setOpen(false); }}
                    className={`w-full rounded-xl px-3 py-2.5 text-left text-sm transition hover:bg-blue-50 flex items-center gap-2.5 ${value?.code === c.code ? "bg-blue-50 text-[#0b66d1] font-medium" : "text-gray-700"}`}>
                    <span className="text-lg">{c.flag}</span>
                    <span>{c.name}</span>
                    <span className="ml-auto text-xs font-bold text-gray-500">{c.code}</span>
                  </button>
                ))
              }
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── City Dropdown ─────────────────────────────────────────────────
function CityDropdown({ cities, value, onChange }: {
  cities: string[]; value: string; onChange: (c: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen(!open)}
        className={`${inputClass} flex items-center justify-between cursor-pointer`}>
        <span className={value ? "text-gray-900" : "text-gray-400"}>{value || "Select your city"}</span>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-1.5 w-full rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden">
            <div className="max-h-52 overflow-y-auto p-1.5">
              {cities.map(c => (
                <button key={c} type="button" onClick={() => { onChange(c); setOpen(false); }}
                  className={`w-full rounded-xl px-3 py-2.5 text-left text-sm transition hover:bg-blue-50 flex items-center gap-2 ${value === c ? "bg-blue-50 text-[#0b66d1] font-medium" : "text-gray-700"}`}>
                  <MapPin className="h-3.5 w-3.5 text-gray-400" />{c}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function DriverSignupPage() {
  const router = useRouter();

  // Countries
  const [countries,      setCountries]      = useState<NormalizedCountry[]>([]);
  const [loadingCountry, setLoadingCountry] = useState(true);
  const [selectedCountry,setSelectedCountry]= useState<NormalizedCountry | null>(null);
  const [selectedCity,   setSelectedCity]   = useState("");

  const [step,     setStep]     = useState<Step>(1);
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [errors,   setErrors]   = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    email: "", password: "", confirm: "",
    fullName: "", dob: "", phone: "", country: "US",
    licenseNumber: "", licenseState: "", licenseExpiry: "", consent: false,
  });

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  // Load countries from DB
  useEffect(() => {
    const load = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("countries_config")
          .select("code,name,flag,phone_code,cities,is_active,reflect_website")
          .eq("is_active", true)
          .eq("reflect_website", true)
          .order("name");

        if (data && data.length > 0) {
          setCountries(data.map((c: DBCountry) => ({
            code: c.code, name: c.name, flag: c.flag,
            phoneCode: c.phone_code, cities: c.cities || [],
          })));
        } else {
          setCountries([]);
        }
      } catch {
        setCountries([]);
      } finally {
        setLoadingCountry(false);
      }
    };
    load();
  }, []);

  const handleCountryChange = (c: NormalizedCountry) => {
    setSelectedCountry(c);
    setSelectedCity("");
    set("country", c.code);
    set("phone", "");
  };

  const validateStep = (s: Step) => {
    const e: Record<string, string> = {};
    if (s === 1) {
      if (!selectedCountry)                              e.country = "Please select your country";
      if (selectedCountry && selectedCountry.cities.length > 0 && !selectedCity) e.city = "Please select your city";
    }
    if (s === 2) {
      if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
      if (!form.password || form.password.length < 8)       e.password = "Min 8 characters";
      if (form.password !== form.confirm)                    e.confirm = "Passwords do not match";
    }
    if (s === 3) {
      if (!form.fullName.trim()) e.fullName = "Full legal name is required";
      if (!form.dob)             e.dob      = "Date of birth is required";
      if (!form.phone.trim())    e.phone    = "Phone number is required";
    }
    if (s === 4) {
      if (!form.licenseNumber.trim()) e.licenseNumber = "License number is required";
      if (!form.licenseExpiry)        e.licenseExpiry = "Expiry date is required";
      if (!form.consent)              e.consent       = "Consent is required to proceed";
    }
    return e;
  };

  const nextStep = () => {
    const errs = validateStep(step);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStep((step + 1) as Step);
  };

  const handleSubmit = async () => {
    const errs = validateStep(4);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const phoneCode = selectedCountry?.phoneCode || "";
      const res = await fetch("/api/driver/signup", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email:         form.email.trim().toLowerCase(),
          password:      form.password,
          fullName:      form.fullName.trim(),
          dob:           form.dob,
          phone:         `${phoneCode}${form.phone.trim()}`,
          countryCode:   form.country,
          licenseNumber: form.licenseNumber.trim(),
          licenseState:  form.licenseState.trim() || null,
          licenseExpiry: form.licenseExpiry,
          consent:       form.consent,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");
      toast.success("Account created! Please sign in to continue.");
      router.push("/login");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const STEPS = [
    { n: 1, label: "Location" },
    { n: 2, label: "Account"  },
    { n: 3, label: "Personal" },
    { n: 4, label: "License"  },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[420px] shrink-0 flex-col justify-between p-12 text-white"
        style={{ background: "linear-gradient(135deg, #0b66d1 0%, #0952a8 100%)" }}>
        {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
          <Image
          src="/logo bw.png"
          alt="BlackDrivo"
          width={140}
          height={40}
          className="object-contain transition-all duration-300"/>
          </Link>
        <div>
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
            <Car className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold leading-tight">Start your<br />driver journey</h2>
          <p className="mt-4 max-w-sm text-base text-white/70">
            Join BlackDrivo's premium chauffeur network. Complete your registration and start earning.
          </p>
          <div className="mt-8 space-y-3">
            {["Takes less than 3 minutes","Complete vehicle & docs later","Approved within 2–3 business days","Start accepting premium rides"].map((s, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-white/80">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-bold">{i + 1}</div>
                {s}
              </div>
            ))}
          </div>
          <div className="mt-8 flex items-start gap-3 rounded-xl bg-white/10 p-4">
            <Lock className="h-4 w-4 shrink-0 text-white/70 mt-0.5" />
            <p className="text-xs text-white/70 leading-relaxed">
              Name, date of birth, and license details <strong className="text-white">cannot be changed</strong> after submission. Please enter carefully.
            </p>
          </div>
        </div>
        <p className="text-xs text-white/40">© 2025 BlackDrivo. All rights reserved.</p>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 flex-col items-center justify-center bg-[#f5f5f5] px-4 py-12">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="mb-8 lg:hidden">
          <Link href="/" className="flex items-center shrink-0">
          <Image
          src="/logo bb.png"
          alt="BlackDrivo"
          width={140}
          height={40}
          className="object-contain transition-all duration-300"/>
          </Link>
          </div>

          {/* Step indicator */}
          <div className="mb-6 flex items-center gap-0">
            {STEPS.map((s, i) => (
              <div key={s.n} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all ${
                    step > s.n ? "bg-emerald-500 text-white"
                    : step === s.n ? "bg-[#0b66d1] text-white"
                    : "bg-gray-200 text-gray-400"
                  }`}>
                    {step > s.n ? <Check className="h-4 w-4" /> : s.n}
                  </div>
                  <span className={`text-[10px] font-medium ${step === s.n ? "text-[#0b66d1]" : "text-gray-400"}`}>{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-2 mb-4 rounded ${step > s.n ? "bg-emerald-500" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">

            {/* ── Step 1: Location ── */}
            {step === 1 && (
              <>
                <h1 className="text-xl font-bold text-gray-900">Where are you based?</h1>
                <p className="mt-1 text-sm text-gray-500">Select your country and city to get started</p>
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-700">Country *</label>
                    {loadingCountry
                      ? <div className={`${inputClass} flex items-center gap-2 text-gray-400`}>
                          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-gray-200 border-t-gray-400" /> Loading...
                        </div>
                      : <CountryDropdown countries={countries} value={selectedCountry} onChange={handleCountryChange} />
                    }
                    {errors.country && <p className="mt-1 text-xs text-red-500">{errors.country}</p>}
                  </div>

                  {selectedCountry && selectedCountry.cities.length > 0 && (
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-gray-700">City *</label>
                      <CityDropdown cities={selectedCountry.cities} value={selectedCity} onChange={setSelectedCity} />
                      {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ── Step 2: Account ── */}
            {step === 2 && (
              <>
                <h1 className="text-xl font-bold text-gray-900">Create your account</h1>
                <p className="mt-1 text-sm text-gray-500">Your login credentials</p>

                {/* Location summary */}
                {selectedCountry && (
                  <div className="mt-4 flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-3.5 py-2.5">
                    <span className="text-base">{selectedCountry.flag}</span>
                    <span className="text-sm font-medium text-gray-700">{selectedCountry.name}</span>
                    {selectedCity && <><span className="text-gray-300">·</span><span className="text-sm text-gray-500">{selectedCity}</span></>}
                    <button type="button" onClick={() => { setStep(1); setErrors({}); }} className="ml-auto text-xs text-[#0b66d1] hover:underline">Change</button>
                  </div>
                )}

                <div className="mt-5 space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-700">Email address *</label>
                    <input type="email" value={form.email} onChange={e => set("email", e.target.value)}
                      placeholder="you@example.com"
                      className={`${inputClass} ${errors.email ? "border-red-300" : ""}`} />
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-700">Password *</label>
                    <div className="relative">
                      <input type={showPass ? "text" : "password"} value={form.password}
                        onChange={e => set("password", e.target.value)} placeholder="Min 8 characters"
                        className={`${inputClass} pr-10 ${errors.password ? "border-red-300" : ""}`} />
                      <button type="button" onClick={() => setShowPass(!showPass)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-700">Confirm password *</label>
                    <input type={showPass ? "text" : "password"} value={form.confirm}
                      onChange={e => set("confirm", e.target.value)} placeholder="Repeat password"
                      className={`${inputClass} ${errors.confirm ? "border-red-300" : ""}`} />
                    {errors.confirm && <p className="mt-1 text-xs text-red-500">{errors.confirm}</p>}
                  </div>
                </div>
              </>
            )}

            {/* ── Step 3: Personal Info ── */}
            {step === 3 && (
              <>
                <h1 className="text-xl font-bold text-gray-900">Personal Information</h1>
                <p className="mt-1 text-sm text-gray-500">This information cannot be changed after submission</p>

                <div className="mb-5 mt-4 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5">
                  <AlertCircle className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
                  <p className="text-xs text-amber-700 leading-relaxed">
                    <strong>Important:</strong> Your full name and date of birth are <strong>permanently locked</strong> after signup for compliance reasons.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-700">
                      Full Legal Name * <span className="text-gray-400 font-normal">(as on license)</span>
                    </label>
                    <input value={form.fullName} onChange={e => set("fullName", e.target.value)}
                      placeholder="John Michael Smith"
                      className={`${inputClass} ${errors.fullName ? "border-red-300" : ""}`} />
                    {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-700">Date of Birth *</label>
                    <input type="date" value={form.dob} onChange={e => set("dob", e.target.value)}
                      className={`${inputClass} ${errors.dob ? "border-red-300" : ""}`} />
                    {errors.dob && <p className="mt-1 text-xs text-red-500">{errors.dob}</p>}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-700">Phone Number *</label>
                    <div className="flex gap-2">
                      {selectedCountry && (
                        <div className="flex h-[46px] items-center rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-600 shrink-0">
                          {selectedCountry.flag} {selectedCountry.phoneCode}
                        </div>
                      )}
                      <input value={form.phone} onChange={e => set("phone", e.target.value.replace(/\D/g, ""))}
                        placeholder="Enter phone number"
                        className={`${inputClass} flex-1 ${errors.phone ? "border-red-300" : ""}`} />
                    </div>
                    {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                  </div>
                </div>
              </>
            )}

            {/* ── Step 4: License ── */}
            {step === 4 && (
              <>
                <h1 className="text-xl font-bold text-gray-900">Driver License</h1>
                <p className="mt-1 text-sm text-gray-500">License details are locked after submission</p>

                <div className="mb-5 mt-4 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5">
                  <Lock className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
                  <p className="text-xs text-amber-700 leading-relaxed">
                    <strong>Important:</strong> License number cannot be changed after submission. Expiry date can be updated later with admin approval.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-gray-700">License Number *</label>
                      <input value={form.licenseNumber} onChange={e => set("licenseNumber", e.target.value)}
                        placeholder="e.g. D1234567"
                        className={`${inputClass} ${errors.licenseNumber ? "border-red-300" : ""}`} />
                      {errors.licenseNumber && <p className="mt-1 text-xs text-red-500">{errors.licenseNumber}</p>}
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-gray-700">State / Province</label>
                      <input value={form.licenseState} onChange={e => set("licenseState", e.target.value)}
                        placeholder="e.g. NY" className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-700">License Expiry Date *</label>
                    <input type="date" value={form.licenseExpiry} onChange={e => set("licenseExpiry", e.target.value)}
                      className={`${inputClass} ${errors.licenseExpiry ? "border-red-300" : ""}`} />
                    {errors.licenseExpiry && <p className="mt-1 text-xs text-red-500">{errors.licenseExpiry}</p>}
                  </div>

                  <div className={`rounded-xl border p-4 transition ${form.consent ? "border-[#0b66d1]/20 bg-blue-50" : "border-amber-200 bg-amber-50"}`}>
                    <div className="flex items-start gap-3">
                      <input type="checkbox" id="consent" checked={form.consent}
                        onChange={e => set("consent", e.target.checked)}
                        className="mt-0.5 h-4 w-4 cursor-pointer accent-[#0b66d1]" />
                      <label htmlFor="consent" className="cursor-pointer">
                        <p className="text-sm font-semibold text-gray-900">Background Check Consent *</p>
                        <p className="mt-1 text-xs text-gray-600 leading-relaxed">
                          I consent to BlackDrivo conducting a background check including criminal history, driving record, and identity verification. This is required for all drivers.
                        </p>
                      </label>
                    </div>
                    {errors.consent && <p className="mt-2 text-xs text-red-500">{errors.consent}</p>}
                  </div>
                </div>
              </>
            )}

            {/* Actions */}
            <div className="mt-7 flex items-center justify-between">
              {step > 1 ? (
                <button onClick={() => { setStep((step - 1) as Step); setErrors({}); }}
                  className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
                  ← Back
                </button>
              ) : <div />}

              {step < 4 ? (
                <button onClick={nextStep}
                  className="flex items-center gap-2 rounded-xl bg-[#0b66d1] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#0952a8] transition">
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={loading}
                  className="flex items-center gap-2 rounded-xl bg-[#0b66d1] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#0952a8] disabled:opacity-60 transition">
                  {loading
                    ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    : <><Check className="h-4 w-4" /> Create Account</>
                  }
                </button>
              )}
            </div>
          </div>

          <p className="mt-5 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-[#0b66d1] hover:text-[#0952a8]">Sign in</Link>
          </p>
          <p className="mt-2 text-center text-xs text-gray-400">
            By signing up you agree to our{" "}
            <Link href="/terms-of-service" className="text-[#0b66d1]">Terms of Service</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
