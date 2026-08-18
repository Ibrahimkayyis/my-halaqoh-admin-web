import { describe, it, expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import DashboardPage from "../page";
import * as dashboardStats from "@/features/dashboard/hooks/use-dashboard-stats";
import * as dashboardHafalan from "@/features/dashboard/hooks/use-dashboard-hafalan";

vi.mock("@/features/dashboard/hooks/use-dashboard-stats", () => ({
  useDashboardCounts: vi.fn(),
}));

vi.mock("@/features/dashboard/hooks/use-dashboard-hafalan", () => ({
  useDashboardHafalan: vi.fn(() => ({
    stats: [],
    summary: {
      avgReguler: 0,
      avgTakhassus: 0,
      avgTotal: 0,
      totalActiveSantri: 0,
      totalAchievedSantri: 0,
    },
    tahunAjaran: "2026/2027",
    semesterAktif: 2,
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
  })),
}));

describe("Dashboard Page Component Integration", () => {
  it("should render placeholder dots when dashboard counts are loading", () => {
    vi.mocked(dashboardStats.useDashboardCounts).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as any);

    renderWithProviders(<DashboardPage />);

    // Placeholders for count cards
    const placeholders = screen.getAllByText("...");
    expect(placeholders.length).toBeGreaterThanOrEqual(3);
  });

  it("should render stat cards with fetched count values", async () => {
    vi.mocked(dashboardStats.useDashboardCounts).mockReturnValue({
      data: {
        santri: 145,
        guru: 18,
        halaqoh: 14,
      },
      isLoading: false,
    } as any);

    renderWithProviders(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText("145")).toBeInTheDocument();
      expect(screen.getByText("18")).toBeInTheDocument();
      expect(screen.getByText("14")).toBeInTheDocument();
    });
  });

  it("should render hafalan achievement chart section", () => {
    vi.mocked(dashboardStats.useDashboardCounts).mockReturnValue({
      data: { santri: 100, guru: 10, halaqoh: 5 },
      isLoading: false,
    } as any);

    renderWithProviders(<DashboardPage />);

    expect(
      screen.getByText(/(Target Hafalan — Program Reguler|Target Achievement — Reguler Program)/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/(Target Hafalan — Program Takhassus|Target Achievement — Takhassus Program)/i)
    ).toBeInTheDocument();
  });
});
