export interface SurahJuzMapping {
  juz: number;
  ayat_start: number;
  ayat_end: number;
}

export interface SurahMeta {
  id: number;
  name: string;
  name_ar: string;
  ayat_count: number;
  juz_start: number;
  juz_mappings: SurahJuzMapping[];
}

export interface JuzSurahSegment {
  surah_id: number;
  ayat_start: number;
  ayat_end: number;
}

export interface JuzMeta {
  number: number;
  total_ayat: number;
  surahs: JuzSurahSegment[];
}

export interface QuranMetadata {
  meta: {
    total_surahs: number;
    total_juz: number;
    total_ayat: number;
    source: string;
    generated_for: string;
  };
  surahs: SurahMeta[];
  juz: JuzMeta[];
}

export interface JuzProgressResult {
  juzNumber: number;
  totalAyat: number;
  memorizedAyat: number;
  percentage: number;
  isComplete: boolean;
}

export interface SantriHafalanCalculation {
  santriId: string;
  completedJuzList: number[];
  completedJuzCount: number;
  totalMemorizedAyat: number;
  memorizedAyatInTarget: number;
  totalAyatInTarget: number;
  /** Granular verse progress percentage towards target juz (0 - 100) */
  progressPercentage: number;
  juzProgressMap: Map<number, JuzProgressResult>;
}
