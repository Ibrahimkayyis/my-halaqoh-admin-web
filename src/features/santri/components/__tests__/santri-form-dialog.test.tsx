import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import { SantriFormDialog } from "../santri-form-dialog";
import * as santriHooks from "../../hooks/use-santri";
import * as useKelasHook from "@/features/kelas-program/hooks/use-kelas";
import * as useProgramHook from "@/features/kelas-program/hooks/use-program";
import type { Santri } from "../../types/santri.types";

vi.mock("../../hooks/use-santri", () => ({
  useCreateSantri: vi.fn(),
  useUpdateSantri: vi.fn(),
}));

vi.mock("@/features/kelas-program/hooks/use-kelas", () => ({
  useGetKelas: vi.fn(),
}));

vi.mock("@/features/kelas-program/hooks/use-program", () => ({
  useGetProgram: vi.fn(),
}));

vi.mock("@/lib/firebase/storage", () => ({
  uploadSantriPhoto: vi.fn(),
}));

describe("SantriFormDialog Component", () => {
  const mockCreateMutate = vi.fn();
  const mockUpdateMutate = vi.fn();

  beforeEach(() => {
    vi.mocked(santriHooks.useCreateSantri).mockReturnValue({
      mutateAsync: mockCreateMutate,
      isPending: false,
    } as any);

    vi.mocked(santriHooks.useUpdateSantri).mockReturnValue({
      mutateAsync: mockUpdateMutate,
      isPending: false,
    } as any);

    vi.mocked(useKelasHook.useGetKelas).mockReturnValue({
      data: [{ id: "k7", nama: "7" }],
    } as any);

    vi.mocked(useProgramHook.useGetProgram).mockReturnValue({
      data: [
        { id: "R", nama: "Reguler" },
        { id: "T", nama: "Takhassus" },
      ],
    } as any);
  });

  it("should render Add Santri dialog title and inputs when open", () => {
    renderWithProviders(<SantriFormDialog open={true} onOpenChange={vi.fn()} />);

    expect(screen.getByText(/Add New Student|Tambah Data Santri/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter 12-digit NIS|NIS/i)).toBeInTheDocument();
  });

  it("should pre-populate inputs when editData is provided", () => {
    const editData: Santri = {
      id: "s1",
      nis: "2024001",
      nama: "Muhammad Ali",
      kelas: "7",
      program: "R",
      isAlumni: false,
      waliSantri: {
        nama: "Bapak Usman",
        phone: "+628123456",
        hubungan: "Ayah",
      },
      createdAt: null as any,
      updatedAt: null as any,
    };

    renderWithProviders(
      <SantriFormDialog open={true} onOpenChange={vi.fn()} editData={editData} />
    );

    expect(screen.getByText(/Edit Student Data|Edit Data Santri/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue("2024001")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Muhammad Ali")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Bapak Usman")).toBeInTheDocument();
  });

  it("should display validation error when submitting empty form", async () => {
    renderWithProviders(<SantriFormDialog open={true} onOpenChange={vi.fn()} />);

    const submitBtn = screen.getByRole("button", { name: /Add Student|Save Changes|Simpan Data Santri/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("NIS wajib diisi")).toBeInTheDocument();
      expect(screen.getByText("Nama wajib diisi")).toBeInTheDocument();
    });

    expect(mockCreateMutate).not.toHaveBeenCalled();
  });
});
