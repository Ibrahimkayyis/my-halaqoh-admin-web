import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import { SertifikasiTable } from "../sertifikasi-table";
import type { SertifikasiTahfidz } from "../../types/sertifikasi.types";
import { Timestamp } from "firebase/firestore";

const mockList: SertifikasiTahfidz[] = [
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
    createdAt: Timestamp.fromDate(new Date("2026-08-01")),
    updatedAt: Timestamp.fromDate(new Date("2026-08-01")),
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
    tanggalUjian: Timestamp.fromDate(new Date("2026-08-10")),
    sesiUjian: "Pagi (08:00 - 09:30 WIB)",
    pengujiNama: "MUFTI ALFARUQI",
    createdAt: Timestamp.fromDate(new Date("2026-08-02")),
    updatedAt: Timestamp.fromDate(new Date("2026-08-03")),
  },
  {
    id: "sert-3",
    santriId: "santri-3",
    santriNama: "Citra Dewi",
    nis: "2024003",
    kelas: "9A",
    program: "R",
    halaqohId: "hal-3",
    halaqohNama: "Halaqoh Fatimah",
    guruId: "guru-3",
    guruNama: "Ustadzah Aisyah",
    juz: 29,
    status: "passed",
    nilai: 92,
    predikat: "Mumtaz (Istimewa)",
    createdAt: Timestamp.fromDate(new Date("2026-08-04")),
    updatedAt: Timestamp.fromDate(new Date("2026-08-05")),
    completedAt: Timestamp.fromDate(new Date("2026-08-05")),
  },
];

describe("SertifikasiTable Component", () => {
  const defaultProps = {
    data: mockList,
    isLoading: false,
    onApprove: vi.fn(),
    onReject: vi.fn(),
    onGrade: vi.fn(),
    onDetail: vi.fn(),
  };

  it("should render table headers and student rows", () => {
    renderWithProviders(<SertifikasiTable {...defaultProps} />);

    expect(screen.getByText("Ahmad Fauzi")).toBeInTheDocument();
    expect(screen.getByText("Budi Santoso")).toBeInTheDocument();
    expect(screen.getByText("Citra Dewi")).toBeInTheDocument();
    expect(screen.getByText("Juz 30")).toBeInTheDocument();
    expect(screen.getByText("Juz 1")).toBeInTheDocument();
  });

  it("should show approve and reject buttons for pending status", () => {
    const onApprove = vi.fn();
    const onReject = vi.fn();
    renderWithProviders(
      <SertifikasiTable
        {...defaultProps}
        onApprove={onApprove}
        onReject={onReject}
      />
    );

    const approveBtn = screen.getByRole("button", { name: /Setujui pengajuan Ahmad Fauzi/i });
    expect(approveBtn).toBeInTheDocument();
    fireEvent.click(approveBtn);
    expect(onApprove).toHaveBeenCalledWith(mockList[0]);

    const rejectBtn = screen.getByRole("button", { name: /Tolak pengajuan Ahmad Fauzi/i });
    expect(rejectBtn).toBeInTheDocument();
    fireEvent.click(rejectBtn);
    expect(onReject).toHaveBeenCalledWith(mockList[0]);
  });

  it("should show input grade button for scheduled status", () => {
    const onGrade = vi.fn();
    renderWithProviders(
      <SertifikasiTable {...defaultProps} onGrade={onGrade} />
    );

    const gradeBtn = screen.getByRole("button", { name: /Input nilai ujian Budi Santoso/i });
    expect(gradeBtn).toBeInTheDocument();
    fireEvent.click(gradeBtn);
    expect(onGrade).toHaveBeenCalledWith(mockList[1]);
  });

  it("should show detail button and trigger onDetail", () => {
    const onDetail = vi.fn();
    renderWithProviders(
      <SertifikasiTable {...defaultProps} onDetail={onDetail} />
    );

    const detailBtn = screen.getByRole("button", { name: /Lihat rincian Citra Dewi/i });
    expect(detailBtn).toBeInTheDocument();
    fireEvent.click(detailBtn);
    expect(onDetail).toHaveBeenCalledWith(mockList[2]);
  });
});
