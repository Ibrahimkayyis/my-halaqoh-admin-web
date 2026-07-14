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

interface GuruDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guruName?: string;
  onConfirm: () => void;
}

export function GuruDeleteDialog({ 
  open, 
  onOpenChange, 
  guruName, 
  onConfirm,
}: GuruDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="w-5 h-5" />
            Hapus Guru
          </DialogTitle>
          <DialogDescription className="pt-2">
            Apakah Anda yakin ingin menghapus data guru <strong>{guruName}</strong>? Tindakan ini tidak dapat dibatalkan dan semua data terkait kelompok halaqoh yang dipimpinnya akan dibersihkan.
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
            onClick={onConfirm}
          >
            Ya, Hapus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
