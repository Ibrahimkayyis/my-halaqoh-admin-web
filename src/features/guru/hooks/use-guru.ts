import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllGuru,
  createGuru,
  updateGuru,
  deleteGuru,
  bulkCreateGuru,
  resetGuruPassword,
} from "@/lib/firestore/queries/guru.queries";
import { toast } from "sonner";
import type { Guru } from "../types/guru.types";

export const GURU_QUERY_KEY = ["guru"];

// ==================== READ ====================

export function useGetGuru() {
  return useQuery({
    queryKey: GURU_QUERY_KEY,
    queryFn: getAllGuru,
  });
}

// ==================== CREATE ====================

export function useCreateGuru() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      nip: string;
      nama: string;
      phone?: string | null;
      program: "R" | "T";
      profilePicture?: string | null;
    }) => createGuru(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GURU_QUERY_KEY });
      toast.success("Guru berhasil ditambahkan");
    },
    onError: (error) => {
      console.error("Error creating guru:", error);
      toast.error("Gagal menambahkan guru. " + (error instanceof Error ? error.message : ""));
    },
  });
}

// ==================== BULK CREATE ====================

export function useBulkCreateGuru() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      users: Array<{ nip: string; nama: string; program: "R" | "T"; phone?: string }>
    ) => bulkCreateGuru(users),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: GURU_QUERY_KEY });
      if (result.failCount === 0) {
        toast.success(`${result.successCount} guru berhasil diimport`);
      } else {
        toast.warning(
          `${result.successCount} berhasil, ${result.failCount} gagal`
        );
      }
    },
    onError: (error) => {
      console.error("Error bulk creating guru:", error);
      toast.error("Gagal mengimport data guru");
    },
  });
}

// ==================== UPDATE ====================

export function useUpdateGuru() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<Guru, "id" | "createdAt" | "updatedAt" | "authUid" | "email">>;
    }) => updateGuru(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GURU_QUERY_KEY });
      toast.success("Data guru berhasil diperbarui");
    },
    onError: (error) => {
      console.error("Error updating guru:", error);
      toast.error("Gagal memperbarui data guru");
    },
  });
}

// ==================== DELETE ====================

export function useDeleteGuru() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGuru,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GURU_QUERY_KEY });
      toast.success("Guru berhasil dihapus");
    },
    onError: (error) => {
      console.error("Error deleting guru:", error);
      toast.error("Gagal menghapus guru");
    },
  });
}

// ==================== RESET PASSWORD ====================

export function useResetPasswordGuru() {
  return useMutation({
    mutationFn: resetGuruPassword,
    onSuccess: () => {
      toast.success("Password guru berhasil di-reset ke default");
    },
    onError: (error) => {
      console.error("Error resetting guru password:", error);
      toast.error("Gagal mereset password guru");
    },
  });
}
