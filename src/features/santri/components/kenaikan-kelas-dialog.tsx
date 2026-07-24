"use client";

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  ArrowUpCircle, 
  Flag, 
  Lock, 
  Minus, 
  Plus, 
  AlertTriangle,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetKelas } from "@/features/kelas-program/hooks/use-kelas";
import { usePromoteAll } from "../hooks/use-santri";
import type { Santri } from "../types/santri.types";

interface KenaikanKelasDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeSantri: Santri[];
}

export function KenaikanKelasDialog({ open, onOpenChange, activeSantri }: KenaikanKelasDialogProps) {
  const { t } = useTranslation(["santri", "common"]);
  const [tahunAwal, setTahunAwal] = useState(2026);
  const [semester, setSemester] = useState<1 | 2>(1);
  const [showConfirm, setShowConfirm] = useState(false);

  const { data: kelasList = [] } = useGetKelas();
  const promoteMutation = usePromoteAll();

  // Dynamic stats calculation
  const stats = useMemo(() => {
    const nextKelasMap: Record<string, string | null> = {};
    kelasList.forEach((k) => {
      nextKelasMap[k.nama] = k.nextKelasId;
    });

    let naikKelas = 0;
    let lulus = 0;

    activeSantri.forEach((santri) => {
      const nextKelasId = nextKelasMap[santri.kelas];
      if (nextKelasId) {
        naikKelas++;
      } else {
        lulus++;
      }
    });

    return { naikKelas, lulus };
  }, [activeSantri, kelasList]);

  const handleProses = () => {
    setShowConfirm(true);
  };

  const handleConfirmSubmit = async () => {
    try {
      await promoteMutation.mutateAsync({
        activeSantri,
        kelasMap: kelasList,
        tahunAjaran: `${tahunAwal}/${tahunAwal + 1}`,
        semesterAktif: semester,
      });
      setShowConfirm(false);
      onOpenChange(false);
    } catch (e) {
      console.error("Kenaikan kelas error:", e);
    }
  };

  const isPending = promoteMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={(val) => {
      if (isPending) return;
      if (!val) setShowConfirm(false);
      onOpenChange(val);
    }}>
      <DialogContent className={cn("sm:max-w-[450px] p-0 overflow-hidden", showConfirm && "sm:max-w-[400px]")}>
        {!showConfirm ? (
          <>
            <div className="p-6 pb-4 flex items-start gap-4 border-b">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <ArrowUpCircle className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <DialogTitle className="text-xl font-bold">{t("santri:promote.title")}</DialogTitle>
                <DialogDescription className="text-sm mt-1">
                  {t("santri:promote.previewDesc")}
                </DialogDescription>
              </div>
            </div>

            <div className="p-6 pt-4 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
                <h4 className="text-sm font-bold text-primary mb-3">{t("santri:promote.stepPreview")}</h4>
                <ul className="space-y-3">
                  <li className="flex gap-3 text-sm text-muted-foreground">
                    <ArrowUpCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{stats.naikKelas} {t("santri:promote.classPromoted")}</span>
                  </li>
                  {stats.lulus > 0 && (
                    <li className="flex gap-3 text-sm text-muted-foreground">
                      <ArrowUpCircle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                      <span>{stats.lulus} {t("santri:promote.classGraduated")}</span>
                    </li>
                  )}
                  <li className="flex gap-3 text-sm text-muted-foreground">
                    <Flag className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                    <span>{t("santri:promote.confirmDesc")}</span>
                  </li>
                  <li className="flex gap-3 text-sm text-muted-foreground">
                    <Lock className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    <span>Data hafalan & halaqoh tidak berubah / Hafalan data remains unchanged</span>
                  </li>
                </ul>
              </div>

              {/* Tahun Ajaran */}
              <div>
                <h4 className="text-sm font-semibold mb-3">{t("santri:promote.newAcademicYear")}</h4>
                <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 border rounded-xl p-3">
                  <Button 
                    variant="default" 
                    size="icon" 
                    className="w-10 h-10 rounded-lg shrink-0 bg-primary hover:bg-primary/90"
                    onClick={() => setTahunAwal(prev => prev - 1)}
                  >
                    <Minus className="w-5 h-5" />
                  </Button>
                  
                  <div className="flex flex-col items-center">
                    <div className="text-2xl font-bold text-primary tracking-tight">
                      {tahunAwal} <span className="text-muted-foreground/50 font-medium">/</span> {tahunAwal + 1}
                    </div>
                    <span className="text-xs text-muted-foreground">{t("common:labels.academicYear")}</span>
                  </div>

                  <Button 
                    variant="default" 
                    size="icon" 
                    className="w-10 h-10 rounded-lg shrink-0 bg-primary hover:bg-primary/90"
                    onClick={() => setTahunAwal(prev => prev + 1)}
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Semester Aktif */}
              <div>
                <h4 className="text-sm font-semibold mb-3">{t("santri:promote.newSemester")}</h4>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    type="button"
                    variant={semester === 1 ? "default" : "outline"}
                    className={cn("h-12 text-sm font-medium rounded-xl", semester === 1 ? "bg-primary hover:bg-primary/90" : "bg-transparent")}
                    onClick={() => setSemester(1)}
                  >
                    <span className="w-5 h-5 mr-2 rounded bg-background/20 flex items-center justify-center text-xs font-bold">1</span>
                    {t("common:labels.semester1")}
                  </Button>
                  <Button 
                    type="button"
                    variant={semester === 2 ? "default" : "outline"}
                    className={cn("h-12 text-sm font-medium rounded-xl", semester === 2 ? "bg-primary hover:bg-primary/90" : "bg-transparent")}
                    onClick={() => setSemester(2)}
                  >
                    <span className="w-5 h-5 mr-2 rounded bg-foreground/10 flex items-center justify-center text-xs font-bold">2</span>
                    {t("common:labels.semester2")}
                  </Button>
                </div>
              </div>

              {/* Warning */}
              <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex gap-3 text-destructive">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <p className="text-sm leading-relaxed">
                  {t("santri:delete.warningText")}
                </p>
              </div>
            </div>

            <div className="p-6 pt-4 border-t bg-background">
              <Button 
                className="w-full h-12 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90"
                onClick={handleProses}
                disabled={activeSantri.length === 0}
              >
                <ArrowUpCircle className="w-5 h-5 mr-2" />
                {t("santri:promote.triggerBtn")}
              </Button>
            </div>
          </>
        ) : (
          <div className="p-6">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                {isPending ? (
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                ) : (
                  <ArrowUpCircle className="w-6 h-6 text-primary" />
                )}
              </div>
              <DialogTitle className="text-xl font-bold">{t("santri:promote.stepConfirm")}</DialogTitle>
            </div>
            
            <div className="text-sm text-muted-foreground space-y-4 mb-8">
              <p>{t("santri:promote.confirmDesc")}</p>
              <ul className="space-y-2 list-disc list-inside">
                <li>{stats.naikKelas} {t("santri:promote.classPromoted")}</li>
                <li>{stats.lulus} {t("santri:promote.classGraduated")}</li>
                <li>{t("common:labels.academicYear")}: {tahunAwal} / {tahunAwal + 1}</li>
              </ul>
              <p className="pt-2 border-t text-foreground font-medium">
                {t("santri:delete.warningText")}
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <Button 
                variant="ghost" 
                onClick={() => setShowConfirm(false)}
                className="font-medium"
                disabled={isPending}
              >
                {t("common:actions.cancel")}
              </Button>
              <Button 
                variant="default"
                onClick={handleConfirmSubmit}
                className="font-medium bg-primary hover:bg-primary/90"
                disabled={isPending}
              >
                {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {t("common:actions.confirm")}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
