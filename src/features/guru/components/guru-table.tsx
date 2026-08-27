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
        {t("guru:table.empty")}
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-lg border border-border/40 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            {isSelectionMode && (
              <TableHead className="w-[44px] px-3">
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
            <TableHead>{t("guru:table.nama")}</TableHead>
            <TableHead>{t("guru:table.nip")}</TableHead>
            <TableHead className="w-[150px]">{t("guru:table.program")}</TableHead>
            <TableHead className="text-right w-[180px]">{t("guru:table.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((guru) => {
            const isSelected = selectedIds.includes(guru.id);
            return (
              <TableRow key={guru.id} className={cn(isSelectionMode && isSelected && "bg-primary/5")}>
                {isSelectionMode && (
                  <TableCell className="w-[44px] px-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect?.(guru.id)}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-primary/30 cursor-pointer"
                      aria-label={`Pilih guru ${guru.nama}`}
                    />
                  </TableCell>
                )}
                <TableCell>
                  <Link
                    href={`/guru/${guru.id}`}
                    className="font-semibold text-foreground hover:text-primary hover:underline transition-colors"
                  >
                    {guru.nama}
                  </Link>
                </TableCell>
              <TableCell>
                <span className="text-sm text-primary font-medium">
                  {guru.nip}
                </span>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="font-medium text-xs px-2 py-0.5 text-primary bg-primary/10">
                  {guru.program === "R" ? t("common:labels.programReguler") : t("common:labels.programTakhassus")}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Link href={`/guru/${guru.id}`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                      title="Lihat Detail Guru"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Lihat Detail</span>
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => onEdit(guru)}
                    title="Edit Guru"
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">{t("common:actions.edit")}</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
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
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
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
  );
}
