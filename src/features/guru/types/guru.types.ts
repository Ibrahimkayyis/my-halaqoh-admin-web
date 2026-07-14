import { Timestamp } from "firebase/firestore";

// Mirror dari GuruModel di mobile app (Dart)
// Firestore collection: /guru/{id}
export interface Guru {
  id: string;                    // Firestore document ID
  nip: string;                   // 13-digit NIP
  nama: string;                  // Nama lengkap
  phone?: string | null;         // Nomor telepon
  email?: string | null;         // Email pribadi guru (opsional)
  program: "R" | "T";            // "R" = Reguler, "T" = Takhassus
  profilePicture?: string | null; // URL foto (Firebase Storage)
  authUid?: string | null;       // Firebase Auth UID (set oleh Cloud Function)
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
