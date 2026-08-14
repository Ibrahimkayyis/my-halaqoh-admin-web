"use client";

import { use, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
} from "recharts";
import {
  ArrowLeft,
  BookOpen,
  User,
  Users,
  FileEdit,
  FileText,
  CheckCircle2,
  XCircle,
  Sparkles,
  ChevronRight,
  PieChart as PieChartIcon,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  useHalaqohBaseDetail,
  useHalaqohTodayAttendanceStats,
  useHalaqohHafalanAchievement,
  type TodaySesiAttendanceStat,
} from "@/features/halaqoh/hooks/use-halaqoh-detail";
import { HalaqohReportDialog } from "@/features/halaqoh/components/halaqoh-report-dialog";

interface PageProps {
  params: Promise<{ id: string }>;
}

interface SessionChartPanelProps {
  stat: TodaySesiAttendanceStat;
}

function SessionChartPanel({ stat }: SessionChartPanelProps) {
  const chartData = useMemo(() => {
    if (!stat.isScheduledToday || stat.totalExpected === 0) return [];

    const data = [
      { name: "Hadir", value: stat.hadirCount, color: "#10B981" },
      { name: "Sakit", value: stat.sakitCount, color: "#FBBF24" },
      { name: "Izin", value: stat.izinCount, color: "#3B82F6" },
      { name: "Alfa", value: stat.alfaCount, color: "#F43F5E" },
      { name: "Belum Diabsen", value: stat.unrecordedCount, color: "#94A3B8" },
    ];

    return data.filter((d) => d.value > 0);
  }, [stat]);

  return (
    <div
      className={`p-5 rounded-xl border transition-all bg-surface ${
        !stat.isScheduledToday
          ? "border-border/30 opacity-60 bg-muted/10"
          : stat.hasAbsensiRecord
          ? "border-border/60 shadow-2xs"
          : "border-amber-500/30 bg-amber-500/5"
      }`}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left / Info Column (7 Cols) */}
        <div className="md:col-span-7 space-y-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h4 className="text-base font-bold text-foreground">
              Sesi {stat.label}
            </h4>
            {stat.isScheduledToday ? (
              <>
                <Badge className="text-[11px] font-semibold rounded-full px-2.5 py-0.5 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shadow-none">
                  Terjadwal Hari Ini
                </Badge>
                {stat.hasAbsensiRecord ? (
                  <Badge variant="outline" className="text-[11px] font-semibold rounded-full px-2.5 py-0.5 bg-primary/10 text-primary border-primary/20">
                    Telah Diabsen
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-[11px] font-semibold rounded-full px-2.5 py-0.5 bg-amber-500/10 text-amber-600 border-amber-500/20">
                    Belum Diabsen
                  </Badge>
                )}
              </>
            ) : (
              <Badge variant="outline" className="text-[11px] font-medium text-muted-foreground border-border/40 rounded-full">
                Libur Sesi Hari Ini
              </Badge>
            )}
          </div>

          {stat.isScheduledToday ? (
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground font-sans">
                  {stat.percentage}%
                </span>
                <span className="text-xs font-semibold text-muted-foreground">
                  ({stat.hadirCount} / {stat.totalExpected} Santri Hadir)
                </span>
              </div>

              <Progress value={stat.hasAbsensiRecord ? stat.percentage : 0} className="h-2 bg-muted/60" />

              {/* Status Breakdown Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Hadir: {stat.hadirCount}
                </span>

                {stat.sakitCount > 0 && (
                  <span className="inline-flex items-center gap-1.5 font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    Sakit: {stat.sakitCount}
                  </span>
                )}

                {stat.izinCount > 0 && (
                  <span className="inline-flex items-center gap-1.5 font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-md border border-blue-500/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    Izin: {stat.izinCount}
                  </span>
                )}

                {stat.alfaCount > 0 && (
                  <span className="inline-flex items-center gap-1.5 font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-md border border-rose-500/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                    Alfa: {stat.alfaCount}
                  </span>
                )}

                {stat.unrecordedCount > 0 && (
                  <span className="inline-flex items-center gap-1.5 font-medium text-muted-foreground bg-muted/40 px-2.5 py-0.5 rounded-md border border-border/40">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                    Belum Diabsen: {stat.unrecordedCount}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic">
              Sesi ini tidak memiliki jadwal pada hari ini sesuai kalender program.
            </p>
          )}
        </div>

        {/* Right / Chart Column (5 Cols) */}
        <div className="md:col-span-5 flex items-center justify-center min-h-[140px] border-t md:border-t-0 md:border-l border-border/40 pt-4 md:pt-0 md:pl-4">
          {stat.isScheduledToday && chartData.length > 0 ? (
            <div className="w-full h-[140px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={55}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0];
                        return (
                          <div className="px-2.5 py-1.5 rounded-md bg-popover border border-border text-popover-foreground shadow-sm text-xs font-medium">
                            <span style={{ color: item.payload.color }}>
                              {item.name}: <strong>{item.value} Santri</strong>
                            </span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-xs text-muted-foreground text-center py-4">
              {stat.isScheduledToday ? "Belum ada data visual kehadiran" : "Tidak ada grafik"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HalaqohDetailPage({ params }: PageProps) {
  const { id: halaqohId } = use(params);
  const router = useRouter();
  const { t } = useTranslation(["halaqoh", "common"]);

  const [reportDialogOpen, setReportDialogOpen] = useState<boolean>(false);

  const { halaqoh, guru, members, isLoading: baseLoading } = useHalaqohBaseDetail(halaqohId);

  const { todaySessionStats, formattedTodayDate, isLoading: statsLoading } = useHalaqohTodayAttendanceStats(
    halaqohId,
    halaqoh?.program,
    members.length
  );

  const { hafalanSummary, isLoading: hafalanLoading } = useHalaqohHafalanAchievement(
    members,
    halaqoh?.program,
    halaqoh?.kelas
  );

  if (baseLoading) {
    return (
      <div className="space-y-6 animate-pulse p-6">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="h-[400px] w-full bg-slate-200 dark:bg-slate-800 rounded-xl" />
      </div>
    );
  }

  if (!halaqoh) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 p-6">
        <p className="text-muted-foreground font-medium">Kelompok halaqoh tidak ditemukan</p>
        <Link href="/halaqoh">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("halaqoh:detail.backButton")}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Navigation & Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link href="/halaqoh">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            {t("halaqoh:detail.backButton")}
          </Button>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/halaqoh/${halaqohId}`)}
            className="gap-1.5 text-xs font-medium"
          >
            <FileEdit className="h-3.5 w-3.5" />
            {t("halaqoh:detail.editButton")}
          </Button>

          <Button
            size="sm"
            onClick={() => setReportDialogOpen(true)}
            className="gap-1.5 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <FileText className="h-3.5 w-3.5" />
            {t("halaqoh:detail.generateReportButton")}
          </Button>
        </div>
      </div>

      {/* Master Content Card Container */}
      <Card className="rounded-xl border border-border/60 bg-card shadow-xs overflow-hidden">
        {/* SECTION 1: Profil Kelompok Halaqoh Header */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            {/* Identity & Badges */}
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-xl border border-primary/20 shrink-0">
                <BookOpen className="h-8 w-8" />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-2xl font-bold text-foreground tracking-tight">
                    {halaqoh.nama}
                  </h2>
                  <Badge variant="outline" className="font-semibold text-xs rounded-md px-2.5 py-0.5 border-primary/20 text-primary bg-primary/5">
                    Kelas {halaqoh.kelas}
                  </Badge>
                  <Badge variant="secondary" className="font-semibold text-xs rounded-md px-2.5 py-0.5 text-primary bg-primary/10">
                    Program {halaqoh.program === "T" ? "Takhassus" : "Reguler"}
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground font-medium">
                  Kelompok binaan halaqoh Al-Qur&apos;an Pesantren Luqman Al Hakim
                </p>
              </div>
            </div>

            {/* Teacher & Roster Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full md:w-auto min-w-[320px]">
              <div className="p-3.5 rounded-lg bg-muted/30 border border-border/40 space-y-1">
                <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-primary" />
                  {t("halaqoh:detail.teacherSection")}
                </span>
                <p className="text-sm font-bold text-foreground truncate">
                  {halaqoh.guruNama || guru?.nama || "-"}
                </p>
                {guru?.nip && (
                  <p className="text-[11px] font-mono text-muted-foreground">
                    NIP: {guru.nip}
                  </p>
                )}
              </div>

              <div className="p-3.5 rounded-lg bg-muted/30 border border-border/40 space-y-1">
                <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-primary" />
                  {t("halaqoh:detail.memberCount")}
                </span>
                <p className="text-sm font-bold text-foreground">
                  {members.length} Santri
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Anggota Terdaftar
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider 1 */}
        <div className="border-t border-border/40" />

        {/* SECTION 2: Grafik Kehadiran Santri Per Sesi Hari Ini */}
        <div className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <PieChartIcon className="h-4 w-4 text-primary" />
              <h3 className="text-base font-semibold text-foreground tracking-tight">
                {t("halaqoh:detail.attendanceTitle")}
              </h3>
            </div>

            <Badge variant="outline" className="text-xs font-medium text-muted-foreground border-border/60 w-fit">
              {t("halaqoh:detail.todayDateLabel", { date: formattedTodayDate })}
            </Badge>
          </div>

          {statsLoading ? (
            <div className="h-44 bg-muted/40 rounded-xl animate-pulse border border-border/30" />
          ) : (
            <div className="space-y-3">
              {todaySessionStats.map((stat) => (
                <SessionChartPanel key={stat.sesi} stat={stat} />
              ))}
            </div>
          )}
        </div>

        {/* Divider 2 */}
        <div className="border-t border-border/40" />

        {/* SECTION 3: Capaian Target Hafalan Anggota */}
        <div className="p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <h3 className="text-base font-semibold text-foreground tracking-tight">
                  {t("halaqoh:detail.hafalanTitle")}
                </h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Persentase anggota halaqoh yang telah mencapai target hafalan kurikulum semester aktif.
              </p>
            </div>

            <Badge variant="outline" className="text-xs font-medium text-muted-foreground border-border/60">
              Target Kelas {halaqoh.kelas}: {hafalanSummary.targetJuz} Juz
            </Badge>
          </div>

          {/* Metric Summary Card */}
          <div className="p-4 rounded-xl bg-muted/30 border border-border/40 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground">
                  Persentase Kelompok Mencapai Target Hafalan
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-medium text-foreground tracking-tight font-sans">
                    {hafalanSummary.overallPercentage}%
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">
                    ({hafalanSummary.achievedCount} dari {hafalanSummary.totalSantri} santri telah mencapai target {hafalanSummary.targetJuz} Juz)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge className="font-semibold text-xs rounded-md px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-none">
                  {hafalanSummary.achievedCount} Tercapai
                </Badge>
                <Badge variant="outline" className="font-semibold text-xs rounded-md px-2.5 py-1 text-muted-foreground border-border/60">
                  {hafalanSummary.notAchievedCount} Belum
                </Badge>
              </div>
            </div>

            <Progress value={hafalanSummary.overallPercentage} className="h-2 bg-muted/60" />
          </div>

          {/* Member Achievement Table */}
          {hafalanLoading ? (
            <div className="h-32 bg-muted/40 rounded-lg animate-pulse border border-border/30" />
          ) : hafalanSummary.santriAchievements.length > 0 ? (
            <div className="rounded-lg border border-border/40 overflow-hidden bg-surface">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="border-border/40">
                    <TableHead className="w-[50px] text-xs font-bold">No</TableHead>
                    <TableHead className="text-xs font-bold">Nama Santri</TableHead>
                    <TableHead className="text-xs font-bold">NIS</TableHead>
                    <TableHead className="text-xs font-bold">Juz Tercapai</TableHead>
                    <TableHead className="w-[200px] text-xs font-bold">Progress</TableHead>
                    <TableHead className="text-right text-xs font-bold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hafalanSummary.santriAchievements.map((item, idx) => (
                    <TableRow key={item.santriId} className="hover:bg-muted/20 border-border/30">
                      <TableCell className="text-xs font-medium">{idx + 1}</TableCell>
                      <TableCell className="text-xs font-bold text-foreground">
                        <Link
                          href={`/santri/${item.santriId}`}
                          className="hover:text-primary transition-colors flex items-center gap-1 group"
                        >
                          <span>{item.nama}</span>
                          <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                        </Link>
                      </TableCell>
                      <TableCell className="text-xs font-mono text-muted-foreground">
                        {item.nis}
                      </TableCell>
                      <TableCell className="text-xs font-bold text-foreground">
                        {item.completedJuzCount} / {item.targetJuz} Juz
                      </TableCell>
                      <TableCell className="text-xs">
                        <div className="space-y-1">
                          <Progress value={item.progressPercentage} className="h-1.5" />
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {item.progressPercentage}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {item.isAchieved ? (
                          <Badge className="gap-1 font-semibold text-[11px] rounded-full px-2.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-none">
                            <CheckCircle2 className="h-3 w-3" />
                            {t("halaqoh:detail.achievedBadge")}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="gap-1 font-semibold text-[11px] rounded-full px-2.5 py-0.5 text-muted-foreground border-border/60 bg-muted/30">
                            <XCircle className="h-3 w-3" />
                            {t("halaqoh:detail.notAchievedBadge")}
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-muted/20 border border-dashed border-border/60 text-center text-xs text-muted-foreground">
              {t("halaqoh:detail.noMembers")}
            </div>
          )}
        </div>

        {/* Divider 3 */}
        <div className="border-t border-border/40" />

        {/* SECTION 4: Daftar Santri Anggota (Roster) */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <h3 className="text-base font-semibold text-foreground tracking-tight">
                  {t("halaqoh:detail.memberListTitle")}
                </h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Klik nama santri untuk melihat halaman detail profil dan riwayat hafalan individual.
              </p>
            </div>
            <Badge variant="secondary" className="text-xs font-medium px-2.5 py-0.5">
              {members.length} Santri
            </Badge>
          </div>

          {members.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {members.map((santri) => (
                <Link
                  key={santri.id}
                  href={`/santri/${santri.id}`}
                  className="p-3.5 rounded-lg bg-surface border border-border/50 hover:border-primary/50 hover:shadow-xs transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm border border-primary/20 shrink-0">
                      {santri.nama.charAt(0).toUpperCase()}
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <p className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">
                        {santri.nama}
                      </p>
                      <p className="text-[11px] font-mono text-muted-foreground">
                        NIS: {santri.nis} • Kelas {santri.kelas}
                      </p>
                    </div>
                  </div>

                  <ChevronRight className="h-4 w-4 text-muted-foreground/60 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-6 rounded-lg bg-muted/20 border border-dashed border-border/60 text-center text-xs text-muted-foreground">
              {t("halaqoh:detail.noMembers")}
            </div>
          )}
        </div>
      </Card>

      {/* PDF Absence Report Dialog */}
      <HalaqohReportDialog
        open={reportDialogOpen}
        onOpenChange={setReportDialogOpen}
        halaqohId={halaqohId}
        halaqohNama={halaqoh.nama}
      />
    </div>
  );
}
