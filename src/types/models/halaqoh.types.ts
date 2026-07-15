import type { Timestamp } from "firebase/firestore";

// ==================== RAW FIRESTORE DOCUMENT ====================

export interface HalaqohDoc {
  nama: string;
  kelas: string;
  program: "R" | "T";
  guruId: string;
  guruNama: string;
  santriIds: string[];
  jumlahSantri: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ==================== DOMAIN MODEL (after conversion) ====================

export interface Halaqoh extends Omit<HalaqohDoc, "createdAt" | "updatedAt"> {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== FORM VALUES ====================

export type HalaqohFormValues = {
  nama: string;
  kelas: string;
  program: "R" | "T";
  guruId: string;
  guruNama: string;
  santriIds: string[];
};
