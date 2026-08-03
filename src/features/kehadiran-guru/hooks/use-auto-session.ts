import { useState, useEffect, useCallback } from "react";
import type { SesiHalaqoh } from "../types/kehadiran-guru.types";
import {
  getCurrentSessionForProgram,
  getSessionBoundaries,
} from "../utils/prayer-times";

/**
 * Custom hook that manages session state with real-time automatic switching.
 * Automatically schedules a setTimeout to transition session when the prayer/time boundary is reached.
 */
export function useAutoSession(programType: "R" | "T") {
  const [selectedSession, setSelectedSessionState] = useState<SesiHalaqoh>(() =>
    getCurrentSessionForProgram(programType)
  );
  const [isAutoMode, setIsAutoMode] = useState<boolean>(true);

  const setSelectedSession = useCallback(
    (newSession: SesiHalaqoh) => {
      setSelectedSessionState(newSession);
      const currentAuto = getCurrentSessionForProgram(programType);
      // Re-enable auto mode if user chooses the current auto session, otherwise mark manual override
      setIsAutoMode(newSession === currentAuto);
    },
    [programType]
  );

  useEffect(() => {
    if (!isAutoMode) return;

    let timerId: NodeJS.Timeout | null = null;

    function scheduleNextCheck() {
      const now = new Date();
      const currentAuto = getCurrentSessionForProgram(programType, now);
      setSelectedSessionState(currentAuto);

      const boundaries = getSessionBoundaries(programType, now);
      const nowMs = now.getTime();

      let nextTransitionMs: number | null = null;
      for (const boundary of boundaries) {
        if (boundary.start.getTime() > nowMs) {
          nextTransitionMs = boundary.start.getTime();
          break;
        }
        if (boundary.end.getTime() > nowMs) {
          nextTransitionMs = boundary.end.getTime();
          break;
        }
      }

      if (!nextTransitionMs) {
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 1, 0);
        nextTransitionMs = tomorrow.getTime();
      }

      const delayMs = Math.max(1000, nextTransitionMs - nowMs);
      timerId = setTimeout(scheduleNextCheck, delayMs);
    }

    scheduleNextCheck();

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [programType, isAutoMode]);

  return {
    selectedSession,
    setSelectedSession,
    isAutoMode,
  };
}
