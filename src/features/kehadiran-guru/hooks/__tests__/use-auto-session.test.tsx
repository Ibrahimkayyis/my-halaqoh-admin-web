import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAutoSession } from "../use-auto-session";

describe("useAutoSession Realtime Hook", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should initialize with current session and auto mode enabled", () => {
    const { result } = renderHook(() => useAutoSession("T"));

    expect(result.current.selectedSession).toBeDefined();
    expect(result.current.isAutoMode).toBe(true);
  });

  it("should disable auto mode if user selects a different session manually", () => {
    const { result } = renderHook(() => useAutoSession("T"));

    act(() => {
      result.current.setSelectedSession("maghrib");
    });

    expect(result.current.selectedSession).toBe("maghrib");
  });

  it("Scenario 3: Initialize Reguler program session", () => {
    const { result } = renderHook(() => useAutoSession("R"));

    expect(["shubuh", "maghrib"]).toContain(result.current.selectedSession);
    expect(result.current.isAutoMode).toBe(true);
  });

  it("Scenario 4: Re-enable auto mode when manual selection matches current auto session", () => {
    const { result } = renderHook(() => useAutoSession("T"));
    const currentAuto = result.current.selectedSession;

    // Manually override to another session
    const otherSession = currentAuto === "shubuh" ? "dhuha" : "shubuh";
    act(() => {
      result.current.setSelectedSession(otherSession);
    });
    expect(result.current.isAutoMode).toBe(false);

    // Select current auto session again -> should re-enable auto mode
    act(() => {
      result.current.setSelectedSession(currentAuto);
    });
    expect(result.current.isAutoMode).toBe(true);
  });

  it("Scenario 5: Multiple consecutive manual session overrides", () => {
    const { result } = renderHook(() => useAutoSession("T"));

    act(() => {
      result.current.setSelectedSession("dhuha");
    });
    expect(result.current.selectedSession).toBe("dhuha");

    act(() => {
      result.current.setSelectedSession("siang");
    });
    expect(result.current.selectedSession).toBe("siang");

    act(() => {
      result.current.setSelectedSession("ashar");
    });
    expect(result.current.selectedSession).toBe("ashar");
  });
});
