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
import { ProgramFormSchema, ProgramFormValues } from "../schemas/kelas-program.schema";
import { useCreateProgram, useUpdateProgram } from "../hooks/use-program";

interface ProgramFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: Partial<ProgramFormValues> & { id?: string };
}

export function ProgramFormDialog({ open, onOpenChange, defaultValues }: ProgramFormDialogProps) {
  const { t } = useTranslation(["kelasProgram", "common"]);
  const isEditing = !!defaultValues?.id;

  const { control, handleSubmit, reset, formState: { errors } } = useForm<ProgramFormValues>({
    resolver: zodResolver(ProgramFormSchema),
    defaultValues: {
      id: defaultValues?.id || "",
      nama: defaultValues?.nama || "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        id: defaultValues?.id || "",
        nama: defaultValues?.nama || "",
      });
    }
  }, [open, defaultValues, reset]);

  const createMutation = useCreateProgram();
  const updateMutation = useUpdateProgram();

  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (data: ProgramFormValues) => {
    if (isEditing && defaultValues?.id) {
      updateMutation.mutate(
        { id: defaultValues.id, data },
        {
          onSuccess: () => {
            reset();
            onOpenChange(false);
          },
        }
      );
    } else {
      createMutation.mutate(data, {
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
          <DialogTitle>{isEditing ? t("kelasProgram:program.editTitle") : t("kelasProgram:program.addTitle")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
          <FieldGroup>
            <Controller
              control={control}
              name="id"
              render={({ field }) => (
                <Field>
                  <FieldLabel>{t("kelasProgram:program.kodeLabel")}</FieldLabel>
                  <Input placeholder="e.g. R, T, atau TH" disabled={isEditing} {...field} />
                  <FieldError errors={[errors.id]} />
                </Field>
              )}
            />
            
            <Controller
              control={control}
              name="nama"
              render={({ field }) => (
                <Field>
                  <FieldLabel>{t("kelasProgram:program.namaLabel")}</FieldLabel>
                  <Input placeholder="e.g. Reguler, Takhassus" {...field} />
                  <FieldError errors={[errors.nama]} />
                </Field>
              )}
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
