"use client";

import { useState } from "react";
import {
  QrCode,
  UserCheck,
  Clock,
  AlertCircle,
  FileText,
  HelpCircle,
} from "lucide-react";

import { MonthPicker } from "@/components/ui/month-picker";
import { useSantriFilteredAttendance } from "../hooks/use-santri-detail";
import type { AttendanceTimeFilter } from "@/features/kehadiran-santri/types/kehadiran-santri.types";
import { cn } from "@/lib/utils";

interface SantriAttendanceSectionProps {
  santriId: string;
  halaqohId?: string | null;
  santriNis?: string;
  halaqohNama?: string;
  guruNama?: string;
}

const RELATIVE_FILTER_OPTIONS: { id: AttendanceTimeFilter; label: string }[] = [
  { id: "all", label: "Semua" },
  { id: "7days", label: "7 Hari" },
  { id: "30days", label: "30 Hari" },
  { id: "3months", label: "3 Bulan" },
  { id: "6months", label: "6 Bulan" },
];

export function SantriMonthlyAttendanceCard({
  santriId,
  halaqohId,
  santriNis,
}: SantriAttendanceSectionProps) {
  const now = new Date();
  const [filterType, setFilterType] = useState<AttendanceTimeFilter>("all");
  const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());

  const { attendanceStats } = useSantriFilteredAttendance(
    santriId,
    halaqohId,
    santriNis,
    filterType,
    selectedMonth,
    selectedYear
  );

  return (
    <div className="space-y-0">
      {/* Header Bar */}
      <div className="px-6 py-4 border-b border-border/40">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-tight">
              Ringkasan Kehadiran
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5 font-normal">
              {attendanceStats.label}
            </p>
          </div>

          {/* Timeframe & Separate MonthPicker Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* 1. Relative Timeframe Segmented Control */}
            <div className="inline-flex items-center p-0.5 rounded-lg bg-muted/60 border border-border/40">
              {RELATIVE_FILTER_OPTIONS.map((opt) => {
                const isActive = filterType === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setFilterType(opt.id)}
                    className={cn(
                      "px-2.5 py-1 text-xs font-medium rounded-md transition-all duration-150 cursor-pointer select-none",
                      isActive
                        ? "bg-background text-foreground shadow-xs font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            <div className="h-4 w-px bg-border/60 hidden sm:block" />

            {/* 2. Standalone MonthPicker (Separated from the relative filter) */}
            <MonthPicker
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              onChange={(m, y) => {
                setSelectedMonth(m);
                setSelectedYear(y);
                setFilterType("specificMonth");
              }}
            />
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {/* 1. Hadir (Barcode) */}
          <div className="p-3.5 rounded-lg bg-muted/30 border border-border/30 space-y-1.5 transition-colors hover:bg-muted/50">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] font-medium">Barcode</span>
              <QrCode className="h-3.5 w-3.5 opacity-60 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-xl font-bold text-foreground font-mono">
              {attendanceStats.hadirBarcodeCount}
            </p>
          </div>

          {/* 2. Hadir (Manual) */}
          <div className="p-3.5 rounded-lg bg-muted/30 border border-border/30 space-y-1.5 transition-colors hover:bg-muted/50">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] font-medium">Manual</span>
              <UserCheck className="h-3.5 w-3.5 opacity-60 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-xl font-bold text-foreground font-mono">
              {attendanceStats.hadirManualCount}
            </p>
          </div>

          {/* 3. Terlambat */}
          <div className="p-3.5 rounded-lg bg-muted/30 border border-border/30 space-y-1.5 transition-colors hover:bg-muted/50">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] font-medium">Terlambat</span>
              <Clock className="h-3.5 w-3.5 opacity-60 text-orange-600 dark:text-orange-400" />
            </div>
            <p className="text-xl font-bold text-foreground font-mono">
              {attendanceStats.terlambatCount}
            </p>
          </div>

          {/* 4. Sakit */}
          <div className="p-3.5 rounded-lg bg-muted/30 border border-border/30 space-y-1.5 transition-colors hover:bg-muted/50">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] font-medium">Sakit</span>
              <AlertCircle className="h-3.5 w-3.5 opacity-60 text-amber-600 dark:text-amber-400" />
            </div>
            <p className="text-xl font-bold text-foreground font-mono">
              {attendanceStats.sakitCount}
            </p>
          </div>

          {/* 5. Izin */}
          <div className="p-3.5 rounded-lg bg-muted/30 border border-border/30 space-y-1.5 transition-colors hover:bg-muted/50">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] font-medium">Izin</span>
              <FileText className="h-3.5 w-3.5 opacity-60 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-xl font-bold text-foreground font-mono">
              {attendanceStats.izinCount}
            </p>
          </div>

          {/* 6. Alfa */}
          <div className="p-3.5 rounded-lg bg-muted/30 border border-border/30 space-y-1.5 transition-colors hover:bg-muted/50">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] font-medium">Alfa</span>
              <HelpCircle className="h-3.5 w-3.5 opacity-60 text-rose-600 dark:text-rose-400" />
            </div>
            <p className="text-xl font-bold text-foreground font-mono">
              {attendanceStats.alfaCount}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
