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
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, FileUp, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useBulkCreateGuru } from "../hooks/use-guru";

interface GuruBulkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ParsedGuru {
  nip: string;
  nama: string;
  program: "R" | "T";
  phone?: string;
}

export function GuruBulkDialog({ open, onOpenChange }: GuruBulkDialogProps) {
  const { t } = useTranslation(["guru", "common"]);
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedGuru[]>([]);
  const [errorCount, setErrorCount] = useState(0);
  const [importResult, setImportResult] = useState<{
    success: number;
    failed: number;
    errors?: Array<{ nip: string; nama: string; reason: string }>;
  } | null>(null);

  const bulkCreateMutation = useBulkCreateGuru();

  const handleParsedRows = (rows: Record<string, any>[]) => {
    const validGuru: ParsedGuru[] = [];
    let errors = 0;

    rows.forEach((row) => {
      const nip = String(row.NIP ?? row.nip ?? row.Nip ?? "").trim();
      const nama = String(row["Nama Lengkap"] ?? row["nama lengkap"] ?? row.Nama ?? row.nama ?? row.NAMA ?? "").trim();
      const programRaw = String(row.Program ?? row.program ?? row.PROGRAM ?? "").trim().toUpperCase();
      const phone = row.Phone ?? row.phone ?? row.PHONE ?? row["No. HP"] ?? row["No HP"] ?? row["no hp"] ?? "";

      if (!nip || !nama || !programRaw) {
        errors++;
        return;
      }

      let program: "R" | "T" | null = null;
      if (programRaw === "R" || programRaw === "REGULER") {
        program = "R";
      } else if (programRaw === "T" || programRaw === "TAKHASSUS") {
        program = "T";
      }

      if (program) {
        validGuru.push({
          nip,
          nama,
          program,
          phone: phone ? String(phone).trim() : undefined,
        });
      } else {
        errors++;
      }
    });

    setParsedData(validGuru);
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
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          handleParsedRows(results.data as Record<string, string>[]);
        },
        error: (error) => {
          console.error("CSV Parsing Error:", error);
          setErrorCount(1);
        }
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
            const rawRows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, { defval: "" });
            handleParsedRows(rawRows);
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
    const link = document.createElement("a");
    link.href = "/Template_Data_Guru.xlsx";
    link.download = "Template_Data_Guru.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = async () => {
    if (parsedData.length === 0) return;

    try {
      const result = await bulkCreateMutation.mutateAsync(parsedData);
      setImportResult({
        success: result.successCount,
        failed: result.failCount,
        errors: result.errors,
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

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>{t("guru:bulk.title")}</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {t("guru:bulk.subtitle")}
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
                <h4 className="text-sm font-medium text-foreground mb-1 truncate max-w-[300px]">
                  {file.name}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            ) : (
              <div>
                <h4 className="text-sm font-medium text-foreground mb-1">
                  {t("guru:bulk.dropzone")}
                </h4>
              </div>
            )}
          </div>

          {/* Validation Info */}
          {file && !isPending && (
            <div className="text-sm space-y-1 bg-muted/30 p-3 rounded-lg border">
              <p className="text-foreground">
                🟢 {parsedData.length} {t("common:status.active")}
              </p>
            </div>
          )}

          {/* Progress / Import Result */}
          {isPending && (
            <div className="flex flex-col items-center justify-center py-4 space-y-2">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">{t("guru:bulk.processing")}</p>
            </div>
          )}

          {importResult && (
            <div className="bg-muted/40 p-4 rounded-lg border space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2 text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{importResult.success} {t("common:status.success")}</span>
                </div>
                <div className="flex items-center gap-2 text-destructive">
                  <XCircle className="w-4 h-4" />
                  <span>{importResult.failed} {t("common:status.error")}</span>
                </div>
              </div>
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
