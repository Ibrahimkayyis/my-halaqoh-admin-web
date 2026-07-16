"use client";

import { useState } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { TargetTabView } from "@/features/target-hafalan/components/target-tab-view";

export default function TargetHafalanPage() {
  // Global config — satu setting untuk seluruh kelas & program
  const [tahunAjaran, setTahunAjaran] = useState<string | null>("2026 / 2027");
  const [semesterAktif, setSemesterAktif] = useState<1 | 2 | null>(1);

  return (
    <PageContainer>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-primary">
          Target Hafalan
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Kelola kurikulum dan target hafalan per kelas untuk setiap program
        </p>
      </div>

      {/* Main Content */}
      <TargetTabView
        tahunAjaran={tahunAjaran}
        semesterAktif={semesterAktif}
        onChangeTahunAjaran={setTahunAjaran}
        onChangeSemesterAktif={setSemesterAktif}
      />
    </PageContainer>
  );
}
