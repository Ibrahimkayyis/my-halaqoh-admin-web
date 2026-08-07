"use client";

import { useTranslation } from "react-i18next";
import { AbsentSantriSection } from "@/features/dashboard/components/absent-santri-section";

export default function KehadiranSantriPage() {
  const { t } = useTranslation(["kehadiranSantri", "dashboard"]);

  return (
    <div className="space-y-6">
      {/* Realtime Absent Santri Section — Program Reguler & Program Takhassus */}
      <AbsentSantriSection
        programType="R"
        titleKey="dashboard.regulerTitle"
      />

      <AbsentSantriSection
        programType="T"
        titleKey="dashboard.takhassusTitle"
      />
    </div>
  );
}
