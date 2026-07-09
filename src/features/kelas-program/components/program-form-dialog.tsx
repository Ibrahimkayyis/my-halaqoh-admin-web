"use client";

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

interface ProgramFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: Partial<ProgramFormValues>;
}

export function ProgramFormDialog({ open, onOpenChange, defaultValues }: ProgramFormDialogProps) {
  const isEditing = !!defaultValues?.id;

  const { control, handleSubmit, reset, formState: { errors } } = useForm<ProgramFormValues>({
    resolver: zodResolver(ProgramFormSchema),
    defaultValues: defaultValues || {
      id: "",
      nama: "",
    },
  });

  const onSubmit = (data: ProgramFormValues) => {
    console.log("Submit program:", data);
    // TODO: implement Firestore mutation
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Program" : "Tambah Program"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
          <FieldGroup>
            <Controller
              control={control}
              name="id"
              render={({ field }) => (
                <Field>
                  <FieldLabel>Kode Program</FieldLabel>
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
                  <FieldLabel>Nama Program</FieldLabel>
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
              Batal
            </Button>
            <Button type="submit">Simpan</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
