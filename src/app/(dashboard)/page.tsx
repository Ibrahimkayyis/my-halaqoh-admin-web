"use client";

import { Users, GraduationCap, BookOpen, Calendar as CalendarIcon } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer
} from "recharts";

import { useDashboardCounts } from "@/features/dashboard/hooks/use-dashboard-stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

// --- Mock Data ---

// --- Mock Data ---

const hafalanData = [
  { name: "Kelas 7", capaian: 85, fill: "var(--color-primary)" },
  { name: "Kelas 8", capaian: 78, fill: "var(--color-primary)" },
  { name: "Kelas 9", capaian: 92, fill: "var(--color-primary)" },
  { name: "Kelas 10", capaian: 65, fill: "var(--color-primary)" },
  { name: "Kelas 11", capaian: 70, fill: "var(--color-primary)" },
  { name: "Kelas 12", capaian: 88, fill: "var(--color-primary)" },
];

const kehadiranData = [
  { name: "Kelas 7", kehadiran: 95, fill: "var(--color-primary)" },
  { name: "Kelas 8", kehadiran: 92, fill: "var(--color-primary)" },
  { name: "Kelas 9", kehadiran: 98, fill: "var(--color-primary)" },
  { name: "Kelas 10", kehadiran: 85, fill: "var(--color-primary)" },
  { name: "Kelas 11", kehadiran: 89, fill: "var(--color-primary)" },
  { name: "Kelas 12", kehadiran: 94, fill: "var(--color-primary)" },
];

// -------------------

export default function DashboardPage() {
  const { data: counts } = useDashboardCounts();

  const dynamicStatCards = [
    { title: "Total Santri", value: counts?.santri ?? "...", icon: GraduationCap },
    { title: "Total Guru", value: counts?.guru ?? "...", icon: Users },
    { title: "Total Halaqoh", value: counts?.halaqoh ?? "...", icon: BookOpen },
  ];

  return (
    <div className="space-y-8">
      {/* Stat Cards Row */}
      <div className="grid gap-6 md:grid-cols-3">
        {dynamicStatCards.map((stat, i) => (
          <Card key={i} className="shadow-sm border-border/40">
            <CardContent className="flex items-center p-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <stat.icon className="h-7 w-7" />
              </div>
              <div className="ml-6 space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-3xl font-bold tracking-tight text-foreground">
                    {stat.value}
                  </h2>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Section 1: Capaian Target Hafalan (Bar Chart Vertikal) */}
        <Card className="shadow-sm border-border/40 flex flex-col">
          <CardHeader className="flex flex-row items-start justify-between pb-2">
            <div className="space-y-3">
              <div className="space-y-1">
                <CardTitle className="text-lg font-semibold text-foreground">
                  Capaian Target Hafalan per Kelas
                </CardTitle>
              </div>
            </div>
            
            {/* Filter Tahun Ajaran & Semester */}
            <div className="flex flex-col gap-2 rounded-[8px] border border-border/50 bg-muted/20 p-3 w-[220px]">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-semibold text-muted-foreground">Semester Aktif</span>
                <span className="text-sm font-bold text-primary">2026/2027 - Ganjil</span>
              </div>
              <Select defaultValue="2026/2027 - Ganjil">
                <SelectTrigger className="h-8 w-full bg-surface rounded-[8px]">
                  <SelectValue placeholder="Tahun Ajaran" />
                </SelectTrigger>
                <SelectContent className="rounded-[8px]">
                  <SelectItem value="2025/2026 - Ganjil">2025/2026 - Ganjil</SelectItem>
                  <SelectItem value="2025/2026 - Genap">2025/2026 - Genap</SelectItem>
                  <SelectItem value="2026/2027 - Ganjil">2026/2027 - Ganjil</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="flex-1 mt-4">
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={hafalanData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                    domain={[0, 100]}
                    tickFormatter={(val) => `${val}%`}
                  />
                  <RechartsTooltip 
                    cursor={{ fill: "var(--color-muted)", opacity: 0.4 }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={(value: any) => [`${value}%`, 'Capaian']}
                  />
                  <Bar 
                    dataKey="capaian" 
                    radius={[4, 4, 0, 0]} 
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Capaian Kehadiran Santri (Bar Chart Vertikal) */}
        <Card className="shadow-sm border-border/40 flex flex-col">
          <CardHeader className="flex flex-row items-start justify-between pb-2">
            <div className="space-y-3">
              <div className="space-y-1">
                <CardTitle className="text-lg font-semibold text-foreground">
                  Tingkat Kehadiran Santri
                </CardTitle>
              </div>
            </div>
            
            {/* Filter Tanggal */}
            <div className="flex flex-col gap-2 rounded-[8px] border border-border/50 bg-muted/20 p-3 w-[220px]">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-semibold text-muted-foreground">Hari Ini</span>
                <span className="text-sm font-bold text-primary truncate">
                  {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
              <div className="relative">
                <Input 
                  type="date" 
                  defaultValue={new Date().toISOString().split("T")[0]}
                  className="h-8 w-full bg-surface pl-8 rounded-[8px]"
                />
                <CalendarIcon className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 mt-4">
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={kehadiranData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                    domain={[0, 100]}
                    tickFormatter={(val) => `${val}%`}
                  />
                  <RechartsTooltip 
                    cursor={{ fill: "var(--color-muted)", opacity: 0.4 }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={(value: any) => [`${value}%`, 'Kehadiran']}
                  />
                  <Bar 
                    dataKey="kehadiran" 
                    radius={[4, 4, 0, 0]} 
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}