import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import SertifikasiTahfidzPage from "../page";
import * as sertifikasiHooks from "@/features/sertifikasi/hooks/use-sertifikasi";
import * as guruHooks from "@/features/guru/hooks/use-guru";
import * as useKelasHook from "@/features/kelas-program/hooks/use-kelas";
import * as useProgramHook from "@/features/kelas-program/hooks/use-program";
import { Timestamp } from "firebase/firestore";

vi.mock("@/features/sertifikasi/hooks/use-sertifikasi", () => ({
  useGetSertifikasi: vi.fn(),
  useApproveSertifikasi: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
  useRejectSertifikasi: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
  useGradeSertifikasi: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
}));

vi.mock("@/features/guru/hooks/use-guru", () => ({
  useGetGuru: vi.fn(() => ({ data: [], isLoading: false })),
}));

vi.mock("@/features/kelas-program/hooks/use-kelas", () => ({
  useGetKelas: vi.fn(() => ({ data: [], isLoading: false })),
}));

vi.mock("@/features/kelas-program/hooks/use-program", () => ({
  useGetProgram: vi.fn(() => ({ data: [], isLoading: false })),
}));

const mockData = [
  {
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
  },
  {
    id: "sert-2",
    santriId: "santri-2",
    santriNama: "Budi Santoso",
    nis: "2024002",
    kelas: "8B",
    program: "T",
    halaqohId: "hal-2",
    halaqohNama: "Halaqoh Ali",
    guruId: "guru-2",
    guruNama: "Ustadz Abdullah",
    juz: 1,
    status: "scheduled",
    tanggalUjian: Timestamp.now(),
    sesiUjian: "Pagi (08:00 - 09:30 WIB)",
    pengujiNama: "MUFTI ALFARUQI",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
];

describe("SertifikasiTahfidzPage Integration Test", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(sertifikasiHooks.useGetSertifikasi).mockReturnValue({
      data: mockData,
      isLoading: false,
    } as any);
  });

  it("should render page subtitle, filter tabs, and items in table", () => {
    renderWithProviders(<SertifikasiTahfidzPage />);

    expect(
      screen.getByText(/Kelola pendaftaran, jadwal|Manage registrations, schedules/i)
    ).toBeInTheDocument();
    expect(screen.getByText("Ahmad Fauzi")).toBeInTheDocument();
    expect(screen.getByText("Budi Santoso")).toBeInTheDocument();
  });

  it("should open schedule dialog when clicking Setujui on pending item", () => {
    renderWithProviders(<SertifikasiTahfidzPage />);

    const approveBtn = screen.getByRole("button", { name: /Setujui pengajuan Ahmad Fauzi/i });
    fireEvent.click(approveBtn);

    expect(
      screen.getByRole("heading", { name: /Setujui & Jadwalkan|Approve & Schedule/i })
    ).toBeInTheDocument();
  });

  it("should open reject dialog when clicking Tolak on pending item", () => {
    renderWithProviders(<SertifikasiTahfidzPage />);

    const rejectBtn = screen.getByRole("button", { name: /Tolak pengajuan Ahmad Fauzi/i });
    fireEvent.click(rejectBtn);

    expect(
      screen.getByRole("heading", { name: /Tolak Pengajuan Sertifikasi|Reject Certification/i })
    ).toBeInTheDocument();
  });

  it("should open grading dialog when clicking Input Nilai on scheduled item", () => {
    renderWithProviders(<SertifikasiTahfidzPage />);

    const gradeBtn = screen.getByRole("button", { name: /Input nilai ujian Budi Santoso/i });
    fireEvent.click(gradeBtn);

    expect(
      screen.getByRole("heading", { name: /Input Hasil Ujian|Input Certification Exam/i })
    ).toBeInTheDocument();
  });

  it("should open detail dialog when clicking eye icon", () => {
    renderWithProviders(<SertifikasiTahfidzPage />);

    const detailBtn = screen.getByRole("button", { name: /Lihat rincian Ahmad Fauzi/i });
    fireEvent.click(detailBtn);

    expect(
      screen.getByRole("heading", { name: /Rincian Sertifikasi Tahfidz|Tahfidz Certification Details/i })
    ).toBeInTheDocument();
  });
});
