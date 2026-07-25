import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import { KelasTab } from "../kelas-tab";
import * as kelasHooks from "../../hooks/use-kelas";

vi.mock("../../hooks/use-kelas", () => ({
  useGetKelas: vi.fn(),
  useDeleteKelas: vi.fn(),
  useCreateKelas: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
  useUpdateKelas: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
}));

describe("KelasTab Component", () => {
  const mockDeleteMutate = vi.fn();

  beforeEach(() => {
    vi.mocked(kelasHooks.useDeleteKelas).mockReturnValue({
      mutate: mockDeleteMutate,
      isPending: false,
    } as any);
  });

  it("should render loading state when isLoading is true", () => {
    vi.mocked(kelasHooks.useGetKelas).mockReturnValue({
      data: [],
      isLoading: true,
    } as any);

    renderWithProviders(<KelasTab />);

    expect(screen.getByText(/Loading...|Memuat.../i)).toBeInTheDocument();
  });

  it("should render empty state message when kelas list is empty", () => {
    vi.mocked(kelasHooks.useGetKelas).mockReturnValue({
      data: [],
      isLoading: false,
    } as any);

    renderWithProviders(<KelasTab />);

    expect(screen.getByText(/No class data available|Belum ada kelas/i)).toBeInTheDocument();
  });

  it("should render class cards with name, order, and action buttons", () => {
    const mockKelasList = [
      { id: "k7", nama: "Kelas 7", urutan: 1, nextKelasId: "k8" },
      { id: "k8", nama: "Kelas 8", urutan: 2, nextKelasId: null },
    ];
    vi.mocked(kelasHooks.useGetKelas).mockReturnValue({
      data: mockKelasList,
      isLoading: false,
    } as any);

    renderWithProviders(<KelasTab />);

    expect(screen.getByText("Kelas 7")).toBeInTheDocument();
    expect(screen.getByText("Kelas 8")).toBeInTheDocument();
    expect(screen.getByText(/Class Order: 1|Urutan: 1/i)).toBeInTheDocument();
  });

  it("should open edit dialog when edit button is clicked", () => {
    const mockKelasList = [
      { id: "k7", nama: "Kelas 7", urutan: 1, nextKelasId: "k8" },
    ];
    vi.mocked(kelasHooks.useGetKelas).mockReturnValue({
      data: mockKelasList,
      isLoading: false,
    } as any);

    const { container } = renderWithProviders(<KelasTab />);

    const editBtn = container.querySelector("button:has(.lucide-pen)") || screen.getAllByRole("button")[0];
    fireEvent.click(editBtn);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
