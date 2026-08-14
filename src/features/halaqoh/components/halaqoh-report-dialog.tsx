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
  Zap,
  Filter,
  Layers,
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
import { AbsenceReportPDF } from "./halaqoh-report-pdf";

interface HalaqohReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  halaqohId: string;
  halaqohNama: string;
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

  let currentStart = new Date(firstDayOfMonth);
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

function convertSvgToPngDataUri(svgUrl: string): Promise<string> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve("");
    const img = new globalThis.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, 256, 256);
          resolve(canvas.toDataURL("image/png"));
          return;
        }
      } catch (e) {
        console.warn("Canvas SVG to PNG conversion failed:", e);
      }
      resolve("");
    };
    img.onerror = () => resolve("");
    img.src = svgUrl;
  });
}

interface ModernMonthYearPickerProps {
  month: number;
  year: number;
  onSelect: (month: number, year: number) => void;
}

function ModernMonthYearPicker({ month, year, onSelect }: ModernMonthYearPickerProps) {
  const today = useMemo(() => new Date(), []);
  const currentRealMonth = today.getMonth() + 1;
  const currentRealYear = today.getFullYear();

  const handlePrevYear = () => onSelect(month, year - 1);
  const handleNextYear = () => onSelect(month, year + 1);

  const handleSetCurrentMonth = () => {
    onSelect(currentRealMonth, currentRealYear);
  };

  const handleSetPreviousMonth = () => {
    if (currentRealMonth === 1) {
      onSelect(12, currentRealYear - 1);
    } else {
      onSelect(currentRealMonth - 1, currentRealYear);
    }
  };

  return (
    <div className="p-3.5 rounded-xl bg-muted/20 border border-border/40 space-y-3">
      {/* Header Year Navigator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handlePrevYear}
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="text-sm font-bold text-foreground font-mono px-2">
            {year}
          </span>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleNextYear}
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleSetCurrentMonth}
            className="h-7 text-[11px] px-2 gap-1 text-primary hover:text-primary font-medium"
          >
            <Zap className="h-3 w-3" />
            Bulan Ini
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleSetPreviousMonth}
            className="h-7 text-[11px] px-2 text-muted-foreground hover:text-foreground font-medium"
          >
            Bulan Lalu
          </Button>
        </div>
      </div>

      {/* Month 3x4 Grid Selector */}
      <div className="grid grid-cols-4 gap-1.5">
        {SHORT_MONTH_NAMES.map((m, idx) => {
          const monthNum = idx + 1;
          const isSelected = month === monthNum;
          const isRealCurrent = currentRealMonth === monthNum && currentRealYear === year;

          return (
            <button
              key={monthNum}
              type="button"
              onClick={() => onSelect(monthNum, year)}
              className={`relative h-9 rounded-lg text-xs font-semibold transition-all flex items-center justify-center ${
                isSelected
                  ? "bg-primary text-primary-foreground shadow-xs scale-[1.02]"
                  : "bg-surface border border-border/40 text-foreground hover:bg-accent/60 hover:border-border/80"
              }`}
            >
              <span>{m}</span>
              {isRealCurrent && !isSelected && (
                <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-primary" />
              )}
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
}: HalaqohReportDialogProps) {
  const { t } = useTranslation(["halaqoh", "common"]);

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
      const weekObj = availableWeeks.find((w) => w.weekIndex === selectedWeek) ?? availableWeeks[0];
      if (!weekObj) {
        return { parsedStartDate: null, parsedEndDate: null, periodLabel: "Pekanan" };
      }
      const label = `Pekanan: ${weekObj.label}`;
      return { parsedStartDate: weekObj.startDate, parsedEndDate: weekObj.endDate, periodLabel: label };
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
  }, [rangeMode, selectedMonth, selectedYear, selectedWeek, availableWeeks, customStartStr, customEndStr]);

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

  const { reportData, isLoading } = useHalaqohReport(
    halaqohId,
    parsedStartDate,
    parsedEndDate,
    shouldFetch
  );

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
    if (shouldFetch && !isLoading && reportData && isGenerating && actionType) {
      const processPdf = async () => {
        try {
          const logoPngDataUri = await convertSvgToPngDataUri("/logo.svg");
          const doc = <AbsenceReportPDF reportData={reportData} logoUrl={logoPngDataUri} />;
          const asBlob = await pdf(doc).toBlob();
          const url = URL.createObjectURL(asBlob);

          const fileStart = parsedStartDate?.toISOString().split("T")[0] ?? "start";
          const fileEnd = parsedEndDate?.toISOString().split("T")[0] ?? "end";

          if (actionType === "download") {
            const link = document.createElement("a");
            link.href = url;
            link.download = `Laporan_Absensi_Halaqoh_${halaqohNama.replace(/\s+/g, "_")}_${fileStart}_s-d_${fileEnd}.pdf`;
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
  }, [shouldFetch, isLoading, reportData, isGenerating, actionType, halaqohNama, parsedStartDate, parsedEndDate, previewBlobUrl]);

  const handleDownloadFromPreview = () => {
    if (!previewBlobUrl) return;
    const fileStart = parsedStartDate?.toISOString().split("T")[0] ?? "start";
    const fileEnd = parsedEndDate?.toISOString().split("T")[0] ?? "end";

    const link = document.createElement("a");
    link.href = previewBlobUrl;
    link.download = `Laporan_Absensi_Halaqoh_${halaqohNama.replace(/\s+/g, "_")}_${fileStart}_s-d_${fileEnd}.pdf`;
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
            : "sm:max-w-[520px] rounded-xl"
        }
      >
        {viewMode === "preview" ? (
          /* PREVIEW MODE VIEW */
          <div className="flex flex-col h-full space-y-4">
            <DialogHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/40">
              <div className="space-y-1">
                <DialogTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                  <FileText className="h-4 w-4 text-primary" />
                  {t("halaqoh:detail.previewTitle")}
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
                  Kembali ke Filter
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
                  title="Pratinjau PDF Rekap Absensi Halaqoh"
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
          /* FORM CONFIGURATION VIEW */
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg font-bold text-foreground">
                <FileText className="h-5 w-5 text-primary" />
                {t("halaqoh:detail.reportDialogTitle")}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {t("halaqoh:detail.reportDialogDesc")}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-3">
              {/* Ultra-Modern Segmented Range Mode Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  {t("halaqoh:detail.reportRangeMode")}
                </label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-muted/40 rounded-xl border border-border/40">
                  <button
                    type="button"
                    onClick={() => {
                      setRangeMode("monthly");
                      invalidatePreview();
                    }}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
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
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
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
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
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
                <div className="space-y-2">
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
                <div className="space-y-3">
                  <div className="space-y-2">
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

                  {/* Rich Week Card Roster Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-foreground">
                      Pilih Pekan (Senin s/d Minggu)
                    </label>
                    <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
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
                            className={`w-full p-2.5 rounded-lg border text-left transition-all flex items-center justify-between ${
                              isSelected
                                ? "bg-primary/10 border-primary text-primary shadow-xs font-bold"
                                : "bg-surface border-border/50 text-foreground hover:bg-accent/60"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className={`text-[10px] font-bold border-none ${
                                  isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                }`}
                              >
                                Pekan {w.weekIndex}
                              </Badge>
                              <span className="text-xs font-medium">
                                {w.startDate.toLocaleDateString("id-ID", { day: "2-digit", month: "short" })} – {w.endDate.toLocaleDateString("id-ID", { day: "2-digit", month: "short" })}
                              </span>
                            </div>

                            {isSelected && <Check className="h-4 w-4 text-primary shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {rangeMode === "custom" && (
                <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-muted/20 border border-border/40">
                  <div className="space-y-1.5">
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
                        className="h-9 w-full pl-8 pr-2 text-xs font-medium bg-background border-border/60 rounded-lg shadow-xs"
                      />
                      <CalendarIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
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
                        className="h-9 w-full pl-8 pr-2 text-xs font-medium bg-background border-border/60 rounded-lg shadow-xs"
                      />
                      <CalendarIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                </div>
              )}

              {/* Comprehensive Period Summary Badge */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-primary/5 border border-primary/20 text-xs">
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

                <Badge variant="outline" className="text-[10px] font-bold text-primary border-primary/30 bg-background">
                  {rangeMode.toUpperCase()}
                </Badge>
              </div>

              {/* Validation notice */}
              {validationError && (
                <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              {errorMessage && (
                <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/40">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleOpenChange(false)}
                disabled={isGenerating || isLoading}
                className="h-9 text-xs"
              >
                Batal
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleStartProcess("preview")}
                disabled={!!validationError || isGenerating || isLoading}
                className="h-9 text-xs gap-1.5 font-semibold text-foreground hover:bg-accent"
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
                disabled={!!validationError || isGenerating || isLoading}
                className="h-9 text-xs gap-1.5 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
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
