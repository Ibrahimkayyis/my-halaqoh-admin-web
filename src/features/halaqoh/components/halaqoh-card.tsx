"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Users, FileEdit, Trash2 } from "lucide-react";

export interface HalaqohDummy {
  id: string;
  nama: string;
  kelas: string;
  program: "R" | "T";
  guruId: string;
  guruNama: string;
  jumlahSantri: number;
}

interface HalaqohCardProps {
  halaqoh: HalaqohDummy;
  onEdit?: (halaqoh: HalaqohDummy) => void;
  onDelete?: (halaqoh: HalaqohDummy) => void;
}

export function HalaqohCard({ halaqoh, onEdit, onDelete }: HalaqohCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow bg-surface border border-border/40 relative overflow-hidden">
      <CardContent className="p-5 space-y-4">
        {/* Header: Title (Fully displayed without truncating) */}
        <div>
          <h3 className="font-semibold text-base text-foreground break-words">
            {halaqoh.nama}
          </h3>
        </div>

        {/* Body: Teacher Name and Santri Count */}
        <div className="space-y-2.5 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="w-4 h-4 text-muted-foreground/60 shrink-0" />
            <span className="font-medium text-foreground truncate">
              {halaqoh.guruNama}
            </span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="w-4 h-4 text-muted-foreground/60 shrink-0" />
            <Badge variant="outline" className="font-normal text-xs px-2 py-0.5 text-muted-foreground bg-muted/30 border-muted">
              {halaqoh.jumlahSantri} Santri
            </Badge>
          </div>

          {/* Badges Kelas & Program (Bottom Left of content area) */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <Badge variant="outline" className="text-[10px] font-medium px-2 py-0.5 border-primary/20 text-primary bg-primary/5">
              Kelas {halaqoh.kelas}
            </Badge>
            <Badge variant="secondary" className="text-[10px] font-medium px-2 py-0.5 text-primary bg-primary/10">
              {halaqoh.program === "R" ? "Reguler" : "Takhassus"}
            </Badge>
          </div>
        </div>

        {/* Divider and Actions */}
        <div className="flex items-center justify-end gap-1 pt-2 border-t border-border/30">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => onEdit?.(halaqoh)}
            title="Edit Halaqoh"
          >
            <FileEdit className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => onDelete?.(halaqoh)}
            title="Hapus Halaqoh"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Hapus</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
