"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/axios";
import { setAuthCookie, clearAuthCookie } from "@/lib/auth-cookie";
import type { User, AuthResponse, LoginCredentials, RegisterData } from "@/types";

// ─────────────────────────────────────────────
// Auth Store Interface
// ─────────────────────────────────────────────

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (data: RegisterData) => Promise<User>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

// ─────────────────────────────────────────────
// Initial state
// ─────────────────────────────────────────────

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

// ─────────────────────────────────────────────
// Zustand Store with Persist Middleware
// ─────────────────────────────────────────────

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      ...initialState,

      /**
       * Login with email/password.
       * Stores token + user, returns user for redirect logic.
       */
      login: async (credentials: LoginCredentials): Promise<User> => {
        const response = await api.post<AuthResponse>("/login", credentials);
        const { user, token } = response.data;

        // Store token in localStorage for Axios interceptor + cookie for middleware
        localStorage.setItem("auth_token", token);
        setAuthCookie(token, user.role);

        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });

        return user;
      },

      /**
       * Register a new user.
       * Stores token + user, returns user for redirect logic.
       */
      register: async (data: RegisterData): Promise<User> => {
        const response = await api.post<AuthResponse>("/register", data);
        const { user, token } = response.data;

        // Store token in localStorage for Axios interceptor + cookie for middleware
        localStorage.setItem("auth_token", token);
        setAuthCookie(token, user.role);

        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });

        return user;
      },

      /**
       * Logout: revoke token on server, then clear local state.
       */
      logout: async (): Promise<void> => {
        try {
          await api.post("/logout");
        } catch {
          // Ignore errors (token may already be invalid)
        } finally {
          localStorage.removeItem("auth_token");
          clearAuthCookie();
          set({ ...initialState, isLoading: false });
        }
      },

      /**
       * Fetch the current user from /api/user.
       * Called on app mount to rehydrate session.
       */
      fetchUser: async (): Promise<void> => {
        const token = get().token || localStorage.getItem("auth_token");

        if (!token) {
          set({ ...initialState, isLoading: false });
          return;
        }

        try {
          // Ensure Axios has the token
          localStorage.setItem("auth_token", token);

          const response = await api.get<{ user: User }>("/user");
          const user = response.data.user;
          setAuthCookie(token, user.role);
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch {
          // Token expired or invalid
          localStorage.removeItem("auth_token");
          clearAuthCookie();
          set({ ...initialState, isLoading: false });
        }
      },

      setLoading: (loading: boolean) => set({ isLoading: loading }),

      reset: () => {
        localStorage.removeItem("auth_token");
        clearAuthCookie();
        set({ ...initialState, isLoading: false });
      },
    }),
    {
      name: "auth-storage",
      // Only persist token (user is rehydrated via fetchUser)
      partialize: (state) => ({
        token: state.token,
      }),
    }
  )
);
