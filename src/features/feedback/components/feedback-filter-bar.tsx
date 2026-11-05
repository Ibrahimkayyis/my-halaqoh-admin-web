"use client";

import { Search, X, RotateCcw } from "lucide-react";
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
import { cn } from "@/lib/utils";

interface FeedbackFilterBarProps {
  search: string;
  setSearch: (s: string) => void;
  activeStatus: string;
  setActiveStatus: (status: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedRole: string;
  setSelectedRole: (role: string) => void;
  statusCounts: Record<string, number>;
  totalCount: number;
  filteredCount: number;
}

export function FeedbackFilterBar({
  search,
  setSearch,
  activeStatus,
  setActiveStatus,
  selectedCategory,
  setSelectedCategory,
  selectedRole,
  setSelectedRole,
  statusCounts,
  totalCount,
  filteredCount,
}: FeedbackFilterBarProps) {
  const statusTabs = [
    { key: "semua", label: "Semua Masukan" },
    { key: "open", label: "Menunggu" },
    { key: "in_progress", label: "Diproses" },
    { key: "resolved", label: "Selesai" },
  ];

  const isFiltered =
    Boolean(search) ||
    activeStatus !== "semua" ||
    selectedCategory !== "semua" ||
    selectedRole !== "semua";

  const handleResetFilters = () => {
    setSearch("");
    setActiveStatus("semua");
    setSelectedCategory("semua");
    setSelectedRole("semua");
  };

  return (
    <div className="flex flex-col gap-3.5 sm:gap-4 mb-5 sm:mb-6">
      {/* Search Bar Input */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Cari masukan berdasarkan nama pengirim, NIP/NIS, judul, atau isi pesan..."
          className="w-full pl-9 pr-9 bg-surface border-border/70 h-10 sm:h-9 text-xs sm:text-sm text-foreground focus-visible:ring-primary"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer p-0.5"
            aria-label="Bersihkan pencarian"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none touch-pan-x">
        {statusTabs.map((tab) => {
          const isActive = activeStatus === tab.key;
          const count = tab.key === "semua" ? totalCount : statusCounts[tab.key] || 0;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveStatus(tab.key)}
              className={cn(
                "inline-flex items-center gap-2 px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer shrink-0",
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {/* Category Filter */}
          <div className="w-[145px] sm:w-[160px]">
            <Select
              value={selectedCategory}
              onValueChange={(val) => setSelectedCategory(val ?? "semua")}
            >
              <SelectTrigger className="w-full h-8 text-xs bg-surface border-border/70 text-foreground">
                <SelectValue placeholder="Kategori">
                  {selectedCategory === "semua"
                    ? "Semua Kategori"
                    : selectedCategory === "bug"
                      ? "Bug / Kendala"
                      : selectedCategory === "saran"
                        ? "Saran Fitur"
                        : "Pertanyaan"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="w-[var(--anchor-width)] min-w-[165px] bg-surface border-border/60">
                <SelectItem value="semua" className="text-xs">Semua Kategori</SelectItem>
                <SelectItem value="bug" className="text-xs">Bug / Kendala</SelectItem>
                <SelectItem value="saran" className="text-xs">Saran Fitur</SelectItem>
                <SelectItem value="pertanyaan" className="text-xs">Pertanyaan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Role Filter */}
          <div className="w-[145px] sm:w-[160px]">
            <Select
              value={selectedRole}
              onValueChange={(val) => setSelectedRole(val ?? "semua")}
            >
              <SelectTrigger className="w-full h-8 text-xs bg-surface border-border/70 text-foreground">
                <SelectValue placeholder="Role Pengirim">
                  {selectedRole === "semua"
                    ? "Semua Pengirim"
                    : selectedRole === "guru"
                      ? "Guru / Asatidz"
                      : selectedRole === "wali_santri"
                        ? "Wali Santri"
                        : "Santri"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="w-[var(--anchor-width)] min-w-[165px] bg-surface border-border/60">
                <SelectItem value="semua" className="text-xs">Semua Pengirim</SelectItem>
                <SelectItem value="guru" className="text-xs">Guru / Asatidz</SelectItem>
                <SelectItem value="wali_santri" className="text-xs">Wali Santri</SelectItem>
                <SelectItem value="santri" className="text-xs">Santri</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reset Filter Button */}
          {isFiltered && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" />
              Reset Filter
            </Button>
          )}
        </div>

        {/* Counter Info */}
        <p className="text-xs text-muted-foreground shrink-0">
          Menampilkan <span className="font-semibold text-foreground font-mono">{filteredCount}</span> dari{" "}
          <span className="font-semibold text-foreground font-mono">{totalCount}</span> masukan
        </p>
      </div>
    </div>
  );
}
