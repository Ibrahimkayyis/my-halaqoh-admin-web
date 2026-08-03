"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ProgramKehadiranSection } from "@/features/kehadiran-guru/components/program-kehadiran-section";

// ==================== LOADING SKELETON ====================

function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-64 rounded bg-muted animate-pulse" />
        <div className="mt-2 h-4 w-96 rounded bg-muted animate-pulse" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="h-[320px] rounded-xl border bg-card animate-pulse" />
          <div className="h-[280px] rounded-xl border bg-card animate-pulse" />
        </div>
        <div className="space-y-4">
          <div className="h-[320px] rounded-xl border bg-card animate-pulse" />
          <div className="h-[280px] rounded-xl border bg-card animate-pulse" />
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
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      {/* 2 Independent Program Sections Side-by-Side (Reguler on Left, Takhassus on Right) */}
      <div className="grid gap-6 lg:grid-cols-2 items-start">
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
