"use client";

import * as React from "react";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation(["halaqoh", "common"]);

  const { data: guruList = [] } = useGetGuru();
  const { data: santriList = [] } = useGetSantri();
  const { data: halaqohList = [], isLoading, isError, refetch } = useGetHalaqoh();
  const updateHalaqoh = useUpdateHalaqoh();

  const currentHalaqoh = useMemo(
    () => halaqohList.find((h) => h.id === id) ?? null,
    [halaqohList, id]
  );

  const assignedGuruIds = useMemo(() => {
    const ids = new Set<string>();
    for (const h of halaqohList) {
      if (h.id !== id) {
        ids.add(h.guruId);
      }
    }
    return ids;
  }, [halaqohList, id]);

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

  const activeSantriList = useMemo(
    () => santriList.filter((s) => !s.isAlumni),
    [santriList]
  );

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

  if (isError) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <p className="text-sm text-muted-foreground">
            {t("common:status.error")}
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCcw className="w-4 h-4 mr-2" />
            {t("common:actions.retry")}
          </Button>
        </div>
      </PageContainer>
    );
  }

  if (!currentHalaqoh) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <p className="text-sm text-muted-foreground">
            {t("halaqoh:grid.notFound")}
          </p>
          <Button variant="outline" size="sm" onClick={() => router.push("/halaqoh")}>
            {t("common:actions.back")}
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-primary">
          {t("halaqoh:form.editTitle")}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t("halaqoh:form.editSubtitle")}
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
