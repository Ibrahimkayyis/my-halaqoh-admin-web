import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  doc,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type {
  AbsensiDocData,
  AbsensiSantriRecord,
} from "@/features/kehadiran-santri/types/kehadiran-santri.types";
import type { SesiHalaqoh } from "@/features/kehadiran-guru/types/kehadiran-guru.types";

/**
 * Fetch all absensi records within a date range (start to end inclusive).
 */
export async function getAbsensiByDateRange(
  startDate: Date,
  endDate: Date
): Promise<AbsensiDocData[]> {
  const absensiRef = collection(db, "absensi");
  const q = query(
    absensiRef,
    where("tanggal", ">=", Timestamp.fromDate(startDate)),
    where("tanggal", "<=", Timestamp.fromDate(endDate))
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      halaqohId: (data.halaqohId as string) ?? "",
      guruId: (data.guruId as string) ?? "",
      tanggal: (data.tanggal as Timestamp)?.toDate() ?? new Date(),
      sesi: (data.sesi as SesiHalaqoh) ?? "shubuh",
      records: (data.records as AbsensiSantriRecord[]) ?? [],
      createdAt: (data.createdAt as Timestamp)?.toDate() ?? new Date(),
      updatedAt: (data.updatedAt as Timestamp)?.toDate() ?? new Date(),
    };
  });
}

/**
 * Realtime subscription to absensi records within a date range.
 * Returns an unsubscribe function.
 */
export function subscribeAbsensiByDateRange(
  startDate: Date,
  endDate: Date,
  onData: (data: AbsensiDocData[]) => void,
  onError?: (err: Error) => void
): () => void {
  const absensiRef = collection(db, "absensi");
  const q = query(
    absensiRef,
    where("tanggal", ">=", Timestamp.fromDate(startDate)),
    where("tanggal", "<=", Timestamp.fromDate(endDate))
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const docs = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          halaqohId: (data.halaqohId as string) ?? "",
          guruId: (data.guruId as string) ?? "",
          tanggal: (data.tanggal as Timestamp)?.toDate() ?? new Date(),
          sesi: (data.sesi as SesiHalaqoh) ?? "shubuh",
          records: (data.records as AbsensiSantriRecord[]) ?? [],
          createdAt: (data.createdAt as Timestamp)?.toDate() ?? new Date(),
          updatedAt: (data.updatedAt as Timestamp)?.toDate() ?? new Date(),
        };
      });
      onData(docs);
    },
    (err) => {
      console.error("Realtime absensi error:", err);
      onError?.(err);
    }
  );
}

/** Raw setoran hafalan document */
export interface HafalanSantriDoc {
  id: string;
  santriId: string;
  guruId?: string;
  halaqohId?: string;
  tanggalSetoran: Date;
  jenis: "ziyadah" | "murajaah" | string;
  juz: number;
  surah: string;
  surahNumber: number;
  ayatMulai: number;
  ayatSelesai: number;
  nilai: string;
  nilaiKelancaran: number;
  nilaiTajwid: number;
  catatan?: string;
  createdAt: Date;
}

/** Helper to parse Firestore doc into HafalanSantriDoc */
export function mapHafalanDoc(id: string, data: Record<string, any>): HafalanSantriDoc {
  const tanggal = (data.tanggalSetoran as Timestamp)?.toDate
    ? (data.tanggalSetoran as Timestamp).toDate()
    : (data.createdAt as Timestamp)?.toDate
    ? (data.createdAt as Timestamp).toDate()
    : (data.tanggal as Timestamp)?.toDate
    ? (data.tanggal as Timestamp).toDate()
    : new Date();

  const jenisRaw = String(data.jenis || "ziyadah").toLowerCase().trim();
  const jenis = jenisRaw.includes("mura") ? "murajaah" : "ziyadah";

  const kelancaran = typeof data.nilaiKelancaran === "number" ? data.nilaiKelancaran : typeof data.nilai === "number" ? data.nilai : 85;
  const tajwid = typeof data.nilaiTajwid === "number" ? data.nilaiTajwid : typeof data.nilai === "number" ? data.nilai : 85;

  return {
    id,
    santriId: (data.santriId as string) ?? "",
    guruId: data.guruId as string | undefined,
    halaqohId: data.halaqohId as string | undefined,
    tanggalSetoran: tanggal,
    jenis,
    juz: (data.juz as number) ?? 1,
    surah: (data.surahName as string) ?? (data.surah as string) ?? "",
    surahNumber: (data.surahId as number) ?? (data.surahNumber as number) ?? 1,
    ayatMulai: (data.ayatMulai as number) ?? 1,
    ayatSelesai: (data.ayatSelesai as number) ?? 1,
    nilai: String(data.nilai ?? "A"),
    nilaiKelancaran: kelancaran,
    nilaiTajwid: tajwid,
    catatan: data.catatan as string | undefined,
    createdAt: (data.createdAt as Timestamp)?.toDate?.() ?? tanggal,
  };
}

/**
 * Fetch all memorization records (setoran hafalan) for a specific santri.
 */
export async function getHafalanBySantriId(
  santriId: string
): Promise<HafalanSantriDoc[]> {
  const hafalanRef = collection(db, "hafalan_santri");
  const q = query(hafalanRef, where("santriId", "==", santriId));

  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => mapHafalanDoc(docSnap.id, docSnap.data()));
}

/**
 * Fetch all memorization records for multiple santri in parallel.
 */
export async function getHafalanBySantriIds(
  santriIds: string[]
): Promise<Record<string, HafalanSantriDoc[]>> {
  if (!santriIds || santriIds.length === 0) return {};

  const results: Record<string, HafalanSantriDoc[]> = {};
  await Promise.all(
    santriIds.map(async (id) => {
      const records = await getHafalanBySantriId(id);
      results[id] = records;
    })
  );

  return results;
}

/**
 * Fetch extra juz target for a specific santri.
 */
export async function getSantriExtraTargetJuz(
  santriId: string
): Promise<number[]> {
  try {
    const docRef = doc(db, "santriExtraTarget", santriId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return (data.juzList as number[]) ?? [];
    }

    const colRef = collection(db, "santriExtraTarget");
    const q = query(colRef, where("santriId", "==", santriId));
    const querySnap = await getDocs(q);
    if (!querySnap.empty) {
      const data = querySnap.docs[0].data();
      return (data.juzList as number[]) ?? [];
    }
  } catch (err) {
    console.warn("Failed to fetch extra target:", err);
  }
  return [];
}

/**
 * Fetch all memorization records (setoran hafalan) from the entire collection.
 * Used for bulk aggregation on the dashboard to prevent N+1 queries.
 */
export async function getAllHafalanRecords(): Promise<HafalanSantriDoc[]> {
  const hafalanRef = collection(db, "hafalan_santri");
  const snapshot = await getDocs(hafalanRef);
  return snapshot.docs.map((docSnap) => mapHafalanDoc(docSnap.id, docSnap.data()));
}

/**
 * Realtime subscription to all hafalan records for a specific halaqoh.
 * Uses the `halaqohId` field on each doc (single listener for all members).
 * Returns an unsubscribe function.
 */
export function subscribeHafalanByHalaqohId(
  halaqohId: string,
  onData: (data: HafalanSantriDoc[]) => void,
  onError?: (err: Error) => void
): () => void {
  const hafalanRef = collection(db, "hafalan_santri");
  const q = query(hafalanRef, where("halaqohId", "==", halaqohId));

  return onSnapshot(
    q,
    (snapshot) => {
      const docs = snapshot.docs.map((docSnap) =>
        mapHafalanDoc(docSnap.id, docSnap.data())
      );
      onData(docs);
    },
    (err) => {
      console.error("Realtime hafalan error:", err);
      onError?.(err);
    }
  );
}

