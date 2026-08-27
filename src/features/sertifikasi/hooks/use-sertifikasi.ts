import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllSertifikasi,
  approveSertifikasi,
  rejectSertifikasi,
  gradeSertifikasi,
  type ApproveSertifikasiData,
  type GradeSertifikasiData,
} from "@/lib/firestore/queries/sertifikasi.queries";
import { toast } from "sonner";

export const SERTIFIKASI_QUERY_KEY = ["sertifikasi"];

// ==================== READ ====================

export function useGetSertifikasi() {
  return useQuery({
    queryKey: SERTIFIKASI_QUERY_KEY,
    queryFn: getAllSertifikasi,
    staleTime: 1000 * 60 * 2, // 2 minutes
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
