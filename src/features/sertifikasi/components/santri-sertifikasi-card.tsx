"use client";

import { useState } from "react";
import { SertifikasiDetailDialog } from "@/features/sertifikasi/components/sertifikasi-detail-dialog";
import type { SertifikasiTahfidz } from "@/features/sertifikasi/types/sertifikasi.types";

interface SantriSertifikasiCardProps {
  sertifikasiList: SertifikasiTahfidz[];
}

export function SantriSertifikasiCard({
  sertifikasiList,
}: SantriSertifikasiCardProps) {
  const [detailItem, setDetailItem] = useState<SertifikasiTahfidz | null>(null);

  const passedList = sertifikasiList
    .filter((s) => s.status === "passed")
    .sort((a, b) => a.juz - b.juz);

  return (
    <>
      <div>
        {passedList.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {passedList.map((cert) => (
              <button
                key={cert.id}
                onClick={() => setDetailItem(cert)}
                className="px-3.5 py-1.5 rounded-md text-xs font-semibold bg-muted/60 hover:bg-muted text-foreground border border-border/60 hover:border-border transition-colors cursor-pointer"
              >
                Juz {cert.juz}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            Belum ada juz yang tersertifikasi.
          </p>
        )}
      </div>

      {/* Detail dialog */}
      <SertifikasiDetailDialog
        open={!!detailItem}
        onOpenChange={(open) => {
          if (!open) setDetailItem(null);
        }}
        item={detailItem}
      />
    </>
  );
}
