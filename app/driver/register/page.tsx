"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle, ArrowLeft, Upload, Loader2, AlertCircle, X,
  Search, ChevronDown, MapPin, Mail, Eye, EyeOff, Camera,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { DEFAULT_COUNTRIES, type Country, type City } from "@/lib/data/locations";
import { VEHICLE_MAKES, VEHICLE_COLORS, getModelsForMake, getVariantsForModel, getYearOptions } from "@/lib/data/vehicles";

// Same flat, single-column, typeform-style shell as the Vendor registration
// form at vendor.blackdrivo.com/registration — thin segmented progress bar,
// circular back button, bold question-style heading, underline-only fields,
// one primary button bottom-left. No boxed card, no sidebar.

type Step = "account" | "location" | "personal" | "vehicle" | "documents" | "review";

const STEPS: { id: Step; title: string }[] = [
  { id: "account",   title: "Create your account" },
  { id: "location",  title: "Where are you based?" },
  { id: "personal",  title: "Personal & License Details" },
  { id: "vehicle",   title: "Vehicle Information" },
  { id: "documents", title: "Documents" },
  { id: "review",    title: "Review & Submit" },
];

// ─── Flat field primitives ─────────────────────────────────────────────────

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

// ── Searchable dropdown (flat trigger, boxed popover — the popover itself
// needs a surface to sit on, same as the vendor form's native <select>
// popover does natively) ─────────────────────────────────────────────────
interface DropdownProps {
  label: string
  value: string
  options: string[]
  onChange: (v: string) => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
}

function SearchDropdown({ label, value, options, onChange, placeholder = "Select...", required, disabled }: DropdownProps) {
  const [open, setOpen]   = useState(false)
  const [query, setQuery] = useState("")
  const ref                = useRef<HTMLDivElement>(null)

  const filtered = options.filter(o => o.toLowerCase().includes(query.toLowerCase()))

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <FlatField label={label} required={required}>
        <button
          type="button"
          disabled={disabled}
          onClick={() => { setOpen(!open); setQuery("") }}
          className={`${flatInputClass} flex items-center justify-between text-left ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"} ${value ? "" : "text-gray-400"}`}
        >
          <span className="truncate">{value || placeholder}</span>
          <ChevronDown className={`h-4 w-4 shrink-0 text-gray-400 transition ${open ? "rotate-180" : ""}`} />
        </button>
      </FlatField>
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-xl">
          <div className="border-b border-gray-100 p-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              <input
                autoFocus
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Type to search..."
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-8 pr-3 text-sm outline-none focus:border-[#0b66d1]"
              />
            </div>
          </div>
          <div className="max-h-52 overflow-y-auto p-1">
            {filtered.length === 0 ? (
              <div className="px-3 py-4 text-center text-sm text-gray-400">No results found</div>
            ) : (
              filtered.map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => { onChange(opt); setOpen(false); setQuery("") }}
                  className={`w-full rounded-lg px-3 py-2.5 text-left text-sm transition hover:bg-blue-50 hover:text-[#0b66d1] ${value === opt ? "bg-blue-50 font-medium text-[#0b66d1]" : "text-gray-700"}`}
                >
                  {opt}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Flat file upload row — "Click to upload" text on an underline, matching
// the vendor form's ID Front/ID Back fields exactly. ───────────────────────
interface FileSlotProps {
  label: string
  file: File | null
  onSet: (f: File | null) => void
  required?: boolean
  accept?: string
  multiple?: boolean
  files?: File[]
  onSetMultiple?: (f: File[]) => void
  hint?: string
}

function FileSlot({ label, file, onSet, required, accept = ".pdf,.jpg,.jpeg,.png,.webp", multiple, files, onSetMultiple, hint }: FileSlotProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const hasFile  = multiple ? (files && files.length > 0) : !!file

  return (
    <div>
      {label && (
        <label className={fieldLabelClass}>{label} {required && <span className="text-[#0b66d1]">*</span>}</label>
      )}
      <input
        type="file"
        ref={inputRef}
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={e => {
          if (multiple && onSetMultiple) onSetMultiple(Array.from(e.target.files ?? []))
          else onSet(e.target.files?.[0] ?? null)
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`flex w-full items-center justify-between border-0 border-b border-gray-200 py-2.5 text-left text-sm transition hover:border-[#0b66d1] ${hasFile ? "text-gray-900" : "text-gray-400"}`}
      >
        <span className="flex items-center gap-2 truncate">
          {hasFile ? <CheckCircle className="h-4 w-4 shrink-0 text-[#0b66d1]" /> : <Upload className="h-4 w-4 shrink-0 text-gray-400" />}
          {multiple && files && files.length > 0
            ? `${files.length} file(s) selected`
            : file
            ? file.name
            : hint || "Click to upload (JPG, PNG or PDF · Max 10MB)"}
        </span>
        {hasFile && (
          <span
            role="button"
            onClick={e => { e.stopPropagation(); multiple ? onSetMultiple?.([]) : onSet(null) }}
            className="ml-2 shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-3.5 w-3.5" />
          </span>
        )}
      </button>
    </div>
  )
}

const requirements = [
  "Valid driver's license",
  "Clean driving record (3+ years)",
  "Background check consent",
  "Vehicle 2015 or newer",
  "Commercial auto insurance",
]

export default function DriverRegisterPage() {
  const router  = useRouter()
  const [step, setStep]     = useState<Step>("account")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]     = useState(false)
  const [stepError, setStepError] = useState("")
  const [submitError, setSubmitError] = useState("")

  // ── Account ───────────────────────────────────────────────────
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [showPass, setShowPass] = useState(false)

  // ── Location ─────────────────────────────────────────────────
  const [countries]                       = useState<Country[]>(DEFAULT_COUNTRIES)
  const [selCountry, setSelCountry]       = useState<Country | null>(null)
  const [selCity, setSelCity]             = useState<City | null>(null)

  // ── Personal ─────────────────────────────────────────────────
  const [fullName, setFullName]           = useState("")
  const [phone, setPhone]                 = useState("")
  const [dob, setDob]                     = useState("")
  const [address, setAddress]             = useState("")
  const [licenseNum, setLicenseNum]       = useState("")
  const [licenseExpiry, setLicenseExpiry] = useState("")
  const [licenseState, setLicenseState]   = useState("NY")

  // ── Vehicle ──────────────────────────────────────────────────
  const [vehicleMake,    setVehicleMake]    = useState("")
  const [vehicleModel,   setVehicleModel]   = useState("")
  const [vehicleVariant, setVehicleVariant] = useState("")
  const [vehicleYear,    setVehicleYear]    = useState("")
  const [vehicleColor,   setVehicleColor]   = useState("")
  const [vehicleReg,     setVehicleReg]     = useState("")
  const [vehicleClass,   setVehicleClass]   = useState("business")

  // ── Documents — Driver ───────────────────────────────────────
  const [driverPhoto,         setDriverPhoto]         = useState<File | null>(null)
  const [driverWithLicense,   setDriverWithLicense]   = useState<File | null>(null)
  const [licenseFront,        setLicenseFront]        = useState<File | null>(null)
  const [licenseBack,         setLicenseBack]         = useState<File | null>(null)

  // ── Documents — Vehicle ──────────────────────────────────────
  const [vehicleRegDoc,       setVehicleRegDoc]       = useState<File | null>(null)
  const [vehicleInsurance,    setVehicleInsurance]    = useState<File | null>(null)
  const [vehicleExtPhotos,    setVehicleExtPhotos]    = useState<File[]>([])
  const [vehicleIntPhotos,    setVehicleIntPhotos]    = useState<File[]>([])

  const stepIndex = STEPS.findIndex(s => s.id === step)
  const models    = getModelsForMake(vehicleMake)
  const variants  = getVariantsForModel(vehicleMake, vehicleModel)
  const years     = getYearOptions()

  // ── Validation ───────────────────────────────────────────────
  const validateStep = (): string | null => {
    switch (step) {
      case "account":
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email address"
        if (!password || password.length < 8) return "Password must be at least 8 characters"
        return null
      case "location":
        if (!selCountry) return "Please select your country"
        if (!selCity)    return "Please select your city"
        return null
      case "personal":
        if (!fullName.trim())    return "Full name is required"
        if (!phone.trim())       return "Phone number is required"
        if (!dob)                return "Date of birth is required"
        if (!address.trim())     return "Home address is required"
        if (!licenseNum.trim())  return "Driver license number is required"
        if (!licenseExpiry)      return "License expiry date is required"
        return null
      case "vehicle":
        if (!vehicleMake.trim())  return "Vehicle make is required"
        if (!vehicleModel.trim()) return "Vehicle model is required"
        if (!vehicleYear)         return "Vehicle year is required"
        if (!vehicleColor.trim()) return "Vehicle color is required"
        if (!vehicleReg.trim())   return "License plate is required"
        return null
      default:
        return null
    }
  }

  const goNext = async () => {
    const err = validateStep()
    if (err) { setStepError(err); return }
    setStepError("")
    if (stepIndex < STEPS.length - 1) setStep(STEPS[stepIndex + 1].id)
  }

  const goBack = () => {
    setStepError("")
    if (stepIndex > 0) setStep(STEPS[stepIndex - 1].id)
  }

  // ── Submit ───────────────────────────────────────────────────
  const handleSubmit = async () => {
    setLoading(true)
    setSubmitError("")
    try {
      const res = await fetch("/api/driver/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email, password, fullName, phone, dob, address,
          licenseNum, licenseExpiry, licenseState,
          vehicleMake, vehicleModel, vehicleYear, vehicleColor, vehicleReg, vehicleClass,
          country: selCountry?.code, city: selCity?.code,
        }),
      })

      const result = await res.json() as { success?: boolean; userId?: string; error?: string }
      if (!res.ok || !result.success) throw new Error(result.error ?? "Registration failed")

      const uid = result.userId!

      const supabase = createClient()
      const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password })
      if (signInErr) throw signInErr

      const uploadFile = async (file: File, name: string) => {
        const ext  = file.name.split(".").pop() ?? "jpg"
        const path = `${uid}/${name}.${ext}`
        const { error } = await supabase.storage.from("driver-documents").upload(path, file, { upsert: true })
        if (error) return null
        const { data } = supabase.storage.from("driver-documents").getPublicUrl(path)
        return data.publicUrl
      }

      const uploadMany = async (files: File[], prefix: string) => {
        const urls: string[] = []
        for (let i = 0; i < files.length; i++) {
          const url = await uploadFile(files[i], `${prefix}-${i + 1}`)
          if (url) urls.push(url)
        }
        return urls
      }

      const [
        driverPhotoUrl, driverWithLicenseUrl, licenseFrontUrl, licenseBackUrl,
        vehicleRegDocUrl, vehicleInsuranceUrl, extUrls, intUrls,
      ] = await Promise.all([
        driverPhoto       ? uploadFile(driverPhoto,       "driver-photo")         : null,
        driverWithLicense ? uploadFile(driverWithLicense, "driver-with-license")  : null,
        licenseFront      ? uploadFile(licenseFront,      "license-front")        : null,
        licenseBack       ? uploadFile(licenseBack,       "license-back")         : null,
        vehicleRegDoc     ? uploadFile(vehicleRegDoc,     "vehicle-reg")          : null,
        vehicleInsurance  ? uploadFile(vehicleInsurance,  "vehicle-insurance")    : null,
        uploadMany(vehicleExtPhotos, "ext"),
        uploadMany(vehicleIntPhotos, "int"),
      ])

      await fetch("/api/driver/register", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: uid,
          driver_photo_url:          driverPhotoUrl,
          driver_with_license_url:   driverWithLicenseUrl,
          license_front_url:         licenseFrontUrl,
          license_back_url:          licenseBackUrl,
          vehicle_reg_doc_url:       vehicleRegDocUrl,
          vehicle_insurance_url:     vehicleInsuranceUrl,
          vehicle_exterior_photos:   extUrls,
          vehicle_interior_photos:   intUrls,
        }),
      })

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

        {/* Top bar — wordmark + support link, matching the vendor form */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image src="/logo bb.png" alt="BlackDrivo" width={120} height={32} className="object-contain" style={{ height: "auto" }} />
          </Link>
          <Link href="/contact" className="text-xs font-medium text-gray-500 hover:text-gray-900">Support</Link>
        </div>

        {/* Segmented progress bar */}
        <div className="mt-8 flex gap-2">
          {STEPS.map((s, i) => (
            <div key={s.id} className={`h-1 flex-1 rounded-full transition-colors ${i <= stepIndex ? "bg-[#0b66d1]" : "bg-gray-200"}`} />
          ))}
        </div>

        {/* Circular back button */}
        <button
          type="button"
          onClick={() => (stepIndex > 0 ? goBack() : router.push("/partner"))}
          className="mt-6 flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm transition hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>

            <h1 className="mt-8 text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">{currentTitle}</h1>
            <p className="mt-2 text-sm text-gray-400">Driver application — step {stepIndex + 1} of {STEPS.length}</p>

            <div className="mt-10 space-y-8">

              {/* ── Account ── */}
              {step === "account" && (
                <>
                  <FlatField label="Email Address" required>
                    <div className="relative">
                      <Mail className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@example.com" className={`${flatInputClass} pl-6`} />
                    </div>
                  </FlatField>
                  <FlatField label="Password" required>
                    <div className="relative">
                      <input value={password} onChange={e => setPassword(e.target.value)} type={showPass ? "text" : "password"} minLength={8} placeholder="Min. 8 characters" className={`${flatInputClass} pr-8`} />
                      <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </FlatField>
                  <p className="text-sm text-gray-400">
                    Already have an account?{" "}
                    <Link href="/driver/login" className="font-medium text-[#0b66d1] hover:text-[#0952a8]">Sign in here</Link>
                  </p>
                </>
              )}

              {/* ── Location ── */}
              {step === "location" && (
                <>
                  <FlatField label="Country" required>
                    <select
                      value={selCountry?.code || ""}
                      onChange={e => { const c = countries.find(x => x.code === e.target.value) || null; setSelCountry(c); setSelCity(null) }}
                      className={`${flatInputClass} ${selCountry ? "" : "text-gray-400"}`}
                    >
                      <option value="">Choose a country</option>
                      {countries.map(c => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
                    </select>
                  </FlatField>

                  {selCountry && (
                    <FlatField label="City" required>
                      <select
                        value={selCity?.code || ""}
                        onChange={e => setSelCity(selCountry.cities.find(x => x.code === e.target.value) || null)}
                        className={`${flatInputClass} ${selCity ? "" : "text-gray-400"}`}
                      >
                        <option value="">Choose a city</option>
                        {selCountry.cities.map(city => <option key={city.code} value={city.code}>{city.name}</option>)}
                      </select>
                    </FlatField>
                  )}
                </>
              )}

              {/* ── Personal ── */}
              {step === "personal" && (
                <>
                  <div className="grid gap-8 sm:grid-cols-2">
                    <FlatField label="Full Legal Name" required>
                      <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="John Smith" className={flatInputClass} />
                    </FlatField>
                    <FlatField label="Phone Number" required>
                      <div className="relative">
                        {selCountry && <span className="absolute left-0 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500">{selCountry.phoneCode}</span>}
                        <input
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          type="tel"
                          placeholder={selCountry?.phonePlaceholder || "(555) 000-0000"}
                          className={`${flatInputClass} ${selCountry ? "pl-9" : ""}`}
                        />
                      </div>
                    </FlatField>
                  </div>
                  <FlatField label="Date of Birth" required>
                    <input value={dob} onChange={e => setDob(e.target.value)} type="date" className={flatInputClass} />
                  </FlatField>
                  <FlatField label="Home Address" required>
                    <input value={address} onChange={e => setAddress(e.target.value)} placeholder="123 Main St, New York, NY 10001" className={flatInputClass} />
                  </FlatField>
                  <div className="grid gap-8 sm:grid-cols-3">
                    <div className="sm:col-span-2">
                      <FlatField label="Driver License Number" required>
                        <input value={licenseNum} onChange={e => setLicenseNum(e.target.value)} placeholder="License number" className={flatInputClass} />
                      </FlatField>
                    </div>
                    <FlatField label="State/Province">
                      <input value={licenseState} onChange={e => setLicenseState(e.target.value)} placeholder="NY" className={flatInputClass} />
                    </FlatField>
                  </div>
                  <FlatField label="License Expiry" required>
                    <input value={licenseExpiry} onChange={e => setLicenseExpiry(e.target.value)} type="date" className={flatInputClass} />
                  </FlatField>
                </>
              )}

              {/* ── Vehicle ── */}
              {step === "vehicle" && (
                <>
                  <SearchDropdown label="Make" required value={vehicleMake} options={VEHICLE_MAKES.map(m => m.name)}
                    onChange={v => { setVehicleMake(v); setVehicleModel(""); setVehicleVariant("") }}
                    placeholder="Select make (e.g. Mercedes-Benz)" />

                  <SearchDropdown label="Model" required value={vehicleModel} options={models.map(m => m.name)}
                    onChange={v => { setVehicleModel(v); setVehicleVariant("") }}
                    placeholder={vehicleMake ? "Select model" : "Select make first"} disabled={!vehicleMake} />

                  {variants.length > 0 && (
                    <SearchDropdown label="Variant / Trim" value={vehicleVariant} options={variants}
                      onChange={setVehicleVariant} placeholder="Select variant (optional)" />
                  )}

                  <div className="grid gap-8 sm:grid-cols-2">
                    <SearchDropdown label="Year" required value={vehicleYear} options={years.map(String)} onChange={setVehicleYear} placeholder="Select year" />
                    <SearchDropdown label="Color" required value={vehicleColor} options={VEHICLE_COLORS} onChange={setVehicleColor} placeholder="Select color" />
                  </div>

                  <FlatField label="License Plate / Registration" required>
                    <input value={vehicleReg} onChange={e => setVehicleReg(e.target.value)} placeholder="ABC 1234" className={flatInputClass} />
                  </FlatField>

                  <FlatField label="Vehicle Class" required>
                    <select value={vehicleClass} onChange={e => setVehicleClass(e.target.value)} className={flatInputClass}>
                      <option value="business">Business Class — Sedan (up to 3 pax)</option>
                      <option value="first_class">First Class — Luxury sedan (up to 3 pax)</option>
                      <option value="suv">Business SUV — SUV (up to 6 pax)</option>
                      <option value="van">Business Van — Van (up to 7 pax)</option>
                    </select>
                  </FlatField>
                </>
              )}

              {/* ── Documents ── */}
              {step === "documents" && (
                <>
                  <div>
                    <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                      <Camera className="h-3.5 w-3.5" /> Driver Documents
                    </div>
                    <div className="mt-4 space-y-6">
                      <FileSlot label="Driver Photo" file={driverPhoto} onSet={setDriverPhoto} required accept=".jpg,.jpeg,.png,.webp" />
                      <FileSlot label="Driver Photo with License" file={driverWithLicense} onSet={setDriverWithLicense} required accept=".jpg,.jpeg,.png,.webp" />
                      <div className="grid gap-6 sm:grid-cols-2">
                        <FileSlot label="License — Front Side" file={licenseFront} onSet={setLicenseFront} required accept=".jpg,.jpeg,.png,.pdf" />
                        <FileSlot label="License — Back Side"  file={licenseBack}  onSet={setLicenseBack}  required accept=".jpg,.jpeg,.png,.pdf" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Vehicle Documents
                    </div>
                    <div className="mt-4 space-y-6">
                      <div className="grid gap-6 sm:grid-cols-2">
                        <FileSlot label="Vehicle Registration Document" file={vehicleRegDoc}    onSet={setVehicleRegDoc}    required />
                        <FileSlot label="Vehicle Insurance Certificate"  file={vehicleInsurance} onSet={setVehicleInsurance} required />
                      </div>

                      <div>
                        <FileSlot
                          label="Vehicle Exterior Photos (Front, Back, Left, Right)"
                          file={null} onSet={() => {}} required multiple
                          files={vehicleExtPhotos} onSetMultiple={setVehicleExtPhotos}
                          accept=".jpg,.jpeg,.png,.webp"
                        />
                        {vehicleExtPhotos.length > 0 && (
                          <div className="mt-3 grid grid-cols-4 gap-2">
                            {vehicleExtPhotos.map((f, i) => (
                              <div key={i} className="relative overflow-hidden rounded-lg border border-gray-200">
                                <Image src={URL.createObjectURL(f)} alt={f.name} width={80} height={60} className="h-16 w-full object-cover" />
                                <button type="button" onClick={() => setVehicleExtPhotos(prev => prev.filter((_, idx) => idx !== i))}
                                  className="absolute right-1 top-1 rounded-full bg-white/80 p-0.5 text-gray-600 hover:bg-white">
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <FileSlot
                          label="Vehicle Interior Photos (Dashboard, Front Seat, Back Seat, Trunk)"
                          file={null} onSet={() => {}} multiple
                          files={vehicleIntPhotos} onSetMultiple={setVehicleIntPhotos}
                          accept=".jpg,.jpeg,.png,.webp"
                        />
                        {vehicleIntPhotos.length > 0 && (
                          <div className="mt-3 grid grid-cols-4 gap-2">
                            {vehicleIntPhotos.map((f, i) => (
                              <div key={i} className="relative overflow-hidden rounded-lg border border-gray-200">
                                <Image src={URL.createObjectURL(f)} alt={f.name} width={80} height={60} className="h-16 w-full object-cover" />
                                <button type="button" onClick={() => setVehicleIntPhotos(prev => prev.filter((_, idx) => idx !== i))}
                                  className="absolute right-1 top-1 rounded-full bg-white/80 p-0.5 text-gray-600 hover:bg-white">
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-gray-400">
                        All documents are encrypted and handled in compliance with GDPR and US privacy laws.
                      </p>
                    </div>
                  </div>
                </>
              )}

              {/* ── Review ── */}
              {step === "review" && (
                <>
                  <div className="space-y-3">
                    {[
                      { label: "Email",    value: email },
                      { label: "Country",  value: selCountry ? `${selCountry.flag} ${selCountry.name}` : "—" },
                      { label: "City",     value: selCity?.name || "—" },
                      { label: "Name",     value: fullName || "—" },
                      { label: "Phone",    value: phone ? `${selCountry?.phoneCode} ${phone}` : "—" },
                      { label: "License",  value: `${licenseNum} (${licenseState})` },
                      { label: "Vehicle",  value: `${vehicleYear} ${vehicleMake} ${vehicleModel}${vehicleVariant ? ` ${vehicleVariant}` : ""} — ${vehicleColor}` },
                      { label: "Plate",    value: vehicleReg },
                      { label: "Class",    value: vehicleClass.replace("_", " ") },
                      { label: "Docs",     value: [driverPhoto && "Driver Photo", driverWithLicense && "With License", licenseFront && "License Front", licenseBack && "License Back", vehicleRegDoc && "Registration", vehicleInsurance && "Insurance"].filter(Boolean).join(", ") || "—" },
                    ].map(row => (
                      <div key={row.label} className="flex justify-between border-b border-gray-100 pb-3 text-sm">
                        <span className="text-gray-400">{row.label}</span>
                        <span className="max-w-[60%] text-right font-medium text-gray-900">{row.value}</span>
                      </div>
                    ))}
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">What you&apos;ll need</p>
                    <div className="space-y-1.5">
                      {requirements.map(r => (
                        <div key={r} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0b66d1]" /> {r}
                        </div>
                      ))}
                    </div>
                  </div>

                  {submitError && (
                    <div className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-600">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {submitError}
                    </div>
                  )}

                  <p className="text-xs text-gray-400">
                    By submitting, you confirm all information is accurate and agree to our{" "}
                    <Link href="/terms-of-service" className="text-[#0b66d1]">Driver Terms of Service</Link>.
                  </p>
                </>
              )}
            </div>

            {stepError && (
              <div className="mt-6 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-600">
                <AlertCircle className="h-4 w-4 shrink-0" /> {stepError}
              </div>
            )}

            {/* Single primary button, bottom-left — matching the vendor form */}
            <div className="mt-10">
              {step === "review" ? (
                <button onClick={handleSubmit} disabled={loading}
                  className="flex items-center gap-2 rounded-xl bg-[#0b66d1] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0952a8] disabled:opacity-60">
                  {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</> : "Submit Application"}
                </button>
              ) : (
                <button onClick={goNext} disabled={loading}
                  className="flex items-center gap-2 rounded-xl bg-[#0b66d1] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0952a8] disabled:opacity-60">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Continue"}
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
