import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useGetProgram,
  useCreateProgram,
  useUpdateProgram,
  useDeleteProgram,
} from "../use-program";
import * as programQueries from "@/lib/firestore/queries/program.queries";
import { toast } from "sonner";
import React from "react";

vi.mock("@/lib/firestore/queries/program.queries", () => ({
  getProgram: vi.fn(),
  createProgram: vi.fn(),
  updateProgram: vi.fn(),
  deleteProgram: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe("Program TanStack Query Hooks (use-program)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("useGetProgram should fetch program list", async () => {
    const mockList = [
      { id: "R", nama: "Reguler" },
      { id: "T", nama: "Takhassus" },
    ];
    vi.mocked(programQueries.getProgram).mockResolvedValue(mockList as any);

    const { result } = renderHook(() => useGetProgram(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockList);
    expect(programQueries.getProgram).toHaveBeenCalledTimes(1);
  });

  it("useCreateProgram should call createProgram and show success toast", async () => {
    vi.mocked(programQueries.createProgram).mockResolvedValue(undefined as any);

    const { result } = renderHook(() => useCreateProgram(), { wrapper: createWrapper() });

    const newProgramData = {
      id: "R",
      nama: "Reguler",
    };

    await result.current.mutateAsync(newProgramData as any);

    expect(programQueries.createProgram).toHaveBeenCalledWith(newProgramData, expect.anything());
    expect(toast.success).toHaveBeenCalledWith("Program berhasil ditambahkan");
  });

  it("useUpdateProgram should call updateProgram and show success toast", async () => {
    vi.mocked(programQueries.updateProgram).mockResolvedValue(undefined);

    const { result } = renderHook(() => useUpdateProgram(), { wrapper: createWrapper() });

    const updatePayload = {
      id: "R",
      data: { nama: "Program Reguler" },
    };

    await result.current.mutateAsync(updatePayload);

    expect(programQueries.updateProgram).toHaveBeenCalledWith("R", { nama: "Program Reguler" });
    expect(toast.success).toHaveBeenCalledWith("Program berhasil diperbarui");
  });

  it("useDeleteProgram should call deleteProgram and show success toast", async () => {
    vi.mocked(programQueries.deleteProgram).mockResolvedValue(undefined);

    const { result } = renderHook(() => useDeleteProgram(), { wrapper: createWrapper() });

    await result.current.mutateAsync("R");

    expect(programQueries.deleteProgram).toHaveBeenCalledWith("R", expect.anything());
    expect(toast.success).toHaveBeenCalledWith("Program berhasil dihapus");
  });
});
