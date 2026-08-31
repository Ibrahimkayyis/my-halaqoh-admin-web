import type { HafalanSantriDoc } from "@/lib/firestore/queries/kehadiran-santri.queries";

export interface HafalanGroupItem {
  tanggal: Date;
  jenis: "ziyadah" | "murajaah" | string;
  nilaiKelancaran: number;
  nilaiTajwid: number;
  avgScore: number;
  records: HafalanSantriDoc[];
  juzList: number[];
  surahDisplay: string;
}

export interface SantriHafalanReportEntry {
  santriId: string;
  nama: string;
  nis: string;
  kelas: string;
  groups: HafalanGroupItem[];
  totalZiyadah: number;
  totalMurajaah: number;
  avgScore: number | null;
  predikat: "Mumtaz" | "Jayyid" | "Maqbul" | null;
}

export interface HalaqohHafalanReportData {
  halaqohId: string;
  halaqohNama: string;
  guruNama: string;
  kelas: string;
  program: "R" | "T";
  startDate: Date;
  endDate: Date;
  periodLabel: string;
  santriEntries: SantriHafalanReportEntry[];
  generatedAt: Date;
}
