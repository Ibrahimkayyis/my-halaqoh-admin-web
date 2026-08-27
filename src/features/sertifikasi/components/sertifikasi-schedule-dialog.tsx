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
import { Loader2, Calendar } from "lucide-react";
import {
  ScheduleFormSchema,
  type ScheduleFormValues,
} from "../schemas/sertifikasi.schema";
import { useApproveSertifikasi } from "../hooks/use-sertifikasi";
import { useGetGuru } from "@/features/guru/hooks/use-guru";
import {
  TIM_PENGUJI_SERTIFIKASI,
  SESI_UJIAN_PRESETS,
  type SertifikasiTahfidz,
} from "../types/sertifikasi.types";

interface SertifikasiScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: SertifikasiTahfidz | null;
}

export function SertifikasiScheduleDialog({
  open,
  onOpenChange,
  item,
}: SertifikasiScheduleDialogProps) {
  const { t } = useTranslation(["sertifikasi", "common"]);
  const approveMutation = useApproveSertifikasi();
  const { data: guruList = [] } = useGetGuru();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ScheduleFormValues>({
    resolver: zodResolver(ScheduleFormSchema),
    defaultValues: {
      tanggalUjian: new Date(),
      sesiUjian: SESI_UJIAN_PRESETS[0],
      pengujiNama: TIM_PENGUJI_SERTIFIKASI[0].nama,
      pengujiId: "",
      catatanAdmin: "",
    },
  });

  useEffect(() => {
    if (open && item) {
      const defaultExaminer = TIM_PENGUJI_SERTIFIKASI[0];
      const matchedGuru = guruList.find((g) => g.nip === defaultExaminer.nip);

      reset({
        tanggalUjian: new Date(),
        sesiUjian: SESI_UJIAN_PRESETS[0],
        pengujiNama: defaultExaminer.nama,
        pengujiId: matchedGuru ? matchedGuru.id : "",
        catatanAdmin: "",
      });
    }
  }, [open, item, guruList, reset]);

  const onSubmit = async (values: ScheduleFormValues) => {
    if (!item) return;
    try {
      await approveMutation.mutateAsync({
        id: item.id,
        data: {
          tanggalUjian: values.tanggalUjian,
          sesiUjian: values.sesiUjian,
          pengujiNama: values.pengujiNama,
          pengujiId: values.pengujiId || undefined,
          catatanAdmin: values.catatanAdmin || undefined,
        },
      });
      onOpenChange(false);
    } catch (e) {
      console.error("Approve & schedule failed:", e);
    }
  };

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            <span>{t("sertifikasi:scheduleDialog.title", "Setujui & Jadwalkan Ujian")}</span>
          </DialogTitle>
        </DialogHeader>

        {/* Santri Summary Card */}
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
              <span className="font-medium text-foreground">
                Kelas {item.kelas} ({item.program === "T" ? "Takhassus" : "Reguler"})
              </span>
            </div>
            <div className="col-span-2">
              <span>Guru Pengampu: </span>
              <span className="font-medium text-foreground">
                {item.guruNama} • {item.halaqohNama}
              </span>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
          <FieldGroup className="space-y-3.5">
            {/* Tanggal Ujian */}
            <Controller
              control={control}
              name="tanggalUjian"
              render={({ field }) => {
                const dateString =
                  field.value instanceof Date
                    ? field.value.toISOString().split("T")[0]
                    : "";

                return (
                  <Field>
                    <FieldLabel className="text-xs font-medium">
                      {t("sertifikasi:scheduleDialog.tanggalUjianLabel", "Tanggal Ujian")}
                    </FieldLabel>
                    <Input
                      type="date"
                      value={dateString}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val) {
                          field.onChange(new Date(val));
                        }
                      }}
                      className="bg-surface h-9"
                    />
                    <FieldError errors={[errors.tanggalUjian]} />
                  </Field>
                );
              }}
            />

            {/* Sesi Ujian */}
            <Controller
              control={control}
              name="sesiUjian"
              render={({ field }) => (
                <Field>
                  <FieldLabel className="text-xs font-medium">
                    {t("sertifikasi:scheduleDialog.sesiUjianLabel", "Sesi Waktu Ujian")}
                  </FieldLabel>
                  <Select
                    value={field.value}
                    onValueChange={(val) => {
                      if (val) field.onChange(val);
                    }}
                  >
                    <SelectTrigger className="bg-surface h-9 text-xs">
                      <SelectValue placeholder={t("sertifikasi:scheduleDialog.sesiUjianPlaceholder", "Pilih sesi ujian")} />
                    </SelectTrigger>
                    <SelectContent>
                      {SESI_UJIAN_PRESETS.map((sesi) => (
                        <SelectItem key={sesi} value={sesi} className="text-xs">
                          {sesi}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError errors={[errors.sesiUjian]} />
                </Field>
              )}
            />

            {/* Ustadz Penguji */}
            <Controller
              control={control}
              name="pengujiNama"
              render={({ field }) => (
                <Field>
                  <FieldLabel className="text-xs font-medium">
                    {t("sertifikasi:scheduleDialog.pengujiLabel", "Ustadz Penguji Bersertifikat")}
                  </FieldLabel>
                  <Select
                    value={field.value}
                    onValueChange={(selectedNama) => {
                      if (!selectedNama) return;
                      field.onChange(selectedNama);
                      const examinerConfig = TIM_PENGUJI_SERTIFIKASI.find(
                        (p) => p.nama === selectedNama
                      );
                      if (examinerConfig) {
                        const matchedGuru = guruList.find(
                          (g) => g.nip === examinerConfig.nip
                        );
                        setValue("pengujiId", matchedGuru ? matchedGuru.id : "");
                      }
                    }}
                  >
                    <SelectTrigger className="bg-surface h-9 text-xs">
                      <SelectValue placeholder={t("sertifikasi:scheduleDialog.pengujiPlaceholder", "Pilih ustadz penguji")} />
                    </SelectTrigger>
                    <SelectContent>
                      {TIM_PENGUJI_SERTIFIKASI.map((penguji) => (
                        <SelectItem key={penguji.nip} value={penguji.nama} className="text-xs">
                          <span className="font-medium">{penguji.nama}</span>
                          <span className="text-muted-foreground ml-1 text-[11px]">
                            ({penguji.nip})
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError errors={[errors.pengujiNama]} />
                </Field>
              )}
            />

            {/* Catatan Admin */}
            <Controller
              control={control}
              name="catatanAdmin"
              render={({ field }) => (
                <Field>
                  <FieldLabel className="text-xs font-medium">
                    {t("sertifikasi:scheduleDialog.catatanAdminLabel", "Catatan Tempat / Instruksi (Opsional)")}
                  </FieldLabel>
                  <Textarea
                    placeholder={t(
                      "sertifikasi:scheduleDialog.catatanAdminPlaceholder",
                      "Contoh: Di Ruang Penguji Lt. 2 Masjid..."
                    )}
                    className="bg-surface min-h-[70px] text-xs"
                    {...field}
                    value={field.value || ""}
                  />
                  <FieldError errors={[errors.catatanAdmin]} />
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
              disabled={approveMutation.isPending}
              className="cursor-pointer"
            >
              {t("sertifikasi:scheduleDialog.cancelBtn", "Batal")}
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={approveMutation.isPending}
              className="cursor-pointer gap-1.5"
            >
              {approveMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{t("sertifikasi:scheduleDialog.submitBtn", "Setujui & Jadwalkan")}</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
