"use client";

import { useAuthListener } from "@/features/auth/hooks/use-auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useAuthListener();
  return <>{children}</>;
}