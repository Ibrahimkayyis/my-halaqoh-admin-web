/**
 * Data kurikulum hafalan statis per kelas per program per semester.
 * Mirror dari CurriculumData.dart di mobile app.
 *
 * Reguler (R):  detail berupa nama surah lengkap (format: "Al-Mulk - Al-Mudattsir 47")
 * Takhassus (T): detail berupa nomor juz (format: "Juz 30")
 *
 * UTS = Ujian Tengah Semester (hafalan baru)
 * UAS = Ujian Akhir Semester (murajaah/pengulangan)
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
        { type: "UTS", detail: "Tidad Tahsin" },
        { type: "UAS", detail: "Tidad Tahsin" },
      ],
    },
    semester2: {
      items: [
        { type: "UTS", detail: "An-Naba' - Al-A'la" },
        { type: "UAS", detail: "Al-Ghasyiyah - An-Nas" },
      ],
    },
  },
  {
    kelas: "8",
    kelasLabel: "Kelas 8 SMP",
    program: "R",
    semester1: {
      items: [
        { type: "UTS", detail: "Al-Mulk - Al-Mudattsir 47" },
        { type: "UAS", detail: "Al-Mursalat + Al-Muqaddami - An-Shaft 5" },
      ],
    },
    semester2: {
      items: [
        { type: "UTS", detail: "Ash-Shaft 5 - Al-Tahrim + Al-Taghabun 38-46" },
        { type: "UAS", detail: "Al-Haqam 38-40" },
      ],
    },
  },
  {
    kelas: "9",
    kelasLabel: "Kelas 9 SMP",
    program: "R",
    semester1: {
      items: [
        { type: "UTS", detail: "Al-Qasam 163-202" },
        { type: "UAS", detail: "Munjizat 5 Juz" },
      ],
    },
    semester2: {
      items: [
        { type: "UTS", detail: "Al-Qasam 203-252" },
        { type: "UAS", detail: "Munjizat 5 Juz" },
      ],
    },
  },
  {
    kelas: "10",
    kelasLabel: "Kelas 10 SMA",
    program: "R",
    semester1: {
      items: [
        { type: "UTS", detail: "Tidad Tahsin" },
        { type: "UAS", detail: "Tidad Tahsin" },
      ],
    },
    semester2: {
      items: [
        { type: "UTS", detail: "An-Naba' - Al-A'la" },
        { type: "UAS", detail: "Al-Ghasyiyah - An-Nas" },
      ],
    },
  },
  {
    kelas: "11",
    kelasLabel: "Kelas 11 SMA",
    program: "R",
    semester1: {
      items: [
        { type: "UTS", detail: "Al-Mulk - Al-Mudattsir 47" },
        {
          type: "UAS",
          detail: "Al-Mudattsir 48 - Al-Mursalat + Al-Muqaddami - An-Shaft 5",
        },
      ],
    },
    semester2: {
      items: [
        { type: "UTS", detail: "Ash-Shaft 5 - Al-Tahrim + Al-Taghabun 38-46" },
        { type: "UAS", detail: "Al-Haqam 38-40" },
      ],
    },
  },
  {
    kelas: "12",
    kelasLabel: "Kelas 12 SMA",
    program: "R",
    semester1: {
      items: [
        { type: "UTS", detail: "Al-Qasam 163-202" },
        { type: "UAS", detail: "Munjizat 5 Juz" },
      ],
    },
    semester2: {
      items: [
        { type: "UTS", detail: "Al-Qasam 203-252" },
        { type: "UAS", detail: "Munjizat 5 Juz" },
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
        { type: "UTS", detail: "Juz 30" },
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
        { type: "UAS", detail: "Juz 27" },
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
        { type: "UTS", detail: "Juz 25" },
        { type: "UAS", detail: "Juz 25 + 21" },
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
        { type: "UTS", detail: "Daurah" },
        { type: "UAS", detail: "Juz 10" },
      ],
    },
    semester2: {
      items: [
        { type: "UTS", detail: "Juz 28" },
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
        { type: "UTS", detail: "Juz 27 + 25" },
        { type: "UAS", detail: "Juz 25 + 22" },
      ],
    },
    semester2: {
      items: [
        { type: "UTS", detail: "Juz 21 + 20" },
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
        { type: "UTS", detail: "Juz 10 + 18" },
        { type: "UAS", detail: "Juz 17 + 15" },
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
