import { describe, it, expect } from "vitest";
import { ScheduleHelper } from "../schedule-helper";

describe("ScheduleHelper", () => {
  it("should return 11 sessions in a full Mon-Sun week for Reguler program", () => {
    // 2026-08-10 is Monday, 2026-08-16 is Sunday
    const start = new Date(2026, 7, 10);
    const end = new Date(2026, 7, 16);

    const totalReguler = ScheduleHelper.getTotalScheduledSessions(start, end, "R");
    expect(totalReguler).toBe(11);
  });

  it("should return 23 sessions in a full Mon-Sun week for Takhassus program", () => {
    // 2026-08-10 is Monday, 2026-08-16 is Sunday
    const start = new Date(2026, 7, 10);
    const end = new Date(2026, 7, 16);

    const totalTakhassus = ScheduleHelper.getTotalScheduledSessions(start, end, "T");
    expect(totalTakhassus).toBe(23);
  });

  it("should correctly identify weekday sessions for Reguler", () => {
    // Monday (day 1) -> shubuh, maghrib
    const mon = new Date(2026, 7, 10);
    expect(ScheduleHelper.getScheduledSessionsForDay(mon, "R")).toEqual(["shubuh", "maghrib"]);

    // Friday (day 5) -> maghrib
    const fri = new Date(2026, 7, 14);
    expect(ScheduleHelper.getScheduledSessionsForDay(fri, "R")).toEqual(["maghrib"]);

    // Sunday (day 0) -> shubuh
    const sun = new Date(2026, 7, 16);
    expect(ScheduleHelper.getScheduledSessionsForDay(sun, "R")).toEqual(["shubuh"]);
  });

  it("should correctly identify weekday sessions for Takhassus", () => {
    // Monday (day 1) -> 5 sessions
    const mon = new Date(2026, 7, 10);
    expect(ScheduleHelper.getScheduledSessionsForDay(mon, "T")).toEqual([
      "shubuh",
      "dhuha",
      "siang",
      "ashar",
      "maghrib",
    ]);

    // Friday (day 5) -> shubuh
    const fri = new Date(2026, 7, 14);
    expect(ScheduleHelper.getScheduledSessionsForDay(fri, "T")).toEqual(["shubuh"]);

    // Sunday (day 0) -> maghrib
    const sun = new Date(2026, 7, 16);
    expect(ScheduleHelper.getScheduledSessionsForDay(sun, "T")).toEqual(["maghrib"]);
  });
});
