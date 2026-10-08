import { Timestamp } from "firebase/firestore";

// Mirror dari SertifikasiModel di mobile app (Dart)
// Firestore collection: /sertifikasi_tahfidz/{id}

export type SertifikasiStatus = "pending" | "scheduled" | "rejected" | "passed" | "failed";

export const SERTIFIKASI_STATUSES: SertifikasiStatus[] = [
  "pending",
  "scheduled",
  "rejected",
  "passed",
  "failed",
];

export interface SertifikasiTahfidz {
  id: string; // Firestore document ID

  // Santri identity
  santriId: string;
  santriNama: string;
  nis: string;
  kelas: string;
  program: "R" | "T";
  profilePicture?: string | null;

  // Halaqoh & Guru pendaftar
  halaqohId: string;
  halaqohNama: string;
  guruId: string;
  guruNama: string;
  catatanGuru?: string | null;

  // Target juz
  juz: number; // 1..30

  // Status
  status: SertifikasiStatus;

  // Scheduling (diisi oleh Waka Tahfidz saat approve)
  tanggalUjian?: Timestamp | null;
  sesiUjian?: string | null;
  pengujiId?: string | null;
  pengujiNama?: string | null;
  catatanAdmin?: string | null;
  alasanPenolakan?: string | null;

  // Grading (diisi oleh Waka Tahfidz setelah ujian selesai)
  nilai?: number | null; // Skala 0 - 100
  predikat?: string | null;
  catatanPenguji?: string | null;

  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
  completedAt?: Timestamp | null;
}

// Dewan Penguji Sertifikasi Tahfidz
// Firestore collection: /penguji_sertifikasi/{id}
export interface PengujiSertifikasi {
  id: string; // Document ID (menggunakan guruId atau auto id)
  guruId: string; // Referensi ID dokumen guru
  nip: string;
  nama: string;
  isDefault?: boolean; // True jika termasuk 4 penguji awal
  createdAt?: Timestamp;
}

// Daftar ustadz penguji bersertifikat yang ditetapkan sebagai default
export const TIM_PENGUJI_SERTIFIKASI = [
  { nip: "5542019010519", nama: "MUFTI ALFARUQI" },
  { nip: "554212201013", nama: "MUHAMMAD ARJUNA" },
  { nip: "554252601001", nama: "DAUD KAHFI" },
  { nip: "5542018010152", nama: "ABDURRAHMAN JAILANI" },
] as const;

// Sesi ujian preset umum
export const SESI_UJIAN_PRESETS = [
  "Pagi (08:00 - 09:30 WIB)",
  "Siang (10:00 - 11:30 WIB)",
  "Sore (13:30 - 15:00 WIB)",
  "Ba'da Ashar (16:00 - 17:30 WIB)",
  "Ba'da Maghrib (18:15 - 19:30 WIB)",
  "Ba'da Subuh (05:30 - 06:45 WIB)",
] as const;

// Helper kalkulasi predikat kelulusan berdasarkan nilai ujian
export function calculatePredikat(score: number): string {
  if (score >= 90) return "Mumtaz (Istimewa)";
  if (score >= 80) return "Jayyid Jiddan (Sangat Baik)";
  if (score >= 70) return "Jayyid (Baik)";
  if (score >= 60) return "Maqbul (Cukup)";
  return "Rasib (Kurang)";
}
