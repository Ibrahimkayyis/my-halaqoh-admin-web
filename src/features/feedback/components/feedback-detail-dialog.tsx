"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bug,
  Lightbulb,
  HelpCircle,
  Clock,
  Loader2,
  CheckCircle2,
  Smartphone,
  Calendar,
  User,
  Paperclip,
  Check,
  Send,
  Sparkles,
} from "lucide-react";
import type {
  UserFeedback,
  FeedbackStatus,
  FeedbackCategory,
  FeedbackUserRole,
} from "@/types/models/feedback.types";
import { FeedbackAttachmentLightbox } from "./feedback-attachment-lightbox";
import { useUpdateFeedback } from "../hooks/use-feedback";
import { useAuth } from "@/features/auth/hooks/use-auth";

interface FeedbackDetailDialogProps {
  feedback: UserFeedback | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QUICK_TEMPLATES = [
  {
    label: "Saran Dicatat",
    text: "Terima kasih atas masukannya. Saran Anda telah kami catat untuk bahan evaluasi dan peningkatan kualitas aplikasi MyHalaqoh ke depan.",
  },
  {
    label: "Bug Diperbaiki",
    text: "Kendala ini telah berhasil kami perbaiki pada pembaruan aplikasi terbaru. Silakan perbarui aplikasi Anda melalui rilis resmi.",
  },
  {
    label: "Solusi Panduan",
    text: "Kendala ini telah ditindaklanjuti. Silakan coba restart aplikasi atau pastikan koneksi internet stabil sebelum mencoba kembali.",
  },
];

export function FeedbackDetailDialog({
  feedback,
  open,
  onOpenChange,
}: FeedbackDetailDialogProps) {
  const { user } = useAuth();
  const updateMutation = useUpdateFeedback();

  const [selectedStatus, setSelectedStatus] = useState<FeedbackStatus>("open");
  const [responseInput, setResponseInput] = useState<string>("");
  const [validationError, setValidationError] = useState<string | null>(null);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Sync state when dialog opens with a feedback item
  useEffect(() => {
    if (feedback) {
      setSelectedStatus(feedback.status);
      setResponseInput(feedback.adminResponse || "");
      setValidationError(null);
    }
  }, [feedback, open]);

  if (!feedback) return null;

  const formatDate = (ts?: { toDate?: () => Date } | null) => {
    if (!ts || typeof ts.toDate !== "function") return "-";
    try {
      const d = ts.toDate();
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "-";
    }
  };

  const renderCategoryBadge = (cat: FeedbackCategory) => {
    switch (cat) {
      case "bug":
        return (
          <Badge
            variant="outline"
            className="rounded-full px-2.5 py-0.5 text-xs font-medium bg-destructive/10 text-destructive border-destructive/20 flex items-center gap-1 w-fit"
          >
            <Bug className="h-3 w-3" />
            <span>Bug / Kendala</span>
          </Badge>
        );
      case "saran":
        return (
          <Badge
            variant="outline"
            className="rounded-full px-2.5 py-0.5 text-xs font-medium bg-warning/10 text-warning border-warning/20 flex items-center gap-1 w-fit"
          >
            <Lightbulb className="h-3 w-3" />
            <span>Saran Fitur</span>
          </Badge>
        );
      case "pertanyaan":
      default:
        return (
          <Badge
            variant="outline"
            className="rounded-full px-2.5 py-0.5 text-xs font-medium bg-info/10 text-info border-info/20 flex items-center gap-1 w-fit"
          >
            <HelpCircle className="h-3 w-3" />
            <span>Pertanyaan</span>
          </Badge>
        );
    }
  };

  const renderStatusBadge = (status: FeedbackStatus) => {
    switch (status) {
      case "open":
        return (
          <Badge
            variant="outline"
            className="rounded-full px-2.5 py-0.5 text-xs font-medium bg-warning/10 text-warning border-warning/20 flex items-center gap-1 w-fit"
          >
            <Clock className="h-3 w-3" />
            <span>Menunggu</span>
          </Badge>
        );
      case "in_progress":
        return (
          <Badge
            variant="outline"
            className="rounded-full px-2.5 py-0.5 text-xs font-medium bg-info/10 text-info border-info/20 flex items-center gap-1 w-fit"
          >
            <Loader2 className="h-3 w-3" />
            <span>Sedang Diproses</span>
          </Badge>
        );
      case "resolved":
        return (
          <Badge
            variant="outline"
            className="rounded-full px-2.5 py-0.5 text-xs font-medium bg-success/10 text-success border-success/20 flex items-center gap-1 w-fit"
          >
            <CheckCircle2 className="h-3 w-3" />
            <span>Selesai Ditindaklanjuti</span>
          </Badge>
        );
    }
  };

  const renderStatusOption = (status: FeedbackStatus) => {
    switch (status) {
      case "open":
        return (
          <span className="flex items-center gap-2 text-warning font-medium">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span>Menunggu Tindak Lanjut (Open)</span>
          </span>
        );
      case "in_progress":
        return (
          <span className="flex items-center gap-2 text-info font-medium">
            <Loader2 className="w-3.5 h-3.5 shrink-0" />
            <span>Sedang Diproses (In Progress)</span>
          </span>
        );
      case "resolved":
        return (
          <span className="flex items-center gap-2 text-success font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>Selesai Ditindaklanjuti (Resolved)</span>
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  const renderRoleBadge = (role: FeedbackUserRole) => {
    switch (role) {
      case "guru":
        return (
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Guru / Asatidz
          </span>
        );
      case "wali_santri":
        return (
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            Wali Santri
          </span>
        );
      case "santri":
        return (
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            Santri
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
            {role}
          </span>
        );
    }
  };

  const handleOpenImage = (index: number) => {
    setSelectedImageIndex(index);
    setLightboxOpen(true);
  };

  const handleSubmitAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validation: if resolved, response must not be empty
    if (selectedStatus === "resolved" && responseInput.trim().length < 10) {
      setValidationError(
        "Mohon berikan balasan tindak lanjut minimal 10 karakter agar pengguna mobile mendapatkan penjelasan yang jelas."
      );
      return;
    }

    const adminName = user?.displayName || user?.identifier || "Super Admin";

    await updateMutation.mutateAsync({
      id: feedback.id,
      payload: {
        status: selectedStatus,
        adminResponse: responseInput.trim() || null,
        adminName,
      },
    });

    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl sm:max-w-3xl max-h-[90vh] overflow-y-auto bg-surface border-border/60 text-foreground p-4 sm:p-6 space-y-5">
          <DialogHeader className="space-y-3 pb-3 border-b border-border/40">
            <div className="flex flex-wrap items-center gap-2">
              {renderCategoryBadge(feedback.category)}
              {renderStatusBadge(feedback.status)}
              <span className="text-xs text-muted-foreground ml-auto flex items-center gap-1 font-mono">
                <Calendar className="h-3 w-3" />
                {formatDate(feedback.createdAt)}
              </span>
            </div>
            <DialogTitle className="text-lg sm:text-xl font-bold tracking-tight text-foreground leading-snug">
              {feedback.title}
            </DialogTitle>
          </DialogHeader>

          {/* Pengirim & Device Info Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-muted/60 border border-border/40 text-xs">
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <User className="h-3.5 w-3.5" />
                <span className="font-semibold text-foreground">Pengirim:</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-foreground text-sm">
                  {feedback.userName}
                </span>
                {renderRoleBadge(feedback.userRole)}
              </div>
              <p className="text-muted-foreground">
                ID / Identitas: <span className="font-mono text-foreground font-medium">{feedback.userIdentifier}</span>
              </p>
            </div>

            <div className="space-y-1.5 border-t sm:border-t-0 sm:border-l border-border/40 pt-2 sm:pt-0 sm:pl-3">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Smartphone className="h-3.5 w-3.5" />
                <span className="font-semibold text-foreground">Info Perangkat & Aplikasi:</span>
              </div>
              <p className="text-foreground">
                <span className="text-muted-foreground">Perangkat:</span> {feedback.deviceModel || "-"}
              </p>
              <p className="text-muted-foreground">
                OS: <span className="text-foreground">{feedback.osVersion || "-"}</span> • Versi App:{" "}
                <span className="font-mono text-foreground font-semibold bg-surface px-1.5 py-0.5 rounded border border-border/40">
                  {feedback.appVersion || "-"}
                </span>
              </p>
            </div>
          </div>

          {/* Isi Masukan Lengkap */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Rincian Masukan / Laporan Kendala:
            </Label>
            <div className="p-4 rounded-xl bg-surface border border-border/60 text-sm leading-relaxed text-foreground whitespace-pre-wrap selection:bg-primary/20">
              {feedback.description || "Tidak ada deskripsi rinci."}
            </div>
          </div>

          {/* Lampiran Gambar / Screenshots */}
          {feedback.attachmentUrls && feedback.attachmentUrls.length > 0 && (
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Paperclip className="h-3.5 w-3.5" />
                Lampiran Gambar ({feedback.attachmentUrls.length})
              </Label>
              <div className="flex flex-wrap gap-2.5 pt-1">
                {feedback.attachmentUrls.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleOpenImage(idx)}
                    className="group relative h-24 w-24 sm:h-28 sm:w-28 rounded-xl overflow-hidden border border-border/60 bg-muted/40 cursor-pointer hover:border-primary transition-all duration-200 hover:scale-[1.02]"
                    title="Klik untuk memperbesar gambar"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`Lampiran ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[11px] font-semibold">
                      Lihat Foto
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Riwayat Balasan Sebelumnya (Jika sudah pernah dijawab) */}
          {feedback.status === "resolved" && feedback.adminResponse && (
            <div className="p-3.5 rounded-xl bg-success/5 border border-success/20 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-success flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5" />
                  Balasan Tersimpan ({feedback.resolvedBy || "Super Admin"})
                </span>
                {feedback.resolvedAt && (
                  <span className="text-[11px] text-muted-foreground font-mono">
                    {formatDate(feedback.resolvedAt)}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-foreground whitespace-pre-wrap">
                {feedback.adminResponse}
              </p>
            </div>
          )}

          {/* Form Aksi Tindak Lanjut Admin */}
          <form onSubmit={handleSubmitAction} className="pt-2 space-y-4 border-t border-border/40">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Send className="h-3.5 w-3.5 text-primary" />
                Form Tindak Lanjut Super Admin
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
              <div className="space-y-1.5">
                <Label htmlFor="status-select" className="text-xs font-medium text-foreground">
                  Perbarui Status Penanganan:
                </Label>
                <Select
                  value={selectedStatus}
                  onValueChange={(val) => {
                    if (val) {
                      setSelectedStatus(val as FeedbackStatus);
                      if (val !== "resolved") setValidationError(null);
                    }
                  }}
                >
                  <SelectTrigger
                    id="status-select"
                    className="w-full h-10 px-3 bg-surface border border-border/70 text-foreground text-xs sm:text-sm rounded-lg flex items-center justify-between shadow-xs hover:border-primary/50 transition-colors"
                  >
                    <SelectValue placeholder="Pilih status">
                      {renderStatusOption(selectedStatus)}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="w-[var(--anchor-width)] min-w-[280px] bg-surface border-border/60 p-1 rounded-lg shadow-xl z-50">
                    <SelectItem value="open" className="text-xs sm:text-sm py-2 cursor-pointer focus:bg-accent rounded-md">
                      <div className="flex items-center gap-2 text-warning font-medium">
                        <Clock className="w-4 h-4 shrink-0" />
                        <span>Menunggu Tindak Lanjut (Open)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="in_progress" className="text-xs sm:text-sm py-2 cursor-pointer focus:bg-accent rounded-md">
                      <div className="flex items-center gap-2 text-info font-medium">
                        <Loader2 className="w-4 h-4 shrink-0" />
                        <span>Sedang Diproses (In Progress)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="resolved" className="text-xs sm:text-sm py-2 cursor-pointer focus:bg-accent rounded-md">
                      <div className="flex items-center gap-2 text-success font-medium">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>Selesai Ditindaklanjuti (Resolved)</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col justify-end text-xs text-muted-foreground pt-1 sm:pt-6">
                {selectedStatus === "resolved" ? (
                  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-success/10 border border-success/20 text-success text-xs font-medium">
                    <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>
                      Cloud Function akan otomatis mengirim Push Notification ke HP pengguna saat disimpan.
                    </span>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-lg bg-muted/50 border border-border/40 text-muted-foreground text-xs">
                    Status dapat diperbarui ke &apos;Sedang Diproses&apos; saat tim teknis sedang menginvestigasi.
                  </div>
                )}
              </div>
            </div>

            {/* Balasan Textarea */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="admin-response-input" className="text-xs font-medium text-foreground">
                  Balasan Tindak Lanjut (Admin Response):
                  {selectedStatus === "resolved" && (
                    <span className="text-destructive font-bold ml-1">* Wajib diisi</span>
                  )}
                </Label>
                <span className="text-[11px] text-muted-foreground font-mono">
                  {responseInput.length} karakter
                </span>
              </div>

              <Textarea
                id="admin-response-input"
                placeholder="Tuliskan respon resmi, penjelasan, atau solusi untuk pengguna..."
                value={responseInput}
                onChange={(e) => {
                  setResponseInput(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                rows={4}
                className="bg-surface border-border/70 text-xs sm:text-sm text-foreground focus-visible:ring-primary"
              />

              {validationError && (
                <p className="text-xs text-destructive font-medium animate-in fade-in-50">
                  {validationError}
                </p>
              )}

              {/* Quick reply templates */}
              <div className="pt-1 space-y-1.5">
                <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-warning" />
                  Template Balasan Cepat:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_TEMPLATES.map((tmpl, idx) => (
                    <Button
                      key={idx}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setResponseInput(tmpl.text);
                        if (validationError) setValidationError(null);
                      }}
                      className="h-7 text-[11px] px-2.5 bg-surface hover:bg-muted border-border/60 text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      {tmpl.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-2 pt-2 border-t border-border/40">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="h-9 text-xs cursor-pointer"
              >
                Tutup
              </Button>
              <Button
                type="submit"
                variant="default"
                size="sm"
                disabled={updateMutation.isPending}
                className="h-9 text-xs font-semibold cursor-pointer min-w-[140px]"
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Check className="h-3.5 w-3.5 mr-1.5" />
                    Simpan Tindak Lanjut
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Lightbox attachment preview */}
      {feedback.attachmentUrls && feedback.attachmentUrls.length > 0 && (
        <FeedbackAttachmentLightbox
          images={feedback.attachmentUrls}
          initialIndex={selectedImageIndex}
          open={lightboxOpen}
          onOpenChange={setLightboxOpen}
          feedbackTitle={feedback.title}
        />
      )}
    </>
  );
}
