"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FeedbackAttachmentLightboxProps {
  images: string[];
  initialIndex?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feedbackTitle?: string;
}

export function FeedbackAttachmentLightbox({
  images,
  initialIndex = 0,
  open,
  onOpenChange,
  feedbackTitle = "Lampiran Tangkapan Layar",
}: FeedbackAttachmentLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, open]);

  const hasNext = currentIndex < images.length - 1;
  const hasPrev = currentIndex > 0;

  const handleNext = useCallback(() => {
    if (hasNext) setCurrentIndex((i) => i + 1);
  }, [hasNext]);

  const handlePrev = useCallback(() => {
    if (hasPrev) setCurrentIndex((i) => i - 1);
  }, [hasPrev]);

  // Handle keyboard arrow keys
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, handleNext, handlePrev]);

  if (images.length === 0) return null;

  const currentUrl = images[currentIndex];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-2 sm:p-4 bg-surface border-border/60 text-foreground overflow-hidden">
        <DialogHeader className="p-2 sm:p-3 flex flex-row items-center justify-between border-b border-border/40">
          <div>
            <DialogTitle className="text-sm sm:text-base font-semibold text-foreground truncate max-w-md">
              {feedbackTitle}
            </DialogTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Gambar {currentIndex + 1} dari {images.length}
            </p>
          </div>
          <div className="flex items-center gap-1.5 pr-6">
            <a
              href={currentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md border border-border bg-background hover:bg-muted hover:text-foreground text-xs font-medium h-8 px-3 cursor-pointer transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5 mr-1" />
              Buka Penuh
            </a>
          </div>
        </DialogHeader>

        {/* Image Display Area */}
        <div className="relative w-full h-[65vh] sm:h-[70vh] flex items-center justify-center bg-black/5 dark:bg-black/40 rounded-lg overflow-hidden my-2">
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                disabled={!hasPrev}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-surface/90 hover:bg-surface text-foreground shadow-md flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none cursor-pointer border border-border/50"
                aria-label="Gambar Sebelumnya"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={!hasNext}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-surface/90 hover:bg-surface text-foreground shadow-md flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none cursor-pointer border border-border/50"
                aria-label="Gambar Berikutnya"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          <div className="relative w-full h-full p-2 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentUrl}
              alt={`Lampiran kendala ${currentIndex + 1}`}
              className="max-h-full max-w-full object-contain rounded select-none shadow-sm"
              loading="lazy"
            />
          </div>
        </div>

        {/* Thumbnail Preview Strip */}
        {images.length > 1 && (
          <div className="flex items-center justify-center gap-2 overflow-x-auto py-1">
            {images.map((url, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`relative h-12 w-12 rounded-md overflow-hidden border-2 cursor-pointer transition-all shrink-0 ${
                  currentIndex === idx
                    ? "border-primary ring-2 ring-primary/20 scale-105"
                    : "border-border/60 opacity-60 hover:opacity-100"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
