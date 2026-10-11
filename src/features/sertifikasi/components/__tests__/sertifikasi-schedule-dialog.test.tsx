import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor, within } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import { SertifikasiScheduleDialog } from "../sertifikasi-schedule-dialog";
import * as sertifikasiHooks from "../../hooks/use-sertifikasi";
import * as guruHooks from "@/features/guru/hooks/use-guru";
import { Timestamp } from "firebase/firestore";
import type { SertifikasiTahfidz } from "../../types/sertifikasi.types";

vi.mock("../../hooks/use-sertifikasi", () => ({
  useApproveSertifikasi: vi.fn(),
  useGetPengujiSertifikasi: vi.fn(),
}));

vi.mock("@/features/guru/hooks/use-guru", () => ({
  useGetGuru: vi.fn(),
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

describe("SertifikasiScheduleDialog Component", () => {
  const mockMutateAsync = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(sertifikasiHooks.useApproveSertifikasi).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    } as any);
    vi.mocked(sertifikasiHooks.useGetPengujiSertifikasi).mockReturnValue({
      data: [
        { id: "p-1", nip: "5542019010519", nama: "MUFTI ALFARUQI", isDefault: true },
      ],
      isLoading: false,
    } as any);
    vi.mocked(guruHooks.useGetGuru).mockReturnValue({
      data: [{ id: "g-1", nama: "MUFTI ALFARUQI", nip: "5542019010519" }],
      isLoading: false,
    } as any);
  });

  it("should render dialog with student summary when open", () => {
    renderWithProviders(
      <SertifikasiScheduleDialog open={true} onOpenChange={vi.fn()} item={mockItem} />
    );

    expect(
      screen.getByRole("heading", { name: /Setujui & Jadwalkan|Approve & Schedule/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Ahmad Fauzi")).toBeInTheDocument();
    expect(screen.getByText("Juz 30")).toBeInTheDocument();
    expect(screen.getByText(/Ustadz Maulana/i)).toBeInTheDocument();
  });

  it("should submit form when clicking submit button", async () => {
    mockMutateAsync.mockResolvedValue({});
    const onOpenChange = vi.fn();

    renderWithProviders(
      <SertifikasiScheduleDialog open={true} onOpenChange={onOpenChange} item={mockItem} />
    );

    const submitBtn = screen.getByRole("button", { name: /Setujui & Jadwalkan|Approve & Schedule/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "sert-1",
          data: expect.objectContaining({
            pengujiNama: "MUFTI ALFARUQI",
          }),
        })
      );
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it("should render 24-hour wheel time picker and update exam time range", async () => {
    mockMutateAsync.mockResolvedValue({});
    const onOpenChange = vi.fn();

    renderWithProviders(
      <SertifikasiScheduleDialog open={true} onOpenChange={onOpenChange} item={mockItem} />
    );

    const startTab = screen.getByRole("button", { name: /Tab Jam Mulai/i });
    const endTab = screen.getByRole("button", { name: /Tab Jam Selesai/i });

    expect(startTab).toBeInTheDocument();
    expect(endTab).toBeInTheDocument();

    // Verify default initial time range and duration badge
    expect(screen.getByText("08:00 - 09:30 WIB")).toBeInTheDocument();
    expect(screen.getByText("1 jam 30 mnt")).toBeInTheDocument();

    // Title Time should be visible (matches user screenshot)
    expect(screen.getByText("Time")).toBeInTheDocument();

    // Update start time to 10:00 by clicking hour 10 in hour listbox
    const hourListbox = screen.getByRole("listbox", { name: "Pilih Jam" });
    const hour10 = within(hourListbox).getByRole("option", { name: "10" });
    fireEvent.click(hour10);

    // Switch to Jam Selesai tab
    fireEvent.click(endTab);

    // Click hour 11 in hour listbox
    const hour11 = within(hourListbox).getByRole("option", { name: "11" });
    fireEvent.click(hour11);

    // Verify updated time preview
    expect(screen.getByText("10:00 - 11:30 WIB")).toBeInTheDocument();

    const submitBtn = screen.getByRole("button", { name: /Setujui & Jadwalkan|Approve & Schedule/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "sert-1",
          data: expect.objectContaining({
            sesiUjian: "10:00 - 11:30 WIB",
          }),
        })
      );
    });
  });
});
