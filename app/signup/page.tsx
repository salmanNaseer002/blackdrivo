"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useSiteCountry } from "@/components/providers/CountryProvider";
import { isValidPhone } from "@/lib/booking/phone";
import type { SiteCountry } from "@/lib/booking/country";
import PhoneCountryInput from "@/components/shared/PhoneCountryInput";

// Same flat, single-column, typeform-style shell as /login, /driver/login,
// and /driver/register — no boxed card, underline-only fields, single
// primary button. All existing logic (signUp, passengers upsert, phone
// validation) is unchanged.

const fieldLabelClass = "mb-1.5 block text-xs font-medium text-gray-500";
const flatInputClass =
  "w-full border-0 border-b border-gray-200 bg-transparent px-0 py-2.5 text-base text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#0b66d1]";

function SignupForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { country, countries } = useSiteCountry();

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
    <div className="min-h-screen bg-[#f2f2f0]">
      <div className="mx-auto max-w-2xl px-6 py-10 md:px-4">

        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image src="/logo bb.png" alt="BlackDrivo" width={120} height={32} className="object-contain" style={{ height: "auto" }} />
          </Link>
          <Link href="/contact" className="text-xs font-medium text-gray-500 hover:text-gray-900">Support</Link>
        </div>

        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }} className="mt-8">

          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">Create your account</h1>
          <p className="mt-2 text-sm text-gray-400">One quick step to finish your booking</p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-8">
            <div>
              <label className={fieldLabelClass}>Full name</label>
              <input
                value={name} onChange={(e) => setName(e.target.value)} required
                placeholder="Your name" className={flatInputClass}
              />
            </div>
            <div>
              <label className={fieldLabelClass}>Email</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                placeholder="you@example.com" className={flatInputClass}
              />
            </div>
            <div>
              <label className={fieldLabelClass}>Phone number</label>
              <PhoneCountryInput countries={countries} phoneCountry={phoneCountry} setPhoneCountry={setPhoneCountry} phone={phone} setPhone={setPhone} />
            </div>
            <div>
              <label className={fieldLabelClass}>Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required
                  placeholder="Min. 8 characters" className={`${flatInputClass} pr-8`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className={fieldLabelClass}>Confirm password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                  placeholder="Re-enter your password" className={`${flatInputClass} pr-8`}
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button type="submit" disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-[#0b66d1] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0952a8] disabled:opacity-60">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Create account <ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>

          <p className="mt-8 text-sm text-gray-400">
            Already have an account?{" "}
            <Link href={`/login${params.get("redirect") ? `?redirect=${params.get("redirect")}` : ""}`} className="font-medium text-[#0b66d1] hover:text-[#0952a8]">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#f2f2f0]"><Loader2 className="h-6 w-6 animate-spin text-[#0b66d1]" /></div>}>
      <SignupForm />
    </Suspense>
  );
}
