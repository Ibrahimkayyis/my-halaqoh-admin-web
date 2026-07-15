"use client";

import * as React from "react";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { HalaqohForm } from "@/features/halaqoh/components/halaqoh-form";
import { useGetHalaqoh, useUpdateHalaqoh } from "@/features/halaqoh/hooks/use-halaqoh";
import { useGetGuru } from "@/features/guru/hooks/use-guru";
import { useGetSantri } from "@/features/santri/hooks/use-santri";
import type { HalaqohFormValues } from "@/features/halaqoh/schemas/halaqoh.schema";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditHalaqohPage({ params }: PageProps) {
  const { id } = React.use(params);
  const router = useRouter();

  // Fetch all needed data
  const { data: guruList = [] } = useGetGuru();
  const { data: santriList = [] } = useGetSantri();
  const { data: halaqohList = [], isLoading, isError, refetch } = useGetHalaqoh();
  const updateHalaqoh = useUpdateHalaqoh();

  // Find the halaqoh being edited
  const currentHalaqoh = useMemo(
    () => halaqohList.find((h) => h.id === id) ?? null,
    [halaqohList, id]
  );

  // Compute assigned guru — exclude current halaqoh's guru so they stay selectable
  const assignedGuruIds = useMemo(() => {
    const ids = new Set<string>();
    for (const h of halaqohList) {
      if (h.id !== id) {
        // don't mark current halaqoh's guru as assigned
        ids.add(h.guruId);
      }
    }
    return ids;
  }, [halaqohList, id]);

  // Compute assigned santri — exclude santri already in THIS halaqoh so they stay selectable
  const assignedSantriIds = useMemo(() => {
    const ids = new Set<string>();
    for (const h of halaqohList) {
      if (h.id !== id) {
        for (const sid of h.santriIds) {
          ids.add(sid);
        }
      }
    }
    return ids;
  }, [halaqohList, id]);

  // Only show non-alumni santri
  const activeSantriList = useMemo(
    () => santriList.filter((s) => !s.isAlumni),
    [santriList]
  );

  // Build initial form values from the found halaqoh
  const initialValues = useMemo<HalaqohFormValues | null>(() => {
    if (!currentHalaqoh) return null;
    return {
      nama: currentHalaqoh.nama,
      kelas: currentHalaqoh.kelas,
      program: currentHalaqoh.program,
      guruId: currentHalaqoh.guruId,
      guruNama: currentHalaqoh.guruNama,
      santriIds: currentHalaqoh.santriIds,
    };
  }, [currentHalaqoh]);

  const handleFormSubmit = (data: HalaqohFormValues) => {
    updateHalaqoh.mutate({
      id,
      data: {
        nama: data.nama,
        kelas: data.kelas,
        program: data.program,
        guruId: data.guruId,
        guruNama: data.guruNama,
        santriIds: data.santriIds,
      },
    });
  };

  const handleCancel = () => {
    router.push("/halaqoh");
  };

  // Loading state
  if (isLoading) {
    return (
      <PageContainer>
        <div className="mb-6">
          <div className="h-7 w-48 bg-muted/50 rounded animate-pulse" />
          <div className="h-4 w-72 bg-muted/30 rounded animate-pulse mt-2" />
        </div>
        <div className="h-[480px] max-w-2xl mx-auto rounded-lg bg-muted/30 animate-pulse border border-border/30" />
      </PageContainer>
    );
  }

  // Error state
  if (isError) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <p className="text-sm text-muted-foreground">
            Gagal memuat data halaqoh. Silakan coba lagi.
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCcw className="w-4 h-4 mr-2" />
            Coba Lagi
          </Button>
        </div>
      </PageContainer>
    );
  }

  // Not found state
  if (!currentHalaqoh) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <p className="text-sm text-muted-foreground">
            Halaqoh tidak ditemukan.
          </p>
          <Button variant="outline" size="sm" onClick={() => router.push("/halaqoh")}>
            Kembali ke Daftar Halaqoh
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-primary">
          Edit Data Halaqoh
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Perbarui nama kelompok, guru pengampu, atau kelola daftar santri anggotanya.
        </p>
      </div>

      <HalaqohForm
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
        onCancel={handleCancel}
        isSubmitting={updateHalaqoh.isPending}
        guruList={guruList}
        allSantriList={activeSantriList}
        assignedGuruIds={assignedGuruIds}
        assignedSantriIds={assignedSantriIds}
      />
    </PageContainer>
  );
}
