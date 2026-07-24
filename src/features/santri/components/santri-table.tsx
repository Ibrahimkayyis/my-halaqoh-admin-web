"use client";

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
import { Pencil, KeyRound, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Santri } from "../types/santri.types";

interface SantriTableProps {
  data: Santri[];
  isLoading: boolean;
  onEdit: (santri: Santri) => void;
  onDelete: (santri: Santri) => void;
  onResetPassword: (santri: Santri) => void;
}

export function SantriTable({
  data,
  isLoading,
  onEdit,
  onDelete,
  onResetPassword,
}: SantriTableProps) {
  const { t } = useTranslation(["santri", "common"]);

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
    <div className="bg-surface rounded-lg border border-border/40 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("santri:table.nama")}</TableHead>
            <TableHead>{t("santri:table.nis")}</TableHead>
            <TableHead className="w-[100px]">{t("santri:table.kelas")}</TableHead>
            <TableHead className="text-right w-[150px]">{t("santri:table.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((santri) => (
            <TableRow key={santri.id}>
              <TableCell>
                <span className="font-semibold text-foreground">
                  {santri.nama}
                </span>
                {santri.isAlumni && (
                  <Badge variant="outline" className="ml-2 text-[10px] py-0 px-1 border-muted-foreground/30 text-muted-foreground">
                    {t("santri:filter.alumniOnly")}
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <span className="text-sm text-primary font-medium">
                  {santri.nis}
                </span>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="font-medium text-xs px-2 py-0.5 text-primary bg-primary/10">
                  {santri.kelas}{santri.program}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => onEdit(santri)}
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
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">{t("common:actions.delete")}</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
