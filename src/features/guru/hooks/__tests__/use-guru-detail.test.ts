import { describe, it, expect } from "vitest";

describe("Guru Detail Attendance Stats Calculations", () => {
  it("should calculate correct date range for 30 days preset", () => {
    const end = new Date(2026, 7, 14, 23, 59, 59, 999); // Aug 14, 2026
    const start = new Date(2026, 7, 14, 0, 0, 0, 0);
    start.setDate(end.getDate() - 29);

    expect(start.getMonth()).toBe(6); // July
    expect(start.getDate()).toBe(16);
    expect(end.getDate()).toBe(14);
  });

  it("should calculate correct date range for thisMonth preset", () => {
    const end = new Date(2026, 7, 14, 23, 59, 59, 999);
    const start = new Date(2026, 7, 14, 0, 0, 0, 0);
    start.setDate(1);

    expect(start.getMonth()).toBe(7); // August
    expect(start.getDate()).toBe(1);
  });
});
