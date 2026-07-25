import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import { HalaqohForm } from "../halaqoh-form";
import * as useKelasHook from "@/features/kelas-program/hooks/use-kelas";
import * as useProgramHook from "@/features/kelas-program/hooks/use-program";
import type { Guru } from "@/features/guru/types/guru.types";
import type { Santri } from "@/features/santri/types/santri.types";

vi.mock("@/features/kelas-program/hooks/use-kelas", () => ({
  useGetKelas: vi.fn(),
}));

vi.mock("@/features/kelas-program/hooks/use-program", () => ({
  useGetProgram: vi.fn(),
}));

describe("HalaqohForm Component", () => {
  const mockGuruList: Guru[] = [
    {
      id: "g1",
      nip: "19880501201501",
      nama: "Ustadz Abdullah",
      program: "R",
      createdAt: null as any,
      updatedAt: null as any,
    },
  ];

  const mockSantriList: Santri[] = [
    {
      id: "s1",
      nis: "2024001",
      nama: "Muhammad Ali",
      kelas: "7",
      program: "R",
      isAlumni: false,
      createdAt: null as any,
      updatedAt: null as any,
    },
  ];

  const defaultProps = {
    onSubmit: vi.fn(),
    onCancel: vi.fn(),
    guruList: mockGuruList,
    allSantriList: mockSantriList,
    assignedGuruIds: new Set<string>(),
    assignedSantriIds: new Set<string>(),
  };

  beforeEach(() => {
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

  it("should render form inputs for creating a new halaqoh", () => {
    renderWithProviders(<HalaqohForm {...defaultProps} />);

    expect(screen.getByPlaceholderText(/e.g., AL FATIH 1/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Save|Simpan/i })).toBeInTheDocument();
  });

  it("should pre-populate form inputs when initialValues are provided", () => {
    const initialValues = {
      nama: "Halaqoh Abu Bakar",
      kelas: "7",
      program: "R" as const,
      guruId: "g1",
      guruNama: "Ustadz Abdullah",
      santriIds: ["s1"],
    };

    renderWithProviders(<HalaqohForm {...defaultProps} initialValues={initialValues} />);

    expect(screen.getByDisplayValue("Halaqoh Abu Bakar")).toBeInTheDocument();
    expect(screen.getByText("Muhammad Ali")).toBeInTheDocument();
  });

  it("should display validation errors when submitting empty form", async () => {
    renderWithProviders(<HalaqohForm {...defaultProps} />);

    const submitBtn = screen.getByRole("button", { name: /Save|Simpan/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Nama halaqoh wajib diisi")).toBeInTheDocument();
      expect(screen.getByText("Pilih kelas")).toBeInTheDocument();
    });

    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
  });

  it("should invoke onCancel when cancel button is clicked", () => {
    const onCancel = vi.fn();
    renderWithProviders(<HalaqohForm {...defaultProps} onCancel={onCancel} />);

    const cancelBtn = screen.getByRole("button", { name: /Cancel|Batal/i });
    fireEvent.click(cancelBtn);

    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
