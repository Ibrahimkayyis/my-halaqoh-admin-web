"use client";

import { useTranslation } from "react-i18next";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, AlertTriangle, Loader2 } from "lucide-react";
import type { Guru } from "../types/guru.types";

interface GuruBulkDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedGurus: Guru[];
  onConfirm: () => void;
  isPending?: boolean;
}

export function GuruBulkDeleteDialog({ 
  open, 
  onOpenChange, 
  selectedGurus, 
  onConfirm,
  isPending = false,
}: GuruBulkDeleteDialogProps) {
  const { t } = useTranslation(["guru", "common"]);
  const count = selectedGurus.length;

  return (
    <Dialog open={open} onOpenChange={(val) => {
      if (isPending) return;
      onOpenChange(val);
    }}>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-[480px] p-4 sm:p-6 rounded-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive text-base sm:text-lg">
            <AlertCircle className="w-5 h-5" />
            {t("guru:bulkDelete.title", "Hapus Masal Guru")}
          </DialogTitle>
          <DialogDescription className="pt-2 text-xs sm:text-sm">
            {t("guru:bulkDelete.confirmText", { 
              count, 
              defaultValue: `Apakah Anda yakin ingin menghapus ${count} data guru yang dipilih?` 
            })}
          </DialogDescription>
        </DialogHeader>

        {/* Warning Alert Banner */}
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <p>
            {t("guru:bulkDelete.warningText", "Tindakan ini akan menghapus akun login dan riwayat guru terkait secara permanen dan tidak dapat dibatalkan.")}
          </p>
        </div>

        {/* Preview List */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground">
            {t("guru:bulkDelete.previewTitle", "Daftar Guru yang Akan Dihapus:")} ({count})
          </p>
          <div className="max-h-48 overflow-y-auto rounded-md border border-border/60 divide-y divide-border/40 bg-muted/20">
            {selectedGurus.map((guru) => (
              <div key={guru.id} className="flex items-center justify-between p-2.5 text-xs">
                <div className="space-y-0.5">
                  <p className="font-medium text-foreground">{guru.nama}</p>
                  <p className="text-muted-foreground">NIP: {guru.nip}</p>
                </div>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 text-primary bg-primary/10">
                  {guru.program === "R" ? t("common:labels.programReguler", "Reguler") : t("common:labels.programTakhassus", "Takhassus")}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="mt-4 flex flex-col-reverse sm:flex-row gap-2 sm:gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            {t("common:actions.cancel", "Batal")}
          </Button>
          <Button 
            type="button" 
            variant="destructive"
            onClick={onConfirm}
            disabled={isPending || count === 0}
            className="w-full sm:w-auto"
          >
            {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {t("guru:bulkDelete.submitBtn", { 
              count, 
              defaultValue: `Hapus ${count} Guru` 
            })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
