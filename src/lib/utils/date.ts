import { format, formatDistanceToNow, parseISO, isValid } from "date-fns";
import { id } from "date-fns/locale";

/**
 * Format Timestamp/Date ke string tampilan, e.g. "8 Juli 2026"
 */
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "-";
  const d = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(d)) return "-";
  return format(d, "d MMMM yyyy", { locale: id });
}

/**
 * Format Timestamp/Date ke string tampilan pendek, e.g. "08/07/2026"
 */
export function formatDateShort(date: Date | string | null | undefined): string {
  if (!date) return "-";
  const d = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(d)) return "-";
  return format(d, "dd/MM/yyyy");
}

/**
 * Format Timestamp/Date ke string dengan waktu, e.g. "8 Juli 2026, 14:30"
 */
export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return "-";
  const d = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(d)) return "-";
  return format(d, "d MMMM yyyy, HH:mm", { locale: id });
}

/**
 * Format relatif dari sekarang, e.g. "3 hari yang lalu"
 */
export function formatRelative(date: Date | string | null | undefined): string {
  if (!date) return "-";
  const d = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(d)) return "-";
  return formatDistanceToNow(d, { addSuffix: true, locale: id });
}

/**
 * Format tahun ajaran, e.g. "2025/2026"
 */
export function formatTahunAjaran(tahunAjaran: string): string {
  // Expects format "2025/2026" — returns as-is, or formats "2025" → "2025/2026"
  if (tahunAjaran.includes("/")) return tahunAjaran;
  const year = parseInt(tahunAjaran, 10);
  if (isNaN(year)) return tahunAjaran;
  return `${year}/${year + 1}`;
}
