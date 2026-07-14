"use client";

import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { HalaqohForm } from "@/features/halaqoh/components/halaqoh-form";
import type { GuruSelection } from "@/features/halaqoh/components/guru-selector";
import type { SantriSelection } from "@/features/halaqoh/components/santri-transfer-list";

// Teachers dummy list
const DUMMY_GURU: GuruSelection[] = [
  { id: "g1", nip: "19880501201501", nama: "AGUS NASRULLAH", isTeachingAnotherHalaqoh: false },
  { id: "g2", nip: "19900812201802", nama: "AGUS SIROJUL MUNIR", isTeachingAnotherHalaqoh: false },
  { id: "g3", nip: "19920315201901", nama: "AHMAD MIFTAHUDDIN", isTeachingAnotherHalaqoh: false },
  { id: "g4", nip: "19951120202102", nama: "ALIMUDDIN TARA", isTeachingAnotherHalaqoh: false },
  { id: "g5", nip: "19850312201001", nama: "HENDAR ARDIANSYAH", isTeachingAnotherHalaqoh: false },
  // Hidden teachers (already teaching another halaqoh)
  { id: "gh1", nip: "19810101200501", nama: "MAMAT RAHMATULLAH", isTeachingAnotherHalaqoh: true },
  { id: "gh2", nip: "19820202200602", nama: "ALI AKBAR PELAYATI", isTeachingAnotherHalaqoh: true },
  { id: "gh3", nip: "19830303200701", nama: "DAUD KAHFI", isTeachingAnotherHalaqoh: true },
  { id: "gh4", nip: "19840404200802", nama: "AHMAD SYAHID", isTeachingAnotherHalaqoh: true },
  { id: "gh5", nip: "19850505200901", nama: "UST. ABDURRAHMAN", isTeachingAnotherHalaqoh: true },
  { id: "gh6", nip: "19860606201002", nama: "UST. HASAN BASRI", isTeachingAnotherHalaqoh: true },
  { id: "gh7", nip: "19870707201101", nama: "UST. NUR HIDAYAT", isTeachingAnotherHalaqoh: true },
];

// Santri dummy list (116 Santri, with some in other halaqohs)
const DUMMY_SANTRI: SantriSelection[] = [
  { id: "s1", nis: "554202507001", nama: "Abyan Nazhir Ikbaarruddin", kelas: "10", program: "R", halaqohId: null },
  { id: "s2", nis: "554202507002", nama: "Ach. Fikrie Ardana Putra R.", kelas: "10", program: "R", halaqohId: null },
  { id: "s3", nis: "554202507012", nama: "Afgan Haedar Hasan", kelas: "10", program: "R", halaqohId: null },
  { id: "s4", nis: "554202507013", nama: "Ahmad Bernas Satrio", kelas: "10", program: "R", halaqohId: null },
  { id: "s5", nis: "554202507009", nama: "Ahmad Khairul Azzam", kelas: "10", program: "R", halaqohId: null },
  { id: "s6", nis: "554202507037", nama: "Ahmad Taqi Robbani", kelas: "7", program: "T", halaqohId: null },
  { id: "s7", nis: "554202507026", nama: "Al Farisyi Baihaqi", kelas: "10", program: "R", halaqohId: null },
  { id: "s8", nis: "554202507017", nama: "Arhab Muhammad Jadiid", kelas: "10", program: "R", halaqohId: null },
  { id: "s9", nis: "554202507024", nama: "Arsyad Azzam Hidayatullah", kelas: "10", program: "R", halaqohId: null },
  { id: "s10", nis: "554202507005", nama: "Ataya Rizqillah Dzihni", kelas: "10", program: "R", halaqohId: null },
  { id: "s11", nis: "554202507003", nama: "Athaa Satria Ontokusumo", kelas: "10", program: "R", halaqohId: null },
  // Santri already in other groups (50 count simulation)
  ...Array.from({ length: 50 }).map((_, i) => ({
    id: `so${i}`,
    nis: `554202508${String(i).padStart(3, "0")}`,
    nama: `Santri Group Lain ${i + 1}`,
    kelas: "8",
    program: i % 2 === 0 ? "R" : "T",
    halaqohId: "h_other",
    halaqohNama: "Halaqoh Al-Fatih",
  })),
  // Additional active santri to reach 116
  ...Array.from({ length: 55 }).map((_, i) => ({
    id: `sa${i}`,
    nis: `554202509${String(i).padStart(3, "0")}`,
    nama: `Santri Aktif ${i + 1}`,
    kelas: "9",
    program: i % 2 === 0 ? "R" : "T",
    halaqohId: null,
  })),
];

export default function BaruHalaqohPage() {
  const router = useRouter();

  const handleFormSubmit = (data: any) => {
    console.log("Create halaqoh:", data);
    router.push("/halaqoh");
  };

  const handleCancel = () => {
    router.push("/halaqoh");
  };

  return (
    <PageContainer>
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-primary">
          Tambah Halaqoh Baru
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Buat kelompok halaqoh baru, tunjuk pengampu, dan tentukan santri anggotanya.
        </p>
      </div>

      <HalaqohForm
        onSubmit={handleFormSubmit}
        onCancel={handleCancel}
        guruList={DUMMY_GURU}
        allSantriList={DUMMY_SANTRI}
      />
    </PageContainer>
  );
}
