import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAbsensiByDateRange } from "@/lib/firestore/queries/kehadiran-santri.queries";
import { useGetHalaqoh } from "@/features/halaqoh/hooks/use-halaqoh";
import { useGetSantri } from "@/features/santri/hooks/use-santri";
import { ScheduleHelper } from "../utils/schedule-helper";
import type {
  HalaqohReportData,
  HalaqohWeeklyReportBlock,
  HalaqohSantriAbsenceSummary,
} from "../types/halaqoh-report.types";

export function useHalaqohReport(
  halaqohId: string,
  startDate: Date | null,
  endDate: Date | null,
  rangeMode: "monthly" | "weekly" | "custom" = "monthly",
  periodLabel: string = "",
  enabled: boolean = false
) {
  const { data: halaqohList = [] } = useGetHalaqoh();
  const { data: santriList = [] } = useGetSantri();

  const halaqoh = useMemo(
    () => halaqohList.find((h) => h.id === halaqohId) ?? null,
    [halaqohList, halaqohId]
  );

  const members = useMemo(
    () =>
      santriList
        .filter((s) => s.halaqohId === halaqohId && !s.isAlumni)
        .sort((a, b) => a.nama.localeCompare(b.nama)),
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

    const weeklyBlocks: HalaqohWeeklyReportBlock[] = [];

    // If rangeMode is "monthly" (or custom single-span), consolidate into 1 full table
    if (rangeMode === "monthly") {
      const maxScheduledSessions = ScheduleHelper.getTotalScheduledSessions(
        startDate,
        endDate,
        program
      );

      const santriSummaries: HalaqohSantriAbsenceSummary[] = members.map((s) => {
        let hadirCount = 0;
        let sakitCount = 0;
        let izinCount = 0;
        let alfaCount = 0;

        for (const docData of halaqohAbsensi) {
          const rec = docData.records.find((r) => r.santriId === s.id || r.nis === s.nis);
          if (!rec) continue;

          switch (rec.status as string) {
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
      });

      const monthName = startDate.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
      weeklyBlocks.push({
        weekLabel: `Bulanan — ${monthName}`,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        maxScheduledSessions,
        santriSummaries,
      });
    } else if (rangeMode === "weekly") {
      // Single week block
      const maxScheduledSessions = ScheduleHelper.getTotalScheduledSessions(
        startDate,
        endDate,
        program
      );

      const santriSummaries: HalaqohSantriAbsenceSummary[] = members.map((s) => {
        let hadirCount = 0;
        let sakitCount = 0;
        let izinCount = 0;
        let alfaCount = 0;

        for (const docData of halaqohAbsensi) {
          const rec = docData.records.find((r) => r.santriId === s.id || r.nis === s.nis);
          if (!rec) continue;

          switch (rec.status as string) {
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
      });

      const startFmt = startDate.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
      const endFmt = endDate.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });

      weeklyBlocks.push({
        weekLabel: `Pekanan (${startFmt} – ${endFmt})`,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        maxScheduledSessions,
        santriSummaries,
      });
    } else {
      // Custom date range: calculate total sessions across the custom range
      const maxScheduledSessions = ScheduleHelper.getTotalScheduledSessions(
        startDate,
        endDate,
        program
      );

      const santriSummaries: HalaqohSantriAbsenceSummary[] = members.map((s) => {
        let hadirCount = 0;
        let sakitCount = 0;
        let izinCount = 0;
        let alfaCount = 0;

        for (const docData of halaqohAbsensi) {
          const rec = docData.records.find((r) => r.santriId === s.id || r.nis === s.nis);
          if (!rec) continue;

          switch (rec.status as string) {
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
      });

      const startFmt = startDate.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
      const endFmt = endDate.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });

      weeklyBlocks.push({
        weekLabel: `Kustom (${startFmt} – ${endFmt})`,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        maxScheduledSessions,
        santriSummaries,
      });
    }

    return {
      halaqohId: halaqoh.id,
      halaqohNama: halaqoh.nama,
      guruNama: halaqoh.guruNama || "-",
      kelas: halaqoh.kelas,
      program: halaqoh.program,
      startDate,
      endDate,
      periodLabel,
      rangeMode,
      weeklyBlocks,
      generatedAt: new Date(),
    };
  }, [enabled, halaqoh, members, absensiDocs, halaqohId, startDate, endDate, rangeMode, periodLabel]);

  return {
    reportData,
    isLoading,
  };
}

