"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu, X, LayoutDashboard, ArrowUpRight } from "lucide-react";
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
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
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
              className="flex items-center gap-3 cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DD4BF] rounded-lg p-1"
            >
              <div className="relative h-9 w-9 shrink-0 rounded-xl overflow-hidden bg-white/10 p-1 border border-white/20 shadow-inner group-hover:scale-105 transition-transform duration-200">
                <Image
                  src="/images/my_halaqoh_logo_new.png"
                  alt="MyHalaqoh Logo"
                  fill
                  className="object-contain"
                  sizes="36px"
                  priority
                />
              </div>
              <div className="flex flex-col">
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
                <span
                  className={`text-[10px] font-medium tracking-wide uppercase transition-colors duration-200 ${
                    scrolled
                      ? "text-[#115D69] dark:text-[#14B8A6]"
                      : "text-teal-200"
                  }`}
                >
                  Sistem Halaqoh Pesantren
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav
              aria-label="Main Navigation"
              className={`hidden lg:flex items-center gap-1 rounded-full px-4 py-1.5 border transition-all duration-200 backdrop-blur-md ${
                scrolled
                  ? "bg-slate-100/80 border-slate-200/80 dark:bg-slate-850/80 dark:border-slate-700/80"
                  : "bg-white/10 border-white/15"
              }`}
            >
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer ${
                    scrolled
                      ? "text-gray-600 hover:text-[#115D69] hover:bg-white dark:text-gray-300 dark:hover:text-[#14B8A6] dark:hover:bg-slate-800"
                      : "text-white/80 hover:text-white hover:bg-white/10"
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
                suppressHydrationWarning
                onClick={toggleTheme}
                className={`p-2 rounded-xl border transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DD4BF] ${
                  scrolled
                    ? "bg-gray-100 hover:bg-gray-200/80 border-gray-200 text-gray-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700 dark:text-gray-200"
                    : "bg-white/10 hover:bg-white/20 border-white/20 text-white"
                }`}
                aria-label="Ganti mode gelap/terang"
              >
                {mounted && theme === "dark" ? (
                  <Sun className="h-4 w-4 text-amber-400" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </button>

              {/* Web Admin Portal CTA */}
              <Link
                href="/login"
                className={`hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2DD4BF] ${
                  scrolled
                    ? "bg-[#115D69] text-white hover:bg-[#0e4f5a] dark:bg-[#14B8A6] dark:text-slate-950 dark:hover:bg-[#0d9488]"
                    : "bg-white text-[#115D69] hover:bg-white/90 hover:shadow-md"
                }`}
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                <span>Masuk Web Admin</span>
                <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
              </Link>

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className={`lg:hidden p-2 rounded-xl border transition-all duration-200 cursor-pointer ${
                  scrolled
                    ? "bg-gray-100 border-gray-200 text-gray-700 dark:bg-slate-800 dark:border-slate-700 dark:text-gray-200"
                    : "bg-white/10 border-white/20 text-white"
                }`}
                aria-label="Buka menu navigasi"
                aria-expanded={mobileOpen}
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
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold bg-[#115D69] text-white hover:bg-[#0e4f5a] dark:bg-[#14B8A6] dark:text-slate-950 transition-colors shadow-md cursor-pointer"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Masuk Web Admin</span>
                  <ArrowUpRight className="h-4 w-4 opacity-70" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
