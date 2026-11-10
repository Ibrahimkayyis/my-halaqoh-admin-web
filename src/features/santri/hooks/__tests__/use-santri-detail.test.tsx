import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSantriBaseInfo } from "../use-santri-detail";
import * as firestore from "firebase/firestore";
import * as kehadiranQueries from "@/lib/firestore/queries/kehadiran-santri.queries";
import * as targetHooks from "@/features/target-hafalan/hooks/use-target-hafalan";
import * as sertifikasiQueries from "@/lib/firestore/queries/sertifikasi.queries";
import { getJuzMeta } from "@/lib/quran/quran-service";
import type { HafalanSantriDoc } from "@/lib/firestore/queries/kehadiran-santri.queries";

vi.mock("firebase/firestore", () => ({
  doc: vi.fn(),
  getDoc: vi.fn(),
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  limit: vi.fn(),
  getDocs: vi.fn(),
  onSnapshot: vi.fn(() => vi.fn()),
}));

vi.mock("@/lib/firebase/config", () => ({
  db: {},
}));

vi.mock("@/lib/firestore/queries/kehadiran-santri.queries", () => ({
  getHafalanBySantriId: vi.fn(),
  getSantriExtraTargetJuz: vi.fn(),
  getAbsensiByDateRange: vi.fn(),
  subscribeAbsensiByDateRange: vi.fn(),
}));

vi.mock("@/features/target-hafalan/hooks/use-target-hafalan", () => ({
  useGetTargetHafalan: vi.fn(),
}));

vi.mock("@/lib/firestore/queries/sertifikasi.queries", () => ({
  getSertifikasiBySantriId: vi.fn(),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe("useSantriDetail", () => {
  describe("Monthly Date Range Calculation", () => {
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

  describe("Hafalan Progress Calculation in useSantriBaseInfo", () => {
    beforeEach(() => {
      vi.clearAllMocks();

      // Mock santri doc fetch
      vi.mocked(firestore.getDoc).mockImplementation(async (_ref: any) => {
        return {
          exists: () => true,
          id: "santri-1",
          data: () => ({
            nis: "2024001",
            nama: "Ahmad",
            kelas: "7",
            program: "R",
            halaqohId: "h1",
            isAlumni: false,
          }),
        } as any;
      });

      // Target Hafalan for Kelas 7 Reguler is Juz 30 (1 Juz, 564 verses)
      vi.mocked(targetHooks.useGetTargetHafalan).mockReturnValue({
        data: [
          {
            id: "t1",
            kelas: "7",
            program: "R",
            tahunAjaran: "2025/2026",
            semesterAktif: 1,
            targetJuz: 1,
            targetJuzList: [30],
            juzList: [30],
          },
        ],
        isLoading: false,
      } as any);

      vi.mocked(kehadiranQueries.getSantriExtraTargetJuz).mockResolvedValue([]);
      vi.mocked(sertifikasiQueries.getSertifikasiBySantriId).mockResolvedValue([]);
    });

    it("should NOT mark juz as completed if santri only deposited partial verses (e.g. An-Naba 1-40)", async () => {
      const partialRecord: HafalanSantriDoc = {
        id: "h1",
        santriId: "santri-1",
        juz: 30,
        surah: "An-Naba",
        surahNumber: 78,
        ayatMulai: 1,
        ayatSelesai: 40,
        jenis: "ziyadah",
        nilai: "A",
        nilaiKelancaran: 90,
        nilaiTajwid: 90,
        tanggalSetoran: new Date(),
        createdAt: new Date(),
      };

      vi.mocked(kehadiranQueries.getHafalanBySantriId).mockResolvedValue([partialRecord]);

      const { result } = renderHook(() => useSantriBaseInfo("santri-1"), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      const { hafalanProgress } = result.current;

      // Crucial assertion: partial submission MUST NOT mark Juz 30 complete or achieved!
      // Kelas 7 Reguler Sem 1 UTS (An-Naba'–Al-A'la) = 295 verses with 0.5 Juz weight -> 40/295 * 0.5 = 0.06779 Juz
      expect(hafalanProgress.adminJuzTarget).toBe(1);
      expect(hafalanProgress.adminJuzCompleted).toBeCloseTo(0.5 * (40 / 295), 4);
      expect(hafalanProgress.formattedAdminJuzCompleted).toBe("0.06");
      expect(hafalanProgress.adminCompletedJuzList).toEqual([]);
      expect(hafalanProgress.isAchieved).toBe(false);

      expect(hafalanProgress.memorizedAyatInTarget).toBe(40);
      expect(hafalanProgress.totalAyatInTarget).toBe(564);
      expect(hafalanProgress.formattedAdminProgress).toBe("6.77");
    });

    it("should combine santriExtraTarget and out-of-curriculum memorized juz in extra target progress", async () => {
      // Santri in Kelas 7 Reguler Sem 1 (Target: Juz 30) also memorized Juz 29 (Al-Mulk 1-30) without extra doc
      const extraRecord: HafalanSantriDoc = {
        id: "h-extra",
        santriId: "santri-1",
        juz: 29,
        surah: "Al-Mulk",
        surahNumber: 67,
        ayatMulai: 1,
        ayatSelesai: 30,
        jenis: "ziyadah",
        nilai: "A",
        nilaiKelancaran: 90,
        nilaiTajwid: 90,
        tanggalSetoran: new Date(),
        createdAt: new Date(),
      };

      vi.mocked(kehadiranQueries.getHafalanBySantriId).mockResolvedValue([extraRecord]);
      vi.mocked(kehadiranQueries.getSantriExtraTargetJuz).mockResolvedValue([28]);

      const { result } = renderHook(() => useSantriBaseInfo("santri-1"), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      const { hafalanProgress } = result.current;

      // Combined extra juz list: 28 (from Firestore) + 29 (memorized outside target [30])
      expect(hafalanProgress.extraJuzList).toEqual([28, 29]);
      expect(hafalanProgress.extraJuzTarget).toBe(2);
      // Al-Mulk 30 verses out of 431 in Juz 29 -> 30 / 431 = 0.0696 -> formatted "0.06"
      expect(hafalanProgress.extraJuzCompleted).toBeCloseTo(30 / 431, 4);
      expect(hafalanProgress.formattedExtraJuzCompleted).toBe("0.06");
      expect(hafalanProgress.formattedExtraProgress).toBe("3.48");
    });

    it("should mark juz as completed and 100% when all verses of target Juz 30 are memorized", async () => {
      const juz30 = getJuzMeta(30)!;
      const fullJuz30Records: HafalanSantriDoc[] = juz30.surahs.map((seg, idx) => ({
        id: `h-j30-${idx}`,
        santriId: "santri-1",
        juz: 30,
        surah: `Surah-${seg.surah_id}`,
        surahNumber: seg.surah_id,
        ayatMulai: seg.ayat_start,
        ayatSelesai: seg.ayat_end,
        jenis: "ziyadah",
        nilai: "A",
        nilaiKelancaran: 95,
        nilaiTajwid: 95,
        tanggalSetoran: new Date(),
        createdAt: new Date(),
      }));

      vi.mocked(kehadiranQueries.getHafalanBySantriId).mockResolvedValue(fullJuz30Records);

      const { result } = renderHook(() => useSantriBaseInfo("santri-1"), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      const { hafalanProgress } = result.current;

      expect(hafalanProgress.adminJuzTarget).toBe(1);
      expect(hafalanProgress.adminJuzCompleted).toBe(1);
      expect(hafalanProgress.adminCompletedJuzList).toEqual([30]);
      expect(hafalanProgress.isAchieved).toBe(true);
      expect(hafalanProgress.memorizedAyatInTarget).toBe(564);
      expect(hafalanProgress.totalAyatInTarget).toBe(564);
      expect(hafalanProgress.adminProgress).toBe(100);
    });
  });
});
