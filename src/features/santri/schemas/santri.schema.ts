import { z } from "zod";

export const SantriFormSchema = z.object({
  nis: z.string().min(1, "NIS wajib diisi").max(12, "NIS maksimal 12 karakter"),
  nama: z.string().min(1, "Nama wajib diisi"),
  kelas: z.string().min(1, "Pilih kelas"),
  program: z.string().min(1, "Pilih program"),
  namaWali: z.string().optional(),
  phoneWali: z.string().optional(),
  hubunganWali: z.string().optional(), // "Ayah" | "Ibu" | "Wali"
});

export type SantriFormValues = z.infer<typeof SantriFormSchema>;
