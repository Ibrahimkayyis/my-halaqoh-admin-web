import { describe, it, expect } from "vitest";
import { GuruFormSchema } from "../guru.schema";

describe("Guru Form Schema Validation", () => {
  it("should fail when NIP is empty", () => {
    const result = GuruFormSchema.safeParse({
      nip: "",
      nama: "Ustadz Ahmad",
      program: "R",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("NIP wajib diisi");
    }
  });

  it("should fail when NIP exceeds 13 characters", () => {
    const result = GuruFormSchema.safeParse({
      nip: "12345678901234", // 14 chars
      nama: "Ustadz Ahmad",
      program: "R",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("NIP maksimal 13 karakter");
    }
  });

  it("should fail when nama is empty", () => {
    const result = GuruFormSchema.safeParse({
      nip: "1988050120150", // 13 chars
      nama: "",
      program: "R",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Nama wajib diisi");
    }
  });

  it("should fail when program is empty", () => {
    const result = GuruFormSchema.safeParse({
      nip: "1988050120150", // 13 chars
      nama: "Ustadz Ahmad",
      program: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Pilih program");
    }
  });

  it("should pass when valid inputs are provided with optional phone", () => {
    const result = GuruFormSchema.safeParse({
      nip: "1988050120150", // 13 chars
      nama: "Ustadz Ahmad",
      program: "R",
      phone: "+628123456789",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        nip: "1988050120150",
        nama: "Ustadz Ahmad",
        program: "R",
        phone: "+628123456789",
      });
    }
  });
});
