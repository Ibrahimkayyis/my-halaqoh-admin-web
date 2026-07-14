"use client";

import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface SantriDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  santriName?: string;
  onConfirm: () => void;
}

export function SantriDeleteDialog({ open, onOpenChange, santriName, onConfirm }: SantriDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="w-5 h-5" />
            Hapus Santri
          </DialogTitle>
          <DialogDescription className="pt-2">
            Apakah Anda yakin ingin menghapus data santri <strong>{santriName}</strong>? Tindakan ini tidak dapat dibatalkan dan semua data terkait akan ikut terhapus.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4 gap-2 sm:gap-0">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Batal
          </Button>
          <Button 
            type="button" 
            variant="destructive"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            Ya, Hapus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
