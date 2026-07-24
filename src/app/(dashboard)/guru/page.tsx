"use client";

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { PageContainer } from "@/components/layout/page-container";
import { GuruFilterBar } from "@/features/guru/components/guru-filter-bar";
import { GuruTable } from "@/features/guru/components/guru-table";
import { GuruFormDialog } from "@/features/guru/components/guru-form-dialog";
import { GuruBulkDialog } from "@/features/guru/components/guru-bulk-dialog";
import { GuruDeleteDialog } from "@/features/guru/components/guru-delete-dialog";
import { Plus, FileUp, PenSquare } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { 
  useGetGuru, 
  useDeleteGuru, 
  useResetPasswordGuru 
} from "@/features/guru/hooks/use-guru";
import type { Guru } from "@/features/guru/types/guru.types";

export default function GuruPage() {
  const { t } = useTranslation(["guru", "common"]);

  const [formOpen, setFormOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  
  // State for selected items
  const [selectedGuru, setSelectedGuru] = useState<Guru | null>(null);

  // Filter States
  const [search, setSearch] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("semua");

  // Queries & Mutations
  const { data: guruList = [], isLoading } = useGetGuru();
  const deleteMutation = useDeleteGuru();
  const resetPasswordMutation = useResetPasswordGuru();

  const handleOpenForm = (guru: Guru | null = null) => {
    setSelectedGuru(guru);
    setFormOpen(true);
  };

  const handleDeleteClick = (guru: Guru) => {
    setSelectedGuru(guru);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedGuru) return;
    try {
      await deleteMutation.mutateAsync(selectedGuru.id);
      setDeleteOpen(false);
      setSelectedGuru(null);
    } catch (e) {
      console.error("Delete failed:", e);
    }
  };

  const handleResetPassword = (guru: Guru) => {
    if (!guru.authUid) return;
    if (confirm(`Apakah Anda yakin ingin mereset password untuk guru ${guru.nama}? Password akan dikembalikan ke default: "generasi554"`)) {
      resetPasswordMutation.mutate(guru.authUid);
    }
  };

  // Client-side filtering logic
  const filteredGuru = useMemo(() => {
    return guruList.filter((guru) => {
      // 1. Filter by search (Nama or NIP)
      if (search) {
        const queryVal = search.toLowerCase();
        const matchNama = guru.nama.toLowerCase().includes(queryVal);
        const matchNip = guru.nip.includes(queryVal);
        if (!matchNama && !matchNip) return false;
      }

      // 2. Filter by Program
      if (selectedProgram !== "semua") {
        if (guru.program !== selectedProgram) return false;
      }

      return true;
    });
  }, [guruList, search, selectedProgram]);

  return (
    <PageContainer>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-primary">
            {t("guru:subtitle")}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 rounded-lg text-sm font-medium transition-colors outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              <Plus className="w-4 h-4" />
              {t("common:actions.add")}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => handleOpenForm(null)} className="cursor-pointer gap-2">
                <PenSquare className="w-4 h-4 text-muted-foreground" />
                <span>Input Manual</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setBulkOpen(true)} className="cursor-pointer gap-2">
                <FileUp className="w-4 h-4 text-muted-foreground" />
                <span>Upload CSV</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <GuruFilterBar 
        search={search}
        setSearch={setSearch}
        selectedProgram={selectedProgram}
        setSelectedProgram={setSelectedProgram}
        filteredCount={filteredGuru.length}
        totalCount={guruList.length}
      />
      
      <GuruTable 
        data={filteredGuru}
        isLoading={isLoading}
        onEdit={handleOpenForm}
        onDelete={handleDeleteClick}
        onResetPassword={handleResetPassword}
      />

      <GuruFormDialog 
        open={formOpen} 
        onOpenChange={setFormOpen} 
        editData={selectedGuru}
      />

      <GuruBulkDialog 
        open={bulkOpen} 
        onOpenChange={setBulkOpen} 
      />

      <GuruDeleteDialog 
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        guruName={selectedGuru?.nama}
        onConfirm={handleConfirmDelete}
        isPending={deleteMutation.isPending}
      />
    </PageContainer>
  );
}
