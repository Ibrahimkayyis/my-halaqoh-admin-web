"use client";

import { useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { PageContainer } from "@/components/layout/page-container";
import { TargetTabView } from "@/features/target-hafalan/components/target-tab-view";
import { useGetTargetHafalan, useUpdateGlobalTarget } from "@/features/target-hafalan/hooks/use-target-hafalan";
import { RefreshCcw, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { collection, getDocs, writeBatch, doc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export default function TargetHafalanPage() {
  const { t } = useTranslation(["targetHafalan", "common"]);
  const { data: targets = [], isLoading, isError, refetch } = useGetTargetHafalan();
  const updateMutation = useUpdateGlobalTarget();

  // Auto-cleanup legacy targetHafalan documents (e.g. "7_R") in the collection.
  useEffect(() => {
    if (targets.length === 0) return;

    const runCleanup = async () => {
      try {
        const colRef = collection(db, "targetHafalan");
        const snapshot = await getDocs(colRef);
        
        const validIds = new Set();
        const classes = ["7", "8", "9", "10", "11", "12"];
        const programs = ["Reguler", "Takhassus"];
        classes.forEach(c => {
          programs.forEach(p => {
            validIds.add(`${c}_${p}`);
          });
        });

        const batch = writeBatch(db);
        let hasDeleted = false;

        snapshot.docs.forEach((d) => {
          if (!validIds.has(d.id)) {
            batch.delete(doc(db, "targetHafalan", d.id));
            hasDeleted = true;
            console.log(`Legacy document marked for deletion: ${d.id}`);
          }
        });

        if (hasDeleted) {
          await batch.commit();
          console.log("Database successfully cleaned up of legacy targetHafalan documents.");
          refetch(); // Reload data after deletion
        }
      } catch (err) {
        console.error("Failed to run targetHafalan database cleanup:", err);
      }
    };

    runCleanup();
  }, [targets, refetch]);

  // Find the current active config specifically from "7_Reguler"
  const activeConfig = useMemo(() => {
    const target7R = targets.find((t) => t.id === "7_Reguler");
    const dbTahunAjaran = target7R ? target7R.tahunAjaran : null;
    return {
      tahunAjaran: dbTahunAjaran || "2026/2027",
      semesterAktif: target7R ? target7R.semesterAktif : null,
    };
  }, [targets]);

  const handleSemesterAktifChange = (val: 1 | 2 | null) => {
    updateMutation.mutate({
      tahunAjaran: activeConfig.tahunAjaran,
      semesterAktif: val,
    });
  };

  return (
    <PageContainer>
      {/* Responsive Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0 shadow-2xs">
            <Target className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div className="space-y-0.5 min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground truncate">
              {t("targetHafalan:title")}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
              {t("targetHafalan:subtitle")}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content States */}
      {isLoading ? (
        <div className="space-y-5">
          <div className="h-12 w-full bg-muted/60 animate-pulse rounded-xl" />
          <div className="h-28 w-full bg-card/60 border border-border/40 animate-pulse rounded-xl" />
          <div className="h-12 w-full bg-muted/30 border border-border/20 animate-pulse rounded-lg" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-48 rounded-xl bg-card border border-border/40 p-4 space-y-3 animate-pulse"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-muted/80 shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-4 w-24 bg-muted/80 rounded" />
                    <div className="h-3 w-16 bg-muted/60 rounded" />
                  </div>
                </div>
                <div className="h-14 w-full bg-muted/40 rounded-lg" />
                <div className="h-14 w-full bg-muted/40 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4 border border-dashed border-border/60 rounded-xl bg-card/40 text-center p-6">
          <div className="h-12 w-12 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <RefreshCcw className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">
              {t("common:status.error")}
            </p>
            <p className="text-xs text-muted-foreground max-w-sm">
              Silakan periksa koneksi internet dan muat ulang data.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="h-9 px-4 text-xs font-semibold rounded-lg hover:bg-accent"
          >
            <RefreshCcw className="w-3.5 h-3.5 mr-2" />
            {t("common:actions.retry")}
          </Button>
        </div>
      ) : (
        <TargetTabView
          tahunAjaran={activeConfig.tahunAjaran}
          semesterAktif={activeConfig.semesterAktif}
          onChangeSemesterAktif={handleSemesterAktifChange}
          isUpdating={updateMutation.isPending}
        />
      )}
    </PageContainer>
  );
}
