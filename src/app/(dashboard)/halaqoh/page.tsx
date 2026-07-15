"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { HalaqohFilterBar } from "@/features/halaqoh/components/halaqoh-filter-bar";
import { HalaqohGrid } from "@/features/halaqoh/components/halaqoh-grid";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCcw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useGetHalaqoh, useDeleteHalaqoh } from "@/features/halaqoh/hooks/use-halaqoh";
import type { Halaqoh } from "@/types/models/halaqoh.types";

export default function HalaqohPage() {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedHalaqoh, setSelectedHalaqoh] = useState<Halaqoh | null>(null);

  // Filter states
  const [search, setSearch] = useState("");
  const [selectedKelas, setSelectedKelas] = useState("semua");
  const [selectedProgram, setSelectedProgram] = useState("semua");

  // Data fetching
  const { data: halaqohList = [], isLoading, isError, refetch } = useGetHalaqoh();
  const deleteHalaqoh = useDeleteHalaqoh();

  const handleEdit = (halaqoh: Halaqoh) => {
    router.push(`/halaqoh/${halaqoh.id}`);
  };

  const handleDeleteClick = (halaqoh: Halaqoh) => {
    setSelectedHalaqoh(halaqoh);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedHalaqoh) return;
    deleteHalaqoh.mutate(selectedHalaqoh.id, {
      onSettled: () => {
        setDeleteOpen(false);
        setSelectedHalaqoh(null);
      },
    });
  };

  // Client-side filtering
  const filteredHalaqoh = useMemo(() => {
    return halaqohList.filter((halaqoh) => {
      // Search filter — match nama or guruNama
      if (search) {
        const q = search.toLowerCase();
        if (
          !halaqoh.nama.toLowerCase().includes(q) &&
          !halaqoh.guruNama.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      // Kelas filter
      if (selectedKelas !== "semua" && halaqoh.kelas !== selectedKelas) return false;
      // Program filter
      if (selectedProgram !== "semua" && halaqoh.program !== selectedProgram) return false;
      return true;
    });
  }, [halaqohList, search, selectedKelas, selectedProgram]);

  return (
    <PageContainer>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-primary">
            Kelola Halaqoh
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Kelola kelompok halaqoh, guru pengampu, dan penempatan santri
          </p>
        </div>

        <Button
          onClick={() => router.push("/halaqoh/baru")}
          className="bg-primary hover:bg-primary/90 flex items-center gap-1.5 h-9"
        >
          <Plus className="w-4 h-4" />
          Tambah Halaqoh
        </Button>
      </div>

      {/* Filter Bar */}
      <HalaqohFilterBar
        search={search}
        setSearch={setSearch}
        selectedKelas={selectedKelas}
        setSelectedKelas={setSelectedKelas}
        selectedProgram={selectedProgram}
        setSelectedProgram={setSelectedProgram}
        filteredCount={filteredHalaqoh.length}
        totalCount={halaqohList.length}
      />

      {/* Content States */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-44 rounded-lg bg-muted/40 animate-pulse border border-border/30"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <p className="text-sm text-muted-foreground">
            Gagal memuat data halaqoh. Silakan coba lagi.
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCcw className="w-4 h-4 mr-2" />
            Coba Lagi
          </Button>
        </div>
      ) : (
        <HalaqohGrid
          data={filteredHalaqoh}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-destructive">Hapus Halaqoh</DialogTitle>
            <DialogDescription className="pt-2">
              Apakah Anda yakin ingin menghapus kelompok halaqoh{" "}
              <strong>{selectedHalaqoh?.nama}</strong>? Tindakan ini tidak dapat
              dibatalkan, dan semua santri di dalamnya akan dilepas dari kelompok
              halaqoh ini.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              disabled={deleteHalaqoh.isPending}
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteHalaqoh.isPending}
            >
              {deleteHalaqoh.isPending ? "Menghapus..." : "Ya, Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
