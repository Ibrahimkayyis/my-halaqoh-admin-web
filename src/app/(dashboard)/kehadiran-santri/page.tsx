"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AbsentSantriSection } from "@/features/dashboard/components/absent-santri-section";
import { AbsenceReportDialog } from "@/features/kehadiran-santri/components/absence-report-dialog";

export default function KehadiranSantriPage() {
  const { t } = useTranslation(["kehadiranSantri", "dashboard"]);
  const [reportDialogOpen, setReportDialogOpen] = useState<boolean>(false);

  return (
    <div className="space-y-6">
      {/* Top Header Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-card border border-border/60 shadow-xs">
        <div className="space-y-0.5">
          <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            {t("detail.pageTitle", { defaultValue: "Ketidakhadiran Santri" })}
          </h2>
          <p className="text-xs text-muted-foreground">
            {t("dashboard.subtitle", {
              defaultValue: "Pemantauan santri tidak hadir dan pembuatan laporan harian",
            })}
          </p>
        </div>

        <Button
          type="button"
          onClick={() => setReportDialogOpen(true)}
          className="h-9 px-4 text-xs font-semibold gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs shrink-0 cursor-pointer"
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
