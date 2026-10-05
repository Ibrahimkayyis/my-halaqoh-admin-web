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
import type { Guru } from "../types/guru.types";

interface GuruTableProps {
  data: Guru[];
  isLoading: boolean;
  onEdit: (guru: Guru) => void;
  onDelete: (guru: Guru) => void;
  onResetPassword: (guru: Guru) => void;
  isSelectionMode?: boolean;
  selectedIds?: string[];
  onToggleSelect?: (id: string) => void;
  onToggleSelectAll?: (visibleIds: string[]) => void;
}

export function GuruTable({
  data,
  isLoading,
  onEdit,
  onDelete,
  onResetPassword,
  isSelectionMode = false,
  selectedIds = [],
  onToggleSelect,
  onToggleSelectAll,
}: GuruTableProps) {
  const { t } = useTranslation(["guru", "common"]);

  const allSelected = data.length > 0 && data.every((g) => selectedIds.includes(g.id));
  const isIndeterminate = data.some((g) => selectedIds.includes(g.id)) && !allSelected;

  if (isLoading) {
    return (
      <div className="bg-surface rounded-xl border border-border/60 p-4 sm:p-5 space-y-3 shadow-xs">
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
      <div className="bg-surface rounded-xl border border-dashed border-border/60 p-8 sm:p-12 text-center text-sm text-muted-foreground">
        {t("guru:table.empty")}
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-xl border border-border/60 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <Table className="min-w-[620px]">
          <TableHeader>
            <TableRow className="border-b border-border/60 hover:bg-transparent">
              {isSelectionMode && (
                <TableHead className="w-[44px] px-3 sm:px-4">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isIndeterminate;
                    }}
                    onChange={() => onToggleSelectAll?.(data.map((g) => g.id))}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary/30 cursor-pointer"
                    aria-label="Pilih Semua Guru"
                  />
                </TableHead>
              )}
              <TableHead className="px-3 sm:px-4">{t("guru:table.nama")}</TableHead>
              <TableHead className="px-3 sm:px-4">{t("guru:table.nip")}</TableHead>
              <TableHead className="w-[150px] px-3 sm:px-4">{t("guru:table.program")}</TableHead>
              <TableHead className="text-right w-[180px] px-3 sm:px-4">{t("guru:table.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((guru) => {
              const isSelected = selectedIds.includes(guru.id);
              return (
                <TableRow
                  key={guru.id}
                  className={cn(
                    "border-b border-border/40 transition-colors",
                    isSelectionMode && isSelected && "bg-primary/5"
                  )}
                >
                  {isSelectionMode && (
                    <TableCell className="w-[44px] px-3 sm:px-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect?.(guru.id)}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary/30 cursor-pointer"
                        aria-label={`Pilih guru ${guru.nama}`}
                      />
                    </TableCell>
                  )}
                  <TableCell className="px-3 sm:px-4 py-3">
                    <Link
                      href={`/guru/${guru.id}`}
                      className="font-semibold text-xs sm:text-sm text-foreground hover:text-primary hover:underline transition-colors block truncate max-w-[220px]"
                    >
                      {guru.nama}
                    </Link>
                  </TableCell>
                  <TableCell className="px-3 sm:px-4 py-3">
                    <span className="text-xs sm:text-sm text-foreground font-mono font-medium">
                      {guru.nip}
                    </span>
                  </TableCell>
                  <TableCell className="px-3 sm:px-4 py-3">
                    <Badge
                      variant="secondary"
                      className="font-semibold text-[11px] sm:text-xs px-2.5 py-0.5 rounded-md text-primary bg-primary/10 border border-primary/20 shadow-none"
                    >
                      {guru.program === "R"
                        ? t("common:labels.programReguler")
                        : t("common:labels.programTakhassus")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right px-3 sm:px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/guru/${guru.id}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                          title="Lihat Detail Guru"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Lihat Detail</span>
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                        onClick={() => onEdit(guru)}
                        title="Edit Guru"
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">{t("common:actions.edit")}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer disabled:opacity-40"
                        onClick={() => onResetPassword(guru)}
                        disabled={!guru.authUid}
                        title={!guru.authUid ? "Akun Auth belum aktif" : "Reset Password"}
                      >
                        <KeyRound className="h-4 w-4" />
                        <span className="sr-only">Reset Password</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                        onClick={() => onDelete(guru)}
                        title="Hapus Guru"
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
    </div>
  );
}
