import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  getAllHalaqoh,
  createHalaqoh,
  updateHalaqoh,
  deleteHalaqoh,
} from "@/lib/firestore/queries/halaqoh.queries";

export const HALAQOH_QUERY_KEY = ["halaqoh"];

// ==================== READ ====================

export function useGetHalaqoh() {
  return useQuery({
    queryKey: HALAQOH_QUERY_KEY,
    queryFn: getAllHalaqoh,
  });
}

// ==================== CREATE ====================

export function useCreateHalaqoh() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: {
      nama: string;
      kelas: string;
      program: "R" | "T";
      guruId: string;
      guruNama: string;
      santriIds: string[];
    }) => createHalaqoh(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HALAQOH_QUERY_KEY });
      // Also invalidate santri since halaqohId fields changed
      queryClient.invalidateQueries({ queryKey: ["santri"] });
      toast.success("Halaqoh berhasil ditambahkan");
      router.push("/halaqoh");
    },
    onError: (error) => {
      console.error("Error creating halaqoh:", error);
      toast.error(
        "Gagal menambahkan halaqoh. " +
          (error instanceof Error ? error.message : "")
      );
    },
  });
}

// ==================== UPDATE ====================

export function useUpdateHalaqoh() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: {
        nama: string;
        kelas: string;
        program: "R" | "T";
        guruId: string;
        guruNama: string;
        santriIds: string[];
      };
    }) => updateHalaqoh(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HALAQOH_QUERY_KEY });
      // Also invalidate santri since halaqohId fields changed
      queryClient.invalidateQueries({ queryKey: ["santri"] });
      toast.success("Halaqoh berhasil diperbarui");
      router.push("/halaqoh");
    },
    onError: (error) => {
      console.error("Error updating halaqoh:", error);
      toast.error("Gagal memperbarui halaqoh");
    },
  });
}

// ==================== DELETE ====================

export function useDeleteHalaqoh() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteHalaqoh,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HALAQOH_QUERY_KEY });
      // Also invalidate santri since halaqohId fields were cleared
      queryClient.invalidateQueries({ queryKey: ["santri"] });
      toast.success("Halaqoh berhasil dihapus");
    },
    onError: (error) => {
      console.error("Error deleting halaqoh:", error);
      toast.error("Gagal menghapus halaqoh");
    },
  });
}
