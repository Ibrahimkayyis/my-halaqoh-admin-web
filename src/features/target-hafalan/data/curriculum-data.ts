/**
 * Data kurikulum hafalan statis per kelas per program per semester.
 * Mirror dari CurriculumData.dart di mobile app.
 *
 * Reguler (R):  detail berupa nama surah lengkap
 * Takhassus (T): detail berupa nomor juz
 *
 * UTS = Ujian Tengah Semester
 * UAS = Ujian Akhir Semester
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
        { type: "UTS", detail: "I'dad Tahsin" },
        { type: "UAS", detail: "I'dad Tahsin" },
      ],
    },
    semester2: {
      items: [
        { type: "UTS", detail: "An-Naba' – Al-A'la" },
        { type: "UAS", detail: "Al-Ghasyiyah – An-Nas" },
      ],
    },
  },
  {
    kelas: "8",
    kelasLabel: "Kelas 8 SMP",
    program: "R",
    semester1: {
      items: [
        { type: "UTS", detail: "Al-Mulk – Al-Muddatstsir 47" },
        { type: "UAS", detail: "Al-Muddatstsir 48 – Al-Mursalat + Al-Mujadilah – Ash-Shaff 5" },
      ],
    },
    semester2: {
      items: [
        { type: "UTS", detail: "Ash-Shaff 6 – At-Tahrim + Al-Baqarah 1-37" },
        { type: "UAS", detail: "Al-Baqarah 38-141" },
      ],
    },
  },
  {
    kelas: "9",
    kelasLabel: "Kelas 9 SMP",
    program: "R",
    semester1: {
      items: [
        { type: "UTS", detail: "Al-Baqarah 142–202" },
        { type: "UAS", detail: "Al-Baqarah 203–252" },
      ],
    },
    semester2: {
      items: [
        { type: "UTS", detail: "Muraja'ah 5 Juz" },
        { type: "UAS", detail: "Muraja'ah 5 Juz" },
      ],
    },
  },
  {
    kelas: "10",
    kelasLabel: "Kelas 10 SMA",
    program: "R",
    semester1: {
      items: [
        { type: "UTS", detail: "I'dad Tahsin" },
        { type: "UAS", detail: "I'dad Tahsin" },
      ],
    },
    semester2: {
      items: [
        { type: "UTS", detail: "An-Naba' – Al-A'la" },
        { type: "UAS", detail: "Al-Ghasyiyah – An-Nas" },
      ],
    },
  },
  {
    kelas: "11",
    kelasLabel: "Kelas 11 SMA",
    program: "R",
    semester1: {
      items: [
        { type: "UTS", detail: "Al-Mulk – Al-Muddatstsir 47" },
        { type: "UAS", detail: "Al-Muddatstsir 48 – Al-Mursalat + Al-Mujadilah – Ash-Shaff 5" },
      ],
    },
    semester2: {
      items: [
        { type: "UTS", detail: "Ash-Shaff 6 – At-Tahrim + Al-Baqarah 1-37" },
        { type: "UAS", detail: "Al-Baqarah 38-141" },
      ],
    },
  },
  {
    kelas: "12",
    kelasLabel: "Kelas 12 SMA",
    program: "R",
    semester1: {
      items: [
        { type: "UTS", detail: "Al-Baqarah 142–202" },
        { type: "UAS", detail: "Al-Baqarah 203–252" },
      ],
    },
    semester2: {
      items: [
        { type: "UTS", detail: "Muraja'ah 5 Juz" },
        { type: "UAS", detail: "Muraja'ah 5 Juz" },
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
        { type: "UTS", detail: "Dauroh" },
        { type: "UAS", detail: "Juz 30" },
      ],
    },
    semester2: {
      items: [
        { type: "UTS", detail: "Juz 29" },
        { type: "UAS", detail: "Juz 28" },
      ],
    },
  },
  {
    kelas: "8",
    kelasLabel: "Kelas 8 SMP",
    program: "T",
    semester1: {
      items: [
        { type: "UTS", detail: "Juz 27" },
        { type: "UAS", detail: "Juz 26" },
      ],
    },
    semester2: {
      items: [
        { type: "UTS", detail: "Juz 25" },
        { type: "UAS", detail: "Juz 24" },
      ],
    },
  },
  {
    kelas: "9",
    kelasLabel: "Kelas 9 SMP",
    program: "T",
    semester1: {
      items: [
        { type: "UTS", detail: "Juz 23" },
        { type: "UAS", detail: "Juz 22 + 21" },
      ],
    },
    semester2: {
      items: [
        { type: "UTS", detail: "UAT (Ujian Akhir Tahfidz)" },
        { type: "UAS", detail: "UAT (Ujian Akhir Tahfidz)" },
      ],
    },
  },
  {
    kelas: "10",
    kelasLabel: "Kelas 10 SMA",
    program: "T",
    semester1: {
      items: [
        { type: "UTS", detail: "Dauroh" },
        { type: "UAS", detail: "Juz 30" },
      ],
    },
    semester2: {
      items: [
        { type: "UTS", detail: "Juz 29" },
        { type: "UAS", detail: "Juz 28" },
      ],
    },
  },
  {
    kelas: "11",
    kelasLabel: "Kelas 11 SMA",
    program: "T",
    semester1: {
      items: [
        { type: "UTS", detail: "Juz 27 + 26" },
        { type: "UAS", detail: "Juz 25 + 24" },
      ],
    },
    semester2: {
      items: [
        { type: "UTS", detail: "Juz 23 + 22" },
        { type: "UAS", detail: "Juz 21 + 20" },
      ],
    },
  },
  {
    kelas: "12",
    kelasLabel: "Kelas 12 SMA",
    program: "T",
    semester1: {
      items: [
        { type: "UTS", detail: "Juz 19 + 18" },
        { type: "UAS", detail: "Juz 17 + 16" },
      ],
    },
    semester2: {
      items: [
        { type: "UTS", detail: "UAT (Ujian Akhir Tahfidz)" },
        { type: "UAS", detail: "UAT (Ujian Akhir Tahfidz)" },
      ],
    },
  },
];

// ==================== HELPER ====================

/** Ambil curriculum data berdasarkan program */
export function getCurriculumByProgram(program: "R" | "T"): KelasCurriculum[] {
  return program === "R" ? CURRICULUM_REGULER : CURRICULUM_TAKHASSUS;
}
