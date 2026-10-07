"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { KelasFormSchema, KelasFormValues } from "../schemas/kelas-program.schema";
import { useCreateKelas, useUpdateKelas } from "../hooks/use-kelas";

interface KelasFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: Partial<KelasFormValues> & { id?: string };
}

export function KelasFormDialog({ open, onOpenChange, defaultValues }: KelasFormDialogProps) {
  const { t } = useTranslation(["kelasProgram", "common"]);
  const isEditing = !!defaultValues?.nama;

  const { control, handleSubmit, reset, formState: { errors } } = useForm<KelasFormValues>({
    resolver: zodResolver(KelasFormSchema),
    defaultValues: defaultValues || {
      nama: "",
      urutan: 1,
      nextKelasId: "",
    },
  });

  const watchedNama = useWatch({ control, name: "nama" });
  const namaNum = parseInt(watchedNama || "", 10);
  const nextVal = !isNaN(namaNum)
    ? (namaNum >= 12 ? "Alumni" : `${t("common:labels.class")} ${namaNum + 1}`)
    : "-";

  useEffect(() => {
    if (open) {
      reset(defaultValues || {
        nama: "",
        urutan: 1,
        nextKelasId: "",
      });
    }
  }, [open, defaultValues, reset]);

  const createMutation = useCreateKelas();
  const updateMutation = useUpdateKelas();

  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (data: KelasFormValues) => {
    const num = parseInt(data.nama, 10);
    const calculatedNext = !isNaN(num) && num < 12 ? String(num + 1) : null;

    const finalData = {
      nama: data.nama,
      urutan: data.urutan,
      nextKelasId: calculatedNext,
    };

    if (isEditing && defaultValues?.id) {
      updateMutation.mutate(
        { id: defaultValues.id, data: finalData },
        {
          onSuccess: () => {
            reset();
            onOpenChange(false);
          },
        }
      );
    } else {
      createMutation.mutate(finalData, {
        onSuccess: () => {
          reset();
          onOpenChange(false);
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-[425px] max-h-[90vh] overflow-y-auto p-4 sm:p-6 rounded-xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? t("kelasProgram:form.editClassTitle") : t("kelasProgram:form.addClassTitle")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
          <FieldGroup>
            <Controller
              control={control}
              name="nama"
              render={({ field }) => (
                <Field>
                  <FieldLabel>{t("kelasProgram:form.namaKelasLabel")}</FieldLabel>
                  <Input placeholder="e.g. 13" {...field} />
                  <FieldError errors={[errors.nama]} />
                </Field>
              )}
            />
            
            <Controller
              control={control}
              name="urutan"
              render={({ field }) => (
                <Field>
                  <FieldLabel>{t("kelasProgram:form.urutanLabel")}</FieldLabel>
                  <Input 
                    type="text" 
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="e.g. 7" 
                    {...field} 
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, "");
                      field.onChange(val ? Number(val) : "");
                    }}
                  />
                  <FieldError errors={[errors.urutan]} />
                </Field>
              )}
            />

            <Controller
              control={control}
              name="nextKelasId"
              render={() => (
                <Field>
                  <FieldLabel>{t("kelasProgram:form.nextKelasLabel")}</FieldLabel>
                  <Input 
                    readOnly 
                    disabled 
                    value={nextVal} 
                    className="bg-muted text-muted-foreground"
                  />
                </Field>
              )}
            />
          </FieldGroup>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 border-t pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto h-9 sm:h-8 cursor-pointer"
            >
              {t("common:actions.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto h-9 sm:h-8 cursor-pointer font-medium"
            >
              {isPending ? t("common:actions.saving") : t("common:actions.save")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
