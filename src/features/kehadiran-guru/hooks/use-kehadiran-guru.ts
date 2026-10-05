import { useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAbsensiByDateRange,
  subscribeGuruAbsensiByDateRange,
} from "@/lib/firestore/queries/kehadiran-guru.queries";
import { useGetGuru } from "@/features/guru/hooks/use-guru";
import { useGetHalaqoh } from "@/features/halaqoh/hooks/use-halaqoh";
import type {
  SesiHalaqoh,
  GuruSessionAttendance,
  ProgramAttendanceSummary,
  AbsensiRecord,
} from "../types/kehadiran-guru.types";
import type { Guru } from "@/features/guru/types/guru.types";
import type { Halaqoh } from "@/types/models/halaqoh.types";
import { getCurrentSessionForProgram } from "../utils/prayer-times";

export const KEHADIRAN_GURU_QUERY_KEY = ["kehadiran-guru"];

/** Helper to determine the current halaqoh session based on prayer times */
export function getCurrentSession(
  date: Date = new Date(),
  programType: "R" | "T" = "T"
): SesiHalaqoh {
  return getCurrentSessionForProgram(programType, date);
}

/** Calculate attendance stats for a specific program, session, and date */
export function calculateProgramStats(
  programType: "R" | "T",
  guruList: Guru[],
  halaqohList: Halaqoh[],
  absensiRecords: AbsensiRecord[],
  selectedSession: SesiHalaqoh
): { summary: ProgramAttendanceSummary; guruList: GuruSessionAttendance[] } {
  // Filter guru by program
  const filteredGuru = guruList.filter((g) => g.program === programType);

  // Build guru → halaqoh mapping
  const guruHalaqohMap = new Map<string, Halaqoh>();
  for (const halaqoh of halaqohList) {
    if (halaqoh.program === programType) {
      guruHalaqohMap.set(halaqoh.guruId, halaqoh);
    }
  }

  // Build lookup map for selected session: guruId -> absensi record
  const sessionAbsensiMap = new Map<string, AbsensiRecord>();
  for (const record of absensiRecords) {
    if (record.sesi === selectedSession) {
      const existing = sessionAbsensiMap.get(record.guruId);
      if (!existing || record.createdAt > existing.createdAt) {
        sessionAbsensiMap.set(record.guruId, record);
      }
    }
  }

  const resultList: GuruSessionAttendance[] = [];

  for (const guru of filteredGuru) {
    const halaqoh = guruHalaqohMap.get(guru.id);
    const absensiRecord = sessionAbsensiMap.get(guru.id);
    const isActive = !!absensiRecord;

    let status: GuruSessionAttendance["status"];
    if (!halaqoh) {
      status = "no-halaqoh";
    } else if (isActive) {
      status = "active";
    } else {
      status = "inactive";
    }

    resultList.push({
      guruId: guru.id,
      guruNama: guru.nama,
      guruNip: guru.nip,
      program: guru.program,
      halaqohId: halaqoh?.id ?? null,
      halaqohNama: halaqoh?.nama ?? null,
      kelas: halaqoh?.kelas ?? null,
      isActive,
      status,
      absensiTime: absensiRecord?.createdAt ?? null,
    });
  }

  // Sort: Active first, then inactive, then no-halaqoh, then by name
  const statusOrder = { active: 0, inactive: 1, "no-halaqoh": 2 };
  resultList.sort(
    (a, b) =>
      statusOrder[a.status] - statusOrder[b.status] ||
      a.guruNama.localeCompare(b.guruNama)
  );

  const totalGuru = resultList.length;
  const withHalaqoh = resultList.filter((item) => item.status !== "no-halaqoh");
  const activeCount = resultList.filter((item) => item.status === "active").length;
  const inactiveCount = resultList.filter((item) => item.status === "inactive").length;
  const noHalaqohCount = resultList.filter((item) => item.status === "no-halaqoh").length;
  const activePercentage =
    withHalaqoh.length > 0
      ? Math.round((activeCount / withHalaqoh.length) * 100)
      : 0;

  const summary: ProgramAttendanceSummary = {
    program: programType,
    totalGuru,
    totalWithHalaqoh: withHalaqoh.length,
    activeCount,
    inactiveCount,
    noHalaqohCount,
    activePercentage,
  };

  return { summary, guruList: resultList };
}

export function useProgramKehadiranGuru(
  programType: "R" | "T",
  selectedDate: Date,
  selectedSession: SesiHalaqoh
) {
  const queryClient = useQueryClient();
  const { data: guruList, isLoading: guruLoading } = useGetGuru();
  const { data: halaqohList, isLoading: halaqohLoading } = useGetHalaqoh();

  const { startDate, endDate } = useMemo(() => {
    const start = new Date(selectedDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(selectedDate);
    end.setHours(23, 59, 59, 999);
    return { startDate: start, endDate: end };
  }, [selectedDate]);

  const dateKey = startDate.toISOString().split("T")[0];

  const queryKey = useMemo(
    () => [...KEHADIRAN_GURU_QUERY_KEY, programType, dateKey],
    [programType, dateKey]
  );

  const {
    data: absensiRecords,
    isLoading: absensiLoading,
    error: absensiError,
    refetch,
    // queryKey memuat dateKey yang menentukan startDate/endDate secara 1-ke-1.
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
  } = useQuery({
    queryKey,
    queryFn: () => getAbsensiByDateRange(startDate, endDate),
    staleTime: Infinity,
    enabled: !!guruList && !!halaqohList,
  });

  // Real-time Firestore Listener
  useEffect(() => {
    if (!guruList || !halaqohList) return;

    const unsubscribe = subscribeGuruAbsensiByDateRange(
      startDate,
      endDate,
      (data) => {
        queryClient.setQueryData(queryKey, data);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [queryClient, queryKey, startDate, endDate, guruList, halaqohList]);

  const result = useMemo(() => {
    if (!guruList || !halaqohList || !absensiRecords) return null;
    return calculateProgramStats(
      programType,
      guruList,
      halaqohList,
      absensiRecords,
      selectedSession
    );
  }, [programType, guruList, halaqohList, absensiRecords, selectedSession]);

  return {
    summary: result?.summary ?? null,
    guruList: result?.guruList ?? [],
    isLoading: guruLoading || halaqohLoading || absensiLoading,
    error: absensiError,
    refetch,
  };
}
