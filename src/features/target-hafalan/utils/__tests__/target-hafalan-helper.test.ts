import { describe, it, expect } from "vitest";
import {
  getCumulativeTargetJuzList,
  getTargetJuzCount,
  getTargetJuzList,
} from "../target-hafalan-helper";

describe("TargetHafalanHelper Cumulative Calculation", () => {
  describe("Program Reguler (R)", () => {
    it("Kelas 7 Sem 1 should have 0 target juz (I'dad Tahsin)", () => {
      const list = getCumulativeTargetJuzList("7", "R", 1);
      expect(list).toEqual([]);
      expect(list.length).toBe(0);
    });

    it("Kelas 7 Sem 2 should have 1 target juz (Juz 30)", () => {
      const list = getCumulativeTargetJuzList("7", "R", 2);
      expect(list).toEqual([30]);
      expect(list.length).toBe(1);
    });

    it("Kelas 8 Sem 1 should have 3 target juz (Juz 28, 29, 30)", () => {
      const list = getCumulativeTargetJuzList("8", "R", 1);
      expect(list).toEqual([28, 29, 30]);
      expect(list.length).toBe(3);
    });

    it("Kelas 8 Sem 2 should have 4 target juz (Juz 1, 28, 29, 30)", () => {
      const list = getCumulativeTargetJuzList("8", "R", 2);
      expect(list).toEqual([1, 28, 29, 30]);
      expect(list.length).toBe(4);
    });

    it("Kelas 9 Sem 1 should have 5 target juz (Juz 1, 2, 28, 29, 30)", () => {
      const list = getCumulativeTargetJuzList("9", "R", 1);
      expect(list).toEqual([1, 2, 28, 29, 30]);
      expect(list.length).toBe(5);
    });

    it("Kelas 9 Sem 2 should have 5 target juz (Muraja'ah 5 Juz)", () => {
      const list = getCumulativeTargetJuzList("9", "R", 2);
      expect(list).toEqual([1, 2, 28, 29, 30]);
      expect(list.length).toBe(5);
    });
  });

  describe("Program Takhassus (T)", () => {
    it("Kelas 7 SMP Sem 1 should have 1 target juz (Juz 30)", () => {
      const list = getCumulativeTargetJuzList("7", "T", 1);
      expect(list).toEqual([30]);
      expect(list.length).toBe(1);
    });

    it("Kelas 7 SMP Sem 2 should have 3 target juz (Juz 28, 29, 30)", () => {
      const list = getCumulativeTargetJuzList("7", "T", 2);
      expect(list).toEqual([28, 29, 30]);
      expect(list.length).toBe(3);
    });

    it("Kelas 8 SMP Sem 1 should have 5 target juz (Juz 26, 27, 28, 29, 30)", () => {
      const list = getCumulativeTargetJuzList("8", "T", 1);
      expect(list).toEqual([26, 27, 28, 29, 30]);
      expect(list.length).toBe(5);
    });

    it("Kelas 8 SMP Sem 2 should have 7 target juz (Juz 24..30)", () => {
      const list = getCumulativeTargetJuzList("8", "T", 2);
      expect(list).toEqual([24, 25, 26, 27, 28, 29, 30]);
      expect(list.length).toBe(7);
    });

    it("Kelas 9 SMP Sem 1 should have 10 target juz (Juz 21..30)", () => {
      const list = getCumulativeTargetJuzList("9", "T", 1);
      expect(list).toEqual([21, 22, 23, 24, 25, 26, 27, 28, 29, 30]);
      expect(list.length).toBe(10);
    });

    it("Kelas 9 SMP Sem 2 (UAT) should maintain 10 target juz", () => {
      const list = getCumulativeTargetJuzList("9", "T", 2);
      expect(list.length).toBe(10);
    });

    it("Kelas 11 SMA Sem 2 should have 11 target juz (Juz 20..30)", () => {
      const list = getCumulativeTargetJuzList("11", "T", 2);
      expect(list.length).toBe(11);
    });

    it("Kelas 12 SMA Sem 1 should have 15 target juz (Juz 16..30)", () => {
      const list = getCumulativeTargetJuzList("12", "T", 1);
      expect(list.length).toBe(15);
    });
  });

  describe("getTargetJuzCount & getTargetJuzList with TargetHafalan model", () => {
    it("should calculate target for Kelas 8 Reguler with semesterAktif: 2", () => {
      const mockModel = {
        id: "8_Reguler",
        kelas: "8",
        program: "R" as const,
        tahunAjaran: "2026 / 2027",
        semesterAktif: 2 as const,
      };

      expect(getTargetJuzCount(mockModel, "8", "R")).toBe(4);
      expect(getTargetJuzList(mockModel, "8", "R")).toEqual([1, 28, 29, 30]);
    });
  });
});
