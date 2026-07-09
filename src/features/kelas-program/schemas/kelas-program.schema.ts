import { z } from "zod";

export const KelasFormSchema = z.object({
  nama: z.string().min(1, "Nama kelas wajib diisi"),
  urutan: z.number().min(1, "Urutan harus minimal 1"),
  nextKelasId: z.string().optional(),
});

export type KelasFormValues = z.infer<typeof KelasFormSchema>;

export const ProgramFormSchema = z.object({
  id: z.string().min(1, "Kode Program wajib diisi (contoh: R, T)"),
  nama: z.string().min(1, "Nama Program wajib diisi"),
});

export type ProgramFormValues = z.infer<typeof ProgramFormSchema>;
