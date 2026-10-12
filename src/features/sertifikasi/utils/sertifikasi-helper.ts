import type { SertifikasiTahfidz } from "../types/sertifikasi.types";

/**
 * Helper to safely extract epoch milliseconds from Firestore Timestamp, Date, string, or number.
 */
export function getTimestampMillis(val: unknown): number {
  if (!val) return 0;
  if (typeof (val as { toMillis?: () => number }).toMillis === "function") {
    return (val as { toMillis: () => number }).toMillis();
  }
  if (typeof (val as { toDate?: () => Date }).toDate === "function") {
    return (val as { toDate: () => Date }).toDate().getTime();
  }
  if (val instanceof Date) {
    return val.getTime();
  }
  if (typeof (val as { seconds?: number }).seconds === "number") {
    const s = val as { seconds: number; nanoseconds?: number };
    return s.seconds * 1000 + (s.nanoseconds ? Math.floor(s.nanoseconds / 1e6) : 0);
  }
  if (typeof val === "number") {
    return val;
  }
  if (typeof val === "string") {
    const parsed = new Date(val).getTime();
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

/**
 * Deduplicate passed sertifikasi records per Juz for a santri.
 *
 * Rules:
 * 1. Filter only records with status === "passed"
 * 2. Group by juz (1..30)
 * 3. If multiple passed records exist for the same Juz:
 *    - Compare score (nilai ?? 0): prefer higher score
 *    - If scores are equal: prefer the newer record based on updatedAt / completedAt / createdAt
 * 4. Return unique array sorted by juz number ascending.
 */
export function deduplicatePassedSertifikasi(
  items: SertifikasiTahfidz[]
): SertifikasiTahfidz[] {
  if (!items || items.length === 0) return [];

  const passedByJuz = new Map<number, SertifikasiTahfidz>();

  for (const item of items) {
    if (item.status !== "passed") continue;

    const existing = passedByJuz.get(item.juz);
    if (!existing) {
      passedByJuz.set(item.juz, item);
      continue;
    }

    const itemScore = item.nilai ?? 0;
    const existingScore = existing.nilai ?? 0;

    if (itemScore > existingScore) {
      passedByJuz.set(item.juz, item);
    } else if (itemScore === existingScore) {
      const itemTime =
        getTimestampMillis(item.updatedAt) ||
        getTimestampMillis(item.completedAt) ||
        getTimestampMillis(item.createdAt);
      const existingTime =
        getTimestampMillis(existing.updatedAt) ||
        getTimestampMillis(existing.completedAt) ||
        getTimestampMillis(existing.createdAt);

      if (itemTime > existingTime) {
        passedByJuz.set(item.juz, item);
      }
    }
  }

  return Array.from(passedByJuz.values()).sort((a, b) => a.juz - b.juz);
}
