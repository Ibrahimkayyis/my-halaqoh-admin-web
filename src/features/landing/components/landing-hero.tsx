"use client";

import Link from "next/link";
import { Download, LayoutDashboard, CheckCircle2, Sparkles, ShieldCheck, WifiOff, QrCode } from "lucide-react";
import { motion } from "motion/react";
import { PhoneMockup } from "./phone-mockup";
import { APP_RELEASE_CONFIG } from "@/config/app-release.config";

export function LandingHero() {
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
            {/* Institution Pill Badge */}
            <motion.div {...fadeUp(0)} className="inline-flex justify-center lg:justify-start">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 text-xs font-semibold text-teal-100 shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>Pesantren Hidayatullah Luqman Al-Hakim</span>
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              {...fadeUp(0.1)}
              className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight leading-[1.15] text-white"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Mendigitalkan Halaqoh,{" "}
              <span className="bg-gradient-to-r from-[#5EEAD4] via-[#2DD4BF] to-teal-200 bg-clip-text text-transparent">
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
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl bg-[#D97706] hover:bg-[#B45309] text-white px-7 py-4 text-base font-bold shadow-xl shadow-amber-950/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
              >
                <Download className="h-5 w-5 shrink-0" />
                <div className="text-left leading-tight">
                  <div className="text-[11px] font-normal uppercase tracking-wider opacity-90">
                    Unduh Langsung
                  </div>
                  <div className="text-sm sm:text-base font-bold">Download APK Android</div>
                </div>
              </a>

              {/* Web Admin Portal Access Button */}
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/25 px-6 py-4 text-sm font-semibold backdrop-blur-sm transition-all duration-200 hover:border-white/40 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DD4BF]"
              >
                <LayoutDashboard className="h-5 w-5 text-[#2DD4BF]" />
                <span>Masuk Web Admin</span>
              </Link>
            </motion.div>

            {/* Key Trust Signals / Features Strip */}
            <motion.div
              {...fadeUp(0.35)}
              className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-teal-100/75"
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#2DD4BF]" />
                <span>Offline-First (Tanpa Internet)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#2DD4BF]" />
                <span>Scan Barcode Kartu Santri</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-amber-400" />
                <span>Aman & Terintegrasi</span>
              </div>
            </motion.div>

            {/* Live Data Summary Stats Card */}
            <motion.div
              {...fadeUp(0.4)}
              className="pt-4 border-t border-white/15 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0"
            >
              <div>
                <p
                  className="text-2xl sm:text-3xl font-bold text-white tracking-tight"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  261+
                </p>
                <p className="text-xs text-teal-200/80 mt-0.5">Santri Aktif</p>
              </div>
              <div>
                <p
                  className="text-2xl sm:text-3xl font-bold text-white tracking-tight"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  40
                </p>
                <p className="text-xs text-teal-200/80 mt-0.5">Guru & Asatidz</p>
              </div>
              <div>
                <p
                  className="text-2xl sm:text-3xl font-bold text-white tracking-tight"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  23
                </p>
                <p className="text-xs text-teal-200/80 mt-0.5">Kelompok Halaqoh</p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Interactive Phone Mockup with Floating Showcase Badges (6 cols on lg) */}
          <div className="lg:col-span-6 relative flex flex-col items-center justify-center pt-8 lg:pt-0">
            {/* Phone Mockup with XL size */}
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

              {/* Floating Badge 1: Top Right (Offline-First Feature Highlight) — positioned beside profile banner to avoid covering header */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.45 }}
                className="hidden xl:flex absolute top-36 -right-14 xl:-right-18 z-20 items-center gap-3 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-3 shadow-2xl border border-teal-500/20 text-slate-800 dark:text-slate-100"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/15 text-teal-600 dark:text-teal-400 font-bold">
                  <WifiOff className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">Presensi Offline-First</p>
                  <p className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold">Tetap Catat Tanpa Internet</p>
                </div>
              </motion.div>

              {/* Floating Badge 2: Bottom Left (Barcode Scanner Feature Highlight) */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.55 }}
                className="hidden xl:flex absolute bottom-24 -left-14 xl:-left-18 z-20 items-center gap-3 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-3 shadow-2xl border border-amber-500/20 text-slate-800 dark:text-slate-100"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
                  <QrCode className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">Scan Barcode NIS</p>
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">Absensi Cepat Kartu Santri</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Wave Transition to Body */}
      <div className="absolute bottom-0 inset-x-0 overflow-hidden leading-none">
        <svg
          viewBox="0 0 1440 48"
          fill="none"
          preserveAspectRatio="none"
          className="w-full h-10 sm:h-12 text-[#F8FAFB] dark:text-[#0F172A]"
        >
          <path
            d="M0,48 C360,0 1080,0 1440,48 L1440,48 L0,48 Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </section>
  );
}
