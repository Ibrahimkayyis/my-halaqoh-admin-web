import { useMemo, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { Halaqoh } from "@/types/models/halaqoh.types";
import type { Guru } from "@/features/guru/types/guru.types";
import type { Santri } from "@/features/santri/types/santri.types";
import {
  subscribeAbsensiByDateRange,
  subscribeHafalanByHalaqohId,
  type HafalanSantriDoc,
} from "@/lib/firestore/queries/kehadiran-santri.queries";
import { subscribeSertifikasiByHalaqohId } from "@/lib/firestore/queries/sertifikasi.queries";
import { useGetTargetHafalan } from "@/features/target-hafalan/hooks/use-target-hafalan";
import {
  getTargetJuzCount,
  getTargetJuzList,
} from "@/features/target-hafalan/utils/target-hafalan-helper";
import { calculateSantriHafalan } from "@/lib/quran/quran-service";
import type { SesiHalaqoh } from "@/features/kehadiran-guru/types/kehadiran-guru.types";
import type { SertifikasiTahfidz } from "@/features/sertifikasi/types/sertifikasi.types";
import type { AbsensiDocData } from "@/features/kehadiran-santri/types/kehadiran-santri.types";


export const HALAQOH_DETAIL_QUERY_KEY = ["halaqoh-detail"];

export interface TodaySesiAttendanceStat {
  sesi: SesiHalaqoh;
  label: string;
  isScheduledToday: boolean;
  totalExpected: number;
  hadirCount: number;
  sakitCount: number;
  izinCount: number;
  alfaCount: number;
  unrecordedCount: number;
  percentage: number;
  hasAbsensiRecord: boolean;
}

export interface SantriHafalanAchievement {
  santriId: string;
  nama: string;
  nis: string;
  kelas: string;
  completedJuzCount: number;
  targetJuz: number;
  progressPercentage: number;
  isAchieved: boolean;
  memorizedAyatInTarget?: number;
  totalAyatInTarget?: number;
}

export interface HalaqohHafalanSummary {
  targetJuz: number;
  totalSantri: number;
  achievedCount: number;
  notAchievedCount: number;
  overallPercentage: number;
  santriAchievements: SantriHafalanAchievement[];
}

/**
 * ScheduleHelper for calculating expected scheduled sessions per day & program
 */
export function getScheduledSessionsForDate(date: Date, program: "R" | "T"): SesiHalaqoh[] {
  const day = date.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
  if (program === "T") {
    if (day >= 1 && day <= 4) {
      return ["shubuh", "dhuha", "siang", "ashar", "maghrib"];
    } else if (day === 5 || day === 6) {
      return ["shubuh"];
    } else {
      return ["maghrib"];
    }
  } else {
    // Reguler
    if (day >= 1 && day <= 4) {
      return ["shubuh", "maghrib"];
    } else if (day === 0) {
      return ["shubuh"];
    } else {
      return ["maghrib"];
    }
  }
}

/** Fetch single halaqoh by ID */
async function getHalaqohById(id: string): Promise<Halaqoh | null> {
  if (!id) return null;
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
  if (!id) return null;
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

/** Fetch member santri list by halaqoh ID */
async function getHalaqohMembers(halaqohId: string): Promise<Santri[]> {
  if (!halaqohId) return [];
  const colRef = collection(db, "santri");
  const q = query(colRef, where("halaqohId", "==", halaqohId));
  const snap = await getDocs(q);
  return snap.docs.map((docSnap) => {
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
  });
}

/**
 * Hook to fetch base halaqoh info, teacher, and member roster.
 * Remains one-shot (useQuery) — this data rarely changes during a session.
 */
export function useHalaqohBaseDetail(halaqohId: string) {
  const { data: halaqoh, isLoading: halaqohLoading } = useQuery({
    queryKey: [...HALAQOH_DETAIL_QUERY_KEY, "halaqoh", halaqohId],
    queryFn: () => getHalaqohById(halaqohId),
    enabled: !!halaqohId,
  });

  const guruId = halaqoh?.guruId;
  const { data: guru, isLoading: guruLoading } = useQuery({
    queryKey: [...HALAQOH_DETAIL_QUERY_KEY, "guru", guruId],
    queryFn: () => getGuruById(guruId!),
    enabled: !!guruId,
  });

  const { data: members = [], isLoading: membersLoading } = useQuery({
    queryKey: [...HALAQOH_DETAIL_QUERY_KEY, "members", halaqohId],
    queryFn: () => getHalaqohMembers(halaqohId),
    enabled: !!halaqohId,
  });

  return {
    halaqoh: halaqoh ?? null,
    guru: guru ?? null,
    members,
    isLoading: halaqohLoading || guruLoading || membersLoading,
  };
}

/**
 * Hook to subscribe to today's per-session attendance stats for a halaqoh.
 * Uses onSnapshot for realtime updates — data refreshes automatically when
 * the guru marks attendance in the mobile app.
 */
export function useHalaqohTodayAttendanceStats(
  halaqohId: string,
  program: "R" | "T" | undefined,
  memberCount: number
) {
  const { todayStart, todayEnd, formattedTodayDate } = useMemo(() => {
    const now = new Date();
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);

    const end = new Date(now);
    end.setHours(23, 59, 59, 999);

    const fmt = start.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    return { todayStart: start, todayEnd: end, formattedTodayDate: fmt };
  }, []);

  const [absensiDocs, setAbsensiDocs] = useState<AbsensiDocData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!halaqohId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);

    const unsubscribe = subscribeAbsensiByDateRange(
      todayStart,
      todayEnd,
      (docs) => {
        setAbsensiDocs(docs);
        setIsLoading(false);
      },
      (err) => {
        setError("Gagal memuat data kehadiran. Periksa koneksi atau izin akses.");
        console.error("Attendance subscription error:", err);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [halaqohId]);

  const todaySessionStats = useMemo<TodaySesiAttendanceStat[]>(() => {
    if (!program) return [];

    const now = new Date();
    const scheduledSessionsToday = getScheduledSessionsForDate(now, program);

    const availableSessions: SesiHalaqoh[] =
      program === "T"
        ? ["shubuh", "dhuha", "siang", "ashar", "maghrib"]
        : ["shubuh", "maghrib"];

    const sessionLabels: Record<SesiHalaqoh, string> = {
      shubuh: "Shubuh",
      dhuha: "Dhuha",
      siang: "Siang",
      ashar: "Ashar",
      maghrib: "Maghrib",
    };

    const halaqohAbsensiToday = absensiDocs.filter((d) => d.halaqohId === halaqohId);

    return availableSessions.map((sesi) => {
      const isScheduledToday = scheduledSessionsToday.includes(sesi);
      const totalExpected = isScheduledToday ? memberCount : 0;

      const docForSesi = halaqohAbsensiToday.find((d) => d.sesi === sesi);
      const hasAbsensiRecord = !!docForSesi;

      let hadirCount = 0;
      let sakitCount = 0;
      let izinCount = 0;
      let alfaCount = 0;

      if (docForSesi) {
        for (const r of docForSesi.records) {
          switch (r.status as string) {
            // Legacy Firestore values ('hadir_barcode', 'hadir_manual', 'terlambat')
            // normalized to 'hadir' here for backward compatibility
            case "hadir":
            case "hadir_barcode":
            case "hadir_manual":
            case "terlambat":
              hadirCount++;
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
      }

      const totalRecorded = hadirCount + sakitCount + izinCount + alfaCount;
      const unrecordedCount = isScheduledToday
        ? Math.max(0, memberCount - totalRecorded)
        : 0;

      const percentage =
        totalExpected > 0
          ? Math.min(100, Math.round((hadirCount / totalExpected) * 100))
          : 0;

      return {
        sesi,
        label: sessionLabels[sesi],
        isScheduledToday,
        totalExpected,
        hadirCount,
        sakitCount,
        izinCount,
        alfaCount,
        unrecordedCount,
        percentage,
        hasAbsensiRecord,
      };
    });
  }, [program, memberCount, absensiDocs, halaqohId]);

  return {
    todaySessionStats,
    formattedTodayDate,
    isLoading,
    error,
  };
}

/**
 * Hook to subscribe to realtime hafalan achievement for all members in a halaqoh.
 * Uses a single onSnapshot listener querying by halaqohId (more efficient than N per-santri).
 */
export function useHalaqohHafalanAchievement(
  halaqohId: string,
  members: Santri[],
  program: "R" | "T" | undefined,
  kelas?: string
) {
  const { data: targetList, isLoading: targetLoading } = useGetTargetHafalan();

  const [hafalanDocs, setHafalanDocs] = useState<HafalanSantriDoc[]>([]);
  const [hafalanLoading, setHafalanLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!halaqohId) {
      setHafalanLoading(false);
      return;
    }
    setHafalanLoading(true);
    setError(null);

    const unsubscribe = subscribeHafalanByHalaqohId(
      halaqohId,
      (docs) => {
        setHafalanDocs(docs);
        setHafalanLoading(false);
      },
      (err) => {
        setError("Gagal memuat data hafalan. Periksa koneksi atau izin akses.");
        console.error("Hafalan subscription error:", err);
        setHafalanLoading(false);
      }
    );

    return () => unsubscribe();
  }, [halaqohId]);

  const hafalanSummary = useMemo<HalaqohHafalanSummary>(() => {
    const halaqohKelas = kelas ?? members[0]?.kelas ?? "7";
    const halaqohProg = program ?? "R";
    const groupAdminTarget = targetList?.find(
      (t) => t.kelas === halaqohKelas && t.program === halaqohProg
    );
    const targetJuz = getTargetJuzCount(groupAdminTarget, halaqohKelas, halaqohProg);
    const totalSantri = members.length;

    let achievedCount = 0;
    const santriAchievements: SantriHafalanAchievement[] = [];

    for (const m of members) {
      const mProg = (program ?? m.program) as "R" | "T";
      const mTarget = targetList?.find(
        (t) => t.kelas === m.kelas && t.program === mProg
      );
      const mTargetJuzList = getTargetJuzList(mTarget, m.kelas, mProg);
      const mTargetJuz = mTargetJuzList.length;

      const calc = calculateSantriHafalan(m.id, hafalanDocs, mTargetJuzList);
      const completedJuzCount = calc.completedJuzCount;
      const isAchieved = mTargetJuz > 0 && completedJuzCount >= mTargetJuz;
      if (isAchieved) achievedCount++;

      santriAchievements.push({
        santriId: m.id,
        nama: m.nama,
        nis: m.nis,
        kelas: m.kelas,
        completedJuzCount,
        targetJuz: mTargetJuz,
        progressPercentage: calc.progressPercentage,
        isAchieved,
        memorizedAyatInTarget: calc.memorizedAyatInTarget,
        totalAyatInTarget: calc.totalAyatInTarget,
      });
    }

    const notAchievedCount = Math.max(0, totalSantri - achievedCount);
    const overallPercentage =
      totalSantri > 0 ? Math.round((achievedCount / totalSantri) * 100) : 0;

    return {
      targetJuz,
      totalSantri,
      achievedCount,
      notAchievedCount,
      overallPercentage,
      santriAchievements,
    };
  }, [members, program, kelas, targetList, hafalanDocs]);

  return {
    hafalanSummary,
    isLoading: hafalanLoading || targetLoading,
    error,
  };
}

// ==================== SERTIFIKASI SECTION HOOK ====================

export interface SantriSertifikasiEntry {
  santriId: string;
  santriNama: string;
  nis: string;
  kelas: string;
  /** All sertifikasi records for this santri (any status) */
  allItems: SertifikasiTahfidz[];
  /** Only passed records, sorted by juz number ascending */
  passedItems: SertifikasiTahfidz[];
  /** Distinct juz numbers that have been certified (passed) */
  certifiedJuzNumbers: number[];
  /** Count of certified juz */
  certifiedCount: number;
  /** Whether there is an active (pending/scheduled) pengajuan */
  hasActivePengajuan: boolean;
}

/**
 * Hook that subscribes to all sertifikasi for a halaqoh in realtime,
 * then builds a per-santri breakdown for use in the Sertifikasi section.
 */
export function useHalaqohSertifikasiSection(
  halaqohId: string,
  members: Santri[]
) {
  const [rawList, setRawList] = useState<SertifikasiTahfidz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!halaqohId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);

    const unsubscribe = subscribeSertifikasiByHalaqohId(
      halaqohId,
      (docs) => {
        setRawList(docs);
        setIsLoading(false);
      },
      (err) => {
        setError("Gagal memuat data sertifikasi. Periksa koneksi atau izin akses.");
        console.error("Sertifikasi subscription error:", err);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [halaqohId]);

  const sertifikasiEntries = useMemo<SantriSertifikasiEntry[]>(() => {
    // Group all sertifikasi docs by santriId
    const grouped = new Map<string, SertifikasiTahfidz[]>();
    for (const item of rawList) {
      const existing = grouped.get(item.santriId) ?? [];
      existing.push(item);
      grouped.set(item.santriId, existing);
    }

    // Build one entry per member, even if they have no sertifikasi
    return members.map((member) => {
      const allItems = grouped.get(member.id) ?? [];
      const passedItems = allItems
        .filter((s) => s.status === "passed")
        .sort((a, b) => a.juz - b.juz);
      const certifiedJuzNumbers = passedItems.map((s) => s.juz);
      const hasActivePengajuan = allItems.some(
        (s) => s.status === "pending" || s.status === "scheduled"
      );

      return {
        santriId: member.id,
        santriNama: member.nama,
        nis: member.nis,
        kelas: member.kelas,
        allItems,
        passedItems,
        certifiedJuzNumbers,
        certifiedCount: passedItems.length,
        hasActivePengajuan,
      };
    });
  }, [rawList, members]);

  // Summary stats
  const totalCertifiedJuz = useMemo(
    () => sertifikasiEntries.reduce((sum, e) => sum + e.certifiedCount, 0),
    [sertifikasiEntries]
  );
  const santriWithCertification = useMemo(
    () => sertifikasiEntries.filter((e) => e.certifiedCount > 0).length,
    [sertifikasiEntries]
  );

  return {
    sertifikasiEntries,
    totalCertifiedJuz,
    santriWithCertification,
    isLoading,
    error,
  };
}
