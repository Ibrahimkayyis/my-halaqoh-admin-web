"use client";

import { HalaqohCard } from "./halaqoh-card";
import type { Halaqoh } from "@/types/models/halaqoh.types";

interface HalaqohGridProps {
  data: Halaqoh[];
  onEdit?: (halaqoh: Halaqoh) => void;
  onDelete?: (halaqoh: Halaqoh) => void;
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
