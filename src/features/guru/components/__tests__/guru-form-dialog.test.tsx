import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import { GuruFormDialog } from "../guru-form-dialog";
import * as guruHooks from "../../hooks/use-guru";
import * as programHooks from "@/features/kelas-program/hooks/use-program";
import type { Guru } from "../../types/guru.types";

vi.mock("../../hooks/use-guru", () => ({
  useCreateGuru: vi.fn(),
  useUpdateGuru: vi.fn(),
}));

vi.mock("@/features/kelas-program/hooks/use-program", () => ({
  useGetProgram: vi.fn(),
}));

vi.mock("@/lib/firebase/storage", () => ({
  uploadGuruPhoto: vi.fn(),
}));

describe("GuruFormDialog Component", () => {
  const mockCreateMutate = vi.fn();
  const mockUpdateMutate = vi.fn();

  beforeEach(() => {
    vi.mocked(guruHooks.useCreateGuru).mockReturnValue({
      mutateAsync: mockCreateMutate,
      isPending: false,
    } as any);

    vi.mocked(guruHooks.useUpdateGuru).mockReturnValue({
      mutateAsync: mockUpdateMutate,
      isPending: false,
    } as any);

    vi.mocked(programHooks.useGetProgram).mockReturnValue({
      data: [
        { id: "R", nama: "Reguler" },
        { id: "T", nama: "Takhassus" },
      ],
    } as any);
  });

  it("should render Add Guru dialog title and input fields when open", () => {
    renderWithProviders(<GuruFormDialog open={true} onOpenChange={vi.fn()} />);

    expect(screen.getByText(/Tambah Data Guru|Add New Teacher/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/NIP|13-digit/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/nama|full name/i)).toBeInTheDocument();
  });

  it("should pre-populate inputs when editData is provided", () => {
    const editData: Guru = {
      id: "guru-123",
      nip: "1988050120150",
      nama: "Ustadz Faisal",
      program: "R",
      phone: "+6281234567",
      createdAt: null as any,
      updatedAt: null as any,
    };

    renderWithProviders(
      <GuruFormDialog open={true} onOpenChange={vi.fn()} editData={editData} />
    );

    expect(screen.getByText(/Edit Data Guru|Edit Teacher Data/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue("1988050120150")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Ustadz Faisal")).toBeInTheDocument();
    expect(screen.getByDisplayValue("+6281234567")).toBeInTheDocument();
  });

  it("should display validation errors when submitting empty form", async () => {
    renderWithProviders(<GuruFormDialog open={true} onOpenChange={vi.fn()} />);

    const submitBtn = screen.getByRole("button", { name: /Add Teacher|Simpan Data Guru|Save Changes/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("NIP wajib diisi")).toBeInTheDocument();
      expect(screen.getByText("Nama wajib diisi")).toBeInTheDocument();
    });

    expect(mockCreateMutate).not.toHaveBeenCalled();
  });
});
