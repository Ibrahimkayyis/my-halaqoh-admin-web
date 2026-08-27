import { describe, it, expect } from "vitest";
import {
  ScheduleFormSchema,
  RejectFormSchema,
  GradingFormSchema,
} from "../sertifikasi.schema";

describe("Sertifikasi Zod Schemas", () => {
  describe("ScheduleFormSchema", () => {
    it("should validate valid schedule payload", () => {
      const validData = {
        tanggalUjian: new Date("2026-09-01"),
        sesiUjian: "Pagi (08:00 - 09:30 WIB)",
        pengujiNama: "MUFTI ALFARUQI",
        pengujiId: "guru-123",
        catatanAdmin: "Di Masjid Lt. 2",
      };
      const result = ScheduleFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject missing required fields", () => {
      const invalidData = {
        sesiUjian: "",
        pengujiNama: "",
      };
      const result = ScheduleFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorPaths = result.error.issues.map((i) => i.path[0]);
        expect(errorPaths).toContain("tanggalUjian");
        expect(errorPaths).toContain("sesiUjian");
        expect(errorPaths).toContain("pengujiNama");
      }
    });
  });

  describe("RejectFormSchema", () => {
    it("should validate valid rejection payload", () => {
      const validData = {
        alasanPenolakan: "Hafalan belum mencapai standar kelancaran 100%.",
      };
      const result = RejectFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject empty reason", () => {
      const result = RejectFormSchema.safeParse({ alasanPenolakan: "" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("Alasan penolakan wajib diisi");
      }
    });
  });

  describe("GradingFormSchema", () => {
    it("should validate valid grading payload", () => {
      const validData = {
        nilai: 85,
        status: "passed",
        catatanPenguji: "Lancar, tajwid baik.",
      };
      const result = GradingFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject invalid nilai range or non-integer", () => {
      const invalidOver = GradingFormSchema.safeParse({
        nilai: 105,
        status: "passed",
      });
      expect(invalidOver.success).toBe(false);

      const invalidUnder = GradingFormSchema.safeParse({
        nilai: -5,
        status: "failed",
      });
      expect(invalidUnder.success).toBe(false);
    });

    it("should reject invalid status", () => {
      const result = GradingFormSchema.safeParse({
        nilai: 75,
        status: "unknown_status",
      });
      expect(result.success).toBe(false);
    });
  });
});
