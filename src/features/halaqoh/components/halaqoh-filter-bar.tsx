"use client";

import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, RotateCcw } from "lucide-react";
import { useGetKelas } from "@/features/kelas-program/hooks/use-kelas";
import { useGetProgram } from "@/features/kelas-program/hooks/use-program";

interface HalaqohFilterBarProps {
  search: string;
  setSearch: (s: string) => void;
  selectedKelas: string;
  setSelectedKelas: (k: string) => void;
  selectedProgram: string;
  setSelectedProgram: (p: string) => void;
  filteredCount: number;
  totalCount: number;
}

export function HalaqohFilterBar({
  search,
  setSearch,
  selectedKelas,
  setSelectedKelas,
  selectedProgram,
  setSelectedProgram,
  filteredCount,
  totalCount,
}: HalaqohFilterBarProps) {
  const { t } = useTranslation(["halaqoh", "common"]);
  const { data: kelasList = [] } = useGetKelas();
  const { data: programList = [] } = useGetProgram();

  const hasActiveFilter = Boolean(
    search || selectedKelas !== "semua" || selectedProgram !== "semua"
  );

  const handleReset = () => {
    setSearch("");
    setSelectedKelas("semua");
    setSelectedProgram("semua");
  };

  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Search Bar */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input 
          placeholder={t("halaqoh:grid.searchPlaceholder")} 
          className="w-full pl-9 bg-surface h-10 text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Info Text */}
        <div className="inline-flex items-center self-start rounded-md bg-muted px-3 py-1 text-xs sm:text-sm font-medium text-muted-foreground">
          {t("halaqoh:grid.showingCount", { filteredCount, totalCount })}
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 bg-surface border rounded-lg px-2.5 py-1 shadow-2xs w-full sm:w-auto overflow-hidden">
            <span className="text-xs sm:text-sm font-medium text-muted-foreground shrink-0">{t("common:actions.filter")}:</span>
            
            {/* Filter Kelas */}
            <Select 
              value={selectedKelas} 
              onValueChange={(val) => setSelectedKelas(val || "semua")}
            >
              <SelectTrigger className="flex-1 sm:w-[120px] bg-transparent border-0 shadow-none focus:ring-0 text-xs sm:text-sm h-8 px-2">
                <SelectValue placeholder={t("common:labels.class")}>
                  {selectedKelas === "semua" ? t("common:labels.class") : `${t("common:labels.class")} ${selectedKelas}`}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semua">{t("common:labels.allClasses")}</SelectItem>
                {kelasList.map((k) => (
                  <SelectItem key={k.id} value={k.nama}>
                    {t("common:labels.class")} {k.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="w-px h-4 bg-border mx-0.5 shrink-0" />

            {/* Filter Program */}
            <Select 
              value={selectedProgram} 
              onValueChange={(val) => setSelectedProgram(val || "semua")}
            >
              <SelectTrigger className="flex-1 sm:w-[140px] bg-transparent border-0 shadow-none focus:ring-0 text-xs sm:text-sm h-8 px-2">
                <SelectValue placeholder={t("common:labels.program")}>
                  {selectedProgram === "semua" 
                    ? t("common:labels.program") 
                    : (programList.find((p) => p.id === selectedProgram)?.nama || selectedProgram)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semua">{t("common:labels.allPrograms")}</SelectItem>
                {programList.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reset Button */}
          {hasActiveFilter && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground shrink-0 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              Reset
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
