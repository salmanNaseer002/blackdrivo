"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2, Pencil, CreditCard, Plus, Trash2, Bell, AlertTriangle, X, ShieldAlert, Eye, EyeOff,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/lib/hooks/useUser";
import { useSiteCountry } from "@/components/providers/CountryProvider";
import { isValidPhone } from "@/lib/booking/phone";
import type { SiteCountry } from "@/lib/booking/country";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AccountTabs from "@/components/account/AccountTabs";
import PhoneCountryInput from "@/components/shared/PhoneCountryInput";
import OtpInput from "@/components/shared/OtpInput";

interface PassengerRow {
  name: string | null;
  email: string | null;
  phone: string | null;
  marketing_opt_in: boolean;
  preferred_language: string;
  preferred_currency: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
}

interface CardRow {
  id: string;
  cardholder_name: string;
  card_number: string; // last 4 digits only — never full PAN
  expiry: string;
  card_type: string;
  is_default: boolean;
}

const BRAND_LABEL: Record<string, string> = {
  visa: "Visa", mastercard: "Mastercard", amex: "Amex", discover: "Discover",
};
function detectBrand(num: string) {
  const n = num.replace(/\s/g, "");
  if (/^4/.test(n)) return "visa";
  if (/^5[1-5]/.test(n)) return "mastercard";
  if (/^3[47]/.test(n)) return "amex";
  if (/^6(?:011|5)/.test(n)) return "discover";
  return "card";
}
const fmtCardNumber = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
const fmtExpiry = (v: string) => { const d = v.replace(/\D/g, "").slice(0, 4); return d.length >= 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d; };

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "ur", label: "اردو (Urdu)" },
  { code: "ar", label: "العربية (Arabic)" },
  { code: "nl", label: "Nederlands (Dutch)" },
  { code: "de", label: "Deutsch (German)" },
  { code: "fr", label: "Français (French)" },
  { code: "es", label: "Español (Spanish)" },
];

const DELETE_REASONS = [
  "I found a better service",
  "I no longer need this",
  "Privacy concerns",
  "Too expensive",
  "Had a bad experience",
  "Other",
];

// Best-effort split of a stored "+92XXXXXXXXXX" string into {country, localDigits}
// by matching the longest known dial-code prefix.
function splitPhone(stored: string | null, countries: SiteCountry[], fallback: SiteCountry): { country: SiteCountry; digits: string } {
  if (!stored) return { country: fallback, digits: "" };
  const match = [...countries].sort((a, b) => b.phone_code.length - a.phone_code.length).find((c) => stored.startsWith(c.phone_code));
  if (match) return { country: match, digits: stored.slice(match.phone_code.length) };
  return { country: fallback, digits: stored.replace(/\D/g, "") };
}

export default function AccountPage() {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const userId = user?.id;
  const { country: siteCountry, countries } = useSiteCountry();

  const [passenger, setPassenger] = useState<PassengerRow | null>(null);
  const [loading, setLoading] = useState(true);

  // Personal info — one shared edit form for name/email/phone
  const [editingInfo, setEditingInfo] = useState(false);
  const [infoName, setInfoName] = useState("");
  const [infoEmail, setInfoEmail] = useState("");
  const [infoPhoneDigits, setInfoPhoneDigits] = useState("");
  const [infoPhoneCountry, setInfoPhoneCountry] = useState<SiteCountry>(siteCountry);
  const [infoSaving, setInfoSaving] = useState(false);
  const [infoMsg, setInfoMsg] = useState("");

  // Email change is verified by OTP, not the confirmation-link default —
  // after updateUser({email}) sends the code, this holds it pending until
  // the 6-digit code is verified.
  const [emailOtpPending, setEmailOtpPending] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [emailOtpCode, setEmailOtpCode] = useState("");
  const [emailOtpVerifying, setEmailOtpVerifying] = useState(false);

  // Change password — collapsed until "Change password" is clicked
  const [editingPassword, setEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState("");

  // Payment methods
  const [cards, setCards] = useState<CardRow[]>([]);
  const [showAddCard, setShowAddCard] = useState(false);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardSaving, setCardSaving] = useState(false);

  // Notifications
  const [emailOptIn, setEmailOptIn] = useState(true);
  const [notifSaving, setNotifSaving] = useState(false);

  // Language & currency
  const [language, setLanguage] = useState("en");
  const [currency, setCurrency] = useState("");
  const [prefsSaving, setPrefsSaving] = useState(false);
  const [prefsSaved, setPrefsSaved] = useState(false);

  // Emergency contact
  const [editingEmergency, setEditingEmergency] = useState(false);
  const [emName, setEmName] = useState("");
  const [emPhoneDigits, setEmPhoneDigits] = useState("");
  const [emPhoneCountry, setEmPhoneCountry] = useState<SiteCountry>(siteCountry);
  const [emSaving, setEmSaving] = useState(false);

  // Delete account
  const [showDelete, setShowDelete] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteReason, setDeleteReason] = useState("");
  const [deleting, setDeleting] = useState(false);

  // `user` is a NEW object reference on every Supabase auth event (including
  // silent token refreshes, not just actual sign-in/out) — depending on the
  // whole object here re-ran loadAll() on those refreshes too, and a refetch
  // landing after a toggle/save silently clobbered the local optimistic
  // state back to the last-loaded value. Depend on the stable id instead.
  useEffect(() => {
    if (userLoading) return;
    if (!userId) { router.replace("/login?redirect=/account"); return; }
    loadAll(userId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, userLoading]);

  const loadAll = async (id: string) => {
    const supabase = createClient();
    const [{ data: p }, { data: c }] = await Promise.all([
      (supabase as any).from("passengers").select(
        "name, email, phone, marketing_opt_in, preferred_language, preferred_currency, emergency_contact_name, emergency_contact_phone"
      ).eq("id", id).maybeSingle(),
      (supabase as any).from("cards").select("id, cardholder_name, card_number, expiry, card_type, is_default").eq("passenger_id", id).order("is_default", { ascending: false }).order("created_at", { ascending: false }),
    ]);
    if (p) {
      setPassenger(p);
      setInfoName(p.name || "");
      setInfoEmail(p.email || "");
      const { country: pc, digits } = splitPhone(p.phone, countries, siteCountry);
      setInfoPhoneCountry(pc);
      setInfoPhoneDigits(digits);
      setEmailOptIn(p.marketing_opt_in ?? true);
      setLanguage(p.preferred_language || "en");
      setCurrency(p.preferred_currency || siteCountry.currency);
      setEmName(p.emergency_contact_name || "");
      const em = splitPhone(p.emergency_contact_phone, countries, siteCountry);
      setEmPhoneCountry(em.country);
      setEmPhoneDigits(em.digits);
    }
    setCards(c || []);
    setLoading(false);
  };

  const openEditInfo = () => {
    if (!passenger) return;
    setInfoName(passenger.name || "");
    setInfoEmail(passenger.email || user?.email || "");
    const { country: pc, digits } = splitPhone(passenger.phone, countries, siteCountry);
    setInfoPhoneCountry(pc);
    setInfoPhoneDigits(digits);
    setInfoMsg("");
    setEditingInfo(true);
  };

  const handleSaveInfo = async () => {
    if (!userId) return;
    if (infoPhoneDigits && !isValidPhone(infoPhoneDigits, infoPhoneCountry.code)) {
      setInfoMsg("Please enter a valid phone number.");
      return;
    }
    setInfoSaving(true);
    setInfoMsg("");
    try {
      const supabase = createClient();
      const { error } = await (supabase as any).from("passengers").update({
        name: infoName.trim(),
        phone: infoPhoneDigits ? `${infoPhoneCountry.phone_code}${infoPhoneDigits.replace(/\D/g, "")}` : null,
      }).eq("id", userId);
      if (error) throw error;

      const currentEmail = (passenger?.email || user?.email || "").toLowerCase();
      if (infoEmail.trim().toLowerCase() !== currentEmail) {
        const { error: emailError } = await supabase.auth.updateUser({ email: infoEmail.trim() });
        if (emailError) throw emailError;
        setPendingEmail(infoEmail.trim());
        setEmailOtpCode("");
        setEmailOtpPending(true);
        setInfoMsg("A verification code was sent to your new email — enter it below to confirm the change.");
      } else {
        await loadAll(userId);
        setEditingInfo(false);
      }
    } catch (e: any) {
      setInfoMsg(e.message || "Couldn't save. Please try again.");
    }
    setInfoSaving(false);
  };

  const handleVerifyEmailOtp = async () => {
    if (!userId || emailOtpCode.trim().length !== 6) return;
    setEmailOtpVerifying(true);
    setInfoMsg("");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.verifyOtp({ email: pendingEmail, token: emailOtpCode.trim(), type: "email_change" });
      if (error) {
        setInfoMsg("That code is incorrect or expired. Please try again.");
        setEmailOtpVerifying(false);
        return;
      }
      setEmailOtpPending(false);
      setEditingInfo(false);
      setInfoMsg("");
      await loadAll(userId);
    } catch (e: any) {
      setInfoMsg(e.message || "Couldn't verify the code. Please try again.");
    }
    setEmailOtpVerifying(false);
  };

  const handleChangePassword = async () => {
    if (!user?.email) return;
    setPasswordMsg("");
    if (newPassword.length < 8) { setPasswordMsg("New password must be at least 8 characters"); return; }
    if (newPassword !== confirmPassword) { setPasswordMsg("Passwords do not match"); return; }
    setPasswordSaving(true);
    try {
      const supabase = createClient();
      const { error: reauthError } = await supabase.auth.signInWithPassword({ email: user.email, password: currentPassword });
      if (reauthError) {
        setPasswordMsg("Current password is incorrect.");
        setPasswordSaving(false);
        return;
      }
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setPasswordMsg("Password updated.");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      setTimeout(() => { setEditingPassword(false); setPasswordMsg(""); }, 1800);
    } catch (e: any) {
      setPasswordMsg(e.message || "Couldn't update password. Please try again.");
    }
    setPasswordSaving(false);
  };

  const cardValid = cardNumber.replace(/\s/g, "").length >= 15 && cardExpiry.length === 5 && cardCvv.length >= 3 && cardName.trim().length > 1;

  const handleAddCard = async () => {
    if (!userId || !cardValid) return;
    setCardSaving(true);
    try {
      const supabase = createClient();
      await (supabase as any).from("cards").insert({
        passenger_id: userId,
        cardholder_name: cardName.trim(),
        card_number: cardNumber.replace(/\s/g, "").slice(-4),
        expiry: cardExpiry,
        card_type: detectBrand(cardNumber),
        is_default: cards.length === 0,
      });
      setShowAddCard(false);
      setCardName(""); setCardNumber(""); setCardExpiry(""); setCardCvv("");
      loadAll(userId);
    } finally {
      setCardSaving(false);
    }
  };

  const handleSetDefault = async (card: CardRow) => {
    if (!userId) return;
    const supabase = createClient();
    await (supabase as any).from("cards").update({ is_default: false }).eq("passenger_id", userId);
    await (supabase as any).from("cards").update({ is_default: true }).eq("id", card.id);
    loadAll(userId);
  };

  const handleRemoveCard = async (card: CardRow) => {
    if (!userId) return;
    const supabase = createClient();
    await (supabase as any).from("cards").delete().eq("id", card.id);
    loadAll(userId);
  };

  const handleToggleEmail = async () => {
    if (!userId) return;
    const next = !emailOptIn;
    setEmailOptIn(next); // optimistic
    setNotifSaving(true);
    // `.select()` so a silent RLS/no-match no-op (0 rows updated, no `error`
    // returned — the exact bug that broke this toggle before) is detectable:
    // an empty `data` array means nothing actually got written.
    const { data, error } = await (createClient() as any)
      .from("passengers").update({ marketing_opt_in: next }).eq("id", userId).select("marketing_opt_in");
    if (error || !data?.length) setEmailOptIn(!next);
    setNotifSaving(false);
  };

  const handleSavePrefs = async () => {
    if (!userId) return;
    setPrefsSaving(true);
    setPrefsSaved(false);
    await (createClient() as any).from("passengers").update({
      preferred_language: language,
      preferred_currency: currency,
    }).eq("id", userId);
    setPrefsSaving(false);
    setPrefsSaved(true);
    setTimeout(() => setPrefsSaved(false), 2500);
  };

  const handleSaveEmergency = async () => {
    if (!userId) return;
    setEmSaving(true);
    try {
      await (createClient() as any).from("passengers").update({
        emergency_contact_name: emName.trim() || null,
        emergency_contact_phone: emPhoneDigits ? `${emPhoneCountry.phone_code}${emPhoneDigits.replace(/\D/g, "")}` : null,
      }).eq("id", userId);
      setEditingEmergency(false);
      await loadAll(userId);
    } finally {
      setEmSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      const res = await fetch("/api/account/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: deleteReason || undefined }),
      });
      if (!res.ok) throw new Error("Failed to delete account");
      window.location.replace("/");
    } catch {
      setDeleting(false);
    }
  };

  if (userLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#0b66d1]" />
      </div>
    );
  }

  const emailConfirmationRequired = deleteConfirmText.trim().toLowerCase() === (passenger?.email || user?.email || "").toLowerCase();

  const Toggle = ({ on, saving, onClick }: { on: boolean; saving: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      disabled={saving}
      aria-pressed={on}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-60 ${on ? "bg-[#0b66d1]" : "bg-gray-200"}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${on ? "translate-x-5" : "translate-x-0.5"}`} />
    </button>
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="mx-auto max-w-[1000px] px-4 sm:px-6 pb-24 pt-32 md:px-6 md:pt-36 lg:px-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your profile, payment methods, and preferences.</p>
        </div>

        <div className="mt-6">
          <AccountTabs />
        </div>

        <div className="mt-8 grid gap-x-14 gap-y-10 lg:grid-cols-2">
          {/* LEFT column */}
          <div className="space-y-10">
            {/* Personal Information */}
            <section>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wide text-gray-400">Personal Information</h2>
                {!editingInfo && (
                  <button onClick={openEditInfo} className="flex items-center gap-1.5 text-xs font-semibold text-[#0b66d1] hover:text-[#0952a8]">
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                )}
              </div>

              {!editingInfo ? (
                <div className="mt-4 divide-y divide-gray-100 border-t border-gray-100">
                  <div className="py-3.5">
                    <p className="text-xs font-medium text-gray-400">Name</p>
                    <p className="mt-0.5 text-sm font-medium text-gray-900">{passenger?.name || "—"}</p>
                  </div>
                  <div className="py-3.5">
                    <p className="text-xs font-medium text-gray-400">Email</p>
                    <p className="mt-0.5 text-sm font-medium text-gray-900">{passenger?.email || user?.email}</p>
                  </div>
                  <div className="py-3.5">
                    <p className="text-xs font-medium text-gray-400">Phone</p>
                    <p className="mt-0.5 text-sm font-medium text-gray-900">{passenger?.phone || "—"}</p>
                  </div>
                </div>
              ) : (
                <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-400">Name</label>
                    <input value={infoName} onChange={(e) => setInfoName(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-400">Email</label>
                    <input type="email" value={infoEmail} onChange={(e) => setInfoEmail(e.target.value)} disabled={emailOtpPending}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20 disabled:bg-gray-50 disabled:text-gray-500" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-400">Phone</label>
                    <PhoneCountryInput countries={countries} phoneCountry={infoPhoneCountry} setPhoneCountry={setInfoPhoneCountry} phone={infoPhoneDigits} setPhone={setInfoPhoneDigits} />
                  </div>
                  {infoMsg && <p className="text-xs text-gray-500">{infoMsg}</p>}

                  {emailOtpPending ? (
                    <div className="space-y-3">
                      <label className="block text-xs font-medium text-gray-400">Verification code sent to {pendingEmail}</label>
                      <OtpInput value={emailOtpCode} onChange={setEmailOtpCode} disabled={emailOtpVerifying} autoFocus />
                      <div className="flex gap-2">
                        <button onClick={handleVerifyEmailOtp} disabled={emailOtpCode.length !== 6 || emailOtpVerifying}
                          className="rounded-lg bg-[#0b66d1] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#0952a8] disabled:opacity-60">
                          {emailOtpVerifying ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Verify code"}
                        </button>
                        <button onClick={() => { setEmailOtpPending(false); setInfoMsg(""); }} className="rounded-lg px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-700">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2 pt-1">
                      <button onClick={handleSaveInfo} disabled={infoSaving}
                        className="rounded-lg bg-[#0b66d1] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#0952a8] disabled:opacity-60">
                        {infoSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Save changes"}
                      </button>
                      <button onClick={() => setEditingInfo(false)} className="rounded-lg px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-700">
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* Change Password — collapsed until "Change password" is clicked */}
            <section>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wide text-gray-400">Password</h2>
                {!editingPassword && (
                  <button onClick={() => { setEditingPassword(true); setPasswordMsg(""); }} className="flex items-center gap-1.5 text-xs font-semibold text-[#0b66d1] hover:text-[#0952a8]">
                    <Pencil className="h-3.5 w-3.5" /> Change password
                  </button>
                )}
              </div>
              {!editingPassword ? (
                <div className="mt-4 border-t border-gray-100 py-3.5">
                  <p className="text-sm font-medium text-gray-900">••••••••</p>
                </div>
              ) : (
                <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
                  <div className="relative">
                    <input type={showCurrentPw ? "text" : "password"} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Current password"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 pr-10 text-sm outline-none focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20" />
                    <button type="button" onClick={() => setShowCurrentPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showCurrentPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="relative">
                    <input type={showNewPw ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password (min. 8 characters)"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 pr-10 text-sm outline-none focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20" />
                    <button type="button" onClick={() => setShowNewPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="relative">
                    <input type={showConfirmPw ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 pr-10 text-sm outline-none focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20" />
                    <button type="button" onClick={() => setShowConfirmPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showConfirmPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {passwordMsg && <p className="text-xs text-gray-500">{passwordMsg}</p>}
                  <div className="flex gap-2">
                    <button onClick={handleChangePassword} disabled={passwordSaving}
                      className="rounded-lg bg-[#0b66d1] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#0952a8] disabled:opacity-60">
                      {passwordSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Update password"}
                    </button>
                    <button onClick={() => { setEditingPassword(false); setCurrentPassword(""); setNewPassword(""); setConfirmPassword(""); setPasswordMsg(""); }}
                      className="rounded-lg px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-700">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </section>

            {/* Preferences — Language & Currency */}
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wide text-gray-400">Preferences</h2>
              <div className="mt-4 grid gap-3 border-t border-gray-100 pt-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-400">Language</label>
                  <select value={language} onChange={(e) => setLanguage(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20">
                    {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-400">Currency</label>
                  <select value={currency} onChange={(e) => setCurrency(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20">
                    {[...new Map(countries.map((c) => [c.currency, c])).values()].map((c) => (
                      <option key={c.currency} value={c.currency}>{c.currency} ({c.symbol})</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <button onClick={handleSavePrefs} disabled={prefsSaving}
                  className="rounded-lg bg-[#0b66d1] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#0952a8] disabled:opacity-60">
                  {prefsSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Save preferences"}
                </button>
                {prefsSaved && <span className="text-xs font-medium text-emerald-600">Saved</span>}
              </div>
            </section>

            {/* Emergency contact */}
            <section>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wide text-gray-400">Emergency Contact</h2>
                {!editingEmergency && (
                  <button onClick={() => setEditingEmergency(true)} className="flex items-center gap-1.5 text-xs font-semibold text-[#0b66d1] hover:text-[#0952a8]">
                    <Pencil className="h-3.5 w-3.5" /> {passenger?.emergency_contact_name ? "Edit" : "Add"}
                  </button>
                )}
              </div>
              {!editingEmergency ? (
                <div className="mt-4 border-t border-gray-100 py-3.5">
                  {passenger?.emergency_contact_name ? (
                    <>
                      <p className="text-sm font-medium text-gray-900">{passenger.emergency_contact_name}</p>
                      <p className="text-xs text-gray-500">{passenger.emergency_contact_phone}</p>
                    </>
                  ) : (
                    <p className="flex items-center gap-1.5 text-sm text-gray-400">
                      <ShieldAlert className="h-4 w-4" /> No emergency contact on file.
                    </p>
                  )}
                </div>
              ) : (
                <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
                  <input value={emName} onChange={(e) => setEmName(e.target.value)} placeholder="Contact name"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20" />
                  <PhoneCountryInput countries={countries} phoneCountry={emPhoneCountry} setPhoneCountry={setEmPhoneCountry} phone={emPhoneDigits} setPhone={setEmPhoneDigits} />
                  <div className="flex gap-2">
                    <button onClick={handleSaveEmergency} disabled={emSaving}
                      className="rounded-lg bg-[#0b66d1] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#0952a8] disabled:opacity-60">
                      {emSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Save contact"}
                    </button>
                    <button onClick={() => setEditingEmergency(false)} className="rounded-lg px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-700">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* RIGHT column */}
          <div className="space-y-10">
            {/* Payment methods */}
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wide text-gray-400">Payment Methods</h2>
                <button onClick={() => setShowAddCard((v) => !v)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#0b66d1] hover:text-[#0952a8]">
                  <Plus className="h-3.5 w-3.5" /> Add Card
                </button>
              </div>

              {showAddCard && (
                <div className="mt-4 border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900">New card</p>
                    <button onClick={() => setShowAddCard(false)} className="text-gray-400 hover:text-gray-700">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <input value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="Cardholder name"
                      className="sm:col-span-2 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20" />
                    <input value={cardNumber} onChange={(e) => setCardNumber(fmtCardNumber(e.target.value))} placeholder="Card number"
                      inputMode="numeric"
                      className="sm:col-span-2 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20" />
                    <input value={cardExpiry} onChange={(e) => setCardExpiry(fmtExpiry(e.target.value))} placeholder="MM/YY"
                      inputMode="numeric" maxLength={5}
                      className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20" />
                    <input value={cardCvv} onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="CVV"
                      inputMode="numeric" type="password" maxLength={4}
                      className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20" />
                  </div>
                  <p className="mt-2 text-[11px] text-gray-400">Only the last 4 digits are stored — your full card number is never saved.</p>
                  <button onClick={handleAddCard} disabled={!cardValid || cardSaving}
                    className="mt-3 rounded-lg bg-[#0b66d1] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#0952a8] disabled:opacity-40">
                    {cardSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Save card"}
                  </button>
                </div>
              )}

              <div className="mt-4 divide-y divide-gray-100 border-t border-gray-100">
                {cards.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 py-10 text-center">
                    <CreditCard className="h-6 w-6 text-gray-300" />
                    <p className="text-sm text-gray-500">No cards saved yet.</p>
                  </div>
                ) : (
                  cards.map((c) => (
                    <div key={c.id} className="flex items-center justify-between gap-4 py-3.5">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {BRAND_LABEL[c.card_type] || "Card"} •••• {c.card_number}
                        </p>
                        <p className="text-xs text-gray-500">{c.cardholder_name} · {c.expiry}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        {c.is_default ? (
                          <span className="text-xs font-semibold text-gray-400">Default</span>
                        ) : (
                          <button onClick={() => handleSetDefault(c)} className="text-xs font-semibold text-gray-500 hover:text-gray-800">
                            Set default
                          </button>
                        )}
                        <button onClick={() => handleRemoveCard(c)} className="text-gray-300 hover:text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Notifications */}
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wide text-gray-400">Notifications</h2>
              <div className="mt-4 divide-y divide-gray-100 border-t border-gray-100">
                <div className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                    <Bell className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email</p>
                      <p className="text-xs text-gray-500">Offers, promos, and product updates.</p>
                    </div>
                  </div>
                  <Toggle on={emailOptIn} saving={notifSaving} onClick={handleToggleEmail} />
                </div>
              </div>
            </div>

            {/* Delete account */}
            <div>
              <button onClick={() => setShowDelete(true)} className="text-sm font-semibold text-red-500 hover:text-red-600">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete account confirm */}
      {showDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4" onClick={() => setShowDelete(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-xl bg-white p-6">
            <div className="flex items-center gap-2 text-red-500">
              <AlertTriangle className="h-5 w-5" />
              <h3 className="text-base font-bold">Delete your account?</h3>
            </div>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              This permanently deletes your BlackDrivo account, saved cards, and profile. This can&apos;t be undone.
            </p>

            <p className="mt-3 text-xs font-medium text-gray-500">Why are you leaving? (optional)</p>
            <select value={deleteReason} onChange={(e) => setDeleteReason(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100">
              <option value="">Select a reason</option>
              {DELETE_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>

            <p className="mt-3 text-xs font-medium text-gray-500">Type your email to confirm:</p>
            <input
              value={deleteConfirmText} onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder={passenger?.email || user?.email || ""}
              className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
            />
            <div className="mt-5 flex gap-3">
              <button onClick={() => setShowDelete(false)} className="flex-1 rounded-lg bg-gray-100 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-200">
                Cancel
              </button>
              <button onClick={handleDeleteAccount} disabled={!emailConfirmationRequired || deleting}
                className="flex-1 rounded-lg bg-red-500 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-40">
                {deleting ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : "Delete account"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
