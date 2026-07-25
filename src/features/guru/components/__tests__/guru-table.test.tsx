import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import { GuruTable } from "../guru-table";
import type { Guru } from "../../types/guru.types";

describe("GuruTable Component", () => {
  const mockGuruList: Guru[] = [
    {
      id: "g1",
      nip: "19880501201501",
      nama: "Ustadz Abdullah",
      program: "R",
      phone: "081234567890",
      authUid: "auth-123",
      createdAt: null as any,
      updatedAt: null as any,
    },
    {
      id: "g2",
      nip: "19880501201502",
      nama: "Ustadz Faisal",
      program: "T",
      phone: "081234567891",
      authUid: undefined,
      createdAt: null as any,
      updatedAt: null as any,
    },
  ];

  const defaultProps = {
    data: mockGuruList,
    isLoading: false,
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    onResetPassword: vi.fn(),
  };

  it("should render loading skeleton when isLoading is true", () => {
    const { container } = renderWithProviders(
      <GuruTable {...defaultProps} data={[]} isLoading={true} />
    );

    // Skeletons are rendered
    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
  });

  it("should render empty state message when data is empty", () => {
    renderWithProviders(<GuruTable {...defaultProps} data={[]} isLoading={false} />);

    expect(
      screen.getByText(/Belum ada data guru|No teacher data available/i)
    ).toBeInTheDocument();
  });

  it("should render table headers and teacher row details", () => {
    renderWithProviders(<GuruTable {...defaultProps} />);

    expect(screen.getByText("Ustadz Abdullah")).toBeInTheDocument();
    expect(screen.getByText("19880501201501")).toBeInTheDocument();
    expect(screen.getByText("Ustadz Faisal")).toBeInTheDocument();
    expect(screen.getByText("19880501201502")).toBeInTheDocument();
  });

  it("should invoke onEdit callback when edit action button is clicked", () => {
    const onEdit = vi.fn();
    renderWithProviders(<GuruTable {...defaultProps} onEdit={onEdit} />);

    const editBtns = screen.getAllByRole("button", { name: /Edit|Ubah/i });
    fireEvent.click(editBtns[0]);

    expect(onEdit).toHaveBeenCalledWith(mockGuruList[0]);
  });

  it("should invoke onDelete callback when delete action button is clicked", () => {
    const onDelete = vi.fn();
    renderWithProviders(<GuruTable {...defaultProps} onDelete={onDelete} />);

    const deleteBtns = screen.getAllByRole("button", { name: /Hapus|Delete/i });
    fireEvent.click(deleteBtns[0]);

    expect(onDelete).toHaveBeenCalledWith(mockGuruList[0]);
  });

  it("should invoke onResetPassword callback when reset password button is clicked for user with authUid", () => {
    const onResetPassword = vi.fn();
    renderWithProviders(<GuruTable {...defaultProps} onResetPassword={onResetPassword} />);

    const resetBtns = screen.getAllByRole("button", { name: /Reset Password/i });
    fireEvent.click(resetBtns[0]);

    expect(onResetPassword).toHaveBeenCalledWith(mockGuruList[0]);
  });

  it("should disable reset password button if guru has no authUid", () => {
    renderWithProviders(<GuruTable {...defaultProps} />);

    const resetBtns = screen.getAllByRole("button", { name: /Reset Password/i });
    // Second guru (g2) has authUid = undefined
    expect(resetBtns[1]).toBeDisabled();
  });
});
