import { useQuery } from "@tanstack/react-query";
import { getSantriCount, getGuruCount, getHalaqohCount } from "@/lib/firestore/queries/dashboard.queries";

export function useDashboardCounts() {
  return useQuery({
    queryKey: ["dashboard", "counts"],
    queryFn: async () => {
      const [santri, guru, halaqoh] = await Promise.all([
        getSantriCount(),
        getGuruCount(),
        getHalaqohCount(),
      ]);

      return {
        santri,
        guru,
        halaqoh,
      };
    },
    // Cache for 5 minutes since these counts don't need real-time exactness on every render
    staleTime: 5 * 60 * 1000, 
  });
}
