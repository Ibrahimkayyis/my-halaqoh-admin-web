"use client";

import { useEffect, useState, useMemo } from "react";
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
import { useApproveSertifikasi, useGetPengujiSertifikasi } from "../hooks/use-sertifikasi";
import { useGetGuru } from "@/features/guru/hooks/use-guru";
import {
  TIM_PENGUJI_SERTIFIKASI,
  SESI_UJIAN_PRESETS,
  type SertifikasiTahfidz,
} from "../types/sertifikasi.types";
import { cn } from "@/lib/utils";

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

  // Flexible time state
  const [timeMode, setTimeMode] = useState<"preset" | "custom">("preset");
  const [customStartTime, setCustomStartTime] = useState("08:00");
  const [customEndTime, setCustomEndTime] = useState("09:30");
  const [customLabel, setCustomLabel] = useState("");

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

  const handleCustomTimeChange = (start: string, end: string, label: string) => {
    const formatted = label.trim()
      ? `${label.trim()} (${start} - ${end} WIB)`
      : `${start} - ${end} WIB`;
    setValue("sesiUjian", formatted, { shouldValidate: true });
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setTimeMode("preset");
      setCustomStartTime("08:00");
      setCustomEndTime("09:30");
      setCustomLabel("");
    }
    onOpenChange(newOpen);
  };

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

      reset({
        tanggalUjian: new Date(),
        sesiUjian: SESI_UJIAN_PRESETS[0],
        pengujiNama: defaultExaminer ? defaultExaminer.nama : TIM_PENGUJI_SERTIFIKASI[0].nama,
        pengujiId: matchedGuru ? matchedGuru.id : (defaultExaminer?.guruId || ""),
        catatanAdmin: "",
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
      handleOpenChange(false);
    } catch (e) {
      console.error("Approve & schedule failed:", e);
    }
  };

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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

            {/* Sesi Waktu Ujian (Fleksibel: Preset vs Kustom) */}
            <Controller
              control={control}
              name="sesiUjian"
              render={({ field }) => (
                <Field className="space-y-2">
                  <div className="flex items-center justify-between">
                    <FieldLabel className="text-xs font-medium">
                      {t("sertifikasi:scheduleDialog.sesiUjianLabel", "Sesi Waktu Ujian")}
                    </FieldLabel>
                    <div className="flex items-center gap-1 rounded-md bg-muted/60 p-0.5 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setTimeMode("preset")}
                        className={cn(
                          "px-2 py-0.5 rounded font-medium transition-colors cursor-pointer",
                          timeMode === "preset"
                            ? "bg-card text-foreground shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        Pilihan Cepat
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setTimeMode("custom");
                          handleCustomTimeChange(customStartTime, customEndTime, customLabel);
                        }}
                        className={cn(
                          "px-2 py-0.5 rounded font-medium transition-colors cursor-pointer",
                          timeMode === "custom"
                            ? "bg-card text-foreground shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        Waktu Kustom
                      </button>
                    </div>
                  </div>

                  {timeMode === "preset" ? (
                    <div className="space-y-2">
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

                      {/* Quick Chips for fast selection */}
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {SESI_UJIAN_PRESETS.slice(0, 4).map((sesi) => (
                          <button
                            key={sesi}
                            type="button"
                            onClick={() => field.onChange(sesi)}
                            className={cn(
                              "text-[10px] px-2 py-1 rounded-md border transition-all cursor-pointer",
                              field.value === sesi
                                ? "border-primary bg-primary/10 text-primary font-semibold"
                                : "border-border/70 bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                            )}
                          >
                            {sesi.split(" ")[0]}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2.5 rounded-lg border border-border/70 bg-muted/20 p-2.5">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[11px] font-medium text-muted-foreground">Jam Mulai</span>
                          <Input
                            type="time"
                            value={customStartTime}
                            onChange={(e) => {
                              const val = e.target.value;
                              setCustomStartTime(val);
                              handleCustomTimeChange(val, customEndTime, customLabel);
                            }}
                            className="bg-surface h-8 text-xs mt-1"
                          />
                        </div>
                        <div>
                          <span className="text-[11px] font-medium text-muted-foreground">Jam Selesai</span>
                          <Input
                            type="time"
                            value={customEndTime}
                            onChange={(e) => {
                              const val = e.target.value;
                              setCustomEndTime(val);
                              handleCustomTimeChange(customStartTime, val, customLabel);
                            }}
                            className="bg-surface h-8 text-xs mt-1"
                          />
                        </div>
                      </div>

                      <div>
                        <span className="text-[11px] font-medium text-muted-foreground">Keterangan / Sesi Khusus (Opsional)</span>
                        <Input
                          placeholder="Misal: Sesi Dhuha / Ba'da Ashar"
                          value={customLabel}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCustomLabel(val);
                            handleCustomTimeChange(customStartTime, customEndTime, val);
                          }}
                          className="bg-surface h-8 text-xs mt-1"
                        />
                      </div>
                    </div>
                  )}

                  {/* Live Preview Box */}
                  <div className="flex items-center justify-between rounded-md border border-primary/20 bg-primary/5 px-2.5 py-1 text-[11px] text-primary">
                    <span className="text-muted-foreground">Jadwal Sesi:</span>
                    <span className="font-semibold truncate ml-2">{field.value}</span>
                  </div>

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
