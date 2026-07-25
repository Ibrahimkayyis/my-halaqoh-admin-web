import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import SantriPage from "../page";
import * as santriHooks from "@/features/santri/hooks/use-santri";
import * as useKelasHook from "@/features/kelas-program/hooks/use-kelas";
import * as useProgramHook from "@/features/kelas-program/hooks/use-program";

vi.mock("@/features/santri/hooks/use-santri", () => ({
  useGetSantri: vi.fn(),
  useDeleteSantri: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
  useResetPassword: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
  useCreateSantri: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
  useUpdateSantri: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
  useBulkCreateSantri: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
  usePromoteAll: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
}));

vi.mock("@/features/kelas-program/hooks/use-kelas", () => ({
  useGetKelas: vi.fn(),
}));

vi.mock("@/features/kelas-program/hooks/use-program", () => ({
  useGetProgram: vi.fn(),
}));

describe("SantriPage Integration Test", () => {
  beforeEach(() => {
    vi.mocked(useKelasHook.useGetKelas).mockReturnValue({ data: [], isLoading: false } as any);
    vi.mocked(useProgramHook.useGetProgram).mockReturnValue({ data: [], isLoading: false } as any);
  });

  it("should render page header, promote button, and student table", () => {
    const mockSantriList = [
      { id: "s1", nis: "2024001", nama: "Muhammad Ali", kelas: "7", program: "R", isAlumni: false },
    ];
    vi.mocked(santriHooks.useGetSantri).mockReturnValue({ data: mockSantriList, isLoading: false } as any);

    renderWithProviders(<SantriPage />);

    expect(screen.getByText(/Manage students data|Manajemen Data Santri/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Class Promotion|Kenaikan Kelas/i })).toBeInTheDocument();
    expect(screen.getByText("Muhammad Ali")).toBeInTheDocument();
  });

  it("should open promotion dialog when Class Promotion button is clicked", () => {
    const mockSantriList = [
      { id: "s1", nis: "2024001", nama: "Muhammad Ali", kelas: "7", program: "R", isAlumni: false },
    ];
    vi.mocked(santriHooks.useGetSantri).mockReturnValue({ data: mockSantriList, isLoading: false } as any);

    renderWithProviders(<SantriPage />);

    const promoteBtn = screen.getByRole("button", { name: /Class Promotion|Kenaikan Kelas/i });
    fireEvent.click(promoteBtn);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
