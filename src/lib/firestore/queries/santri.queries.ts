import {
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  writeBatch,
  query,
  where,
  limit,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { db, functions } from "@/lib/firebase/config";
import type { Santri, WaliSantri } from "@/features/santri/types/santri.types";
import type { Kelas } from "@/features/kelas-program/types/kelas-program.types";

const collectionName = "santri";

// ==================== READ ====================

export async function getAllSantri(): Promise<Santri[]> {
  const colRef = collection(db, collectionName);
  const snapshot = await getDocs(colRef);
  const list = snapshot.docs.map((d) => ({
    ...d.data(),
    id: d.id,
  })) as Santri[];

  // Sort by nama ascending (client-side, same as mobile)
  return list.sort((a, b) => a.nama.localeCompare(b.nama));
}

export async function getSantriById(id: string): Promise<Santri | null> {
  const docRef = doc(db, collectionName, id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return { ...snapshot.data(), id: snapshot.id } as Santri;
}

// ==================== CREATE (via Cloud Function) ====================

interface CreateUserAccountData {
  identifier: string;
  name: string;
  role: "santri";
  linkedDocId: string;
  program: string;
  kelas: string;
  profilePicture?: string | null;
  createdAt?: number;
}

interface CreateUserAccountResult {
  success: boolean;
  uid: string;
  message: string;
}

export async function createSantri(data: {
  nis: string;
  nama: string;
  kelas: string;
  program: string;
  profilePicture?: string | null;
  waliSantri?: WaliSantri | null;
}): Promise<string> {
  // NIS Uniqueness Check in Firestore
  const q = query(collection(db, collectionName), where("nis", "==", data.nis), limit(1));
  const snap = await getDocs(q);
  if (!snap.empty) {
    throw new Error(`NIS "${data.nis}" sudah terdaftar di sistem.`);
  }

  // Pre-generate doc ID like mobile does
  const colRef = collection(db, collectionName);
  const docRef = doc(colRef);

  const callable = httpsCallable<CreateUserAccountData, CreateUserAccountResult>(
    functions,
    "createUserAccount"
  );

  const result = await callable({
    identifier: data.nis,
    name: data.nama,
    role: "santri",
    linkedDocId: docRef.id,
    program: data.program,
    kelas: data.kelas,
    profilePicture: data.profilePicture || null,
    createdAt: Date.now(),
  });

  // If waliSantri is provided, update the document with it
  // (Cloud Function doesn't write waliSantri, we add it after)
  if (data.waliSantri) {
    await updateDoc(docRef, {
      waliSantri: data.waliSantri,
      updatedAt: serverTimestamp(),
    });
  }

  return result.data.uid;
}

// ==================== BULK CREATE (via Cloud Function) ====================

interface BulkCreateData {
  users: Array<{
    identifier: string;
    name: string;
    role: "santri";
    program?: string;
    kelas?: string;
  }>;
}

interface BulkCreateResult {
  success: boolean;
  successCount: number;
  failCount: number;
}

export async function bulkCreateSantri(
  users: Array<{ nis: string; nama: string; kelas: string; program: string }>
): Promise<{ 
  successCount: number; 
  failCount: number; 
  errors: Array<{ nis: string; nama: string; reason: string }> 
}> {
  const colRef = collection(db, collectionName);
  const callable = httpsCallable<CreateUserAccountData, CreateUserAccountResult>(
    functions,
    "createUserAccount"
  );

  let successCount = 0;
  let failCount = 0;
  const errorsList: Array<{ nis: string; nama: string; reason: string }> = [];

  const promises = users.map(async (u) => {
    try {
      // NIS Uniqueness Check in Firestore for each user
      const q = query(collection(db, collectionName), where("nis", "==", u.nis), limit(1));
      const snap = await getDocs(q);
      if (!snap.empty) {
        throw new Error("NIS sudah terdaftar.");
      }

      const docRef = doc(colRef);
      await callable({
        identifier: u.nis,
        name: u.nama,
        role: "santri",
        linkedDocId: docRef.id,
        program: u.program,
        kelas: u.kelas,
        profilePicture: null,
        createdAt: Date.now(),
      });
      successCount++;
    } catch (err: any) {
      console.error(`[DIAGNOSTIC] Gagal mengimpor santri dengan NIS ${u.nis} (${u.nama}):`, err);
      
      let reason = "Gagal memproses";
      if (err instanceof Error) {
        reason = err.message;
      } else if (err?.message) {
        reason = err.message;
      }

      errorsList.push({
        nis: u.nis,
        nama: u.nama,
        reason,
      });
      failCount++;
    }
  });

  await Promise.all(promises);

  return { successCount, failCount, errors: errorsList };
}

// ==================== UPDATE ====================

export async function updateSantri(
  id: string,
  data: Partial<Omit<Santri, "id" | "createdAt" | "updatedAt" | "authUid">>
): Promise<void> {
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// ==================== DELETE ====================
// Note: Cloud Function `deleteUserAccount` (Firestore trigger) automatically
// deletes the Firebase Auth user + /users metadata doc when a santri doc is deleted.

export async function deleteSantri(id: string): Promise<void> {
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
}

// ==================== RESET PASSWORD (via Cloud Function) ====================

interface ResetPasswordData {
  uid: string;
  newPassword?: string;
}

interface ResetPasswordResult {
  success: boolean;
  uid: string;
  message: string;
}

export async function resetSantriPassword(authUid: string): Promise<void> {
  const callable = httpsCallable<ResetPasswordData, ResetPasswordResult>(
    functions,
    "resetUserPassword"
  );
  await callable({ uid: authUid });
}

// ==================== KENAIKAN KELAS (Batch Write) ====================

export async function promoteAllSantri(params: {
  activeSantri: Santri[];
  kelasMap: Kelas[];
  tahunAjaran: string; // e.g. "2026/2027"
  semesterAktif: number; // 1 or 2
}): Promise<{ promoted: number; graduated: number }> {
  const { activeSantri, kelasMap, tahunAjaran, semesterAktif } = params;

  // Build nextKelas map from kelas collection
  const nextKelasMap: Record<string, string | null> = {};
  kelasMap.forEach((k) => {
    nextKelasMap[k.id] = k.nextKelasId;
  });

  const batch = writeBatch(db);
  let promoted = 0;
  let graduated = 0;

  for (const santri of activeSantri) {
    const santriRef = doc(db, "santri", santri.id);
    const nextKelasId = nextKelasMap[santri.kelas];

    if (nextKelasId) {
      // Find the kelas object to get its nama
      const nextKelas = kelasMap.find((k) => k.id === nextKelasId);
      batch.update(santriRef, {
        kelas: nextKelas?.nama ?? nextKelasId,
        updatedAt: serverTimestamp(),
      });
      promoted++;
    } else {
      // No next kelas → graduate as alumni
      batch.update(santriRef, {
        isAlumni: true,
        updatedAt: serverTimestamp(),
      });
      graduated++;
    }
  }

  // Upsert targetHafalan for all kelas × program combinations
  const programsSnapshot = await getDocs(collection(db, "program"));
  const programs = programsSnapshot.docs.map((d) => d.id);

  for (const kelas of kelasMap) {
    for (const programId of programs) {
      const targetId = `${kelas.nama}_${programId}`;
      const targetRef = doc(db, "targetHafalan", targetId);
      batch.set(
        targetRef,
        {
          kelas: kelas.nama,
          program: programId,
          tahunAjaran,
          semesterAktif,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    }
  }

  await batch.commit();

  return { promoted, graduated };
}
