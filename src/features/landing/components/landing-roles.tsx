"use client";

import { Users, HeartHandshake, ShieldCheck, Check } from "lucide-react";
import { motion } from "motion/react";

const rolesData = [
  {
    icon: Users,
    role: "Guru & Asatidz",
    tagline: "Pencatatan Halus & Praktis",
    description:
      "Dirancang khusus untuk membantu asatidz mengelola kelompok halaqoh tanpa terbebani administrasi manual yang rumit.",
    features: [
      "Presensi 5 sesi dengan 1x klik (Hadir Semua)",
      "Rekam setoran Ziyadah & Muraja'ah + penilaian tajwid",
      "Scan barcode kartu santri instan",
      "Mode offline-first saat koneksi internet asrama minim",
    ],
  },
  {
    icon: HeartHandshake,
    role: "Wali Santri",
    tagline: "Ketenangan & Transparansi",
    description:
      "Memberikan akses langsung bagi orang tua untuk memantau kehadiran dan perkembangan hafalan Al-Qur'an anak dari rumah.",
    features: [
      "Notifikasi realtime saat santri selesai setoran hafalan",
      "Pantau akumulasi kehadiran bulanan secara transparan",
      "Grafik progres juz terhadap target kurikulum semester",
      "Riwayat setoran lengkap beserta catatan nilai dari ustadz",
    ],
  },
  {
    icon: ShieldCheck,
    role: "Admin & Waka Tahfidz",
    tagline: "Kontrol Akademik Terpadu",
    description:
      "Pusat kendali manajemen pesantren untuk mengawasi seluruh halaqoh, memvalidasi kurikulum, dan menerbitkan laporan.",
    features: [
      "Manajemen master data santri, guru, dan rombel halaqoh",
      "Wizard kenaikan kelas & kelulusan alumni otomatis",
      "Unduh laporan rekapitulasi 1 halaqoh penuh (PDF siap cetak)",
      "Konfigurasi target juz per tingkat kelas & program",
    ],
  },
];

export function LandingRoles() {
  return (
    <section id="pengguna" className="py-20 sm:py-28 lg:py-32 bg-[#F8FAFB] dark:bg-[#0F172A] relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <motion.h2
            className="text-2xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-50 tracking-tight leading-tight mb-5"
            style={{ fontFamily: "var(--font-heading)" }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            Satu Ekosistem untuk Tiga Peran Kunci
          </motion.h2>

          <motion.p
            className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-normal font-sans"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Setiap modul dirancang sesuai alur kerja nyata masing-masing pengguna di lingkungan pesantren.
          </motion.p>
        </div>

        {/* Roles 3-Columns Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {rolesData.map((item, i) => (
            <motion.div
              key={item.role}
              className="flex flex-col justify-between"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
            >
              <div>
                {/* Clean Minimal Icon */}
                <div className="mb-4 inline-flex items-center text-[#115D69] dark:text-[#2DD4BF]">
                  <item.icon className="h-7 w-7" aria-hidden="true" />
                </div>

                {/* Role Title & Tagline */}
                <h3
                  className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1 tracking-tight"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {item.role}
                </h3>
                <p className="text-xs font-semibold text-[#115D69] dark:text-[#14B8A6] uppercase tracking-wider mb-3 font-sans">
                  {item.tagline}
                </p>

                {/* Description */}
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 font-normal mb-6 font-sans">
                  {item.description}
                </p>

                {/* Capability Checklist */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-sans">
                    Fasilitas & Kemampuan:
                  </p>
                  <ul className="space-y-2.5">
                    {item.features.map((feat, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-normal font-sans"
                      >
                        <Check className="h-4 w-4 text-[#115D69] dark:text-[#2DD4BF] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
