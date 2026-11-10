import { describe, it, expect } from "vitest";
import {
  getCumulativeTargetJuzList,
  getTargetJuzCount,
  getTargetJuzCountDouble,
  getTargetJuzList,
  getCompletedJuzCountDouble,
  getCompletedFractionForRanges,
  calculateProgressTowardTarget,
  formatDecimalMax2,
  formatJuz,
  formatPercent,
} from "../target-hafalan-helper";
import { calculateSantriHafalan, getJuzMeta } from "@/lib/quran/quran-service";
import type { HafalanSantriDoc } from "@/lib/firestore/queries/kehadiran-santri.queries";

describe("TargetHafalanHelper Cumulative Calculation", () => {
  describe("Program Reguler (R)", () => {
    it("Kelas 7 Sem 1 should have 1 target juz (Juz 30)", () => {
      const list = getCumulativeTargetJuzList("7", "R", 1);
      expect(list).toEqual([30]);
      expect(list.length).toBe(1);
    });

    it("Kelas 7 Sem 2 should have 2 target juz (Juz 29, 30)", () => {
      const list = getCumulativeTargetJuzList("7", "R", 2);
      expect(list).toEqual([29, 30]);
      expect(list.length).toBe(2);
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

    it("should return 0 target and [] list when semesterAktif is null or targetModel is null (synced with Mobile)", () => {
      const nullSemModel = {
        id: "8_Reguler",
        kelas: "8",
        program: "R" as const,
        tahunAjaran: "2026 / 2027",
        semesterAktif: null,
      };
      expect(getTargetJuzCount(nullSemModel, "8", "R")).toBe(0);
      expect(getTargetJuzCountDouble(nullSemModel, "8", "R")).toBe(0);
      expect(getTargetJuzList(nullSemModel, "8", "R")).toEqual([]);
      expect(getTargetJuzCount(null, "8", "R")).toBe(0);
      expect(getTargetJuzList(undefined, "8", "R")).toEqual([]);
    });
  });

  describe("Decimal Formatting — formatDecimalMax2", () => {
    it("should render integers cleanly without decimal points", () => {
      expect(formatDecimalMax2(0)).toBe("0");
      expect(formatDecimalMax2(1)).toBe("1");
      expect(formatDecimalMax2(6.0)).toBe("6");
      expect(formatDecimalMax2(15.0)).toBe("15");
      expect(formatDecimalMax2(100.0)).toBe("100");
    });

    it("should truncate up to 2 decimal places without unwanted rounding up", () => {
      expect(formatDecimalMax2(1.46)).toBe("1.46");
      expect(formatDecimalMax2(1.464)).toBe("1.46");
      expect(formatDecimalMax2(1.469)).toBe("1.46");
      expect(formatDecimalMax2(1.5)).toBe("1.5");
      expect(formatDecimalMax2(1.50)).toBe("1.5");
      expect(formatDecimalMax2(5.967479)).toBe("5.96");
      expect(formatDecimalMax2(39.78319)).toBe("39.78");
      expect(formatJuz(5.9674)).toBe("5.96");
      expect(formatPercent(39.7831)).toBe("39.78");
    });
  });

  describe("Mobile-Synced Multi-Juz & Sub-Range Progress Calculations", () => {
    function buildFullJuzRecords(santriId: string, juzNums: number[]): HafalanSantriDoc[] {
      const records: HafalanSantriDoc[] = [];
      for (const jNum of juzNums) {
        const juz = getJuzMeta(jNum)!;
        juz.surahs.forEach((seg, idx) => {
          records.push({
            id: `r-${santriId}-j${jNum}-${idx}`,
            santriId,
            juz: jNum,
            surah: `Surah-${seg.surah_id}`,
            surahNumber: seg.surah_id,
            ayatMulai: seg.ayat_start,
            ayatSelesai: seg.ayat_end,
            jenis: "ziyadah",
            nilai: "A",
            nilaiKelancaran: 90,
            nilaiTajwid: 90,
            tanggalSetoran: new Date(),
            createdAt: new Date(),
          });
        });
      }
      return records;
    }

    it("Real Case (Ezar, Class 12 Takhassus Sem 1): Juz 26-30 complete + Juz 25 missing Fussilat 47-54 -> 5.96 / 15 Juz & 39.78%", () => {
      const targetModel = {
        id: "12_Takhassus",
        kelas: "12",
        program: "T" as const,
        tahunAjaran: "2026 / 2027",
        semesterAktif: 1 as const,
      };

      const records: HafalanSantriDoc[] = [
        ...buildFullJuzRecords("ezar", [30, 29, 28, 27, 26]),
      ];

      // Juz 25 without Surah 41 (Fussilat 47-54) -> 238/246 ayat
      const juz25 = getJuzMeta(25)!;
      juz25.surahs
        .filter((seg) => seg.surah_id !== 41)
        .forEach((seg, idx) => {
          records.push({
            id: `r-ezar-j25-${idx}`,
            santriId: "ezar",
            juz: 25,
            surah: `Surah-${seg.surah_id}`,
            surahNumber: seg.surah_id,
            ayatMulai: seg.ayat_start,
            ayatSelesai: seg.ayat_end,
            jenis: "ziyadah",
            nilai: "A",
            nilaiKelancaran: 90,
            nilaiTajwid: 90,
            tanggalSetoran: new Date(),
            createdAt: new Date(),
          });
        });

      const calc = calculateSantriHafalan("ezar", records);
      const summary = calculateProgressTowardTarget(targetModel, "12", "T", calc);

      expect(summary.juzTarget).toBe(15);
      expect(summary.juzCompleted).toBeCloseTo(5 + 238 / 246, 4);
      expect(summary.formattedJuzCompleted).toBe("5.96");
      expect(summary.formattedJuzTarget).toBe("15");
      expect(summary.formattedPercentage).toBe("39.78");
      expect(summary.isAchieved).toBe(false);
      expect(summary.memorizedAyatInTarget).toBe(1964);
      expect(summary.totalAyatInTarget).toBe(4022);

      // Completing Fussilat 47-54 makes Juz 25 full -> 6 / 15 Juz & 40%
      records.push({
        id: "r-ezar-j25-fussilat",
        santriId: "ezar",
        juz: 25,
        surah: "Fussilat",
        surahNumber: 41,
        ayatMulai: 47,
        ayatSelesai: 54,
        jenis: "ziyadah",
        nilai: "A",
        nilaiKelancaran: 90,
        nilaiTajwid: 90,
        tanggalSetoran: new Date(),
        createdAt: new Date(),
      });

      const calcFull = calculateSantriHafalan("ezar", records);
      const summaryFull = calculateProgressTowardTarget(targetModel, "12", "T", calcFull);
      expect(summaryFull.juzCompleted).toBeCloseTo(6.0, 4);
      expect(summaryFull.formattedJuzCompleted).toBe("6");
      expect(summaryFull.formattedPercentage).toBe("40");
    });

    it("Reguler Class 8 Sem 2 (Juz 1 target Al-Baqarah 1-141 without Al-Fatihah) achieves full 4 Juz (100%)", () => {
      const targetModel = {
        id: "8_Reguler",
        kelas: "8",
        program: "R" as const,
        tahunAjaran: "2026 / 2027",
        semesterAktif: 2 as const,
      };

      const records: HafalanSantriDoc[] = [
        ...buildFullJuzRecords("reg8", [30, 29, 28]),
        {
          id: "r-reg8-baqarah",
          santriId: "reg8",
          juz: 1,
          surah: "Al-Baqarah",
          surahNumber: 2,
          ayatMulai: 1,
          ayatSelesai: 141,
          jenis: "ziyadah",
          nilai: "A",
          nilaiKelancaran: 90,
          nilaiTajwid: 90,
          tanggalSetoran: new Date(),
          createdAt: new Date(),
        },
      ];

      const calc = calculateSantriHafalan("reg8", records);
      const summary = calculateProgressTowardTarget(targetModel, "8", "R", calc);

      expect(summary.juzTarget).toBe(4);
      expect(summary.juzCompleted).toBeCloseTo(4.0, 4);
      expect(summary.formattedJuzCompleted).toBe("4");
      expect(summary.formattedPercentage).toBe("100");
      expect(summary.isAchieved).toBe(true);
    });

    it("Out-of-order sub-range memorization (Al-Baqarah 203-252 before 142-202) counts exact sub-range", () => {
      const calc = calculateSantriHafalan("s1", [
        {
          id: "r-uas",
          santriId: "s1",
          juz: 2,
          surah: "Al-Baqarah",
          surahNumber: 2,
          ayatMulai: 203,
          ayatSelesai: 252,
          jenis: "ziyadah",
          nilai: "A",
          nilaiKelancaran: 90,
          nilaiTajwid: 90,
          tanggalSetoran: new Date(),
          createdAt: new Date(),
        },
      ]);

      const utsFraction = getCompletedFractionForRanges(
        [{ surahId: 2, ayatStart: 142, ayatEnd: 202 }],
        calc.juzProgressMap
      );
      const uasFraction = getCompletedFractionForRanges(
        [{ surahId: 2, ayatStart: 203, ayatEnd: 252 }],
        calc.juzProgressMap
      );

      expect(utsFraction).toBeCloseTo(0.0, 4);
      expect(uasFraction).toBeCloseTo(1.0, 4);
    });

    it("Class 11 Takhassus unequal multi-juz period [27, 26]: completing 1 juz always equals 1.0 weight", () => {
      const targetModel = {
        id: "11_Takhassus",
        kelas: "11",
        program: "T" as const,
        tahunAjaran: "2026 / 2027",
        semesterAktif: 1 as const,
      };

      const onlyJuz27 = buildFullJuzRecords("s11", [30, 29, 28, 27]);
      const onlyJuz26 = buildFullJuzRecords("s11", [30, 29, 28, 26]);

      const res27 = getCompletedJuzCountDouble(
        targetModel,
        "11",
        "T",
        calculateSantriHafalan("s11", onlyJuz27).juzProgressMap
      );
      const res26 = getCompletedJuzCountDouble(
        targetModel,
        "11",
        "T",
        calculateSantriHafalan("s11", onlyJuz26).juzProgressMap
      );

      expect(res27).toBeCloseTo(4.0, 4);
      expect(res26).toBeCloseTo(4.0, 4);
    });
  });
});
