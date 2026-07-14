import { z } from "zod";

export const GuruFormSchema = z.object({
  nip: z.string().min(1, "NIP wajib diisi").max(13, "NIP maksimal 13 karakter"),
  nama: z.string().min(1, "Nama wajib diisi"),
  program: z.string().min(1, "Pilih program"),
  phone: z.string().optional(),
});

export type GuruFormValues = z.infer<typeof GuruFormSchema>;
