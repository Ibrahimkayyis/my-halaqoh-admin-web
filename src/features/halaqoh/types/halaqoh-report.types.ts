export interface HalaqohSantriAbsenceSummary {
  santriId: string;
  nama: string;
  nis: string;
  maxSessions: number;
  hadirCount: number;
  sakitCount: number;
  izinCount: number;
  alfaCount: number;
}

export interface HalaqohWeeklyReportBlock {
  weekLabel: string;
  startDate: Date;
  endDate: Date;
  maxScheduledSessions: number;
  santriSummaries: HalaqohSantriAbsenceSummary[];
}

export interface HalaqohReportData {
  halaqohId: string;
  halaqohNama: string;
  guruNama: string;
  kelas: string;
  program: "R" | "T";
  startDate: Date;
  endDate: Date;
  periodLabel?: string;
  rangeMode?: "monthly" | "weekly" | "custom";
  weeklyBlocks: HalaqohWeeklyReportBlock[];
  generatedAt: Date;
}

