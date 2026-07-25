import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import { ProgramFormDialog } from "../program-form-dialog";
import * as programHooks from "../../hooks/use-program";

vi.mock("../../hooks/use-program", () => ({
  useCreateProgram: vi.fn(),
  useUpdateProgram: vi.fn(),
}));

describe("ProgramFormDialog Component", () => {
  const mockCreateMutate = vi.fn();
  const mockUpdateMutate = vi.fn();

  beforeEach(() => {
    vi.mocked(programHooks.useCreateProgram).mockReturnValue({
      mutateAsync: mockCreateMutate,
      isPending: false,
    } as any);

    vi.mocked(programHooks.useUpdateProgram).mockReturnValue({
      mutateAsync: mockUpdateMutate,
      isPending: false,
    } as any);
  });

  it("should render Add Program dialog title and inputs when open", () => {
    renderWithProviders(<ProgramFormDialog open={true} onOpenChange={vi.fn()} />);

    expect(screen.getByRole("heading")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e\.g\. R, T/i)).toBeInTheDocument();
  });

  it("should pre-populate inputs and disable ID input when defaultValues (edit mode) are provided", () => {
    const defaultValues = {
      id: "R",
      nama: "Reguler",
    };

    renderWithProviders(
      <ProgramFormDialog open={true} onOpenChange={vi.fn()} defaultValues={defaultValues} />
    );

    expect(screen.getByRole("heading")).toBeInTheDocument();
    expect(screen.getByDisplayValue("R")).toBeDisabled();
    expect(screen.getByDisplayValue("Reguler")).toBeInTheDocument();
  });

  it("should display validation error when submitting empty form", async () => {
    renderWithProviders(<ProgramFormDialog open={true} onOpenChange={vi.fn()} />);

    const submitBtn = screen.getByRole("button", { name: /Save|Simpan/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Kode Program wajib diisi (contoh: R, T)")).toBeInTheDocument();
    });

    expect(mockCreateMutate).not.toHaveBeenCalled();
  });
});
