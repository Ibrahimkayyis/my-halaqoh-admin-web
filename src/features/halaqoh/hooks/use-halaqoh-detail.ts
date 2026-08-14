import { useMemo } from "react";
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
  getAbsensiByDateRange,
  getHafalanBySantriId,
} from "@/lib/firestore/queries/kehadiran-santri.queries";
import type { SesiHalaqoh } from "@/features/kehadiran-guru/types/kehadiran-guru.types";

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
 * Hook to fetch base halaqoh info, teacher, and member roster
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
 * Hook to fetch today's per-session attendance stats for halaqoh
 */
export function useHalaqohTodayAttendanceStats(
  halaqohId: string,
  program: "R" | "T" | undefined,
  memberCount: number
) {
  const { todayStart, todayEnd, todayDateStr, formattedTodayDate } = useMemo(() => {
    const now = new Date();
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);

    const end = new Date(now);
    end.setHours(23, 59, 59, 999);

    const dateStr = start.toISOString().split("T")[0];
    const fmt = start.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    return {
      todayStart: start,
      todayEnd: end,
      todayDateStr: dateStr,
      formattedTodayDate: fmt,
    };
  }, []);

  const { data: absensiDocs = [], isLoading } = useQuery({
    queryKey: [...HALAQOH_DETAIL_QUERY_KEY, "today-absensi", halaqohId, todayDateStr],
    queryFn: () => getAbsensiByDateRange(todayStart, todayEnd),
    enabled: !!halaqohId,
  });

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
          switch (r.status) {
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
  };
}

/**
 * Hook to fetch hafalan achievement for all member santris in halaqoh
 */
export function useHalaqohHafalanAchievement(
  members: Santri[],
  program: "R" | "T" | undefined
) {
  const memberIds = useMemo(() => members.map((m) => m.id), [members]);

  const { data: hafalanMap = new Map<string, number>(), isLoading } = useQuery({
    queryKey: [...HALAQOH_DETAIL_QUERY_KEY, "hafalan-members", memberIds.join(",")],
    queryFn: async () => {
      const map = new Map<string, number>();
      for (const m of members) {
        const records = await getHafalanBySantriId(m.id);
        const uniqueJuz = new Set<number>();
        for (const r of records) {
          if (r.juz > 0) uniqueJuz.add(r.juz);
        }
        map.set(m.id, uniqueJuz.size);
      }
      return map;
    },
    enabled: members.length > 0 && !!program,
  });

  const hafalanSummary = useMemo<HalaqohHafalanSummary>(() => {
    const targetJuz = program === "T" ? 15 : 5;
    const totalSantri = members.length;

    let achievedCount = 0;
    const santriAchievements: SantriHafalanAchievement[] = [];

    for (const m of members) {
      const completedJuzCount = hafalanMap.get(m.id) ?? 0;
      const isAchieved = completedJuzCount >= targetJuz;
      if (isAchieved) achievedCount++;

      const progressPercentage =
        targetJuz > 0
          ? Math.min(100, Math.round((completedJuzCount / targetJuz) * 100))
          : 0;

      santriAchievements.push({
        santriId: m.id,
        nama: m.nama,
        nis: m.nis,
        kelas: m.kelas,
        completedJuzCount,
        targetJuz,
        progressPercentage,
        isAchieved,
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
  }, [members, program, hafalanMap]);

  return {
    hafalanSummary,
    isLoading,
  };
}
