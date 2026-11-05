import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllFeedback,
  subscribeAllFeedback,
  updateFeedbackStatusAndResponse,
} from "@/lib/firestore/queries/feedback.queries";
import type {
  UserFeedback,
  UpdateFeedbackPayload,
} from "@/types/models/feedback.types";
import { toast } from "sonner";

export const FEEDBACK_QUERY_KEY = ["feedback"];

/**
 * Hook untuk mendapatkan seluruh data feedback dengan sinkronisasi realtime melalui onSnapshot.
 */
export function useGetFeedbackList() {
  const queryClient = useQueryClient();

  const queryResult = useQuery<UserFeedback[], Error>({
    queryKey: FEEDBACK_QUERY_KEY,
    queryFn: getAllFeedback,
    staleTime: Infinity,
  });

  useEffect(() => {
    const unsubscribe = subscribeAllFeedback(
      (data) => {
        queryClient.setQueryData(FEEDBACK_QUERY_KEY, data);
      },
      (err) => {
        console.error("Firestore realtime feedback subscription error:", err);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [queryClient]);

  return queryResult;
}

/**
 * Hook mutation untuk memperbarui status dan respon tindak lanjut masukan pengguna.
 */
export function useUpdateFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateFeedbackPayload;
    }) => updateFeedbackStatusAndResponse(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: FEEDBACK_QUERY_KEY });
      const actionLabel =
        variables.payload.status === "resolved"
          ? "diselesaikan dan dibalas"
          : variables.payload.status === "in_progress"
            ? "ditandai sedang diproses"
            : "diperbarui ke status menunggu";
      toast.success(`Masukan berhasil ${actionLabel}.`);
    },
    onError: (error: unknown) => {
      console.error("Gagal memperbarui masukan:", error);
      const msg = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
      toast.error(`Gagal memperbarui tindak lanjut: ${msg}`);
    },
  });
}
