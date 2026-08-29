import type { SesiHalaqoh } from "@/features/kehadiran-guru/types/kehadiran-guru.types";

/**
 * Canonical santri attendance statuses.
 * Legacy Firestore values ('hadir_barcode', 'hadir_manual', 'terlambat')
 * are normalized to 'hadir' at read-time in hooks for backward compatibility.
 */
export type StatusAbsensiSantri = "hadir" | "sakit" | "izin" | "alfa";

/** Individual santri record embedded in Firestore absensi document */
export interface AbsensiSantriRecord {
  santriId: string;
  nis: string;
  nama: string;
  status: StatusAbsensiSantri;
}

/** Raw absensi document from Firestore /absensi/{id} */
export interface AbsensiDocData {
  id: string;
  halaqohId: string;
  guruId: string;
  tanggal: Date;
  sesi: SesiHalaqoh;
  records: AbsensiSantriRecord[];
  createdAt: Date;
  updatedAt: Date;
}

/** Item for dashboard absent list */
export interface SantriAbsentItem {
  santriId: string;
  santriNama: string;
  santriNis: string;
  kelas: string;
  program: "R" | "T";
  halaqohId: string;
  halaqohNama: string;
  guruNama: string;
  sesi: SesiHalaqoh;
  status: "sakit" | "izin" | "alfa";
}

/** Grouped absent santri with session grid for dashboard display */
export interface GroupedAbsentSantri {
  santriId: string;
  santriNama: string;
  santriNis: string;
  kelas: string;
  program: "R" | "T";
  halaqohId: string;
  halaqohNama: string;
  guruNama: string;
  /** Map of session -> status. Only contains sessions where santri was absent */
  sessions: Partial<Record<SesiHalaqoh, "sakit" | "izin" | "alfa">>;
  /** Total number of absent sessions */
  totalAbsentSessions: number;
}

/** Summary counter for absent santri on dashboard */
export interface AbsentSantriSummary {
  program: "R" | "T";
  totalAbsent: number;
  sakitCount: number;
  izinCount: number;
  alfaCount: number;
}

export type AttendanceTimeFilter =
  | "all"
  | "7days"
  | "30days"
  | "3months"
  | "6months"
  | "specificMonth";

/** Attendance statistics for santri over a filtered timeframe */
export interface SantriFilteredAttendanceStats {
  filterType: AttendanceTimeFilter;
  label: string;
  month?: number;
  year?: number;
  totalSessions: number;
  hadirCount: number;
  sakitCount: number;
  izinCount: number;
  alfaCount: number;
  attendancePercentage: number;
}
