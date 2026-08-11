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

// ==================== BULK CREATE ====================

export interface BulkHalaqohItem {
  nama: string;
  kelas: string;
  program: "R" | "T";
  nipGuru: string;
  nisSantriList: string[];
}

export interface BulkCreateHalaqohResult {
  successCount: number;
  failCount: number;
  errors: Array<{ nama: string; reason: string }>;
  warnings: Array<{ nama: string; message: string }>;
}

export async function bulkCreateHalaqoh(
  items: BulkHalaqohItem[]
): Promise<BulkCreateHalaqohResult> {
  const colRef = collection(db, COLLECTION);
  const guruColRef = collection(db, "guru");
  const santriColRef = collection(db, SANTRI_COLLECTION);

  // 1. Fetch all guru
  const guruSnap = await getDocs(guruColRef);
  const nipToGuru = new Map<string, { id: string; nama: string }>();
  guruSnap.docs.forEach((docSnap) => {
    const data = docSnap.data();
    if (data.nip) {
      nipToGuru.set(String(data.nip).trim(), {
        id: docSnap.id,
        nama: (data.nama as string) ?? "",
      });
    }
  });

  // 2. Fetch all existing halaqoh
  const halaqohSnap = await getDocs(colRef);
  const existingNames = new Set<string>();
  const assignedGuruIds = new Set<string>();
  halaqohSnap.docs.forEach((docSnap) => {
    const data = docSnap.data();
    if (data.nama) {
      existingNames.add(String(data.nama).trim().toLowerCase());
    }
    if (data.guruId) {
      assignedGuruIds.add(data.guruId as string);
    }
  });

  // 3. Fetch all santri
  const santriSnap = await getDocs(santriColRef);
  const nisToSantri = new Map<
    string,
    { id: string; nama: string; halaqohId?: string | null }
  >();
  santriSnap.docs.forEach((docSnap) => {
    const data = docSnap.data();
    if (data.nis) {
      nisToSantri.set(String(data.nis).trim(), {
        id: docSnap.id,
        nama: (data.nama as string) ?? "",
        halaqohId: (data.halaqohId as string | null) ?? null,
      });
    }
  });

  let successCount = 0;
  let failCount = 0;
  const errors: Array<{ nama: string; reason: string }> = [];
  const warnings: Array<{ nama: string; message: string }> = [];

  for (const item of items) {
    const cleanNama = item.nama.trim();
    const cleanNip = item.nipGuru.trim();

    // Check duplicate halaqoh name
    if (existingNames.has(cleanNama.toLowerCase())) {
      failCount++;
      errors.push({
        nama: cleanNama,
        reason: `Nama halaqoh "${cleanNama}" sudah digunakan di sistem.`,
      });
      continue;
    }

    // Lookup guru
    const guru = nipToGuru.get(cleanNip);
    if (!guru) {
      failCount++;
      errors.push({
        nama: cleanNama,
        reason: `Guru dengan NIP "${cleanNip}" tidak ditemukan.`,
      });
      continue;
    }

    // Check if guru is already assigned to a halaqoh
    if (assignedGuruIds.has(guru.id)) {
      failCount++;
      errors.push({
        nama: cleanNama,
        reason: `Guru "${guru.nama}" (NIP: ${cleanNip}) sudah mengampu halaqoh lain.`,
      });
      continue;
    }

    // Resolve valid santri IDs
    const validSantriIds: string[] = [];
    for (const nisRaw of item.nisSantriList) {
      const nis = String(nisRaw).trim();
      if (!nis) continue;

      const santri = nisToSantri.get(nis);
      if (!santri) {
        warnings.push({
          nama: cleanNama,
          message: `Santri dengan NIS "${nis}" tidak ditemukan, di-skip.`,
        });
        continue;
      }

      if (santri.halaqohId) {
        warnings.push({
          nama: cleanNama,
          message: `Santri "${santri.nama}" (NIS: ${nis}) sudah terdaftar di halaqoh lain, di-skip.`,
        });
        continue;
      }

      validSantriIds.push(santri.id);
      // Mark as assigned locally for subsequent items in this loop
      santri.halaqohId = "PENDING_ASSIGNMENT";
    }

    // Create halaqoh doc
    const docRef = await addDoc(colRef, {
      nama: cleanNama,
      kelas: item.kelas,
      program: item.program,
      guruId: guru.id,
      guruNama: guru.nama,
      santriIds: validSantriIds,
      jumlahSantri: validSantriIds.length,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Update santri.halaqohId references in batch
    if (validSantriIds.length > 0) {
      const batch = writeBatch(db);
      for (const sid of validSantriIds) {
        const santriRef = doc(db, SANTRI_COLLECTION, sid);
        batch.update(santriRef, {
          halaqohId: docRef.id,
          updatedAt: serverTimestamp(),
        });
      }
      await batch.commit();
    }

    // Update tracked sets
    existingNames.add(cleanNama.toLowerCase());
    assignedGuruIds.add(guru.id);
    successCount++;
  }

  return { successCount, failCount, errors, warnings };
}

