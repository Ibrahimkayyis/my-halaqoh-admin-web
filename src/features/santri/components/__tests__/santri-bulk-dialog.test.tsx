import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import { SantriBulkDialog } from "../santri-bulk-dialog";
import * as santriHooks from "../../hooks/use-santri";

vi.mock("../../hooks/use-santri", () => ({
  useBulkCreateSantri: vi.fn(),
}));

describe("SantriBulkDialog Component", () => {
  const mockMutateAsync = vi.fn();

  beforeEach(() => {
    vi.mocked(santriHooks.useBulkCreateSantri).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    } as any);
  });

  it("should render bulk import title, subtitle, and dropzone area", () => {
    renderWithProviders(<SantriBulkDialog open={true} onOpenChange={vi.fn()} />);

    expect(
      screen.getByText(/Upload CSV\/XLSX/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Download Template|Unduh Template/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Drag & drop CSV \/ XLSX file|Tarik & lepas file CSV \/ XLSX/i)
    ).toBeInTheDocument();
  });

  it("should handle download template click when button is clicked", () => {
    renderWithProviders(<SantriBulkDialog open={true} onOpenChange={vi.fn()} />);

    const downloadBtn = screen.getByRole("button", { name: /Download Template|Unduh Template/i });
    expect(downloadBtn).not.toBeDisabled();
    fireEvent.click(downloadBtn);
  });

  it("should call onOpenChange(false) when cancel button is clicked", () => {
    const onOpenChange = vi.fn();
    renderWithProviders(<SantriBulkDialog open={true} onOpenChange={onOpenChange} />);

    const cancelBtn = screen.getByRole("button", { name: /Cancel|Batal/i });
    fireEvent.click(cancelBtn);

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
