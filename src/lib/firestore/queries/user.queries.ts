import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { User } from "@/types/models/user.types";

export async function getUserDoc(uid: string): Promise<User | null> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;

  const data = snap.data();
  return {
    uid,
    identifier: data.identifier,
    role: data.role,
    programType: data.programType ?? null,
    displayName: data.displayName,
    linkedDocId: data.linkedDocId,
  };
}