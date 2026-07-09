import { collection, query, where, getCountFromServer } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export async function getSantriCount(): Promise<number> {
  const santriRef = collection(db, "santri");
  // Only count active santri (not alumni)
  const q = query(santriRef, where("isAlumni", "==", false));
  const snapshot = await getCountFromServer(q);
  return snapshot.data().count;
}

export async function getGuruCount(): Promise<number> {
  const guruRef = collection(db, "guru");
  const snapshot = await getCountFromServer(guruRef);
  return snapshot.data().count;
}

export async function getHalaqohCount(): Promise<number> {
  const halaqohRef = collection(db, "halaqoh");
  const snapshot = await getCountFromServer(halaqohRef);
  return snapshot.data().count;
}
