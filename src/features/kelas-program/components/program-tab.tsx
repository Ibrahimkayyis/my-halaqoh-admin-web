"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Edit2, Trash2, BookOpen, Clock, Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProgramFormDialog } from "./program-form-dialog";
import { ProgramFormValues } from "../schemas/kelas-program.schema";

import { useGetProgram, useDeleteProgram } from "../hooks/use-program";
import type { Program } from "../types/kelas-program.types";

export function ProgramTab() {
  const { t } = useTranslation(["kelasProgram", "common"]);
  const [editData, setEditData] = useState<(Partial<ProgramFormValues> & { id: string }) | null>(null);

  const { data: programList = [], isLoading } = useGetProgram();
  const deleteMutation = useDeleteProgram();

  const handleEdit = (program: Program) => {
    setEditData({
      id: program.id,
      nama: program.nama,
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus program ini?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-sm text-muted-foreground animate-pulse">
        {t("common:status.loading")}
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-6">
      <Card className="rounded-xl border border-border/60 bg-card shadow-xs overflow-hidden">
        {/* Panel Header */}
        <div className="p-4 sm:p-6 border-b border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <h3 className="text-sm sm:text-base font-bold text-foreground tracking-tight">
                {t("kelasProgram:program.title")}
              </h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Daftar kurikulum program tahfidz Al-Qur&apos;an dan beban jadwal sesi harian
            </p>
          </div>

          <Badge variant="outline" className="text-xs font-semibold border-primary/30 text-primary bg-primary/5 self-start sm:self-auto">
            {programList.length} Program Aktif
          </Badge>
        </div>

        {/* Structured Table */}
        <div className="w-full">
          <Table className="w-full">
            <TableHeader className="hidden md:table-header-group bg-muted/30">
              <TableRow className="border-border/40">
                <TableHead className="w-24 text-xs font-bold">Kode</TableHead>
                <TableHead className="text-xs font-bold">Nama Program</TableHead>
                <TableHead className="text-xs font-bold">Target Kelulusan</TableHead>
                <TableHead className="text-xs font-bold">Beban Jadwal Sesi Harian</TableHead>
                <TableHead className="w-28 text-right text-xs font-bold">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="grid grid-cols-1 gap-3 p-3 md:table-row-group md:p-0 md:gap-0">
              {programList.map((program) => {
                const isReguler = program.id === "R" || program.nama.toLowerCase().includes("reguler");

                return (
                  <TableRow
                    key={program.id}
                    className="flex flex-col p-4 rounded-xl border border-border/60 bg-card shadow-xs transition-all space-y-3 hover:border-border/90 md:table-row md:p-0 md:rounded-none md:border-0 md:border-b md:border-border/30 md:bg-transparent md:shadow-none md:space-y-0 md:hover:bg-muted/20"
                  >
                    {/* Kode Program */}
                    <TableCell className="p-0 md:px-4 md:py-3.5 flex items-center justify-between gap-2 md:table-cell">
                      <span className="text-xs text-muted-foreground md:hidden font-medium">Kode Program:</span>
                      <Badge
                        variant="secondary"
                        className="font-mono font-bold text-xs rounded-md px-2.5 py-1 text-primary bg-primary/10 border border-primary/20"
                      >
                        {program.id}
                      </Badge>
                    </TableCell>

                    {/* Nama Program */}
                    <TableCell className="p-0 md:px-4 md:py-3.5 flex flex-col md:table-cell">
                      <span className="text-xs text-muted-foreground md:hidden font-medium mb-1">Nama Program:</span>
                      <div className="space-y-0.5">
                        <span className="font-bold text-sm text-foreground block">
                          Program {program.nama}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {isReguler ? "Jalur Tahfidz Reguler Pesantren" : "Jalur Khusus Tahfidz Intensif (Takhassus)"}
                        </span>
                      </div>
                    </TableCell>

                    {/* Target Kelulusan */}
                    <TableCell className="p-0 md:px-4 md:py-3.5 flex items-center justify-between gap-2 md:table-cell">
                      <span className="text-xs text-muted-foreground md:hidden font-medium">Target Kelulusan:</span>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                        <Target className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span>{isReguler ? "5 Juz Al-Qur'an" : "15 Juz Al-Qur'an"}</span>
                      </div>
                    </TableCell>

                    {/* Jadwal Sesi */}
                    <TableCell className="p-0 md:px-4 md:py-3.5 flex items-center justify-between gap-2 md:table-cell">
                      <span className="text-xs text-muted-foreground md:hidden font-medium">Beban Jadwal:</span>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium text-right md:text-left">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span>{isReguler ? "2 Sesi / hari (Shubuh, Maghrib)" : "5 Sesi / hari (Semua Sesi)"}</span>
                      </div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="p-0 pt-2 mt-1 border-t border-border/40 md:border-t-0 md:p-0 md:px-4 md:py-3.5 md:table-cell md:text-right">
                      <div className="flex items-center justify-end gap-2 md:gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-1 sm:flex-initial h-9 sm:h-8 px-3 text-xs text-primary hover:text-primary hover:bg-primary/10 gap-1.5 cursor-pointer font-medium"
                          onClick={() => handleEdit(program)}
                          title="Edit Program"
                          aria-label={`Edit ${program.nama}`}
                        >
                          <Edit2 className="h-4 w-4" />
                          <span className="md:hidden">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-1 sm:flex-initial h-9 sm:h-8 px-3 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5 cursor-pointer font-medium"
                          onClick={() => handleDelete(program.id)}
                          disabled={deleteMutation.isPending}
                          title="Hapus Program"
                          aria-label={`Hapus ${program.nama}`}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="md:hidden">Hapus</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}

              {programList.length === 0 && (
                <TableRow className="border-0">
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground text-xs">
                    <BookOpen className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                    {t("kelasProgram:program.empty")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <ProgramFormDialog
        open={!!editData}
        onOpenChange={(open) => !open && setEditData(null)}
        defaultValues={editData || undefined}
      />
    </div>
  );
}
