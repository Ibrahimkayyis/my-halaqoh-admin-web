import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getTargetHafalan,
  updateGlobalTargetHafalan,
} from "@/lib/firestore/queries/target-hafalan.queries";

export const TARGET_HAFALAN_QUERY_KEY = ["target-hafalan"];

// ==================== READ ====================

export function useGetTargetHafalan() {
  return useQuery({
    queryKey: TARGET_HAFALAN_QUERY_KEY,
    queryFn: getTargetHafalan,
  });
}

// ==================== UPDATE (BATCH) ====================

export function useUpdateGlobalTarget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      tahunAjaran,
      semesterAktif,
    }: {
      tahunAjaran: string | null;
      semesterAktif: 1 | 2 | null;
    }) => updateGlobalTargetHafalan(tahunAjaran, semesterAktif),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TARGET_HAFALAN_QUERY_KEY });
      toast.success("Konfigurasi target berhasil diperbarui");
    },
    onError: (error) => {
      console.error("Error updating global targets:", error);
      toast.error(
        "Gagal memperbarui konfigurasi. " +
          (error instanceof Error ? error.message : "")
      );
    },
  });
}
