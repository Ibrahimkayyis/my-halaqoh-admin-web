import { describe, it, expect } from "vitest";
import {
  deduplicatePassedSertifikasi,
  getTimestampMillis,
} from "../sertifikasi-helper";
import type { SertifikasiTahfidz } from "../../types/sertifikasi.types";
import { Timestamp } from "firebase/firestore";

describe("sertifikasi-helper", () => {
  describe("getTimestampMillis", () => {
    it("should extract milliseconds from Firestore Timestamp", () => {
      const now = new Date();
      const ts = Timestamp.fromDate(now);
      expect(getTimestampMillis(ts)).toBe(now.getTime());
    });

    it("should extract milliseconds from Date instance", () => {
      const date = new Date("2026-05-10T10:00:00Z");
      expect(getTimestampMillis(date)).toBe(date.getTime());
    });

    it("should return 0 for null/undefined/empty input", () => {
      expect(getTimestampMillis(null)).toBe(0);
      expect(getTimestampMillis(undefined)).toBe(0);
    });
  });

  describe("deduplicatePassedSertifikasi", () => {
    it("should return empty array when input is empty or null", () => {
      expect(deduplicatePassedSertifikasi([])).toEqual([]);
      expect(deduplicatePassedSertifikasi(null as any)).toEqual([]);
    });

    it("should ignore non-passed records (pending, scheduled, failed, rejected)", () => {
      const records: Partial<SertifikasiTahfidz>[] = [
        { id: "1", juz: 30, status: "pending" },
        { id: "2", juz: 30, status: "scheduled" },
        { id: "3", juz: 30, status: "failed" },
        { id: "4", juz: 30, status: "rejected" },
      ];

      const result = deduplicatePassedSertifikasi(records as SertifikasiTahfidz[]);
      expect(result).toEqual([]);
    });

    it("should keep distinct juz unchanged and sorted ascending", () => {
      const records: Partial<SertifikasiTahfidz>[] = [
        { id: "cert-30", juz: 30, status: "passed", nilai: 90 },
        { id: "cert-29", juz: 29, status: "passed", nilai: 88 },
        { id: "cert-28", juz: 28, status: "passed", nilai: 92 },
      ];

      const result = deduplicatePassedSertifikasi(records as SertifikasiTahfidz[]);
      expect(result).toHaveLength(3);
      expect(result.map((r) => r.juz)).toEqual([28, 29, 30]);
    });

    it("should deduplicate multiple passed records for the same Juz and pick higher score", () => {
      const records: Partial<SertifikasiTahfidz>[] = [
        {
          id: "cert-30-first",
          juz: 30,
          status: "passed",
          nilai: 75,
          updatedAt: Timestamp.fromMillis(1000),
        },
        {
          id: "cert-30-retest",
          juz: 30,
          status: "passed",
          nilai: 95,
          updatedAt: Timestamp.fromMillis(2000),
        },
      ];

      const result = deduplicatePassedSertifikasi(records as SertifikasiTahfidz[]);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("cert-30-retest");
      expect(result[0].nilai).toBe(95);
    });

    it("should keep higher score even if encountered first in array", () => {
      const records: Partial<SertifikasiTahfidz>[] = [
        {
          id: "cert-30-high",
          juz: 30,
          status: "passed",
          nilai: 96,
          updatedAt: Timestamp.fromMillis(1000),
        },
        {
          id: "cert-30-lower",
          juz: 30,
          status: "passed",
          nilai: 80,
          updatedAt: Timestamp.fromMillis(2000),
        },
      ];

      const result = deduplicatePassedSertifikasi(records as SertifikasiTahfidz[]);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("cert-30-high");
      expect(result[0].nilai).toBe(96);
    });

    it("should pick newer timestamp when scores are identical", () => {
      const records: Partial<SertifikasiTahfidz>[] = [
        {
          id: "cert-30-old",
          juz: 30,
          status: "passed",
          nilai: 85,
          updatedAt: Timestamp.fromMillis(1000),
        },
        {
          id: "cert-30-new",
          juz: 30,
          status: "passed",
          nilai: 85,
          updatedAt: Timestamp.fromMillis(5000),
        },
      ];

      const result = deduplicatePassedSertifikasi(records as SertifikasiTahfidz[]);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("cert-30-new");
    });
  });
});
