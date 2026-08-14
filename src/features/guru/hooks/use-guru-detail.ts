"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  limit,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { Guru } from "../types/guru.types";
import type { Halaqoh } from "@/types/models/halaqoh.types";
import type { Santri } from "@/features/santri/types/santri.types";
import type { SesiHalaqoh } from "@/features/kehadiran-guru/types/kehadiran-guru.types";

export const GURU_DETAIL_QUERY_KEY = ["guru-detail"];

export type GuruActivityPreset = "today" | "7days" | "30days" | "thisMonth";

export interface GuruAttendanceStats {
  totalExpectedSessions: number;
  totalCompletedSessions: number;
  completionRate: number; // 0 - 100%
  lastActivityDate: Date | null;
  status: "active" | "partial" | "inactive";
  startDate: Date;
  endDate: Date;
}

/** ScheduleHelper: get scheduled sessions for a specific day of week and program */
function getScheduledSessionsForDay(
  dayOfWeek: number, // 0 = Sun, 1 = Mon, ..., 6 = Sat
  program: "R" | "T"
): SesiHalaqoh[] {
  if (program === "R") {
    // Reguler
    if (dayOfWeek >= 1 && dayOfWeek <= 4) {
      // Mon - Thu: Shubuh, Maghrib
      return ["shubuh", "maghrib"];
    } else if (dayOfWeek === 5 || dayOfWeek === 6) {
      // Fri - Sat: Maghrib
      return ["maghrib"];
    } else if (dayOfWeek === 0) {
      // Sun: Shubuh
      return ["shubuh"];
    }
  } else {
    // Takhassus
    if (dayOfWeek >= 1 && dayOfWeek <= 4) {
      // Mon - Thu: Shubuh, Dhuha, Siang, Ashar, Maghrib
      return ["shubuh", "dhuha", "siang", "ashar", "maghrib"];
    } else if (dayOfWeek === 5 || dayOfWeek === 6) {
      // Fri - Sat: Shubuh
      return ["shubuh"];
    } else if (dayOfWeek === 0) {
      // Sun: Maghrib
      return ["maghrib"];
    }
  }
  return [];
}

/** Calculate expected sessions count between two dates */
function calculateExpectedSessionsCount(
  startDate: Date,
  endDate: Date,
  program: "R" | "T"
): number {
  let count = 0;
  const current = new Date(startDate);
  current.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  while (current <= end) {
    const scheduled = getScheduledSessionsForDay(current.getDay(), program);
    count += scheduled.length;
    current.setDate(current.getDate() + 1);
  }

  return count;
}

/** Fetch a single guru document by ID (or NIP fallback) */
async function getGuruById(id: string): Promise<Guru | null> {
  if (!id) return null;

  // 1. Direct document ID
  const ref = doc(db, "guru", id);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    const data = snap.data();
    return {
      id: snap.id,
      nip: data.nip,
      nama: data.nama,
      program: data.program,
      phone: data.phone ?? null,
      email: data.email ?? null,
      profilePicture: data.profilePicture ?? null,
      authUid: data.authUid ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  // 2. Fallback: Query by NIP
  const colRef = collection(db, "guru");
  const q = query(colRef, where("nip", "==", id), limit(1));
  const qSnap = await getDocs(q);
  if (!qSnap.empty) {
    const docSnap = qSnap.docs[0];
    const data = docSnap.data();
    return {
      id: docSnap.id,
      nip: data.nip,
      nama: data.nama,
      program: data.program,
      phone: data.phone ?? null,
      email: data.email ?? null,
      profilePicture: data.profilePicture ?? null,
      authUid: data.authUid ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  return null;
}

/** Fetch halaqoh assigned to this guru */
async function getHalaqohByGuruId(guruId: string): Promise<Halaqoh | null> {
  if (!guruId) return null;
  const halaqohRef = collection(db, "halaqoh");
  const q = query(halaqohRef, where("guruId", "==", guruId), limit(1));
  const snap = await getDocs(q);

  if (snap.empty) return null;
  const docSnap = snap.docs[0];
  const data = docSnap.data();

  return {
    id: docSnap.id,
    nama: data.nama,
    kelas: data.kelas,
    program: data.program,
    guruId: data.guruId,
    guruNama: data.guruNama,
    santriIds: data.santriIds ?? [],
    jumlahSantri: data.jumlahSantri ?? (data.santriIds?.length ?? 0),
    createdAt: data.createdAt?.toDate?.() ?? new Date(),
    updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
  };
}

/** Fetch santri roster documents by array of IDs */
async function getSantriMembers(santriIds: string[]): Promise<Santri[]> {
  if (!santriIds || santriIds.length === 0) return [];

  const santriList: Santri[] = [];

  // Firestore in queries are limited to 30 items
  const chunkSize = 30;
  for (let i = 0; i < santriIds.length; i += chunkSize) {
    const chunk = santriIds.slice(i, i + chunkSize);
    const santriRef = collection(db, "santri");
    const q = query(santriRef, where("__name__", "in", chunk));
    const snap = await getDocs(q);

    for (const d of snap.docs) {
      const data = d.data();
      santriList.push({
        id: d.id,
        nis: data.nis,
        nama: data.nama,
        kelas: data.kelas,
        program: data.program,
        halaqohId: data.halaqohId ?? null,
        isAlumni: data.isAlumni ?? false,
        profilePicture: data.profilePicture ?? null,
        authUid: data.authUid ?? null,
        waliSantri: data.waliSantri ?? null,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    }
  }

  // Sort alphabetically by name
  santriList.sort((a, b) => a.nama.localeCompare(b.nama));
  return santriList;
}

/** Fetch attendance records for this guru within date range */
async function getGuruAttendanceRecords(
  guruId: string,
  startDate: Date,
  endDate: Date
) {
  const absensiRef = collection(db, "absensi");
  const q = query(
    absensiRef,
    where("guruId", "==", guruId),
    where("tanggal", ">=", Timestamp.fromDate(startDate)),
    where("tanggal", "<=", Timestamp.fromDate(endDate))
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      halaqohId: data.halaqohId as string,
      guruId: data.guruId as string,
      tanggal: (data.tanggal as Timestamp).toDate(),
      sesi: data.sesi as SesiHalaqoh,
      createdAt: (data.createdAt as Timestamp)?.toDate() ?? (data.tanggal as Timestamp).toDate(),
    };
  });
}

/**
 * Main hook for fetching Guru Profile, Halaqoh, and Santri Roster
 */
export function useGuruDetail(guruId: string) {
  // 1. Fetch Guru Document
  const { data: guru, isLoading: guruLoading, error: guruError } = useQuery({
    queryKey: [...GURU_DETAIL_QUERY_KEY, "guru", guruId],
    queryFn: () => getGuruById(guruId),
    enabled: !!guruId,
  });

  // 2. Fetch Halaqoh supervised by this Guru
  const { data: halaqoh, isLoading: halaqohLoading } = useQuery({
    queryKey: [...GURU_DETAIL_QUERY_KEY, "halaqoh", guru?.id ?? guruId],
    queryFn: () => getHalaqohByGuruId(guru?.id ?? guruId),
    enabled: !!guruId,
  });

  // 3. Fetch Santri Members of this Halaqoh
  const santriIds = halaqoh?.santriIds ?? [];
  const { data: members = [], isLoading: membersLoading } = useQuery({
    queryKey: [...GURU_DETAIL_QUERY_KEY, "members", halaqoh?.id, santriIds],
    queryFn: () => getSantriMembers(santriIds),
    enabled: santriIds.length > 0,
  });

  return {
    guru: guru ?? null,
    halaqoh: halaqoh ?? null,
    members,
    isLoading: guruLoading || halaqohLoading || (santriIds.length > 0 && membersLoading),
    error: guruError,
  };
}

/**
 * Hook for calculating Guru Attendance Activity Statistics based on selected period preset
 */
export function useGuruAttendanceStats(
  guruId: string,
  program: "R" | "T" = "R",
  hasHalaqoh: boolean = true,
  preset: GuruActivityPreset = "30days"
) {
  const { startDate, endDate } = useMemo(() => {
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const start = new Date();
    start.setHours(0, 0, 0, 0);

    if (preset === "today") {
      // Start is already today 00:00:00
    } else if (preset === "7days") {
      start.setDate(end.getDate() - 6);
    } else if (preset === "30days") {
      start.setDate(end.getDate() - 29);
    } else if (preset === "thisMonth") {
      start.setDate(1);
    }

    return { startDate: start, endDate: end };
  }, [preset]);

  const { data: records = [], isLoading } = useQuery({
    queryKey: [...GURU_DETAIL_QUERY_KEY, "attendance", guruId, preset, startDate.toISOString(), endDate.toISOString()],
    queryFn: () => getGuruAttendanceRecords(guruId, startDate, endDate),
    enabled: !!guruId,
  });

  const stats: GuruAttendanceStats = useMemo(() => {
    if (!hasHalaqoh) {
      return {
        totalExpectedSessions: 0,
        totalCompletedSessions: 0,
        completionRate: 0,
        lastActivityDate: null,
        status: "inactive",
        startDate,
        endDate,
      };
    }

    const totalExpected = calculateExpectedSessionsCount(startDate, endDate, program);

    // Group completed sessions by unique (YYYY-MM-DD + sesi)
    const uniqueSessions = new Set<string>();
    let latestActivity: Date | null = null;

    for (const rec of records) {
      const dateStr = rec.tanggal.toISOString().split("T")[0];
      uniqueSessions.add(`${dateStr}_${rec.sesi}`);

      if (!latestActivity || rec.createdAt > latestActivity) {
        latestActivity = rec.createdAt;
      }
    }

    const totalCompleted = uniqueSessions.size;
    const completionRate = totalExpected > 0 ? Math.min(100, Math.round((totalCompleted / totalExpected) * 100)) : 0;

    let status: "active" | "partial" | "inactive" = "inactive";
    if (completionRate >= 80) {
      status = "active";
    } else if (completionRate > 0) {
      status = "partial";
    }

    return {
      totalExpectedSessions: totalExpected,
      totalCompletedSessions: totalCompleted,
      completionRate,
      lastActivityDate: latestActivity,
      status,
      startDate,
      endDate,
    };
  }, [records, hasHalaqoh, program, startDate, endDate]);

  return {
    stats,
    isLoading,
    records,
  };
}
