import { useQuery, useQueryClient } from "@tanstack/react-query";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";
import { db } from "@/lib/firebase/config";

export interface LandingStats {
  totalSantri: number;
  totalGuru: number;
  totalHalaqoh: number;
}

export const DEFAULT_LANDING_STATS: LandingStats = {
  totalSantri: 229,
  totalGuru: 44,
  totalHalaqoh: 7,
};

export async function getLandingStats(): Promise<LandingStats> {
  try {
    const statsDocRef = doc(db, "public_metadata", "stats");
    const snapshot = await getDoc(statsDocRef);

    if (snapshot.exists()) {
      const data = snapshot.data();
      return {
        totalSantri:
          typeof data.totalSantri === "number" ? data.totalSantri : DEFAULT_LANDING_STATS.totalSantri,
        totalGuru:
          typeof data.totalGuru === "number" ? data.totalGuru : DEFAULT_LANDING_STATS.totalGuru,
        totalHalaqoh:
          typeof data.totalHalaqoh === "number" ? data.totalHalaqoh : DEFAULT_LANDING_STATS.totalHalaqoh,
      };
    }
  } catch (error) {
    console.warn("Error fetching public landing stats from Firestore:", error);
  }

  return DEFAULT_LANDING_STATS;
}

export function useLandingStats() {
  const queryClient = useQueryClient();

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    try {
      const statsDocRef = doc(db, "public_metadata", "stats");
      unsubscribe = onSnapshot(
        statsDocRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            queryClient.setQueryData<LandingStats>(["public_metadata", "stats"], {
              totalSantri:
                typeof data.totalSantri === "number" ? data.totalSantri : DEFAULT_LANDING_STATS.totalSantri,
              totalGuru:
                typeof data.totalGuru === "number" ? data.totalGuru : DEFAULT_LANDING_STATS.totalGuru,
              totalHalaqoh:
                typeof data.totalHalaqoh === "number" ? data.totalHalaqoh : DEFAULT_LANDING_STATS.totalHalaqoh,
            });
          }
        },
        (error) => {
          console.warn("Realtime landing stats subscription error:", error);
        }
      );
    } catch (err) {
      console.warn("Failed to subscribe to landing stats:", err);
    }

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ["public_metadata", "stats"],
    queryFn: getLandingStats,
    initialData: DEFAULT_LANDING_STATS,
  });
}
