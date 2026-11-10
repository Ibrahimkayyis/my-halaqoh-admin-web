import type {
  PeriodeTarget,
  TargetAyatRange,
  TargetHafalan,
} from "../types/target-hafalan.types";
import {
  getSemesterTarget,
  normalizeProgramCode,
} from "../data/curriculum-data";
import {
  countMemorizedInSubRange,
  getFullJuzRanges,
  getFullSurahRange,
  getSurahById,
  getTotalAyatInJuz,
} from "@/lib/quran/quran-service";
import type {
  JuzProgressResult,
  SantriHafalanCalculation,
} from "@/lib/quran/types";

// ==================== DISPLAY & FORMATTING HELPERS ====================

/**
 * Formats a decimal number (such as juz count or percentage) up to 2 decimal
 * places WITHOUT unwanted round-up (truncates beyond 2 decimals after normalizing
 * floating-point noise via toFixed(4), matching Mobile's `TargetHafalanHelper.formatDecimalMax2`).
 *
 * Examples:
 * - 0 -> "0"
 * - 6.0 -> "6"
 * - 1.5 -> "1.5"
 * - 5.96748 -> "5.96"
 * - 39.7832 -> "39.78"
 */
export function formatDecimalMax2(v: number): string {
  if (!Number.isFinite(v) || v === 0) return "0";
  const rounded = Math.round(v);
  if (Math.abs(v - rounded) < 1e-6) {
    return String(rounded);
  }
  const s = v.toFixed(4);
  const [intPart, decFull = ""] = s.split(".");
  const decPart = decFull.slice(0, 2).replace(/0+$/, "");
  if (!decPart) return intPart;
  return `${intPart}.${decPart}`;
}

/** Formats a juz count up to 2 decimal places (e.g. 2 -> "2", 5.967 -> "5.96"). */
export function formatJuz(v: number): string {
  return formatDecimalMax2(v);
}

/** Formats a percentage value up to 2 decimal places (e.g. 100 -> "100", 39.783 -> "39.78"). */
export function formatPercent(v: number): string {
  return formatDecimalMax2(v);
}

// ==================== WEIGHT & CURRICULUM LOOKUP HELPERS ====================

/**
 * Parses fraction string (e.g. "½ Juz", "¾ Juz", "¼ Juz", "1/2") into a decimal weight.
 * Mirrors Mobile's `_parseFraksiWeight`.
 */
export function parseFraksiWeight(fraksi?: string | null): number | null {
  if (!fraksi) return null;
  const clean = fraksi.replace(/Juz/gi, "").trim();
  if (clean === "½") return 0.5;
  if (clean === "¾") return 0.75;
  if (clean === "¼") return 0.25;

  const parts = clean.split("/");
  if (parts.length === 2) {
    const num = Number.parseFloat(parts[0]);
    const den = Number.parseFloat(parts[1]);
    if (Number.isFinite(num) && Number.isFinite(den) && den !== 0) {
      return num / den;
    }
  }

  const parsed = Number.parseFloat(clean);
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * Computes the target Juz weight of a single exam period (UTS or UAS).
 * Non-ziyadah periods (murajaah, dauroh, uat, idadTahsin) contribute 0.0 weight.
 * Mirrors Mobile's `_getPeriodeWeight`.
 */
export function getPeriodeWeight(periode?: PeriodeTarget | null): number {
  if (!periode || periode.tipe !== "ziyadah") {
    return 0.0;
  }

  const fraksiWeight = parseFraksiWeight(periode.fraksi);
  if (fraksiWeight !== null) {
    return fraksiWeight;
  }

  return periode.juzList.length;
}

/**
 * Computes total weighted target juz for a single semester (UTS + UAS).
 */
function getSemesterWeight(
  kelas: string,
  program: "R" | "T",
  semester: 1 | 2
): number {
  const sem = getSemesterTarget(kelas, program, semester);
  if (!sem) return 0.0;
  return getPeriodeWeight(sem.uts) + getPeriodeWeight(sem.uas);
}

/**
 * Returns the cumulative list of target juz numbers from the start of the level
 * (class 7 for SMP, class 10 for SMA) up to [targetKelas] and [semesterAktif].
 */
export function getCumulativeTargetJuzList(
  targetKelas: string,
  program: "R" | "T" | string,
  semesterAktif: 1 | 2
): number[] {
  const prog = normalizeProgramCode(program);
  const targetKls = Number.parseInt(targetKelas, 10) || 7;
  const startKls = targetKls <= 9 ? 7 : 10;
  const cumulativeSet = new Set<number>();

  for (let k = startKls; k <= targetKls; k++) {
    const kStr = String(k);
    const sem1 = getSemesterTarget(kStr, prog, 1);
    const sem2 = getSemesterTarget(kStr, prog, 2);

    const addSem = (sem?: ReturnType<typeof getSemesterTarget>) => {
      if (!sem) return;
      sem.uts?.juzList.forEach((j) => cumulativeSet.add(j));
      sem.uas?.juzList.forEach((j) => cumulativeSet.add(j));
    };

    if (k < targetKls) {
      addSem(sem1);
      addSem(sem2);
    } else {
      addSem(sem1);
      if (semesterAktif === 2) {
        addSem(sem2);
      }
    }
  }

  return Array.from(cumulativeSet).sort((a, b) => a - b);
}

/**
 * Computes the cumulative fractional/decimal target juz count up to the active semester.
 * Returns `0.0` when `targetModel` is missing or `semesterAktif` is `null`
 * ("Belum ditetapkan"), matching Mobile's `getTargetJuzCountDouble`.
 */
export function getTargetJuzCountDouble(
  targetModel: TargetHafalan | null | undefined,
  kelas: string,
  program: "R" | "T" | string
): number {
  if (!targetModel || targetModel.semesterAktif == null) {
    return 0.0;
  }

  const prog = normalizeProgramCode(program);
  const semesterAktif = targetModel.semesterAktif;
  const targetKls = Number.parseInt(kelas, 10) || 7;
  const startKls = targetKls <= 9 ? 7 : 10;

  let totalWeight = 0.0;

  for (let k = startKls; k <= targetKls; k++) {
    const kStr = String(k);
    if (k < targetKls) {
      totalWeight += getSemesterWeight(kStr, prog, 1);
      totalWeight += getSemesterWeight(kStr, prog, 2);
    } else {
      totalWeight += getSemesterWeight(kStr, prog, 1);
      if (semesterAktif === 2) {
        totalWeight += getSemesterWeight(kStr, prog, 2);
      }
    }
  }

  return totalWeight;
}

/**
 * Get cumulative target juz count for a santri or halaqoh class.
 * Returns 0 when targetModel or semesterAktif is not configured (synced with Mobile).
 */
export function getTargetJuzCount(
  targetModel: TargetHafalan | null | undefined,
  kelas: string,
  program: "R" | "T" | string
): number {
  return getTargetJuzCountDouble(targetModel, kelas, program);
}

/**
 * Get list of target juz numbers (e.g. [1, 28, 29, 30] for Kelas 8 Reguler Semester 2).
 * Returns [] when targetModel or semesterAktif is not configured (synced with Mobile).
 */
export function getTargetJuzList(
  targetModel: TargetHafalan | null | undefined,
  kelas: string,
  program: "R" | "T" | string
): number[] {
  if (!targetModel || targetModel.semesterAktif == null) {
    return [];
  }
  return getCumulativeTargetJuzList(
    kelas,
    normalizeProgramCode(program),
    targetModel.semesterAktif
  );
}

// ==================== SUB-RANGE & COMPLETION ENGINE ====================

/**
 * Returns exact surah/ayat target ranges for a specific period (UTS or UAS).
 * Direct 1:1 mirror of Mobile's `_getPeriodeRanges`.
 */
export function getPeriodeRanges(
  kelas: string,
  program: "R" | "T" | string,
  semester: 1 | 2,
  isUts: boolean
): TargetAyatRange[] {
  const cleanKelas = kelas.trim();
  const prog = normalizeProgramCode(program);

  if (prog === "R") {
    if (cleanKelas === "7" || cleanKelas === "10") {
      if (semester === 1) {
        if (isUts) {
          return Array.from({ length: 87 - 78 + 1 }, (_, i) =>
            getFullSurahRange(78 + i)
          );
        }
        return Array.from({ length: 114 - 88 + 1 }, (_, i) =>
          getFullSurahRange(88 + i)
        );
      } else if (semester === 2) {
        if (isUts) {
          return Array.from({ length: 71 - 67 + 1 }, (_, i) =>
            getFullSurahRange(67 + i)
          );
        }
        return Array.from({ length: 77 - 72 + 1 }, (_, i) =>
          getFullSurahRange(72 + i)
        );
      }
    } else if (cleanKelas === "8" || cleanKelas === "11") {
      if (semester === 1) {
        if (isUts) {
          const list: TargetAyatRange[] = [];
          for (let s = 58; s <= 60; s++) list.push(getFullSurahRange(s));
          list.push({ surahId: 61, ayatStart: 1, ayatEnd: 5 });
          return list;
        }
        const list: TargetAyatRange[] = [
          { surahId: 61, ayatStart: 6, ayatEnd: 14 },
        ];
        for (let s = 62; s <= 66; s++) list.push(getFullSurahRange(s));
        return list;
      } else if (semester === 2) {
        if (isUts) {
          return [{ surahId: 2, ayatStart: 1, ayatEnd: 76 }];
        }
        return [{ surahId: 2, ayatStart: 77, ayatEnd: 141 }];
      }
    } else if (cleanKelas === "9" || cleanKelas === "12") {
      if (semester === 1) {
        if (isUts) {
          return [{ surahId: 2, ayatStart: 142, ayatEnd: 202 }];
        }
        return [{ surahId: 2, ayatStart: 203, ayatEnd: 252 }];
      } else if (semester === 2) {
        const list: TargetAyatRange[] = [
          { surahId: 2, ayatStart: 1, ayatEnd: 141 },
          { surahId: 2, ayatStart: 142, ayatEnd: 252 },
        ];
        for (let s = 58; s <= 66; s++) list.push(getFullSurahRange(s));
        for (let s = 67; s <= 77; s++) list.push(getFullSurahRange(s));
        for (let s = 78; s <= 114; s++) list.push(getFullSurahRange(s));
        return list;
      }
    }
  } else if (prog === "T") {
    const semTarget = getSemesterTarget(cleanKelas, prog, semester);
    if (semTarget) {
      const list = (isUts ? semTarget.uts?.juzList : semTarget.uas?.juzList) ?? [];
      const res: TargetAyatRange[] = [];
      for (const j of list) {
        res.push(...getFullJuzRanges(j));
      }
      return res;
    }
  }

  return [];
}

/**
 * Computes completion fraction (0.0 .. 1.0) across explicit ayat target ranges
 * using exact `memorizedAyats` matching (mirrors Mobile's `getCompletedFractionForRanges`).
 */
export function getCompletedFractionForRanges(
  ranges: TargetAyatRange[],
  juzProgressMap: Map<number, JuzProgressResult>
): number {
  if (ranges.length === 0) return 0.0;

  let totalTarget = 0;
  let totalCompleted = 0;

  for (const r of ranges) {
    const count = r.ayatEnd - r.ayatStart + 1;
    totalTarget += count;

    const surah = getSurahById(r.surahId);
    if (!surah) continue;

    for (const seg of surah.juz_mappings) {
      const segRangeStart = Math.max(r.ayatStart, seg.ayat_start);
      const segRangeEnd = Math.min(r.ayatEnd, seg.ayat_end);
      if (segRangeStart > segRangeEnd) continue;

      const jp = juzProgressMap.get(seg.juz);
      if (!jp) continue;

      const sp = jp.surahProgressList.find((s) => s.surahId === r.surahId);
      if (!sp || sp.memorizedAyat <= 0) continue;

      totalCompleted += countMemorizedInSubRange(sp, segRangeStart, segRangeEnd);
    }
  }

  if (totalTarget === 0) return 0.0;
  return Math.min(1.0, Math.max(0.0, totalCompleted / totalTarget));
}

function getPeriodeCompletedWeight(
  kelas: string,
  program: "R" | "T",
  semester: 1 | 2,
  isUts: boolean,
  juzProgressMap: Map<number, JuzProgressResult>
): number {
  const semTarget = getSemesterTarget(kelas, program, semester);
  if (!semTarget) return 0.0;

  const periode = isUts ? semTarget.uts : semTarget.uas;
  if (!periode || periode.tipe !== "ziyadah") {
    return 0.0;
  }

  if (periode.fraksi) {
    const weight = parseFraksiWeight(periode.fraksi) ?? 1.0;
    const ranges = getPeriodeRanges(kelas, program, semester, isUts);
    const fraction = getCompletedFractionForRanges(ranges, juzProgressMap);
    return Math.min(weight, Math.max(0.0, weight * fraction));
  }

  // When fraksi is null, each juz in juzList is an independent 1.0 juz target.
  // Summing each juz's individual ratio (memorizedAyat / totalAyat) guarantees
  // equal 1.0 weight per juz regardless of verse count differences across juz.
  let completedJuzWeight = 0.0;
  for (const juzNum of periode.juzList) {
    const jp = juzProgressMap.get(juzNum);
    if (jp && jp.totalAyat > 0) {
      completedJuzWeight += Math.min(1.0, Math.max(0.0, jp.memorizedAyat / jp.totalAyat));
    }
  }
  return completedJuzWeight;
}

function getSemesterCompletedWeight(
  kelas: string,
  program: "R" | "T",
  semester: 1 | 2,
  juzProgressMap: Map<number, JuzProgressResult>
): number {
  return (
    getPeriodeCompletedWeight(kelas, program, semester, true, juzProgressMap) +
    getPeriodeCompletedWeight(kelas, program, semester, false, juzProgressMap)
  );
}

/**
 * Computes cumulative completed juz weight up to the active semester.
 * Exact 1:1 mirror of Mobile's `TargetHafalanHelper.getCompletedJuzCountDouble`.
 */
export function getCompletedJuzCountDouble(
  targetModel: TargetHafalan | null | undefined,
  kelas: string,
  program: "R" | "T" | string,
  juzProgressMap: Map<number, JuzProgressResult> | null | undefined
): number {
  if (!targetModel || targetModel.semesterAktif == null || !juzProgressMap) {
    return 0.0;
  }

  const prog = normalizeProgramCode(program);
  const semesterAktif = targetModel.semesterAktif;
  const targetKls = Number.parseInt(kelas, 10) || 7;
  const startKls = targetKls <= 9 ? 7 : 10;

  let completedWeight = 0.0;

  for (let k = startKls; k <= targetKls; k++) {
    const kStr = String(k);
    if (k < targetKls) {
      completedWeight += getSemesterCompletedWeight(kStr, prog, 1, juzProgressMap);
      completedWeight += getSemesterCompletedWeight(kStr, prog, 2, juzProgressMap);
    } else {
      completedWeight += getSemesterCompletedWeight(kStr, prog, 1, juzProgressMap);
      if (semesterAktif === 2) {
        completedWeight += getSemesterCompletedWeight(kStr, prog, 2, juzProgressMap);
      }
    }
  }

  return completedWeight;
}

/**
 * Computes deduplicated exact target verse statistics (`totalAyatInTarget` and
 * `memorizedAyatInTarget`) across all cumulative active Ziyadah target periods.
 */
export function countTargetAyatStats(
  targetModel: TargetHafalan | null | undefined,
  kelas: string,
  program: "R" | "T" | string,
  juzProgressMap: Map<number, JuzProgressResult>
): { totalAyatInTarget: number; memorizedAyatInTarget: number } {
  if (!targetModel || targetModel.semesterAktif == null) {
    return { totalAyatInTarget: 0, memorizedAyatInTarget: 0 };
  }

  const prog = normalizeProgramCode(program);
  const semesterAktif = targetModel.semesterAktif;
  const targetKls = Number.parseInt(kelas, 10) || 7;
  const startKls = targetKls <= 9 ? 7 : 10;

  const targetRanges: TargetAyatRange[] = [];

  const collectSemester = (kStr: string, semNum: 1 | 2) => {
    const semTarget = getSemesterTarget(kStr, prog, semNum);
    if (!semTarget) return;
    if (semTarget.uts?.tipe === "ziyadah") {
      targetRanges.push(...getPeriodeRanges(kStr, prog, semNum, true));
    }
    if (semTarget.uas?.tipe === "ziyadah") {
      targetRanges.push(...getPeriodeRanges(kStr, prog, semNum, false));
    }
  };

  for (let k = startKls; k <= targetKls; k++) {
    const kStr = String(k);
    if (k < targetKls) {
      collectSemester(kStr, 1);
      collectSemester(kStr, 2);
    } else {
      collectSemester(kStr, 1);
      if (semesterAktif === 2) {
        collectSemester(kStr, 2);
      }
    }
  }

  // Deduplicate exact (surahId, ayat) pairs across all active Ziyadah ranges
  const uniqueTargetAyat = new Set<string>();
  const uniqueMemorizedAyat = new Set<string>();

  for (const r of targetRanges) {
    const surah = getSurahById(r.surahId);
    if (!surah) continue;

    for (let a = r.ayatStart; a <= r.ayatEnd; a++) {
      uniqueTargetAyat.add(`${r.surahId}:${a}`);
    }

    for (const seg of surah.juz_mappings) {
      const segStart = Math.max(r.ayatStart, seg.ayat_start);
      const segEnd = Math.min(r.ayatEnd, seg.ayat_end);
      if (segStart > segEnd) continue;

      const jp = juzProgressMap.get(seg.juz);
      const sp = jp?.surahProgressList.find((s) => s.surahId === r.surahId);
      if (!sp || sp.memorizedAyat <= 0) continue;

      for (const ayat of sp.memorizedAyats) {
        if (ayat >= segStart && ayat <= segEnd) {
          uniqueMemorizedAyat.add(`${r.surahId}:${ayat}`);
        }
      }
    }
  }

  return {
    totalAyatInTarget: uniqueTargetAyat.size,
    memorizedAyatInTarget: uniqueMemorizedAyat.size,
  };
}

// ==================== HIGH-LEVEL PROGRESS SUMMARIES ====================

export interface TargetProgressSummary {
  juzTarget: number;
  juzCompleted: number;
  progressRatio: number; // 0..1
  percentage: number; // 0..100 float
  formattedJuzTarget: string;
  formattedJuzCompleted: string;
  formattedPercentage: string;
  isAchieved: boolean;
  memorizedAyatInTarget: number;
  totalAyatInTarget: number;
  targetJuzList: number[];
}

export interface ExtraProgressSummary {
  extraJuzList: number[];
  extraJuzTarget: number;
  extraJuzCompleted: number;
  extraProgress: number; // 0..100 float
  formattedExtraJuzTarget: string;
  formattedExtraJuzCompleted: string;
  formattedExtraProgress: string;
  memorizedAyatInExtra: number;
  totalAyatInExtra: number;
}

/**
 * Single canonical entry point computing admin target progress identically to Mobile.
 */
export function calculateProgressTowardTarget(
  targetModel: TargetHafalan | null | undefined,
  kelas: string,
  program: "R" | "T" | string,
  calc: SantriHafalanCalculation
): TargetProgressSummary {
  const prog = normalizeProgramCode(program);
  const juzTarget = getTargetJuzCountDouble(targetModel, kelas, prog);
  const juzCompleted = getCompletedJuzCountDouble(
    targetModel,
    kelas,
    prog,
    calc.juzProgressMap
  );
  const targetJuzList = getTargetJuzList(targetModel, kelas, prog);
  const { totalAyatInTarget, memorizedAyatInTarget } = countTargetAyatStats(
    targetModel,
    kelas,
    prog,
    calc.juzProgressMap
  );

  const progressRatio =
    juzTarget > 0 ? Math.min(1.0, Math.max(0.0, juzCompleted / juzTarget)) : 0.0;
  const percentage = progressRatio * 100;
  const isAchieved = juzTarget > 0 && juzCompleted >= juzTarget - 1e-6;

  return {
    juzTarget,
    juzCompleted,
    progressRatio,
    percentage,
    formattedJuzTarget: formatJuz(juzTarget),
    formattedJuzCompleted: formatJuz(juzCompleted),
    formattedPercentage: formatPercent(percentage),
    isAchieved,
    memorizedAyatInTarget,
    totalAyatInTarget,
    targetJuzList,
  };
}

/**
 * Computes extra hafalan progress mirroring Mobile's DetailSantriScreen & WaliSantriProgressCard:
 * combines teacher-assigned `santriExtraTarget` AND any juz with `memorizedAyat > 0`
 * outside `adminTargetJuzList`, with equal 1.0 weight per juz.
 */
export function calculateExtraProgressSummary(
  extraJuzFromFirestore: number[],
  adminTargetJuzList: number[],
  juzProgressMap: Map<number, JuzProgressResult>
): ExtraProgressSummary {
  const adminSet = new Set(adminTargetJuzList);
  const combinedSet = new Set<number>();

  for (const j of extraJuzFromFirestore) {
    if (!adminSet.has(j)) combinedSet.add(j);
  }
  for (const [juzNum, jp] of juzProgressMap.entries()) {
    if (jp.memorizedAyat > 0 && !adminSet.has(juzNum)) {
      combinedSet.add(juzNum);
    }
  }

  const extraJuzList = Array.from(combinedSet).sort((a, b) => a - b);
  const extraJuzTarget = extraJuzList.length;

  let extraJuzCompleted = 0.0;
  let totalAyatInExtra = 0;
  let memorizedAyatInExtra = 0;

  for (const jNum of extraJuzList) {
    const jp = juzProgressMap.get(jNum);
    if (jp && jp.totalAyat > 0) {
      extraJuzCompleted += Math.min(1.0, Math.max(0.0, jp.memorizedAyat / jp.totalAyat));
      totalAyatInExtra += jp.totalAyat;
      memorizedAyatInExtra += jp.memorizedAyat;
    } else {
      totalAyatInExtra += getTotalAyatInJuz(jNum);
    }
  }

  const extraRatio =
    extraJuzTarget > 0
      ? Math.min(1.0, Math.max(0.0, extraJuzCompleted / extraJuzTarget))
      : 0.0;
  const extraProgress = extraRatio * 100;

  return {
    extraJuzList,
    extraJuzTarget,
    extraJuzCompleted,
    extraProgress,
    formattedExtraJuzTarget: formatJuz(extraJuzTarget),
    formattedExtraJuzCompleted: formatJuz(extraJuzCompleted),
    formattedExtraProgress: formatPercent(extraProgress),
    memorizedAyatInExtra,
    totalAyatInExtra,
  };
}
