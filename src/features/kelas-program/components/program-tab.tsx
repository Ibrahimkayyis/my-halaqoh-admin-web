"use client";

import { useState } from "react";
import { Edit2, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgramFormDialog } from "./program-form-dialog";
import { ProgramFormValues } from "../schemas/kelas-program.schema";

import { useGetProgram, useDeleteProgram } from "../hooks/use-program";
import type { Program } from "../types/kelas-program.types";

export function ProgramTab() {
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
    return <div className="text-center py-10 text-muted-foreground">Memuat data program...</div>;
  }

  return (
    <div className="space-y-6 mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {programList.map((program) => (
          <Card key={program.id} className="shadow-card border-border/40 bg-surface">
            <CardContent className="flex items-center justify-between p-5">
              <div className="flex flex-col space-y-1">
                <h3 className="text-lg font-bold text-foreground">{program.nama}</h3>
                <p className="text-xs text-muted-foreground">
                  ID: {program.id}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                  onClick={() => handleEdit(program)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleDelete(program.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {programList.length === 0 && (
          <div className="col-span-full text-center py-10 text-muted-foreground bg-surface rounded-md border border-dashed">
            Belum ada data program.
          </div>
        )}
      </div>

      <ProgramFormDialog 
        open={!!editData} 
        onOpenChange={(open) => !open && setEditData(null)} 
        defaultValues={editData || undefined}
      />
    </div>
  );
}
