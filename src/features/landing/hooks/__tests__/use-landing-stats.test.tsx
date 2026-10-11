import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useLandingStats, DEFAULT_LANDING_STATS, getLandingStats } from "../use-landing-stats";
import * as firestore from "firebase/firestore";
import React from "react";

vi.mock("firebase/firestore", () => ({
  doc: vi.fn(),
  getDoc: vi.fn(),
}));

vi.mock("@/lib/firebase/config", () => ({
  db: {},
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe("useLandingStats Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return fallback data when Firestore document does not exist", async () => {
    vi.mocked(firestore.getDoc).mockResolvedValue({
      exists: () => false,
      data: () => undefined,
    } as unknown as firestore.DocumentSnapshot);

    const stats = await getLandingStats();
    expect(stats).toEqual(DEFAULT_LANDING_STATS);
  });

  it("should return parsed numbers when Firestore document exists", async () => {
    vi.mocked(firestore.getDoc).mockResolvedValue({
      exists: () => true,
      data: () => ({
        totalSantri: 250,
        totalGuru: 45,
        totalHalaqoh: 15,
      }),
    } as unknown as firestore.DocumentSnapshot);

    const stats = await getLandingStats();
    expect(stats).toEqual({
      totalSantri: 250,
      totalGuru: 45,
      totalHalaqoh: 15,
    });
  });

  it("should handle error gracefully and return fallback data", async () => {
    vi.mocked(firestore.getDoc).mockRejectedValue(new Error("Permission denied"));

    const stats = await getLandingStats();
    expect(stats).toEqual(DEFAULT_LANDING_STATS);
  });

  it("should render with initialData and resolve successfully", async () => {
    vi.mocked(firestore.getDoc).mockResolvedValue({
      exists: () => true,
      data: () => ({
        totalSantri: 229,
        totalGuru: 44,
        totalHalaqoh: 7,
      }),
    } as unknown as firestore.DocumentSnapshot);

    const { result } = renderHook(() => useLandingStats(), {
      wrapper: createWrapper(),
    });

    // Should immediately have initial data
    expect(result.current.data).toEqual(DEFAULT_LANDING_STATS);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({
      totalSantri: 229,
      totalGuru: 44,
      totalHalaqoh: 7,
    });
  });
});
