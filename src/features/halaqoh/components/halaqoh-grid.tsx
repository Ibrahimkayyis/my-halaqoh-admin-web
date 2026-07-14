"use client";

import { HalaqohCard, type HalaqohDummy } from "./halaqoh-card";

interface HalaqohGridProps {
  data: HalaqohDummy[];
  onEdit?: (halaqoh: HalaqohDummy) => void;
  onDelete?: (halaqoh: HalaqohDummy) => void;
}

export function HalaqohGrid({ data, onEdit, onDelete }: HalaqohGridProps) {
  if (data.length === 0) {
    return (
      <div className="bg-surface rounded-lg border border-dashed border-border/60 p-8 text-center text-muted-foreground">
        Tidak ada data halaqoh ditemukan.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((halaqoh) => (
        <HalaqohCard
          key={halaqoh.id}
          halaqoh={halaqoh}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
