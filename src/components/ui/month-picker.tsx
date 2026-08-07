"use client";

import * as React from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const MONTH_SHORT_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
];

interface MonthPickerProps {
  selectedMonth: number; // 1 - 12
  selectedYear: number;
  onChange: (month: number, year: number) => void;
  className?: string;
}

export function MonthPicker({
  selectedMonth,
  selectedYear,
  onChange,
  className,
}: MonthPickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [pickerYear, setPickerYear] = React.useState(selectedYear);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setPickerYear(selectedYear);
  }, [selectedYear]);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelectMonth = (monthIndex: number) => {
    onChange(monthIndex + 1, pickerYear);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={cn("relative inline-block", className)}>
      {/* Trigger Pill - Figma / Linear style */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "h-8 px-2.5 gap-1.5 text-xs font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors border border-border/50",
          isOpen && "bg-accent text-foreground border-border"
        )}
      >
        <CalendarIcon className="h-3.5 w-3.5 opacity-70" />
        <span>
          {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
        </span>
      </Button>

      {/* Linear/Notion Popover Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 z-50 w-64 p-3 rounded-xl bg-popover text-popover-foreground border border-border shadow-md outline-none animate-in fade-in-0 zoom-in-95 duration-100">
          {/* Header Year Navigator */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/40">
            <span className="text-[11px] font-semibold text-muted-foreground tracking-tight">
              Tahun {pickerYear}
            </span>

            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-md"
                onClick={(e) => {
                  e.stopPropagation();
                  setPickerYear((y) => y - 1);
                }}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-md"
                onClick={(e) => {
                  e.stopPropagation();
                  setPickerYear((y) => y + 1);
                }}
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Month Grid */}
          <div className="grid grid-cols-4 gap-1">
            {MONTH_SHORT_NAMES.map((name, index) => {
              const isSelected =
                selectedMonth === index + 1 && selectedYear === pickerYear;

              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => handleSelectMonth(index)}
                  className={cn(
                    "h-8 text-xs font-medium rounded-md transition-colors flex items-center justify-center cursor-pointer",
                    isSelected
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-foreground hover:bg-accent"
                  )}
                >
                  {name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
