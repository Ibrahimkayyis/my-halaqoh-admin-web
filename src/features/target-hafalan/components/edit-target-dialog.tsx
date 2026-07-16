"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, CircleCheck, BookOpen } from "lucide-react";
import type { TargetHafalan, EditTargetFormValues } from "../types/target-hafalan.types";
import { TAHUN_AJARAN_OPTIONS, getKelasLabel } from "../types/target-hafalan.types";

interface EditTargetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  target: TargetHafalan | null;
  onSave: (id: string, values: EditTargetFormValues) => void;
}

type SemesterOption = 1 | 2 | null;

const SEMESTER_OPTIONS: { value: SemesterOption; label: string }[] = [
  { value: 1, label: "Semester 1" },
  { value: 2, label: "Semester 2" },
  { value: null, label: "Belum ditetapkan" },
];

export function EditTargetDialog({
  open,
  onOpenChange,
  target,
  onSave,
}: EditTargetDialogProps) {
  const [tahunAjaran, setTahunAjaran] = useState<string | null>(null);
  const [semesterAktif, setSemesterAktif] = useState<SemesterOption>(null);

  // Sync form state when target changes
  useEffect(() => {
    if (target) {
      setTahunAjaran(target.tahunAjaran);
      setSemesterAktif(target.semesterAktif);
    }
  }, [target]);

  const hasChanges =
    tahunAjaran !== target?.tahunAjaran ||
    semesterAktif !== target?.semesterAktif;

  const handleSave = () => {
    if (!target) return;
    onSave(target.id, { tahunAjaran, semesterAktif });
    onOpenChange(false);
  };

  if (!target) return null;

  const kelasLabel = getKelasLabel(target.kelas);
  const programLabel = target.program === "R" ? "REGULER" : "TAKHASSUS";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/50">
          <DialogTitle className="text-base font-semibold text-foreground">
            Pengaturan Target Kelas
          </DialogTitle>
          {/* Kelas & Program badges */}
          <div className="flex items-center gap-2 pt-2">
            <Badge className="gap-1.5 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold">
              <CircleCheck className="w-3.5 h-3.5" />
              {kelasLabel}
            </Badge>
            <Badge
              variant="outline"
              className="gap-1.5 px-3 py-1 border-border text-muted-foreground text-xs font-semibold"
            >
              <BookOpen className="w-3.5 h-3.5" />
              {programLabel}
            </Badge>
          </div>
        </DialogHeader>

        {/* Form Body */}
        <div className="px-6 py-5 space-y-6">
          {/* Tahun Ajaran */}
          <div className="space-y-2">
            <label className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              Tahun Ajaran
            </label>
            <Select
              value={tahunAjaran ?? ""}
              onValueChange={(val) => setTahunAjaran(val || null)}
            >
              <SelectTrigger className="w-full h-11 text-sm font-medium">
                <SelectValue placeholder="Pilih tahun ajaran..." />
              </SelectTrigger>
              <SelectContent>
                {TAHUN_AJARAN_OPTIONS.map((year) => (
                  <SelectItem key={year} value={year} className="text-sm">
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Semester Aktif */}
          <div className="space-y-2.5">
            <div>
              <label className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                Semester Aktif
              </label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Pilih semester yang sedang berjalan
              </p>
            </div>

            <div className="space-y-2">
              {SEMESTER_OPTIONS.map((opt) => {
                const isSelected = semesterAktif === opt.value;
                const isBelumDitetapkan = opt.value === null;

                return (
                  <button
                    key={String(opt.value)}
                    type="button"
                    onClick={() => setSemesterAktif(opt.value)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3.5 rounded-lg border text-sm font-medium
                      transition-all duration-150 text-left
                      ${
                        isSelected && isBelumDitetapkan
                          ? "border-destructive/40 bg-destructive/5 text-destructive"
                          : isSelected
                          ? "border-primary/40 bg-primary/5 text-primary"
                          : "border-border bg-surface text-foreground hover:bg-muted/30"
                      }
                    `}
                  >
                    {/* Radio circle */}
                    <span
                      className={`
                        w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0
                        transition-all duration-150
                        ${
                          isSelected && isBelumDitetapkan
                            ? "border-destructive"
                            : isSelected
                            ? "border-primary"
                            : "border-border"
                        }
                      `}
                    >
                      {isSelected && (
                        <span
                          className={`
                            w-2 h-2 rounded-full
                            ${isBelumDitetapkan ? "bg-destructive" : "bg-primary"}
                          `}
                        />
                      )}
                    </span>
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <Button
            onClick={handleSave}
            disabled={!hasChanges}
            className="w-full h-11 bg-primary hover:bg-primary/90 font-semibold gap-2"
          >
            <Save className="w-4 h-4" />
            Simpan Perubahan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
