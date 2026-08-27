import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useGetGuru,
  useCreateGuru,
  useUpdateGuru,
  useDeleteGuru,
  useBulkDeleteGuru,
  useBulkCreateGuru,
  useResetPasswordGuru,
} from "../use-guru";
import * as guruQueries from "@/lib/firestore/queries/guru.queries";
import { toast } from "sonner";
import React from "react";

vi.mock("@/lib/firestore/queries/guru.queries", () => ({
  getAllGuru: vi.fn(),
  createGuru: vi.fn(),
  updateGuru: vi.fn(),
  deleteGuru: vi.fn(),
  bulkDeleteGuru: vi.fn(),
  bulkCreateGuru: vi.fn(),
  resetGuruPassword: vi.fn(),
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

describe("Guru TanStack Query Hooks (use-guru)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("useGetGuru should fetch teacher list", async () => {
    const mockList = [
      { id: "g1", nip: "123", nama: "Ustadz Abdullah", program: "R" },
    ];
    vi.mocked(guruQueries.getAllGuru).mockResolvedValue(mockList as any);

    const { result } = renderHook(() => useGetGuru(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockList);
    expect(guruQueries.getAllGuru).toHaveBeenCalledTimes(1);
  });

  it("useCreateGuru should call createGuru and show success toast", async () => {
    vi.mocked(guruQueries.createGuru).mockResolvedValue("new-id-123");

    const { result } = renderHook(() => useCreateGuru(), { wrapper: createWrapper() });

    const newGuruData = {
      nip: "1988050120150",
      nama: "Ustadz Faisal",
      program: "R" as const,
      phone: "+62812345",
    };

    await result.current.mutateAsync(newGuruData);

    expect(guruQueries.createGuru).toHaveBeenCalledWith(newGuruData);
    expect(toast.success).toHaveBeenCalledWith("Guru berhasil ditambahkan");
  });

  it("useUpdateGuru should call updateGuru and show success toast", async () => {
    vi.mocked(guruQueries.updateGuru).mockResolvedValue();

    const { result } = renderHook(() => useUpdateGuru(), { wrapper: createWrapper() });

    const updatePayload = {
      id: "guru-1",
      data: { nama: "Ustadz Faisal Updated" },
    };

    await result.current.mutateAsync(updatePayload);

    expect(guruQueries.updateGuru).toHaveBeenCalledWith("guru-1", { nama: "Ustadz Faisal Updated" });
    expect(toast.success).toHaveBeenCalledWith("Data guru berhasil diperbarui");
  });

  it("useDeleteGuru should call deleteGuru and show success toast", async () => {
    vi.mocked(guruQueries.deleteGuru).mockResolvedValue();

    const { result } = renderHook(() => useDeleteGuru(), { wrapper: createWrapper() });

    await result.current.mutateAsync("guru-1");

    expect(guruQueries.deleteGuru).toHaveBeenCalledWith("guru-1", expect.anything());
    expect(toast.success).toHaveBeenCalledWith("Guru berhasil dihapus");
  });

  it("useBulkDeleteGuru should call bulkDeleteGuru and show success toast", async () => {
    vi.mocked(guruQueries.bulkDeleteGuru).mockResolvedValue();

    const { result } = renderHook(() => useBulkDeleteGuru(), { wrapper: createWrapper() });

    await result.current.mutateAsync(["guru-1", "guru-2"]);

    expect(guruQueries.bulkDeleteGuru).toHaveBeenCalledWith(["guru-1", "guru-2"]);
    expect(toast.success).toHaveBeenCalledWith("Berhasil menghapus 2 data guru");
  });

  it("useBulkCreateGuru should trigger toast.success when failCount is 0", async () => {
    vi.mocked(guruQueries.bulkCreateGuru).mockResolvedValue({
      successCount: 5,
      failCount: 0,
      errors: [],
    });

    const { result } = renderHook(() => useBulkCreateGuru(), { wrapper: createWrapper() });

    const bulkData = [
      { nip: "101", nama: "Guru 1", program: "R" as const },
      { nip: "102", nama: "Guru 2", program: "T" as const },
    ];

    await result.current.mutateAsync(bulkData);

    expect(guruQueries.bulkCreateGuru).toHaveBeenCalledWith(bulkData);
    expect(toast.success).toHaveBeenCalledWith("5 guru berhasil diimport");
  });

  it("useBulkCreateGuru should trigger toast.warning when failCount > 0", async () => {
    vi.mocked(guruQueries.bulkCreateGuru).mockResolvedValue({
      successCount: 3,
      failCount: 2,
      errors: [
        { nip: "104", nama: "Guru 4", reason: "NIP Duplicate" },
      ],
    });

    const { result } = renderHook(() => useBulkCreateGuru(), { wrapper: createWrapper() });

    await result.current.mutateAsync([]);

    expect(toast.warning).toHaveBeenCalledWith("3 berhasil, 2 gagal");
  });

  it("useResetPasswordGuru should call resetGuruPassword and show success toast", async () => {
    vi.mocked(guruQueries.resetGuruPassword).mockResolvedValue(undefined);

    const { result } = renderHook(() => useResetPasswordGuru(), { wrapper: createWrapper() });

    await result.current.mutateAsync("auth-uid-123");

    expect(guruQueries.resetGuruPassword).toHaveBeenCalledWith("auth-uid-123", expect.anything());
    expect(toast.success).toHaveBeenCalledWith("Password guru berhasil di-reset ke default");
  });
});
