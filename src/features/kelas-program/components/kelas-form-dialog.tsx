"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
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

  const { control, handleSubmit, reset, watch, formState: { errors } } = useForm<KelasFormValues>({
    resolver: zodResolver(KelasFormSchema),
    defaultValues: defaultValues || {
      nama: "",
      urutan: 1,
      nextKelasId: "",
    },
  });

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
    const finalData = {
      nama: data.nama,
      urutan: data.urutan,
      nextKelasId: null,
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? t("kelasProgram:kelas.editTitle") : t("kelasProgram:kelas.addTitle")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
          <FieldGroup>
            <Controller
              control={control}
              name="nama"
              render={({ field }) => (
                <Field>
                  <FieldLabel>{t("kelasProgram:kelas.namaLabel")}</FieldLabel>
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
                  <FieldLabel>{t("kelasProgram:kelas.urutanLabel")}</FieldLabel>
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
              render={() => {
                const namaVal = watch("nama");
                const namaNum = parseInt(namaVal);
                const nextVal = !isNaN(namaNum) 
                  ? (namaNum >= 12 ? "Alumni" : `${t("common:labels.class")} ${namaNum + 1}`) 
                  : "-";
                return (
                  <Field>
                    <FieldLabel>{t("kelasProgram:kelas.nextKelasLabel")}</FieldLabel>
                    <Input 
                      readOnly 
                      disabled 
                      value={nextVal} 
                      className="bg-muted text-muted-foreground"
                    />
                  </Field>
                );
              }}
            />
          </FieldGroup>

          <div className="flex items-center justify-end gap-3 border-t pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              {t("common:actions.cancel")}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? t("common:actions.saving") : t("common:actions.save")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
