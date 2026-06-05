"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Phone, CreditCard, Shield, AlertCircle, Pencil, X,
  Loader2, Lock, Upload, CheckCircle, Clock, Star, TrendingUp,
  Calendar, Car, FileText, AlertTriangle, Check, User,
  MapPin, ChevronRight, Activity, Award,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_COUNTRIES } from "@/lib/data/locations";
import { toast } from "sonner";
import { DRIVER_THEME, fmtDate, fmtShort, daysUntil, ini } from "@/lib/driver/theme";

const inputClass = "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20";

// ── Status Pill ───────────────────────────────────────────────
function StatusPill({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    approved: { bg: "bg-emerald-50 border border-emerald-200", text: "text-emerald-700", label: "Approved" },
    pending:  { bg: "bg-amber-50 border border-amber-200",     text: "text-amber-700",   label: "In Review" },
    rejected: { bg: "bg-red-50 border border-red-200",         text: "text-red-600",     label: "Rejected" },
  };
  const s = map[status];
  if (!s) return null;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${s.bg} ${s.text}`}>
      {status === "approved" && <Check className="h-2.5 w-2.5" />}
      {status === "pending"  && <Clock className="h-2.5 w-2.5" />}
      {status === "rejected" && <X className="h-2.5 w-2.5" />}
      {s.label}
    </span>
  );
}

function ExpiryBadge({ date }: { date: string | null }) {
  if (!date) return null;
  const days = daysUntil(date);
  if (days === null) return null;
  if (days < 0)  return <span className="text-xs font-semibold text-red-500">Expired</span>;
  if (days < 14) return <span className="text-xs font-semibold text-red-500">{days}d left</span>;
  if (days < 60) return <span className="text-xs font-semibold text-amber-600">{days}d left</span>;
  if (days < 90) return <span className="text-xs font-semibold text-yellow-600">{days}d left</span>;
  return null;
}

// ── Editable Card ─────────────────────────────────────────────
function EditCard({ title, icon: Icon, editing, onEdit, onCancel, onSave, saving, children, viewContent }: {
  title: string; icon: any; editing: boolean;
  onEdit: () => void; onCancel: () => void; onSave: () => void;
  saving: boolean; children: React.ReactNode; viewContent: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-50">
            <Icon className="h-3.5 w-3.5 text-gray-500" />
          </div>
          <p className="text-sm font-semibold text-gray-900">{title}</p>
        </div>
        {!editing ? (
          <button onClick={onEdit} className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition">
            <Pencil className="h-3 w-3" /> Edit
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button onClick={onCancel} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-50 transition">Cancel</button>
            <button onClick={onSave} disabled={saving} className="flex items-center gap-1.5 rounded-lg bg-[#0b66d1] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0952a8] disabled:opacity-60 transition">
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />} Save
            </button>
          </div>
        )}
      </div>
      <div className="px-5 py-1">{editing ? children : viewContent}</div>
    </div>
  );
}

function FieldRow({ label, value, locked, status }: { label: string; value?: string | null; locked?: boolean; status?: string }) {
  return (
    <div className="py-3 border-b border-gray-50 last:border-0">
      <div className="flex items-center gap-1.5 mb-1">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">{label}</p>
        {locked && <Lock className="h-2.5 w-2.5 text-gray-300" />}
        {status && <StatusPill status={status} />}
      </div>
      <p className="text-sm font-medium text-gray-900">{value || "—"}</p>
    </div>
  );
}

// ── Photo Slot ────────────────────────────────────────────────
function PhotoSlot({ label, currentUrl, file, onSet, note }: { label: string; currentUrl?: string | null; file: File | null; onSet: (f: File | null) => void; note?: string }) {
  const ref = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  useEffect(() => {
    if (file) { const url = URL.createObjectURL(file); setPreview(url); return () => URL.revokeObjectURL(url); }
    setPreview(null);
  }, [file]);
  const displayUrl = preview || currentUrl;
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium text-gray-700">{label}</p>
      {note && <p className="mb-1.5 text-[11px] text-gray-400">{note}</p>}
      <input ref={ref} type="file" accept=".jpg,.jpeg,.png,.webp" className="hidden" onChange={e => onSet(e.target.files?.[0] ?? null)} />
      {displayUrl ? (
        <div className="relative group">
          <Image src={displayUrl} alt={label} width={200} height={140} className="h-32 w-full rounded-xl object-cover border border-gray-100" />
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/0 group-hover:bg-black/40 transition">
            <button type="button" onClick={() => ref.current?.click()} className="flex items-center gap-1.5 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-700 opacity-0 group-hover:opacity-100 transition">
              <Upload className="h-3.5 w-3.5" /> Replace
            </button>
          </div>
          {file && <div className="absolute right-2 top-2 rounded-full bg-[#0b66d1] px-2 py-0.5 text-[10px] font-bold text-white">NEW</div>}
        </div>
      ) : (
        <div onClick={() => ref.current?.click()} className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:border-[#0b66d1] hover:bg-blue-50/30 transition">
          <Upload className="h-5 w-5 text-gray-300 mb-1.5" />
          <span className="text-xs text-gray-400">Click to upload</span>
        </div>
      )}
      {file && <button onClick={() => onSet(null)} className="mt-1 text-xs text-gray-400 hover:text-gray-700">Remove</button>}
    </div>
  );
}

// ── Rating Chart ──────────────────────────────────────────────
function RatingChart({ history }: { history: any[] }) {
  if (!history.length) return <div className="flex h-20 items-center justify-center text-sm text-gray-400">No rating history yet</div>;
  const last12 = history.slice(-12);
  return (
    <div className="flex items-end gap-1 h-14">
      {last12.map((h, i) => {
        const pct = (h.rating / 5) * 100;
        const isLast = i === last12.length - 1;
        return (
          <div key={i} className="group relative flex flex-1 flex-col items-center">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap z-10">
              {h.rating.toFixed(1)}★
            </div>
            <div className="w-full rounded-t transition-all" style={{ height: `${pct}%`, background: isLast ? "#0b66d1" : "#e5e7eb" }} />
          </div>
        );
      })}
    </div>
  );
}

// ── Expiry Calendar ───────────────────────────────────────────
function ExpiryCalendar({ driver, vehicle }: { driver: any; vehicle: any }) {
  const items = [
    { label: "Driver License",    date: driver?.license_expiry,        icon: CreditCard },
    { label: "Vehicle Insurance", date: driver?.insurance_expiry_date, icon: FileText   },
    { label: "Inspection Due",    date: vehicle?.next_inspection_due,  icon: Car        },
  ].filter(i => i.date);
  if (!items.length) return <p className="py-6 text-center text-sm text-gray-400">No expiry dates on file</p>;
  return (
    <div className="space-y-2">
      {items.map(item => {
        const days = daysUntil(item.date);
        const urgent = days !== null && days < 14;
        const warn   = days !== null && days < 60;
        return (
          <div key={item.label} className={`flex items-center justify-between rounded-xl border px-4 py-3 ${urgent ? "border-red-200 bg-red-50" : warn ? "border-amber-200 bg-amber-50" : "border-gray-100 bg-gray-50"}`}>
            <div className="flex items-center gap-3">
              <item.icon className={`h-4 w-4 ${urgent ? "text-red-400" : warn ? "text-amber-400" : "text-gray-400"}`} />
              <div>
                <p className="text-sm font-medium text-gray-900">{item.label}</p>
                <p className="text-xs text-gray-400">{fmtDate(item.date)}</p>
              </div>
            </div>
            {days !== null && (
              <span className={`text-xs font-bold ${days < 0 ? "text-red-600" : days < 14 ? "text-red-600" : days < 60 ? "text-amber-600" : "text-gray-400"}`}>
                {days < 0 ? "Expired" : days < 90 ? `${days}d` : fmtShort(item.date)}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
//  Main Page
// ═════════════════════════════════════════════════════════════
export default function ProfilePage() {
  const router = useRouter();

  const [driver,        setDriver]        = useState<any>(null);
  const [authUser,      setAuthUser]      = useState<any>(null);
  const [vehicle,       setVehicle]       = useState<any>(null);
  const [ratingHistory, setRatingHistory] = useState<any[]>([]);
  const [changeReqs,    setChangeReqs]    = useState<any[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [activeTab,     setActiveTab]     = useState<"info" | "docs" | "history">("info");

  const [editContact,   setEditContact]   = useState(false);
  const [editAddress,   setEditAddress]   = useState(false);
  const [editEmergency, setEditEmergency] = useState(false);
  const [editLicense,   setEditLicense]   = useState(false);
  const [savingCard,    setSavingCard]    = useState("");

  const [phone,   setPhone]   = useState("");
  const [country, setCountry] = useState("US");
  const [city,    setCity]    = useState("");
  const [address, setAddress] = useState("");
  const [emergencyName,  setEmergencyName]  = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [licenseExpiry,  setLicenseExpiry]  = useState("");
  const [licenseFile,    setLicenseFile]    = useState<File | null>(null);
  const licFileRef = useRef<HTMLInputElement>(null);

  const [driverPhoto,       setDriverPhoto]       = useState<File | null>(null);
  const [driverWithLicense, setDriverWithLicense] = useState<File | null>(null);
  const [licenseFront,      setLicenseFront]      = useState<File | null>(null);
  const [licenseBack,       setLicenseBack]       = useState<File | null>(null);
  const [uploadingPhotos,   setUploadingPhotos]   = useState(false);

  const [bgFile,   setBgFile]   = useState<File | null>(null);
  const [savingBg, setSavingBg] = useState(false);
  const bgFileRef = useRef<HTMLInputElement>(null);

  const [reuploadFiles,  setReuploadFiles]  = useState<Record<string, File | null>>({});
  const [reuploadSaving, setReuploadSaving] = useState<string | null>(null);

  const loadData = async () => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) { router.replace("/login"); return; }
    setAuthUser(user);
    const { data: drv } = await (supabase as any).from("drivers").select("*").eq("user_id", user.id).maybeSingle();
    if (!drv) return;
    setDriver(drv);
    setPhone(drv.phone || "");
    setCountry(drv.country_code || "US");
    setCity(drv.city_code || "");
    setAddress(drv.home_address || "");
    setEmergencyName(drv.emergency_contact_name || "");
    setEmergencyPhone(drv.emergency_contact_phone || "");
    setLicenseExpiry(drv.license_expiry || "");
    const [{ data: veh }, { data: rh }, { data: cr }] = await Promise.all([
      (supabase as any).from("driver_vehicles").select("*").eq("driver_id", drv.id).eq("is_active", true).maybeSingle(),
      (supabase as any).from("driver_rating_history").select("*").eq("driver_id", drv.id).order("created_at", { ascending: false }).limit(12),
      (supabase as any).from("driver_change_requests").select("*").eq("driver_id", drv.id).order("requested_at", { ascending: false }),
    ]);
    setVehicle(veh);
    setRatingHistory(rh || []);
    setChangeReqs(cr || []);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const uploadFile = async (supabase: any, file: File, path: string) => {
    const { error } = await supabase.storage.from("driver-documents").upload(path, file, { upsert: true });
    if (error) throw error;
    return supabase.storage.from("driver-documents").getPublicUrl(path).data.publicUrl;
  };

  const getPendingReq  = (f: string) => changeReqs.find(r => r.field_name === f && r.status === "pending");
  const getApprovedReq = (f: string) => changeReqs.find(r => r.field_name === f && r.status === "approved");

  const saveContact = async () => {
    setSavingCard("contact");
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user; if (!user) throw new Error("Not logged in");
      await (supabase as any).from("drivers").update({ phone: phone.trim() || null, country_code: country, city_code: city || null }).eq("user_id", user.id);
      toast.success("Contact updated"); await loadData(); setEditContact(false);
    } catch (err: any) { toast.error(err.message); } finally { setSavingCard(""); }
  };

  const saveAddress = async () => {
    setSavingCard("address");
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user; if (!user) throw new Error("Not logged in");
      await (supabase as any).from("drivers").update({ home_address: address.trim() || null }).eq("user_id", user.id);
      toast.success("Address updated"); await loadData(); setEditAddress(false);
    } catch (err: any) { toast.error(err.message); } finally { setSavingCard(""); }
  };

  const saveEmergency = async () => {
    setSavingCard("emergency");
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user; if (!user) throw new Error("Not logged in");
      await (supabase as any).from("drivers").update({ emergency_contact_name: emergencyName.trim() || null, emergency_contact_phone: emergencyPhone.trim() || null }).eq("user_id", user.id);
      toast.success("Emergency contact updated"); await loadData(); setEditEmergency(false);
    } catch (err: any) { toast.error(err.message); } finally { setSavingCard(""); }
  };

  const saveLicenseExpiry = async () => {
    if (!licenseExpiry) { toast.error("Select expiry date"); return; }
    if (!licenseFile)   { toast.error("License photo required"); return; }
    setSavingCard("license");
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user; if (!user) throw new Error("Not logged in");
      const fileUrl = await uploadFile(supabase, licenseFile, `${user.id}/license-expiry-update.${licenseFile.name.split(".").pop()}`);
      await (supabase as any).from("driver_change_requests").insert({ driver_id: driver.id, field_name: "license_expiry", old_value: driver.license_expiry, new_value: licenseExpiry, file_url: fileUrl, status: "pending" });
      toast.success("Submitted for review"); setLicenseFile(null); setEditLicense(false); await loadData();
    } catch (err: any) { toast.error(err.message); } finally { setSavingCard(""); }
  };

  const handleUploadPhotos = async () => {
    if (!driverPhoto && !driverWithLicense && !licenseFront && !licenseBack) { toast.error("Select at least one photo"); return; }
    setUploadingPhotos(true);
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user; if (!user) throw new Error("Not logged in");
      const updates: Record<string, string> = {};
      if (driverPhoto)       updates.driver_photo_url        = await uploadFile(supabase, driverPhoto,       `${user.id}/driver-photo.${driverPhoto.name.split(".").pop()}`);
      if (driverWithLicense) updates.driver_with_license_url = await uploadFile(supabase, driverWithLicense, `${user.id}/driver-with-license.${driverWithLicense.name.split(".").pop()}`);
      if (licenseFront)      updates.license_front_url       = await uploadFile(supabase, licenseFront,      `${user.id}/license-front.${licenseFront.name.split(".").pop()}`);
      if (licenseBack)       updates.license_back_url        = await uploadFile(supabase, licenseBack,       `${user.id}/license-back.${licenseBack.name.split(".").pop()}`);
      await (supabase as any).from("drivers").update(updates).eq("user_id", user.id);
      toast.success("Photos uploaded"); setDriverPhoto(null); setDriverWithLicense(null); setLicenseFront(null); setLicenseBack(null); await loadData();
    } catch (err: any) { toast.error(err.message); } finally { setUploadingPhotos(false); }
  };

  const handleUploadBgCheck = async () => {
    if (!bgFile) { toast.error("Select a file"); return; }
    setSavingBg(true);
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user; if (!user) throw new Error("Not logged in");
      const url = await uploadFile(supabase, bgFile, `${user.id}/background-check.${bgFile.name.split(".").pop()}`);
      await (supabase as any).from("drivers").update({ background_check_doc_url: url, background_check_doc_status: "pending" }).eq("user_id", user.id);
      await (supabase as any).from("driver_change_requests").insert({ driver_id: driver.id, field_name: "background_check_doc", old_value: null, new_value: url, file_url: url, status: "pending" });
      toast.success("Submitted for review"); setBgFile(null); await loadData();
    } catch (err: any) { toast.error(err.message); } finally { setSavingBg(false); }
  };

  const handleReupload = async (fieldName: string, file: File) => {
    setReuploadSaving(fieldName);
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user; if (!user) throw new Error("Not logged in");
      const url = await uploadFile(supabase, file, `${user.id}/${fieldName}-reupload.${file.name.split(".").pop()}`);
      await (supabase as any).from("driver_change_requests").insert({ driver_id: driver.id, field_name: fieldName, old_value: null, new_value: url, file_url: url, status: "pending" });
      const fieldMap: Record<string, string> = { background_check_doc: "background_check_doc_url", license_front: "license_front_url", license_back: "license_back_url", driver_photo: "driver_photo_url", driver_with_license: "driver_with_license_url" };
      if (fieldMap[fieldName]) await (supabase as any).from("drivers").update({ [fieldMap[fieldName]]: url }).eq("user_id", user.id);
      toast.success("Resubmitted for review"); setReuploadFiles(prev => ({ ...prev, [fieldName]: null })); await loadData();
    } catch (err: any) { toast.error(err.message); } finally { setReuploadSaving(null); }
  };

  if (loading || !driver) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-[#0b66d1]" />
    </div>
  );

  const driverName   = driver?.full_name && driver.full_name !== "PENDING" ? driver.full_name : authUser?.email?.split("@")[0] || "Driver";
  const countryData  = DEFAULT_COUNTRIES.find((c: any) => c.code === driver?.country_code);
  const selCountry   = DEFAULT_COUNTRIES.find(c => c.code === country);
  const cityName     = countryData?.cities?.find((c: any) => c.code === driver?.city_code)?.name || driver?.city_code;
  const phoneDisplay = driver?.phone ? `${countryData?.phoneCode || ""} ${driver.phone}`.trim() : null;
  const daysLeft     = daysUntil(driver?.license_expiry);
  const licExpiring  = daysLeft !== null && daysLeft < 90;
  const bgApproved   = driver?.background_check_doc_status === "approved";
  const bgPending    = driver?.background_check_doc_status === "pending" && driver?.background_check_doc_url;
  const hasNewPhotos = driverPhoto || driverWithLicense || licenseFront || licenseBack;

  const statusMap = {
    approved: { label: "Approved Driver",      dot: "bg-emerald-400", ring: "ring-emerald-100", text: "text-emerald-600", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    rejected: { label: "Application Rejected", dot: "bg-red-400",     ring: "ring-red-100",     text: "text-red-600",     badge: "bg-red-50 text-red-700 border-red-200"             },
    suspended:{ label: "Suspended",            dot: "bg-gray-400",    ring: "ring-gray-100",    text: "text-gray-500",    badge: "bg-gray-50 text-gray-600 border-gray-200"          },
    pending:  { label: "Under Review",         dot: "bg-amber-400",   ring: "ring-amber-100",   text: "text-amber-600",   badge: "bg-amber-50 text-amber-700 border-amber-200"       },
  };
  const stt = statusMap[driver?.status as keyof typeof statusMap] || statusMap.pending;

  // Rejected docs that don't have a newer pending/approved
  const activeRejections = Object.values(
    changeReqs.filter(r => r.status === "rejected").reduce((acc: Record<string, any>, r) => {
      if (!acc[r.field_name] || new Date(r.requested_at) > new Date(acc[r.field_name].requested_at)) acc[r.field_name] = r;
      return acc;
    }, {})
  ).filter((r: any) => !changeReqs.find(c => c.field_name === r.field_name && c.id !== r.id && (c.status === "pending" || c.status === "approved") && new Date(c.requested_at) > new Date(r.requested_at))) as any[];

  // Profile completeness
  const checks = [!!driver?.phone, !!driver?.driver_photo_url, !!driver?.license_front_url, !!driver?.background_check_doc_url, !!driver?.home_address, !!driver?.emergency_contact_name];
  const completeness = Math.round((checks.filter(Boolean).length / checks.length) * 100);

  const TABS = [
    { key: "info",    label: "Profile Info",  icon: User     },
    { key: "docs",    label: "Documents",     icon: FileText },
    { key: "history", label: "Activity",      icon: Activity },
  ] as const;

  return (
    <div className={DRIVER_THEME.pageWrapper}>

      {/* ── Alerts ── */}
      {activeRejections.length > 0 && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 flex items-start gap-3">
          <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-800">{activeRejections.length} document{activeRejections.length > 1 ? "s" : ""} rejected — action required</p>
            <p className="text-xs text-red-600 mt-0.5">Go to Documents tab to resubmit</p>
          </div>
          <button onClick={() => setActiveTab("docs")} className="shrink-0 flex items-center gap-1 text-xs font-semibold text-red-700 hover:underline">
            View <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {licExpiring && daysLeft !== null && (
        <div className={`rounded-2xl border px-5 py-4 flex items-start gap-3 ${daysLeft < 14 ? "border-red-200 bg-red-50" : "border-amber-200 bg-amber-50"}`}>
          <AlertCircle className={`h-4 w-4 shrink-0 mt-0.5 ${daysLeft < 14 ? "text-red-500" : "text-amber-500"}`} />
          <div className="flex-1">
            <p className={`text-sm font-semibold ${daysLeft < 14 ? "text-red-800" : "text-amber-800"}`}>
              {daysLeft < 0 ? "License expired" : `License expires in ${daysLeft} days`}
            </p>
            <p className={`text-xs mt-0.5 ${daysLeft < 14 ? "text-red-600" : "text-amber-600"}`}>Update from Profile Info → Driver License section</p>
          </div>
          <button onClick={() => { setActiveTab("info"); setEditLicense(true); }}
            className={`shrink-0 flex items-center gap-1 text-xs font-semibold hover:underline ${daysLeft < 14 ? "text-red-700" : "text-amber-700"}`}>
            Update <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* ── Profile Header Card ── */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        {/* Top gradient strip */}
        <div className="h-3 w-full" style={{ background: "linear-gradient(90deg, #0b66d1 0%, #3b82f6 50%, #0952a8 100%)" }} />

        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-start gap-5">

            {/* Avatar */}
            <div className="relative shrink-0">
              {driver?.driver_photo_url ? (
                <Image src={driver.driver_photo_url} alt={driverName} width={80} height={80}
                  className="h-20 w-20 rounded-2xl object-cover border-2 border-white shadow-md" />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl text-2xl font-bold text-white shadow-md"
                  style={{ background: "linear-gradient(135deg, #0b66d1, #0952a8)" }}>
                  {ini(driverName)}
                </div>
              )}
              {/* Online dot */}
              <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-400" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 leading-tight">{driverName}</h2>
                  <p className="text-sm text-gray-400 mt-0.5">{driver?.email || authUser?.email}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${stt.badge}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${stt.dot}`} />
                      {stt.label}
                    </span>
                    {phoneDisplay && (
                      <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                        <Phone className="h-3 w-3" /> {phoneDisplay}
                      </span>
                    )}
                    {cityName && (
                      <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                        <MapPin className="h-3 w-3" /> {cityName}
                      </span>
                    )}
                  </div>
                </div>
                {/* Rating pill */}
                {driver?.rating && (
                  <div className="flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2">
                    <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                    <span className="text-lg font-bold text-gray-900">{driver.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>

              {/* Stats row */}
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  { label: "Total Rides",  value: driver?.total_rides ?? 0,         icon: Car        },
                  { label: "Completion",   value: "—",                               icon: TrendingUp },
                  { label: "Member Since", value: driver?.created_at ? new Date(driver.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "—", icon: Calendar },
                ].map(s => (
                  <div key={s.label} className="rounded-xl bg-gray-50 px-3 py-2.5">
                    <p className="text-lg font-bold text-gray-900">{String(s.value)}</p>
                    <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Profile completeness bar */}
          <div className="mt-5 pt-4 border-t border-gray-50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-gray-500">Profile Completeness</p>
              <p className="text-xs font-bold text-gray-900">{completeness}%</p>
            </div>
            <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${completeness}%`, background: completeness === 100 ? "#10b981" : "#0b66d1" }} />
            </div>
            {completeness < 100 && (
              <p className="mt-1.5 text-[11px] text-gray-400">
                {!driver?.phone && "Add phone · "}
                {!driver?.driver_photo_url && "Upload photo · "}
                {!driver?.home_address && "Add address · "}
                {!driver?.emergency_contact_name && "Add emergency contact"}
              </p>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-t border-gray-100 bg-gray-50/50">
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex flex-1 items-center justify-center gap-2 py-3.5 text-sm font-medium transition border-b-2 ${activeTab === tab.key ? "border-[#0b66d1] text-[#0b66d1] bg-white" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ══ TAB: Profile Info ══════════════════════════════════ */}
      {activeTab === "info" && (
        <div className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Contact */}
            <EditCard title="Contact Info" icon={Phone}
              editing={editContact} onEdit={() => setEditContact(true)}
              onCancel={() => { setEditContact(false); setPhone(driver?.phone || ""); setCountry(driver?.country_code || "US"); setCity(driver?.city_code || ""); }}
              onSave={saveContact} saving={savingCard === "contact"}
              viewContent={<><FieldRow label="Phone" value={phoneDisplay} /><FieldRow label="Country" value={countryData?.name || driver?.country_code} /><FieldRow label="City" value={cityName} /></>}>
              <div className="space-y-3 py-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-700">Country</label>
                    <select value={country} onChange={e => { setCountry(e.target.value); setCity(""); }} className={inputClass}>
                      {DEFAULT_COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-700">City</label>
                    <select value={city} onChange={e => setCity(e.target.value)} className={inputClass}>
                      <option value="">Select city</option>
                      {selCountry?.cities.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">Phone</label>
                  <div className="flex gap-2">
                    {selCountry && <div className="flex h-[46px] items-center rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-600 shrink-0">{selCountry.flag} {selCountry.phoneCode}</div>}
                    <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="555 000 0000" className={`${inputClass} flex-1`} />
                  </div>
                </div>
              </div>
            </EditCard>

            {/* Address */}
            <EditCard title="Home Address" icon={MapPin}
              editing={editAddress} onEdit={() => setEditAddress(true)}
              onCancel={() => { setEditAddress(false); setAddress(driver?.home_address || ""); }}
              onSave={saveAddress} saving={savingCard === "address"}
              viewContent={<FieldRow label="Address" value={driver?.home_address} />}>
              <div className="py-3">
                <label className="mb-1.5 block text-xs font-medium text-gray-700">Home Address</label>
                <input value={address} onChange={e => setAddress(e.target.value)} placeholder="123 Main St, City, State" className={inputClass} />
              </div>
            </EditCard>

            {/* Emergency */}
            <EditCard title="Emergency Contact" icon={Phone}
              editing={editEmergency} onEdit={() => setEditEmergency(true)}
              onCancel={() => { setEditEmergency(false); setEmergencyName(driver?.emergency_contact_name || ""); setEmergencyPhone(driver?.emergency_contact_phone || ""); }}
              onSave={saveEmergency} saving={savingCard === "emergency"}
              viewContent={<><FieldRow label="Name" value={driver?.emergency_contact_name} /><FieldRow label="Phone" value={driver?.emergency_contact_phone} /></>}>
              <div className="space-y-3 py-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">Name</label>
                  <input value={emergencyName} onChange={e => setEmergencyName(e.target.value)} placeholder="Jane Smith" className={inputClass} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">Phone</label>
                  <input value={emergencyPhone} onChange={e => setEmergencyPhone(e.target.value)} placeholder="+1 555 000 0001" className={inputClass} />
                </div>
              </div>
            </EditCard>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {/* Personal (locked) */}
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-50"><User className="h-3.5 w-3.5 text-gray-500" /></div>
                  <p className="text-sm font-semibold text-gray-900">Personal Info</p>
                </div>
                <span className="flex items-center gap-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wide"><Lock className="h-2.5 w-2.5" /> Locked</span>
              </div>
              <div className="px-5">
                <FieldRow label="Full Name"     value={driverName} locked />
                <FieldRow label="Date of Birth" value={fmtDate(driver?.dob)} locked />
              </div>
            </div>

            {/* License */}
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-50"><CreditCard className="h-3.5 w-3.5 text-gray-500" /></div>
                  <p className="text-sm font-semibold text-gray-900">Driver License</p>
                </div>
                {!editLicense && (
                  <button onClick={() => setEditLicense(true)} className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition">
                    <Pencil className="h-3 w-3" /> Update
                  </button>
                )}
              </div>
              <div className="px-5">
                <FieldRow label="Number"   value={driver?.license_number === "PENDING" ? null : driver?.license_number} locked />
                <FieldRow label="State"    value={driver?.license_state} locked />
                <div className="py-3">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Expiry</p>
                    {getPendingReq("license_expiry")  && <StatusPill status="pending" />}
                    {getApprovedReq("license_expiry") && <StatusPill status="approved" />}
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">{fmtDate(driver?.license_expiry)}</p>
                    <ExpiryBadge date={driver?.license_expiry} />
                  </div>
                </div>
                {editLicense && (
                  <div className="pb-4 space-y-3">
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">Requires admin approval. Upload renewed license photo.</div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-gray-700">New Expiry Date *</label>
                      <input type="date" value={licenseExpiry} onChange={e => setLicenseExpiry(e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-gray-700">License Photo *</label>
                      <input ref={licFileRef} type="file" accept=".jpg,.jpeg,.png,.webp,.pdf" className="hidden" onChange={e => setLicenseFile(e.target.files?.[0] ?? null)} />
                      <div onClick={() => licFileRef.current?.click()} className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition ${licenseFile ? "border-blue-200 bg-blue-50" : "border-dashed border-gray-200 hover:border-gray-300"}`}>
                        <div className="flex items-center gap-2 text-sm">
                          {licenseFile ? <CheckCircle className="h-4 w-4 text-[#0b66d1]" /> : <Upload className="h-4 w-4 text-gray-400" />}
                          <span className="truncate text-xs text-gray-500">{licenseFile ? licenseFile.name : "Browse file"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <button onClick={() => { setEditLicense(false); setLicenseFile(null); }} className="text-xs text-gray-400 hover:text-gray-700">Cancel</button>
                      <button onClick={saveLicenseExpiry} disabled={savingCard === "license"} className={`${DRIVER_THEME.btnPrimary} text-xs disabled:opacity-60`}>
                        {savingCard === "license" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Submit for Approval"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Compliance */}
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-50">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-50"><Shield className="h-3.5 w-3.5 text-gray-500" /></div>
                <p className="text-sm font-semibold text-gray-900">Compliance</p>
              </div>
              <div className="px-5">
                <FieldRow label="Consent" value={driver?.background_check_consent ? `Consented ${fmtDate(driver?.background_check_consent_at)}` : "Not consented"} locked={driver?.background_check_consent} />
                <div className="py-3">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Background Check</p>
                    {bgPending  && <StatusPill status="pending" />}
                    {bgApproved && <StatusPill status="approved" />}
                  </div>
                  {driver?.background_check_doc_url
                    ? <a href={driver.background_check_doc_url} target="_blank" rel="noreferrer" className="text-sm font-medium text-[#0b66d1] hover:underline">View Document</a>
                    : <p className="text-sm text-gray-400">Not uploaded</p>
                  }
                </div>
                {!bgApproved && (
                  <div className="pb-4">
                    <input ref={bgFileRef} type="file" accept=".jpg,.jpeg,.png,.webp,.pdf" className="hidden" onChange={e => setBgFile(e.target.files?.[0] ?? null)} />
                    <div className="flex items-center gap-2">
                      <div onClick={() => bgFileRef.current?.click()} className={`flex flex-1 cursor-pointer items-center gap-2 rounded-xl border p-3 text-xs transition ${bgFile ? "border-blue-200 bg-blue-50 text-[#0b66d1]" : "border-dashed border-gray-200 text-gray-400 hover:border-gray-300"}`}>
                        {bgFile ? <CheckCircle className="h-3.5 w-3.5" /> : <Upload className="h-3.5 w-3.5" />}
                        <span className="truncate">{bgFile ? bgFile.name : "Upload document"}</span>
                      </div>
                      {bgFile && (
                        <button onClick={handleUploadBgCheck} disabled={savingBg} className={`${DRIVER_THEME.btnPrimary} text-xs shrink-0 disabled:opacity-60`}>
                          {savingBg ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Submit"}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Expiry tracker */}
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-50">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-50"><Calendar className="h-3.5 w-3.5 text-gray-500" /></div>
              <p className="text-sm font-semibold text-gray-900">Document Expiry Tracker</p>
            </div>
            <div className="p-5"><ExpiryCalendar driver={driver} vehicle={vehicle} /></div>
          </div>
        </div>
      )}

      {/* ══ TAB: Documents ════════════════════════════════════ */}
      {activeTab === "docs" && (
        <div className="space-y-4">

          {/* Rejected docs — reupload */}
          {activeRejections.length > 0 && (
            <div className="rounded-2xl border border-red-200 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-red-100">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50"><AlertTriangle className="h-3.5 w-3.5 text-red-500" /></div>
                  <p className="text-sm font-semibold text-gray-900">Rejected — Resubmit Required</p>
                </div>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">{activeRejections.length}</span>
              </div>
              <div className="divide-y divide-gray-50">
                {activeRejections.map(req => (
                  <div key={req.id} className="px-5 py-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-900 capitalize">{req.field_name.replace(/_/g, " ")}</p>
                        <p className="text-xs text-red-500 mt-0.5">Rejected {fmtShort(req.requested_at)}</p>
                        {req.admin_note && (
                          <div className="mt-2 rounded-lg bg-red-50 border border-red-100 px-3 py-2">
                            <p className="text-xs text-red-700"><span className="font-semibold">Admin note: </span>{req.admin_note}</p>
                          </div>
                        )}
                      </div>
                      <StatusPill status="rejected" />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-xl border border-dashed border-gray-200 bg-gray-50 p-3 hover:border-[#0b66d1] hover:bg-blue-50/30 transition">
                        <input type="file" accept=".jpg,.jpeg,.png,.webp,.pdf" className="hidden"
                          onChange={e => setReuploadFiles(prev => ({ ...prev, [req.field_name]: e.target.files?.[0] ?? null }))} />
                        {reuploadFiles[req.field_name]
                          ? <><CheckCircle className="h-4 w-4 text-[#0b66d1] shrink-0" /><span className="truncate text-xs font-medium text-[#0b66d1]">{reuploadFiles[req.field_name]!.name}</span></>
                          : <><Upload className="h-4 w-4 text-gray-400 shrink-0" /><span className="text-xs text-gray-500">Select new file to resubmit</span></>
                        }
                      </label>
                      {reuploadFiles[req.field_name] && (
                        <button onClick={() => handleReupload(req.field_name, reuploadFiles[req.field_name]!)} disabled={reuploadSaving === req.field_name}
                          className={`${DRIVER_THEME.btnPrimary} shrink-0 text-xs disabled:opacity-60`}>
                          {reuploadSaving === req.field_name ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <><Check className="h-3.5 w-3.5" /> Resubmit</>}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Photos */}
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-50"><User className="h-3.5 w-3.5 text-gray-500" /></div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Verification Photos</p>
                  <p className="text-xs text-gray-400 mt-0.5">Required for account approval</p>
                </div>
              </div>
              {hasNewPhotos && (
                <button onClick={handleUploadPhotos} disabled={uploadingPhotos} className={`${DRIVER_THEME.btnPrimary} text-xs disabled:opacity-60`}>
                  {uploadingPhotos ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Uploading</> : <><CheckCircle className="h-3.5 w-3.5" /> Save Photos</>}
                </button>
              )}
            </div>
            <div className="p-5">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <PhotoSlot label="Driver Photo"        currentUrl={driver?.driver_photo_url}        file={driverPhoto}       onSet={setDriverPhoto}       note="Clear face photo"        />
                <PhotoSlot label="Driver with License" currentUrl={driver?.driver_with_license_url}  file={driverWithLicense} onSet={setDriverWithLicense} note="Holding your license"    />
                <PhotoSlot label="License Front"       currentUrl={driver?.license_front_url || driver?.license_doc_url} file={licenseFront} onSet={setLicenseFront} note="Front side visible" />
                <PhotoSlot label="License Back"        currentUrl={driver?.license_back_url}         file={licenseBack}       onSet={setLicenseBack}       note="Back side visible"       />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ TAB: Activity ════════════════════════════════════ */}
      {activeTab === "history" && (
        <div className="space-y-4">
          {/* Rating history */}
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-50"><Star className="h-3.5 w-3.5 text-amber-400" /></div>
                <p className="text-sm font-semibold text-gray-900">Rating History</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-gray-900">{driver?.rating ? driver.rating.toFixed(2) : "—"}</p>
                <p className="text-xs text-gray-400">avg</p>
              </div>
            </div>
            <div className="p-5">
              <RatingChart history={ratingHistory} />
              {ratingHistory.length > 0 && (
                <div className="mt-4 flex items-center justify-between text-xs text-gray-400 border-t border-gray-50 pt-3">
                  <span>Last {Math.min(ratingHistory.length, 12)} ratings shown</span>
                  <span>{(ratingHistory.reduce((s, r) => s + r.rating, 0) / ratingHistory.length).toFixed(2)} ★ average</span>
                </div>
              )}
            </div>
          </div>

          {/* Change request history */}
          {changeReqs.length > 0 && (
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-50">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-50"><Clock className="h-3.5 w-3.5 text-gray-500" /></div>
                <p className="text-sm font-semibold text-gray-900">Document Request History</p>
              </div>
              <div className="divide-y divide-gray-50">
                {changeReqs.slice(0, 10).map(req => (
                  <div key={req.id} className="flex items-center justify-between px-5 py-3.5">
                    <div>
                      <p className="text-sm font-medium text-gray-900 capitalize">{req.field_name.replace(/_/g, " ")}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{fmtShort(req.requested_at)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {req.new_value && req.field_name !== "background_check_doc" && req.field_name !== "license_expiry" && (
                        <span className="text-xs text-gray-500 max-w-[120px] truncate">{req.new_value}</span>
                      )}
                      <StatusPill status={req.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
