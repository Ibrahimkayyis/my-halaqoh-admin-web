import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import KelasProgramPage from "../page";
import * as useKelasHook from "@/features/kelas-program/hooks/use-kelas";
import * as useProgramHook from "@/features/kelas-program/hooks/use-program";

vi.mock("@/features/kelas-program/hooks/use-kelas", () => ({
  useGetKelas: vi.fn(),
  useDeleteKelas: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
  useCreateKelas: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
  useUpdateKelas: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
}));

vi.mock("@/features/kelas-program/hooks/use-program", () => ({
  useGetProgram: vi.fn(),
  useDeleteProgram: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
  useCreateProgram: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
  useUpdateProgram: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
}));

describe("KelasProgramPage Integration Test", () => {
  it("should render page header subtitle and tabs list", () => {
    vi.mocked(useKelasHook.useGetKelas).mockReturnValue({ data: [], isLoading: false } as any);
    vi.mocked(useProgramHook.useGetProgram).mockReturnValue({ data: [], isLoading: false } as any);

    renderWithProviders(<KelasProgramPage />);

    expect(screen.getByText(/Manage class structures and educational programs/i)).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Class Structure|Struktur Kelas/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Educational Programs|Program Pendidikan/i })).toBeInTheDocument();
  });

  it("should open Add Class dialog when Add Class button is clicked on Class tab", () => {
    vi.mocked(useKelasHook.useGetKelas).mockReturnValue({ data: [], isLoading: false } as any);
    vi.mocked(useProgramHook.useGetProgram).mockReturnValue({ data: [], isLoading: false } as any);

    renderWithProviders(<KelasProgramPage />);

    const addBtn = screen.getByRole("button", { name: /Add Class|Tambah Kelas/i });
    fireEvent.click(addBtn);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("should switch to Program tab and open Add Program dialog", () => {
    vi.mocked(useKelasHook.useGetKelas).mockReturnValue({ data: [], isLoading: false } as any);
    vi.mocked(useProgramHook.useGetProgram).mockReturnValue({ data: [], isLoading: false } as any);

    renderWithProviders(<KelasProgramPage />);

    const programTabTrigger = screen.getByRole("tab", { name: /Educational Programs|Program Pendidikan/i });
    fireEvent.click(programTabTrigger);

    const addProgramBtn = screen.getByRole("button", { name: /Add Program|Tambah Program/i });
    fireEvent.click(addProgramBtn);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
