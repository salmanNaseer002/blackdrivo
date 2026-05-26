"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  User, Car, FileText, MessageSquare, CheckCircle, XCircle,
  Clock, AlertCircle, ChevronRight, ExternalLink, LogOut,
  Phone, Mail, Calendar, Loader2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_COUNTRIES } from "@/lib/data/locations";

const STATUS_CONFIG = {
  pending:   { label: "Under Review",  color: "text-amber-600",  bg: "bg-amber-50",  border: "border-amber-200",  icon: Clock },
  approved:  { label: "Approved",      color: "text-emerald-600",bg: "bg-emerald-50",border: "border-emerald-200",icon: CheckCircle },
  rejected:  { label: "Not Approved",  color: "text-red-600",    bg: "bg-red-50",    border: "border-red-200",    icon: XCircle },
  suspended: { label: "Suspended",     color: "text-gray-500",   bg: "bg-gray-100",  border: "border-gray-200",   icon: AlertCircle },
}

type NavTab = "overview" | "vehicle" | "documents" | "comments"

export default function DriverProfilePage() {
  const router = useRouter()

  const [loading,  setLoading]  = useState(true)
  const [mounted,  setMounted]  = useState(false)
  const [driver,   setDriver]   = useState<any>(null)
  const [authUser, setAuthUser] = useState<any>(null)
  const [comments, setComments] = useState<any[]>([])
  const [tab,      setTab]      = useState<NavTab>("overview")

  useEffect(() => {
    setMounted(true)
    const supabase = createClient()

    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
      if (!user) { router.replace("/login?redirect=/driver/profile"); return }

      setAuthUser(user)

      const { data: drv } = await supabase
        .from("drivers")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle()

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const drvAny = drv as any;
      setDriver(drvAny)

      if (drvAny?.id) {
        const { data: cmts } = await (supabase as any)
          .from("driver_comments")
          .select("*")
          .eq("driver_id", drvAny.id)
          .order("created_at", { ascending: false })
        setComments(cmts || [])
      }
      setLoading(false)
    }

    load()
  }, [router])

  const signOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  if (!mounted || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-[#0b66d1]" />
      </div>
    )
  }

  const statusCfg  = STATUS_CONFIG[driver?.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.pending
  const StatusIcon = statusCfg.icon

  const driverName  = driver?.full_name  || authUser?.user_metadata?.full_name || authUser?.email?.split("@")[0] || "Driver"
  const driverEmail = driver?.email      || authUser?.email || ""
  const driverPhone = driver?.phone      || ""

  const countryData    = DEFAULT_COUNTRIES.find(c => c.code === driver?.country_code)
  const phoneDisplay   = driverPhone ? `${countryData?.phoneCode || ""} ${driverPhone}`.trim() : "—"
  const countryDisplay = countryData?.name || driver?.country_code || "—"
  const cityDisplay    = countryData?.cities.find(c => c.code === driver?.city_code)?.name || driver?.city_code || "—"

  const fmtDate = (d: string | null) => {
    if (!d) return "—"
    try { return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) }
    catch { return d }
  }

  const NAV_TABS: { id: NavTab; label: string; icon: any }[] = [
    { id: "overview",  label: "Overview",    icon: User          },
    { id: "vehicle",   label: "Vehicle",     icon: Car           },
    { id: "documents", label: "Documents",   icon: FileText      },
    { id: "comments",  label: "Admin Notes", icon: MessageSquare },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-100 bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0b66d1]">
              <Image src="/B Logo Black Theme.png" alt="BlackDrivo" width={18} height={18} className="object-contain invert mix-blend-screen" />
            </div>
            <span className="text-lg font-bold text-gray-900">BlackDrivo</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/driver/dashboard" className="text-sm font-medium text-[#0b66d1] hover:text-[#0952a8]">Dashboard</Link>
            <button onClick={signOut} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8 md:px-6 lg:py-12">
        <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="relative">
              {driver?.driver_photo_url ? (
                <Image src={driver.driver_photo_url} alt={driverName} width={80} height={80} className="h-20 w-20 rounded-2xl object-cover" />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 text-2xl font-bold text-[#0b66d1]">
                  {driverName.charAt(0).toUpperCase()}
                </div>
              )}
              <span className={`absolute -bottom-1 -right-1 rounded-full border-2 border-white p-1 ${statusCfg.bg}`}>
                <StatusIcon className={`h-3 w-3 ${statusCfg.color}`} />
              </span>
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-xl font-bold text-gray-900">{driverName}</h1>
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${statusCfg.color} ${statusCfg.bg} ${statusCfg.border}`}>
                  <StatusIcon className="h-3.5 w-3.5" /> {statusCfg.label}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                {driverEmail && <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />{driverEmail}</span>}
                {driverPhone && <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />{phoneDisplay}</span>}
                {driver?.created_at && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    Applied {fmtDate(driver.created_at)}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              {[
                { label: "Rides",  value: driver?.total_rides ?? 0 },
                { label: "Rating", value: driver?.rating ? driver.rating.toFixed(1) : "—" },
              ].map(stat => (
                <div key={stat.label} className="min-w-[72px] rounded-xl border border-gray-100 bg-gray-50 p-3 text-center">
                  <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {driver?.status === "pending" && (
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
              <div>
                <p className="text-sm font-semibold text-gray-900">Application under review</p>
                <p className="mt-0.5 text-xs text-gray-600">Our team is reviewing your application. You'll receive an email within 2–3 business days.</p>
              </div>
            </div>
          )}
          {driver?.status === "rejected" && (
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
              <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
              <div>
                <p className="text-sm font-semibold text-gray-900">Application not approved</p>
                <p className="mt-0.5 text-xs text-gray-600">Contact <a href="mailto:support@blackdrivo.com" className="text-[#0b66d1]">support@blackdrivo.com</a></p>
              </div>
            </div>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
          <div className="rounded-2xl border border-gray-100 bg-white p-2 shadow-sm self-start">
            {NAV_TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition ${tab === t.id ? "bg-blue-50 text-[#0b66d1]" : "text-gray-600 hover:bg-gray-50"}`}>
                <span className="flex items-center gap-2.5"><t.icon className="h-4 w-4" />{t.label}</span>
                <ChevronRight className={`h-3.5 w-3.5 ${tab === t.id ? "text-[#0b66d1]" : "text-gray-300"}`} />
              </button>
            ))}
          </div>

          <div>
            {tab === "overview" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h3 className="mb-5 font-semibold text-gray-900">Personal Information</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      { label: "Full Name",      value: driverName },
                      { label: "Email",          value: driverEmail },
                      { label: "Phone",          value: phoneDisplay },
                      { label: "Date of Birth",  value: fmtDate(driver?.dob) },
                      { label: "Home Address",   value: driver?.home_address },
                      { label: "Country",        value: countryDisplay },
                      { label: "City",           value: cityDisplay },
                      { label: "License No.",    value: driver?.license_number === "PENDING" ? "—" : driver?.license_number },
                      { label: "License State",  value: driver?.license_state },
                      { label: "License Expiry", value: fmtDate(driver?.license_expiry) },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
                        <p className="mt-1 text-sm font-medium text-gray-900">{value || "—"}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {tab === "vehicle" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h3 className="mb-5 font-semibold text-gray-900">Vehicle Information</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      { label: "Make",    value: driver?.vehicle_make === "PENDING" ? "—" : driver?.vehicle_make },
                      { label: "Model",   value: driver?.vehicle_model === "PENDING" ? "—" : driver?.vehicle_model },
                      { label: "Variant", value: driver?.vehicle_variant },
                      { label: "Year",    value: driver?.vehicle_year?.toString() },
                      { label: "Color",   value: driver?.vehicle_color === "PENDING" ? "—" : driver?.vehicle_color },
                      { label: "Plate",   value: driver?.vehicle_registration === "PENDING" ? "—" : driver?.vehicle_registration },
                      { label: "Class",   value: driver?.vehicle_class?.replace(/_/g, " ") },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
                        <p className="mt-1 text-sm font-medium capitalize text-gray-900">{value || "—"}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {tab === "documents" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h3 className="mb-5 font-semibold text-gray-900">Uploaded Documents</h3>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Driver</p>
                  <div className="mb-5 space-y-2">
                    {[
                      { label: "Driver Photo",        url: driver?.driver_photo_url },
                      { label: "Driver with License", url: driver?.driver_with_license_url },
                      { label: "License Front",       url: driver?.license_front_url || driver?.license_doc_url },
                      { label: "License Back",        url: driver?.license_back_url },
                    ].map(({ label, url }) => (
                      <div key={label} className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                        <div className="flex items-center gap-3">
                          {url ? <CheckCircle className="h-4 w-4 text-emerald-500" /> : <AlertCircle className="h-4 w-4 text-gray-300" />}
                          <span className="text-sm font-medium text-gray-900">{label}</span>
                        </div>
                        {url ? <a href={url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs font-medium text-[#0b66d1]">View <ExternalLink className="h-3 w-3" /></a>
                          : <span className="text-xs text-gray-400">Not uploaded</span>}
                      </div>
                    ))}
                  </div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Vehicle</p>
                  <div className="space-y-2">
                    {[
                      { label: "Vehicle Registration", url: driver?.vehicle_reg_doc_url },
                      { label: "Vehicle Insurance",    url: driver?.vehicle_insurance_url || driver?.insurance_doc_url },
                    ].map(({ label, url }) => (
                      <div key={label} className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                        <div className="flex items-center gap-3">
                          {url ? <CheckCircle className="h-4 w-4 text-emerald-500" /> : <AlertCircle className="h-4 w-4 text-gray-300" />}
                          <span className="text-sm font-medium text-gray-900">{label}</span>
                        </div>
                        {url ? <a href={url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs font-medium text-[#0b66d1]">View <ExternalLink className="h-3 w-3" /></a>
                          : <span className="text-xs text-gray-400">Not uploaded</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {tab === "comments" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
                  <div className="border-b border-gray-100 px-6 py-4">
                    <h3 className="font-semibold text-gray-900">Admin Notes & Updates</h3>
                    <p className="mt-0.5 text-xs text-gray-500">Messages from our team regarding your application</p>
                  </div>
                  <div className="p-6">
                    {comments.length === 0 ? (
                      <div className="py-8 text-center">
                        <MessageSquare className="mx-auto mb-3 h-8 w-8 text-gray-200" />
                        <p className="text-sm text-gray-400">No notes yet</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {comments.map((c: any) => (
                          <div key={c.id} className="flex gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-[#0b66d1]">A</div>
                            <div className="flex-1 rounded-xl border border-gray-100 bg-gray-50 p-3">
                              <div className="mb-1 flex items-center justify-between">
                                <span className="text-xs font-semibold text-gray-900">{c.admin_name || "BlackDrivo Team"}</span>
                                <span className="text-xs text-gray-400">{fmtDate(c.created_at)}</span>
                              </div>
                              <p className="text-sm leading-relaxed text-gray-700">{c.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
