"use client";

import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { useGetKelas } from "@/features/kelas-program/hooks/use-kelas";
import { useGetProgram } from "@/features/kelas-program/hooks/use-program";
import { cn } from "@/lib/utils";
import type { SertifikasiStatus } from "../types/sertifikasi.types";

export type TimeFilterPreset =
  | "today"
  | "7days"
  | "30days"
  | "thisMonth"
  | "customDate"
  | "customRange"
  | "all";

interface SertifikasiFilterBarProps {
  search: string;
  setSearch: (s: string) => void;
  activeStatus: string;
  setActiveStatus: (status: string) => void;
  selectedKelas: string;
  setSelectedKelas: (k: string) => void;
  selectedProgram: string;
  setSelectedProgram: (p: string) => void;
  timePreset: TimeFilterPreset;
  setTimePreset: (t: TimeFilterPreset) => void;
  customDate: string;
  setCustomDate: (d: string) => void;
  customStartDate: string;
  setCustomStartDate: (d: string) => void;
  customEndDate: string;
  setCustomEndDate: (d: string) => void;
  statusCounts: Record<string, number>;
  filteredCount: number;
  totalCount: number;
}

export function SertifikasiFilterBar({
  search,
  setSearch,
  activeStatus,
  setActiveStatus,
  selectedKelas,
  setSelectedKelas,
  selectedProgram,
  setSelectedProgram,
  timePreset,
  setTimePreset,
  customDate,
  setCustomDate,
  customStartDate,
  setCustomStartDate,
  customEndDate,
  setCustomEndDate,
  statusCounts,
  filteredCount,
  totalCount,
}: SertifikasiFilterBarProps) {
  const { t } = useTranslation(["sertifikasi", "common"]);
  const { data: kelasList = [] } = useGetKelas();
  const { data: programList = [] } = useGetProgram();

  const statusTabs: { key: string; label: string; statusKey?: SertifikasiStatus }[] = [
    { key: "semua", label: t("sertifikasi:filters.status.all", "Semua") },
    { key: "pending", label: t("sertifikasi:filters.status.pending", "Menunggu Persetujuan") },
    { key: "scheduled", label: t("sertifikasi:filters.status.scheduled", "Terjadwal") },
    { key: "passed", label: t("sertifikasi:filters.status.passed", "Lulus") },
    { key: "failed", label: t("sertifikasi:filters.status.failed", "Mengulang") },
    { key: "rejected", label: t("sertifikasi:filters.status.rejected", "Ditolak") },
  ];

  const isFiltered =
    Boolean(search) ||
    selectedKelas !== "semua" ||
    selectedProgram !== "semua" ||
    timePreset !== "all" ||
    activeStatus !== "semua";

  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Search Input */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t("sertifikasi:filters.search", "Cari santri berdasarkan Nama atau NIS...")}
          className="w-full pl-9 bg-surface"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {statusTabs.map((tab) => {
          const isActive = activeStatus === tab.key;
          const count = tab.key === "semua" ? totalCount : statusCounts[tab.key] || 0;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveStatus(tab.key)}
              className={cn(
                "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer",
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                  : "bg-surface border border-border/70 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <span>{tab.label}</span>
              <Badge
                variant={isActive ? "secondary" : "outline"}
                className={cn(
                  "px-1.5 py-0 h-4 text-[10px] font-semibold rounded-full border-none",
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {count}
              </Badge>
            </button>
          );
        })}
      </div>

      {/* Secondary Dropdown Filters & Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Count Badge */}
        <div className="inline-flex items-center rounded-md bg-muted px-3 py-1 text-sm font-medium text-muted-foreground w-fit">
          {t("sertifikasi:filters.showing", {
            count: filteredCount,
            total: totalCount,
            defaultValue: `Menampilkan ${filteredCount} dari ${totalCount} Pengajuan`,
          })}
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Filter Kelas */}
          <Select value={selectedKelas} onValueChange={(val) => { if (val) setSelectedKelas(val); }}>
            <SelectTrigger className="w-auto min-w-[130px] bg-surface h-8 text-xs">
              <SelectValue>
                {selectedKelas === "semua"
                  ? t("sertifikasi:filters.allKelas", "Semua Kelas")
                  : `Kelas ${selectedKelas}`}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">
                {t("sertifikasi:filters.allKelas", "Semua Kelas")}
              </SelectItem>
              {kelasList.map((k) => (
                <SelectItem key={k.id} value={k.nama}>
                  Kelas {k.nama}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Filter Program */}
          <Select value={selectedProgram} onValueChange={(val) => { if (val) setSelectedProgram(val); }}>
            <SelectTrigger className="w-auto min-w-[145px] bg-surface h-8 text-xs">
              <SelectValue>
                {selectedProgram === "semua"
                  ? t("sertifikasi:filters.allPrograms", "Semua Program")
                  : selectedProgram === "R"
                  ? "Program Reguler"
                  : selectedProgram === "T"
                  ? "Program Takhassus"
                  : `Program ${programList.find((p) => p.id === selectedProgram)?.nama || selectedProgram}`}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">
                {t("sertifikasi:filters.allPrograms", "Semua Program")}
              </SelectItem>
              {programList.length > 0 ? (
                programList.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    Program {p.nama}
                  </SelectItem>
                ))
              ) : (
                <>
                  <SelectItem value="R">Program Reguler</SelectItem>
                  <SelectItem value="T">Program Takhassus</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>

          {/* Filter Waktu (Time Preset Select) */}
          <Select
            value={timePreset}
            onValueChange={(val) => {
              if (val) setTimePreset(val as TimeFilterPreset);
            }}
          >
            <SelectTrigger className="w-auto min-w-[140px] bg-surface h-8 text-xs">
              <SelectValue>
                {timePreset === "all"
                  ? t("sertifikasi:filters.timePresets.all", "Semua Waktu")
                  : timePreset === "today"
                  ? t("sertifikasi:filters.timePresets.today", "Hari Ini")
                  : timePreset === "7days"
                  ? t("sertifikasi:filters.timePresets.7days", "7 Hari Terakhir")
                  : timePreset === "30days"
                  ? t("sertifikasi:filters.timePresets.30days", "30 Hari Terakhir")
                  : timePreset === "thisMonth"
                  ? t("sertifikasi:filters.timePresets.thisMonth", "Bulan Ini")
                  : timePreset === "customDate"
                  ? t("sertifikasi:filters.timePresets.customDate", "Pilih Tanggal")
                  : t("sertifikasi:filters.timePresets.customRange", "Rentang Waktu")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("sertifikasi:filters.timePresets.all", "Semua Waktu")}
              </SelectItem>
              <SelectItem value="today">
                {t("sertifikasi:filters.timePresets.today", "Hari Ini")}
              </SelectItem>
              <SelectItem value="7days">
                {t("sertifikasi:filters.timePresets.7days", "7 Hari Terakhir")}
              </SelectItem>
              <SelectItem value="30days">
                {t("sertifikasi:filters.timePresets.30days", "30 Hari Terakhir")}
              </SelectItem>
              <SelectItem value="thisMonth">
                {t("sertifikasi:filters.timePresets.thisMonth", "Bulan Ini")}
              </SelectItem>
              <SelectItem value="customDate">
                {t("sertifikasi:filters.timePresets.customDate", "Pilih Tanggal")}
              </SelectItem>
              <SelectItem value="customRange">
                {t("sertifikasi:filters.timePresets.customRange", "Rentang Waktu")}
              </SelectItem>
            </SelectContent>
          </Select>


          {/* If customDate is chosen: Single date picker */}
          {timePreset === "customDate" && (
            <Input
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="w-[135px] h-8 text-xs bg-surface"
            />
          )}

          {/* If customRange is chosen: Start and End date pickers */}
          {timePreset === "customRange" && (
            <div className="flex items-center gap-1.5">
              <Input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="w-[130px] h-8 text-xs bg-surface"
              />
              <span className="text-xs text-muted-foreground">-</span>
              <Input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="w-[130px] h-8 text-xs bg-surface"
              />
            </div>
          )}

          {/* Reset Filters button if any active */}
          {isFiltered && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearch("");
                setActiveStatus("semua");
                setSelectedKelas("semua");
                setSelectedProgram("semua");
                setTimePreset("all");
              }}
              className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Reset
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}


