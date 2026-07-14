"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { HalaqohFilterBar } from "@/features/halaqoh/components/halaqoh-filter-bar";
import { HalaqohGrid } from "@/features/halaqoh/components/halaqoh-grid";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import type { HalaqohDummy } from "@/features/halaqoh/components/halaqoh-card";

const DUMMY_HALAQOH: HalaqohDummy[] = [
  {
    id: "1",
    nama: "Halaqoh 9 R 1",
    kelas: "9",
    program: "R",
    guruId: "g1",
    guruNama: "MAMAT RAHMATULLAH",
    jumlahSantri: 8,
  },
  {
    id: "2",
    nama: "Halaqoh Ust. Ali Akbar",
    kelas: "8",
    program: "T",
    guruId: "g2",
    guruNama: "ALI AKBAR PELAYATI",
    jumlahSantri: 5,
  },
  {
    id: "3",
    nama: "Halaqoh Ust. Daud Kahfi",
    kelas: "8",
    program: "R",
    guruId: "g3",
    guruNama: "DAUD KAHFI",
    jumlahSantri: 11,
  },
  {
    id: "4",
    nama: "Halaqoh Ust. Ahmad",
    kelas: "7",
    program: "R",
    guruId: "g4",
    guruNama: "AHMAD SYAHID",
    jumlahSantri: 12,
  },
  {
    id: "5",
    nama: "Halaqoh 10 T 1",
    kelas: "10",
    program: "T",
    guruId: "g5",
    guruNama: "UST. ABDURRAHMAN",
    jumlahSantri: 14,
  },
  {
    id: "6",
    nama: "Halaqoh 11 R 2",
    kelas: "11",
    program: "R",
    guruId: "g6",
    guruNama: "UST. HASAN BASRI",
    jumlahSantri: 9,
  },
  {
    id: "7",
    nama: "Halaqoh 12 T 2",
    kelas: "12",
    program: "T",
    guruId: "g7",
    guruNama: "UST. NUR HIDAYAT",
    jumlahSantri: 15,
  },
];

export default function HalaqohPage() {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedHalaqoh, setSelectedHalaqoh] = useState<HalaqohDummy | null>(null);

  // Filter States
  const [search, setSearch] = useState("");
  const [selectedKelas, setSelectedKelas] = useState("semua");
  const [selectedProgram, setSelectedProgram] = useState("semua");

  const handleEdit = (halaqoh: HalaqohDummy) => {
    router.push(`/halaqoh/${halaqoh.id}`);
  };

  const handleDeleteClick = (halaqoh: HalaqohDummy) => {
    setSelectedHalaqoh(halaqoh);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedHalaqoh) {
      console.log("Delete halaqoh:", selectedHalaqoh.id);
      setDeleteOpen(false);
      setSelectedHalaqoh(null);
    }
  };

  // Client-side filtering logic
  const filteredHalaqoh = useMemo(() => {
    return DUMMY_HALAQOH.filter((halaqoh) => {
      // 1. Search filter
      if (search) {
        const query = search.toLowerCase();
        const matchNama = halaqoh.nama.toLowerCase().includes(query);
        const matchGuru = halaqoh.guruNama.toLowerCase().includes(query);
        if (!matchNama && !matchGuru) return false;
      }

      // 2. Kelas filter
      if (selectedKelas !== "semua" && halaqoh.kelas !== selectedKelas) {
        return false;
      }

      // 3. Program filter
      if (selectedProgram !== "semua" && halaqoh.program !== selectedProgram) {
        return false;
      }

      return true;
    });
  }, [search, selectedKelas, selectedProgram]);

  return (
    <PageContainer>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-primary">
            Kelola kelompok halaqoh, guru pengampu, dan penempatan santri
          </h1>
        </div>

        <Button
          onClick={() => router.push("/halaqoh/baru")}
          className="bg-primary hover:bg-primary/90 flex items-center gap-1.5 h-9"
        >
          <Plus className="w-4 h-4" />
          Tambah Halaqoh
        </Button>
      </div>

      <HalaqohFilterBar
        search={search}
        setSearch={setSearch}
        selectedKelas={selectedKelas}
        setSelectedKelas={setSelectedKelas}
        selectedProgram={selectedProgram}
        setSelectedProgram={setSelectedProgram}
        filteredCount={filteredHalaqoh.length}
        totalCount={DUMMY_HALAQOH.length}
      />

      <HalaqohGrid
        data={filteredHalaqoh}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-destructive">Hapus Halaqoh</DialogTitle>
            <DialogDescription className="pt-2">
              Apakah Anda yakin ingin menghapus kelompok halaqoh <strong>{selectedHalaqoh?.nama}</strong>? 
              Tindakan ini tidak dapat dibatalkan, dan semua santri di dalamnya akan dilepas dari kelompok halaqoh ini.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteOpen(false)}
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              Ya, Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
