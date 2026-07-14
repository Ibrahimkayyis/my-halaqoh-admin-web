"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, FileUp } from "lucide-react";

interface GuruBulkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GuruBulkDialog({ open, onOpenChange }: GuruBulkDialogProps) {
  const [file, setFile] = useState<File | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
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

  const handleClose = () => {
    setFile(null);
    onOpenChange(false);
  };

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
          >
            <Download className="w-4 h-4" />
            Download template Excel
          </Button>

          {/* Panduan Pengisian */}
          <div className="text-xs space-y-2 bg-muted/40 p-3 rounded-lg border border-border/60">
            <h5 className="font-semibold text-foreground">Panduan Pengisian Template:</h5>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground leading-relaxed">
              <li><strong>NIP</strong>: 13 digit nomor induk pegawai (Contoh: <code className="bg-surface dark:bg-slate-900 px-1 py-0.5 rounded border">19880501201501</code>). Harus unik.</li>
              <li><strong>Nama Lengkap</strong>: Nama lengkap Ustadz/Ustadzah beserta gelar tanpa karakter khusus.</li>
              <li><strong>Program</strong>: Kode program penempatan guru. Contoh:
                <ul className="list-circle list-inside ml-4 mt-0.5 space-y-0.5">
                  <li><code className="bg-surface dark:bg-slate-900 px-1 py-0.5 rounded border">R</code> = Program Reguler (R)</li>
                  <li><code className="bg-surface dark:bg-slate-900 px-1 py-0.5 rounded border">T</code> = Program Takhassus (T)</li>
                </ul>
              </li>
            </ul>
          </div>

          {/* Drag & Drop Zone */}
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer
              ${isDragActive ? "border-primary bg-primary/5" : "border-border bg-muted/20 hover:bg-muted/50"}
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
        </div>

        <div className="flex items-center justify-end gap-3 border-t pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleClose}
          >
            Batal
          </Button>
          <Button 
            type="button" 
            disabled={!file}
            className="bg-primary hover:bg-primary/90"
            onClick={() => {
              console.log("Bulk upload trigger for file:", file);
              handleClose();
            }}
          >
            Import
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
