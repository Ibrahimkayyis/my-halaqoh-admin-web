// ==================== SESI HALAQOH ====================

export type SesiHalaqoh = "shubuh" | "dhuha" | "siang" | "ashar" | "maghrib";

export const SESI_REGULER: SesiHalaqoh[] = ["shubuh", "maghrib"];
export const SESI_TAKHASSUS: SesiHalaqoh[] = ["shubuh", "dhuha", "siang", "ashar", "maghrib"];

// ==================== ABSENSI RAW DATA ====================

export interface AbsensiRecord {
  id: string;
  halaqohId: string;
  guruId: string;
  tanggal: Date;
  sesi: SesiHalaqoh;
  createdAt: Date;
}

// ==================== PER-GURU SESSION STATUS ====================

export interface GuruSessionAttendance {
  guruId: string;
  guruNama: string;
  guruNip: string;
  program: "R" | "T";
  halaqohId: string | null;
  halaqohNama: string | null;
  kelas: string | null;
  isActive: boolean; // Has submitted attendance for the selected session
  status: "active" | "inactive" | "no-halaqoh";
  absensiTime: Date | null;
}

// ==================== PROGRAM SUMMARY ====================

export interface ProgramAttendanceSummary {
  program: "R" | "T";
  totalGuru: number;
  totalWithHalaqoh: number;
  activeCount: number;
  inactiveCount: number;
  noHalaqohCount: number;
  activePercentage: number;
}

export interface KehadiranSessionData {
  regulerSummary: ProgramAttendanceSummary;
  takhassusSummary: ProgramAttendanceSummary;
  regulerGuruList: GuruSessionAttendance[];
  takhassusGuruList: GuruSessionAttendance[];
}

// ==================== FILTERS ====================

export type StatusFilter = "all" | "active" | "inactive" | "no-halaqoh";
export type ProgramFilter = "all" | "R" | "T";
