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

export async function syncPublicStats(counts: {
  santri: number;
  guru: number;
  halaqoh: number;
}): Promise<void> {
  try {
    const { doc, setDoc, serverTimestamp } = await import("firebase/firestore");
    const statsDocRef = doc(db, "public_metadata", "stats");
    await setDoc(
      statsDocRef,
      {
        totalSantri: counts.santri,
        totalGuru: counts.guru,
        totalHalaqoh: counts.halaqoh,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn("Failed to sync public metadata stats:", err);
  }
}

/**
 * Recalculates live counts from Firestore and immediately syncs them to `public_metadata/stats`.
 * Call this on any admin mutation (santri, guru, halaqoh) to keep landing page counters accurate in real time.
 */
export async function syncCurrentPublicStats(): Promise<void> {
  try {
    const [santri, guru, halaqoh] = await Promise.all([
      getSantriCount(),
      getGuruCount(),
      getHalaqohCount(),
    ]);
    await syncPublicStats({ santri, guru, halaqoh });
  } catch (err) {
    console.warn("Failed to sync current public stats:", err);
  }
}
