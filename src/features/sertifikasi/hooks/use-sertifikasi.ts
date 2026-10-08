import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllSertifikasi,
  subscribeAllSertifikasi,
  getPengujiSertifikasi,
  subscribePengujiSertifikasi,
  addPengujiSertifikasi,
  removePengujiSertifikasi,
  approveSertifikasi,
  rejectSertifikasi,
  gradeSertifikasi,
  type ApproveSertifikasiData,
  type GradeSertifikasiData,
} from "@/lib/firestore/queries/sertifikasi.queries";
import { toast } from "sonner";

export const SERTIFIKASI_QUERY_KEY = ["sertifikasi"];
export const PENGUJI_SERTIFIKASI_QUERY_KEY = ["penguji-sertifikasi"];

// ==================== READ (REAL-TIME) ====================

export function useGetSertifikasi() {
  const queryClient = useQueryClient();

  const queryResult = useQuery({
    queryKey: SERTIFIKASI_QUERY_KEY,
    queryFn: getAllSertifikasi,
    staleTime: Infinity,
  });

  useEffect(() => {
    const unsubscribe = subscribeAllSertifikasi(
      (data) => {
        queryClient.setQueryData(SERTIFIKASI_QUERY_KEY, data);
      },
      (err) => {
        console.error("Firestore realtime all sertifikasi error:", err);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [queryClient]);

  return queryResult;
}

export function useGetPengujiSertifikasi() {
  const queryClient = useQueryClient();

  const queryResult = useQuery({
    queryKey: PENGUJI_SERTIFIKASI_QUERY_KEY,
    queryFn: getPengujiSertifikasi,
    staleTime: Infinity,
  });

  useEffect(() => {
    const unsubscribe = subscribePengujiSertifikasi(
      (data) => {
        queryClient.setQueryData(PENGUJI_SERTIFIKASI_QUERY_KEY, data);
      },
      (err) => {
        console.error("Firestore realtime penguji error:", err);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [queryClient]);

  return queryResult;
}

export function useAddPengujiSertifikasi() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (guru: { id: string; nip: string; nama: string }) =>
      addPengujiSertifikasi(guru),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: PENGUJI_SERTIFIKASI_QUERY_KEY });
      toast.success(`Ustadz ${variables.nama} berhasil ditambahkan ke dewan penguji`);
    },
    onError: (error: unknown) => {
      console.error("Gagal menambahkan penguji:", error);
      const msg = error instanceof Error ? error.message : "Terjadi kesalahan";
      toast.error(`Gagal menambahkan penguji: ${msg}`);
    },
  });
}

export function useRemovePengujiSertifikasi() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => removePengujiSertifikasi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PENGUJI_SERTIFIKASI_QUERY_KEY });
      toast.success("Penguji berhasil dihapus dari daftar");
    },
    onError: (error: unknown) => {
      console.error("Gagal menghapus penguji:", error);
      const msg = error instanceof Error ? error.message : "Terjadi kesalahan";
      toast.error(`Gagal menghapus penguji: ${msg}`);
    },
  });
}

// ==================== MUTATIONS ====================

export function useApproveSertifikasi() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ApproveSertifikasiData }) =>
      approveSertifikasi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERTIFIKASI_QUERY_KEY });
      toast.success("Pengajuan sertifikasi berhasil disetujui & dijadwalkan");
    },
    onError: (error: unknown) => {
      console.error("Gagal menyetujui sertifikasi:", error);
      const msg = error instanceof Error ? error.message : "Terjadi kesalahan";
      toast.error(`Gagal menyetujui sertifikasi: ${msg}`);
    },
  });
}

export function useRejectSertifikasi() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, alasan }: { id: string; alasan: string }) =>
      rejectSertifikasi(id, alasan),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERTIFIKASI_QUERY_KEY });
      toast.success("Pengajuan sertifikasi telah ditolak");
    },
    onError: (error: unknown) => {
      console.error("Gagal menolak sertifikasi:", error);
      const msg = error instanceof Error ? error.message : "Terjadi kesalahan";
      toast.error(`Gagal menolak sertifikasi: ${msg}`);
    },
  });
}

export function useGradeSertifikasi() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: GradeSertifikasiData }) =>
      gradeSertifikasi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERTIFIKASI_QUERY_KEY });
      toast.success("Hasil ujian sertifikasi berhasil disimpan");
    },
    onError: (error: unknown) => {
      console.error("Gagal menyimpan hasil sertifikasi:", error);
      const msg = error instanceof Error ? error.message : "Terjadi kesalahan";
      toast.error(`Gagal menyimpan hasil sertifikasi: ${msg}`);
    },
  });
}
