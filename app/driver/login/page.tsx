"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

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
    <div className="flex min-h-screen">

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[440px] shrink-0 flex-col justify-between p-12 text-white"
        style={{ background: "linear-gradient(160deg, #0b1f3a 0%, #0b66d1 100%)" }}>

        <Link href="/">
          <Image src="/logo wb.png" alt="BlackDrivo" width={130} height={36} style={{ height: "auto" }} className="object-contain" />
        </Link>

        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-white/50">Driver Portal</p>
          <h2 className="text-4xl font-bold leading-tight">Welcome back,<br />Chauffeur.</h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
            Sign in to your BlackDrivo driver dashboard. Manage your rides, update your profile, and stay connected with dispatch.
          </p>

          <div className="mt-10 space-y-3">
            {[
              "View and manage upcoming rides",
              "Update your availability status",
              "Upload and track your documents",
              "Monitor your ratings and earnings",
            ].map(item => (
              <div key={item} className="flex items-center gap-3 text-sm text-white/70">
                <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#0b66d1]" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-white/30">
          Looking to book a ride?{" "}
          <Link href="/login" className="text-white/60 hover:text-white underline">Passenger login</Link>
        </p>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 items-center justify-center bg-white px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="mb-8 lg:hidden">
            <Link href="/">
              <Image src="/logo bb.png" alt="BlackDrivo" width={130} height={36} style={{ height: "auto" }} className="object-contain" />
            </Link>
          </div>

          {/* Badge */}
          <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#0b66d1]">
            Driver Portal
          </span>

          <h1 className="mt-3 text-2xl font-bold text-gray-900">Sign in to your account</h1>
          <p className="mt-1.5 text-sm text-gray-500">Access your BlackDrivo driver dashboard</p>

          {/* Error */}
          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Password</label>
                <Link href="/forgot-password" className="text-xs text-[#0b66d1] hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="Your password"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-11 text-sm outline-none transition focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b66d1] py-3.5 text-sm font-semibold text-white transition hover:bg-[#0952a8] disabled:opacity-60"
            >
              {loading
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : <><ArrowRight className="h-4 w-4" /> Sign in to Dashboard</>
              }
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-100" />
            <span className="text-xs text-gray-400">or</span>
            <div className="h-px flex-1 bg-gray-100" />
          </div>

          {/* Sign up link */}
          <p className="text-center text-sm text-gray-500">
            Don't have a driver account?{" "}
            <Link href="/driver/signup" className="font-semibold text-[#0b66d1] hover:text-[#0952a8]">
              Apply to drive
            </Link>
          </p>

          {/* Passenger login link */}
          <p className="mt-3 text-center text-xs text-gray-400">
            Looking to book a ride?{" "}
            <Link href="/login" className="text-[#0b66d1] hover:underline">Passenger login</Link>
          </p>

        </motion.div>
      </div>
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