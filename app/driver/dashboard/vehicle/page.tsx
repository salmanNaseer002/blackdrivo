"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Car, CheckCircle, AlertCircle, ExternalLink, History, Plus, X,
  ChevronDown, Search, Upload, Loader2, Lock, Clock, RefreshCw,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { VEHICLE_MAKES, VEHICLE_COLORS, getModelsForMake, getVariantsForModel, getYearOptions } from "@/lib/data/vehicles";
import { DRIVER_THEME, fmtShort, fmtDate } from "@/lib/driver/theme";

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
  const inputBase = "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition";
  return (
    <div ref={ref} className="relative">
      {label && <label className="mb-1.5 block text-xs font-medium text-gray-700">{label}{required && <span style={{ color: DRIVER_THEME.primary }}> *</span>}</label>}
      <button type="button" disabled={disabled} onClick={() => { setOpen(!open); setQuery(""); }}
        className={`${inputBase} flex items-center justify-between text-left ${disabled ? "cursor-not-allowed bg-gray-50 opacity-50" : "cursor-pointer"} ${value ? "text-gray-900" : "text-gray-400"}`}>
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

// ── File upload slot with versioning status ───────────────────────
function DocSlot({ label, activeUrl, pendingUrl, file, onSet, note, accept = ".jpg,.jpeg,.png,.pdf,.webp" }: {
  label: string; activeUrl?: string | null; pendingUrl?: string | null;
  file: File | null; onSet: (f: File | null) => void; note?: string; accept?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-medium text-gray-700">{label}</label>
        {pendingUrl && !file && (
          <span className="flex items-center gap-1 text-[10px] font-medium text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
            <Clock className="h-2.5 w-2.5" /> Pending Review
          </span>
        )}
        {activeUrl && !pendingUrl && (
          <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
            <CheckCircle className="h-2.5 w-2.5" /> Active
          </span>
        )}
      </div>
      {note && <p className="mb-2 text-xs text-gray-400">{note}</p>}
      <input ref={ref} type="file" accept={accept} className="hidden"
        onChange={e => onSet(e.target.files?.[0] ?? null)} />

      <div onClick={() => ref.current?.click()}
        className={`flex cursor-pointer items-center justify-between rounded-xl border p-3.5 transition ${
          file ? "border-blue-200 bg-blue-50"
          : pendingUrl ? "border-amber-200 bg-amber-50"
          : activeUrl ? "border-emerald-200 bg-emerald-50"
          : "border-dashed border-gray-200 hover:border-gray-300 hover:bg-gray-50"
        }`}>
        <div className="flex items-center gap-3 min-w-0 overflow-hidden">
          {file
            ? <CheckCircle className="h-4 w-4 shrink-0" style={{ color: DRIVER_THEME.primary }} />
            : pendingUrl
            ? <Clock className="h-4 w-4 shrink-0 text-amber-500" />
            : activeUrl
            ? <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />
            : <Upload className="h-4 w-4 shrink-0 text-gray-400" />
          }
          <span className="truncate text-sm text-gray-600">
            {file ? file.name
              : pendingUrl ? "Uploaded — pending admin review"
              : activeUrl ? "Uploaded — click to update"
              : "Click to upload"}
          </span>
        </div>
        <div className="flex items-center gap-2 ml-2 shrink-0">
          {(activeUrl || pendingUrl) && !file && (
            <a href={activeUrl || pendingUrl || ""} target="_blank" rel="noreferrer"
              onClick={e => e.stopPropagation()} className="text-gray-400 hover:text-gray-700">
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
          {file
            ? <button type="button" onClick={e => { e.stopPropagation(); onSet(null); }}
                className="rounded-full p-0.5 text-gray-400 hover:bg-gray-200"><X className="h-3.5 w-3.5" /></button>
            : <span className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600">
                {activeUrl || pendingUrl ? "Update" : "Browse"}
              </span>
          }
        </div>
      </div>
    </div>
  );
}

function MultiPhotoSlot({ label, activeUrls, files, onSet, note }: {
  label: string; activeUrls?: string[]; files: File[];
  onSet: (f: File[]) => void; note?: string;
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
      {note && <p className="mb-2 text-xs text-gray-400">{note}</p>}
      <input ref={ref} type="file" accept=".jpg,.jpeg,.png,.webp" multiple className="hidden"
        onChange={e => onSet([...files, ...Array.from(e.target.files ?? [])])} />

      {/* Active photos */}
      {activeUrls && activeUrls.length > 0 && files.length === 0 && (
        <div className="mb-2 grid grid-cols-4 gap-2">
          {activeUrls.map((url, i) => (
            <a key={i} href={url} target="_blank" rel="noreferrer"
              className="group relative aspect-video overflow-hidden rounded-xl bg-gray-100">
              <img src={url} alt={`${i+1}`} className="h-full w-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 transition">
                <ExternalLink className="h-4 w-4 text-white drop-shadow" />
              </div>
            </a>
          ))}
        </div>
      )}

      {/* New previews */}
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
              <div className="absolute left-1 top-1 rounded-full bg-[#0b66d1] px-1.5 py-0.5 text-[8px] font-bold text-white">NEW</div>
            </div>
          ))}
        </div>
      )}

      <div onClick={() => ref.current?.click()}
        className="flex cursor-pointer items-center justify-between rounded-xl border border-dashed border-gray-200 p-3.5 hover:border-gray-300 hover:bg-gray-50 transition">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Upload className="h-4 w-4" />
          {files.length > 0 ? `${files.length} new photo(s) — click to add more`
            : activeUrls && activeUrls.length > 0 ? `${activeUrls.length} active — click to replace`
            : "Click to upload photos"}
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
const inputClass = "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20";

export default function VehiclePage() {
  const router = useRouter();
  const [userId,      setUserId]      = useState("");
  const [driverId,    setDriverId]    = useState("");
  const [vehicle,     setVehicle]     = useState<any>(null);
  const [allVehicles, setAllVehicles] = useState<any[]>([]);
  const [pendingDocs, setPendingDocs] = useState<Record<string, string>>({});
  const [loading,     setLoading]     = useState(true);
  const [showForm,    setShowForm]    = useState(false);
  const [saving,      setSaving]      = useState(false);
  const [step,        setStep]        = useState<"details"|"documents">("details");
  const [newVehicleId,setNewVehicleId] = useState("");

  // Vehicle form
  const [form, setForm] = useState({ make: "", model: "", variant: "", year: "", color: "", registration: "", vehicleClass: "business", mileage: "" });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  // Document uploads
  const [regFile,      setRegFile]      = useState<File | null>(null);
  const [insFile,      setInsFile]      = useState<File | null>(null);
  const [insExpiry,    setInsExpiry]    = useState("");
  const [extPhotos,    setExtPhotos]    = useState<File[]>([]);
  const [intPhotos,    setIntPhotos]    = useState<File[]>([]);

  // Update existing vehicle docs
  const [updRegFile,   setUpdRegFile]   = useState<File | null>(null);
  const [updInsFile,   setUpdInsFile]   = useState<File | null>(null);
  const [updInsExpiry, setUpdInsExpiry] = useState("");
  const [updExtPhotos, setUpdExtPhotos] = useState<File[]>([]);
  const [updIntPhotos, setUpdIntPhotos] = useState<File[]>([]);
  const [updDashPhoto, setUpdDashPhoto] = useState<File | null>(null);
  const [savingDocs,   setSavingDocs]   = useState(false);
  const [showDocUpdate,setShowDocUpdate]= useState(false);

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
    setDriverId(drv.id);
    const [{ data: veh }, { data: all }] = await Promise.all([
      supabase.from("driver_vehicles").select("*").eq("driver_id", drv.id).eq("is_active", true).maybeSingle(),
      supabase.from("driver_vehicles").select("*").eq("driver_id", drv.id).order("created_at", { ascending: false }),
    ]);
    setVehicle(veh);
    setAllVehicles(all || []);
    if (veh?.insurance_expiry) setUpdInsExpiry(veh.insurance_expiry);

    // Fetch pending docs
    if (veh) {
      const { data: pending } = await supabase.from("driver_document_versions")
        .select("doc_type, file_url")
        .eq("vehicle_id", veh.id)
        .eq("status", "pending");
      const map: Record<string, string> = {};
      (pending || []).forEach((d: any) => { map[d.doc_type] = d.file_url; });
      setPendingDocs(map);
    }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const uploadFile = async (supabase: any, file: File, path: string) => {
    const { error } = await supabase.storage.from("driver-documents").upload(path, file, { upsert: true });
    if (error) throw error;
    return supabase.storage.from("driver-documents").getPublicUrl(path).data.publicUrl;
  };

  // ── Save new vehicle (step 1) ─────────────────────────────────
  const handleSaveVehicle = async () => {
    if (!form.make || !form.model || !form.year || !form.color || !form.registration) {
      toast.error("Fill all required fields"); return;
    }
    setSaving(true);
    try {
      const supabase = createClient();
      const isApproved = vehicle?.status === "approved";
      if (!isApproved) {
        await supabase.from("driver_vehicles").update({ is_active: false }).eq("driver_id", driverId).eq("is_active", true);
      }
      const { data: newVeh, error } = await supabase.from("driver_vehicles").insert({
        driver_id: driverId, make: form.make, model: form.model,
        variant: form.variant || null, year: parseInt(form.year),
        color: form.color, registration: form.registration,
        vehicle_class: form.vehicleClass,
        mileage: form.mileage ? parseInt(form.mileage) : null,
        status: "pending", is_active: !isApproved,
      }).select().single();
      if (error) throw error;
      await supabase.from("driver_audit_log").insert({
        driver_id: driverId, action: "VEHICLE_ADDED",
        description: `${form.year} ${form.make} ${form.model}`, changed_by: "driver",
      });
      setNewVehicleId(newVeh.id);
      setStep("documents");
      toast.success("Vehicle saved! Upload documents.");
    } catch (err: any) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  // ── Save vehicle docs (step 2) ────────────────────────────────
  const handleSaveDocs = async () => {
    setSaving(true);
    try {
      const supabase = createClient();
      const base = userId;
      const updates: Record<string, any> = {};
      if (regFile)      updates.reg_doc_url     = await uploadFile(supabase, regFile,  `${base}/vehicle-reg.${regFile.name.split(".").pop()}`);
      if (insFile)      updates.insurance_url   = await uploadFile(supabase, insFile,  `${base}/vehicle-insurance.${insFile.name.split(".").pop()}`);
      if (insExpiry)    updates.insurance_expiry = insExpiry;
      if (extPhotos.length > 0) updates.exterior_photos = await Promise.all(extPhotos.map((f, i) => uploadFile(supabase, f, `${base}/ext-${i+1}.${f.name.split(".").pop()}`)));
      if (intPhotos.length > 0) updates.interior_photos = await Promise.all(intPhotos.map((f, i) => uploadFile(supabase, f, `${base}/int-${i+1}.${f.name.split(".").pop()}`)));
      if (updDashPhoto) updates.dashboard_photo_url = await uploadFile(supabase, updDashPhoto, `${base}/dashboard.${updDashPhoto.name.split(".").pop()}`);
      if (Object.keys(updates).length > 0) await supabase.from("driver_vehicles").update(updates).eq("id", newVehicleId);
      toast.success("Documents saved! Submitted for review.");
      await loadData();
      setShowForm(false); setStep("details"); setNewVehicleId("");
      setForm({ make: "", model: "", variant: "", year: "", color: "", registration: "", vehicleClass: "business", mileage: "" });
      setRegFile(null); setInsFile(null); setExtPhotos([]); setIntPhotos([]); setUpdDashPhoto(null);
    } catch (err: any) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  // ── Update existing vehicle docs with versioning ──────────────
  const handleUpdateDocs = async () => {
    const hasFiles = updRegFile || updInsFile || updExtPhotos.length > 0 || updIntPhotos.length > 0 || updDashPhoto;
    if (!hasFiles && !updInsExpiry) { toast.error("Select files to update"); return; }
    setSavingDocs(true);
    try {
      const supabase = createClient();
      const base = `${userId}/updates`;

      // Upload each file and create a version record
      const createVersion = async (file: File, docType: string, fileName: string) => {
        const url = await uploadFile(supabase, file, `${base}/${fileName}.${file.name.split(".").pop()}`);
        await supabase.from("driver_document_versions").insert({
          driver_id: driverId, vehicle_id: vehicle.id,
          doc_type: docType, file_url: url,
          status: "pending", is_active: false,
        });
        return url;
      };

      if (updRegFile)      await createVersion(updRegFile,    "registration",   "reg");
      if (updInsFile)      await createVersion(updInsFile,    "insurance",      "insurance");
      if (updDashPhoto)    await createVersion(updDashPhoto,  "dashboard_photo","dashboard");
      if (updExtPhotos.length > 0) {
        const urls = await Promise.all(updExtPhotos.map((f, i) => uploadFile(supabase, f, `${base}/ext-${i+1}.${f.name.split(".").pop()}`)));
        await supabase.from("driver_document_versions").insert({
          driver_id: driverId, vehicle_id: vehicle.id,
          doc_type: "exterior_photos", file_url: JSON.stringify(urls),
          status: "pending", is_active: false,
        });
      }
      if (updIntPhotos.length > 0) {
        const urls = await Promise.all(updIntPhotos.map((f, i) => uploadFile(supabase, f, `${base}/int-${i+1}.${f.name.split(".").pop()}`)));
        await supabase.from("driver_document_versions").insert({
          driver_id: driverId, vehicle_id: vehicle.id,
          doc_type: "interior_photos", file_url: JSON.stringify(urls),
          status: "pending", is_active: false,
        });
      }

      await supabase.from("driver_audit_log").insert({
        driver_id: driverId, action: "VEHICLE_DOCS_UPDATE_REQUESTED",
        description: "Driver requested vehicle document update", changed_by: "driver",
      });

      toast.success("Documents submitted for review! Current documents remain active until approved.");
      setUpdRegFile(null); setUpdInsFile(null); setUpdExtPhotos([]); setUpdIntPhotos([]); setUpdDashPhoto(null);
      setShowDocUpdate(false);
      await loadData();
    } catch (err: any) { toast.error(err.message || "Upload failed"); }
    finally { setSavingDocs(false); }
  };

  if (loading) return null;
  const isApproved = vehicle?.status === "approved";
  const Field = ({ label, value }: { label: string; value?: string | null }) => (
    <div className="rounded-xl bg-gray-50 px-4 py-3">
      <p className={DRIVER_THEME.fieldLabel}>{label}</p>
      <p className="mt-1 text-sm font-semibold capitalize text-gray-900">{value || "—"}</p>
    </div>
  );

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
            {vehicle ? "Change Vehicle" : "Add Vehicle"}
          </button>
        )}
      </div>

      {/* ── Active vehicle ── */}
      {vehicle && !showForm && (
        <div className={`${DRIVER_THEME.card} overflow-hidden`}>
          <div className={DRIVER_THEME.cardHeader}>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: DRIVER_THEME.primary }}>
                <Car className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900">{vehicle.year} {vehicle.make} {vehicle.model}{vehicle.variant ? ` ${vehicle.variant}` : ""}</p>
                <p className="text-sm text-gray-500">{vehicle.color} · {vehicle.registration}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isApproved && <Lock className="h-3.5 w-3.5 text-gray-400" />}
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                vehicle.status === "approved" ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : vehicle.status === "rejected" ? "bg-red-50 text-red-600 border border-red-200"
                : "bg-amber-50 text-amber-700 border border-amber-200"
              }`}>
                {vehicle.status === "approved" ? "✓ Approved" : vehicle.status === "rejected" ? "✗ Rejected" : "⏳ Pending"}
              </span>
            </div>
          </div>

          <div className="p-5 space-y-5">
            {vehicle.status === "rejected" && vehicle.rejection_reason && (
              <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-700">Rejection Reason</p>
                  <p className="text-sm text-red-600 mt-0.5">{vehicle.rejection_reason}</p>
                </div>
              </div>
            )}

            {isApproved && (
              <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                <Lock className="h-4 w-4 shrink-0" />
                Approved vehicle. Add a new vehicle to request a change — this stays active until new one is approved.
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Vehicle Class" value={vehicle.vehicle_class?.replace(/_/g, " ")} />
              <Field label="Mileage"       value={vehicle.mileage ? `${vehicle.mileage.toLocaleString()} km` : null} />
              <Field label="Submitted"     value={fmtShort(vehicle.submitted_at || vehicle.created_at)} />
              <Field label="Approved"      value={fmtShort(vehicle.approved_at)} />
            </div>

            {/* ── Vehicle Documents with versioning ── */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className={DRIVER_THEME.fieldLabel}>Vehicle Documents</p>
                {!showDocUpdate && (
                  <button onClick={() => setShowDocUpdate(true)}
                    className="flex items-center gap-1.5 text-xs font-medium hover:underline"
                    style={{ color: DRIVER_THEME.primary }}>
                    <RefreshCw className="h-3.5 w-3.5" /> Update Documents
                  </button>
                )}
              </div>

              {/* Pending notice */}
              {Object.keys(pendingDocs).length > 0 && (
                <div className="mb-3 flex items-center gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                  <Clock className="h-4 w-4 shrink-0" />
                  {Object.keys(pendingDocs).length} document update(s) pending admin review — current documents are active.
                </div>
              )}

              {/* Document rows */}
              <div className="space-y-2 mb-4">
                {[
                  { label: "Registration Document", key: "registration",   url: vehicle.reg_doc_url },
                  { label: "Insurance Certificate",  key: "insurance",     url: vehicle.insurance_url },
                ].map(({ label, key, url }) => (
                  <div key={key} className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      {url ? <CheckCircle className="h-4 w-4 text-emerald-500" /> : <AlertCircle className="h-4 w-4 text-gray-300" />}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{label}</p>
                        {pendingDocs[key] && (
                          <p className="text-xs text-amber-600 flex items-center gap-1 mt-0.5">
                            <Clock className="h-3 w-3" /> New version pending review
                          </p>
                        )}
                        {vehicle.insurance_expiry && key === "insurance" && (
                          <p className="text-xs text-gray-400 mt-0.5">Expires: {fmtDate(vehicle.insurance_expiry)}</p>
                        )}
                      </div>
                    </div>
                    {url
                      ? <a href={url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs font-medium" style={{ color: DRIVER_THEME.primary }}>
                          View <ExternalLink className="h-3 w-3" />
                        </a>
                      : <span className="text-xs text-gray-400">Not uploaded</span>
                    }
                  </div>
                ))}
              </div>

              {/* Photos */}
              {vehicle.exterior_photos?.length > 0 && (
                <div className="mb-4">
                  <p className={`${DRIVER_THEME.fieldLabel} mb-2`}>Exterior Photos (Front, Back, Left, Right)</p>
                  <div className="grid grid-cols-4 gap-2">
                    {vehicle.exterior_photos.map((url: string, i: number) => (
                      <a key={i} href={url} target="_blank" rel="noreferrer"
                        className="group relative aspect-video overflow-hidden rounded-xl bg-gray-100">
                        <img src={url} alt={`Ext ${i+1}`} className="h-full w-full object-cover transition group-hover:opacity-80" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/20">
                          <ExternalLink className="h-4 w-4 text-white drop-shadow" />
                        </div>
                      </a>
                    ))}
                    {pendingDocs["exterior_photos"] && (
                      <div className="aspect-video rounded-xl border-2 border-dashed border-amber-300 bg-amber-50 flex items-center justify-center">
                        <p className="text-[10px] text-amber-600 text-center px-1">New pending review</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {vehicle.interior_photos?.length > 0 && (
                <div className="mb-4">
                  <p className={`${DRIVER_THEME.fieldLabel} mb-2`}>Interior Photos (Dashboard, Front Seat, Back Seat)</p>
                  <div className="grid grid-cols-4 gap-2">
                    {vehicle.interior_photos.map((url: string, i: number) => (
                      <a key={i} href={url} target="_blank" rel="noreferrer"
                        className="group relative aspect-video overflow-hidden rounded-xl bg-gray-100">
                        <img src={url} alt={`Int ${i+1}`} className="h-full w-full object-cover transition group-hover:opacity-80" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/20">
                          <ExternalLink className="h-4 w-4 text-white drop-shadow" />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Update docs form */}
              {showDocUpdate && (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900">Update Documents</p>
                    <button onClick={() => setShowDocUpdate(false)} className="text-gray-400 hover:text-gray-700"><X className="h-4 w-4" /></button>
                  </div>
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
                    Updated documents will be reviewed by admin. Current documents remain active until approved.
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <DocSlot label="Registration Document" activeUrl={vehicle.reg_doc_url} pendingUrl={pendingDocs["registration"]} file={updRegFile} onSet={setUpdRegFile} />
                    <DocSlot label="Insurance Certificate"  activeUrl={vehicle.insurance_url} pendingUrl={pendingDocs["insurance"]} file={updInsFile} onSet={setUpdInsFile} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-700">Insurance Expiry Date</label>
                    <input type="date" value={updInsExpiry} onChange={e => setUpdInsExpiry(e.target.value)}
                      className={inputClass} style={{ maxWidth: 220 }} />
                  </div>
                  <MultiPhotoSlot label="Exterior Photos (Front, Back, Left, Right)"
                    activeUrls={vehicle.exterior_photos} files={updExtPhotos} onSet={setUpdExtPhotos}
                    note="Replace all 4 exterior photos" />
                  <MultiPhotoSlot label="Interior Photos (Dashboard, Front Seat, Back Seat)"
                    activeUrls={vehicle.interior_photos} files={updIntPhotos} onSet={setUpdIntPhotos}
                    note="Replace interior photos" />
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <button onClick={() => setShowDocUpdate(false)} className={DRIVER_THEME.btnSecondary}>Cancel</button>
                    <button onClick={handleUpdateDocs} disabled={savingDocs} className={`${DRIVER_THEME.btnPrimary} disabled:opacity-60`}>
                      {savingDocs ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</> : <>Submit for Review</>}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* No vehicle */}
      {!vehicle && !showForm && (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white p-14 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50">
            <Car className="h-7 w-7 text-gray-300" />
          </div>
          <p className="text-base font-semibold text-gray-900">No vehicle added yet</p>
          <p className="mt-1 text-sm text-gray-400">Add your vehicle to complete your application</p>
          <button onClick={() => setShowForm(true)} className={`mt-5 inline-flex ${DRIVER_THEME.btnPrimary}`}>
            <Plus className="h-4 w-4" /> Add Vehicle
          </button>
        </div>
      )}

      {/* ── Add vehicle form ── */}
      {showForm && (
        <div className={`${DRIVER_THEME.card} overflow-hidden`}>
          <div className={DRIVER_THEME.cardHeader}>
            <div className="flex items-center gap-3">
              {[
                { s: "details", label: "Vehicle Details" },
                { s: "documents", label: "Documents" },
              ].map(({ s, label }, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold"
                    style={step === s || (step === "documents" && s === "details")
                      ? { backgroundColor: DRIVER_THEME.primary, color: "white" }
                      : { backgroundColor: "#f3f4f6", color: "#9ca3af" }}>
                    {step === "documents" && s === "details" ? "✓" : i + 1}
                  </div>
                  <span className={`text-sm font-medium ${step === s ? "text-gray-900" : "text-gray-400"}`}>{label}</span>
                  {i === 0 && <span className="text-gray-300 mx-1">→</span>}
                </div>
              ))}
            </div>
            <button onClick={() => { setShowForm(false); setStep("details"); setNewVehicleId(""); }}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"><X className="h-4 w-4" /></button>
          </div>

          <div className="p-5 space-y-4">
            {vehicle && step === "details" && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                ⚠️ New vehicle will be submitted for admin approval.
                {isApproved ? " Current approved vehicle stays active until new one is approved." : ""}
              </div>
            )}

            {/* Step 1: Vehicle details */}
            {step === "details" && (
              <>
                <SearchDropdown label="Make" required value={form.make}
                  options={VEHICLE_MAKES.map(m => m.name)}
                  onChange={(v: string) => { set("make", v); set("model", ""); set("variant", ""); }}
                  placeholder="Select make" />
                <SearchDropdown label="Model" required value={form.model}
                  options={models.map(m => m.name)}
                  onChange={(v: string) => { set("model", v); set("variant", ""); }}
                  placeholder={form.make ? "Select model" : "Select make first"} disabled={!form.make} />
                {variants.length > 0 && (
                  <SearchDropdown label="Variant" value={form.variant}
                    options={variants} onChange={(v: string) => set("variant", v)}
                    placeholder="Select variant (optional)" />
                )}
                <div className="grid gap-4 sm:grid-cols-2">
                  <SearchDropdown label="Year" required value={form.year}
                    options={years.map(String)} onChange={(v: string) => set("year", v)} placeholder="Year" />
                  <SearchDropdown label="Color" required value={form.color}
                    options={VEHICLE_COLORS} onChange={(v: string) => set("color", v)} placeholder="Color" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-700">License Plate *</label>
                    <input value={form.registration} onChange={e => set("registration", e.target.value)} placeholder="ABC 1234" className={inputClass} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-700">Mileage (km)</label>
                    <input type="number" value={form.mileage} onChange={e => set("mileage", e.target.value)} placeholder="e.g. 25000" className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-medium text-gray-700">Vehicle Class *</label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {VEHICLE_CLASSES.map(vc => (
                      <button key={vc.id} type="button" onClick={() => set("vehicleClass", vc.id)}
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

            {/* Step 2: Documents */}
            {step === "documents" && (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <DocSlot label="Registration Document *" file={regFile} onSet={setRegFile} required />
                  <DocSlot label="Insurance Certificate *"  file={insFile} onSet={setInsFile} required />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">Insurance Expiry Date</label>
                  <input type="date" value={insExpiry} onChange={e => setInsExpiry(e.target.value)}
                    className={inputClass} style={{ maxWidth: 220 }} />
                </div>
                <MultiPhotoSlot label="Exterior Photos (Front, Back, Left, Right)"
                  files={extPhotos} onSet={setExtPhotos}
                  note="4 photos — front, back, left side, right side" />
                <MultiPhotoSlot label="Interior Photos (Dashboard, Front Seat, Back Seat)"
                  files={intPhotos} onSet={setIntPhotos}
                  note="Dashboard, front seat, back seat" />
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <button onClick={() => {
                    toast.success("Saved as draft — upload documents later from Documents section.");
                    setShowForm(false); setStep("details"); setNewVehicleId("");
                    loadData();
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

      {/* Vehicle history */}
      {allVehicles.filter(v => !v.is_active).length > 0 && (
        <div className={`${DRIVER_THEME.card} overflow-hidden`}>
          <div className={DRIVER_THEME.cardHeader}>
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-gray-400" />
              <p className="text-sm font-semibold text-gray-900">Previous Vehicles</p>
            </div>
          </div>
          <div className="divide-y divide-gray-50">
            {allVehicles.filter(v => !v.is_active).map(v => (
              <div key={v.id} className="flex items-center justify-between px-5 py-3.5">
                <div>
                  <p className="text-sm font-medium text-gray-900">{v.year} {v.make} {v.model} — {v.color}</p>
                  <p className="text-xs text-gray-400">{v.registration} · {fmtShort(v.created_at)}</p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${v.status === "approved" ? "bg-emerald-50 text-emerald-600" : v.status === "rejected" ? "bg-red-50 text-red-500" : "bg-amber-50 text-amber-600"}`}>
                  {v.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
