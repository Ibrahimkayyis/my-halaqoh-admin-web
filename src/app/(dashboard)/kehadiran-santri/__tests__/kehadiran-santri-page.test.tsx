import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import KehadiranSantriPage from "../page";

vi.mock("@/features/dashboard/hooks/use-dashboard-absent-santri", () => ({
  useDashboardAbsentSantri: () => ({
    absentList: [],
    summary: { totalAbsent: 0, sakitCount: 0, izinCount: 0, alfaCount: 0 },
    isLoading: false,
  }),
}));

describe("KehadiranSantriPage Component Integration", () => {
  it("should render absent santri section headers per program", () => {
    renderWithProviders(<KehadiranSantriPage />);

    expect(
      screen.getByText(/Program Reguler|Regular Program/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Program Takhassus|Takhassus Program/i)
    ).toBeInTheDocument();
  });
});
