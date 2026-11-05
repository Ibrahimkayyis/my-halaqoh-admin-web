"use client";

import { useState } from "react";
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
  Bug,
  Lightbulb,
  HelpCircle,
  Clock,
  Loader2,
  CheckCircle2,
  Paperclip,
  ExternalLink,
  MessageSquareOff,
  ChevronLeft,
  ChevronRight,
  Smartphone,
} from "lucide-react";
import type {
  UserFeedback,
  FeedbackStatus,
  FeedbackCategory,
  FeedbackUserRole,
} from "@/types/models/feedback.types";

interface FeedbackTableProps {
  data: UserFeedback[];
  isLoading: boolean;
  onDetail: (feedback: UserFeedback) => void;
}

const ITEMS_PER_PAGE = 10;

export function FeedbackTable({
  data,
  isLoading,
  onDetail,
}: FeedbackTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(data.length / ITEMS_PER_PAGE));
  const paginatedData = data.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const formatDate = (ts?: { toDate?: () => Date } | null) => {
    if (!ts || typeof ts.toDate !== "function") return "-";
    try {
      const d = ts.toDate();
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "-";
    }
  };

  const renderCategoryBadge = (cat: FeedbackCategory) => {
    switch (cat) {
      case "bug":
        return (
          <Badge
            variant="outline"
            className="rounded-full px-2.5 py-0.5 text-[11px] font-medium bg-destructive/10 text-destructive border-destructive/20 flex items-center gap-1 w-fit"
          >
            <Bug className="h-3 w-3" />
            <span>Bug</span>
          </Badge>
        );
      case "saran":
        return (
          <Badge
            variant="outline"
            className="rounded-full px-2.5 py-0.5 text-[11px] font-medium bg-warning/10 text-warning border-warning/20 flex items-center gap-1 w-fit"
          >
            <Lightbulb className="h-3 w-3" />
            <span>Saran</span>
          </Badge>
        );
      case "pertanyaan":
      default:
        return (
          <Badge
            variant="outline"
            className="rounded-full px-2.5 py-0.5 text-[11px] font-medium bg-info/10 text-info border-info/20 flex items-center gap-1 w-fit"
          >
            <HelpCircle className="h-3 w-3" />
            <span>Tanya</span>
          </Badge>
        );
    }
  };

  const renderStatusBadge = (status: FeedbackStatus) => {
    switch (status) {
      case "open":
        return (
          <Badge
            variant="outline"
            className="rounded-full px-2.5 py-0.5 text-[11px] font-medium bg-warning/10 text-warning border-warning/20 flex items-center gap-1 w-fit"
          >
            <Clock className="h-3 w-3" />
            <span>Menunggu</span>
          </Badge>
        );
      case "in_progress":
        return (
          <Badge
            variant="outline"
            className="rounded-full px-2.5 py-0.5 text-[11px] font-medium bg-info/10 text-info border-info/20 flex items-center gap-1 w-fit"
          >
            <Loader2 className="h-3 w-3" />
            <span>Diproses</span>
          </Badge>
        );
      case "resolved":
        return (
          <Badge
            variant="outline"
            className="rounded-full px-2.5 py-0.5 text-[11px] font-medium bg-success/10 text-success border-success/20 flex items-center gap-1 w-fit"
          >
            <CheckCircle2 className="h-3 w-3" />
            <span>Selesai</span>
          </Badge>
        );
    }
  };

  const renderRoleBadge = (role: FeedbackUserRole) => {
    switch (role) {
      case "guru":
        return (
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Guru
          </span>
        );
      case "wali_santri":
        return (
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            Wali
          </span>
        );
      case "santri":
        return (
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            Santri
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
            {role}
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="bg-surface rounded-xl border border-border/40 p-4 space-y-3">
        <div className="hidden md:flex gap-4">
          <Skeleton className="h-6 w-1/6" />
          <Skeleton className="h-6 w-1/5" />
          <Skeleton className="h-6 w-1/6" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-6 w-1/6" />
        </div>
        <hr className="hidden md:block border-border/40" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col md:flex-row gap-3 md:gap-4 md:items-center p-3 rounded-lg border border-border/30 md:border-0"
          >
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-full md:flex-1" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-8 w-24" />
          </div>
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-surface rounded-xl border border-dashed border-border/60 p-12 text-center text-muted-foreground flex flex-col items-center justify-center gap-2">
        <MessageSquareOff className="w-9 h-9 text-muted-foreground/50 mb-1" />
        <p className="font-semibold text-foreground text-sm sm:text-base">
          Tidak ada masukan atau laporan kendala
        </p>
        <p className="text-xs text-muted-foreground max-w-sm">
          Belum ada masukan yang cocok dengan filter yang dipilih, atau belum ada masukan yang dikirimkan oleh pengguna aplikasi mobile.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden md:block bg-surface rounded-xl border border-border/40 overflow-hidden shadow-xs">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="border-b border-border/40 bg-muted/40 hover:bg-muted/40">
              <TableHead className="w-[145px] text-xs font-semibold text-muted-foreground">Tanggal</TableHead>
              <TableHead className="w-[180px] text-xs font-semibold text-muted-foreground">Pengirim</TableHead>
              <TableHead className="w-[110px] text-xs font-semibold text-muted-foreground">Kategori</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground">Subjek & Rincian</TableHead>
              <TableHead className="w-[170px] text-xs font-semibold text-muted-foreground">Perangkat</TableHead>
              <TableHead className="w-[125px] text-xs font-semibold text-muted-foreground">Status</TableHead>
              <TableHead className="w-[110px] text-right text-xs font-semibold text-muted-foreground">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item) => (
              <TableRow
                key={item.id}
                className="border-b border-border/40 hover:bg-muted/30 transition-colors"
              >
                {/* Tanggal */}
                <TableCell className="text-xs font-mono text-muted-foreground align-top py-3.5">
                  {formatDate(item.createdAt)}
                </TableCell>

                {/* Pengirim */}
                <TableCell className="align-top py-3.5">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-foreground leading-tight">
                      {item.userName}
                    </p>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {renderRoleBadge(item.userRole)}
                      <span className="text-[11px] font-mono text-muted-foreground">
                        {item.userIdentifier}
                      </span>
                    </div>
                  </div>
                </TableCell>

                {/* Kategori */}
                <TableCell className="align-top py-3.5">
                  {renderCategoryBadge(item.category)}
                </TableCell>

                {/* Subjek & Deskripsi */}
                <TableCell className="align-top py-3.5 max-w-[280px]">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-semibold text-foreground truncate">
                        {item.title}
                      </p>
                      {item.attachmentUrls && item.attachmentUrls.length > 0 && (
                        <span
                          className="inline-flex items-center text-[10px] text-muted-foreground bg-muted px-1.5 py-0.2 rounded shrink-0"
                          title={`${item.attachmentUrls.length} Lampiran Gambar`}
                        >
                          <Paperclip className="h-3 w-3 mr-0.5" />
                          {item.attachmentUrls.length}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </TableCell>

                {/* Info Perangkat */}
                <TableCell className="align-top py-3.5 text-xs">
                  <div className="space-y-0.5 text-muted-foreground">
                    <p className="font-medium text-foreground truncate">{item.deviceModel}</p>
                    <p className="text-[11px] truncate">
                      {item.osVersion} • <span className="font-mono">{item.appVersion}</span>
                    </p>
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell className="align-top py-3.5">
                  {renderStatusBadge(item.status)}
                </TableCell>

                {/* Aksi */}
                <TableCell className="align-top py-3.5 text-right">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onDetail(item)}
                    className="h-8 px-2.5 text-xs bg-surface hover:bg-muted border-border/70 text-foreground cursor-pointer"
                  >
                    <span>Tindak Lanjut</span>
                    <ExternalLink className="h-3 w-3 ml-1 text-muted-foreground" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Responsive Cards View */}
      <div className="md:hidden space-y-3">
        {paginatedData.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl bg-surface border border-border/60 shadow-xs space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {renderCategoryBadge(item.category)}
                  {renderStatusBadge(item.status)}
                </div>
                <h4 className="text-sm font-semibold text-foreground pt-1">
                  {item.title}
                </h4>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                {formatDate(item.createdAt)}
              </span>
            </div>

            <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
              {item.description}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-foreground">{item.userName}</span>
                  {renderRoleBadge(item.userRole)}
                </div>
                <p className="text-[11px] text-muted-foreground font-mono">
                  {item.userIdentifier}
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onDetail(item)}
                className="h-8 px-3 text-xs bg-surface border-border/70 text-foreground cursor-pointer"
              >
                Tindak Lanjut
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2 pt-2 text-xs text-muted-foreground">
          <p>
            Halaman <span className="font-semibold text-foreground font-mono">{currentPage}</span> dari{" "}
            <span className="font-semibold text-foreground font-mono">{totalPages}</span>
          </p>
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-8 w-8 p-0 cursor-pointer disabled:opacity-40"
              aria-label="Halaman Sebelumnya"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="h-8 w-8 p-0 cursor-pointer disabled:opacity-40"
              aria-label="Halaman Berikutnya"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
