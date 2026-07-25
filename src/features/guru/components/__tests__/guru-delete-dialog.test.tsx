import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import { GuruDeleteDialog } from "../guru-delete-dialog";

describe("GuruDeleteDialog Component", () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    guruName: "Ustadz Abdullah",
    onConfirm: vi.fn(),
    isPending: false,
  };

  it("should render teacher name and warning text when open", () => {
    renderWithProviders(<GuruDeleteDialog {...defaultProps} />);

    expect(
      screen.getByRole("heading", { name: /Hapus Data Guru|Delete Teacher Data/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Ustadz Abdullah/i)).toBeInTheDocument();
  });

  it("should call onConfirm when delete button is clicked", () => {
    const onConfirm = vi.fn();
    renderWithProviders(<GuruDeleteDialog {...defaultProps} onConfirm={onConfirm} />);

    const deleteBtn = screen.getByRole("button", { name: /Hapus|Delete Teacher/i });
    fireEvent.click(deleteBtn);

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("should call onOpenChange(false) when cancel button is clicked", () => {
    const onOpenChange = vi.fn();
    renderWithProviders(<GuruDeleteDialog {...defaultProps} onOpenChange={onOpenChange} />);

    const cancelBtn = screen.getByRole("button", { name: /Batal|Cancel/i });
    fireEvent.click(cancelBtn);

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
