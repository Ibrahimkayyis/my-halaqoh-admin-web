"use client";

import Image from "next/image";
import { LoginForm } from "./_components/login-form";
import { LoginBrandingPanel } from "./_components/login-branding-panel";
import { I18nProvider } from "@/components/providers/i18n-provider";

export default function LoginPage() {
  return (
    <I18nProvider>
      <div className="min-h-screen w-full bg-[#0A3D46] dark:bg-[#07252B] p-3 sm:p-5 lg:p-8 flex items-center justify-center text-foreground">
        {/* Main Card Container with Rounded Corners per Reference */}
        <div className="w-full max-w-[1360px] min-h-[90vh] rounded-[2.5rem] bg-white dark:bg-[#0F172A] shadow-2xl border border-white/10 flex flex-col lg:flex-row overflow-hidden">
          {/* Left Panel: Form */}
          <div className="flex w-full lg:w-[42%] xl:w-[38%] shrink-0 flex-col justify-between p-8 sm:p-12 lg:p-14 bg-white dark:bg-[#0F172A]">
            {/* Top Logo & Brand */}
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10">
                <Image
                  src="/logo.svg"
                  alt="MyHalaqoh Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-2xl font-bold tracking-tight text-[#115D69] dark:text-[#2DD4BF]">
                MyHalaqoh
              </span>
            </div>

            {/* Centered Login Form */}
            <div className="my-8 sm:my-10 flex-1 flex flex-col justify-center">
              <LoginForm />
            </div>

            {/* Copyright at Bottom Left */}
            <div className="text-xs text-muted-foreground">
              © MyHalaqoh {new Date().getFullYear()} • SMA Luqman Al Hakim Surabaya
            </div>
          </div>

          {/* Right Panel: Branding (Matching Reference Layout) */}
          <div className="hidden flex-1 lg:flex p-3 sm:p-4 lg:p-4">
            <LoginBrandingPanel />
          </div>
        </div>
      </div>
    </I18nProvider>
  );
}