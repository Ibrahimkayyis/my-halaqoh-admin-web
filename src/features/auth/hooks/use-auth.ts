"use client";

import { useEffect } from "react";
import { subscribeToAuthChanges } from "@/lib/firebase/auth";
import { getUserDoc } from "@/lib/firestore/queries/user.queries";
import { useAuthStore } from "@/stores/auth.store";

export function useAuthListener() {
  useEffect(() => {
    const store = useAuthStore.getState();
    const unsubscribe = subscribeToAuthChanges(async (firebaseUser) => {
      if (!firebaseUser) {
        store.setUnauthenticated();
        return;
      }
      const userDoc = await getUserDoc(firebaseUser.uid);
      if (!userDoc || userDoc.role !== "admin") {
        store.setUnauthenticated();
        return;
      }
      store.setAuthenticated(userDoc);
    });
    return () => unsubscribe();
  }, []);
}

export function useAuth() {
  const status = useAuthStore((s) => s.status);
  const user = useAuthStore((s) => s.user);
  const errorMessage = useAuthStore((s) => s.errorMessage);

  return {
    user,
    errorMessage,
    isLoading: status === "idle" || status === "loading",
    isAuthenticated: status === "authenticated",
  };
}