"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Edit2, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

  if (isLoading) {
    return <div className="text-center py-10 text-muted-foreground">{t("common:status.loading")}</div>;
  }

  return (
    <div className="space-y-6 mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kelasList.map((kelas) => (
          <Card key={kelas.id} className="shadow-card border-border/40 bg-surface">
            <CardContent className="flex items-center justify-between p-5">
              <div className="flex flex-col space-y-1">
                <h3 className="text-lg font-bold text-foreground">{kelas.nama}</h3>
                <p className="text-xs text-muted-foreground">
                  {t("kelasProgram:kelas.order")}: {kelas.urutan} | {t("kelasProgram:kelas.nextClass")}: {kelas.nextKelasId || t("kelasProgram:kelas.noNextClass")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                  onClick={() => handleEdit(kelas)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleDelete(kelas.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {kelasList.length === 0 && (
          <div className="col-span-full text-center py-10 text-muted-foreground bg-surface rounded-md border border-dashed">
            {t("kelasProgram:kelas.empty")}
          </div>
        )}
      </div>

      <KelasFormDialog 
        open={!!editData} 
        onOpenChange={(open) => !open && setEditData(null)} 
        defaultValues={editData || undefined}
      />
    </div>
  );
}
