"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, FileUp, Loader2, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { useBulkCreateHalaqoh } from "../hooks/use-halaqoh";
import type { BulkHalaqohItem } from "@/lib/firestore/queries/halaqoh.queries";

interface HalaqohBulkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HalaqohBulkDialog({ open, onOpenChange }: HalaqohBulkDialogProps) {
  const { t } = useTranslation(["halaqoh", "common"]);
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<BulkHalaqohItem[]>([]);
  const [errorCount, setErrorCount] = useState(0);
  const [importResult, setImportResult] = useState<{
    success: number;
    failed: number;
    errors?: Array<{ nama: string; reason: string }>;
    warnings?: Array<{ nama: string; message: string }>;
  } | null>(null);

  const bulkCreateMutation = useBulkCreateHalaqoh();

  const parseMatrixToHalaqohItems = (matrix: any[][]) => {
    const items: BulkHalaqohItem[] = [];
    let current: BulkHalaqohItem | null = null;
    let errors = 0;

    const finalizeCurrent = () => {
      if (current && current.nama.trim()) {
        if (!current.kelas || !current.nipGuru) {
          errors++;
        } else {
          items.push(current);
        }
      }
      current = null;
    };

    matrix.forEach((row) => {
      if (!row || row.length === 0) return;

      const colA = String(row[0] ?? "").trim();
      const colB = String(row[1] ?? "").trim();

      const colALower = colA.toLowerCase();

      if (colALower.includes("nama halaqoh")) {
        finalizeCurrent();
        current = {
          nama: colB,
          kelas: "",
          program: "R",
          nipGuru: "",
          nisSantriList: [],
        };
        return;
      }

      if (!current) return;

      if (colALower.includes("kelas")) {
        // Normalize kelas (e.g. "7", "Kelas 7" -> "7")
        const match = colB.match(/\d+/);
        current.kelas = match ? match[0] : colB;
      } else if (colALower.includes("program")) {
        const pLower = colB.toLowerCase();
        if (pLower === "t" || pLower.includes("takhassus")) {
          current.program = "T";
        } else {
          current.program = "R";
        }
      } else if (colALower.includes("nip guru") || colALower.includes("nip")) {
        current.nipGuru = colB;
      } else if (colALower.includes("nis santri")) {
        // If colB contains a NIS value (and not header text "NIS")
        if (colB && colB.toUpperCase() !== "NIS") {
          current.nisSantriList.push(colB);
        }
      } else {
        // Row in santri list area (colA empty or label area passed)
        if (colB && colB.toUpperCase() !== "NIS" && !colALower.includes("nama halaqoh")) {
          current.nisSantriList.push(colB);
        }
      }
    });

    finalizeCurrent();

    setParsedData(items);
    setErrorCount(errors);
  };

  const onDrop = (acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setImportResult(null);

    const fileExtension = selectedFile.name.split(".").pop()?.toLowerCase();

    if (fileExtension === "csv") {
      Papa.parse(selectedFile, {
        header: false,
        skipEmptyLines: false,
        complete: (results) => {
          parseMatrixToHalaqohItems(results.data as any[][]);
        },
        error: (error) => {
          console.error("CSV Parsing Error:", error);
          setErrorCount(1);
        },
      });
    } else if (fileExtension === "xlsx" || fileExtension === "xls") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        if (data) {
          try {
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const matrix = XLSX.utils.sheet_to_json<any[]>(sheet, { header: 1, defval: "" });
            parseMatrixToHalaqohItems(matrix);
          } catch (error) {
            console.error("Excel Read Error:", error);
            setErrorCount(1);
          }
        }
      };
      reader.onerror = (error) => {
        console.error("Excel FileReader Error:", error);
        setErrorCount(1);
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
    },
    maxFiles: 1,
  });

  const handleDownloadTemplate = () => {
    const templateData = [
      ["Nama Halaqoh", "AL FATIH 1", ""],
      ["Kelas", "7", ""],
      ["Program", "Reguler", ""],
      ["NIP Guru", "1234567890123", ""],
      ["NIS Santri", "NIS", "Nama Santri"],
      ["", "2024001", "Ahmad Fauzi"],
      ["", "2024002", "Budi Santoso"],
      ["", "2024003", "Candra Wijaya"],
      ["", "", ""],
      ["Nama Halaqoh", "AL BAQOROH 1", ""],
      ["Kelas", "8", ""],
      ["Program", "Reguler", ""],
      ["NIP Guru", "9876543210987", ""],
      ["NIS Santri", "NIS", "Nama Santri"],
      ["", "2024010", "Dani Pratama"],
      ["", "2024011", "Eko Budiman"],
      ["", "2024012", "Fajar Nugroho"],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Halaqoh");

    // Auto-fit column widths
    worksheet["!cols"] = [
      { wch: 18 }, // Column A (Label)
      { wch: 22 }, // Column B (Value / NIS)
      { wch: 25 }, // Column C (Nama Santri)
    ];

    XLSX.writeFile(workbook, "Template_Data_Halaqoh.xlsx");
  };

  const handleImport = async () => {
    if (parsedData.length === 0) return;

    try {
      const result = await bulkCreateMutation.mutateAsync(parsedData);
      setImportResult({
        success: result.successCount,
        failed: result.failCount,
        errors: result.errors,
        warnings: result.warnings,
      });
      setFile(null);
      setParsedData([]);
      setErrorCount(0);
    } catch (e) {
      console.error("Import failed:", e);
    }
  };

  const handleClose = () => {
    setFile(null);
    setParsedData([]);
    setErrorCount(0);
    setImportResult(null);
    onOpenChange(false);
  };

  const isPending = bulkCreateMutation.isPending;
  const totalSantriToAssign = parsedData.reduce((acc, h) => acc + h.nisSantriList.length, 0);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("halaqoh:bulk.title")}</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {t("halaqoh:bulk.subtitle")}
          </p>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={handleDownloadTemplate}
            disabled={isPending}
          >
            <Download className="w-4 h-4" />
            {t("common:actions.downloadTemplate")}
          </Button>

          {/* Drag & Drop Zone */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer
              ${isDragActive ? "border-primary bg-primary/5" : "border-border bg-muted/20 hover:bg-muted/50"}
              ${isPending ? "pointer-events-none opacity-50" : ""}
            `}
          >
            <input {...getInputProps()} />
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <FileUp className="w-6 h-6 text-primary" />
            </div>
            {file ? (
              <div>
                <h4 className="text-sm font-medium text-foreground mb-1 truncate max-w-[320px]">
                  {file.name}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            ) : (
              <div>
                <h4 className="text-sm font-medium text-foreground mb-1">
                  {t("halaqoh:bulk.dropzone")}
                </h4>
              </div>
            )}
          </div>

          {/* Validation Info */}
          {file && !isPending && (
            <div className="text-sm space-y-1.5 bg-muted/30 p-3 rounded-lg border">
              <p className="text-foreground font-medium">
                🟢 {parsedData.length} {t("halaqoh:bulk.previewHalaqoh")}
              </p>
              <p className="text-xs text-muted-foreground">
                👥 Total {totalSantriToAssign} {t("halaqoh:bulk.previewSantri")}
              </p>
              {errorCount > 0 && (
                <p className="text-xs text-destructive">
                  ⚠️ {errorCount} {t("halaqoh:bulk.invalidFormat")}
                </p>
              )}
            </div>
          )}

          {/* Progress / Import Result */}
          {isPending && (
            <div className="flex flex-col items-center justify-center py-4 space-y-2">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">{t("halaqoh:bulk.processing")}</p>
            </div>
          )}

          {importResult && (
            <div className="bg-muted/40 p-4 rounded-lg border space-y-3 max-h-[220px] overflow-y-auto">
              <div className="grid grid-cols-2 gap-2 text-sm font-medium">
                <div className="flex items-center gap-2 text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{importResult.success} {t("common:status.success")}</span>
                </div>
                <div className="flex items-center gap-2 text-destructive">
                  <XCircle className="w-4 h-4" />
                  <span>{importResult.failed} {t("common:status.error")}</span>
                </div>
              </div>

              {/* Errors Detail */}
              {importResult.errors && importResult.errors.length > 0 && (
                <div className="space-y-1 text-xs border-t pt-2">
                  <p className="font-semibold text-destructive">{t("common:status.error")}:</p>
                  {importResult.errors.map((err, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-destructive/90">
                      <span>•</span>
                      <span><strong>{err.nama}:</strong> {err.reason}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Warnings Detail */}
              {importResult.warnings && importResult.warnings.length > 0 && (
                <div className="space-y-1 text-xs border-t pt-2">
                  <p className="font-semibold text-amber-600 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Catatan / Warning:</span>
                  </p>
                  {importResult.warnings.map((warn, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-amber-600/90">
                      <span>•</span>
                      <span><strong>{warn.nama}:</strong> {warn.message}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isPending}
          >
            {t("common:actions.cancel")}
          </Button>
          <Button
            type="button"
            onClick={handleImport}
            disabled={isPending || parsedData.length === 0}
            className="bg-primary hover:bg-primary/90"
          >
            {t("common:actions.import")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
