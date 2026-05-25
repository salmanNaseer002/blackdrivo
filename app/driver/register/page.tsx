"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle, ArrowLeft, ArrowRight, Upload, Shield, DollarSign,
  Clock, Loader2, AlertCircle, X, Search, ChevronDown, MapPin,
  Mail, Eye, EyeOff, Camera,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { DEFAULT_COUNTRIES, type Country, type City } from "@/lib/data/locations";
import { VEHICLE_MAKES, VEHICLE_COLORS, getModelsForMake, getVariantsForModel, getYearOptions } from "@/lib/data/vehicles";

type Step = "account" | "location" | "personal" | "vehicle" | "documents" | "review";

const STEPS: { id: Step; label: string; desc: string }[] = [
  { id: "account",   label: "Account",   desc: "Create login"    },
  { id: "location",  label: "Location",  desc: "Country & city"  },
  { id: "personal",  label: "Personal",  desc: "Your details"    },
  { id: "vehicle",   label: "Vehicle",   desc: "Your car info"   },
  { id: "documents", label: "Documents", desc: "Upload files"    },
  { id: "review",    label: "Review",    desc: "Confirm & submit"},
];

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20";

// ── Searchable Dropdown ──────────────────────────────────────────
interface DropdownProps {
  label: string
  value: string
  options: string[]
  onChange: (v: string) => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
}

function SearchDropdown({ label, value, options, onChange, placeholder = "Search...", required, disabled }: DropdownProps) {
  const [open, setOpen]     = useState(false)
  const [query, setQuery]   = useState("")
  const ref                 = useRef<HTMLDivElement>(null)

  const filtered = options.filter(o => o.toLowerCase().includes(query.toLowerCase()))

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <label className="mb-1.5 block text-xs font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <button
        type="button"
        disabled={disabled}
        onClick={() => { setOpen(!open); setQuery("") }}
        className={`${inputClass} flex items-center justify-between text-left ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"} ${value ? "text-gray-900" : "text-gray-400"}`}
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-gray-400 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-xl">
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
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

// ── File Upload Slot ─────────────────────────────────────────────
interface FileSlotProps {
  label: string
  file: File | null
  onSet: (f: File | null) => void
  required?: boolean
  accept?: string
  multiple?: boolean
  files?: File[]
  onSetMultiple?: (f: File[]) => void
}

function FileSlot({ label, file, onSet, required, accept = ".pdf,.jpg,.jpeg,.png,.webp", multiple, files, onSetMultiple }: FileSlotProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const hasFile  = multiple ? (files && files.length > 0) : !!file

  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-gray-700">
        {label} {required && <span className="text-[#0b66d1]">*</span>}
      </label>
      <input
        type="file"
        ref={inputRef}
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={e => {
          if (multiple && onSetMultiple) {
            onSetMultiple(Array.from(e.target.files ?? []))
          } else {
            onSet(e.target.files?.[0] ?? null)
          }
        }}
      />
      <div
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition ${
          hasFile
            ? "border-[#0b66d1]/40 bg-blue-50"
            : "border-dashed border-gray-200 hover:border-[#0b66d1]/30 hover:bg-blue-50/30"
        }`}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          {hasFile
            ? <CheckCircle className="h-5 w-5 shrink-0 text-[#0b66d1]" />
            : <Upload className="h-5 w-5 shrink-0 text-gray-400" />
          }
          <span className="truncate text-sm text-gray-600">
            {multiple && files && files.length > 0
              ? `${files.length} file(s) selected`
              : file
              ? file.name
              : "Click to upload (JPG, PNG, PDF — max 10 MB)"
            }
          </span>
        </div>
        {hasFile ? (
          <button
            type="button"
            onClick={e => { e.stopPropagation(); multiple ? onSetMultiple?.([]) : onSet(null) }}
            className="ml-2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : (
          <span className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600">Browse</span>
        )}
      </div>
    </div>
  )
}

// ── Perks ────────────────────────────────────────────────────────
const perks = [
  { icon: DollarSign, title: "Premium earnings",       desc: "Earn significantly more than standard rideshare platforms" },
  { icon: Clock,      title: "Flexible schedule",      desc: "Work when you want, take the rides you choose" },
  { icon: Shield,     title: "Full insurance support", desc: "We provide guidance on commercial insurance requirements" },
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
  const [countries, setCountries]         = useState<Country[]>(DEFAULT_COUNTRIES)
  const [selCountry, setSelCountry]       = useState<Country | null>(null)
  const [selCity, setSelCity]             = useState<City | null>(null)

  // Load countries from DB if available
  useEffect(() => {
    const supabase = createClient()
    supabase.from("countries_config" as any).select("*")
      .then(({ data }) => {
        if (data && data.length > 0) {
          // Merge DB countries with defaults
          // For now use defaults
        }
      })
  }, [])

  // ── OTP Verify ───────────────────────────────────────────────
  const [userId, setUserId] = useState("")

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
  const [vehicleExtPhotos,    setVehicleExtPhotos]    = useState<File[]>([])  // 4 sides
  const [vehicleIntPhotos,    setVehicleIntPhotos]    = useState<File[]>([])  // interior

  const stepIndex = STEPS.findIndex(s => s.id === step)
  const models    = getModelsForMake(vehicleMake)
  const variants  = getVariantsForModel(vehicleMake, vehicleModel)
  const years     = getYearOptions()

  // ── Phone format based on country ────────────────────────────
  const phonePlaceholder = selCountry
    ? `${selCountry.phoneCode} ${selCountry.phonePlaceholder}`
    : "+1 (555) 000-0000"

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
      case "documents":
        //if (!driverPhoto)       return "Driver photo is required"
        //if (!driverWithLicense) return "Driver photo with license is required"
        //if (!licenseFront)      return "License front image is required"
        //if (!licenseBack)       return "License back image is required"
        //if (!vehicleRegDoc)     return "Vehicle registration document is required"
        //if (!vehicleInsurance)  return "Vehicle insurance certificate is required"
        return null
      default:
        return null
    }
  }

  // ── Next step ────────────────────────────────────────────────
  const goNext = async () => {
    const err = validateStep()
    if (err) { setStepError(err); return }
    setStepError("")

    // Account → send OTP first, then go to location
    if (step === "account") {
      setStep("location")
      return
    }

    // Location → go to personal directly
    if (step === "location") {
      setStep("personal")
      return
    }

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

      // Upload documents - sign in with created account
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
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-10 text-center shadow-xl"
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
            {["Background check initiated","Documents under review","You'll receive an email with next steps"].map(item => (
              <div key={item} className="flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-4 py-2.5 text-left text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 shrink-0 text-[#0b66d1]" /> {item}
              </div>
            ))}
          </div>
          <button
            onClick={() => router.push("/login")}
            className="mt-6 block w-full rounded-xl bg-[#0b66d1] py-3 text-sm font-semibold text-white transition hover:bg-[#0952a8]"
          >
            Go to Login
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0b66d1]">
              <Image src="/B Logo Black Theme.png" alt="BlackDrivo" width={18} height={18} className="object-contain invert mix-blend-screen" />
            </div>
            <span className="text-lg font-bold text-gray-900">BlackDrivo</span>
          </Link>
          <Link href="/driver" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#0b66d1]">Driver application</p>
              <h1 className="mt-2 text-3xl font-bold text-gray-900">Drive with BlackDrivo</h1>
              <p className="mt-2 text-sm text-gray-500">Complete all steps to apply. Our team reviews every application within 2–3 business days.</p>
            </div>

            {/* Steps */}
            <div className="mb-7 flex items-start gap-1 overflow-x-auto pb-2">
              {STEPS.map((s, i) => (
                <div key={s.id} className="flex items-center gap-1">
                  <button
                    onClick={() => { if (i < stepIndex) { setStepError(""); setStep(s.id) } }}
                    className="flex flex-col items-center"
                  >
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition ${
                      i < stepIndex ? "cursor-pointer bg-[#0b66d1] text-white" : i === stepIndex ? "bg-[#0b66d1] text-white ring-4 ring-[#0b66d1]/20" : "bg-gray-200 text-gray-400"
                    }`}>
                      {i < stepIndex ? <CheckCircle className="h-3.5 w-3.5" /> : i + 1}
                    </div>
                    <span className={`mt-1 hidden text-[10px] font-medium sm:block whitespace-nowrap ${i === stepIndex ? "text-gray-900" : i < stepIndex ? "text-[#0b66d1]" : "text-gray-400"}`}>
                      {s.label}
                    </span>
                  </button>
                  {i < STEPS.length - 1 && <div className={`mb-4 h-px w-6 md:w-10 ${i < stepIndex ? "bg-[#0b66d1]" : "bg-gray-200"}`} />}
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
              <AnimatePresence mode="wait">

                {/* ── Account ── */}
                {step === "account" && (
                  <motion.div key="account" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                    <h2 className="text-xl font-bold text-gray-900">Create your account</h2>
                    <p className="mt-1 text-sm text-gray-500">You&apos;ll use these credentials to access your driver dashboard.</p>
                    <div className="mt-6 space-y-4">
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-gray-700">Email Address <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@example.com" className={`${inputClass} pl-10`} />
                        </div>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-gray-700">Password <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <input value={password} onChange={e => setPassword(e.target.value)} type={showPass ? "text" : "password"} minLength={8} placeholder="Min. 8 characters" className={`${inputClass} pr-10`} />
                          <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400">
                        Already have an account?{" "}
                        <Link href="/login" className="text-[#0b66d1] hover:text-[#0952a8]">Sign in here</Link>
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* ── Location ── */}
                {step === "location" && (
                  <motion.div key="location" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                    <h2 className="text-xl font-bold text-gray-900">Select Your Location</h2>
                    <p className="mt-1 text-sm text-gray-500">Choose your country and city where you&apos;ll be operating.</p>
                    <div className="mt-6 space-y-4">
                      {/* Country */}
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-gray-700">Country <span className="text-red-500">*</span></label>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {countries.map(c => (
                            <button
                              key={c.code}
                              type="button"
                              onClick={() => { setSelCountry(c); setSelCity(null) }}
                              className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition ${
                                selCountry?.code === c.code
                                  ? "border-[#0b66d1] bg-blue-50"
                                  : "border-gray-200 bg-white hover:border-gray-300"
                              }`}
                            >
                              <span className="text-2xl">{c.flag}</span>
                              <div>
                                <p className="text-sm font-semibold text-gray-900">{c.name}</p>
                                <p className="text-xs text-gray-500">{c.phoneCode} · {c.currency}</p>
                              </div>
                              {selCountry?.code === c.code && (
                                <CheckCircle className="ml-auto h-4 w-4 text-[#0b66d1]" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* City */}
                      {selCountry && (
                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-gray-700">City <span className="text-red-500">*</span></label>
                          <div className="grid gap-2 sm:grid-cols-3">
                            {selCountry.cities.map(city => (
                              <button
                                key={city.code}
                                type="button"
                                onClick={() => setSelCity(city)}
                                className={`flex items-center gap-2 rounded-xl border p-3 text-left text-sm transition ${
                                  selCity?.code === city.code
                                    ? "border-[#0b66d1] bg-blue-50 font-medium text-[#0b66d1]"
                                    : "border-gray-200 bg-white hover:border-gray-300"
                                }`}
                              >
                                <MapPin className="h-3.5 w-3.5 shrink-0" />
                                {city.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* ── Personal ── */}
                {step === "personal" && (
                  <motion.div key="personal" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                    <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                    <p className="mt-1 text-sm text-gray-500">Your personal and license details.</p>
                    <div className="mt-6 space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-gray-700">Full Legal Name <span className="text-red-500">*</span></label>
                          <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="John Smith" className={inputClass} />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-gray-700">Phone Number <span className="text-red-500">*</span></label>
                          <div className="relative">
                            {selCountry && (
                              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500">{selCountry.phoneCode}</span>
                            )}
                            <input
                              value={phone}
                              onChange={e => setPhone(e.target.value)}
                              type="tel"
                              placeholder={selCountry?.phonePlaceholder || "(555) 000-0000"}
                              className={`${inputClass} ${selCountry ? "pl-14" : ""}`}
                            />
                          </div>
                          {selCountry && <p className="mt-1 text-xs text-gray-400">Format: {selCountry.phoneCode} {selCountry.phoneFormat}</p>}
                        </div>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-gray-700">Date of Birth <span className="text-red-500">*</span></label>
                        <input value={dob} onChange={e => setDob(e.target.value)} type="date" className={inputClass} />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-gray-700">Home Address <span className="text-red-500">*</span></label>
                        <input value={address} onChange={e => setAddress(e.target.value)} placeholder="123 Main St, New York, NY 10001" className={inputClass} />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div className="sm:col-span-2">
                          <label className="mb-1.5 block text-xs font-medium text-gray-700">Driver License Number <span className="text-red-500">*</span></label>
                          <input value={licenseNum} onChange={e => setLicenseNum(e.target.value)} placeholder="License number" className={inputClass} />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-gray-700">State/Province</label>
                          <input value={licenseState} onChange={e => setLicenseState(e.target.value)} placeholder="NY" className={inputClass} />
                        </div>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-gray-700">License Expiry <span className="text-red-500">*</span></label>
                        <input value={licenseExpiry} onChange={e => setLicenseExpiry(e.target.value)} type="date" className={inputClass} />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ── Vehicle ── */}
                {step === "vehicle" && (
                  <motion.div key="vehicle" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                    <h2 className="text-xl font-bold text-gray-900">Vehicle Information</h2>
                    <p className="mt-1 text-sm text-gray-500">Details about the vehicle you&apos;ll be driving.</p>
                    <div className="mt-6 space-y-4">
                      {/* Make */}
                      <SearchDropdown
                        label="Make"
                        required
                        value={vehicleMake}
                        options={VEHICLE_MAKES.map(m => m.name)}
                        onChange={v => { setVehicleMake(v); setVehicleModel(""); setVehicleVariant("") }}
                        placeholder="Select make (e.g. Mercedes-Benz)"
                      />

                      {/* Model */}
                      <SearchDropdown
                        label="Model"
                        required
                        value={vehicleModel}
                        options={models.map(m => m.name)}
                        onChange={v => { setVehicleModel(v); setVehicleVariant("") }}
                        placeholder={vehicleMake ? "Select model" : "Select make first"}
                        disabled={!vehicleMake}
                      />

                      {/* Variant */}
                      {variants.length > 0 && (
                        <SearchDropdown
                          label="Variant / Trim"
                          value={vehicleVariant}
                          options={variants}
                          onChange={setVehicleVariant}
                          placeholder="Select variant (optional)"
                        />
                      )}

                      <div className="grid gap-4 sm:grid-cols-2">
                        {/* Year */}
                        <SearchDropdown
                          label="Year"
                          required
                          value={vehicleYear}
                          options={years.map(String)}
                          onChange={setVehicleYear}
                          placeholder="Select year"
                        />

                        {/* Color */}
                        <SearchDropdown
                          label="Color"
                          required
                          value={vehicleColor}
                          options={VEHICLE_COLORS}
                          onChange={setVehicleColor}
                          placeholder="Select color"
                        />
                      </div>

                      {/* Registration */}
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-gray-700">License Plate / Registration <span className="text-red-500">*</span></label>
                        <input value={vehicleReg} onChange={e => setVehicleReg(e.target.value)} placeholder="ABC 1234" className={inputClass} />
                      </div>

                      {/* Vehicle Class */}
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-gray-700">Vehicle Class <span className="text-red-500">*</span></label>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {[
                            { id: "business",    label: "Business Class",  desc: "Sedan (up to 3 pax)" },
                            { id: "first_class", label: "First Class",     desc: "Luxury sedan (up to 3 pax)" },
                            { id: "suv",         label: "Business SUV",    desc: "SUV (up to 6 pax)" },
                            { id: "van",         label: "Business Van",    desc: "Van (up to 7 pax)" },
                          ].map(vc => (
                            <button
                              key={vc.id}
                              type="button"
                              onClick={() => setVehicleClass(vc.id)}
                              className={`rounded-xl border p-3 text-left transition ${vehicleClass === vc.id ? "border-[#0b66d1] bg-blue-50" : "border-gray-200 bg-white hover:border-gray-300"}`}
                            >
                              <p className="text-sm font-medium text-gray-900">{vc.label}</p>
                              <p className="text-xs text-gray-500">{vc.desc}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ── Documents ── */}
                {step === "documents" && (
                  <motion.div key="documents" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                    <h2 className="text-xl font-bold text-gray-900">Upload Documents</h2>
                    <p className="mt-1 text-sm text-gray-500">All documents are stored securely and reviewed by our team.</p>

                    {/* Driver section */}
                    <div className="mt-6">
                      <div className="mb-4 flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50">
                          <Camera className="h-4 w-4 text-[#0b66d1]" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900">Driver Documents</h3>
                      </div>
                      <div className="space-y-3">
                        <FileSlot label="Driver Photo" file={driverPhoto} onSet={setDriverPhoto} required accept=".jpg,.jpeg,.png,.webp" />
                        <FileSlot label="Driver Photo with License" file={driverWithLicense} onSet={setDriverWithLicense} required accept=".jpg,.jpeg,.png,.webp" />
                        <div className="grid gap-3 sm:grid-cols-2">
                          <FileSlot label="License — Front Side" file={licenseFront} onSet={setLicenseFront} required accept=".jpg,.jpeg,.png,.pdf" />
                          <FileSlot label="License — Back Side"  file={licenseBack}  onSet={setLicenseBack}  required accept=".jpg,.jpeg,.png,.pdf" />
                        </div>
                      </div>
                    </div>

                    <div className="my-6 h-px bg-gray-100" />

                    {/* Vehicle section */}
                    <div>
                      <div className="mb-4 flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50">
                          <Shield className="h-4 w-4 text-[#0b66d1]" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900">Vehicle Documents</h3>
                      </div>
                      <div className="space-y-3">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <FileSlot label="Vehicle Registration Document" file={vehicleRegDoc}    onSet={setVehicleRegDoc}    required />
                          <FileSlot label="Vehicle Insurance Certificate"  file={vehicleInsurance} onSet={setVehicleInsurance} required />
                        </div>

                        {/* Exterior photos — 4 sides */}
                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-gray-700">
                            Vehicle Exterior Photos (4 sides — Front, Back, Left, Right) <span className="text-[#0b66d1]">*</span>
                          </label>
                          <FileSlot
                            label=""
                            file={null}
                            onSet={() => {}}
                            multiple
                            files={vehicleExtPhotos}
                            onSetMultiple={setVehicleExtPhotos}
                            accept=".jpg,.jpeg,.png,.webp"
                          />
                          {vehicleExtPhotos.length > 0 && (
                            <div className="mt-2 grid grid-cols-4 gap-2">
                              {vehicleExtPhotos.map((f, i) => (
                                <div key={i} className="relative rounded-lg overflow-hidden border border-gray-200">
                                  <Image src={URL.createObjectURL(f)} alt={f.name} width={80} height={60} className="h-16 w-full object-cover" />
                                  <button
                                    type="button"
                                    onClick={() => setVehicleExtPhotos(prev => prev.filter((_, idx) => idx !== i))}
                                    className="absolute right-1 top-1 rounded-full bg-white/80 p-0.5 text-gray-600 hover:bg-white"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Interior photos */}
                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-gray-700">
                            Vehicle Interior Photos (Dashboard, Front Seat, Back Seat, Trunk)
                          </label>
                          <FileSlot
                            label=""
                            file={null}
                            onSet={() => {}}
                            multiple
                            files={vehicleIntPhotos}
                            onSetMultiple={setVehicleIntPhotos}
                            accept=".jpg,.jpeg,.png,.webp"
                          />
                          {vehicleIntPhotos.length > 0 && (
                            <div className="mt-2 grid grid-cols-4 gap-2">
                              {vehicleIntPhotos.map((f, i) => (
                                <div key={i} className="relative rounded-lg overflow-hidden border border-gray-200">
                                  <Image src={URL.createObjectURL(f)} alt={f.name} width={80} height={60} className="h-16 w-full object-cover" />
                                  <button
                                    type="button"
                                    onClick={() => setVehicleIntPhotos(prev => prev.filter((_, idx) => idx !== i))}
                                    className="absolute right-1 top-1 rounded-full bg-white/80 p-0.5 text-gray-600 hover:bg-white"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4 text-xs text-gray-600">
                        All documents are encrypted and handled in compliance with GDPR and US privacy laws.
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ── Review ── */}
                {step === "review" && (
                  <motion.div key="review" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                    <h2 className="text-xl font-bold text-gray-900">Review & Submit</h2>
                    <p className="mt-1 text-sm text-gray-500">Please review your application before submitting.</p>
                    <div className="mt-6 space-y-3">
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
                        <div key={row.label} className="flex justify-between border-b border-gray-100 pb-3 text-sm last:border-0">
                          <span className="text-gray-500">{row.label}</span>
                          <span className="max-w-[60%] text-right font-medium text-gray-900">{row.value}</span>
                        </div>
                      ))}
                    </div>
                    {submitError && (
                      <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {submitError}
                      </div>
                    )}
                    <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50 p-4 text-xs text-gray-500">
                      By submitting, you confirm all information is accurate and agree to our{" "}
                      <Link href="/terms-of-service" className="text-[#0b66d1]">Driver Terms of Service</Link>.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Step error */}
              {stepError && (
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4 shrink-0" /> {stepError}
                </div>
              )}

              {/* Nav buttons */}
              <div className="mt-8 flex items-center justify-between">
                {stepIndex > 0 ? (
                  <button onClick={goBack} disabled={loading} className="flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 hover:border-gray-300 hover:text-gray-900 disabled:opacity-50">
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                ) : <div />}

                {step === "review" ? (
                  <button onClick={handleSubmit} disabled={loading} className="flex items-center gap-2 rounded-xl bg-[#0b66d1] px-8 py-3 text-sm font-semibold text-white hover:bg-[#0952a8] disabled:opacity-60">
                    {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</> : <><CheckCircle className="h-4 w-4" /> Submit Application</>}
                  </button>
                ) : (
                  <button onClick={goNext} disabled={loading} className="flex items-center gap-2 rounded-xl bg-[#0b66d1] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0952a8] disabled:opacity-60">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Continue <ArrowRight className="h-4 w-4" /></>}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="rounded-2xl p-6" style={{ backgroundImage: "linear-gradient(135deg, #0b66d1 0%, #0952a8 100%)" }}>
              <h3 className="mb-4 font-semibold text-white">Why drive with us?</h3>
              <div className="space-y-5">
                {perks.map(perk => (
                  <div key={perk.title} className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/20">
                      <perk.icon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{perk.title}</p>
                      <p className="text-xs text-white/70">{perk.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold text-gray-700">Requirements</h3>
              <ul className="space-y-2">
                {["Valid driver's license","Clean driving record (3+ years)","Background check consent","Vehicle 2015 or newer","Commercial auto insurance"].map(req => (
                  <li key={req} className="flex items-start gap-2 text-xs text-gray-600">
                    <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0b66d1]" /> {req}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
