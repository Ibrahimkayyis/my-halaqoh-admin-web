"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";
import { landingFaqs } from "../data/landing-faq.data";

export function LandingFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Open first FAQ by default

  const toggleFaq = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="faq" className="py-20 sm:py-28 lg:py-32 bg-[#F8FAFB] dark:bg-[#0F172A] relative">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full bg-[#115D69]/10 dark:bg-[#14B8A6]/10 px-4 py-1.5 text-xs font-bold text-[#115D69] dark:text-[#14B8A6] uppercase tracking-wider mb-4 border border-[#115D69]/15 dark:border-[#14B8A6]/20"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Tanya Jawab</span>
          </motion.div>

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

        {/* Accordion List */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-4"
        >
          {landingFaqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "bg-white dark:bg-[#1E293B] border-[#115D69]/40 dark:border-[#14B8A6]/40 shadow-md"
                    : "bg-white/80 dark:bg-[#1E293B]/80 border-gray-200/80 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(i)}
                  className="w-full flex items-center justify-between text-left px-6 py-5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#115D69] gap-4"
                  aria-expanded={isOpen}
                >
                  <span
                    className={`text-base sm:text-lg font-bold transition-colors ${
                      isOpen
                        ? "text-[#115D69] dark:text-[#2DD4BF]"
                        : "text-gray-900 dark:text-white"
                    }`}
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {faq.question}
                  </span>
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-transform duration-200 ${
                      isOpen
                        ? "bg-[#115D69]/10 text-[#115D69] dark:bg-[#14B8A6]/20 dark:text-[#2DD4BF] rotate-180"
                        : "bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-gray-400"
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" as const }}
                    >
                      <div className="text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-300 px-6 pb-6 pt-2 border-t border-gray-100 dark:border-slate-800/80 font-normal">
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
