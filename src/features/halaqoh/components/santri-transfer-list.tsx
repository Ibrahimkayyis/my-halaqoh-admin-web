"use client";

import { useState, useMemo, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { useGetKelas } from "@/features/kelas-program/hooks/use-kelas";
import { useGetProgram } from "@/features/kelas-program/hooks/use-program";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export interface SantriSelection {
  id: string;
  nis: string;
  nama: string;
  kelas: string;
  program: string;
  halaqohId?: string | null;
  halaqohNama?: string | null;
}

interface SantriTransferListProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allSantriList: SantriSelection[];
  alreadySelectedIds: string[];
  onAddSantri: (selectedSantri: SantriSelection[]) => void;
}

export function SantriTransferList({
  open,
  onOpenChange,
  allSantriList,
  alreadySelectedIds,
  onAddSantri,
}: SantriTransferListProps) {
  const [search, setSearch] = useState("");
  const [selectedKelas, setSelectedKelas] = useState("semua");
  const [selectedProgram, setSelectedProgram] = useState("semua");
  const [checkedIds, setCheckedIds] = useState<string[]>([]);

  const { data: kelasList = [] } = useGetKelas();
  const { data: programList = [] } = useGetProgram();

  // Reset local checked state when dialog opens
  useEffect(() => {
    if (open) {
      setCheckedIds(alreadySelectedIds);
      setSearch("");
      setSelectedKelas("semua");
      setSelectedProgram("semua");
    }
  }, [open, alreadySelectedIds]);

  // Statistics
  const totalCount = allSantriList.length;
  const inAnotherHalaqohCount = useMemo(() => {
    return allSantriList.filter((s) => s.halaqohId && !alreadySelectedIds.includes(s.id)).length;
  }, [allSantriList, alreadySelectedIds]);

  // Filtered list
  const filteredSantri = useMemo(() => {
    return allSantriList.filter((s) => {
      // 1. Match search (name or NIS)
      if (search) {
        const query = search.toLowerCase();
        const matchNama = s.nama.toLowerCase().includes(query);
        const matchNis = s.nis.includes(query);
        if (!matchNama && !matchNis) return false;
      }

      // 2. Filter by Kelas
      if (selectedKelas !== "semua" && s.kelas !== selectedKelas) {
        return false;
      }

      // 3. Filter by Program
      if (selectedProgram !== "semua" && s.program !== selectedProgram) {
        return false;
      }

      return true;
    });
  }, [allSantriList, search, selectedKelas, selectedProgram]);

  const handleToggleCheckbox = (id: string, isAssignedToOther: boolean) => {
    if (isAssignedToOther) return; // Do not allow selecting if already in another halaqoh
    
    setCheckedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSave = () => {
    const newlySelected = allSantriList.filter((s) => checkedIds.includes(s.id));
    onAddSantri(newlySelected);
    onOpenChange(false);
  };

  const addedCount = checkedIds.filter(id => !alreadySelectedIds.includes(id)).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] flex flex-col p-6 gap-4">
        <DialogHeader className="pb-2 border-b">
          <DialogTitle>Pilih Santri</DialogTitle>
        </DialogHeader>

        {/* Filters and Search */}
        <div className="space-y-3">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Cari nama atau NIS santri..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-muted/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Filter Kelas */}
            <Select value={selectedKelas} onValueChange={(val) => setSelectedKelas(val || "semua")}>
              <SelectTrigger className="w-full bg-muted/20">
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

            {/* Filter Program */}
            <Select value={selectedProgram} onValueChange={(val) => setSelectedProgram(val || "semua")}>
              <SelectTrigger className="w-full bg-muted/20">
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

        {/* Capacity Info Label */}
        <div className="text-xs text-muted-foreground font-semibold px-1">
          {totalCount} Santri ({inAnotherHalaqohCount} sudah di halaqoh lain)
        </div>

        {/* Scrollable Santri Checkbox List */}
        <div className="flex-1 overflow-y-auto border rounded-lg bg-muted/10 divide-y max-h-[350px]">
          {filteredSantri.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Tidak ada santri ditemukan
            </div>
          ) : (
            filteredSantri.map((santri) => {
              const isSelected = checkedIds.includes(santri.id);
              const isAssignedToOther = !!santri.halaqohId && !alreadySelectedIds.includes(santri.id);

              return (
                <div 
                  key={santri.id}
                  onClick={() => handleToggleCheckbox(santri.id, isAssignedToOther)}
                  className={`flex items-center justify-between p-3.5 transition-colors cursor-pointer select-none
                    ${isAssignedToOther ? "opacity-50 cursor-not-allowed bg-muted/5" : "hover:bg-muted/30"}
                    ${isSelected && !isAssignedToOther ? "bg-primary/5" : ""}
                  `}
                >
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-primary block leading-none">
                      {santri.nis}
                    </span>
                    <span className="font-semibold text-sm text-foreground block">
                      {santri.nama}
                    </span>
                    {isAssignedToOther && (
                      <span className="text-[10px] text-destructive font-medium block">
                        Sudah di kelompok: {santri.halaqohNama}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Badge detailed */}
                    <div className="flex gap-1 items-center">
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-primary/20 text-primary bg-primary/5">
                        {santri.kelas}
                      </Badge>
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 text-primary bg-primary/10">
                        {santri.program === "R" ? "Reguler" : "Takhassus"}
                      </Badge>
                    </div>

                    {/* Checkbox input wrapper */}
                    <input
                      type="checkbox"
                      checked={isSelected}
                      disabled={isAssignedToOther}
                      onChange={() => {}} // Controlled by outer div click
                      className="w-4 h-4 rounded border-border text-primary focus:ring-primary/30"
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Dialog Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Batal
          </Button>
          <Button 
            type="button" 
            onClick={handleSave}
            className="bg-primary hover:bg-primary/90 min-w-[150px]"
          >
            Tambahkan ({addedCount}) Santri
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
