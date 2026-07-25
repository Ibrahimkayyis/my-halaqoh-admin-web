import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/test-utils";
import { GuruFilterBar } from "../guru-filter-bar";
import * as useProgramHook from "@/features/kelas-program/hooks/use-program";

vi.mock("@/features/kelas-program/hooks/use-program", () => ({
  useGetProgram: vi.fn(),
}));

describe("GuruFilterBar Component", () => {
  const defaultProps = {
    search: "",
    setSearch: vi.fn(),
    selectedProgram: "semua",
    setSelectedProgram: vi.fn(),
    filteredCount: 5,
    totalCount: 10,
  };

  it("should render search input, count badge, and filter label", () => {
    vi.mocked(useProgramHook.useGetProgram).mockReturnValue({
      data: [
        { id: "R", nama: "Reguler" },
        { id: "T", nama: "Takhassus" },
      ],
    } as any);

    renderWithProviders(<GuruFilterBar {...defaultProps} />);

    expect(screen.getByPlaceholderText(/Cari berdasarkan nama atau NIP|Search by name or NIP/i)).toBeInTheDocument();
    expect(screen.getByText("5 / 10")).toBeInTheDocument();
    expect(screen.getByText(/Filter/i)).toBeInTheDocument();
  });

  it("should invoke setSearch when user types in search input", async () => {
    const setSearch = vi.fn();
    vi.mocked(useProgramHook.useGetProgram).mockReturnValue({ data: [] } as any);

    renderWithProviders(<GuruFilterBar {...defaultProps} setSearch={setSearch} />);

    const searchInput = screen.getByPlaceholderText(/Cari berdasarkan nama atau NIP|Search by name or NIP/i);
    await userEvent.type(searchInput, "Ahmad");

    expect(setSearch).toHaveBeenCalled();
  });
});
