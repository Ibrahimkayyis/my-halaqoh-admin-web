import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getKelas, createKelas, updateKelas, deleteKelas } from "@/lib/firestore/queries/kelas.queries";
import { toast } from "sonner";
import type { Kelas } from "../types/kelas-program.types";

export const KELAS_QUERY_KEY = ["kelas"];

export function useGetKelas() {
  return useQuery({
    queryKey: KELAS_QUERY_KEY,
    queryFn: getKelas,
  });
}

export function useCreateKelas() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createKelas,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KELAS_QUERY_KEY });
      toast.success("Kelas berhasil ditambahkan");
    },
    onError: (error) => {
      console.error("Error creating kelas:", error);
      toast.error("Gagal menambahkan kelas");
    },
  });
}

export function useUpdateKelas() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<Kelas, "id" | "createdAt" | "updatedAt">> }) => 
      updateKelas(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KELAS_QUERY_KEY });
      toast.success("Kelas berhasil diperbarui");
    },
    onError: (error) => {
      console.error("Error updating kelas:", error);
      toast.error("Gagal memperbarui kelas");
    },
  });
}

export function useDeleteKelas() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteKelas,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KELAS_QUERY_KEY });
      toast.success("Kelas berhasil dihapus");
    },
    onError: (error) => {
      console.error("Error deleting kelas:", error);
      toast.error("Gagal menghapus kelas");
    },
  });
}
