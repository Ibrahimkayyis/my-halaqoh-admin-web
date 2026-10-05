import { describe, it, expect } from "vitest";
import {
  getJuzMeta,
  getTotalAyatInJuz,
  getTotalAyatForJuzList,
  calculateSantriHafalan,
} from "../quran-service";
import type { HafalanSantriDoc } from "@/lib/firestore/queries/kehadiran-santri.queries";

describe("quran-service", () => {
  it("should return correct Juz metadata and verse counts", () => {
    const juz30 = getJuzMeta(30);
    expect(juz30).toBeDefined();
    expect(juz30?.number).toBe(30);
    expect(juz30?.total_ayat).toBe(564);

    const juz29 = getJuzMeta(29);
    expect(juz29?.total_ayat).toBe(431);

    expect(getTotalAyatInJuz(30)).toBe(564);
    expect(getTotalAyatForJuzList([29, 30])).toBe(431 + 564);
  });

  it("should NOT count 1 surah (An-Naba 1-40) as a completed Juz", () => {
    const record: HafalanSantriDoc = {
      id: "h1",
      santriId: "santri-1",
      juz: 30,
      surah: "An-Naba",
      surahNumber: 78,
      ayatMulai: 1,
      ayatSelesai: 40,
      jenis: "ziyadah",
      nilai: "A",
      nilaiKelancaran: 90,
      nilaiTajwid: 90,
      tanggalSetoran: new Date(),
      createdAt: new Date(),
    };

    // Target is 7 Juz (e.g. [24, 25, 26, 27, 28, 29, 30])
    const target7Juz = [24, 25, 26, 27, 28, 29, 30];
    const totalTargetAyat = getTotalAyatForJuzList(target7Juz);

    const result = calculateSantriHafalan("santri-1", [record], target7Juz);

    // Juz 30 has 564 verses, only 40 are done -> completedJuzCount must be 0!
    expect(result.completedJuzCount).toBe(0);
    expect(result.completedJuzList).toEqual([]);
    expect(result.totalMemorizedAyat).toBe(40);
    expect(result.memorizedAyatInTarget).toBe(40);
    expect(result.totalAyatInTarget).toBe(totalTargetAyat);

    // Progress percentage is 40 / totalTargetAyat * 100 (around 1%)
    const expectedPercentage = Math.round((40 / totalTargetAyat) * 100);
    expect(result.progressPercentage).toBe(expectedPercentage);

    const juz30Progress = result.juzProgressMap.get(30);
    expect(juz30Progress?.memorizedAyat).toBe(40);
    expect(juz30Progress?.isComplete).toBe(false);
  });

  it("should correctly mark Juz as complete when all verses in that Juz are memorized", () => {
    const juz30 = getJuzMeta(30)!;
    const fullJuz30Records: HafalanSantriDoc[] = juz30.surahs.map((seg, idx) => ({
      id: `h-j30-${idx}`,
      santriId: "santri-1",
      juz: 30,
      surah: `Surah-${seg.surah_id}`,
      surahNumber: seg.surah_id,
      ayatMulai: seg.ayat_start,
      ayatSelesai: seg.ayat_end,
      jenis: "ziyadah",
      nilai: "A",
      nilaiKelancaran: 95,
      nilaiTajwid: 95,
      tanggalSetoran: new Date(),
      createdAt: new Date(),
    }));

    const result = calculateSantriHafalan("santri-1", fullJuz30Records, [30]);

    expect(result.completedJuzCount).toBe(1);
    expect(result.completedJuzList).toEqual([30]);
    expect(result.totalMemorizedAyat).toBe(564);
    expect(result.memorizedAyatInTarget).toBe(564);
    expect(result.progressPercentage).toBe(100);

    const juz30Progress = result.juzProgressMap.get(30);
    expect(juz30Progress?.isComplete).toBe(true);
    expect(juz30Progress?.percentage).toBe(100);
  });

  it("should deduplicate overlapping verses within the same surah", () => {
    const overlappingRecords: HafalanSantriDoc[] = [
      {
        id: "h1",
        santriId: "santri-1",
        juz: 30,
        surah: "An-Naba",
        surahNumber: 78,
        ayatMulai: 1,
        ayatSelesai: 20,
        jenis: "ziyadah",
        nilai: "A",
        nilaiKelancaran: 85,
        nilaiTajwid: 85,
        tanggalSetoran: new Date(),
        createdAt: new Date(),
      },
      {
        id: "h2",
        santriId: "santri-1",
        juz: 30,
        surah: "An-Naba",
        surahNumber: 78,
        ayatMulai: 15,
        ayatSelesai: 40,
        jenis: "ziyadah",
        nilai: "A",
        nilaiKelancaran: 85,
        nilaiTajwid: 85,
        tanggalSetoran: new Date(),
        createdAt: new Date(),
      },
    ];

    const result = calculateSantriHafalan("santri-1", overlappingRecords, [30]);

    // 1..20 and 15..40 covers 1..40 -> exactly 40 unique verses, NOT 46
    expect(result.totalMemorizedAyat).toBe(40);
  });

  it("should ignore Muraja'ah records for progress calculation", () => {
    const records: HafalanSantriDoc[] = [
      {
        id: "h1",
        santriId: "santri-1",
        juz: 30,
        surah: "An-Naba",
        surahNumber: 78,
        ayatMulai: 1,
        ayatSelesai: 40,
        jenis: "murajaah", // Should be ignored
        nilai: "A",
        nilaiKelancaran: 85,
        nilaiTajwid: 85,
        tanggalSetoran: new Date(),
        createdAt: new Date(),
      },
    ];

    const result = calculateSantriHafalan("santri-1", records, [30]);

    expect(result.totalMemorizedAyat).toBe(0);
    expect(result.completedJuzCount).toBe(0);
    expect(result.progressPercentage).toBe(0);
  });
});
