import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useGetSantri,
  useCreateSantri,
  useBulkCreateSantri,
  useUpdateSantri,
  useDeleteSantri,
  useBulkDeleteSantri,
  useResetPassword,
  usePromoteAll,
} from "../use-santri";
import * as santriQueries from "@/lib/firestore/queries/santri.queries";
import { toast } from "sonner";
import React from "react";

vi.mock("@/lib/firestore/queries/santri.queries", () => ({
  getAllSantri: vi.fn(),
  createSantri: vi.fn(),
  bulkCreateSantri: vi.fn(),
  updateSantri: vi.fn(),
  deleteSantri: vi.fn(),
  bulkDeleteSantri: vi.fn(),
  resetSantriPassword: vi.fn(),
  promoteAllSantri: vi.fn(),
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

describe("Santri TanStack Query Hooks (use-santri)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("useGetSantri should fetch santri list", async () => {
    const mockList = [
      { id: "s1", nis: "2024001", nama: "Muhammad Ali", kelas: "7", program: "R", isAlumni: false },
    ];
    vi.mocked(santriQueries.getAllSantri).mockResolvedValue(mockList as any);

    const { result } = renderHook(() => useGetSantri(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockList);
    expect(santriQueries.getAllSantri).toHaveBeenCalledTimes(1);
  });

  it("useCreateSantri should call createSantri and show success toast", async () => {
    vi.mocked(santriQueries.createSantri).mockResolvedValue("s-new-123");

    const { result } = renderHook(() => useCreateSantri(), { wrapper: createWrapper() });

    const newSantriData = {
      nis: "2024002",
      nama: "Ahmad Zaki",
      kelas: "7",
      program: "R",
    };

    await result.current.mutateAsync(newSantriData);

    expect(santriQueries.createSantri).toHaveBeenCalledWith(newSantriData);
    expect(toast.success).toHaveBeenCalledWith("Santri berhasil ditambahkan");
  });

  it("useUpdateSantri should call updateSantri and show success toast", async () => {
    vi.mocked(santriQueries.updateSantri).mockResolvedValue(undefined);

    const { result } = renderHook(() => useUpdateSantri(), { wrapper: createWrapper() });

    const updatePayload = {
      id: "s1",
      data: { nama: "Muhammad Ali Updated" },
    };

    await result.current.mutateAsync(updatePayload);

    expect(santriQueries.updateSantri).toHaveBeenCalledWith("s1", { nama: "Muhammad Ali Updated" });
    expect(toast.success).toHaveBeenCalledWith("Data santri berhasil diperbarui");
  });

  it("useDeleteSantri should call deleteSantri and show success toast", async () => {
    vi.mocked(santriQueries.deleteSantri).mockResolvedValue(undefined);

    const { result } = renderHook(() => useDeleteSantri(), { wrapper: createWrapper() });

    await result.current.mutateAsync("s1");

    expect(santriQueries.deleteSantri).toHaveBeenCalledWith("s1", expect.anything());
    expect(toast.success).toHaveBeenCalledWith("Santri berhasil dihapus");
  });

  it("useBulkDeleteSantri should call bulkDeleteSantri and show success toast", async () => {
    vi.mocked(santriQueries.bulkDeleteSantri).mockResolvedValue(undefined);

    const { result } = renderHook(() => useBulkDeleteSantri(), { wrapper: createWrapper() });

    await result.current.mutateAsync(["s1", "s2"]);

    expect(santriQueries.bulkDeleteSantri).toHaveBeenCalledWith(["s1", "s2"]);
    expect(toast.success).toHaveBeenCalledWith("Berhasil menghapus 2 data santri");
  });

  it("useBulkCreateSantri should trigger toast.success when failCount is 0", async () => {
    vi.mocked(santriQueries.bulkCreateSantri).mockResolvedValue({
      successCount: 10,
      failCount: 0,
      errors: [],
    });

    const { result } = renderHook(() => useBulkCreateSantri(), { wrapper: createWrapper() });

    const bulkData = [
      { nis: "2024001", nama: "Santri 1", kelas: "7", program: "R" },
    ];

    await result.current.mutateAsync(bulkData);

    expect(santriQueries.bulkCreateSantri).toHaveBeenCalledWith(bulkData);
    expect(toast.success).toHaveBeenCalledWith("10 santri berhasil diimport");
  });

  it("useResetPassword should call resetSantriPassword and show success toast", async () => {
    vi.mocked(santriQueries.resetSantriPassword).mockResolvedValue(undefined);

    const { result } = renderHook(() => useResetPassword(), { wrapper: createWrapper() });

    await result.current.mutateAsync("auth-uid-santri");

    expect(santriQueries.resetSantriPassword).toHaveBeenCalledWith("auth-uid-santri", expect.anything());
    expect(toast.success).toHaveBeenCalledWith("Password berhasil di-reset ke default");
  });

  it("usePromoteAll should call promoteAllSantri and show promotion success toast", async () => {
    vi.mocked(santriQueries.promoteAllSantri).mockResolvedValue({
      promoted: 15,
      graduated: 5,
    });

    const { result } = renderHook(() => usePromoteAll(), { wrapper: createWrapper() });

    const promoteParams = {
      activeSantri: [],
      kelasMap: [],
      tahunAjaran: "2026/2027",
      semesterAktif: 1,
    };

    await result.current.mutateAsync(promoteParams);

    expect(santriQueries.promoteAllSantri).toHaveBeenCalledWith(promoteParams);
    expect(toast.success).toHaveBeenCalledWith(
      "Kenaikan kelas berhasil! 15 naik kelas, 5 lulus sebagai alumni."
    );
  });
});
