"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, GraduationCap } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/page-container";
import { KelasTab } from "@/features/kelas-program/components/kelas-tab";
import { ProgramTab } from "@/features/kelas-program/components/program-tab";
import { KelasFormDialog } from "@/features/kelas-program/components/kelas-form-dialog";
import { ProgramFormDialog } from "@/features/kelas-program/components/program-form-dialog";

export default function KelasProgramPage() {
  const { t } = useTranslation(["kelasProgram", "common"]);
  const [activeTab, setActiveTab] = useState<"kelas" | "program">("kelas");
  
  // State for Create Modals
  const [isKelasDialogOpen, setIsKelasDialogOpen] = useState(false);
  const [isProgramDialogOpen, setIsProgramDialogOpen] = useState(false);

  const handleAddClick = () => {
    if (activeTab === "kelas") {
      setIsKelasDialogOpen(true);
    } else {
      setIsProgramDialogOpen(true);
    }
  };

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
              <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {t("kelasProgram:title", "Kelas & Program")}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {t("kelasProgram:subtitle", "Kelola struktur kelas dan program pendidikan pesantren")}
              </p>
            </div>
          </div>
          <Button
            onClick={handleAddClick}
            className="w-full sm:w-auto h-10 sm:h-9 shrink-0 gap-2 shadow-xs cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>{activeTab === "kelas" ? t("kelasProgram:kelas.addBtn") : t("kelasProgram:program.addBtn")}</span>
          </Button>
        </div>

        <Tabs 
          value={activeTab} 
          onValueChange={(val) => setActiveTab(val as "kelas" | "program")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 h-11 p-1 bg-muted/60 rounded-xl">
            <TabsTrigger value="kelas" className="min-h-[36px] text-xs sm:text-sm font-semibold rounded-lg">
              {t("kelasProgram:tabs.kelas")}
            </TabsTrigger>
            <TabsTrigger value="program" className="min-h-[36px] text-xs sm:text-sm font-semibold rounded-lg">
              {t("kelasProgram:tabs.program")}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="kelas" className="border-none p-0 outline-none">
            <KelasTab />
          </TabsContent>
          
          <TabsContent value="program" className="border-none p-0 outline-none">
            <ProgramTab />
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Dialogs */}
      <KelasFormDialog 
        open={isKelasDialogOpen} 
        onOpenChange={setIsKelasDialogOpen} 
      />
      <ProgramFormDialog 
        open={isProgramDialogOpen} 
        onOpenChange={setIsProgramDialogOpen} 
      />
    </PageContainer>
  );
}
