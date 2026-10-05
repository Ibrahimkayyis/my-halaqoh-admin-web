import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useGetSantri } from "@/features/santri/hooks/use-santri";
import { useGetTargetHafalan } from "@/features/target-hafalan/hooks/use-target-hafalan";
import { getAllHafalanRecords } from "@/lib/firestore/queries/kehadiran-santri.queries";
import {
  getTargetJuzCount,
  getTargetJuzList,
} from "@/features/target-hafalan/utils/target-hafalan-helper";
import { calculateSantriHafalan } from "@/lib/quran/quran-service";
import type { Santri } from "@/features/santri/types/santri.types";
import type { TargetHafalan } from "@/features/target-hafalan/types/target-hafalan.types";
import type { HafalanSantriDoc } from "@/lib/firestore/queries/kehadiran-santri.queries";
import { Timestamp } from "firebase/firestore";

export const DASHBOARD_HAFALAN_QUERY_KEY = ["dashboard", "hafalan-achievement"];

export interface ProgramHafalanStat {
  program: "R" | "T";
  targetJuz: number;
  hasTarget: boolean;
  totalSantri: number;
  achievedSantri: number;
  percentage: number;
}

export interface KelasHafalanStat {
  kelas: string; // "Kelas 7", "Kelas 8", etc.
  kelasNum: string; // "7", "8", etc.
  reguler: number; // 0-100 percentage for chart
  takhassus: number; // 0-100 percentage for chart
  regulerStat: ProgramHafalanStat;
  takhassusStat: ProgramHafalanStat;
}

export interface DashboardHafalanSummary {
  avgReguler: number;
  avgTakhassus: number;
  avgTotal: number;
  totalActiveSantri: number;
  totalAchievedSantri: number;
  totalRegulerSantri: number;
  totalRegulerAchieved: number;
  totalTakhassusSantri: number;
  totalTakhassusAchieved: number;
}

export interface DashboardHafalanResult {
  stats: KelasHafalanStat[];
  summary: DashboardHafalanSummary;
  tahunAjaran: string | null;
  semesterAktif: 1 | 2 | null;
  isDummyData: boolean;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

const CLASSES = ["7", "8", "9", "10", "11", "12"];

/**
 * Pure calculation function for testing and reusability
 */
export function calculateHafalanStats(
  santriList: Santri[],
  targetList: TargetHafalan[],
  hafalanRecords: HafalanSantriDoc[]
): {
  stats: KelasHafalanStat[];
  summary: DashboardHafalanSummary;
  tahunAjaran: string | null;
  semesterAktif: 1 | 2 | null;
  isDummyData: boolean;
} {
  // 1. Filter active santri (exclude alumni)
  const activeSantri = santriList.filter((s) => !s.isAlumni);

  // 2. Pre-calculate completed juz for all active santri using quran-service
  const santriCompletedMap = new Map<string, number>();
  for (const s of activeSantri) {
    const calc = calculateSantriHafalan(s.id, hafalanRecords);
    santriCompletedMap.set(s.id, calc.completedJuzCount);
  }

  // 3. Extract global academic year & active semester
  const firstWithSemester = targetList.find((t) => t.semesterAktif !== null);
  const semesterAktif = firstWithSemester?.semesterAktif ?? null;
  const firstWithTahun = targetList.find(
    (t) => t.tahunAjaran !== null && t.tahunAjaran !== ""
  );
  const tahunAjaran = firstWithTahun?.tahunAjaran ?? null;

  // 4. Calculate stats per class (7-12)
  let totalRegulerSantriWithTarget = 0;
  let totalRegulerAchievedWithTarget = 0;
  let totalTakhassusSantriWithTarget = 0;
  let totalTakhassusAchievedWithTarget = 0;

  const stats: KelasHafalanStat[] = CLASSES.map((kelasNum) => {
    // ---- REGULER ----
    const regulerTargetDoc = targetList.find(
      (t) => t.kelas === kelasNum && t.program === "R"
    );
    const regulerTargetJuz = getTargetJuzCount(regulerTargetDoc, kelasNum, "R");
    const hasRegulerTarget =
      regulerTargetDoc?.semesterAktif !== null &&
      regulerTargetDoc?.semesterAktif !== undefined &&
      regulerTargetJuz > 0;

    const regulerSantriList = activeSantri.filter((s) => {
      const prog = s.program === "T" || s.program === "Takhassus" ? "T" : "R";
      return s.kelas === kelasNum && prog === "R";
    });

    let regulerAchievedCount = 0;
    if (hasRegulerTarget) {
      for (const s of regulerSantriList) {
        const completedJuzCount = santriCompletedMap.get(s.id) ?? 0;
        if (completedJuzCount >= regulerTargetJuz) {
          regulerAchievedCount++;
        }
      }
    }

    const regulerPercentage =
      hasRegulerTarget && regulerSantriList.length > 0
        ? Math.min(
            100,
            Math.round((regulerAchievedCount / regulerSantriList.length) * 100)
          )
        : 0;

    if (hasRegulerTarget) {
      totalRegulerSantriWithTarget += regulerSantriList.length;
      totalRegulerAchievedWithTarget += regulerAchievedCount;
    }

    const regulerStat: ProgramHafalanStat = {
      program: "R",
      targetJuz: regulerTargetJuz,
      hasTarget: hasRegulerTarget,
      totalSantri: regulerSantriList.length,
      achievedSantri: regulerAchievedCount,
      percentage: regulerPercentage,
    };

    // ---- TAKHASSUS ----
    const takhassusTargetDoc = targetList.find(
      (t) => t.kelas === kelasNum && t.program === "T"
    );
    const takhassusTargetJuz = getTargetJuzCount(takhassusTargetDoc, kelasNum, "T");
    const hasTakhassusTarget =
      takhassusTargetDoc?.semesterAktif !== null &&
      takhassusTargetDoc?.semesterAktif !== undefined &&
      takhassusTargetJuz > 0;

    const takhassusSantriList = activeSantri.filter((s) => {
      const prog = s.program === "T" || s.program === "Takhassus" ? "T" : "R";
      return s.kelas === kelasNum && prog === "T";
    });

    let takhassusAchievedCount = 0;
    if (hasTakhassusTarget) {
      for (const s of takhassusSantriList) {
        const completedJuzCount = santriCompletedMap.get(s.id) ?? 0;
        if (completedJuzCount >= takhassusTargetJuz) {
          takhassusAchievedCount++;
        }
      }
    }

    const takhassusPercentage =
      hasTakhassusTarget && takhassusSantriList.length > 0
        ? Math.min(
            100,
            Math.round((takhassusAchievedCount / takhassusSantriList.length) * 100)
          )
        : 0;

    if (hasTakhassusTarget) {
      totalTakhassusSantriWithTarget += takhassusSantriList.length;
      totalTakhassusAchievedWithTarget += takhassusAchievedCount;
    }

    const takhassusStat: ProgramHafalanStat = {
      program: "T",
      targetJuz: takhassusTargetJuz,
      hasTarget: hasTakhassusTarget,
      totalSantri: takhassusSantriList.length,
      achievedSantri: takhassusAchievedCount,
      percentage: takhassusPercentage,
    };

    return {
      kelas: `Kelas ${kelasNum}`,
      kelasNum,
      reguler: regulerPercentage,
      takhassus: takhassusPercentage,
      regulerStat,
      takhassusStat,
    };
  });

  // 5. Calculate weighted summary averages
  const avgReguler =
    totalRegulerSantriWithTarget > 0
      ? Math.round(
          (totalRegulerAchievedWithTarget / totalRegulerSantriWithTarget) * 100
        )
      : 0;

  const avgTakhassus =
    totalTakhassusSantriWithTarget > 0
      ? Math.round(
          (totalTakhassusAchievedWithTarget / totalTakhassusSantriWithTarget) * 100
        )
      : 0;

  const totalSantriWithTarget =
    totalRegulerSantriWithTarget + totalTakhassusSantriWithTarget;
  const totalAchievedWithTarget =
    totalRegulerAchievedWithTarget + totalTakhassusAchievedWithTarget;

  const avgTotal =
    totalSantriWithTarget > 0
      ? Math.round((totalAchievedWithTarget / totalSantriWithTarget) * 100)
      : 0;

  const summary: DashboardHafalanSummary = {
    avgReguler,
    avgTakhassus,
    avgTotal,
    totalActiveSantri: activeSantri.length,
    totalAchievedSantri: totalAchievedWithTarget,
    totalRegulerSantri: totalRegulerSantriWithTarget,
    totalRegulerAchieved: totalRegulerAchievedWithTarget,
    totalTakhassusSantri: totalTakhassusSantriWithTarget,
    totalTakhassusAchieved: totalTakhassusAchievedWithTarget,
  };

  return {
    stats,
    summary,
    tahunAjaran,
    semesterAktif,
    isDummyData: false,
  };
}

/**
 * Main TanStack Query hook for dashboard hafalan statistics
 */
export function useDashboardHafalan(): DashboardHafalanResult {
  const {
    data: santriList = [],
    isLoading: santriLoading,
    isError: santriError,
    refetch: refetchSantri,
  } = useGetSantri();

  const {
    data: targetList = [],
    isLoading: targetLoading,
    isError: targetError,
    refetch: refetchTarget,
  } = useGetTargetHafalan();

  const {
    data: hafalanRecords = [],
    isLoading: hafalanLoading,
    isError: hafalanError,
    refetch: refetchHafalan,
  } = useQuery({
    queryKey: DASHBOARD_HAFALAN_QUERY_KEY,
    queryFn: getAllHafalanRecords,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });

  const calculated = useMemo(() => {
    return calculateHafalanStats(santriList, targetList, hafalanRecords);
  }, [santriList, targetList, hafalanRecords]);

  const refetch = () => {
    refetchSantri();
    refetchTarget();
    refetchHafalan();
  };

  return {
    stats: calculated.stats,
    summary: calculated.summary,
    tahunAjaran: calculated.tahunAjaran,
    semesterAktif: calculated.semesterAktif,
    isDummyData: false,
    isLoading: santriLoading || targetLoading || hafalanLoading,
    isError: santriError || targetError || hafalanError,
    refetch,
  };
}
