"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// Same centered single-card shell as the passenger login page
// (app/login/page.tsx) — this used to be a split-screen layout with a left
// gradient panel; redesigned to match so Driver/Passenger login feel like
// one product, not two.
function DriverLoginForm() {
  const router = useRouter();
  const params = useSearchParams();

  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

      if (authError) {
        setError("Invalid email or password. Please try again.");
        setLoading(false);
        return;
      }

      // Check if this user is actually a driver
      const role = data.user.user_metadata?.role as string | undefined;

      const { data: driverRow } = await (supabase as any)
        .from("drivers")
        .select("id, status")
        .eq("user_id", data.user.id)
        .maybeSingle();

      if (!driverRow && role !== "driver") {
        // Not a driver — sign them out and show error
        await supabase.auth.signOut();
        setError("No driver account found with this email. Please sign up first.");
        setLoading(false);
        return;
      }

      const redirect = params.get("redirect");
      const dest = redirect?.startsWith("/driver") ? redirect : "/driver/dashboard";
      router.push(dest);
      router.refresh();

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

        <span className="mt-4 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#0b66d1]">
          Driver Portal
        </span>

        <h1 className="mt-3 text-2xl font-bold text-gray-900">Welcome back</h1>
        <p className="mt-1.5 text-sm text-gray-500">Sign in to your BlackDrivo driver dashboard</p>

        {error && (
          <div className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">Email</label>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              placeholder="you@example.com"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 outline-none transition focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20"
            />
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">Password</label>
              <Link href="/forgot-password" className="text-xs font-semibold text-[#0b66d1] hover:text-[#0952a8]">Forgot password?</Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required
                placeholder="Your password"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 pr-11 text-sm text-gray-900 outline-none transition focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0b66d1] py-3.5 text-sm font-semibold text-white transition hover:bg-[#0952a8] disabled:opacity-60">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Sign in <ArrowRight className="h-4 w-4" /></>}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don&apos;t have a driver account?{" "}
          <Link href="/driver/register" className="font-semibold text-[#0b66d1] hover:text-[#0952a8]">
            Apply to drive
          </Link>
        </p>

        <p className="mt-3 text-center text-xs text-gray-400">
          Looking to book a ride?{" "}
          <Link href="/#book" className="text-[#0b66d1] hover:underline">Book online</Link>
        </p>
      </motion.div>
    </div>
  );
}

export default function DriverLoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#0b66d1]" />
      </div>
    }>
      <DriverLoginForm />
    </Suspense>
  );
}
