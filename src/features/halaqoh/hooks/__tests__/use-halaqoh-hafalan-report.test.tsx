import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useHalaqohHafalanReport } from "../use-halaqoh-hafalan-report";
import * as halaqohQueries from "@/lib/firestore/queries/halaqoh.queries";
import * as santriQueries from "@/lib/firestore/queries/santri.queries";
import * as kehadiranSantriQueries from "@/lib/firestore/queries/kehadiran-santri.queries";
import React from "react";

vi.mock("@/lib/firestore/queries/halaqoh.queries", () => ({
  getAllHalaqoh: vi.fn(),
}));

vi.mock("@/lib/firestore/queries/santri.queries", () => ({
  getAllSantri: vi.fn(),
}));

vi.mock("@/lib/firestore/queries/kehadiran-santri.queries", () => ({
  getHafalanBySantriIds: vi.fn(),
  getHafalanBySantriId: vi.fn(),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe("useHalaqohHafalanReport", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should process and aggregate halaqoh hafalan report data correctly", async () => {
    const mockHalaqoh = [
      {
        id: "h1",
        nama: "Halaqoh Ali bin Abi Thalib",
        guruNama: "Ustadz Abdullah",
        kelas: "8",
        program: "R" as const,
      },
    ];

    const mockSantri = [
      {
        id: "s1",
        nama: "Ahmad",
        nis: "1001",
        halaqohId: "h1",
        kelas: "8",
        isAlumni: false,
      },
      {
        id: "s2",
        nama: "Budi",
        nis: "1002",
        halaqohId: "h1",
        kelas: "8",
        isAlumni: false,
      },
    ];

    const mockRecords: Record<string, any[]> = {
      s1: [
        {
          id: "rec1",
          santriId: "s1",
          tanggalSetoran: new Date(2026, 7, 5),
          jenis: "ziyadah",
          juz: 30,
          surah: "An-Naba",
          surahNumber: 78,
          ayatMulai: 1,
          ayatSelesai: 10,
          nilai: "90",
          nilaiKelancaran: 90,
          nilaiTajwid: 90,
          createdAt: new Date(2026, 7, 5),
        },
        {
          id: "rec2",
          santriId: "s1",
          tanggalSetoran: new Date(2026, 7, 6),
          jenis: "murajaah",
          juz: 30,
          surah: "An-Nazi'at",
          surahNumber: 79,
          ayatMulai: 1,
          ayatSelesai: 15,
          nilai: "80",
          nilaiKelancaran: 80,
          nilaiTajwid: 80,
          createdAt: new Date(2026, 7, 6),
        },
      ],
      s2: [], // 0 records
    };

    vi.mocked(halaqohQueries.getAllHalaqoh).mockResolvedValue(mockHalaqoh as any);
    vi.mocked(santriQueries.getAllSantri).mockResolvedValue(mockSantri as any);
    vi.mocked(kehadiranSantriQueries.getHafalanBySantriIds).mockResolvedValue(mockRecords as any);

    const startDate = new Date(2026, 7, 1);
    const endDate = new Date(2026, 7, 31);

    const { result } = renderHook(
      () =>
        useHalaqohHafalanReport(
          "h1",
          startDate,
          endDate,
          "Bulanan: Agustus 2026",
          true
        ),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.reportData).not.toBeNull());

    const report = result.current.reportData!;
    expect(report.halaqohId).toBe("h1");
    expect(report.halaqohNama).toBe("Halaqoh Ali bin Abi Thalib");
    expect(report.santriEntries.length).toBe(2);

    // Santri 1 (Ahmad)
    const ahmad = report.santriEntries[0];
    expect(ahmad.nama).toBe("Ahmad");
    expect(ahmad.totalZiyadah).toBe(1);
    expect(ahmad.totalMurajaah).toBe(1);
    expect(ahmad.avgScore).toBe(85);
    expect(ahmad.predikat).toBe("Mumtaz");

    // Santri 2 (Budi)
    const budi = report.santriEntries[1];
    expect(budi.nama).toBe("Budi");
    expect(budi.totalZiyadah).toBe(0);
    expect(budi.totalMurajaah).toBe(0);
    expect(budi.avgScore).toBeNull();
    expect(budi.predikat).toBeNull();
  });
});
