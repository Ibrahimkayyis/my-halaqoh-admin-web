import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useGetKelas,
  useCreateKelas,
  useUpdateKelas,
  useDeleteKelas,
} from "../use-kelas";
import * as kelasQueries from "@/lib/firestore/queries/kelas.queries";
import { toast } from "sonner";
import React from "react";

vi.mock("@/lib/firestore/queries/kelas.queries", () => ({
  getKelas: vi.fn(),
  createKelas: vi.fn(),
  updateKelas: vi.fn(),
  deleteKelas: vi.fn(),
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

describe("Kelas TanStack Query Hooks (use-kelas)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("useGetKelas should fetch kelas list", async () => {
    const mockList = [
      { id: "k7", nama: "7", urutan: 1 },
    ];
    vi.mocked(kelasQueries.getKelas).mockResolvedValue(mockList as any);

    const { result } = renderHook(() => useGetKelas(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockList);
    expect(kelasQueries.getKelas).toHaveBeenCalledTimes(1);
  });

  it("useCreateKelas should call createKelas and show success toast", async () => {
    vi.mocked(kelasQueries.createKelas).mockResolvedValue(undefined as any);

    const { result } = renderHook(() => useCreateKelas(), { wrapper: createWrapper() });

    const newKelasData = {
      nama: "Kelas 8",
      urutan: 2,
    };

    await result.current.mutateAsync(newKelasData as any);

    expect(kelasQueries.createKelas).toHaveBeenCalledWith(newKelasData, expect.anything());
    expect(toast.success).toHaveBeenCalledWith("Kelas berhasil ditambahkan");
  });

  it("useUpdateKelas should call updateKelas and show success toast", async () => {
    vi.mocked(kelasQueries.updateKelas).mockResolvedValue(undefined);

    const { result } = renderHook(() => useUpdateKelas(), { wrapper: createWrapper() });

    const updatePayload = {
      id: "k7",
      data: { nama: "Kelas 7 A", urutan: 1 },
    };

    await result.current.mutateAsync(updatePayload);

    expect(kelasQueries.updateKelas).toHaveBeenCalledWith("k7", { nama: "Kelas 7 A", urutan: 1 });
    expect(toast.success).toHaveBeenCalledWith("Kelas berhasil diperbarui");
  });

  it("useDeleteKelas should call deleteKelas and show success toast", async () => {
    vi.mocked(kelasQueries.deleteKelas).mockResolvedValue(undefined);

    const { result } = renderHook(() => useDeleteKelas(), { wrapper: createWrapper() });

    await result.current.mutateAsync("k7");

    expect(kelasQueries.deleteKelas).toHaveBeenCalledWith("k7", expect.anything());
    expect(toast.success).toHaveBeenCalledWith("Kelas berhasil dihapus");
  });
});
