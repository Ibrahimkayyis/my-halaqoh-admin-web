import {
  collection,
  doc,
  getDocs,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { TargetHafalan } from "@/features/target-hafalan/types/target-hafalan.types";

const COLLECTION = "targetHafalan";

const PROGRAM_MAP_FROM_DB = {
  Reguler: "R",
  Takhassus: "T",
} as const;

const PROGRAM_MAP_TO_DB = {
  R: "Reguler",
  T: "Takhassus",
} as const;

// Helper: convert DB data to domain TargetHafalan model
function toTargetHafalan(id: string, data: Record<string, any>): TargetHafalan {
  const dbProgram = data.program as "Reguler" | "Takhassus";
  return {
    id,
    kelas: data.kelas as string,
    program: PROGRAM_MAP_FROM_DB[dbProgram] ?? "R",
    tahunAjaran: (data.tahunAjaran as string) || null,
    semesterAktif: data.semesterAktif !== undefined && data.semesterAktif !== null 
      ? Number(data.semesterAktif) as 1 | 2 
      : null,
  };
}

/**
 * Fetch all target configurations from targetHafalan collection
 */
export async function getTargetHafalan(): Promise<TargetHafalan[]> {
  const colRef = collection(db, COLLECTION);
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map((d) => toTargetHafalan(d.id, d.data()));
}

/**
 * Perform a batch write to sync Tahun Ajaran & Semester Aktif across all 12 combinations:
 * - Kelas 7-12
 * - Program Reguler & Takhassus
 * 
 * Uses defensive 'set' with merge: true to avoid mobile app crashes due to missing 'createdAt'
 * or mismatched data types (such as String instead of Int/Number).
 */
export async function updateGlobalTargetHafalan(
  tahunAjaran: string | null,
  semesterAktif: 1 | 2 | null
): Promise<void> {
  const batch = writeBatch(db);
  const classes = ["7", "8", "9", "10", "11", "12"];
  const programs = ["R", "T"] as const;

  // Fetch current documents to verify existing fields
  const colRef = collection(db, COLLECTION);
  const snapshot = await getDocs(colRef);
  const existingDocsMap = new Map(snapshot.docs.map((d) => [d.id, d.data()]));

  for (const kelas of classes) {
    for (const program of programs) {
      const dbProgramName = PROGRAM_MAP_TO_DB[program];
      const docId = `${kelas}_${dbProgramName}`;
      const docRef = doc(db, COLLECTION, docId);

      const existingData = existingDocsMap.get(docId);
      
      // Build safe update payload
      const updateData: Record<string, any> = {
        kelas,
        program: dbProgramName,
        tahunAjaran: tahunAjaran,
        semesterAktif: semesterAktif !== null ? Number(semesterAktif) : null, // Enforce number type for mobile app int? parsing
        updatedAt: serverTimestamp(),
      };

      // CRITICAL: Mobile app crash protection
      // If document is new, or existing document lacks a 'createdAt' Timestamp field,
      // we supply it to prevent TypeErrors in Flutter target_hafalan_mapper.
      if (!existingData || !existingData.createdAt) {
        updateData.createdAt = serverTimestamp();
      }

      batch.set(docRef, updateData, { merge: true });
    }
  }

  await batch.commit();
}
