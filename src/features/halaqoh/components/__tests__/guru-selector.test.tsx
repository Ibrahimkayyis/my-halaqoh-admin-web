import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import { GuruSelector } from "../guru-selector";
import type { Guru } from "@/features/guru/types/guru.types";

describe("GuruSelector Component", () => {
  const mockGuruList: Guru[] = [
    {
      id: "g1",
      nip: "19880501201501",
      nama: "Ustadz Abdullah",
      program: "R",
      phone: "081234567890",
      createdAt: null as any,
      updatedAt: null as any,
    },
    {
      id: "g2",
      nip: "19880501201502",
      nama: "Ustadz Faisal",
      program: "T",
      phone: "081234567891",
      createdAt: null as any,
      updatedAt: null as any,
    },
  ];

  it("should render placeholder when no teacher is selected", () => {
    renderWithProviders(
      <GuruSelector
        value=""
        onChange={vi.fn()}
        guruList={mockGuruList}
        assignedGuruIds={new Set()}
      />
    );

    expect(
      screen.getByRole("button", { name: /Search teacher name or NIP/i })
    ).toBeInTheDocument();
  });

  it("should open dropdown list and invoke onChange when a teacher is selected", () => {
    const onChange = vi.fn();
    renderWithProviders(
      <GuruSelector
        value=""
        onChange={onChange}
        guruList={mockGuruList}
        assignedGuruIds={new Set()}
      />
    );

    const triggerBtn = screen.getByRole("button", { name: /Search teacher name or NIP/i });
    fireEvent.click(triggerBtn);

    expect(screen.getByText("Ustadz Abdullah")).toBeInTheDocument();
    expect(screen.getByText("Ustadz Faisal")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Ustadz Abdullah"));

    expect(onChange).toHaveBeenCalledWith("g1", "Ustadz Abdullah");
  });
});
