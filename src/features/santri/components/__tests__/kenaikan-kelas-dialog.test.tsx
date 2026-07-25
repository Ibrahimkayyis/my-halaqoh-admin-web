import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import { KenaikanKelasDialog } from "../kenaikan-kelas-dialog";
import * as santriHooks from "../../hooks/use-santri";
import * as useKelasHook from "@/features/kelas-program/hooks/use-kelas";
import type { Santri } from "../../types/santri.types";

vi.mock("../../hooks/use-santri", () => ({
  usePromoteAll: vi.fn(),
}));

vi.mock("@/features/kelas-program/hooks/use-kelas", () => ({
  useGetKelas: vi.fn(),
}));

describe("KenaikanKelasDialog Component", () => {
  const mockPromoteMutate = vi.fn();

  const mockActiveSantri: Santri[] = [
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
    {
      id: "s2",
      nis: "2024002",
      nama: "Ahmad Zaki",
      kelas: "12",
      program: "R",
      isAlumni: false,
      createdAt: null as any,
      updatedAt: null as any,
    },
  ];

  beforeEach(() => {
    vi.mocked(santriHooks.usePromoteAll).mockReturnValue({
      mutateAsync: mockPromoteMutate,
      isPending: false,
    } as any);

    vi.mocked(useKelasHook.useGetKelas).mockReturnValue({
      data: [
        { id: "k7", nama: "7", nextKelasId: "k8" },
        { id: "k12", nama: "12", nextKelasId: null },
      ],
    } as any);
  });

  it("should render class promotion wizard title, stats, and academic year controls", () => {
    renderWithProviders(
      <KenaikanKelasDialog open={true} onOpenChange={vi.fn()} activeSantri={mockActiveSantri} />
    );

    expect(screen.getByRole("heading", { name: /Student Class Promotion|Kenaikan Kelas/i })).toBeInTheDocument();
    expect(screen.getByText(/1 Promoted to Class|1 santri naik kelas/i)).toBeInTheDocument();
    expect(screen.getByText(/1 Graduated|1 santri lulus/i)).toBeInTheDocument();
  });

  it("should navigate to step 2 confirm preview when Process button is clicked", async () => {
    renderWithProviders(
      <KenaikanKelasDialog open={true} onOpenChange={vi.fn()} activeSantri={mockActiveSantri} />
    );

    const processBtn = screen.getByRole("button", { name: /^Class Promotion$|Proses Kenaikan Kelas/i });
    fireEvent.click(processBtn);

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /Academic Confirmation|Konfirmasi Kenaikan/i })).toBeInTheDocument();
    });
  });
});
