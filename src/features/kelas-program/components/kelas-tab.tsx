"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Edit2, Trash2, GraduationCap, ArrowRight, Sparkles } from "lucide-react";
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
import { KelasFormDialog } from "./kelas-form-dialog";
import { KelasFormValues } from "../schemas/kelas-program.schema";

import { useGetKelas, useDeleteKelas } from "../hooks/use-kelas";
import type { Kelas } from "../types/kelas-program.types";

export function KelasTab() {
  const { t } = useTranslation(["kelasProgram", "common"]);
  const [editData, setEditData] = useState<(Partial<KelasFormValues> & { id: string }) | null>(null);

  const { data: kelasList = [], isLoading } = useGetKelas();
  const deleteMutation = useDeleteKelas();

  const handleEdit = (kelas: Kelas) => {
    setEditData({
      id: kelas.id,
      nama: kelas.nama,
      urutan: kelas.urutan,
      nextKelasId: kelas.nextKelasId || undefined,
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus kelas ini?")) {
      deleteMutation.mutate(id);
    }
  };

  const getNextKelasLabel = (currentKelas: Kelas, allKelas: Kelas[]) => {
    // 1. If explicit nextKelasId exists and matches another class
    if (currentKelas.nextKelasId) {
      const match = allKelas.find(
        (k) => k.id === currentKelas.nextKelasId || k.nama === currentKelas.nextKelasId
      );
      return match ? `Kelas ${match.nama}` : currentKelas.nextKelasId;
    }

    // 2. Resolve by numeric class name (e.g. 7 -> 8, 11 -> 12, 12 -> Alumni)
    const currentNum = parseInt(currentKelas.nama, 10);
    if (!isNaN(currentNum)) {
      if (currentNum >= 12) {
        return t("kelasProgram:kelas.noNextClass");
      }
      const nextNum = currentNum + 1;
      const match = allKelas.find((k) => parseInt(k.nama, 10) === nextNum);
      if (match) return `Kelas ${match.nama}`;
      return `Kelas ${nextNum}`;
    }

    // 3. Resolve by sequence order (urutan)
    const nextByOrder = allKelas.find((k) => k.urutan === currentKelas.urutan + 1);
    if (nextByOrder) {
      return `Kelas ${nextByOrder.nama}`;
    }

    return t("kelasProgram:kelas.noNextClass");
  };

  const getJenjangLabel = (nama: string) => {
    const num = parseInt(nama, 10);
    if (!isNaN(num)) {
      return num <= 9 ? "SMP" : "SMA";
    }
    return "Umum";
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
              <GraduationCap className="h-4 w-4 text-primary" />
              <h3 className="text-sm sm:text-base font-bold text-foreground tracking-tight">
                {t("kelasProgram:kelas.title")}
              </h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Konfigurasi urutan jenjang pendidikan dan alur kenaikan kelas otomatis santri
            </p>
          </div>

          <Badge variant="outline" className="text-xs font-semibold border-primary/30 text-primary bg-primary/5 self-start sm:self-auto">
            {kelasList.length} Tingkat Kelas Terdaftar
          </Badge>
        </div>

        {/* Structured Table */}
        <div className="w-full">
          <Table className="w-full">
            <TableHeader className="hidden md:table-header-group bg-muted/30">
              <TableRow className="border-border/40">
                <TableHead className="w-20 text-xs font-bold">Urutan</TableHead>
                <TableHead className="text-xs font-bold">Nama Tingkat Kelas</TableHead>
                <TableHead className="text-xs font-bold">Jenjang</TableHead>
                <TableHead className="text-xs font-bold">Kelas Selanjutnya (Kenaikan)</TableHead>
                <TableHead className="text-xs font-bold">Target Semester Aktif (R / T)</TableHead>
                <TableHead className="w-28 text-right text-xs font-bold">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="grid grid-cols-1 gap-3 p-3 md:table-row-group md:p-0 md:gap-0">
              {kelasList.map((kelas) => {
                const nextLabel = getNextKelasLabel(kelas, kelasList);
                const isAlumni = nextLabel.includes("Alumni");
                const jenjang = getJenjangLabel(kelas.nama);

                return (
                  <TableRow
                    key={kelas.id}
                    className="flex flex-col p-4 rounded-xl border border-border/60 bg-card shadow-xs transition-all space-y-3 hover:border-border/90 md:table-row md:p-0 md:rounded-none md:border-0 md:border-b md:border-border/30 md:bg-transparent md:shadow-none md:space-y-0 md:hover:bg-muted/20"
                  >
                    {/* Urutan */}
                    <TableCell className="p-0 md:px-4 md:py-3.5 flex items-center justify-between gap-2 md:table-cell">
                      <span className="text-xs text-muted-foreground md:hidden font-medium">Urutan Tingkat:</span>
                      <span className="font-mono text-xs font-bold text-muted-foreground bg-muted/50 px-2 py-0.5 rounded md:bg-transparent md:p-0">
                        {kelas.urutan}
                      </span>
                    </TableCell>

                    {/* Nama Kelas */}
                    <TableCell className="p-0 md:px-4 md:py-3.5 flex items-center justify-between gap-2 md:table-cell">
                      <span className="text-xs text-muted-foreground md:hidden font-medium">Nama Tingkat:</span>
                      <span className="font-bold text-sm text-foreground">
                        {kelas.nama.startsWith("Kelas") ? kelas.nama : `Kelas ${kelas.nama}`}
                      </span>
                    </TableCell>

                    {/* Jenjang */}
                    <TableCell className="p-0 md:px-4 md:py-3.5 flex items-center justify-between gap-2 md:table-cell">
                      <span className="text-xs text-muted-foreground md:hidden font-medium">Jenjang:</span>
                      <Badge
                        variant="secondary"
                        className={`text-[11px] font-semibold rounded-md px-2 py-0.5 ${
                          jenjang === "SMP"
                            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                            : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        }`}
                      >
                        {jenjang}
                      </Badge>
                    </TableCell>

                    {/* Next Class */}
                    <TableCell className="p-0 md:px-4 md:py-3.5 flex items-center justify-between gap-2 md:table-cell">
                      <span className="text-xs text-muted-foreground md:hidden font-medium">Kelas Selanjutnya:</span>
                      {isAlumni ? (
                        <Badge
                          variant="outline"
                          className="font-semibold text-xs rounded-md px-2.5 py-0.5 text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20"
                        >
                          <Sparkles className="h-3 w-3 mr-1" />
                          {nextLabel}
                        </Badge>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground bg-muted/40 px-2.5 py-1 rounded-md border border-border/40">
                          <ArrowRight className="h-3 w-3 text-primary shrink-0" />
                          <span>{nextLabel}</span>
                        </div>
                      )}
                    </TableCell>

                    {/* Target info */}
                    <TableCell className="p-0 md:px-4 md:py-3.5 flex items-center justify-between gap-2 md:table-cell">
                      <span className="text-xs text-muted-foreground md:hidden font-medium">Target Semester:</span>
                      <span className="text-xs text-muted-foreground font-medium text-right md:text-left">
                        {kelas.nama === "7" || kelas.nama === "10"
                          ? "1 Juz (R) / 3 Juz (T)"
                          : kelas.nama === "8" || kelas.nama === "11"
                          ? "4 Juz (R) / 7 Juz (T)"
                          : "5 Juz (R) / 10-15 Juz (T)"}
                      </span>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="p-0 pt-2.5 mt-1 border-t border-border/40 md:border-t-0 md:p-0 md:px-4 md:py-3.5 md:table-cell md:text-right">
                      <div className="flex items-center justify-end gap-2 md:gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-1 sm:flex-initial h-9 sm:h-8 px-3 text-xs text-primary hover:text-primary hover:bg-primary/10 gap-1.5 cursor-pointer font-medium"
                          onClick={() => handleEdit(kelas)}
                          title="Edit Kelas"
                          aria-label={`Edit ${kelas.nama}`}
                        >
                          <Edit2 className="h-4 w-4" />
                          <span className="md:hidden">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-1 sm:flex-initial h-9 sm:h-8 px-3 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5 cursor-pointer font-medium"
                          onClick={() => handleDelete(kelas.id)}
                          disabled={deleteMutation.isPending}
                          title="Hapus Kelas"
                          aria-label={`Hapus ${kelas.nama}`}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="md:hidden">Hapus</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}

              {kelasList.length === 0 && (
                <TableRow className="border-0">
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground text-xs">
                    <GraduationCap className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                    {t("kelasProgram:kelas.empty")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <KelasFormDialog
        open={!!editData}
        onOpenChange={(open) => !open && setEditData(null)}
        defaultValues={editData || undefined}
      />
    </div>
  );
}
