"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle, ArrowLeft, Upload, Loader2, AlertCircle, X, Mail,
  Eye, EyeOff,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import OtpInput from "@/components/shared/OtpInput";

// Mirrors CapApp's driver signup exactly (D:\BlackDrivoCapApp\src\screens\auth\
// SignupStep1-4.jsx + signup/*): same fields, same step order, same
// Supabase mechanism (email OTP creates the auth user; password is attached
// after verification; a `drivers` row is upserted directly from the client —
// no custom API route, matching how the app does it), and country/city
// pulled from the same `countries_config` table/columns the app queries.
// Visual shell (flat, no card/sidebar) matches vendor.blackdrivo.com's
// registration form, same as before.
//
// Vehicle info is intentionally NOT part of this flow — CapApp only collects
// it later, post-approval, from a separate authenticated screen.

type Step = "location" | "details" | "verify" | "documents";

const STEPS: { id: Step; title: string }[] = [
  { id: "location",  title: "Where are you based?" },
  { id: "details",   title: "Your Details" },
  { id: "verify",    title: "Verify your email" },
  { id: "documents", title: "Documents" },
];

interface DBCountry {
  code: string;
  name: string;
  flag: string;
  phone_code: string;
  cities: string[];
}

const fieldLabelClass = "mb-1.5 block text-xs font-medium text-gray-500";
const flatInputClass =
  "w-full border-0 border-b border-gray-200 bg-transparent px-0 py-2.5 text-base text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#0b66d1]";

function FlatField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className={fieldLabelClass}>{label} {required && <span className="text-[#0b66d1]">*</span>}</label>
      {children}
    </div>
  );
}

interface FileSlotProps {
  label: string
  file: File | null
  onSet: (f: File | null) => void
  required?: boolean
  accept?: string
  hint?: string
}

function FileSlot({ label, file, onSet, required, accept = ".jpg,.jpeg,.png,.webp", hint }: FileSlotProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div>
      <label className={fieldLabelClass}>{label} {required && <span className="text-[#0b66d1]">*</span>}</label>
      <input type="file" ref={inputRef} accept={accept} className="hidden" onChange={e => onSet(e.target.files?.[0] ?? null)} />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`flex w-full items-center justify-between border-0 border-b border-gray-200 py-2.5 text-left text-sm transition hover:border-[#0b66d1] ${file ? "text-gray-900" : "text-gray-400"}`}
      >
        <span className="flex items-center gap-2 truncate">
          {file ? <CheckCircle className="h-4 w-4 shrink-0 text-[#0b66d1]" /> : <Upload className="h-4 w-4 shrink-0 text-gray-400" />}
          {file ? file.name : hint || "Click to upload (JPG or PNG · Max 10MB)"}
        </span>
        {file && (
          <span role="button" onClick={e => { e.stopPropagation(); onSet(null) }} className="ml-2 shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <X className="h-3.5 w-3.5" />
          </span>
        )}
      </button>
    </div>
  )
}

const LICENSE_MONTHS = [
  "01 — January", "02 — February", "03 — March", "04 — April", "05 — May", "06 — June",
  "07 — July", "08 — August", "09 — September", "10 — October", "11 — November", "12 — December",
];
const LICENSE_YEARS = Array.from({ length: 20 }, (_, i) => String(new Date().getFullYear() + i));

export default function DriverRegisterPage() {
  const router  = useRouter()
  const [step, setStep]     = useState<Step>("location")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]     = useState(false)
  const [stepError, setStepError] = useState("")
  const [submitError, setSubmitError] = useState("")
  const [userId, setUserId] = useState("")

  // ── Location — countries_config, same table/columns CapApp queries ──
  const [countries, setCountries]         = useState<DBCountry[]>([])
  const [loadingCountries, setLoadingCountries] = useState(true)
  const [selCountry, setSelCountry]       = useState<DBCountry | null>(null)
  const [selCity, setSelCity]             = useState("")

  useEffect(() => {
    const supabase = createClient()
    ;(supabase as any)
      .from("countries_config")
      .select("code, name, flag, phone_code, cities")
      .eq("is_active", true)
      .order("name")
      .then(({ data, error }: { data: DBCountry[] | null; error: unknown }) => {
        if (error) console.error("Countries error:", error)
        setCountries(data || [])
        setLoadingCountries(false)
      })
  }, [])

  // ── Details ──────────────────────────────────────────────────
  const [fullName, setFullName]           = useState("")
  const [email, setEmail]                 = useState("")
  const [phone, setPhone]                 = useState("")
  const [password, setPassword]           = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPass, setShowPass]           = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)
  const [referralCode, setReferralCode]   = useState("")

  // ── Verify ───────────────────────────────────────────────────
  const [otpCode, setOtpCode]     = useState("")
  const [otpSent, setOtpSent]     = useState(false)
  const [otpSending, setOtpSending] = useState(false)
  const [otpVerifying, setOtpVerifying] = useState(false)

  // ── Documents ────────────────────────────────────────────────
  const [profilePicture, setProfilePicture] = useState<File | null>(null)
  const [licenseNumber, setLicenseNumber]   = useState("")
  const [licenseMonth, setLicenseMonth]     = useState("")
  const [licenseYear, setLicenseYear]       = useState("")
  const [licenseFront, setLicenseFront]     = useState<File | null>(null)
  const [licenseBack, setLicenseBack]       = useState<File | null>(null)
  const [selfieDoc, setSelfieDoc]           = useState<File | null>(null)
  const [consent, setConsent]               = useState(false)

  const stepIndex = STEPS.findIndex(s => s.id === step)

  // ── Send OTP — auto-fires once on arriving at the Verify step ───
  const sendOtp = async () => {
    setOtpSending(true)
    setStepError("")
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true, data: { name: fullName, role: "driver" } },
      })
      if (error) throw error
      setOtpSent(true)
      toast.success("Code sent — check your email")
    } catch (e: any) {
      toast.error(e.message || "Couldn't send the code. Please try again.")
    }
    setOtpSending(false)
  }

  useEffect(() => {
    if (step === "verify" && !otpSent && !otpSending) sendOtp()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  const handleVerifyOtp = async () => {
    if (otpCode.trim().length !== 6) { setStepError("Enter the 6-digit code"); return }
    setOtpVerifying(true)
    setStepError("")
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.verifyOtp({ email, token: otpCode.trim(), type: "email" })
      if (error) throw new Error("That code is incorrect or expired. Please try again.")

      const uid = data.user!.id
      setUserId(uid)

      const { error: pwError } = await supabase.auth.updateUser({ password })
      if (pwError) throw pwError

      const { error: driverError } = await (supabase as any).from("drivers").upsert({
        id: uid,
        user_id: uid,
        full_name: fullName,
        email,
        phone: `${selCountry?.phone_code || ""}${phone}`,
        country_code: selCountry?.code || null,
        city_text: selCity || null,
        referral_code: referralCode.trim() || null,
        status: "pending",
        is_online: false,
      })
      if (driverError) throw driverError

      setStep("documents")
    } catch (e: any) {
      setStepError(e.message || "Verification failed")
    }
    setOtpVerifying(false)
  }

  // ── Step validation ──────────────────────────────────────────
  const validateStep = (): string | null => {
    switch (step) {
      case "location":
        if (!selCountry) return "Please select your country"
        if (!selCity)    return "Please select your city"
        return null
      case "details":
        if (!fullName.trim() || fullName.trim().length < 2) return "Enter your full name"
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))       return "Enter a valid email address"
        if (!phone.trim())                                    return "Phone number is required"
        if (!password || password.length < 8)                 return "Password must be at least 8 characters"
        if (password !== confirmPassword)                      return "Passwords don't match"
        return null
      default:
        return null
    }
  }

  const goNext = () => {
    const err = validateStep()
    if (err) { setStepError(err); return }
    setStepError("")
    if (stepIndex < STEPS.length - 1) setStep(STEPS[stepIndex + 1].id)
  }

  const goBack = () => {
    setStepError("")
    if (stepIndex > 0) setStep(STEPS[stepIndex - 1].id)
  }

  // ── Submit documents ─────────────────────────────────────────
  const handleSubmit = async () => {
    if (!profilePicture)        { setStepError("Profile picture is required"); return }
    if (!licenseNumber.trim())  { setStepError("License number is required"); return }
    if (!licenseMonth || !licenseYear) { setStepError("License expiry is required"); return }
    if (!licenseFront || !licenseBack) { setStepError("License front and back photos are required"); return }
    if (!selfieDoc)              { setStepError("Selfie with document is required"); return }
    if (!consent)                 { setStepError("Background check consent is required to continue"); return }

    setStepError("")
    setLoading(true)
    setSubmitError("")
    try {
      const supabase = createClient()

      const uploadFile = async (file: File, name: string) => {
        const ext  = file.name.split(".").pop() ?? "jpg"
        const path = `${userId}/${name}-${Date.now()}.${ext}`
        const { error } = await supabase.storage.from("driver-documents").upload(path, file, { upsert: true })
        if (error) throw error
        const { data } = supabase.storage.from("driver-documents").getPublicUrl(path)
        return data.publicUrl
      }

      const [profileUrl, frontUrl, backUrl, selfieUrl] = await Promise.all([
        uploadFile(profilePicture, "driver_photo"),
        uploadFile(licenseFront,   "license_front"),
        uploadFile(licenseBack,    "license_back"),
        uploadFile(selfieDoc,      "selfie_doc"),
      ])

      const { error: updateError } = await (supabase as any).from("drivers").update({
        driver_photo_url:  profileUrl,
        license_front_url: frontUrl,
        license_back_url:  backUrl,
        selfie_doc_url:    selfieUrl,
        license_number:    licenseNumber.trim(),
        license_expiry:    `${licenseYear}-${licenseMonth}-01`,
        background_check_consent: true,
        background_check_consent_at: new Date().toISOString(),
        submitted_at: new Date().toISOString(),
      }).eq("user_id", userId)
      if (updateError) throw updateError

      await supabase.auth.signOut()
      toast.success("Application submitted!")
      setSubmitted(true)
    } catch (err: any) {
      const msg = err.message || "Submission failed"
      setSubmitError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  // ── Success ──────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f2f2f0] px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md rounded-3xl bg-white p-10 text-center shadow-sm"
        >
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
            <CheckCircle className="h-8 w-8 text-[#0b66d1]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Application submitted!</h2>
          <p className="mt-3 text-sm text-gray-600">
            Thank you for applying to drive with BlackDrivo. Our team will review your application
            within 2–3 business days and contact you at{" "}
            <span className="font-medium text-gray-900">{email}</span>.
          </p>
          <div className="mt-6 space-y-2">
            {["Background check initiated", "Documents under review", "You'll receive an email with next steps"].map(item => (
              <div key={item} className="flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-2.5 text-left text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 shrink-0 text-[#0b66d1]" /> {item}
              </div>
            ))}
          </div>
          <button
            onClick={() => router.push("/driver/login")}
            className="mt-6 block w-full rounded-xl bg-[#0b66d1] py-3 text-sm font-semibold text-white transition hover:bg-[#0952a8]"
          >
            Go to Login
          </button>
        </motion.div>
      </div>
    )
  }

  const currentTitle = STEPS[stepIndex].title

  return (
    <div className="min-h-screen bg-[#f2f2f0]">
      <div className="mx-auto max-w-2xl px-6 py-10 md:px-4">

        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image src="/logo bb.png" alt="BlackDrivo" width={120} height={32} className="object-contain" style={{ height: "auto" }} />
          </Link>
          <Link href="/contact" className="text-xs font-medium text-gray-500 hover:text-gray-900">Support</Link>
        </div>

        <div className="mt-8 flex gap-2">
          {STEPS.map((s, i) => (
            <div key={s.id} className={`h-1 flex-1 rounded-full transition-colors ${i <= stepIndex ? "bg-[#0b66d1]" : "bg-gray-200"}`} />
          ))}
        </div>

        <button
          type="button"
          onClick={() => (stepIndex > 0 && step !== "verify" ? goBack() : router.push("/partner"))}
          className="mt-6 flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm transition hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>

            <h1 className="mt-8 text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">{currentTitle}</h1>
            <p className="mt-2 text-sm text-gray-400">Driver application — step {stepIndex + 1} of {STEPS.length}</p>

            <div className="mt-10 space-y-8">

              {/* ── Location ── */}
              {step === "location" && (
                <>
                  <FlatField label="Country" required>
                    <select
                      value={selCountry?.code || ""}
                      disabled={loadingCountries}
                      onChange={e => { const c = countries.find(x => x.code === e.target.value) || null; setSelCountry(c); setSelCity("") }}
                      className={`${flatInputClass} ${selCountry ? "" : "text-gray-400"}`}
                    >
                      <option value="">{loadingCountries ? "Loading..." : "Choose a country"}</option>
                      {countries.map(c => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
                    </select>
                  </FlatField>

                  {selCountry && (
                    <FlatField label="City" required>
                      <select
                        value={selCity}
                        onChange={e => setSelCity(e.target.value)}
                        className={`${flatInputClass} ${selCity ? "" : "text-gray-400"}`}
                      >
                        <option value="">Choose a city</option>
                        {selCountry.cities.map(city => <option key={city} value={city}>{city}</option>)}
                      </select>
                    </FlatField>
                  )}
                </>
              )}

              {/* ── Details ── */}
              {step === "details" && (
                <>
                  <FlatField label="Full Name" required>
                    <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="John Smith" className={flatInputClass} />
                  </FlatField>
                  <FlatField label="Email Address" required>
                    <div className="relative">
                      <Mail className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@example.com" className={`${flatInputClass} pl-6`} />
                    </div>
                  </FlatField>
                  <FlatField label="Phone Number" required>
                    <div className="relative">
                      {selCountry && <span className="absolute left-0 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500">{selCountry.phone_code}</span>}
                      <input value={phone} onChange={e => setPhone(e.target.value)} type="tel" placeholder="3001234567" className={`${flatInputClass} ${selCountry ? "pl-9" : ""}`} />
                    </div>
                  </FlatField>
                  <FlatField label="Create Password" required>
                    <div className="relative">
                      <input value={password} onChange={e => setPassword(e.target.value)} type={showPass ? "text" : "password"} minLength={8} placeholder="Min. 8 characters" className={`${flatInputClass} pr-8`} />
                      <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </FlatField>
                  <FlatField label="Confirm Password" required>
                    <div className="relative">
                      <input value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} type={showConfirmPass ? "text" : "password"} minLength={8} placeholder="Re-enter password" className={`${flatInputClass} pr-8`} />
                      <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showConfirmPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </FlatField>
                  <FlatField label="Referral Code">
                    <input value={referralCode} onChange={e => setReferralCode(e.target.value.toUpperCase())} placeholder="Optional" className={flatInputClass} />
                  </FlatField>
                </>
              )}

              {/* ── Verify ── */}
              {step === "verify" && (
                <>
                  <p className="text-sm text-gray-500">
                    We sent a 6-digit code to <span className="font-medium text-gray-900">{email}</span>.
                  </p>
                  <FlatField label="Enter OTP" required>
                    <OtpInput value={otpCode} onChange={setOtpCode} disabled={otpVerifying} autoFocus />
                  </FlatField>
                  <button type="button" onClick={sendOtp} disabled={otpSending} className="text-sm font-semibold text-[#0b66d1] hover:text-[#0952a8] disabled:opacity-60">
                    {otpSending ? "Resending..." : "Resend code"}
                  </button>
                </>
              )}

              {/* ── Documents ── */}
              {step === "documents" && (
                <>
                  <FileSlot label="Profile Picture" file={profilePicture} onSet={setProfilePicture} required />
                  <FlatField label="License Number" required>
                    <input value={licenseNumber} onChange={e => setLicenseNumber(e.target.value)} placeholder="License number" className={flatInputClass} />
                  </FlatField>
                  <div className="grid gap-8 sm:grid-cols-2">
                    <FlatField label="License Expiry Month" required>
                      <select value={licenseMonth} onChange={e => setLicenseMonth(e.target.value)} className={`${flatInputClass} ${licenseMonth ? "" : "text-gray-400"}`}>
                        <option value="">Select month</option>
                        {LICENSE_MONTHS.map(m => <option key={m} value={m.split(" — ")[0]}>{m}</option>)}
                      </select>
                    </FlatField>
                    <FlatField label="License Expiry Year" required>
                      <select value={licenseYear} onChange={e => setLicenseYear(e.target.value)} className={`${flatInputClass} ${licenseYear ? "" : "text-gray-400"}`}>
                        <option value="">Select year</option>
                        {LICENSE_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </FlatField>
                  </div>
                  <div className="grid gap-8 sm:grid-cols-2">
                    <FileSlot label="License — Front Side" file={licenseFront} onSet={setLicenseFront} required />
                    <FileSlot label="License — Back Side"  file={licenseBack}  onSet={setLicenseBack}  required />
                  </div>
                  <FileSlot label="Selfie with Document" file={selfieDoc} onSet={setSelfieDoc} required hint="Click to upload — front camera photo holding your license" />

                  <label className="flex items-start gap-2.5 text-sm text-gray-600">
                    <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#0b66d1] focus:ring-[#0b66d1]" />
                    I consent to a background check as part of my driver application. <span className="text-[#0b66d1]">*</span>
                  </label>

                  {submitError && (
                    <div className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-600">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {submitError}
                    </div>
                  )}
                </>
              )}
            </div>

            {stepError && (
              <div className="mt-6 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-600">
                <AlertCircle className="h-4 w-4 shrink-0" /> {stepError}
              </div>
            )}

            <div className="mt-10">
              {step === "documents" ? (
                <button onClick={handleSubmit} disabled={loading}
                  className="flex items-center gap-2 rounded-xl bg-[#0b66d1] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0952a8] disabled:opacity-60">
                  {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</> : "Submit Application"}
                </button>
              ) : step === "verify" ? (
                <button onClick={handleVerifyOtp} disabled={otpVerifying}
                  className="flex items-center gap-2 rounded-xl bg-[#0b66d1] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0952a8] disabled:opacity-60">
                  {otpVerifying ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify & Continue"}
                </button>
              ) : (
                <button onClick={goNext} disabled={loading}
                  className="flex items-center gap-2 rounded-xl bg-[#0b66d1] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0952a8] disabled:opacity-60">
                  Continue
                </button>
              )}
            </div>
        </motion.div>
      </div>
    </div>
  )
}
