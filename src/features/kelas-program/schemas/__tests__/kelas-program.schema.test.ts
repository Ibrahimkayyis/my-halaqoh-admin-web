import { describe, it, expect } from "vitest";
import { KelasFormSchema, ProgramFormSchema } from "../kelas-program.schema";

describe("Kelas and Program Form Schemas", () => {
  describe("KelasFormSchema", () => {
    it("should fail validation when nama is empty", () => {
      const result = KelasFormSchema.safeParse({
        nama: "",
        urutan: 1,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Nama kelas wajib diisi");
      }
    });

    it("should fail validation when urutan is less than 1", () => {
      const result = KelasFormSchema.safeParse({
        nama: "Kelas 7",
        urutan: 0,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Urutan harus minimal 1");
      }
    });

    it("should pass validation with valid kelas values", () => {
      const validData = {
        nama: "Kelas 7",
        urutan: 1,
        nextKelasId: "kelas-8",
      };
      const result = KelasFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });
  });

  describe("ProgramFormSchema", () => {
    it("should fail validation when program code (id) is empty", () => {
      const result = ProgramFormSchema.safeParse({
        id: "",
        nama: "Reguler",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Kode Program wajib diisi (contoh: R, T)");
      }
    });

    it("should fail validation when program nama is empty", () => {
      const result = ProgramFormSchema.safeParse({
        id: "R",
        nama: "",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Nama Program wajib diisi");
      }
    });

    it("should pass validation with valid program values", () => {
      const validData = {
        id: "R",
        nama: "Program Reguler",
      };
      const result = ProgramFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });
  });
});
