import Link from "next/link";
import { LayoutDashboard, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

export function LandingAdminCta() {
  return (
    <section className="py-16 sm:py-20 bg-[#F8FAFB] dark:bg-[#0F172A] relative">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0E4F5A] to-[#115D69] p-8 sm:p-12 lg:p-14 text-white shadow-xl shadow-teal-950/20 border border-teal-500/20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Content (8 cols on lg) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-3.5 py-1 text-xs font-bold text-teal-100 border border-white/15">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-300" />
                <span>Khusus Administrator & Waka Tahfidz</span>
              </div>

              <h3
                className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Akses Panel Web Admin MyHalaqoh
              </h3>

              <p className="text-sm sm:text-base text-teal-100/85 leading-relaxed max-w-2xl font-normal">
                Kelola master data santri, konfigurasi kelompok halaqoh, kenaikan kelas, dan unduh
                laporan hafalan resmi langsung melalui peramban web tanpa perlu memasang aplikasi.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-teal-100/75">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#2DD4BF]" />
                  <span>Bulk Import Excel/CSV</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#2DD4BF]" />
                  <span>Export Laporan PDF Resmi</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#2DD4BF]" />
                  <span>Realtime Database Stream</span>
                </div>
              </div>
            </div>

            {/* Right: CTA Button (4 cols on lg) */}
            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-white text-[#115D69] hover:bg-teal-50 px-7 py-4 text-base font-bold shadow-lg transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <LayoutDashboard className="h-5 w-5 text-[#115D69]" />
                <span>Masuk Web Admin</span>
                <ArrowRight className="h-4 w-4 text-[#115D69] opacity-70" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
