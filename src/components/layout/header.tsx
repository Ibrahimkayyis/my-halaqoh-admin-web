"use client";

import { Menu } from "lucide-react";

interface HeaderProps {
  title: string;
  onMenuClick?: () => void;
}

export function Header({ title, onMenuClick }: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-surface px-4 sm:px-6 lg:px-8 shadow-xs rounded-b-md">
      <div className="flex items-center gap-3 min-w-0">
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden cursor-pointer shrink-0 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Buka menu navigasi"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <h1 className="text-lg sm:text-xl font-bold tracking-tight text-primary truncate">
          {title}
        </h1>
      </div>
    </header>
  );
}
