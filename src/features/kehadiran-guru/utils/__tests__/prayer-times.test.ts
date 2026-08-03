import { describe, it, expect } from "vitest";
import {
  getPrayerTimesForDate,
  getSessionBoundaries,
  getCurrentSessionForProgram,
} from "../prayer-times";

describe("Prayer Times & Session Boundaries Utility", () => {
  it("should calculate valid prayer times for Surabaya", () => {
    const testDate = new Date("2026-08-03T10:00:00Z");
    const times = getPrayerTimesForDate(testDate);

    expect(times.fajr).toBeInstanceOf(Date);
    expect(times.dhuhr).toBeInstanceOf(Date);
    expect(times.asr).toBeInstanceOf(Date);
    expect(times.maghrib).toBeInstanceOf(Date);
    expect(times.isha).toBeInstanceOf(Date);
  });

  it("should return 2 boundaries for Reguler and 5 for Takhassus", () => {
    const testDate = new Date("2026-08-03T08:00:00");
    const reguler = getSessionBoundaries("R", testDate);
    const takhassus = getSessionBoundaries("T", testDate);

    expect(reguler).toHaveLength(2);
    expect(reguler.map((b) => b.sesi)).toEqual(["shubuh", "maghrib"]);

    expect(takhassus).toHaveLength(5);
    expect(takhassus.map((b) => b.sesi)).toEqual([
      "shubuh",
      "dhuha",
      "siang",
      "ashar",
      "maghrib",
    ]);
  });

  it("should calculate correct current session for Takhassus", () => {
    // 08:15 -> Dhuha (08:00 - 09:30)
    const dhuhaTime = new Date("2026-08-03T08:15:00");
    expect(getCurrentSessionForProgram("T", dhuhaTime)).toBe("dhuha");

    // 10:15 -> Siang (10:00 - 11:00)
    const siangTime = new Date("2026-08-03T10:15:00");
    expect(getCurrentSessionForProgram("T", siangTime)).toBe("siang");

    // 09:45 (gap between 09:30 and 10:00) -> returns previous session 'dhuha'
    const gapTime = new Date("2026-08-03T09:45:00");
    expect(getCurrentSessionForProgram("T", gapTime)).toBe("dhuha");
  });

  it("should calculate correct current session for Reguler", () => {
    // 08:00 -> Reguler only has shubuh and maghrib, so after shubuh ends (06:00) it returns shubuh until maghrib starts
    const morningTime = new Date("2026-08-03T08:00:00");
    expect(getCurrentSessionForProgram("R", morningTime)).toBe("shubuh");
  });

  // Additional boundary/edge scenarios
  it("Scenario 5: Exactly at start of Dhuha session (08:00:00)", () => {
    const exactStart = new Date("2026-08-03T08:00:00");
    expect(getCurrentSessionForProgram("T", exactStart)).toBe("dhuha");
  });

  it("Scenario 6: Exactly at end of Dhuha session (09:30:00)", () => {
    const exactEnd = new Date("2026-08-03T09:30:00");
    // At end boundary (gap start), returns last session fallback 'dhuha'
    expect(getCurrentSessionForProgram("T", exactEnd)).toBe("dhuha");
  });

  it("Scenario 7: Exactly at start of Siang session (10:00:00)", () => {
    const exactStart = new Date("2026-08-03T10:00:00");
    expect(getCurrentSessionForProgram("T", exactStart)).toBe("siang");
  });

  it("Scenario 8: Exactly at end of Siang session (11:00:00)", () => {
    const exactEnd = new Date("2026-08-03T11:00:00");
    expect(getCurrentSessionForProgram("T", exactEnd)).toBe("siang");
  });

  it("Scenario 9: After Isha time late at night (21:00)", () => {
    const lateNight = new Date("2026-08-03T21:00:00");
    expect(getCurrentSessionForProgram("T", lateNight)).toBe("maghrib");
    expect(getCurrentSessionForProgram("R", lateNight)).toBe("maghrib");
  });

  it("Scenario 10: Early morning before Shubuh (00:30 AM)", () => {
    const midnight = new Date("2026-08-03T00:30:00");
    expect(getCurrentSessionForProgram("R", midnight)).toBe("maghrib");
    expect(getCurrentSessionForProgram("T", midnight)).toBe("shubuh");
  });

  it("Scenario 11: Boundaries must be strictly chronological", () => {
    const boundaries = getSessionBoundaries("T", new Date("2026-08-03"));
    for (let i = 0; i < boundaries.length - 1; i++) {
      expect(boundaries[i].start.getTime()).toBeLessThan(boundaries[i + 1].start.getTime());
      expect(boundaries[i].start.getTime()).toBeLessThan(boundaries[i].end.getTime());
    }
  });
});
