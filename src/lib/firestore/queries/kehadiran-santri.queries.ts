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
  juz: number;
  surah: string;
  surahNumber: number;
  ayatMulai: number;
  ayatSelesai: number;
  nilai: string;
  catatan?: string;
  createdAt: Date;
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
  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      santriId: (data.santriId as string) ?? "",
      juz: (data.juz as number) ?? 1,
      surah: (data.surah as string) ?? "",
      surahNumber: (data.surahNumber as number) ?? 1,
      ayatMulai: (data.ayatMulai as number) ?? 1,
      ayatSelesai: (data.ayatSelesai as number) ?? 1,
      nilai: (data.nilai as string) ?? "A",
      catatan: data.catatan as string | undefined,
      createdAt: (data.createdAt as Timestamp)?.toDate() ?? new Date(),
    };
  });
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
  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      santriId: (data.santriId as string) ?? "",
      juz: (data.juz as number) ?? 1,
      surah: (data.surah as string) ?? "",
      surahNumber: (data.surahNumber as number) ?? 1,
      ayatMulai: (data.ayatMulai as number) ?? 1,
      ayatSelesai: (data.ayatSelesai as number) ?? 1,
      nilai: (data.nilai as string) ?? "A",
      catatan: data.catatan as string | undefined,
      createdAt: (data.createdAt as Timestamp)?.toDate() ?? new Date(),
    };
  });
}
