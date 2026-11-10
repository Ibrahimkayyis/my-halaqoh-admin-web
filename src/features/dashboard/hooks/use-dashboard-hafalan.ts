import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useGetSantri } from "@/features/santri/hooks/use-santri";
import { useGetTargetHafalan } from "@/features/target-hafalan/hooks/use-target-hafalan";
import { getAllHafalanRecords } from "@/lib/firestore/queries/kehadiran-santri.queries";
import {
  getCompletedJuzCountDouble,
  getTargetJuzCountDouble,
} from "@/features/target-hafalan/utils/target-hafalan-helper";
import { normalizeProgramCode } from "@/features/target-hafalan/data/curriculum-data";
import { calculateSantriHafalan } from "@/lib/quran/quran-service";
import type { SantriHafalanCalculation } from "@/lib/quran/types";
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

  // 2. Group hafalan records by santriId and pre-calculate JuzProgressMap per active santri
  const recordsBySantri = new Map<string, HafalanSantriDoc[]>();
  for (const r of hafalanRecords) {
    if (!r.santriId) continue;
    const list = recordsBySantri.get(r.santriId);
    if (list) list.push(r);
    else recordsBySantri.set(r.santriId, [r]);
  }

  const santriCalcMap = new Map<string, SantriHafalanCalculation>();
  for (const s of activeSantri) {
    const calc = calculateSantriHafalan(s.id, recordsBySantri.get(s.id) ?? []);
    santriCalcMap.set(s.id, calc);
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

  const evaluateCohort = (kelasNum: string, prog: "R" | "T"): ProgramHafalanStat => {
    const targetDoc = targetList.find(
      (t) =>
        t.kelas.trim() === kelasNum && normalizeProgramCode(t.program) === prog
    );
    const targetJuz = getTargetJuzCountDouble(targetDoc, kelasNum, prog);
    const hasTarget =
      targetDoc?.semesterAktif !== null &&
      targetDoc?.semesterAktif !== undefined &&
      targetJuz > 0;

    const cohortSantri = activeSantri.filter(
      (s) => s.kelas.trim() === kelasNum && normalizeProgramCode(s.program) === prog
    );

    let achievedCount = 0;
    if (hasTarget) {
      for (const s of cohortSantri) {
        const calc = santriCalcMap.get(s.id);
        const completedJuz = getCompletedJuzCountDouble(
          targetDoc,
          kelasNum,
          prog,
          calc?.juzProgressMap
        );
        if (completedJuz >= targetJuz - 1e-6) {
          achievedCount++;
        }
      }
    }

    const percentage =
      hasTarget && cohortSantri.length > 0
        ? Math.min(100, Math.round((achievedCount / cohortSantri.length) * 100))
        : 0;

    return {
      program: prog,
      targetJuz,
      hasTarget,
      totalSantri: cohortSantri.length,
      achievedSantri: achievedCount,
      percentage,
    };
  };

  const stats: KelasHafalanStat[] = CLASSES.map((kelasNum) => {
    const regulerStat = evaluateCohort(kelasNum, "R");
    if (regulerStat.hasTarget) {
      totalRegulerSantriWithTarget += regulerStat.totalSantri;
      totalRegulerAchievedWithTarget += regulerStat.achievedSantri;
    }

    const takhassusStat = evaluateCohort(kelasNum, "T");
    if (takhassusStat.hasTarget) {
      totalTakhassusSantriWithTarget += takhassusStat.totalSantri;
      totalTakhassusAchievedWithTarget += takhassusStat.achievedSantri;
    }

    return {
      kelas: `Kelas ${kelasNum}`,
      kelasNum,
      reguler: regulerStat.percentage,
      takhassus: takhassusStat.percentage,
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
