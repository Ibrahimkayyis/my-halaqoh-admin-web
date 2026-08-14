import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import { ProgramTab } from "../program-tab";
import * as programHooks from "../../hooks/use-program";

vi.mock("../../hooks/use-program", () => ({
  useGetProgram: vi.fn(),
  useDeleteProgram: vi.fn(),
  useCreateProgram: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
  useUpdateProgram: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
}));

describe("ProgramTab Component", () => {
  const mockDeleteMutate = vi.fn();

  beforeEach(() => {
    vi.mocked(programHooks.useDeleteProgram).mockReturnValue({
      mutate: mockDeleteMutate,
      isPending: false,
    } as any);
  });

  it("should render loading state when isLoading is true", () => {
    vi.mocked(programHooks.useGetProgram).mockReturnValue({
      data: [],
      isLoading: true,
    } as any);

    renderWithProviders(<ProgramTab />);

    expect(screen.getByText(/Loading...|Memuat.../i)).toBeInTheDocument();
  });

  it("should render empty state message when program list is empty", () => {
    vi.mocked(programHooks.useGetProgram).mockReturnValue({
      data: [],
      isLoading: false,
    } as any);

    renderWithProviders(<ProgramTab />);

    expect(screen.getByText(/No program data available|Belum ada program/i)).toBeInTheDocument();
  });

  it("should render program cards with name and code", () => {
    const mockProgramList = [
      { id: "R", nama: "Reguler" },
      { id: "T", nama: "Takhassus" },
    ];
    vi.mocked(programHooks.useGetProgram).mockReturnValue({
      data: mockProgramList,
      isLoading: false,
    } as any);

    renderWithProviders(<ProgramTab />);

    expect(screen.getByText("Program Reguler")).toBeInTheDocument();
    expect(screen.getByText("Program Takhassus")).toBeInTheDocument();
    expect(screen.getByText("R")).toBeInTheDocument();
  });

  it("should open edit dialog when edit button is clicked", () => {
    const mockProgramList = [{ id: "R", nama: "Reguler" }];
    vi.mocked(programHooks.useGetProgram).mockReturnValue({
      data: mockProgramList,
      isLoading: false,
    } as any);

    const { container } = renderWithProviders(<ProgramTab />);

    const editBtn = container.querySelector("button:has(.lucide-pen)") || screen.getAllByRole("button")[0];
    fireEvent.click(editBtn);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
