import { describe, it, expect, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useDashboardAbsentSantri } from "../use-dashboard-absent-santri";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

// Mock queries
vi.mock("@/lib/firestore/queries/kehadiran-santri.queries", () => ({
  getAbsensiByDateRange: vi.fn().mockResolvedValue([
    {
      id: "abs-1",
      halaqohId: "hal-1",
      guruId: "guru-1",
      tanggal: new Date("2026-08-03T05:00:00Z"),
      sesi: "shubuh",
      records: [
        { santriId: "s1", nis: "1001", nama: "Ahmad", status: "sakit" },
        { santriId: "s2", nis: "1002", nama: "Budi", status: "hadir" },
        { santriId: "s3", nis: "1003", nama: "Candra", status: "alfa" },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),
  subscribeAbsensiByDateRange: vi.fn(() => vi.fn()),
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

describe("useDashboardAbsentSantri Hook", () => {
  it("should extract absent santri (sakit, izin, alfa) for the given session", async () => {
    const { result } = renderHook(
      () => useDashboardAbsentSantri("R", new Date("2026-08-03"), "shubuh"),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.absentList).toHaveLength(2);
    expect(result.current.summary?.totalAbsent).toBe(2);
    expect(result.current.summary?.sakitCount).toBe(1);
    expect(result.current.summary?.alfaCount).toBe(1);
    expect(result.current.absentList[0].santriNama).toBe("Ahmad");
    expect(result.current.absentList[0].status).toBe("sakit");
  });
});
