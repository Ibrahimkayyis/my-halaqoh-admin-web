"use client";

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { PageContainer } from "@/components/layout/page-container";
import {
  SertifikasiFilterBar,
  type TimeFilterPreset,
} from "@/features/sertifikasi/components/sertifikasi-filter-bar";
import { SertifikasiTable } from "@/features/sertifikasi/components/sertifikasi-table";
import { SertifikasiScheduleDialog } from "@/features/sertifikasi/components/sertifikasi-schedule-dialog";
import { SertifikasiRejectDialog } from "@/features/sertifikasi/components/sertifikasi-reject-dialog";
import { SertifikasiGradingDialog } from "@/features/sertifikasi/components/sertifikasi-grading-dialog";
import { SertifikasiDetailDialog } from "@/features/sertifikasi/components/sertifikasi-detail-dialog";
import { useGetSertifikasi } from "@/features/sertifikasi/hooks/use-sertifikasi";
import type { SertifikasiTahfidz } from "@/features/sertifikasi/types/sertifikasi.types";

function getDateRange(
  preset: TimeFilterPreset,
  customDate: string,
  customStartDate: string,
  customEndDate: string
): { start: Date; end: Date } | null {
  if (preset === "all") return null;

  const now = new Date();

  if (preset === "today") {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  if (preset === "7days") {
    const start = new Date(now);
    start.setDate(start.getDate() - 7);
    start.setHours(0, 0, 0, 0);
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  if (preset === "30days") {
    const start = new Date(now);
    start.setDate(start.getDate() - 30);
    start.setHours(0, 0, 0, 0);
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  if (preset === "thisMonth") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    return { start, end };
  }

  if (preset === "customDate") {
    if (!customDate) return null;
    const parts = customDate.split("-").map(Number);
    if (parts.length !== 3) return null;
    const start = new Date(parts[0], parts[1] - 1, parts[2], 0, 0, 0, 0);
    const end = new Date(parts[0], parts[1] - 1, parts[2], 23, 59, 59, 999);
    return { start, end };
  }

  if (preset === "customRange") {
    if (!customStartDate || !customEndDate) return null;
    const sParts = customStartDate.split("-").map(Number);
    const eParts = customEndDate.split("-").map(Number);
    if (sParts.length !== 3 || eParts.length !== 3) return null;
    const start = new Date(sParts[0], sParts[1] - 1, sParts[2], 0, 0, 0, 0);
    const end = new Date(eParts[0], eParts[1] - 1, eParts[2], 23, 59, 59, 999);
    return { start, end };
  }

  return null;
}

export default function SertifikasiTahfidzPage() {
  const { t } = useTranslation(["sertifikasi", "common"]);

  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);
  const sevenDaysAgoStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split("T")[0];
  }, []);

  // Filter States
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState("semua");
  const [selectedKelas, setSelectedKelas] = useState("semua");
  const [selectedProgram, setSelectedProgram] = useState("semua");
  const [timePreset, setTimePreset] = useState<TimeFilterPreset>("all");
  const [customDate, setCustomDate] = useState(todayStr);
  const [customStartDate, setCustomStartDate] = useState(sevenDaysAgoStr);
  const [customEndDate, setCustomEndDate] = useState(todayStr);


  // Dialog States & Selected Item
  const [selectedItem, setSelectedItem] = useState<SertifikasiTahfidz | null>(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [gradingOpen, setGradingOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  // Queries
  const { data: sertifikasiList = [], isLoading } = useGetSertifikasi();

  // Status Counts for Tabs
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      pending: 0,
      scheduled: 0,
      passed: 0,
      failed: 0,
      rejected: 0,
    };
    for (const item of sertifikasiList) {
      if (counts[item.status] !== undefined) {
        counts[item.status]++;
      }
    }
    return counts;
  }, [sertifikasiList]);

  const dateRange = useMemo(
    () => getDateRange(timePreset, customDate, customStartDate, customEndDate),
    [timePreset, customDate, customStartDate, customEndDate]
  );

  // Client-side filtering logic
  const filteredList = useMemo(() => {
    return sertifikasiList.filter((item) => {
      // 1. Filter by Active Tab Status
      if (activeStatus !== "semua" && item.status !== activeStatus) {
        return false;
      }

      // 2. Filter by search (Nama or NIS)
      if (search) {
        const queryVal = search.toLowerCase();
        const matchNama = item.santriNama.toLowerCase().includes(queryVal);
        const matchNis = item.nis.includes(queryVal);
        if (!matchNama && !matchNis) return false;
      }

      // 3. Filter by Kelas
      if (selectedKelas !== "semua" && item.kelas !== selectedKelas) {
        return false;
      }

      // 4. Filter by Program
      if (selectedProgram !== "semua" && item.program !== selectedProgram) {
        return false;
      }

      // 5. Filter by Time / Date Range
      if (dateRange) {
        const { start, end } = dateRange;
        const dCreated = item.createdAt?.toDate ? item.createdAt.toDate() : null;
        const dUjian = item.tanggalUjian?.toDate ? item.tanggalUjian.toDate() : null;
        const dCompleted = item.completedAt?.toDate ? item.completedAt.toDate() : null;

        const inRange = [dCreated, dUjian, dCompleted].some((d) => {
          if (!d) return false;
          const time = d.getTime();
          return time >= start.getTime() && time <= end.getTime();
        });

        if (!inRange) return false;
      }

      return true;
    });
  }, [sertifikasiList, activeStatus, search, selectedKelas, selectedProgram, dateRange]);

  // Handlers for Table Actions
  const handleApproveClick = (item: SertifikasiTahfidz) => {
    setSelectedItem(item);
    setScheduleOpen(true);
  };

  const handleRejectClick = (item: SertifikasiTahfidz) => {
    setSelectedItem(item);
    setRejectOpen(true);
  };

  const handleGradeClick = (item: SertifikasiTahfidz) => {
    setSelectedItem(item);
    setGradingOpen(true);
  };

  const handleDetailClick = (item: SertifikasiTahfidz) => {
    setSelectedItem(item);
    setDetailOpen(true);
  };

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-primary">
            {t("sertifikasi:subtitle", "Kelola pendaftaran, jadwal, dan penilaian ujian sertifikasi 1 juz santri")}
          </h1>
        </div>
      </div>

      {/* Filter Bar */}
      <SertifikasiFilterBar
        search={search}
        setSearch={setSearch}
        activeStatus={activeStatus}
        setActiveStatus={setActiveStatus}
        selectedKelas={selectedKelas}
        setSelectedKelas={setSelectedKelas}
        selectedProgram={selectedProgram}
        setSelectedProgram={setSelectedProgram}
        timePreset={timePreset}
        setTimePreset={setTimePreset}
        customDate={customDate}
        setCustomDate={setCustomDate}
        customStartDate={customStartDate}
        setCustomStartDate={setCustomStartDate}
        customEndDate={customEndDate}
        setCustomEndDate={setCustomEndDate}
        statusCounts={statusCounts}
        filteredCount={filteredList.length}
        totalCount={sertifikasiList.length}
      />


      {/* Main Table */}
      <SertifikasiTable
        data={filteredList}
        isLoading={isLoading}
        onApprove={handleApproveClick}
        onReject={handleRejectClick}
        onGrade={handleGradeClick}
        onDetail={handleDetailClick}
      />

      {/* Dialogs */}
      <SertifikasiScheduleDialog
        open={scheduleOpen}
        onOpenChange={setScheduleOpen}
        item={selectedItem}
      />

      <SertifikasiRejectDialog
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        item={selectedItem}
      />

      <SertifikasiGradingDialog
        open={gradingOpen}
        onOpenChange={setGradingOpen}
        item={selectedItem}
      />

      <SertifikasiDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        item={selectedItem}
      />
    </PageContainer>
  );
}
