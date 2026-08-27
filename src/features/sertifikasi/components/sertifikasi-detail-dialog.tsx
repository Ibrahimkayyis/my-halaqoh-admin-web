"use client";

import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  User,
  BookOpen,
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  AlertCircle,
  Hourglass,
} from "lucide-react";
import type {
  SertifikasiTahfidz,
  SertifikasiStatus,
} from "../types/sertifikasi.types";
import { cn } from "@/lib/utils";

interface SertifikasiDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: SertifikasiTahfidz | null;
}

export function SertifikasiDetailDialog({
  open,
  onOpenChange,
  item,
}: SertifikasiDetailDialogProps) {
  const { t } = useTranslation(["sertifikasi", "common"]);

  if (!item) return null;

  const formatDate = (timestamp?: { toDate: () => Date } | null, withTime = false) => {
    if (!timestamp) return "-";
    try {
      const d = timestamp.toDate();
      return d.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
      });
    } catch {
      return "-";
    }
  };

  const renderStatusBadge = (status: SertifikasiStatus) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="rounded-full px-3 py-1 text-xs font-semibold bg-warning/10 text-warning border-warning/20 flex items-center gap-1.5"
          >
            <Hourglass className="w-3.5 h-3.5" />
            <span>{t("sertifikasi:status.pending", "Menunggu Persetujuan")}</span>
          </Badge>
        );
      case "scheduled":
        return (
          <Badge
            variant="outline"
            className="rounded-full px-3 py-1 text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{t("sertifikasi:status.scheduled", "Terjadwal")}</span>
          </Badge>
        );
      case "passed":
        return (
          <Badge
            variant="outline"
            className="rounded-full px-3 py-1 text-xs font-semibold bg-success/10 text-success border-success/20 flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{t("sertifikasi:status.passed", "Lulus Sertifikasi")}</span>
          </Badge>
        );
      case "failed":
        return (
          <Badge
            variant="outline"
            className="rounded-full px-3 py-1 text-xs font-semibold bg-destructive/10 text-destructive border-destructive/20 flex items-center gap-1.5"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>{t("sertifikasi:status.failed", "Perlu Mengulang")}</span>
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="rounded-full px-3 py-1 text-xs font-semibold bg-destructive/10 text-destructive border-destructive/20 flex items-center gap-1.5"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>{t("sertifikasi:status.rejected", "Ditolak")}</span>
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader className="pb-2 border-b border-border/40">
          <div className="flex items-center justify-between gap-3">
            <DialogTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              <span>{t("sertifikasi:detailDialog.title", "Rincian Sertifikasi Tahfidz")}</span>
            </DialogTitle>
            {renderStatusBadge(item.status)}
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2 text-xs">
          {/* Section 1: Data Santri & Halaqoh */}
          <div className="bg-surface border border-border/60 rounded-lg p-3.5 space-y-2.5">
            <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider flex items-center gap-1.5 text-primary">
              <User className="w-4 h-4" />
              <span>{t("sertifikasi:detailDialog.sectionSantri", "Data Santri & Halaqoh")}</span>
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-1 border-t border-border/40">
              <div>
                <span className="text-muted-foreground">{t("sertifikasi:detailDialog.nama", "Nama Santri")}:</span>
                <p className="font-semibold text-foreground text-sm">{item.santriNama}</p>
              </div>
              <div>
                <span className="text-muted-foreground">{t("sertifikasi:detailDialog.nis", "NIS")}:</span>
                <p className="font-medium text-foreground">{item.nis}</p>
              </div>
              <div>
                <span className="text-muted-foreground">{t("sertifikasi:detailDialog.kelas", "Kelas & Program")}:</span>
                <p className="font-medium text-foreground">
                  Kelas {item.kelas} ({item.program === "T" ? "Takhassus" : "Reguler"})
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">{t("sertifikasi:detailDialog.juz", "Juz yang Diujikan")}:</span>
                <p className="font-bold text-primary text-sm">Juz {item.juz}</p>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">{t("sertifikasi:detailDialog.guru", "Guru Pengampu & Halaqoh")}:</span>
                <p className="font-medium text-foreground">
                  {item.guruNama} • {item.halaqohNama}
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Catatan Guru Pengampu (Jika ada) */}
          {item.catatanGuru && (
            <div className="bg-muted/30 border border-border/60 rounded-lg p-3 space-y-1">
              <h5 className="font-medium text-foreground flex items-center gap-1.5 text-xs text-muted-foreground">
                <FileText className="w-3.5 h-3.5" />
                <span>{t("sertifikasi:detailDialog.sectionCatatanGuru", "Catatan Guru Pengampu")}</span>
              </h5>
              <p className="text-foreground italic">{item.catatanGuru}</p>
            </div>
          )}

          {/* Section 3: Jadwal & Tim Penguji (Jika Status >= scheduled) */}
          {(item.status === "scheduled" || item.status === "passed" || item.status === "failed") && (
            <div className="bg-surface border border-border/60 rounded-lg p-3.5 space-y-2.5">
              <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider flex items-center gap-1.5 text-primary">
                <Calendar className="w-4 h-4" />
                <span>{t("sertifikasi:detailDialog.sectionJadwal", "Jadwal & Tim Penguji")}</span>
              </h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-1 border-t border-border/40">
                <div>
                  <span className="text-muted-foreground">{t("sertifikasi:detailDialog.tanggalUjian", "Tanggal Ujian")}:</span>
                  <p className="font-medium text-foreground">{formatDate(item.tanggalUjian)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">{t("sertifikasi:detailDialog.sesiUjian", "Sesi Waktu")}:</span>
                  <p className="font-medium text-foreground">{item.sesiUjian || "-"}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">{t("sertifikasi:detailDialog.penguji", "Ustadz Penguji")}:</span>
                  <p className="font-semibold text-foreground">{item.pengujiNama || "-"}</p>
                </div>
                {item.catatanAdmin && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">{t("sertifikasi:detailDialog.catatanAdmin", "Catatan Admin")}:</span>
                    <p className="font-medium text-foreground">{item.catatanAdmin}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Section 4: Hasil Penilaian (Jika status passed / failed) */}
          {(item.status === "passed" || item.status === "failed") && (
            <div
              className={cn(
                "rounded-lg p-4 border space-y-3",
                item.status === "passed"
                  ? "bg-success/5 border-success/30 text-foreground"
                  : "bg-destructive/5 border-destructive/30 text-foreground"
              )}
            >
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  <span>{t("sertifikasi:detailDialog.sectionHasil", "Hasil Penilaian Ujian")}</span>
                </h4>
                <Badge
                  variant="outline"
                  className={cn(
                    "font-bold text-xs",
                    item.status === "passed"
                      ? "bg-success/15 text-success border-success/30"
                      : "bg-destructive/15 text-destructive border-destructive/30"
                  )}
                >
                  {item.status === "passed" ? "LULUS" : "MENGULANG"}
                </Badge>
              </div>

              <div className="flex items-center gap-6 pt-2 border-t border-border/40">
                <div>
                  <span className="text-xs text-muted-foreground">{t("sertifikasi:detailDialog.nilai", "Nilai Akhir")}</span>
                  <p className="text-2xl font-bold text-foreground">
                    {item.nilai ?? "-"} <span className="text-xs font-normal text-muted-foreground">/ 100</span>
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">{t("sertifikasi:detailDialog.predikat", "Predikat")}</span>
                  <p className="text-sm font-semibold text-foreground">{item.predikat ?? "-"}</p>
                </div>
              </div>

              {item.catatanPenguji && (
                <div className="pt-1">
                  <span className="text-xs text-muted-foreground">{t("sertifikasi:detailDialog.catatanPenguji", "Catatan Evaluasi Penguji")}:</span>
                  <p className="text-xs font-medium text-foreground mt-0.5">{item.catatanPenguji}</p>
                </div>
              )}

              <div className="text-[11px] text-muted-foreground pt-1 border-t border-border/30">
                <span>{t("sertifikasi:detailDialog.tanggalSelesai", "Waktu Selesai")}: </span>
                <span>{formatDate(item.completedAt || item.updatedAt, true)}</span>
              </div>
            </div>
          )}

          {/* Section 5: Alasan Penolakan (Jika status rejected) */}
          {item.status === "rejected" && (
            <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-3.5 space-y-1.5 text-destructive">
              <h4 className="font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                <span>{t("sertifikasi:detailDialog.sectionPenolakan", "Alasan Penolakan")}</span>
              </h4>
              <p className="text-xs text-foreground mt-1">{item.alasanPenolakan || "-"}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-border/40">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer text-xs"
          >
            {t("sertifikasi:detailDialog.closeBtn", "Tutup")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
