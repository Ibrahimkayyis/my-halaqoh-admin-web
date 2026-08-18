"use client";

import { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
} from "recharts";
import { Sparkles, TrendingUp, Users, CheckCircle2, AlertCircle, RefreshCw, BookOpen, Award } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  useDashboardHafalan,
  type KelasHafalanStat,
  type ProgramHafalanStat,
} from "../hooks/use-dashboard-hafalan";

type LevelFilter = "all" | "smp" | "sma";

interface SingleProgramTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: {
      kelas: string;
      percentage: number;
      stat: ProgramHafalanStat;
    };
  }>;
  label?: string;
  accentColor: string;
  programName: string;
}

function SingleProgramTooltip({
  active,
  payload,
  label,
  accentColor,
  programName,
}: SingleProgramTooltipProps) {
  const { t } = useTranslation(["dashboard", "common"]);

  if (active && payload && payload.length) {
    const data = payload[0]?.payload;
    const stat = data?.stat;

    if (!stat) return null;

    return (
      <div className="p-3.5 rounded-lg bg-popover border border-border/80 text-popover-foreground shadow-md text-xs space-y-2 min-w-[190px]">
        <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
          <p className="font-semibold text-foreground">{label}</p>
          <span
            className="text-[10px] font-medium px-1.5 py-0.5 rounded-sm"
            style={{
              backgroundColor: `${accentColor}15`,
              color: accentColor,
            }}
          >
            {programName}
          </span>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
              <span
                className="h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: accentColor }}
              />
              {t("charts.capaianTarget", "Capaian Target")}
            </span>
            <span className="font-bold font-mono text-foreground text-sm">
              {stat.hasTarget ? `${stat.percentage}%` : (
                <span className="text-muted-foreground/80 font-normal italic text-[11px]">
                  {t("charts.noTarget", "Belum ada target")}
                </span>
              )}
            </span>
          </div>

          <div className="pl-3.5 flex items-center justify-between text-[11px] text-muted-foreground pt-0.5 border-t border-border/20">
            {stat.hasTarget ? (
              <>
                <span className="font-medium text-foreground/80">
                  {t("charts.targetJuzInfo", {
                    target: stat.targetJuz,
                    defaultValue: `Target ${stat.targetJuz} Juz`,
                  })}
                </span>
                <span className="font-mono">
                  {t("charts.santriRatio", {
                    achieved: stat.achievedSantri,
                    total: stat.totalSantri,
                    defaultValue: `${stat.achievedSantri}/${stat.totalSantri} santri`,
                  })}
                </span>
              </>
            ) : (
              <span>
                {stat.totalSantri > 0
                  ? `${stat.totalSantri} santri aktif`
                  : t("charts.noSantriInCohort", "0 santri")}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }
  return null;
}

interface ProgramCardProps {
  program: "R" | "T";
  stats: KelasHafalanStat[];
  avgPercentage: number;
  achievedCount: number;
  totalCount: number;
  academicSubtitle: string;
}

function ProgramHafalanCard({
  program,
  stats,
  avgPercentage,
  achievedCount,
  totalCount,
  academicSubtitle,
}: ProgramCardProps) {
  const { t } = useTranslation(["dashboard", "common"]);
  const [levelFilter, setLevelFilter] = useState<LevelFilter>("all");

  const isReguler = program === "R";
  const accentColor = isReguler ? "#115D69" : "#3B82F6";
  const Icon = isReguler ? BookOpen : Award;

  const title = isReguler
    ? t("charts.programRegulerTitle", "Target Hafalan — Program Reguler")
    : t("charts.programTakhassusTitle", "Target Hafalan — Program Takhassus");

  const programName = isReguler
    ? t("charts.programReguler", "Program Reguler")
    : t("charts.programTakhassus", "Program Takhassus");

  const levelFilters: { id: LevelFilter; label: string }[] = [
    { id: "all", label: t("charts.filterAll", "Semua Kelas") },
    { id: "smp", label: t("charts.filterSmp", "SMP (Kelas 7–9)") },
    { id: "sma", label: t("charts.filterSma", "SMA (Kelas 10–12)") },
  ];

  const filteredStats = useMemo(() => {
    switch (levelFilter) {
      case "smp":
        return stats.slice(0, 3);
      case "sma":
        return stats.slice(3, 6);
      default:
        return stats;
    }
  }, [stats, levelFilter]);

  const chartData = useMemo(() => {
    return filteredStats.map((s) => {
      const stat = isReguler ? s.regulerStat : s.takhassusStat;
      return {
        kelas: s.kelas,
        percentage: stat.percentage,
        stat,
      };
    });
  }, [filteredStats, isReguler]);

  return (
    <Card className="rounded-xl border border-border/60 bg-card shadow-xs overflow-hidden flex flex-col justify-between">
      <div>
        {/* Header Bar */}
        <CardHeader className="px-5 py-4 border-b border-border/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div
                  className="p-1.5 rounded-md"
                  style={{
                    backgroundColor: `${accentColor}15`,
                    color: accentColor,
                  }}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-semibold text-foreground tracking-tight">
                  {title}
                </h3>
              </div>
              <p className="text-xs text-muted-foreground font-normal">
                <span className="font-medium text-foreground/80">{academicSubtitle}</span>
              </p>
            </div>

            {/* Level Filter Segmented Control */}
            <div className="inline-flex items-center p-0.5 rounded-lg bg-muted/60 border border-border/40 self-start sm:self-auto shrink-0">
              {levelFilters.map((opt) => {
                const isActive = levelFilter === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setLevelFilter(opt.id)}
                    className={cn(
                      "px-2 py-0.5 text-[11px] font-medium rounded-md transition-all duration-150 cursor-pointer select-none",
                      isActive
                        ? "bg-background text-foreground shadow-xs font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </CardHeader>

        {/* Recharts Bar Chart Area */}
        <CardContent className="p-5 space-y-5">
          <div className="h-[260px] w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 22, right: 10, left: -15, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--border)"
                  opacity={0.5}
                />
                <XAxis
                  dataKey="kelas"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: "var(--border)" }}
                />
                <YAxis
                  domain={[0, 100]}
                  unit="%"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: "var(--border)" }}
                />
                <Tooltip
                  content={
                    <SingleProgramTooltip
                      accentColor={accentColor}
                      programName={programName}
                    />
                  }
                />
                <Bar
                  dataKey="percentage"
                  fill={accentColor}
                  radius={[5, 5, 0, 0]}
                  maxBarSize={38}
                >
                  <LabelList
                    dataKey="percentage"
                    position="top"
                    content={(props: any) => {
                      const { x, y, width, value, index } = props;
                      const stat = chartData[index]?.stat;
                      const displayVal = stat?.hasTarget ? `${value}%` : "0%";
                      return (
                        <text
                          x={Number(x) + Number(width) / 2}
                          y={Number(y) - 6}
                          textAnchor="middle"
                          fontSize={11}
                          fontWeight={600}
                          className="fill-foreground font-mono"
                        >
                          {displayVal}
                        </text>
                      );
                    }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </div>

      {/* Summary Footer Cards */}
      <div className="p-5 pt-0">
        <div className="grid grid-cols-3 gap-2.5 pt-3.5 border-t border-border/40">
          <div className="p-3 rounded-lg bg-muted/30 border border-border/30 space-y-0.5">
            <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
              <span
                className="h-1.5 w-1.5 rounded-full shrink-0"
                style={{ backgroundColor: accentColor }}
              />
              {t("charts.avgCapaian", "Rata-Rata")}
            </span>
            <p
              className="text-lg font-bold font-mono"
              style={{ color: accentColor }}
            >
              {avgPercentage}%
            </p>
          </div>

          <div className="p-3 rounded-lg bg-muted/30 border border-border/30 space-y-0.5">
            <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
              {t("charts.santriAchievedCount", "Tercapai")}
            </span>
            <p className="text-lg font-bold font-mono text-foreground">
              {achievedCount}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-muted/30 border border-border/30 space-y-0.5">
            <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
              <Users className="h-3 w-3 text-muted-foreground shrink-0" />
              {t("charts.totalSantriProgram", "Total Santri")}
            </span>
            <p className="text-lg font-bold font-mono text-foreground">
              {totalCount}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function HafalanAchievementChart() {
  const { t } = useTranslation(["dashboard", "common"]);

  const {
    stats,
    summary,
    tahunAjaran,
    semesterAktif,
    isLoading,
    isError,
    refetch,
  } = useDashboardHafalan();

  // Loading skeleton state (renders 2 card skeletons in grid)
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {[0, 1].map((i) => (
          <Card key={i} className="rounded-xl border border-border/60 bg-card shadow-xs overflow-hidden">
            <CardHeader className="px-5 py-4 border-b border-border/40">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1.5">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-3.5 w-64" />
                </div>
                <Skeleton className="h-7 w-48 rounded-lg" />
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-5">
              <Skeleton className="h-[260px] w-full rounded-lg" />
              <div className="grid grid-cols-3 gap-2.5 pt-3.5 border-t border-border/40">
                <Skeleton className="h-14 w-full rounded-lg" />
                <Skeleton className="h-14 w-full rounded-lg" />
                <Skeleton className="h-14 w-full rounded-lg" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <Card className="rounded-xl border border-border/60 bg-card shadow-xs overflow-hidden">
        <CardContent className="p-12 flex flex-col items-center justify-center text-center space-y-3">
          <div className="p-3 rounded-full bg-rose-500/10 text-rose-500">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">
              {t("charts.hafalanError", "Gagal memuat statistik target hafalan")}
            </p>
            <p className="text-xs text-muted-foreground max-w-sm">
              {t("common:error.refreshPrompt", "Terjadi kesalahan saat mengambil data hafalan. Silakan coba muat ulang.")}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="mt-2 text-xs gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            {t("common:actions.retry", "Coba Lagi")}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Subtitle with Academic context
  const academicSubtitle = semesterAktif
    ? tahunAjaran
      ? t("charts.hafalanAcademicInfo", {
          semester: semesterAktif,
          tahunAjaran: tahunAjaran,
          defaultValue: `Semester ${semesterAktif} • ${tahunAjaran}`,
        })
      : t("charts.hafalanSemesterOnly", {
          semester: semesterAktif,
          defaultValue: `Semester ${semesterAktif}`,
        })
    : t("charts.hafalanNoTargetGlobal", "Target belum diatur");

  return (
    <div className="space-y-4">
      {/* 2 Separate Charts: Program Reguler & Program Takhassus */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Card 1: Program Reguler */}
        <ProgramHafalanCard
          program="R"
          stats={stats}
          avgPercentage={summary.avgReguler}
          achievedCount={summary.totalRegulerAchieved}
          totalCount={summary.totalRegulerSantri}
          academicSubtitle={academicSubtitle}
        />

        {/* Card 2: Program Takhassus */}
        <ProgramHafalanCard
          program="T"
          stats={stats}
          avgPercentage={summary.avgTakhassus}
          achievedCount={summary.totalTakhassusAchieved}
          totalCount={summary.totalTakhassusSantri}
          academicSubtitle={academicSubtitle}
        />
      </div>
    </div>
  );
}
