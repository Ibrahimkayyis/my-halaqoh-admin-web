"use client";

import { useMemo, useEffect } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { TargetTabView } from "@/features/target-hafalan/components/target-tab-view";
import { useGetTargetHafalan, useUpdateGlobalTarget } from "@/features/target-hafalan/hooks/use-target-hafalan";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { collection, getDocs, writeBatch, doc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export default function TargetHafalanPage() {
  const { data: targets = [], isLoading, isError, refetch } = useGetTargetHafalan();
  const updateMutation = useUpdateGlobalTarget();

  // Auto-cleanup legacy targetHafalan documents (e.g. "7_R") in the collection.
  // Runs client-side where the admin is signed in (bypassing rules permission issues).
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

  // Find the current active config specifically from "7_Reguler" (all active docs are kept in sync)
  const activeConfig = useMemo(() => {
    const target7R = targets.find((t) => t.id === "7_Reguler");
    const dbTahunAjaran = target7R ? target7R.tahunAjaran : null;
    return {
      tahunAjaran: dbTahunAjaran || "2026/2027", // Default to "2026/2027"
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
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-primary">
          Target Hafalan
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Kelola kurikulum dan target hafalan per kelas untuk setiap program
        </p>
      </div>

      {/* Main Content States */}
      {isLoading ? (
        <div className="space-y-6">
          {/* Tabs skeleton */}
          <div className="h-10 w-full max-w-xs bg-muted/60 animate-pulse rounded-xl" />
          
          {/* Settings panel skeleton */}
          <div className="h-28 w-full bg-muted/30 border border-border/20 animate-pulse rounded-xl" />
          
          {/* Info banner skeleton */}
          <div className="h-12 w-full bg-muted/30 animate-pulse rounded-lg" />
          
          {/* Grid cards skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-44 rounded-lg bg-muted/40 animate-pulse border border-border/30"
              />
            ))}
          </div>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <p className="text-sm text-muted-foreground">
            Gagal memuat data target hafalan. Silakan coba lagi.
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCcw className="w-4 h-4 mr-2" />
            Coba Lagi
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
