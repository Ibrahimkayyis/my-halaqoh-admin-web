import { describe, it, expect } from "vitest";
import { SantriFormSchema } from "../santri.schema";

describe("SantriFormSchema Validation", () => {
  it("should fail validation when NIS is empty", () => {
    const result = SantriFormSchema.safeParse({
      nis: "",
      nama: "Muhammad Ali",
      kelas: "7",
      program: "R",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("NIS wajib diisi");
    }
  });

  it("should fail validation when NIS exceeds 12 characters", () => {
    const result = SantriFormSchema.safeParse({
      nis: "1234567890123", // 13 chars
      nama: "Muhammad Ali",
      kelas: "7",
      program: "R",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("NIS maksimal 12 karakter");
    }
  });

  it("should fail validation when nama is empty", () => {
    const result = SantriFormSchema.safeParse({
      nis: "2024001",
      nama: "",
      kelas: "7",
      program: "R",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Nama wajib diisi");
    }
  });

  it("should fail validation when kelas is empty", () => {
    const result = SantriFormSchema.safeParse({
      nis: "2024001",
      nama: "Muhammad Ali",
      kelas: "",
      program: "R",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Pilih kelas");
    }
  });

  it("should fail validation when program is empty", () => {
    const result = SantriFormSchema.safeParse({
      nis: "2024001",
      nama: "Muhammad Ali",
      kelas: "7",
      program: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Pilih program");
    }
  });

  it("should pass validation with valid santri data and optional wali info", () => {
    const validData = {
      nis: "2024001",
      nama: "Muhammad Ali",
      kelas: "7",
      program: "R",
      namaWali: "Bapak Usman",
      phoneWali: "+6281234567",
      hubunganWali: "Ayah",
    };
    const result = SantriFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validData);
    }
  });
});
