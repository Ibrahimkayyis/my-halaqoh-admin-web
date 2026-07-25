import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import TargetHafalanPage from "../page";
import * as targetHooks from "@/features/target-hafalan/hooks/use-target-hafalan";

vi.mock("@/features/target-hafalan/hooks/use-target-hafalan", () => ({
  useGetTargetHafalan: vi.fn(),
  useUpdateGlobalTarget: vi.fn(),
}));

vi.mock("firebase/firestore", () => ({
  collection: vi.fn(),
  getDocs: vi.fn(() => Promise.resolve({ docs: [] })),
  writeBatch: vi.fn(() => ({ delete: vi.fn(), commit: vi.fn() })),
  doc: vi.fn(),
}));

vi.mock("@/lib/firebase/config", () => ({
  db: {},
}));

describe("TargetHafalanPage Integration Test", () => {
  const mockMutate = vi.fn();

  beforeEach(() => {
    vi.mocked(targetHooks.useUpdateGlobalTarget).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as any);
  });

  it("should render loading state skeleton when query is loading", () => {
    vi.mocked(targetHooks.useGetTargetHafalan).mockReturnValue({
      data: [],
      isLoading: true,
      isError: false,
    } as any);

    const { container } = renderWithProviders(<TargetHafalanPage />);

    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
  });

  it("should render error state and retry button when query fails", () => {
    const refetch = vi.fn();
    vi.mocked(targetHooks.useGetTargetHafalan).mockReturnValue({
      data: [],
      isLoading: false,
      isError: true,
      refetch,
    } as any);

    renderWithProviders(<TargetHafalanPage />);

    expect(screen.getByText(/Error|Gagal/i)).toBeInTheDocument();
    const retryBtn = screen.getByRole("button", { name: /Retry|Coba lagi/i });
    fireEvent.click(retryBtn);

    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("should render TargetTabView with targets data and trigger update on semester change", () => {
    const mockTargets = [
      { id: "7_Reguler", kelas: "7", program: "Reguler", tahunAjaran: "2026/2027", semesterAktif: 1 },
    ];
    vi.mocked(targetHooks.useGetTargetHafalan).mockReturnValue({
      data: mockTargets,
      isLoading: false,
      isError: false,
    } as any);

    renderWithProviders(<TargetHafalanPage />);

    expect(screen.getByText("2026/2027")).toBeInTheDocument();
    const sem2Btn = screen.getByRole("button", { name: /Semester 2/i });
    fireEvent.click(sem2Btn);

    expect(mockMutate).toHaveBeenCalledWith({
      tahunAjaran: "2026/2027",
      semesterAktif: 2,
    });
  });
});
