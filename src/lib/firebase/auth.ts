import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth";
import { auth } from "./config";

const EMAIL_DOMAIN = "@myhalaqoh.app";

export function identifierToEmail(identifier: string): string {
  return `${identifier}${EMAIL_DOMAIN}`;
}

export async function signInWithIdentifier(
  identifier: string,
  password: string
): Promise<FirebaseUser> {
  const email = identifierToEmail(identifier);
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function signOutUser(): Promise<void> {
  await firebaseSignOut(auth);
}

export function subscribeToAuthChanges(
  callback: (user: FirebaseUser | null) => void
) {
  return onAuthStateChanged(auth, callback);
}

export function mapFirebaseAuthError(code: string): string {
  switch (code) {
    case "auth/user-not-found":
    case "auth/invalid-credential":
    case "auth/invalid-email":
    case "auth/wrong-password":
      return "NIP/NIS atau Password salah";
    case "auth/network-request-failed":
      return "Tidak ada koneksi internet";
    case "auth/too-many-requests":
      return "Terlalu banyak percobaan. Harap tunggu sesaat.";
    case "auth/user-disabled":
      return "Akun pengguna ini telah dinonaktifkan.";
    default:
      return "Terjadi kesalahan saat autentikasi";
  }
}