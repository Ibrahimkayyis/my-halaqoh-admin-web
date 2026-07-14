import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  where,
  limit,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { db, functions } from "@/lib/firebase/config";
import type { Guru } from "@/features/guru/types/guru.types";

const collectionName = "guru";

// ==================== READ ====================

export async function getAllGuru(): Promise<Guru[]> {
  const colRef = collection(db, collectionName);
  const snapshot = await getDocs(colRef);
  const list = snapshot.docs.map((d) => ({
    ...d.data(),
    id: d.id,
  })) as Guru[];

  // Sort by nama ascending (client-side, same as mobile)
  return list.sort((a, b) => a.nama.localeCompare(b.nama));
}

export async function getGuruById(id: string): Promise<Guru | null> {
  const docRef = doc(db, collectionName, id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return { ...snapshot.data(), id: snapshot.id } as Guru;
}

// ==================== CREATE (via Cloud Function + setDoc fallback) ====================

interface CreateUserAccountData {
  identifier: string;
  name: string;
  role: "guru";
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

export async function createGuru(data: {
  nip: string;
  nama: string;
  phone?: string | null;
  program: "R" | "T";
  profilePicture?: string | null;
}): Promise<string> {
  // NIP Uniqueness Check in Firestore
  const q = query(collection(db, collectionName), where("nip", "==", data.nip), limit(1));
  const snap = await getDocs(q);
  if (!snap.empty) {
    throw new Error(`NIP "${data.nip}" sudah terdaftar di sistem.`);
  }

  const colRef = collection(db, collectionName);
  const docRef = doc(colRef);

  const callable = httpsCallable<CreateUserAccountData, CreateUserAccountResult>(
    functions,
    "createUserAccount"
  );

  const result = await callable({
    identifier: data.nip,
    name: data.nama,
    role: "guru",
    linkedDocId: docRef.id,
    program: data.program,
    kelas: "", // Empty for guru
    profilePicture: data.profilePicture || null,
    createdAt: Date.now(),
  });

  const uid = result.data.uid;

  // Cloud Function `createUserAccount` does not create /guru document (server-side limitation),
  // so we write the /guru document directly from client here
  await setDoc(docRef, {
    nip: data.nip,
    nama: data.nama,
    phone: data.phone || null,
    program: data.program,
    profilePicture: data.profilePicture || null,
    authUid: uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return uid;
}

// ==================== BULK CREATE ====================

export async function bulkCreateGuru(
  users: Array<{ nip: string; nama: string; program: "R" | "T"; phone?: string }>
): Promise<{ 
  successCount: number; 
  failCount: number; 
  errors: Array<{ nip: string; nama: string; reason: string }> 
}> {
  const colRef = collection(db, collectionName);
  const callable = httpsCallable<CreateUserAccountData, CreateUserAccountResult>(
    functions,
    "createUserAccount"
  );

  let successCount = 0;
  let failCount = 0;
  const errorsList: Array<{ nip: string; nama: string; reason: string }> = [];

  const promises = users.map(async (u) => {
    try {
      // NIP Uniqueness Check
      const q = query(collection(db, collectionName), where("nip", "==", u.nip), limit(1));
      const snap = await getDocs(q);
      if (!snap.empty) {
        throw new Error("NIP sudah terdaftar.");
      }

      const docRef = doc(colRef);
      const result = await callable({
        identifier: u.nip,
        name: u.nama,
        role: "guru",
        linkedDocId: docRef.id,
        program: u.program,
        kelas: "",
        profilePicture: null,
        createdAt: Date.now(),
      });

      const uid = result.data.uid;

      // Write the /guru doc
      await setDoc(docRef, {
        nip: u.nip,
        nama: u.nama,
        phone: u.phone || null,
        program: u.program,
        profilePicture: null,
        authUid: uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      successCount++;
    } catch (err: any) {
      console.error(`[DIAGNOSTIC] Gagal mengimpor guru dengan NIP ${u.nip} (${u.nama}):`, err);
      
      let reason = "Gagal memproses";
      if (err instanceof Error) {
        reason = err.message;
      } else if (err?.message) {
        reason = err.message;
      }

      errorsList.push({
        nip: u.nip,
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

export async function updateGuru(
  id: string,
  data: Partial<Omit<Guru, "id" | "createdAt" | "updatedAt" | "authUid">>
): Promise<void> {
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// ==================== DELETE ====================
// Cloud Function `deleteUserAccount` automatically handles deleting Auth + /users
export async function deleteGuru(id: string): Promise<void> {
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
}

// ==================== RESET PASSWORD ====================

interface ResetPasswordData {
  uid: string;
  newPassword?: string;
}

interface ResetPasswordResult {
  success: boolean;
  uid: string;
  message: string;
}

export async function resetGuruPassword(authUid: string): Promise<void> {
  const callable = httpsCallable<ResetPasswordData, ResetPasswordResult>(
    functions,
    "resetUserPassword"
  );
  await callable({ uid: authUid });
}
