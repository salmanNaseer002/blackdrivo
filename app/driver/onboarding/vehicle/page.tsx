"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Car, Plus, ChevronDown, Search, CheckCircle, X, History } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { VEHICLE_MAKES, VEHICLE_COLORS, getModelsForMake, getVariantsForModel, getYearOptions } from "@/lib/data/vehicles";
import { toast } from "sonner";
import Image from "next/image";

const inputClass = "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20";

// Searchable dropdown
function SearchDropdown({ label, value, options, onChange, placeholder, required, disabled }: any) {
  const [open, setOpen]   = useState(false);
  const [query, setQuery] = useState("");
  const ref               = useRef<HTMLDivElement>(null);
  const filtered          = options.filter((o: string) => o.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    const h = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} className="relative">
      {label && <label className="mb-1.5 block text-xs font-medium text-gray-700">{label}{required && <span className="text-red-500"> *</span>}</label>}
      <button type="button" disabled={disabled} onClick={() => { setOpen(!open); setQuery(""); }}
        className={`${inputClass} flex items-center justify-between text-left ${disabled ? "cursor-not-allowed opacity-50" : ""} ${value ? "" : "text-gray-400"}`}>
        <span className="truncate">{value || placeholder}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-gray-400 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-xl">
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input autoFocus value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Type to search..." className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-8 pr-3 text-sm outline-none focus:border-[#0b66d1]" />
            </div>
          </div>
          <div className="max-h-52 overflow-y-auto p-1">
            {filtered.length === 0
              ? <div className="px-3 py-4 text-center text-sm text-gray-400">No results</div>
              : filtered.map((opt: string) => (
                <button key={opt} type="button"
                  onClick={() => { onChange(opt); setOpen(false); setQuery(""); }}
                  className={`w-full rounded-lg px-3 py-2.5 text-left text-sm transition hover:bg-blue-50 hover:text-[#0b66d1] ${value === opt ? "bg-blue-50 font-medium text-[#0b66d1]" : "text-gray-700"}`}>
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

const VEHICLE_CLASSES = [
  { id: "business",    label: "Business Class",  desc: "Sedan — up to 3 pax" },
  { id: "first_class", label: "First Class",     desc: "Luxury sedan — up to 3 pax" },
  { id: "suv",         label: "Business SUV",    desc: "SUV — up to 6 pax" },
  { id: "van",         label: "Business Van",    desc: "Van — up to 7 pax" },
];

export default function VehicleOnboardingPage() {
  const router  = useRouter();
  const [mounted,  setMounted]  = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [driverId, setDriverId] = useState("");
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    make: "", model: "", variant: "", year: "", color: "",
    registration: "", vehicleClass: "business", mileage: "",
  });

  const years    = getYearOptions();
  const models   = getModelsForMake(form.make);
  const variants = getVariantsForModel(form.make, form.model);
  const set      = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    setMounted(true);
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.replace("/login"); return; }
      supabase.from("drivers").select("id").eq("user_id", user.id).maybeSingle()
        .then(({ data: drv }) => {
          if (!drv) return;
          setDriverId(drv.id);
          supabase.from("driver_vehicles").select("*").eq("driver_id", drv.id)
            .order("created_at", { ascending: false })
            .then(({ data: veh }) => {
              setVehicles(veh || []);
              if (!veh || veh.length === 0) setShowForm(true);
            });
        });
    });
  }, [router]);

  const handleAddVehicle = async () => {
    if (!form.make || !form.model || !form.year || !form.color || !form.registration) {
      toast.error("Please fill all required fields"); return;
    }
    setSaving(true);
    try {
      const supabase = createClient();
      // Deactivate existing active vehicles
      await supabase.from("driver_vehicles").update({ is_active: false }).eq("driver_id", driverId).eq("is_active", true);
      // Insert new vehicle
      const { data: newVeh, error } = await supabase.from("driver_vehicles").insert({
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
        is_active:     true,
      }).select().single();
      if (error) throw error;

      // Log audit
      await supabase.from("driver_audit_log").insert({
        driver_id:   driverId,
        action:      "VEHICLE_ADDED",
        description: `Vehicle added: ${form.year} ${form.make} ${form.model}`,
        changed_by:  "driver",
      });

      setVehicles(prev => [newVeh, ...prev.map(v => ({ ...v, is_active: false }))]);
      setShowForm(false);
      setForm({ make: "", model: "", variant: "", year: "", color: "", registration: "", vehicleClass: "business", mileage: "" });
      toast.success("Vehicle added! Proceed to upload documents.");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Vehicle</h1>
          <p className="mt-1 text-sm text-gray-500">Add the vehicle you'll be driving with BlackDrivo.</p>
        </div>
        {vehicles.length > 0 && !showForm && (
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-700">
            <Plus className="h-4 w-4" /> Change Vehicle
          </button>
        )}
      </div>

      {/* Active vehicle display */}
      {vehicles.filter(v => v.is_active).map(v => (
        <div key={v.id} className="rounded-2xl border border-[#0b66d1]/20 bg-blue-50 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0b66d1]">
                <Car className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{v.year} {v.make} {v.model}{v.variant ? ` ${v.variant}` : ""}</p>
                <p className="text-sm text-gray-500">{v.color} · {v.registration} · {v.vehicle_class?.replace(/_/g, " ")}</p>
              </div>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
              v.status === "approved" ? "bg-emerald-100 text-emerald-700"
              : v.status === "rejected" ? "bg-red-100 text-red-600"
              : "bg-amber-100 text-amber-700"
            }`}>
              {v.status === "approved" ? "✓ Approved" : v.status === "rejected" ? "✗ Rejected" : "⏳ Pending Review"}
            </span>
          </div>
          {v.status === "rejected" && v.rejection_reason && (
            <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600">
              <strong>Rejection reason:</strong> {v.rejection_reason}
            </div>
          )}
        </div>
      ))}

      {/* Vehicle history */}
      {vehicles.filter(v => !v.is_active).length > 0 && (
        <details className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <summary className="flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-600">
            <History className="h-4 w-4" /> Previous Vehicles ({vehicles.filter(v => !v.is_active).length})
          </summary>
          <div className="mt-3 space-y-2">
            {vehicles.filter(v => !v.is_active).map(v => (
              <div key={v.id} className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm">
                <span className="text-gray-700">{v.year} {v.make} {v.model} — {v.color}</span>
                <span className="text-xs text-gray-400">{new Date(v.created_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </details>
      )}

      {/* Add vehicle form */}
      {showForm && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">{vehicles.length > 0 ? "Add New Vehicle" : "Vehicle Details"}</h2>
            {vehicles.length > 0 && (
              <button onClick={() => setShowForm(false)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {vehicles.length > 0 && (
            <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-700">
              ⚠️ Adding a new vehicle will replace your current active vehicle. The new vehicle will need admin approval before you can accept rides.
            </div>
          )}

          <div className="space-y-4">
            <SearchDropdown label="Make" required value={form.make}
              options={VEHICLE_MAKES.map(m => m.name)}
              onChange={(v: string) => { set("make", v); set("model", ""); set("variant", ""); }}
              placeholder="Select make (e.g. Mercedes-Benz)" />

            <SearchDropdown label="Model" required value={form.model}
              options={models.map(m => m.name)}
              onChange={(v: string) => { set("model", v); set("variant", ""); }}
              placeholder={form.make ? "Select model" : "Select make first"}
              disabled={!form.make} />

            {variants.length > 0 && (
              <SearchDropdown label="Variant / Trim" value={form.variant}
                options={variants} onChange={(v: string) => set("variant", v)}
                placeholder="Select variant (optional)" />
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <SearchDropdown label="Year" required value={form.year}
                options={years.map(String)} onChange={(v: string) => set("year", v)}
                placeholder="Select year" />
              <SearchDropdown label="Color" required value={form.color}
                options={VEHICLE_COLORS} onChange={(v: string) => set("color", v)}
                placeholder="Select color" />
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
                    <p className="text-xs text-gray-500">{vc.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleAddVehicle} disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-3 text-sm font-semibold text-white hover:bg-gray-700 disabled:opacity-60">
              {saving ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                : <><CheckCircle className="h-4 w-4" /> Save Vehicle</>}
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button onClick={() => router.push("/driver/onboarding/personal")}
          className="flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/driver/dashboard")} className="text-sm text-gray-500 hover:text-gray-700">
            Save & continue later
          </button>
          <button
            onClick={() => { if (vehicles.length === 0) { toast.error("Please add a vehicle first"); return; } router.push("/driver/onboarding/documents"); }}
            className="flex items-center gap-2 rounded-xl bg-[#0b66d1] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0952a8]">
            Next: Documents <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
