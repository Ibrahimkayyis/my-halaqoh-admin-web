"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Eye,
  CheckCircle2,
  XCircle,
  ClipboardCheck,
  Calendar,
  Hourglass,
  Check,
  X,
  Award,
} from "lucide-react";
import type {
  SertifikasiTahfidz,
  SertifikasiStatus,
} from "../types/sertifikasi.types";

interface SertifikasiTableProps {
  data: SertifikasiTahfidz[];
  isLoading: boolean;
  onApprove: (item: SertifikasiTahfidz) => void;
  onReject: (item: SertifikasiTahfidz) => void;
  onGrade: (item: SertifikasiTahfidz) => void;
  onDetail: (item: SertifikasiTahfidz) => void;
}

export function SertifikasiTable({
  data,
  isLoading,
  onApprove,
  onReject,
  onGrade,
  onDetail,
}: SertifikasiTableProps) {
  const { t } = useTranslation(["sertifikasi", "common"]);

  if (isLoading) {
    return (
      <div className="bg-surface rounded-xl border border-border/40 p-4 space-y-3">
        <div className="hidden md:flex gap-4">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-6 w-1/6" />
          <Skeleton className="h-6 w-1/6" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-6 w-1/6" />
        </div>
        <hr className="hidden md:block border-border/40" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col md:flex-row gap-3 md:gap-4 md:items-center p-3 rounded-lg border border-border/30 md:border-0">
            <Skeleton className="h-5 w-3/4 md:flex-1" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-9 md:h-8 w-full md:w-28" />
          </div>
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-surface rounded-lg border border-dashed border-border/60 p-12 text-center text-muted-foreground flex flex-col items-center justify-center gap-2">
        <Award className="w-8 h-8 text-muted-foreground/50 mb-1" />
        <p className="font-medium text-foreground">
          {t("sertifikasi:table.empty", "Belum ada pengajuan sertifikasi tahfidz")}
        </p>
        <p className="text-xs text-muted-foreground">
          {t("sertifikasi:table.emptyFiltered", "Data akan muncul saat guru mengajukan santri dari aplikasi mobile")}
        </p>
      </div>
    );
  }

  const renderStatusBadge = (status: SertifikasiStatus) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="rounded-full px-2.5 py-0.5 text-[11px] font-medium bg-warning/10 text-warning border-warning/20 flex items-center gap-1 w-fit"
          >
            <Hourglass className="w-3 h-3" />
            <span>{t("sertifikasi:status.pending", "Menunggu Persetujuan")}</span>
          </Badge>
        );
      case "scheduled":
        return (
          <Badge
            variant="outline"
            className="rounded-full px-2.5 py-0.5 text-[11px] font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 flex items-center gap-1 w-fit"
          >
            <Calendar className="w-3 h-3" />
            <span>{t("sertifikasi:status.scheduled", "Terjadwal")}</span>
          </Badge>
        );
      case "passed":
        return (
          <Badge
            variant="outline"
            className="rounded-full px-2.5 py-0.5 text-[11px] font-medium bg-success/10 text-success border-success/20 flex items-center gap-1 w-fit"
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>{t("sertifikasi:status.passed", "Lulus")}</span>
          </Badge>
        );
      case "failed":
        return (
          <Badge
            variant="outline"
            className="rounded-full px-2.5 py-0.5 text-[11px] font-medium bg-destructive/10 text-destructive border-destructive/20 flex items-center gap-1 w-fit"
          >
            <XCircle className="w-3 h-3" />
            <span>{t("sertifikasi:status.failed", "Perlu Mengulang")}</span>
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="rounded-full px-2.5 py-0.5 text-[11px] font-medium bg-destructive/10 text-destructive border-destructive/20 flex items-center gap-1 w-fit"
          >
            <XCircle className="w-3 h-3" />
            <span>{t("sertifikasi:status.rejected", "Ditolak")}</span>
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatDate = (timestamp?: { toDate: () => Date } | null) => {
    if (!timestamp) return "-";
    try {
      const d = timestamp.toDate();
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "-";
    }
  };

  return (
    <div className="bg-transparent md:bg-surface rounded-xl md:rounded-lg border-0 md:border md:border-border/40 overflow-hidden">
      <Table className="w-full">
        <TableHeader className="hidden md:table-header-group">
          <TableRow>
            <TableHead>{t("sertifikasi:table.santri", "Santri")}</TableHead>
            <TableHead className="w-[120px]">{t("sertifikasi:table.kelas", "Kelas")}</TableHead>
            <TableHead className="w-[100px]">{t("sertifikasi:table.juz", "Juz")}</TableHead>
            <TableHead>{t("sertifikasi:table.guru", "Guru Pengampu")}</TableHead>
            <TableHead className="w-[180px]">{t("sertifikasi:table.status", "Status")}</TableHead>
            <TableHead className="w-[130px]">{t("sertifikasi:table.tanggal", "Tanggal")}</TableHead>
            <TableHead className="text-right w-[190px]">{t("sertifikasi:table.actions", "Aksi")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="grid grid-cols-1 gap-3.5 p-1 sm:p-2 md:table-row-group md:p-0 md:gap-0">
          {data.map((item) => {
            const programLabel = item.program === "T" ? "Takhassus" : "Reguler";
            const dateDisplay =
              item.status === "scheduled" && item.tanggalUjian
                ? formatDate(item.tanggalUjian)
                : item.status === "passed" || item.status === "failed"
                ? formatDate(item.completedAt || item.updatedAt)
                : formatDate(item.createdAt);

            return (
              <TableRow
                key={item.id}
                className="flex flex-col p-4 rounded-xl border border-border/60 bg-card shadow-xs transition-all space-y-3 hover:border-border/90 md:table-row md:p-0 md:rounded-none md:border-0 md:border-b md:border-border/40 md:bg-transparent md:shadow-none md:space-y-0 md:hover:bg-muted/30"
              >
                {/* Santri Name + NIS */}
                <TableCell className="p-0 md:px-4 md:py-3.5 flex items-start justify-between gap-2 md:table-cell">
                  <div className="flex flex-col">
                    <Link
                      href={`/santri/${item.santriId}`}
                      className="font-semibold text-foreground hover:text-primary hover:underline transition-colors text-sm"
                    >
                      {item.santriNama}
                    </Link>
                    <span className="text-xs text-muted-foreground">NIS: {item.nis}</span>
                  </div>
                </TableCell>

                {/* Kelas & Program */}
                <TableCell className="p-0 md:px-4 md:py-3.5 flex items-center justify-between text-xs md:table-cell">
                  <span className="text-muted-foreground md:hidden">{t("sertifikasi:table.kelas", "Kelas")}:</span>
                  <div className="flex flex-col md:inline-flex text-right md:text-left">
                    <span className="font-medium text-foreground text-xs">Kelas {item.kelas}</span>
                    <span className="text-[11px] text-muted-foreground">{programLabel}</span>
                  </div>
                </TableCell>

                {/* Juz Target */}
                <TableCell className="p-0 md:px-4 md:py-3.5 flex items-center justify-between text-xs md:table-cell">
                  <span className="text-muted-foreground md:hidden">{t("sertifikasi:table.juz", "Juz")}:</span>
                  <Badge variant="secondary" className="font-bold text-xs bg-primary/10 text-primary border-none">
                    Juz {item.juz}
                  </Badge>
                </TableCell>

                {/* Guru Pengampu & Halaqoh */}
                <TableCell className="p-0 md:px-4 md:py-3.5 flex items-center justify-between text-xs md:table-cell">
                  <span className="text-muted-foreground md:hidden">{t("sertifikasi:table.guru", "Guru Pengampu")}:</span>
                  <div className="flex flex-col md:inline-flex text-right md:text-left">
                    <span className="font-medium text-foreground text-xs">{item.guruNama}</span>
                    <span className="text-[11px] text-muted-foreground">{item.halaqohNama}</span>
                  </div>
                </TableCell>

                {/* Status Badge */}
                <TableCell className="p-0 md:px-4 md:py-3.5 flex items-center justify-between text-xs md:table-cell">
                  <span className="text-muted-foreground md:hidden">{t("sertifikasi:table.status", "Status")}:</span>
                  {renderStatusBadge(item.status)}
                </TableCell>

                {/* Date */}
                <TableCell className="p-0 md:px-4 md:py-3.5 flex items-center justify-between text-xs md:table-cell">
                  <span className="text-muted-foreground md:hidden">{t("sertifikasi:table.tanggal", "Tanggal")}:</span>
                  <span className="text-xs text-muted-foreground">{dateDisplay}</span>
                </TableCell>

                {/* Actions */}
                <TableCell className="p-0 pt-2.5 mt-1 border-t border-border/40 md:border-t-0 md:p-0 md:px-4 md:py-3.5 md:table-cell md:text-right">
                  <div className="flex items-center justify-end gap-2 md:gap-1.5 w-full">
                    {/* Status Pending Actions */}
                    {item.status === "pending" && (
                      <>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => onApprove(item)}
                          className="flex-1 sm:flex-initial h-9 sm:h-8 px-3 sm:px-2.5 gap-1.5 sm:gap-1 text-xs text-primary border-primary/30 hover:bg-primary/10 hover:text-primary cursor-pointer font-medium"
                          title="Setujui & Jadwalkan"
                          aria-label={`Setujui pengajuan ${item.santriNama}`}
                        >
                          <Check className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                          <span>Setujui</span>
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => onReject(item)}
                          className="flex-1 sm:flex-initial h-9 sm:h-8 px-3 sm:px-2 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                          title="Tolak Pengajuan"
                          aria-label={`Tolak pengajuan ${item.santriNama}`}
                        >
                          <X className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                          <span>Tolak</span>
                        </Button>
                      </>
                    )}

                    {/* Status Scheduled Action */}
                    {item.status === "scheduled" && (
                      <Button
                        type="button"
                        variant="default"
                        size="sm"
                        onClick={() => onGrade(item)}
                        className="flex-1 sm:flex-initial h-9 sm:h-8 px-3 sm:px-2.5 gap-1.5 text-xs cursor-pointer font-medium shadow-xs"
                        title="Input Nilai & Hasil Ujian"
                        aria-label={`Input nilai ujian ${item.santriNama}`}
                      >
                        <ClipboardCheck className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                        <span>Input Nilai</span>
                      </Button>
                    )}

                    {/* Detail Button (Always Available) */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => onDetail(item)}
                      className="h-9 w-9 sm:h-8 sm:w-8 text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
                      title="Lihat Rincian"
                      aria-label={`Lihat rincian ${item.santriNama}`}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
