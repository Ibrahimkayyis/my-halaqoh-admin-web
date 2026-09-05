import { ClipboardCheck, BookOpen, QrCode, Bell, FileText, LayoutDashboard } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
  tag: string;
  highlight?: boolean;
}

export const landingFeatures: FeatureItem[] = [
  {
    icon: ClipboardCheck,
    title: "Presensi Digital 5 Sesi",
    description:
      "Catat kehadiran santri di setiap sesi halaqoh harian (Shubuh, Dhuha, Siang, Ashar, Maghrib) dengan status Hadir, Sakit, Izin, atau Alfa secara instan.",
    tag: "Presensi Harian",
  },
  {
    icon: BookOpen,
    title: "Setoran Hafalan Ziyadah & Muraja'ah",
    description:
      "Rekam setoran hafalan baru maupun pengulangan lengkap dengan pemilihan surah, rentang ayat, juz, serta penilaian tajwid dan kelancaran yang objektif.",
    tag: "Tahfidz Terukur",
    highlight: true,
  },
  {
    icon: QrCode,
    title: "Scan Barcode / NIS Kilat",
    description:
      "Presensi cepat tanpa antre panjang — asatidz cukup memindai kartu santri berbasis NIS dengan kamera HP, data langsung tersimpan.",
    tag: "Barcode Scanner",
  },
  {
    icon: Bell,
    title: "Notifikasi Realtime Wali Santri",
    description:
      "Orang tua santri menerima pembaruan kehadiran dan perkembangan hafalan putra-putrinya secara langsung lewat notifikasi aplikasi mobile.",
    tag: "Pantau Jarak Jauh",
  },
  {
    icon: FileText,
    title: "Laporan Rekapitulasi PDF Otomatis",
    description:
      "Hasilkan dokumen laporan rekapitulasi hafalan dan kehadiran satu halaqoh penuh berformat PDF rapi siap cetak untuk laporan wali atau pimpinan.",
    tag: "Ekspor Sekali Klik",
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard Admin Web Terpadu",
    description:
      "Kelola seluruh master data santri, guru, kenaikan kelas otomatis, alokasi halaqoh, dan target kurikulum per semester dari satu browser.",
    tag: "Web Management",
    highlight: true,
  },
];
