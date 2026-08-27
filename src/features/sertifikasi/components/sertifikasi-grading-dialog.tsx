"use client";

import { useEffect } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { Loader2, ClipboardCheck, Award, CheckCircle2, XCircle } from "lucide-react";
import {
  GradingFormSchema,
  type GradingFormValues,
} from "../schemas/sertifikasi.schema";
import { useGradeSertifikasi } from "../hooks/use-sertifikasi";
import { calculatePredikat, type SertifikasiTahfidz } from "../types/sertifikasi.types";
import { cn } from "@/lib/utils";

interface SertifikasiGradingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: SertifikasiTahfidz | null;
}

export function SertifikasiGradingDialog({
  open,
  onOpenChange,
  item,
}: SertifikasiGradingDialogProps) {
  const { t } = useTranslation(["sertifikasi", "common"]);
  const gradeMutation = useGradeSertifikasi();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<GradingFormValues>({
    resolver: zodResolver(GradingFormSchema),
    defaultValues: {
      nilai: 80,
      status: "passed",
      catatanPenguji: "",
    },
  });

  const watchedNilai = useWatch({ control, name: "nilai" });
  const livePredikat =
    typeof watchedNilai === "number" && !isNaN(watchedNilai) && watchedNilai > 0
      ? calculatePredikat(watchedNilai)
      : "-";

  useEffect(() => {
    if (open && item) {
      reset({
        nilai: item.nilai ?? 80,
        status: (item.status === "passed" || item.status === "failed") ? item.status : "passed",
        catatanPenguji: item.catatanPenguji ?? "",
      });
    }
  }, [open, item, reset]);

  const onSubmit = async (values: GradingFormValues) => {
    if (!item) return;
    try {
      await gradeMutation.mutateAsync({
        id: item.id,
        data: {
          nilai: Number(values.nilai),
          status: values.status,
          catatanPenguji: values.catatanPenguji || undefined,
        },
      });
      onOpenChange(false);
    } catch (e) {
      console.error("Grading failed:", e);
    }
  };

  if (!item) return null;

  const formatDate = (timestamp?: { toDate: () => Date } | null) => {
    if (!timestamp) return "-";
    try {
      return timestamp.toDate().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return "-";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-primary" />
            <span>{t("sertifikasi:gradingDialog.title", "Input Hasil Ujian Sertifikasi")}</span>
          </DialogTitle>
        </DialogHeader>

        {/* Santri & Exam Info Header */}
        <div className="bg-muted/40 border border-border/60 rounded-lg p-3.5 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm text-foreground">{item.santriNama}</span>
            <Badge variant="secondary" className="bg-primary/10 text-primary font-bold">
              Juz {item.juz}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-2 text-muted-foreground pt-1 border-t border-border/40">
            <div>
              <span>NIS: </span>
              <span className="font-medium text-foreground">{item.nis}</span>
            </div>
            <div>
              <span>Kelas: </span>
              <span className="font-medium text-foreground">Kelas {item.kelas}</span>
            </div>
            <div>
              <span>Tanggal Ujian: </span>
              <span className="font-medium text-foreground">{formatDate(item.tanggalUjian)}</span>
            </div>
            <div>
              <span>Penguji: </span>
              <span className="font-medium text-foreground">{item.pengujiNama || "-"}</span>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
          <FieldGroup className="space-y-3.5">
            {/* Nilai & Predikat Live Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
              <Controller
                control={control}
                name="nilai"
                render={({ field }) => (
                  <Field>
                    <FieldLabel className="text-xs font-medium">
                      {t("sertifikasi:gradingDialog.nilaiLabel", "Nilai Ujian (1 - 100)")}
                    </FieldLabel>
                    <Input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="1 - 100"
                      className="bg-surface h-9 text-base font-semibold"
                      value={field.value !== undefined && field.value !== null ? String(field.value) : ""}
                      onChange={(e) => {
                        const digitsOnly = e.target.value.replace(/[^0-9]/g, "");
                        if (digitsOnly === "") {
                          field.onChange("" as any);
                          return;
                        }
                        const num = parseInt(digitsOnly, 10);
                        const clamped = Math.min(100, num);
                        field.onChange(clamped);

                        // Auto-adjust status based on standard passing threshold (60)
                        if (clamped >= 60) {
                          setValue("status", "passed");
                        } else {
                          setValue("status", "failed");
                        }
                      }}
                    />
                    <FieldError errors={[errors.nilai]} />
                  </Field>
                )}
              />

              {/* Live Predikat Preview Card - No text truncation, fully wraps */}
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-muted-foreground">
                  {t("sertifikasi:gradingDialog.predikatLabel", "Predikat Kelulusan")}
                </span>
                <div
                  className={cn(
                    "min-h-9 px-3 py-1.5 rounded-md border flex items-center gap-1.5 text-xs font-semibold whitespace-normal leading-snug break-words",
                    watchedNilai >= 80
                      ? "bg-success/10 text-success border-success/20"
                      : watchedNilai >= 60
                      ? "bg-warning/10 text-warning border-warning/20"
                      : "bg-destructive/10 text-destructive border-destructive/20"
                  )}
                >
                  <Award className="w-4 h-4 shrink-0" />
                  <span>{livePredikat}</span>
                </div>
              </div>
            </div>

            {/* Status Kelulusan with formatted label in Trigger */}
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Field>
                  <FieldLabel className="text-xs font-medium">
                    {t("sertifikasi:gradingDialog.statusLabel", "Status Kelulusan")}
                  </FieldLabel>
                  <Select
                    value={field.value}
                    onValueChange={(val) => {
                      if (val === "passed" || val === "failed") {
                        field.onChange(val);
                      }
                    }}
                  >
                    <SelectTrigger className="bg-surface h-9 text-xs">
                      <SelectValue placeholder="Pilih status hasil">
                        {field.value === "passed" && (
                          <span className="flex items-center gap-1.5 text-success font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                            <span>{t("sertifikasi:gradingDialog.statusPassed", "Lulus Sertifikasi")}</span>
                          </span>
                        )}
                        {field.value === "failed" && (
                          <span className="flex items-center gap-1.5 text-destructive font-medium">
                            <XCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{t("sertifikasi:gradingDialog.statusFailed", "Perlu Mengulang")}</span>
                          </span>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="passed" className="text-xs">
                        <div className="flex items-center gap-2 text-success font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>{t("sertifikasi:gradingDialog.statusPassed", "Lulus Sertifikasi")}</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="failed" className="text-xs">
                        <div className="flex items-center gap-2 text-destructive font-medium">
                          <XCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{t("sertifikasi:gradingDialog.statusFailed", "Perlu Mengulang")}</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldError errors={[errors.status]} />
                </Field>
              )}
            />

            {/* Catatan Evaluasi Penguji */}
            <Controller
              control={control}
              name="catatanPenguji"
              render={({ field }) => (
                <Field>
                  <FieldLabel className="text-xs font-medium">
                    {t("sertifikasi:gradingDialog.catatanPengujiLabel", "Catatan Evaluasi Penguji (Opsional)")}
                  </FieldLabel>
                  <Textarea
                    placeholder={t(
                      "sertifikasi:gradingDialog.catatanPengujiPlaceholder",
                      "Catatan tentang makhraj, tajwid, kelancaran, fashohah..."
                    )}
                    className="bg-surface min-h-[80px] text-xs"
                    {...field}
                    value={field.value || ""}
                  />
                  <FieldError errors={[errors.catatanPenguji]} />
                </Field>
              )}
            />
          </FieldGroup>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2.5 pt-2 border-t border-border/40">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={gradeMutation.isPending}
              className="cursor-pointer"
            >
              {t("sertifikasi:gradingDialog.cancelBtn", "Batal")}
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={gradeMutation.isPending}
              className="cursor-pointer gap-1.5 font-medium"
            >
              {gradeMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{t("sertifikasi:gradingDialog.submitBtn", "Simpan Hasil Ujian")}</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
