import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import { KelasFormDialog } from "../kelas-form-dialog";
import * as kelasHooks from "../../hooks/use-kelas";

vi.mock("../../hooks/use-kelas", () => ({
  useGetKelas: vi.fn(),
  useCreateKelas: vi.fn(),
  useUpdateKelas: vi.fn(),
}));

describe("KelasFormDialog Component", () => {
  const mockCreateMutate = vi.fn();
  const mockUpdateMutate = vi.fn();

  beforeEach(() => {
    vi.mocked(kelasHooks.useGetKelas).mockReturnValue({
      data: [{ id: "k7", nama: "Kelas 7" }],
    } as any);

    vi.mocked(kelasHooks.useCreateKelas).mockReturnValue({
      mutateAsync: mockCreateMutate,
      isPending: false,
    } as any);

    vi.mocked(kelasHooks.useUpdateKelas).mockReturnValue({
      mutateAsync: mockUpdateMutate,
      isPending: false,
    } as any);
  });

  it("should render Add Class dialog title and inputs when open", () => {
    renderWithProviders(<KelasFormDialog open={true} onOpenChange={vi.fn()} />);

    expect(screen.getByRole("heading")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/13/i)).toBeInTheDocument();
  });

  it("should pre-populate inputs when defaultValues (edit mode) are provided", () => {
    const defaultValues = {
      id: "k7",
      nama: "Kelas 7",
      urutan: 1,
    };

    renderWithProviders(
      <KelasFormDialog open={true} onOpenChange={vi.fn()} defaultValues={defaultValues} />
    );

    expect(screen.getByRole("heading")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Kelas 7")).toBeInTheDocument();
    expect(screen.getByDisplayValue("1")).toBeInTheDocument();
  });

  it("should display validation error when submitting empty form", async () => {
    renderWithProviders(<KelasFormDialog open={true} onOpenChange={vi.fn()} />);

    const submitBtn = screen.getByRole("button", { name: /Save|Simpan/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Nama kelas wajib diisi")).toBeInTheDocument();
    });

    expect(mockCreateMutate).not.toHaveBeenCalled();
  });
});
