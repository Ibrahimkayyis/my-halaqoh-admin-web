import { useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAbsensiByDateRange,
  subscribeAbsensiByDateRange,
} from "@/lib/firestore/queries/kehadiran-santri.queries";
import { useGetGuru } from "@/features/guru/hooks/use-guru";
import { useGetHalaqoh } from "@/features/halaqoh/hooks/use-halaqoh";
import { useGetSantri } from "@/features/santri/hooks/use-santri";
import type { SesiHalaqoh } from "@/features/kehadiran-guru/types/kehadiran-guru.types";
import type {
  SantriAbsentItem,
  AbsentSantriSummary,
} from "@/features/kehadiran-santri/types/kehadiran-santri.types";

export const DASHBOARD_ABSENT_QUERY_KEY = ["dashboard-absent-santri"];

export function useDashboardAbsentSantri(
  programType: "R" | "T",
  selectedDate: Date,
  selectedSession: SesiHalaqoh
) {
  const queryClient = useQueryClient();
  const { data: guruList, isLoading: guruLoading } = useGetGuru();
  const { data: halaqohList, isLoading: halaqohLoading } = useGetHalaqoh();
  const { data: santriList, isLoading: santriLoading } = useGetSantri();

  const { startDate, endDate } = useMemo(() => {
    const start = new Date(selectedDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(selectedDate);
    end.setHours(23, 59, 59, 999);
    return { startDate: start, endDate: end };
  }, [selectedDate]);

  const dateKey = startDate.toISOString().split("T")[0];

  const queryKey = useMemo(
    () => [...DASHBOARD_ABSENT_QUERY_KEY, programType, dateKey],
    [programType, dateKey]
  );

  const {
    data: absensiDocs,
    isLoading: absensiLoading,
    error,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: () => getAbsensiByDateRange(startDate, endDate),
    staleTime: Infinity,
    enabled: !!guruList && !!halaqohList && !!santriList,
  });

  // Real-time Firestore Listener
  useEffect(() => {
    if (!guruList || !halaqohList || !santriList) return;

    const unsubscribe = subscribeAbsensiByDateRange(
      startDate,
      endDate,
      (data) => {
        queryClient.setQueryData(queryKey, data);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [queryClient, queryKey, startDate, endDate, guruList, halaqohList, santriList]);

  const result = useMemo(() => {
    if (!guruList || !halaqohList || !santriList || !absensiDocs) return null;

    // Filter halaqoh by program
    const halaqohMap = new Map();
    for (const h of halaqohList) {
      if (h.program === programType) {
        halaqohMap.set(h.id, h);
      }
    }

    // Map santri by id
    const santriMap = new Map();
    for (const s of santriList) {
      santriMap.set(s.id, s);
    }

    const absentList: SantriAbsentItem[] = [];

    // Filter absensi docs matching selected session & halaqoh in program
    for (const docData of absensiDocs) {
      if (docData.sesi !== selectedSession) continue;
      const halaqoh = halaqohMap.get(docData.halaqohId);
      if (!halaqoh) continue;

      for (const rec of docData.records) {
        if (rec.status === "sakit" || rec.status === "izin" || rec.status === "alfa") {
          const santri = santriMap.get(rec.santriId);
          absentList.push({
            santriId: rec.santriId,
            santriNama: santri?.nama ?? rec.nama,
            santriNis: santri?.nis ?? rec.nis,
            kelas: santri?.kelas ?? halaqoh.kelas,
            program: programType,
            halaqohId: halaqoh.id,
            halaqohNama: halaqoh.nama,
            guruNama: halaqoh.guruNama,
            sesi: docData.sesi,
            status: rec.status,
          });
        }
      }
    }

    // Sort: Sakit -> Izin -> Alfa -> Name
    const statusOrder = { sakit: 0, izin: 1, alfa: 2 };
    absentList.sort(
      (a, b) =>
        statusOrder[a.status] - statusOrder[b.status] ||
        a.santriNama.localeCompare(b.santriNama)
    );

    const summary: AbsentSantriSummary = {
      program: programType,
      totalAbsent: absentList.length,
      sakitCount: absentList.filter((a) => a.status === "sakit").length,
      izinCount: absentList.filter((a) => a.status === "izin").length,
      alfaCount: absentList.filter((a) => a.status === "alfa").length,
    };

    return { absentList, summary };
  }, [programType, guruList, halaqohList, santriList, absensiDocs, selectedSession]);

  return {
    absentList: result?.absentList ?? [],
    summary: result?.summary ?? null,
    isLoading: guruLoading || halaqohLoading || santriLoading || absensiLoading,
    error,
    refetch,
  };
}
