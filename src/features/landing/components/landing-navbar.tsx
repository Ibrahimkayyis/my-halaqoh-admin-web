"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const navLinks = [
  { label: "Fitur", href: "#fitur" },
  { label: "Pratinjau", href: "#pratinjau" },
  { label: "Pengguna", href: "#pengguna" },
  { label: "Unduh APK", href: "#unduh" },
  { label: "FAQ", href: "#faq" },
];

export function LandingNavbar() {
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 dark:bg-[#0F172A]/90 backdrop-blur-md shadow-sm border-b border-gray-200/70 dark:border-gray-800/80 py-3"
            : "bg-[#0D4E59]/90 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none border-b border-white/10 md:border-transparent py-4"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo & Brand */}
            <Link
              href="/"
              className="flex items-center gap-2.5 cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DD4BF] rounded-lg p-1"
            >
              <div className="relative h-8 w-8 shrink-0 group-hover:scale-105 transition-transform duration-200">
                <Image
                  src="/images/my_halaqoh_logo_new.png"
                  alt="MyHalaqoh Logo"
                  fill
                  className="object-contain"
                  sizes="32px"
                  priority
                />
              </div>
              <span
                className={`text-lg sm:text-xl font-bold tracking-tight transition-colors duration-200 ${
                  scrolled
                    ? "text-[#111827] dark:text-[#F9FAFB]"
                    : "text-white"
                }`}
                style={{ fontFamily: "var(--font-heading)" }}
              >
                MyHalaqoh
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav
              aria-label="Main Navigation"
              className="hidden lg:flex items-center gap-6"
            >
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors duration-150 cursor-pointer ${
                    scrolled
                      ? "text-slate-600 hover:text-[#115D69] dark:text-slate-300 dark:hover:text-[#14B8A6]"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Actions: Theme Toggle & Admin Button */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Theme Toggle Button */}
              <button
                type="button"
                suppressHydrationWarning
                onClick={toggleTheme}
                className={`p-2.5 min-h-[44px] min-w-[44px] rounded-lg border transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DD4BF] flex items-center justify-center ${
                  scrolled
                    ? "bg-gray-100 hover:bg-gray-200/80 border-gray-200 text-gray-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700 dark:text-gray-200"
                    : "bg-white/10 hover:bg-white/20 border-white/20 text-white"
                }`}
                aria-label="Ganti mode gelap/terang"
              >
                <Sun className="h-4 w-4 hidden dark:block text-amber-400" />
                <Moon className="h-4 w-4 block dark:hidden" />
              </button>

              {/* Web Admin Portal CTA */}
              <Link
                href="/login"
                className={`hidden sm:inline-flex items-center justify-center px-4 py-2 min-h-[44px] rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DD4BF] ${
                  scrolled
                    ? "bg-[#115D69] text-white hover:bg-[#0e4f5a] dark:bg-[#14B8A6] dark:text-slate-950 dark:hover:bg-[#0d9488]"
                    : "bg-white text-[#115D69] hover:bg-white/95"
                }`}
              >
                Masuk Web Admin
              </Link>

              {/* Mobile Hamburger Toggle */}
              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                className={`lg:hidden p-2.5 min-h-[44px] min-w-[44px] rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-center ${
                  scrolled
                    ? "bg-gray-100 border-gray-200 text-gray-700 dark:bg-slate-800 dark:border-slate-700 dark:text-gray-200"
                    : "bg-white/10 border-white/20 text-white"
                }`}
                aria-label="Buka menu navigasi"
                aria-expanded={mobileOpen}
                aria-controls="mobile-nav-drawer"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-nav-drawer"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[64px] z-40 bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 shadow-2xl lg:hidden"
          >
            <div className="mx-auto max-w-7xl px-4 py-6 space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-gray-800 hover:text-[#115D69] hover:bg-gray-100 dark:text-gray-200 dark:hover:text-[#14B8A6] dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
                >
                  <span>{link.label}</span>
                </a>
              ))}
              <div className="pt-3 border-t border-gray-200 dark:border-gray-800">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center w-full py-3 rounded-lg text-sm font-semibold bg-[#115D69] text-white hover:bg-[#0e4f5a] dark:bg-[#14B8A6] dark:text-slate-950 transition-colors cursor-pointer"
                >
                  Masuk Web Admin
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
