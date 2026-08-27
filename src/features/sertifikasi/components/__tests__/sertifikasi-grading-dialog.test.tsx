import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import { SertifikasiGradingDialog } from "../sertifikasi-grading-dialog";
import * as sertifikasiHooks from "../../hooks/use-sertifikasi";
import { Timestamp } from "firebase/firestore";
import type { SertifikasiTahfidz } from "../../types/sertifikasi.types";

vi.mock("../../hooks/use-sertifikasi", () => ({
  useGradeSertifikasi: vi.fn(),
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
  status: "scheduled",
  tanggalUjian: Timestamp.fromDate(new Date("2026-08-10")),
  sesiUjian: "Pagi (08:00 - 09:30 WIB)",
  pengujiNama: "MUFTI ALFARUQI",
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
};

describe("SertifikasiGradingDialog Component", () => {
  const mockMutateAsync = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(sertifikasiHooks.useGradeSertifikasi).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    } as any);
  });

  it("should render grading dialog and show live predicate", async () => {
    renderWithProviders(
      <SertifikasiGradingDialog open={true} onOpenChange={vi.fn()} item={mockItem} />
    );

    expect(
      screen.getByRole("heading", { name: /Input Hasil Ujian|Input Certification Exam/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Ahmad Fauzi")).toBeInTheDocument();
    expect(screen.getByText("MUFTI ALFARUQI")).toBeInTheDocument();

    const nilaiInput = screen.getByPlaceholderText(/1 - 100/i);
    fireEvent.change(nilaiInput, { target: { value: "95" } });

    // 95 should trigger Mumtaz (Istimewa)
    await waitFor(() => {
      expect(screen.getByText("Mumtaz (Istimewa)")).toBeInTheDocument();
    });
  });

  it("should submit grade when clicking submit button", async () => {
    mockMutateAsync.mockResolvedValue({});
    const onOpenChange = vi.fn();

    renderWithProviders(
      <SertifikasiGradingDialog open={true} onOpenChange={onOpenChange} item={mockItem} />
    );

    const nilaiInput = screen.getByPlaceholderText(/1 - 100/i);
    fireEvent.change(nilaiInput, { target: { value: "88" } });

    const submitBtn = screen.getByRole("button", { name: /Simpan Hasil Ujian|Save Exam Results/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "sert-1",
          data: expect.objectContaining({
            nilai: 88,
            status: "passed",
          }),
        })
      );
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });
});
