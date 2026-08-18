import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { HafalanAchievementChart } from "../hafalan-achievement-chart";
import * as dashboardHafalanHook from "../../hooks/use-dashboard-hafalan";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, defaultOrOptions?: string | Record<string, unknown>) => {
      if (typeof defaultOrOptions === "string") return defaultOrOptions;
      if (typeof defaultOrOptions === "object" && defaultOrOptions.defaultValue) {
        return defaultOrOptions.defaultValue;
      }
      return key;
    },
  }),
}));

// Mock Recharts since ResponsiveContainer needs DOM measurements
vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  BarChart: ({ children, data }: { children: React.ReactNode; data: any }) => (
    <div data-testid="bar-chart" data-chart-length={data?.length}>
      {children}
    </div>
  ),
  Bar: ({ children }: { children?: React.ReactNode }) => <div data-testid="bar">{children}</div>,
  LabelList: () => <div data-testid="label-list" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
}));

describe("HafalanAchievementChart Component (Separated Cards)", () => {
  it("renders loading skeleton when data is loading", () => {
    vi.spyOn(dashboardHafalanHook, "useDashboardHafalan").mockReturnValue({
      stats: [],
      summary: {
        avgReguler: 0,
        avgTakhassus: 0,
        avgTotal: 0,
        totalActiveSantri: 0,
        totalAchievedSantri: 0,
        totalRegulerSantri: 0,
        totalRegulerAchieved: 0,
        totalTakhassusSantri: 0,
        totalTakhassusAchieved: 0,
      },
      tahunAjaran: null,
      semesterAktif: null,
      isDummyData: false,
      isLoading: true,
      isError: false,
      refetch: vi.fn(),
    });

    const { container } = render(<HafalanAchievementChart />);
    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
  });

  it("renders error state when fetch fails", () => {
    const mockRefetch = vi.fn();
    vi.spyOn(dashboardHafalanHook, "useDashboardHafalan").mockReturnValue({
      stats: [],
      summary: {
        avgReguler: 0,
        avgTakhassus: 0,
        avgTotal: 0,
        totalActiveSantri: 0,
        totalAchievedSantri: 0,
        totalRegulerSantri: 0,
        totalRegulerAchieved: 0,
        totalTakhassusSantri: 0,
        totalTakhassusAchieved: 0,
      },
      tahunAjaran: null,
      semesterAktif: null,
      isDummyData: false,
      isLoading: false,
      isError: true,
      refetch: mockRefetch,
    });

    render(<HafalanAchievementChart />);
    expect(screen.getByText("Gagal memuat statistik target hafalan")).toBeDefined();
    const retryBtn = screen.getByRole("button", { name: /Coba Lagi/i });
    fireEvent.click(retryBtn);
    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it("renders 2 separate cards for Reguler and Takhassus with real data", () => {
    vi.spyOn(dashboardHafalanHook, "useDashboardHafalan").mockReturnValue({
      stats: [
        {
          kelas: "Kelas 7",
          kelasNum: "7",
          reguler: 0,
          takhassus: 80,
          regulerStat: { program: "R", targetJuz: 0, hasTarget: false, totalSantri: 10, achievedSantri: 0, percentage: 0 },
          takhassusStat: { program: "T", targetJuz: 3, hasTarget: true, totalSantri: 10, achievedSantri: 8, percentage: 80 },
        },
        {
          kelas: "Kelas 8",
          kelasNum: "8",
          reguler: 60,
          takhassus: 90,
          regulerStat: { program: "R", targetJuz: 4, hasTarget: true, totalSantri: 10, achievedSantri: 6, percentage: 60 },
          takhassusStat: { program: "T", targetJuz: 7, hasTarget: true, totalSantri: 10, achievedSantri: 9, percentage: 90 },
        },
        {
          kelas: "Kelas 9",
          kelasNum: "9",
          reguler: 70,
          takhassus: 85,
          regulerStat: { program: "R", targetJuz: 5, hasTarget: true, totalSantri: 10, achievedSantri: 7, percentage: 70 },
          takhassusStat: { program: "T", targetJuz: 10, hasTarget: true, totalSantri: 10, achievedSantri: 8, percentage: 85 },
        },
        {
          kelas: "Kelas 10",
          kelasNum: "10",
          reguler: 50,
          takhassus: 75,
          regulerStat: { program: "R", targetJuz: 1, hasTarget: true, totalSantri: 10, achievedSantri: 5, percentage: 50 },
          takhassusStat: { program: "T", targetJuz: 3, hasTarget: true, totalSantri: 10, achievedSantri: 7, percentage: 75 },
        },
        {
          kelas: "Kelas 11",
          kelasNum: "11",
          reguler: 80,
          takhassus: 95,
          regulerStat: { program: "R", targetJuz: 4, hasTarget: true, totalSantri: 10, achievedSantri: 8, percentage: 80 },
          takhassusStat: { program: "T", targetJuz: 11, hasTarget: true, totalSantri: 10, achievedSantri: 9, percentage: 95 },
        },
        {
          kelas: "Kelas 12",
          kelasNum: "12",
          reguler: 90,
          takhassus: 100,
          regulerStat: { program: "R", targetJuz: 5, hasTarget: true, totalSantri: 10, achievedSantri: 9, percentage: 90 },
          takhassusStat: { program: "T", targetJuz: 15, hasTarget: true, totalSantri: 10, achievedSantri: 10, percentage: 100 },
        },
      ],
      summary: {
        avgReguler: 70,
        avgTakhassus: 88,
        avgTotal: 79,
        totalActiveSantri: 120,
        totalAchievedSantri: 94,
        totalRegulerSantri: 60,
        totalRegulerAchieved: 35,
        totalTakhassusSantri: 60,
        totalTakhassusAchieved: 51,
      },
      tahunAjaran: "2026/2027",
      semesterAktif: 2,
      isDummyData: false,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    render(<HafalanAchievementChart />);

    // Both cards rendered
    expect(screen.getByText("Target Hafalan — Program Reguler")).toBeDefined();
    expect(screen.getByText("Target Hafalan — Program Takhassus")).toBeDefined();

    // 2 BarCharts rendered
    const charts = screen.getAllByTestId("bar-chart");
    expect(charts.length).toBe(2);

    // Summary metrics inside Reguler card
    expect(screen.getByText("70%")).toBeDefined();
    expect(screen.getByText("35")).toBeDefined();

    // Summary metrics inside Takhassus card
    expect(screen.getByText("88%")).toBeDefined();
    expect(screen.getByText("51")).toBeDefined();

    // Filter buttons: SMP on the first card
    const smpBtns = screen.getAllByRole("button", { name: /SMP/i });
    expect(smpBtns.length).toBe(2);
    fireEvent.click(smpBtns[0]);

    // First chart now has 3 items
    expect(charts[0].getAttribute("data-chart-length")).toBe("3");
  });
});
