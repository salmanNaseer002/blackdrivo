"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, CheckCircle, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const perks = [
  "Instant booking confirmation",
  "Booking history & receipts",
  "Saved locations",
  "Priority customer support",
];

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    if (!success) return;
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval);
          router.push("/login");
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [success, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, phone, role: "user" },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (authError) {
        setError(authError.message);
      } else if (data.session) {
        // Email confirmation disabled — user is already signed in.
        // Upsert into public.users as a backup in case the DB trigger missed it.
        await supabase.from("users").upsert(
          {
            id: data.session.user.id,
            email: data.session.user.email ?? email,
            full_name: fullName || null,
            phone: phone || null,
            role: "user",
          } as never,
          { onConflict: "id" }
        );
        router.push("/user/dashboard");
      } else {
        // Email confirmation enabled — show verify screen + countdown
        setSuccess(true);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm rounded-2xl bg-white border border-gray-100 shadow-xl p-8 text-center"
        >
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
            <CheckCircle className="h-7 w-7 text-[#0b66d1]" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Check your email</h2>
          <p className="mt-2 text-sm text-gray-600">
            We&apos;ve sent a confirmation link to{" "}
            <span className="font-medium text-gray-900">{email}</span>. Click
            the link to activate your account.
          </p>
          <p className="mt-4 text-xs text-gray-400">
            Redirecting to sign in in {countdown}s…
          </p>
          <Link
            href="/login"
            className="mt-4 block rounded-xl bg-[#0b66d1] py-3 text-sm font-semibold text-white transition hover:bg-[#0952a8]"
          >
            Go to sign in now
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel — dark blue gradient over image */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(9,82,168,0.9) 0%, rgba(11,102,209,0.85) 100%), url('https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex flex-col justify-between p-12 text-white">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
              <Image
                src="/B Logo Black Theme.png"
                alt="BlackDrivo"
                width={22}
                height={22}
                className="object-contain invert mix-blend-screen"
              />
            </div>
            <span className="text-xl font-bold text-white">BlackDrivo</span>
          </Link>
          <div>
            <h2 className="text-4xl font-bold leading-tight text-white">
              Join thousands
              <br />
              of happy riders.
            </h2>
            <p className="mt-4 mb-6 text-base text-white/70">
              Create your free account and book premium rides in minutes.
            </p>
            <ul className="space-y-3">
              {perks.map((perk) => (
                <li
                  key={perk}
                  className="flex items-center gap-2.5 text-sm text-white/80"
                >
                  <CheckCircle className="h-4 w-4 text-white" />
                  {perk}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Right panel — white */}
      <div className="flex flex-1 items-center justify-center bg-white px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <div className="mb-8 lg:hidden">
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
              <span className="text-lg font-bold text-gray-900">
                BlackDrivo
              </span>
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            Create an account
          </h1>
          <p className="mt-1.5 text-sm text-gray-500">
            Start booking premium rides today
          </p>

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">
                Full Name
              </label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="John Smith"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none ring-[#0b66d1] focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20 transition"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="john@example.com"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none ring-[#0b66d1] focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20 transition"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none ring-[#0b66d1] focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20 transition"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="Min. 8 characters"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 pr-11 text-sm text-gray-900 placeholder-gray-400 outline-none ring-[#0b66d1] focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b66d1] py-3.5 text-sm font-semibold text-white transition hover:bg-[#0952a8] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  Create account <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <p className="text-center text-xs text-gray-400">
              By signing up you agree to our{" "}
              <Link
                href="/terms-of-service"
                className="text-[#0b66d1] hover:text-[#0952a8]"
              >
                Terms
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy-policy"
                className="text-[#0b66d1] hover:text-[#0952a8]"
              >
                Privacy Policy
              </Link>
            </p>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-[#0b66d1] hover:text-[#0952a8]"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
