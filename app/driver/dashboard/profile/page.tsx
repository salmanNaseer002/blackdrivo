"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Phone, CreditCard, Shield, AlertCircle, Pencil, X,
  Loader2, Lock, Upload, CheckCircle, Clock, Star,
  Calendar, Car, FileText, AlertTriangle, Check, User,
  MapPin, ChevronRight, Activity, Eye, DollarSign,
  MessageCircle, Send, TrendingUp, Award, Zap,
  Bell, ChevronDown, ChevronUp, Building, Hash,
  ArrowUpRight, ArrowDownRight, Wallet, BarChart3,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { DRIVER_THEME, fmtDate, fmtShort, daysUntil, ini } from "@/lib/driver/theme";

// ─── Shared styles ────────────────────────────────────────────
const inp = "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20";

// ─── Phone formatting ─────────────────────────────────────────
const PHONE_RULES: Record<string, { length: number; format: string }> = {
  US: { length: 10, format: "(XXX) XXX-XXXX" },
  CA: { length: 10, format: "(XXX) XXX-XXXX" },
  GB: { length: 10, format: "07XXX XXXXXX"   },
  PK: { length: 10, format: "03XX XXXXXXX"   },
  AE: { length: 9,  format: "05X XXX XXXX"   },
};

function formatPhone(v: string, code: string) {
  const d = v.replace(/\D/g, "");
  if (code === "US" || code === "CA") {
    if (d.length <= 3) return d;
    if (d.length <= 6) return `(${d.slice(0,3)}) ${d.slice(3)}`;
    return `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6,10)}`;
  }
  return d;
}

// ─── Status Pill ──────────────────────────────────────────────
function StatusPill({ status }: { status: string }) {
  const map: Record<string, { cls: string; label: string }> = {
    approved:      { cls: "bg-emerald-50 text-emerald-700",  label: "Approved"      },
    pending:       { cls: "bg-amber-50 text-amber-700",      label: "In Review"     },
    rejected:      { cls: "bg-red-50 text-red-600",          label: "Rejected"      },
    not_submitted: { cls: "bg-gray-100 text-gray-500",       label: "Not Submitted" },
    paid:          { cls: "bg-emerald-50 text-emerald-700",  label: "Paid"          },
    processing:    { cls: "bg-blue-50 text-blue-600",        label: "Processing"    },
    failed:        { cls: "bg-red-50 text-red-600",          label: "Failed"        },
  };
  const s = map[status] || map.not_submitted;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${s.cls}`}>
      {status === "approved" && <Check className="h-2.5 w-2.5" />}
      {status === "pending"  && <Clock className="h-2.5 w-2.5" />}
      {status === "rejected" && <X className="h-2.5 w-2.5" />}
      {s.label}
    </span>
  );
}

// ─── Expiry Badge ─────────────────────────────────────────────
function ExpiryBadge({ date }: { date: string | null }) {
  if (!date) return null;
  const days = daysUntil(date);
  if (days === null) return null;
  if (days < 0)  return <span className="text-xs font-semibold text-red-500">Expired</span>;
  if (days < 30) return <span className="text-xs font-semibold text-red-500">{days}d left</span>;
  if (days < 60) return <span className="text-xs font-semibold text-amber-600">{days}d left</span>;
  if (days < 90) return <span className="text-xs font-semibold text-yellow-600">{days}d left</span>;
  return null;
}

// ─── Photo Lightbox ───────────────────────────────────────────
function Lightbox({ url, label, onClose }: { url: string; label: string; onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div onClick={e => e.stopPropagation()} className="relative max-w-2xl w-full">
        <button onClick={onClose} className="absolute -top-10 right-0 text-white/70 hover:text-white">
          <X className="h-6 w-6" />
        </button>
        <img src={url} alt={label} className="w-full rounded-2xl object-contain max-h-[80vh]" />
        <p className="mt-3 text-center text-sm text-white/60">{label}</p>
      </div>
    </div>
  );
}

// ─── Document Card ────────────────────────────────────────────
function DocCard({
  label, note, currentUrl, file, onSet, onSubmit,
  saving, status, adminNote, locked, required,
}: {
  label: string; note?: string; currentUrl?: string | null;
  file: File | null; onSet: (f: File | null) => void;
  onSubmit: () => void; saving?: boolean; status?: string;
  adminNote?: string | null; locked?: boolean; required?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [preview, setPreview]         = useState<string | null>(null);
  const [lightbox, setLightbox]       = useState(false);

  useEffect(() => {
    if (file) { const u = URL.createObjectURL(file); setPreview(u); return () => URL.revokeObjectURL(u); }
    setPreview(null);
  }, [file]);

  const displayUrl  = preview || currentUrl;
  const isRejected  = status === "rejected";
  const isPending   = status === "pending";
  const isApproved  = status === "approved" || (currentUrl && !isRejected && !isPending);
  const notUploaded = !currentUrl && !file;

  return (
    <>
      {lightbox && currentUrl && <Lightbox url={currentUrl} label={label} onClose={() => setLightbox(false)} />}
      <div className={`rounded-2xl overflow-hidden bg-white shadow-sm transition ${isRejected ? "ring-2 ring-red-200" : required && notUploaded ? "ring-2 ring-amber-200" : ""}`}>
        {/* Image area */}
        <div className="relative">
          {displayUrl ? (
            <div className="relative h-36 group cursor-pointer" onClick={() => currentUrl && setLightbox(true)}>
              <Image src={displayUrl} alt={label} fill className="object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition">
                <div className="flex items-center gap-1.5 rounded-xl bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-700 opacity-0 group-hover:opacity-100 transition">
                  <Eye className="h-3.5 w-3.5" /> View
                </div>
              </div>
              {file        && <div className="absolute right-2 top-2 rounded-full bg-[#0b66d1] px-2 py-0.5 text-[10px] font-bold text-white">NEW</div>}
              {isPending   && !file && <div className="absolute left-2 top-2 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white">In Review</div>}
              {isRejected  && !file && <div className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">Rejected</div>}
            </div>
          ) : (
            <div
              onClick={() => !locked && ref.current?.click()}
              className={`flex h-36 flex-col items-center justify-center gap-2 transition
                ${locked ? "cursor-not-allowed bg-gray-50" : required ? "cursor-pointer bg-amber-50 hover:bg-amber-100" : "cursor-pointer bg-gray-50 hover:bg-blue-50/40"}`}
            >
              {locked
                ? <Lock className="h-6 w-6 text-gray-300" />
                : <Upload className={`h-6 w-6 ${required ? "text-amber-400" : "text-gray-300"}`} />
              }
              <span className={`text-xs font-medium ${required ? "text-amber-600" : "text-gray-400"}`}>
                {locked ? "Locked" : required ? "Required" : "Upload"}
              </span>
            </div>
          )}
          <input ref={ref} type="file" accept=".jpg,.jpeg,.png,.webp" className="hidden"
            onChange={e => onSet(e.target.files?.[0] ?? null)} />
        </div>

        {/* Info */}
        <div className="p-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold text-gray-800 leading-tight">{label}</p>
            {isApproved && !isRejected && !isPending && !file && currentUrl &&
              <Check className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
            }
          </div>
          {note && <p className="mt-0.5 text-[10px] text-gray-400">{note}</p>}

          {isRejected && adminNote && (
            <div className="mt-2 rounded-lg bg-red-50 px-2 py-1.5 text-[10px] text-red-700">
              <span className="font-semibold">Reason: </span>{adminNote}
            </div>
          )}

          {file && (
            <div className="mt-2 flex gap-1.5">
              <button onClick={onSubmit} disabled={saving}
                className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-[#0b66d1] py-1.5 text-[11px] font-semibold text-white hover:bg-[#0952a8] disabled:opacity-60 transition">
                {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <><Check className="h-3 w-3" /> Submit</>}
              </button>
              <button onClick={() => onSet(null)} className="rounded-lg border border-gray-200 px-2 py-1.5 text-[10px] text-gray-400 hover:bg-gray-50">
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          {!locked && !file && currentUrl && !isRejected && (
            <button onClick={() => ref.current?.click()}
              className="mt-2 w-full rounded-lg border border-gray-200 py-1.5 text-[10px] font-medium text-gray-500 hover:bg-gray-50 transition">
              Replace
            </button>
          )}

          {isRejected && !file && (
            <button onClick={() => ref.current?.click()}
              className="mt-2 w-full rounded-lg border border-red-200 bg-red-50 py-1.5 text-[10px] font-semibold text-red-600 hover:bg-red-100 transition">
              Reupload
            </button>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Stat Card ────────────────────────────────────────────────
function StatCard({ label, value, sub, icon: Icon, color }: {
  label: string; value: string | number; sub?: string;
  icon: any; color: string;
}) {
  return (
    <div className="rounded-2xl bg-white shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p>
        <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${color}`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-gray-400">{sub}</p>}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  Main Page
// ══════════════════════════════════════════════════════════════
export default function ProfilePage() {
  const router = useRouter();

  const [driver,        setDriver]        = useState<any>(null);
  const [authUser,      setAuthUser]      = useState<any>(null);
  const [vehicle,       setVehicle]       = useState<any>(null);
  const [changeReqs,    setChangeReqs]    = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [earnings,      setEarnings]      = useState<any[]>([]);
  const [payouts,       setPayouts]       = useState<any[]>([]);
  const [bankDetails,   setBankDetails]   = useState<any>(null);
  const [chatMsgs,      setChatMsgs]      = useState<any[]>([]);
  const [chatId,        setChatId]        = useState<string | null>(null);
  const [loading,       setLoading]       = useState(true);
  const [activeTab,     setActiveTab]     = useState<"profile"|"documents"|"earnings"|"payout"|"chat"|"activity">("profile");

  // Edit states
  const [editContact,   setEditContact]   = useState(false);
  const [editEmergency, setEditEmergency] = useState(false);
  const [editLicense,   setEditLicense]   = useState(false);
  const [editBank,      setEditBank]      = useState(false);
  const [savingCard,    setSavingCard]    = useState("");

  // Form fields
  const [phone,          setPhone]          = useState("");
  const [cityText,       setCityText]       = useState("");
  const [emergencyName,  setEmergencyName]  = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [licenseExpiry,  setLicenseExpiry]  = useState("");
  const [licenseFile,    setLicenseFile]    = useState<File | null>(null);
  const licFileRef = useRef<HTMLInputElement>(null);

  // Bank form
  const [bankName,      setBankName]      = useState("");
  const [accountName,   setAccountName]   = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [iban,          setIban]          = useState("");
  const [swiftCode,     setSwiftCode]     = useState("");

  // Doc files
  const [faceFile,    setFaceFile]    = useState<File | null>(null);
  const [licFront,    setLicFront]    = useState<File | null>(null);
  const [licBack,     setLicBack]     = useState<File | null>(null);
  const [selfieFile,  setSelfieFile]  = useState<File | null>(null);
  const [bgFile,      setBgFile]      = useState<File | null>(null);
  const [savingDoc,   setSavingDoc]   = useState("");

  // Chat
  const [chatMsg,     setChatMsg]     = useState("");
  const [sendingMsg,  setSendingMsg]  = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // ── Load Data ────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) { router.replace("/driver/login"); return; }
    setAuthUser(user);

    const { data: drv } = await (supabase as any)
      .from("drivers").select("*").eq("user_id", user.id).maybeSingle();
    if (!drv) { setLoading(false); return; }
    setDriver(drv);

    // Pre-fill
    setPhone(drv.phone || "");
    setCityText(drv.city_text || "");
    setEmergencyName(drv.emergency_contact_name || "");
    setEmergencyPhone(drv.emergency_contact_phone || "");
    setLicenseExpiry(drv.license_expiry || "");

    const [
      { data: veh },
      { data: cr },
      { data: notifs },
      { data: earn },
      { data: pays },
      { data: bank },
      { data: chats },
    ] = await Promise.all([
      (supabase as any).from("driver_vehicles").select("*").eq("driver_id", drv.id).eq("is_active", true).maybeSingle(),
      (supabase as any).from("driver_change_requests").select("*").eq("driver_id", drv.id).order("requested_at", { ascending: false }),
      (supabase as any).from("driver_notifications").select("*").eq("driver_id", drv.id).order("created_at", { ascending: false }).limit(20),
      (supabase as any).from("driver_earnings").select("*").eq("driver_id", drv.id).order("earned_at", { ascending: false }).limit(50),
      (supabase as any).from("driver_payouts").select("*").eq("driver_id", drv.id).order("created_at", { ascending: false }),
      (supabase as any).from("driver_bank_details").select("*").eq("driver_id", drv.id).maybeSingle(),
      (supabase as any).from("support_chats").select("*").eq("driver_id", drv.id).maybeSingle(),
    ]);

    setVehicle(veh);
    setChangeReqs(cr || []);
    setNotifications(notifs || []);
    setEarnings(earn || []);
    setPayouts(pays || []);
    setBankDetails(bank);
    if (bank) {
      setBankName(bank.bank_name || "");
      setAccountName(bank.account_name || "");
      setAccountNumber(bank.account_number || "");
      setRoutingNumber(bank.routing_number || "");
      setIban(bank.iban || "");
      setSwiftCode(bank.swift_code || "");
    }

    if (chats) {
      setChatId(chats.id);
      const { data: msgs } = await (supabase as any)
        .from("support_messages").select("*").eq("chat_id", chats.id).order("created_at", { ascending: true });
      setChatMsgs(msgs || []);
    }

    setLoading(false);
  }, [router]);

  useEffect(() => { loadData(); }, [loadData]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMsgs]);

  // ── Upload helper ────────────────────────────────────────────
  const uploadFile = async (supabase: any, file: File, path: string) => {
    const { error } = await supabase.storage.from("driver-documents").upload(path, file, { upsert: true });
    if (error) throw error;
    return supabase.storage.from("driver-documents").getPublicUrl(path).data.publicUrl;
  };

  // ── Submit doc ───────────────────────────────────────────────
  const submitDoc = async (fieldName: string, file: File, urlField: string) => {
    setSavingDoc(fieldName);
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user; if (!user) throw new Error("Not logged in");
      const url = await uploadFile(supabase, file, `${user.id}/${fieldName}-${Date.now()}.${file.name.split(".").pop()}`);
      const updatePayload: any = { [urlField]: url }
// Face photo driver_photo_url mein bhi sync ho
if (fieldName === 'face_photo') updatePayload.driver_photo_url = url
await (supabase as any).from("drivers").update(updatePayload).eq("user_id", user.id);

      const existing = changeReqs.find((r: any) => r.field_name === fieldName && r.status === "pending");
      if (existing) {
        await (supabase as any).from("driver_change_requests").update({ new_value: url, file_url: url }).eq("id", existing.id);
      } else {
        await (supabase as any).from("driver_change_requests").insert({
          driver_id: driver.id, field_name: fieldName,
          old_value: driver[urlField] || null, new_value: url,
          file_url: url, status: "pending",
        });
      }
      toast.success("Submitted for review!");
      // Reset file state
      const resets: Record<string, () => void> = {
        face_photo:          () => setFaceFile(null),
        license_front:       () => setLicFront(null),
        license_back:        () => setLicBack(null),
        selfie_with_license: () => setSelfieFile(null),
        background_check:    () => setBgFile(null),
      };
      resets[fieldName]?.();
      await loadData();
    } catch (err: any) { toast.error(err.message); }
    finally { setSavingDoc(""); }
  };

  // ── Save contact ─────────────────────────────────────────────
  const saveContact = async () => {
    setSavingCard("contact");
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user; if (!user) throw new Error("Not logged in");
      const digits = phone.replace(/\D/g, "");
      await (supabase as any).from("drivers").update({
        phone: digits || null, city_text: cityText || null,
      }).eq("user_id", user.id);
      toast.success("Contact updated"); setEditContact(false); await loadData();
    } catch (err: any) { toast.error(err.message); }
    finally { setSavingCard(""); }
  };

  // ── Save emergency ───────────────────────────────────────────
  const saveEmergency = async () => {
    setSavingCard("emergency");
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user; if (!user) throw new Error("Not logged in");
      await (supabase as any).from("drivers").update({
        emergency_contact_name: emergencyName.trim() || null,
        emergency_contact_phone: emergencyPhone.trim() || null,
      }).eq("user_id", user.id);
      toast.success("Emergency contact updated"); setEditEmergency(false); await loadData();
    } catch (err: any) { toast.error(err.message); }
    finally { setSavingCard(""); }
  };

  // ── Save license expiry ──────────────────────────────────────
  const saveLicense = async () => {
    if (!licenseExpiry || !licenseFile) { toast.error("Date and photo required"); return; }
    setSavingCard("license");
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user; if (!user) throw new Error("Not logged in");
      const url = await uploadFile(supabase, licenseFile, `${user.id}/license-renewal.${licenseFile.name.split(".").pop()}`);
      await (supabase as any).from("driver_change_requests").insert({
        driver_id: driver.id, field_name: "license_expiry",
        old_value: driver.license_expiry, new_value: licenseExpiry,
        file_url: url, status: "pending",
      });
      toast.success("Submitted for review"); setEditLicense(false); setLicenseFile(null); await loadData();
    } catch (err: any) { toast.error(err.message); }
    finally { setSavingCard(""); }
  };

  // ── Save bank details ────────────────────────────────────────
  const saveBank = async () => {
    if (!bankName || !accountName || !accountNumber) { toast.error("Fill required fields"); return; }
    setSavingCard("bank");
    try {
      const supabase = createClient();
      const payload = {
        driver_id: driver.id, bank_name: bankName, account_name: accountName,
        account_number: accountNumber, routing_number: routingNumber || null,
        iban: iban || null, swift_code: swiftCode || null,
      };
      if (bankDetails) {
        await (supabase as any).from("driver_bank_details").update(payload).eq("id", bankDetails.id);
      } else {
        await (supabase as any).from("driver_bank_details").insert(payload);
      }
      toast.success("Bank details saved"); setEditBank(false); await loadData();
    } catch (err: any) { toast.error(err.message); }
    finally { setSavingCard(""); }
  };

  // ── Send chat message ────────────────────────────────────────
  const sendMessage = async () => {
    if (!chatMsg.trim()) return;
    setSendingMsg(true);
    try {
      const supabase = createClient();
      let cid = chatId;
      if (!cid) {
        const { data: newChat } = await (supabase as any).from("support_chats").insert({
          driver_id: driver.id, subject: "Driver Support",
          status: "open", chat_type: "driver",
        }).select().single();
        cid = (newChat as any).id;
        setChatId(cid);
      }
      const { data: msg } = await (supabase as any).from("support_messages").insert({
        chat_id: cid, sender_id: authUser.id,
        sender_name: driver.full_name || "Driver",
        sender_type: "driver", content: chatMsg.trim(),
      }).select().single();
      setChatMsgs(prev => [...prev, msg]);
      setChatMsg("");
    } catch (err: any) { toast.error(err.message); }
    finally { setSendingMsg(false); }
  };

  // ── Helpers ───────────────────────────────────────────────────
  const getPendingReq = (f: string) => changeReqs.find(r => r.field_name === f && r.status === "pending");
  const getRejectedReq = (f: string) => {
    const list = changeReqs.filter(r => r.field_name === f && r.status === "rejected")
      .sort((a, b) => new Date(b.requested_at).getTime() - new Date(a.requested_at).getTime());
    if (!list.length) return null;
    const latest = list[0];
    const hasNewer = changeReqs.find(r =>
      r.field_name === f && r.id !== latest.id &&
      (r.status === "pending" || r.status === "approved") &&
      new Date(r.requested_at) > new Date(latest.requested_at)
    );
    return hasNewer ? null : latest;
  };
  const docStatus = (fieldName: string) => {
    const pending  = getPendingReq(fieldName);
    const rejected = getRejectedReq(fieldName);
    if (pending)  return { status: "pending",  note: null };
    if (rejected) return { status: "rejected", note: rejected.admin_note };
    return { status: "uploaded", note: null };
  };
  const isApprovedField = (fieldName: string) =>
    changeReqs.some(r => r.field_name === fieldName && r.status === "approved");

  // ── Loading ───────────────────────────────────────────────────
  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-[#0b66d1]" />
    </div>
  );

  if (!driver) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <p className="text-sm text-gray-500">No driver profile found.</p>
    </div>
  );

  // ── Computed values ───────────────────────────────────────────
  const driverName = driver?.full_name && driver.full_name !== "PENDING"
    ? driver.full_name : authUser?.email?.split("@")[0] || "Driver";

  const countryCode  = driver?.country_code || "US";
  const phoneDisplay = driver?.phone
    ? `+${countryCode === "US" ? "1" : ""} ${formatPhone(driver.phone, countryCode)}`.trim()
    : null;

  const daysLeft    = daysUntil(driver?.license_expiry);
  const licExpiring = daysLeft !== null && daysLeft < 90;
  const bgApproved  = driver?.background_check_doc_status === "approved";
  const bgLocked    = bgApproved && !changeReqs.find(r => r.field_name === "background_check" && r.status === "pending" && r.new_value === "admin_requested");

  const statusMap: Record<string, any> = {
    approved:  { label: "Approved",      dot: "bg-emerald-400", badge: "bg-emerald-50 text-emerald-700" },
    rejected:  { label: "Rejected",      dot: "bg-red-400",     badge: "bg-red-50 text-red-700"         },
    suspended: { label: "Suspended",     dot: "bg-gray-400",    badge: "bg-gray-100 text-gray-600"      },
    pending:   { label: "Under Review",  dot: "bg-amber-400",   badge: "bg-amber-50 text-amber-700"     },
  };
  const stt = statusMap[driver?.status] || statusMap.pending;

  // Missing docs
  const missingDocs = [
    { key: "face_photo",          url: driver?.face_photo_url,           label: "Face Photo"           },
    { key: "license_front",       url: driver?.license_front_url,        label: "License Front"        },
    { key: "license_back",        url: driver?.license_back_url,         label: "License Back"         },
    { key: "selfie_with_license", url: driver?.selfie_with_license_url,  label: "Selfie with License"  },
    { key: "background_check",    url: driver?.background_check_doc_url, label: "Background Check"     },
  ].filter(d => !d.url);

  // Earnings stats
  const totalEarned  = earnings.filter(e => e.status === "paid").reduce((s, e) => s + (e.amount || 0), 0);
  const pendingEarn  = earnings.filter(e => e.status === "pending").reduce((s, e) => s + (e.amount || 0), 0);
  const thisMonth    = earnings.filter(e => {
    const d = new Date(e.earned_at);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).reduce((s, e) => s + (e.amount || 0), 0);

  // Driver score
  const score = Math.min(100, Math.round(
    (driver?.rating ? (driver.rating / 5) * 40 : 0) +
    (driver?.total_rides ? Math.min(driver.total_rides / 100, 1) * 30 : 0) +
    (!missingDocs.length ? 30 : (5 - missingDocs.length) * 6)
  ));

  // Profile completeness
  const checks = [
    !!driver?.phone, !!driver?.face_photo_url, !!driver?.license_front_url,
    !!driver?.license_back_url, !!driver?.selfie_with_license_url,
    !!driver?.background_check_doc_url, !!driver?.emergency_contact_name,
  ];
  const completeness = Math.round((checks.filter(Boolean).length / checks.length) * 100);

  // Expiry alerts
  const expiryAlerts = [
    { label: "Driver License",    date: driver?.license_expiry,       days: daysUntil(driver?.license_expiry) },
    { label: "Vehicle Insurance", date: driver?.insurance_expiry_date, days: daysUntil(driver?.insurance_expiry_date) },
  ].filter(a => a.days !== null && a.days < 30);

   const TABS = [
    { key: "profile",   label: "Profile",   icon: User       },
    { key: "documents", label: "Documents", icon: FileText    },
    { key: "earnings",  label: "Earnings",  icon: DollarSign  },
    { key: "payout",    label: "Payout",    icon: Wallet      },
    { key: "activity",  label: "Activity",  icon: Activity    },
  ] as const;

  return (
    <div className="space-y-4 pb-8">

      {/* ── Expiry Alerts ── */}
      {expiryAlerts.map(a => (
        <div key={a.label} className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${(a.days ?? 0) < 7 ? "bg-red-50" : "bg-amber-50"}`}>
          <Bell className={`h-4 w-4 shrink-0 ${(a.days ?? 0) < 7 ? "text-red-500" : "text-amber-500"}`} />
          <p className={`text-sm font-medium ${(a.days ?? 0) < 7 ? "text-red-700" : "text-amber-700"}`}>
            <span className="font-bold">{a.label}</span> expires in {a.days} days — {fmtDate(a.date)}
          </p>
        </div>
      ))}

      {/* ── Missing Docs Banner ── */}
      {missingDocs.length > 0 && (
        <div className="flex items-start gap-3 rounded-2xl bg-red-50 px-4 py-3.5">
          <AlertTriangle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-800">{missingDocs.length} document{missingDocs.length > 1 ? "s" : ""} missing</p>
            <p className="text-xs text-red-600 mt-0.5">{missingDocs.map(d => d.label).join(" · ")}</p>
          </div>
          <button onClick={() => setActiveTab("documents")} className="shrink-0 text-xs font-semibold text-red-700 flex items-center gap-1 hover:underline">
            Upload <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* ── Profile Header ── */}
      <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
        {/* Blue top bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#0b66d1] via-blue-400 to-[#0952a8]" />

        <div className="p-5">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="relative shrink-0 cursor-pointer" onClick={() => driver?.face_photo_url && window.open(driver.face_photo_url, "_blank")}>
              {driver?.face_photo_url ? (
                <Image src={driver.face_photo_url} alt={driverName} width={68} height={68}
                  className="h-[68px] w-[68px] rounded-2xl object-cover ring-2 ring-white shadow-md" />
              ) : (
                <div className="flex h-[68px] w-[68px] items-center justify-center rounded-2xl text-xl font-bold text-white shadow-md bg-gradient-to-br from-[#0b66d1] to-[#0952a8]">
                  {ini(driverName)}
                </div>
              )}
              <div className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white ${driver?.is_available ? "bg-emerald-400" : "bg-gray-300"}`} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-base font-bold text-gray-900 leading-tight">{driverName}</h2>
                  <p className="text-xs text-gray-400 mt-0.5">{driver?.email || authUser?.email}</p>
                </div>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${stt.badge}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${stt.dot}`} />{stt.label}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                {phoneDisplay && <span className="flex items-center gap-1 text-xs text-gray-500"><Phone className="h-3 w-3" />{phoneDisplay}</span>}
                {driver?.city_text && <span className="flex items-center gap-1 text-xs text-gray-500"><MapPin className="h-3 w-3" />{driver.city_text}</span>}
                {driver?.rating && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-amber-600">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />{Number(driver.rating).toFixed(1)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-4 grid grid-cols-5 gap-2">
            {[
              { label: "Rides",    value: driver?.total_rides ?? 0 },
              { label: "Score",    value: `${score}` },
              { label: "Rating",   value: driver?.rating ? `${Number(driver.rating).toFixed(1)}★` : "—" },
              { label: "Earned",   value: `$${totalEarned.toFixed(0)}` },
              { label: "Pending",  value: `$${pendingEarn.toFixed(0)}` },
            ].map(s => (
              <div key={s.label} className="rounded-xl bg-gray-50 px-2 py-2 text-center">
                <p className="text-sm font-bold text-gray-900">{s.value}</p>
                <p className="text-[10px] text-gray-400">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Completeness */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-gray-500 font-medium">Profile {completeness}% complete</p>
              {completeness < 100 && <p className="text-xs text-[#0b66d1] font-semibold">{7 - checks.filter(Boolean).length} items left</p>}
            </div>
            <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${completeness}%`, background: completeness === 100 ? "#10b981" : "#0b66d1" }} />
            </div>
          </div>
        </div>

        {/* Tabs — scrollable on mobile */}
        <div className="flex overflow-x-auto border-t border-gray-100 scrollbar-hide">
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex shrink-0 items-center gap-1.5 px-4 py-3 text-xs font-semibold transition border-b-2 whitespace-nowrap
                ${activeTab === tab.key ? "border-[#0b66d1] text-[#0b66d1]" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
              {tab.key === "documents" && missingDocs.length > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                  {missingDocs.length}
                </span>
              )}
              {tab.key === "chat" && chatMsgs.filter(m => m.sender_type !== "driver").length > 0 && (
                <span className="h-2 w-2 rounded-full bg-[#0b66d1]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ══ PROFILE TAB ══ */}
      {activeTab === "profile" && (
        <div className="space-y-4">

          {/* Personal — locked */}
          <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-50">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <p className="text-sm font-semibold text-gray-900">Personal Information</p>
              </div>
              <span className="flex items-center gap-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                <Lock className="h-3 w-3" /> Locked
              </span>
            </div>
            <div className="divide-y divide-gray-50">
              {[
                { label: "Full Name",     value: driverName },
                { label: "Date of Birth", value: fmtDate(driver?.dob) },
                { label: "License No.",   value: driver?.license_number !== "PENDING" ? driver?.license_number : null },
                { label: "License State", value: driver?.license_state },
              ].map(f => (
                <div key={f.label} className="flex items-center justify-between px-5 py-3">
                  <p className="text-xs text-gray-400 font-medium">{f.label}</p>
                  <p className="text-sm font-semibold text-gray-900">{f.value || "—"}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-50">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <p className="text-sm font-semibold text-gray-900">Contact</p>
              </div>
              {!editContact
                ? <button onClick={() => setEditContact(true)} className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition">
                    <Pencil className="h-3 w-3" /> Edit
                  </button>
                : <div className="flex gap-2">
                    <button onClick={() => setEditContact(false)} className="rounded-xl border border-gray-200 px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-50">Cancel</button>
                    <button onClick={saveContact} disabled={savingCard === "contact"} className="flex items-center gap-1 rounded-xl bg-[#0b66d1] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0952a8] disabled:opacity-60">
                      {savingCard === "contact" ? <Loader2 className="h-3 w-3 animate-spin" /> : <><Check className="h-3 w-3" /> Save</>}
                    </button>
                  </div>
              }
            </div>
            {!editContact ? (
              <div className="divide-y divide-gray-50">
                <div className="flex items-center justify-between px-5 py-3">
                  <p className="text-xs text-gray-400 font-medium">Phone</p>
                  <p className="text-sm font-semibold text-gray-900">{phoneDisplay || "—"}</p>
                </div>
                <div className="flex items-center justify-between px-5 py-3">
                  <p className="text-xs text-gray-400 font-medium">City</p>
                  <p className="text-sm font-semibold text-gray-900">{driver?.city_text || "—"}</p>
                </div>
                <div className="flex items-center justify-between px-5 py-3">
                  <p className="text-xs text-gray-400 font-medium">Country</p>
                  <p className="text-sm font-semibold text-gray-900">{driver?.country_code || "—"}</p>
                </div>
              </div>
            ) : (
              <div className="p-5 space-y-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">
                    Phone {PHONE_RULES[countryCode] && <span className="text-gray-400">— {PHONE_RULES[countryCode].format}</span>}
                  </label>
                  <input value={phone} onChange={e => setPhone(formatPhone(e.target.value, countryCode))}
                    placeholder={PHONE_RULES[countryCode]?.format || "Phone number"}
                    className={inp} />
                  {PHONE_RULES[countryCode] && (
                    <p className="mt-1 text-[10px] text-gray-400">{PHONE_RULES[countryCode].length} digits required</p>
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">City</label>
                  <input value={cityText} onChange={e => setCityText(e.target.value)}
                    placeholder="Your city" className={inp} />
                </div>
              </div>
            )}
          </div>

          {/* Emergency Contact */}
          <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-50">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-gray-400" />
                <p className="text-sm font-semibold text-gray-900">Emergency Contact</p>
              </div>
              {!editEmergency
                ? <button onClick={() => setEditEmergency(true)} className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition">
                    <Pencil className="h-3 w-3" /> Edit
                  </button>
                : <div className="flex gap-2">
                    <button onClick={() => setEditEmergency(false)} className="rounded-xl border border-gray-200 px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-50">Cancel</button>
                    <button onClick={saveEmergency} disabled={savingCard === "emergency"} className="flex items-center gap-1 rounded-xl bg-[#0b66d1] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0952a8] disabled:opacity-60">
                      {savingCard === "emergency" ? <Loader2 className="h-3 w-3 animate-spin" /> : <><Check className="h-3 w-3" /> Save</>}
                    </button>
                  </div>
              }
            </div>
            {!editEmergency ? (
              <div className="divide-y divide-gray-50">
                <div className="flex items-center justify-between px-5 py-3">
                  <p className="text-xs text-gray-400 font-medium">Name</p>
                  <p className="text-sm font-semibold text-gray-900">{driver?.emergency_contact_name || "—"}</p>
                </div>
                <div className="flex items-center justify-between px-5 py-3">
                  <p className="text-xs text-gray-400 font-medium">Phone</p>
                  <p className="text-sm font-semibold text-gray-900">{driver?.emergency_contact_phone || "—"}</p>
                </div>
              </div>
            ) : (
              <div className="p-5 space-y-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">Name</label>
                  <input value={emergencyName} onChange={e => setEmergencyName(e.target.value)} placeholder="Contact name" className={inp} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">Phone</label>
                  <input value={emergencyPhone} onChange={e => setEmergencyPhone(e.target.value)} placeholder="+1 555 000 0001" className={inp} />
                </div>
              </div>
            )}
          </div>

          {/* License */}
          <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-50">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-gray-400" />
                <p className="text-sm font-semibold text-gray-900">Driver License</p>
              </div>
              {!editLicense && (
                <button onClick={() => setEditLicense(true)} className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition">
                  <Pencil className="h-3 w-3" /> Update Expiry
                </button>
              )}
            </div>
            <div className="divide-y divide-gray-50">
              <div className="flex items-center justify-between px-5 py-3">
                <p className="text-xs text-gray-400 font-medium">Expiry Date</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-gray-900">{fmtDate(driver?.license_expiry)}</p>
                  <ExpiryBadge date={driver?.license_expiry} />
                  {getPendingReq("license_expiry") && <StatusPill status="pending" />}
                </div>
              </div>
            </div>
            {editLicense && (
              <div className="p-5 space-y-3 border-t border-gray-50">
                <div className="rounded-xl bg-amber-50 px-3 py-2.5 text-xs text-amber-700">
                  Requires admin approval. Upload renewed license photo.
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">New Expiry Date</label>
                  <input type="date" value={licenseExpiry} onChange={e => setLicenseExpiry(e.target.value)} className={inp} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">License Photo</label>
                  <input ref={licFileRef} type="file" accept=".jpg,.jpeg,.png,.webp,.pdf" className="hidden" onChange={e => setLicenseFile(e.target.files?.[0] ?? null)} />
                  <div onClick={() => licFileRef.current?.click()} className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 transition ${licenseFile ? "border-[#0b66d1] bg-blue-50" : "border-dashed border-gray-200 hover:border-gray-300"}`}>
                    {licenseFile ? <CheckCircle className="h-4 w-4 text-[#0b66d1]" /> : <Upload className="h-4 w-4 text-gray-400" />}
                    <span className="text-xs text-gray-500 truncate">{licenseFile ? licenseFile.name : "Browse file"}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditLicense(false); setLicenseFile(null); }} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-xs font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
                  <button onClick={saveLicense} disabled={savingCard === "license"} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#0b66d1] py-2.5 text-xs font-semibold text-white hover:bg-[#0952a8] disabled:opacity-60">
                    {savingCard === "license" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Submit for Approval"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Driver Score */}
          <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-50">
              <Award className="h-4 w-4 text-amber-500" />
              <p className="text-sm font-semibold text-gray-900">Driver Score</p>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative h-16 w-16 shrink-0">
                  <svg viewBox="0 0 36 36" className="h-16 w-16 -rotate-90">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f3f4f6" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#0b66d1" strokeWidth="3"
                      strokeDasharray={`${score} ${100 - score}`} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-900">{score}</span>
                  </div>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{score >= 80 ? "Excellent" : score >= 60 ? "Good" : score >= 40 ? "Fair" : "Needs Work"}</p>
                  <p className="text-xs text-gray-400">Based on rating, rides & docs</p>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { label: "Rating Score",   value: driver?.rating ? `${((driver.rating/5)*40).toFixed(0)}/40` : "0/40",      pct: driver?.rating ? (driver.rating/5)*100 : 0 },
                  { label: "Ride Milestone", value: `${Math.min(driver?.total_rides||0, 100)}/100 rides`,                      pct: Math.min((driver?.total_rides||0)/100, 1)*100 },
                  { label: "Profile Docs",   value: `${checks.filter(Boolean).length}/${checks.length} complete`,               pct: completeness },
                ].map(item => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs text-gray-500">{item.label}</p>
                      <p className="text-xs font-semibold text-gray-700">{item.value}</p>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-gray-100">
                      <div className="h-1.5 rounded-full bg-[#0b66d1] transition-all" style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ DOCUMENTS TAB ══ */}
      {activeTab === "documents" && (
        <div className="space-y-4">
          {missingDocs.length > 0 && (
            <div className="rounded-2xl bg-red-50 px-5 py-4">
              <p className="text-sm font-semibold text-red-800 mb-1">Required documents missing</p>
              <p className="text-xs text-red-600">Upload all documents to activate your account.</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {missingDocs.map(d => (
                  <span key={d.key} className="rounded-full bg-red-100 px-2.5 py-1 text-[11px] font-semibold text-red-700">{d.label}</span>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-50">
              <p className="text-sm font-semibold text-gray-900">Verification Photos</p>
              <p className="text-xs text-gray-400 mt-0.5">Tap to view full size. All photos reviewed by admin.</p>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {[
                { key: "face_photo",          urlField: "face_photo_url",           label: "Face Photo",         note: "Clear front-facing photo",      file: faceFile,    setFile: setFaceFile,    locked: isApprovedField("face_photo") && !bgLocked },
                { key: "license_front",       urlField: "license_front_url",        label: "License Front",      note: "Front side clearly visible",    file: licFront,    setFile: setLicFront,    locked: false },
                { key: "license_back",        urlField: "license_back_url",         label: "License Back",       note: "Back side clearly visible",     file: licBack,     setFile: setLicBack,     locked: false },
                { key: "selfie_with_license", urlField: "selfie_with_license_url",  label: "Selfie + License",   note: "Holding your license",          file: selfieFile,  setFile: setSelfieFile,  locked: false },
                { key: "background_check",    urlField: "background_check_doc_url", label: "Background Check",   note: "Official document",             file: bgFile,      setFile: setBgFile,      locked: bgLocked },
              ].map(doc => {
                const ds = docStatus(doc.key);
                return (
                  <DocCard key={doc.key}
                    label={doc.label} note={doc.note}
                    currentUrl={driver[doc.urlField]}
                    file={doc.file} onSet={doc.setFile}
                    onSubmit={() => submitDoc(doc.key, doc.file!, doc.urlField)}
                    saving={savingDoc === doc.key}
                    status={driver[doc.urlField] ? ds.status : "not_submitted"}
                    adminNote={ds.note}
                    locked={doc.locked}
                    required={!driver[doc.urlField]}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ══ EARNINGS TAB ══ */}
      {activeTab === "earnings" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="This Month"   value={`$${thisMonth.toFixed(2)}`}     sub="Current period"     icon={TrendingUp}     color="bg-[#0b66d1]"    />
            <StatCard label="Total Earned" value={`$${totalEarned.toFixed(2)}`}   sub="All time paid"      icon={DollarSign}     color="bg-emerald-500"  />
            <StatCard label="Pending"      value={`$${pendingEarn.toFixed(2)}`}   sub="Awaiting payout"    icon={Clock}          color="bg-amber-500"    />
            <StatCard label="Total Rides"  value={driver?.total_rides ?? 0}       sub="Completed"          icon={Car}            color="bg-purple-500"   />
          </div>

          <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-50">
              <p className="text-sm font-semibold text-gray-900">Recent Earnings</p>
            </div>
            {earnings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <DollarSign className="h-8 w-8 text-gray-200 mb-2" />
                <p className="text-sm text-gray-400">No earnings yet</p>
                <p className="text-xs text-gray-300 mt-0.5">Complete rides to see earnings here</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {earnings.slice(0, 20).map(e => (
                  <div key={e.id} className="flex items-center justify-between px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${e.type === "bonus" ? "bg-amber-50" : e.type === "tip" ? "bg-emerald-50" : "bg-blue-50"}`}>
                        {e.type === "bonus" ? <Zap className="h-3.5 w-3.5 text-amber-500" />
                          : e.type === "tip" ? <Star className="h-3.5 w-3.5 text-emerald-500" />
                          : <Car className="h-3.5 w-3.5 text-[#0b66d1]" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 capitalize">{e.description || e.type}</p>
                        <p className="text-xs text-gray-400">{fmtShort(e.earned_at)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-gray-900">${Number(e.amount).toFixed(2)}</p>
                      <StatusPill status={e.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══ PAYOUT TAB ══ */}
      {activeTab === "payout" && (
        <div className="space-y-4">
          {/* Bank Details */}
          <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-50">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-gray-400" />
                <p className="text-sm font-semibold text-gray-900">Bank Details</p>
              </div>
              {!editBank
                ? <button onClick={() => setEditBank(true)} className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition">
                    <Pencil className="h-3 w-3" /> {bankDetails ? "Edit" : "Add"}
                  </button>
                : <div className="flex gap-2">
                    <button onClick={() => setEditBank(false)} className="rounded-xl border border-gray-200 px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-50">Cancel</button>
                    <button onClick={saveBank} disabled={savingCard === "bank"} className="flex items-center gap-1 rounded-xl bg-[#0b66d1] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0952a8] disabled:opacity-60">
                      {savingCard === "bank" ? <Loader2 className="h-3 w-3 animate-spin" /> : <><Check className="h-3 w-3" /> Save</>}
                    </button>
                  </div>
              }
            </div>
            {!editBank ? (
              bankDetails ? (
                <div className="divide-y divide-gray-50">
                  {[
                    { label: "Bank Name",      value: bankDetails.bank_name      },
                    { label: "Account Name",   value: bankDetails.account_name   },
                    { label: "Account No.",    value: `****${bankDetails.account_number?.slice(-4) || ""}` },
                    { label: "Routing No.",    value: bankDetails.routing_number  },
                    { label: "IBAN",           value: bankDetails.iban            },
                    { label: "SWIFT / BIC",    value: bankDetails.swift_code      },
                  ].filter(f => f.value).map(f => (
                    <div key={f.label} className="flex items-center justify-between px-5 py-3">
                      <p className="text-xs text-gray-400 font-medium">{f.label}</p>
                      <p className="text-sm font-semibold text-gray-900">{f.value}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center px-5">
                  <Building className="h-8 w-8 text-gray-200 mb-2" />
                  <p className="text-sm text-gray-500 font-medium">No bank details added</p>
                  <p className="text-xs text-gray-400 mt-0.5">Add your bank details to receive payouts</p>
                </div>
              )
            ) : (
              <div className="p-5 space-y-3">
                {[
                  { label: "Bank Name *",      val: bankName,      set: setBankName,      ph: "e.g. Chase Bank" },
                  { label: "Account Name *",   val: accountName,   set: setAccountName,   ph: "Name on account" },
                  { label: "Account Number *", val: accountNumber, set: setAccountNumber, ph: "Account number" },
                  { label: "Routing Number",   val: routingNumber, set: setRoutingNumber, ph: "9-digit routing no." },
                  { label: "IBAN",             val: iban,          set: setIban,          ph: "International accounts" },
                  { label: "SWIFT / BIC",      val: swiftCode,     set: setSwiftCode,     ph: "For international transfers" },
                ].map(f => (
                  <div key={f.label}>
                    <label className="mb-1.5 block text-xs font-medium text-gray-600">{f.label}</label>
                    <input value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph} className={inp} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payout History */}
          <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-50">
              <p className="text-sm font-semibold text-gray-900">Payout History</p>
            </div>
            {payouts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Wallet className="h-8 w-8 text-gray-200 mb-2" />
                <p className="text-sm text-gray-400">No payouts yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {payouts.map(p => (
                  <div key={p.id} className="flex items-center justify-between px-5 py-3.5">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">${Number(p.amount).toFixed(2)}</p>
                      <p className="text-xs text-gray-400">
                        {p.period_start ? `${fmtShort(p.period_start)} — ${fmtShort(p.period_end)}` : fmtShort(p.created_at)}
                      </p>
                    </div>
                    <StatusPill status={p.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══ SUPPORT CHAT TAB ══ */}
      {activeTab === "chat" && (
        <div className="rounded-2xl bg-white shadow-sm overflow-hidden flex flex-col" style={{ height: "60vh" }}>
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100">
            <MessageCircle className="h-4 w-4 text-[#0b66d1]" />
            <p className="text-sm font-semibold text-gray-900">Support Chat</p>
            <span className="ml-auto text-xs text-gray-400">BlackDrivo Support Team</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMsgs.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <MessageCircle className="h-8 w-8 text-gray-200 mb-2" />
                <p className="text-sm text-gray-400 font-medium">Start a conversation</p>
                <p className="text-xs text-gray-300 mt-0.5">Our support team typically responds within a few hours</p>
              </div>
            )}
            {chatMsgs.map(msg => {
              const isMe = msg.sender_type === "driver";
              return (
                <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${isMe ? "bg-[#0b66d1] text-white rounded-br-md" : "bg-gray-100 text-gray-900 rounded-bl-md"}`}>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    <p className={`mt-1 text-[10px] ${isMe ? "text-white/60" : "text-gray-400"}`}>{fmtShort(msg.created_at)}</p>
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-100 p-3">
            <div className="flex items-center gap-2">
              <input
                value={chatMsg}
                onChange={e => setChatMsg(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Type a message..."
                className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-[#0b66d1] focus:bg-white transition"
              />
              <button onClick={sendMessage} disabled={sendingMsg || !chatMsg.trim()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0b66d1] text-white hover:bg-[#0952a8] disabled:opacity-50 transition">
                {sendingMsg ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ ACTIVITY TAB ══ */}
      {activeTab === "activity" && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-50">
              <p className="text-sm font-semibold text-gray-900">Activity Timeline</p>
              <p className="text-xs text-gray-400 mt-0.5">All admin actions and document updates</p>
            </div>
            {notifications.length === 0 && changeReqs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Activity className="h-8 w-8 text-gray-200 mb-2" />
                <p className="text-sm text-gray-400">No activity yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {/* Notifications */}
                {notifications.map(n => (
                  <div key={n.id} className="flex items-start gap-3 px-5 py-4">
                    <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl ${n.type === "photo_rejected" ? "bg-red-50" : "bg-blue-50"}`}>
                      {n.type === "photo_rejected" ? <X className="h-3.5 w-3.5 text-red-500" /> : <Bell className="h-3.5 w-3.5 text-[#0b66d1]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{n.title || "Notification"}</p>
                      {n.message && <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>}
                      <p className="text-[10px] text-gray-300 mt-1">{fmtShort(n.created_at)}</p>
                    </div>
                    {!n.is_read && <div className="h-2 w-2 shrink-0 rounded-full bg-[#0b66d1] mt-1.5" />}
                  </div>
                ))}
                {/* Change requests */}
                {changeReqs.map(r => (
                  <div key={r.id} className="flex items-start gap-3 px-5 py-4">
                    <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl ${r.status === "approved" ? "bg-emerald-50" : r.status === "rejected" ? "bg-red-50" : "bg-amber-50"}`}>
                      {r.status === "approved" ? <Check className="h-3.5 w-3.5 text-emerald-500" />
                        : r.status === "rejected" ? <X className="h-3.5 w-3.5 text-red-500" />
                        : <Clock className="h-3.5 w-3.5 text-amber-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 capitalize">{r.field_name.replace(/_/g, " ")}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <StatusPill status={r.status} />
                        {r.admin_note && <p className="text-xs text-gray-400 truncate">"{r.admin_note}"</p>}
                      </div>
                      <p className="text-[10px] text-gray-300 mt-1">{fmtShort(r.requested_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}