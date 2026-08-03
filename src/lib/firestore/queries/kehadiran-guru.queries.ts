import {
  collection,
  query,
  where,
  getDocs,
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
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      halaqohId: data.halaqohId as string,
      guruId: data.guruId as string,
      tanggal: (data.tanggal as Timestamp).toDate(),
      sesi: data.sesi as SesiHalaqoh,
      createdAt: (data.createdAt as Timestamp).toDate(),
    };
  });
}
