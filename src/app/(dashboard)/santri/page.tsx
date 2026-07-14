"use client";

import { useState } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { SantriFilterBar } from "@/features/santri/components/santri-filter-bar";
import { SantriTable } from "@/features/santri/components/santri-table";
import { SantriFormDialog } from "@/features/santri/components/santri-form-dialog";
import { SantriBulkDialog } from "@/features/santri/components/santri-bulk-dialog";
import { KenaikanKelasDialog } from "@/features/santri/components/kenaikan-kelas-dialog";
import { Button } from "@/components/ui/button";
import { ChevronUp, Plus, FileUp, PenSquare } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function SantriPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [kenaikanOpen, setKenaikanOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const handleOpenForm = (editMode = false) => {
    setIsEdit(editMode);
    setFormOpen(true);
  };

  return (
    <PageContainer>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Kelola data santri, profil, dan penempatan kelas
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2" onClick={() => setKenaikanOpen(true)}>
            <ChevronUp className="w-4 h-4" />
            Naik Kelas
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 rounded-lg text-sm font-medium transition-colors outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              <Plus className="w-4 h-4" />
              Tambah Data
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => handleOpenForm(false)} className="cursor-pointer gap-2">
                <PenSquare className="w-4 h-4 text-muted-foreground" />
                <span>Input Manual</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setBulkOpen(true)} className="cursor-pointer gap-2">
                <FileUp className="w-4 h-4 text-muted-foreground" />
                <span>Upload File CSV</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <SantriFilterBar />
      
      <SantriTable onEdit={() => handleOpenForm(true)} />

      <SantriFormDialog 
        open={formOpen} 
        onOpenChange={setFormOpen} 
        isEdit={isEdit}
      />

      <SantriBulkDialog 
        open={bulkOpen} 
        onOpenChange={setBulkOpen} 
      />

      <KenaikanKelasDialog 
        open={kenaikanOpen} 
        onOpenChange={setKenaikanOpen} 
      />
    </PageContainer>
  );
}
