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
    <div className="min-h-screen w-full bg-[#0A3D46] dark:bg-[#07252B] p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center text-foreground">
      {/* Top Navigation Bar above the main card - Aligned to card left margin, no overlap */}
      <div className="w-full max-w-[1360px] mb-3 sm:mb-4 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-teal-100/90 hover:text-white transition-colors group cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>{t("login.backToHome")}</span>
        </Link>
      </div>

      {/* Main Card Container with Rounded Corners */}
      <div className="w-full max-w-[1360px] min-h-[85vh] rounded-[2.5rem] bg-white dark:bg-[#0F172A] shadow-2xl border border-white/10 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Panel: Form */}
        <div className="flex w-full lg:w-[42%] xl:w-[38%] shrink-0 flex-col justify-between p-8 sm:p-12 lg:p-14 bg-white dark:bg-[#0F172A]">
          {/* Top Logo & Brand (Clean, uncluttered, clickable) */}
          <Link
            href="/"
            className="flex items-center gap-3 w-fit group cursor-pointer"
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

          {/* Centered Login Form */}
          <div className="my-8 sm:my-10 flex-1 flex flex-col justify-center">
            <LoginForm />
          </div>

          {/* Copyright at Bottom Left */}
          <div className="text-xs text-muted-foreground">
            © MyHalaqoh {new Date().getFullYear()} • SMA Luqman Al Hakim Surabaya
          </div>
        </div>

        {/* Right Panel: Branding Showcase */}
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