import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllSantri,
  createSantri,
  updateSantri,
  deleteSantri,
  bulkCreateSantri,
  resetSantriPassword,
  promoteAllSantri,
} from "@/lib/firestore/queries/santri.queries";
import { toast } from "sonner";
import type { Santri, WaliSantri } from "../types/santri.types";
import type { Kelas } from "@/features/kelas-program/types/kelas-program.types";

export const SANTRI_QUERY_KEY = ["santri"];

// ==================== READ ====================

export function useGetSantri() {
  return useQuery({
    queryKey: SANTRI_QUERY_KEY,
    queryFn: getAllSantri,
  });
}

// ==================== CREATE (via Cloud Function) ====================

export function useCreateSantri() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      nis: string;
      nama: string;
      kelas: string;
      program: string;
      profilePicture?: string | null;
      waliSantri?: WaliSantri | null;
    }) => createSantri(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SANTRI_QUERY_KEY });
      toast.success("Santri berhasil ditambahkan");
    },
    onError: (error) => {
      console.error("Error creating santri:", error);
      toast.error("Gagal menambahkan santri. " + (error instanceof Error ? error.message : ""));
    },
  });
}

// ==================== BULK CREATE ====================

export function useBulkCreateSantri() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      users: Array<{ nis: string; nama: string; kelas: string; program: string }>
    ) => bulkCreateSantri(users),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: SANTRI_QUERY_KEY });
      if (result.failCount === 0) {
        toast.success(`${result.successCount} santri berhasil diimport`);
      } else {
        toast.warning(
          `${result.successCount} berhasil, ${result.failCount} gagal`
        );
      }
    },
    onError: (error) => {
      console.error("Error bulk creating santri:", error);
      toast.error("Gagal mengimport data santri");
    },
  });
}

// ==================== UPDATE ====================

export function useUpdateSantri() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<Santri, "id" | "createdAt" | "updatedAt" | "authUid">>;
    }) => updateSantri(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SANTRI_QUERY_KEY });
      toast.success("Data santri berhasil diperbarui");
    },
    onError: (error) => {
      console.error("Error updating santri:", error);
      toast.error("Gagal memperbarui data santri");
    },
  });
}

// ==================== DELETE ====================

export function useDeleteSantri() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSantri,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SANTRI_QUERY_KEY });
      toast.success("Santri berhasil dihapus");
    },
    onError: (error) => {
      console.error("Error deleting santri:", error);
      toast.error("Gagal menghapus santri");
    },
  });
}

// ==================== RESET PASSWORD ====================

export function useResetPassword() {
  return useMutation({
    mutationFn: resetSantriPassword,
    onSuccess: () => {
      toast.success("Password berhasil di-reset ke default");
    },
    onError: (error) => {
      console.error("Error resetting password:", error);
      toast.error("Gagal mereset password");
    },
  });
}

// ==================== KENAIKAN KELAS ====================

export function usePromoteAll() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      activeSantri: Santri[];
      kelasMap: Kelas[];
      tahunAjaran: string;
      semesterAktif: number;
    }) => promoteAllSantri(params),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: SANTRI_QUERY_KEY });
      toast.success(
        `Kenaikan kelas berhasil! ${result.promoted} naik kelas, ${result.graduated} lulus sebagai alumni.`
      );
    },
    onError: (error) => {
      console.error("Error promoting santri:", error);
      toast.error("Gagal memproses kenaikan kelas");
    },
  });
}
