"use client";

import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, GraduationCap } from "lucide-react";
import { useGetKelas } from "@/features/kelas-program/hooks/use-kelas";
import { useGetProgram } from "@/features/kelas-program/hooks/use-program";

interface SantriFilterBarProps {
  search: string;
  setSearch: (s: string) => void;
  selectedKelas: string;
  setSelectedKelas: (k: string) => void;
  selectedProgram: string;
  setSelectedProgram: (p: string) => void;
  showAlumni: boolean;
  setShowAlumni: (b: boolean) => void;
  filteredCount: number;
  totalCount: number;
}

export function SantriFilterBar({
  search,
  setSearch,
  selectedKelas,
  setSelectedKelas,
  selectedProgram,
  setSelectedProgram,
  showAlumni,
  setShowAlumni,
  filteredCount,
  totalCount,
}: SantriFilterBarProps) {
  const { data: kelasList = [] } = useGetKelas();
  const { data: programList = [] } = useGetProgram();

  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Search Bar */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input 
          placeholder="Cari Santri berdasarkan Nama atau NIS..." 
          className="w-full pl-9 bg-surface"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Info Text */}
        <div className="inline-flex items-center rounded-md bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
          Menampilkan {filteredCount} dari {totalCount} Santri
        </div>

        {/* Filters and Toggle Alumni */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Alumni Toggle Button */}
          <Button
            variant={showAlumni ? "default" : "outline"}
            size="sm"
            onClick={() => setShowAlumni(!showAlumni)}
            className="gap-2 h-9"
          >
            <GraduationCap className="h-4 w-4" />
            {showAlumni ? "Tampilkan Santri Aktif" : "Tampilkan Alumni"}
          </Button>

          {/* Filter Container */}
          <div className="flex items-center gap-2 bg-surface border rounded-lg px-3 py-1">
            <span className="text-sm font-medium text-muted-foreground mr-1">Filter:</span>
            
            {/* Filter Kelas */}
            <Select 
              value={selectedKelas} 
              onValueChange={(val) => setSelectedKelas(val || "semua")}
            >
              <SelectTrigger className="w-[120px] bg-transparent border-0 shadow-none focus:ring-0">
                <SelectValue placeholder="Kelas">
                  {selectedKelas === "semua" ? "Kelas" : `Kelas ${selectedKelas}`}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semua">Semua Kelas</SelectItem>
                {kelasList.map((k) => (
                  <SelectItem key={k.id} value={k.nama}>
                    Kelas {k.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="w-px h-4 bg-border mx-1"></div>

            {/* Filter Program */}
            <Select 
              value={selectedProgram} 
              onValueChange={(val) => setSelectedProgram(val || "semua")}
            >
              <SelectTrigger className="w-[140px] bg-transparent border-0 shadow-none focus:ring-0">
                <SelectValue placeholder="Program">
                  {selectedProgram === "semua" 
                    ? "Program" 
                    : (programList.find((p) => p.id === selectedProgram)?.nama || selectedProgram)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semua">Semua Program</SelectItem>
                {programList.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
