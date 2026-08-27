import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import { SertifikasiFilterBar } from "../sertifikasi-filter-bar";
import * as useKelasHook from "@/features/kelas-program/hooks/use-kelas";
import * as useProgramHook from "@/features/kelas-program/hooks/use-program";

vi.mock("@/features/kelas-program/hooks/use-kelas", () => ({
  useGetKelas: vi.fn(() => ({ data: [{ id: "k1", nama: "7A" }], isLoading: false })),
}));

vi.mock("@/features/kelas-program/hooks/use-program", () => ({
  useGetProgram: vi.fn(() => ({ data: [{ id: "p1", nama: "Reguler" }], isLoading: false })),
}));

describe("SertifikasiFilterBar Component", () => {
  const defaultProps = {
    search: "",
    setSearch: vi.fn(),
    activeStatus: "semua",
    setActiveStatus: vi.fn(),
    selectedKelas: "semua",
    setSelectedKelas: vi.fn(),
    selectedProgram: "semua",
    setSelectedProgram: vi.fn(),
    timePreset: "all" as const,
    setTimePreset: vi.fn(),

    customDate: "2026-08-27",
    setCustomDate: vi.fn(),
    customStartDate: "2026-08-20",
    setCustomStartDate: vi.fn(),
    customEndDate: "2026-08-27",
    setCustomEndDate: vi.fn(),
    statusCounts: { pending: 2, scheduled: 1, passed: 3, failed: 0, rejected: 1 },
    filteredCount: 7,
    totalCount: 7,
  };


  it("should render search input, status tabs, and count badge", () => {
    renderWithProviders(<SertifikasiFilterBar {...defaultProps} />);

    expect(screen.getByPlaceholderText(/Cari santri|Search student/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Pending Approval|Menunggu Persetujuan/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Scheduled|Terjadwal/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Passed|Lulus/i })).toBeInTheDocument();
  });

  it("should call setActiveStatus when clicking status tab", () => {
    const setActiveStatus = vi.fn();
    renderWithProviders(
      <SertifikasiFilterBar {...defaultProps} setActiveStatus={setActiveStatus} />
    );

    const pendingTab = screen.getByRole("button", { name: /Pending Approval|Menunggu Persetujuan/i });
    fireEvent.click(pendingTab);
    expect(setActiveStatus).toHaveBeenCalledWith("pending");
  });

  it("should call setSearch when typing in search input", () => {
    const setSearch = vi.fn();
    renderWithProviders(
      <SertifikasiFilterBar {...defaultProps} setSearch={setSearch} />
    );

    const input = screen.getByPlaceholderText(/Cari santri|Search student/i);
    fireEvent.change(input, { target: { value: "Ahmad" } });
    expect(setSearch).toHaveBeenCalledWith("Ahmad");
  });
});
