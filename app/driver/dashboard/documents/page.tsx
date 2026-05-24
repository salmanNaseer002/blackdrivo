"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CheckCircle, AlertCircle, ExternalLink, Clock, Shield, Car, User, AlertTriangle, Upload, X, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { DRIVER_THEME, fmtDate, daysUntil } from "@/lib/driver/theme";

// ── File Upload Components ────────────────────────────────────────
function FileSlot({ label, file, onSet, currentUrl, required, accept = ".jpg,.jpeg,.png,.pdf,.webp", preview }: {
  label: string; file: File | null; onSet: (f: File | null) => void;
  currentUrl?: string | null; required?: boolean; accept?: string; preview?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (file && preview) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(null);
  }, [file, preview]);

  return (
    <div>
      <label className={`mb-1.5 block text-xs font-medium text-gray-700`}>
        {label}{required && <span style={{ color: DRIVER_THEME.primary }}> *</span>}
      </label>
      <input ref={ref} type="file" accept={accept} className="hidden"
        onChange={e => onSet(e.target.files?.[0] ?? null)} />

      {previewUrl ? (
        <div className="relative">
          <Image src={previewUrl} alt={label} width={200} height={120}
            className="h-28 w-full rounded-xl object-cover border border-gray-200" />
          <button type="button" onClick={() => onSet(null)}
            className="absolute right-2 top-2 rounded-full bg-white/90 p-1 shadow hover:bg-white">
            <X className="h-3.5 w-3.5 text-gray-600" />
          </button>
        </div>
      ) : (
        <div onClick={() => ref.current?.click()}
          className={`flex cursor-pointer items-center justify-between rounded-xl border p-3.5 transition ${
            file
              ? "border-blue-200 bg-blue-50"
              : currentUrl
              ? "border-emerald-200 bg-emerald-50"
              : "border-dashed border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          }`}>
          <div className="flex items-center gap-3 overflow-hidden min-w-0">
            {file
              ? <CheckCircle className="h-4 w-4 shrink-0" style={{ color: DRIVER_THEME.primary }} />
              : currentUrl
              ? <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />
              : <Upload className="h-4 w-4 shrink-0 text-gray-400" />
            }
            <span className="truncate text-sm text-gray-600">
              {file ? file.name : currentUrl ? "Uploaded — click to replace" : "Click to upload"}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-2">
            {currentUrl && !file && (
              <a href={currentUrl} target="_blank" rel="noreferrer"
                onClick={e => e.stopPropagation()}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900">
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
            {file
              ? <button type="button" onClick={e => { e.stopPropagation(); onSet(null); }}
                  className="rounded-full p-1 text-gray-400 hover:bg-gray-100">
                  <X className="h-3.5 w-3.5" />
                </button>
              : <span className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600">
                  {currentUrl ? "Replace" : "Browse"}
                </span>
            }
          </div>
        </div>
      )}
    </div>
  );
}

function MultiFileSlot({ label, files, onSet, accept = ".jpg,.jpeg,.png,.webp" }: {
  label: string; files: File[]; onSet: (f: File[]) => void; accept?: string;
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
      <input ref={ref} type="file" accept={accept} multiple className="hidden"
        onChange={e => onSet([...files, ...Array.from(e.target.files ?? [])])} />
      {previews.length > 0 && (
        <div className="mb-2 grid grid-cols-4 gap-2">
          {previews.map((url, i) => (
            <div key={i} className="relative">
              <Image src={url} alt={`${i+1}`} width={80} height={60}
                className="h-20 w-full rounded-xl object-cover border border-gray-200" />
              <button type="button" onClick={() => onSet(files.filter((_, idx) => idx !== i))}
                className="absolute right-1 top-1 rounded-full bg-white/90 p-0.5 shadow">
                <X className="h-3 w-3 text-gray-600" />
              </button>
            </div>
          ))}
        </div>
      )}
      <div onClick={() => ref.current?.click()}
        className="flex cursor-pointer items-center justify-between rounded-xl border border-dashed border-gray-200 p-3.5 transition hover:border-gray-300 hover:bg-gray-50">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Upload className="h-4 w-4" />
          {files.length > 0 ? `${files.length} file(s) selected — click to add more` : "Click to upload multiple photos"}
        </div>
        <span className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600">Browse</span>
      </div>
    </div>
  );
}

// ── Doc view row ─────────────────────────────────────────────────
function DocViewRow({ label, url, expiry, note }: { label: string; url?: string | null; expiry?: string | null; note?: string }) {
  const days     = daysUntil(expiry);
  const expiring = days !== null && days < 60;
  const expired  = days !== null && days < 0;
  return (
    <div className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50/50 transition">
      <div className="flex items-center gap-3 min-w-0">
        {url ? <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" /> : <AlertCircle className="h-4 w-4 shrink-0 text-gray-300" />}
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          {note && <p className="text-xs text-gray-400">{note}</p>}
          {expiry && (
            <p className={`text-xs flex items-center gap-1 ${expired ? "text-red-500" : expiring ? "text-amber-600" : "text-gray-400"}`}>
              {(expired || expiring) && <AlertTriangle className="h-3 w-3" />}
              {expired ? `Expired ${fmtDate(expiry)}` : `Expires ${fmtDate(expiry)}${days !== null && days < 60 ? ` · ${days} days` : ""}`}
            </p>
          )}
        </div>
      </div>
      <div className="ml-4 shrink-0">
        {url
          ? <a href={url} target="_blank" rel="noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50">
              View <ExternalLink className="h-3 w-3" />
            </a>
          : <span className="text-xs text-gray-400">Not uploaded</span>
        }
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────
export default function DocumentsPage() {
  const router = useRouter();
  const [driver,    setDriver]    = useState<any>(null);
  const [vehicle,   setVehicle]   = useState<any>(null);
  const [userId,    setUserId]    = useState("");
  const [driverId,  setDriverId]  = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [loading,   setLoading]   = useState(true);
  const [uploading, setUploading] = useState(false);
  const [tab,       setTab]       = useState<"view" | "upload">("view");

  // Upload state
  const [driverPhoto,       setDriverPhoto]       = useState<File | null>(null);
  const [driverWithLicense, setDriverWithLicense] = useState<File | null>(null);
  const [licenseFront,      setLicenseFront]      = useState<File | null>(null);
  const [licenseBack,       setLicenseBack]       = useState<File | null>(null);
  const [vehicleReg,        setVehicleReg]        = useState<File | null>(null);
  const [vehicleInsurance,  setVehicleInsurance]  = useState<File | null>(null);
  const [insuranceExpiry,   setInsuranceExpiry]   = useState("");
  const [vehicleExtPhotos,  setVehicleExtPhotos]  = useState<File[]>([]);
  const [vehicleIntPhotos,  setVehicleIntPhotos]  = useState<File[]>([]);

  useEffect(() => {
    const supabase = createClient();
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/login"); return; }
      setUserId(user.id);
      const { data: drv } = await supabase.from("drivers").select("*").eq("user_id", user.id).maybeSingle();
      if (!drv) return;
      setDriver(drv);
      setDriverId(drv.id);
      const { data: veh } = await supabase.from("driver_vehicles").select("*").eq("driver_id", drv.id).eq("is_active", true).maybeSingle();
      setVehicle(veh);
      if (veh) setVehicleId(veh.id);
      if (drv.insurance_expiry_date) setInsuranceExpiry(drv.insurance_expiry_date);
      setLoading(false);
    };
    load();
  }, [router]);

  const uploadFile = async (supabase: any, file: File, path: string) => {
    const { error } = await supabase.storage.from("driver-documents").upload(path, file, { upsert: true });
    if (error) throw error;
    return supabase.storage.from("driver-documents").getPublicUrl(path).data.publicUrl;
  };

  const handleUpload = async () => {
    const hasDriverFiles = driverPhoto || driverWithLicense || licenseFront || licenseBack;
    const hasVehicleFiles = vehicleReg || vehicleInsurance || vehicleExtPhotos.length > 0 || vehicleIntPhotos.length > 0;
    if (!hasDriverFiles && !hasVehicleFiles) { toast.error("Select at least one file to upload"); return; }

    setUploading(true);
    try {
      const supabase = createClient();
      const base = userId;
      const driverUpdates: Record<string, any> = {};
      const vehicleUpdates: Record<string, any> = {};

      if (driverPhoto)       driverUpdates.driver_photo_url        = await uploadFile(supabase, driverPhoto,       `${base}/driver-photo.${driverPhoto.name.split(".").pop()}`);
      if (driverWithLicense) driverUpdates.driver_with_license_url = await uploadFile(supabase, driverWithLicense, `${base}/driver-with-license.${driverWithLicense.name.split(".").pop()}`);
      if (licenseFront)      driverUpdates.license_front_url       = await uploadFile(supabase, licenseFront,      `${base}/license-front.${licenseFront.name.split(".").pop()}`);
      if (licenseBack)       driverUpdates.license_back_url        = await uploadFile(supabase, licenseBack,       `${base}/license-back.${licenseBack.name.split(".").pop()}`);

      if (Object.keys(driverUpdates).length > 0) {
        await supabase.from("drivers").update(driverUpdates).eq("id", driverId);
      }

      if (vehicleId) {
        if (vehicleReg)       vehicleUpdates.reg_doc_url     = await uploadFile(supabase, vehicleReg,       `${base}/vehicle-reg.${vehicleReg.name.split(".").pop()}`);
        if (vehicleInsurance) vehicleUpdates.insurance_url   = await uploadFile(supabase, vehicleInsurance, `${base}/vehicle-insurance.${vehicleInsurance.name.split(".").pop()}`);
        if (insuranceExpiry)  vehicleUpdates.insurance_expiry = insuranceExpiry;
        if (vehicleExtPhotos.length > 0) vehicleUpdates.exterior_photos = await Promise.all(vehicleExtPhotos.map((f, i) => uploadFile(supabase, f, `${base}/ext-${i+1}.${f.name.split(".").pop()}`)));
        if (vehicleIntPhotos.length > 0) vehicleUpdates.interior_photos = await Promise.all(vehicleIntPhotos.map((f, i) => uploadFile(supabase, f, `${base}/int-${i+1}.${f.name.split(".").pop()}`)));
        if (Object.keys(vehicleUpdates).length > 0) await supabase.from("driver_vehicles").update(vehicleUpdates).eq("id", vehicleId);
      }

      // Audit log
      await supabase.from("driver_audit_log").insert({
        driver_id: driverId, action: "DOCUMENTS_UPLOADED",
        description: "Driver updated documents", changed_by: "driver",
      });

      toast.success("Documents uploaded successfully!");
      // Refresh driver data
      const { data: drv } = await supabase.from("drivers").select("*").eq("id", driverId).maybeSingle();
      const { data: veh } = await supabase.from("driver_vehicles").select("*").eq("id", vehicleId).maybeSingle();
      setDriver(drv); setVehicle(veh);
      setDriverPhoto(null); setDriverWithLicense(null); setLicenseFront(null); setLicenseBack(null);
      setVehicleReg(null); setVehicleInsurance(null); setVehicleExtPhotos([]); setVehicleIntPhotos([]);
      setTab("view");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (loading || !driver) return null;

  const licDays  = daysUntil(driver?.license_expiry);
  const insDays  = daysUntil(driver?.insurance_expiry_date);
  const hasAlert = (licDays !== null && licDays < 60) || (insDays !== null && insDays < 60);
  const allUploaded = [driver?.driver_photo_url, driver?.license_front_url || driver?.license_doc_url, driver?.license_back_url, vehicle?.reg_doc_url, vehicle?.insurance_url].every(Boolean);

  return (
    <div className={DRIVER_THEME.pageWrapper}>
      <div>
        <h2 className={DRIVER_THEME.pageTitle}>Documents</h2>
        <p className={DRIVER_THEME.pageSub}>Manage your driver and vehicle documents</p>
      </div>

      {/* Status banner */}
      <div className={`flex items-center gap-3 rounded-2xl border p-4 ${allUploaded ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}>
        {allUploaded ? <CheckCircle className="h-5 w-5 shrink-0 text-emerald-500" /> : <AlertCircle className="h-5 w-5 shrink-0 text-amber-500" />}
        <p className="text-sm font-medium text-gray-800">
          {allUploaded ? "All required documents uploaded." : "Some documents are missing. Upload them to complete your application."}
        </p>
      </div>

      {/* Expiry alert */}
      {hasAlert && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
          <Clock className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-700">Document Expiry Alert</p>
            <p className="text-xs text-red-600 mt-0.5">
              {licDays !== null && licDays < 60 && `License expires in ${licDays} days. `}
              {insDays !== null && insDays < 60 && `Insurance expires in ${insDays} days.`}
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border border-gray-200 bg-white p-1 w-fit">
        {(["view", "upload"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition ${
              tab === t ? "text-white shadow-sm" : "text-gray-500 hover:text-gray-900"
            }`}
            style={tab === t ? { backgroundColor: DRIVER_THEME.primary } : {}}>
            {t === "view" ? "View Documents" : "Upload / Update"}
          </button>
        ))}
      </div>

      {/* ── VIEW TAB ── */}
      {tab === "view" && (
        <>
          {/* Driver docs */}
          <div className={`${DRIVER_THEME.card} overflow-hidden`}>
            <div className={DRIVER_THEME.cardHeader}>
              <div className="flex items-center gap-2"><User className="h-4 w-4 text-gray-400" /><p className="text-sm font-semibold text-gray-900">Driver Documents</p></div>
            </div>
            <div className="divide-y divide-gray-50">
              <DocViewRow label="Driver Photo"         url={driver?.driver_photo_url}        note="Profile photo" />
              <DocViewRow label="Driver with License"  url={driver?.driver_with_license_url} note="Photo holding license" />
              <DocViewRow label="License — Front"      url={driver?.license_front_url || driver?.license_doc_url} expiry={driver?.license_expiry} />
              <DocViewRow label="License — Back"       url={driver?.license_back_url} />
            </div>
          </div>

          {/* Vehicle docs */}
          <div className={`${DRIVER_THEME.card} overflow-hidden`}>
            <div className={DRIVER_THEME.cardHeader}>
              <div className="flex items-center gap-2"><Car className="h-4 w-4 text-gray-400" /><p className="text-sm font-semibold text-gray-900">Vehicle Documents</p></div>
            </div>
            <div className="divide-y divide-gray-50">
              <DocViewRow label="Vehicle Registration" url={vehicle?.reg_doc_url}   note="Official registration" />
              <DocViewRow label="Vehicle Insurance"    url={vehicle?.insurance_url} expiry={driver?.insurance_expiry_date} note="Insurance certificate" />
            </div>
          </div>

          {/* Compliance */}
          <div className={`${DRIVER_THEME.card} overflow-hidden`}>
            <div className={DRIVER_THEME.cardHeader}>
              <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-gray-400" /><p className="text-sm font-semibold text-gray-900">Compliance</p></div>
            </div>
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                {driver?.background_check_consent ? <CheckCircle className="h-4 w-4 text-emerald-500" /> : <AlertCircle className="h-4 w-4 text-gray-300" />}
                <div>
                  <p className="text-sm font-medium text-gray-900">Background Check Consent</p>
                  {driver?.background_check_consent_at && <p className="text-xs text-gray-400">Consented on {fmtDate(driver.background_check_consent_at)}</p>}
                </div>
              </div>
              <span className={`text-xs font-semibold ${driver?.background_check_consent ? "text-emerald-600" : "text-gray-400"}`}>
                {driver?.background_check_consent ? "✓ Done" : "Pending"}
              </span>
            </div>
          </div>
        </>
      )}

      {/* ── UPLOAD TAB ── */}
      {tab === "upload" && (
        <>
          {/* Driver docs upload */}
          <div className={`${DRIVER_THEME.card} p-5`}>
            <div className="flex items-center gap-2 mb-5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: DRIVER_THEME.primaryLight }}>
                <User className="h-4 w-4" style={{ color: DRIVER_THEME.primary }} />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Driver Documents</h3>
            </div>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FileSlot label="Driver Photo" file={driverPhoto} onSet={setDriverPhoto} currentUrl={driver?.driver_photo_url} accept=".jpg,.jpeg,.png,.webp" preview />
                <FileSlot label="Driver with License" file={driverWithLicense} onSet={setDriverWithLicense} currentUrl={driver?.driver_with_license_url} accept=".jpg,.jpeg,.png,.webp" preview />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <FileSlot label="License — Front Side" file={licenseFront} onSet={setLicenseFront} currentUrl={driver?.license_front_url || driver?.license_doc_url} preview />
                <FileSlot label="License — Back Side"  file={licenseBack}  onSet={setLicenseBack}  currentUrl={driver?.license_back_url} preview />
              </div>
            </div>
          </div>

          {/* Vehicle docs upload */}
          <div className={`${DRIVER_THEME.card} p-5`}>
            <div className="flex items-center gap-2 mb-5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: DRIVER_THEME.primaryLight }}>
                <Car className="h-4 w-4" style={{ color: DRIVER_THEME.primary }} />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Vehicle Documents</h3>
            </div>
            {!vehicleId && (
              <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
                No active vehicle found. Please add a vehicle first.
              </div>
            )}
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FileSlot label="Vehicle Registration" file={vehicleReg} onSet={setVehicleReg} currentUrl={vehicle?.reg_doc_url} disabled={!vehicleId} />
                <FileSlot label="Vehicle Insurance"    file={vehicleInsurance} onSet={setVehicleInsurance} currentUrl={vehicle?.insurance_url} disabled={!vehicleId} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700">Insurance Expiry Date</label>
                <input type="date" value={insuranceExpiry} onChange={e => setInsuranceExpiry(e.target.value)}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20"
                  style={{ maxWidth: 220 }} />
              </div>
              <MultiFileSlot label="Exterior Photos — Front, Back, Left, Right" files={vehicleExtPhotos} onSet={setVehicleExtPhotos} />
              <MultiFileSlot label="Interior Photos — Dashboard, Seats, Trunk"   files={vehicleIntPhotos} onSet={setVehicleIntPhotos} />
            </div>
          </div>

          {/* Privacy note */}
          <div className="rounded-xl border p-4 text-xs text-gray-600" style={{ borderColor: `${DRIVER_THEME.primary}30`, backgroundColor: DRIVER_THEME.primaryLight }}>
            All documents are encrypted and stored securely in compliance with GDPR and US privacy laws.
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between">
            <button onClick={() => setTab("view")} className={DRIVER_THEME.btnSecondary}>
              Cancel
            </button>
            <button onClick={handleUpload} disabled={uploading} className={`${DRIVER_THEME.btnPrimary} disabled:opacity-60`}>
              {uploading ? <><Loader2 className="h-4 w-4 animate-spin" /> Uploading…</> : <><CheckCircle className="h-4 w-4" /> Save Documents</>}
            </button>
          </div>
        </>
      )}

      <p className="text-center text-xs text-gray-400">
        Questions? <a href="mailto:support@blackdrivo.com" className="hover:underline" style={{ color: DRIVER_THEME.primary }}>Contact support</a>
      </p>
    </div>
  );
}
