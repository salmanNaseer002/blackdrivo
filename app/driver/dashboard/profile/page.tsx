"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Phone, CreditCard, Shield, AlertCircle, Pencil, X, ArrowRight, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_COUNTRIES } from "@/lib/data/locations";
import { toast } from "sonner";
import { DRIVER_THEME, fmtDate, daysUntil, ini } from "@/lib/driver/theme";

const inputClass = "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20";

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="py-3 border-b border-gray-50 last:border-0">
      <p className={DRIVER_THEME.fieldLabel}>{label}</p>
      <p className={DRIVER_THEME.fieldValue}>{value || "—"}</p>
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <div className={`${DRIVER_THEME.card} overflow-hidden`}>
      <div className={`${DRIVER_THEME.cardHeader} flex items-center gap-2.5`}>
        <Icon className="h-4 w-4 text-gray-400" />
        <p className="text-sm font-semibold text-gray-900">{title}</p>
      </div>
      <div className="px-5">{children}</div>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [driver,   setDriver]   = useState<any>(null);
  const [authUser, setAuthUser] = useState<any>(null);
  const [loading,  setLoading]  = useState(true);
  const [editing,  setEditing]  = useState(false);
  const [saving,   setSaving]   = useState(false);

  const [form, setForm] = useState({
    fullName: "", phone: "", dob: "", address: "",
    country: "US", city: "",
    licenseNum: "", licenseState: "NY", licenseExpiry: "",
    emergencyName: "", emergencyPhone: "",
    consent: false,
  });

  const loadData = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.replace("/login"); return; }
    setAuthUser(user);
    const { data: drv } = await supabase.from("drivers").select("*").eq("user_id", user.id).maybeSingle();
    setDriver(drv);
    if (drv) {
      setForm({
        fullName:      drv.full_name       || "",
        phone:         drv.phone           || "",
        dob:           drv.dob             || "",
        address:       drv.home_address    || "",
        country:       drv.country_code    || "US",
        city:          drv.city_code       || "",
        licenseNum:    drv.license_number === "PENDING" ? "" : (drv.license_number || ""),
        licenseState:  drv.license_state   || "NY",
        licenseExpiry: drv.license_expiry  || "",
        emergencyName: drv.emergency_contact_name  || "",
        emergencyPhone:drv.emergency_contact_phone || "",
        consent:       drv.background_check_consent || false,
      });
    }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async () => {
    if (!form.fullName.trim())   { toast.error("Full name is required"); return; }
    if (!form.phone.trim())      { toast.error("Phone number is required"); return; }
    if (!form.dob)               { toast.error("Date of birth is required"); return; }
    if (!form.licenseNum.trim()) { toast.error("License number is required"); return; }
    if (!form.licenseExpiry)     { toast.error("License expiry is required"); return; }
    if (!form.consent)           { toast.error("Background check consent is required"); return; }

    setSaving(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not logged in");

      const { error } = await supabase.from("drivers").update({
        full_name:                   form.fullName.trim(),
        phone:                       form.phone.trim(),
        dob:                         form.dob,
        home_address:                form.address.trim(),
        country_code:                form.country,
        city_code:                   form.city,
        license_number:              form.licenseNum.trim(),
        license_state:               form.licenseState,
        license_expiry:              form.licenseExpiry,
        emergency_contact_name:      form.emergencyName.trim() || null,
        emergency_contact_phone:     form.emergencyPhone.trim() || null,
        background_check_consent:    form.consent,
        background_check_consent_at: form.consent ? new Date().toISOString() : null,
      }).eq("user_id", user.id);

      if (error) throw error;
      toast.success("Profile updated successfully!");
      await loadData();
      setEditing(false);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !driver) return null;

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));
  const driverName   = driver?.full_name && driver.full_name !== "PENDING" ? driver.full_name : authUser?.email?.split("@")[0] || "Driver";
  const countryData  = DEFAULT_COUNTRIES.find((c: any) => c.code === driver?.country_code);
  const selCountry   = DEFAULT_COUNTRIES.find(c => c.code === form.country);
  const cityName     = countryData?.cities?.find((c: any) => c.code === driver?.city_code)?.name || driver?.city_code;
  const phoneDisplay = driver?.phone ? `${countryData?.phoneCode || ""} ${driver.phone}`.trim() : null;
  const daysLeft     = daysUntil(driver?.license_expiry);
  const licExpiring  = daysLeft !== null && daysLeft < 60;

  const statusCfg = driver?.status === "approved"
    ? { label: "Approved Driver",          dot: "bg-emerald-500", text: "text-emerald-600" }
    : driver?.status === "rejected"
    ? { label: "Application Rejected",     dot: "bg-red-500",     text: "text-red-500"     }
    : { label: "Application Under Review", dot: "bg-amber-500",   text: "text-amber-600"   };

  // ── EDIT MODE ─────────────────────────────────────────────────
  if (editing) {
    return (
      <div className={DRIVER_THEME.pageWrapper}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className={DRIVER_THEME.pageTitle}>Edit Profile</h2>
            <p className={DRIVER_THEME.pageSub}>Update your personal and license details</p>
          </div>
          <button onClick={() => setEditing(false)} className={DRIVER_THEME.btnSecondary}>
            <X className="h-4 w-4" /> Cancel
          </button>
        </div>

        {/* Basic Info */}
        <div className={`${DRIVER_THEME.card} p-5`}>
          <div className="flex items-center gap-2 mb-5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: DRIVER_THEME.primaryLight }}>
              <User className="h-4 w-4" style={{ color: DRIVER_THEME.primary }} />
            </div>
            <h3 className="text-sm font-semibold text-gray-900">Basic Information</h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">Full Legal Name *</label>
              <input value={form.fullName} onChange={e => set("fullName", e.target.value)} placeholder="John Smith" className={inputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">Date of Birth *</label>
              <input type="date" value={form.dob} onChange={e => set("dob", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">Country *</label>
              <select value={form.country} onChange={e => { set("country", e.target.value); set("city", ""); }} className={inputClass}>
                {DEFAULT_COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">City *</label>
              <select value={form.city} onChange={e => set("city", e.target.value)} className={inputClass}>
                <option value="">Select city</option>
                {selCountry?.cities.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-gray-700">Home Address</label>
              <input value={form.address} onChange={e => set("address", e.target.value)} placeholder="123 Main St, New York, NY 10001" className={inputClass} />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className={`${DRIVER_THEME.card} p-5`}>
          <div className="flex items-center gap-2 mb-5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: DRIVER_THEME.primaryLight }}>
              <Phone className="h-4 w-4" style={{ color: DRIVER_THEME.primary }} />
            </div>
            <h3 className="text-sm font-semibold text-gray-900">Contact Information</h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">Phone Number *</label>
              <div className="flex gap-2">
                {selCountry && (
                  <div className="flex h-[46px] items-center rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-600 shrink-0">
                    {selCountry.flag} {selCountry.phoneCode}
                  </div>
                )}
                <input value={form.phone} onChange={e => set("phone", e.target.value)}
                  placeholder={selCountry?.phonePlaceholder || "555 000 0000"}
                  className={`${inputClass} flex-1`} />
              </div>
              {selCountry && <p className="mt-1 text-xs text-gray-400">Format: {selCountry.phoneFormat}</p>}
            </div>
          </div>
          <div className="mt-5 border-t border-gray-100 pt-5">
            <p className="mb-4 text-sm font-medium text-gray-700">Emergency Contact (recommended)</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700">Contact Name</label>
                <input value={form.emergencyName} onChange={e => set("emergencyName", e.target.value)} placeholder="Jane Smith" className={inputClass} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700">Contact Phone</label>
                <input value={form.emergencyPhone} onChange={e => set("emergencyPhone", e.target.value)} placeholder="+1 555 000 0001" className={inputClass} />
              </div>
            </div>
          </div>
        </div>

        {/* License */}
        <div className={`${DRIVER_THEME.card} p-5`}>
          <div className="flex items-center gap-2 mb-5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: DRIVER_THEME.primaryLight }}>
              <CreditCard className="h-4 w-4" style={{ color: DRIVER_THEME.primary }} />
            </div>
            <h3 className="text-sm font-semibold text-gray-900">Driver License</h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-gray-700">License Number *</label>
              <input value={form.licenseNum} onChange={e => set("licenseNum", e.target.value)} placeholder="License number" className={inputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">State/Province</label>
              <input value={form.licenseState} onChange={e => set("licenseState", e.target.value)} placeholder="NY" className={inputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">Expiry Date *</label>
              <input type="date" value={form.licenseExpiry} onChange={e => set("licenseExpiry", e.target.value)} className={inputClass} />
            </div>
          </div>
        </div>

        {/* Consent */}
        <div className={`rounded-2xl border p-5 ${form.consent ? "border-[#0b66d1]/20 bg-[#e8f1fd]" : "border-amber-200 bg-amber-50"}`}>
          <div className="flex items-start gap-4">
            <input type="checkbox" id="consent" checked={form.consent}
              onChange={e => set("consent", e.target.checked)}
              className="mt-0.5 h-5 w-5 cursor-pointer accent-[#0b66d1]" />
            <label htmlFor="consent" className="cursor-pointer">
              <p className="text-sm font-semibold text-gray-900">Background Check Consent *</p>
              <p className="mt-1 text-xs text-gray-600 leading-relaxed">
                I consent to BlackDrivo conducting a background check including criminal history, driving record, and identity verification as required for driver onboarding.
              </p>
            </label>
          </div>
          {!form.consent && (
            <div className="mt-3 flex items-center gap-2 text-xs text-amber-600">
              <AlertCircle className="h-3.5 w-3.5" /> Required to proceed with your application
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button onClick={() => setEditing(false)} className="text-sm text-gray-500 hover:text-gray-700">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving} className={`${DRIVER_THEME.btnPrimary} disabled:opacity-60`}>
            {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : <>Save Changes <ArrowRight className="h-4 w-4" /></>}
          </button>
        </div>
      </div>
    );
  }

  // ── VIEW MODE ─────────────────────────────────────────────────
  return (
    <div className={DRIVER_THEME.pageWrapper}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className={DRIVER_THEME.pageTitle}>My Profile</h2>
          <p className={DRIVER_THEME.pageSub}>Your personal information and driver details</p>
        </div>
        <button onClick={() => setEditing(true)} className={DRIVER_THEME.btnSecondary}>
          <Pencil className="h-3.5 w-3.5" /> Edit Profile
        </button>
      </div>

      {/* Profile hero */}
      <div className={`${DRIVER_THEME.card} overflow-hidden`}>
        <div className="h-20" style={{ background: `linear-gradient(135deg, ${DRIVER_THEME.primary} 0%, ${DRIVER_THEME.primaryDark} 100%)` }} />
        <div className="px-6 pb-6">
          <div className="flex items-end gap-4 -mt-8 mb-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-white text-xl font-bold text-white shadow-sm"
              style={{ backgroundColor: DRIVER_THEME.primary }}>
              {ini(driverName)}
            </div>
            <div className="pb-1">
              <h3 className="text-base font-bold text-gray-900">{driverName}</h3>
              <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${statusCfg.text}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${statusCfg.dot}`} />
                {statusCfg.label}
              </span>
            </div>
          </div>
          <div className="grid gap-x-8 sm:grid-cols-2">
            <Field label="Email"        value={driver?.email || authUser?.email} />
            <Field label="Phone"        value={phoneDisplay} />
            <Field label="Member Since" value={driver?.created_at ? new Date(driver.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : null} />
          </div>
        </div>
      </div>

      {/* License expiry warning */}
      {licExpiring && daysLeft !== null && (
        <div className={`flex items-start gap-3 rounded-2xl border p-4 ${daysLeft < 14 ? "border-red-200 bg-red-50" : "border-amber-200 bg-amber-50"}`}>
          <AlertCircle className={`h-4 w-4 shrink-0 mt-0.5 ${daysLeft < 14 ? "text-red-500" : "text-amber-500"}`} />
          <p className="text-sm text-gray-700">
            <strong>License expiring soon</strong> — {daysLeft} days remaining. Please renew and update.
          </p>
          <button onClick={() => setEditing(true)} className="ml-auto text-xs font-medium shrink-0 hover:underline" style={{ color: DRIVER_THEME.primary }}>
            Update →
          </button>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        <Section title="Personal Information" icon={User}>
          <Field label="Full Name"     value={driverName} />
          <Field label="Date of Birth" value={fmtDate(driver?.dob)} />
          <Field label="Home Address"  value={driver?.home_address} />
          <Field label="Country"       value={countryData?.name || driver?.country_code} />
          <Field label="City"          value={cityName} />
        </Section>

        <Section title="Contact & Emergency" icon={Phone}>
          <Field label="Phone"             value={phoneDisplay} />
          <Field label="Email"             value={driver?.email || authUser?.email} />
          <Field label="Emergency Contact" value={driver?.emergency_contact_name} />
          <Field label="Emergency Phone"   value={driver?.emergency_contact_phone} />
        </Section>

        <Section title="Driver License" icon={CreditCard}>
          <Field label="License Number"   value={driver?.license_number === "PENDING" ? null : driver?.license_number} />
          <Field label="State / Province" value={driver?.license_state} />
          <Field label="Expiry Date"      value={fmtDate(driver?.license_expiry)} />
        </Section>

        <Section title="Compliance & Consent" icon={Shield}>
          <Field label="Background Check"
            value={driver?.background_check_consent
              ? `✓ Consented on ${fmtDate(driver?.background_check_consent_at)}`
              : "Not consented"} />
          <Field label="Application Status"
            value={driver?.status === "approved" ? "✓ Approved"
              : driver?.status === "rejected" ? `✗ Rejected${driver?.rejection_reason ? ` — ${driver.rejection_reason}` : ""}`
              : "Under Review"} />
        </Section>
      </div>
    </div>
  );
}
