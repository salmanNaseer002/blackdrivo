"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface UseUserReturn {
  user: User | null;
  loading: boolean;
  role: string;
  initials: string;
  displayName: string;
}

export function useUser(): UseUserReturn {
  const [user, setUser]       = useState<User | null>(null);
  const [role, setRole]       = useState("user");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const fetchRole = async (u: User) => {
      // 1. Check metadata
      const metaRole = u.user_metadata?.role as string | undefined;
      if (metaRole && metaRole !== "user") {
        setRole(metaRole);
        return;
      }
      // 2. Check drivers table
      const { data: driverRow } = await supabase
        .from("drivers").select("id").eq("user_id", u.id).maybeSingle();
      if (driverRow) { setRole("driver"); return; }
      // 3. Check users table for admin
      const { data: userRow } = await supabase
        .from("users").select("role").eq("id", u.id).maybeSingle();
      if (userRow?.role === "admin") { setRole("admin"); return; }
      setRole("user");
    };

    supabase.auth.getUser().then(({ data: { user: u } }) => {
      setUser(u);
      if (u) fetchRole(u).finally(() => setLoading(false));
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchRole(session.user);
      else { setRole("user"); setLoading(false); }
    });

    return () => subscription.unsubscribe();
  }, []);

  const displayName = user?.user_metadata?.full_name
    || user?.user_metadata?.name
    || user?.email?.split("@")[0]
    || "User";

  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return { user, loading, role, initials, displayName };
}
