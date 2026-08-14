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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useAbsenceReport } from "../hooks/use-absence-report";
import { AbsenceReportPDF } from "./absence-report-pdf";

interface AbsenceReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export function AbsenceReportDialog({ open, onOpenChange }: AbsenceReportDialogProps) {
  const { t } = useTranslation(["kehadiranSantri", "common"]);

  // Default: start 30 days ago, end today
  const defaultDates = useMemo(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30);

    return {
      startStr: start.toISOString().split("T")[0],
      endStr: end.toISOString().split("T")[0],
    };
  }, []);

  const [startDateStr, setStartDateStr] = useState<string>(defaultDates.startStr);
  const [endDateStr, setEndDateStr] = useState<string>(defaultDates.endStr);
  const [programFilter, setProgramFilter] = useState<"all" | "R" | "T">("all");
  const [viewMode, setViewMode] = useState<"form" | "preview">("form");
  const [actionType, setActionType] = useState<"download" | "preview" | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [shouldFetch, setShouldFetch] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);

  // Clean up blob URL on unmount or when component changes
  useEffect(() => {
    return () => {
      if (previewBlobUrl) {
        URL.revokeObjectURL(previewBlobUrl);
      }
    };
  }, [previewBlobUrl]);

  // Reset view state when dialog closes
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

  const parsedStartDate = useMemo(() => {
    if (!startDateStr) return null;
    const [y, m, d] = startDateStr.split("-").map(Number);
    return new Date(y, m - 1, d);
  }, [startDateStr]);

  const parsedEndDate = useMemo(() => {
    if (!endDateStr) return null;
    const [y, m, d] = endDateStr.split("-").map(Number);
    return new Date(y, m - 1, d);
  }, [endDateStr]);

  // Validation
  const validationError = useMemo(() => {
    if (!parsedStartDate || !parsedEndDate) {
      return "Silakan pilih tanggal mulai dan tanggal selesai.";
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

  const { reportData, isLoading } = useAbsenceReport(
    parsedStartDate,
    parsedEndDate,
    programFilter,
    shouldFetch
  );

  const handleStartProcess = (type: "download" | "preview") => {
    if (validationError) return;

    // If previewBlobUrl already exists and params haven't changed, reuse it for preview
    if (type === "preview" && previewBlobUrl && viewMode === "form") {
      setViewMode("preview");
      return;
    }

    setErrorMessage(null);
    setActionType(type);
    setIsGenerating(true);
    setShouldFetch(true);
  };

  // Process PDF blob when reportData is ready
  useEffect(() => {
    if (shouldFetch && !isLoading && reportData && isGenerating && actionType) {
      const processPdf = async () => {
        try {
          const logoPngDataUri = await convertSvgToPngDataUri("/logo.svg");
          const doc = <AbsenceReportPDF reportData={reportData} logoUrl={logoPngDataUri} />;
          const asBlob = await pdf(doc).toBlob();
          const url = URL.createObjectURL(asBlob);

          if (actionType === "download") {
            const link = document.createElement("a");
            link.href = url;
            link.download = `Laporan_Ketidakhadiran_Santri_${startDateStr}_s-d_${endDateStr}.pdf`;
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
  }, [shouldFetch, isLoading, reportData, isGenerating, actionType, startDateStr, endDateStr, previewBlobUrl]);

  const handleDownloadFromPreview = () => {
    if (!previewBlobUrl) return;
    const link = document.createElement("a");
    link.href = previewBlobUrl;
    link.download = `Laporan_Ketidakhadiran_Santri_${startDateStr}_s-d_${endDateStr}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const programLabel =
    programFilter === "R"
      ? "Program Reguler"
      : programFilter === "T"
      ? "Program Takhassus"
      : "Semua Program";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={
          viewMode === "preview"
            ? "sm:max-w-5xl w-[95vw] h-[88vh] flex flex-col p-6 rounded-xl overflow-hidden"
            : "sm:max-w-[480px] rounded-xl"
        }
      >
        {viewMode === "preview" ? (
          /* PREVIEW MODE VIEW */
          <div className="flex flex-col h-full space-y-4">
            <DialogHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/40">
              <div className="space-y-1">
                <DialogTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                  <FileText className="h-4 w-4 text-primary" />
                  {t("report.previewTitle")}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground flex items-center gap-2">
                  <span>Periode: {startDateStr} s/d {endDateStr}</span>
                  <span>•</span>
                  <span>{programLabel}</span>
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
                  {t("report.backToFilter")}
                </Button>

                <Button
                  type="button"
                  size="sm"
                  onClick={handleDownloadFromPreview}
                  className="h-8 text-xs gap-1.5 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Download className="h-3.5 w-3.5" />
                  {t("report.downloadPDF")}
                </Button>
              </div>
            </DialogHeader>

            {/* Embedded PDF iframe */}
            <div className="flex-1 w-full bg-slate-900/10 rounded-lg overflow-hidden border border-border/50 shadow-inner">
              {previewBlobUrl ? (
                <iframe
                  src={previewBlobUrl}
                  className="w-full h-full border-none"
                  title="Pratinjau PDF Laporan Ketidakhadiran Santri"
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
                Buat Laporan Ketidakhadiran Santri
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Pilih rentang tanggal dan program santri untuk mengunduh atau melihat pratinjau laporan PDF.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-3">
              {/* Program Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Filter Program Santri
                </label>
                <Select
                  value={programFilter}
                  onValueChange={(v) => {
                    setProgramFilter(v as "all" | "R" | "T");
                    if (previewBlobUrl) {
                      URL.revokeObjectURL(previewBlobUrl);
                      setPreviewBlobUrl(null);
                    }
                  }}
                >
                  <SelectTrigger className="h-9 w-full text-xs font-medium bg-background border-border/60 rounded-lg shadow-xs">
                    <SelectValue placeholder="Pilih Program" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg border-border/60 shadow-md">
                    <SelectItem value="all" className="text-xs">
                      Semua Program (Reguler & Takhassus)
                    </SelectItem>
                    <SelectItem value="R" className="text-xs">
                      Program Reguler Saja
                    </SelectItem>
                    <SelectItem value="T" className="text-xs">
                      Program Takhassus Saja
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range Inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Tanggal Mulai
                  </label>
                  <div className="relative">
                    <Input
                      type="date"
                      value={startDateStr}
                      onChange={(e) => {
                        setStartDateStr(e.target.value);
                        if (previewBlobUrl) {
                          URL.revokeObjectURL(previewBlobUrl);
                          setPreviewBlobUrl(null);
                        }
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
                      value={endDateStr}
                      onChange={(e) => {
                        setEndDateStr(e.target.value);
                        if (previewBlobUrl) {
                          URL.revokeObjectURL(previewBlobUrl);
                          setPreviewBlobUrl(null);
                        }
                      }}
                      className="h-9 w-full pl-8 pr-2 text-xs font-medium bg-background border-border/60 rounded-lg shadow-xs"
                    />
                    <CalendarIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Validation / Warning notice */}
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

              <div className="p-3 rounded-lg bg-muted/40 border border-border/40 text-xs space-y-1 text-muted-foreground">
                <p className="font-semibold text-foreground">Catatan Laporan PDF:</p>
                <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                  <li>Maksimal rentang waktu pencetakan adalah 6 bulan.</li>
                  <li>Laporan berisi rincian harian: Nama, NIS, Kelas, Halaqoh, Ustadz, Sesi, dan Status.</li>
                  <li>Anda dapat melihat pratinjau laporan sebelum mengunduhnya.</li>
                </ul>
              </div>
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
                    Pratinjau PDF
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
                    Unduh PDF
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
