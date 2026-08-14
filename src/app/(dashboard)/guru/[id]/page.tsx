"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  BookOpen,
  Phone,
  Mail,
  UserCheck,
  Users,
  MessageCircle,
  Pencil,
  KeyRound,
  Calendar as CalendarIcon,
  Copy,
  Check,
  ArrowRight,
  Shield,
  Clock,
  IdCard,
  GraduationCap,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { useGuruDetail } from "@/features/guru/hooks/use-guru-detail";
import { useResetPasswordGuru } from "@/features/guru/hooks/use-guru";
import { GuruFormDialog } from "@/features/guru/components/guru-form-dialog";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function GuruDetailPage({ params }: PageProps) {
  const { id: guruId } = use(params);
  const { t } = useTranslation(["guru", "common"]);

  const [editOpen, setEditOpen] = useState(false);
  const [copiedNip, setCopiedNip] = useState(false);

  const { guru, halaqoh, members, isLoading } = useGuruDetail(guruId);
  const resetPasswordMutation = useResetPasswordGuru();

  const handleCopyNip = () => {
    if (!guru?.nip) return;
    navigator.clipboard.writeText(guru.nip);
    setCopiedNip(true);
    setTimeout(() => setCopiedNip(false), 2000);
  };

  const handleResetPassword = () => {
    if (!guru?.authUid) return;
    if (
      confirm(
        `Apakah Anda yakin ingin mereset password untuk ustadz ${guru.nama}? Password akan dikembalikan ke default: "generasi554"`
      )
    ) {
      resetPasswordMutation.mutate(guru.authUid);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse p-6">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="h-[400px] w-full bg-slate-200 dark:bg-slate-800 rounded-xl" />
      </div>
    );
  }

  if (!guru) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 p-6">
        <p className="text-muted-foreground font-medium">
          {t("guru:table.notFound")}
        </p>
        <Link href="/guru">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("guru:detail.backButton")}
          </Button>
        </Link>
      </div>
    );
  }

  const phoneFormatted = guru.phone?.replace(/\D/g, "") ?? "";
  const waUrl = phoneFormatted
    ? `https://wa.me/${phoneFormatted.startsWith("0") ? "62" + phoneFormatted.slice(1) : phoneFormatted}`
    : null;

  const registeredDateStr = guru.createdAt
    ? new Date(
        (guru.createdAt as any).toDate?.() ?? (guru.createdAt as any)
      ).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "-";

  const lastUpdatedStr = guru.updatedAt
    ? new Date(
        (guru.updatedAt as any).toDate?.() ?? (guru.updatedAt as any)
      ).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="space-y-6 p-6">
      {/* Navigation & Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link href="/guru">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("guru:detail.backButton")}
          </Button>
        </Link>

        <div className="flex items-center gap-2 flex-wrap">
          {waUrl && (
            <a href={waUrl} target="_blank" rel="noopener noreferrer">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                WhatsApp
              </Button>
            </a>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleResetPassword}
            disabled={!guru.authUid || resetPasswordMutation.isPending}
            className="gap-1.5 text-xs font-medium"
            title={!guru.authUid ? "Akun Auth belum aktif" : "Reset Password"}
          >
            <KeyRound className="h-3.5 w-3.5" />
            {t("guru:detail.resetPasswordButton")}
          </Button>

          <Button
            size="sm"
            onClick={() => setEditOpen(true)}
            className="gap-1.5 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Pencil className="h-3.5 w-3.5" />
            {t("guru:detail.editButton")}
          </Button>
        </div>
      </div>

      {/* Main Container */}
      <div className="space-y-6">
        {/* Section 1: Profil Ustadz Pengampu Card */}
        <Card className="rounded-xl border border-border/60 bg-card shadow-xs overflow-hidden">
          {/* Header Banner */}
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold text-2xl border border-primary/20 shrink-0 overflow-hidden shadow-2xs">
                  {guru.profilePicture ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={guru.profilePicture}
                      alt={guru.nama}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    guru.nama.charAt(0).toUpperCase()
                  )}
                </div>

                {/* Name and Badges */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-2xl font-bold text-foreground tracking-tight">
                      {guru.nama}
                    </h2>
                    <Badge
                      variant="secondary"
                      className="font-semibold text-xs rounded-md px-2.5 py-0.5 text-primary bg-primary/10"
                    >
                      {guru.program === "R"
                        ? t("common:labels.programReguler")
                        : t("common:labels.programTakhassus")}
                    </Badge>
                    {guru.authUid ? (
                      <Badge className="font-semibold text-xs rounded-md px-2.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-none">
                        <UserCheck className="h-3 w-3 mr-1" />
                        {t("guru:detail.authActive")}
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="font-semibold text-xs rounded-md px-2.5 py-0.5 text-muted-foreground border-border/60"
                      >
                        {t("guru:detail.authInactive")}
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground font-medium">
                    Tenaga Pendidik & Ustadz Pembimbing Halaqoh Al-Qur&apos;an Pesantren
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border/40" />

          {/* Detailed Personal Information Grid */}
          <div className="p-6">
            <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
              <IdCard className="h-4 w-4 text-primary" />
              Informasi Pribadi & Kontak
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* NIP Card */}
              <div className="p-4 rounded-xl bg-muted/20 border border-border/40 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Nomor Induk Pegawai (NIP)
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyNip}
                    className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-muted"
                    title="Salin NIP"
                  >
                    {copiedNip ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
                <p className="text-base font-bold text-foreground font-mono">
                  {guru.nip}
                </p>
                <span className="text-[11px] text-muted-foreground block">
                  Identitas resmi ustadz
                </span>
              </div>

              {/* Phone / WhatsApp Card */}
              <div className="p-4 rounded-xl bg-muted/20 border border-border/40 space-y-1.5">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  No. Telepon / WhatsApp
                </span>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary shrink-0" />
                  <p className="text-base font-bold text-foreground font-mono truncate">
                    {guru.phone || "-"}
                  </p>
                </div>
                {waUrl ? (
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-semibold text-emerald-600 hover:underline inline-flex items-center gap-1"
                  >
                    <span>Hubungi via WhatsApp</span>
                  </a>
                ) : (
                  <span className="text-[11px] text-muted-foreground block">
                    Belum ada nomor telepon
                  </span>
                )}
              </div>

              {/* Email Card */}
              <div className="p-4 rounded-xl bg-muted/20 border border-border/40 space-y-1.5">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  Alamat Email
                </span>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary shrink-0" />
                  <p className="text-base font-bold text-foreground truncate">
                    {guru.email || "-"}
                  </p>
                </div>
                {guru.email ? (
                  <a
                    href={`mailto:${guru.email}`}
                    className="text-[11px] font-semibold text-primary hover:underline block"
                  >
                    Kirim Email ke Ustadz
                  </a>
                ) : (
                  <span className="text-[11px] text-muted-foreground block">
                    Email pribadi belum dicatat
                  </span>
                )}
              </div>

              {/* Program Teaching Card */}
              <div className="p-4 rounded-xl bg-muted/20 border border-border/40 space-y-1.5">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  Program Bimbingan
                </span>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-primary shrink-0" />
                  <p className="text-base font-bold text-foreground">
                    Program {guru.program === "R" ? "Reguler" : "Takhassus"}
                  </p>
                </div>
                <span className="text-[11px] text-muted-foreground block">
                  {guru.program === "R"
                    ? "Target Hafalan 5 Juz (2 Sesi per hari)"
                    : "Target Hafalan 15 Juz (5 Sesi per hari)"}
                </span>
              </div>

              {/* Auth Account Status Card */}
              <div className="p-4 rounded-xl bg-muted/20 border border-border/40 space-y-1.5">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  Status Autentikasi Sistem
                </span>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary shrink-0" />
                  <p className="text-base font-bold text-foreground">
                    {guru.authUid ? "Akun Terdaftar" : "Belum Aktif"}
                  </p>
                </div>
                <span className="text-[11px] text-muted-foreground block">
                  {guru.authUid ? "Dapat login ke aplikasi guru" : "Belum dibuatkan akun Auth"}
                </span>
              </div>

              {/* Registered Date Card */}
              <div className="p-4 rounded-xl bg-muted/20 border border-border/40 space-y-1.5">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  Tanggal Terdaftar
                </span>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-primary shrink-0" />
                  <p className="text-base font-bold text-foreground">
                    {registeredDateStr}
                  </p>
                </div>
                {lastUpdatedStr && (
                  <span className="text-[11px] text-muted-foreground block">
                    Diperbarui: {lastUpdatedStr}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Section 2: Kelompok Halaqoh Binaan Card */}
        <Card className="rounded-xl border border-border/60 bg-card shadow-xs overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <h3 className="text-base font-bold text-foreground tracking-tight">
                    {t("guru:detail.halaqohSection")}
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("guru:detail.halaqohSectionDesc")}
                </p>
              </div>

              {halaqoh && (
                <Badge variant="outline" className="text-xs font-semibold border-primary/30 text-primary bg-primary/5">
                  1 Kelompok Diampu
                </Badge>
              )}
            </div>

            {halaqoh ? (
              <div className="p-5 rounded-xl border border-border/60 bg-surface flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-lg border border-primary/20 shrink-0">
                    <BookOpen className="h-6 w-6" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-lg font-bold text-foreground">
                        {halaqoh.nama}
                      </h4>
                      <Badge variant="outline" className="font-semibold text-xs rounded-md px-2 py-0.5 border-primary/20 text-primary bg-primary/5">
                        Kelas {halaqoh.kelas}
                      </Badge>
                      <Badge variant="secondary" className="font-semibold text-xs rounded-md px-2 py-0.5 text-primary bg-primary/10">
                        Program {halaqoh.program === "T" ? "Takhassus" : "Reguler"}
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-primary" />
                      <span>{members.length} Santri Terdaftar sebagai Anggota Binaan</span>
                    </p>
                  </div>
                </div>

                <Link href={`/halaqoh/detail/${halaqoh.id}`}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 text-xs font-semibold text-foreground hover:bg-accent border-border/60 shrink-0"
                  >
                    <span>{t("guru:detail.viewHalaqohDetail")}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-primary" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="p-8 rounded-xl bg-muted/20 border border-dashed border-border/60 text-center space-y-2">
                <BookOpen className="h-8 w-8 text-muted-foreground/60 mx-auto" />
                <p className="text-sm font-semibold text-foreground">
                  Belum Memiliki Kelompok Halaqoh
                </p>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  {t("guru:detail.noHalaqoh")} Anda dapat meng-assign ustadz ini ke kelompok halaqoh pada menu Manajemen Halaqoh.
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* In-place Guru Edit Dialog */}
      <GuruFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        editData={guru}
      />
    </div>
  );
}
