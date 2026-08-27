"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, X } from "lucide-react";

interface BulkActionFabProps {
  isSelectionMode: boolean;
  selectedCount: number;
  onEnterSelectionMode: () => void;
  onExitSelectionMode: () => void;
  onDelete: () => void;
  triggerLabel?: string;
  cancelLabel?: string;
  deleteLabel?: string;
  itemCountLabel?: string;
}

export function BulkActionFab({
  isSelectionMode,
  selectedCount,
  onEnterSelectionMode,
  onExitSelectionMode,
  onDelete,
  triggerLabel = "Hapus Masal",
  cancelLabel = "Batal",
  deleteLabel = "Hapus",
  itemCountLabel = "dipilih",
}: BulkActionFabProps) {
  if (!isSelectionMode) {
    return (
      <div className="fixed bottom-6 right-6 z-40 sm:bottom-8 sm:right-8 animate-in fade-in zoom-in-95 duration-200">
        <Button
          type="button"
          variant="destructive"
          onClick={onEnterSelectionMode}
          className="h-12 px-4 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 flex items-center gap-2 cursor-pointer font-medium text-sm"
          aria-label={triggerLabel}
        >
          <Trash2 className="w-4 h-4" />
          <span>{triggerLabel}</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 sm:bottom-8 sm:right-8 flex items-center gap-2 p-1.5 px-3 bg-surface/95 backdrop-blur-md border border-border/80 rounded-full shadow-2xl animate-in slide-in-from-bottom-5 duration-200">
      <Badge
        variant="secondary"
        className="font-medium text-xs px-2.5 py-1 rounded-full text-foreground bg-muted/60"
      >
        {selectedCount} {itemCountLabel}
      </Badge>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onExitSelectionMode}
        className="rounded-full h-8 px-3 gap-1 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
        <span>{cancelLabel}</span>
      </Button>

      <Button
        type="button"
        variant="destructive"
        size="sm"
        onClick={onDelete}
        disabled={selectedCount === 0}
        className="rounded-full h-8 px-3.5 gap-1.5 text-xs font-medium shadow-xs cursor-pointer disabled:opacity-50"
      >
        <Trash2 className="w-3.5 h-3.5" />
        <span>{deleteLabel}</span>
      </Button>
    </div>
  );
}
