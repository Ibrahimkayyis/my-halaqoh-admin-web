"use client";

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetPengujiSertifikasi,
  useAddPengujiSertifikasi,
  useRemovePengujiSertifikasi,
} from "../hooks/use-sertifikasi";
import { useGetGuru } from "@/features/guru/hooks/use-guru";
import { UserCheck, Plus, Trash2, Loader2, ShieldCheck, AlertCircle } from "lucide-react";

interface KelolaPengujiDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function KelolaPengujiDialog({
  open,
  onOpenChange,
}: KelolaPengujiDialogProps) {
  const { t } = useTranslation(["sertifikasi", "common"]);
  const { data: pengujiList = [], isLoading: isPengujiLoading } = useGetPengujiSertifikasi();
  const { data: guruList = [] } = useGetGuru();

  const addMutation = useAddPengujiSertifikasi();
  const removeMutation = useRemovePengujiSertifikasi();

  const [selectedGuruId, setSelectedGuruId] = useState<string>("");

  // Daftar guru yang belum terdaftar di dewan penguji
  const availableGuru = useMemo(() => {
    const activeNips = new Set(pengujiList.map((p) => p.nip));
    return guruList.filter((g) => !activeNips.has(g.nip));
  }, [guruList, pengujiList]);

  const handleAddPenguji = async () => {
    if (!selectedGuruId) return;
    const guru = guruList.find((g) => g.id === selectedGuruId);
    if (!guru) return;

    try {
      await addMutation.mutateAsync({
        id: guru.id,
        nip: guru.nip,
        nama: guru.nama,
      });
      setSelectedGuruId("");
    } catch (e) {
      console.error("Gagal menambahkan penguji:", e);
    }
  };

  const handleRemovePenguji = async (id: string) => {
    try {
      await removeMutation.mutateAsync(id);
    } catch (e) {
      console.error("Gagal menghapus penguji:", e);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-lg max-h-[85vh] overflow-y-auto p-4 sm:p-6 rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-primary" />
            <span>{t("sertifikasi:managePenguji.title", "Kelola Dewan Penguji Tahfidz")}</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {t(
              "sertifikasi:managePenguji.description",
              "Atur asatidz yang berwenang menguji santri dalam ujian sertifikasi tahfidz."
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Section: Tambah Penguji Baru */}
          <div className="rounded-xl border border-border/70 bg-muted/30 p-3.5 space-y-3">
            <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-primary" />
              <span>{t("sertifikasi:managePenguji.addSectionTitle", "Tambah Penguji dari Data Guru")}</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 min-w-0">
                <Select
                  value={selectedGuruId}
                  onValueChange={(val) => setSelectedGuruId(val ?? "")}
                  disabled={availableGuru.length === 0 || addMutation.isPending}
                >
                  <SelectTrigger className="bg-surface h-9 text-xs w-full">
                    <SelectValue
                      placeholder={
                        availableGuru.length === 0
                          ? t("sertifikasi:managePenguji.allAdded", "Semua guru telah menjadi penguji")
                          : t("sertifikasi:managePenguji.selectGuruPlaceholder", "Pilih guru untuk dijadikan penguji")
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="max-h-56">
                    {availableGuru.map((guru) => (
                      <SelectItem key={guru.id} value={guru.id} className="text-xs">
                        <span className="font-medium">{guru.nama}</span>
                        <span className="text-muted-foreground ml-1 text-[11px]">
                          ({guru.nip})
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="button"
                size="sm"
                onClick={handleAddPenguji}
                disabled={!selectedGuruId || addMutation.isPending}
                className="h-9 gap-1.5 text-xs font-semibold cursor-pointer shrink-0"
              >
                {addMutation.isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Plus className="w-3.5 h-3.5" />
                )}
                <span>{t("sertifikasi:managePenguji.addBtn", "Tambahkan")}</span>
              </Button>
            </div>

            {availableGuru.length === 0 && (
              <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-amber-500" />
                <span>Seluruh ustadz/guru terdaftar sudah ada di dalam dewan penguji.</span>
              </p>
            )}
          </div>

          {/* Section: Daftar Penguji Aktif */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("sertifikasi:managePenguji.listTitle", "Daftar Penguji Aktif")} ({pengujiList.length})
              </h3>
            </div>

            {isPengujiLoading ? (
              <div className="flex items-center justify-center py-8 text-muted-foreground text-xs gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span>Memuat dewan penguji...</span>
              </div>
            ) : pengujiList.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                Belum ada penguji terdaftar.
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {pengujiList.map((penguji) => (
                  <div
                    key={penguji.id || penguji.nip}
                    className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-2.5 sm:p-3 shadow-xs hover:border-primary/40 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
                        {penguji.nama.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="text-xs font-semibold text-foreground truncate">
                            {penguji.nama}
                          </p>
                          {penguji.isDefault ? (
                            <Badge
                              variant="secondary"
                              className="bg-primary/10 text-primary text-[10px] px-1.5 py-0 font-medium shrink-0"
                            >
                              <ShieldCheck className="w-2.5 h-2.5 mr-0.5" />
                              Penguji Utama
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1.5 py-0 font-medium shrink-0"
                            >
                              Penguji Tambahan
                            </Badge>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground truncate">
                          NIP: {penguji.nip}
                        </p>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemovePenguji(penguji.id)}
                      disabled={removeMutation.isPending}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer shrink-0"
                      title={t("sertifikasi:managePenguji.removeTooltip", "Hapus dari dewan penguji")}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="pt-2 border-t border-border/40">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto h-9 cursor-pointer"
          >
            {t("common:close", "Tutup")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
