import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import { HalaqohCard } from "../halaqoh-card";
import type { Halaqoh } from "@/types/models/halaqoh.types";

describe("HalaqohCard Component", () => {
  const mockHalaqoh: Halaqoh = {
    id: "h1",
    nama: "Halaqoh Abu Bakar As-Siddiq",
    kelas: "7",
    program: "R",
    guruId: "g1",
    guruNama: "Ustadz Abdullah",
    jumlahSantri: 12,
    santriIds: ["s1", "s2"],
    createdAt: null as any,
    updatedAt: null as any,
  };

  it("should render halaqoh name, teacher name, santri count, class & program badges", () => {
    renderWithProviders(<HalaqohCard halaqoh={mockHalaqoh} />);

    expect(screen.getByText("Halaqoh Abu Bakar As-Siddiq")).toBeInTheDocument();
    expect(screen.getByText("Ustadz Abdullah")).toBeInTheDocument();
    expect(screen.getByText(/12 Santri|12 Students/i)).toBeInTheDocument();
    expect(screen.getByText(/Kelas 7|Class 7/i)).toBeInTheDocument();
    expect(screen.getByText(/Reguler/i)).toBeInTheDocument();
  });

  it("should invoke onEdit callback when edit button is clicked", () => {
    const onEdit = vi.fn();
    renderWithProviders(<HalaqohCard halaqoh={mockHalaqoh} onEdit={onEdit} />);

    const editBtn = screen.getByRole("button", { name: /Edit|Ubah/i });
    fireEvent.click(editBtn);

    expect(onEdit).toHaveBeenCalledWith(mockHalaqoh);
  });

  it("should invoke onDelete callback when delete button is clicked", () => {
    const onDelete = vi.fn();
    renderWithProviders(<HalaqohCard halaqoh={mockHalaqoh} onDelete={onDelete} />);

    const deleteBtn = screen.getByRole("button", { name: /Hapus|Delete/i });
    fireEvent.click(deleteBtn);

    expect(onDelete).toHaveBeenCalledWith(mockHalaqoh);
  });
});
