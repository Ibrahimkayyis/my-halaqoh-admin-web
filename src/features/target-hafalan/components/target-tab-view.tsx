"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Info, CalendarDays, BookMarked, BookOpen, Award, Loader2 } from "lucide-react";
import { TargetKelasCard } from "./target-kelas-card";
import { CURRICULUM_REGULER, CURRICULUM_TAKHASSUS } from "../data/curriculum-data";

type Program = "R" | "T";
type SemesterOption = 1 | 2 | null;

interface TargetTabViewProps {
  tahunAjaran: string | null;
  semesterAktif: SemesterOption;
  onChangeSemesterAktif: (val: SemesterOption) => void;
  isUpdating?: boolean;
}

export function TargetTabView({
  tahunAjaran,
  semesterAktif,
  onChangeSemesterAktif,
  isUpdating = false,
}: TargetTabViewProps) {
  const { t } = useTranslation(["targetHafalan", "common"]);
  const [activeTab, setActiveTab] = useState<Program>("R");

  const curriculum = activeTab === "R" ? CURRICULUM_REGULER : CURRICULUM_TAKHASSUS;

  const semesterPills: { value: SemesterOption; labelKey: string }[] = [
    { value: 1, labelKey: "common:labels.semester1" },
    { value: 2, labelKey: "common:labels.semester2" },
    { value: null, labelKey: "common:labels.notSet" },
  ];

  return (
    <div className="space-y-5">
      {/* ── 1. Full-width Responsive Tab Switcher ── */}
      <div className="grid grid-cols-2 w-full bg-muted/80 p-1.5 rounded-xl border border-border/40 gap-1.5 shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveTab("R")}
          className={cn(
            "flex items-center justify-center gap-2 py-2.5 sm:py-3 px-3 text-xs sm:text-sm font-bold tracking-wider uppercase rounded-lg transition-all duration-200 select-none cursor-pointer",
            activeTab === "R"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          <BookOpen className="w-4 h-4 shrink-0" />
          <span>{t("targetHafalan:tabs.reguler")}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("T")}
          className={cn(
            "flex items-center justify-center gap-2 py-2.5 sm:py-3 px-3 text-xs sm:text-sm font-bold tracking-wider uppercase rounded-lg transition-all duration-200 select-none cursor-pointer",
            activeTab === "T"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          <Award className="w-4 h-4 shrink-0" />
          <span>{t("targetHafalan:tabs.takhassus")}</span>
        </button>
      </div>

      {/* ── 2. Global Settings Panel ── */}
      <div
        className={cn(
          "bg-card border border-border/60 rounded-xl p-4 sm:p-5 shadow-xs space-y-4 transition-opacity duration-200",
          isUpdating && "opacity-60 pointer-events-none"
        )}
      >
        <div className="flex items-center justify-between gap-2 flex-wrap pb-1 border-b border-border/30">
          <div className="flex items-center gap-2">
            <BookMarked className="w-4 h-4 text-primary shrink-0" />
            <h2 className="text-sm font-bold text-foreground">
              {t("targetHafalan:academicYearInfo")}
            </h2>
          </div>
          <span className="text-[11px] text-muted-foreground font-medium px-2 py-0.5 rounded-full bg-muted/60 border border-border/40">
            {t("targetHafalan:staticYearBadge")}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-stretch gap-3 sm:gap-4">
          {/* Tahun Ajaran Card */}
          <div className="flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-xl px-4 py-3 sm:py-2.5 sm:min-w-[220px]">
            <CalendarDays className="w-5 h-5 text-primary shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-bold text-primary/75 tracking-wider uppercase">
                {t("common:labels.academicYear")}
              </span>
              <span className="text-base sm:text-lg font-extrabold text-primary tracking-tight leading-none mt-1">
                {tahunAjaran || "2026/2027"}
              </span>
            </div>
          </div>

          {/* Semester Aktif pills */}
          <div className="space-y-1.5 flex-1 flex flex-col justify-center">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                {t("common:labels.activeSemester")}
              </label>
              {isUpdating && (
                <span className="text-[11px] text-primary flex items-center gap-1 font-medium animate-pulse">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  {t("targetHafalan:updatingStatus")}
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2">
              {semesterPills.map((pill) => {
                const isSelected = semesterAktif === pill.value;
                const isBelum = pill.value === null;
                return (
                  <button
                    key={String(pill.value)}
                    type="button"
                    onClick={() => onChangeSemesterAktif(pill.value)}
                    disabled={isUpdating}
                    className={cn(
                      "flex items-center justify-center gap-1.5 px-2.5 sm:px-3.5 py-2 min-h-[40px] rounded-lg text-xs font-semibold border transition-all duration-150 select-none cursor-pointer",
                      isSelected && !isBelum
                        ? "bg-primary text-primary-foreground border-primary shadow-xs"
                        : isSelected && isBelum
                        ? "bg-amber-500 text-white border-amber-500 shadow-xs"
                        : "bg-background border-border/70 text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    )}
                  >
                    {isSelected && !isBelum && (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground shrink-0" />
                    )}
                    <span className="truncate">{t(pill.labelKey)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Info Banner ── */}
      <div className="flex items-start gap-3 bg-primary/5 border border-primary/20 rounded-xl px-4 py-3">
        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <div className="text-xs text-primary/90 leading-relaxed space-y-0.5">
          <p className="font-semibold text-primary">
            {t("targetHafalan:title")}
          </p>
          <p className="text-foreground/80 dark:text-foreground/70">
            {t("targetHafalan:infoBannerDescription", {
              defaultValue:
                "Target hafalan kurikulum ini otomatis menjadi standar acuan evaluasi capaian hafalan dan kelulusan santri per semester.",
            })}
          </p>
        </div>
      </div>

      {/* ── 4. Card Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {curriculum.map((c) => (
          <TargetKelasCard
            key={`${c.kelas}_${activeTab}`}
            curriculum={c}
            tahunAjaran={tahunAjaran}
            semesterAktif={semesterAktif}
          />
        ))}
      </div>
    </div>
  );
}
