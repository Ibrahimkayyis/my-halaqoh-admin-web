import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import { SantriBulkDialog } from "../santri-bulk-dialog";
import * as santriHooks from "../../hooks/use-santri";

vi.mock("papaparse", () => ({
  default: {
    parse: vi.fn((_file: any, config: any) => {
      config.complete({
        data: [
          { NIS: "123456789012", "Nama Lengkap": "Santri Zaid", Kelas: "7R" },
        ],
      });
    }),
  },
}));

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

  it("should display error details with NIS and reason when import fails", async () => {
    mockMutateAsync.mockResolvedValueOnce({
      successCount: 0,
      failCount: 1,
      errors: [
        {
          nis: "123456789012",
          nama: "Santri Zaid",
          reason: "NIS sudah terdaftar.",
        },
      ],
    });

    renderWithProviders(
      <SantriBulkDialog open={true} onOpenChange={vi.fn()} />
    );

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const csvContent = "NIS,Nama Lengkap,Kelas\n123456789012,Santri Zaid,7R";
    const file = new File([csvContent], "santri.csv", { type: "text/csv" });

    fireEvent.change(fileInput, { target: { files: [file] } });

    // Wait for file parsing
    await waitFor(() => {
      const importBtn = screen.getByRole("button", { name: /Import|Impor/i });
      expect(importBtn).not.toBeDisabled();
    });

    const importBtn = screen.getByRole("button", { name: /Import|Impor/i });
    fireEvent.click(importBtn);

    // Verify error details are displayed
    expect(await screen.findByText(/NIS sudah terdaftar\./i)).toBeInTheDocument();
    expect(screen.getByText(/Santri Zaid/i)).toBeInTheDocument();
    expect(screen.getByText(/NIS: 123456789012/i)).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /Tutup|Close/i }).length).toBeGreaterThanOrEqual(1);
  });
});
