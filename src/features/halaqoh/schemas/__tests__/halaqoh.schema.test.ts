import { describe, it, expect } from "vitest";
import { HalaqohFormSchema } from "../halaqoh.schema";

describe("Halaqoh Form Schema Validation", () => {
  it("should fail validation when nama halaqoh is empty", () => {
    const result = HalaqohFormSchema.safeParse({
      nama: "",
      kelas: "7",
      program: "R",
      guruId: "guru-123",
      guruNama: "Ustadz Ahmad",
      santriIds: [],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Nama halaqoh wajib diisi");
    }
  });

  it("should fail validation when kelas is empty", () => {
    const result = HalaqohFormSchema.safeParse({
      nama: "Halaqoh Abu Bakar",
      kelas: "",
      program: "R",
      guruId: "guru-123",
      guruNama: "Ustadz Ahmad",
      santriIds: [],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Pilih kelas");
    }
  });

  it("should fail validation when guruId is empty", () => {
    const result = HalaqohFormSchema.safeParse({
      nama: "Halaqoh Abu Bakar",
      kelas: "7",
      program: "R",
      guruId: "",
      guruNama: "Ustadz Ahmad",
      santriIds: [],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Pilih guru pengampu");
    }
  });

  it("should pass validation with valid halaqoh values", () => {
    const validData = {
      nama: "Halaqoh Abu Bakar",
      kelas: "7",
      program: "R" as const,
      guruId: "guru-123",
      guruNama: "Ustadz Ahmad",
      santriIds: ["s1", "s2"],
    };
    const result = HalaqohFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validData);
    }
  });
});
