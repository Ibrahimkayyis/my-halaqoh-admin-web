import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/test-utils";
import { SantriFilterBar } from "../santri-filter-bar";
import * as useKelasHook from "@/features/kelas-program/hooks/use-kelas";
import * as useProgramHook from "@/features/kelas-program/hooks/use-program";

vi.mock("@/features/kelas-program/hooks/use-kelas", () => ({
  useGetKelas: vi.fn(),
}));

vi.mock("@/features/kelas-program/hooks/use-program", () => ({
  useGetProgram: vi.fn(),
}));

describe("SantriFilterBar Component", () => {
  const defaultProps = {
    search: "",
    setSearch: vi.fn(),
    selectedKelas: "semua",
    setSelectedKelas: vi.fn(),
    selectedProgram: "semua",
    setSelectedProgram: vi.fn(),
    showAlumni: false,
    setShowAlumni: vi.fn(),
    filteredCount: 15,
    totalCount: 50,
  };

  it("should render search input, showing count, alumni switch toggle", () => {
    vi.mocked(useKelasHook.useGetKelas).mockReturnValue({
      data: [{ id: "k7", nama: "7" }],
    } as any);

    vi.mocked(useProgramHook.useGetProgram).mockReturnValue({
      data: [{ id: "R", nama: "Reguler" }],
    } as any);

    renderWithProviders(<SantriFilterBar {...defaultProps} />);

    expect(
      screen.getByPlaceholderText(/Search student by Name or NIS|Cari berdasarkan nama santri atau NIS/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Showing 15 of 50 Students|Menampilkan 15 dari 50 santri/i)).toBeInTheDocument();
    expect(screen.getByText(/Show Alumni|Tampilkan Alumni/i)).toBeInTheDocument();
  });

  it("should invoke setSearch when typing in search input", async () => {
    const setSearch = vi.fn();
    vi.mocked(useKelasHook.useGetKelas).mockReturnValue({ data: [] } as any);
    vi.mocked(useProgramHook.useGetProgram).mockReturnValue({ data: [] } as any);

    renderWithProviders(<SantriFilterBar {...defaultProps} setSearch={setSearch} />);

    const searchInput = screen.getByPlaceholderText(/Search student by Name or NIS|Cari berdasarkan nama santri atau NIS/i);
    await userEvent.type(searchInput, "Ali");

    expect(setSearch).toHaveBeenCalled();
  });
});
