import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import { SantriBulkDeleteDialog } from "../santri-bulk-delete-dialog";
import { Timestamp } from "firebase/firestore";
import type { Santri } from "../../types/santri.types";

describe("SantriBulkDeleteDialog Component", () => {
  const mockSantris: Santri[] = [
    {
      id: "santri-1",
      nis: "123456789012",
      nama: "Ahmad Fauzi",
      kelas: "7",
      program: "R",
      isAlumni: false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    },
    {
      id: "santri-2",
      nis: "123456789013",
      nama: "Budi Santoso",
      kelas: "8",
      program: "T",
      isAlumni: false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    },
  ];

  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    selectedSantris: mockSantris,
    onConfirm: vi.fn(),
    isPending: false,
  };

  it("should render dialog title, count, and selected students in preview list", () => {
    renderWithProviders(<SantriBulkDeleteDialog {...defaultProps} />);

    expect(
      screen.getByRole("heading", { name: /Hapus Masal Santri|Bulk Delete Students/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Ahmad Fauzi/i)).toBeInTheDocument();
    expect(screen.getByText(/Budi Santoso/i)).toBeInTheDocument();
    expect(screen.getByText(/123456789012/i)).toBeInTheDocument();
    expect(screen.getByText(/123456789013/i)).toBeInTheDocument();
  });

  it("should call onConfirm when delete button is clicked", () => {
    const onConfirm = vi.fn();
    renderWithProviders(<SantriBulkDeleteDialog {...defaultProps} onConfirm={onConfirm} />);

    const deleteBtn = screen.getByRole("button", { name: /Hapus 2 Santri|Delete 2 Students/i });
    fireEvent.click(deleteBtn);

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("should call onOpenChange(false) when cancel button is clicked", () => {
    const onOpenChange = vi.fn();
    renderWithProviders(<SantriBulkDeleteDialog {...defaultProps} onOpenChange={onOpenChange} />);

    const cancelBtn = screen.getByRole("button", { name: /Batal|Cancel/i });
    fireEvent.click(cancelBtn);

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
