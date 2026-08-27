import { z } from "zod";

// Schema for Scheduling & Approving Certification (pending -> scheduled)
export const ScheduleFormSchema = z.object({
  tanggalUjian: z.date(),
  sesiUjian: z.string().min(1, "Sesi ujian wajib dipilih"),
  pengujiNama: z.string().min(1, "Ustadz penguji wajib dipilih"),
  pengujiId: z.string().optional(),
  catatanAdmin: z.string().optional(),
});

export type ScheduleFormValues = z.infer<typeof ScheduleFormSchema>;

// Schema for Rejecting Certification (pending -> rejected)
export const RejectFormSchema = z.object({
  alasanPenolakan: z.string().min(1, "Alasan penolakan wajib diisi"),
});

export type RejectFormValues = z.infer<typeof RejectFormSchema>;

// Schema for Grading & Submitting Exam Results (scheduled -> passed / failed)
export const GradingFormSchema = z.object({
  nilai: z
    .number()
    .int("Nilai harus berupa bilangan bulat")
    .min(1, "Nilai minimal 1")
    .max(100, "Nilai maksimal 100"),
  status: z.enum(["passed", "failed"]),
  catatanPenguji: z.string().optional(),
});

export type GradingFormValues = z.infer<typeof GradingFormSchema>;
