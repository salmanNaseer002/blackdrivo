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

  // createBrowserClient is a singleton — same instance every time
  const supabase = createClient();

  const fetchProfile = useCallback(
    async (authUser: User) => {
      const role = authUser.user_metadata?.role as UserRole | undefined;

      // Drivers are not in public.users — build profile from auth metadata.
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

      // Users and admins have a row in public.users.
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", authUser.id)
        .single();
      setProfile(data ?? null);
    },
    [supabase]
  );

  useEffect(() => {
    let mounted = true;

    // 1. Check for an existing session immediately on mount
    supabase.auth.getUser().then(async ({ data: { user: currentUser } }) => {
      if (!mounted) return;
      setUser(currentUser);
      if (currentUser) {
        await fetchProfile(currentUser);
      }
      setLoading(false);
    });

    // 2. Listen for all future auth events (sign in, sign out, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;

      const nextUser = session?.user ?? null;
      setUser(nextUser);

      if (nextUser) {
        await fetchProfile(nextUser);
      } else {
        setProfile(null);
      }

      // Mark as resolved on every auth event (covers the initial INITIAL_SESSION event)
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Derived display values ──────────────────────────────────────────────────

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
