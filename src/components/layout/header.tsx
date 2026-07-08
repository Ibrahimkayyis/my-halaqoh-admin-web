"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-surface px-8 shadow-sm">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Dropdown Filter Tahun Ajaran & Semester */}
        <div className="flex items-center rounded-md border border-border bg-surface shadow-sm">
          <div className="flex h-9 items-center justify-center rounded-l-md border-r border-border bg-muted/50 px-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Periode Aktif
            </span>
          </div>
          <Select defaultValue="2026/2027 - Ganjil">
            <SelectTrigger className="h-9 w-[190px] border-0 bg-transparent shadow-none focus:ring-0">
              <SelectValue placeholder="Pilih Periode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025/2026 - Ganjil">2025/2026 - Ganjil</SelectItem>
              <SelectItem value="2025/2026 - Genap">2025/2026 - Genap</SelectItem>
              <SelectItem value="2026/2027 - Ganjil">2026/2027 - Ganjil</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </header>
  );
}
