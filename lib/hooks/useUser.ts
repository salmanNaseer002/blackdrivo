"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { Profile, UserRole } from "@/lib/supabase/types";

interface UseUserReturn {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  role: string;
  initials: string;
  displayName: string;
}

export function useUser(): UseUserReturn {
  const [user, setUser]       = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole]       = useState("user");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    const fetchProfile = async (u: User) => {
      const metaRole = u.user_metadata?.role as UserRole | undefined;

      if (metaRole === "driver") {
        if (!active) return;
        setRole("driver");
        const meta = u.user_metadata ?? {};
        setProfile({
          id: u.id,
          email: u.email ?? "",
          full_name: (meta.full_name as string) ?? null,
          phone: (meta.phone as string) ?? null,
          role: "driver",
          avatar_url: null,
          created_at: "",
          updated_at: "",
        });
        return;
      }

      const { data: row, error: rowError } = await (supabase as any)
        .from("users")
        .select("*")
        .eq("id", u.id)
        .maybeSingle();

      if (!active) return;

      // If we get data, use it
      if (row && !rowError) {
        const p = row as Profile;
        setProfile(p);
        setRole(p.role ?? "user");
        return;
      }

      // Either the row doesn't exist, or the RLS policy blocked the read.
      // In both cases, build a local profile from auth metadata and attempt
      // to create the public.users row (INSERT policy is never recursive).
      const newRow = {
        id: u.id,
        email: u.email ?? "",
        name: (u.user_metadata?.full_name as string) || (u.email ?? "").split("@")[0],
        full_name: (u.user_metadata?.full_name as string) ?? null,
        phone: (u.user_metadata?.phone as string) ?? null,
        // role omitted — DB uses column DEFAULT ('ops')
      };
      // Fire-and-forget — don't block the UI on this
      (supabase as any).from("users").upsert(newRow, { onConflict: "id" }).then(() => {});
      setProfile({
        ...newRow,
        role: "ops" as UserRole,
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      setRole("ops");
    };

    // getSession() reads from localStorage — no server round-trip, loads instantly
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!active) return;
      const u = session?.user ?? null;
      setUser(u);
      if (u) await fetchProfile(u);
      setLoading(false);
    };

    init();

    // Handle subsequent auth changes; skip INITIAL_SESSION (handled by init above)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      if (event === "INITIAL_SESSION") return;
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        fetchProfile(u).finally(() => { if (active) setLoading(false); });
      } else {
        setProfile(null);
        setRole("user");
        setLoading(false);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const displayName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "User";

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return { user, profile, loading, role, initials, displayName };
}
