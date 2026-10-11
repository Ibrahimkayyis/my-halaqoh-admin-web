import Link from "next/link";
import Image from "next/image";
import { MessageCircle, Mail, MapPin, ExternalLink, ArrowUpRight } from "lucide-react";

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
              <div className="relative h-9 w-9 shrink-0">
                <Image
                  src="/images/my_halaqoh_logo_new.png"
                  alt="MyHalaqoh Logo"
                  fill
                  className="object-contain"
                  sizes="36px"
                />
              </div>
              <div>
                <span
                  className="text-xl font-bold text-slate-900 dark:text-slate-50"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  MyHalaqoh
                </span>
                <p className="text-[11px] font-semibold text-[#115D69] dark:text-[#14B8A6] uppercase tracking-wider font-sans">
                  Platform Manajemen Tahfidz Pesantren
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-md font-normal font-sans">
              Sistem informasi halaqoh Al-Qur&apos;an digital resmi untuk{" "}
              <strong className="font-semibold text-slate-900 dark:text-slate-100">
                Pondok Pesantren Hidayatullah Luqman Al-Hakim
              </strong>
              . Mempermudah pencatatan, memperkuat transparansi, dan mendekatkan pantauan hafalan santri.
            </p>

            <div className="space-y-2 pt-2 text-xs text-slate-600 dark:text-slate-400 font-sans">
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
            <p className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 font-sans">
              Navigasi Halaman
            </p>
            <ul className="space-y-2.5">
              {footerNavLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-[#115D69] dark:hover:text-[#14B8A6] transition-colors cursor-pointer inline-block font-sans"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Administrative Portal Link (3 cols on lg) */}
          <div className="lg:col-span-3 space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 font-sans">
              Akses Khusus
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal font-sans">
              Portal manajemen akademik, kurikulum, dan master data pesantren untuk ustadz &amp; pengurus.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#115D69] dark:text-[#14B8A6] hover:underline cursor-pointer pt-1 font-sans"
            >
              <span>Masuk Web Admin</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Bottom Bar Divider & Copyright */}
        <div className="pt-8 border-t border-gray-100 dark:border-gray-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-500 font-sans">
          <p>&copy; 2026 MyHalaqoh &bull; Pondok Pesantren Hidayatullah Luqman Al-Hakim. Hak Cipta Dilindungi.</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-500">
            Sistem Informasi Manajemen Halaqoh &amp; Tahfidz
          </p>
        </div>
      </div>
    </footer>
  );
}
