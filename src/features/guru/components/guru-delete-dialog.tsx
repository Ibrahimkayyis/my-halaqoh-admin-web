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
import { AlertCircle, Loader2 } from "lucide-react";

interface GuruDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guruName?: string;
  onConfirm: () => void;
  isPending?: boolean;
}

export function GuruDeleteDialog({ 
  open, 
  onOpenChange, 
  guruName, 
  onConfirm,
  isPending = false,
}: GuruDeleteDialogProps) {
  const { t } = useTranslation(["guru", "common"]);

  return (
    <Dialog open={open} onOpenChange={(val) => {
      if (isPending) return;
      onOpenChange(val);
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="w-5 h-5" />
            {t("guru:delete.title")}
          </DialogTitle>
          <DialogDescription className="pt-2">
            {t("guru:delete.confirmText")} <strong>{guruName}</strong>? {t("guru:delete.warningText")}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4 gap-2 sm:gap-0">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            {t("common:actions.cancel")}
          </Button>
          <Button 
            type="button" 
            variant="destructive"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {t("guru:delete.submitBtn")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
