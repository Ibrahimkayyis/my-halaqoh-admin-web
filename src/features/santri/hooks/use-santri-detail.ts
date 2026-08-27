import { useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { doc, getDoc, collection, query, where, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import {
  getAbsensiByDateRange,
  subscribeAbsensiByDateRange,
  getHafalanBySantriId,
  getSantriExtraTargetJuz,
} from "@/lib/firestore/queries/kehadiran-santri.queries";
import { useGetTargetHafalan } from "@/features/target-hafalan/hooks/use-target-hafalan";
import type { Santri } from "@/features/santri/types/santri.types";
import type { Halaqoh } from "@/types/models/halaqoh.types";
import type { Guru } from "@/features/guru/types/guru.types";
import type {
  AttendanceTimeFilter,
  SantriFilteredAttendanceStats,
} from "@/features/kehadiran-santri/types/kehadiran-santri.types";
import { getSertifikasiBySantriId } from "@/lib/firestore/queries/sertifikasi.queries";
import type { SertifikasiTahfidz } from "@/features/sertifikasi/types/sertifikasi.types";

import {
  getTargetJuzCount,
  getTargetJuzList,
} from "@/features/target-hafalan/utils/target-hafalan-helper";


export const SANTRI_DETAIL_QUERY_KEY = ["santri-detail"];

/** Fetch a single santri document by ID (or NIS fallback) */
async function getSantriById(id: string): Promise<Santri | null> {
  if (!id) return null;

  // 1. Try document ID
  const ref = doc(db, "santri", id);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    const data = snap.data();
    return {
      id: snap.id,
      nis: data.nis,
      nama: data.nama,
      kelas: data.kelas,
      program: data.program,
      halaqohId: data.halaqohId ?? null,
      isAlumni: data.isAlumni ?? false,
      profilePicture: data.profilePicture ?? null,
      authUid: data.authUid ?? null,
      waliSantri: data.waliSantri ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  // 2. Fallback: Query by NIS
  const colRef = collection(db, "santri");
  const q = query(colRef, where("nis", "==", id), limit(1));
  const qSnap = await getDocs(q);
  if (!qSnap.empty) {
    const docSnap = qSnap.docs[0];
    const data = docSnap.data();
    return {
      id: docSnap.id,
      nis: data.nis,
      nama: data.nama,
      kelas: data.kelas,
      program: data.program,
      halaqohId: data.halaqohId ?? null,
      isAlumni: data.isAlumni ?? false,
      profilePicture: data.profilePicture ?? null,
      authUid: data.authUid ?? null,
      waliSantri: data.waliSantri ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  return null;
}

/** Fetch halaqoh by ID */
async function getHalaqohById(id: string): Promise<Halaqoh | null> {
  const ref = doc(db, "halaqoh", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    id: snap.id,
    nama: data.nama,
    kelas: data.kelas,
    program: data.program,
    guruId: data.guruId,
    guruNama: data.guruNama,
    santriIds: data.santriIds ?? [],
    jumlahSantri: data.jumlahSantri ?? 0,
    createdAt: data.createdAt?.toDate?.() ?? new Date(),
    updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
  };
}

/** Fetch guru by ID */
async function getGuruById(id: string): Promise<Guru | null> {
  const ref = doc(db, "guru", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    id: snap.id,
    nip: data.nip,
    nama: data.nama,
    program: data.program,
    phone: data.phone,
    email: data.email,
    profilePicture: data.profilePicture,
    authUid: data.authUid,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

/**
 * Hook for fetching base santri info, profile, halaqoh, guru, and hafalan progress
 */
export function useSantriBaseInfo(santriId: string) {
  // 1. Fetch Santri
  const { data: santri, isLoading: santriLoading } = useQuery({
    queryKey: [...SANTRI_DETAIL_QUERY_KEY, "santri", santriId],
    queryFn: () => getSantriById(santriId),
    enabled: !!santriId,
  });

  // 2. Fetch Halaqoh
  const halaqohId = santri?.halaqohId;
  const { data: halaqoh, isLoading: halaqohLoading } = useQuery({
    queryKey: [...SANTRI_DETAIL_QUERY_KEY, "halaqoh", halaqohId],
    queryFn: () => getHalaqohById(halaqohId!),
    enabled: !!halaqohId,
  });

  // 3. Fetch Guru
  const guruId = halaqoh?.guruId;
  const { data: guru, isLoading: guruLoading } = useQuery({
    queryKey: [...SANTRI_DETAIL_QUERY_KEY, "guru", guruId],
    queryFn: () => getGuruById(guruId!),
    enabled: !!guruId,
  });

  // 4. Fetch Admin Target Hafalan
  const { data: targetList, isLoading: targetLoading } = useGetTargetHafalan();
  const adminTarget = useMemo(() => {
    if (!targetList || !santri) return null;
    return targetList.find(
      (t) => t.kelas === santri.kelas && t.program === santri.program
    ) ?? null;
  }, [targetList, santri]);

  // 5. Fetch Extra Target Juz
  const { data: extraJuzList = [], isLoading: extraLoading } = useQuery({
    queryKey: [...SANTRI_DETAIL_QUERY_KEY, "extraTarget", santriId],
    queryFn: () => getSantriExtraTargetJuz(santriId),
    enabled: !!santriId,
  });

  // 6. Fetch Hafalan Records
  const { data: hafalanRecords = [], isLoading: hafalanLoading } = useQuery({
    queryKey: [...SANTRI_DETAIL_QUERY_KEY, "hafalan", santriId],
    queryFn: () => getHafalanBySantriId(santriId),
    enabled: !!santriId,
  });

  // Calculate progress hafalan
  const hafalanProgress = useMemo(() => {
    if (!santri) {
      return {
        adminProgress: 0,
        adminJuzTarget: 0,
        adminJuzCompleted: 0,
        extraProgress: 0,
        extraJuzTarget: 0,
        extraJuzCompleted: 0,
      };
    }

    const prog = (santri.program ?? "R") as "R" | "T";
    const targetJuzCount = getTargetJuzCount(adminTarget, santri.kelas, prog);
    const targetJuzList = getTargetJuzList(adminTarget, santri.kelas, prog);

    const completedJuzSet = new Set<number>();
    for (const h of hafalanRecords) {
      if (h.juz > 0) completedJuzSet.add(h.juz);
    }

    const adminJuzCompleted = completedJuzSet.size;
    const adminProgress =
      targetJuzCount > 0
        ? Math.min(100, Math.round((adminJuzCompleted / targetJuzCount) * 100))
        : 0;

    const extraJuzTarget = extraJuzList.length;
    let extraJuzCompleted = 0;
    for (const j of extraJuzList) {
      if (completedJuzSet.has(j)) extraJuzCompleted++;
    }
    const extraProgress =
      extraJuzTarget > 0
        ? Math.min(100, Math.round((extraJuzCompleted / extraJuzTarget) * 100))
        : 0;

    return {
      adminProgress,
      adminJuzTarget: targetJuzCount,
      adminJuzCompleted,
      targetJuzList,
      extraProgress,
      extraJuzTarget,
      extraJuzCompleted,
    };
  }, [santri, adminTarget, extraJuzList, hafalanRecords]);

  // 7. Fetch Sertifikasi for this santri
  const { data: sertifikasiList = [], isLoading: sertifikasiLoading } = useQuery({
    queryKey: [...SANTRI_DETAIL_QUERY_KEY, "sertifikasi", santriId],
    queryFn: () => getSertifikasiBySantriId(santriId),
    enabled: !!santriId,
  });

  // Derived: only passed records, sorted by juz number ascending
  const certifiedJuzList = useMemo<SertifikasiTahfidz[]>(
    () =>
      sertifikasiList
        .filter((s) => s.status === "passed")
        .sort((a, b) => a.juz - b.juz),
    [sertifikasiList]
  );

  const isLoading =
    santriLoading ||
    halaqohLoading ||
    guruLoading ||
    targetLoading ||
    extraLoading ||
    hafalanLoading ||
    sertifikasiLoading;

  return {
    santri: santri ?? null,
    halaqoh: halaqoh ?? null,
    guru: guru ?? null,
    adminTarget: adminTarget ?? null,
    extraJuzList,
    hafalanProgress,
    sertifikasiList,
    certifiedJuzList,
    isLoading,
  };
}

/**
 * Hook for fetching isolated attendance stats by filter (all time, 7days, 30days, 3months, 6months, specificMonth)
 */
export function useSantriFilteredAttendance(
  santriId: string,
  halaqohId: string | null | undefined,
  santriNis: string | undefined,
  filterType: AttendanceTimeFilter,
  month: number = new Date().getMonth() + 1,
  year: number = new Date().getFullYear()
) {
  const queryClient = useQueryClient();

  const { startDate, endDate, label } = useMemo(() => {
    const now = new Date();
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);

    let start = new Date(2020, 0, 1);
    let lbl = "Seluruh Waktu";

    switch (filterType) {
      case "all":
        start = new Date(2020, 0, 1);
        lbl = "Seluruh Waktu";
        break;
      case "7days":
        start = new Date(now);
        start.setDate(start.getDate() - 6);
        start.setHours(0, 0, 0, 0);
        lbl = "Seminggu Terakhir";
        break;
      case "30days":
        start = new Date(now);
        start.setDate(start.getDate() - 29);
        start.setHours(0, 0, 0, 0);
        lbl = "Sebulan Terakhir";
        break;
      case "3months":
        start = new Date(now);
        start.setDate(start.getDate() - 89);
        start.setHours(0, 0, 0, 0);
        lbl = "3 Bulan Terakhir";
        break;
      case "6months":
        start = new Date(now);
        start.setDate(start.getDate() - 179);
        start.setHours(0, 0, 0, 0);
        lbl = "6 Bulan Terakhir";
        break;
      case "specificMonth":
        start = new Date(year, month - 1, 1, 0, 0, 0, 0);
        const endMonth = new Date(year, month, 0, 23, 59, 59, 999);
        end.setTime(endMonth.getTime());
        const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
        lbl = `Bulan ${monthNames[month - 1]} ${year}`;
        break;
    }

    return { startDate: start, endDate: end, label: lbl };
  }, [filterType, month, year]);

  const startKey = startDate.toISOString().split("T")[0];
  const endKey = endDate.toISOString().split("T")[0];

  const queryKey = useMemo(
    () => [...SANTRI_DETAIL_QUERY_KEY, "absensi", halaqohId, filterType, startKey, endKey],
    [halaqohId, filterType, startKey, endKey]
  );

  const { data: absensiDocs = [], isLoading, isFetching } = useQuery({
    queryKey,
    queryFn: () => getAbsensiByDateRange(startDate, endDate),
    staleTime: Infinity,
    enabled: !!halaqohId,
  });

  // Real-time Firestore Listener
  useEffect(() => {
    if (!halaqohId) return;

    const unsubscribe = subscribeAbsensiByDateRange(
      startDate,
      endDate,
      (data) => {
        queryClient.setQueryData(queryKey, data);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [queryClient, queryKey, startDate, endDate, halaqohId]);

  const attendanceStats = useMemo<SantriFilteredAttendanceStats>(() => {
    let hadirBarcodeCount = 0;
    let hadirManualCount = 0;
    let terlambatCount = 0;
    let sakitCount = 0;
    let izinCount = 0;
    let alfaCount = 0;
    let totalSessions = 0;

    for (const docData of absensiDocs) {
      if (docData.tanggal < startDate || docData.tanggal > endDate) {
        continue;
      }

      const rec = docData.records.find((r) => r.santriId === santriId || r.nis === santriNis);
      if (!rec) continue;

      totalSessions++;

      switch (rec.status) {
        case "hadir":
        case "hadir_barcode":
          hadirBarcodeCount++;
          break;
        case "hadir_manual":
          hadirManualCount++;
          break;
        case "terlambat":
          terlambatCount++;
          break;
        case "sakit":
          sakitCount++;
          break;
        case "izin":
          izinCount++;
          break;
        case "alfa":
          alfaCount++;
          break;
      }
    }

    const totalHadir = hadirBarcodeCount + hadirManualCount + terlambatCount;
    const attendancePercentage =
      totalSessions > 0 ? Math.round((totalHadir / totalSessions) * 100) : 0;

    return {
      filterType,
      label,
      month,
      year,
      totalSessions,
      hadirBarcodeCount,
      hadirManualCount,
      terlambatCount,
      sakitCount,
      izinCount,
      alfaCount,
      attendancePercentage,
    };
  }, [santriId, santriNis, absensiDocs, startDate, endDate, filterType, label, month, year]);

  return {
    attendanceStats,
    isLoading,
    isFetching,
  };
}
