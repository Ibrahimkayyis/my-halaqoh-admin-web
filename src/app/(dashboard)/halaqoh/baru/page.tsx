"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { HalaqohForm } from "@/features/halaqoh/components/halaqoh-form";
import { useGetHalaqoh, useCreateHalaqoh } from "@/features/halaqoh/hooks/use-halaqoh";
import { useGetGuru } from "@/features/guru/hooks/use-guru";
import { useGetSantri } from "@/features/santri/hooks/use-santri";
import type { HalaqohFormValues } from "@/features/halaqoh/schemas/halaqoh.schema";

export default function BaruHalaqohPage() {
  const router = useRouter();

  // Fetch data from Firestore
  const { data: guruList = [] } = useGetGuru();
  const { data: santriList = [] } = useGetSantri();
  const { data: halaqohList = [] } = useGetHalaqoh();
  const createHalaqoh = useCreateHalaqoh();

  // Compute which guru are already assigned to another halaqoh
  const assignedGuruIds = useMemo(() => {
    const ids = new Set<string>();
    for (const h of halaqohList) {
      ids.add(h.guruId);
    }
    return ids;
  }, [halaqohList]);

  // Compute which santri are already in a halaqoh
  const assignedSantriIds = useMemo(() => {
    const ids = new Set<string>();
    for (const h of halaqohList) {
      for (const sid of h.santriIds) {
        ids.add(sid);
      }
    }
    return ids;
  }, [halaqohList]);

  // Only show non-alumni santri
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
          Tambah Halaqoh Baru
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Buat kelompok halaqoh baru, tunjuk pengampu, dan tentukan santri anggotanya.
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
