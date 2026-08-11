import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useGetHalaqoh,
  useCreateHalaqoh,
  useUpdateHalaqoh,
  useDeleteHalaqoh,
  useBulkCreateHalaqoh,
} from "../use-halaqoh";
import * as halaqohQueries from "@/lib/firestore/queries/halaqoh.queries";
import { toast } from "sonner";
import { mockRouter } from "../../../../../vitest.setup";
import React from "react";

vi.mock("@/lib/firestore/queries/halaqoh.queries", () => ({
  getAllHalaqoh: vi.fn(),
  createHalaqoh: vi.fn(),
  updateHalaqoh: vi.fn(),
  deleteHalaqoh: vi.fn(),
  bulkCreateHalaqoh: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    warning: vi.fn(),
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

describe("Halaqoh TanStack Query Hooks (use-halaqoh)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("useGetHalaqoh should fetch halaqoh list", async () => {
    const mockList = [
      { id: "h1", nama: "Halaqoh Abu Bakar", kelas: "7", program: "R", guruNama: "Ustadz A", jumlahSantri: 10 },
    ];
    vi.mocked(halaqohQueries.getAllHalaqoh).mockResolvedValue(mockList as any);

    const { result } = renderHook(() => useGetHalaqoh(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockList);
    expect(halaqohQueries.getAllHalaqoh).toHaveBeenCalledTimes(1);
  });

  it("useCreateHalaqoh should call createHalaqoh, show toast, and redirect to /halaqoh", async () => {
    vi.mocked(halaqohQueries.createHalaqoh).mockResolvedValue("h-new-123");

    const { result } = renderHook(() => useCreateHalaqoh(), { wrapper: createWrapper() });

    const newHalaqohData = {
      nama: "Halaqoh Umar",
      kelas: "8",
      program: "R" as const,
      guruId: "g1",
      guruNama: "Ustadz B",
      santriIds: ["s1", "s2"],
    };

    await result.current.mutateAsync(newHalaqohData);

    expect(halaqohQueries.createHalaqoh).toHaveBeenCalledWith(newHalaqohData);
    expect(toast.success).toHaveBeenCalledWith("Halaqoh berhasil ditambahkan");
    expect(mockRouter.push).toHaveBeenCalledWith("/halaqoh");
  });

  it("useUpdateHalaqoh should call updateHalaqoh, show toast, and redirect to /halaqoh", async () => {
    vi.mocked(halaqohQueries.updateHalaqoh).mockResolvedValue();

    const { result } = renderHook(() => useUpdateHalaqoh(), { wrapper: createWrapper() });

    const updatePayload = {
      id: "h1",
      data: {
        nama: "Halaqoh Abu Bakar Updated",
        kelas: "7",
        program: "R" as const,
        guruId: "g1",
        guruNama: "Ustadz A",
        santriIds: ["s1"],
      },
    };

    await result.current.mutateAsync(updatePayload);

    expect(halaqohQueries.updateHalaqoh).toHaveBeenCalledWith("h1", updatePayload.data);
    expect(toast.success).toHaveBeenCalledWith("Halaqoh berhasil diperbarui");
    expect(mockRouter.push).toHaveBeenCalledWith("/halaqoh");
  });

  it("useDeleteHalaqoh should call deleteHalaqoh and show toast success", async () => {
    vi.mocked(halaqohQueries.deleteHalaqoh).mockResolvedValue();

    const { result } = renderHook(() => useDeleteHalaqoh(), { wrapper: createWrapper() });

    await result.current.mutateAsync("h1");

    expect(halaqohQueries.deleteHalaqoh).toHaveBeenCalledWith("h1", expect.anything());
    expect(toast.success).toHaveBeenCalledWith("Halaqoh berhasil dihapus");
  });

  it("useBulkCreateHalaqoh should trigger toast.success when failCount is 0", async () => {
    vi.mocked(halaqohQueries.bulkCreateHalaqoh).mockResolvedValue({
      successCount: 2,
      failCount: 0,
      errors: [],
      warnings: [],
    });

    const { result } = renderHook(() => useBulkCreateHalaqoh(), { wrapper: createWrapper() });

    const bulkData = [
      { nama: "Halaqoh A", kelas: "7", program: "R" as const, nipGuru: "123", nisSantriList: ["s1"] },
      { nama: "Halaqoh B", kelas: "8", program: "T" as const, nipGuru: "456", nisSantriList: ["s2"] },
    ];

    await result.current.mutateAsync(bulkData);

    expect(halaqohQueries.bulkCreateHalaqoh).toHaveBeenCalledWith(bulkData);
    expect(toast.success).toHaveBeenCalledWith("2 halaqoh berhasil diimport");
  });

  it("useBulkCreateHalaqoh should trigger toast.warning when failCount > 0", async () => {
    vi.mocked(halaqohQueries.bulkCreateHalaqoh).mockResolvedValue({
      successCount: 1,
      failCount: 1,
      errors: [{ nama: "Halaqoh B", reason: "NIP Guru tidak ditemukan" }],
      warnings: [],
    });

    const { result } = renderHook(() => useBulkCreateHalaqoh(), { wrapper: createWrapper() });

    await result.current.mutateAsync([]);

    expect(toast.warning).toHaveBeenCalledWith("1 berhasil, 1 gagal");
  });
});

