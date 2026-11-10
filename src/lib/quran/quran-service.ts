import rawQuranData from "./data/quran.json";
import type {
  QuranMetadata,
  JuzMeta,
  SurahMeta,
  SurahProgressResult,
  JuzProgressResult,
  SantriHafalanCalculation,
} from "./types";
import type { HafalanSantriDoc } from "@/lib/firestore/queries/kehadiran-santri.queries";

const quranData = rawQuranData as unknown as QuranMetadata;

const juzByNumberMap = new Map<number, JuzMeta>();
for (const j of quranData.juz) {
  juzByNumberMap.set(j.number, j);
}

const surahByIdMap = new Map<number, SurahMeta>();
for (const s of quranData.surahs) {
  surahByIdMap.set(s.id, s);
}

/**
 * Returns metadata for a specific Juz (1-30).
 */
export function getJuzMeta(juzNumber: number): JuzMeta | undefined {
  return juzByNumberMap.get(juzNumber);
}

/**
 * Returns total ayat in a specific Juz.
 */
export function getTotalAyatInJuz(juzNumber: number): number {
  return juzByNumberMap.get(juzNumber)?.total_ayat ?? 0;
}

/**
 * Returns total ayat for an array of Juz numbers.
 */
export function getTotalAyatForJuzList(juzNumbers: number[]): number {
  return juzNumbers.reduce((sum, n) => sum + getTotalAyatInJuz(n), 0);
}

/**
 * Returns metadata for a specific Surah (1-114).
 */
export function getSurahById(surahId: number): SurahMeta | undefined {
  return surahByIdMap.get(surahId);
}

/**
 * Returns the full ayat range (1..ayat_count) for a specific surah.
 */
export function getFullSurahRange(surahId: number): {
  surahId: number;
  ayatStart: number;
  ayatEnd: number;
} {
  const surah = surahByIdMap.get(surahId);
  return {
    surahId,
    ayatStart: 1,
    ayatEnd: surah?.ayat_count ?? 286,
  };
}

/**
 * Returns all surah segments (ayat ranges) covering a complete juz.
 */
export function getFullJuzRanges(
  juzNumber: number
): Array<{ surahId: number; ayatStart: number; ayatEnd: number }> {
  const juz = juzByNumberMap.get(juzNumber);
  if (!juz) return [];
  return juz.surahs.map((seg) => ({
    surahId: seg.surah_id,
    ayatStart: seg.ayat_start,
    ayatEnd: seg.ayat_end,
  }));
}

/**
 * Counts exact memorized ayat within [rangeStart, rangeEnd] using `memorizedAyats` Set.
 * Mirrors Mobile's `SurahProgress.countMemorizedInSubRange`.
 */
export function countMemorizedInSubRange(
  sp: SurahProgressResult,
  rangeStart: number,
  rangeEnd: number
): number {
  if (sp.memorizedAyat <= 0 || rangeStart > rangeEnd) return 0;
  if (sp.memorizedAyats.size > 0) {
    let count = 0;
    for (const ayat of sp.memorizedAyats) {
      if (ayat >= rangeStart && ayat <= rangeEnd) {
        count++;
      }
    }
    return count;
  }
  // Fallback sequential estimate only if memorizedAyats wasn't populated
  const memorizedLimit = sp.segmentStart + sp.memorizedAyat - 1;
  const actualStart = Math.max(rangeStart, sp.segmentStart);
  const actualEnd = Math.min(rangeEnd, memorizedLimit);
  return actualStart <= actualEnd ? actualEnd - actualStart + 1 : 0;
}

/**
 * Calculates complete and precise hafalan progress for a santri.
 * Merges overlapping verse ranges and validates whole Juz completeness against quran.json.
 *
 * @param santriId ID of the santri
 * @param records All hafalan records (Ziyadah & Muraja'ah)
 * @param targetJuzList List of target juz numbers for this santri (e.g. [30] or [24, 25, 26, 27, 28, 29, 30])
 */
export function calculateSantriHafalan(
  santriId: string,
  records: HafalanSantriDoc[],
  targetJuzList: number[] = []
): SantriHafalanCalculation {
  // 1. Filter only Ziyadah records for this santri
  const ziyadahRecords = records.filter(
    (r) => r.santriId === santriId && String(r.jenis || "").toLowerCase() === "ziyadah"
  );

  // 2. Group ranges by surahNumber (surahId)
  const rangesBySurah = new Map<number, Array<{ start: number; end: number }>>();
  for (const r of ziyadahRecords) {
    const sid = r.surahNumber;
    if (!sid || sid < 1 || sid > 114) continue;
    const start = Math.min(r.ayatMulai, r.ayatSelesai);
    const end = Math.max(r.ayatMulai, r.ayatSelesai);
    if (start <= 0 || end <= 0) continue;

    const existing = rangesBySurah.get(sid) ?? [];
    existing.push({ start, end });
    rangesBySurah.set(sid, existing);
  }

  // 3. Evaluate each Juz (1-30)
  const completedJuzList: number[] = [];
  const juzProgressMap = new Map<number, JuzProgressResult>();
  let totalMemorizedAyat = 0;

  for (const j of quranData.juz) {
    const surahProgressList: SurahProgressResult[] = [];
    let juzMemorized = 0;

    for (const seg of j.surahs) {
      const surahMeta = surahByIdMap.get(seg.surah_id);
      const surahSegInJuz =
        surahMeta?.juz_mappings.find((m) => m.juz === j.number) ?? {
          juz: j.number,
          ayat_start: seg.ayat_start,
          ayat_end: seg.ayat_end,
        };

      const ranges = rangesBySurah.get(seg.surah_id) ?? [];
      const memorizedAyatSet = new Set<number>();

      for (const r of ranges) {
        if (r.end < surahSegInJuz.ayat_start || r.start > surahSegInJuz.ayat_end) {
          continue;
        }
        const s = Math.max(r.start, surahSegInJuz.ayat_start);
        const e = Math.min(r.end, surahSegInJuz.ayat_end);
        for (let a = s; a <= e; a++) {
          memorizedAyatSet.add(a);
        }
      }

      juzMemorized += memorizedAyatSet.size;
      surahProgressList.push({
        surahId: seg.surah_id,
        surahName: surahMeta?.name ?? "",
        totalAyat: surahSegInJuz.ayat_end - surahSegInJuz.ayat_start + 1,
        memorizedAyat: memorizedAyatSet.size,
        memorizedAyats: memorizedAyatSet,
        segmentStart: surahSegInJuz.ayat_start,
        segmentEnd: surahSegInJuz.ayat_end,
      });
    }

    const isComplete = j.total_ayat > 0 && juzMemorized >= j.total_ayat;
    if (isComplete) {
      completedJuzList.push(j.number);
    }

    totalMemorizedAyat += juzMemorized;
    const rawPercentage =
      j.total_ayat > 0 ? Math.min(100, (juzMemorized / j.total_ayat) * 100) : 0;

    juzProgressMap.set(j.number, {
      juzNumber: j.number,
      totalAyat: j.total_ayat,
      memorizedAyat: juzMemorized,
      percentage: Math.round(rawPercentage),
      rawPercentage,
      isComplete,
      surahProgressList,
    });
  }

  // 4. Calculate progress percentage towards target juz (legacy summary fallback)
  let memorizedAyatInTarget = 0;
  let totalAyatInTarget = 0;

  if (targetJuzList.length > 0) {
    for (const jNum of targetJuzList) {
      const jMeta = juzByNumberMap.get(jNum);
      const jProg = juzProgressMap.get(jNum);
      if (jMeta) {
        totalAyatInTarget += jMeta.total_ayat;
        memorizedAyatInTarget += jProg?.memorizedAyat ?? 0;
      }
    }
  }

  let progressPercentage = 0;
  if (totalAyatInTarget > 0) {
    // Granular verse progress towards target juz
    progressPercentage = Math.min(
      100,
      Math.round((memorizedAyatInTarget / totalAyatInTarget) * 100)
    );
  } else if (targetJuzList.length > 0) {
    // Fallback to completed juz percentage if target verse total is not available
    progressPercentage = Math.min(
      100,
      Math.round((completedJuzList.length / targetJuzList.length) * 100)
    );
  }

  return {
    santriId,
    completedJuzList,
    completedJuzCount: completedJuzList.length,
    totalMemorizedAyat,
    memorizedAyatInTarget,
    totalAyatInTarget,
    progressPercentage,
    juzProgressMap,
  };
}
