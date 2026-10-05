"use client";

import Link from "next/link";
import { Download, LayoutDashboard } from "lucide-react";
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
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0A3D46] via-[#115D69] to-[#0D4954] text-white pt-28 pb-20 sm:pt-36 sm:pb-28 lg:pt-40 lg:pb-36">
      {/* Ambient background decoration */}
      <div
        className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-[#2DD4BF]/15 blur-[120px]"
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
              <p className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-teal-200/90">
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
              <span className="text-[#2DD4BF] drop-shadow-sm">
                Memantau Hafalan
              </span>{" "}
              Santri Lebih Dekat.
            </motion.h1>

            {/* Subheadline Description */}
            <motion.p
              {...fadeUp(0.2)}
              className="text-base sm:text-lg lg:text-xl text-teal-100/85 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal"
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
              className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-2"
            >
              {/* Primary Download APK Button */}
              <a
                href={APP_RELEASE_CONFIG.downloadUrl}
                download
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white px-7 py-3.5 text-sm sm:text-base font-semibold shadow-lg shadow-amber-950/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
              >
                <Download className="h-5 w-5 shrink-0" />
                <span>Download APK Android</span>
              </a>

              {/* Web Admin Portal Access Button */}
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3.5 text-sm sm:text-base font-semibold backdrop-blur-sm transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DD4BF]"
              >
                <LayoutDashboard className="h-4 w-4 text-[#2DD4BF]" />
                <span>Masuk Web Admin</span>
              </Link>
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
                <p className="text-xs text-teal-200/80 mt-0.5">Santri Aktif</p>
              </div>
              <div>
                <p
                  className="text-2xl sm:text-3xl font-bold text-white tracking-tight"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {stats?.totalGuru ?? 44}
                </p>
                <p className="text-xs text-teal-200/80 mt-0.5">Guru & Asatidz</p>
              </div>
              <div>
                <p
                  className="text-2xl sm:text-3xl font-bold text-white tracking-tight"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {stats?.totalHalaqoh ?? 7}
                </p>
                <p className="text-xs text-teal-200/80 mt-0.5">Kelompok Halaqoh</p>
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
    </section>
  );
}
