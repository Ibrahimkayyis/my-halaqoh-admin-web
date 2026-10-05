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
import { Pencil, KeyRound, Trash2, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Santri } from "../types/santri.types";

interface SantriTableProps {
  data: Santri[];
  isLoading: boolean;
  onEdit: (santri: Santri) => void;
  onDelete: (santri: Santri) => void;
  onResetPassword: (santri: Santri) => void;
  isSelectionMode?: boolean;
  selectedIds?: string[];
  onToggleSelect?: (id: string) => void;
  onToggleSelectAll?: (visibleIds: string[]) => void;
}

export function SantriTable({
  data,
  isLoading,
  onEdit,
  onDelete,
  onResetPassword,
  isSelectionMode = false,
  selectedIds = [],
  onToggleSelect,
  onToggleSelectAll,
}: SantriTableProps) {
  const { t } = useTranslation(["santri", "common"]);

  const allSelected = data.length > 0 && data.every((s) => selectedIds.includes(s.id));
  const isIndeterminate = data.some((s) => selectedIds.includes(s.id)) && !allSelected;

  if (isLoading) {
    return (
      <div className="bg-surface rounded-lg border border-border/40 p-4 space-y-3">
        <div className="flex gap-4">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-6 w-1/4" />
        </div>
        <hr className="border-border/40" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-4 items-center">
            <Skeleton className="h-5 flex-1" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-8 w-24" />
          </div>
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-surface rounded-lg border border-dashed border-border/60 p-8 text-center text-muted-foreground">
        {t("santri:table.empty")}
      </div>
    );
  }

  return (
    <div className="w-full md:bg-surface md:rounded-xl md:border md:border-border/40 md:shadow-xs md:overflow-hidden">
      <Table className="w-full">
        <TableHeader className="hidden md:table-header-group">
          <TableRow>
            {isSelectionMode && (
              <TableHead className="w-[44px] px-3 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = isIndeterminate;
                  }}
                  onChange={() => onToggleSelectAll?.(data.map((s) => s.id))}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary/30 cursor-pointer"
                  aria-label="Pilih Semua Santri"
                />
              </TableHead>
            )}
            <TableHead className="py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold">{t("santri:table.nama")}</TableHead>
            <TableHead className="py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold">{t("santri:table.nis")}</TableHead>
            <TableHead className="w-[100px] py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold">{t("santri:table.kelas")}</TableHead>
            <TableHead className="text-right w-[180px] py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold">{t("santri:table.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="grid grid-cols-1 gap-3 md:table-row-group md:gap-0">
          {data.map((santri) => {
            const isSelected = selectedIds.includes(santri.id);
            return (
              <TableRow
                key={santri.id}
                className={cn(
                  // Mobile: Card item
                  "flex flex-col p-4 rounded-xl border border-border/60 bg-card shadow-xs transition-all space-y-2.5",
                  // Desktop: Table row
                  "md:table-row md:p-0 md:rounded-none md:border-0 md:border-b md:border-border/40 md:bg-transparent md:shadow-none md:space-y-0",
                  isSelectionMode && isSelected && "bg-primary/5 border-primary/40 md:border-border/40"
                )}
              >
                {/* 1. Selection Checkbox */}
                {isSelectionMode && (
                  <TableCell className="flex md:table-cell items-center justify-between p-0 md:px-3 md:py-3 sm:md:py-3.5 md:w-[44px]">
                    <span className="text-xs font-medium text-muted-foreground md:hidden">Pilih</span>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect?.(santri.id)}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-primary/30 cursor-pointer"
                      aria-label={`Pilih santri ${santri.nama}`}
                    />
                  </TableCell>
                )}

                {/* 2. Nama & Alumni Badge */}
                <TableCell className="flex md:table-cell items-center justify-between p-0 md:px-4 md:py-3 sm:md:py-3.5">
                  <span className="text-xs font-medium text-muted-foreground md:hidden">{t("santri:table.nama")}</span>
                  <div className="flex items-center gap-2 flex-wrap justify-end md:justify-start">
                    <Link
                      href={`/santri/${santri.id}`}
                      className="text-sm font-semibold text-foreground hover:text-primary hover:underline transition-colors"
                    >
                      {santri.nama}
                    </Link>
                    {santri.isAlumni && (
                      <Badge variant="outline" className="text-[10px] py-0 px-1 border-muted-foreground/30 text-muted-foreground">
                        {t("santri:filter.alumniOnly")}
                      </Badge>
                    )}
                  </div>
                </TableCell>

                {/* 3. NIS */}
                <TableCell className="flex md:table-cell items-center justify-between p-0 md:px-4 md:py-3 sm:md:py-3.5">
                  <span className="text-xs font-medium text-muted-foreground md:hidden">{t("santri:table.nis")}</span>
                  <span className="text-xs sm:text-sm text-primary font-medium font-mono">
                    {santri.nis}
                  </span>
                </TableCell>

                {/* 4. Kelas & Program */}
                <TableCell className="flex md:table-cell items-center justify-between p-0 md:px-4 md:py-3 sm:md:py-3.5 md:w-[100px]">
                  <span className="text-xs font-medium text-muted-foreground md:hidden">{t("santri:table.kelas")}</span>
                  <Badge variant="secondary" className="font-semibold text-[11px] sm:text-xs px-2 py-0.5 text-primary bg-primary/10">
                    {santri.kelas}{santri.program}
                  </Badge>
                </TableCell>

                {/* 5. Aksi */}
                <TableCell className="flex md:table-cell items-center justify-between pt-2.5 md:pt-0 p-0 md:px-4 md:py-3 sm:md:py-3.5 border-t border-border/40 md:border-t-0 text-right md:w-[180px]">
                  <span className="text-xs font-medium text-muted-foreground md:hidden">{t("santri:table.actions")}</span>
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/santri/${santri.id}`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        title="Lihat Detail Santri"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Lihat Detail</span>
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => onEdit(santri)}
                      title="Edit Santri"
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">{t("common:actions.edit")}</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => onResetPassword(santri)}
                      disabled={!santri.authUid}
                      title={!santri.authUid ? "Akun Auth belum aktif" : "Reset Password"}
                    >
                      <KeyRound className="h-4 w-4" />
                      <span className="sr-only">Reset Password</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => onDelete(santri)}
                      title="Hapus Santri"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">{t("common:actions.delete")}</span>
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
