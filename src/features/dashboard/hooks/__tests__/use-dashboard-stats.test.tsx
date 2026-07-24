import { describe, it, expect, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useDashboardCounts } from "../use-dashboard-stats";
import * as dashboardQueries from "@/lib/firestore/queries/dashboard.queries";
import React from "react";

vi.mock("@/lib/firestore/queries/dashboard.queries", () => ({
  getSantriCount: vi.fn(),
  getGuruCount: vi.fn(),
  getHalaqohCount: vi.fn(),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe("useDashboardCounts Hook", () => {
  it("should fetch and aggregate dashboard counts", async () => {
    vi.mocked(dashboardQueries.getSantriCount).mockResolvedValue(150);
    vi.mocked(dashboardQueries.getGuruCount).mockResolvedValue(20);
    vi.mocked(dashboardQueries.getHalaqohCount).mockResolvedValue(12);

    const { result } = renderHook(() => useDashboardCounts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual({
      santri: 150,
      guru: 20,
      halaqoh: 12,
    });
  });
});
