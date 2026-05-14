"use client";

// Thin re-export so all existing callers (Navbar, Dashboard, Profile, etc.)
// continue to work without changes. Auth state now comes from the single
// AuthProvider rather than each component maintaining its own subscription.

import { useAuth, type AuthState } from "@/lib/context/AuthContext";

export type UseUserReturn = AuthState;

export function useUser(): UseUserReturn {
  return useAuth();
}
