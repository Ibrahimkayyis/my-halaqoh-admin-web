"use client";

import { Users, HeartHandshake, ShieldCheck, Check, Sparkles } from "lucide-react";
import { motion } from "motion/react";

const rolesData = [
  {
    icon: Users,
    role: "Guru & Asatidz",
    badge: "Aplikasi Mobile",
    tagline: "Pencatatan Halus & Praktis",
    description:
      "Dirancang khusus untuk membantu asatidz mengelola kelompok halaqoh tanpa terbebani administrasi manual yang rumit.",
    features: [
      "Presensi 5 sesi dengan 1x klik (Hadir Semua)",
      "Rekam setoran Ziyadah & Muraja'ah + penilaian tajwid",
      "Scan barcode kartu santri instan",
      "Mode offline-first saat koneksi internet asrama minim",
    ],
    borderAccent: "hover:border-[#115D69]/50 dark:hover:border-[#14B8A6]/50",
    badgeColor: "bg-teal-50 text-[#115D69] dark:bg-teal-950/60 dark:text-[#2DD4BF] border-teal-200 dark:border-teal-800",
    iconColor: "bg-[#115D69]/10 text-[#115D69] dark:bg-[#14B8A6]/20 dark:text-[#2DD4BF]",
  },
  {
    icon: HeartHandshake,
    role: "Wali Santri",
    badge: "Aplikasi Mobile",
    tagline: "Ketenangan & Transparansi",
    description:
      "Memberikan akses langsung bagi orang tua untuk memantau kehadiran dan perkembangan hafalan Al-Qur'an anak dari rumah.",
    features: [
      "Notifikasi realtime saat santri selesai setoran hafalan",
      "Pantau akumulasi kehadiran bulanan secara transparan",
      "Grafik progres juz terhadap target kurikulum semester",
      "Riwayat setoran lengkap beserta catatan nilai dari ustadz",
    ],
    borderAccent: "hover:border-amber-500/50 dark:hover:border-amber-400/50",
    badgeColor: "bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    iconColor: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
  },
  {
    icon: ShieldCheck,
    role: "Admin & Waka Tahfidz",
    badge: "Web Admin Portal",
    tagline: "Kontrol Akademik Terpadu",
    description:
      "Pusat kendali manajemen pesantren untuk mengawasi seluruh halaqoh, memvalidasi kurikulum, dan menerbitkan laporan.",
    features: [
      "Manajemen master data santri, guru, dan rombel halaqoh",
      "Wizard kenaikan kelas & kelulusan alumni otomatis",
      "Unduh laporan rekapitulasi 1 halaqoh penuh (PDF siap cetak)",
      "Konfigurasi target juz per tingkat kelas & program",
    ],
    borderAccent: "hover:border-blue-500/50 dark:hover:border-blue-400/50",
    badgeColor: "bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    iconColor: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
  },
];

export function LandingRoles() {
  return (
    <section id="pengguna" className="py-20 sm:py-28 lg:py-32 bg-[#F8FAFB] dark:bg-[#0F172A] relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full bg-[#115D69]/10 dark:bg-[#14B8A6]/10 px-4 py-1.5 text-xs font-bold text-[#115D69] dark:text-[#14B8A6] uppercase tracking-wider mb-4 border border-[#115D69]/15 dark:border-[#14B8A6]/20"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Pengguna Sistem</span>
          </motion.div>

          <motion.h2
            className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight mb-5"
            style={{ fontFamily: "var(--font-heading)" }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            Satu Ekosistem untuk Tiga Peran Kunci
          </motion.h2>

          <motion.p
            className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-normal"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Setiap modul dirancang sesuai alur kerja nyata masing-masing pengguna di lingkungan pesantren.
          </motion.p>
        </div>

        {/* Roles 3-Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {rolesData.map((item, i) => (
            <motion.div
              key={item.role}
              className={`rounded-3xl p-8 bg-white dark:bg-[#1E293B] border border-gray-200/80 dark:border-gray-800 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 flex flex-col justify-between ${item.borderAccent}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
            >
              <div>
                {/* Header Row: Icon & Access Badge */}
                <div className="flex items-center justify-between gap-3 mb-6">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.iconColor}`}
                  >
                    <item.icon className="h-7 w-7" aria-hidden="true" />
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold border ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                </div>

                {/* Role Title & Tagline */}
                <h3
                  className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1 tracking-tight"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {item.role}
                </h3>
                <p className="text-xs font-semibold text-[#115D69] dark:text-[#14B8A6] uppercase tracking-wider mb-4">
                  {item.tagline}
                </p>

                {/* Description */}
                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 font-normal mb-6">
                  {item.description}
                </p>

                {/* Capability Checklist */}
                <div className="pt-6 border-t border-gray-100 dark:border-slate-800 space-y-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    Fasilitas & Kemampuan:
                  </p>
                  <ul className="space-y-2.5">
                    {item.features.map((feat, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium leading-normal"
                      >
                        <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-teal-500/15 text-teal-600 dark:text-teal-400 mt-0.5">
                          <Check className="h-3 w-3 stroke-[3]" />
                        </div>
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
