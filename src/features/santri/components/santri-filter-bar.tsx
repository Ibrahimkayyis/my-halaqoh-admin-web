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

export function SantriFilterBar() {
  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Search Bar */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input 
          placeholder="Cari Santri..." 
          className="w-full pl-9 bg-surface"
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Info Text */}
        <div className="inline-flex items-center rounded-md bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
          Menampilkan 125 Santri
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 bg-surface border rounded-lg px-3 py-1.5">
          <span className="text-sm font-medium text-muted-foreground mr-1">Filter:</span>
          
          <Select>
            <SelectTrigger className="w-[120px] bg-transparent border-0 shadow-none focus:ring-0">
              <SelectValue placeholder="Kelas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">Semua Kelas</SelectItem>
              <SelectItem value="7">Kelas 7</SelectItem>
              <SelectItem value="8">Kelas 8</SelectItem>
              <SelectItem value="9">Kelas 9</SelectItem>
              <SelectItem value="10">Kelas 10</SelectItem>
              <SelectItem value="11">Kelas 11</SelectItem>
              <SelectItem value="12">Kelas 12</SelectItem>
              <SelectItem value="alumni">Alumni</SelectItem>
            </SelectContent>
          </Select>

          <div className="w-px h-4 bg-border mx-1"></div>

          <Select>
            <SelectTrigger className="w-[140px] bg-transparent border-0 shadow-none focus:ring-0">
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
