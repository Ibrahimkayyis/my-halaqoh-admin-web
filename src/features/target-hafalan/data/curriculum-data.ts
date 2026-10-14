/**
 * Data kurikulum hafalan statis per kelas per program per semester.
 * Mirror dari CurriculumData.dart di mobile app.
 *
 * Reguler (R):  detail berupa nama surah lengkap + fraksi hafalan
 * Takhassus (T): detail berupa nomor juz
 *
 * PTS 1 = Penilaian Tengah Semester 1
 * PAS 1 = Penilaian Akhir Semester 1
 * PTS 2 = Penilaian Tengah Semester 2
 * PAS 2 = Penilaian Akhir Semester 2
 */

import type { KelasCurriculum } from "../types/target-hafalan.types";

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
    },
    semester2: {
      items: [
        { type: "PTS 2", detail: "Juz 29: Al-Mulk – Nuh (½ Juz)" },
        { type: "PAS 2", detail: "Juz 29: Al-Jin – Al-Mursalat (½ Juz)" },
      ],
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
    },
    semester2: {
      items: [
        { type: "PTS 2", detail: "Juz 1: Al-Baqarah 1-76 (½ Juz)" },
        { type: "PAS 2", detail: "Juz 1: Al-Baqarah 77-141 (½ Juz)" },
      ],
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
    },
    semester2: {
      items: [
        { type: "PTS 2", detail: "Muraja'ah 5 Juz (30, 29, 28, 1, 2)" },
        { type: "PAS 2", detail: "Muraja'ah 5 Juz (30, 29, 28, 1, 2)" },
      ],
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
    },
    semester2: {
      items: [
        { type: "PTS 2", detail: "Juz 29: Al-Mulk – Nuh (½ Juz)" },
        { type: "PAS 2", detail: "Juz 29: Al-Jin – Al-Mursalat (½ Juz)" },
      ],
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
    },
    semester2: {
      items: [
        { type: "PTS 2", detail: "Juz 1: Al-Baqarah 1-76 (½ Juz)" },
        { type: "PAS 2", detail: "Juz 1: Al-Baqarah 77-141 (½ Juz)" },
      ],
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
    },
    semester2: {
      items: [
        { type: "PTS 2", detail: "Muraja'ah 5 Juz (30, 29, 28, 1, 2)" },
        { type: "PAS 2", detail: "Muraja'ah 5 Juz (30, 29, 28, 1, 2)" },
      ],
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
    },
    semester2: {
      items: [
        { type: "PTS 2", detail: "Juz 29" },
        { type: "PAS 2", detail: "Juz 28" },
      ],
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
    },
    semester2: {
      items: [
        { type: "PTS 2", detail: "Juz 25" },
        { type: "PAS 2", detail: "Juz 24" },
      ],
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
    },
    semester2: {
      items: [
        { type: "PTS 2", detail: "UAT (Ujian Akhir Tahfidz)" },
        { type: "PAS 2", detail: "UAT (Ujian Akhir Tahfidz)" },
      ],
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
    },
    semester2: {
      items: [
        { type: "PTS 2", detail: "Juz 29" },
        { type: "PAS 2", detail: "Juz 28" },
      ],
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
    },
    semester2: {
      items: [
        { type: "PTS 2", detail: "Juz 23 + 22" },
        { type: "PAS 2", detail: "Juz 21 + 20" },
      ],
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
    },
    semester2: {
      items: [
        { type: "PTS 2", detail: "UAT (Ujian Akhir Tahfidz)" },
        { type: "PAS 2", detail: "UAT (Ujian Akhir Tahfidz)" },
      ],
    },
  },
];

// ==================== HELPER ====================

/** Ambil curriculum data berdasarkan program */
export function getCurriculumByProgram(program: "R" | "T"): KelasCurriculum[] {
  return program === "R" ? CURRICULUM_REGULER : CURRICULUM_TAKHASSUS;
}
