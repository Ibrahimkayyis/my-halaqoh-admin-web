"use client";

import Image from "next/image";
import { Download } from "lucide-react";
import { motion } from "motion/react";
import { PhoneMockup } from "./phone-mockup";
import { APP_RELEASE_CONFIG } from "@/config/app-release.config";
import { useLandingStats } from "../hooks/use-landing-stats";

export function LandingHero() {
  const { data: stats } = useLandingStats();

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" as const, delay },
  });

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#115D69] via-[#0E4F5A] to-[#0A3D46] text-white pt-28 pb-20 sm:pt-36 sm:pb-28 lg:pt-40 lg:pb-36">
      {/* Ambient background decoration */}
      <div
        className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-white/10 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/2 -right-40 h-[450px] w-[450px] rounded-full bg-[#D97706]/15 blur-[140px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1.5px, transparent 0)",
          backgroundSize: "36px 36px",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Column: Hero Copy (6 cols on lg) */}
          <div className="lg:col-span-6 text-center lg:text-left space-y-6">
            {/* Institution Editorial Kicker */}
            <motion.div {...fadeUp(0)}>
              <p className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-white/80 font-sans">
                Pesantren Hidayatullah Luqman Al-Hakim
              </p>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              {...fadeUp(0.1)}
              className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight leading-[1.15] text-white"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Mendigitalkan Halaqoh,{" "}
              <span className="text-[#fbbf24]">
                Memantau Hafalan Santri Lebih Dekat.
              </span>
            </motion.h1>

            {/* Subheadline Description */}
            <motion.p
              {...fadeUp(0.2)}
              className="text-base sm:text-lg lg:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal font-sans"
            >
              Sistem pencatatan presensi halaqoh dan setoran hafalan Al-Qur&apos;an
              terpadu. Menghubungkan <strong className="font-semibold text-white">Asatidz</strong>,{" "}
              <strong className="font-semibold text-white">Wali Santri</strong>, dan{" "}
              <strong className="font-semibold text-white">Manajemen Pesantren</strong> secara
              realtime.
            </motion.p>

            {/* Action CTA Buttons */}
            <motion.div
              {...fadeUp(0.3)}
              className="flex flex-col sm:flex-row flex-wrap items-center gap-3.5 sm:gap-4 justify-center lg:justify-start pt-2"
            >
              {/* Primary Download APK Button */}
              <a
                href={APP_RELEASE_CONFIG.downloadUrl}
                download
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#fbbf24] hover:bg-[#f59e0b] text-slate-900 px-7 py-3 text-sm sm:text-base font-semibold font-sans shadow-lg shadow-amber-950/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fbbf24] min-h-[48px]"
              >
                <Download className="h-5 w-5 shrink-0" />
                <span>Download APK Android</span>
              </a>

              {/* iOS App Store Button */}
              <a
                href={APP_RELEASE_CONFIG.appStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 rounded-xl"
                aria-label="Download MyHalaqoh di Apple App Store"
              >
                <Image
                  src="/images/download_on_the_appstore.png"
                  alt="Download on the App Store"
                  width={150}
                  height={48}
                  className="h-[48px] w-auto object-contain drop-shadow"
                />
              </a>
            </motion.div>

            {/* Live Data Summary Stats Card */}
            <motion.div
              {...fadeUp(0.35)}
              className="pt-6 border-t border-white/15 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0"
            >
              <div>
                <p
                  className="text-2xl sm:text-3xl font-bold text-white tracking-tight"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {stats?.totalSantri ?? 229}
                </p>
                <p className="text-xs font-medium text-white/80 mt-0.5 font-sans">Santri Aktif</p>
              </div>
              <div>
                <p
                  className="text-2xl sm:text-3xl font-bold text-white tracking-tight"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {stats?.totalGuru ?? 44}
                </p>
                <p className="text-xs font-medium text-white/80 mt-0.5 font-sans">Guru &amp; Asatidz</p>
              </div>
              <div>
                <p
                  className="text-2xl sm:text-3xl font-bold text-white tracking-tight"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {stats?.totalHalaqoh ?? 7}
                </p>
                <p className="text-xs font-medium text-white/80 mt-0.5 font-sans">Kelompok Halaqoh</p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Phone Mockup (6 cols on lg) */}
          <div className="lg:col-span-6 relative flex flex-col items-center justify-center pt-8 lg:pt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" as const, delay: 0.2 }}
              className="relative z-10 w-full flex justify-center"
            >
              <PhoneMockup
                src="/images/mobile_dashboard_teacher_page.png"
                alt="MyHalaqoh — Dashboard Guru Mobile"
                isTall={true}
                size="xl"
                priority
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Smooth Concave Curve Divider (lengkungan halus setengah lingkaran ke dalam) */}
      <div
        className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none z-20 translate-y-[1px]"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-7 sm:h-11 lg:h-14 block text-[#F8FAFB] dark:text-[#0F172A]"
          preserveAspectRatio="none"
        >
          <path
            d="M0,60 C420,0 1020,0 1440,60 L1440,60 L0,60 Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </section>
  );
}
