"use client";

import { useEffect, useRef, useState } from "react";
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { Camera, Loader2 } from "lucide-react";

import { GuruFormSchema, type GuruFormValues } from "../schemas/guru.schema";
import { useCreateGuru, useUpdateGuru } from "../hooks/use-guru";
import { useGetProgram } from "@/features/kelas-program/hooks/use-program";
import { uploadGuruPhoto } from "@/lib/firebase/storage";
import type { Guru } from "../types/guru.types";

interface GuruFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editData?: Guru | null;
}

export function GuruFormDialog({ open, onOpenChange, editData }: GuruFormDialogProps) {
  const isEdit = !!editData;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const createMutation = useCreateGuru();
  const updateMutation = useUpdateGuru();
  const { data: programList = [] } = useGetProgram();

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
        setPhotoPreview(editData.profilePicture || null);
      } else {
        reset({
          nip: "",
          nama: "",
          program: "",
          phone: "",
        });
        setPhotoPreview(null);
      }
      setPhotoFile(null);
    }
  }, [open, editData, reset]);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: GuruFormValues) => {
    setIsUploading(true);

    try {
      let profilePictureUrl: string | null = editData?.profilePicture || null;
      if (photoFile) {
        profilePictureUrl = await uploadGuruPhoto(photoFile, data.nip);
      }

      if (isEdit && editData) {
        await updateMutation.mutateAsync({
          id: editData.id,
          data: {
            nip: data.nip,
            nama: data.nama,
            program: data.program as "R" | "T",
            phone: data.phone || null,
            profilePicture: profilePictureUrl,
          },
        });
      } else {
        await createMutation.mutateAsync({
          nip: data.nip,
          nama: data.nama,
          program: data.program as "R" | "T",
          phone: data.phone || null,
          profilePicture: profilePictureUrl,
        });
      }

      onOpenChange(false);
    } catch (e) {
      console.error("Failed to submit guru form:", e);
    } finally {
      setIsUploading(false);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending || isUploading;

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
              disabled={isPending}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Simpan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
