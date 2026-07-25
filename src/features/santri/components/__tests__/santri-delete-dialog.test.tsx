import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import { SantriDeleteDialog } from "../santri-delete-dialog";

describe("SantriDeleteDialog Component", () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    santriName: "Muhammad Ali",
    onConfirm: vi.fn(),
    isPending: false,
  };

  it("should render dialog title, student name, and warning text when open", () => {
    renderWithProviders(<SantriDeleteDialog {...defaultProps} />);

    expect(
      screen.getByRole("heading", { name: /Delete Student Data|Hapus Data Santri/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Muhammad Ali/i)).toBeInTheDocument();
  });

  it("should call onConfirm when delete button is clicked", () => {
    const onConfirm = vi.fn();
    renderWithProviders(<SantriDeleteDialog {...defaultProps} onConfirm={onConfirm} />);

    const deleteBtn = screen.getByRole("button", { name: /Delete Student|Hapus Santri/i });
    fireEvent.click(deleteBtn);

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("should call onOpenChange(false) when cancel button is clicked", () => {
    const onOpenChange = vi.fn();
    renderWithProviders(<SantriDeleteDialog {...defaultProps} onOpenChange={onOpenChange} />);

    const cancelBtn = screen.getByRole("button", { name: /Cancel|Batal/i });
    fireEvent.click(cancelBtn);

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
