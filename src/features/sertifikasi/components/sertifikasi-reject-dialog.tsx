"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { Loader2, XCircle, AlertTriangle } from "lucide-react";
import {
  RejectFormSchema,
  type RejectFormValues,
} from "../schemas/sertifikasi.schema";
import { useRejectSertifikasi } from "../hooks/use-sertifikasi";
import type { SertifikasiTahfidz } from "../types/sertifikasi.types";

interface SertifikasiRejectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: SertifikasiTahfidz | null;
}

export function SertifikasiRejectDialog({
  open,
  onOpenChange,
  item,
}: SertifikasiRejectDialogProps) {
  const { t } = useTranslation(["sertifikasi", "common"]);
  const rejectMutation = useRejectSertifikasi();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RejectFormValues>({
    resolver: zodResolver(RejectFormSchema),
    defaultValues: {
      alasanPenolakan: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({ alasanPenolakan: "" });
    }
  }, [open, reset]);

  const onSubmit = async (values: RejectFormValues) => {
    if (!item) return;
    try {
      await rejectMutation.mutateAsync({
        id: item.id,
        alasan: values.alasanPenolakan,
      });
      onOpenChange(false);
    } catch (e) {
      console.error("Reject submission failed:", e);
    }
  };

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-destructive flex items-center gap-2">
            <XCircle className="w-5 h-5" />
            <span>{t("sertifikasi:rejectDialog.title", "Tolak Pengajuan Sertifikasi")}</span>
          </DialogTitle>
        </DialogHeader>

        {/* Warning Notice */}
        <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-3 text-xs flex gap-2.5 items-start">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            {t(
              "sertifikasi:rejectDialog.subtitle",
              "Pengajuan akan ditolak. Berikan alasan yang jelas agar guru pengampu dapat membimbing santri lebih lanjut."
            )}
          </span>
        </div>

        {/* Santri Info */}
        <div className="bg-muted/40 border border-border/60 rounded-lg p-3 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-foreground">{item.santriNama}</span>
            <Badge variant="secondary" className="bg-primary/10 text-primary font-bold">
              Juz {item.juz}
            </Badge>
          </div>
          <div className="text-muted-foreground">
            NIS: {item.nis} • Kelas {item.kelas} • Guru: {item.guruNama}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
          <FieldGroup>
            <Controller
              control={control}
              name="alasanPenolakan"
              render={({ field }) => (
                <Field>
                  <FieldLabel className="text-xs font-medium">
                    {t("sertifikasi:rejectDialog.alasanLabel", "Alasan Penolakan")}
                  </FieldLabel>
                  <Textarea
                    placeholder={t(
                      "sertifikasi:rejectDialog.alasanPlaceholder",
                      "Tuliskan alasan penolakan secara jelas (misal: kelancaran ziyadah belum stabil, perlu mutqin kembali)..."
                    )}
                    className="bg-surface min-h-[90px] text-xs"
                    {...field}
                  />
                  <FieldError errors={[errors.alasanPenolakan]} />
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
              disabled={rejectMutation.isPending}
              className="cursor-pointer"
            >
              {t("sertifikasi:rejectDialog.cancelBtn", "Batal")}
            </Button>
            <Button
              type="submit"
              variant="destructive"
              size="sm"
              disabled={rejectMutation.isPending}
              className="cursor-pointer gap-1.5"
            >
              {rejectMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{t("sertifikasi:rejectDialog.submitBtn", "Tolak Pengajuan")}</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
