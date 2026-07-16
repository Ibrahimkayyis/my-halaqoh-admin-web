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

/** Satu baris data kurikulum hafalan (UTZ = Ziyadah, MRJ = Murajaah) */
export interface CurriculumEntry {
  type: "UTS" | "UAS";
  detail: string; // Format berbeda per program: Reguler = nama surah, Takhassus = juz
}

/** Data kurikulum satu semester */
export interface SemesterCurriculum {
  items: CurriculumEntry[];
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
