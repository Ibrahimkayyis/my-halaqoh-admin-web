"use client";

import { useState } from "react";
import { Edit2, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KelasFormDialog } from "./kelas-form-dialog";
import { KelasFormValues } from "../schemas/kelas-program.schema";

// Mock data
const MOCK_KELAS = [
  { id: "1", nama: "Kelas 7", urutan: 1, nextKelasId: "2", nextKelasName: "Kelas 8" },
  { id: "2", nama: "Kelas 8", urutan: 2, nextKelasId: "3", nextKelasName: "Kelas 9" },
  { id: "3", nama: "Kelas 9", urutan: 3, nextKelasId: "4", nextKelasName: "Kelas 10" },
  { id: "4", nama: "Kelas 10", urutan: 4, nextKelasId: "5", nextKelasName: "Kelas 11" },
  { id: "5", nama: "Kelas 11", urutan: 5, nextKelasId: "6", nextKelasName: "Kelas 12" },
  { id: "6", nama: "Kelas 12", urutan: 6, nextKelasId: "none", nextKelasName: "Lulus (Alumni)" },
];

export function KelasTab() {
  const [editData, setEditData] = useState<Partial<KelasFormValues> | null>(null);

  const handleEdit = (kelas: typeof MOCK_KELAS[0]) => {
    setEditData({
      nama: kelas.nama.replace("Kelas ", ""), // just an example to strip "Kelas " if needed, or pass as is
      urutan: kelas.urutan,
      nextKelasId: kelas.nextKelasId,
    });
  };

  const handleDelete = (id: string) => {
    console.log("Delete kelas:", id);
    // TODO: show confirm dialog
  };

  return (
    <div className="space-y-6 mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_KELAS.map((kelas) => (
          <Card key={kelas.id} className="shadow-card border-border/40 bg-surface">
            <CardContent className="flex items-center justify-between p-5">
              <div className="flex flex-col space-y-1">
                <h3 className="text-lg font-bold text-foreground">{kelas.nama}</h3>
                <p className="text-xs text-muted-foreground">
                  Urutan: {kelas.urutan} | Promosi ke: {kelas.nextKelasName.replace("Kelas ", "")}
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
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <KelasFormDialog 
        open={!!editData} 
        onOpenChange={(open) => !open && setEditData(null)} 
        defaultValues={editData || undefined}
      />
    </div>
  );
}
