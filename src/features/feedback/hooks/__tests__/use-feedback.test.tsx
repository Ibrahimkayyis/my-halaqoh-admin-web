import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGetFeedbackList, useUpdateFeedback } from "../use-feedback";
import * as feedbackQueries from "@/lib/firestore/queries/feedback.queries";
import { toast } from "sonner";
import React from "react";

vi.mock("@/lib/firestore/queries/feedback.queries", () => ({
  getAllFeedback: vi.fn(),
  subscribeAllFeedback: vi.fn(() => vi.fn()),
  updateFeedbackStatusAndResponse: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    warning: vi.fn(),
    error: vi.fn(),
  },
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe("Feedback Hooks (use-feedback)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("useGetFeedbackList should fetch feedback list and subscribe to updates", async () => {
    const mockList = [
      {
        id: "fb-1",
        userName: "Ustadz Hanif",
        category: "bug",
        status: "open",
        title: "Pemberitahuan tidak muncul",
      },
    ];

    vi.mocked(feedbackQueries.getAllFeedback).mockResolvedValueOnce(mockList as any);

    const { result } = renderHook(() => useGetFeedbackList(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockList);
    expect(feedbackQueries.subscribeAllFeedback).toHaveBeenCalled();
  });

  it("useUpdateFeedback should call updateFeedbackStatusAndResponse and toast on success", async () => {
    vi.mocked(feedbackQueries.updateFeedbackStatusAndResponse).mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useUpdateFeedback(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync({
      id: "fb-1",
      payload: {
        status: "resolved",
        adminResponse: "Masalah telah diperbaiki.",
        adminName: "Super Admin",
      },
    });

    expect(feedbackQueries.updateFeedbackStatusAndResponse).toHaveBeenCalledWith("fb-1", {
      status: "resolved",
      adminResponse: "Masalah telah diperbaiki.",
      adminName: "Super Admin",
    });
    expect(toast.success).toHaveBeenCalledWith(expect.stringContaining("diselesaikan dan dibalas"));
  });

  it("useUpdateFeedback should toast error on failure", async () => {
    vi.mocked(feedbackQueries.updateFeedbackStatusAndResponse).mockRejectedValueOnce(
      new Error("Koneksi gagal")
    );

    const { result } = renderHook(() => useUpdateFeedback(), {
      wrapper: createWrapper(),
    });

    await expect(
      result.current.mutateAsync({
        id: "fb-1",
        payload: {
          status: "in_progress",
          adminName: "Admin",
        },
      })
    ).rejects.toThrow("Koneksi gagal");

    expect(toast.error).toHaveBeenCalledWith(expect.stringContaining("Koneksi gagal"));
  });
});
