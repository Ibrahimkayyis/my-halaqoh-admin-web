"use client";

import { useState } from "react";
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
import { useBulkCreateSantri } from "../hooks/use-santri";

interface SantriBulkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ParsedSantri {
  nis: string;
  nama: string;
  kelas: string;
  program: string;
}

export function SantriBulkDialog({ open, onOpenChange }: SantriBulkDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedSantri[]>([]);
  const [errorCount, setErrorCount] = useState(0);
  const [importResult, setImportResult] = useState<{
    success: number;
    failed: number;
    errors?: Array<{ nis: string; nama: string; reason: string }>;
  } | null>(null);

  const bulkCreateMutation = useBulkCreateSantri();

  // Helper to process rows (shared by CSV and Excel)
  const handleParsedRows = (rows: Record<string, any>[]) => {
    const validSantri: ParsedSantri[] = [];
    let errors = 0;

    rows.forEach((row) => {
      // Normalize column names and convert potential numbers to string
      const nis = String(row.NIS ?? row.nis ?? row.Nis ?? "").trim();
      const nama = String(row["Nama Lengkap"] ?? row["nama lengkap"] ?? row.Nama ?? row.nama ?? row.NAMA ?? "").trim();
      const kelasRaw = String(row.Kelas ?? row.kelas ?? row.KELAS ?? "").trim();

      if (!nis || !nama || !kelasRaw) {
        errors++;
        return;
      }

      // Parse kelas & program from e.g. "10R" or "12T"
      const match = kelasRaw.match(/^(\d+)([RT])$/i);
      if (match) {
        validSantri.push({
          nis,
          nama,
          kelas: match[1],
          program: match[2].toUpperCase(),
        });
      } else {
        errors++;
      }
    });

    setParsedData(validSantri);
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
    link.href = "/Template_Data_Santri.xlsx";
    link.download = "Template_Data_Santri.xlsx";
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
      // Reset file and data on success
      setFile(null);
      setParsedData([]);
      setErrorCount(0);
    } catch (e) {
      console.error("Import failed:", e);
    }
  };

  const handleClose = () => {
    // Reset state when closing
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
          <DialogTitle>Upload Data dari file CSV / Excel</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Pastikan kolom dan format data sama dengan template
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
            Download template Excel
          </Button>

          {/* Panduan Pengisian */}
          <div className="text-xs space-y-2 bg-muted/40 p-3 rounded-lg border border-border/60">
            <h5 className="font-semibold text-foreground">Panduan Pengisian Template:</h5>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground leading-relaxed">
              <li><strong>NIS</strong>: 12 digit nomor induk (Contoh: <code className="bg-surface dark:bg-slate-900 px-1 py-0.5 rounded border">3100002570</code>). Harus unik.</li>
              <li><strong>Nama Lengkap</strong>: Nama lengkap santri tanpa karakter khusus.</li>
              <li><strong>Kelas</strong>: Gabungan angka kelas & kode program. Contoh:
                <ul className="list-circle list-inside ml-4 mt-0.5 space-y-0.5">
                  <li><code className="bg-surface dark:bg-slate-900 px-1 py-0.5 rounded border">10R</code> = Kelas 10 Reguler (R)</li>
                  <li><code className="bg-surface dark:bg-slate-900 px-1 py-0.5 rounded border">8T</code> = Kelas 8 Takhassus (T)</li>
                </ul>
              </li>
            </ul>
          </div>

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
                  {isDragActive ? "Drop file di sini..." : "Upload file .csv, .xlsx, atau .xls"}
                </h4>
                <p className="text-xs text-muted-foreground">Ukuran maksimal file 5 MB</p>
              </div>
            )}
          </div>

          {/* Validation Info */}
          {file && !isPending && (
            <div className="text-sm space-y-1 bg-muted/30 p-3 rounded-lg border">
              <p className="text-foreground">
                🟢 {parsedData.length} baris data siap diimport.
              </p>
              {errorCount > 0 && (
                <p className="text-destructive font-medium">
                  🔴 {errorCount} baris data tidak valid (akan diabaikan).
                </p>
              )}
            </div>
          )}

          {/* Progress / Import Result */}
          {isPending && (
            <div className="flex flex-col items-center justify-center py-4 space-y-2">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Mengimpor & membuat akun santri...</p>
            </div>
          )}

          {importResult && (
            <div className="bg-muted/40 p-4 rounded-lg border space-y-3">
              <h5 className="font-semibold text-sm">Hasil Impor:</h5>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2 text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{importResult.success} Berhasil</span>
                </div>
                <div className="flex items-center gap-2 text-destructive">
                  <XCircle className="w-4 h-4" />
                  <span>{importResult.failed} Gagal</span>
                </div>
              </div>

              {importResult.errors && importResult.errors.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-semibold text-destructive mb-1">Detail Kegagalan:</p>
                  <div className="max-h-[120px] overflow-y-auto border rounded bg-surface p-2 text-xs space-y-1 text-muted-foreground">
                    {importResult.errors.map((err, i) => (
                      <div key={i} className="flex flex-col border-b last:border-0 pb-1 mb-1">
                        <span className="font-semibold text-foreground">{err.nis} - {err.nama}</span>
                        <span className="text-[10px] text-destructive">{err.reason}</span>
                      </div>
                    ))}
                  </div>
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
            Batal
          </Button>
          <Button 
            type="button" 
            onClick={handleImport}
            disabled={isPending || parsedData.length === 0}
            className="bg-primary hover:bg-primary/90"
          >
            Import
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
