"use client";

import { useState, useEffect, useMemo } from "react";
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
import { WheelTimePicker } from "@/components/ui/wheel-time-picker";
import { cn } from "@/lib/utils";
import { Loader2, Calendar, Clock, AlertCircle } from "lucide-react";
import {
  ScheduleFormSchema,
  type ScheduleFormValues,
} from "../schemas/sertifikasi.schema";
import { useApproveSertifikasi, useGetPengujiSertifikasi } from "../hooks/use-sertifikasi";
import { useGetGuru } from "@/features/guru/hooks/use-guru";
import {
  TIM_PENGUJI_SERTIFIKASI,
  type SertifikasiTahfidz,
} from "../types/sertifikasi.types";

/**
 * Helper to compute human-friendly duration text (e.g., "1 jam 30 mnt")
 */
function calculateDuration(start: string, end: string): string | null {
  const [h1, m1] = start.split(":").map(Number);
  const [h2, m2] = end.split(":").map(Number);
  if (isNaN(h1) || isNaN(m1) || isNaN(h2) || isNaN(m2)) return null;

  const totalMin1 = h1 * 60 + m1;
  const totalMin2 = h2 * 60 + m2;
  const diff = totalMin2 - totalMin1;

  if (diff <= 0) return null;

  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;

  if (hours > 0 && minutes > 0) return `${hours} jam ${minutes} mnt`;
  if (hours > 0) return `${hours} jam`;
  return `${minutes} menit`;
}

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
  const { data: pengujiList = [] } = useGetPengujiSertifikasi();
  const { data: guruList = [] } = useGetGuru();

  // Active examiners pool (normalized from Firestore or fallback to presets)
  const activeExaminers: Array<{
    id?: string;
    guruId?: string;
    nip: string;
    nama: string;
    isDefault?: boolean;
  }> = useMemo(() => {
    if (pengujiList.length > 0) return pengujiList;
    return TIM_PENGUJI_SERTIFIKASI.map((p, idx) => ({
      id: `default-${idx}`,
      nip: p.nip,
      nama: p.nama,
      isDefault: true,
    }));
  }, [pengujiList]);

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
      sesiUjian: "08:00 - 09:30 WIB",
      pengujiNama: TIM_PENGUJI_SERTIFIKASI[0].nama,
      pengujiId: "",
      catatanAdmin: "",
    },
  });

  const [activeTimeTab, setActiveTimeTab] = useState<"start" | "end">("start");

  const sesiUjianValue = useWatch({ control, name: "sesiUjian" }) || "08:00 - 09:30 WIB";

  // Derive start and end time from sesiUjian string (e.g. "08:00 - 09:30 WIB")
  const { startTime, endTime } = useMemo(() => {
    const match = sesiUjianValue.match(/(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/);
    return {
      startTime: match ? match[1].padStart(5, "0") : "08:00",
      endTime: match ? match[2].padStart(5, "0") : "09:30",
    };
  }, [sesiUjianValue]);

  const handleTimeChange = (newStart: string, newEnd: string) => {
    const s = newStart || "08:00";
    const e = newEnd || "09:30";
    setValue("sesiUjian", `${s} - ${e} WIB`, { shouldValidate: true });
  };

  const durationText = useMemo(() => calculateDuration(startTime, endTime), [startTime, endTime]);
  const isTimeInvalid = useMemo(() => {
    const [h1, m1] = startTime.split(":").map(Number);
    const [h2, m2] = endTime.split(":").map(Number);
    return h2 * 60 + m2 <= h1 * 60 + m1;
  }, [startTime, endTime]);

  useEffect(() => {
    if (open && item) {
      const defaultExaminer = activeExaminers[0];
      const matchedGuru = defaultExaminer
        ? guruList.find(
            (g) =>
              g.nip === defaultExaminer.nip ||
              (defaultExaminer.guruId && g.id === defaultExaminer.guruId)
          )
        : undefined;

      const initialSesi = item.sesiUjian && item.sesiUjian.trim() !== ""
        ? item.sesiUjian
        : "08:00 - 09:30 WIB";

      reset({
        tanggalUjian: item.tanggalUjian?.toDate ? item.tanggalUjian.toDate() : new Date(),
        sesiUjian: initialSesi,
        pengujiNama: item.pengujiNama || (defaultExaminer ? defaultExaminer.nama : TIM_PENGUJI_SERTIFIKASI[0].nama),
        pengujiId: item.pengujiId || (matchedGuru ? matchedGuru.id : (defaultExaminer?.guruId || "")),
        catatanAdmin: item.catatanAdmin || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, item?.id]);

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
      <DialogContent className="w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto p-4 sm:p-6 rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
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

            {/* Waktu Pelaksanaan Ujian (Jam Mulai s/d Jam Selesai) */}
            <Field className="space-y-2">
              <div className="flex items-center justify-between">
                <FieldLabel className="text-xs font-semibold flex items-center gap-1.5 text-foreground">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <span>{t("sertifikasi:scheduleDialog.waktuUjianLabel", "Waktu Ujian")}</span>
                </FieldLabel>
                <span className="text-[11px] font-normal text-muted-foreground">
                  Pilih jam mulai & selesai
                </span>
              </div>

              <div className="rounded-xl border border-border/70 bg-muted/20 p-3 space-y-3">
                {/* Tab Switcher: Jam Mulai vs Jam Selesai */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-muted/40 rounded-xl border border-border/60">
                  <button
                    type="button"
                    aria-label="Tab Jam Mulai"
                    onClick={() => setActiveTimeTab("start")}
                    className={cn(
                      "flex flex-col items-center justify-center py-2 px-3 rounded-lg text-xs transition-all cursor-pointer",
                      activeTimeTab === "start"
                        ? "bg-surface shadow-xs font-semibold text-primary border border-border/60"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                      {t("sertifikasi:scheduleDialog.jamMulai", "Jam Mulai")}
                    </span>
                    <span className="text-sm font-bold text-foreground">
                      {startTime} WIB
                    </span>
                  </button>

                  <button
                    type="button"
                    aria-label="Tab Jam Selesai"
                    onClick={() => setActiveTimeTab("end")}
                    className={cn(
                      "flex flex-col items-center justify-center py-2 px-3 rounded-lg text-xs transition-all cursor-pointer",
                      activeTimeTab === "end"
                        ? "bg-surface shadow-xs font-semibold text-primary border border-border/60"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                      {t("sertifikasi:scheduleDialog.jamSelesai", "Jam Selesai")}
                    </span>
                    <span className="text-sm font-bold text-foreground">
                      {endTime} WIB
                    </span>
                  </button>
                </div>

                {/* 24-Hour Wheel Time Picker (Matches User Screenshot) */}
                <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-surface/60 border border-border/50">
                  <WheelTimePicker
                    title="Time"
                    subtitle={`Atur ${activeTimeTab === "start" ? "Jam Mulai" : "Jam Selesai"} Ujian (24 Jam)`}
                    value={activeTimeTab === "start" ? startTime : endTime}
                    onChange={(newTime) => {
                      if (activeTimeTab === "start") {
                        handleTimeChange(newTime, endTime);
                      } else {
                        handleTimeChange(startTime, newTime);
                      }
                    }}
                    className="w-full max-w-[260px]"
                  />
                </div>

                {/* Live Preview Box & Duration Indicator */}
                <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 px-2.5 py-1.5 text-[11px]">
                  <span className="text-muted-foreground flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3 text-primary" />
                    <span>Waktu Terpilih:</span>
                  </span>
                  <div className="flex items-center gap-1.5 font-semibold text-primary">
                    <span>{sesiUjianValue}</span>
                    {durationText && (
                      <Badge
                        variant="secondary"
                        className="bg-primary/10 text-primary text-[10px] px-1.5 py-0 font-normal shrink-0"
                      >
                        {durationText}
                      </Badge>
                    )}
                  </div>
                </div>

                {isTimeInvalid && (
                  <p className="text-[11px] text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>Jam selesai harus lebih besar dari jam mulai.</span>
                  </p>
                )}
              </div>

              <FieldError errors={[errors.sesiUjian]} />
            </Field>

            {/* Ustadz Penguji */}
            <Controller
              control={control}
              name="pengujiNama"
              render={({ field }) => (
                <Field>
                  <div className="flex items-center justify-between">
                    <FieldLabel className="text-xs font-medium">
                      {t("sertifikasi:scheduleDialog.pengujiLabel", "Ustadz Penguji Bersertifikat")}
                    </FieldLabel>
                    <span className="text-[11px] text-muted-foreground">
                      {activeExaminers.length} penguji aktif
                    </span>
                  </div>
                  <Select
                    value={field.value}
                    onValueChange={(selectedNama) => {
                      if (!selectedNama) return;
                      field.onChange(selectedNama);
                      const examinerConfig = activeExaminers.find(
                        (p) => p.nama === selectedNama
                      );
                      if (examinerConfig) {
                        const matchedGuru = guruList.find(
                          (g) =>
                            g.nip === examinerConfig.nip ||
                            (examinerConfig.guruId && g.id === examinerConfig.guruId)
                        );
                        setValue("pengujiId", matchedGuru ? matchedGuru.id : (examinerConfig.guruId || ""));
                      }
                    }}
                  >
                    <SelectTrigger className="bg-surface h-9 text-xs">
                      <SelectValue placeholder={t("sertifikasi:scheduleDialog.pengujiPlaceholder", "Pilih ustadz penguji")} />
                    </SelectTrigger>
                    <SelectContent className="max-h-56">
                      {activeExaminers.map((penguji) => (
                        <SelectItem key={penguji.id || penguji.nip} value={penguji.nama} className="text-xs">
                          <span className="font-medium">{penguji.nama}</span>
                          <span className="text-muted-foreground ml-1 text-[11px]">
                            ({penguji.nip})
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    * Jika penguji berhalangan, penguji pengganti dapat ditambahkan melalui menu <strong>Kelola Penguji</strong> di halaman utama.
                  </p>
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
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-3 border-t border-border/40">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={approveMutation.isPending}
              className="w-full sm:w-auto h-9 sm:h-8 cursor-pointer"
            >
              {t("sertifikasi:scheduleDialog.cancelBtn", "Batal")}
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={approveMutation.isPending}
              className="w-full sm:w-auto h-9 sm:h-8 cursor-pointer gap-1.5"
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
