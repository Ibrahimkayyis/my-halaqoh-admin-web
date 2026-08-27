import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import { GuruBulkDeleteDialog } from "../guru-bulk-delete-dialog";
import { Timestamp } from "firebase/firestore";
import type { Guru } from "../../types/guru.types";

describe("GuruBulkDeleteDialog Component", () => {
  const mockGurus: Guru[] = [
    {
      id: "guru-1",
      nama: "Ustadz Abdullah",
      nip: "198501012010011001",
      program: "R",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    },
    {
      id: "guru-2",
      nama: "Ustadz Bukhari",
      nip: "198501012010011002",
      program: "T",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    },
  ];

  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    selectedGurus: mockGurus,
    onConfirm: vi.fn(),
    isPending: false,
  };

  it("should render dialog title, count, and selected teachers in preview list", () => {
    renderWithProviders(<GuruBulkDeleteDialog {...defaultProps} />);

    expect(
      screen.getByRole("heading", { name: /Hapus Masal Guru|Bulk Delete Teachers/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Ustadz Abdullah/i)).toBeInTheDocument();
    expect(screen.getByText(/Ustadz Bukhari/i)).toBeInTheDocument();
    expect(screen.getByText(/198501012010011001/i)).toBeInTheDocument();
    expect(screen.getByText(/198501012010011002/i)).toBeInTheDocument();
  });

  it("should call onConfirm when delete button is clicked", () => {
    const onConfirm = vi.fn();
    renderWithProviders(<GuruBulkDeleteDialog {...defaultProps} onConfirm={onConfirm} />);

    const deleteBtn = screen.getByRole("button", { name: /Hapus 2 Guru|Delete 2 Teachers/i });
    fireEvent.click(deleteBtn);

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("should call onOpenChange(false) when cancel button is clicked", () => {
    const onOpenChange = vi.fn();
    renderWithProviders(<GuruBulkDeleteDialog {...defaultProps} onOpenChange={onOpenChange} />);

    const cancelBtn = screen.getByRole("button", { name: /Batal|Cancel/i });
    fireEvent.click(cancelBtn);

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
