// ==================== DOMAIN MODEL ====================

/**
 * Mirror dari TargetHafalanModel di mobile (Dart).
 * Firestore collection: /targetHafalan/{kelas}_{program}
 * Admin hanya mengkonfigurasi tahunAjaran & semesterAktif.
 * Data kurikulum (juz/surah target) tersimpan statis di curriculum-data.ts.
 */
export interface TargetHafalan {
  id: string;              // "{kelas}_{program}" — e.g., "7_R" atau "12_T"
  kelas: string;           // "7" – "12"
  program: "R" | "T";     // "R" = Reguler, "T" = Takhassus
  tahunAjaran: string | null;   // e.g., "2026 / 2027" — null jika belum ditetapkan
  semesterAktif: 1 | 2 | null; // null = "Belum ditetapkan"
}

// ==================== CURRICULUM (STATIC DATA) ====================

export type CurriculumPeriodType =
  | "PTS 1"
  | "PAS 1"
  | "PTS 2"
  | "PAS 2"
  | "PTS"
  | "PAS"
  | "UTS"
  | "UAS";

/** Tipe konten hafalan untuk satu periode ujian (mirror dari curriculum_data.dart) */
export type TipeHafalan =
  | "ziyadah"
  | "murajaah"
  | "idadTahsin"
  | "dauroh"
  | "uat";

/** Tipe periode ujian dalam satu semester */
export type PeriodeUjian = "uts" | "uas";

/** Rentang ayat target untuk sub-juz / sub-surah */
export interface TargetAyatRange {
  surahId: number;
  ayatStart: number;
  ayatEnd: number;
}

/** Target terstruktur untuk satu periode ujian (UTS/PTS atau UAS/PAS) */
export interface PeriodeTarget {
  tipe: TipeHafalan;
  juzList: number[];
  deskripsi?: string;
  fraksi?: string;
}

/** Target terstruktur untuk satu semester */
export interface SemesterTarget {
  uts: PeriodeTarget;
  uas: PeriodeTarget;
}

/** Satu baris data kurikulum hafalan (PTS = Tengah Semester, PAS = Akhir Semester) */
export interface CurriculumEntry {
  type: CurriculumPeriodType;
  detail: string; // Format berbeda per program: Reguler = nama surah, Takhassus = juz
}

/** Data kurikulum satu semester */
export interface SemesterCurriculum {
  items: CurriculumEntry[];
  uts?: PeriodeTarget;
  uas?: PeriodeTarget;
}

/** Data kurikulum lengkap satu kelas dalam satu program */
export interface KelasCurriculum {
  kelas: string;        // "7" – "12"
  kelasLabel: string;   // "Kelas 7 SMP" / "Kelas 12 SMA"
  program: "R" | "T";
  semester1: SemesterCurriculum;
  semester2: SemesterCurriculum;
}

// ==================== FORM ====================

export interface EditTargetFormValues {
  tahunAjaran: string | null;
  semesterAktif: 1 | 2 | null;
}

// ==================== HELPERS ====================

/** Daftar tahun ajaran yang tersedia sebagai pilihan di dropdown */
export const TAHUN_AJARAN_OPTIONS: string[] = [
  "2023 / 2024",
  "2024 / 2025",
  "2025 / 2026",
  "2026 / 2027",
  "2027 / 2028",
  "2028 / 2029",
  "2029 / 2030",
];

/** Mengembalikan suffix SMP/SMA berdasarkan kelas */
export function getKelasLabel(kelas: string): string {
  const num = parseInt(kelas, 10);
  const suffix = num <= 9 ? "SMP" : "SMA";
  return `Kelas ${kelas} ${suffix}`;
}
