import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
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
  return useQuery({
    queryKey: ["public_metadata", "stats"],
    queryFn: getLandingStats,
    initialData: DEFAULT_LANDING_STATS,
    staleTime: 10 * 60 * 1000,
  });
}
