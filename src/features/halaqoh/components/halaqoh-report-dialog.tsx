"use client";

import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { pdf } from "@react-pdf/renderer";
import {
  FileText,
  Calendar as CalendarIcon,
  Download,
  Loader2,
  AlertCircle,
  Eye,
  ArrowLeft,
  Clock,
  ChevronLeft,
  ChevronRight,
  Check,
  Filter,
  BookOpen,
  UserCheck,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { useHalaqohReport } from "../hooks/use-halaqoh-report";
import { useHalaqohHafalanReport } from "../hooks/use-halaqoh-hafalan-report";
import { AbsenceReportPDF } from "./halaqoh-report-pdf";
import { HalaqohHafalanReportPDF } from "./halaqoh-hafalan-report-pdf";

export type HalaqohReportType = "presensi" | "hafalan";

interface HalaqohReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  halaqohId: string;
  halaqohNama: string;
  defaultReportType?: HalaqohReportType;
}

export type ReportRangeMode = "monthly" | "weekly" | "custom";

export interface WeekItem {
  weekIndex: number;
  label: string;
  startDate: Date;
  endDate: Date;
}

const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const SHORT_MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

/**
 * Generate Monday-to-Sunday weeks in a given year and month (matching mobile logic)
 */
export function getWeeksInMonth(year: number, month: number): WeekItem[] {
  const weeks: WeekItem[] = [];
  const firstDayOfMonth = new Date(year, month - 1, 1, 0, 0, 0, 0);
  const lastDayOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

  const currentStart = new Date(firstDayOfMonth);
  const dayOfWeek = currentStart.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  currentStart.setDate(currentStart.getDate() + diffToMonday);
  currentStart.setHours(0, 0, 0, 0);

  let weekIndex = 1;

  while (currentStart <= lastDayOfMonth) {
    const currentEnd = new Date(currentStart);
    currentEnd.setDate(currentEnd.getDate() + 6);
    currentEnd.setHours(23, 59, 59, 999);

    if (currentEnd >= firstDayOfMonth && currentStart <= lastDayOfMonth) {
      const startFmt = currentStart.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
      });
      const endFmt = currentEnd.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
      });

      weeks.push({
        weekIndex,
        label: `Pekan ${weekIndex} (Senin ${startFmt} – Minggu ${endFmt})`,
        startDate: new Date(currentStart),
        endDate: new Date(currentEnd),
      });
      weekIndex++;
    }

    currentStart.setDate(currentStart.getDate() + 7);
  }

  return weeks;
}

interface ModernMonthYearPickerProps {
  month: number;
  year: number;
  onSelect: (month: number, year: number) => void;
}

function ModernMonthYearPicker({
  month,
  year,
  onSelect,
}: ModernMonthYearPickerProps) {
  const [currentYear, setCurrentYear] = useState<number>(year);

  useEffect(() => {
    setCurrentYear(year);
  }, [year]);

  return (
    <div className="p-2.5 bg-muted/20 border border-border/50 rounded-xl space-y-2">
      {/* Year Navigation Bar */}
      <div className="flex items-center justify-between px-1">
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={() => setCurrentYear((prev) => prev - 1)}
          className="h-6 w-6 rounded-md hover:bg-background border border-transparent hover:border-border/40"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </Button>

        <span className="font-bold text-xs text-foreground tracking-tight">
          {currentYear}
        </span>

        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={() => setCurrentYear((prev) => prev + 1)}
          className="h-6 w-6 rounded-md hover:bg-background border border-transparent hover:border-border/40"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* 4x3 Month Grid Matrix */}
      <div className="grid grid-cols-4 gap-1">
        {SHORT_MONTH_NAMES.map((mName, idx) => {
          const mNum = idx + 1;
          const isSelected = month === mNum && year === currentYear;

          return (
            <button
              key={mName}
              type="button"
              onClick={() => onSelect(mNum, currentYear)}
              className={`h-7 rounded-md text-[11px] font-semibold transition-all select-none ${
                isSelected
                  ? "bg-primary text-primary-foreground font-bold shadow-xs scale-[0.98]"
                  : "bg-surface text-foreground hover:bg-accent/80 hover:text-accent-foreground border border-border/40"
              }`}
            >
              {mName}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function HalaqohReportDialog({
  open,
  onOpenChange,
  halaqohId,
  halaqohNama,
  defaultReportType = "presensi",
}: HalaqohReportDialogProps) {
  const { t } = useTranslation(["halaqoh", "common"]);

  const [reportType, setReportType] = useState<HalaqohReportType>(defaultReportType);

  const now = useMemo(() => new Date(), []);
  const [rangeMode, setRangeMode] = useState<ReportRangeMode>("monthly");
  const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());
  const [selectedWeek, setSelectedWeek] = useState<number>(1);

  // Custom date range default
  const defaultDates = useMemo(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30);

    return {
      startStr: start.toISOString().split("T")[0],
      endStr: end.toISOString().split("T")[0],
    };
  }, []);

  const [customStartStr, setCustomStartStr] = useState<string>(defaultDates.startStr);
  const [customEndStr, setCustomEndStr] = useState<string>(defaultDates.endStr);

  const [viewMode, setViewMode] = useState<"form" | "preview">("form");
  const [actionType, setActionType] = useState<"download" | "preview" | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [shouldFetch, setShouldFetch] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);

  // Calculate Monday-to-Sunday weeks for selected month/year
  const availableWeeks = useMemo(() => {
    return getWeeksInMonth(selectedYear, selectedMonth);
  }, [selectedYear, selectedMonth]);

  // Clean up blob URL
  useEffect(() => {
    return () => {
      if (previewBlobUrl) {
        URL.revokeObjectURL(previewBlobUrl);
      }
    };
  }, [previewBlobUrl]);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      if (previewBlobUrl) {
        URL.revokeObjectURL(previewBlobUrl);
        setPreviewBlobUrl(null);
      }
      setViewMode("form");
      setActionType(null);
      setIsGenerating(false);
      setShouldFetch(false);
    }
    onOpenChange(newOpen);
  };

  // Calculate parsed start and end dates based on range mode
  const { parsedStartDate, parsedEndDate, periodLabel } = useMemo(() => {
    if (rangeMode === "monthly") {
      const start = new Date(selectedYear, selectedMonth - 1, 1, 0, 0, 0, 0);
      const end = new Date(selectedYear, selectedMonth, 0, 23, 59, 59, 999);
      const label = `Bulanan: ${MONTH_NAMES[selectedMonth - 1]} ${selectedYear}`;
      return { parsedStartDate: start, parsedEndDate: end, periodLabel: label };
    }

    if (rangeMode === "weekly") {
      const weekObj =
        availableWeeks.find((w) => w.weekIndex === selectedWeek) ?? availableWeeks[0];
      if (!weekObj) {
        return { parsedStartDate: null, parsedEndDate: null, periodLabel: "Pekanan" };
      }
      const label = `Pekanan: ${weekObj.label}`;
      return {
        parsedStartDate: weekObj.startDate,
        parsedEndDate: weekObj.endDate,
        periodLabel: label,
      };
    }

    // Custom
    if (!customStartStr || !customEndStr) {
      return { parsedStartDate: null, parsedEndDate: null, periodLabel: "Kustom" };
    }

    const [sy, sm, sd] = customStartStr.split("-").map(Number);
    const [ey, em, ed] = customEndStr.split("-").map(Number);
    const start = new Date(sy, sm - 1, sd, 0, 0, 0, 0);
    const end = new Date(ey, em - 1, ed, 23, 59, 59, 999);
    const label = `Kustom: ${customStartStr} s/d ${customEndStr}`;

    return { parsedStartDate: start, parsedEndDate: end, periodLabel: label };
  }, [
    rangeMode,
    selectedMonth,
    selectedYear,
    selectedWeek,
    availableWeeks,
    customStartStr,
    customEndStr,
  ]);

  // Validation
  const validationError = useMemo(() => {
    if (!parsedStartDate || !parsedEndDate) {
      return "Silakan tentukan tanggal mulai dan selesai laporan.";
    }
    if (parsedStartDate > parsedEndDate) {
      return "Tanggal mulai harus sebelum atau sama dengan tanggal selesai.";
    }
    const diffTime = Math.abs(parsedEndDate.getTime() - parsedStartDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 180) {
      return "Rentang waktu maksimal adalah 6 bulan (180 hari).";
    }
    return null;
  }, [parsedStartDate, parsedEndDate]);

  // Hook for Presensi Report
  const { reportData: presensiReportData, isLoading: presensiLoading } = useHalaqohReport(
    halaqohId,
    parsedStartDate,
    parsedEndDate,
    rangeMode,
    periodLabel,
    shouldFetch && reportType === "presensi"
  );

  // Hook for Hafalan Report
  const { reportData: hafalanReportData, isLoading: hafalanLoading } =
    useHalaqohHafalanReport(
      halaqohId,
      parsedStartDate,
      parsedEndDate,
      periodLabel,
      shouldFetch && reportType === "hafalan"
    );

  const isDataLoading = reportType === "presensi" ? presensiLoading : hafalanLoading;
  const activeReportData = reportType === "presensi" ? presensiReportData : hafalanReportData;

  const handleStartProcess = (type: "download" | "preview") => {
    if (validationError) return;

    if (type === "preview" && previewBlobUrl && viewMode === "form") {
      setViewMode("preview");
      return;
    }

    setErrorMessage(null);
    setActionType(type);
    setIsGenerating(true);
    setShouldFetch(true);
  };

  useEffect(() => {
    if (shouldFetch && !isDataLoading && activeReportData && isGenerating && actionType) {
      const processPdf = async () => {
        try {
          const logoUrl = "/images/my_halaqoh_logo_new.png";

          let doc: React.JSX.Element;
          let filenamePrefix: string;

          if (reportType === "presensi") {
            doc = <AbsenceReportPDF reportData={activeReportData as any} logoUrl={logoUrl} />;
            filenamePrefix = "Laporan_Absensi_Halaqoh";
          } else {
            doc = <HalaqohHafalanReportPDF reportData={activeReportData as any} logoUrl={logoUrl} />;
            filenamePrefix = "Laporan_Hafalan_Halaqoh";
          }

          const asBlob = await pdf(doc).toBlob();
          const url = URL.createObjectURL(asBlob);

          const fileStart = parsedStartDate?.toISOString().split("T")[0] ?? "start";
          const fileEnd = parsedEndDate?.toISOString().split("T")[0] ?? "end";
          const cleanHalaqohName = halaqohNama.replace(/\s+/g, "_");

          if (actionType === "download") {
            const link = document.createElement("a");
            link.href = url;
            link.download = `${filenamePrefix}_${cleanHalaqohName}_${fileStart}_s-d_${fileEnd}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            handleOpenChange(false);
          } else if (actionType === "preview") {
            if (previewBlobUrl) {
              URL.revokeObjectURL(previewBlobUrl);
            }
            setPreviewBlobUrl(url);
            setViewMode("preview");
          }
        } catch (err: any) {
          console.error("PDF Generation error:", err);
          setErrorMessage("Gagal membuat file PDF. Silakan coba lagi.");
        } finally {
          setIsGenerating(false);
          setShouldFetch(false);
          setActionType(null);
        }
      };

      processPdf();
    }
  }, [
    shouldFetch,
    isDataLoading,
    activeReportData,
    isGenerating,
    actionType,
    reportType,
    halaqohNama,
    parsedStartDate,
    parsedEndDate,
    previewBlobUrl,
  ]);

  const handleDownloadFromPreview = () => {
    if (!previewBlobUrl) return;
    const fileStart = parsedStartDate?.toISOString().split("T")[0] ?? "start";
    const fileEnd = parsedEndDate?.toISOString().split("T")[0] ?? "end";
    const cleanHalaqohName = halaqohNama.replace(/\s+/g, "_");
    const filenamePrefix =
      reportType === "presensi" ? "Laporan_Absensi_Halaqoh" : "Laporan_Hafalan_Halaqoh";

    const link = document.createElement("a");
    link.href = previewBlobUrl;
    link.download = `${filenamePrefix}_${cleanHalaqohName}_${fileStart}_s-d_${fileEnd}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const invalidatePreview = () => {
    if (previewBlobUrl) {
      URL.revokeObjectURL(previewBlobUrl);
      setPreviewBlobUrl(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={
          viewMode === "preview"
            ? "sm:max-w-5xl w-[95vw] h-[88vh] flex flex-col p-6 rounded-xl overflow-hidden"
            : "sm:max-w-[500px] w-[95vw] max-h-[90vh] flex flex-col p-0 rounded-xl overflow-hidden shadow-2xl"
        }
      >
        {viewMode === "preview" ? (
          /* PREVIEW MODE VIEW */
          <div className="flex flex-col h-full p-6 space-y-4">
            <DialogHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/40">
              <div className="space-y-1">
                <DialogTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                  <FileText className="h-4 w-4 text-primary" />
                  {reportType === "presensi"
                    ? "Pratinjau Laporan Presensi Halaqoh"
                    : "Pratinjau Laporan Hafalan Halaqoh"}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground flex items-center gap-2">
                  <span>Halaqoh: {halaqohNama}</span>
                  <span>•</span>
                  <span>{periodLabel}</span>
                </DialogDescription>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode("form")}
                  className="h-8 text-xs gap-1.5"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Kembali ke Konfigurasi
                </Button>

                <Button
                  type="button"
                  size="sm"
                  onClick={handleDownloadFromPreview}
                  className="h-8 text-xs gap-1.5 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Download className="h-3.5 w-3.5" />
                  {t("halaqoh:detail.downloadPdf")}
                </Button>
              </div>
            </DialogHeader>

            <div className="flex-1 w-full bg-slate-900/10 rounded-lg overflow-hidden border border-border/50 shadow-inner">
              {previewBlobUrl ? (
                <iframe
                  src={previewBlobUrl}
                  className="w-full h-full border-none"
                  title="Pratinjau PDF Laporan Halaqoh"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="text-xs">Memuat pratinjau PDF...</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* FORM CONFIGURATION VIEW (Fixed Header, Scrollable Body, Sticky Footer) */
          <>
            {/* Header (Sticky / Non-scrollable) */}
            <div className="px-5 pt-5 pb-3 border-b border-border/40 shrink-0">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                  <FileText className="h-4.5 w-4.5 text-primary" />
                  {t("halaqoh:detail.reportDialogTitle")}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Pilih jenis laporan dan rentang waktu yang ingin dicetak dalam format PDF.
                </DialogDescription>
              </DialogHeader>
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto px-5 py-3.5 space-y-3.5">
              {/* Report Type Selector (Presensi vs Hafalan) */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Jenis Laporan
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-muted/40 rounded-xl border border-border/40">
                  <button
                    type="button"
                    onClick={() => {
                      setReportType("presensi");
                      invalidatePreview();
                    }}
                    className={`flex items-center gap-2 p-2 rounded-lg text-left transition-all ${
                      reportType === "presensi"
                        ? "bg-background text-primary shadow-xs font-bold border border-border/40"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <UserCheck className="h-4 w-4 shrink-0 text-primary" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold leading-tight">Laporan Presensi</p>
                      <p className="text-[10px] text-muted-foreground font-normal truncate">
                        Rekapitulasi Kehadiran
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setReportType("hafalan");
                      invalidatePreview();
                    }}
                    className={`flex items-center gap-2 p-2 rounded-lg text-left transition-all ${
                      reportType === "hafalan"
                        ? "bg-background text-primary shadow-xs font-bold border border-border/40"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <BookOpen className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold leading-tight">Laporan Hafalan</p>
                      <p className="text-[10px] text-muted-foreground font-normal truncate">
                        Rekapitulasi Setoran
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Segmented Range Mode Selector */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  {t("halaqoh:detail.reportRangeMode")}
                </label>
                <div className="grid grid-cols-3 gap-1 p-1 bg-muted/40 rounded-xl border border-border/40">
                  <button
                    type="button"
                    onClick={() => {
                      setRangeMode("monthly");
                      invalidatePreview();
                    }}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-all ${
                      rangeMode === "monthly"
                        ? "bg-background text-primary shadow-xs font-bold border border-border/40"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <CalendarIcon className="h-3.5 w-3.5" />
                    Bulanan
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRangeMode("weekly");
                      invalidatePreview();
                    }}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-all ${
                      rangeMode === "weekly"
                        ? "bg-background text-primary shadow-xs font-bold border border-border/40"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Clock className="h-3.5 w-3.5" />
                    Pekanan
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRangeMode("custom");
                      invalidatePreview();
                    }}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-all ${
                      rangeMode === "custom"
                        ? "bg-background text-primary shadow-xs font-bold border border-border/40"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Filter className="h-3.5 w-3.5" />
                    Kustom
                  </button>
                </div>
              </div>

              {/* Dynamic Inputs Based on Range Mode */}
              {rangeMode === "monthly" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Pilih Bulan & Tahun Laporan
                  </label>
                  <ModernMonthYearPicker
                    month={selectedMonth}
                    year={selectedYear}
                    onSelect={(m, y) => {
                      setSelectedMonth(m);
                      setSelectedYear(y);
                      invalidatePreview();
                    }}
                  />
                </div>
              )}

              {rangeMode === "weekly" && (
                <div className="space-y-2.5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Pilih Bulan & Tahun
                    </label>
                    <ModernMonthYearPicker
                      month={selectedMonth}
                      year={selectedYear}
                      onSelect={(m, y) => {
                        setSelectedMonth(m);
                        setSelectedYear(y);
                        setSelectedWeek(1);
                        invalidatePreview();
                      }}
                    />
                  </div>

                  {/* Week Card Roster Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Pilih Pekan (Senin s/d Minggu)
                    </label>
                    <div className="space-y-1 max-h-[120px] overflow-y-auto pr-1">
                      {availableWeeks.map((w) => {
                        const isSelected = selectedWeek === w.weekIndex;
                        return (
                          <button
                            key={w.weekIndex}
                            type="button"
                            onClick={() => {
                              setSelectedWeek(w.weekIndex);
                              invalidatePreview();
                            }}
                            className={`w-full p-2 rounded-lg border text-left transition-all flex items-center justify-between ${
                              isSelected
                                ? "bg-primary/10 border-primary text-primary shadow-xs font-bold"
                                : "bg-surface border-border/50 text-foreground hover:bg-accent/60"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className={`text-[10px] font-bold border-none ${
                                  isSelected
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground"
                                }`}
                              >
                                Pekan {w.weekIndex}
                              </Badge>
                              <span className="text-xs font-medium">
                                {w.startDate.toLocaleDateString("id-ID", {
                                  day: "2-digit",
                                  month: "short",
                                })}{" "}
                                –{" "}
                                {w.endDate.toLocaleDateString("id-ID", {
                                  day: "2-digit",
                                  month: "short",
                                })}
                              </span>
                            </div>

                            {isSelected && (
                              <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {rangeMode === "custom" && (
                <div className="grid grid-cols-2 gap-2.5 p-2.5 rounded-xl bg-muted/20 border border-border/40">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">
                      Tanggal Mulai
                    </label>
                    <div className="relative">
                      <Input
                        type="date"
                        value={customStartStr}
                        onChange={(e) => {
                          setCustomStartStr(e.target.value);
                          invalidatePreview();
                        }}
                        className="h-8 w-full pl-7 pr-2 text-xs font-medium bg-background border-border/60 rounded-lg shadow-xs"
                      />
                      <CalendarIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">
                      Tanggal Selesai
                    </label>
                    <div className="relative">
                      <Input
                        type="date"
                        value={customEndStr}
                        onChange={(e) => {
                          setCustomEndStr(e.target.value);
                          invalidatePreview();
                        }}
                        className="h-8 w-full pl-7 pr-2 text-xs font-medium bg-background border-border/60 rounded-lg shadow-xs"
                      />
                      <CalendarIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                </div>
              )}

              {/* Period Summary Badge */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-primary/5 border border-primary/20 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <Clock className="h-4 w-4 text-primary shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] text-muted-foreground font-semibold uppercase block">
                      Periode Terpilih
                    </span>
                    <span className="font-bold text-foreground truncate block">
                      {periodLabel}
                    </span>
                  </div>
                </div>

                <Badge
                  variant="outline"
                  className="text-[10px] font-bold text-primary border-primary/30 bg-background"
                >
                  {rangeMode.toUpperCase()}
                </Badge>
              </div>

              {/* Validation notice */}
              {validationError && (
                <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              {errorMessage && (
                <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>

            {/* Sticky Footer Actions (Always visible at the bottom) */}
            <div className="px-5 py-3 border-t border-border/40 bg-muted/20 shrink-0 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleOpenChange(false)}
                disabled={isGenerating || isDataLoading}
                className="h-8 text-xs"
              >
                Batal
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleStartProcess("preview")}
                disabled={!!validationError || isGenerating || isDataLoading}
                className="h-8 text-xs gap-1.5 font-semibold text-foreground hover:bg-accent"
              >
                {isGenerating && actionType === "preview" ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Memuat Pratinjau...
                  </>
                ) : (
                  <>
                    <Eye className="h-3.5 w-3.5 text-primary" />
                    {t("halaqoh:detail.previewPdf")}
                  </>
                )}
              </Button>

              <Button
                type="button"
                size="sm"
                onClick={() => handleStartProcess("download")}
                disabled={!!validationError || isGenerating || isDataLoading}
                className="h-8 text-xs gap-1.5 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isGenerating && actionType === "download" ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Memproses PDF...
                  </>
                ) : (
                  <>
                    <Download className="h-3.5 w-3.5" />
                    {t("halaqoh:detail.downloadPdf")}
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
