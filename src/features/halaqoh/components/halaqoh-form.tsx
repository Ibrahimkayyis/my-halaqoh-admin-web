"use client";

import { useEffect, useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { Plus, Trash2, Save, X, Info } from "lucide-react";
import { useGetKelas } from "@/features/kelas-program/hooks/use-kelas";
import { useGetProgram } from "@/features/kelas-program/hooks/use-program";
import { GuruSelector } from "./guru-selector";
import { SantriTransferList } from "./santri-transfer-list";
import { HalaqohFormSchema, type HalaqohFormValues } from "@/features/halaqoh/schemas/halaqoh.schema";
import type { Guru } from "@/features/guru/types/guru.types";
import type { Santri } from "@/features/santri/types/santri.types";

interface HalaqohFormProps {
  initialValues?: HalaqohFormValues | null;
  isSubmitting?: boolean;
  onSubmit: (data: HalaqohFormValues) => void;
  onCancel: () => void;
  guruList: Guru[];
  allSantriList: Santri[];
  assignedGuruIds: Set<string>;
  assignedSantriIds: Set<string>;
}

export function HalaqohForm({
  initialValues,
  isSubmitting = false,
  onSubmit,
  onCancel,
  guruList,
  allSantriList,
  assignedGuruIds,
  assignedSantriIds,
}: HalaqohFormProps) {
  const { t } = useTranslation(["halaqoh", "common", "santri"]);
  const [transferOpen, setTransferOpen] = useState(false);
  const [selectedSantri, setSelectedSantri] = useState<Santri[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);

  const { data: kelasList = [] } = useGetKelas();
  const { data: programList = [] } = useGetProgram();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<HalaqohFormValues>({
    resolver: zodResolver(HalaqohFormSchema),
    defaultValues: {
      nama: "",
      kelas: "",
      program: "R",
      guruId: "",
      guruNama: "",
      santriIds: [],
    },
  });

  useEffect(() => {
    if (initialValues) {
      reset({
        nama: initialValues.nama,
        kelas: initialValues.kelas,
        program: initialValues.program,
        guruId: initialValues.guruId,
        guruNama: initialValues.guruNama,
        santriIds: initialValues.santriIds,
      });
      const initialSantri = allSantriList.filter((s) =>
        initialValues.santriIds.includes(s.id)
      );
      setSelectedSantri(initialSantri);
      const initClasses = (initialValues.kelas || "")
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);
      setSelectedClasses(initClasses);
    } else {
      reset({
        nama: "",
        kelas: "",
        program: "R",
        guruId: "",
        guruNama: "",
        santriIds: [],
      });
      setSelectedSantri([]);
      setSelectedClasses([]);
    }
  }, [initialValues, reset, allSantriList]);

  const handleAddKelas = (kelasName: string) => {
    if (selectedClasses.includes(kelasName)) return;
    const next = [...selectedClasses, kelasName].sort((a, b) => Number(a) - Number(b));
    setSelectedClasses(next);
    setValue("kelas", next.join(", "), { shouldValidate: true });
  };

  const handleRemoveKelas = (kelasName: string) => {
    const next = selectedClasses.filter((k) => k !== kelasName);
    setSelectedClasses(next);
    setValue("kelas", next.join(", "), { shouldValidate: true });
  };

  const handleAddSantriFromDialog = (newSelection: Santri[]) => {
    setSelectedSantri(newSelection);
    setValue(
      "santriIds",
      newSelection.map((s) => s.id)
    );

    // Auto-sync classes: if selected santri belong to classes not yet in selectedClasses, append them
    const santriClasses = Array.from(
      new Set(newSelection.map((s) => s.kelas).filter(Boolean))
    );
    const mergedClasses = Array.from(
      new Set([...selectedClasses, ...santriClasses])
    ).sort((a, b) => Number(a) - Number(b));

    if (mergedClasses.length > selectedClasses.length) {
      setSelectedClasses(mergedClasses);
      setValue("kelas", mergedClasses.join(", "), { shouldValidate: true });
    }
  };

  const handleRemoveSantri = (id: string) => {
    const next = selectedSantri.filter((s) => s.id !== id);
    setSelectedSantri(next);
    setValue(
      "santriIds",
      next.map((s) => s.id)
    );
  };

  const availableClasses = useMemo(() => {
    return kelasList.filter((k) => !selectedClasses.includes(k.nama));
  }, [kelasList, selectedClasses]);

  const santriClassCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const s of selectedSantri) {
      counts[s.kelas] = (counts[s.kelas] || 0) + 1;
    }
    return counts;
  }, [selectedSantri]);

  const isMixedSantri = Object.keys(santriClassCounts).length > 1;

  const handleFormSubmit = (data: HalaqohFormValues) => {
    onSubmit({
      ...data,
      kelas: selectedClasses.join(", "),
      santriIds: selectedSantri.map((s) => s.id),
    });
  };

  return (
    <div className="bg-surface rounded-lg border border-border/40 p-6 shadow-card space-y-6 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <FieldGroup>
          {/* Nama Halaqoh */}
          <Controller
            control={control}
            name="nama"
            render={({ field }) => (
              <Field>
                <FieldLabel>{t("halaqoh:form.namaLabel")}</FieldLabel>
                <Input placeholder={t("halaqoh:form.namaPlaceholder")} {...field} />
                <FieldError errors={[errors.nama]} />
              </Field>
            )}
          />

          {/* Program & Pengampu (GuruSelector) Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Controller
              control={control}
              name="program"
              render={({ field }) => (
                <Field>
                  <FieldLabel>{t("common:labels.program")}</FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("common:labels.program")} />
                    </SelectTrigger>
                    <SelectContent>
                      {programList.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError errors={[errors.program]} />
                </Field>
              )}
            />

            {/* Pengampu (GuruSelector) */}
            <Controller
              control={control}
              name="guruId"
              render={({ field }) => (
                <Field>
                  <FieldLabel>{t("halaqoh:card.guru")}</FieldLabel>
                  <GuruSelector
                    value={field.value}
                    onChange={(id, nama) => {
                      field.onChange(id);
                      setValue("guruNama", nama);
                    }}
                    guruList={guruList}
                    assignedGuruIds={assignedGuruIds}
                  />
                  <FieldError errors={[errors.guruId]} />
                </Field>
              )}
            />
          </div>

          {/* Kelas Pill Selector (Upwork Skill Badge Style) */}
          <Field>
            <FieldLabel>{t("common:labels.class")}</FieldLabel>
            <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-lg border border-border/60 bg-muted/20 min-h-[46px] transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
              {selectedClasses.map((k) => (
                <span
                  key={k}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/25 shadow-2xs transition-all animate-in fade-in zoom-in-95 duration-150"
                >
                  <span>{t("common:labels.class")} {k}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveKelas(k)}
                    className="text-primary/70 hover:text-destructive hover:bg-destructive/10 rounded-full p-0.5 transition-colors cursor-pointer"
                    title={`Hapus Kelas ${k}`}
                    aria-label={`Hapus Kelas ${k}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}

              {/* Add Class Dropdown Button (Upwork Style) */}
              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border border-dashed border-primary/40 text-primary hover:bg-primary/10 hover:border-primary transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary">
                  <Plus className="h-3.5 w-3.5" />
                  <span>{t("common:actions.add")} {t("common:labels.class")}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-44 p-1">
                  {availableClasses.length === 0 ? (
                    <div className="py-2 px-3 text-xs text-muted-foreground text-center">
                      Semua kelas telah dipilih
                    </div>
                  ) : (
                    availableClasses.map((k) => (
                      <DropdownMenuItem
                        key={k.id}
                        onClick={() => handleAddKelas(k.nama)}
                        className="cursor-pointer text-xs py-1.5 px-2.5 rounded-md hover:bg-primary/10 hover:text-primary transition-colors flex items-center justify-between"
                      >
                        <span>{t("common:labels.class")} {k.nama}</span>
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {selectedClasses.length === 0 && (
                <span className="text-xs text-muted-foreground italic ml-1">
                  Pilih minimal satu kelas...
                </span>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground">
              Pilih satu atau lebih kelas untuk kelompok ini. Target hafalan santri akan otomatis mengikuti kurikulum kelas asalnya masing-masing.
            </p>
            <FieldError errors={[errors.kelas]} />
          </Field>

          {/* Smart Mixed-Class Callout Alert */}
          {selectedClasses.length > 1 && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-primary/5 border border-primary/20 text-xs text-foreground animate-in fade-in duration-200">
              <Info className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
              <div className="space-y-0.5">
                <span className="font-semibold text-primary">
                  Kelompok Lintas Kelas ({selectedClasses.map((c) => `Kelas ${c}`).join(", ")})
                </span>
                <p className="text-muted-foreground leading-relaxed">
                  Kelompok ini memiliki santri dari beberapa kelas. Evaluasi target capaian juz dan kurikulum hafalan akan otomatis dihitung secara independen per kelas masing-masing santri.
                </p>
              </div>
            </div>
          )}
        </FieldGroup>

        {/* Daftar Santri Section */}
        <div className="space-y-3 border-t pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold text-foreground">{t("halaqoh:form.santriSection")}</h3>
              <p className="text-xs text-muted-foreground">
                {selectedSantri.length}/15 {t("halaqoh:card.santriUnit")}
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5 cursor-pointer"
              onClick={() => setTransferOpen(true)}
            >
              <Plus className="w-4 h-4" />
              {t("common:actions.add")} {t("halaqoh:card.santriUnit")}
            </Button>
          </div>

          {/* Santri Class Composition Badges */}
          {selectedSantri.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 p-2.5 rounded-md bg-muted/20 border border-border/40 text-xs">
              <span className="text-muted-foreground font-medium mr-1">Komposisi Santri:</span>
              {Object.entries(santriClassCounts).map(([kls, count]) => (
                <Badge
                  key={kls}
                  variant="outline"
                  className="text-[11px] font-medium px-2 py-0.5 border-border/60 bg-surface text-foreground"
                >
                  {count} Santri Kelas {kls}
                </Badge>
              ))}
              {isMixedSantri && (
                <Badge
                  variant="secondary"
                  className="text-[11px] font-semibold px-2 py-0.5 bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20"
                >
                  Campuran
                </Badge>
              )}
            </div>
          )}

          {/* Santri List Container */}
          <div className="border rounded-lg bg-muted/10 divide-y max-h-[300px] overflow-y-auto">
            {selectedSantri.length === 0 ? (
              <div className="flex items-center justify-center p-8 text-muted-foreground text-sm font-medium">
                -
              </div>
            ) : (
              selectedSantri.map((santri) => (
                <div
                  key={santri.id}
                  className="flex items-center justify-between p-3 bg-surface hover:bg-muted/10 transition-colors"
                >
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-semibold text-primary block leading-none">
                      {santri.nis}
                    </span>
                    <span className="font-semibold text-xs text-foreground block">
                      {santri.nama}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex gap-1 items-center">
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1.5 py-0 border-primary/20 text-primary bg-primary/5"
                      >
                        {t("common:labels.class")} {santri.kelas}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0 text-primary bg-primary/10"
                      >
                        {santri.program === "R" ? t("common:labels.programReguler") : t("common:labels.programTakhassus")}
                      </Badge>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive cursor-pointer"
                      onClick={() => handleRemoveSantri(santri.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="sr-only">{t("common:actions.delete")}</span>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Total Selected */}
          <div className="text-xs text-muted-foreground font-semibold">
            Total: {selectedSantri.length} {t("halaqoh:card.santriUnit")}
          </div>
        </div>

        {/* Form Action Buttons */}
        <div className="flex items-center justify-end gap-3 border-t pt-5">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting} className="cursor-pointer">
            <X className="w-4 h-4 mr-2" />
            {t("common:actions.cancel")}
          </Button>
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90 cursor-pointer"
            disabled={isSubmitting}
          >
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? t("common:actions.saving") : t("common:actions.save")}
          </Button>
        </div>
      </form>

      {/* Santri Transfer Dialog */}
      <SantriTransferList
        open={transferOpen}
        onOpenChange={setTransferOpen}
        allSantriList={allSantriList}
        alreadySelectedIds={selectedSantri.map((s) => s.id)}
        assignedToOtherIds={assignedSantriIds}
        onAddSantri={handleAddSantriFromDialog}
        defaultKelas={selectedClasses[0] || ""}
      />
    </div>
  );
}
