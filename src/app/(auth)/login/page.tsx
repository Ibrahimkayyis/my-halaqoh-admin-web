"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LoginForm } from "./_components/login-form";
import { LoginBrandingPanel } from "./_components/login-branding-panel";
import { I18nProvider } from "@/components/providers/i18n-provider";

function LoginContent() {
  const { t } = useTranslation("auth");

  return (
    <div className="min-h-screen w-full bg-[#0A3D46] dark:bg-[#07252B] p-3 sm:p-5 lg:p-8 flex items-center justify-center text-foreground relative">
      {/* Floating Back to Home Button on larger screens */}
      <Link
        href="/"
        className="absolute top-5 left-5 sm:top-8 sm:left-8 z-30 hidden sm:inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-4 py-2 text-xs font-semibold text-teal-100 hover:text-white transition-all shadow-sm group cursor-pointer"
      >
        <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
        <span>{t("login.backToHome")}</span>
      </Link>

      {/* Main Card Container with Rounded Corners per Reference */}
      <div className="w-full max-w-[1360px] min-h-[90vh] rounded-[2.5rem] bg-white dark:bg-[#0F172A] shadow-2xl border border-white/10 flex flex-col lg:flex-row overflow-hidden relative z-10">
        {/* Left Panel: Form */}
        <div className="flex w-full lg:w-[42%] xl:w-[38%] shrink-0 flex-col justify-between p-8 sm:p-12 lg:p-14 bg-white dark:bg-[#0F172A]">
          {/* Top Logo & Navigation Header */}
          <div className="flex items-center justify-between gap-3">
            <Link
              href="/"
              className="flex items-center gap-3 group cursor-pointer"
              title={t("login.backToHome")}
            >
              <div className="relative h-10 w-10">
                <Image
                  src="/images/my_halaqoh_logo_new.png"
                  alt="MyHalaqoh Logo"
                  fill
                  className="object-contain transition-transform group-hover:scale-105"
                  priority
                />
              </div>
              <span className="text-2xl font-bold tracking-tight text-[#115D69] dark:text-[#2DD4BF] transition-opacity group-hover:opacity-85">
                MyHalaqoh
              </span>
            </Link>

            {/* Back to Home Button in Card Header */}
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-[#115D69] dark:hover:text-[#2DD4BF] py-1.5 px-3 rounded-xl border border-border/80 hover:bg-muted/60 transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>{t("login.backToHome")}</span>
            </Link>
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
  );
}

export default function LoginPage() {
  return (
    <I18nProvider>
      <LoginContent />
    </I18nProvider>
  );
}