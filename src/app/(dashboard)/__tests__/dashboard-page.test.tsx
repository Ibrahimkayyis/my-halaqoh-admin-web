import { describe, it, expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import DashboardPage from "../page";
import * as dashboardStats from "@/features/dashboard/hooks/use-dashboard-stats";

vi.mock("@/features/dashboard/hooks/use-dashboard-stats", () => ({
  useDashboardCounts: vi.fn(),
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
      screen.getByText(/Statistik Capaian Target Hafalan/i)
    ).toBeInTheDocument();
  });
});
