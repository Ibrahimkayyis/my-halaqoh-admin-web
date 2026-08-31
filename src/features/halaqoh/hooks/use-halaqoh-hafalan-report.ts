import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useGetHalaqoh } from "./use-halaqoh";
import { useGetSantri } from "@/features/santri/hooks/use-santri";
import {
  getHafalanBySantriIds,
  type HafalanSantriDoc,
} from "@/lib/firestore/queries/kehadiran-santri.queries";
import type {
  HafalanGroupItem,
  SantriHafalanReportEntry,
  HalaqohHafalanReportData,
} from "../types/halaqoh-hafalan-report.types";

function groupRecords(records: HafalanSantriDoc[]): HafalanGroupItem[] {
  const map = new Map<string, HafalanSantriDoc[]>();

  for (const r of records) {
    const d = new Date(r.tanggalSetoran);
    const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const key = `${dateKey}_${r.jenis}_${r.nilaiKelancaran}_${r.nilaiTajwid}`;

    const existing = map.get(key) || [];
    existing.push(r);
    map.set(key, existing);
  }

  const groups: HafalanGroupItem[] = [];

  for (const list of map.values()) {
    if (list.length === 0) continue;
    const first = list[0];
    const avgScore = Math.round((first.nilaiKelancaran + first.nilaiTajwid) / 2);

    const sortedRecords = [...list].sort((a, b) => {
      if (a.surahNumber !== b.surahNumber) return a.surahNumber - b.surahNumber;
      return a.ayatMulai - b.ayatMulai;
    });

    const juzSet = Array.from(new Set(sortedRecords.map((r) => r.juz))).sort((a, b) => a - b);

    const surahDisplay = sortedRecords
      .map((r) => `${r.surah} (${r.ayatMulai}-${r.ayatSelesai})`)
      .join(", ");

    groups.push({
      tanggal: first.tanggalSetoran,
      jenis: first.jenis,
      nilaiKelancaran: first.nilaiKelancaran,
      nilaiTajwid: first.nilaiTajwid,
      avgScore,
      records: sortedRecords,
      juzList: juzSet,
      surahDisplay,
    });
  }

  // Sort groups chronologically
  groups.sort((a, b) => a.tanggal.getTime() - b.tanggal.getTime());
  return groups;
}

export function useHalaqohHafalanReport(
  halaqohId: string,
  startDate: Date | null,
  endDate: Date | null,
  periodLabel: string = "",
  enabled: boolean = false
): {
  reportData: HalaqohHafalanReportData | null;
  isLoading: boolean;
} {
  const { data: halaqohList, isLoading: halaqohLoading } = useGetHalaqoh();
  const { data: santriList, isLoading: santriLoading } = useGetSantri();

  const halaqoh = useMemo(() => {
    return halaqohList?.find((h) => h.id === halaqohId);
  }, [halaqohList, halaqohId]);

  const members = useMemo(() => {
    if (!santriList || !halaqohId) return [];
    return santriList
      .filter((s) => s.halaqohId === halaqohId && !s.isAlumni)
      .sort((a, b) => a.nama.localeCompare(b.nama));
  }, [santriList, halaqohId]);

  const memberIds = useMemo(() => members.map((m) => m.id), [members]);

  const { data: recordsBySantriId = {}, isLoading: recordsLoading } = useQuery({
    queryKey: ["halaqoh-hafalan-report-records", halaqohId, memberIds],
    queryFn: () => getHafalanBySantriIds(memberIds),
    enabled: enabled && memberIds.length > 0,
    staleTime: 60 * 1000,
  });

  const reportData = useMemo<HalaqohHafalanReportData | null>(() => {
    if (!enabled || !halaqoh || !startDate || !endDate) return null;

    const startMs = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0, 0, 0).getTime();
    const endMs = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59, 999).getTime();

    const santriEntries: SantriHafalanReportEntry[] = members.map((santri) => {
      const allRecords = recordsBySantriId[santri.id] || [];

      // Filter in date range
      const inRangeRecords = allRecords.filter((r) => {
        const t = r.tanggalSetoran.getTime();
        return t >= startMs && t <= endMs;
      });

      const groups = groupRecords(inRangeRecords);

      let totalZiyadah = 0;
      let totalMurajaah = 0;
      let scoreSum = 0;

      for (const g of groups) {
        if (g.jenis === "ziyadah") {
          totalZiyadah++;
        } else {
          totalMurajaah++;
        }
        scoreSum += g.avgScore;
      }

      const avgScore = groups.length > 0 ? Math.round(scoreSum / groups.length) : null;
      let predikat: "Mumtaz" | "Jayyid" | "Maqbul" | null = null;
      if (avgScore !== null) {
        if (avgScore >= 85) predikat = "Mumtaz";
        else if (avgScore >= 70) predikat = "Jayyid";
        else predikat = "Maqbul";
      }

      return {
        santriId: santri.id,
        nama: santri.nama,
        nis: santri.nis,
        kelas: santri.kelas,
        groups,
        totalZiyadah,
        totalMurajaah,
        avgScore,
        predikat,
      };
    });

    return {
      halaqohId: halaqoh.id,
      halaqohNama: halaqoh.nama,
      guruNama: halaqoh.guruNama || "-",
      kelas: halaqoh.kelas,
      program: halaqoh.program,
      startDate,
      endDate,
      periodLabel,
      santriEntries,
      generatedAt: new Date(),
    };
  }, [enabled, halaqoh, members, recordsBySantriId, startDate, endDate, periodLabel]);

  return {
    reportData,
    isLoading: halaqohLoading || santriLoading || recordsLoading,
  };
}
