import type { SesiHalaqoh } from "@/features/kehadiran-guru/types/kehadiran-guru.types";

export interface ReportAbsentItem {
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

/** Grouped absent santri for PDF report — one row per student per day */
export interface GroupedReportAbsentItem {
  santriId: string;
  santriNama: string;
  santriNis: string;
  kelas: string;
  program: "R" | "T";
  halaqohId: string;
  halaqohNama: string;
  guruNama: string;
  /** Map of session -> status. Only sessions where santri was absent */
  sessions: Partial<Record<SesiHalaqoh, "sakit" | "izin" | "alfa">>;
}

export interface DailyAbsenceData {
  date: Date;
  dateStr: string; // YYYY-MM-DD
  dateFormatted: string; // e.g. "Senin, 11 Agustus 2026"
  absentList: GroupedReportAbsentItem[];
  summary: {
    total: number;
    sakit: number;
    izin: number;
    alfa: number;
  };
}

export interface OverallReportSummary {
  startDateStr: string;
  endDateStr: string;
  programFilter: "all" | "R" | "T";
  totalDays: number;
  totalAbsences: number;
  sakitTotal: number;
  izinTotal: number;
  alfaTotal: number;
  avgPerDay: number;
}

export interface AbsenceReportData {
  days: DailyAbsenceData[];
  overallSummary: OverallReportSummary;
}
