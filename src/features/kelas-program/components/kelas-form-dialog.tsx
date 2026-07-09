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
import { KelasFormSchema, KelasFormValues } from "../schemas/kelas-program.schema";

interface KelasFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: Partial<KelasFormValues>;
}

export function KelasFormDialog({ open, onOpenChange, defaultValues }: KelasFormDialogProps) {
  const isEditing = !!defaultValues?.nama;

  const { control, handleSubmit, reset, watch, formState: { errors } } = useForm<KelasFormValues>({
    resolver: zodResolver(KelasFormSchema),
    defaultValues: defaultValues || {
      nama: "",
      urutan: 1,
      nextKelasId: "",
    },
  });

  const onSubmit = (data: KelasFormValues) => {
    console.log("Submit kelas:", data);
    // TODO: implement Firestore mutation
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Kelas" : "Tambah Kelas"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
          <FieldGroup>
            <Controller
              control={control}
              name="nama"
              render={({ field }) => (
                <Field>
                  <FieldLabel>Nama Kelas</FieldLabel>
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
                  <FieldLabel>Urutan Kelas</FieldLabel>
                  <Input 
                    type="number" 
                    placeholder="e.g. 7" 
                    {...field} 
                    onChange={e => {
                      const val = e.target.value;
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
                const urutanVal = watch("urutan");
                const nextVal = urutanVal ? `Kelas ${Number(urutanVal) + 1}` : "-";
                return (
                  <Field>
                    <FieldLabel>Kelas Selanjutnya (Otomatis)</FieldLabel>
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
              Batal
            </Button>
            <Button type="submit">Simpan</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
