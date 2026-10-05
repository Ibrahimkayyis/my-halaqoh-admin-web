"use client";

import { Download } from "lucide-react";
import { motion } from "motion/react";
import { APP_RELEASE_CONFIG } from "@/config/app-release.config";

const installSteps = [
  {
    step: "01",
    title: "Unduh File APK",
    text: "Klik tombol 'Download APK Android' untuk mengunduh paket rilis resmi langsung ke HP Anda.",
  },
  {
    step: "02",
    title: "Izinkan Instalasi",
    text: "Jika muncul peringatan keamanan, pilih 'Izinkan instalasi aplikasi dari sumber ini' pada pengaturan HP.",
  },
  {
    step: "03",
    title: "Buka & Masuk",
    text: "Buka aplikasi MyHalaqoh dan login menggunakan NIP (Guru) atau NIS (Wali Santri) dari pihak pesantren.",
  },
];

export function LandingDownload() {
  return (
    <section
      id="unduh"
      className="py-20 sm:py-28 lg:py-32 bg-[#F0F6F7] dark:bg-[#0B1526] relative overflow-hidden"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Main Heroic Download Card */}
        <motion.div
          className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#0B4049] via-[#115D69] to-[#082E35] text-white p-8 sm:p-12 lg:p-16 border border-teal-500/20 shadow-2xl shadow-teal-950/30"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55 }}
        >
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            {/* Headline */}
            <h2
              className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Unduh MyHalaqoh Sekarang
            </h2>

            <p className="text-base sm:text-lg text-teal-100/85 leading-relaxed font-normal mb-8">
              Mulai pencatatan presensi dan pantau capaian hafalan santri dengan mudah di genggaman Anda.
              Gratis untuk seluruh asatidz dan wali santri.
            </p>

            {/* Primary Action Button */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={APP_RELEASE_CONFIG.downloadUrl}
                download
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white px-8 py-3.5 text-base font-semibold shadow-xl shadow-amber-950/40 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
              >
                <Download className="h-5 w-5 shrink-0" />
                <span>Download APK Android</span>
              </a>
            </div>

            {/* Version & Compatibility Details */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-teal-200/80">
              <span>Versi {APP_RELEASE_CONFIG.version} ({APP_RELEASE_CONFIG.buildType})</span>
              <span>&bull;</span>
              <span>{APP_RELEASE_CONFIG.compatibility}</span>
              <span>&bull;</span>
              <span>Ukuran: {APP_RELEASE_CONFIG.fileSize}</span>
            </div>

            {/* Playstore notice */}
            <p className="mt-6 text-xs text-teal-200/60 italic">
              *) Sedang dalam proses peninjauan untuk rilis di Google Play Store & Apple App Store.
            </p>
          </div>

          {/* 3 Step Install Guide Columns */}
          <div className="relative z-10 mt-12 sm:mt-16 pt-10 border-t border-white/15">
            <h3
              className="text-center text-sm font-bold uppercase tracking-wider text-teal-200/90 mb-8"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Panduan Instalasi Cepat (3 Langkah Mudah)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {installSteps.map((item) => (
                <div key={item.step} className="space-y-2">
                  <span
                    className="text-2xl font-bold text-[#2DD4BF]"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {item.step}
                  </span>
                  <h4 className="text-sm font-bold text-white">
                    {item.title}
                  </h4>
                  <p className="text-xs text-teal-100/75 leading-relaxed">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
