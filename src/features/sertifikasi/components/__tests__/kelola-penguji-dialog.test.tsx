import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import { KelolaPengujiDialog } from "../kelola-penguji-dialog";
import * as sertifikasiHooks from "../../hooks/use-sertifikasi";
import * as guruHooks from "@/features/guru/hooks/use-guru";

vi.mock("../../hooks/use-sertifikasi", () => ({
  useGetPengujiSertifikasi: vi.fn(),
  useAddPengujiSertifikasi: vi.fn(),
  useRemovePengujiSertifikasi: vi.fn(),
}));

vi.mock("@/features/guru/hooks/use-guru", () => ({
  useGetGuru: vi.fn(),
}));

describe("KelolaPengujiDialog Component", () => {
  const mockAddMutateAsync = vi.fn();
  const mockRemoveMutateAsync = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(sertifikasiHooks.useAddPengujiSertifikasi).mockReturnValue({
      mutateAsync: mockAddMutateAsync,
      isPending: false,
    } as any);
    vi.mocked(sertifikasiHooks.useRemovePengujiSertifikasi).mockReturnValue({
      mutateAsync: mockRemoveMutateAsync,
      isPending: false,
    } as any);
    vi.mocked(guruHooks.useGetGuru).mockReturnValue({
      data: [
        { id: "g-1", nama: "Ust. Abdullah", nip: "11111" },
        { id: "g-2", nama: "Ust. Salman", nip: "22222" },
      ],
      isLoading: false,
    } as any);
  });

  it("should render dialog with active examiners", () => {
    vi.mocked(sertifikasiHooks.useGetPengujiSertifikasi).mockReturnValue({
      data: [
        { id: "p-1", nama: "Ust. Abdullah", nip: "11111", isDefault: true },
      ],
      isLoading: false,
    } as any);

    renderWithProviders(
      <KelolaPengujiDialog open={true} onOpenChange={vi.fn()} />
    );

    expect(
      screen.getByRole("heading", { name: /Kelola Dewan Penguji Tahfidz|Manage Certification Examiners/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Ust. Abdullah")).toBeInTheDocument();
    expect(screen.getByText(/NIP: 11111/)).toBeInTheDocument();
  });

  it("should call remove mutation when delete icon button is clicked", () => {
    vi.mocked(sertifikasiHooks.useGetPengujiSertifikasi).mockReturnValue({
      data: [
        { id: "p-1", nama: "Ust. Abdullah", nip: "11111", isDefault: true },
      ],
      isLoading: false,
    } as any);

    renderWithProviders(
      <KelolaPengujiDialog open={true} onOpenChange={vi.fn()} />
    );

    const removeBtn = screen.getByTitle(/Hapus dari dewan penguji|Remove from examiner team/i);
    fireEvent.click(removeBtn);

    expect(mockRemoveMutateAsync).toHaveBeenCalledWith("p-1");
  });

  it("should render empty state when no examiners are present", () => {
    vi.mocked(sertifikasiHooks.useGetPengujiSertifikasi).mockReturnValue({
      data: [],
      isLoading: false,
    } as any);

    renderWithProviders(
      <KelolaPengujiDialog open={true} onOpenChange={vi.fn()} />
    );

    expect(screen.getByText(/Belum ada penguji terdaftar|No examiners registered yet/i)).toBeInTheDocument();
  });
});
