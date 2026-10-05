import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import { GuruBulkDialog } from "../guru-bulk-dialog";
import * as guruHooks from "../../hooks/use-guru";

vi.mock("papaparse", () => ({
  default: {
    parse: vi.fn((_file: any, config: any) => {
      config.complete({
        data: [
          { NIP: "1234567890123", "Nama Lengkap": "Ustadz Budi", Program: "R" },
        ],
      });
    }),
  },
}));

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

  it("should display error details with NIP and reason when import fails", async () => {
    mockMutateAsync.mockResolvedValueOnce({
      successCount: 0,
      failCount: 1,
      errors: [
        {
          nip: "1234567890123",
          nama: "Ustadz Budi",
          reason: "NIP sudah terdaftar.",
        },
      ],
    });

    renderWithProviders(
      <GuruBulkDialog open={true} onOpenChange={vi.fn()} />
    );

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const csvContent = "NIP,Nama Lengkap,Program\n1234567890123,Ustadz Budi,R";
    const file = new File([csvContent], "guru.csv", { type: "text/csv" });

    fireEvent.change(fileInput, { target: { files: [file] } });

    // Wait for file parsing
    await waitFor(() => {
      const importBtn = screen.getByRole("button", { name: /Import|Impor/i });
      expect(importBtn).not.toBeDisabled();
    });

    const importBtn = screen.getByRole("button", { name: /Import|Impor/i });
    fireEvent.click(importBtn);

    // Verify error details are displayed
    expect(await screen.findByText(/NIP sudah terdaftar\./i)).toBeInTheDocument();
    expect(screen.getByText(/Ustadz Budi/i)).toBeInTheDocument();
    expect(screen.getByText(/NIP: 1234567890123/i)).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /Tutup|Close/i }).length).toBeGreaterThanOrEqual(1);
  });
});
