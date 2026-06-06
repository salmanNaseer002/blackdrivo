"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { Profile, UserRole } from "@/lib/supabase/types";

interface UseUserReturn {
  user:        User | null;
  profile:     Profile | null;
  loading:     boolean;
  role:        string;
  userType:    string | null;   // 'passenger' | 'driver' | 'passenger_driver'
  isDriver:    boolean;
  initials:    string;
  displayName: string;
}

export function useUser(): UseUserReturn {
  const [user,    setUser]    = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role,    setRole]    = useState("user");
  const [userType,setUserType]= useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    const fetchProfile = async (u: User) => {
      const metaRole = u.user_metadata?.role as UserRole | undefined;

      // Always fetch from users table for latest user_type
      const { data: row, error: rowError } = await (supabase as any)
        .from("users")
        .select("*")
        .eq("id", u.id)
        .maybeSingle();

      if (!active) return;

      if (row && !rowError) {
        const p = row as Profile & { user_type?: string };
        setProfile(p);
        setRole(p.role ?? "user");
        setUserType(p.user_type ?? (metaRole === "driver" ? "driver" : "passenger"));
        return;
      }

      // Fallback from metadata
      const isDriverMeta = metaRole === "driver";
      const newRow = {
        id:        u.id,
        email:     u.email ?? "",
        name:      (u.user_metadata?.full_name as string) || (u.email ?? "").split("@")[0],
        full_name: (u.user_metadata?.full_name as string) ?? null,
        phone:     (u.user_metadata?.phone as string) ?? null,
        user_type: isDriverMeta ? "driver" : "passenger",
      };
      (supabase as any).from("users").upsert(newRow, { onConflict: "id" }).then(() => {});
      setProfile({
        ...newRow,
        role:       "ops" as UserRole,
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      setRole("ops");
      setUserType(isDriverMeta ? "driver" : "passenger");
    };

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!active) return;
      const u = session?.user ?? null;
      setUser(u);
      if (u) await fetchProfile(u);
      setLoading(false);
    };

    init();

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
        setUserType(null);
        setLoading(false);
      }
    });

    return () => { active = false; subscription.unsubscribe(); };
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

  const isDriver = userType === "driver";

  return { user, profile, loading, role, userType, isDriver, initials, displayName };
}
