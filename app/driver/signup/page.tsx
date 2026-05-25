"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, Car, Lock, AlertCircle, Check } from "lucide-react";
import { toast } from "sonner";
import { DEFAULT_COUNTRIES } from "@/lib/data/locations";

const inputClass = "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20";

type Step = 1 | 2 | 3;

export default function DriverSignupPage() {
  const router = useRouter();
  const [step,     setStep]     = useState<Step>(1);
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [errors,   setErrors]   = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    // Step 1 — Account
    email:    "",
    password: "",
    confirm:  "",
    // Step 2 — Personal (locked after submit)
    fullName: "",
    dob:      "",
    phone:    "",
    country:  "US",
    // Step 3 — License (locked after submit)
    licenseNumber: "",
    licenseState:  "",
    licenseExpiry: "",
    consent:       false,
  });

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));
  const selCountry = DEFAULT_COUNTRIES.find(c => c.code === form.country);

  const validateStep = (s: Step) => {
    const e: Record<string, string> = {};
    if (s === 1) {
      if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
      if (!form.password || form.password.length < 8) e.password = "Min 8 characters";
      if (form.password !== form.confirm) e.confirm = "Passwords do not match";
    }
    if (s === 2) {
      if (!form.fullName.trim()) e.fullName = "Full legal name is required";
      if (!form.dob)             e.dob      = "Date of birth is required";
      if (!form.phone.trim())    e.phone    = "Phone number is required";
    }
    if (s === 3) {
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
    const errs = validateStep(3);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/driver/signup", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email:          form.email.trim().toLowerCase(),
          password:       form.password,
          fullName:       form.fullName.trim(),
          dob:            form.dob,
          phone:          form.phone.trim(),
          countryCode:    form.country,
          licenseNumber:  form.licenseNumber.trim(),
          licenseState:   form.licenseState.trim() || null,
          licenseExpiry:  form.licenseExpiry,
          consent:        form.consent,
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
    { n: 1, label: "Account"  },
    { n: 2, label: "Personal" },
    { n: 3, label: "License"  },
  ];

  return (
    <div className="flex min-h-screen">
      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-[420px] shrink-0 flex-col justify-between p-12 text-white"
        style={{ background: "linear-gradient(135deg, #0b66d1 0%, #0952a8 100%)" }}>
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
            <Image src="/B Logo Black Theme.png" alt="BlackDrivo" width={22} height={22} className="object-contain invert mix-blend-screen" />
          </div>
          <span className="text-xl font-bold">BlackDrivo</span>
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
            {[
              "Takes less than 3 minutes",
              "Complete vehicle & docs later",
              "Approved within 2–3 business days",
              "Start accepting premium rides",
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-white/80">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-bold">{i + 1}</div>
                {s}
              </div>
            ))}
          </div>

          {/* Lock notice */}
          <div className="mt-8 flex items-start gap-3 rounded-xl bg-white/10 p-4">
            <Lock className="h-4 w-4 shrink-0 text-white/70 mt-0.5" />
            <p className="text-xs text-white/70 leading-relaxed">
              Name, date of birth, and license details <strong className="text-white">cannot be changed</strong> after submission. Please enter carefully.
            </p>
          </div>
        </div>
        <p className="text-xs text-white/40">© 2025 BlackDrivo. All rights reserved.</p>
      </div>

      {/* ── Right panel ── */}
      <div className="flex flex-1 flex-col items-center justify-center bg-[#f5f5f5] px-4 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 lg:hidden">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0b66d1]">
                <Image src="/B Logo Black Theme.png" alt="BlackDrivo" width={18} height={18} className="object-contain invert mix-blend-screen" />
              </div>
              <span className="text-lg font-bold text-gray-900">BlackDrivo</span>
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

            {/* ── Step 1: Account ── */}
            {step === 1 && (
              <>
                <h1 className="text-xl font-bold text-gray-900">Create your account</h1>
                <p className="mt-1 text-sm text-gray-500">Your login credentials</p>
                <div className="mt-6 space-y-4">
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
                        onChange={e => set("password", e.target.value)}
                        placeholder="Min 8 characters"
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
                      onChange={e => set("confirm", e.target.value)}
                      placeholder="Repeat password"
                      className={`${inputClass} ${errors.confirm ? "border-red-300" : ""}`} />
                    {errors.confirm && <p className="mt-1 text-xs text-red-500">{errors.confirm}</p>}
                  </div>
                </div>
              </>
            )}

            {/* ── Step 2: Personal Info ── */}
            {step === 2 && (
              <>
                <div className="flex items-start gap-2 mb-5">
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">Personal Information</h1>
                    <p className="mt-1 text-sm text-gray-500">This information cannot be changed after submission</p>
                  </div>
                </div>

                {/* Lock warning */}
                <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5">
                  <AlertCircle className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
                  <p className="text-xs text-amber-700 leading-relaxed">
                    <strong>Important:</strong> Your full name and date of birth are <strong>permanently locked</strong> after signup for compliance reasons. Please double-check before continuing.
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
                    <label className="mb-1.5 block text-xs font-medium text-gray-700">Country</label>
                    <select value={form.country} onChange={e => set("country", e.target.value)} className={inputClass}>
                      {DEFAULT_COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-700">Phone Number *</label>
                    <div className="flex gap-2">
                      {selCountry && (
                        <div className="flex h-[46px] items-center rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-600 shrink-0">
                          {selCountry.flag} {selCountry.phoneCode}
                        </div>
                      )}
                      <input value={form.phone} onChange={e => set("phone", e.target.value)}
                        placeholder={selCountry?.phonePlaceholder || "555 000 0000"}
                        className={`${inputClass} flex-1 ${errors.phone ? "border-red-300" : ""}`} />
                    </div>
                    {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                  </div>
                </div>
              </>
            )}

            {/* ── Step 3: License ── */}
            {step === 3 && (
              <>
                <div className="mb-5">
                  <h1 className="text-xl font-bold text-gray-900">Driver License</h1>
                  <p className="mt-1 text-sm text-gray-500">License details are locked after submission</p>
                </div>

                <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5">
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

                  {/* Background check consent */}
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

            {/* ── Actions ── */}
            <div className="mt-7 flex items-center justify-between">
              {step > 1 ? (
                <button onClick={() => { setStep((step - 1) as Step); setErrors({}); }}
                  className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
                  ← Back
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
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
