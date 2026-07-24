"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { ChevronDown, Search, X } from "lucide-react";
import type { Guru } from "@/features/guru/types/guru.types";

interface GuruSelectorProps {
  value: string;
  onChange: (id: string, nama: string) => void;
  guruList: Guru[];
  assignedGuruIds: Set<string>;
  disabled?: boolean;
}

export function GuruSelector({
  value,
  onChange,
  guruList,
  assignedGuruIds,
  disabled = false,
}: GuruSelectorProps) {
  const { t } = useTranslation(["halaqoh", "common"]);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset search when dropdown closes
  useEffect(() => {
    if (!isOpen) setSearch("");
  }, [isOpen]);

  const selectedGuru = useMemo(
    () => guruList.find((g) => g.id === value),
    [guruList, value]
  );

  const availableGuru = useMemo(
    () => guruList.filter((g) => !assignedGuruIds.has(g.id) || g.id === value),
    [guruList, assignedGuruIds, value]
  );

  const hiddenCount = guruList.length - availableGuru.length;

  const filteredGuru = useMemo(() => {
    if (!search) return availableGuru;
    const q = search.toLowerCase();
    return availableGuru.filter(
      (g) =>
        g.nama.toLowerCase().includes(q) || g.nip.toLowerCase().includes(q)
    );
  }, [availableGuru, search]);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-left shadow-sm outline-none transition-all focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 h-10"
      >
        <span className={selectedGuru ? "text-foreground font-medium" : "text-muted-foreground"}>
          {selectedGuru ? selectedGuru.nama : t("halaqoh:guruSelector.searchPlaceholder")}
        </span>
        <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
      </button>

      {/* Warning Text */}
      {hiddenCount > 0 && !isOpen && (
        <p className="text-[11px] text-primary font-medium italic mt-1.5 leading-tight">
          * {hiddenCount} {t("halaqoh:guruSelector.empty")}
        </p>
      )}

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1.5 rounded-lg border border-border bg-surface shadow-dialog max-h-[300px] flex flex-col overflow-hidden">
          {/* Search Input */}
          <div className="relative border-b border-border p-2">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t("common:actions.search")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-8 h-9 text-xs"
              autoFocus
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* List items */}
          <div className="overflow-y-auto flex-1 py-1">
            {filteredGuru.length === 0 ? (
              <div className="px-3 py-4 text-center text-xs text-muted-foreground">
                {t("halaqoh:guruSelector.empty")}
              </div>
            ) : (
              filteredGuru.map((guru) => (
                <button
                  key={guru.id}
                  type="button"
                  onClick={() => {
                    onChange(guru.id, guru.nama);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-semibold hover:bg-muted transition-colors uppercase
                    ${value === guru.id ? "bg-primary/5 text-primary" : "text-foreground"}
                  `}
                >
                  {guru.nama}
                </button>
              ))
            )}
          </div>

          {/* Warning footer inside dropdown */}
          {hiddenCount > 0 && (
            <div className="bg-primary/5 px-3 py-2 border-t border-border/40 text-[10px] text-primary font-medium italic">
              * {hiddenCount} {t("halaqoh:guruSelector.empty")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
