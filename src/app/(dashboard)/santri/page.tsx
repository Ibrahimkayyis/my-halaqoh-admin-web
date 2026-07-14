"use client";

import { useState, useMemo } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { SantriFilterBar } from "@/features/santri/components/santri-filter-bar";
import { SantriTable } from "@/features/santri/components/santri-table";
import { SantriFormDialog } from "@/features/santri/components/santri-form-dialog";
import { SantriBulkDialog } from "@/features/santri/components/santri-bulk-dialog";
import { KenaikanKelasDialog } from "@/features/santri/components/kenaikan-kelas-dialog";
import { SantriDeleteDialog } from "@/features/santri/components/santri-delete-dialog";
import { Button } from "@/components/ui/button";
import { ChevronUp, Plus, FileUp, PenSquare } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { 
  useGetSantri, 
  useDeleteSantri, 
  useResetPassword 
} from "@/features/santri/hooks/use-santri";
import type { Santri } from "@/features/santri/types/santri.types";

export default function SantriPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [kenaikanOpen, setKenaikanOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  
  // State for selected items
  const [selectedSantri, setSelectedSantri] = useState<Santri | null>(null);

  // Filter States
  const [search, setSearch] = useState("");
  const [selectedKelas, setSelectedKelas] = useState("semua");
  const [selectedProgram, setSelectedProgram] = useState("semua");
  const [showAlumni, setShowAlumni] = useState(false);

  // Queries & Mutations
  const { data: santriList = [], isLoading } = useGetSantri();
  const deleteMutation = useDeleteSantri();
  const resetPasswordMutation = useResetPassword();

  const handleOpenForm = (santri: Santri | null = null) => {
    setSelectedSantri(santri);
    setFormOpen(true);
  };

  const handleDeleteClick = (santri: Santri) => {
    setSelectedSantri(santri);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedSantri) return;
    try {
      await deleteMutation.mutateAsync(selectedSantri.id);
      setDeleteOpen(false);
      setSelectedSantri(null);
    } catch (e) {
      console.error("Delete failed:", e);
    }
  };

  const handleResetPassword = (santri: Santri) => {
    if (!santri.authUid) return;
    if (confirm(`Apakah Anda yakin ingin mereset password untuk santri ${santri.nama}? Password akan dikembalikan ke default: "generasi554"`)) {
      resetPasswordMutation.mutate(santri.authUid);
    }
  };

  // Client-side filtering logic
  const filteredSantri = useMemo(() => {
    return santriList.filter((santri) => {
      // 1. Filter by Alumni status (mutually exclusive view, same as mobile)
      if (showAlumni) {
        if (!santri.isAlumni) return false;
      } else {
        if (santri.isAlumni) return false;
      }

      // 2. Filter by search (Nama or NIS)
      if (search) {
        const query = search.toLowerCase();
        const matchNama = santri.nama.toLowerCase().includes(query);
        const matchNis = santri.nis.includes(query);
        if (!matchNama && !matchNis) return false;
      }

      // 3. Filter by Kelas
      if (selectedKelas !== "semua") {
        if (santri.kelas !== selectedKelas) return false;
      }

      // 4. Filter by Program
      if (selectedProgram !== "semua") {
        if (santri.program !== selectedProgram) return false;
      }

      return true;
    });
  }, [santriList, search, selectedKelas, selectedProgram, showAlumni]);

  // List of active (non-alumni) santri to pass to promotion wizard
  const activeSantriList = useMemo(() => {
    return santriList.filter((s) => !s.isAlumni);
  }, [santriList]);

  return (
    <PageContainer>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Kelola data santri, profil, dan penempatan kelas
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="flex items-center gap-2" 
            onClick={() => setKenaikanOpen(true)}
            disabled={activeSantriList.length === 0}
          >
            <ChevronUp className="w-4 h-4" />
            Naik Kelas
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 rounded-lg text-sm font-medium transition-colors outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              <Plus className="w-4 h-4" />
              Tambah Data
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => handleOpenForm(null)} className="cursor-pointer gap-2">
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

      <SantriFilterBar 
        search={search}
        setSearch={setSearch}
        selectedKelas={selectedKelas}
        setSelectedKelas={setSelectedKelas}
        selectedProgram={selectedProgram}
        setSelectedProgram={setSelectedProgram}
        showAlumni={showAlumni}
        setShowAlumni={setShowAlumni}
        filteredCount={filteredSantri.length}
        totalCount={santriList.filter(s => showAlumni ? s.isAlumni : !s.isAlumni).length}
      />
      
      <SantriTable 
        data={filteredSantri} 
        isLoading={isLoading}
        onEdit={handleOpenForm}
        onDelete={handleDeleteClick}
        onResetPassword={handleResetPassword}
      />

      <SantriFormDialog 
        open={formOpen} 
        onOpenChange={setFormOpen} 
        editData={selectedSantri}
      />

      <SantriBulkDialog 
        open={bulkOpen} 
        onOpenChange={setBulkOpen} 
      />

      <KenaikanKelasDialog 
        open={kenaikanOpen} 
        onOpenChange={setKenaikanOpen} 
        activeSantri={activeSantriList}
      />

      <SantriDeleteDialog 
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        santriName={selectedSantri?.nama}
        onConfirm={handleConfirmDelete}
        isPending={deleteMutation.isPending}
      />
    </PageContainer>
  );
}
