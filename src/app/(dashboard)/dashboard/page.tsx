"use client";

import { useTranslation } from "react-i18next";
import { Users, GraduationCap, BookOpen } from "lucide-react";

import { useDashboardCounts } from "@/features/dashboard/hooks/use-dashboard-stats";
import { Card, CardContent } from "@/components/ui/card";
import { HafalanAchievementChart } from "@/features/dashboard/components/hafalan-achievement-chart";

export default function DashboardPage() {
  const { data: counts } = useDashboardCounts();
  const { t } = useTranslation(["dashboard", "common"]);

  const dynamicStatCards = [
    { title: t("stats.totalSantri"), value: counts?.santri ?? "...", icon: GraduationCap },
    { title: t("stats.totalGuru"), value: counts?.guru ?? "...", icon: Users },
    { title: t("stats.totalHalaqoh"), value: counts?.halaqoh ?? "...", icon: BookOpen },
  ];

  return (
    <div className="space-y-6">
      {/* Stat Cards Row - Clean Institutional Layout per DESIGN.md */}
      <div className="grid gap-4 md:grid-cols-3">
        {dynamicStatCards.map((stat, i) => (
          <Card key={i} className="shadow-xs border-border/60 rounded-xl bg-card">
            <CardContent className="p-5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <stat.icon className="h-4 w-4 text-muted-foreground/70" />
                  {stat.title}
                </span>
              </div>
              <p className="text-2xl font-medium font-mono text-foreground tracking-tight">
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Hafalan Achievement Statistics Chart */}
      <HafalanAchievementChart />
    </div>
  );
}
