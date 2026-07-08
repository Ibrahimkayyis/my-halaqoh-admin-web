"use client";

import { FirebaseError } from "firebase/app";
import { signInWithIdentifier, signOutUser, mapFirebaseAuthError } from "@/lib/firebase/auth";
import { getUserDoc } from "@/lib/firestore/queries/user.queries";
import { useAuthStore } from "@/stores/auth.store";

export async function login(identifier: string, password: string): Promise<void> {
  const store = useAuthStore.getState();
  store.setLoading();

  try {
    const firebaseUser = await signInWithIdentifier(identifier, password);
    const userDoc = await getUserDoc(firebaseUser.uid);

    if (!userDoc) {
      await signOutUser();
      store.setError("Data pengguna tidak ditemukan. Hubungi administrator.");
      return;
    }

    if (userDoc.role !== "admin") {
      await signOutUser();
      store.setError("Akun ini tidak memiliki akses ke Web Admin.");
      return;
    }

    store.setAuthenticated(userDoc);
  } catch (error) {
    const message =
      error instanceof FirebaseError ? mapFirebaseAuthError(error.code) : "Terjadi kesalahan saat login";
    store.setError(message);
  }
}

export async function logout(): Promise<void> {
  await signOutUser();
  useAuthStore.getState().setUnauthenticated();
}