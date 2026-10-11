import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useGetSertifikasi,
  useApproveSertifikasi,
  useRejectSertifikasi,
  useGradeSertifikasi,
  useGetPengujiSertifikasi,
  useAddPengujiSertifikasi,
  useRemovePengujiSertifikasi,
} from "../use-sertifikasi";
import * as sertifikasiQueries from "@/lib/firestore/queries/sertifikasi.queries";
import { toast } from "sonner";
import React from "react";

vi.mock("@/lib/firestore/queries/sertifikasi.queries", () => ({
  getAllSertifikasi: vi.fn(),
  subscribeAllSertifikasi: vi.fn(() => vi.fn()),
  getPengujiSertifikasi: vi.fn(),
  subscribePengujiSertifikasi: vi.fn(() => vi.fn()),
  addPengujiSertifikasi: vi.fn(),
  removePengujiSertifikasi: vi.fn(),
  approveSertifikasi: vi.fn(),
  rejectSertifikasi: vi.fn(),
  gradeSertifikasi: vi.fn(),
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

describe("Sertifikasi TanStack Query Hooks (use-sertifikasi)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("useGetSertifikasi should fetch sertifikasi list", async () => {
    const mockList = [
      {
        id: "sert-1",
        santriNama: "Ahmad Fauzi",
        juz: 30,
        status: "pending",
      },
    ];
    vi.mocked(sertifikasiQueries.getAllSertifikasi).mockResolvedValue(mockList as any);

    const { result } = renderHook(() => useGetSertifikasi(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockList);
  });

  it("useApproveSertifikasi should call approveSertifikasi and show toast", async () => {
    vi.mocked(sertifikasiQueries.approveSertifikasi).mockResolvedValue();

    const { result } = renderHook(() => useApproveSertifikasi(), { wrapper: createWrapper() });

    const payload = {
      id: "sert-1",
      data: {
        tanggalUjian: new Date("2026-09-01"),
        sesiUjian: "Pagi (08:00 - 09:30 WIB)",
        pengujiNama: "MUFTI ALFARUQI",
      },
    };

    await result.current.mutateAsync(payload);

    expect(sertifikasiQueries.approveSertifikasi).toHaveBeenCalledWith(payload.id, payload.data);
    expect(toast.success).toHaveBeenCalledWith(
      "Pengajuan sertifikasi berhasil disetujui & dijadwalkan"
    );
  });

  it("useRejectSertifikasi should call rejectSertifikasi and show toast", async () => {
    vi.mocked(sertifikasiQueries.rejectSertifikasi).mockResolvedValue();

    const { result } = renderHook(() => useRejectSertifikasi(), { wrapper: createWrapper() });

    await result.current.mutateAsync({
      id: "sert-1",
      alasan: "Hafalan belum mencapai standar kelancaran.",
    });

    expect(sertifikasiQueries.rejectSertifikasi).toHaveBeenCalledWith(
      "sert-1",
      "Hafalan belum mencapai standar kelancaran."
    );
    expect(toast.success).toHaveBeenCalledWith("Pengajuan sertifikasi telah ditolak");
  });

  it("useGradeSertifikasi should call gradeSertifikasi and show toast", async () => {
    vi.mocked(sertifikasiQueries.gradeSertifikasi).mockResolvedValue();

    const { result } = renderHook(() => useGradeSertifikasi(), { wrapper: createWrapper() });

    const payload = {
      id: "sert-1",
      data: {
        nilai: 92,
        status: "passed" as const,
        catatanPenguji: "Mumtaz",
      },
    };

    await result.current.mutateAsync(payload);

    expect(sertifikasiQueries.gradeSertifikasi).toHaveBeenCalledWith(payload.id, payload.data);
    expect(toast.success).toHaveBeenCalledWith("Hasil ujian sertifikasi berhasil disimpan");
  });

  it("useGetPengujiSertifikasi should fetch penguji list", async () => {
    const mockPenguji = [
      { id: "p-1", nip: "19800101", nama: "Ust. Ahmad", isDefault: true },
    ];
    vi.mocked(sertifikasiQueries.getPengujiSertifikasi).mockResolvedValue(mockPenguji as any);

    const { result } = renderHook(() => useGetPengujiSertifikasi(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockPenguji);
  });

  it("useAddPengujiSertifikasi should call addPengujiSertifikasi and show toast", async () => {
    vi.mocked(sertifikasiQueries.addPengujiSertifikasi).mockResolvedValue();

    const { result } = renderHook(() => useAddPengujiSertifikasi(), { wrapper: createWrapper() });

    await result.current.mutateAsync({
      id: "g-1",
      nip: "19850101",
      nama: "Ust. Zaid",
    });

    expect(sertifikasiQueries.addPengujiSertifikasi).toHaveBeenCalledWith({
      id: "g-1",
      nip: "19850101",
      nama: "Ust. Zaid",
    });
    expect(toast.success).toHaveBeenCalledWith("Ustadz Ust. Zaid berhasil ditambahkan ke dewan penguji");
  });

  it("useRemovePengujiSertifikasi should call removePengujiSertifikasi and show toast", async () => {
    vi.mocked(sertifikasiQueries.removePengujiSertifikasi).mockResolvedValue();

    const { result } = renderHook(() => useRemovePengujiSertifikasi(), { wrapper: createWrapper() });

    await result.current.mutateAsync("p-1");

    expect(sertifikasiQueries.removePengujiSertifikasi).toHaveBeenCalledWith("p-1");
    expect(toast.success).toHaveBeenCalledWith("Penguji berhasil dihapus dari daftar");
  });
});
