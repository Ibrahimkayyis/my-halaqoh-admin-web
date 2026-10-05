import rawQuranData from "./data/quran.json";
import type {
  QuranMetadata,
  JuzMeta,
  SurahMeta,
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
    let juzMemorized = 0;

    for (const seg of j.surahs) {
      const ranges = rangesBySurah.get(seg.surah_id);
      if (!ranges || ranges.length === 0) continue;

      const memorizedAyatSet = new Set<number>();
      for (const r of ranges) {
        const s = Math.max(r.start, seg.ayat_start);
        const e = Math.min(r.end, seg.ayat_end);
        if (s <= e) {
          for (let a = s; a <= e; a++) {
            memorizedAyatSet.add(a);
          }
        }
      }
      juzMemorized += memorizedAyatSet.size;
    }

    const isComplete = j.total_ayat > 0 && juzMemorized >= j.total_ayat;
    if (isComplete) {
      completedJuzList.push(j.number);
    }

    totalMemorizedAyat += juzMemorized;
    juzProgressMap.set(j.number, {
      juzNumber: j.number,
      totalAyat: j.total_ayat,
      memorizedAyat: juzMemorized,
      percentage: j.total_ayat > 0 ? Math.min(100, Math.round((juzMemorized / j.total_ayat) * 100)) : 0,
      isComplete,
    });
  }

  // 4. Calculate progress percentage towards target juz
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
