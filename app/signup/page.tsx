"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, CheckCircle, ArrowRight, ChevronDown, Search, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_COUNTRIES } from "@/lib/data/locations";

interface DBCountry {
  code: string; name: string; flag: string; phone_code: string;
  currency: string; symbol: string; cities: string[]; is_active: boolean; reflect_website: boolean;
}
interface NormalizedCountry {
  code: string; name: string; flag: string; phoneCode: string; currency: string; cities: string[];
}

const inputClass = "w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20";

// ── Country Dropdown ──────────────────────────────────────────────
function CountryDropdown({ countries, value, onChange }: { countries: NormalizedCountry[]; value: NormalizedCountry | null; onChange: (c: NormalizedCountry) => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const filtered = countries.filter(c => c.name.toLowerCase().includes(query.toLowerCase()) || c.code.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="relative">
      <button type="button" onClick={() => { setOpen(!open); setQuery(""); }}
        className={`${inputClass} flex items-center justify-between cursor-pointer`}>
        <span className={value ? "text-gray-900" : "text-gray-400"}>{value ? `${value.flag} ${value.name}` : "Select your country"}</span>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}
            className="absolute z-50 mt-1.5 w-full rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden">
            <div className="p-2.5 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Search country..."
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
                    <span className="ml-auto text-xs text-gray-400">{c.phoneCode}</span>
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
function CityDropdown({ cities, value, onChange }: { cities: string[]; value: string; onChange: (c: string) => void }) {
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
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}
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

const perks = ["Instant booking confirmation", "Booking history & receipts", "Saved locations", "Priority customer support"];

export default function SignupPage() {
  const router = useRouter();
  const [countries,      setCountries]      = useState<NormalizedCountry[]>([]);
  const [loadingCountry, setLoadingCountry] = useState(true);
  const [step,           setStep]           = useState<1 | 2>(1);
  const [selectedCountry,setSelectedCountry]= useState<NormalizedCountry | null>(null);
  const [selectedCity,   setSelectedCity]   = useState("");
  const [fullName,       setFullName]       = useState("");
  const [email,          setEmail]          = useState("");
  const [phone,          setPhone]          = useState("");
  const [gender,         setGender]         = useState<"male" | "female" | "">("");
  const [password,       setPassword]       = useState("");
  const [confirm,        setConfirm]        = useState("");
  const [showPass,       setShowPass]       = useState(false);
  const [loading,        setLoading]        = useState(false);
  const [error,          setError]          = useState("");
  const [success,        setSuccess]        = useState(false);
  const [countdown,      setCountdown]      = useState(4);

  // Load countries from DB
  useEffect(() => {
    const load = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("countries_config")
          .select("code,name,flag,phone_code,currency,symbol,cities,is_active,reflect_website")
          .eq("is_active", true)
          .eq("reflect_website", true)
          .order("name");
        if (data && data.length > 0) {
          setCountries(data.map((c: DBCountry) => ({ code: c.code, name: c.name, flag: c.flag, phoneCode: c.phone_code, currency: c.currency, cities: c.cities || [] })));
        } else {
          setCountries(DEFAULT_COUNTRIES.map(c => ({ code: c.code, name: c.name, flag: c.flag, phoneCode: c.phoneCode, currency: c.currency, cities: c.cities.map(ci => ci.name) })));
        }
      } catch {
        setCountries(DEFAULT_COUNTRIES.map(c => ({ code: c.code, name: c.name, flag: c.flag, phoneCode: c.phoneCode, currency: c.currency, cities: c.cities.map(ci => ci.name) })));
      } finally {
        setLoadingCountry(false);
      }
    };
    load();
  }, []);

  // Countdown redirect
  useEffect(() => {
    if (!success) return;
    const t = setInterval(() => setCountdown(c => { if (c <= 1) { clearInterval(t); router.push("/login"); return 0; } return c - 1; }), 1000);
    return () => clearInterval(t);
  }, [success, router]);

  const handleCountryChange = (c: NormalizedCountry) => { setSelectedCountry(c); setSelectedCity(""); setPhone(""); };

  const handleNext = () => {
    if (!selectedCountry) { setError("Please select your country"); return; }
    setError(""); setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!fullName.trim())     { setError("Please enter your full name");            return; }
    if (!email.trim())        { setError("Please enter your email");                return; }
    if (!phone.trim())        { setError("Please enter your phone number");         return; }
    if (!gender)              { setError("Please select your gender");              return; }
    if (password.length < 8)  { setError("Password must be at least 8 characters");return; }
    if (password !== confirm)  { setError("Passwords do not match");                return; }
    setLoading(true);
    try {
      const supabase   = createClient();
      const fullPhone  = `${selectedCountry!.phoneCode}${phone.trim()}`;
      const { data, error: authError } = await supabase.auth.signUp({
        email, password,
        options: {
          data: { full_name: fullName, phone: fullPhone, gender, country_code: selectedCountry!.code, city: selectedCity || null, role: "user", user_type: "passenger" },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (authError) { setError(authError.message); setLoading(false); return; }
      if (data.session) {
        await supabase.from("users").upsert({ id: data.session.user.id, email: data.session.user.email ?? email, name: fullName || email, full_name: fullName || null, phone: fullPhone || null, gender: gender || null, country_code: selectedCountry!.code, city_text: selectedCity || null, role: 'user' as never, status: 'active' as never, user_type: 'passenger' } as never, { onConflict: "id" });
        router.push("/user/dashboard");
      } else {
        setSuccess(true);
      }
    } catch { setError("Something went wrong. Please try again."); }
    setLoading(false);
  };

  // Success screen
  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
            <CheckCircle className="h-7 w-7 text-[#0b66d1]" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Check your email</h2>
          <p className="mt-2 text-sm text-gray-600">We sent a confirmation link to <span className="font-medium text-gray-900">{email}</span>.</p>
          <p className="mt-4 text-xs text-gray-400">Redirecting in {countdown}s…</p>
          <Link href="/login" className="mt-4 block rounded-xl bg-[#0b66d1] py-3 text-sm font-semibold text-white transition hover:bg-[#0952a8]">
            Go to sign in
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{ backgroundImage: "linear-gradient(135deg, rgba(9,82,168,0.9) 0%, rgba(11,102,209,0.85) 100%), url('https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=80')", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="flex flex-col justify-between p-12 text-white">
          <Link href="/"><Image src="/logo bw.png" alt="BlackDrivo" width={140} height={40} className="object-contain" /></Link>
          <div>
            <h2 className="text-4xl font-bold leading-tight text-white">Join thousands<br />of happy riders.</h2>
            <p className="mt-4 mb-6 text-base text-white/70">Create your free account and book premium rides in minutes.</p>
            <ul className="space-y-3">
              {perks.map(p => (
                <li key={p} className="flex items-center gap-2.5 text-sm text-white/80">
                  <CheckCircle className="h-4 w-4 text-white shrink-0" /> {p}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-white/40">© 2025 BlackDrivo. All rights reserved.</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 items-center justify-center bg-[#f5f5f5] px-4 py-12 overflow-y-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="mb-6 lg:hidden">
            <Link href="/"><Image src="/logo bb.png" alt="BlackDrivo" width={140} height={40} className="object-contain" /></Link>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">

            {/* Header */}
            <div className="flex items-center gap-3">
              {step === 2 && (
                <button type="button" onClick={() => { setStep(1); setError(""); }}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 transition">
                  ←
                </button>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {step === 1 ? "Where are you based?" : "Create an account"}
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  {step === 1 ? "Select your country and city to get started" : "Complete your profile"}
                </p>
              </div>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-2 mt-5">
              {[1, 2].map(s => (
                <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${step >= s ? "bg-[#0b66d1]" : "bg-gray-200"}`} />
              ))}
            </div>

            {/* Error */}
            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
            )}

            {/* ── STEP 1 ── */}
            {step === 1 && (
              <div className="mt-6 space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">Country *</label>
                  {loadingCountry
                    ? <div className={`${inputClass} flex items-center gap-2 text-gray-400`}>
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-gray-200 border-t-gray-400" /> Loading...
                      </div>
                    : <CountryDropdown countries={countries} value={selectedCountry} onChange={handleCountryChange} />
                  }
                </div>

                {selectedCountry && selectedCountry.cities.length > 0 && (
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-700">City</label>
                    <CityDropdown cities={selectedCountry.cities} value={selectedCity} onChange={setSelectedCity} />
                  </div>
                )}

                <button type="button" onClick={handleNext}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b66d1] py-3.5 text-sm font-semibold text-white transition hover:bg-[#0952a8]">
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* ── STEP 2 ── */}
            {step === 2 && (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">

                {/* Selected country + city summary */}
                {selectedCountry && (
                  <div className="flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-3.5 py-2.5">
                    <span className="text-lg">{selectedCountry.flag}</span>
                    <span className="text-sm font-medium text-gray-700">{selectedCountry.name}</span>
                    {selectedCity && <><span className="text-gray-300">·</span><span className="text-sm text-gray-500">{selectedCity}</span></>}
                    <button type="button" onClick={() => { setStep(1); setError(""); }} className="ml-auto text-xs text-[#0b66d1] hover:underline">Change</button>
                  </div>
                )}

                {/* Full name */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">Full Name *</label>
                  <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="John Smith" className={inputClass} />
                </div>

                {/* Email */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">Email Address *</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="john@example.com" className={inputClass} />
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">Phone Number *</label>
                  <div className="flex gap-2">
                    <div className="flex h-[50px] shrink-0 items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-700">
                      <span>{selectedCountry?.flag}</span>
                      <span>{selectedCountry?.phoneCode}</span>
                    </div>
                    <input value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ""))}
                      placeholder="Enter phone number" className={`${inputClass} flex-1`} />
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">Gender *</label>
                  <div className="grid grid-cols-2 gap-3">
                    {(["male", "female"] as const).map(g => (
                      <button key={g} type="button" onClick={() => setGender(g)}
                        className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-medium transition ${gender === g ? "border-[#0b66d1] bg-blue-50 text-[#0b66d1]" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                        <span>{g === "male" ? "👨" : "👩"}</span>
                        {g.charAt(0).toUpperCase() + g.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">Password *</label>
                  <div className="relative">
                    <input type={showPass ? "text" : "password"} value={password}
                      onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters"
                      className={`${inputClass} pr-11`} />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm password */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">Confirm Password *</label>
                  <input type={showPass ? "text" : "password"} value={confirm}
                    onChange={e => setConfirm(e.target.value)} placeholder="Repeat your password"
                    className={`${inputClass} ${confirm && confirm !== password ? "border-red-300" : ""}`} />
                  {confirm && confirm !== password && <p className="mt-1 text-xs text-red-500">Passwords do not match</p>}
                </div>

                {/* Submit */}
                <button type="submit" disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b66d1] py-3.5 text-sm font-semibold text-white transition hover:bg-[#0952a8] disabled:opacity-60 mt-2">
                  {loading
                    ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    : <>Create Account <ArrowRight className="h-4 w-4" /></>
                  }
                </button>

                <p className="text-center text-xs text-gray-400">
                  By signing up you agree to our{" "}
                  <Link href="/terms-of-service" className="text-[#0b66d1]">Terms</Link> and{" "}
                  <Link href="/privacy-policy" className="text-[#0b66d1]">Privacy Policy</Link>
                </p>
              </form>
            )}
          </div>

          <p className="mt-5 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-[#0b66d1] hover:text-[#0952a8]">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
