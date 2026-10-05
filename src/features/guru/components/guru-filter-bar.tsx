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
import { Search } from "lucide-react";
import { useGetProgram } from "@/features/kelas-program/hooks/use-program";

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
  const { t } = useTranslation(["guru", "common"]);
  const { data: programList = [] } = useGetProgram();

  return (
    <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
      {/* Search Bar */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input 
          placeholder={t("guru:table.searchPlaceholder")} 
          className="w-full pl-9 h-9 sm:h-10 text-xs sm:text-sm bg-surface rounded-lg border-border/60 shadow-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
        {/* Info Text */}
        <div className="inline-flex items-center rounded-md bg-muted px-2.5 sm:px-3 py-1 text-xs sm:text-sm font-medium font-mono text-muted-foreground self-start sm:self-auto">
          {filteredCount} / {totalCount}
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between sm:justify-start gap-2 bg-surface border border-border/60 rounded-lg px-3 py-1.5 shadow-xs w-full sm:w-auto">
          <span className="text-xs sm:text-sm font-medium text-muted-foreground mr-1 shrink-0">
            {t("common:actions.filter")}:
          </span>
          
          <Select 
            value={selectedProgram} 
            onValueChange={(val) => setSelectedProgram(val || "semua")}
          >
            <SelectTrigger className="w-full sm:w-[160px] bg-transparent border-0 shadow-none focus:ring-0 text-xs sm:text-sm h-7 sm:h-8">
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
      </div>
    </div>
  );
}
