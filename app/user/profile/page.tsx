"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Save, User, Lock, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/lib/hooks/useUser";
import ProfileDropdown from "@/components/dashboard/ProfileDropdown";

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, loading, initials, displayName } = useUser();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profileError, setProfileError] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState("");

  useEffect(() => {
    if (!loading && !user) router.push("/login?redirect=/user/profile");
  }, [loading, user, router]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? "");
      setPhone(profile.phone ?? "");
    }
  }, [profile]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setProfileError("");
    const supabase = createClient();
    const { error } = await supabase
      .from("users")
      .update({ full_name: fullName, phone } as never)
      .eq("id", user.id);
    setSaving(false);
    if (error) {
      setProfileError(error.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");
    if (newPassword !== confirmPassword) {
      setPwError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setPwError("Password must be at least 8 characters.");
      return;
    }
    setPwSaving(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setPwSaving(false);
    if (error) {
      setPwError(error.message);
    } else {
      setPwSaved(true);
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPwSaved(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#0b66d1]" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-100 bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0b66d1]">
                <Image
                  src="/B Logo Black Theme.png"
                  alt="BlackDrivo"
                  width={18}
                  height={18}
                  className="object-contain invert mix-blend-screen"
                />
              </div>
              <span className="text-lg font-bold text-gray-900">BlackDrivo</span>
            </Link>
            <Link
              href="/user/dashboard"
              className="hidden items-center gap-1.5 text-sm text-gray-500 transition hover:text-gray-900 md:flex"
            >
              <ArrowLeft className="h-4 w-4" /> My Bookings
            </Link>
          </div>
          <ProfileDropdown initials={initials} displayName={displayName} email={user.email ?? ""} />
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-10 md:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your personal information and password.</p>
        </div>

        <div className="space-y-6">
          {/* Profile info */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#0b66d1]">
                <User className="h-4 w-4" />
              </div>
              <h2 className="text-base font-semibold text-gray-900">Personal Information</h2>
            </div>

            {profileError && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {profileError}
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700">Full Name</label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Smith"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700">Email Address</label>
                <input
                  value={user.email ?? ""}
                  disabled
                  className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-500 outline-none"
                />
                <p className="mt-1 text-xs text-gray-400">Email cannot be changed here.</p>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20"
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-[#0b66d1] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0952a8] disabled:opacity-60"
              >
                {saving ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : saved ? (
                  <><CheckCircle className="h-4 w-4" /> Saved</>
                ) : (
                  <><Save className="h-4 w-4" /> Save changes</>
                )}
              </button>
            </form>
          </motion.div>

          {/* Password */}
          <motion.div
            id="account"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#0b66d1]">
                <Lock className="h-4 w-4" />
              </div>
              <h2 className="text-base font-semibold text-gray-900">Change Password</h2>
            </div>

            {pwError && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {pwError}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="Min. 8 characters"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Repeat new password"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20"
                />
              </div>
              <button
                type="submit"
                disabled={pwSaving}
                className="flex items-center gap-2 rounded-xl bg-[#0b66d1] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0952a8] disabled:opacity-60"
              >
                {pwSaving ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : pwSaved ? (
                  <><CheckCircle className="h-4 w-4" /> Password updated</>
                ) : (
                  <><Lock className="h-4 w-4" /> Update password</>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
