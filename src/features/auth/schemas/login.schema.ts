import { z } from "zod";

export const loginSchema = z.object({
  identifier: z.string().min(1, "NIP/NIS wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;