import { Timestamp } from "firebase/firestore";

// Embedded map inside santri document — NOT a separate collection
export interface WaliSantri {
  nama: string;
  phone: string;
  hubungan: string; // "Ayah" | "Ibu" | "Wali"
}

// Mirror dari SantriModel di mobile app (Dart)
// Firestore collection: /santri/{id}
export interface Santri {
  id: string;           // Firestore document ID
  nis: string;          // 12-digit NIS, juga barcode kartu santri
  nama: string;         // Nama lengkap
  profilePicture?: string | null; // URL foto (Firebase Storage)
  kelas: string;        // "7" – "12"
  program: string;      // "R" = Reguler, "T" = Takhassus
  halaqohId?: string | null;      // ID halaqoh yang diikuti
  waliSantri?: WaliSantri | null; // Data wali santri (embedded map)
  authUid?: string | null;        // Firebase Auth UID (set oleh Cloud Function)
  isAlumni: boolean;    // true jika sudah lulus (kelas 12 → alumni)
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
