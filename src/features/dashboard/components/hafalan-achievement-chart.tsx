"use client";

import { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Sparkles, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Mock Data Capaian Target Hafalan Per Kelas & Program
const MOCK_HAFALAN_DATA = [
  { kelas: "Kelas 7", reguler: 82, takhassus: 91 },
  { kelas: "Kelas 8", reguler: 86, takhassus: 94 },
  { kelas: "Kelas 9", reguler: 89, takhassus: 96 },
  { kelas: "Kelas 10", reguler: 78, takhassus: 88 },
  { kelas: "Kelas 11", reguler: 84, takhassus: 92 },
  { kelas: "Kelas 12", reguler: 92, takhassus: 97 },
];

type LevelFilter = "all" | "smp" | "sma";

const LEVEL_FILTERS: { id: LevelFilter; label: string }[] = [
  { id: "all", label: "Semua Kelas" },
  { id: "smp", label: "SMP (Kelas 7–9)" },
  { id: "sma", label: "SMA (Kelas 10–12)" },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 rounded-lg bg-popover border border-border/80 text-popover-foreground shadow-md text-xs space-y-1.5 min-w-[150px]">
        <p className="font-semibold text-foreground border-b border-border/40 pb-1">
          {label}
        </p>
        {payload.map((entry, idx) => (
          <div key={idx} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
              <span
                className="h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: entry.color }}
              />
              {entry.name}
            </span>
            <span className="font-bold font-mono text-foreground">
              {entry.value}%
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export function HafalanAchievementChart() {
  const [levelFilter, setLevelFilter] = useState<LevelFilter>("all");

  const filteredData = useMemo(() => {
    switch (levelFilter) {
      case "smp":
        return MOCK_HAFALAN_DATA.slice(0, 3);
      case "sma":
        return MOCK_HAFALAN_DATA.slice(3, 6);
      default:
        return MOCK_HAFALAN_DATA;
    }
  }, [levelFilter]);

  // Calculate summary metrics
  const avgReguler = useMemo(() => {
    const sum = filteredData.reduce((acc, curr) => acc + curr.reguler, 0);
    return Math.round(sum / filteredData.length);
  }, [filteredData]);

  const avgTakhassus = useMemo(() => {
    const sum = filteredData.reduce((acc, curr) => acc + curr.takhassus, 0);
    return Math.round(sum / filteredData.length);
  }, [filteredData]);

  const avgTotal = Math.round((avgReguler + avgTakhassus) / 2);

  return (
    <Card className="rounded-xl border border-border/60 bg-card shadow-xs overflow-hidden">
      {/* Header Bar */}
      <CardHeader className="px-6 py-4 border-b border-border/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground tracking-tight">
                Statistik Capaian Target Hafalan
              </h3>
            </div>
            <p className="text-xs text-muted-foreground font-normal">
              Persentase rata-rata kelulusan target hafalan santri per kelas & program
            </p>
          </div>

          {/* Level Filter Segmented Control */}
          <div className="inline-flex items-center p-0.5 rounded-lg bg-muted/60 border border-border/40">
            {LEVEL_FILTERS.map((opt) => {
              const isActive = levelFilter === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setLevelFilter(opt.id)}
                  className={cn(
                    "px-2.5 py-1 text-xs font-medium rounded-md transition-all duration-150 cursor-pointer select-none",
                    isActive
                      ? "bg-background text-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Recharts Bar Chart */}
        <div className="h-[320px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredData}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
              <XAxis
                dataKey="kelas"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: "var(--border)" }}
              />
              <YAxis
                domain={[0, 100]}
                unit="%"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: "var(--border)" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: 16, fontSize: 12 }}
                iconType="circle"
                iconSize={8}
              />
              <Bar
                name="Program Reguler"
                dataKey="reguler"
                fill="#115D69"
                radius={[6, 6, 0, 0]}
                maxBarSize={40}
              />
              <Bar
                name="Program Takhassus"
                dataKey="takhassus"
                fill="#3B82F6"
                radius={[6, 6, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Footer Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-border/40">
          <div className="p-3.5 rounded-lg bg-muted/30 border border-border/30 space-y-1">
            <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#115D69]" />
              Rata-Rata Reguler
            </span>
            <p className="text-xl font-bold font-mono text-foreground">
              {avgReguler}%
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-muted/30 border border-border/30 space-y-1">
            <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#3B82F6]" />
              Rata-Rata Takhassus
            </span>
            <p className="text-xl font-bold font-mono text-foreground">
              {avgTakhassus}%
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-muted/30 border border-border/30 space-y-1">
            <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-primary" />
              Total Rata-Rata Capaian
            </span>
            <p className="text-xl font-bold font-mono text-primary">
              {avgTotal}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
