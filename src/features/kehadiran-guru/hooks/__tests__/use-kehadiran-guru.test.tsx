import { describe, it, expect, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { getCurrentSession, useProgramKehadiranGuru } from "../use-kehadiran-guru";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

// Mock queries
vi.mock("@/lib/firestore/queries/kehadiran-guru.queries", () => ({
  getAbsensiByDateRange: vi.fn().mockResolvedValue([
    {
      id: "abs-1",
      halaqohId: "hal-1",
      guruId: "guru-1",
      tanggal: new Date("2026-07-29T05:00:00Z"),
      sesi: "shubuh",
      createdAt: new Date("2026-07-29T05:10:00Z"),
    },
  ]),
  subscribeGuruAbsensiByDateRange: vi.fn(() => vi.fn()),
}));

vi.mock("@/features/guru/hooks/use-guru", () => ({
  useGetGuru: () => ({
    data: [
      {
        id: "guru-1",
        nip: "1234567890123",
        nama: "Ustadz Ahmad",
        program: "R",
        createdAt: { toDate: () => new Date() },
        updatedAt: { toDate: () => new Date() },
      },
      {
        id: "guru-2",
        nip: "1234567890124",
        nama: "Ustadz Mahmud",
        program: "T",
        createdAt: { toDate: () => new Date() },
        updatedAt: { toDate: () => new Date() },
      },
    ],
    isLoading: false,
  }),
}));

vi.mock("@/features/halaqoh/hooks/use-halaqoh", () => ({
  useGetHalaqoh: () => ({
    data: [
      {
        id: "hal-1",
        nama: "Al-Fatih 1",
        kelas: "7",
        program: "R",
        guruId: "guru-1",
        guruNama: "Ustadz Ahmad",
        santriIds: [],
        jumlahSantri: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    isLoading: false,
  }),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("useProgramKehadiranGuru Hook & Session Helpers", () => {
  it("should calculate current session correctly based on time and program", () => {
    // 05:30 -> Shubuh
    const morningDate = new Date("2026-07-29T05:30:00");
    expect(getCurrentSession(morningDate, "T")).toBe("shubuh");

    // 08:30 -> Dhuha
    const dhuhaDate = new Date("2026-07-29T08:30:00");
    expect(getCurrentSession(dhuhaDate, "T")).toBe("dhuha");

    // 10:30 -> Siang
    const siangDate = new Date("2026-07-29T10:30:00");
    expect(getCurrentSession(siangDate, "T")).toBe("siang");

    // 19:30 -> Maghrib
    const maghribDate = new Date("2026-07-29T19:30:00");
    expect(getCurrentSession(maghribDate, "T")).toBe("maghrib");
  });

  it("should return correct per-program session data when hook is called", async () => {
    const { result } = renderHook(
      () => useProgramKehadiranGuru("R", new Date("2026-07-29"), "shubuh"),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.summary).not.toBeNull();
    expect(result.current.summary?.totalGuru).toBe(1);
    expect(result.current.summary?.activeCount).toBe(1);
    expect(result.current.guruList[0].guruNama).toBe("Ustadz Ahmad");
  });
});
