import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import { GuruBulkDialog } from "../guru-bulk-dialog";
import * as guruHooks from "../../hooks/use-guru";

vi.mock("../../hooks/use-guru", () => ({
  useBulkCreateGuru: vi.fn(),
}));

describe("GuruBulkDialog Component", () => {
  const mockMutateAsync = vi.fn();

  beforeEach(() => {
    vi.mocked(guruHooks.useBulkCreateGuru).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    } as any);
  });

  it("should render bulk import title, subtitle, and dropzone area", () => {
    renderWithProviders(<GuruBulkDialog open={true} onOpenChange={vi.fn()} />);

    expect(
      screen.getByText(/Upload CSV\/XLSX/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Unduh Template|Download Template/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Tarik & lepas file CSV \/ XLSX di sini|Drag & drop CSV \/ XLSX file/i)
    ).toBeInTheDocument();
  });

  it("should call onOpenChange(false) when cancel button is clicked", () => {
    const onOpenChange = vi.fn();
    renderWithProviders(<GuruBulkDialog open={true} onOpenChange={onOpenChange} />);

    const cancelBtn = screen.getByRole("button", { name: /Batal|Cancel/i });
    fireEvent.click(cancelBtn);

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("should disable import button when no file is selected", () => {
    renderWithProviders(<GuruBulkDialog open={true} onOpenChange={vi.fn()} />);

    const importBtn = screen.getByRole("button", { name: /Import|Impor/i });
    expect(importBtn).toBeDisabled();
  });
});
