"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import OtpInput from "@/components/shared/OtpInput";

// Same flat, single-column, typeform-style shell as /driver/login and
// /driver/register — no boxed card, underline-only fields, single primary
// button. All existing logic (password/OTP mode toggle, Google sign-in,
// forgot-password, unregistered-email check) is unchanged.

const fieldLabelClass = "mb-1.5 block text-xs font-medium text-gray-500";
const flatInputClass =
  "w-full border-0 border-b border-gray-200 bg-transparent px-0 py-2.5 text-base text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#0b66d1] disabled:text-gray-400";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4">
      <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.82z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.88-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.26v3.1A11.99 11.99 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.27 14.28A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.56.38-2.28v-3.1H1.26A11.99 11.99 0 0 0 0 12c0 1.94.46 3.77 1.26 5.38l4.01-3.1z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.26 6.62l4.01 3.1C6.22 6.86 8.87 4.75 12 4.75z" />
    </svg>
  );
}

// Looks up our own passengers/users tables before Supabase's password-reset
// or OTP calls — Supabase's own auth endpoints intentionally don't reveal
// whether an email is registered (anti-enumeration), but the user explicitly
// wants an "this email isn't registered" error, so we check ourselves first.
async function emailIsRegistered(email: string): Promise<boolean> {
  const supabase = createClient();
  const trimmed = email.trim().toLowerCase();
  const [{ count: pCount }, { count: uCount }] = await Promise.all([
    (supabase as any).from("passengers").select("id", { count: "exact", head: true }).ilike("email", trimmed),
    (supabase as any).from("users").select("id", { count: "exact", head: true }).ilike("email", trimmed),
  ]);
  return (pCount || 0) > 0 || (uCount || 0) > 0;
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetSending, setResetSending] = useState(false);

  const [otpMode, setOtpMode] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);

  const redirectPath = params.get("redirect") || "/booking/review";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) {
        setError("Invalid email or password. Please try again.");
        setLoading(false);
        return;
      }
      router.push(redirectPath);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      const supabase = createClient();
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectPath)}` },
      });
    } catch {
      toast.error("Couldn't start Google sign-in. Please try again.");
      setGoogleLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) { toast.error("Enter your email above first, then tap Forgot password"); return; }
    setResetSending(true);
    setError("");
    try {
      const registered = await emailIsRegistered(email);
      if (!registered) {
        setError("This email isn't registered with BlackDrivo.");
        setResetSending(false);
        return;
      }
      const supabase = createClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (resetError) throw resetError;
      toast.success("Password reset link sent — check your email");
    } catch (e: any) {
      toast.error(e.message || "Couldn't send reset link. Please try again.");
    }
    setResetSending(false);
  };

  const handleSendOtp = async () => {
    if (!email.trim()) { toast.error("Enter your email first"); return; }
    setOtpSending(true);
    setError("");
    try {
      const registered = await emailIsRegistered(email);
      if (!registered) {
        setError("This email isn't registered with BlackDrivo.");
        setOtpSending(false);
        return;
      }
      const supabase = createClient();
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: false },
      });
      if (otpError) throw otpError;
      setOtpSent(true);
      toast.success("Code sent — check your email");
    } catch (e: any) {
      toast.error(e.message || "Couldn't send the code. Please try again.");
    }
    setOtpSending(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.trim().length !== 6) return;
    setOtpVerifying(true);
    setError("");
    try {
      const supabase = createClient();
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email, token: otpCode.trim(), type: "email",
      });
      if (verifyError) {
        setError("That code is incorrect or expired. Please try again.");
        setOtpVerifying(false);
        return;
      }
      router.push(redirectPath);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setOtpVerifying(false);
    }
  };

  const switchToOtp = () => {
    setOtpMode(true);
    setOtpSent(false);
    setOtpCode("");
    setError("");
  };

  const switchToPassword = () => {
    setOtpMode(false);
    setOtpSent(false);
    setOtpCode("");
    setError("");
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

        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }} className="mt-8">

          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">Welcome back</h1>
          <p className="mt-2 text-sm text-gray-400">Sign in to continue your booking</p>

          {!otpMode ? (
            <form onSubmit={handleSubmit} className="mt-10 space-y-8">
              <div>
                <label className={fieldLabelClass}>Email</label>
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  placeholder="you@example.com" className={flatInputClass}
                />
              </div>
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className={fieldLabelClass}>Password</label>
                  <button type="button" onClick={handleForgotPassword} disabled={resetSending} className="text-xs font-semibold text-[#0b66d1] hover:text-[#0952a8] disabled:opacity-60">
                    {resetSending ? "Sending..." : "Forgot password?"}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required
                    placeholder="Your password" className={`${flatInputClass} pr-8`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button type="submit" disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-[#0b66d1] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0952a8] disabled:opacity-60">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Sign in <ArrowRight className="h-4 w-4" /></>}
              </button>
            </form>
          ) : (
            <div className="mt-10 space-y-8">
              <div>
                <label className={fieldLabelClass}>Email</label>
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={otpSent}
                  placeholder="you@example.com" className={flatInputClass}
                />
              </div>

              {!otpSent ? (
                <button type="button" onClick={handleSendOtp} disabled={otpSending}
                  className="flex items-center gap-2 rounded-xl bg-[#0b66d1] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0952a8] disabled:opacity-60">
                  {otpSending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send OTP"}
                </button>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-8">
                  <div>
                    <div className="mb-1.5 flex items-center justify-between">
                      <label className={fieldLabelClass}>Enter OTP</label>
                      <button type="button" onClick={handleSendOtp} disabled={otpSending} className="text-xs font-semibold text-[#0b66d1] hover:text-[#0952a8] disabled:opacity-60">
                        {otpSending ? "Resending..." : "Resend code"}
                      </button>
                    </div>
                    <OtpInput value={otpCode} onChange={setOtpCode} disabled={otpVerifying} autoFocus />
                  </div>
                  {error && <p className="text-sm text-red-600">{error}</p>}
                  <button type="submit" disabled={otpVerifying}
                    className="flex items-center gap-2 rounded-xl bg-[#0b66d1] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0952a8] disabled:opacity-60">
                    {otpVerifying ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Sign in <ArrowRight className="h-4 w-4" /></>}
                  </button>
                </form>
              )}
              {!otpSent && error && <p className="text-sm text-red-600">{error}</p>}
            </div>
          )}

          <div className="mt-8">
            {!otpMode ? (
              <button type="button" onClick={switchToOtp} className="text-sm font-semibold text-[#0b66d1] hover:text-[#0952a8]">
                Login with Email OTP instead
              </button>
            ) : (
              <button type="button" onClick={switchToPassword} className="text-sm font-semibold text-[#0b66d1] hover:text-[#0952a8]">
                Login with password instead
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading}
            className="mt-8 flex items-center gap-2.5 rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
          >
            {googleLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon />}
            Continue with Google
          </button>

          <p className="mt-8 text-sm text-gray-400">
            Don&apos;t have an account?{" "}
            <Link href={`/signup${params.get("redirect") ? `?redirect=${params.get("redirect")}` : ""}`} className="font-medium text-[#0b66d1] hover:text-[#0952a8]">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#f2f2f0]"><Loader2 className="h-6 w-6 animate-spin text-[#0b66d1]" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
