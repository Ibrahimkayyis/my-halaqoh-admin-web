import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import { TargetTabView } from "../target-tab-view";

describe("TargetTabView Component", () => {
  const defaultProps = {
    tahunAjaran: "2026/2027",
    semesterAktif: 1 as const,
    onChangeSemesterAktif: vi.fn(),
    isUpdating: false,
  };

  it("should render program tabs, academic year panel, semester pills, and class cards", () => {
    renderWithProviders(<TargetTabView {...defaultProps} />);

    expect(screen.getByRole("button", { name: /Reguler/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Takhassus/i })).toBeInTheDocument();
    expect(screen.getByText("2026/2027")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Semester 1/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Semester 2/i })).toBeInTheDocument();
    expect(screen.getAllByText(/Class|Kelas/i).length).toBeGreaterThan(0);
  });

  it("should switch to Takhassus tab when clicking Takhassus tab button", () => {
    renderWithProviders(<TargetTabView {...defaultProps} />);

    const takhassusBtn = screen.getByRole("button", { name: /Takhassus/i });
    fireEvent.click(takhassusBtn);

    expect(screen.getAllByText("Juz 30").length).toBeGreaterThan(0);
  });

  it("should call onChangeSemesterAktif when clicking a semester pill", () => {
    const onChangeSemesterAktif = vi.fn();
    renderWithProviders(
      <TargetTabView {...defaultProps} onChangeSemesterAktif={onChangeSemesterAktif} />
    );

    const sem2Btn = screen.getByRole("button", { name: /Semester 2/i });
    fireEvent.click(sem2Btn);

    expect(onChangeSemesterAktif).toHaveBeenCalledWith(2);
  });
});
