"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { PageContainer } from "@/components/layout/page-container";
import { HalaqohForm } from "@/features/halaqoh/components/halaqoh-form";
import { useGetHalaqoh, useCreateHalaqoh } from "@/features/halaqoh/hooks/use-halaqoh";
import { useGetGuru } from "@/features/guru/hooks/use-guru";
import { useGetSantri } from "@/features/santri/hooks/use-santri";
import type { HalaqohFormValues } from "@/features/halaqoh/schemas/halaqoh.schema";

export default function BaruHalaqohPage() {
  const router = useRouter();
  const { t } = useTranslation(["halaqoh", "common"]);

  const { data: guruList = [] } = useGetGuru();
  const { data: santriList = [] } = useGetSantri();
  const { data: halaqohList = [] } = useGetHalaqoh();
  const createHalaqoh = useCreateHalaqoh();

  const assignedGuruIds = useMemo(() => {
    const ids = new Set<string>();
    for (const h of halaqohList) {
      ids.add(h.guruId);
    }
    return ids;
  }, [halaqohList]);

  const assignedSantriIds = useMemo(() => {
    const ids = new Set<string>();
    for (const h of halaqohList) {
      for (const sid of h.santriIds) {
        ids.add(sid);
      }
    }
    return ids;
  }, [halaqohList]);

  const activeSantriList = useMemo(
    () => santriList.filter((s) => !s.isAlumni),
    [santriList]
  );

  const handleFormSubmit = (data: HalaqohFormValues) => {
    createHalaqoh.mutate({
      nama: data.nama,
      kelas: data.kelas,
      program: data.program,
      guruId: data.guruId,
      guruNama: data.guruNama,
      santriIds: data.santriIds,
    });
  };

  const handleCancel = () => {
    router.push("/halaqoh");
  };

  return (
    <PageContainer>
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-primary">
          {t("halaqoh:form.createTitle")}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t("halaqoh:form.createSubtitle")}
        </p>
      </div>

      <HalaqohForm
        onSubmit={handleFormSubmit}
        onCancel={handleCancel}
        isSubmitting={createHalaqoh.isPending}
        guruList={guruList}
        allSantriList={activeSantriList}
        assignedGuruIds={assignedGuruIds}
        assignedSantriIds={assignedSantriIds}
      />
    </PageContainer>
  );
}
