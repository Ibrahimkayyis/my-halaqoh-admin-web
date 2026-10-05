"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  LayoutDashboard, 
  HeartHandshake, 
  BookMarked, 
  ClipboardCheck, 
  Award, 
  QrCode,
  CheckCircle2,
} from "lucide-react";
import { PhoneMockup } from "./phone-mockup";

interface PreviewTabItem {
  id: string;
  label: string;
  badge: string;
  icon: typeof LayoutDashboard;
  src: string;
  alt: string;
  isTall: boolean;
  title: string;
  description: string;
  highlights: string[];
}

const previewTabs: PreviewTabItem[] = [
  {
    id: "dashboard-teacher",
    label: "Dashboard Guru",
    badge: "Asatidz",
    icon: LayoutDashboard,
    src: "/images/mobile_dashboard_teacher_page.png",
    alt: "MyHalaqoh — Layar Dashboard Guru",
    isTall: true,
    title: "Dashboard Terpadu Guru & Asatidz",
    description:
      "Layar utama guru yang menyajikan rekapitulasi capaian hari ini, persentase kehadiran halaqoh binaan, setoran santri terbaru, dan menu akses cepat presensi serta penilaian.",
    highlights: [
      "Ringkasan kehadiran & setoran harian",
      "Daftar setoran hafalan santri terkini",
      "Status halaqoh aktif & jumlah santri",
    ],
  },
  {
    id: "dashboard-wali",
    label: "Dashboard Wali Santri",
    badge: "Wali Santri",
    icon: HeartHandshake,
    src: "/images/mobile_dashboard_wali_Santri.png",
    alt: "MyHalaqoh — Layar Dashboard Wali Santri",
    isTall: true,
    title: "Pantauan Realtime Orang Tua / Wali",
    description:
      "Orang tua santri dapat memantau akumulasi kehadiran bulanan, rincian hadir/sakit/izin/alfa, serta progres penyelesaian juz terhadap target kurikulum semester secara transparan.",
    highlights: [
      "Persentase progres juz terselesaikan",
      "Statistik kehadiran bulanan santri",
      "Notifikasi langsung setiap ada setoran",
    ],
  },
  {
    id: "input-hafalan",
    label: "Form Input Setoran",
    badge: "Tahfidz",
    icon: BookMarked,
    src: "/images/mobile_input_hafalan_form_page.png",
    alt: "MyHalaqoh — Form Setoran Hafalan Santri",
    isTall: true,
    title: "Pencatatan Hafalan Cepat & Akurat",
    description:
      "Formulir fleksibel untuk mencatat setoran Ziyadah (hafalan baru) maupun Muraja'ah. Dilengkapi pemilih surah, rentang ayat, dan skala penilaian tajwid serta kelancaran (0–100).",
    highlights: [
      "Kategori Ziyadah & Muraja'ah",
      "Pemilih Surah & Ayat otomatis terindeks Juz",
      "Penilaian Tajwid & Kelancaran standar Mumtaz",
    ],
  },
  {
    id: "detail-attendance",
    label: "Presensi Halaqoh",
    badge: "Presensi",
    icon: ClipboardCheck,
    src: "/images/mobile_detail_attendance_page.jpeg",
    alt: "MyHalaqoh — Detail Absensi Halaqoh Hari Ini",
    isTall: false,
    title: "Detail Presensi Sesi Harian",
    description:
      "Catat kehadiran santri per sesi dengan tombol aksi cepat 'Hadir Semua' atau tandai status individual (Hadir, Sakit, Izin, Alfa). Dilengkapi tab sesi pagi dan malam.",
    highlights: [
      "Aksi cepat 'Tandai Hadir Semua'",
      "Dukungan sesi Pagi, Siang & Malam",
      "Statistik total santri hadir & tidak hadir",
    ],
  },
  {
    id: "hafalan-progress",
    label: "Progress Per Juz",
    badge: "Target Juz",
    icon: Award,
    src: "/images/mobile_hafalan_progress_page.jpeg",
    alt: "MyHalaqoh — Layar Progres Hafalan Per Juz",
    isTall: false,
    title: "Visualisasi Progres 30 Juz & Sertifikasi",
    description:
      "Pemetaan lengkap progres hafalan santri dari Juz 1 hingga Juz 30. Dilengkapi badge 'Tersertifikasi' untuk juz yang telah melalui ujian tasmi' kelulusan.",
    highlights: [
      "Peta visual seluruh 30 Juz Al-Qur'an",
      "Penanda juz yang telah tersertifikasi tasmi'",
      "Detail riwayat kelulusan per santri",
    ],
  },
  {
    id: "barcode-scanner",
    label: "Scan Barcode",
    badge: "Scan Kilat",
    icon: QrCode,
    src: "/images/mobile_barcode_scanner_page.jpeg",
    alt: "MyHalaqoh — Scanner Barcode Kartu Santri",
    isTall: false,
    title: "Absensi Kilat Berbasis Barcode NIS",
    description:
      "Arahkan kamera HP ke barcode pada kartu identitas santri untuk melakukan presensi instan dalam hitungan detik. Mengurangi waktu antrean saat jam halaqoh dimulai.",
    highlights: [
      "Deteksi instan barcode NIS santri",
      "Umpan balik haptic & visual saat terbaca",
      "Fitur lampu senter untuk ruang minim cahaya",
    ],
  },
];

export function LandingPreview() {
  const [activeTabId, setActiveTabId] = useState<string>("dashboard-teacher");

  const activeTab = previewTabs.find((t) => t.id === activeTabId) || previewTabs[0];

  return (
    <section
      id="pratinjau"
      className="py-20 sm:py-28 lg:py-32 bg-[#F0F6F7] dark:bg-[#0B1526] relative overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <motion.h2
            className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight mb-5"
            style={{ fontFamily: "var(--font-heading)" }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            Lihat Langsung Tampilan Aplikasi Mobile
          </motion.h2>

          <motion.p
            className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-normal"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Jelajahi setiap modul aplikasi MyHalaqoh yang dirancang ramah pengguna, bersih, dan
            fokus pada kecepatan pencatatan halaqoh.
          </motion.p>
        </div>

        {/* Tab Navigation Buttons Bar */}
        <div
          role="tablist"
          aria-label="Pratinjau Modul Aplikasi"
          className="flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto pb-4 mb-12 sm:mb-16 scrollbar-none px-2"
        >
          {previewTabs.map((tab) => {
            const isActive = activeTabId === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                onClick={() => setActiveTabId(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#115D69] ${
                  isActive
                    ? "bg-[#115D69] text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-slate-800/50"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-teal-200" : "text-gray-400 dark:text-gray-500"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Showcase Body (Side-by-Side: Text Breakdown + Phone Mockup) */}
        <div
          role="tabpanel"
          id={`panel-${activeTab.id}`}
          aria-labelledby={`tab-${activeTab.id}`}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center"
        >
          {/* Left: Active Screen Narrative Breakdown (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h3
                  className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-snug"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {activeTab.title}
                </h3>

                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-normal">
                  {activeTab.description}
                </p>

                {/* Highlights Bullet List */}
                <div className="space-y-3 pt-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                    Kemampuan Utama:
                  </p>
                  <ul className="space-y-2.5">
                    {activeTab.highlights.map((item, index) => (
                      <li key={index} className="flex items-start gap-2.5 text-sm sm:text-base text-gray-700 dark:text-gray-200 font-medium">
                        <CheckCircle2 className="h-4 w-4 text-[#115D69] dark:text-[#2DD4BF] shrink-0 mt-1" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Info Note if Tall Screenshot */}
                {activeTab.isTall && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 pt-2">
                    Arahkan kursor ke layar untuk melihat pratinjau penuh.
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: Phone Mockup Display (5 cols on lg) */}
          <div className="lg:col-span-5 flex justify-center items-center py-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: "easeInOut" as const }}
                className="w-full flex justify-center"
              >
                <PhoneMockup
                  src={activeTab.src}
                  alt={activeTab.alt}
                  isTall={activeTab.isTall}
                  size="lg"
                  showScrollHint={true}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
