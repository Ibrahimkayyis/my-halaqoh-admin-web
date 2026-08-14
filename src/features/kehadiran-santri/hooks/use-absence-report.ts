import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAbsensiByDateRange } from "@/lib/firestore/queries/kehadiran-santri.queries";
import { useGetGuru } from "@/features/guru/hooks/use-guru";
import { useGetHalaqoh } from "@/features/halaqoh/hooks/use-halaqoh";
import { useGetSantri } from "@/features/santri/hooks/use-santri";
import type {
  AbsenceReportData,
  DailyAbsenceData,
  OverallReportSummary,
  ReportAbsentItem,
  GroupedReportAbsentItem,
} from "../types/absence-report.types";

export const ABSENCE_REPORT_QUERY_KEY = ["santri-absence-report"];

function toLocalDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function useAbsenceReport(
  startDate: Date | null,
  endDate: Date | null,
  programFilter: "all" | "R" | "T" = "all",
  enabled: boolean = false
) {
  const { data: guruList, isLoading: guruLoading } = useGetGuru();
  const { data: halaqohList, isLoading: halaqohLoading } = useGetHalaqoh();
  const { data: santriList, isLoading: santriLoading } = useGetSantri();

  const normalizedDates = useMemo(() => {
    if (!startDate || !endDate) return null;
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }, [startDate, endDate]);

  const startKey = normalizedDates ? toLocalDateStr(normalizedDates.start) : "";
  const endKey = normalizedDates ? toLocalDateStr(normalizedDates.end) : "";

  const queryKey = useMemo(
    () => [...ABSENCE_REPORT_QUERY_KEY, startKey, endKey, programFilter],
    [startKey, endKey, programFilter]
  );

  const {
    data: absensiDocs,
    isLoading: absensiLoading,
    error,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: () => getAbsensiByDateRange(normalizedDates!.start, normalizedDates!.end),
    staleTime: 5 * 60 * 1000,
    enabled: enabled && !!normalizedDates && !!guruList && !!halaqohList && !!santriList,
  });

  const reportData = useMemo<AbsenceReportData | null>(() => {
    if (!normalizedDates || !guruList || !halaqohList || !santriList || !absensiDocs) {
      return null;
    }

    const { start, end } = normalizedDates;

    // Filter halaqoh map
    const halaqohMap = new Map();
    for (const h of halaqohList) {
      if (programFilter === "all" || h.program === programFilter) {
        halaqohMap.set(h.id, h);
      }
    }

    // Map santri by id and by nis
    const santriMap = new Map<string, any>();
    for (const s of santriList) {
      santriMap.set(s.id, s);
      if (s.nis) {
        santriMap.set(String(s.nis).trim(), s);
      }
    }

    // Group absensi docs by local date string (YYYY-MM-DD)
    const docsByDate = new Map<string, typeof absensiDocs>();
    for (const doc of absensiDocs) {
      const dStr = toLocalDateStr(doc.tanggal);
      const existing = docsByDate.get(dStr) ?? [];
      existing.push(doc);
      docsByDate.set(dStr, existing);
    }

    // Generate list of all dates from start to end inclusive
    const dailyList: DailyAbsenceData[] = [];
    const curr = new Date(start);

    let totalAbsences = 0;
    let sakitTotal = 0;
    let izinTotal = 0;
    let alfaTotal = 0;

    const statusOrder = { sakit: 0, izin: 1, alfa: 2 };
    const sessionOrder = { shubuh: 0, dhuha: 1, siang: 2, ashar: 3, maghrib: 4 };

    while (curr <= end) {
      const dateStr = toLocalDateStr(curr);
      const dateObj = new Date(curr);
      const dateFormatted = dateObj.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      const dayDocs = docsByDate.get(dateStr) ?? [];
      const absentList: ReportAbsentItem[] = [];

      for (const docData of dayDocs) {
        const halaqoh = halaqohMap.get(docData.halaqohId);
        if (!halaqoh) continue;

        for (const rec of docData.records) {
          if (rec.status === "sakit" || rec.status === "izin" || rec.status === "alfa") {
            const santri =
              santriMap.get(rec.santriId) ??
              (rec.nis ? santriMap.get(String(rec.nis).trim()) : undefined);

            absentList.push({
              santriId: santri?.id ?? rec.santriId,
              santriNama: santri?.nama ?? rec.nama,
              santriNis: santri?.nis ?? rec.nis,
              kelas: santri?.kelas ?? halaqoh.kelas,
              program: halaqoh.program as "R" | "T",
              halaqohId: halaqoh.id,
              halaqohNama: halaqoh.nama,
              guruNama: halaqoh.guruNama,
              sesi: docData.sesi,
              status: rec.status,
            });
          }
        }
      }

      // Group by santriId for session grid display
      const groupedMap = new Map<string, GroupedReportAbsentItem>();
      for (const item of absentList) {
        const existing = groupedMap.get(item.santriId);
        if (existing) {
          existing.sessions[item.sesi] = item.status;
        } else {
          groupedMap.set(item.santriId, {
            santriId: item.santriId,
            santriNama: item.santriNama,
            santriNis: item.santriNis,
            kelas: item.kelas,
            program: item.program,
            halaqohId: item.halaqohId,
            halaqohNama: item.halaqohNama,
            guruNama: item.guruNama,
            sessions: { [item.sesi]: item.status },
          });
        }
      }
      const groupedAbsentList = Array.from(groupedMap.values());
      // Sort: by number of absent sessions desc, then name
      groupedAbsentList.sort(
        (a, b) =>
          Object.keys(b.sessions).length - Object.keys(a.sessions).length ||
          a.santriNama.localeCompare(b.santriNama)
      );

      const sakit = absentList.filter((a) => a.status === "sakit").length;
      const izin = absentList.filter((a) => a.status === "izin").length;
      const alfa = absentList.filter((a) => a.status === "alfa").length;

      totalAbsences += absentList.length;
      sakitTotal += sakit;
      izinTotal += izin;
      alfaTotal += alfa;

      dailyList.push({
        date: dateObj,
        dateStr,
        dateFormatted,
        absentList: groupedAbsentList,
        summary: {
          total: absentList.length,
          sakit,
          izin,
          alfa,
        },
      });

      curr.setDate(curr.getDate() + 1);
    }

    const totalDays = dailyList.length;
    const avgPerDay = totalDays > 0 ? Number((totalAbsences / totalDays).toFixed(1)) : 0;

    const overallSummary: OverallReportSummary = {
      startDateStr: startKey,
      endDateStr: endKey,
      programFilter,
      totalDays,
      totalAbsences,
      sakitTotal,
      izinTotal,
      alfaTotal,
      avgPerDay,
    };

    return {
      days: dailyList,
      overallSummary,
    };
  }, [normalizedDates, guruList, halaqohList, santriList, absensiDocs, programFilter]);

  return {
    reportData,
    isLoading: guruLoading || halaqohLoading || santriLoading || absensiLoading,
    error,
    refetch,
  };
}
