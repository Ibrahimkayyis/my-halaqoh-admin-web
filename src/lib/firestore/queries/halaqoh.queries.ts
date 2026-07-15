import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  writeBatch,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { Halaqoh } from "@/types/models/halaqoh.types";

const COLLECTION = "halaqoh";
const SANTRI_COLLECTION = "santri";

// Helper: converts raw Firestore data to Halaqoh domain model
function toHalaqoh(id: string, data: Record<string, any>): Halaqoh {
  return {
    id,
    nama: data.nama as string,
    kelas: data.kelas as string,
    program: data.program as "R" | "T",
    guruId: data.guruId as string,
    guruNama: data.guruNama as string,
    santriIds: (data.santriIds as string[]) ?? [],
    jumlahSantri: (data.jumlahSantri as number) ?? 0,
    createdAt: data.createdAt?.toDate?.() ?? new Date(),
    updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
  };
}

// ==================== READ ====================

export async function getAllHalaqoh(): Promise<Halaqoh[]> {
  const colRef = collection(db, COLLECTION);
  const q = query(colRef, orderBy("nama"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => toHalaqoh(d.id, d.data()));
}

export async function getHalaqohById(id: string): Promise<Halaqoh | null> {
  const docRef = doc(db, COLLECTION, id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return toHalaqoh(snapshot.id, snapshot.data());
}

// ==================== CREATE ====================
// Mirror of HalaqohRemoteDataSourceImpl.add() in Dart:
// 1. addDoc to /halaqoh
// 2. writeBatch: update santri.halaqohId for each santriId

export async function createHalaqoh(data: {
  nama: string;
  kelas: string;
  program: "R" | "T";
  guruId: string;
  guruNama: string;
  santriIds: string[];
}): Promise<string> {
  const colRef = collection(db, COLLECTION);

  const docRef = await addDoc(colRef, {
    nama: data.nama,
    kelas: data.kelas,
    program: data.program,
    guruId: data.guruId,
    guruNama: data.guruNama,
    santriIds: data.santriIds,
    jumlahSantri: data.santriIds.length,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // Batch: set halaqohId on each santri in this group
  if (data.santriIds.length > 0) {
    const batch = writeBatch(db);
    for (const santriId of data.santriIds) {
      const santriRef = doc(db, SANTRI_COLLECTION, santriId);
      batch.update(santriRef, { halaqohId: docRef.id, updatedAt: serverTimestamp() });
    }
    await batch.commit();
  }

  return docRef.id;
}

// ==================== UPDATE ====================
// Mirror of HalaqohRemoteDataSourceImpl.update() in Dart:
// 1. Get old halaqoh → read oldSantriIds
// 2. updateDoc halaqoh
// 3. writeBatch: clear halaqohId from removed santri, set halaqohId on new santri

export async function updateHalaqoh(
  id: string,
  data: {
    nama: string;
    kelas: string;
    program: "R" | "T";
    guruId: string;
    guruNama: string;
    santriIds: string[];
  }
): Promise<void> {
  const halaqohRef = doc(db, COLLECTION, id);

  // Step 1: Get old santriIds
  const oldSnap = await getDoc(halaqohRef);
  const oldSantriIds: string[] = oldSnap.exists()
    ? (oldSnap.data().santriIds as string[]) ?? []
    : [];

  // Step 2: Update the halaqoh document
  await updateDoc(halaqohRef, {
    nama: data.nama,
    kelas: data.kelas,
    program: data.program,
    guruId: data.guruId,
    guruNama: data.guruNama,
    santriIds: data.santriIds,
    jumlahSantri: data.santriIds.length,
    updatedAt: serverTimestamp(),
  });

  // Step 3: Batch sync santri.halaqohId references
  const removedSantri = oldSantriIds.filter((sid) => !data.santriIds.includes(sid));
  const addedSantri = data.santriIds.filter((sid) => !oldSantriIds.includes(sid));

  if (removedSantri.length > 0 || addedSantri.length > 0) {
    const batch = writeBatch(db);
    // Clear halaqohId from removed santri
    for (const santriId of removedSantri) {
      const santriRef = doc(db, SANTRI_COLLECTION, santriId);
      batch.update(santriRef, { halaqohId: null, updatedAt: serverTimestamp() });
    }
    // Set halaqohId on newly added santri
    for (const santriId of addedSantri) {
      const santriRef = doc(db, SANTRI_COLLECTION, santriId);
      batch.update(santriRef, { halaqohId: id, updatedAt: serverTimestamp() });
    }
    await batch.commit();
  }
}

// ==================== DELETE ====================
// Mirror of HalaqohRemoteDataSourceImpl.delete() in Dart:
// 1. Get halaqoh → read santriIds
// 2. writeBatch: set halaqohId = null for all santri
// 3. deleteDoc halaqoh

export async function deleteHalaqoh(id: string): Promise<void> {
  const halaqohRef = doc(db, COLLECTION, id);

  // Step 1: Get santriIds before deleting
  const snap = await getDoc(halaqohRef);
  const santriIds: string[] = snap.exists()
    ? (snap.data().santriIds as string[]) ?? []
    : [];

  // Step 2: Clear halaqohId from all santri in this group
  if (santriIds.length > 0) {
    const batch = writeBatch(db);
    for (const santriId of santriIds) {
      const santriRef = doc(db, SANTRI_COLLECTION, santriId);
      batch.update(santriRef, { halaqohId: null, updatedAt: serverTimestamp() });
    }
    await batch.commit();
  }

  // Step 3: Delete the halaqoh document
  await deleteDoc(halaqohRef);
}
