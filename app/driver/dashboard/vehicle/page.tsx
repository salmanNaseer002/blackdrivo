"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Car, CheckCircle, AlertCircle, ExternalLink, Plus, X,
  ChevronDown, Search, Upload, Loader2, Lock, Clock, RefreshCw,
  ChevronRight, History, Send,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { VEHICLE_MAKES, VEHICLE_COLORS, getModelsForMake, getVariantsForModel, getYearOptions } from "@/lib/data/vehicles";
import { DRIVER_THEME, fmtShort, fmtDate } from "@/lib/driver/theme";

// ── Helpers ───────────────────────────────────────────────────────
const inputClass = "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20";

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; border: string }> = {
  approved: { label: "✓ Approved",      bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  pending:  { label: "⏳ Pending Review", bg: "bg-amber-50",   text: "text-amber-700",  border: "border-amber-200"  },
  rejected: { label: "✗ Rejected",       bg: "bg-red-50",     text: "text-red-600",    border: "border-red-200"    },
};

// ── Searchable Dropdown ───────────────────────────────────────────
function SearchDropdown({ label, value, options, onChange, placeholder, required, disabled }: any) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const filtered = options.filter((o: string) => o.toLowerCase().includes(query.toLowerCase()));
  useEffect(() => {
    const h = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} className="relative">
      {label && <label className="mb-1.5 block text-xs font-medium text-gray-700">{label}{required && <span style={{ color: DRIVER_THEME.primary }}> *</span>}</label>}
      <button type="button" disabled={disabled} onClick={() => { setOpen(!open); setQuery(""); }}
        className={`${inputClass} flex items-center justify-between text-left ${disabled ? "cursor-not-allowed bg-gray-50 opacity-50" : "cursor-pointer"} ${value ? "text-gray-900" : "text-gray-400"}`}>
        <span className="truncate">{value || placeholder}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-gray-400 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-xl">
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input autoFocus value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search..." className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-8 pr-3 text-sm outline-none" />
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto p-1">
            {filtered.length === 0
              ? <p className="px-3 py-4 text-center text-sm text-gray-400">No results</p>
              : filtered.map((opt: string) => (
                <button key={opt} type="button" onClick={() => { onChange(opt); setOpen(false); setQuery(""); }}
                  className={`w-full rounded-lg px-3 py-2.5 text-left text-sm transition hover:bg-blue-50 ${value === opt ? "bg-blue-50 font-medium text-[#0b66d1]" : "text-gray-700"}`}>
                  {opt}
                </button>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
}

// ── Doc upload slot ───────────────────────────────────────────────
function DocSlot({ label, file, onSet, currentUrl, required, accept = ".jpg,.jpeg,.png,.pdf,.webp" }: {
  label: string; file: File | null; onSet: (f: File | null) => void;
  currentUrl?: string | null; required?: boolean; accept?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-gray-700">
        {label}{required && <span style={{ color: DRIVER_THEME.primary }}> *</span>}
      </label>
      <input ref={ref} type="file" accept={accept} className="hidden"
        onChange={e => onSet(e.target.files?.[0] ?? null)} />
      <div onClick={() => ref.current?.click()}
        className={`flex cursor-pointer items-center justify-between rounded-xl border p-3.5 transition ${
          file ? "border-blue-200 bg-blue-50"
          : currentUrl ? "border-emerald-200 bg-emerald-50"
          : "border-dashed border-gray-200 hover:border-gray-300 hover:bg-gray-50"
        }`}>
        <div className="flex items-center gap-3 min-w-0 overflow-hidden">
          {file ? <CheckCircle className="h-4 w-4 shrink-0" style={{ color: DRIVER_THEME.primary }} />
            : currentUrl ? <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />
            : <Upload className="h-4 w-4 shrink-0 text-gray-400" />}
          <span className="truncate text-sm text-gray-600">
            {file ? file.name : currentUrl ? "Uploaded — click to replace" : "Click to upload"}
          </span>
        </div>
        <div className="flex items-center gap-2 ml-2 shrink-0">
          {currentUrl && !file && (
            <a href={currentUrl} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
              className="text-gray-400 hover:text-gray-700"><ExternalLink className="h-3.5 w-3.5" /></a>
          )}
          {file
            ? <button type="button" onClick={e => { e.stopPropagation(); onSet(null); }}
                className="rounded-full p-0.5 text-gray-400 hover:bg-gray-200"><X className="h-3.5 w-3.5" /></button>
            : <span className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600">
                {currentUrl ? "Replace" : "Browse"}
              </span>
          }
        </div>
      </div>
    </div>
  );
}

function MultiPhotoSlot({ label, files, onSet, note }: {
  label: string; files: File[]; onSet: (f: File[]) => void; note?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  useEffect(() => {
    const urls = files.map(f => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach(u => URL.revokeObjectURL(u));
  }, [files]);
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-gray-700">{label}</label>
      {note && <p className="mb-1.5 text-xs text-gray-400">{note}</p>}
      <input ref={ref} type="file" accept=".jpg,.jpeg,.png,.webp" multiple className="hidden"
        onChange={e => onSet([...files, ...Array.from(e.target.files ?? [])])} />
      {previews.length > 0 && (
        <div className="mb-2 grid grid-cols-4 gap-2">
          {previews.map((url, i) => (
            <div key={i} className="relative">
              <Image src={url} alt={`${i+1}`} width={80} height={60}
                className="h-20 w-full rounded-xl object-cover border-2 border-blue-200" />
              <button type="button" onClick={() => onSet(files.filter((_, idx) => idx !== i))}
                className="absolute right-1 top-1 rounded-full bg-white/90 p-0.5 shadow">
                <X className="h-3 w-3 text-gray-600" />
              </button>
            </div>
          ))}
        </div>
      )}
      <div onClick={() => ref.current?.click()}
        className="flex cursor-pointer items-center justify-between rounded-xl border border-dashed border-gray-200 p-3.5 hover:border-gray-300 hover:bg-gray-50 transition">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Upload className="h-4 w-4" />
          {files.length > 0 ? `${files.length} photo(s) — click to add more` : "Click to upload photos"}
        </div>
        <span className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600">Browse</span>
      </div>
    </div>
  );
}

const VEHICLE_CLASSES = [
  { id: "business",    label: "Business Class",  desc: "Sedan · up to 3 pax" },
  { id: "first_class", label: "First Class",     desc: "Luxury sedan · up to 3 pax" },
  { id: "suv",         label: "Business SUV",    desc: "SUV · up to 6 pax" },
  { id: "van",         label: "Business Van",    desc: "Van · up to 7 pax" },
];

// ── Main Page ─────────────────────────────────────────────────────
export default function VehiclePage() {
  const router = useRouter();
  const [userId,       setUserId]       = useState("");
  const [driverId,     setDriverId]     = useState("");
  const [activeVehicle,setActiveVehicle]= useState<any>(null);
  const [allVehicles,  setAllVehicles]  = useState<any[]>([]);
  const [pendingReqs,  setPendingReqs]  = useState<any[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [showForm,     setShowForm]     = useState(false);
  const [saving,       setSaving]       = useState(false);
  const [step,         setStep]         = useState<"details"|"documents">("details");
  const [newVehicleId, setNewVehicleId] = useState("");
  const [requestingId, setRequestingId] = useState("");

  const [form, setForm] = useState({ make: "", model: "", variant: "", year: "", color: "", registration: "", vehicleClass: "business", mileage: "" });
  const setF = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const [regFile,   setRegFile]   = useState<File | null>(null);
  const [insFile,   setInsFile]   = useState<File | null>(null);
  const [insExpiry, setInsExpiry] = useState("");
  const [extPhotos, setExtPhotos] = useState<File[]>([]);
  const [intPhotos, setIntPhotos] = useState<File[]>([]);

  const years    = getYearOptions();
  const models   = getModelsForMake(form.make);
  const variants = getVariantsForModel(form.make, form.model);

  const loadData = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.replace("/login"); return; }
    setUserId(user.id);
    const { data: drv } = await supabase.from("drivers").select("id").eq("user_id", user.id).maybeSingle();
    if (!drv) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const drvAny = drv as any;
    setDriverId(drvAny.id);

    const [{ data: all }, { data: reqs }] = await Promise.all([
      (supabase as any).from("driver_vehicles").select("*").eq("driver_id", drvAny.id).order("created_at", { ascending: false }),
      (supabase as any).from("driver_change_requests").select("*").eq("driver_id", drvAny.id).eq("field_name", "vehicle_activation").eq("status", "pending"),
    ]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const vehicles = (all || []) as any[];
    setAllVehicles(vehicles);
    setActiveVehicle(vehicles.find((v: any) => v.is_active) || null);
    setPendingReqs(reqs || []);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const uploadFile = async (supabase: any, file: File, path: string) => {
    const { error } = await supabase.storage.from("driver-documents").upload(path, file, { upsert: true });
    if (error) throw error;
    return supabase.storage.from("driver-documents").getPublicUrl(path).data.publicUrl;
  };

  // ── Step 1: Save vehicle details ──────────────────────────────
  const handleSaveVehicle = async () => {
    if (!form.make || !form.model || !form.year || !form.color || !form.registration) {
      toast.error("Fill all required fields"); return;
    }
    setSaving(true);
    try {
      const supabase = createClient();
      const isCurrentApproved = activeVehicle?.status === "approved";
      // If current active is not approved, deactivate it
      if (!isCurrentApproved && activeVehicle) {
        await (supabase as any).from("driver_vehicles").update({ is_active: false }).eq("id", activeVehicle.id);
      }
      const { data: newVeh, error } = await (supabase as any).from("driver_vehicles").insert({
        driver_id:     driverId,
        make:          form.make,
        model:         form.model,
        variant:       form.variant || null,
        year:          parseInt(form.year),
        color:         form.color,
        registration:  form.registration,
        vehicle_class: form.vehicleClass,
        mileage:       form.mileage ? parseInt(form.mileage) : null,
        status:        "pending",
        // Active only if no currently approved vehicle
        is_active:     !isCurrentApproved,
      }).select().single();
      if (error) throw error;
      await (supabase as any).from("driver_audit_log").insert({
        driver_id: driverId, action: "VEHICLE_ADDED",
        description: `${form.year} ${form.make} ${form.model}`, changed_by: "driver",
      });
      setNewVehicleId(newVeh.id);
      setStep("documents");
      toast.success("Vehicle saved! Now upload documents.");
    } catch (err: any) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  // ── Step 2: Save documents ────────────────────────────────────
  const handleSaveDocs = async () => {
    setSaving(true);
    try {
      const supabase = createClient();
      const base = userId;
      const updates: Record<string, any> = {};
      if (regFile)            updates.reg_doc_url      = await uploadFile(supabase, regFile,  `${base}/vehicle-reg.${regFile.name.split(".").pop()}`);
      if (insFile)            updates.insurance_url    = await uploadFile(supabase, insFile,  `${base}/vehicle-insurance.${insFile.name.split(".").pop()}`);
      if (insExpiry)          updates.insurance_expiry  = insExpiry;
      if (extPhotos.length > 0) updates.exterior_photos = await Promise.all(extPhotos.map((f, i) => uploadFile(supabase, f, `${base}/ext-${i+1}.${f.name.split(".").pop()}`)));
      if (intPhotos.length > 0) updates.interior_photos = await Promise.all(intPhotos.map((f, i) => uploadFile(supabase, f, `${base}/int-${i+1}.${f.name.split(".").pop()}`)));
      if (Object.keys(updates).length > 0) await (supabase as any).from("driver_vehicles").update(updates).eq("id", newVehicleId);
      toast.success("Submitted for review! Admin will approve soon.");
      resetForm();
      await loadData();
    } catch (err: any) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  const resetForm = () => {
    setShowForm(false); setStep("details"); setNewVehicleId("");
    setForm({ make: "", model: "", variant: "", year: "", color: "", registration: "", vehicleClass: "business", mileage: "" });
    setRegFile(null); setInsFile(null); setInsExpiry(""); setExtPhotos([]); setIntPhotos([]);
  };

  // ── Request activation of approved inactive vehicle ───────────
  const requestActivation = async (vehicleId: string, vehicleName: string) => {
    if (pendingReqs.some(r => r.vehicle_id === vehicleId)) {
      toast.error("Activation request already pending for this vehicle"); return;
    }
    setRequestingId(vehicleId);
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
      await (supabase as any).from("driver_audit_log").insert({
        driver_id:   driverId,
        action:      "VEHICLE_ACTIVATION_REQUESTED",
        description: `Driver requested activation of: ${vehicleName}`,
        changed_by:  "driver",
      });
      toast.success("Activation request sent to admin!");
      await loadData();
    } catch (err: any) { toast.error(err.message); }
    finally { setRequestingId(""); }
  };

  if (loading) return null;
  const inactiveApproved = allVehicles.filter(v => !v.is_active && v.status === "approved");
  const otherVehicles    = allVehicles.filter(v => !v.is_active && v.status !== "approved");

  return (
    <div className={DRIVER_THEME.pageWrapper}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className={DRIVER_THEME.pageTitle}>My Vehicle</h2>
          <p className={DRIVER_THEME.pageSub}>Manage your active vehicle and documents</p>
        </div>
        {!showForm && (
          <button onClick={() => { setShowForm(true); setStep("details"); }}
            className={DRIVER_THEME.btnPrimary}>
            <Plus className="h-4 w-4" />
            {activeVehicle ? "Add New Vehicle" : "Add Vehicle"}
          </button>
        )}
      </div>

      {/* ── Active Vehicle Card ── */}
      {activeVehicle && !showForm && (
        <div className={`${DRIVER_THEME.card} overflow-hidden`}>
          {/* Header */}
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl shrink-0"
                  style={{ backgroundColor: DRIVER_THEME.primary }}>
                  <Car className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-gray-900 text-base">
                      {activeVehicle.year} {activeVehicle.make} {activeVehicle.model}
                      {activeVehicle.variant ? ` ${activeVehicle.variant}` : ""}
                    </p>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border ${STATUS_CONFIG[activeVehicle.status]?.bg} ${STATUS_CONFIG[activeVehicle.status]?.text} ${STATUS_CONFIG[activeVehicle.status]?.border}`}>
                      {STATUS_CONFIG[activeVehicle.status]?.label}
                    </span>
                    <span className="rounded-full px-2.5 py-0.5 text-xs font-bold bg-[#0b66d1]/10 text-[#0b66d1] border border-[#0b66d1]/20">
                      ● Active
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {activeVehicle.color} · {activeVehicle.registration} · {activeVehicle.vehicle_class?.replace(/_/g, " ")}
                  </p>
                </div>
              </div>
              {activeVehicle.status === "approved" && <Lock className="h-4 w-4 text-gray-400 shrink-0 mt-1" />}
            </div>
          </div>

          <div className="p-5 space-y-5">
            {/* Rejection reason */}
            {activeVehicle.status === "rejected" && activeVehicle.rejection_reason && (
              <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-700">Vehicle Rejected</p>
                  <p className="text-sm text-red-600 mt-0.5">{activeVehicle.rejection_reason}</p>
                  <button onClick={() => { setShowForm(true); setStep("details"); }}
                    className="mt-2 text-xs font-semibold text-red-700 underline">
                    Add new vehicle →
                  </button>
                </div>
              </div>
            )}

            {activeVehicle.status === "approved" && (
              <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                <Lock className="h-4 w-4 shrink-0" />
                Approved and active. Add a new vehicle to request a change — this stays active until new one is approved.
              </div>
            )}

            {activeVehicle.status === "pending" && (
              <div className="flex items-center gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                <Clock className="h-4 w-4 shrink-0" />
                Vehicle is under review. You can still add rides once approved.
              </div>
            )}

            {/* Details grid */}
            <div className="grid gap-3 sm:grid-cols-4">
              {[
                { label: "Class",     value: activeVehicle.vehicle_class?.replace(/_/g, " ") },
                { label: "Mileage",   value: activeVehicle.mileage ? `${activeVehicle.mileage.toLocaleString()} km` : null },
                { label: "Submitted", value: fmtShort(activeVehicle.created_at) },
                { label: "Approved",  value: fmtShort(activeVehicle.approved_at) },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl bg-gray-50 px-4 py-3">
                  <p className={DRIVER_THEME.fieldLabel}>{label}</p>
                  <p className="mt-1 text-sm font-semibold capitalize text-gray-900">{value || "—"}</p>
                </div>
              ))}
            </div>

            {/* Documents */}
            <div>
              <p className={`${DRIVER_THEME.fieldLabel} mb-3`}>Documents</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  { label: "Registration Document", url: activeVehicle.reg_doc_url },
                  { label: "Insurance Certificate",  url: activeVehicle.insurance_url },
                ].map(({ label, url }) => (
                  <div key={label} className={`flex items-center justify-between rounded-xl border px-4 py-3 ${url ? "border-gray-100 bg-gray-50" : "border-red-100 bg-red-50"}`}>
                    <div className="flex items-center gap-2.5">
                      {url ? <CheckCircle className="h-4 w-4 text-emerald-500" /> : <AlertCircle className="h-4 w-4 text-red-400" />}
                      <p className="text-sm font-medium text-gray-900">{label}</p>
                    </div>
                    {url
                      ? <a href={url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs font-medium" style={{ color: DRIVER_THEME.primary }}>
                          View <ExternalLink className="h-3 w-3" />
                        </a>
                      : <span className="text-xs text-red-500">Missing</span>
                    }
                  </div>
                ))}
              </div>
              {activeVehicle.insurance_expiry && (
                <p className="mt-2 text-xs text-gray-400">Insurance expires: {fmtDate(activeVehicle.insurance_expiry)}</p>
              )}
            </div>

            {/* Photos preview */}
            {activeVehicle.exterior_photos?.length > 0 && (
              <div>
                <p className={`${DRIVER_THEME.fieldLabel} mb-3`}>Exterior Photos</p>
                <div className="grid grid-cols-4 gap-2">
                  {activeVehicle.exterior_photos.map((url: string, i: number) => (
                    <a key={i} href={url} target="_blank" rel="noreferrer"
                      className="group relative aspect-video overflow-hidden rounded-xl bg-gray-100 block">
                      <img src={url} alt={`Ext ${i+1}`} className="h-full w-full object-cover transition group-hover:opacity-80" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 transition">
                        <ExternalLink className="h-3.5 w-3.5 text-white" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
            {activeVehicle.interior_photos?.length > 0 && (
              <div>
                <p className={`${DRIVER_THEME.fieldLabel} mb-3`}>Interior Photos</p>
                <div className="grid grid-cols-4 gap-2">
                  {activeVehicle.interior_photos.map((url: string, i: number) => (
                    <a key={i} href={url} target="_blank" rel="noreferrer"
                      className="group relative aspect-video overflow-hidden rounded-xl bg-gray-100 block">
                      <img src={url} alt={`Int ${i+1}`} className="h-full w-full object-cover transition group-hover:opacity-80" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 transition">
                        <ExternalLink className="h-3.5 w-3.5 text-white" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* No vehicle */}
      {!activeVehicle && !showForm && (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white p-14 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50">
            <Car className="h-7 w-7 text-gray-300" />
          </div>
          <p className="text-base font-semibold text-gray-900">No active vehicle</p>
          <p className="mt-1 text-sm text-gray-400">Add your vehicle to complete your application</p>
          <button onClick={() => setShowForm(true)} className={`mt-5 inline-flex ${DRIVER_THEME.btnPrimary}`}>
            <Plus className="h-4 w-4" /> Add Vehicle
          </button>
        </div>
      )}

      {/* ── Add Vehicle Form ── */}
      {showForm && (
        <div className={`${DRIVER_THEME.card} overflow-hidden`}>
          <div className={DRIVER_THEME.cardHeader}>
            <div className="flex items-center gap-3">
              {(["details", "documents"] as const).map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold"
                    style={step === s || (step === "documents" && s === "details")
                      ? { backgroundColor: DRIVER_THEME.primary, color: "white" }
                      : { backgroundColor: "#f3f4f6", color: "#9ca3af" }}>
                    {step === "documents" && s === "details" ? "✓" : i + 1}
                  </div>
                  <span className={`text-sm font-medium ${step === s ? "text-gray-900" : "text-gray-400"}`}>
                    {s === "details" ? "Vehicle Details" : "Documents"}
                  </span>
                  {i === 0 && <ChevronRight className="h-4 w-4 text-gray-300" />}
                </div>
              ))}
            </div>
            <button onClick={resetForm} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-5 space-y-4">
            {activeVehicle && step === "details" && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                ⚠️ New vehicle will need admin approval.
                {activeVehicle.status === "approved" ? " Your current approved vehicle stays active until new one is approved." : ""}
              </div>
            )}

            {step === "details" && (
              <>
                <SearchDropdown label="Make" required value={form.make}
                  options={VEHICLE_MAKES.map(m => m.name)}
                  onChange={(v: string) => { setF("make", v); setF("model", ""); setF("variant", ""); }}
                  placeholder="Select make" />
                <SearchDropdown label="Model" required value={form.model}
                  options={models.map(m => m.name)}
                  onChange={(v: string) => { setF("model", v); setF("variant", ""); }}
                  placeholder={form.make ? "Select model" : "Select make first"} disabled={!form.make} />
                {variants.length > 0 && (
                  <SearchDropdown label="Variant" value={form.variant}
                    options={variants} onChange={(v: string) => setF("variant", v)}
                    placeholder="Select variant (optional)" />
                )}
                <div className="grid gap-4 sm:grid-cols-2">
                  <SearchDropdown label="Year" required value={form.year}
                    options={years.map(String)} onChange={(v: string) => setF("year", v)} placeholder="Year" />
                  <SearchDropdown label="Color" required value={form.color}
                    options={VEHICLE_COLORS} onChange={(v: string) => setF("color", v)} placeholder="Color" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-700">License Plate *</label>
                    <input value={form.registration} onChange={e => setF("registration", e.target.value)} placeholder="ABC 1234" className={inputClass} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-700">Mileage (km)</label>
                    <input type="number" value={form.mileage} onChange={e => setF("mileage", e.target.value)} placeholder="e.g. 25000" className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-medium text-gray-700">Vehicle Class *</label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {VEHICLE_CLASSES.map(vc => (
                      <button key={vc.id} type="button" onClick={() => setF("vehicleClass", vc.id)}
                        className={`rounded-xl border p-3 text-left transition ${form.vehicleClass === vc.id ? "border-[#0b66d1] bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}>
                        <p className="text-sm font-medium text-gray-900">{vc.label}</p>
                        <p className="text-xs text-gray-400">{vc.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button onClick={handleSaveVehicle} disabled={saving} className={`${DRIVER_THEME.btnPrimary} disabled:opacity-60`}>
                    {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : "Next: Documents →"}
                  </button>
                </div>
              </>
            )}

            {step === "documents" && (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <DocSlot label="Registration Document" required file={regFile} onSet={setRegFile} />
                  <DocSlot label="Insurance Certificate"  required file={insFile} onSet={setInsFile} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">Insurance Expiry Date</label>
                  <input type="date" value={insExpiry} onChange={e => setInsExpiry(e.target.value)}
                    className={inputClass} style={{ maxWidth: 220 }} />
                </div>
                <MultiPhotoSlot label="Exterior Photos (Front, Back, Left, Right)"
                  files={extPhotos} onSet={setExtPhotos} note="4 photos — front, back, left side, right side" />
                <MultiPhotoSlot label="Interior Photos (Dashboard, Front Seat, Back Seat)"
                  files={intPhotos} onSet={setIntPhotos} note="Dashboard, front seat, back seat" />
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <button onClick={async () => {
                    toast.success("Saved as draft — upload documents later.");
                    resetForm(); await loadData();
                  }} className={DRIVER_THEME.btnSecondary}>
                    Save as Draft
                  </button>
                  <button onClick={handleSaveDocs} disabled={saving} className={`${DRIVER_THEME.btnPrimary} disabled:opacity-60`}>
                    {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : <><CheckCircle className="h-4 w-4" /> Submit for Approval</>}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Inactive Approved Vehicles (switchable) ── */}
      {inactiveApproved.length > 0 && (
        <div className={`${DRIVER_THEME.card} overflow-hidden`}>
          <div className={DRIVER_THEME.cardHeader}>
            <div className="flex items-center gap-2">
              <Car className="h-4 w-4 text-gray-400" />
              <p className="text-sm font-semibold text-gray-900">Other Approved Vehicles</p>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">{inactiveApproved.length}</span>
            </div>
            <p className="text-xs text-gray-400">Request activation to switch your active vehicle</p>
          </div>
          <div className="divide-y divide-gray-50">
            {inactiveApproved.map(v => {
              const hasPendingReq = pendingReqs.some(r => r.vehicle_id === v.id);
              return (
                <div key={v.id} className="px-5 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                        <Car className="h-4 w-4 text-gray-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {v.year} {v.make} {v.model}{v.variant ? ` ${v.variant}` : ""}
                        </p>
                        <p className="text-xs text-gray-500">{v.color} · {v.registration} · {v.vehicle_class?.replace(/_/g, " ")}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Added {fmtShort(v.created_at)}</p>
                      </div>
                    </div>
                    <div className="shrink-0">
                      {hasPendingReq ? (
                        <span className="flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700">
                          <Clock className="h-3 w-3" /> Request Pending
                        </span>
                      ) : (
                        <button onClick={() => requestActivation(v.id, `${v.year} ${v.make} ${v.model} (${v.registration})`)}
                          disabled={requestingId === v.id}
                          className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition disabled:opacity-60"
                          style={{ borderColor: DRIVER_THEME.primary, color: DRIVER_THEME.primary, backgroundColor: DRIVER_THEME.primaryLight }}>
                          {requestingId === v.id
                            ? <><Loader2 className="h-3 w-3 animate-spin" /> Sending…</>
                            : <><Send className="h-3 w-3" /> Request Activation</>
                          }
                        </button>
                      )}
                    </div>
                  </div>
                  {/* Vehicle docs summary */}
                  <div className="mt-3 flex items-center gap-3">
                    {[{ label: "Reg", url: v.reg_doc_url }, { label: "Insurance", url: v.insurance_url }].map(({ label, url }) => (
                      <div key={label} className={`flex items-center gap-1.5 text-xs ${url ? "text-emerald-600" : "text-gray-400"}`}>
                        {url ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                        {label}
                      </div>
                    ))}
                    {v.exterior_photos?.length > 0 && (
                      <div className="flex items-center gap-1.5 text-xs text-emerald-600">
                        <CheckCircle className="h-3 w-3" /> {v.exterior_photos.length} photos
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Vehicle History (pending/rejected) ── */}
      {otherVehicles.length > 0 && (
        <div className={`${DRIVER_THEME.card} overflow-hidden`}>
          <div className={DRIVER_THEME.cardHeader}>
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-gray-400" />
              <p className="text-sm font-semibold text-gray-900">Previous Vehicles</p>
            </div>
          </div>
          <div className="divide-y divide-gray-50">
            {otherVehicles.map(v => (
              <div key={v.id} className="px-5 py-3.5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {v.year} {v.make} {v.model} — {v.color}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{v.registration} · Added {fmtShort(v.created_at)}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border ${STATUS_CONFIG[v.status]?.bg} ${STATUS_CONFIG[v.status]?.text} ${STATUS_CONFIG[v.status]?.border}`}>
                    {STATUS_CONFIG[v.status]?.label || v.status}
                  </span>
                </div>
                {v.status === "rejected" && v.rejection_reason && (
                  <div className="mt-2 flex items-start gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2.5">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0 text-red-500 mt-0.5" />
                    <p className="text-xs text-red-600"><strong>Rejection reason:</strong> {v.rejection_reason}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
