import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProgram, createProgram, updateProgram, deleteProgram } from "@/lib/firestore/queries/program.queries";
import { toast } from "sonner";
import type { Program } from "../types/kelas-program.types";

export const PROGRAM_QUERY_KEY = ["program"];

export function useGetProgram() {
  return useQuery({
    queryKey: PROGRAM_QUERY_KEY,
    queryFn: getProgram,
  });
}

export function useCreateProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProgram,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROGRAM_QUERY_KEY });
      toast.success("Program berhasil ditambahkan");
    },
    onError: (error) => {
      console.error("Error creating program:", error);
      toast.error("Gagal menambahkan program");
    },
  });
}

export function useUpdateProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<Program, "id" | "createdAt" | "updatedAt">> }) => 
      updateProgram(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROGRAM_QUERY_KEY });
      toast.success("Program berhasil diperbarui");
    },
    onError: (error) => {
      console.error("Error updating program:", error);
      toast.error("Gagal memperbarui program");
    },
  });
}

export function useDeleteProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProgram,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROGRAM_QUERY_KEY });
      toast.success("Program berhasil dihapus");
    },
    onError: (error) => {
      console.error("Error deleting program:", error);
      toast.error("Gagal menghapus program");
    },
  });
}
