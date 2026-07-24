"use client";

import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
  SelectValue,
} from "@/components/ui/select";
import type { Santri } from "@/features/santri/types/santri.types";

const MAX_SANTRI = 15;

interface SantriTransferListProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allSantriList: Santri[];
  alreadySelectedIds: string[];
  assignedToOtherIds: Set<string>;
  onAddSantri: (selectedSantri: Santri[]) => void;
}

export function SantriTransferList({
  open,
  onOpenChange,
  allSantriList,
  alreadySelectedIds,
  assignedToOtherIds,
  onAddSantri,
}: SantriTransferListProps) {
  const { t } = useTranslation(["halaqoh", "common", "santri"]);
  const [search, setSearch] = useState("");
  const [selectedKelas, setSelectedKelas] = useState("semua");
  const [selectedProgram, setSelectedProgram] = useState("semua");
  const [checkedIds, setCheckedIds] = useState<string[]>([]);

  const { data: kelasList = [] } = useGetKelas();
  const { data: programList = [] } = useGetProgram();

  useEffect(() => {
    if (open) {
      setCheckedIds(alreadySelectedIds);
      setSearch("");
      setSelectedKelas("semua");
      setSelectedProgram("semua");
    }
  }, [open, alreadySelectedIds]);

  const totalCount = allSantriList.length;
  const inAnotherHalaqohCount = useMemo(
    () => allSantriList.filter((s) => assignedToOtherIds.has(s.id)).length,
    [allSantriList, assignedToOtherIds]
  );

  const filteredSantri = useMemo(() => {
    return allSantriList.filter((s) => {
      if (search) {
        const q = search.toLowerCase();
        if (!s.nama.toLowerCase().includes(q) && !s.nis.includes(q)) return false;
      }
      if (selectedKelas !== "semua" && s.kelas !== selectedKelas) return false;
      if (selectedProgram !== "semua" && s.program !== selectedProgram) return false;
      return true;
    });
  }, [allSantriList, search, selectedKelas, selectedProgram]);

  const handleToggle = (santri: Santri) => {
    const isAssignedToOther = assignedToOtherIds.has(santri.id);
    if (isAssignedToOther) return;

    const isCurrentlyChecked = checkedIds.includes(santri.id);

    if (isCurrentlyChecked) {
      setCheckedIds((prev) => prev.filter((id) => id !== santri.id));
    } else {
      if (checkedIds.length >= MAX_SANTRI) return;
      setCheckedIds((prev) => [...prev, santri.id]);
    }
  };

  const handleSave = () => {
    const newlySelected = allSantriList.filter((s) => checkedIds.includes(s.id));
    onAddSantri(newlySelected);
    onOpenChange(false);
  };

  const addedCount = checkedIds.filter((id) => !alreadySelectedIds.includes(id)).length;
  const isAtCapacity = checkedIds.length >= MAX_SANTRI;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] flex flex-col p-6 gap-4">
        <DialogHeader className="pb-2 border-b">
          <DialogTitle>{t("halaqoh:santriTransfer.title")}</DialogTitle>
        </DialogHeader>

        {/* Filters and Search */}
        <div className="space-y-3">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t("halaqoh:santriTransfer.searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-muted/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Filter Kelas */}
            <Select
              value={selectedKelas}
              onValueChange={(val) => setSelectedKelas(val || "semua")}
            >
              <SelectTrigger className="w-full bg-muted/20">
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

            {/* Filter Program */}
            <Select
              value={selectedProgram}
              onValueChange={(val) => setSelectedProgram(val || "semua")}
            >
              <SelectTrigger className="w-full bg-muted/20">
                <SelectValue placeholder={t("common:labels.program")}>
                  {selectedProgram === "semua"
                    ? t("common:labels.program")
                    : programList.find((p) => p.id === selectedProgram)?.nama ||
                      selectedProgram}
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

        {/* Capacity Info Label */}
        <div className="flex items-center justify-between text-xs px-1">
          <span className="text-muted-foreground font-semibold">
            {totalCount} {t("halaqoh:card.santriUnit")} ({inAnotherHalaqohCount} {t("halaqoh:santriTransfer.emptyAvailable")})
          </span>
          <span className={`font-semibold ${isAtCapacity ? "text-destructive" : "text-primary"}`}>
            {checkedIds.length}/{MAX_SANTRI}
          </span>
        </div>

        {/* Scrollable Santri Checkbox List */}
        <div className="flex-1 overflow-y-auto border rounded-lg bg-muted/10 divide-y max-h-[350px]">
          {filteredSantri.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              {t("santri:table.notFound")}
            </div>
          ) : (
            filteredSantri.map((santri) => {
              const isSelected = checkedIds.includes(santri.id);
              const isAssignedToOther = assignedToOtherIds.has(santri.id);
              const isDisabledByCapacity = !isSelected && isAtCapacity;
              const isDisabled = isAssignedToOther || isDisabledByCapacity;

              return (
                <div
                  key={santri.id}
                  onClick={() => handleToggle(santri)}
                  className={`flex items-center justify-between p-3.5 transition-colors select-none
                    ${isDisabled ? "opacity-50 cursor-not-allowed bg-muted/5" : "cursor-pointer hover:bg-muted/30"}
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
                        {t("halaqoh:santriTransfer.emptyAvailable")}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Kelas & Program badges */}
                    <div className="flex gap-1 items-center">
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1.5 py-0 border-primary/20 text-primary bg-primary/5"
                      >
                        {santri.kelas}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0 text-primary bg-primary/10"
                      >
                        {santri.program === "R" ? t("common:labels.programReguler") : t("common:labels.programTakhassus")}
                      </Badge>
                    </div>

                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={isSelected}
                      disabled={isDisabled}
                      onChange={() => {}}
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
            {t("common:actions.cancel")}
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="bg-primary hover:bg-primary/90 min-w-[160px]"
          >
            {t("common:actions.add")} ({addedCount}) {t("halaqoh:card.santriUnit")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
