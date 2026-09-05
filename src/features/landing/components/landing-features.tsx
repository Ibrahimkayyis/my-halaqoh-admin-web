"use client";

import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { landingFeatures } from "../data/landing-features.data";

export function LandingFeatures() {

  return (
    <section id="fitur" className="py-20 sm:py-28 lg:py-32 bg-[#F8FAFB] dark:bg-[#0F172A] relative">
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
            <span>Fitur Unggulan Sistem</span>
          </motion.div>

          <motion.h2
            className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight mb-5"
            style={{ fontFamily: "var(--font-heading)" }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            Dirancang Khusus untuk Kebutuhan Pesantren Modern
          </motion.h2>

          <motion.p
            className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-normal"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Mulai dari pencatatan presensi harian hingga laporan rekapitulasi hafalan
            Al-Qur&apos;an, MyHalaqoh menghadirkan efisiensi tanpa meninggalkan nilai-nilai tarbiyah.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {landingFeatures.map((feature, i) => (
            <motion.div
              key={feature.title}
              className={`group relative rounded-3xl p-7 sm:p-8 bg-white dark:bg-[#1E293B] border transition-all duration-300 flex flex-col justify-between ${
                feature.highlight
                  ? "border-[#115D69]/40 dark:border-[#14B8A6]/40 shadow-lg shadow-[#115D69]/5 hover:shadow-xl hover:shadow-[#115D69]/10 hover:-translate-y-1.5"
                  : "border-gray-200/80 dark:border-gray-800 shadow-sm hover:shadow-lg hover:border-[#115D69]/30 hover:-translate-y-1.5"
              }`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
            >
              <div>
                {/* Top Row: Icon & Tag */}
                <div className="flex items-center justify-between gap-3 mb-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#115D69]/10 to-[#14B8A6]/20 dark:from-[#14B8A6]/20 dark:to-[#14B8A6]/5 text-[#115D69] dark:text-[#2DD4BF] border border-[#115D69]/15 dark:border-[#14B8A6]/30 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-7 w-7" aria-hidden="true" />
                  </div>
                  <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-slate-800/90 px-3 py-1 text-[11px] font-semibold text-gray-700 dark:text-gray-300 border border-gray-200/60 dark:border-slate-700">
                    {feature.tag}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight group-hover:text-[#115D69] dark:group-hover:text-[#2DD4BF] transition-colors duration-200"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-300 font-normal">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
