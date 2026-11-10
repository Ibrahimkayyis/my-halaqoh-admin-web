/**
 * Data kurikulum hafalan statis per kelas per program per semester.
 * Mirror 1:1 dari curriculum_data.dart di mobile app.
 *
 * Reguler (R):  detail berupa nama surah lengkap + fraksi hafalan (½ Juz)
 * Takhassus (T): detail berupa nomor juz utuh
 *
 * PTS 1 = Penilaian Tengah Semester 1 (UTS)
 * PAS 1 = Penilaian Akhir Semester 1 (UAS)
 * PTS 2 = Penilaian Tengah Semester 2 (UTS)
 * PAS 2 = Penilaian Akhir Semester 2 (UAS)
 */

import type {
  KelasCurriculum,
  PeriodeTarget,
  PeriodeUjian,
  SemesterCurriculum,
} from "../types/target-hafalan.types";

// ==================== REGULER (R) — Nama Surah Lengkap ====================

export const CURRICULUM_REGULER: KelasCurriculum[] = [
  {
    kelas: "7",
    kelasLabel: "Kelas 7 SMP",
    program: "R",
    semester1: {
      items: [
        { type: "PTS 1", detail: "Juz 30: An-Naba' – Al-A'la (½ Juz)" },
        { type: "PAS 1", detail: "Juz 30: Al-Ghasyiyah – An-Nas (½ Juz)" },
      ],
      uts: {
        tipe: "ziyadah",
        juzList: [30],
        deskripsi: "An-Naba' – Al-A'la",
        fraksi: "½ Juz",
      },
      uas: {
        tipe: "ziyadah",
        juzList: [30],
        deskripsi: "Al-Ghasyiyah – An-Nas",
        fraksi: "½ Juz",
      },
    },
    semester2: {
      items: [
        { type: "PTS 2", detail: "Juz 29: Al-Mulk – Nuh (½ Juz)" },
        { type: "PAS 2", detail: "Juz 29: Al-Jin – Al-Mursalat (½ Juz)" },
      ],
      uts: {
        tipe: "ziyadah",
        juzList: [29],
        deskripsi: "Al-Mulk – Nuh",
        fraksi: "½ Juz",
      },
      uas: {
        tipe: "ziyadah",
        juzList: [29],
        deskripsi: "Al-Jin – Al-Mursalat",
        fraksi: "½ Juz",
      },
    },
  },
  {
    kelas: "8",
    kelasLabel: "Kelas 8 SMP",
    program: "R",
    semester1: {
      items: [
        { type: "PTS 1", detail: "Juz 28: Al-Mujadilah – Ash-Shaff 5 (½ Juz)" },
        { type: "PAS 1", detail: "Juz 28: Ash-Shaff 6 – At-Tahrim (½ Juz)" },
      ],
      uts: {
        tipe: "ziyadah",
        juzList: [28],
        deskripsi: "Al-Mujadilah – Ash-Shaff 5",
        fraksi: "½ Juz",
      },
      uas: {
        tipe: "ziyadah",
        juzList: [28],
        deskripsi: "Ash-Shaff 6 – At-Tahrim",
        fraksi: "½ Juz",
      },
    },
    semester2: {
      items: [
        { type: "PTS 2", detail: "Juz 1: Al-Baqarah 1-76 (½ Juz)" },
        { type: "PAS 2", detail: "Juz 1: Al-Baqarah 77-141 (½ Juz)" },
      ],
      uts: {
        tipe: "ziyadah",
        juzList: [1],
        deskripsi: "Al-Baqarah 1-76",
        fraksi: "½ Juz",
      },
      uas: {
        tipe: "ziyadah",
        juzList: [1],
        deskripsi: "Al-Baqarah 77-141",
        fraksi: "½ Juz",
      },
    },
  },
  {
    kelas: "9",
    kelasLabel: "Kelas 9 SMP",
    program: "R",
    semester1: {
      items: [
        { type: "PTS 1", detail: "Juz 2: Al-Baqarah 142–202 (½ Juz)" },
        { type: "PAS 1", detail: "Juz 2: Al-Baqarah 203–252 (½ Juz)" },
      ],
      uts: {
        tipe: "ziyadah",
        juzList: [2],
        deskripsi: "Al-Baqarah 142–202",
        fraksi: "½ Juz",
      },
      uas: {
        tipe: "ziyadah",
        juzList: [2],
        deskripsi: "Al-Baqarah 203–252",
        fraksi: "½ Juz",
      },
    },
    semester2: {
      items: [
        { type: "PTS 2", detail: "Muraja'ah 5 Juz (30, 29, 28, 1, 2)" },
        { type: "PAS 2", detail: "Muraja'ah 5 Juz (30, 29, 28, 1, 2)" },
      ],
      uts: {
        tipe: "murajaah",
        juzList: [1, 2, 28, 29, 30],
        deskripsi: "Muraja'ah 5 Juz",
      },
      uas: {
        tipe: "murajaah",
        juzList: [1, 2, 28, 29, 30],
        deskripsi: "Muraja'ah 5 Juz",
      },
    },
  },
  {
    kelas: "10",
    kelasLabel: "Kelas 10 SMA",
    program: "R",
    semester1: {
      items: [
        { type: "PTS 1", detail: "Juz 30: An-Naba' – Al-A'la (½ Juz)" },
        { type: "PAS 1", detail: "Juz 30: Al-Ghasyiyah – An-Nas (½ Juz)" },
      ],
      uts: {
        tipe: "ziyadah",
        juzList: [30],
        deskripsi: "An-Naba' – Al-A'la",
        fraksi: "½ Juz",
      },
      uas: {
        tipe: "ziyadah",
        juzList: [30],
        deskripsi: "Al-Ghasyiyah – An-Nas",
        fraksi: "½ Juz",
      },
    },
    semester2: {
      items: [
        { type: "PTS 2", detail: "Juz 29: Al-Mulk – Nuh (½ Juz)" },
        { type: "PAS 2", detail: "Juz 29: Al-Jin – Al-Mursalat (½ Juz)" },
      ],
      uts: {
        tipe: "ziyadah",
        juzList: [29],
        deskripsi: "Al-Mulk – Nuh",
        fraksi: "½ Juz",
      },
      uas: {
        tipe: "ziyadah",
        juzList: [29],
        deskripsi: "Al-Jin – Al-Mursalat",
        fraksi: "½ Juz",
      },
    },
  },
  {
    kelas: "11",
    kelasLabel: "Kelas 11 SMA",
    program: "R",
    semester1: {
      items: [
        { type: "PTS 1", detail: "Juz 28: Al-Mujadilah – Ash-Shaff 5 (½ Juz)" },
        { type: "PAS 1", detail: "Juz 28: Ash-Shaff 6 – At-Tahrim (½ Juz)" },
      ],
      uts: {
        tipe: "ziyadah",
        juzList: [28],
        deskripsi: "Al-Mujadilah – Ash-Shaff 5",
        fraksi: "½ Juz",
      },
      uas: {
        tipe: "ziyadah",
        juzList: [28],
        deskripsi: "Ash-Shaff 6 – At-Tahrim",
        fraksi: "½ Juz",
      },
    },
    semester2: {
      items: [
        { type: "PTS 2", detail: "Juz 1: Al-Baqarah 1-76 (½ Juz)" },
        { type: "PAS 2", detail: "Juz 1: Al-Baqarah 77-141 (½ Juz)" },
      ],
      uts: {
        tipe: "ziyadah",
        juzList: [1],
        deskripsi: "Al-Baqarah 1-76",
        fraksi: "½ Juz",
      },
      uas: {
        tipe: "ziyadah",
        juzList: [1],
        deskripsi: "Al-Baqarah 77-141",
        fraksi: "½ Juz",
      },
    },
  },
  {
    kelas: "12",
    kelasLabel: "Kelas 12 SMA",
    program: "R",
    semester1: {
      items: [
        { type: "PTS 1", detail: "Juz 2: Al-Baqarah 142–202 (½ Juz)" },
        { type: "PAS 1", detail: "Juz 2: Al-Baqarah 203–252 (½ Juz)" },
      ],
      uts: {
        tipe: "ziyadah",
        juzList: [2],
        deskripsi: "Al-Baqarah 142–202",
        fraksi: "½ Juz",
      },
      uas: {
        tipe: "ziyadah",
        juzList: [2],
        deskripsi: "Al-Baqarah 203–252",
        fraksi: "½ Juz",
      },
    },
    semester2: {
      items: [
        { type: "PTS 2", detail: "Muraja'ah 5 Juz (30, 29, 28, 1, 2)" },
        { type: "PAS 2", detail: "Muraja'ah 5 Juz (30, 29, 28, 1, 2)" },
      ],
      uts: {
        tipe: "murajaah",
        juzList: [1, 2, 28, 29, 30],
        deskripsi: "Muraja'ah 5 Juz",
      },
      uas: {
        tipe: "murajaah",
        juzList: [1, 2, 28, 29, 30],
        deskripsi: "Muraja'ah 5 Juz",
      },
    },
  },
];

// ==================== TAKHASSUS (T) — Nomor Juz ====================

export const CURRICULUM_TAKHASSUS: KelasCurriculum[] = [
  {
    kelas: "7",
    kelasLabel: "Kelas 7 SMP",
    program: "T",
    semester1: {
      items: [
        { type: "PTS 1", detail: "Dauroh" },
        { type: "PAS 1", detail: "Juz 30" },
      ],
      uts: {
        tipe: "dauroh",
        juzList: [],
        deskripsi: "Dauroh",
      },
      uas: {
        tipe: "ziyadah",
        juzList: [30],
        deskripsi: "Juz 30",
      },
    },
    semester2: {
      items: [
        { type: "PTS 2", detail: "Juz 29" },
        { type: "PAS 2", detail: "Juz 28" },
      ],
      uts: {
        tipe: "ziyadah",
        juzList: [29],
        deskripsi: "Juz 29",
      },
      uas: {
        tipe: "ziyadah",
        juzList: [28],
        deskripsi: "Juz 28",
      },
    },
  },
  {
    kelas: "8",
    kelasLabel: "Kelas 8 SMP",
    program: "T",
    semester1: {
      items: [
        { type: "PTS 1", detail: "Juz 27" },
        { type: "PAS 1", detail: "Juz 26" },
      ],
      uts: {
        tipe: "ziyadah",
        juzList: [27],
        deskripsi: "Juz 27",
      },
      uas: {
        tipe: "ziyadah",
        juzList: [26],
        deskripsi: "Juz 26",
      },
    },
    semester2: {
      items: [
        { type: "PTS 2", detail: "Juz 25" },
        { type: "PAS 2", detail: "Juz 24" },
      ],
      uts: {
        tipe: "ziyadah",
        juzList: [25],
        deskripsi: "Juz 25",
      },
      uas: {
        tipe: "ziyadah",
        juzList: [24],
        deskripsi: "Juz 24",
      },
    },
  },
  {
    kelas: "9",
    kelasLabel: "Kelas 9 SMP",
    program: "T",
    semester1: {
      items: [
        { type: "PTS 1", detail: "Juz 23" },
        { type: "PAS 1", detail: "Juz 22 + 21" },
      ],
      uts: {
        tipe: "ziyadah",
        juzList: [23],
        deskripsi: "Juz 23",
      },
      uas: {
        tipe: "ziyadah",
        juzList: [22, 21],
        deskripsi: "Juz 22 + 21",
      },
    },
    semester2: {
      items: [
        { type: "PTS 2", detail: "UAT (Ujian Akhir Tahfidz)" },
        { type: "PAS 2", detail: "UAT (Ujian Akhir Tahfidz)" },
      ],
      uts: {
        tipe: "uat",
        juzList: [],
        deskripsi: "UAT (Ujian Akhir Tahfidz)",
      },
      uas: {
        tipe: "uat",
        juzList: [],
        deskripsi: "UAT (Ujian Akhir Tahfidz)",
      },
    },
  },
  {
    kelas: "10",
    kelasLabel: "Kelas 10 SMA",
    program: "T",
    semester1: {
      items: [
        { type: "PTS 1", detail: "Dauroh" },
        { type: "PAS 1", detail: "Juz 30" },
      ],
      uts: {
        tipe: "dauroh",
        juzList: [],
        deskripsi: "Dauroh",
      },
      uas: {
        tipe: "ziyadah",
        juzList: [30],
        deskripsi: "Juz 30",
      },
    },
    semester2: {
      items: [
        { type: "PTS 2", detail: "Juz 29" },
        { type: "PAS 2", detail: "Juz 28" },
      ],
      uts: {
        tipe: "ziyadah",
        juzList: [29],
        deskripsi: "Juz 29",
      },
      uas: {
        tipe: "ziyadah",
        juzList: [28],
        deskripsi: "Juz 28",
      },
    },
  },
  {
    kelas: "11",
    kelasLabel: "Kelas 11 SMA",
    program: "T",
    semester1: {
      items: [
        { type: "PTS 1", detail: "Juz 27 + 26" },
        { type: "PAS 1", detail: "Juz 25 + 24" },
      ],
      uts: {
        tipe: "ziyadah",
        juzList: [27, 26],
        deskripsi: "Juz 27 + 26",
      },
      uas: {
        tipe: "ziyadah",
        juzList: [25, 24],
        deskripsi: "Juz 25 + 24",
      },
    },
    semester2: {
      items: [
        { type: "PTS 2", detail: "Juz 23 + 22" },
        { type: "PAS 2", detail: "Juz 21 + 20" },
      ],
      uts: {
        tipe: "ziyadah",
        juzList: [23, 22],
        deskripsi: "Juz 23 + 22",
      },
      uas: {
        tipe: "ziyadah",
        juzList: [21, 20],
        deskripsi: "Juz 21 + 20",
      },
    },
  },
  {
    kelas: "12",
    kelasLabel: "Kelas 12 SMA",
    program: "T",
    semester1: {
      items: [
        { type: "PTS 1", detail: "Juz 19 + 18" },
        { type: "PAS 1", detail: "Juz 17 + 16" },
      ],
      uts: {
        tipe: "ziyadah",
        juzList: [19, 18],
        deskripsi: "Juz 19 + 18",
      },
      uas: {
        tipe: "ziyadah",
        juzList: [17, 16],
        deskripsi: "Juz 17 + 16",
      },
    },
    semester2: {
      items: [
        { type: "PTS 2", detail: "UAT (Ujian Akhir Tahfidz)" },
        { type: "PAS 2", detail: "UAT (Ujian Akhir Tahfidz)" },
      ],
      uts: {
        tipe: "uat",
        juzList: [],
        deskripsi: "UAT (Ujian Akhir Tahfidz)",
      },
      uas: {
        tipe: "uat",
        juzList: [],
        deskripsi: "UAT (Ujian Akhir Tahfidz)",
      },
    },
  },
];

// ==================== HELPER ====================

/** Normalizes program string ("R" | "T" | "Reguler" | "Takhassus") -> "R" | "T" */
export function normalizeProgramCode(program: string | undefined | null): "R" | "T" {
  const clean = String(program ?? "").trim().toLowerCase();
  if (clean === "t" || clean === "takhassus") return "T";
  return "R";
}

/** Ambil curriculum data berdasarkan program */
export function getCurriculumByProgram(program: "R" | "T"): KelasCurriculum[] {
  return program === "R" ? CURRICULUM_REGULER : CURRICULUM_TAKHASSUS;
}

/** Ambil KelasCurriculum berdasarkan kelas ("7".."12") dan program */
export function getKurikulum(
  kelas: string,
  program: "R" | "T" | string
): KelasCurriculum | undefined {
  const code = normalizeProgramCode(program);
  const cleanKelas = kelas.trim();
  return getCurriculumByProgram(code).find((c) => c.kelas === cleanKelas);
}

/** Ambil SemesterCurriculum berdasarkan kelas, program, dan semester (1/2) */
export function getSemesterTarget(
  kelas: string,
  program: "R" | "T" | string,
  semester: 1 | 2
): SemesterCurriculum | undefined {
  const kur = getKurikulum(kelas, program);
  if (!kur) return undefined;
  return semester === 1 ? kur.semester1 : kur.semester2;
}

/** Ambil PeriodeTarget berdasarkan kelas, program, semester, dan periode */
export function getPeriodeTarget(
  kelas: string,
  program: "R" | "T" | string,
  semester: 1 | 2,
  periode: PeriodeUjian
): PeriodeTarget | undefined {
  const sem = getSemesterTarget(kelas, program, semester);
  if (!sem) return undefined;
  return periode === "uts" ? sem.uts : sem.uas;
}
