import Image from "next/image";

export function LoginBrandingPanel() {
  return (
    <div className="relative hidden h-full w-full flex-col overflow-hidden rounded-[2rem] bg-primary p-10 text-primary-foreground lg:flex shadow-2xl">
      <div className="relative z-20 mt-auto flex flex-col gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Kelola pesantren Anda dengan mudah
          </h1>
          <p className="text-lg text-primary-foreground/80">
            Akses sistem administrasi MyHalaqoh untuk mengelola data santri, guru, dan jadwal halaqoh dalam satu dashboard terpadu.
          </p>
        </div>

        {/* Mockup Aplikasi Mobile */}
        <div className="relative mt-8 h-[450px] w-full overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-sm">
          <Image
            src="/app-mockup.png"
            alt="MyHalaqoh App Mockup"
            fill
            className="object-contain object-bottom"
            sizes="(max-width: 1024px) 0vw, 50vw"
            priority
          />
        </div>
      </div>

      <div className="relative z-20 mt-auto pt-10">
        <blockquote className="space-y-2">
          <p className="text-sm italic text-primary-foreground/80">
            &quot;Sebaik-baik kalian adalah yang mempelajari Al-Qur&apos;an dan mengajarkannya.&quot;
          </p>
          <footer className="text-xs text-primary-foreground/60">
            HR. Bukhari
          </footer>
        </blockquote>
      </div>
      
      {/* Decorative background element */}
      <div className="absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
    </div>
  );
}
