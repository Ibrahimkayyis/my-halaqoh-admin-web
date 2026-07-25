import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/test-utils";
import { HalaqohFilterBar } from "../halaqoh-filter-bar";
import * as useKelasHook from "@/features/kelas-program/hooks/use-kelas";
import * as useProgramHook from "@/features/kelas-program/hooks/use-program";

vi.mock("@/features/kelas-program/hooks/use-kelas", () => ({
  useGetKelas: vi.fn(),
}));

vi.mock("@/features/kelas-program/hooks/use-program", () => ({
  useGetProgram: vi.fn(),
}));

describe("HalaqohFilterBar Component", () => {
  const defaultProps = {
    search: "",
    setSearch: vi.fn(),
    selectedKelas: "semua",
    setSelectedKelas: vi.fn(),
    selectedProgram: "semua",
    setSelectedProgram: vi.fn(),
    filteredCount: 8,
    totalCount: 15,
  };

  it("should render search input, showing count text, and filter selects", () => {
    vi.mocked(useKelasHook.useGetKelas).mockReturnValue({
      data: [{ id: "k7", nama: "7" }],
    } as any);

    vi.mocked(useProgramHook.useGetProgram).mockReturnValue({
      data: [{ id: "R", nama: "Reguler" }],
    } as any);

    renderWithProviders(<HalaqohFilterBar {...defaultProps} />);

    expect(
      screen.getByPlaceholderText(/Search halaqoh name or teacher|Cari nama halaqoh/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Showing 8 of 15 Halaqoh|Menampilkan 8 dari 15 halaqoh/i)).toBeInTheDocument();
    expect(screen.getByText(/Filter/i)).toBeInTheDocument();
  });

  it("should invoke setSearch when typing into search input", async () => {
    const setSearch = vi.fn();
    vi.mocked(useKelasHook.useGetKelas).mockReturnValue({ data: [] } as any);
    vi.mocked(useProgramHook.useGetProgram).mockReturnValue({ data: [] } as any);

    renderWithProviders(<HalaqohFilterBar {...defaultProps} setSearch={setSearch} />);

    const searchInput = screen.getByPlaceholderText(/Search halaqoh name or teacher|Cari nama halaqoh/i);
    await userEvent.type(searchInput, "Abu Bakar");

    expect(setSearch).toHaveBeenCalled();
  });
});
