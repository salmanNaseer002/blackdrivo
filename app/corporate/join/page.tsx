"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Briefcase, ChevronLeft, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/lib/hooks/useUser";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Enter a Corporate ID (b2b_clients.client_code) to link this passenger
// account to that company — ported from PassApp's CorporateJoin.js. Adds a
// row to passenger_b2b_clients (multi-corporate support — a passenger can
// belong to more than one company); the FIRST company joined also becomes
// passengers.b2b_client_id, the "primary" client Admin's tooling keys off of.
export default function CorporateJoinPage() {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userLoading) return;
    if (!user) router.replace("/login?redirect=/corporate/join");
  }, [user, userLoading, router]);

  const handleJoin = async () => {
    const trimmed = code.trim();
    if (!trimmed) { setError("Enter your Corporate ID"); return; }
    if (!user) return;
    setError("");
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: client, error: fetchErr } = await (supabase as any)
        .from("b2b_clients").select("id, name, status").eq("client_code", Number(trimmed)).maybeSingle();
      if (fetchErr) throw fetchErr;
      if (!client) { setError("Corporate ID not found — check with your company admin"); setLoading(false); return; }
      if (client.status && client.status !== "active") { setError("This company account is currently inactive"); setLoading(false); return; }

      const { data: existing } = await (supabase as any).from("passenger_b2b_clients")
        .select("id").eq("passenger_id", user.id).eq("b2b_client_id", client.id).maybeSingle();
      if (existing) { setError(`You're already a member of ${client.name}`); setLoading(false); return; }

      const { error: memErr } = await (supabase as any).from("passenger_b2b_clients")
        .insert({ passenger_id: user.id, b2b_client_id: client.id });
      if (memErr) throw memErr;

      const { data: passenger } = await (supabase as any).from("passengers").select("b2b_client_id").eq("id", user.id).maybeSingle();
      if (!passenger?.b2b_client_id) {
        await (supabase as any).from("passengers").update({ b2b_client_id: client.id }).eq("id", user.id);
      }

      router.replace("/corporate");
    } catch (e: any) {
      setError(e.message || "Failed to join — please try again");
    } finally {
      setLoading(false);
    }
  };

  if (userLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#0b66d1]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="mx-auto max-w-md px-4 pb-24 pt-32 md:pt-36">
        <Link href="/corporate" className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700">
          <ChevronLeft className="h-4 w-4" /> Corporate
        </Link>

        <div className="mt-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
          <Briefcase className="h-6 w-6 text-gray-900" />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-gray-900">Join Corporate Account</h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-500">
          Enter the Corporate ID shared by your company to link your account and access scheduled corporate rides.
        </p>

        <label className="mt-8 block text-xs font-semibold uppercase tracking-wide text-gray-400">Corporate ID</label>
        <input
          value={code}
          onChange={(e) => { setCode(e.target.value.replace(/\D/g, "")); setError(""); }}
          placeholder="e.g. 1001"
          inputMode="numeric"
          className={`mt-2 w-full border-b py-3 text-xl font-bold tracking-wide text-gray-900 outline-none ${error ? "border-red-400" : "border-gray-200 focus:border-[#0b66d1]"}`}
        />
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

        <button onClick={handleJoin} disabled={loading}
          className="mt-8 w-full rounded-full bg-gray-900 py-3.5 text-sm font-bold text-white transition hover:bg-gray-800 disabled:opacity-60">
          {loading ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : "Join"}
        </button>
      </div>
      <Footer />
    </div>
  );
}
