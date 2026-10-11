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
  Radio,
} from "lucide-react";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
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
        <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {t("status.active")}
        </span>
      );
    case "inactive":
      return (
        <span className="inline-flex items-center gap-1.5 font-semibold text-red-600 dark:text-red-400">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
          {t("status.inactive")}
        </span>
      );
    case "no-halaqoh":
      return (
        <span className="inline-flex items-center gap-1.5 font-medium text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60" />
          {t("status.noHalaqoh")}
        </span>
      );
  }
}

/** Status badge pill for mobile stacked card view */
function StatusBadge({ status }: { status: GuruSessionAttendance["status"] }) {
  const { t } = useTranslation("kehadiranGuru");

  switch (status) {
    case "active":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {t("status.active")}
        </span>
      );
    case "inactive":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
          {t("status.inactive")}
        </span>
      );
    case "no-halaqoh":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground border border-border/40">
          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60" />
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
      <Card className="rounded-[20px] border border-border/60 bg-card shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden">
        {/* Header background same as card (bg-card), Primary colored title */}
        <div className="p-4 sm:p-5 border-b border-border/40 bg-card">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1.5">
              <CardTitle className="text-base sm:text-lg font-bold text-primary tracking-tight">
                {t(titleKey)}
              </CardTitle>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                  <Clock className="h-3.5 w-3.5 text-primary/70 shrink-0" />
                  {t("charts.sessionInfo", {
                    session: t(`sesi.${selectedSession}`),
                    date: formattedDateStr,
                  })}
                </p>
                <Badge
                  variant="outline"
                  className={`text-[10px] font-semibold px-2 py-0.5 border rounded-full ${
                    isAutoMode
                      ? "bg-primary/10 text-primary border-primary/30"
                      : "bg-muted text-muted-foreground border-border/50"
                  }`}
                >
                  {isAutoMode ? (
                    <span className="flex items-center gap-1">
                      <Radio className="h-2.5 w-2.5 animate-pulse text-primary" />
                      {t("filters.autoMode", { defaultValue: "Otomatis" })}
                    </span>
                  ) : (
                    t("filters.manualMode", { defaultValue: "Manual" })
                  )}
                </Badge>
              </div>
            </div>

            {/* Date & Session Filters */}
            <div className="w-full sm:w-auto grid grid-cols-2 sm:flex sm:items-center gap-2">
              {/* Date Input */}
              <div className="relative w-full sm:w-[155px]">
                <Input
                  type="date"
                  value={selectedDateStr}
                  onChange={(e) => e.target.value && setSelectedDateStr(e.target.value)}
                  className="h-9 sm:h-8 w-full pl-7 pr-2 text-xs sm:text-[11px] font-medium bg-background border-border/60 rounded-xl shadow-xs hover:bg-accent/40 transition-all cursor-pointer"
                />
                <CalendarIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              </div>

              {/* Session Select */}
              <Select value={selectedSession} onValueChange={(v) => setSelectedSession(v as SesiHalaqoh)}>
                <SelectTrigger className="h-9 sm:h-8 w-full sm:w-[115px] text-xs sm:text-[11px] font-medium bg-background border-border/60 rounded-xl shadow-xs hover:bg-accent/40 transition-all cursor-pointer">
                  <SelectValue placeholder={t("filters.session")} />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/60 shadow-lg p-1 bg-card">
                  {availableSessions.map((sesi) => (
                    <SelectItem key={sesi} value={sesi} className="text-xs sm:text-[11px] font-medium rounded-lg py-1.5 px-2.5 focus:bg-primary/10 focus:text-primary cursor-pointer">
                      {t(`sesi.${sesi}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <CardContent className="p-4 sm:p-5 space-y-4">
          {/* Donut Chart */}
          <div className="h-[200px] sm:h-[220px] w-full relative">
            {isLoading ? (
              <div className="h-full w-full bg-muted/20 animate-pulse rounded-xl" />
            ) : pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={72}
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
                    height={32}
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
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8 sm:pb-9">
                <span className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  {summary.activePercentage}%
                </span>
                <span className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                  {t("charts.activePercentage")}
                </span>
              </div>
            )}
          </div>

          {/* Stat Badges Grid */}
          {summary && (
            <div className="grid grid-cols-3 gap-2 sm:gap-2.5 pt-3 border-t border-border/40">
              <div className="flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 min-w-0">
                <span className="text-[10px] sm:text-xs font-semibold truncate text-center w-full" title={t("status.active")}>
                  {t("status.active")}
                </span>
                <span className="text-base sm:text-xl font-extrabold mt-0.5">{summary.activeCount}</span>
              </div>

              <div className="flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 min-w-0">
                <span className="text-[10px] sm:text-xs font-semibold truncate text-center w-full" title={t("status.inactive")}>
                  {t("status.inactive")}
                </span>
                <span className="text-base sm:text-xl font-extrabold mt-0.5">{summary.inactiveCount}</span>
              </div>

              <div className="flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-xl bg-muted/60 text-muted-foreground border border-border/40 min-w-0">
                <span className="text-[10px] sm:text-xs font-semibold truncate text-center w-full" title={t("status.noHalaqoh")}>
                  {t("status.noHalaqoh")}
                </span>
                <span className="text-base sm:text-xl font-extrabold mt-0.5 text-foreground">{summary.noHalaqohCount}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2. Program Teacher List Table */}
      <Card className="rounded-[20px] border border-border/60 bg-card shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden">
        {/* Table Title Header */}
        <div className="px-4 sm:px-5 py-3 sm:py-3.5 border-b border-border/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 bg-muted/20">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary shrink-0" />
            <h4 className="text-sm font-bold text-foreground tracking-tight">
              {t(programType === "R" ? "sections.regulerList" : "sections.takhassusList")}
            </h4>
            <Badge variant="secondary" className="font-semibold text-xs rounded-full px-2 py-0.5 bg-muted text-muted-foreground">
              {t("sections.teacherCount", { count: filteredGuruList.length })}
            </Badge>
          </div>

          {/* Status Filter Pill */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <Filter className="h-3.5 w-3.5 text-muted-foreground shrink-0 hidden sm:block" />
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
              <SelectTrigger className="h-9 sm:h-8 w-full sm:w-[130px] text-xs sm:text-[11px] font-medium bg-background border-border/60 rounded-xl shadow-xs hover:bg-accent/40 transition-all cursor-pointer">
                <SelectValue placeholder={t("filters.status")} />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border/60 shadow-lg p-1 bg-card">
                <SelectItem value="all" className="text-xs sm:text-[11px] font-medium rounded-lg py-1.5 px-2.5 focus:bg-primary/10 focus:text-primary cursor-pointer">{t("filters.allStatus")}</SelectItem>
                <SelectItem value="active" className="text-xs sm:text-[11px] font-medium rounded-lg py-1.5 px-2.5 focus:bg-primary/10 focus:text-primary cursor-pointer">{t("status.active")}</SelectItem>
                <SelectItem value="inactive" className="text-xs sm:text-[11px] font-medium rounded-lg py-1.5 px-2.5 focus:bg-primary/10 focus:text-primary cursor-pointer">{t("status.inactive")}</SelectItem>
                <SelectItem value="no-halaqoh" className="text-xs sm:text-[11px] font-medium rounded-lg py-1.5 px-2.5 focus:bg-primary/10 focus:text-primary cursor-pointer">{t("status.noHalaqoh")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="w-full">
          <Table className="w-full">
            <TableHeader className="hidden md:table-header-group">
              <TableRow className="bg-muted/40 hover:bg-muted/40 border-b border-border/40">
                <TableHead className="w-10 text-center font-semibold text-foreground text-xs py-3">{t("table.no")}</TableHead>
                <TableHead className="font-semibold text-foreground text-xs py-3">{t("table.name")}</TableHead>
                <TableHead className="font-semibold text-foreground text-xs py-3">{t("table.halaqoh")}</TableHead>
                <TableHead className="w-16 font-semibold text-foreground text-xs py-3 text-center">{t("table.class")}</TableHead>
                <TableHead className="font-semibold text-foreground text-xs py-3">{t("table.status")}</TableHead>
                <TableHead className="text-right font-semibold text-foreground text-xs py-3">{t("table.lastActivity")}</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="grid grid-cols-1 gap-2.5 p-3.5 sm:p-4 md:p-0 md:table-row-group md:gap-0">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow
                    key={i}
                    className="flex flex-col p-3.5 rounded-xl border border-border/40 bg-card space-y-2 md:table-row md:p-0 md:border-0 md:border-b md:border-border/40 md:space-y-0"
                  >
                    <TableCell className="hidden md:table-cell py-3.5">
                      <div className="h-4 w-6 bg-muted animate-pulse rounded" />
                    </TableCell>
                    <TableCell className="p-0 md:px-4 md:py-3.5">
                      <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                    </TableCell>
                    <TableCell className="p-0 md:px-4 md:py-3.5">
                      <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                    </TableCell>
                    <TableCell className="p-0 md:px-4 md:py-3.5">
                      <div className="h-4 w-12 bg-muted animate-pulse rounded" />
                    </TableCell>
                    <TableCell className="p-0 md:px-4 md:py-3.5">
                      <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                    </TableCell>
                    <TableCell className="p-0 md:px-4 md:py-3.5">
                      <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                    </TableCell>
                  </TableRow>
                ))
              ) : displayedGuruList.length === 0 ? (
                <TableRow className="flex md:table-row">
                  <TableCell colSpan={6} className="w-full h-28 text-center p-4">
                    <div className="flex flex-col items-center justify-center gap-1.5 text-muted-foreground">
                      <Users className="h-5 w-5 text-muted-foreground/50" />
                      <p className="text-xs font-semibold text-foreground">
                        {statusFilter !== "all"
                          ? t("table.emptyStatusFilter", { defaultValue: "Tidak ada guru dengan status ini" })
                          : t("table.noData")}
                      </p>
                      <p className="text-[11px] text-muted-foreground">{t("table.noDataDesc")}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                displayedGuruList.map((guru, index) => (
                  <TableRow
                    key={guru.guruId}
                    className="flex flex-col p-3.5 rounded-xl border border-border/60 bg-card/60 shadow-xs transition-all space-y-2 md:table-row md:p-0 md:rounded-none md:border-0 md:border-b md:border-border/40 md:bg-transparent md:shadow-none md:space-y-0 hover:bg-accent/40"
                  >
                    {/* 1. Desktop Index */}
                    <TableCell className="hidden md:table-cell text-center text-xs text-muted-foreground font-mono font-medium py-3.5">
                      {index + 1}
                    </TableCell>

                    {/* 2. Teacher Full Name & NIP (Header on Mobile) */}
                    <TableCell className="flex md:table-cell items-start justify-between p-0 md:px-4 md:py-3.5 border-none">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <span className="flex md:hidden items-center justify-center h-5 w-5 rounded-md bg-muted text-[10px] font-mono font-bold text-muted-foreground shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <div className="min-w-0 space-y-0.5">
                          <p className="text-xs sm:text-sm font-semibold text-foreground leading-snug break-words">
                            {guru.guruNama}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-mono">
                            NIP: {guru.guruNip}
                          </p>
                        </div>
                      </div>
                      <div className="md:hidden shrink-0">
                        <StatusBadge status={guru.status} />
                      </div>
                    </TableCell>

                    {/* 3. Halaqoh */}
                    <TableCell className="flex md:table-cell items-center justify-between p-0 md:px-4 md:py-3.5 pt-1.5 md:pt-3.5 border-t border-border/30 md:border-t-0 text-xs">
                      <span className="text-xs font-medium text-muted-foreground md:hidden flex items-center gap-1.5">
                        <BookOpen className="h-3.5 w-3.5 text-primary" />
                        {t("table.halaqoh")}
                      </span>
                      <span className="text-xs text-foreground font-medium truncate max-w-[200px]">
                        {guru.halaqohNama ?? <span className="text-muted-foreground/60 italic">-</span>}
                      </span>
                    </TableCell>

                    {/* 4. Kelas */}
                    <TableCell className="flex md:table-cell items-center justify-between p-0 md:px-4 md:py-3.5 md:w-16 md:text-center text-xs">
                      <span className="text-xs font-medium text-muted-foreground md:hidden">{t("table.class")}</span>
                      {guru.kelas ? (
                        <span className="inline-block bg-muted text-foreground px-2 py-0.5 rounded-md font-semibold text-[11px]">
                          {guru.kelas}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/60 font-normal">-</span>
                      )}
                    </TableCell>

                    {/* 5. Status Column (Desktop only, mobile has it on card header) */}
                    <TableCell className="hidden md:table-cell text-xs py-3.5">
                      <StatusText status={guru.status} />
                    </TableCell>

                    {/* 6. Last Activity */}
                    <TableCell className="flex md:table-cell items-center justify-between p-0 md:px-4 md:py-3.5 pt-1.5 md:pt-3.5 border-t border-border/30 md:border-t-0 md:text-right text-xs">
                      <span className="text-[11px] font-medium text-muted-foreground md:hidden flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        {t("table.lastActivity")}
                      </span>
                      <span className="text-xs font-mono text-muted-foreground font-medium">
                        {guru.absensiTime
                          ? guru.absensiTime.toLocaleTimeString(locale, {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : <span className="text-muted-foreground/60 italic">-</span>}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Clean Action Footer for Expand / Collapse */}
        {filteredGuruList.length > 5 && (
          <div className="border-t border-border/40 p-2.5 bg-muted/20 flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded((prev) => !prev)}
              className="text-xs font-semibold h-9 sm:h-8 px-4 gap-1.5 text-primary hover:text-primary hover:bg-primary/10 rounded-full transition-all cursor-pointer"
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
