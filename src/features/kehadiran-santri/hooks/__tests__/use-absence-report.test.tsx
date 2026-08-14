import { describe, it, expect, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useAbsenceReport } from "../use-absence-report";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

// Mock queries
vi.mock("@/lib/firestore/queries/kehadiran-santri.queries", () => ({
  getAbsensiByDateRange: vi.fn().mockResolvedValue([
    {
      id: "abs-1",
      halaqohId: "hal-1",
      guruId: "guru-1",
      tanggal: new Date("2026-08-01T05:00:00Z"),
      sesi: "shubuh",
      records: [
        { santriId: "s1", nis: "1001", nama: "Ahmad", status: "sakit" },
        { santriId: "s2", nis: "1002", nama: "Budi", status: "hadir" },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "abs-2",
      halaqohId: "hal-1",
      guruId: "guru-1",
      tanggal: new Date("2026-08-02T10:00:00Z"),
      sesi: "maghrib",
      records: [
        { santriId: "s3", nis: "1003", nama: "Candra", status: "alfa" },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),
}));

vi.mock("@/features/guru/hooks/use-guru", () => ({
  useGetGuru: () => ({
    data: [{ id: "guru-1", nama: "Ustadz Ali" }],
    isLoading: false,
  }),
}));

vi.mock("@/features/halaqoh/hooks/use-halaqoh", () => ({
  useGetHalaqoh: () => ({
    data: [{ id: "hal-1", nama: "Al-Fatih 1", kelas: "7", program: "R", guruNama: "Ustadz Ali" }],
    isLoading: false,
  }),
}));

vi.mock("@/features/santri/hooks/use-santri", () => ({
  useGetSantri: () => ({
    data: [
      { id: "s1", nama: "Ahmad", nis: "1001", kelas: "7", program: "R" },
      { id: "s2", nama: "Budi", nis: "1002", kelas: "7", program: "R" },
      { id: "s3", nama: "Candra", nis: "1003", kelas: "7", program: "R" },
    ],
    isLoading: false,
  }),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("useAbsenceReport Hook", () => {
  it("should process daily absence data for the date range", async () => {
    const { result } = renderHook(
      () =>
        useAbsenceReport(
          new Date("2026-08-01"),
          new Date("2026-08-02"),
          "all",
          true
        ),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.reportData).not.toBeNull();
    });

    const report = result.current.reportData!;
    expect(report.days).toHaveLength(2);
    expect(report.overallSummary.totalAbsences).toBe(2);
    expect(report.overallSummary.sakitTotal).toBe(1);
    expect(report.overallSummary.alfaTotal).toBe(1);

    // Day 1
    expect(report.days[0].summary.total).toBe(1);
    expect(report.days[0].absentList[0].santriNama).toBe("Ahmad");
    expect(report.days[0].absentList[0].sessions["shubuh"]).toBe("sakit");

    // Day 2
    expect(report.days[1].summary.total).toBe(1);
    expect(report.days[1].absentList[0].santriNama).toBe("Candra");
    expect(report.days[1].absentList[0].sessions["maghrib"]).toBe("alfa");
  });
});
