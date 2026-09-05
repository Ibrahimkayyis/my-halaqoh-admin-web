import Image from "next/image";

export function LoginBrandingPanel() {
  return (
    <div className="relative hidden h-full w-full flex-col justify-between overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#0B4049] via-[#115D69] to-[#082E35] p-8 sm:p-10 lg:p-12 text-white lg:flex shadow-2xl">
      {/* Subtle Ambient Radial Glows */}
      <div
        className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#2DD4BF]/15 blur-[100px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-[#14B8A6]/10 blur-[100px]"
        aria-hidden="true"
      />

      {/* Top Header Section with comfortable breathing room */}
      <div className="relative z-20 space-y-3 mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
          Solusi Cerdas Manajemen Tahfidz &amp; Halaqoh
        </h1>
        <p className="text-xs sm:text-sm text-teal-100/80 max-w-md leading-relaxed font-normal">
          Akses sistem administrasi MyHalaqoh untuk mengelola data santri, target hafalan, dan jadwal halaqoh dalam satu dashboard terpadu.
        </p>
      </div>

      {/* Center Showcase: Dashboard (Back) + Mobile Login (Front Overlapping per Reference) */}
      <div className="relative z-20 my-auto pb-6 w-full flex items-center justify-center">
        <div className="relative w-full max-w-[580px]">
          {/* Back: Main Desktop Dashboard Screenshot */}
          <div className="relative w-[86%] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-white aspect-[1920/1082] z-10">
            <Image
              src="/images/admin_dashboard.png"
              alt="MyHalaqoh Admin Dashboard"
              fill
              className="object-contain object-top"
              sizes="(max-width: 1024px) 0vw, 45vw"
              priority
            />
          </div>

          {/* Front: Mobile Login Page (Scaled to match reference card proportions on bottom right) */}
          <div className="absolute -bottom-6 right-0 sm:right-2 w-[21%] min-w-[105px] max-w-[125px] aspect-[352/761] rounded-2xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.65)] ring-1 ring-white/25 z-20 transition-transform duration-300 hover:scale-[1.03]">
            <Image
              src="/images/admin_login_page.png"
              alt="MyHalaqoh Admin Login Mobile"
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 0vw, 15vw"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
