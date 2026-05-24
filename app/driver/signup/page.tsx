"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, Car } from "lucide-react";
import { toast } from "sonner";

const inputClass = "w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20";

export default function DriverSignupPage() {
  const router = useRouter();
  const [form, setForm]         = useState({ email: "", password: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [errors, setErrors]     = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password || form.password.length < 8) e.password = "Min 8 characters";
    if (form.password !== form.confirm) e.confirm = "Passwords do not match";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const res    = await fetch("/api/driver/signup", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          email:    form.email.trim().toLowerCase(),
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");
      toast.success("Account created! Please complete your profile.");
      router.push("/login");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 text-white"
        style={{ backgroundImage: "linear-gradient(135deg, #0b66d1 0%, #0952a8 100%)" }}>
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
            <Image src="/B Logo Black Theme.png" alt="BlackDrivo" width={22} height={22} className="object-contain invert mix-blend-screen" />
          </div>
          <span className="text-xl font-bold">BlackDrivo</span>
        </Link>
        <div>
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
            <Car className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold leading-tight">Start your<br />driver journey</h2>
          <p className="mt-4 max-w-sm text-base text-white/70">
            Create your account in seconds. Complete your profile at your own pace and start earning with BlackDrivo.
          </p>
          <div className="mt-8 space-y-3">
            {["Create account — takes 30 seconds", "Complete profile at your own pace", "Get approved within 2–3 business days", "Start accepting premium rides"].map((s, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-white/80">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-bold">{i + 1}</div>
                {s}
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-white/40">© 2025 BlackDrivo. All rights reserved.</p>
      </div>

      {/* Right */}
      <div className="flex flex-1 items-center justify-center bg-white px-4 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0b66d1]">
                <Image src="/B Logo Black Theme.png" alt="BlackDrivo" width={18} height={18} className="object-contain invert mix-blend-screen" />
              </div>
              <span className="text-lg font-bold text-gray-900">BlackDrivo</span>
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-gray-900">Create driver account</h1>
          <p className="mt-1.5 text-sm text-gray-500">Join BlackDrivo's professional chauffeur network</p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">Email address *</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com" className={`${inputClass} ${errors.email ? "border-red-300" : ""}`} />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">Password *</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Min 8 characters" className={`${inputClass} pr-10 ${errors.password ? "border-red-300" : ""}`} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">Confirm password *</label>
              <input type="password" value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                placeholder="Repeat password" className={`${inputClass} ${errors.confirm ? "border-red-300" : ""}`} />
              {errors.confirm && <p className="mt-1 text-xs text-red-500">{errors.confirm}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b66d1] py-3.5 text-sm font-semibold text-white transition hover:bg-[#0952a8] disabled:opacity-60">
              {loading
                ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                : <>Create Account <ArrowRight className="h-4 w-4" /></>
              }
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-[#0b66d1] hover:text-[#0952a8]">Sign in</Link>
          </p>
          <p className="mt-2 text-center text-xs text-gray-400">
            By signing up you agree to our{" "}
            <Link href="/terms-of-service" className="text-[#0b66d1]">Terms of Service</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
