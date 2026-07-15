import { z } from "zod";

export const HalaqohFormSchema = z.object({
  nama: z.string().min(1, "Nama halaqoh wajib diisi"),
  kelas: z.string().min(1, "Pilih kelas"),
  program: z.enum(["R", "T"]).refine((v) => v === "R" || v === "T", { message: "Pilih program" }),
  guruId: z.string().min(1, "Pilih guru pengampu"),
  guruNama: z.string().min(1),
  santriIds: z.array(z.string()),
});

export type HalaqohFormValues = z.infer<typeof HalaqohFormSchema>;
