"use client";

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  BookOpen,
  User,
  School,
  AlertCircle,
  FileText,
  HelpCircle,
  Clock,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDashboardAbsentSantri } from "../hooks/use-dashboard-absent-santri";
import type { GroupedAbsentSantri } from "@/features/kehadiran-santri/types/kehadiran-santri.types";
import type { SesiHalaqoh } from "@/features/kehadiran-guru/types/kehadiran-guru.types";
import { cn } from "@/lib/utils";

interface AbsentSantriSectionProps {
  programType: "R" | "T";
  titleKey: string;
}

const ALL_SESSIONS: SesiHalaqoh[] = ["shubuh", "dhuha", "siang", "ashar", "maghrib"];

function AbsenceStatusBadge({ status }: { status: "sakit" | "izin" | "alfa" }) {
  const { t } = useTranslation("kehadiranSantri");

  switch (status) {
    case "sakit":
      return (
        <Badge className="font-medium text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shadow-none">
          <AlertCircle className="h-3 w-3 mr-1" />
          {t("status.sakit")}
        </Badge>
      );
    case "izin":
      return (
        <Badge className="font-medium text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shadow-none">
          <FileText className="h-3 w-3 mr-1" />
          {t("status.izin")}
        </Badge>
      );
    case "alfa":
      return (
        <Badge className="font-medium text-xs px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 shadow-none">
          <HelpCircle className="h-3 w-3 mr-1" />
          {t("status.alfa")}
        </Badge>
      );
  }
}

export function AbsentSantriSection({ programType, titleKey }: AbsentSantriSectionProps) {
  const { t, i18n } = useTranslation(["kehadiranSantri", "kehadiranGuru", "common"]);

  // Date Filter (default today)
  const [selectedDateStr, setSelectedDateStr] = useState<string>(
    () => new Date().toISOString().split("T")[0]
  );

  // Expand / Collapse state for list (default collapsed to 5)
  const [isListExpanded, setIsListExpanded] = useState<boolean>(false);

  // Track expanded item key (santriId) for santri row details
  const [expandedItemKey, setExpandedItemKey] = useState<string | null>(null);

  const toggleSantriExpand = (key: string) => {
    setExpandedItemKey((prev) => (prev === key ? null : key));
  };

  // Parse date
  const selectedDate = useMemo(() => {
    if (!selectedDateStr) return new Date();
    const [y, m, d] = selectedDateStr.split("-").map(Number);
    return new Date(y, m - 1, d);
  }, [selectedDateStr]);

  const locale = i18n.language?.startsWith("en") ? "en-US" : "id-ID";

  const fullDateFormatted = useMemo(() => {
    return selectedDate.toLocaleDateString(locale, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, [selectedDate, locale]);

  // Fetch absent data across all sessions for the selected date
  const { groupedList, summary, isLoading } = useDashboardAbsentSantri(
    programType,
    selectedDate
  );

  const safeGroupedList = groupedList ?? [];

  const displayedList = useMemo(() => {
    if (isListExpanded) return safeGroupedList;
    return safeGroupedList.slice(0, 5);
  }, [safeGroupedList, isListExpanded]);

  return (
    <Card className="rounded-xl border border-border/60 bg-card shadow-xs overflow-hidden">
      {/* Program Header Bar */}
      <div className="px-6 py-4 border-b border-border/40 bg-card flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <h3 className="text-base font-semibold text-foreground tracking-tight">
            {t(titleKey)}
          </h3>
          {summary && summary.totalAbsent > 0 && (
            <Badge className="font-semibold text-xs rounded-full px-2.5 py-0.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 shadow-none">
              {t("dashboard.absentCount", { count: summary.totalAbsent })}
            </Badge>
          )}
        </div>
      </div>

      {/* 2-Column Split Body (Left: Date & Filter | Right: Santri Absent List) */}
      <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-border/40">
        {/* Left Section (Column 1: Day/Date Info & Date Filter) */}
        <div className="md:col-span-5 lg:col-span-4 p-6 space-y-6 bg-muted/20">
          <div className="space-y-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Tanggal Aktif
            </span>

            <div className="space-y-1.5">
              <p className="text-sm font-bold text-foreground capitalize">
                {fullDateFormatted}
              </p>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="space-y-4 pt-4 border-t border-border/40">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Filter Tanggal
            </span>

            <div className="space-y-3">
              {/* Date Input */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Pilih Tanggal</label>
                <div className="relative">
                  <Input
                    type="date"
                    value={selectedDateStr}
                    onChange={(e) => e.target.value && setSelectedDateStr(e.target.value)}
                    className="h-9 w-full pl-8 pr-3 text-xs font-medium bg-background border-border/60 rounded-lg shadow-xs hover:bg-accent/40 transition-colors cursor-pointer"
                  />
                  <CalendarIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section (Column 2: List of Absent Santri) */}
        <div className="md:col-span-7 lg:col-span-8 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Daftar Santri Tidak Hadir
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              Total: {safeGroupedList.length} Santri
            </span>
          </div>

          {/* List Content */}
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-12 w-full bg-muted/60 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : safeGroupedList.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-8 text-center border border-dashed border-border/60 rounded-lg bg-muted/10">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              <p className="text-sm font-semibold text-foreground">{t("dashboard.allPresent")}</p>
              <p className="text-xs text-muted-foreground">{t("dashboard.allPresentDesc")}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {displayedList.map((item) => {
                const itemKey = item.santriId;
                const isExpanded = expandedItemKey === itemKey;

                return (
                  <div
                    key={itemKey}
                    className={cn(
                      "border border-border/50 rounded-lg p-3 bg-card transition-all duration-150",
                      isExpanded ? "border-primary/40 bg-muted/10 shadow-2xs" : "hover:border-border hover:bg-muted/20"
                    )}
                  >
                    {/* Collapsed Header Item (Click to Expand) */}
                    <div
                      onClick={() => toggleSantriExpand(itemKey)}
                      className="flex items-center justify-between cursor-pointer select-none gap-3"
                    >
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Link
                            href={`/santri/${item.santriId}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs font-bold text-foreground hover:text-primary transition-colors hover:underline truncate"
                          >
                            {item.santriNama}
                          </Link>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            NIS: {item.santriNis}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {/* Summary Badge for missed sessions */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {ALL_SESSIONS.map((sesi) => {
                            const status = item.sessions[sesi];
                            if (!status) return null;
                            return (
                              <AbsenceStatusBadge key={sesi} status={status} />
                            );
                          })}
                        </div>

                        <button
                          type="button"
                          className="text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors"
                        >
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 transition-transform duration-200",
                              isExpanded && "rotate-180 text-primary"
                            )}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Expanded Details Body */}
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-border/30 space-y-3 animate-in fade-in-0 slide-in-from-top-1 duration-150">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="space-y-1 p-2 rounded-md bg-muted/40 border border-border/30">
                            <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
                              <BookOpen className="h-3 w-3 text-primary" />
                              Halaqoh
                            </span>
                            <p className="text-xs font-semibold text-foreground truncate">
                              {item.halaqohNama}
                            </p>
                          </div>

                          <div className="space-y-1 p-2 rounded-md bg-muted/40 border border-border/30">
                            <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
                              <User className="h-3 w-3 text-primary" />
                              Ustadz Pembimbing
                            </span>
                            <p className="text-xs font-semibold text-foreground truncate">
                              {item.guruNama}
                            </p>
                          </div>

                          <div className="space-y-1 p-2 rounded-md bg-muted/40 border border-border/30">
                            <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
                              <School className="h-3 w-3 text-primary" />
                              Kelas
                            </span>
                            <p className="text-xs font-semibold text-foreground">
                              Kelas {item.kelas}
                            </p>
                          </div>
                        </div>

                        {/* Rincian Sesi Tidak Hadir */}
                        <div className="p-2.5 rounded-md bg-muted/30 border border-border/30 space-y-2">
                          <span className="text-[10px] font-semibold text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3 text-primary" />
                            Rincian Sesi Tidak Hadir ({item.totalAbsentSessions} Sesi):
                          </span>

                          <div className="flex flex-wrap gap-2">
                            {ALL_SESSIONS.map((sesi) => {
                              const status = item.sessions[sesi];
                              if (!status) return null;

                              return (
                                <div
                                  key={sesi}
                                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-background border border-border/50 shadow-2xs"
                                >
                                  <Badge className="font-semibold text-[11px] px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 shadow-none capitalize">
                                    <Clock className="h-3 w-3 mr-1 inline" />
                                    {t(`sesi.${sesi}`, { ns: "kehadiranGuru" })}
                                  </Badge>
                                  <AbsenceStatusBadge status={status} />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Show More / Show Less Button */}
          {safeGroupedList.length > 5 && (
            <div className="pt-2 flex justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsListExpanded((prev) => !prev)}
                className="text-xs font-semibold h-8 px-3 gap-1.5 text-primary hover:text-primary hover:bg-primary/10 rounded-md transition-colors cursor-pointer"
              >
                {isListExpanded ? (
                  <>
                    <ChevronUp className="h-3.5 w-3.5" />
                    {t("dashboard.showLess")}
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3.5 w-3.5" />
                    {t("dashboard.showMore", { total: safeGroupedList.length })}
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Unified Bottom Summary Strip (Placed Below Both Left & Right Sections) */}
      {summary && (
        <div className="border-t border-border/40 px-6 py-3.5 bg-muted/30 flex flex-wrap items-center justify-between gap-4">
          <span className="text-xs font-medium text-muted-foreground">
            Total Ringkasan Ketidakhadiran:
          </span>

          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground font-medium">Total Tidak Hadir:</span>
              <span className="font-bold font-mono text-foreground">{summary.totalAbsent}</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
              <span className="text-muted-foreground font-medium">{t("dashboard.sakit")}:</span>
              <span className="font-bold font-mono text-foreground">{summary.sakitCount}</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
              <span className="text-muted-foreground font-medium">{t("dashboard.izin")}:</span>
              <span className="font-bold font-mono text-foreground">{summary.izinCount}</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />
              <span className="text-muted-foreground font-medium">{t("dashboard.alfa")}:</span>
              <span className="font-bold font-mono text-foreground">{summary.alfaCount}</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
