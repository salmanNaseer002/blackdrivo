"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { Profile, UserRole } from "@/lib/supabase/types";

// ─── Shape ────────────────────────────────────────────────────────────────────

export interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  initials: string;
  displayName: string;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthState>({
  user: null,
  profile: null,
  loading: true,
  initials: "",
  displayName: "",
});

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  const fetchProfile = useCallback(
    async (authUser: User) => {
      const role = authUser.user_metadata?.role as UserRole | undefined;

      if (role === "driver") {
        const meta = authUser.user_metadata ?? {};
        setProfile({
          id: authUser.id,
          email: authUser.email ?? "",
          full_name: (meta.full_name as string) ?? null,
          phone: (meta.phone as string) ?? null,
          role: "driver",
          avatar_url: null,
          created_at: "",
          updated_at: "",
        });
        return;
      }

      const { data, error: rowError } = await (supabase as any)
        .from("users")
        .select("*")
        .eq("id", authUser.id)
        .maybeSingle();

      if (data && !rowError) {
        setProfile(data as Profile);
        return;
      }

      // Row missing or RLS blocked the read (e.g. policy not yet fixed).
      // Build profile from auth metadata and create the row asynchronously.
      const newRow = {
        id: authUser.id,
        email: authUser.email ?? "",
        name: (authUser.user_metadata?.full_name as string) || (authUser.email ?? "").split("@")[0],
        full_name: (authUser.user_metadata?.full_name as string) ?? null,
        phone: (authUser.user_metadata?.phone as string) ?? null,
        // role omitted — DB uses column DEFAULT ('ops')
      };
      // Fire-and-forget — INSERT policy doesn't recurse so this should succeed
      (supabase as any).from("users").upsert(newRow, { onConflict: "id" }).then(() => {});
      setProfile({ ...newRow, role: "ops" as UserRole, avatar_url: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    let mounted = true;

    // getSession() reads from localStorage — instant, no network call
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!mounted) return;
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) await fetchProfile(currentUser);
      setLoading(false);
    };

    init();

    // Listen for subsequent auth changes; skip INITIAL_SESSION (handled by init)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      if (event === "INITIAL_SESSION") return;
      const nextUser = session?.user ?? null;
      setUser(nextUser);
      if (nextUser) {
        await fetchProfile(nextUser);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const displayName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "User";

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <AuthContext.Provider value={{ user, profile, loading, initials, displayName }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthState {
  return useContext(AuthContext);
}
