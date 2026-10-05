"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";
import { landingFaqs } from "../data/landing-faq.data";

export function LandingFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Open first FAQ by default

  const toggleFaq = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="faq" className="py-20 sm:py-28 lg:py-32 bg-[#F8FAFB] dark:bg-[#0F172A] relative">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2
            className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            Pertanyaan yang Sering Diajukan
          </motion.h2>

          <motion.p
            className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-normal"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Temukan jawaban atas pertanyaan umum seputar instalasi, fitur, dan akun MyHalaqoh.
          </motion.p>
        </div>

        {/* Minimal Accordion List */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="divide-y divide-gray-200 dark:divide-gray-800 border-t border-b border-gray-200 dark:border-gray-800"
        >
          {landingFaqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} className="py-2">
                <button
                  type="button"
                  onClick={() => toggleFaq(i)}
                  className="w-full flex items-center justify-between text-left py-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#115D69] gap-4"
                  aria-expanded={isOpen}
                >
                  <span
                    className={`text-base sm:text-lg font-semibold transition-colors ${
                      isOpen
                        ? "text-[#115D69] dark:text-[#2DD4BF]"
                        : "text-gray-900 dark:text-white"
                    }`}
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 transition-transform duration-200 ${
                      isOpen
                        ? "text-[#115D69] dark:text-[#2DD4BF] rotate-180"
                        : "text-gray-400 dark:text-gray-500"
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" as const }}
                      className="overflow-hidden"
                    >
                      <div className="text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-300 pb-5 pt-1 font-normal">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
