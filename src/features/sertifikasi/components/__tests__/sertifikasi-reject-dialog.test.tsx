import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import { SertifikasiRejectDialog } from "../sertifikasi-reject-dialog";
import * as sertifikasiHooks from "../../hooks/use-sertifikasi";
import { Timestamp } from "firebase/firestore";
import type { SertifikasiTahfidz } from "../../types/sertifikasi.types";

vi.mock("../../hooks/use-sertifikasi", () => ({
  useRejectSertifikasi: vi.fn(),
}));

const mockItem: SertifikasiTahfidz = {
  id: "sert-1",
  santriId: "santri-1",
  santriNama: "Ahmad Fauzi",
  nis: "2024001",
  kelas: "7A",
  program: "R",
  halaqohId: "hal-1",
  halaqohNama: "Halaqoh Utsman",
  guruId: "guru-1",
  guruNama: "Ustadz Maulana",
  juz: 30,
  status: "pending",
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
};

describe("SertifikasiRejectDialog Component", () => {
  const mockMutateAsync = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(sertifikasiHooks.useRejectSertifikasi).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    } as any);
  });

  it("should render reject dialog and prevent submit when empty", async () => {
    renderWithProviders(
      <SertifikasiRejectDialog open={true} onOpenChange={vi.fn()} item={mockItem} />
    );

    expect(
      screen.getByRole("heading", { name: /Tolak Pengajuan|Reject Certification/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Ahmad Fauzi")).toBeInTheDocument();

    const submitBtn = screen.getByRole("button", { name: /Tolak Pengajuan|Reject Submission/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockMutateAsync).not.toHaveBeenCalled();
    });
  });

  it("should submit rejection when reason is provided", async () => {
    mockMutateAsync.mockResolvedValue({});
    const onOpenChange = vi.fn();

    renderWithProviders(
      <SertifikasiRejectDialog open={true} onOpenChange={onOpenChange} item={mockItem} />
    );

    const textarea = screen.getByPlaceholderText(/Tuliskan alasan penolakan|Write clear reason/i);
    fireEvent.change(textarea, {
      target: { value: "Kelancaran hafalan belum mencapai 100% mutqin." },
    });

    const submitBtn = screen.getByRole("button", { name: /Tolak Pengajuan|Reject Submission/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        id: "sert-1",
        alasan: "Kelancaran hafalan belum mencapai 100% mutqin.",
      });
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });
});
