"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { UserX, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AbsentSantriSection } from "@/features/dashboard/components/absent-santri-section";
import { AbsenceReportDialog } from "@/features/kehadiran-santri/components/absence-report-dialog";

// ==================== LOADING SKELETON ====================

function PageSkeleton() {
  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-card border border-border/60 shadow-xs">
        <div className="space-y-2">
          <div className="h-8 w-64 rounded-lg bg-muted animate-pulse" />
          <div className="h-4 w-80 sm:w-96 rounded-lg bg-muted animate-pulse" />
        </div>
        <div className="h-10 sm:h-9 w-full sm:w-40 rounded-xl bg-muted animate-pulse" />
      </div>
      <div className="space-y-5 sm:space-y-6">
        <div className="h-[360px] rounded-2xl border border-border/40 bg-card animate-pulse" />
        <div className="h-[360px] rounded-2xl border border-border/40 bg-card animate-pulse" />
      </div>
    </div>
  );
}

// ==================== MAIN PAGE COMPONENT ====================

export default function KehadiranSantriPage() {
  const { t } = useTranslation(["kehadiranSantri", "dashboard"]);
  const [reportDialogOpen, setReportDialogOpen] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  // SSR Hydration guard
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <PageSkeleton />;
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Top Header Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-card border border-border/60 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 sm:p-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 shrink-0">
            <UserX className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              {t("detail.pageTitle", { defaultValue: "Ketidakhadiran Santri" })}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              {t("dashboard.subtitle", {
                defaultValue: "Pemantauan santri tidak hadir dan pembuatan laporan harian",
              })}
            </p>
          </div>
        </div>

        <Button
          type="button"
          onClick={() => setReportDialogOpen(true)}
          className="h-10 sm:h-9 w-full sm:w-auto px-4 text-xs font-semibold gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs shrink-0 cursor-pointer rounded-xl"
        >
          <Download className="h-4 w-4" />
          {t("report.generateButton", { defaultValue: "Buat Laporan PDF" })}
        </Button>
      </div>

      {/* Realtime Absent Santri Section — Program Reguler & Program Takhassus */}
      <AbsentSantriSection programType="R" titleKey="dashboard.regulerTitle" />

      <AbsentSantriSection programType="T" titleKey="dashboard.takhassusTitle" />

      {/* Report Generation Dialog */}
      <AbsenceReportDialog
        open={reportDialogOpen}
        onOpenChange={setReportDialogOpen}
      />
    </div>
  );
}
