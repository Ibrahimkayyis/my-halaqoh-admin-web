"use client";

import { use } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  BookOpen,
  Phone,
  Sparkles,
  ShieldCheck,
  UserCheck,
  Users,
  MessageCircle,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import { useSantriBaseInfo } from "@/features/santri/hooks/use-santri-detail";
import { SantriMonthlyAttendanceCard } from "@/features/santri/components/santri-monthly-attendance-card";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function SantriDetailPage({ params }: PageProps) {
  const { id: santriId } = use(params);
  const { t } = useTranslation(["kehadiranSantri", "common"]);

  const {
    santri,
    halaqoh,
    guru,
    hafalanProgress,
    isLoading,
  } = useSantriBaseInfo(santriId);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="h-[500px] w-full bg-slate-200 dark:bg-slate-800 rounded-xl" />
      </div>
    );
  }

  if (!santri) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-muted-foreground font-medium">Santri tidak ditemukan</p>
        <Link href="/santri">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("detail.backToSantri")}
          </Button>
        </Link>
      </div>
    );
  }

  const phoneFormatted = santri.waliSantri?.phone?.replace(/\D/g, "") ?? "";
  const waUrl = phoneFormatted
    ? `https://wa.me/${phoneFormatted.startsWith("0") ? "62" + phoneFormatted.slice(1) : phoneFormatted}`
    : null;

  return (
    <div className="space-y-6">
      {/* Header Back Button */}
      <div className="flex items-center justify-between">
        <Link href="/santri">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            {t("detail.backToSantri")}
          </Button>
        </Link>
      </div>

      {/* Unified Master Container */}
      <Card className="rounded-xl border border-border/60 bg-card shadow-xs overflow-hidden">
        {/* Section 1: Santri Profile Overview */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            {/* Avatar + Main Info */}
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-xl border border-primary/20 shrink-0 overflow-hidden">
                {santri.profilePicture ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={santri.profilePicture} alt={santri.nama} className="h-full w-full object-cover" />
                ) : (
                  santri.nama.charAt(0).toUpperCase()
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold text-foreground tracking-tight">
                    {santri.nama}
                  </h2>
                  <Badge variant="outline" className="font-semibold text-xs rounded-md px-2.5 py-0.5 font-mono">
                    NIS: {santri.nis}
                  </Badge>
                  {santri.isAlumni ? (
                    <Badge variant="destructive" className="font-semibold text-xs rounded-md px-2.5 py-0.5">
                      {t("detail.alumniBadge")}
                    </Badge>
                  ) : (
                    <Badge className="font-semibold text-xs rounded-md px-2.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-none">
                      {t("detail.activeBadge")}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium pt-0.5">
                  <span className="inline-block bg-muted/60 text-foreground px-2 py-0.5 rounded-md font-semibold text-[11px]">
                    Kelas {santri.kelas}
                  </span>
                  <span>•</span>
                  <span>Program {santri.program === "T" ? "Takhassus" : "Reguler"}</span>
                </div>
              </div>
            </div>

            {/* Halaqoh & Ustadz Info */}
            <div className="w-full md:w-auto p-4 rounded-lg bg-muted/30 border border-border/30 space-y-1.5 min-w-[240px]">
              <div className="flex items-center gap-2 text-xs font-bold text-primary">
                <BookOpen className="h-3.5 w-3.5" />
                {halaqoh ? halaqoh.nama : t("detail.notRegisteredHalaqoh")}
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                Ustadz Pembimbing:{" "}
                <span className="font-semibold text-foreground">
                  {halaqoh?.guruNama ?? guru?.nama ?? "-"}
                </span>
              </p>
            </div>
          </div>

        </div>

        {/* Divider 1 */}
        <div className="border-t border-border/40" />

        {/* Section 2: Informasi Wali Santri */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground tracking-tight">
                {t("detail.waliInfoTitle")}
              </h3>
            </div>
            <Badge variant="outline" className="text-[11px] font-medium text-muted-foreground border-border/60">
              Monitoring Admin
            </Badge>
          </div>

          {santri.waliSantri && (santri.waliSantri.nama || santri.waliSantri.phone || santri.waliSantri.hubungan) ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Nama Wali */}
              <div className="p-3.5 rounded-lg bg-muted/30 border border-border/30 space-y-1">
                <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
                  <UserCheck className="h-3.5 w-3.5 text-primary" />
                  {t("detail.waliNama")}
                </span>
                <p className="text-sm font-bold text-foreground truncate">
                  {santri.waliSantri.nama || "-"}
                </p>
              </div>

              {/* Status Hubungan */}
              <div className="p-3.5 rounded-lg bg-muted/30 border border-border/30 space-y-1">
                <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-primary" />
                  {t("detail.waliHubungan")}
                </span>
                <div className="pt-0.5">
                  {santri.waliSantri.hubungan ? (
                    <Badge className="font-semibold text-xs rounded-md px-2.5 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shadow-none">
                      {santri.waliSantri.hubungan}
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground font-medium">-</span>
                  )}
                </div>
              </div>

              {/* Nomor HP & Chat WhatsApp */}
              <div className="p-3.5 rounded-lg bg-muted/30 border border-border/30 space-y-1">
                <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-emerald-600" />
                  {t("detail.waliPhone")}
                </span>
                <div className="flex items-center justify-between gap-2 pt-0.5">
                  <span className="text-xs font-mono font-bold text-foreground">
                    {santri.waliSantri.phone || "-"}
                  </span>
                  {waUrl && (
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-500/10 hover:bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-500/20 transition-colors"
                    >
                      <MessageCircle className="h-3 w-3" />
                      Chat WhatsApp
                    </a>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-muted/20 border border-dashed border-border/60 flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-muted-foreground/60 shrink-0" />
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-foreground">
                  {t("detail.noWaliData")}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {t("detail.noWaliDesc")}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Divider 1 */}
        <div className="border-t border-border/40" />

        {/* Section 2: Progress Hafalan */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground tracking-tight">
              {t("detail.hafalanTitle")}
            </h3>
          </div>

          <div className="space-y-4">
            {/* Admin Target Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">{t("detail.adminTargetTitle")}</span>
                <span className="font-bold text-primary font-mono text-sm">{hafalanProgress.adminProgress}%</span>
              </div>

              <Progress value={hafalanProgress.adminProgress} className="h-2" />

              <div className="flex items-center justify-between text-[11px] text-muted-foreground font-medium pt-0.5">
                <span>
                  {hafalanProgress.adminJuzCompleted} {t("detail.juzCompleted")}
                </span>
                <span>
                  {t("detail.targetLabel", { target: hafalanProgress.adminJuzTarget })}
                </span>
              </div>
            </div>

            {/* Extra Target Progress (if exists) */}
            {hafalanProgress.extraJuzTarget > 0 && (
              <div className="space-y-2 pt-3 border-t border-border/30">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-blue-600 dark:text-blue-400">{t("detail.extraTargetTitle")}</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400 font-mono text-sm">{hafalanProgress.extraProgress}%</span>
                </div>

                <Progress value={hafalanProgress.extraProgress} className="h-2 [&>div]:bg-blue-600" />

                <div className="flex items-center justify-between text-[11px] text-muted-foreground font-medium pt-0.5">
                  <span>
                    {hafalanProgress.extraJuzCompleted} / {hafalanProgress.extraJuzTarget} Juz Extra
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Divider 2 */}
        <div className="border-t border-border/40" />

        {/* Section 3: Ringkasan Kehadiran */}
        <SantriMonthlyAttendanceCard
          santriId={santriId}
          halaqohId={santri.halaqohId}
          santriNis={santri.nis}
          halaqohNama={halaqoh?.nama}
          guruNama={halaqoh?.guruNama ?? guru?.nama}
        />
      </Card>
    </div>
  );
}
