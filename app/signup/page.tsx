"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useSiteCountry } from "@/components/providers/CountryProvider";
import { isValidPhone } from "@/lib/booking/phone";
import type { SiteCountry } from "@/lib/booking/country";
import PhoneCountryInput from "@/components/shared/PhoneCountryInput";

function SignupForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { country, countries } = useSiteCountry();

  // Phone's own country (defaults to the site's geolocation-detected country,
  // but can be changed independently — e.g. booking from a laptop in the US
  // for a trip in Pakistan while the phone number itself is Pakistani).
  const [phoneCountry, setPhoneCountry] = useState<SiteCountry>(country);
  useEffect(() => { setPhoneCountry(country); }, [country]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!isValidPhone(phone, phoneCountry.code)) { setError("Please enter a valid phone number"); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
    if (password !== confirmPassword) { setError("Passwords do not match"); return; }
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: name } },
      });
      if (signUpError) {
        setError(signUpError.message || "Failed to create account");
        setLoading(false);
        return;
      }

      if (data.user) {
        const phoneDigits = phone.replace(/\D/g, "");
        await (supabase as any).from("passengers").upsert({
          id: data.user.id,
          name,
          email: email.trim().toLowerCase(),
          phone: `${phoneCountry.phone_code}${phoneDigits}`,
          country_code: country.code,
          country: country.code,
          status: "active",
          source: "website_signup",
        }, { onConflict: "id" });
      }

      if (data.session) {
        router.push(params.get("redirect") || "/booking/review");
        router.refresh();
      } else {
        setError("");
        setLoading(false);
        router.push(`/login${params.get("redirect") ? `?redirect=${params.get("redirect")}` : ""}`);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-sm"
      >
        <Link href="/" className="text-lg font-bold text-gray-900">BlackDrivo</Link>

        <h1 className="mt-6 text-2xl font-bold text-gray-900">Create your account</h1>
        <p className="mt-1.5 text-sm text-gray-500">One quick step to finish your booking</p>

        {error && (
          <div className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">Full name</label>
            <input
              value={name} onChange={(e) => setName(e.target.value)} required
              placeholder="Your name"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 outline-none transition focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">Email</label>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              placeholder="you@example.com"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 outline-none transition focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">Phone number</label>
            <PhoneCountryInput countries={countries} phoneCountry={phoneCountry} setPhoneCountry={setPhoneCountry} phone={phone} setPhone={setPhone} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">Password</label>
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
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">Confirm password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                placeholder="Re-enter your password"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 pr-11 text-sm text-gray-900 outline-none transition focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20"
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0b66d1] py-3.5 text-sm font-semibold text-white transition hover:bg-[#0952a8] disabled:opacity-60">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Create account <ArrowRight className="h-4 w-4" /></>}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href={`/login${params.get("redirect") ? `?redirect=${params.get("redirect")}` : ""}`} className="font-semibold text-[#0b66d1] hover:text-[#0952a8]">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-[#0b66d1]" /></div>}>
      <SignupForm />
    </Suspense>
  );
}
