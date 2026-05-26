"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();

  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

      if (authError) { setError(authError.message); setLoading(false); return; }

      // 1. Check metadata role
      let role = (data.user.user_metadata?.role as string | undefined) ?? "user";

      // 2. Check drivers table
      if (role !== "driver" && role !== "admin") {
        const { data: driverRow } = await (supabase as any)
          .from("drivers").select("id").eq("user_id", data.user.id).maybeSingle();
        if (driverRow) role = "driver";
      }

      // 3. Check / upsert public.users row for non-drivers
      if (role !== "driver") {
        // Try to read the users table row (may fail if RLS recursion not yet fixed)
        const { data: userRow, error: userRowError } = await (supabase as any)
          .from("users").select("role").eq("id", data.user.id).maybeSingle();

        if (!userRowError && userRow?.role === "admin") {
          role = "admin";
        }

        // Always upsert to ensure the row exists (INSERT policy has no recursion)
        // This is a no-op if the row already exists and data matches.
        const upsertPayload: Record<string, unknown> = {
          id: data.user.id,
          email: data.user.email!,
          name: (data.user.user_metadata?.full_name as string) || data.user.email!.split("@")[0],
          full_name: (data.user.user_metadata?.full_name as string) ?? null,
          phone: (data.user.user_metadata?.phone as string) ?? null,
        };
        if (role === "admin") upsertPayload.role = "admin";
        await (supabase as any).from("users").upsert(upsertPayload, { onConflict: "id" }).then(() => {}); // fire-and-forget
      }

      const redirect = params.get("redirect");
      const dest = role === "driver"
        ? "/driver/dashboard"
        : role === "admin"
        ? "/admin"
        : (redirect && redirect !== "/user/dashboard")
        ? redirect
        : "/user/dashboard";

      router.push(dest);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{ backgroundImage: "linear-gradient(135deg, rgba(11,102,209,0.85) 0%, rgba(9,82,168,0.9) 100%), url('https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80')", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="flex flex-col justify-between p-12 text-white">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
          <Image
          src="/logo bw.png"
          alt="BlackDrivo"
          width={140}
          height={40}
          className="object-contain transition-all duration-300"/>
          </Link>
          <div>
            <h2 className="text-4xl font-bold leading-tight text-white">Premium rides,<br />done right.</h2>
            <p className="mt-4 max-w-sm text-base text-white/70">Sign in to manage your bookings, view trip history, and access exclusive member benefits.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-white px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
          <Image
          src="/logo bb.png"
          alt="BlackDrivo"
          width={140}
          height={40}
          className="object-contain transition-all duration-300"/>
          </Link>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="mt-1.5 text-sm text-gray-500">Sign in to your BlackDrivo account</p>
          {error && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">Email address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="john@example.com"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20" />
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-xs font-medium text-gray-700">Password</label>
                <Link href="/forgot-password" className="text-xs text-[#0b66d1] hover:text-[#0952a8]">Forgot password?</Link>
              </div>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 pr-11 text-sm outline-none transition focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b66d1] py-3.5 text-sm font-semibold text-white transition hover:bg-[#0952a8] disabled:opacity-60">
              {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <>Sign in <ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-medium text-[#0b66d1] hover:text-[#0952a8]">Sign up free</Link>
          </p>
          <p className="mt-4 text-center text-sm text-gray-500">
            Are you a driver?{" "}
            <Link href="/driver/signup" className="font-medium text-[#0b66d1] hover:text-[#0952a8]">Register here</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <LoginForm />
    </Suspense>
  );
}
