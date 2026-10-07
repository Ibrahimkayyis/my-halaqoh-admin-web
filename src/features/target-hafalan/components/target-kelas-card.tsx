"use client";

import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { KelasCurriculum } from "../types/target-hafalan.types";

interface TargetKelasCardProps {
  curriculum: KelasCurriculum;
  tahunAjaran: string | null;
  semesterAktif: 1 | 2 | null;
}

/** Status baris di header card */
function StatusLine({
  tahunAjaran,
  semesterAktif,
}: {
  tahunAjaran: string | null;
  semesterAktif: 1 | 2 | null;
}) {
  const { t } = useTranslation(["targetHafalan", "common"]);

  if (!tahunAjaran) {
    return (
      <span className="text-[11px] font-medium text-muted-foreground/60 italic">
        {t("common:labels.notSet")}
      </span>
    );
  }
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <span className="text-[11px] font-medium text-muted-foreground">
        TA {tahunAjaran}
      </span>
      {semesterAktif && (
        <>
          <span className="text-muted-foreground/30 text-[11px]">•</span>
          <Badge className="text-[10px] px-2 py-0.5 font-bold bg-primary text-primary-foreground border-none shadow-none">
            {t("common:labels.semester" + semesterAktif)} {t("common:status.active")}
          </Badge>
        </>
      )}
      {semesterAktif === null && (
        <>
          <span className="text-muted-foreground/30 text-[11px]">•</span>
          <Badge
            variant="outline"
            className="text-[10px] px-1.5 py-0 font-semibold border-amber-400/50 text-amber-600 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400"
          >
            {t("common:labels.notSet")}
          </Badge>
        </>
      )}
    </div>
  );
}

/** Section Semester — highlight jika aktif */
function SemesterSection({
  semesterNum,
  items,
  isActive,
}: {
  semesterNum: 1 | 2;
  items: KelasCurriculum["semester1"]["items"];
  isActive: boolean;
}) {
  const { t } = useTranslation(["targetHafalan", "common"]);

  return (
    <div
      className={cn(
        "rounded-xl p-3 sm:p-3.5 space-y-2.5 transition-all duration-150",
        isActive
          ? "bg-primary/5 dark:bg-primary/10 border border-primary/25 shadow-2xs"
          : "bg-muted/30 dark:bg-muted/20 border border-border/40"
      )}
    >
      {/* Semester label */}
      <div className="flex items-center justify-between gap-2">
        <p
          className={cn(
            "text-[10px] font-bold tracking-widest uppercase",
            isActive ? "text-primary" : "text-muted-foreground/75"
          )}
        >
          {t("common:labels.semester" + semesterNum)}
        </p>
        {isActive && (
          <span className="inline-flex items-center gap-1.5 text-[9px] font-bold tracking-wider text-primary bg-primary/15 dark:bg-primary/20 px-2 py-0.5 rounded-full uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            {t("common:status.active")}
          </span>
        )}
      </div>

      {/* Curriculum items */}
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-start gap-2.5">
            <span
              className={cn(
                "shrink-0 text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-md mt-0.5 select-none",
                item.type === "UTS"
                  ? isActive
                    ? "bg-primary text-primary-foreground shadow-2xs"
                    : "bg-primary/10 text-primary border border-primary/20"
                  : isActive
                  ? "bg-emerald-600 text-white dark:bg-emerald-600 shadow-2xs"
                  : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
              )}
            >
              {item.type}
            </span>
            <span
              className={cn(
                "text-xs sm:text-[13px] leading-relaxed font-medium break-words min-w-0 flex-1",
                isActive ? "text-foreground font-semibold" : "text-muted-foreground"
              )}
            >
              {item.detail}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TargetKelasCard({
  curriculum,
  tahunAjaran,
  semesterAktif,
}: TargetKelasCardProps) {
  const { t } = useTranslation(["targetHafalan", "common"]);
  const kelasNum = parseInt(curriculum.kelas, 10);
  const isSmp = kelasNum <= 9;
  const stageLabel = isSmp
    ? t("targetHafalan:smpBadge", { defaultValue: "SMP" })
    : t("targetHafalan:smaBadge", { defaultValue: "SMA" });

  const isSem1Active = semesterAktif === 1;
  const isSem2Active = semesterAktif === 2;
  const hasActiveSemester = isSem1Active || isSem2Active;

  return (
    <Card
      className={cn(
        "bg-card border border-border/60 transition-all duration-200 overflow-hidden rounded-xl",
        hasActiveSemester
          ? "hover:border-primary/40 hover:shadow-sm"
          : "hover:border-border hover:shadow-xs"
      )}
    >
      <CardContent className="p-0">
        {/* Card Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border/40 bg-card">
          {/* Avatar badge */}
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-xs">
            <span className="text-base font-extrabold text-primary-foreground leading-none">
              {kelasNum}
            </span>
          </div>

          {/* Kelas name, stage & status */}
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-foreground leading-tight truncate">
                {t("common:labels.class")} {curriculum.kelas}
              </p>
              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-muted text-muted-foreground border border-border/40">
                {stageLabel}
              </span>
            </div>
            <StatusLine tahunAjaran={tahunAjaran} semesterAktif={semesterAktif} />
          </div>
        </div>

        {/* Card Body — Curriculum */}
        <div className="p-3.5 space-y-2.5">
          <SemesterSection
            semesterNum={1}
            items={curriculum.semester1.items}
            isActive={isSem1Active}
          />
          <SemesterSection
            semesterNum={2}
            items={curriculum.semester2.items}
            isActive={isSem2Active}
          />
        </div>
      </CardContent>
    </Card>
  );
}
