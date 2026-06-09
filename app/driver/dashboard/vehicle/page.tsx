"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Plus, X, ChevronDown, ChevronRight, Search, Upload, Loader2,
  Clock, Send, Check, Info, AlertCircle, CheckCircle, Eye,
  Calendar, History, FileText, RefreshCw, ArrowLeft, Camera,
  Shield, Car, Trash2, AlertTriangle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { DRIVER_THEME, fmtShort, fmtDate, daysUntil } from "@/lib/driver/theme";

const inp = "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20";

// ── Status Badge ──────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { cls: string; label: string }> = {
    approved: { cls: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "Approved"  },
    pending:  { cls: "bg-amber-50 text-amber-700 border-amber-200",       label: "In Review" },
    rejected: { cls: "bg-red-50 text-red-600 border-red-200",             label: "Rejected"  },
  };
  const s = map[status] || map.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${s.cls}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
      {s.label}
    </span>
  );
}

// ── Searchable Select ─────────────────────────────────────────
function SelectDropdown({ label, value, options, onChange, placeholder, disabled, required }: {
  label?: string; value: string; options: { id: string; label: string; sub?: string }[];
  onChange: (id: string) => void; placeholder?: string; disabled?: boolean; required?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [q,    setQ]    = useState("");
  const ref             = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const filtered = options.filter(o => o.label.toLowerCase().includes(q.toLowerCase()));
  const selected = options.find(o => o.id === value);

  return (
    <div ref={ref} className="relative">
      {label && (
        <label className="mb-1.5 block text-xs font-semibold text-gray-600">
          {label}{required && <span className="ml-0.5 text-[#0b66d1]">*</span>}
        </label>
      )}
      <button type="button" disabled={disabled} onClick={() => { if (!disabled) { setOpen(!open); setQ(""); } }}
        className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm transition
          ${disabled ? "cursor-not-allowed bg-gray-50 text-gray-400 border-gray-100" : "bg-white border-gray-200 hover:border-gray-300 focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20 cursor-pointer"}
          ${value ? "text-gray-900" : "text-gray-400"}`}>
        <span className="truncate text-left">{selected?.label || placeholder || "Select..."}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1.5 w-full rounded-2xl border border-gray-100 bg-white shadow-xl overflow-hidden">
          <div className="p-2 border-b border-gray-50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Search..."
                className="w-full rounded-xl border border-gray-100 bg-gray-50 py-2 pl-8 pr-3 text-sm outline-none" />
            </div>
          </div>
          <div className="max-h-52 overflow-y-auto p-1.5">
            {filtered.length === 0
              ? <p className="px-3 py-4 text-center text-sm text-gray-400">No results</p>
              : filtered.map(opt => (
                <button key={opt.id} type="button"
                  onClick={() => { onChange(opt.id); setOpen(false); setQ(""); }}
                  className={`w-full rounded-xl px-3 py-2.5 text-left transition hover:bg-blue-50 ${value === opt.id ? "bg-blue-50" : ""}`}>
                  <p className={`text-sm font-medium ${value === opt.id ? "text-[#0b66d1]" : "text-gray-900"}`}>{opt.label}</p>
                  {opt.sub && <p className="text-xs text-gray-400 mt-0.5">{opt.sub}</p>}
                </button>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
}

// ── Photo Upload Grid ─────────────────────────────────────────
function PhotoUploadGrid({
  label, note, existingUrls, newFiles, onAddFiles, onRemoveNew, maxPhotos = 6,
}: {
  label: string; note?: string; existingUrls?: string[];
  newFiles: File[]; onAddFiles: (f: File[]) => void;
  onRemoveNew: (i: number) => void; maxPhotos?: number;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const totalCount = (existingUrls?.length || 0) + newFiles.length;
  const canAdd = totalCount < maxPhotos;

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-semibold text-gray-600">{label}</label>
        {note && <span className="text-[10px] text-gray-400">{note}</span>}
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {/* Existing */}
        {(existingUrls || []).map((url, i) => (
          <a key={i} href={url} target="_blank" rel="noreferrer"
            className="group relative aspect-video overflow-hidden rounded-xl bg-gray-100 block">
            <img src={url} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition">
              <Eye className="h-4 w-4 text-white opacity-0 group-hover:opacity-100" />
            </div>
          </a>
        ))}
        {/* New files */}
        {newFiles.map((f, i) => {
          const url = URL.createObjectURL(f);
          return (
            <div key={i} className="relative aspect-video overflow-hidden rounded-xl bg-gray-100">
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button onClick={() => onRemoveNew(i)}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white/90 shadow">
                <X className="h-3 w-3 text-gray-600" />
              </button>
              <div className="absolute left-1 top-1 rounded-full bg-[#0b66d1] px-1.5 py-0.5 text-[9px] font-bold text-white">NEW</div>
            </div>
          );
        })}
        {/* Add button */}
        {canAdd && (
          <button type="button" onClick={() => ref.current?.click()}
            className="flex aspect-video flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:border-[#0b66d1] hover:bg-blue-50 transition">
            <Camera className="h-5 w-5 text-gray-300" />
            <span className="text-[10px] text-gray-400">Add</span>
          </button>
        )}
      </div>
      <input ref={ref} type="file" accept=".jpg,.jpeg,.png,.webp" multiple className="hidden"
        onChange={e => {
          const files = Array.from(e.target.files || []);
          const remaining = maxPhotos - totalCount;
          onAddFiles(files.slice(0, remaining));
          e.target.value = "";
        }} />
    </div>
  );
}

// ── Document Row ──────────────────────────────────────────────
function DocRow({ label, url, file, onSet, onSave, saving, status, adminNote }: {
  label: string; url?: string | null; file: File | null;
  onSet: (f: File | null) => void; onSave: () => void;
  saving?: boolean; status?: "pending" | "rejected" | "approved"; adminNote?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const isRejected = status === "rejected";
  const isPending  = status === "pending";
  const isApproved = status === "approved";

  return (
    <div className={`rounded-2xl overflow-hidden ${isRejected ? "ring-2 ring-red-200" : ""}`}>
      <div className={`flex items-center gap-3 p-4 ${isRejected ? "bg-red-50" : url ? "bg-gray-50" : "bg-white border-2 border-dashed border-gray-200"}`}>
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl
          ${isRejected ? "bg-red-100" : isApproved ? "bg-emerald-50" : url ? "bg-gray-100" : "bg-gray-100"}`}>
          <FileText className={`h-5 w-5 ${isRejected ? "text-red-400" : isApproved ? "text-emerald-500" : url ? "text-gray-400" : "text-gray-300"}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900">{label}</p>
          <p className={`text-xs mt-0.5 ${file ? "text-[#0b66d1]" : isRejected ? "text-red-500" : isPending ? "text-amber-600" : url ? "text-emerald-600" : "text-gray-400"}`}>
            {file ? file.name : isRejected ? "Rejected — reupload required" : isPending ? "In review" : url ? "Uploaded ✓" : "Not uploaded"}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {url && !file && (
            <a href={url} target="_blank" rel="noreferrer"
              className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition">
              View
            </a>
          )}
          <input ref={ref} type="file" accept=".jpg,.jpeg,.png,.pdf,.webp" className="hidden"
            onChange={e => onSet(e.target.files?.[0] ?? null)} />
          {file
            ? <button onClick={onSave} disabled={saving}
                className="flex items-center gap-1.5 rounded-xl bg-[#0b66d1] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0952a8] disabled:opacity-60 transition">
                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <><Check className="h-3.5 w-3.5" /> Submit</>}
              </button>
            : <button onClick={() => ref.current?.click()}
                className={`rounded-xl border px-3 py-1.5 text-xs font-medium transition
                  ${isRejected ? "border-red-300 bg-red-100 text-red-700 hover:bg-red-200" : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"}`}>
                {isRejected ? "Reupload" : url ? "Replace" : "Upload"}
              </button>
          }
        </div>
      </div>
      {isRejected && adminNote && (
        <div className="px-4 pb-3 pt-1 bg-red-50">
          <p className="text-xs text-red-700 rounded-lg bg-red-100 border border-red-200 px-3 py-2">
            <span className="font-semibold">Admin note: </span>{adminNote}
          </p>
        </div>
      )}
    </div>
  );
}

// ── Step Indicator ────────────────────────────────────────────
function StepBar({ current, steps }: { current: number; steps: string[] }) {
  return (
    <div className="flex items-center gap-1">
      {steps.map((label, i) => {
        const n     = i + 1;
        const done  = n < current;
        const active = n === current;
        return (
          <div key={label} className="flex items-center gap-1">
            <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition
              ${done ? "bg-emerald-500 text-white" : active ? "bg-[#0b66d1] text-white" : "bg-gray-200 text-gray-400"}`}>
              {done ? <Check className="h-3.5 w-3.5" /> : n}
            </div>
            <span className={`hidden sm:block text-xs font-medium ${active ? "text-gray-900" : done ? "text-emerald-600" : "text-gray-400"}`}>
              {label}
            </span>
            {i < steps.length - 1 && <ChevronRight className="h-3.5 w-3.5 text-gray-300 shrink-0" />}
          </div>
        );
      })}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  Main Page
// ══════════════════════════════════════════════════════════════
export default function VehiclePage() {
  const router = useRouter();

  // Auth
  const [userId,    setUserId]    = useState("");
  const [driverId,  setDriverId]  = useState("");

  // Data
  const [activeVehicle,  setActiveVehicle]  = useState<any>(null);
  const [allVehicles,    setAllVehicles]    = useState<any[]>([]);
  const [docHistory,     setDocHistory]     = useState<any[]>([]);
  const [pendingSwitch,  setPendingSwitch]  = useState<any>(null);
  const [loading,        setLoading]        = useState(true);

  // Vehicle categories from DB
  const [categories, setCategories] = useState<any[]>([]);
  const [makes,      setMakes]      = useState<any[]>([]);
  const [models,     setModels]     = useState<any[]>([]);

  // Form
  const [showForm,    setShowForm]    = useState(false);
  const [formStep,    setFormStep]    = useState(1); // 1=Category, 2=Make, 3=Model, 4=Details, 5=Docs
  const [saving,      setSaving]      = useState(false);
  const [newVehicleId, setNewVehicleId] = useState("");

  // Step 1 — Category
  const [selCategoryId, setSelCategoryId] = useState("");
  // Step 2 — Make
  const [selMakeId,     setSelMakeId]     = useState("");
  // Step 3 — Model
  const [selModelId,    setSelModelId]    = useState("");
  const [selVariant,    setSelVariant]    = useState("");
  // Step 4 — Details
  const [year,         setYear]         = useState("");
  const [color,        setColor]        = useState("");
  const [plate,        setPlate]        = useState("");
  const [mileage,      setMileage]      = useState("");
  // Step 5 — Docs
  const [regFile,      setRegFile]      = useState<File | null>(null);
  const [insFile,      setInsFile]      = useState<File | null>(null);
  const [insExpiry,    setInsExpiry]    = useState("");
  const [extPhotos,    setExtPhotos]    = useState<File[]>([]);
  const [intPhotos,    setIntPhotos]    = useState<File[]>([]);

  // Doc replace on active vehicle
  const [newRegFile,   setNewRegFile]   = useState<File | null>(null);
  const [newInsFile,   setNewInsFile]   = useState<File | null>(null);
  const [savingDoc,    setSavingDoc]    = useState("");

  // Tab
  const [activeTab, setActiveTab] = useState<"vehicle" | "history">("vehicle");

  // Computed
  const selCategory = categories.find(c => c.id === selCategoryId);
  const selMake     = makes.find(m => m.id === selMakeId);
  const selModel    = models.find(m => m.id === selModelId);
  const filteredMakes  = makes.filter(m => m.category_id === selCategoryId);
  const filteredModels = models.filter(m => m.make_id === selMakeId);
  const variants       = selModel?.variants || [];

  const YEARS = Array.from({ length: 15 }, (_, i) => {
    const y = new Date().getFullYear() + 1 - i;
    return { id: String(y), label: String(y) };
  });

  const COLORS = ["Black","White","Silver","Gray","Navy Blue","Midnight Blue","Champagne","Ivory","Burgundy","Dark Green","Bronze","Graphite"].map(c => ({ id: c, label: c }));

  // ── Load Data ────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) { router.replace("/driver/login"); return; }
    setUserId(user.id);

    const { data: drv } = await (supabase as any)
      .from("drivers").select("id").eq("user_id", user.id).maybeSingle();
    if (!drv) { setLoading(false); return; }
    setDriverId(drv.id);

    const [
      { data: all },
      { data: hist },
      { data: cats },
      { data: mks },
      { data: mds },
    ] = await Promise.all([
      (supabase as any).from("driver_vehicles").select("*").eq("driver_id", drv.id).order("created_at", { ascending: false }),
      (supabase as any).from("driver_change_requests").select("*").eq("driver_id", drv.id)
        .in("field_name", ["vehicle_reg_doc","vehicle_insurance_doc","vehicle_activation"])
        .order("requested_at", { ascending: false }),
      (supabase as any).from("vehicle_categories").select("*").eq("is_active", true).order("sort_order"),
      (supabase as any).from("vehicle_makes").select("*").eq("is_active", true).order("name"),
      (supabase as any).from("vehicle_models").select("*").eq("is_active", true).order("name"),
    ]);

    const vehicles = (all || []) as any[];
    setAllVehicles(vehicles);
    setActiveVehicle(vehicles.find((v: any) => v.is_active) || null);
    setDocHistory(hist || []);
    setCategories(cats || []);
    setMakes(mks || []);
    setModels(mds || []);

    // Check pending switch request
    const switchReq = (hist || []).find((r: any) => r.field_name === "vehicle_activation" && r.status === "pending");
    setPendingSwitch(switchReq || null);

    setLoading(false);
  }, [router]);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Upload helper ────────────────────────────────────────────
  const uploadFile = async (supabase: any, file: File, path: string) => {
    const { error } = await supabase.storage.from("driver-documents").upload(path, file, { upsert: true });
    if (error) throw error;
    return supabase.storage.from("driver-documents").getPublicUrl(path).data.publicUrl;
  };

  // ── Step navigation ──────────────────────────────────────────
  const goNext = () => setFormStep(s => s + 1);
  const goBack = () => setFormStep(s => s - 1);

  const resetForm = () => {
    setShowForm(false); setFormStep(1);
    setSelCategoryId(""); setSelMakeId(""); setSelModelId(""); setSelVariant("");
    setYear(""); setColor(""); setPlate(""); setMileage("");
    setRegFile(null); setInsFile(null); setInsExpiry("");
    setExtPhotos([]); setIntPhotos([]); setNewVehicleId("");
  };

  // ── Save vehicle (step 4 → step 5) ──────────────────────────
  const handleSaveVehicle = async () => {
    if (!selCategoryId || !selMakeId || !selModelId || !year || !color || !plate) {
      toast.error("Fill all required fields"); return;
    }
    if (saving) return; // double submit prevent
    setSaving(true);
    try {
      const supabase = createClient();
      const isActiveApproved = activeVehicle?.status === "approved";

      // Deactivate old vehicle if not approved
      if (activeVehicle && !isActiveApproved) {
        await (supabase as any).from("driver_vehicles").update({ is_active: false }).eq("id", activeVehicle.id);
      }

      const { data: newVeh, error } = await (supabase as any).from("driver_vehicles").insert({
        driver_id:            driverId,
        make:                 selMake?.name || "",
        model:                selModel?.name || "",
        variant:              selVariant || null,
        year:                 parseInt(year),
        color,
        registration:         plate.toUpperCase(),
        vehicle_class:        selCategoryId, // category ID
        vehicle_category_id:  selCategoryId,
        mileage:              mileage ? parseInt(mileage) : null,
        status:               "pending",
        is_active:            !isActiveApproved,
      }).select().single();

      if (error) throw error;
      setNewVehicleId((newVeh as any).id);

      // Log audit
      try {
        await (supabase as any).from("driver_audit_log").insert({
          driver_id:   driverId,
          action:      "VEHICLE_ADDED",
          description: `New vehicle: ${year} ${selMake?.name} ${selModel?.name} (${plate})`,
          changed_by:  "driver",
        });
      } catch { /* ignore audit errors */ }
      toast.success("Vehicle saved! Now upload documents.");
      goNext();
    } catch (err: any) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  // ── Save documents ───────────────────────────────────────────
  const handleSaveDocs = async () => {
    setSaving(true);
    try {
      const supabase = createClient();
      const updates: Record<string, any> = {};

      if (regFile)      updates.reg_doc_url     = await uploadFile(supabase, regFile,  `${userId}/vehicle-reg-${Date.now()}.${regFile.name.split(".").pop()}`);
      if (insFile)      updates.insurance_url   = await uploadFile(supabase, insFile,  `${userId}/vehicle-ins-${Date.now()}.${insFile.name.split(".").pop()}`);
      if (insExpiry)    updates.insurance_expiry = insExpiry;
      if (extPhotos.length) {
        updates.exterior_photos = await Promise.all(
          extPhotos.map((f, i) => uploadFile(supabase, f, `${userId}/ext-${Date.now()}-${i}.${f.name.split(".").pop()}`))
        );
      }
      if (intPhotos.length) {
        updates.interior_photos = await Promise.all(
          intPhotos.map((f, i) => uploadFile(supabase, f, `${userId}/int-${Date.now()}-${i}.${f.name.split(".").pop()}`))
        );
      }

      if (Object.keys(updates).length) {
        await (supabase as any).from("driver_vehicles").update(updates).eq("id", newVehicleId);
      }

      toast.success("Vehicle submitted for review!");
      resetForm();
      await loadData();
    } catch (err: any) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  // ── Replace active vehicle doc ───────────────────────────────
  const replaceDoc = async (type: "reg" | "ins") => {
    const file = type === "reg" ? newRegFile : newInsFile;
    if (!file || !activeVehicle) return;
    setSavingDoc(type);
    try {
      const supabase = createClient();
      const fieldName = type === "reg" ? "vehicle_reg_doc" : "vehicle_insurance_doc";
      const path      = `${userId}/vehicle-${type}-v${Date.now()}.${file.name.split(".").pop()}`;
      const url       = await uploadFile(supabase, file, path);

      await (supabase as any).from("driver_change_requests").insert({
        driver_id:  driverId, vehicle_id: activeVehicle.id,
        field_name: fieldName,
        old_value:  type === "reg" ? activeVehicle.reg_doc_url : activeVehicle.insurance_url,
        new_value:  url, file_url: url, status: "pending",
      });

      const dbField = type === "reg" ? "reg_doc_url" : "insurance_url";
      await (supabase as any).from("driver_vehicles").update({ [dbField]: url }).eq("id", activeVehicle.id);

      toast.success("Submitted for review. Vehicle stays active.");
      type === "reg" ? setNewRegFile(null) : setNewInsFile(null);
      await loadData();
    } catch (err: any) { toast.error(err.message); }
    finally { setSavingDoc(""); }
  };

  // ── Request vehicle switch ───────────────────────────────────
  const requestSwitch = async (vehicleId: string, vehicleName: string) => {
    try {
      const supabase = createClient();
      await (supabase as any).from("driver_change_requests").insert({
        driver_id:  driverId,
        vehicle_id: vehicleId,
        field_name: "vehicle_activation",
        old_value:  activeVehicle?.registration || null,
        new_value:  vehicleName,
        status:     "pending",
      });
      toast.success("Switch request sent to admin!");
      await loadData();
    } catch (err: any) { toast.error(err.message); }
  };

  // ─────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-[#0b66d1]" />
    </div>
  );

  const insExpDays  = daysUntil(activeVehicle?.insurance_expiry);
  const insExpiring = insExpDays !== null && insExpDays < 60;

  const rejReg = docHistory.find(r => r.vehicle_id === activeVehicle?.id && r.field_name === "vehicle_reg_doc"      && r.status === "rejected");
  const rejIns = docHistory.find(r => r.vehicle_id === activeVehicle?.id && r.field_name === "vehicle_insurance_doc" && r.status === "rejected");
  const penReg = docHistory.find(r => r.vehicle_id === activeVehicle?.id && r.field_name === "vehicle_reg_doc"      && r.status === "pending");
  const penIns = docHistory.find(r => r.vehicle_id === activeVehicle?.id && r.field_name === "vehicle_insurance_doc" && r.status === "pending");

  const otherApproved = allVehicles.filter(v => !v.is_active && v.status === "approved");
  const vehicleHistory = allVehicles.filter(v => !v.is_active);

  const FORM_STEPS = ["Category","Make","Model","Details","Documents"];

  return (
    <div className={DRIVER_THEME.pageWrapper}>

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={DRIVER_THEME.pageTitle}>My Vehicle</h2>
          <p className={DRIVER_THEME.pageSub}>Manage vehicle, documents and renewals</p>
        </div>
        {!showForm && (
          <button onClick={() => { setShowForm(true); setFormStep(1); setActiveTab("vehicle"); }}
            className={DRIVER_THEME.btnPrimary}>
            <Plus className="h-4 w-4" />
            {activeVehicle ? "Add New" : "Add Vehicle"}
          </button>
        )}
      </div>

      {/* ── Insurance expiry alert ── */}
      {insExpiring && insExpDays !== null && !showForm && (
        <div className={`flex items-start gap-3 rounded-2xl border p-4 ${insExpDays < 14 ? "border-red-200 bg-red-50" : "border-amber-200 bg-amber-50"}`}>
          <AlertCircle className={`h-4 w-4 mt-0.5 shrink-0 ${insExpDays < 14 ? "text-red-500" : "text-amber-500"}`} />
          <div>
            <p className={`text-sm font-semibold ${insExpDays < 14 ? "text-red-800" : "text-amber-800"}`}>
              {insExpDays < 0 ? "Insurance expired!" : `Insurance expires in ${insExpDays} days`}
            </p>
            <p className={`text-xs mt-0.5 ${insExpDays < 14 ? "text-red-600" : "text-amber-600"}`}>
              Upload a renewed certificate to keep your vehicle active.
            </p>
          </div>
        </div>
      )}

      {/* ── Pending switch notice ── */}
      {pendingSwitch && !showForm && (
        <div className="flex items-center gap-3 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3">
          <Clock className="h-4 w-4 text-blue-500 shrink-0" />
          <p className="text-sm text-blue-700">
            Vehicle switch request is pending admin approval —
            <span className="font-semibold"> {pendingSwitch.new_value}</span>
          </p>
        </div>
      )}

      {/* ════════════════════════════════════
           ADD VEHICLE FORM
      ════════════════════════════════════ */}
      {showForm && (
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          {/* Form header */}
          <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-5 py-4">
            <StepBar current={formStep} steps={FORM_STEPS} />
            <button onClick={resetForm} className="rounded-xl border border-gray-200 p-2 text-gray-400 hover:bg-white hover:text-gray-700 transition">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-5">

            {/* ── STEP 1: Category ── */}
            {formStep === 1 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Select vehicle category</h3>
                  <p className="mt-1 text-sm text-gray-500">Choose the category that matches your vehicle type.</p>
                </div>

                {categories.length === 0 ? (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-700">
                    No categories configured. Please contact admin.
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {categories.map(cat => (
                      <button key={cat.id} type="button" onClick={() => setSelCategoryId(cat.id)}
                        className={`flex flex-col gap-1 rounded-2xl border-2 p-4 text-left transition
                          ${selCategoryId === cat.id ? "border-[#0b66d1] bg-blue-50" : "border-gray-100 bg-gray-50 hover:border-gray-200"}`}>
                        <p className={`text-sm font-bold ${selCategoryId === cat.id ? "text-[#0b66d1]" : "text-gray-900"}`}>{cat.name}</p>
                        {cat.description && <p className="text-xs text-gray-500">{cat.description}</p>}
                        <div className="flex items-center gap-3 mt-1">
                          {cat.max_pax && <span className="text-[10px] font-semibold text-gray-400">Up to {cat.max_pax} passengers</span>}
                          {cat.max_luggage && <span className="text-[10px] font-semibold text-gray-400">{cat.max_luggage} bags</span>}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button onClick={goNext} disabled={!selCategoryId}
                    className={`${DRIVER_THEME.btnPrimary} disabled:opacity-40`}>
                    Next: Make <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 2: Make ── */}
            {formStep === 2 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Select make</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Showing makes for <span className="font-semibold text-[#0b66d1]">{selCategory?.name}</span>
                  </p>
                </div>

                {filteredMakes.length === 0 ? (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-700">
                    No makes available for this category. Contact admin.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {filteredMakes.map(mk => (
                      <button key={mk.id} type="button" onClick={() => { setSelMakeId(mk.id); setSelModelId(""); setSelVariant(""); }}
                        className={`rounded-2xl border-2 px-4 py-3 text-left text-sm font-semibold transition
                          ${selMakeId === mk.id ? "border-[#0b66d1] bg-blue-50 text-[#0b66d1]" : "border-gray-100 bg-gray-50 text-gray-900 hover:border-gray-200"}`}>
                        {mk.name}
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <button onClick={goBack} className={DRIVER_THEME.btnSecondary}>
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                  <button onClick={goNext} disabled={!selMakeId}
                    className={`${DRIVER_THEME.btnPrimary} disabled:opacity-40`}>
                    Next: Model <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 3: Model + Variant ── */}
            {formStep === 3 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Select model</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    <span className="font-semibold text-[#0b66d1]">{selCategory?.name} · {selMake?.name}</span>
                  </p>
                </div>

                {filteredModels.length === 0 ? (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-700">
                    No models available for {selMake?.name}. Contact admin.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {filteredModels.map(md => (
                      <button key={md.id} type="button" onClick={() => { setSelModelId(md.id); setSelVariant(""); }}
                        className={`rounded-2xl border-2 px-4 py-3 text-left text-sm font-semibold transition
                          ${selModelId === md.id ? "border-[#0b66d1] bg-blue-50 text-[#0b66d1]" : "border-gray-100 bg-gray-50 text-gray-900 hover:border-gray-200"}`}>
                        {md.name}
                      </button>
                    ))}
                  </div>
                )}

                {/* Variant */}
                {selModelId && variants.length > 0 && (
                  <div>
                    <label className="mb-2 block text-xs font-semibold text-gray-600">Variant <span className="text-gray-400 font-normal">(optional)</span></label>
                    <div className="flex flex-wrap gap-2">
                      {variants.map((v: string) => (
                        <button key={v} type="button" onClick={() => setSelVariant(selVariant === v ? "" : v)}
                          className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition
                            ${selVariant === v ? "border-[#0b66d1] bg-blue-50 text-[#0b66d1]" : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"}`}>
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <button onClick={goBack} className={DRIVER_THEME.btnSecondary}>
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                  <button onClick={goNext} disabled={!selModelId}
                    className={`${DRIVER_THEME.btnPrimary} disabled:opacity-40`}>
                    Next: Details <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 4: Details ── */}
            {formStep === 4 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Vehicle details</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {selCategory?.name} · {selMake?.name} {selModel?.name}{selVariant ? ` ${selVariant}` : ""}
                  </p>
                </div>

                {activeVehicle?.status === "approved" && (
                  <div className="flex items-start gap-2.5 rounded-2xl border border-blue-100 bg-blue-50 p-3.5">
                    <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-700">Your current vehicle stays active until admin approves this new one.</p>
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <SelectDropdown label="Year" required value={year} options={YEARS} onChange={setYear} placeholder="Select year" />
                  <SelectDropdown label="Color" required value={color} options={COLORS} onChange={setColor} placeholder="Select color" />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-gray-600">License Plate <span className="text-[#0b66d1]">*</span></label>
                  <input value={plate} onChange={e => setPlate(e.target.value.toUpperCase())}
                    placeholder="e.g. ABC 1234" className={inp} />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-gray-600">Mileage (km) <span className="text-gray-400 font-normal">optional</span></label>
                  <input type="number" value={mileage} onChange={e => setMileage(e.target.value)}
                    placeholder="e.g. 25000" className={inp} />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button onClick={goBack} className={DRIVER_THEME.btnSecondary}>
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                  <button onClick={handleSaveVehicle} disabled={saving || !selCategoryId || !selMakeId || !selModelId || !year || !color || !plate}
                    className={`${DRIVER_THEME.btnPrimary} disabled:opacity-40`}>
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Next: Documents <ChevronRight className="h-4 w-4" /></>}
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 5: Documents ── */}
            {formStep === 5 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Upload documents</h3>
                  <p className="mt-1 text-sm text-gray-500">Required for approval. You can skip and upload later.</p>
                </div>

                <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-700">
                  Vehicle saved! Documents are reviewed within 1–2 business days.
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-600">Registration Certificate <span className="text-[#0b66d1]">*</span></label>
                    <div className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition ${regFile ? "border-[#0b66d1] bg-blue-50" : "border-dashed border-gray-200 hover:border-gray-300"}`}
                      onClick={() => document.getElementById("reg-upload")?.click()}>
                      <FileText className={`h-5 w-5 shrink-0 ${regFile ? "text-[#0b66d1]" : "text-gray-300"}`} />
                      <span className="text-sm text-gray-600 flex-1 truncate">{regFile ? regFile.name : "Click to upload"}</span>
                      {regFile && <button onClick={e => { e.stopPropagation(); setRegFile(null); }}><X className="h-4 w-4 text-gray-400" /></button>}
                    </div>
                    <input id="reg-upload" type="file" accept=".jpg,.jpeg,.png,.pdf,.webp" className="hidden" onChange={e => setRegFile(e.target.files?.[0] ?? null)} />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-600">Insurance Certificate <span className="text-[#0b66d1]">*</span></label>
                    <div className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition ${insFile ? "border-[#0b66d1] bg-blue-50" : "border-dashed border-gray-200 hover:border-gray-300"}`}
                      onClick={() => document.getElementById("ins-upload")?.click()}>
                      <Shield className={`h-5 w-5 shrink-0 ${insFile ? "text-[#0b66d1]" : "text-gray-300"}`} />
                      <span className="text-sm text-gray-600 flex-1 truncate">{insFile ? insFile.name : "Click to upload"}</span>
                      {insFile && <button onClick={e => { e.stopPropagation(); setInsFile(null); }}><X className="h-4 w-4 text-gray-400" /></button>}
                    </div>
                    <input id="ins-upload" type="file" accept=".jpg,.jpeg,.png,.pdf,.webp" className="hidden" onChange={e => setInsFile(e.target.files?.[0] ?? null)} />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-600">Insurance Expiry Date</label>
                    <input type="date" value={insExpiry} onChange={e => setInsExpiry(e.target.value)}
                      min={new Date().toISOString().split("T")[0]} className={inp} />
                  </div>
                </div>

                {/* Photos */}
                <PhotoUploadGrid
                  label="Exterior Photos"
                  note="Front, rear, left, right (max 6)"
                  existingUrls={[]}
                  newFiles={extPhotos}
                  onAddFiles={files => setExtPhotos(prev => [...prev, ...files])}
                  onRemoveNew={i => setExtPhotos(prev => prev.filter((_, idx) => idx !== i))}
                  maxPhotos={6}
                />

                <PhotoUploadGrid
                  label="Interior Photos"
                  note="Dashboard, seats (max 4)"
                  existingUrls={[]}
                  newFiles={intPhotos}
                  onAddFiles={files => setIntPhotos(prev => [...prev, ...files])}
                  onRemoveNew={i => setIntPhotos(prev => prev.filter((_, idx) => idx !== i))}
                  maxPhotos={4}
                />

                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between border-t border-gray-100 pt-4">
                  <button onClick={async () => { toast.success("Add documents later from vehicle page."); resetForm(); await loadData(); }}
                    className={DRIVER_THEME.btnSecondary}>
                    Skip for now
                  </button>
                  <button onClick={handleSaveDocs} disabled={saving}
                    className={`${DRIVER_THEME.btnPrimary} disabled:opacity-60`}>
                    {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Uploading…</> : <><CheckCircle className="h-4 w-4" /> Submit for Approval</>}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════
           VEHICLE VIEW
      ════════════════════════════════════ */}
      {!showForm && (
        <>
          {/* Tabs */}
          {allVehicles.length > 0 && (
            <div className="flex overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              {(["vehicle","history"] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`flex flex-1 items-center justify-center py-3 text-sm font-semibold capitalize transition border-b-2
                    ${activeTab === tab ? "border-[#0b66d1] text-[#0b66d1]" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
                  {tab === "vehicle" ? "Active Vehicle" : "History"}
                </button>
              ))}
            </div>
          )}

          {/* ── Active Vehicle Tab ── */}
          {activeTab === "vehicle" && (
            <>
              {/* No vehicle */}
              {!activeVehicle && (
                <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white p-12 text-center">
                  <Car className="mx-auto h-10 w-10 text-gray-200 mb-3" />
                  <p className="text-base font-bold text-gray-900">No vehicle added yet</p>
                  <p className="mt-1.5 text-sm text-gray-400 max-w-xs mx-auto">Add your vehicle to complete your driver profile and start accepting rides.</p>
                  <button onClick={() => setShowForm(true)} className={`mt-6 inline-flex ${DRIVER_THEME.btnPrimary}`}>
                    <Plus className="h-4 w-4" /> Add Vehicle
                  </button>
                </div>
              )}

              {/* Active vehicle card */}
              {activeVehicle && (
                <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                  {/* Color bar */}
                  <div className="h-1.5" style={{
                    background: activeVehicle.status === "approved" ? "#10b981" : activeVehicle.status === "rejected" ? "#ef4444" : "#f59e0b"
                  }} />

                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-xl font-bold text-white shadow-sm"
                        style={{ background: "linear-gradient(135deg, #0b66d1, #0952a8)" }}>
                        {activeVehicle.make?.slice(0,2).toUpperCase() || "VH"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-bold text-gray-900">
                            {activeVehicle.year} {activeVehicle.make} {activeVehicle.model}
                            {activeVehicle.variant ? ` ${activeVehicle.variant}` : ""}
                          </h3>
                          <StatusBadge status={activeVehicle.status} />
                          <span className="rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[10px] font-bold text-[#0b66d1]">ACTIVE</span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          <span className="capitalize">{activeVehicle.color}</span>
                          {" · "}<span className="font-mono font-semibold text-gray-700">{activeVehicle.registration}</span>
                          {activeVehicle.mileage && <> · {Number(activeVehicle.mileage).toLocaleString()} km</>}
                        </p>
                        <p className="mt-0.5 text-xs text-[#0b66d1] font-medium capitalize">
                          {categories.find(c => c.id === activeVehicle.vehicle_class || c.id === activeVehicle.vehicle_category_id)?.name || activeVehicle.vehicle_class}
                        </p>
                      </div>
                    </div>

                    {/* Status messages */}
                    {activeVehicle.status === "pending" && (
                      <div className="mt-4 flex items-center gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
                        <Clock className="h-4 w-4 text-amber-500 shrink-0" />
                        <p className="text-sm text-amber-700">Under admin review. You'll be notified when approved.</p>
                      </div>
                    )}
                    {activeVehicle.status === "approved" && (
                      <div className="mt-4 flex items-center gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                        <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                        <p className="text-sm text-emerald-700">Vehicle approved and active. To switch, add a new vehicle — this stays active until it's approved.</p>
                      </div>
                    )}
                    {activeVehicle.status === "rejected" && (
                      <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4">
                        <p className="text-sm font-semibold text-red-700">Vehicle Rejected</p>
                        {activeVehicle.rejection_reason && <p className="text-sm text-red-600 mt-1">{activeVehicle.rejection_reason}</p>}
                        <button onClick={() => setShowForm(true)} className="mt-2 text-xs font-semibold text-red-700 underline">
                          Add a new vehicle →
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Stats row */}
                  <div className="border-t border-gray-50 grid grid-cols-3 divide-x divide-gray-100">
                    {[
                      { label: "Added",    value: fmtShort(activeVehicle.created_at) },
                      { label: "Approved", value: activeVehicle.approved_at ? fmtShort(activeVehicle.approved_at) : "Pending" },
                      { label: "Insurance", value: activeVehicle.insurance_expiry ? fmtShort(activeVehicle.insurance_expiry) : "—" },
                    ].map(s => (
                      <div key={s.label} className="px-4 py-3 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">{s.label}</p>
                        <p className="mt-0.5 text-sm font-semibold text-gray-900">{s.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Documents */}
                  <div className="border-t border-gray-100 px-5 py-4">
                    <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">Documents</p>
                    <div className="space-y-2">
                      <DocRow
                        label="Registration Certificate"
                        url={activeVehicle.reg_doc_url}
                        file={newRegFile} onSet={setNewRegFile}
                        onSave={() => replaceDoc("reg")}
                        saving={savingDoc === "reg"}
                        status={rejReg ? "rejected" : penReg ? "pending" : activeVehicle.reg_doc_url ? "approved" : undefined}
                        adminNote={rejReg?.admin_note}
                      />
                      <DocRow
                        label="Insurance Certificate"
                        url={activeVehicle.insurance_url}
                        file={newInsFile} onSet={setNewInsFile}
                        onSave={() => replaceDoc("ins")}
                        saving={savingDoc === "ins"}
                        status={rejIns ? "rejected" : penIns ? "pending" : activeVehicle.insurance_url ? "approved" : undefined}
                        adminNote={rejIns?.admin_note}
                      />
                    </div>
                    {activeVehicle.insurance_expiry && (
                      <p className={`mt-2 text-xs px-1 ${insExpiring ? "font-semibold text-amber-600" : "text-gray-400"}`}>
                        Insurance expires: {fmtDate(activeVehicle.insurance_expiry)}
                        {insExpDays !== null && insExpDays >= 0 && insExpDays < 90 && ` — ${insExpDays} days left`}
                        {insExpDays !== null && insExpDays < 0 && " — EXPIRED"}
                      </p>
                    )}
                  </div>

                  {/* Photos */}
                  {(activeVehicle.exterior_photos?.length > 0 || activeVehicle.interior_photos?.length > 0) && (
                    <div className="border-t border-gray-100 px-5 py-4 space-y-4">
                      {activeVehicle.exterior_photos?.length > 0 && (
                        <div>
                          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">Exterior Photos</p>
                          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                            {activeVehicle.exterior_photos.map((url: string, i: number) => (
                              <a key={i} href={url} target="_blank" rel="noreferrer"
                                className="group relative aspect-video overflow-hidden rounded-xl bg-gray-100 block">
                                <img src={url} alt="" className="h-full w-full object-cover" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition">
                                  <Eye className="h-4 w-4 text-white opacity-0 group-hover:opacity-100" />
                                </div>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                      {activeVehicle.interior_photos?.length > 0 && (
                        <div>
                          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">Interior Photos</p>
                          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                            {activeVehicle.interior_photos.map((url: string, i: number) => (
                              <a key={i} href={url} target="_blank" rel="noreferrer"
                                className="group relative aspect-video overflow-hidden rounded-xl bg-gray-100 block">
                                <img src={url} alt="" className="h-full w-full object-cover" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition">
                                  <Eye className="h-4 w-4 text-white opacity-0 group-hover:opacity-100" />
                                </div>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Other approved vehicles — switch */}
              {otherApproved.length > 0 && (
                <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                  <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-50">
                    <p className="text-sm font-semibold text-gray-900">Switch Vehicle</p>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">{otherApproved.length}</span>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {otherApproved.map(v => {
                      const switchPending = docHistory.some(r => r.vehicle_id === v.id && r.field_name === "vehicle_activation" && r.status === "pending");
                      return (
                        <div key={v.id} className="flex items-center justify-between gap-3 px-5 py-4">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {v.year} {v.make} {v.model}{v.variant ? ` ${v.variant}` : ""}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              <span className="capitalize">{v.color}</span>
                              {" · "}<span className="font-mono font-semibold">{v.registration}</span>
                            </p>
                          </div>
                          {switchPending
                            ? <span className="shrink-0 flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                                <Clock className="h-3 w-3" /> Pending
                              </span>
                            : <button onClick={() => requestSwitch(v.id, `${v.year} ${v.make} ${v.model} (${v.registration})`)}
                                className="shrink-0 flex items-center gap-1.5 rounded-xl border border-[#0b66d1] bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#0b66d1] hover:bg-blue-100 transition">
                                <Send className="h-3 w-3" /> Request Switch
                              </button>
                          }
                        </div>
                      );
                    })}
                  </div>
                  <div className="border-t border-gray-50 px-5 py-3 bg-gray-50">
                    <p className="text-xs text-gray-500">Switch request requires admin approval. Your current vehicle stays active until approved.</p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── History Tab ── */}
          {activeTab === "history" && (
            <div className="space-y-3">
              {vehicleHistory.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white p-10 text-center">
                  <History className="mx-auto h-8 w-8 text-gray-200 mb-2" />
                  <p className="text-sm text-gray-400">No vehicle history yet</p>
                </div>
              ) : (
                vehicleHistory.map(v => (
                  <div key={v.id} className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between p-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {v.year} {v.make} {v.model}{v.variant ? ` ${v.variant}` : ""}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          <span className="capitalize">{v.color}</span>
                          {" · "}<span className="font-mono font-semibold">{v.registration}</span>
                          {" · "}Added {fmtShort(v.created_at)}
                        </p>
                      </div>
                      <StatusBadge status={v.status} />
                    </div>
                    {v.status === "rejected" && v.rejection_reason && (
                      <div className="border-t border-red-100 bg-red-50 px-4 py-3">
                        <p className="text-xs text-red-700">
                          <span className="font-semibold">Reason: </span>{v.rejection_reason}
                        </p>
                      </div>
                    )}
                    {/* Doc history for this vehicle */}
                    {docHistory.filter(r => r.vehicle_id === v.id).length > 0 && (
                      <div className="border-t border-gray-50 px-4 py-3 space-y-1.5">
                        {docHistory.filter(r => r.vehicle_id === v.id).map(req => (
                          <div key={req.id} className="flex items-center justify-between text-xs">
                            <span className="text-gray-500 capitalize">{req.field_name.replace(/_/g, " ")}</span>
                            <div className="flex items-center gap-2">
                              <StatusBadge status={req.status} />
                              {req.file_url && (
                                <a href={req.file_url} target="_blank" rel="noreferrer" className="text-[#0b66d1] hover:underline">View</a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}