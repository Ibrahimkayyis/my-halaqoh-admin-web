"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Info, CalendarDays, BookMarked } from "lucide-react";
import { TargetKelasCard } from "./target-kelas-card";
import { CURRICULUM_REGULER, CURRICULUM_TAKHASSUS } from "../data/curriculum-data";

type Program = "R" | "T";
type SemesterOption = 1 | 2 | null;

interface TargetTabViewProps {
  tahunAjaran: string | null;
  semesterAktif: SemesterOption;
  onChangeSemesterAktif: (val: SemesterOption) => void;
  isUpdating?: boolean;
}

const SEMESTER_PILLS: { value: SemesterOption; label: string }[] = [
  { value: 1, label: "Semester 1" },
  { value: 2, label: "Semester 2" },
  { value: null, label: "Belum Ditetapkan" },
];

export function TargetTabView({
  tahunAjaran,
  semesterAktif,
  onChangeSemesterAktif,
  isUpdating = false,
}: TargetTabViewProps) {
  const [activeTab, setActiveTab] = useState<Program>("R");

  const curriculum = activeTab === "R" ? CURRICULUM_REGULER : CURRICULUM_TAKHASSUS;

  return (
    <div className="space-y-5">
      {/* ── 1. Full-width Animated Tab Switcher ── */}
      <div className="relative flex w-full bg-muted rounded-xl p-1.5 gap-1">
        {/* Sliding indicator */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-1.5 rounded-[10px] bg-primary shadow-md transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{
            width: "calc(50% - 10px)",
            transform:
              activeTab === "R" ? "translateX(0)" : "translateX(calc(100% + 8px))",
          }}
        />
        {(["R", "T"] as Program[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "relative z-10 flex-1 py-2.5 text-xs font-bold tracking-widest uppercase rounded-lg transition-colors duration-200 select-none",
              activeTab === tab ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab === "R" ? "Reguler" : "Takhassus"}
          </button>
        ))}
      </div>

      {/* ── 2. Global Settings Panel ── */}
      <div className={cn(
        "bg-surface border border-border/50 rounded-xl p-4 shadow-card space-y-4 transition-opacity duration-200",
        isUpdating && "opacity-60 pointer-events-none"
      )}>
        <div className="flex items-center gap-2 mb-1">
          <BookMarked className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-bold text-foreground">Konfigurasi Berjalan</h2>
          <span className="text-xs text-muted-foreground font-medium">
            — berlaku untuk seluruh kelas
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-stretch gap-4">
          {/* Tahun Ajaran (Statis & Menonjol) */}
          <div className="flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-xl px-4 py-2.5 min-w-[200px]">
            <CalendarDays className="w-5 h-5 text-primary shrink-0" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-primary/75 tracking-wider uppercase">Tahun Ajaran</span>
              <span className="text-base font-extrabold text-primary tracking-tight leading-none mt-1">
                {tahunAjaran || "2026/2027"}
              </span>
            </div>
          </div>

          {/* Semester Aktif pills */}
          <div className="space-y-1.5 flex-1 flex flex-col justify-center">
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Semester Aktif
            </label>
            <div className="flex flex-wrap gap-2">
              {SEMESTER_PILLS.map((pill) => {
                const isSelected = semesterAktif === pill.value;
                const isBelum = pill.value === null;
                return (
                  <button
                    key={String(pill.value)}
                    onClick={() => onChangeSemesterAktif(pill.value)}
                    disabled={isUpdating}
                    className={cn(
                      "flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150",
                      isSelected && !isBelum
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : isSelected && isBelum
                        ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                        : "bg-surface border-border text-muted-foreground hover:bg-muted/40"
                    )}
                  >
                    {isSelected && !isBelum && (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground/80 shrink-0" />
                    )}
                    {pill.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Info Banner ── */}
      <div className="flex items-start gap-3 bg-primary/5 border border-primary/20 rounded-lg px-4 py-3">
        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <p className="text-xs text-primary/90 font-medium leading-relaxed">
          Kurikulum hafalan sesuai program pesantren. Tahun ajaran dan semester yang
          ditetapkan di atas berlaku untuk seluruh kelas dan program.
        </p>
      </div>

      {/* ── 4. Card Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {curriculum.map((c) => (
          <TargetKelasCard
            key={`${c.kelas}_${activeTab}`}
            curriculum={c}
            tahunAjaran={tahunAjaran}
            semesterAktif={semesterAktif}
          />
        ))}
      </div>
    </div>
  );
}
