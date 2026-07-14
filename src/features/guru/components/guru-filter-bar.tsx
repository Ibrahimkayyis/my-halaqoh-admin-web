"use client";

import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface GuruFilterBarProps {
  search: string;
  setSearch: (s: string) => void;
  selectedProgram: string;
  setSelectedProgram: (p: string) => void;
  filteredCount: number;
  totalCount: number;
}

export function GuruFilterBar({
  search,
  setSearch,
  selectedProgram,
  setSelectedProgram,
  filteredCount,
  totalCount,
}: GuruFilterBarProps) {
  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Search Bar */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input 
          placeholder="Cari Guru berdasarkan Nama atau NIP..." 
          className="w-full pl-9 bg-surface"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Info Text */}
        <div className="inline-flex items-center rounded-md bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
          Menampilkan {filteredCount} dari {totalCount} Guru
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 bg-surface border rounded-lg px-3 py-1.5">
          <span className="text-sm font-medium text-muted-foreground mr-1">Filter:</span>
          
          <Select 
            value={selectedProgram} 
            onValueChange={(val) => setSelectedProgram(val || "semua")}
          >
            <SelectTrigger className="w-[160px] bg-transparent border-0 shadow-none focus:ring-0">
              <SelectValue placeholder="Program" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">Semua Program</SelectItem>
              <SelectItem value="R">Reguler</SelectItem>
              <SelectItem value="T">Takhassus</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
