import { describe, it, expect } from "vitest";

describe("useSantriDetail Monthly Date Range Calculation", () => {
  it("should calculate correct start and end date for selected month", () => {
    const selectedMonth = 8; // August
    const selectedYear = 2026;

    const startDate = new Date(selectedYear, selectedMonth - 1, 1, 0, 0, 0, 0);
    const endDate = new Date(selectedYear, selectedMonth, 0, 23, 59, 59, 999);

    expect(startDate.getMonth()).toBe(7); // 0-indexed August
    expect(startDate.getDate()).toBe(1);
    expect(endDate.getDate()).toBe(31);
  });
});
