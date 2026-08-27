import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import { SantriTable } from "../santri-table";
import type { Santri } from "../../types/santri.types";

describe("SantriTable Component", () => {
  const mockSantriList: Santri[] = [
    {
      id: "s1",
      nis: "2024001",
      nama: "Muhammad Ali",
      kelas: "7",
      program: "R",
      isAlumni: false,
      authUid: "auth-santri-1",
      createdAt: null as any,
      updatedAt: null as any,
    },
    {
      id: "s2",
      nis: "2024002",
      nama: "Ahmad Zaki",
      kelas: "8",
      program: "T",
      isAlumni: true,
      authUid: undefined,
      createdAt: null as any,
      updatedAt: null as any,
    },
  ];

  const defaultProps = {
    data: mockSantriList,
    isLoading: false,
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    onResetPassword: vi.fn(),
  };

  it("should render loading skeleton when isLoading is true", () => {
    const { container } = renderWithProviders(
      <SantriTable {...defaultProps} data={[]} isLoading={true} />
    );

    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
  });

  it("should render empty state message when data is empty", () => {
    renderWithProviders(<SantriTable {...defaultProps} data={[]} isLoading={false} />);

    expect(
      screen.getByText(/Belum ada data santri|No student data available/i)
    ).toBeInTheDocument();
  });

  it("should render student row details including NIS, Nama, Kelas, & Program badges", () => {
    renderWithProviders(<SantriTable {...defaultProps} />);

    expect(screen.getByText("Muhammad Ali")).toBeInTheDocument();
    expect(screen.getByText("2024001")).toBeInTheDocument();
    expect(screen.getByText("Ahmad Zaki")).toBeInTheDocument();
    expect(screen.getByText("2024002")).toBeInTheDocument();
  });

  it("should invoke onEdit callback when edit button is clicked", () => {
    const onEdit = vi.fn();
    renderWithProviders(<SantriTable {...defaultProps} onEdit={onEdit} />);

    const editBtns = screen.getAllByRole("button", { name: /Edit|Ubah/i });
    fireEvent.click(editBtns[0]);

    expect(onEdit).toHaveBeenCalledWith(mockSantriList[0]);
  });

  it("should invoke onDelete callback when delete button is clicked", () => {
    const onDelete = vi.fn();
    renderWithProviders(<SantriTable {...defaultProps} onDelete={onDelete} />);

    const deleteBtns = screen.getAllByRole("button", { name: /Hapus|Delete/i });
    fireEvent.click(deleteBtns[0]);

    expect(onDelete).toHaveBeenCalledWith(mockSantriList[0]);
  });

  it("should invoke onResetPassword callback when reset password button is clicked for santri with authUid", () => {
    const onResetPassword = vi.fn();
    renderWithProviders(<SantriTable {...defaultProps} onResetPassword={onResetPassword} />);

    const resetBtns = screen.getAllByRole("button", { name: /Reset Password/i });
    fireEvent.click(resetBtns[0]);

    expect(onResetPassword).toHaveBeenCalledWith(mockSantriList[0]);
  });

  it("should disable reset password button if santri has no authUid", () => {
    renderWithProviders(<SantriTable {...defaultProps} />);

    const resetBtns = screen.getAllByRole("button", { name: /Reset Password/i });
    expect(resetBtns[1]).toBeDisabled();
  });

  it("should not render checkboxes when isSelectionMode is false", () => {
    renderWithProviders(<SantriTable {...defaultProps} isSelectionMode={false} />);

    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });

  it("should call onToggleSelect when row checkbox is clicked in selection mode", () => {
    const onToggleSelect = vi.fn();
    renderWithProviders(
      <SantriTable
        {...defaultProps}
        isSelectionMode={true}
        selectedIds={["s1"]}
        onToggleSelect={onToggleSelect}
      />
    );

    const checkboxes = screen.getAllByRole("checkbox");
    // checkboxes[0] is header checkbox, checkboxes[1] is first row
    fireEvent.click(checkboxes[1]);
    expect(onToggleSelect).toHaveBeenCalledWith("s1");
  });

  it("should call onToggleSelectAll when header checkbox is clicked in selection mode", () => {
    const onToggleSelectAll = vi.fn();
    renderWithProviders(
      <SantriTable
        {...defaultProps}
        isSelectionMode={true}
        onToggleSelectAll={onToggleSelectAll}
      />
    );

    const headerCheckbox = screen.getByRole("checkbox", { name: /Pilih Semua Santri/i });
    fireEvent.click(headerCheckbox);
    expect(onToggleSelectAll).toHaveBeenCalledWith(["s1", "s2"]);
  });
});
