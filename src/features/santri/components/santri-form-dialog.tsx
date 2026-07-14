"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { Camera } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Temporary schema for layout
const SantriFormSchema = z.object({
  nis: z.string().min(1, "NIS wajib diisi"),
  nama: z.string().min(1, "Nama wajib diisi"),
  kelas: z.string().min(1, "Pilih kelas"),
  program: z.string().min(1, "Pilih program"),
  namaWali: z.string().optional(),
  phoneWali: z.string().optional(),
});
type SantriFormValues = z.infer<typeof SantriFormSchema>;

interface SantriFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit?: boolean;
}

export function SantriFormDialog({ open, onOpenChange, isEdit = false }: SantriFormDialogProps) {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<SantriFormValues>({
    resolver: zodResolver(SantriFormSchema),
    defaultValues: {
      nis: "",
      nama: "",
      kelas: "",
      program: "",
      namaWali: "",
      phoneWali: "",
    },
  });

  const onSubmit = (data: SantriFormValues) => {
    console.log("Submit santri:", data);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Data Santri" : "Tambah Santri Manual"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
          {/* Photo Upload Placeholder */}
          <div className="flex justify-center mb-6">
            <div className="relative group cursor-pointer">
              <div className="w-24 h-24 rounded-full bg-muted border-2 border-dashed border-muted-foreground/30 flex items-center justify-center overflow-hidden">
                <Camera className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-sm border-2 border-surface">
                <Camera className="w-4 h-4 text-primary-foreground" />
              </div>
            </div>
          </div>

          <FieldGroup>
            <Controller
              control={control}
              name="nis"
              render={({ field }) => (
                <Field>
                  <FieldLabel>NIS</FieldLabel>
                  <Input placeholder="Nomor Induk Santri" {...field} />
                  <FieldError errors={[errors.nis]} />
                </Field>
              )}
            />

            <Controller
              control={control}
              name="nama"
              render={({ field }) => (
                <Field>
                  <FieldLabel>Nama Lengkap</FieldLabel>
                  <Input placeholder="Nama lengkap siswa" {...field} />
                  <FieldError errors={[errors.nama]} />
                </Field>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <Controller
                control={control}
                name="kelas"
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Kelas</FieldLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Kelas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">Kelas 7</SelectItem>
                        <SelectItem value="8">Kelas 8</SelectItem>
                        <SelectItem value="9">Kelas 9</SelectItem>
                        <SelectItem value="10">Kelas 10</SelectItem>
                        <SelectItem value="11">Kelas 11</SelectItem>
                        <SelectItem value="12">Kelas 12</SelectItem>
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
                    <FieldLabel>Program</FieldLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Program" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="R">Reguler</SelectItem>
                        <SelectItem value="T">Takhassus</SelectItem>
                      </SelectContent>
                    </Select>
                    <FieldError errors={[errors.program]} />
                  </Field>
                )}
              />
            </div>
          </FieldGroup>

          <Separator className="my-2" />

          {/* Wali Santri Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground">Data Wali Santri (Opsional)</h3>
            <FieldGroup>
              <Controller
                control={control}
                name="namaWali"
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Nama Wali</FieldLabel>
                    <Input placeholder="Nama orang tua/wali" {...field} />
                  </Field>
                )}
              />
              <Controller
                control={control}
                name="phoneWali"
                render={({ field }) => (
                  <Field>
                    <FieldLabel>No. Handphone Wali</FieldLabel>
                    <Input placeholder="Contoh: 08123456789" {...field} />
                  </Field>
                )}
              />
            </FieldGroup>
          </div>

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
