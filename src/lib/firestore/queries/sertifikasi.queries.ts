import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  updateDoc,
  query,
  where,
  serverTimestamp,
  Timestamp,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type {
  SertifikasiTahfidz,
  SertifikasiStatus,
  PengujiSertifikasi,
} from "@/features/sertifikasi/types/sertifikasi.types";
import {
  calculatePredikat,
  TIM_PENGUJI_SERTIFIKASI,
} from "@/features/sertifikasi/types/sertifikasi.types";

const collectionName = "sertifikasi_tahfidz";
const pengujiCollectionName = "penguji_sertifikasi";

// ==================== READ ====================

export async function getAllSertifikasi(): Promise<SertifikasiTahfidz[]> {
  const colRef = collection(db, collectionName);
  const snapshot = await getDocs(colRef);
  const list = snapshot.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      santriId: data.santriId || "",
      santriNama: data.santriNama || "",
      nis: data.nis || "",
      kelas: data.kelas || "",
      program: data.program || "R",
      profilePicture: data.profilePicture || null,
      halaqohId: data.halaqohId || "",
      halaqohNama: data.halaqohNama || "",
      guruId: data.guruId || "",
      guruNama: data.guruNama || "",
      catatanGuru: data.catatanGuru || null,
      juz: typeof data.juz === "number" ? data.juz : 1,
      status: (data.status as SertifikasiStatus) || "pending",
      tanggalUjian: data.tanggalUjian || null,
      sesiUjian: data.sesiUjian || null,
      pengujiId: data.pengujiId || null,
      pengujiNama: data.pengujiNama || null,
      catatanAdmin: data.catatanAdmin || null,
      alasanPenolakan: data.alasanPenolakan || null,
      nilai: typeof data.nilai === "number" ? data.nilai : null,
      predikat: data.predikat || null,
      catatanPenguji: data.catatanPenguji || null,
      createdAt: data.createdAt || Timestamp.now(),
      updatedAt: data.updatedAt || Timestamp.now(),
      completedAt: data.completedAt || null,
    } as SertifikasiTahfidz;
  });

  // Sort by createdAt descending (terbaru di atas)
  return list.sort((a, b) => {
    const timeA = a.createdAt?.toMillis?.() ?? 0;
    const timeB = b.createdAt?.toMillis?.() ?? 0;
    return timeB - timeA;
  });
}

export async function getSertifikasiById(id: string): Promise<SertifikasiTahfidz | null> {
  const docRef = doc(db, collectionName, id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  const data = snapshot.data();
  return {
    id: snapshot.id,
    ...data,
  } as SertifikasiTahfidz;
}

/** Helper: map a Firestore doc snapshot to SertifikasiTahfidz */
function mapSertifikasiDoc(d: { id: string; data: () => Record<string, unknown> }): SertifikasiTahfidz {
  const data = d.data() as Record<string, unknown>;
  return {
    id: d.id,
    santriId: (data.santriId as string) || "",
    santriNama: (data.santriNama as string) || "",
    nis: (data.nis as string) || "",
    kelas: (data.kelas as string) || "",
    program: (data.program as "R" | "T") || "R",
    profilePicture: (data.profilePicture as string | null) || null,
    halaqohId: (data.halaqohId as string) || "",
    halaqohNama: (data.halaqohNama as string) || "",
    guruId: (data.guruId as string) || "",
    guruNama: (data.guruNama as string) || "",
    catatanGuru: (data.catatanGuru as string | null) || null,
    juz: typeof data.juz === "number" ? data.juz : 1,
    status: ((data.status as SertifikasiStatus) || "pending"),
    tanggalUjian: (data.tanggalUjian as Timestamp | null) || null,
    sesiUjian: (data.sesiUjian as string | null) || null,
    pengujiId: (data.pengujiId as string | null) || null,
    pengujiNama: (data.pengujiNama as string | null) || null,
    catatanAdmin: (data.catatanAdmin as string | null) || null,
    alasanPenolakan: (data.alasanPenolakan as string | null) || null,
    nilai: typeof data.nilai === "number" ? data.nilai : null,
    predikat: (data.predikat as string | null) || null,
    catatanPenguji: (data.catatanPenguji as string | null) || null,
    createdAt: (data.createdAt as Timestamp) || Timestamp.now(),
    updatedAt: (data.updatedAt as Timestamp) || Timestamp.now(),
    completedAt: (data.completedAt as Timestamp | null) || null,
  };
}

/** Fetch all sertifikasi for a specific santri */
export async function getSertifikasiBySantriId(santriId: string): Promise<SertifikasiTahfidz[]> {
  if (!santriId) return [];
  const colRef = collection(db, collectionName);
  const q = query(colRef, where("santriId", "==", santriId));
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map(mapSertifikasiDoc)
    .sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0));
}

/** Fetch all sertifikasi for all santri in a halaqoh (single efficient query) */
export async function getSertifikasiByHalaqohId(halaqohId: string): Promise<SertifikasiTahfidz[]> {
  if (!halaqohId) return [];
  const colRef = collection(db, collectionName);
  const q = query(colRef, where("halaqohId", "==", halaqohId));
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map(mapSertifikasiDoc)
    .sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0));
}

/**
 * Realtime subscription to all sertifikasi for a specific halaqoh.
 * Returns an unsubscribe function.
 */
export function subscribeSertifikasiByHalaqohId(
  halaqohId: string,
  onData: (data: SertifikasiTahfidz[]) => void,
  onError?: (err: Error) => void
): () => void {
  const colRef = collection(db, collectionName);
  const q = query(colRef, where("halaqohId", "==", halaqohId));

  return onSnapshot(
    q,
    (snapshot) => {
      const docs = snapshot.docs
        .map(mapSertifikasiDoc)
        .sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0));
      onData(docs);
    },
    (err) => {
      console.error("Realtime sertifikasi error:", err);
      onError?.(err);
    }
  );
}

/**
 * Realtime subscription to all sertifikasi across the entire institution.
 * Returns an unsubscribe function.
 */
export function subscribeAllSertifikasi(
  onData: (data: SertifikasiTahfidz[]) => void,
  onError?: (err: Error) => void
): () => void {
  const colRef = collection(db, collectionName);

  return onSnapshot(
    colRef,
    (snapshot) => {
      const docs = snapshot.docs
        .map(mapSertifikasiDoc)
        .sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0));
      onData(docs);
    },
    (err) => {
      console.error("Realtime all sertifikasi subscription error:", err);
      onError?.(err);
    }
  );
}

// ==================== PENGUJI SERTIFIKASI ====================

/**
 * Fetch all examiners from `penguji_sertifikasi`.
 * If collection is empty, returns the default certified examiners.
 */
export async function getPengujiSertifikasi(): Promise<PengujiSertifikasi[]> {
  const colRef = collection(db, pengujiCollectionName);
  const snapshot = await getDocs(colRef);

  if (snapshot.empty) {
    return TIM_PENGUJI_SERTIFIKASI.map((p, idx) => ({
      id: `default-${idx}`,
      guruId: "",
      nip: p.nip,
      nama: p.nama,
      isDefault: true,
    }));
  }

  return snapshot.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      guruId: (data.guruId as string) || "",
      nip: (data.nip as string) || "",
      nama: (data.nama as string) || "",
      isDefault: Boolean(data.isDefault),
      createdAt: (data.createdAt as Timestamp) || undefined,
    } as PengujiSertifikasi;
  });
}

/**
 * Realtime subscription to examiners in `penguji_sertifikasi`.
 */
export function subscribePengujiSertifikasi(
  onData: (data: PengujiSertifikasi[]) => void,
  onError?: (err: Error) => void
): () => void {
  const colRef = collection(db, pengujiCollectionName);

  return onSnapshot(
    colRef,
    (snapshot) => {
      if (snapshot.empty) {
        onData(
          TIM_PENGUJI_SERTIFIKASI.map((p, idx) => ({
            id: `default-${idx}`,
            guruId: "",
            nip: p.nip,
            nama: p.nama,
            isDefault: true,
          }))
        );
        return;
      }

      const docs = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          guruId: (data.guruId as string) || "",
          nip: (data.nip as string) || "",
          nama: (data.nama as string) || "",
          isDefault: Boolean(data.isDefault),
          createdAt: (data.createdAt as Timestamp) || undefined,
        } as PengujiSertifikasi;
      });

      onData(docs);
    },
    (err) => {
      console.error("Realtime penguji subscription error:", err);
      onError?.(err);
    }
  );
}

/**
 * Add an existing teacher as an examiner in `penguji_sertifikasi`.
 */
export async function addPengujiSertifikasi(guru: {
  id: string;
  nip: string;
  nama: string;
}): Promise<void> {
  const docRef = doc(db, pengujiCollectionName, guru.id);
  await setDoc(docRef, {
    guruId: guru.id,
    nip: guru.nip,
    nama: guru.nama,
    isDefault: false,
    createdAt: serverTimestamp(),
  });
}

/**
 * Remove an examiner from `penguji_sertifikasi`.
 */
export async function removePengujiSertifikasi(id: string): Promise<void> {
  const docRef = doc(db, pengujiCollectionName, id);
  await deleteDoc(docRef);
}

export interface ApproveSertifikasiData {
  tanggalUjian: Date;
  sesiUjian: string;
  pengujiId?: string;
  pengujiNama: string;
  catatanAdmin?: string;
}

export async function approveSertifikasi(
  id: string,
  data: ApproveSertifikasiData
): Promise<void> {
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, {
    status: "scheduled",
    tanggalUjian: Timestamp.fromDate(data.tanggalUjian),
    sesiUjian: data.sesiUjian,
    pengujiId: data.pengujiId || null,
    pengujiNama: data.pengujiNama,
    catatanAdmin: data.catatanAdmin || null,
    updatedAt: serverTimestamp(),
  });
}

export async function rejectSertifikasi(
  id: string,
  alasanPenolakan: string
): Promise<void> {
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, {
    status: "rejected",
    alasanPenolakan: alasanPenolakan,
    updatedAt: serverTimestamp(),
  });
}

export interface GradeSertifikasiData {
  nilai: number;
  status: "passed" | "failed";
  catatanPenguji?: string;
}

export async function gradeSertifikasi(
  id: string,
  data: GradeSertifikasiData
): Promise<void> {
  const docRef = doc(db, collectionName, id);
  const predikat = calculatePredikat(data.nilai);

  await updateDoc(docRef, {
    nilai: data.nilai,
    status: data.status,
    predikat: predikat,
    catatanPenguji: data.catatanPenguji || null,
    completedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}
