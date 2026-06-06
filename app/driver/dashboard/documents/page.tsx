"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, AlertCircle, ExternalLink, Clock, Shield, Car, User, AlertTriangle, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { DRIVER_THEME, fmtDate, daysUntil } from "@/lib/driver/theme";

function DocRow({ label, url, expiry, note, pending }: {
  label: string; url?: string | null; expiry?: string | null; note?: string; pending?: boolean;
}) {
  const days     = daysUntil(expiry ?? null);
  const expiring = days !== null && days < 60;
  const expired  = days !== null && days < 0;
  return (
    <div className="flex items-center justify-between px-5 py-4 hover:bg-gray-50/50 transition">
      <div className="flex items-center gap-3 min-w-0">
        {url
          ? <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />
          : <AlertCircle className="h-4 w-4 shrink-0 text-gray-300" />
        }
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          {note && <p className="text-xs text-gray-400 mt-0.5">{note}</p>}
          {pending && (
            <p className="text-xs text-amber-600 flex items-center gap-1 mt-0.5">
              <Clock className="h-3 w-3" /> New version pending admin review
            </p>
          )}
          {expiry && (
            <p className={`text-xs mt-0.5 flex items-center gap-1 ${expired ? "text-red-500" : expiring ? "text-amber-600" : "text-gray-400"}`}>
              {(expired || expiring) && <AlertTriangle className="h-3 w-3" />}
              {expired ? `Expired ${fmtDate(expiry)}` : `Expires ${fmtDate(expiry)}${days !== null && days < 60 ? ` · ${days} days` : ""}`}
            </p>
          )}
        </div>
      </div>
      <div className="ml-4 shrink-0">
        {url
          ? <a href={url} target="_blank" rel="noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition">
              View <ExternalLink className="h-3 w-3" />
            </a>
          : <span className="text-xs text-gray-400">Not uploaded</span>
        }
      </div>
    </div>
  );
}

export default function DocumentsPage() {
  const router = useRouter();
  const [driver,    setDriver]    = useState<any>(null);
  const [vehicle,   setVehicle]   = useState<any>(null);
  const [pending,   setPending]   = useState<Record<string, boolean>>({});
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    const supabase = createClient();
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) { router.replace("/login"); return; }
      const { data: drv } = await supabase.from("drivers").select("*").eq("user_id", user.id).maybeSingle();
      if (!drv) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const drvAny = drv as any;
      setDriver(drvAny);
      const { data: veh } = await supabase.from("driver_vehicles").select("*").eq("driver_id", drvAny.id).eq("is_active", true).maybeSingle();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const vehAny = veh as any;
      setVehicle(vehAny);
      if (vehAny) {
        const { data: pendingDocs } = await supabase.from("driver_document_versions")
          .select("doc_type").eq("vehicle_id", vehAny.id).eq("status", "pending");
        const map: Record<string, boolean> = {};
        (pendingDocs || []).forEach((d: any) => { map[d.doc_type] = true; });
        setPending(map);
      }
      setLoading(false);
    };
    load();
  }, [router]);

  if (loading || !driver) return (
    <div className="flex h-64 items-center justify-center">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-gray-900" />
    </div>
  );

  const licDays  = daysUntil(driver?.license_expiry);
  const insDays  = daysUntil(driver?.insurance_expiry_date);
  const hasAlert = (licDays !== null && licDays < 60) || (insDays !== null && insDays < 60);
  const hasPending = Object.keys(pending).length > 0;

  const driverDocsComplete = !!(driver?.driver_photo_url && (driver?.license_front_url || driver?.license_doc_url) && driver?.license_back_url);
  const vehicleDocsComplete = !!(vehicle?.reg_doc_url && vehicle?.insurance_url);

  return (
    <div className={DRIVER_THEME.pageWrapper}>
      <div>
        <h2 className={DRIVER_THEME.pageTitle}>Documents</h2>
        <p className={DRIVER_THEME.pageSub}>Overview of all your uploaded documents</p>
      </div>

      {/* Pending review notice */}
      {hasPending && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <Clock className="h-5 w-5 shrink-0 text-amber-500 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Documents Pending Review</p>
            <p className="text-xs text-amber-700 mt-0.5">
              {Object.keys(pending).length} document update(s) are awaiting admin review. Current approved documents remain active.
            </p>
          </div>
        </div>
      )}

      {/* Expiry alerts */}
      {hasAlert && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
          <AlertTriangle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-700">Document Expiry Alert</p>
            <p className="text-xs text-red-600 mt-0.5">
              {licDays !== null && licDays < 60 && `License expires in ${licDays} days. `}
              {insDays !== null && insDays < 60 && `Insurance expires in ${insDays} days.`}
            </p>
          </div>
        </div>
      )}

      {/* ── Driver Documents ── */}
      <div className={`${DRIVER_THEME.card} overflow-hidden`}>
        <div className={DRIVER_THEME.cardHeader}>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-400" />
            <p className="text-sm font-semibold text-gray-900">Driver Documents</p>
            {driverDocsComplete
              ? <span className="ml-1 text-xs text-emerald-600">✓ Complete</span>
              : <span className="ml-1 text-xs text-amber-600">Incomplete</span>
            }
          </div>
          <Link href="/driver/dashboard/profile"
            className="flex items-center gap-1.5 text-xs font-medium hover:underline"
            style={{ color: DRIVER_THEME.primary }}>
            Upload in Profile <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          <DocRow label="Driver Photo"         url={driver?.driver_photo_url}        note="Profile photo" />
          <DocRow label="Driver with License"  url={driver?.driver_with_license_url} note="Holding license photo" />
          <DocRow label="License — Front"      url={driver?.license_front_url || driver?.license_doc_url} expiry={driver?.license_expiry} />
          <DocRow label="License — Back"       url={driver?.license_back_url} />
        </div>
      </div>

      {/* ── Vehicle Documents ── */}
      <div className={`${DRIVER_THEME.card} overflow-hidden`}>
        <div className={DRIVER_THEME.cardHeader}>
          <div className="flex items-center gap-2">
            <Car className="h-4 w-4 text-gray-400" />
            <p className="text-sm font-semibold text-gray-900">Vehicle Documents</p>
            {vehicleDocsComplete
              ? <span className="ml-1 text-xs text-emerald-600">✓ Complete</span>
              : <span className="ml-1 text-xs text-amber-600">{vehicle ? "Incomplete" : "No vehicle added"}</span>
            }
          </div>
          <Link href="/driver/dashboard/vehicle"
            className="flex items-center gap-1.5 text-xs font-medium hover:underline"
            style={{ color: DRIVER_THEME.primary }}>
            Upload in Vehicle <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          <DocRow label="Registration Document" url={vehicle?.reg_doc_url}   note="Official registration" pending={pending["registration"]} />
          <DocRow label="Insurance Certificate"  url={vehicle?.insurance_url} expiry={driver?.insurance_expiry_date} note="Insurance certificate" pending={pending["insurance"]} />
          {vehicle?.exterior_photos?.length > 0 && (
            <div className="px-5 py-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <p className="text-sm font-medium text-gray-900">Exterior Photos ({vehicle.exterior_photos.length})</p>
                {pending["exterior_photos"] && (
                  <span className="flex items-center gap-1 text-[10px] font-medium text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
                    <Clock className="h-2.5 w-2.5" /> Pending
                  </span>
                )}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {vehicle.exterior_photos.map((url: string, i: number) => (
                  <a key={i} href={url} target="_blank" rel="noreferrer"
                    className="group relative aspect-video overflow-hidden rounded-lg bg-gray-100">
                    <img src={url} alt={`Ext ${i+1}`} className="h-full w-full object-cover transition group-hover:opacity-80" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/20">
                      <ExternalLink className="h-3 w-3 text-white" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
          {vehicle?.interior_photos?.length > 0 && (
            <div className="px-5 py-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <p className="text-sm font-medium text-gray-900">Interior Photos ({vehicle.interior_photos.length})</p>
                {pending["interior_photos"] && (
                  <span className="flex items-center gap-1 text-[10px] font-medium text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
                    <Clock className="h-2.5 w-2.5" /> Pending
                  </span>
                )}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {vehicle.interior_photos.map((url: string, i: number) => (
                  <a key={i} href={url} target="_blank" rel="noreferrer"
                    className="group relative aspect-video overflow-hidden rounded-lg bg-gray-100">
                    <img src={url} alt={`Int ${i+1}`} className="h-full w-full object-cover transition group-hover:opacity-80" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/20">
                      <ExternalLink className="h-3 w-3 text-white" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
          {!vehicle && (
            <div className="px-5 py-8 text-center">
              <Car className="mx-auto mb-2 h-8 w-8 text-gray-200" />
              <p className="text-sm text-gray-400">No vehicle added yet</p>
              <Link href="/driver/dashboard/vehicle" className="mt-2 text-xs font-medium hover:underline" style={{ color: DRIVER_THEME.primary }}>
                Add vehicle →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ── Compliance ── */}
      <div className={`${DRIVER_THEME.card} overflow-hidden`}>
        <div className={`${DRIVER_THEME.cardHeader} flex items-center gap-2`}>
          <Shield className="h-4 w-4 text-gray-400" />
          <p className="text-sm font-semibold text-gray-900">Compliance</p>
        </div>
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            {driver?.background_check_consent
              ? <CheckCircle className="h-4 w-4 text-emerald-500" />
              : <AlertCircle className="h-4 w-4 text-gray-300" />
            }
            <div>
              <p className="text-sm font-medium text-gray-900">Background Check Consent</p>
              {driver?.background_check_consent_at && (
                <p className="text-xs text-gray-400 mt-0.5">Consented on {fmtDate(driver.background_check_consent_at)}</p>
              )}
            </div>
          </div>
          <span className={`text-xs font-semibold ${driver?.background_check_consent ? "text-emerald-600" : "text-gray-400"}`}>
            {driver?.background_check_consent ? "✓ Done" : "Pending"}
          </span>
        </div>
      </div>

      <p className="text-center text-xs text-gray-400">
        Documents are encrypted and stored securely.{" "}
        <a href="mailto:support@blackdrivo.com" className="hover:underline" style={{ color: DRIVER_THEME.primary }}>
          Contact support
        </a>{" "}
        for any issues.
      </p>
    </div>
  );
}
