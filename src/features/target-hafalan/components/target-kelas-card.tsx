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
          <Badge className="text-[10px] px-1.5 py-0 font-bold bg-primary text-primary-foreground">
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
        "rounded-lg p-3 space-y-2 transition-colors",
        isActive
          ? "bg-primary/8 ring-1 ring-primary/20"
          : "bg-transparent"
      )}
    >
      {/* Semester label */}
      <div className="flex items-center gap-2">
        <p
          className={cn(
            "text-[10px] font-bold tracking-widest uppercase",
            isActive ? "text-primary" : "text-muted-foreground/60"
          )}
        >
          {t("common:labels.semester" + semesterNum)}
        </p>
        {isActive && (
          <span className="inline-flex items-center gap-1 text-[9px] font-bold tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded-full uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            {t("common:status.active")}
          </span>
        )}
      </div>

      {/* Curriculum items */}
      <div className="space-y-1.5">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-start gap-2.5">
            <span
              className={cn(
                "shrink-0 text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded mt-0.5",
                item.type === "UTS"
                  ? isActive
                    ? "bg-primary/15 text-primary"
                    : "bg-primary/10 text-primary"
                  : isActive
                  ? "bg-muted/80 text-muted-foreground"
                  : "bg-muted/60 text-muted-foreground"
              )}
            >
              {item.type}
            </span>
            <span
              className={cn(
                "text-xs leading-snug font-medium",
                isActive ? "text-foreground" : "text-foreground/70"
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
  const isSem1Active = semesterAktif === 1;
  const isSem2Active = semesterAktif === 2;

  return (
    <Card
      className={cn(
        "bg-surface border border-border/40 transition-shadow overflow-hidden",
        (isSem1Active || isSem2Active) ? "hover:shadow-md" : "hover:shadow-sm"
      )}
    >
      <CardContent className="p-0">
        {/* Card Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border/30">
          {/* Circle badge */}
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-sm">
            <span className="text-sm font-bold text-primary-foreground leading-none">
              {kelasNum}
            </span>
          </div>
          {/* Kelas name + status */}
          <div className="flex-1 min-w-0 space-y-0.5">
            <p className="text-sm font-bold text-foreground leading-tight">
              {t("common:labels.class")} {curriculum.kelas}
            </p>
            <StatusLine tahunAjaran={tahunAjaran} semesterAktif={semesterAktif} />
          </div>
        </div>

        {/* Card Body — Curriculum */}
        <div className="p-3 space-y-2">
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
