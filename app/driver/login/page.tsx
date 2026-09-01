"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// Same flat, single-column, typeform-style shell as /driver/register and the
// live vendor.blackdrivo.com/login — bold question-style heading, underline
// field, one primary button bottom-left, no boxed card. Two steps: email,
// then password (matching the vendor login's own two-step shape), instead
// of one combined form.

const fieldLabelClass = "mb-1.5 block text-xs font-medium text-gray-500";
const flatInputClass =
  "w-full border-0 border-b border-gray-200 bg-transparent px-0 py-2.5 text-base text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#0b66d1]";

function DriverLoginForm() {
  const router = useRouter();
  const params = useSearchParams();

  const [step, setStep] = useState<"email" | "password">("email");
  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe,   setRememberMe]   = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");

  const goToPassword = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Enter a valid email address"); return }
    setError("");
    setStep("password");
  };

  const maskedEmail = (() => {
    const [name, domain] = email.split("@");
    if (!name || !domain) return email;
    return `${name.slice(0, 2)}${"*".repeat(Math.max(name.length - 2, 3))}@${domain}`;
  })();

  const handleSubmit = async () => {
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
    <div className="min-h-screen bg-[#f2f2f0]">
      <div className="mx-auto max-w-2xl px-6 py-10 md:px-4">

        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image src="/logo bb.png" alt="BlackDrivo" width={120} height={32} className="object-contain" style={{ height: "auto" }} />
          </Link>
          <Link href="/contact" className="text-xs font-medium text-gray-500 hover:text-gray-900">Support</Link>
        </div>

        {step === "password" && (
          <button
            type="button"
            onClick={() => { setStep("email"); setError(""); }}
            className="mt-8 flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm transition hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        )}

        <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }} className={step === "email" ? "mt-8" : "mt-8"}>

          {step === "email" ? (
            <>
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">Enter Email</h1>
              <p className="mt-2 text-sm text-gray-400">Sign in to your BlackDrivo driver account</p>

              <div className="mt-10">
                <label className={fieldLabelClass}>Email</label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && goToPassword()}
                  placeholder="you@example.com" autoFocus
                  className={flatInputClass}
                />
              </div>

              {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

              <div className="mt-10">
                <button onClick={goToPassword}
                  className="rounded-xl bg-[#0b66d1] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0952a8]">
                  Continue
                </button>
              </div>

              <p className="mt-8 text-sm text-gray-400">
                New driver?{" "}
                <Link href="/driver/register" className="font-medium text-[#0b66d1] hover:text-[#0952a8]">Apply here</Link>
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">Enter Password</h1>
              <p className="mt-2 text-sm text-gray-400">You&apos;re logging in with {maskedEmail}</p>

              <div className="mt-10">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSubmit()}
                    placeholder="Your password" autoFocus
                    className={`${flatInputClass} pr-8`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-500">
                  <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-[#0b66d1] focus:ring-[#0b66d1]" />
                  Remember me
                </label>
                <Link href="/forgot-password" className="text-sm font-medium text-[#0b66d1] hover:text-[#0952a8]">Forgot password?</Link>
              </div>

              {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

              <div className="mt-10">
                <button onClick={handleSubmit} disabled={loading}
                  className="flex items-center gap-2 rounded-xl bg-[#0b66d1] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0952a8] disabled:opacity-60">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Continue"}
                </button>
              </div>

              <p className="mt-8 text-sm text-gray-400">
                Looking to book a ride?{" "}
                <Link href="/#book" className="text-[#0b66d1] hover:underline">Book online</Link>
              </p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default function DriverLoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#f2f2f0]">
        <Loader2 className="h-6 w-6 animate-spin text-[#0b66d1]" />
      </div>
    }>
      <DriverLoginForm />
    </Suspense>
  );
}
