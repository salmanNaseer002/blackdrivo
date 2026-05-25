"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  User, Phone, CreditCard, Shield, AlertCircle, Pencil, X,
  Loader2, Lock, Upload, CheckCircle, Clock, Star, TrendingUp,
  Calendar, Car, FileText, AlertTriangle, Check,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_COUNTRIES } from "@/lib/data/locations";
import { toast } from "sonner";
import { DRIVER_THEME, fmtDate, fmtShort, daysUntil, ini, curr } from "@/lib/driver/theme";

const inputClass = "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20";

// ── Helpers ───────────────────────────────────────────────────
function StatusPill({ status }: { status: string }) {
  if (status === "approved") return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
      <Check className="h-2.5 w-2.5" /> Approved
    </span>
  );
  if (status === "pending") return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
      <Clock className="h-2.5 w-2.5" /> In Review
    </span>
  );
  if (status === "rejected") return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 border border-red-200 px-2 py-0.5 text-[10px] font-semibold text-red-600">
      <X className="h-2.5 w-2.5" /> Rejected
    </span>
  );
  return null;
}

function ExpiryBadge({ date }: { date: string | null }) {
  if (!date) return null;
  const days = daysUntil(date);
  if (days === null) return null;
  if (days < 0)  return <span className="text-xs font-medium text-red-500">Expired</span>;
  if (days < 14) return <span className="text-xs font-medium text-red-500">{days}d left</span>;
  if (days < 60) return <span className="text-xs font-medium text-amber-600">{days}d left</span>;
  if (days < 90) return <span className="text-xs font-medium text-yellow-600">{days}d left</span>;
  return null;
}

// ── Inline editable card ──────────────────────────────────────
function EditCard({ title, icon: Icon, editing, onEdit, onCancel, onSave, saving, children, viewContent }: {
  title: string; icon: any; editing: boolean;
  onEdit: () => void; onCancel: () => void; onSave: () => void;
  saving: boolean; children: React.ReactNode; viewContent: React.ReactNode;
}) {
  return (
    <div className={`${DRIVER_THEME.card} overflow-hidden`}>
      <div className={`${DRIVER_THEME.cardHeader}`}>
        <div className="flex items-center gap-2.5">
          <Icon className="h-4 w-4 text-gray-400" />
          <p className="text-sm font-semibold text-gray-900">{title}</p>
        </div>
        {!editing ? (
          <button onClick={onEdit}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition">
            <Pencil className="h-3 w-3" /> Edit
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button onClick={onCancel} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-50 transition">
              Cancel
            </button>
            <button onClick={onSave} disabled={saving}
              className="flex items-center gap-1.5 rounded-lg bg-[#0b66d1] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0952a8] disabled:opacity-60 transition">
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
              Save
            </button>
          </div>
        )}
      </div>
      <div className="px-5 py-1">
        {editing ? children : viewContent}
      </div>
    </div>
  );
}

function FieldRow({ label, value, locked, pendingValue, status }: {
  label: string; value?: string | null; locked?: boolean;
  pendingValue?: string | null; status?: string;
}) {
  return (
    <div className="py-3 border-b border-gray-50 last:border-0">
      <div className="flex items-center gap-1 mb-1">
        <p className={DRIVER_THEME.fieldLabel}>{label}</p>
        {locked && <Lock className="h-2.5 w-2.5 text-gray-300" />}
        {pendingValue && status && <StatusPill status={status} />}
      </div>
      <p className="text-sm font-medium text-gray-900">{value || "—"}</p>
    </div>
  );
}

// ── Photo slot ────────────────────────────────────────────────
function PhotoSlot({ label, currentUrl, file, onSet, note }: {
  label: string; currentUrl?: string | null; file: File | null;
  onSet: (f: File | null) => void; note?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  useEffect(() => {
    if (file) { const url = URL.createObjectURL(file); setPreview(url); return () => URL.revokeObjectURL(url); }
    setPreview(null);
  }, [file]);
  const displayUrl = preview || currentUrl;
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-gray-700">{label}</label>
      {note && <p className="mb-1.5 text-[11px] text-gray-400">{note}</p>}
      <input ref={ref} type="file" accept=".jpg,.jpeg,.png,.webp" className="hidden"
        onChange={e => onSet(e.target.files?.[0] ?? null)} />
      {displayUrl ? (
        <div className="relative group">
          <Image src={displayUrl} alt={label} width={200} height={140}
            className="h-32 w-full rounded-xl object-cover border border-gray-200" />
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/0 group-hover:bg-black/30 transition">
            <button type="button" onClick={() => ref.current?.click()}
              className="flex items-center gap-1.5 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-700 opacity-0 group-hover:opacity-100 transition">
              <Upload className="h-3.5 w-3.5" /> Replace
            </button>
          </div>
          {file && <div className="absolute right-2 top-2 rounded-full bg-[#0b66d1] px-2 py-0.5 text-[10px] font-bold text-white">NEW</div>}
        </div>
      ) : (
        <div onClick={() => ref.current?.click()}
          className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:border-gray-300 transition">
          <Upload className="h-5 w-5 text-gray-300 mb-1.5" />
          <span className="text-xs text-gray-400">Click to upload</span>
        </div>
      )}
      {file && <button onClick={() => onSet(null)} className="mt-1 text-xs text-gray-400 hover:text-gray-700">Remove</button>}
    </div>
  );
}

// ── Rating mini chart ─────────────────────────────────────────
function RatingChart({ history }: { history: any[] }) {
  if (!history.length) return (
    <div className="flex h-24 items-center justify-center text-sm text-gray-400">No rating history yet</div>
  );
  const max = 5;
  const last12 = history.slice(-12);
  return (
    <div className="flex items-end gap-1 h-16">
      {last12.map((h, i) => {
        const pct = (h.rating / max) * 100;
        const isLast = i === last12.length - 1;
        return (
          <div key={i} className="group relative flex flex-1 flex-col items-center gap-1">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap z-10">
              {h.rating.toFixed(1)} ★
            </div>
            <div className="w-full rounded-t" style={{ height: `${pct}%`, backgroundColor: isLast ? DRIVER_THEME.primary : "#e5e7eb" }} />
          </div>
        );
      })}
    </div>
  );
}

// ── Document expiry calendar ──────────────────────────────────
function ExpiryCalendar({ driver, vehicle }: { driver: any; vehicle: any }) {
  const items = [
    { label: "Driver License",    date: driver?.license_expiry,         icon: CreditCard },
    { label: "Vehicle Insurance", date: driver?.insurance_expiry_date,  icon: FileText   },
    { label: "Vehicle Inspection",date: vehicle?.next_inspection_due,   icon: Car        },
  ].filter(i => i.date);

  if (!items.length) return <p className="text-sm text-gray-400 py-4 text-center">No expiry dates set</p>;

  return (
    <div className="space-y-2">
      {items.map(item => {
        const days = daysUntil(item.date);
        const urgent = days !== null && days < 14;
        const warning = days !== null && days < 60;
        return (
          <div key={item.label} className={`flex items-center justify-between rounded-xl border px-4 py-3 ${urgent ? "border-red-200 bg-red-50" : warning ? "border-amber-200 bg-amber-50" : "border-gray-100 bg-gray-50"}`}>
            <div className="flex items-center gap-3">
              <item.icon className={`h-4 w-4 ${urgent ? "text-red-500" : warning ? "text-amber-500" : "text-gray-400"}`} />
              <div>
                <p className="text-sm font-medium text-gray-900">{item.label}</p>
                <p className="text-xs text-gray-500">{fmtDate(item.date)}</p>
              </div>
            </div>
            <div className="text-right">
              {days !== null && days < 0
                ? <span className="text-xs font-bold text-red-600">Expired</span>
                : days !== null && days < 90
                ? <span className={`text-xs font-bold ${urgent ? "text-red-600" : warning ? "text-amber-600" : "text-gray-500"}`}>{days} days</span>
                : <span className="text-xs text-gray-400">{fmtShort(item.date)}</span>
              }
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function ProfilePage() {
  const router = useRouter();
  const [driver,       setDriver]       = useState<any>(null);
  const [authUser,     setAuthUser]     = useState<any>(null);
  const [vehicle,      setVehicle]      = useState<any>(null);
  const [ratingHistory,setRatingHistory]= useState<any[]>([]);
  const [changeReqs,   setChangeReqs]   = useState<any[]>([]);
  const [loading,      setLoading]      = useState(true);

  // Edit states per card
  const [editContact,  setEditContact]  = useState(false);
  const [editAddress,  setEditAddress]  = useState(false);
  const [editEmergency,setEditEmergency]= useState(false);
  const [editLicense,  setEditLicense]  = useState(false);
  const [savingCard,   setSavingCard]   = useState("");

  // Contact fields
  const [phone,        setPhone]        = useState("");
  const [country,      setCountry]      = useState("US");
  const [city,         setCity]         = useState("");

  // Address field
  const [address,      setAddress]      = useState("");

  // Emergency
  const [emergencyName, setEmergencyName]  = useState("");
  const [emergencyPhone,setEmergencyPhone] = useState("");

  // License expiry + file
  const [licenseExpiry, setLicenseExpiry] = useState("");
  const [licenseFile,   setLicenseFile]   = useState<File | null>(null);
  const licFileRef = useRef<HTMLInputElement>(null);

  // Photos
  const [driverPhoto,        setDriverPhoto]        = useState<File | null>(null);
  const [driverWithLicense,  setDriverWithLicense]  = useState<File | null>(null);
  const [licenseFront,       setLicenseFront]       = useState<File | null>(null);
  const [licenseBack,        setLicenseBack]        = useState<File | null>(null);
  const [uploadingPhotos,    setUploadingPhotos]     = useState(false);

  // Background check
  const [bgFile,     setBgFile]   = useState<File | null>(null);
  const [savingBg,   setSavingBg] = useState(false);
  const bgFileRef = useRef<HTMLInputElement>(null);

  const loadData = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.replace("/login"); return; }
    setAuthUser(user);
    const [{ data: drv }, ] = await Promise.all([
      supabase.from("drivers").select("*").eq("user_id", user.id).maybeSingle(),
    ]);
    if (!drv) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const drvAny = drv as any;
    setDriver(drvAny);
    setPhone(drvAny.phone || "");
    setCountry(drvAny.country_code || "US");
    setCity(drvAny.city_code || "");
    setAddress(drvAny.home_address || "");
    setEmergencyName(drvAny.emergency_contact_name || "");
    setEmergencyPhone(drvAny.emergency_contact_phone || "");
    setLicenseExpiry(drvAny.license_expiry || "");

    const [{ data: veh }, { data: rh }, { data: cr }] = await Promise.all([
      (supabase as any).from("driver_vehicles").select("*").eq("driver_id", drvAny.id).eq("is_active", true).maybeSingle(),
      (supabase as any).from("driver_rating_history").select("*").eq("driver_id", drvAny.id).order("created_at", { ascending: false }).limit(12),
      (supabase as any).from("driver_change_requests").select("*").eq("driver_id", drvAny.id).order("requested_at", { ascending: false }),
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

  const getPendingReq = (field: string) => changeReqs.find(r => r.field_name === field && r.status === "pending");
  const getApprovedReq = (field: string) => changeReqs.find(r => r.field_name === field && r.status === "approved");

  // ── Save contact ──────────────────────────────────────────
  const saveContact = async () => {
    setSavingCard("contact");
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not logged in");
      await (supabase as any).from("drivers").update({
        phone: phone.trim() || null,
        country_code: country,
        city_code: city || null,
      }).eq("user_id", user.id);
      toast.success("Contact info updated!");
      await loadData(); setEditContact(false);
    } catch (err: any) { toast.error(err.message); }
    finally { setSavingCard(""); }
  };

  // ── Save address ──────────────────────────────────────────
  const saveAddress = async () => {
    setSavingCard("address");
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not logged in");
      await (supabase as any).from("drivers").update({ home_address: address.trim() || null }).eq("user_id", user.id);
      toast.success("Address updated!");
      await loadData(); setEditAddress(false);
    } catch (err: any) { toast.error(err.message); }
    finally { setSavingCard(""); }
  };

  // ── Save emergency ────────────────────────────────────────
  const saveEmergency = async () => {
    setSavingCard("emergency");
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not logged in");
      await (supabase as any).from("drivers").update({
        emergency_contact_name:  emergencyName.trim() || null,
        emergency_contact_phone: emergencyPhone.trim() || null,
      }).eq("user_id", user.id);
      toast.success("Emergency contact updated!");
      await loadData(); setEditEmergency(false);
    } catch (err: any) { toast.error(err.message); }
    finally { setSavingCard(""); }
  };

  // ── Save license expiry — creates change request ──────────
  const saveLicenseExpiry = async () => {
    if (!licenseExpiry) { toast.error("Select expiry date"); return; }
    if (!licenseFile)   { toast.error("License photo is required for expiry update"); return; }
    setSavingCard("license");
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not logged in");
      const fileUrl = await uploadFile(supabase, licenseFile, `${user.id}/license-expiry-update.${licenseFile.name.split(".").pop()}`);
      await (supabase as any).from("driver_change_requests").insert({
        driver_id:  driver.id,
        field_name: "license_expiry",
        old_value:  driver.license_expiry,
        new_value:  licenseExpiry,
        file_url:   fileUrl,
        status:     "pending",
      });
      toast.success("License expiry update submitted for review!");
      setLicenseFile(null); setEditLicense(false);
      await loadData();
    } catch (err: any) { toast.error(err.message); }
    finally { setSavingCard(""); }
  };

  // ── Upload driver photos ──────────────────────────────────
  const handleUploadPhotos = async () => {
    const hasFiles = driverPhoto || driverWithLicense || licenseFront || licenseBack;
    if (!hasFiles) { toast.error("Select at least one photo"); return; }
    setUploadingPhotos(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not logged in");
      const updates: Record<string, string> = {};
      if (driverPhoto)       updates.driver_photo_url        = await uploadFile(supabase, driverPhoto,       `${user.id}/driver-photo.${driverPhoto.name.split(".").pop()}`);
      if (driverWithLicense) updates.driver_with_license_url = await uploadFile(supabase, driverWithLicense, `${user.id}/driver-with-license.${driverWithLicense.name.split(".").pop()}`);
      if (licenseFront)      updates.license_front_url       = await uploadFile(supabase, licenseFront,      `${user.id}/license-front.${licenseFront.name.split(".").pop()}`);
      if (licenseBack)       updates.license_back_url        = await uploadFile(supabase, licenseBack,       `${user.id}/license-back.${licenseBack.name.split(".").pop()}`);
      await (supabase as any).from("drivers").update(updates).eq("user_id", user.id);
      await (supabase as any).from("driver_audit_log").insert({ driver_id: driver.id, action: "DRIVER_PHOTOS_UPDATED", description: `Updated: ${Object.keys(updates).join(", ")}`, changed_by: "driver" });
      toast.success("Photos uploaded!");
      setDriverPhoto(null); setDriverWithLicense(null); setLicenseFront(null); setLicenseBack(null);
      await loadData();
    } catch (err: any) { toast.error(err.message || "Upload failed"); }
    finally { setUploadingPhotos(false); }
  };

  // ── Upload background check doc ───────────────────────────
  const handleUploadBgCheck = async () => {
    if (!bgFile) { toast.error("Select a file"); return; }
    setSavingBg(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not logged in");
      const url = await uploadFile(supabase, bgFile, `${user.id}/background-check.${bgFile.name.split(".").pop()}`);
      await (supabase as any).from("drivers").update({ background_check_doc_url: url, background_check_doc_status: "pending" }).eq("user_id", user.id);
      await (supabase as any).from("driver_change_requests").insert({ driver_id: driver.id, field_name: "background_check_doc", old_value: null, new_value: url, file_url: url, status: "pending" });
      toast.success("Background check document submitted for review!");
      setBgFile(null); await loadData();
    } catch (err: any) { toast.error(err.message); }
    finally { setSavingBg(false); }
  };

  if (loading || !driver) return null;

  const driverName  = driver?.full_name && driver.full_name !== "PENDING" ? driver.full_name : authUser?.email?.split("@")[0] || "Driver";
  const countryData = DEFAULT_COUNTRIES.find((c: any) => c.code === driver?.country_code);
  const selCountry  = DEFAULT_COUNTRIES.find(c => c.code === country);
  const cityName    = countryData?.cities?.find((c: any) => c.code === driver?.city_code)?.name || driver?.city_code;
  const phoneDisplay = driver?.phone ? `${countryData?.phoneCode || ""} ${driver.phone}`.trim() : null;
  const daysLeft    = daysUntil(driver?.license_expiry);
  const licExpiring = daysLeft !== null && daysLeft < 90;

  const statusCfg = driver?.status === "approved"
    ? { label: "Approved Driver", dot: "bg-emerald-500", text: "text-emerald-600" }
    : driver?.status === "rejected"
    ? { label: "Application Rejected", dot: "bg-red-500", text: "text-red-500" }
    : { label: "Under Review", dot: "bg-amber-500", text: "text-amber-600" };

  const hasNewPhotos = driverPhoto || driverWithLicense || licenseFront || licenseBack;
  const bgApproved  = driver?.background_check_doc_status === "approved";
  const bgPending   = driver?.background_check_doc_status === "pending" && driver?.background_check_doc_url;

  return (
    <div className={DRIVER_THEME.pageWrapper}>

      {/* ── Header ── */}
      <div>
        <h2 className={DRIVER_THEME.pageTitle}>My Profile</h2>
        <p className={DRIVER_THEME.pageSub}>Manage your personal information and driver details</p>
      </div>

      {/* ── Expiry alerts ── */}
      {licExpiring && daysLeft !== null && (
        <div className={`flex items-start gap-3 rounded-xl border p-4 ${daysLeft < 14 ? "border-red-200 bg-red-50" : daysLeft < 60 ? "border-amber-200 bg-amber-50" : "border-yellow-200 bg-yellow-50"}`}>
          <AlertCircle className={`h-4 w-4 shrink-0 mt-0.5 ${daysLeft < 14 ? "text-red-500" : daysLeft < 60 ? "text-amber-500" : "text-yellow-500"}`} />
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">
              {daysLeft < 0 ? "License Expired!" : `License expires in ${daysLeft} days`}
            </p>
            <p className="text-xs text-gray-600 mt-0.5">
              {daysLeft < 14 ? "Urgent: Update immediately or you may be suspended."
               : daysLeft < 60 ? "Update your license expiry from the License card below."
               : "Reminder: Your license is expiring soon."}
            </p>
          </div>
          <button onClick={() => setEditLicense(true)}
            className="shrink-0 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">
            Update
          </button>
        </div>
      )}

      {/* ── Profile hero ── */}
      <div className={`${DRIVER_THEME.card} overflow-hidden`}>
        <div className="h-20" style={{ background: `linear-gradient(135deg, ${DRIVER_THEME.primary} 0%, ${DRIVER_THEME.primaryDark} 100%)` }} />
        <div className="px-6 pb-5">
          <div className="flex items-end gap-4 -mt-8 mb-4">
            <div className="relative">
              {driver?.driver_photo_url ? (
                <Image src={driver.driver_photo_url} alt={driverName} width={64} height={64}
                  className="h-16 w-16 rounded-2xl border-4 border-white object-cover shadow-sm" />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-white text-xl font-bold text-white shadow-sm"
                  style={{ backgroundColor: DRIVER_THEME.primary }}>
                  {ini(driverName)}
                </div>
              )}
            </div>
            <div className="pb-1 flex-1">
              <h3 className="text-base font-bold text-gray-900">{driverName}</h3>
              <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${statusCfg.text}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${statusCfg.dot}`} />
                {statusCfg.label}
              </span>
            </div>
            <div className="pb-1 text-right hidden sm:block">
              <p className="text-2xl font-bold text-gray-900">{driver?.rating ? driver.rating.toFixed(2) : "—"}</p>
              <p className="text-xs text-gray-400 flex items-center justify-end gap-1"><Star className="h-3 w-3 text-amber-400" /> Rating</p>
            </div>
          </div>
          <div className="grid gap-x-6 sm:grid-cols-3 border-t border-gray-50 pt-4">
            <div className="py-2">
              <p className={`${DRIVER_THEME.fieldLabel} flex items-center gap-1`}>Email <Lock className="h-2.5 w-2.5 text-gray-300" /></p>
              <p className="mt-1 text-sm font-medium text-gray-900 truncate">{driver?.email || authUser?.email || "—"}</p>
            </div>
            <div className="py-2">
              <p className={DRIVER_THEME.fieldLabel}>Phone</p>
              <p className="mt-1 text-sm font-medium text-gray-900">{phoneDisplay || "—"}</p>
            </div>
            <div className="py-2">
              <p className={`${DRIVER_THEME.fieldLabel} flex items-center gap-1`}>Member Since <Lock className="h-2.5 w-2.5 text-gray-300" /></p>
              <p className="mt-1 text-sm font-medium text-gray-900">{driver?.created_at ? new Date(driver.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "—"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total Rides", value: String(driver?.total_rides ?? 0), icon: Car,       color: "text-gray-900" },
          { label: "Rating",      value: driver?.rating ? `${driver.rating.toFixed(2)} ★` : "—", icon: Star, color: "text-amber-500" },
          { label: "Completion",  value: "—",                               icon: TrendingUp, color: "text-emerald-600" },
        ].map(s => (
          <div key={s.label} className={`${DRIVER_THEME.card} p-4 flex items-center gap-3`}>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50">
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Row 1: Contact · Address · Emergency ── */}
      <div className="grid gap-4 lg:grid-cols-3">
        <EditCard title="Contact Info" icon={Phone}
          editing={editContact} onEdit={() => setEditContact(true)}
          onCancel={() => { setEditContact(false); setPhone(driver?.phone || ""); setCountry(driver?.country_code || "US"); setCity(driver?.city_code || ""); }}
          onSave={saveContact} saving={savingCard === "contact"}
          viewContent={
            <>
              <FieldRow label="Phone"   value={phoneDisplay} />
              <FieldRow label="Country" value={countryData?.name || driver?.country_code} />
              <FieldRow label="City"    value={cityName} />
            </>
          }>
          <div className="space-y-4 py-3">
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
                {selCountry && (
                  <div className="flex h-[46px] items-center rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-600 shrink-0">
                    {selCountry.flag} {selCountry.phoneCode}
                  </div>
                )}
                <input value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder={selCountry?.phonePlaceholder || "555 000 0000"} className={`${inputClass} flex-1`} />
              </div>
            </div>
          </div>
        </EditCard>

        <EditCard title="Home Address" icon={User}
          editing={editAddress} onEdit={() => setEditAddress(true)}
          onCancel={() => { setEditAddress(false); setAddress(driver?.home_address || ""); }}
          onSave={saveAddress} saving={savingCard === "address"}
          viewContent={<FieldRow label="Address" value={driver?.home_address} />}>
          <div className="py-3">
            <label className="mb-1.5 block text-xs font-medium text-gray-700">Home Address</label>
            <input value={address} onChange={e => setAddress(e.target.value)}
              placeholder="123 Main St, New York, NY 10001" className={inputClass} />
          </div>
        </EditCard>

        <EditCard title="Emergency Contact" icon={Phone}
          editing={editEmergency} onEdit={() => setEditEmergency(true)}
          onCancel={() => { setEditEmergency(false); setEmergencyName(driver?.emergency_contact_name || ""); setEmergencyPhone(driver?.emergency_contact_phone || ""); }}
          onSave={saveEmergency} saving={savingCard === "emergency"}
          viewContent={
            <>
              <FieldRow label="Contact Name"  value={driver?.emergency_contact_name} />
              <FieldRow label="Contact Phone" value={driver?.emergency_contact_phone} />
            </>
          }>
          <div className="space-y-4 py-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">Contact Name</label>
              <input value={emergencyName} onChange={e => setEmergencyName(e.target.value)} placeholder="Jane Smith" className={inputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">Contact Phone</label>
              <input value={emergencyPhone} onChange={e => setEmergencyPhone(e.target.value)} placeholder="+1 555 000 0001" className={inputClass} />
            </div>
          </div>
        </EditCard>
      </div>

      {/* ── Row 2: Personal Info · License · Compliance ── */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Personal info — locked */}
        <div className={`${DRIVER_THEME.card} overflow-hidden`}>
          <div className={DRIVER_THEME.cardHeader}>
            <div className="flex items-center gap-2.5">
              <User className="h-4 w-4 text-gray-400" />
              <p className="text-sm font-semibold text-gray-900">Personal Info</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Lock className="h-3 w-3" /> Locked
            </div>
          </div>
          <div className="px-5">
            <FieldRow label="Full Name"     value={driverName} locked />
            <FieldRow label="Date of Birth" value={fmtDate(driver?.dob)} locked />
          </div>
        </div>

      {/* ── Driver License card ── */}
        <div className={`${DRIVER_THEME.card} overflow-hidden`}>
          <div className={DRIVER_THEME.cardHeader}>
            <div className="flex items-center gap-2.5">
              <CreditCard className="h-4 w-4 text-gray-400" />
              <p className="text-sm font-semibold text-gray-900">Driver License</p>
            </div>
            {!editLicense && (
              <button onClick={() => setEditLicense(true)}
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition">
                <Pencil className="h-3 w-3" /> Update Expiry
              </button>
            )}
          </div>
          <div className="px-5">
            <FieldRow label="License Number"   value={driver?.license_number === "PENDING" ? null : driver?.license_number} locked />
            <FieldRow label="State / Province" value={driver?.license_state} locked />
            <div className="py-3 border-b border-gray-50">
              <div className="flex items-center gap-1 mb-1">
                <p className={DRIVER_THEME.fieldLabel}>Expiry Date</p>
                {getPendingReq("license_expiry") && <StatusPill status="pending" />}
                {getApprovedReq("license_expiry") && <StatusPill status="approved" />}
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-gray-900">{fmtDate(driver?.license_expiry)}</p>
                <ExpiryBadge date={driver?.license_expiry} />
              </div>
            </div>
            {editLicense && (
              <div className="py-4 space-y-4">
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
                  License expiry update requires admin approval. Upload a clear photo of your renewed license.
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">New Expiry Date *</label>
                  <input type="date" value={licenseExpiry} onChange={e => setLicenseExpiry(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">License Photo * (required)</label>
                  <input ref={licFileRef} type="file" accept=".jpg,.jpeg,.png,.webp,.pdf" className="hidden"
                    onChange={e => setLicenseFile(e.target.files?.[0] ?? null)} />
                  <div onClick={() => licFileRef.current?.click()}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition ${licenseFile ? "border-blue-200 bg-blue-50" : "border-dashed border-gray-200 hover:border-gray-300"}`}>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      {licenseFile ? <CheckCircle className="h-4 w-4 text-[#0b66d1]" /> : <Upload className="h-4 w-4 text-gray-400" />}
                      <span className="truncate">{licenseFile ? licenseFile.name : "Upload license photo"}</span>
                    </div>
                    <span className="text-xs text-gray-400 shrink-0">{licenseFile ? "✓" : "Browse"}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <button onClick={() => { setEditLicense(false); setLicenseFile(null); }}
                    className="text-sm text-gray-400 hover:text-gray-700">Cancel</button>
                  <button onClick={saveLicenseExpiry} disabled={savingCard === "license"}
                    className={`${DRIVER_THEME.btnPrimary} disabled:opacity-60`}>
                    {savingCard === "license" ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</> : "Submit for Approval"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Compliance card ── */}
        <div className={`${DRIVER_THEME.card} overflow-hidden`}>
          <div className={DRIVER_THEME.cardHeader}>
            <div className="flex items-center gap-2.5">
              <Shield className="h-4 w-4 text-gray-400" />
              <p className="text-sm font-semibold text-gray-900">Compliance</p>
            </div>
          </div>
          <div className="px-5">
            <FieldRow label="Consent Status"
              value={driver?.background_check_consent ? `✓ Consented on ${fmtDate(driver?.background_check_consent_at)}` : "Not consented"}
              locked={driver?.background_check_consent} />
            <div className="py-3">
              <div className="flex items-center gap-1 mb-1">
                <p className={DRIVER_THEME.fieldLabel}>Background Check Doc</p>
                {bgPending  && <StatusPill status="pending" />}
                {bgApproved && <StatusPill status="approved" />}
              </div>
              {driver?.background_check_doc_url
                ? <a href={driver.background_check_doc_url} target="_blank" rel="noreferrer"
                    className="text-sm font-medium hover:underline" style={{ color: DRIVER_THEME.primary }}>View Document</a>
                : <p className="text-sm text-gray-400">Not uploaded</p>
              }
            </div>
            {!bgApproved && (
              <div className="pb-4">
                <input ref={bgFileRef} type="file" accept=".jpg,.jpeg,.png,.webp,.pdf" className="hidden"
                  onChange={e => setBgFile(e.target.files?.[0] ?? null)} />
                <div className="flex items-center gap-2">
                  <div onClick={() => bgFileRef.current?.click()}
                    className={`flex flex-1 cursor-pointer items-center gap-2 rounded-xl border p-3 transition text-sm ${bgFile ? "border-blue-200 bg-blue-50 text-[#0b66d1]" : "border-dashed border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                    {bgFile ? <CheckCircle className="h-4 w-4 shrink-0" /> : <Upload className="h-4 w-4 shrink-0 text-gray-400" />}
                    <span className="truncate text-xs">{bgFile ? bgFile.name : "Upload document"}</span>
                  </div>
                  {bgFile && (
                    <button onClick={handleUploadBgCheck} disabled={savingBg}
                      className={`${DRIVER_THEME.btnPrimary} shrink-0 disabled:opacity-60`}>
                      {savingBg ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit"}
                    </button>
                  )}
                </div>
                {bgPending && <p className="mt-2 text-xs text-amber-600">Pending admin review.</p>}
              </div>
            )}
          </div>
        </div>
      </div>{/* end row-2 grid */}

      {/* ── Row 3: Photos (left) + Rating History (right) ── */}
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        {/* Driver Photos */}
        <div className={`${DRIVER_THEME.card} overflow-hidden`}>
          <div className={DRIVER_THEME.cardHeader}>
            <div>
              <p className="text-sm font-semibold text-gray-900">Driver Photos & License Images</p>
              <p className="text-xs text-gray-400 mt-0.5">Verification photos required for approval</p>
            </div>
            {hasNewPhotos && (
              <button onClick={handleUploadPhotos} disabled={uploadingPhotos}
                className={`${DRIVER_THEME.btnPrimary} disabled:opacity-60`}>
                {uploadingPhotos ? <><Loader2 className="h-4 w-4 animate-spin" /> Uploading…</> : <><CheckCircle className="h-4 w-4" /> Save Photos</>}
              </button>
            )}
          </div>
          <div className="p-5">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <PhotoSlot label="Driver Photo"         currentUrl={driver?.driver_photo_url}        file={driverPhoto}       onSet={setDriverPhoto}       note="Clear face photo" />
              <PhotoSlot label="Driver with License"  currentUrl={driver?.driver_with_license_url}  file={driverWithLicense} onSet={setDriverWithLicense} note="Holding license" />
              <PhotoSlot label="License — Front"      currentUrl={driver?.license_front_url || driver?.license_doc_url} file={licenseFront} onSet={setLicenseFront} note="Front clearly visible" />
              <PhotoSlot label="License — Back"       currentUrl={driver?.license_back_url}         file={licenseBack}       onSet={setLicenseBack}       note="Back clearly visible" />
            </div>
          </div>
        </div>

        {/* Rating History */}
        <div className={`${DRIVER_THEME.card} overflow-hidden`}>
          <div className={DRIVER_THEME.cardHeader}>
            <div className="flex items-center gap-2.5">
              <Star className="h-4 w-4 text-amber-400" />
              <p className="text-sm font-semibold text-gray-900">Rating History</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-gray-900">{driver?.rating ? driver.rating.toFixed(2) : "—"}</p>
              <p className="text-xs text-gray-400">avg rating</p>
            </div>
          </div>
          <div className="p-5">
            <RatingChart history={ratingHistory} />
            {ratingHistory.length > 0 && (
              <div className="mt-3 flex items-center justify-between text-xs text-gray-400 border-t border-gray-50 pt-3">
                <span>Last {Math.min(ratingHistory.length, 12)} ratings</span>
                <span>{(ratingHistory.reduce((s, r) => s + r.rating, 0) / ratingHistory.length).toFixed(2)} ★ avg</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Document expiry calendar ── */}
      <div className={`${DRIVER_THEME.card} overflow-hidden`}>
        <div className={DRIVER_THEME.cardHeader}>
          <div className="flex items-center gap-2.5">
            <Calendar className="h-4 w-4 text-gray-400" />
            <p className="text-sm font-semibold text-gray-900">Document Expiry Tracker</p>
          </div>
        </div>
        <div className="p-5">
          <ExpiryCalendar driver={driver} vehicle={vehicle} />
        </div>
      </div>

      {/* ── Change requests history ── */}
      {changeReqs.length > 0 && (
        <div className={`${DRIVER_THEME.card} overflow-hidden`}>
          <div className={DRIVER_THEME.cardHeader}>
            <div className="flex items-center gap-2.5">
              <Clock className="h-4 w-4 text-gray-400" />
              <p className="text-sm font-semibold text-gray-900">Change Request History</p>
            </div>
          </div>
          <div className="divide-y divide-gray-50">
            {changeReqs.slice(0, 5).map(req => (
              <div key={req.id} className="flex items-center justify-between px-5 py-3.5">
                <div>
                  <p className="text-sm font-medium text-gray-900 capitalize">{req.field_name.replace(/_/g, " ")}</p>
                  <p className="text-xs text-gray-400">{fmtShort(req.requested_at)}</p>
                </div>
                <div className="flex items-center gap-2">
                  {req.new_value && req.field_name !== "background_check_doc" && (
                    <span className="text-xs text-gray-500">{req.new_value}</span>
                  )}
                  <StatusPill status={req.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
