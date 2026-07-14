"use client";

import { useEffect, useRef, useState } from "react";
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
import type { GuruDummy } from "./guru-table";

const GuruFormSchema = z.object({
  nip: z.string().min(1, "NIP wajib diisi").max(13, "NIP maksimal 13 karakter"),
  nama: z.string().min(1, "Nama wajib diisi"),
  program: z.string().min(1, "Pilih program"),
  phone: z.string().optional(),
});

type GuruFormValues = z.infer<typeof GuruFormSchema>;

interface GuruFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editData?: GuruDummy | null;
}

export function GuruFormDialog({ open, onOpenChange, editData }: GuruFormDialogProps) {
  const isEdit = !!editData;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<GuruFormValues>({
    resolver: zodResolver(GuruFormSchema),
    defaultValues: {
      nip: "",
      nama: "",
      program: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (editData) {
        reset({
          nip: editData.nip,
          nama: editData.nama,
          program: editData.program,
          phone: editData.phone || "",
        });
      } else {
        reset({
          nip: "",
          nama: "",
          program: "",
          phone: "",
        });
      }
      setPhotoPreview(null);
    }
  }, [open, editData, reset]);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: GuruFormValues) => {
    console.log("Submit guru:", data);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Data Guru" : "Tambah Guru Manual"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
          {/* Photo Upload */}
          <div className="flex justify-center mb-6">
            <div className="relative group cursor-pointer" onClick={handlePhotoClick}>
              <div className="w-24 h-24 rounded-full bg-muted border-2 border-dashed border-muted-foreground/30 flex items-center justify-center overflow-hidden">
                {photoPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-8 h-8 text-muted-foreground/50" />
                )}
              </div>
              <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-sm border-2 border-surface">
                <Camera className="w-4 h-4 text-primary-foreground" />
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>
          </div>

          <FieldGroup>
            <Controller
              control={control}
              name="nip"
              render={({ field }) => (
                <Field>
                  <FieldLabel>NIP</FieldLabel>
                  <Input 
                    placeholder="Nomor Induk Pegawai" 
                    maxLength={13}
                    inputMode="numeric"
                    disabled={isEdit}
                    {...field} 
                  />
                  <FieldError errors={[errors.nip]} />
                </Field>
              )}
            />

            <Controller
              control={control}
              name="nama"
              render={({ field }) => (
                <Field>
                  <FieldLabel>Nama Lengkap</FieldLabel>
                  <Input placeholder="Nama lengkap Ustadz / Ustadzah" {...field} />
                  <FieldError errors={[errors.nama]} />
                </Field>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Controller
                control={control}
                name="program"
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Program</FieldLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
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

              <Controller
                control={control}
                name="phone"
                render={({ field }) => (
                  <Field>
                    <FieldLabel>No. HP (Opsional)</FieldLabel>
                    <Input placeholder="Contoh: 08123456789" {...field} />
                    <FieldError errors={[errors.phone]} />
                  </Field>
                )}
              />
            </div>
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
