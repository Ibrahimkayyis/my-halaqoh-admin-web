import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import KehadiranGuruPage from "../page";

vi.mock("@/features/kehadiran-guru/hooks/use-kehadiran-guru", () => ({
  getCurrentSession: () => "shubuh",
  useProgramKehadiranGuru: (programType: "R" | "T") => {
    if (programType === "R") {
      return {
        summary: {
          program: "R",
          totalGuru: 2,
          totalWithHalaqoh: 2,
          activeCount: 1,
          inactiveCount: 1,
          noHalaqohCount: 0,
          activePercentage: 50,
        },
        guruList: [
          {
            guruId: "g1",
            guruNama: "Ustadz Ali",
            guruNip: "1111111111111",
            program: "R",
            halaqohId: "h1",
            halaqohNama: "Al-Fatih 1",
            kelas: "7",
            isActive: true,
            status: "active",
            absensiTime: new Date(),
          },
          {
            guruId: "g2",
            guruNama: "Ustadz Budi",
            guruNip: "2222222222222",
            program: "R",
            halaqohId: "h2",
            halaqohNama: "Al-Fatih 2",
            kelas: "8",
            isActive: false,
            status: "inactive",
            absensiTime: null,
          },
        ],
        isLoading: false,
      };
    }
    return {
      summary: {
        program: "T",
        totalGuru: 1,
        totalWithHalaqoh: 1,
        activeCount: 1,
        inactiveCount: 0,
        noHalaqohCount: 0,
        activePercentage: 100,
      },
      guruList: [
        {
          guruId: "g3",
          guruNama: "Ustadz Candra",
          guruNip: "3333333333333",
          program: "T",
          halaqohId: "h3",
          halaqohNama: "Takhassus 1",
          kelas: "9",
          isActive: true,
          status: "active",
          absensiTime: new Date(),
        },
      ],
      isLoading: false,
    };
  },
}));

describe("KehadiranGuruPage Component & Integration", () => {
  it("should render page title, 2 independent program sections (Reguler & Takhassus)", async () => {
    renderWithProviders(<KehadiranGuruPage />);

    // Header
    expect(await screen.findByRole("heading", { level: 1 })).toBeInTheDocument();

    // 2 Independent Program Section Titles
    expect(screen.getByText(/Program Reguler|Reguler Program/i)).toBeInTheDocument();
    expect(screen.getByText(/Program Takhassus|Takhassus Program/i)).toBeInTheDocument();

    // Teachers names rendered in respective tables
    expect(screen.getByText("Ustadz Ali")).toBeInTheDocument();
    expect(screen.getByText("Ustadz Budi")).toBeInTheDocument();
    expect(screen.getByText("Ustadz Candra")).toBeInTheDocument();
  });
});
