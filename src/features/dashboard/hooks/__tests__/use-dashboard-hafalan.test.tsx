import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import {
  calculateHafalanStats,
  useDashboardHafalan,
} from "../use-dashboard-hafalan";
import * as santriQueries from "@/lib/firestore/queries/santri.queries";
import * as targetQueries from "@/lib/firestore/queries/target-hafalan.queries";
import * as kehadiranQueries from "@/lib/firestore/queries/kehadiran-santri.queries";
import type { Santri } from "@/features/santri/types/santri.types";
import type { TargetHafalan } from "@/features/target-hafalan/types/target-hafalan.types";
import type { HafalanSantriDoc } from "@/lib/firestore/queries/kehadiran-santri.queries";
import { getJuzMeta } from "@/lib/quran/quran-service";
import { Timestamp } from "firebase/firestore";

vi.mock("@/lib/firestore/queries/santri.queries", () => ({
  getAllSantri: vi.fn(),
}));

vi.mock("@/lib/firestore/queries/target-hafalan.queries", () => ({
  getTargetHafalan: vi.fn(),
}));

vi.mock("@/lib/firestore/queries/kehadiran-santri.queries", () => ({
  getAllHafalanRecords: vi.fn(),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

const mockTargets: TargetHafalan[] = [
  { id: "7_Reguler", kelas: "7", program: "R", tahunAjaran: "2026/2027", semesterAktif: 2 },
  { id: "7_Takhassus", kelas: "7", program: "T", tahunAjaran: "2026/2027", semesterAktif: 2 },
  { id: "8_Reguler", kelas: "8", program: "R", tahunAjaran: "2026/2027", semesterAktif: 2 },
  { id: "8_Takhassus", kelas: "8", program: "T", tahunAjaran: "2026/2027", semesterAktif: 2 },
  { id: "9_Reguler", kelas: "9", program: "R", tahunAjaran: "2026/2027", semesterAktif: 2 },
  { id: "9_Takhassus", kelas: "9", program: "T", tahunAjaran: "2026/2027", semesterAktif: 2 },
  { id: "10_Reguler", kelas: "10", program: "R", tahunAjaran: "2026/2027", semesterAktif: 2 },
  { id: "10_Takhassus", kelas: "10", program: "T", tahunAjaran: "2026/2027", semesterAktif: 2 },
  { id: "11_Reguler", kelas: "11", program: "R", tahunAjaran: "2026/2027", semesterAktif: 2 },
  { id: "11_Takhassus", kelas: "11", program: "T", tahunAjaran: "2026/2027", semesterAktif: 2 },
  { id: "12_Reguler", kelas: "12", program: "R", tahunAjaran: "2026/2027", semesterAktif: 2 },
  { id: "12_Takhassus", kelas: "12", program: "T", tahunAjaran: "2026/2027", semesterAktif: 2 },
];

const mockSantriList: Santri[] = [
  // Kelas 8 Reguler (Target = 4 Juz: 1, 28, 29, 30)
  {
    id: "santri-1",
    nis: "123456789001",
    nama: "Ahmad",
    kelas: "8",
    program: "R",
    isAlumni: false,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    id: "santri-2",
    nis: "123456789002",
    nama: "Budi",
    kelas: "8",
    program: "R",
    isAlumni: false,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  // Kelas 8 Takhassus (Target = 7 Juz: 24..30)
  {
    id: "santri-3",
    nis: "123456789003",
    nama: "Candra",
    kelas: "8",
    program: "T",
    isAlumni: false,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  // Alumni (Should be excluded)
  {
    id: "santri-4",
    nis: "123456789004",
    nama: "Dedi Alumni",
    kelas: "12",
    program: "R",
    isAlumni: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
];

function createMockFullJuzRecords(santriId: string, juzList: number[]): HafalanSantriDoc[] {
  const records: HafalanSantriDoc[] = [];
  for (const juzNum of juzList) {
    const jMeta = getJuzMeta(juzNum);
    if (!jMeta) continue;
    jMeta.surahs.forEach((seg, idx) => {
      records.push({
        id: `mock-${santriId}-j${juzNum}-${idx}`,
        santriId,
        juz: juzNum,
        surah: `Surah-${seg.surah_id}`,
        surahNumber: seg.surah_id,
        ayatMulai: seg.ayat_start,
        ayatSelesai: seg.ayat_end,
        jenis: "ziyadah",
        nilai: "A",
        nilaiKelancaran: 85,
        nilaiTajwid: 85,
        tanggalSetoran: new Date(),
        createdAt: new Date(),
      });
    });
  }
  return records;
}

const mockHafalanRecords: HafalanSantriDoc[] = [
  // Ahmad: completed 4 juz (30, 29, 28, 1) -> Achieved
  ...createMockFullJuzRecords("santri-1", [30, 29, 28, 1]),

  // Budi: completed only 2 juz (30, 29) -> Not Achieved
  ...createMockFullJuzRecords("santri-2", [30, 29]),

  // Candra: completed 7 juz -> Achieved for Takhassus Kelas 8
  ...createMockFullJuzRecords("santri-3", [30, 29, 28, 27, 26, 25, 24]),
];

describe("calculateHafalanStats Pure Function", () => {
  it("should correctly compute achievement percentages and stats per class with real data", () => {
    const result = calculateHafalanStats(
      mockSantriList,
      mockTargets,
      mockHafalanRecords
    );

    expect(result.stats).toHaveLength(6);
    expect(result.tahunAjaran).toBe("2026/2027");
    expect(result.semesterAktif).toBe(2);
    expect(result.isDummyData).toBe(false);

    // Check Kelas 8
    const k8 = result.stats.find((s) => s.kelasNum === "8");
    expect(k8).toBeDefined();

    // Reguler: 2 santri, 1 achieved (Ahmad) -> 50%
    expect(k8?.regulerStat.totalSantri).toBe(2);
    expect(k8?.regulerStat.achievedSantri).toBe(1);
    expect(k8?.regulerStat.targetJuz).toBe(4);
    expect(k8?.regulerStat.hasTarget).toBe(true);
    expect(k8?.reguler).toBe(50);

    // Takhassus: 1 santri, 1 achieved (Candra) -> 100%
    expect(k8?.takhassusStat.totalSantri).toBe(1);
    expect(k8?.takhassusStat.achievedSantri).toBe(1);
    expect(k8?.takhassusStat.targetJuz).toBe(7);
    expect(k8?.takhassusStat.hasTarget).toBe(true);
    expect(k8?.takhassus).toBe(100);

    // Check Alumni exclusion (Santri 4 not counted in Kelas 12)
    const k12 = result.stats.find((s) => s.kelasNum === "12");
    expect(k12?.regulerStat.totalSantri).toBe(0);

    // Check Summary weighted averages
    // Total Reguler santri with target = 2 (Ahmad, Budi), achieved = 1 -> 50%
    expect(result.summary.avgReguler).toBe(50);
    // Total Takhassus santri with target = 1 (Candra), achieved = 1 -> 100%
    expect(result.summary.avgTakhassus).toBe(100);
    // Total overall = 2 achieved out of 3 santri = 67%
    expect(result.summary.avgTotal).toBe(67);
    expect(result.summary.totalActiveSantri).toBe(3);
  });

  it("should handle Semester 1 where target is 0 Juz (Option B: hasTarget false, 0%)", () => {
    const sem1Targets: TargetHafalan[] = mockTargets.map((t) => ({
      ...t,
      semesterAktif: 1,
    }));

    const result = calculateHafalanStats(
      mockSantriList,
      sem1Targets,
      mockHafalanRecords
    );

    // Kelas 7 Reguler in Sem 1 has target 0 Juz (I'dad Tahsin)
    const k7 = result.stats.find((s) => s.kelasNum === "7");
    expect(k7?.regulerStat.targetJuz).toBe(0);
    expect(k7?.regulerStat.hasTarget).toBe(false);
    expect(k7?.reguler).toBe(0);

    // Kelas 10 Reguler in Sem 1 has target 0 Juz
    const k10 = result.stats.find((s) => s.kelasNum === "10");
    expect(k10?.regulerStat.targetJuz).toBe(0);
    expect(k10?.regulerStat.hasTarget).toBe(false);
    expect(k10?.reguler).toBe(0);
  });

  it("should handle empty data without dividing by zero", () => {
    const result = calculateHafalanStats([], [], []);
    expect(result.stats).toHaveLength(6);
    expect(result.summary.avgReguler).toBe(0);
    expect(result.summary.avgTakhassus).toBe(0);
    expect(result.summary.avgTotal).toBe(0);
    expect(result.summary.totalActiveSantri).toBe(0);
  });
});

describe("useDashboardHafalan Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch all datasets and return formatted stats", async () => {
    vi.mocked(santriQueries.getAllSantri).mockResolvedValue(mockSantriList);
    vi.mocked(targetQueries.getTargetHafalan).mockResolvedValue(mockTargets);
    vi.mocked(kehadiranQueries.getAllHafalanRecords).mockResolvedValue(mockHafalanRecords);

    const { result } = renderHook(() => useDashboardHafalan(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isError).toBe(false);
    expect(result.current.stats).toHaveLength(6);
    expect(result.current.summary.avgTotal).toBe(67);
  });
});
