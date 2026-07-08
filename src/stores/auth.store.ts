import { create } from "zustand";
import type { User } from "@/types/models/user.types";

type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated" | "error";

interface AuthStoreState {
  status: AuthStatus;
  user: User | null;
  errorMessage: string | null;
  setLoading: () => void;
  setAuthenticated: (user: User) => void;
  setUnauthenticated: () => void;
  setError: (message: string) => void;
}

export const useAuthStore = create<AuthStoreState>((set) => ({
  status: "idle",
  user: null,
  errorMessage: null,
  setLoading: () => set({ status: "loading", errorMessage: null }),
  setAuthenticated: (user) => set({ status: "authenticated", user, errorMessage: null }),
  setUnauthenticated: () => set({ status: "unauthenticated", user: null, errorMessage: null }),
  setError: (message) => set({ status: "error", errorMessage: message }),
}));