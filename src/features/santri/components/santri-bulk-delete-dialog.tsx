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
import type { Santri } from "../types/santri.types";

interface SantriBulkDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSantris: Santri[];
  onConfirm: () => void;
  isPending?: boolean;
}

export function SantriBulkDeleteDialog({ 
  open, 
  onOpenChange, 
  selectedSantris, 
  onConfirm,
  isPending = false,
}: SantriBulkDeleteDialogProps) {
  const { t } = useTranslation(["santri", "common"]);
  const count = selectedSantris.length;

  return (
    <Dialog open={open} onOpenChange={(val) => {
      if (isPending) return;
      onOpenChange(val);
    }}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="w-5 h-5" />
            {t("santri:bulkDelete.title", "Hapus Masal Santri")}
          </DialogTitle>
          <DialogDescription className="pt-2">
            {t("santri:bulkDelete.confirmText", { 
              count, 
              defaultValue: `Apakah Anda yakin ingin menghapus ${count} data santri yang dipilih?` 
            })}
          </DialogDescription>
        </DialogHeader>

        {/* Warning Alert Banner */}
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <p>
            {t("santri:bulkDelete.warningText", "Tindakan ini akan menghapus akun login dan riwayat santri terkait secara permanen dan tidak dapat dibatalkan.")}
          </p>
        </div>

        {/* Preview List */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground">
            {t("santri:bulkDelete.previewTitle", "Daftar Santri yang Akan Dihapus:")} ({count})
          </p>
          <div className="max-h-48 overflow-y-auto rounded-md border border-border/60 divide-y divide-border/40 bg-muted/20">
            {selectedSantris.map((santri) => (
              <div key={santri.id} className="flex items-center justify-between p-2.5 text-xs">
                <div className="space-y-0.5">
                  <p className="font-medium text-foreground">{santri.nama}</p>
                  <p className="text-muted-foreground">NIS: {santri.nis}</p>
                </div>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 text-primary bg-primary/10">
                  {santri.kelas}{santri.program}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="mt-4 gap-2 sm:gap-0">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            {t("common:actions.cancel", "Batal")}
          </Button>
          <Button 
            type="button" 
            variant="destructive"
            onClick={onConfirm}
            disabled={isPending || count === 0}
          >
            {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {t("santri:bulkDelete.submitBtn", { 
              count, 
              defaultValue: `Hapus ${count} Santri` 
            })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
