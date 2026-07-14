"use client";

import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, FileUp } from "lucide-react";

interface SantriBulkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SantriBulkDialog({ open, onOpenChange }: SantriBulkDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Upload Data dari file CSV</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Pastikan kolom dan format data sama dengan template
          </p>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <Button variant="outline" className="w-full flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            Download template CSV
          </Button>

          <div className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center text-center bg-muted/20 hover:bg-muted/50 transition-colors cursor-pointer">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <FileUp className="w-6 h-6 text-primary" />
            </div>
            <h4 className="text-sm font-medium text-foreground mb-1">Upload file .csv</h4>
            <p className="text-xs text-muted-foreground">Ukuran maksimal file 5 MB</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Batal
          </Button>
          <Button type="button">Import</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
