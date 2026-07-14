"use client";

import { useState, useMemo } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { GuruFilterBar } from "@/features/guru/components/guru-filter-bar";
import { GuruTable, type GuruDummy } from "@/features/guru/components/guru-table";
import { GuruFormDialog } from "@/features/guru/components/guru-form-dialog";
import { GuruBulkDialog } from "@/features/guru/components/guru-bulk-dialog";
import { GuruDeleteDialog } from "@/features/guru/components/guru-delete-dialog";
import { Button } from "@/components/ui/button";
import { Plus, FileUp, PenSquare } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const INITIAL_DATA: GuruDummy[] = [
  {
    id: "1",
    nip: "19880501201501",
    nama: "Ustadz H. Luqman Hakim, Lc.",
    phone: "081234567890",
    program: "T",
  },
  {
    id: "2",
    nip: "19900812201802",
    nama: "Ustadz Ahmad Fauzi, S.Pd.I.",
    phone: "081298765432",
    program: "R",
  },
  {
    id: "3",
    nip: "19920315201901",
    nama: "Ustadz Muhammad Ridho, M.Ag.",
    phone: "081345678901",
    program: "T",
  },
  {
    id: "4",
    nip: "19951120202102",
    nama: "Ustadzah Fatimah Azzahra, S.Ag.",
    phone: "081398765432",
    program: "R",
  },
  {
    id: "5",
    nip: "19960707202201",
    nama: "Ustadzah Aisyah Humaira, S.Pd.",
    phone: "081288889999",
    program: "R",
  },
];

export default function GuruPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  
  // State for selected items
  const [selectedGuru, setSelectedGuru] = useState<GuruDummy | null>(null);

  // Filter States
  const [search, setSearch] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("semua");

  const handleOpenForm = (guru: GuruDummy | null = null) => {
    setSelectedGuru(guru);
    setFormOpen(true);
  };

  const handleDeleteClick = (guru: GuruDummy) => {
    setSelectedGuru(guru);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedGuru) {
      console.log("Delete guru:", selectedGuru.nip);
      setDeleteOpen(false);
      setSelectedGuru(null);
    }
  };

  const handleResetPassword = (guru: GuruDummy) => {
    if (confirm(`Apakah Anda yakin ingin mereset password untuk guru ${guru.nama}? Password akan dikembalikan ke default: "generasi554"`)) {
      console.log("Reset password for guru:", guru.nip);
    }
  };

  // Client-side filtering logic
  const filteredGuru = useMemo(() => {
    return INITIAL_DATA.filter((guru) => {
      // 1. Filter by search (Nama or NIP)
      if (search) {
        const query = search.toLowerCase();
        const matchNama = guru.nama.toLowerCase().includes(query);
        const matchNip = guru.nip.includes(query);
        if (!matchNama && !matchNip) return false;
      }

      // 2. Filter by Program
      if (selectedProgram !== "semua") {
        if (guru.program !== selectedProgram) return false;
      }

      return true;
    });
  }, [search, selectedProgram]);

  return (
    <PageContainer>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Kelola data guru, profil, dan penempatan program
          </h1>
        </div>

        <div className="flex items-center gap-3">
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
                <span>Upload File CSV / Excel</span>
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
        totalCount={INITIAL_DATA.length}
      />
      
      <GuruTable 
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
      />
    </PageContainer>
  );
}
