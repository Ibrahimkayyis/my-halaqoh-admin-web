import Link from "next/link";
import Image from "next/image";
import { MessageCircle, Mail, MapPin, ExternalLink, ArrowUpRight, Shield } from "lucide-react";

const footerNavLinks = [
  { label: "Fitur Utama", href: "#fitur" },
  { label: "Pratinjau Aplikasi", href: "#pratinjau" },
  { label: "Pengguna Sistem", href: "#pengguna" },
  { label: "Unduh APK", href: "#unduh" },
  { label: "FAQ", href: "#faq" },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0B0F19] text-gray-700 dark:text-gray-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 mb-12">
          {/* Brand & Institution Info (6 cols on lg) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 shrink-0 rounded-xl overflow-hidden bg-teal-50 dark:bg-slate-800 p-1 border border-teal-500/20 shadow-sm">
                <Image
                  src="/images/my_halaqoh_logo_new.png"
                  alt="MyHalaqoh Logo"
                  fill
                  className="object-contain"
                  sizes="40px"
                />
              </div>
              <div>
                <span
                  className="text-xl font-extrabold text-gray-900 dark:text-white"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  MyHalaqoh
                </span>
                <p className="text-[11px] font-semibold text-[#115D69] dark:text-[#14B8A6] uppercase tracking-wider">
                  Platform Manajemen Tahfidz Pesantren
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-w-md font-normal">
              Sistem informasi halaqoh Al-Qur&apos;an digital resmi untuk{" "}
              <strong className="font-semibold text-gray-900 dark:text-white">
                Pondok Pesantren Hidayatullah Luqman Al-Hakim
              </strong>
              . Mempermudah pencatatan, memperkuat transparansi, dan mendekatkan pantauan hafalan santri.
            </p>

            <div className="space-y-2 pt-2 text-xs text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#115D69] dark:text-[#14B8A6] shrink-0" />
                <span>Pondok Pesantren Hidayatullah Luqman Al-Hakim, Surabaya</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-[#115D69] dark:text-[#14B8A6] shrink-0" />
                <a
                  href="https://wa.me/6285370005231"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#115D69] dark:hover:text-[#14B8A6] font-medium transition-colors cursor-pointer inline-flex items-center gap-1"
                >
                  WhatsApp: +62 853-7000-5231
                  <ExternalLink className="h-3 w-3 opacity-60" />
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#115D69] dark:text-[#14B8A6] shrink-0" />
                <a
                  href="mailto:smaluqmanalhakimsurabaya@gmail.com"
                  className="hover:text-[#115D69] dark:hover:text-[#14B8A6] font-medium transition-colors cursor-pointer"
                >
                  smaluqmanalhakimsurabaya@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Nav Links (3 cols on lg) */}
          <div className="lg:col-span-3 space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Navigasi Halaman
            </p>
            <ul className="space-y-2.5">
              {footerNavLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-[#115D69] dark:hover:text-[#14B8A6] transition-colors cursor-pointer inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Administrative Portal Link (3 cols on lg) */}
          <div className="lg:col-span-3 space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Akses Khusus
            </p>
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-200/80 dark:border-gray-800 space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900 dark:text-white">
                <Shield className="h-3.5 w-3.5 text-[#115D69] dark:text-[#14B8A6]" />
                <span>Portal Pengurus</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-normal">
                Masuk ke Web Admin untuk mengelola data master santri & kurikulum.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#115D69] dark:text-[#14B8A6] hover:underline cursor-pointer"
              >
                <span>Masuk Web Admin</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar Divider & Copyright */}
        <div className="pt-8 border-t border-gray-100 dark:border-gray-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 dark:text-gray-400">
          <p>&copy; 2026 MyHalaqoh &bull; Pondok Pesantren Hidayatullah Luqman Al-Hakim. Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-[11px] text-teal-700 dark:text-teal-400 font-semibold bg-teal-50 dark:bg-teal-950/60 px-2.5 py-0.5 rounded-full border border-teal-200 dark:border-teal-800">
              v1.0.0 Stable Release
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
