"use client";

import { useEffect, type ReactNode } from "react";
import { useAuthStore } from "@/stores/auth-store";

// ─────────────────────────────────────────────
// Auth Provider
// ─────────────────────────────────────────────
// Wraps the app to rehydrate auth state on mount.
// Fetches /api/user if a token exists in storage.
// ─────────────────────────────────────────────

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const fetchUser = useAuthStore((state) => state.fetchUser);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return <>{children}</>;
}
