"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
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
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-base font-medium text-foreground/80">
              {t("kelasProgram:subtitle")}
            </p>
          </div>
          <Button onClick={handleAddClick} className="shrink-0">
            <Plus className="mr-2 h-4 w-4" />
            {activeTab === "kelas" ? t("kelasProgram:kelas.addBtn") : t("kelasProgram:program.addBtn")}
          </Button>
        </div>

        <Tabs 
          value={activeTab} 
          onValueChange={(val) => setActiveTab(val as "kelas" | "program")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="kelas">{t("kelasProgram:tabs.kelas")}</TabsTrigger>
            <TabsTrigger value="program">{t("kelasProgram:tabs.program")}</TabsTrigger>
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
    </div>
  );
}
