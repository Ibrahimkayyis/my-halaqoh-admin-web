import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import GuruPage from "../page";
import * as guruHooks from "@/features/guru/hooks/use-guru";

vi.mock("@/features/guru/hooks/use-guru", () => ({
  useGetGuru: vi.fn(),
  useDeleteGuru: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
  useBulkDeleteGuru: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
  useResetPasswordGuru: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
  useCreateGuru: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
  useUpdateGuru: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
  useBulkCreateGuru: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
}));

describe("GuruPage Integration Test", () => {
  it("should render page subtitle, teacher table, and bulk delete FAB", () => {
    const mockGuruList = [
      { id: "g1", nip: "19880501201501", nama: "Ustadz Abdullah", program: "R", phone: "081234567890" },
    ];
    vi.mocked(guruHooks.useGetGuru).mockReturnValue({ data: mockGuruList, isLoading: false } as any);

    renderWithProviders(<GuruPage />);

    expect(screen.getByText(/Kelola data guru|Manage.*teachers/i)).toBeInTheDocument();
    expect(screen.getByText("Ustadz Abdullah")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Hapus Masal|Bulk Delete/i })).toBeInTheDocument();
    // Default state: no checkboxes in table
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });

  it("should toggle selection mode when FAB is clicked and allow cancelling", () => {
    const mockGuruList = [
      { id: "g1", nip: "19880501201501", nama: "Ustadz Abdullah", program: "R", phone: "081234567890" },
    ];
    vi.mocked(guruHooks.useGetGuru).mockReturnValue({ data: mockGuruList, isLoading: false } as any);

    renderWithProviders(<GuruPage />);

    // 1. Click FAB trigger to enter selection mode
    const fabTrigger = screen.getByRole("button", { name: /Hapus Masal|Bulk Delete/i });
    fireEvent.click(fabTrigger);

    // Checkboxes should appear
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes.length).toBeGreaterThan(0);

    // 2. Select teacher
    fireEvent.click(checkboxes[1]);
    expect(screen.getByText(/1 guru dipilih/i)).toBeInTheDocument();

    // 3. Click Cancel FAB button
    const cancelBtn = screen.getByRole("button", { name: /Batal|Cancel/i });
    fireEvent.click(cancelBtn);

    // Checkboxes should disappear
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });
});
