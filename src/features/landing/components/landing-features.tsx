"use client";

import { motion } from "motion/react";
import { landingFeatures } from "../data/landing-features.data";

export function LandingFeatures() {

  return (
    <section id="fitur" className="py-20 sm:py-28 lg:py-32 bg-[#F8FAFB] dark:bg-[#0F172A] relative">
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
            Dirancang Khusus untuk Kebutuhan Pesantren Modern
          </motion.h2>

          <motion.p
            className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-normal font-sans"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Mulai dari pencatatan presensi harian hingga laporan rekapitulasi hafalan
            Al-Qur&apos;an, MyHalaqoh menghadirkan efisiensi tanpa meninggalkan nilai-nilai tarbiyah.
          </motion.p>
        </div>

        {/* Features Open Typographic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12 sm:gap-y-16">
          {landingFeatures.map((feature, i) => (
            <motion.div
              key={feature.title}
              className="group flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
            >
              {/* Clean Minimal Icon */}
              <div className="mb-4 inline-flex items-center text-[#115D69] dark:text-[#2DD4BF] group-hover:scale-105 transition-transform duration-200">
                <feature.icon className="h-7 w-7" aria-hidden="true" />
              </div>

              {/* Title */}
              <h3
                className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2 tracking-tight group-hover:text-[#115D69] dark:group-hover:text-[#2DD4BF] transition-colors duration-200"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-sm sm:text-[15px] leading-relaxed text-slate-600 dark:text-slate-400 font-normal font-sans">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
