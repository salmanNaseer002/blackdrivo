"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle, ArrowLeft, ArrowRight, Upload, Shield, DollarSign,
  Clock, Loader2, AlertCircle, X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

type Step = "account" | "personal" | "vehicle" | "documents" | "review";

const STEPS: { id: Step; label: string; desc: string }[] = [
  { id: "account",   label: "Account",   desc: "Create login" },
  { id: "personal",  label: "Personal",  desc: "Your details" },
  { id: "vehicle",   label: "Vehicle",   desc: "Your car info" },
  { id: "documents", label: "Documents", desc: "Upload files" },
  { id: "review",    label: "Review",    desc: "Confirm & submit" },
];

const perks = [
  { icon: DollarSign, title: "Premium earnings",    desc: "Earn significantly more than standard rideshare platforms" },
  { icon: Clock,      title: "Flexible schedule",   desc: "Work when you want, take the rides you choose" },
  { icon: Shield,     title: "Full insurance support", desc: "We provide guidance on commercial insurance requirements" },
];

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20";

export default function DriverRegisterPage() {
  const [step, setStep]         = useState<Step>("account");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [stepError, setStepError]   = useState("");
  const [submitError, setSubmitError] = useState("");

  // ── Account ──────────────────────────────────────────
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");

  // ── Personal ─────────────────────────────────────────
  const [fullName, setFullName]         = useState("");
  const [phone, setPhone]               = useState("");
  const [dob, setDob]                   = useState("");
  const [address, setAddress]           = useState("");
  const [licenseNum, setLicenseNum]     = useState("");
  const [licenseExpiry, setLicenseExpiry] = useState("");
  const [licenseState, setLicenseState] = useState("NY");

  // ── Vehicle ──────────────────────────────────────────
  const [vehicleMake,  setVehicleMake]  = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleYear,  setVehicleYear]  = useState("");
  const [vehicleColor, setVehicleColor] = useState("");
  const [vehicleReg,   setVehicleReg]   = useState("");
  const [vehicleClass, setVehicleClass] = useState("business");

  // ── Documents (real File objects) ────────────────────
  const [licenseFile,    setLicenseFile]    = useState<File | null>(null);
  const [insuranceFile,  setInsuranceFile]  = useState<File | null>(null);
  const [vehicleRegFile, setVehicleRegFile] = useState<File | null>(null);
  const [vehiclePhotoFile, setVehiclePhotoFile] = useState<File | null>(null);

  const licenseRef    = useRef<HTMLInputElement>(null);
  const insuranceRef  = useRef<HTMLInputElement>(null);
  const vehicleRegRef = useRef<HTMLInputElement>(null);
  const vehiclePhotoRef = useRef<HTMLInputElement>(null);

  const stepIndex = STEPS.findIndex((s) => s.id === step);

  // ── Per-step validation ───────────────────────────────
  const validateStep = (): string | null => {
    switch (step) {
      case "account":
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
          return "Enter a valid email address";
        if (!password || password.length < 8)
          return "Password must be at least 8 characters";
        return null;
      case "personal":
        if (!fullName.trim()) return "Full name is required";
        if (!phone.trim()) return "Phone number is required";
        if (!dob) return "Date of birth is required";
        if (!address.trim()) return "Home address is required";
        if (!licenseNum.trim()) return "Driver license number is required";
        if (!licenseExpiry) return "License expiry date is required";
        return null;
      case "vehicle":
        if (!vehicleMake.trim()) return "Vehicle make is required";
        if (!vehicleModel.trim()) return "Vehicle model is required";
        if (!vehicleYear || parseInt(vehicleYear) < 2015)
          return "Vehicle must be 2015 or newer";
        if (!vehicleColor.trim()) return "Vehicle color is required";
        if (!vehicleReg.trim()) return "License plate / registration is required";
        return null;
      case "documents":
        if (!licenseFile)    return "Driver's license document is required";
        if (!insuranceFile)  return "Insurance certificate is required";
        if (!vehicleRegFile) return "Vehicle registration document is required";
        return null;
      default:
        return null;
    }
  };

  const goNext = () => {
    const err = validateStep();
    if (err) { setStepError(err); return; }
    setStepError("");
    if (stepIndex < STEPS.length - 1) setStep(STEPS[stepIndex + 1].id);
  };

  const goBack = () => {
    setStepError("");
    if (stepIndex > 0) setStep(STEPS[stepIndex - 1].id);
  };

  // ── Submit ────────────────────────────────────────────
  const handleSubmit = async () => {
    setLoading(true);
    setSubmitError("");

    try {
      // 1. Create auth user + driver record via API
      const res = await fetch("/api/driver/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email, password, fullName, phone, dob, address,
          licenseNum, licenseExpiry, licenseState,
          vehicleMake, vehicleModel, vehicleYear, vehicleColor, vehicleReg, vehicleClass,
        }),
      });

      const result = await res.json() as { success?: boolean; userId?: string; error?: string };
      if (!res.ok || !result.success) throw new Error(result.error ?? "Registration failed");

      const userId = result.userId!;

      // 2. Sign in to get an authenticated session for Storage uploads
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;

      // 3. Upload documents to Supabase Storage
      const docUploads: Record<string, string> = {};
      const docSlots: Array<{ key: string; file: File | null; name: string }> = [
        { key: "license_doc_url",     file: licenseFile,      name: "license" },
        { key: "insurance_doc_url",   file: insuranceFile,    name: "insurance" },
        { key: "vehicle_reg_doc_url", file: vehicleRegFile,   name: "vehicle-reg" },
        { key: "vehicle_photo_url",   file: vehiclePhotoFile, name: "vehicle-photo" },
      ];

      for (const slot of docSlots) {
        if (!slot.file) continue;
        const ext  = slot.file.name.split(".").pop() ?? "pdf";
        const path = `${userId}/${slot.name}.${ext}`;
        const { error: uploadErr, data: uploadData } = await supabase.storage
          .from("driver-documents")
          .upload(path, slot.file, { upsert: true });

        if (!uploadErr && uploadData) {
          const { data: urlData } = supabase.storage
            .from("driver-documents")
            .getPublicUrl(path);
          docUploads[slot.key] = urlData.publicUrl;
        }
      }

      // 4. Store document URLs on driver record
      if (Object.keys(docUploads).length > 0) {
        await fetch("/api/driver/register", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, ...docUploads }),
        });
      }

      // 5. Sign out — driver must wait for admin approval before using dashboard
      await supabase.auth.signOut();

      toast.success("Application submitted! Our team will review within 2–3 business days.");
      setSubmitted(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Submission failed. Please try again.";
      setSubmitError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Success screen ────────────────────────────────────
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
            {[
              "Background check initiated",
              "Documents under review",
              "You'll receive an email with next steps",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-4 py-2.5 text-left text-sm text-gray-600"
              >
                <CheckCircle className="h-4 w-4 shrink-0 text-[#0b66d1]" />
                {item}
              </div>
            ))}
          </div>
          <Link
            href="/"
            className="mt-6 block rounded-xl bg-[#0b66d1] py-3 text-sm font-semibold text-white transition hover:bg-[#0952a8]"
          >
            Back to home
          </Link>
        </motion.div>
      </div>
    );
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
          <Link href="/driver" className="flex items-center gap-1.5 text-sm text-gray-500 transition hover:text-gray-900">
            <ArrowLeft className="h-4 w-4" /> Back to driver page
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          {/* Main form */}
          <div>
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#0b66d1]">Driver application</p>
              <h1 className="mt-2 text-3xl font-bold text-gray-900">Drive with BlackDrivo</h1>
              <p className="mt-2 text-sm text-gray-500">
                Complete all steps to apply. Our team reviews every application within 2–3 business days.
              </p>
            </div>

            {/* Steps indicator */}
            <div className="mb-7 flex items-start gap-2 overflow-x-auto pb-2">
              {STEPS.map((s, i) => (
                <div key={s.id} className="flex items-center gap-2">
                  <button
                    onClick={() => { if (i < stepIndex) { setStepError(""); setStep(s.id); } }}
                    className="flex flex-col items-center"
                  >
                    <div className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold transition ${
                      i < stepIndex
                        ? "cursor-pointer bg-[#0b66d1] text-white hover:bg-[#0952a8]"
                        : i === stepIndex
                        ? "bg-[#0b66d1] text-white ring-4 ring-[#0b66d1]/20"
                        : "bg-gray-200 text-gray-400"
                    }`}>
                      {i < stepIndex ? <CheckCircle className="h-4 w-4" /> : i + 1}
                    </div>
                    <span className={`mt-1.5 hidden text-xs font-medium sm:block ${
                      i === stepIndex ? "text-gray-900" : i < stepIndex ? "text-[#0b66d1]" : "text-gray-400"
                    }`}>
                      {s.label}
                    </span>
                  </button>
                  {i < STEPS.length - 1 && (
                    <div className={`mb-4 h-px w-8 md:w-12 ${i < stepIndex ? "bg-[#0b66d1]" : "bg-gray-200"}`} />
                  )}
                </div>
              ))}
            </div>

            {/* Form panels */}
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
                        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" className={inputClass} />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-gray-700">Password <span className="text-red-500">*</span></label>
                        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" minLength={8} placeholder="Min. 8 characters" className={inputClass} />
                      </div>
                      <p className="text-xs text-gray-400">
                        Already have an account?{" "}
                        <Link href="/login" className="text-[#0b66d1] hover:text-[#0952a8]">Sign in here</Link>
                      </p>
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
                          <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Smith" className={inputClass} />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-gray-700">Phone Number <span className="text-red-500">*</span></label>
                          <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="+1 (555) 000-0000" className={inputClass} />
                        </div>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-gray-700">Date of Birth <span className="text-red-500">*</span></label>
                        <input value={dob} onChange={(e) => setDob(e.target.value)} type="date" className={inputClass} />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-gray-700">Home Address <span className="text-red-500">*</span></label>
                        <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Main St, New York, NY 10001" className={inputClass} />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div className="sm:col-span-2">
                          <label className="mb-1.5 block text-xs font-medium text-gray-700">Driver License Number <span className="text-red-500">*</span></label>
                          <input value={licenseNum} onChange={(e) => setLicenseNum(e.target.value)} placeholder="License number" className={inputClass} />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-gray-700">State</label>
                          <select value={licenseState} onChange={(e) => setLicenseState(e.target.value)} className={inputClass}>
                            {["NY", "NJ", "CT", "PA", "MA", "Other"].map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-gray-700">License Expiry <span className="text-red-500">*</span></label>
                        <input value={licenseExpiry} onChange={(e) => setLicenseExpiry(e.target.value)} type="date" className={inputClass} />
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
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-gray-700">Make <span className="text-red-500">*</span></label>
                          <input value={vehicleMake} onChange={(e) => setVehicleMake(e.target.value)} placeholder="e.g. Mercedes-Benz" className={inputClass} />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-gray-700">Model <span className="text-red-500">*</span></label>
                          <input value={vehicleModel} onChange={(e) => setVehicleModel(e.target.value)} placeholder="e.g. E-Class" className={inputClass} />
                        </div>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-gray-700">Year <span className="text-red-500">*</span></label>
                          <input value={vehicleYear} onChange={(e) => setVehicleYear(e.target.value)} type="number" placeholder="2022" min="2015" max={new Date().getFullYear() + 1} className={inputClass} />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-gray-700">Color <span className="text-red-500">*</span></label>
                          <input value={vehicleColor} onChange={(e) => setVehicleColor(e.target.value)} placeholder="e.g. Black" className={inputClass} />
                        </div>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-gray-700">License Plate / Registration <span className="text-red-500">*</span></label>
                        <input value={vehicleReg} onChange={(e) => setVehicleReg(e.target.value)} placeholder="ABC 1234" className={inputClass} />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-gray-700">Vehicle Class <span className="text-red-500">*</span></label>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {[
                            { id: "business",    label: "Business Class",  desc: "Sedan (up to 3 pax)" },
                            { id: "first_class", label: "First Class",     desc: "Luxury sedan (up to 3 pax)" },
                            { id: "suv",         label: "Business SUV",    desc: "SUV (up to 6 pax)" },
                            { id: "van",         label: "Business Van",    desc: "Van (up to 7 pax)" },
                          ].map((vc) => (
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
                    <div className="mt-6 space-y-4">
                      {[
                        { label: "Driver's License (front & back)", ref: licenseRef,    file: licenseFile,      set: setLicenseFile,      required: true },
                        { label: "Vehicle Insurance Certificate",    ref: insuranceRef,  file: insuranceFile,    set: setInsuranceFile,    required: true },
                        { label: "Vehicle Registration Document",    ref: vehicleRegRef, file: vehicleRegFile,   set: setVehicleRegFile,   required: true },
                        { label: "Vehicle Photo (exterior)",         ref: vehiclePhotoRef, file: vehiclePhotoFile, set: setVehiclePhotoFile, required: false },
                      ].map((doc) => (
                        <div key={doc.label}>
                          <label className="mb-1.5 block text-xs font-medium text-gray-700">
                            {doc.label}{" "}
                            {doc.required && <span className="text-[#0b66d1]">*</span>}
                          </label>
                          <input
                            type="file"
                            ref={doc.ref}
                            accept=".pdf,.jpg,.jpeg,.png,.webp"
                            className="hidden"
                            onChange={(e) => doc.set(e.target.files?.[0] ?? null)}
                          />
                          <div
                            onClick={() => doc.ref.current?.click()}
                            className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition ${
                              doc.file
                                ? "border-[#0b66d1]/40 bg-blue-50"
                                : "border-dashed border-gray-200 hover:border-[#0b66d1]/30 hover:bg-blue-50/30"
                            }`}
                          >
                            <div className="flex items-center gap-3 overflow-hidden">
                              {doc.file ? (
                                <CheckCircle className="h-5 w-5 shrink-0 text-[#0b66d1]" />
                              ) : (
                                <Upload className="h-5 w-5 shrink-0 text-gray-400" />
                              )}
                              <span className="truncate text-sm text-gray-600">
                                {doc.file ? doc.file.name : "Click to upload (PDF, JPG, PNG — max 10 MB)"}
                              </span>
                            </div>
                            {doc.file ? (
                              <button
                                onClick={(e) => { e.stopPropagation(); doc.set(null); }}
                                className="ml-2 rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            ) : (
                              <span className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600">Browse</span>
                            )}
                          </div>
                        </div>
                      ))}
                      <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-xs text-gray-600">
                        All documents are encrypted and handled in compliance with GDPR and US privacy laws. Your information is never shared without your consent.
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
                        { label: "Email",     value: email || "—" },
                        { label: "Full Name", value: fullName || "—" },
                        { label: "Phone",     value: phone || "—" },
                        { label: "License #", value: `${licenseNum} (${licenseState})` || "—" },
                        { label: "Vehicle",   value: vehicleMake && vehicleModel ? `${vehicleYear} ${vehicleMake} ${vehicleModel} — ${vehicleColor}` : "—" },
                        { label: "Plate",     value: vehicleReg || "—" },
                        { label: "Class",     value: vehicleClass.replace("_", " ") },
                        { label: "Documents", value: [licenseFile && "License", insuranceFile && "Insurance", vehicleRegFile && "Registration", vehiclePhotoFile && "Vehicle photo"].filter(Boolean).join(", ") || "—" },
                      ].map((row) => (
                        <div key={row.label} className="flex justify-between border-b border-gray-100 pb-3 text-sm last:border-0">
                          <span className="text-gray-500">{row.label}</span>
                          <span className="font-medium text-gray-900 text-right max-w-[60%]">{row.value}</span>
                        </div>
                      ))}
                    </div>

                    {submitError && (
                      <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                        {submitError}
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
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {stepError}
                </div>
              )}

              {/* Navigation buttons */}
              <div className="mt-8 flex items-center justify-between">
                {stepIndex > 0 ? (
                  <button
                    onClick={goBack}
                    disabled={loading}
                    className="flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:border-gray-300 hover:text-gray-900 disabled:opacity-50"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                ) : <div />}

                {step === "review" ? (
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center gap-2 rounded-xl bg-[#0b66d1] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#0952a8] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</>
                    ) : (
                      <><CheckCircle className="h-4 w-4" /> Submit Application</>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={goNext}
                    className="flex items-center gap-2 rounded-xl bg-[#0b66d1] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0952a8]"
                  >
                    Continue <ArrowRight className="h-4 w-4" />
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
                {perks.map((perk) => (
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
                {[
                  "Valid US driver's license",
                  "Clean driving record (3+ years)",
                  "Background check consent",
                  "Vehicle 2015 or newer",
                  "Commercial auto insurance",
                  "TLC/FHV license (NYC drivers)",
                ].map((req) => (
                  <li key={req} className="flex items-start gap-2 text-xs text-gray-600">
                    <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0b66d1]" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
