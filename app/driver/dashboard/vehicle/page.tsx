"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, X, ChevronDown, Search, Upload, Loader2, Clock,
  Send, ChevronRight, Check, Info, AlertCircle, CheckCircle,
  Eye, Calendar, History, FileText, RefreshCw,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { VEHICLE_MAKES, VEHICLE_COLORS, getModelsForMake, getVariantsForModel, getYearOptions } from "@/lib/data/vehicles";
import { DRIVER_THEME, fmtShort, fmtDate, daysUntil } from "@/lib/driver/theme";

const inputClass = "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20";

// ── Status badge ──────────────────────────────────────────────
const STATUS_CFG: Record<string, { label: string; bg: string; text: string; border: string; dot: string }> = {
  approved: { label: "Approved",  bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-400" },
  pending:  { label: "In Review", bg: "bg-amber-50",   text: "text-amber-700",  border: "border-amber-200",  dot: "bg-amber-400"   },
  rejected: { label: "Rejected",  bg: "bg-red-50",     text: "text-red-600",    border: "border-red-200",    dot: "bg-red-400"     },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_CFG[status] || STATUS_CFG.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${s.bg} ${s.text} ${s.border}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />{s.label}
    </span>
  );
}

// ── Searchable dropdown ───────────────────────────────────────
function SearchDropdown({ label, value, options, onChange, placeholder, required, disabled }: any) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const filtered = options.filter((o: string) => o.toLowerCase().includes(query.toLowerCase()));
  useEffect(() => {
    const h = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} className="relative">
      {label && <label className="mb-1.5 block text-xs font-medium text-gray-700">{label}{required && <span className="text-[#0b66d1]"> *</span>}</label>}
      <button type="button" disabled={disabled} onClick={() => { setOpen(!open); setQuery(""); }}
        className={`${inputClass} flex items-center justify-between text-left ${disabled ? "cursor-not-allowed bg-gray-50 opacity-50" : "cursor-pointer"} ${value ? "text-gray-900" : "text-gray-400"}`}>
        <span className="truncate">{value || placeholder}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-gray-400 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Search..."
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-8 pr-3 text-sm outline-none" />
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto p-1">
            {filtered.length === 0
              ? <p className="px-3 py-4 text-center text-sm text-gray-400">No results</p>
              : filtered.map((opt: string) => (
                <button key={opt} type="button" onClick={() => { onChange(opt); setOpen(false); setQuery(""); }}
                  className={`w-full rounded-lg px-3 py-2.5 text-left text-sm transition hover:bg-blue-50 ${value === opt ? "bg-blue-50 font-semibold text-[#0b66d1]" : "text-gray-700"}`}>
                  {opt}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Document row — view + replace + resubmit ──────────────────
function DocRow({ label, url, file, onSet, onSave, saving, rejected, adminNote }: {
  label: string; url?: string | null; file: File | null;
  onSet: (f: File | null) => void; onSave: () => void;
  saving?: boolean; rejected?: boolean; adminNote?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const hasDoc = !!url;
  return (
    <div className={`rounded-xl border ${rejected ? "border-red-200 bg-red-50" : hasDoc ? "border-gray-100 bg-gray-50" : "border-dashed border-gray-200 bg-white"}`}>
      <div className="flex items-center gap-3 p-3.5">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${rejected ? "bg-red-100" : hasDoc ? "bg-emerald-50" : "bg-gray-100"}`}>
          <FileText className={`h-4 w-4 ${rejected ? "text-red-500" : hasDoc ? "text-emerald-500" : "text-gray-400"}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          <p className={`text-xs mt-0.5 truncate ${file ? "text-[#0b66d1]" : rejected ? "text-red-500" : hasDoc ? "text-emerald-600" : "text-gray-400"}`}>
            {file ? file.name : rejected ? "Rejected — reupload required" : hasDoc ? "Uploaded" : "Not uploaded"}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {url && !file && (
            <a href={url} target="_blank" rel="noreferrer" className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50">
              View
            </a>
          )}
          <input ref={ref} type="file" accept=".jpg,.jpeg,.png,.pdf,.webp" className="hidden" onChange={e => onSet(e.target.files?.[0] ?? null)} />
          {file
            ? <button onClick={onSave} disabled={saving}
                className="flex items-center gap-1 rounded-lg bg-[#0b66d1] px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-[#0952a8] disabled:opacity-60">
                {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : "Submit"}
              </button>
            : <button onClick={() => ref.current?.click()}
                className={`flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${rejected ? "border-red-300 bg-red-100 text-red-700 hover:bg-red-200" : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"}`}>
                {rejected ? "Reupload" : hasDoc ? "Replace" : "Upload"}
              </button>
          }
        </div>
      </div>
      {adminNote && !file && (
        <div className="px-3.5 pb-3.5">
          <div className="rounded-lg bg-red-100 border border-red-200 px-3 py-2">
            <p className="text-xs text-red-700"><span className="font-semibold">Admin note:</span> {adminNote}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Photo grid ────────────────────────────────────────────────
function PhotoGrid({ photos, label }: { photos: string[]; label: string }) {
  if (!photos?.length) return null;
  return (
    <div>
      <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
      <div className="grid grid-cols-4 gap-2">
        {photos.map((url, i) => (
          <a key={i} href={url} target="_blank" rel="noreferrer" className="group relative aspect-video overflow-hidden rounded-xl bg-gray-100 block">
            <img src={url} alt={`${i+1}`} className="h-full w-full object-cover transition group-hover:opacity-80" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 transition">
              <Eye className="h-3.5 w-3.5 text-white" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

// ── File upload area ──────────────────────────────────────────
function FileUploadArea({ label, file, onSet, multiple, files, onSetMultiple, note }: any) {
  const ref = useRef<HTMLInputElement>(null);
  if (multiple) {
    return (
      <div>
        {label && <label className="mb-1.5 block text-xs font-medium text-gray-700">{label}</label>}
        {note && <p className="mb-2 text-xs text-gray-400">{note}</p>}
        {files?.length > 0 && (
          <div className="mb-2 grid grid-cols-4 gap-2">
            {files.map((f: File, i: number) => {
              const url = URL.createObjectURL(f);
              return (
                <div key={i} className="relative">
                  <img src={url} className="h-20 w-full rounded-xl object-cover border-2 border-blue-200" />
                  <button onClick={() => onSetMultiple(files.filter((_: any, idx: number) => idx !== i))}
                    className="absolute right-1 top-1 rounded-full bg-white/90 p-0.5 shadow"><X className="h-3 w-3" /></button>
                </div>
              );
            })}
          </div>
        )}
        <label className="flex cursor-pointer items-center justify-between rounded-xl border border-dashed border-gray-200 p-3.5 hover:border-gray-300 transition">
          <span className="text-sm text-gray-500">{files?.length > 0 ? `${files.length} photo(s) — add more` : "Upload photos"}</span>
          <span className="text-xs text-gray-400 border border-gray-200 rounded-lg px-2 py-1">Browse</span>
          <input type="file" accept=".jpg,.jpeg,.png,.webp" multiple className="hidden"
            onChange={e => onSetMultiple([...(files || []), ...Array.from(e.target.files ?? [])])} />
        </label>
      </div>
    );
  }
  return (
    <div>
      {label && <label className="mb-1.5 block text-xs font-medium text-gray-700">{label}</label>}
      <div className={`flex cursor-pointer items-center justify-between rounded-xl border p-3.5 transition ${file ? "border-blue-200 bg-blue-50" : "border-dashed border-gray-200 hover:border-gray-300"}`}
        onClick={() => ref.current?.click()}>
        <span className="text-sm text-gray-600">{file ? file.name : "Click to upload"}</span>
        {file
          ? <button onClick={e => { e.stopPropagation(); onSet(null); }}><X className="h-3.5 w-3.5 text-gray-400" /></button>
          : <span className="text-xs text-gray-400 border border-gray-200 rounded-lg px-2 py-1">Browse</span>
        }
      </div>
      <input ref={ref} type="file" accept=".jpg,.jpeg,.png,.pdf,.webp" className="hidden" onChange={e => onSet(e.target.files?.[0] ?? null)} />
    </div>
  );
}

const VEHICLE_CLASSES = [
  { id: "business",    label: "Business",    desc: "Sedan · 3 pax" },
  { id: "first_class", label: "First Class", desc: "Luxury · 3 pax" },
  { id: "suv",         label: "SUV",         desc: "SUV · 6 pax"   },
  { id: "van",         label: "Van",         desc: "Van · 7 pax"   },
];

// ══════════════════════════════════════════════════════════════
//  Main Page
// ══════════════════════════════════════════════════════════════
export default function VehiclePage() {
  const router = useRouter();
  const [userId,        setUserId]        = useState("");
  const [driverId,      setDriverId]      = useState("");
  const [activeVehicle, setActiveVehicle] = useState<any>(null);
  const [allVehicles,   setAllVehicles]   = useState<any[]>([]);
  const [pendingReqs,   setPendingReqs]   = useState<any[]>([]);
  const [docHistory,    setDocHistory]    = useState<any[]>([]);  // version history
  const [loading,       setLoading]       = useState(true);
  const [showForm,      setShowForm]      = useState(false);
  const [saving,        setSaving]        = useState(false);
  const [step,          setStep]          = useState<"details"|"documents">("details");
  const [newVehicleId,  setNewVehicleId]  = useState("");
  const [requestingId,  setRequestingId]  = useState("");
  const [savingDoc,     setSavingDoc]     = useState("");
  const [activeTab,     setActiveTab]     = useState<"vehicle"|"calendar"|"history">("vehicle");

  const [form, setForm] = useState({ make:"", model:"", variant:"", year:"", color:"", registration:"", vehicleClass:"business", mileage:"" });
  const setF = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const [regFile,    setRegFile]    = useState<File | null>(null);
  const [insFile,    setInsFile]    = useState<File | null>(null);
  const [insExpiry,  setInsExpiry]  = useState("");
  const [extPhotos,  setExtPhotos]  = useState<File[]>([]);
  const [intPhotos,  setIntPhotos]  = useState<File[]>([]);
  const [newRegFile, setNewRegFile] = useState<File | null>(null);
  const [newInsFile, setNewInsFile] = useState<File | null>(null);

  const years    = getYearOptions();
  const models   = getModelsForMake(form.make);
  const variants = getVariantsForModel(form.make, form.model);

  const loadData = async () => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) { router.replace("/login"); return; }
    setUserId(user.id);
    const { data: drv } = await supabase.from("drivers").select("id").eq("user_id", user.id).maybeSingle();
    if (!drv) return;
    const d = drv as any;
    setDriverId(d.id);
    const [{ data: all }, { data: reqs }, { data: hist }] = await Promise.all([
      (supabase as any).from("driver_vehicles").select("*").eq("driver_id", d.id).order("created_at", { ascending: false }),
      (supabase as any).from("driver_change_requests").select("*").eq("driver_id", d.id).in("field_name", ["vehicle_activation"]).eq("status", "pending"),
      (supabase as any).from("driver_change_requests").select("*").eq("driver_id", d.id).in("field_name", ["vehicle_reg_doc", "vehicle_insurance_doc"]).order("requested_at", { ascending: false }),
    ]);
    const vehicles = (all || []) as any[];
    setAllVehicles(vehicles);
    setActiveVehicle(vehicles.find((v: any) => v.is_active) || null);
    setPendingReqs(reqs || []);
    setDocHistory(hist || []);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const uploadFile = async (supabase: any, file: File, path: string) => {
    const { error } = await supabase.storage.from("driver-documents").upload(path, file, { upsert: true });
    if (error) throw error;
    return supabase.storage.from("driver-documents").getPublicUrl(path).data.publicUrl;
  };

  // ── Save vehicle details ──────────────────────────────────
  const handleSaveVehicle = async () => {
    if (!form.make || !form.model || !form.year || !form.color || !form.registration) {
      toast.error("Fill all required fields"); return;
    }
    setSaving(true);
    try {
      const supabase = createClient();
      const isActiveApproved = activeVehicle?.status === "approved";
      if (!isActiveApproved && activeVehicle)
        await (supabase as any).from("driver_vehicles").update({ is_active: false }).eq("id", activeVehicle.id);
      const { data: newVeh, error } = await (supabase as any).from("driver_vehicles").insert({
        driver_id: driverId, make: form.make, model: form.model, variant: form.variant || null,
        year: parseInt(form.year), color: form.color, registration: form.registration,
        vehicle_class: form.vehicleClass, mileage: form.mileage ? parseInt(form.mileage) : null,
        status: "pending", is_active: !isActiveApproved,
      }).select().single();
      if (error) throw error;
      setNewVehicleId(newVeh.id);
      setStep("documents");
      toast.success("Vehicle saved! Add documents.");
    } catch (err: any) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  // ── Save documents (new vehicle) ──────────────────────────
  const handleSaveDocs = async () => {
    setSaving(true);
    try {
      const supabase = createClient();
      const updates: Record<string, any> = {};
      if (regFile)          updates.reg_doc_url      = await uploadFile(supabase, regFile,  `${userId}/vehicle-reg.${regFile.name.split(".").pop()}`);
      if (insFile)          updates.insurance_url    = await uploadFile(supabase, insFile,  `${userId}/vehicle-insurance.${insFile.name.split(".").pop()}`);
      if (insExpiry)        updates.insurance_expiry = insExpiry;
      if (extPhotos.length) updates.exterior_photos  = await Promise.all(extPhotos.map((f,i) => uploadFile(supabase, f, `${userId}/ext-${i+1}.${f.name.split(".").pop()}`)));
      if (intPhotos.length) updates.interior_photos  = await Promise.all(intPhotos.map((f,i) => uploadFile(supabase, f, `${userId}/int-${i+1}.${f.name.split(".").pop()}`)));
      if (Object.keys(updates).length)
        await (supabase as any).from("driver_vehicles").update(updates).eq("id", newVehicleId);
      toast.success("Submitted for review!");
      resetForm(); await loadData();
    } catch (err: any) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  // ── Replace/resubmit doc on active vehicle ────────────────
  // When approved doc is replaced → create change_request (pending)
  // Vehicle stays active, doc goes into "in review"
  const replaceActiveDoc = async (type: "reg" | "ins") => {
    const file = type === "reg" ? newRegFile : newInsFile;
    if (!file || !activeVehicle) return;
    setSavingDoc(type);
    try {
      const supabase = createClient();
      const fieldName = type === "reg" ? "vehicle_reg_doc" : "vehicle_insurance_doc";
      const oldUrl    = type === "reg" ? activeVehicle.reg_doc_url : activeVehicle.insurance_url;
      const path      = `${userId}/vehicle-${type}-v${Date.now()}.${file.name.split(".").pop()}`;
      const url       = await uploadFile(supabase, file, path);

      // Log version history via change_request
      await (supabase as any).from("driver_change_requests").insert({
        driver_id:  driverId,
        vehicle_id: activeVehicle.id,
        field_name: fieldName,
        old_value:  oldUrl || null,
        new_value:  url,
        file_url:   url,
        status:     "pending",   // admin reviews
      });

      // Update vehicle doc immediately (admin will approve/reject)
      const dbField = type === "reg" ? "reg_doc_url" : "insurance_url";
      await (supabase as any).from("driver_vehicles").update({ [dbField]: url }).eq("id", activeVehicle.id);

      toast.success("Document submitted for review. Vehicle stays active.");
      type === "reg" ? setNewRegFile(null) : setNewInsFile(null);
      await loadData();
    } catch (err: any) { toast.error(err.message); }
    finally { setSavingDoc(""); }
  };

  // ── Vehicle activation request ────────────────────────────
  const requestActivation = async (vehicleId: string, vehicleName: string) => {
    if (pendingReqs.some(r => r.vehicle_id === vehicleId)) { toast.error("Request already pending"); return; }
    setRequestingId(vehicleId);
    try {
      const supabase = createClient();
      await (supabase as any).from("driver_change_requests").insert({
        driver_id: driverId, vehicle_id: vehicleId, field_name: "vehicle_activation",
        old_value: activeVehicle?.registration || null, new_value: vehicleName, status: "pending",
      });
      toast.success("Activation request sent!");
      await loadData();
    } catch (err: any) { toast.error(err.message); }
    finally { setRequestingId(""); }
  };

  const resetForm = () => {
    setShowForm(false); setStep("details"); setNewVehicleId("");
    setForm({ make:"", model:"", variant:"", year:"", color:"", registration:"", vehicleClass:"business", mileage:"" });
    setRegFile(null); setInsFile(null); setInsExpiry(""); setExtPhotos([]); setIntPhotos([]);
  };

  if (loading) return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-[#0b66d1]" /></div>;

  const inactiveApproved = allVehicles.filter(v => !v.is_active && v.status === "approved");
  const vehicleHistory   = allVehicles.filter(v => !v.is_active && v.status !== "approved");
  const insExpDays       = daysUntil(activeVehicle?.insurance_expiry);
  const insExpiring      = insExpDays !== null && insExpDays < 60;

  // Rejected doc requests for active vehicle
  const rejectedRegReq = docHistory.find(r => r.vehicle_id === activeVehicle?.id && r.field_name === "vehicle_reg_doc" && r.status === "rejected");
  const rejectedInsReq = docHistory.find(r => r.vehicle_id === activeVehicle?.id && r.field_name === "vehicle_insurance_doc" && r.status === "rejected");
  // Pending doc requests
  const pendingRegReq  = docHistory.find(r => r.vehicle_id === activeVehicle?.id && r.field_name === "vehicle_reg_doc" && r.status === "pending");
  const pendingInsReq  = docHistory.find(r => r.vehicle_id === activeVehicle?.id && r.field_name === "vehicle_insurance_doc" && r.status === "pending");

  // Expiry calendar items (all vehicles)
  const expiryItems = allVehicles.flatMap(v => [
    v.insurance_expiry && {
      label:   `Insurance — ${v.make} ${v.model} (${v.registration})`,
      date:    v.insurance_expiry,
      days:    daysUntil(v.insurance_expiry),
      type:    "insurance",
      active:  v.is_active,
    },
    v.next_inspection_due && {
      label:   `Inspection — ${v.make} ${v.model} (${v.registration})`,
      date:    v.next_inspection_due,
      days:    daysUntil(v.next_inspection_due),
      type:    "inspection",
      active:  v.is_active,
    },
  ]).filter(Boolean).sort((a: any, b: any) => (a.days ?? 999) - (b.days ?? 999)) as any[];

  const TABS = [
    { key: "vehicle",  label: "Vehicle"  },
    { key: "calendar", label: "Expiry Calendar" },
    { key: "history",  label: "Doc History" },
  ] as const;

  return (
    <div className={DRIVER_THEME.pageWrapper}>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={DRIVER_THEME.pageTitle}>My Vehicle</h2>
          <p className={DRIVER_THEME.pageSub}>Manage your vehicle, documents and renewals</p>
        </div>
        {!showForm && (
          <button onClick={() => { setShowForm(true); setStep("details"); setActiveTab("vehicle"); }}
            className={DRIVER_THEME.btnPrimary}>
            <Plus className="h-4 w-4" />{activeVehicle ? "Add New" : "Add Vehicle"}
          </button>
        )}
      </div>

      {/* ── Insurance expiry warning ── */}
      {insExpiring && insExpDays !== null && !showForm && activeTab === "vehicle" && (
        <div className={`flex items-start gap-3 rounded-2xl border p-4 ${insExpDays < 14 ? "border-red-200 bg-red-50" : "border-amber-200 bg-amber-50"}`}>
          <AlertCircle className={`h-4 w-4 shrink-0 mt-0.5 ${insExpDays < 14 ? "text-red-500" : "text-amber-500"}`} />
          <div className="flex-1">
            <p className={`text-sm font-semibold ${insExpDays < 14 ? "text-red-800" : "text-amber-800"}`}>
              {insExpDays < 0 ? "Insurance expired" : `Insurance expires in ${insExpDays} days`}
            </p>
            <p className={`text-xs mt-0.5 ${insExpDays < 14 ? "text-red-600" : "text-amber-600"}`}>
              Upload a renewed certificate below to keep your vehicle active.
            </p>
          </div>
          <button onClick={() => setActiveTab("calendar")} className="shrink-0 text-xs font-semibold text-gray-500 underline">
            View calendar
          </button>
        </div>
      )}

      {/* ── Tabs (only when vehicle exists and no form) ── */}
      {activeVehicle && !showForm && (
        <div className="flex rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex flex-1 items-center justify-center py-3 text-sm font-medium transition border-b-2 ${activeTab === tab.key ? "border-[#0b66d1] text-[#0b66d1] bg-blue-50/30" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
              {tab.label}
              {tab.key === "calendar" && expiryItems.some(i => i.days !== null && i.days < 30) && (
                <span className="ml-1.5 h-1.5 w-1.5 rounded-full bg-amber-400" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* ══ TAB: VEHICLE ══════════════════════════════════════ */}
      {(activeTab === "vehicle" || !activeVehicle) && !showForm && (
        <>
          {/* Active vehicle card */}
          {activeVehicle && (
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
              <div className="h-1.5" style={{ background: activeVehicle.status === "approved" ? "#10b981" : activeVehicle.status === "rejected" ? "#ef4444" : "#f59e0b" }} />
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl font-bold text-white text-xl"
                    style={{ background: "linear-gradient(135deg, #0b66d1, #0952a8)" }}>
                    {activeVehicle.make?.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-gray-900">
                        {activeVehicle.year} {activeVehicle.make} {activeVehicle.model}{activeVehicle.variant ? ` ${activeVehicle.variant}` : ""}
                      </h3>
                      <StatusBadge status={activeVehicle.status} />
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-2 py-0.5 text-[10px] font-bold text-[#0b66d1]">ACTIVE</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      <span className="capitalize">{activeVehicle.color}</span>
                      {" · "}<span className="font-mono font-semibold text-gray-700">{activeVehicle.registration}</span>
                      {" · "}<span className="capitalize">{activeVehicle.vehicle_class?.replace(/_/g, " ")}</span>
                      {activeVehicle.mileage && <> · {activeVehicle.mileage.toLocaleString()} km</>}
                    </p>
                  </div>
                </div>

                {activeVehicle.status === "pending" && (
                  <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                    <Clock className="h-4 w-4 text-amber-500 shrink-0" />
                    <p className="text-sm text-amber-700">Under admin review — you'll be notified when approved.</p>
                  </div>
                )}
                {activeVehicle.status === "approved" && (
                  <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                    <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                    <p className="text-sm text-emerald-700">Vehicle approved. To switch vehicle, add a new one — this stays active until approved.</p>
                  </div>
                )}
                {activeVehicle.status === "rejected" && (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
                    <p className="text-sm font-semibold text-red-700">Vehicle Rejected</p>
                    {activeVehicle.rejection_reason && <p className="text-sm text-red-600 mt-1">{activeVehicle.rejection_reason}</p>}
                    <button onClick={() => { setShowForm(true); setStep("details"); }} className="mt-2 text-xs font-semibold text-red-700 underline">Add a new vehicle →</button>
                  </div>
                )}
              </div>

              {/* Pending doc review notices */}
              {(pendingRegReq || pendingInsReq) && (
                <div className="border-t border-amber-100 bg-amber-50 px-5 py-3">
                  <p className="text-xs font-semibold text-amber-700">
                    {[pendingRegReq && "Registration document", pendingInsReq && "Insurance certificate"].filter(Boolean).join(" and ")} {" "}
                    {(pendingRegReq && pendingInsReq) ? "are" : "is"} pending admin review. Vehicle remains active.
                  </p>
                </div>
              )}

              {/* Documents */}
              <div className="border-t border-gray-100 px-5 py-4">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Documents</p>
                <div className="space-y-2">
                  <DocRow
                    label="Registration Certificate"
                    url={activeVehicle.reg_doc_url}
                    file={newRegFile}
                    onSet={setNewRegFile}
                    onSave={() => replaceActiveDoc("reg")}
                    saving={savingDoc === "reg"}
                    rejected={!!rejectedRegReq}
                    adminNote={rejectedRegReq?.admin_note}
                  />
                  <DocRow
                    label="Insurance Certificate"
                    url={activeVehicle.insurance_url}
                    file={newInsFile}
                    onSet={setNewInsFile}
                    onSave={() => replaceActiveDoc("ins")}
                    saving={savingDoc === "ins"}
                    rejected={!!rejectedInsReq}
                    adminNote={rejectedInsReq?.admin_note}
                  />
                  {activeVehicle.insurance_expiry && (
                    <p className={`text-xs px-1 mt-1 ${insExpiring ? "font-semibold text-amber-600" : "text-gray-400"}`}>
                      Insurance expires: {fmtDate(activeVehicle.insurance_expiry)}
                      {insExpDays !== null && insExpDays >= 0 && insExpDays < 90 && ` — ${insExpDays} days left`}
                      {insExpDays !== null && insExpDays < 0 && " — EXPIRED"}
                    </p>
                  )}
                </div>
              </div>

              {/* Photos */}
              {(activeVehicle.exterior_photos?.length > 0 || activeVehicle.interior_photos?.length > 0) && (
                <div className="border-t border-gray-100 px-5 py-4 space-y-4">
                  <PhotoGrid photos={activeVehicle.exterior_photos} label="Exterior" />
                  <PhotoGrid photos={activeVehicle.interior_photos} label="Interior" />
                </div>
              )}

              {/* Stats */}
              <div className="border-t border-gray-50 grid grid-cols-3 divide-x divide-gray-100">
                {[
                  { label: "Added",    value: fmtShort(activeVehicle.created_at) },
                  { label: "Approved", value: activeVehicle.approved_at ? fmtShort(activeVehicle.approved_at) : "Pending" },
                  { label: "Class",    value: activeVehicle.vehicle_class?.replace(/_/g, " ") },
                ].map(s => (
                  <div key={s.label} className="px-4 py-3 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">{s.label}</p>
                    <p className="mt-0.5 text-sm font-semibold capitalize text-gray-900">{s.value || "—"}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {!activeVehicle && (
            <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white p-12 text-center">
              <p className="text-base font-bold text-gray-900">No vehicle added yet</p>
              <p className="mt-1.5 text-sm text-gray-400 max-w-xs mx-auto">Add your vehicle to complete your driver profile</p>
              <button onClick={() => setShowForm(true)} className={`mt-6 inline-flex ${DRIVER_THEME.btnPrimary}`}>
                <Plus className="h-4 w-4" /> Add Vehicle
              </button>
            </div>
          )}

          {/* Other approved vehicles */}
          {inactiveApproved.length > 0 && (
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-gray-900">Other Approved Vehicles</p>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">{inactiveApproved.length}</span>
                </div>
                <p className="text-xs text-gray-400 hidden sm:block">Request to switch</p>
              </div>
              <div className="divide-y divide-gray-50">
                {inactiveApproved.map(v => {
                  const hasPending = pendingReqs.some(r => r.vehicle_id === v.id);
                  return (
                    <div key={v.id} className="px-5 py-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{v.year} {v.make} {v.model}{v.variant ? ` ${v.variant}` : ""}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{v.color} · <span className="font-mono font-semibold">{v.registration}</span></p>
                        </div>
                        {hasPending
                          ? <span className="shrink-0 flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700">
                              <Clock className="h-3 w-3" /> Pending
                            </span>
                          : <button onClick={() => requestActivation(v.id, `${v.year} ${v.make} ${v.model} (${v.registration})`)}
                              disabled={requestingId === v.id}
                              className="shrink-0 flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition disabled:opacity-60"
                              style={{ borderColor: "#0b66d1", color: "#0b66d1", background: "#e8f1fd" }}>
                              {requestingId === v.id ? <><Loader2 className="h-3 w-3 animate-spin" /> Sending</> : <><Send className="h-3 w-3" /> Request Switch</>}
                            </button>
                        }
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Vehicle history */}
          {vehicleHistory.length > 0 && (
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50">
                <p className="text-sm font-semibold text-gray-900">Previous Vehicles</p>
              </div>
              <div className="divide-y divide-gray-50">
                {vehicleHistory.map(v => (
                  <div key={v.id} className="px-5 py-3.5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{v.year} {v.make} {v.model} · {v.color}</p>
                        <p className="text-xs text-gray-400 mt-0.5"><span className="font-mono font-semibold">{v.registration}</span> · Added {fmtShort(v.created_at)}</p>
                      </div>
                      <StatusBadge status={v.status} />
                    </div>
                    {v.status === "rejected" && v.rejection_reason && (
                      <div className="mt-2 flex items-start gap-2 rounded-lg bg-red-50 border border-red-100 px-3 py-2">
                        <AlertCircle className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-red-600"><strong>Reason:</strong> {v.rejection_reason}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* ══ TAB: EXPIRY CALENDAR ══════════════════════════════ */}
      {activeTab === "calendar" && activeVehicle && !showForm && (
        <div className="space-y-3">
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-50">
              <Calendar className="h-4 w-4 text-gray-400" />
              <p className="text-sm font-semibold text-gray-900">Document Expiry Calendar</p>
            </div>
            {expiryItems.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <p className="text-sm text-gray-400">No expiry dates set on your vehicles.</p>
                <p className="text-xs text-gray-400 mt-1">Add insurance expiry dates when uploading documents.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {expiryItems.map((item: any, i: number) => {
                  const urgent  = item.days !== null && item.days < 14;
                  const warning = item.days !== null && item.days < 60;
                  const expired = item.days !== null && item.days < 0;
                  return (
                    <div key={i} className={`flex items-center justify-between px-5 py-4 ${urgent || expired ? "bg-red-50" : warning ? "bg-amber-50" : ""}`}>
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${expired || urgent ? "bg-red-400" : warning ? "bg-amber-400" : "bg-emerald-400"}`} />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.label}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{fmtDate(item.date)}</p>
                          {item.active && <span className="text-[10px] font-bold text-[#0b66d1]">Active vehicle</span>}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        {expired
                          ? <span className="text-sm font-bold text-red-600">Expired</span>
                          : item.days !== null && item.days < 90
                          ? <span className={`text-sm font-bold ${urgent ? "text-red-600" : warning ? "text-amber-600" : "text-gray-600"}`}>{item.days} days</span>
                          : <span className="text-sm text-gray-400">{fmtShort(item.date)}</span>
                        }
                        {(urgent || expired || warning) && item.type === "insurance" && item.active && (
                          <button onClick={() => setActiveTab("vehicle")} className="block text-xs text-[#0b66d1] hover:underline mt-0.5">
                            Renew now
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Insurance renewal tips */}
          <div className="rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4">
            <p className="text-sm font-semibold text-blue-900 mb-1">Insurance Renewal Reminder</p>
            <p className="text-xs text-blue-700 leading-relaxed">
              Upload your renewed insurance certificate at least 7 days before expiry. Your vehicle stays active during the review period. Admin will approve within 1–2 business days.
            </p>
          </div>
        </div>
      )}

      {/* ══ TAB: DOC HISTORY ══════════════════════════════════ */}
      {activeTab === "history" && activeVehicle && !showForm && (
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2.5">
              <History className="h-4 w-4 text-gray-400" />
              <p className="text-sm font-semibold text-gray-900">Document Version History</p>
            </div>
            <button onClick={loadData} className="text-xs text-gray-400 hover:text-gray-700 flex items-center gap-1">
              <RefreshCw className="h-3 w-3" /> Refresh
            </button>
          </div>
          {docHistory.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-sm text-gray-400">No document history yet.</p>
              <p className="text-xs text-gray-400 mt-1">History will appear when you update or resubmit documents.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {docHistory.map(req => {
                const isReg = req.field_name === "vehicle_reg_doc";
                return (
                  <div key={req.id} className="px-5 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-gray-900">
                            {isReg ? "Registration Certificate" : "Insurance Certificate"}
                          </p>
                          <StatusBadge status={req.status} />
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">{fmtShort(req.requested_at)}</p>
                        {req.admin_note && (
                          <div className="mt-2 rounded-lg bg-red-50 border border-red-100 px-3 py-2">
                            <p className="text-xs text-red-700"><span className="font-semibold">Admin note:</span> {req.admin_note}</p>
                          </div>
                        )}
                        {req.reviewed_at && (
                          <p className="text-xs text-gray-400 mt-1">Reviewed: {fmtShort(req.reviewed_at)}</p>
                        )}
                      </div>
                      {req.file_url && (
                        <a href={req.file_url} target="_blank" rel="noreferrer"
                          className="shrink-0 flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50">
                          View
                        </a>
                      )}
                    </div>
                    {/* If rejected — show reupload inline */}
                    {req.status === "rejected" && (
                      <div className="mt-3">
                        <DocRow
                          label={`Resubmit ${isReg ? "Registration" : "Insurance"}`}
                          url={null}
                          file={isReg ? newRegFile : newInsFile}
                          onSet={isReg ? setNewRegFile : setNewInsFile}
                          onSave={() => replaceActiveDoc(isReg ? "reg" : "ins")}
                          saving={savingDoc === (isReg ? "reg" : "ins")}
                          rejected
                          adminNote={req.admin_note}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ══ ADD VEHICLE FORM ══════════════════════════════════ */}
      {showForm && (
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-gray-100 bg-gray-50/50 px-5 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {[{ key:"details", label:"Details", n:1 }, { key:"documents", label:"Documents", n:2 }].map((s,i) => (
                  <div key={s.key} className="flex items-center gap-2">
                    <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${step === s.key ? "text-white" : step === "documents" && s.key === "details" ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-500"}`}
                      style={step === s.key ? { backgroundColor: "#0b66d1" } : {}}>
                      {step === "documents" && s.key === "details" ? <Check className="h-3.5 w-3.5" /> : s.n}
                    </div>
                    <span className={`text-sm font-medium hidden sm:block ${step === s.key ? "text-gray-900" : "text-gray-400"}`}>{s.label}</span>
                    {i === 0 && <ChevronRight className="h-4 w-4 text-gray-300" />}
                  </div>
                ))}
              </div>
              <button onClick={resetForm} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"><X className="h-4 w-4" /></button>
            </div>
          </div>

          <div className="p-5 space-y-4">
            {activeVehicle && step === "details" && (
              <div className="flex items-start gap-2.5 rounded-xl border border-blue-100 bg-blue-50 p-3.5">
                <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-sm text-blue-700">
                  {activeVehicle.status === "approved"
                    ? "Current vehicle stays active until this one is approved."
                    : "This replaces your current pending vehicle."}
                </p>
              </div>
            )}

            {step === "details" && (
              <div className="space-y-4">
                <SearchDropdown label="Make" required value={form.make} options={VEHICLE_MAKES.map(m => m.name)} onChange={(v: string) => { setF("make", v); setF("model",""); setF("variant",""); }} placeholder="Select make" />
                <SearchDropdown label="Model" required value={form.model} options={models.map(m => m.name)} onChange={(v: string) => { setF("model", v); setF("variant",""); }} placeholder={form.make ? "Select model" : "Select make first"} disabled={!form.make} />
                {variants.length > 0 && <SearchDropdown label="Variant" value={form.variant} options={variants} onChange={(v: string) => setF("variant", v)} placeholder="Optional" />}
                <div className="grid gap-4 sm:grid-cols-2">
                  <SearchDropdown label="Year" required value={form.year} options={years.map(String)} onChange={(v: string) => setF("year", v)} placeholder="Year" />
                  <SearchDropdown label="Color" required value={form.color} options={VEHICLE_COLORS} onChange={(v: string) => setF("color", v)} placeholder="Color" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-700">License Plate *</label>
                    <input value={form.registration} onChange={e => setF("registration", e.target.value.toUpperCase())} placeholder="ABC 1234" className={inputClass} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-700">Mileage (km)</label>
                    <input type="number" value={form.mileage} onChange={e => setF("mileage", e.target.value)} placeholder="25000" className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-medium text-gray-700">Vehicle Class *</label>
                  <div className="grid grid-cols-2 gap-2">
                    {VEHICLE_CLASSES.map(vc => (
                      <button key={vc.id} type="button" onClick={() => setF("vehicleClass", vc.id)}
                        className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${form.vehicleClass === vc.id ? "border-[#0b66d1] bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}>
                        <div>
                          <p className={`text-sm font-semibold ${form.vehicleClass === vc.id ? "text-[#0b66d1]" : "text-gray-900"}`}>{vc.label}</p>
                          <p className="text-xs text-gray-400">{vc.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button onClick={handleSaveVehicle} disabled={saving} className={`${DRIVER_THEME.btnPrimary} disabled:opacity-60`}>
                    {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : "Next: Documents →"}
                  </button>
                </div>
              </div>
            )}

            {step === "documents" && (
              <div className="space-y-4">
                <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                  Documents required for approval. You can skip and upload later.
                </div>
                <FileUploadArea label="Registration Certificate *" file={regFile} onSet={setRegFile} />
                <FileUploadArea label="Insurance Certificate *"    file={insFile} onSet={setInsFile} />
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">Insurance Expiry Date</label>
                  <input type="date" value={insExpiry} onChange={e => setInsExpiry(e.target.value)} className={inputClass} style={{ maxWidth: 220 }} />
                </div>
                <FileUploadArea label="Exterior Photos" multiple files={extPhotos} onSetMultiple={setExtPhotos} note="Front, rear, left, right" />
                <FileUploadArea label="Interior Photos" multiple files={intPhotos} onSetMultiple={setIntPhotos} note="Dashboard, seats" />
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between pt-2 border-t border-gray-100">
                  <button onClick={async () => { toast.success("Saved — add documents from vehicle page later."); resetForm(); await loadData(); }} className={DRIVER_THEME.btnSecondary}>
                    Skip for now
                  </button>
                  <button onClick={handleSaveDocs} disabled={saving} className={`${DRIVER_THEME.btnPrimary} disabled:opacity-60`}>
                    {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Uploading…</> : <><CheckCircle className="h-4 w-4" /> Submit for Approval</>}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
