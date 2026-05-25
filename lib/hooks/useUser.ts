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

    const fetchUserData = async (u: User) => {
      const metaRole = u.user_metadata?.role as UserRole | undefined;

      // Drivers have no public.users row — build profile from auth metadata
      if (metaRole === "driver") {
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

      // Users and admins have a row in public.users
      const { data: userRow } = await supabase
        .from("users")
        .select("*")
        .eq("id", u.id)
        .maybeSingle();

      if (userRow) {
        const p = userRow as Profile;
        setProfile(p);
        setRole(p.role ?? "user");
      } else {
        setProfile(null);
        setRole("user");
      }
    };

    supabase.auth.getUser().then(({ data: { user: u } }) => {
      setUser(u);
      if (u) fetchUserData(u).finally(() => setLoading(false));
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);
      if (nextUser) {
        fetchUserData(nextUser).finally(() => setLoading(false));
      } else {
        setProfile(null);
        setRole("user");
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
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
