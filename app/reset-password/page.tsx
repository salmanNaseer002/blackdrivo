"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function ResetPasswordForm() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
    if (password !== confirmPassword) { setError("Passwords do not match"); return; }
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        setError(updateError.message || "Couldn't reset your password. The link may have expired — request a new one.");
        setLoading(false);
        return;
      }
      setDone(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-sm"
      >
        <Link href="/" className="text-lg font-bold text-gray-900">BlackDrivo</Link>

        {done ? (
          <>
            <h1 className="mt-6 text-2xl font-bold text-gray-900">Password updated</h1>
            <p className="mt-1.5 text-sm text-gray-500">Taking you to sign in...</p>
          </>
        ) : (
          <>
            <h1 className="mt-6 text-2xl font-bold text-gray-900">Set a new password</h1>
            <p className="mt-1.5 text-sm text-gray-500">Choose a new password for your account</p>

            {error && (
              <div className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">New password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required
                    placeholder="Min. 8 characters"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 pr-11 text-sm text-gray-900 outline-none transition focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">Confirm new password</label>
                <input
                  type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                  placeholder="Re-enter your password"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 outline-none transition focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20"
                />
              </div>

              <button type="submit" disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0b66d1] py-3.5 text-sm font-semibold text-white transition hover:bg-[#0952a8] disabled:opacity-60">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Update password <ArrowRight className="h-4 w-4" /></>}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-[#0b66d1]" /></div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
