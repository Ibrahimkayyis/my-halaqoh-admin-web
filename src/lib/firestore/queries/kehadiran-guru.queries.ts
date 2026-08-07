import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { AbsensiRecord, SesiHalaqoh } from "@/features/kehadiran-guru/types/kehadiran-guru.types";

/**
 * Fetch absensi records within a date range.
 * Returns minimal data needed for guru attendance calculation.
 */
export async function getAbsensiByDateRange(
  startDate: Date,
  endDate: Date
): Promise<AbsensiRecord[]> {
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
      halaqohId: data.halaqohId as string,
      guruId: data.guruId as string,
      tanggal: (data.tanggal as Timestamp)?.toDate() ?? new Date(),
      sesi: data.sesi as SesiHalaqoh,
      createdAt: (data.createdAt as Timestamp)?.toDate() ?? new Date(),
    };
  });
}

/**
 * Realtime subscription to absensi records within a date range for guru attendance.
 * Returns an unsubscribe function.
 */
export function subscribeGuruAbsensiByDateRange(
  startDate: Date,
  endDate: Date,
  onData: (data: AbsensiRecord[]) => void,
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
      const records = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          halaqohId: data.halaqohId as string,
          guruId: data.guruId as string,
          tanggal: (data.tanggal as Timestamp)?.toDate() ?? new Date(),
          sesi: data.sesi as SesiHalaqoh,
          createdAt: (data.createdAt as Timestamp)?.toDate() ?? new Date(),
        };
      });
      onData(records);
    },
    (err) => {
      console.error("Realtime guru absensi error:", err);
      onError?.(err);
    }
  );
}
