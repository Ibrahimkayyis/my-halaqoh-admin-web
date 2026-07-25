import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useGetTargetHafalan,
  useUpdateGlobalTarget,
} from "../use-target-hafalan";
import * as targetQueries from "@/lib/firestore/queries/target-hafalan.queries";
import { toast } from "sonner";
import React from "react";

vi.mock("@/lib/firestore/queries/target-hafalan.queries", () => ({
  getTargetHafalan: vi.fn(),
  updateGlobalTargetHafalan: vi.fn(),
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

describe("Target Hafalan TanStack Query Hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("useGetTargetHafalan should fetch target hafalan list", async () => {
    const mockTargets = [
      { id: "7_Reguler", kelas: "7", program: "Reguler", tahunAjaran: "2026/2027", semesterAktif: 1 },
    ];
    vi.mocked(targetQueries.getTargetHafalan).mockResolvedValue(mockTargets as any);

    const { result } = renderHook(() => useGetTargetHafalan(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockTargets);
    expect(targetQueries.getTargetHafalan).toHaveBeenCalledTimes(1);
  });

  it("useUpdateGlobalTarget should call updateGlobalTargetHafalan and show success toast", async () => {
    vi.mocked(targetQueries.updateGlobalTargetHafalan).mockResolvedValue(undefined as any);

    const { result } = renderHook(() => useUpdateGlobalTarget(), { wrapper: createWrapper() });

    const updatePayload = {
      tahunAjaran: "2026/2027",
      semesterAktif: 2 as const,
    };

    await result.current.mutateAsync(updatePayload);

    expect(targetQueries.updateGlobalTargetHafalan).toHaveBeenCalledWith("2026/2027", 2);
    expect(toast.success).toHaveBeenCalledWith("Konfigurasi target berhasil diperbarui");
  });
});
