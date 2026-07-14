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
import { Separator } from "@/components/ui/separator";

import { SantriFormSchema, type SantriFormValues } from "../schemas/santri.schema";
import { useCreateSantri, useUpdateSantri } from "../hooks/use-santri";
import { useGetKelas } from "@/features/kelas-program/hooks/use-kelas";
import { useGetProgram } from "@/features/kelas-program/hooks/use-program";
import { uploadSantriPhoto } from "@/lib/firebase/storage";
import type { Santri } from "../types/santri.types";

interface SantriFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editData?: Santri | null;
}

export function SantriFormDialog({ open, onOpenChange, editData }: SantriFormDialogProps) {
  const isEdit = !!editData;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const createMutation = useCreateSantri();
  const updateMutation = useUpdateSantri();
  const { data: kelasList = [] } = useGetKelas();
  const { data: programList = [] } = useGetProgram();

  const { control, handleSubmit, reset, formState: { errors } } = useForm<SantriFormValues>({
    resolver: zodResolver(SantriFormSchema),
    defaultValues: {
      nis: "",
      nama: "",
      kelas: "",
      program: "",
      namaWali: "",
      phoneWali: "",
      hubunganWali: "",
    },
  });

  // Reset form when dialog opens/closes or editData changes
  useEffect(() => {
    if (open) {
      if (editData) {
        reset({
          nis: editData.nis,
          nama: editData.nama,
          kelas: editData.kelas,
          program: editData.program,
          namaWali: editData.waliSantri?.nama || "",
          phoneWali: editData.waliSantri?.phone || "",
          hubunganWali: editData.waliSantri?.hubungan || "",
        });
        setPhotoPreview(editData.profilePicture || null);
      } else {
        reset({
          nis: "",
          nama: "",
          kelas: "",
          program: "",
          namaWali: "",
          phoneWali: "",
          hubunganWali: "",
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

  const onSubmit = async (data: SantriFormValues) => {
    setIsUploading(true);

    try {
      // Upload photo if selected
      let profilePictureUrl: string | null = editData?.profilePicture || null;
      if (photoFile) {
        profilePictureUrl = await uploadSantriPhoto(photoFile, data.nis);
      }

      // Build waliSantri object if any wali field is filled
      const waliSantri =
        data.namaWali || data.phoneWali || data.hubunganWali
          ? {
              nama: data.namaWali || "",
              phone: data.phoneWali || "",
              hubungan: data.hubunganWali || "Wali",
            }
          : null;

      if (isEdit && editData) {
        await updateMutation.mutateAsync({
          id: editData.id,
          data: {
            nis: data.nis,
            nama: data.nama,
            kelas: data.kelas,
            program: data.program,
            profilePicture: profilePictureUrl,
            waliSantri,
          },
        });
      } else {
        await createMutation.mutateAsync({
          nis: data.nis,
          nama: data.nama,
          kelas: data.kelas,
          program: data.program,
          profilePicture: profilePictureUrl,
          waliSantri,
        });
      }

      onOpenChange(false);
    } catch {
      // Error is handled by the mutation's onError callback
    } finally {
      setIsUploading(false);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending || isUploading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Data Santri" : "Tambah Santri Manual"}</DialogTitle>
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
              name="nis"
              render={({ field }) => (
                <Field>
                  <FieldLabel>NIS</FieldLabel>
                  <Input
                    placeholder="Nomor Induk Santri"
                    maxLength={12}
                    inputMode="numeric"
                    {...field}
                    disabled={isEdit} // NIS tidak bisa diubah saat edit
                  />
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
                  <Input placeholder="Nama lengkap santri" {...field} />
                  <FieldError errors={[errors.nama]} />
                </Field>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Controller
                control={control}
                name="kelas"
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Kelas</FieldLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Kelas" />
                      </SelectTrigger>
                      <SelectContent>
                        {kelasList.map((k) => (
                          <SelectItem key={k.id} value={k.nama}>
                            Kelas {k.nama}
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
              <Controller
                control={control}
                name="hubunganWali"
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Hubungan</FieldLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Hubungan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ayah">Ayah</SelectItem>
                        <SelectItem value="Ibu">Ibu</SelectItem>
                        <SelectItem value="Wali">Wali</SelectItem>
                      </SelectContent>
                    </Select>
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
