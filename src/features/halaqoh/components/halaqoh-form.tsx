"use client";

import { useEffect, useState } from "react";
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
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { Plus, Trash2, Save, X } from "lucide-react";
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
    }
  }, [initialValues, reset, allSantriList]);

  const handleAddSantriFromDialog = (newSelection: Santri[]) => {
    setSelectedSantri(newSelection);
    setValue(
      "santriIds",
      newSelection.map((s) => s.id)
    );
  };

  const handleRemoveSantri = (id: string) => {
    const next = selectedSantri.filter((s) => s.id !== id);
    setSelectedSantri(next);
    setValue(
      "santriIds",
      next.map((s) => s.id)
    );
  };

  const handleFormSubmit = (data: HalaqohFormValues) => {
    onSubmit({
      ...data,
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

          {/* Kelas & Program grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Controller
              control={control}
              name="kelas"
              render={({ field }) => (
                <Field>
                  <FieldLabel>{t("common:labels.class")}</FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("common:labels.class")} />
                    </SelectTrigger>
                    <SelectContent>
                      {kelasList.map((k) => (
                        <SelectItem key={k.id} value={k.nama}>
                          {t("common:labels.class")} {k.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError errors={[errors.kelas]} />
                </Field>
              )}
            />

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
          </div>

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
        </FieldGroup>

        {/* Daftar Santri Section */}
        <div className="space-y-3 border-t pt-6">
          <div className="flex items-center justify-between">
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
              className="flex items-center gap-1.5"
              onClick={() => setTransferOpen(true)}
            >
              <Plus className="w-4 h-4" />
              {t("common:actions.add")} {t("halaqoh:card.santriUnit")}
            </Button>
          </div>

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
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
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
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            <X className="w-4 h-4 mr-2" />
            {t("common:actions.cancel")}
          </Button>
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90"
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
      />
    </div>
  );
}
