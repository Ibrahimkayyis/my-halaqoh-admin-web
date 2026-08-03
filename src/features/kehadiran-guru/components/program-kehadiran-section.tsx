"use client";

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronUp,
  Users,
  Clock,
  BookOpen,
  Filter,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useProgramKehadiranGuru } from "../hooks/use-kehadiran-guru";
import { useAutoSession } from "../hooks/use-auto-session";
import type {
  SesiHalaqoh,
  StatusFilter,
  GuruSessionAttendance,
} from "../types/kehadiran-guru.types";
import { SESI_REGULER, SESI_TAKHASSUS } from "../types/kehadiran-guru.types";

interface ProgramKehadiranSectionProps {
  programType: "R" | "T";
  titleKey: string;
}

const STATUS_COLORS = {
  active: "hsl(152, 69%, 41%)",     // Emerald
  inactive: "hsl(0, 72%, 51%)",     // Red
  noHalaqoh: "hsl(215, 16%, 47%)",  // Muted gray
};

/** Colored status text matching reference design with Red for Inactive */
function StatusText({ status }: { status: GuruSessionAttendance["status"] }) {
  const { t } = useTranslation("kehadiranGuru");

  switch (status) {
    case "active":
      return (
        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
          {t("status.active")}
        </span>
      );
    case "inactive":
      return (
        <span className="font-semibold text-red-600 dark:text-red-400">
          {t("status.inactive")}
        </span>
      );
    case "no-halaqoh":
      return (
        <span className="font-medium text-slate-400 dark:text-slate-500">
          {t("status.noHalaqoh")}
        </span>
      );
  }
}

export function ProgramKehadiranSection({ programType, titleKey }: ProgramKehadiranSectionProps) {
  const { t, i18n } = useTranslation(["kehadiranGuru", "common"]);

  // Independent Date Filter (default today)
  const [selectedDateStr, setSelectedDateStr] = useState<string>(
    () => new Date().toISOString().split("T")[0]
  );

  // Realtime Auto-Switching Session Hook
  const { selectedSession, setSelectedSession, isAutoMode } = useAutoSession(programType);

  // Independent Status Filter (moved inside the Teacher Table header)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  // Expand / Collapse table state (default collapsed)
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Parse date
  const selectedDate = useMemo(() => {
    if (!selectedDateStr) return new Date();
    const [y, m, d] = selectedDateStr.split("-").map(Number);
    return new Date(y, m - 1, d);
  }, [selectedDateStr]);

  const locale = i18n.language?.startsWith("en") ? "en-US" : "id-ID";
  const formattedDateStr = useMemo(() => {
    return selectedDate.toLocaleDateString(locale, {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  }, [selectedDate, locale]);

  // Fetch program stats
  const { summary, guruList, isLoading } = useProgramKehadiranGuru(
    programType,
    selectedDate,
    selectedSession
  );

  const availableSessions = programType === "R" ? SESI_REGULER : SESI_TAKHASSUS;

  const filteredGuruList = useMemo(() => {
    if (statusFilter === "all") return guruList;
    return guruList.filter((g) => g.status === statusFilter);
  }, [guruList, statusFilter]);

  const displayedGuruList = useMemo(() => {
    if (isExpanded) return filteredGuruList;
    return filteredGuruList.slice(0, 5);
  }, [filteredGuruList, isExpanded]);

  const pieData = useMemo(() => {
    if (!summary) return [];
    const data = [
      { name: t("charts.activeGuru"), value: summary.activeCount, color: STATUS_COLORS.active },
      { name: t("charts.inactiveGuru"), value: summary.inactiveCount, color: STATUS_COLORS.inactive },
    ];
    if (summary.noHalaqohCount > 0) {
      data.push({
        name: t("charts.noHalaqohGuru"),
        value: summary.noHalaqohCount,
        color: STATUS_COLORS.noHalaqoh,
      });
    }
    return data.filter((d) => d.value > 0);
  }, [summary, t]);

  return (
    <div className="space-y-5">
      {/* 1. Header & Chart Card */}
      <Card className="rounded-[20px] border border-slate-200/80 dark:border-slate-800 bg-card shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden">
        {/* Header background same as card (bg-card), Primary colored title */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/80 bg-card">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg font-bold text-primary tracking-tight">
                {t(titleKey)}
              </CardTitle>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                <Clock className="h-3.5 w-3.5 text-primary/70 shrink-0" />
                {t("charts.sessionInfo", {
                  session: t(`sesi.${selectedSession}`),
                  date: formattedDateStr,
                })}
              </p>
            </div>

            {/* Date & Session Filters with White Background and wider Date picker */}
            <div className="flex items-center gap-2">
              {/* Wider Date Input with pure white background */}
              <div className="relative">
                <Input
                  type="date"
                  value={selectedDateStr}
                  onChange={(e) => e.target.value && setSelectedDateStr(e.target.value)}
                  className="h-8 w-[145px] sm:w-[155px] pl-7 pr-2 text-[11px] font-medium bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
                />
                <CalendarIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
              </div>

              {/* Session Select with pure white background */}
              <Select value={selectedSession} onValueChange={(v) => setSelectedSession(v as SesiHalaqoh)}>
                <SelectTrigger className="h-8 w-[110px] text-[11px] font-medium bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                  <SelectValue placeholder={t("filters.session")} />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800 shadow-lg p-1 bg-white dark:bg-slate-900">
                  {availableSessions.map((sesi) => (
                    <SelectItem key={sesi} value={sesi} className="text-[11px] font-medium rounded-lg py-1.5 px-2.5 focus:bg-primary/10 focus:text-primary">
                      {t(`sesi.${sesi}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <CardContent className="p-5 space-y-4">
          {/* Donut Chart */}
          <div className="h-[190px] w-full relative">
            {isLoading ? (
              <div className="h-full w-full bg-muted/20 animate-pulse rounded-xl" />
            ) : pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid var(--color-border)",
                      boxShadow: "0 8px 20px -4px rgb(0 0 0 / 0.1)",
                      backgroundColor: "var(--color-card)",
                      color: "var(--color-foreground)",
                      fontSize: "12px",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={28}
                    formatter={(value: string) => (
                      <span style={{ color: "var(--color-foreground)", fontSize: "11px", fontWeight: 500 }}>
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground text-xs font-medium">
                {t("table.noData")}
              </div>
            )}

            {/* Center Percentage Badge */}
            {summary && summary.totalWithHalaqoh > 0 && !isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-7">
                <span className="text-2xl font-extrabold text-foreground tracking-tight">
                  {summary.activePercentage}%
                </span>
                <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">
                  {t("charts.activePercentage")}
                </span>
              </div>
            )}
          </div>

          {/* Stat Badges Grid */}
          {summary && (
            <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex flex-col items-center p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                <span className="text-xs font-semibold">{t("status.active")}</span>
                <span className="text-lg font-extrabold mt-0.5">{summary.activeCount}</span>
              </div>

              <div className="flex flex-col items-center p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400">
                <span className="text-xs font-semibold">{t("status.inactive")}</span>
                <span className="text-lg font-extrabold mt-0.5">{summary.inactiveCount}</span>
              </div>

              <div className="flex flex-col items-center p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-800">
                <span className="text-xs font-semibold">{t("status.noHalaqoh")}</span>
                <span className="text-lg font-extrabold mt-0.5">{summary.noHalaqohCount}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2. Program Teacher List Table */}
      <Card className="rounded-[20px] border border-slate-200/80 dark:border-slate-800 bg-card shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden">
        {/* Table Title Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 bg-slate-50/40 dark:bg-slate-900/20">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            <h4 className="text-sm font-bold text-foreground tracking-tight">
              {t(programType === "R" ? "sections.regulerList" : "sections.takhassusList")}
            </h4>
            <Badge variant="secondary" className="font-semibold text-xs rounded-full px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {t("sections.teacherCount", { count: filteredGuruList.length })}
            </Badge>
          </div>

          {/* Status Filter Pill with Pure White Background */}
          <div className="flex items-center gap-1.5">
            <Filter className="h-3 w-3 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
              <SelectTrigger className="h-8 w-[120px] text-[11px] font-medium bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                <SelectValue placeholder={t("filters.status")} />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800 shadow-lg p-1 bg-white dark:bg-slate-900">
                <SelectItem value="all" className="text-[11px] font-medium rounded-lg py-1.5 px-2.5 focus:bg-primary/10 focus:text-primary">{t("filters.allStatus")}</SelectItem>
                <SelectItem value="active" className="text-[11px] font-medium rounded-lg py-1.5 px-2.5 focus:bg-primary/10 focus:text-primary">{t("status.active")}</SelectItem>
                <SelectItem value="inactive" className="text-[11px] font-medium rounded-lg py-1.5 px-2.5 focus:bg-primary/10 focus:text-primary">{t("status.inactive")}</SelectItem>
                <SelectItem value="no-halaqoh" className="text-[11px] font-medium rounded-lg py-1.5 px-2.5 focus:bg-primary/10 focus:text-primary">{t("status.noHalaqoh")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-100/80 dark:bg-slate-800/60 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 border-none">
                <TableHead className="w-10 text-center font-semibold text-slate-700 dark:text-slate-300 text-xs py-3">{t("table.no")}</TableHead>
                <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-xs py-3">{t("table.name")}</TableHead>
                <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-xs py-3">{t("table.halaqoh")}</TableHead>
                <TableHead className="w-14 font-semibold text-slate-700 dark:text-slate-300 text-xs py-3 text-center">{t("table.class")}</TableHead>
                <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-xs py-3">{t("table.status")}</TableHead>
                <TableHead className="text-right font-semibold text-slate-700 dark:text-slate-300 text-xs py-3">{t("table.lastActivity")}</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <TableCell key={j} className="py-3.5">
                        <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 animate-pulse rounded-lg" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : displayedGuruList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-28 text-center">
                    <div className="flex flex-col items-center justify-center gap-1.5 text-muted-foreground">
                      <Users className="h-5 w-5 text-muted-foreground/50" />
                      <p className="text-xs font-semibold text-foreground">{t("table.noData")}</p>
                      <p className="text-[11px] text-muted-foreground">{t("table.noDataDesc")}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                displayedGuruList.map((guru, index) => (
                  <TableRow
                    key={guru.guruId}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors duration-150 border-b border-slate-100 dark:border-slate-800/80"
                  >
                    <TableCell className="text-center text-xs text-slate-500 font-mono font-medium py-3.5">
                      {index + 1}
                    </TableCell>

                    {/* Teacher Full Name */}
                    <TableCell className="py-3.5">
                      <div className="space-y-0.5">
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 leading-snug whitespace-normal break-words">
                          {guru.guruNama}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          NIP: {guru.guruNip}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell className="text-xs text-slate-600 dark:text-slate-300 font-medium py-3.5">
                      {guru.halaqohNama ?? <span className="text-slate-400 italic">-</span>}
                    </TableCell>

                    <TableCell className="text-xs text-center font-semibold text-slate-700 dark:text-slate-200 py-3.5">
                      {guru.kelas ? (
                        <span className="inline-block bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md font-semibold text-[11px]">
                          {guru.kelas}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-normal">-</span>
                      )}
                    </TableCell>

                    {/* Status Column */}
                    <TableCell className="text-xs py-3.5">
                      <StatusText status={guru.status} />
                    </TableCell>

                    <TableCell className="text-right text-xs font-mono text-slate-500 dark:text-slate-400 py-3.5">
                      {guru.absensiTime
                        ? guru.absensiTime.toLocaleTimeString(locale, {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : <span className="text-slate-400 italic">-</span>}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Clean Action Footer for Expand / Collapse */}
        {filteredGuruList.length > 5 && (
          <div className="border-t border-slate-100 dark:border-slate-800 p-2.5 bg-slate-50/50 dark:bg-slate-900/30 flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded((prev) => !prev)}
              className="text-xs font-semibold h-8 px-4 gap-1.5 text-primary hover:text-primary hover:bg-primary/10 rounded-full transition-all"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-3.5 w-3.5" />
                  {t("sections.showLess")}
                </>
              ) : (
                <>
                  <ChevronDown className="h-3.5 w-3.5" />
                  {t("sections.showMore", { total: filteredGuruList.length })}
                </>
              )}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
