import { describe, it, expect } from "vitest";
import { 
  formatDate, 
  formatDateShort, 
  formatDateTime, 
  formatTahunAjaran 
} from "../date";

describe("Date Utilities", () => {
  it("should format Date object to Indonesian long date format", () => {
    const testDate = new Date(2026, 6, 24); // 24 July 2026
    expect(formatDate(testDate)).toBe("24 Juli 2026");
  });

  it("should format null or invalid date to dash", () => {
    expect(formatDate(null)).toBe("-");
    expect(formatDate(undefined)).toBe("-");
    expect(formatDate("invalid-date-string")).toBe("-");
  });

  it("should format short date dd/MM/yyyy", () => {
    const testDate = new Date(2026, 6, 8); // 8 July 2026
    expect(formatDateShort(testDate)).toBe("08/07/2026");
  });

  it("should format date time d MMMM yyyy, HH:mm", () => {
    const testDate = new Date(2026, 6, 24, 14, 30);
    expect(formatDateTime(testDate)).toBe("24 Juli 2026, 14:30");
  });

  it("should format academic year properly", () => {
    expect(formatTahunAjaran("2026/2027")).toBe("2026/2027");
    expect(formatTahunAjaran("2026")).toBe("2026/2027");
  });
});
