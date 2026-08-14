import type { TargetHafalan } from "../types/target-hafalan.types";

interface SemesterJuzMap {
  semester1: number[];
  semester2: number[];
}

/**
 * Mapping juz per semester per kelas per program.
 * Mirror dari curriculum_data.dart di mobile app.
 */
const JUZ_CURRICULUM: Record<"R" | "T", Record<string, SemesterJuzMap>> = {
  R: {
    // SMP (7-9)
    "7": {
      semester1: [], // I'dad Tahsin
      semester2: [30], // An-Naba – An-Nas (Juz 30)
    },
    "8": {
      semester1: [29, 28], // Al-Mulk – Ash-Shaff 5 (Juz 29, 28)
      semester2: [28, 1], // Ash-Shaff 6 – Al-Baqarah 141 (Juz 28, 1)
    },
    "9": {
      semester1: [2], // Al-Baqarah 142–252 (Juz 2)
      semester2: [1, 2, 28, 29, 30], // Muraja'ah 5 Juz
    },
    // SMA (10-12)
    "10": {
      semester1: [], // I'dad Tahsin
      semester2: [30], // An-Naba – An-Nas
    },
    "11": {
      semester1: [29, 28],
      semester2: [28, 1],
    },
    "12": {
      semester1: [2],
      semester2: [1, 2, 28, 29, 30],
    },
  },
  T: {
    // SMP (7-9)
    "7": {
      semester1: [30], // Dauroh + Juz 30
      semester2: [29, 28], // Juz 29, 28
    },
    "8": {
      semester1: [27, 26], // Juz 27, 26
      semester2: [25, 24], // Juz 25, 24
    },
    "9": {
      semester1: [23, 22, 21], // Juz 23, 22, 21
      semester2: [], // UAT (no new juz, tests completed juz 30..21)
    },
    // SMA (10-12)
    "10": {
      semester1: [30], // Dauroh + Juz 30
      semester2: [29, 28], // Juz 29, 28
    },
    "11": {
      semester1: [27, 26, 25, 24], // Juz 27, 26, 25, 24
      semester2: [23, 22, 21, 20], // Juz 23, 22, 21, 20
    },
    "12": {
      semester1: [19, 18, 17, 16], // Juz 19, 18, 17, 16
      semester2: [], // UAT (no new juz, tests completed juz 30..16)
    },
  },
};

/**
 * Retrieves the accumulated juz targets from the starting class of the educational
 * level (SMP -> class 7, SMA -> class 10) up to the current [targetKelas] and [semesterAktif].
 */
export function getCumulativeTargetJuzList(
  targetKelas: string,
  program: "R" | "T",
  semesterAktif: 1 | 2 = 2
): number[] {
  const targetKls = parseInt(targetKelas, 10) || 7;
  const startKls = targetKls <= 9 ? 7 : 10;
  const cumulativeSet = new Set<number>();

  for (let k = startKls; k <= targetKls; k++) {
    const kStr = String(k);
    const kurikulum = JUZ_CURRICULUM[program]?.[kStr];
    if (!kurikulum) continue;

    if (k < targetKls) {
      // Prior classes include both semester 1 & 2
      kurikulum.semester1.forEach((j) => cumulativeSet.add(j));
      kurikulum.semester2.forEach((j) => cumulativeSet.add(j));
    } else {
      // Current target class up to semesterAktif
      kurikulum.semester1.forEach((j) => cumulativeSet.add(j));
      if (semesterAktif === 2) {
        kurikulum.semester2.forEach((j) => cumulativeSet.add(j));
      }
    }
  }

  return Array.from(cumulativeSet).sort((a, b) => a - b);
}

/**
 * Get cumulative target juz count for a santri or halaqoh class.
 * Falls back to active semester or semester 2 if not configured.
 */
export function getTargetJuzCount(
  targetModel: TargetHafalan | null | undefined,
  kelas: string,
  program: "R" | "T"
): number {
  const semesterAktif = targetModel?.semesterAktif ?? 2;
  const list = getCumulativeTargetJuzList(kelas, program, semesterAktif);
  return list.length;
}

/**
 * Get list of target juz numbers (e.g. [1, 28, 29, 30] for Kelas 8 Reguler Semester 2).
 */
export function getTargetJuzList(
  targetModel: TargetHafalan | null | undefined,
  kelas: string,
  program: "R" | "T"
): number[] {
  const semesterAktif = targetModel?.semesterAktif ?? 2;
  return getCumulativeTargetJuzList(kelas, program, semesterAktif);
}
