"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ClipboardCheck } from "lucide-react";
import { ProgramKehadiranSection } from "@/features/kehadiran-guru/components/program-kehadiran-section";

// ==================== LOADING SKELETON ====================

function PageSkeleton() {
  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-64 rounded-lg bg-muted animate-pulse" />
        <div className="h-4 w-80 sm:w-96 rounded-lg bg-muted animate-pulse" />
      </div>
      <div className="grid gap-5 sm:gap-6 lg:grid-cols-2 items-start">
        <div className="space-y-5">
          <div className="h-[340px] rounded-[20px] border border-border/40 bg-card animate-pulse" />
          <div className="h-[300px] rounded-[20px] border border-border/40 bg-card animate-pulse" />
        </div>
        <div className="space-y-5">
          <div className="h-[340px] rounded-[20px] border border-border/40 bg-card animate-pulse" />
          <div className="h-[300px] rounded-[20px] border border-border/40 bg-card animate-pulse" />
        </div>
      </div>
    </div>
  );
}

// ==================== MAIN PAGE COMPONENT ====================

export default function KehadiranGuruPage() {
  const { t } = useTranslation("kehadiranGuru");
  const [mounted, setMounted] = useState(false);

  // SSR Hydration guard
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <PageSkeleton />;
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1.5 sm:gap-2">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="p-2 sm:p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
            <ClipboardCheck className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              {t("title")}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              {t("subtitle")}
            </p>
          </div>
        </div>
      </div>

      {/* 2 Independent Program Sections Side-by-Side (Reguler on Left, Takhassus on Right) */}
      <div className="grid gap-5 sm:gap-6 lg:grid-cols-2 items-start">
        {/* Program Reguler Section */}
        <ProgramKehadiranSection
          programType="R"
          titleKey="charts.regulerTitle"
        />

        {/* Program Takhassus Section */}
        <ProgramKehadiranSection
          programType="T"
          titleKey="charts.takhassusTitle"
        />
      </div>
    </div>
  );
}
