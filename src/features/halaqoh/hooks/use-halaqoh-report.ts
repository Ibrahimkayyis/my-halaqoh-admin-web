import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAbsensiByDateRange } from "@/lib/firestore/queries/kehadiran-santri.queries";
import { useGetHalaqoh } from "@/features/halaqoh/hooks/use-halaqoh";
import { useGetSantri } from "@/features/santri/hooks/use-santri";
import { getScheduledSessionsForDate } from "./use-halaqoh-detail";
import type {
  HalaqohReportData,
  HalaqohWeeklyReportBlock,
  HalaqohSantriAbsenceSummary,
} from "../types/halaqoh-report.types";

export function useHalaqohReport(
  halaqohId: string,
  startDate: Date | null,
  endDate: Date | null,
  enabled: boolean = false
) {
  const { data: halaqohList = [] } = useGetHalaqoh();
  const { data: santriList = [] } = useGetSantri();

  const halaqoh = useMemo(
    () => halaqohList.find((h) => h.id === halaqohId) ?? null,
    [halaqohList, halaqohId]
  );

  const members = useMemo(
    () => santriList.filter((s) => s.halaqohId === halaqohId),
    [santriList, halaqohId]
  );

  const startKey = startDate ? startDate.toISOString().split("T")[0] : "";
  const endKey = endDate ? endDate.toISOString().split("T")[0] : "";

  const { data: absensiDocs = [], isLoading } = useQuery({
    queryKey: ["halaqoh-report", halaqohId, startKey, endKey],
    queryFn: () => getAbsensiByDateRange(startDate!, endDate!),
    enabled: enabled && !!halaqohId && !!startDate && !!endDate,
  });

  const reportData = useMemo<HalaqohReportData | null>(() => {
    if (!enabled || !halaqoh || !startDate || !endDate) return null;

    const program = halaqoh.program;
    const halaqohAbsensi = absensiDocs.filter((d) => d.halaqohId === halaqohId);

    // Group date range into weekly blocks (or max 7-day slices)
    const weeklyBlocks: HalaqohWeeklyReportBlock[] = [];
    let currentStart = new Date(startDate);
    currentStart.setHours(0, 0, 0, 0);

    const endNorm = new Date(endDate);
    endNorm.setHours(23, 59, 59, 999);

    let weekIndex = 1;

    while (currentStart <= endNorm) {
      const currentEnd = new Date(currentStart);
      currentEnd.setDate(currentEnd.getDate() + 6);
      currentEnd.setHours(23, 59, 59, 999);

      const actualEnd = currentEnd > endNorm ? new Date(endNorm) : currentEnd;

      // Calculate max scheduled sessions for this week
      let maxScheduledSessions = 0;
      const dayIter = new Date(currentStart);
      while (dayIter <= actualEnd) {
        maxScheduledSessions += getScheduledSessionsForDate(dayIter, program).length;
        dayIter.setDate(dayIter.getDate() + 1);
      }

      // Filter absensi docs falling within this week
      const weekDocs = halaqohAbsensi.filter((d) => {
        const t = d.tanggal.getTime();
        return t >= currentStart.getTime() && t <= actualEnd.getTime();
      });

      // Calculate per-santri summaries for this week
      const santriSummaries: HalaqohSantriAbsenceSummary[] = members
        .map((s) => {
          let hadirCount = 0;
          let sakitCount = 0;
          let izinCount = 0;
          let alfaCount = 0;

          for (const docData of weekDocs) {
            const rec = docData.records.find((r) => r.santriId === s.id || r.nis === s.nis);
            if (!rec) continue;

            switch (rec.status as string) {
              // Legacy Firestore values ('hadir_barcode', 'hadir_manual', 'terlambat')
              // normalized to 'hadir' here for backward compatibility
              case "hadir":
              case "hadir_barcode":
              case "hadir_manual":
              case "terlambat":
                hadirCount++;
                break;
              case "sakit":
                sakitCount++;
                break;
              case "izin":
                izinCount++;
                break;
              case "alfa":
                alfaCount++;
                break;
            }
          }

          return {
            santriId: s.id,
            nama: s.nama,
            nis: s.nis,
            maxSessions: maxScheduledSessions,
            hadirCount,
            sakitCount,
            izinCount,
            alfaCount,
          };
        })
        .sort((a, b) => a.nama.localeCompare(b.nama));

      const startFmt = currentStart.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      const endFmt = actualEnd.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      weeklyBlocks.push({
        weekLabel: `Pekan ${weekIndex} (${startFmt} – ${endFmt})`,
        startDate: new Date(currentStart),
        endDate: new Date(actualEnd),
        maxScheduledSessions,
        santriSummaries,
      });

      weekIndex++;
      currentStart.setDate(currentStart.getDate() + 7);
    }

    return {
      halaqohId: halaqoh.id,
      halaqohNama: halaqoh.nama,
      guruNama: halaqoh.guruNama,
      kelas: halaqoh.kelas,
      program: halaqoh.program,
      startDate,
      endDate,
      weeklyBlocks,
      generatedAt: new Date(),
    };
  }, [enabled, halaqoh, members, absensiDocs, halaqohId, startDate, endDate]);

  return {
    reportData,
    isLoading,
  };
}
