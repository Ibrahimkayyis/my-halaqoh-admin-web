/**
 * Design System — Color Tokens
 * MyHalaqoh Admin Web
 *
 * TypeScript mirror dari CSS variables di src/styles/theme.css.
 * Sumber kebenaran AKTUAL untuk Tailwind adalah CSS variables tersebut.
 * File ini berfungsi sebagai referensi developer dan untuk penggunaan
 * programmatic yang jarang (inline style, test assertions, dll).
 *
 * ⚠️ Jika mengubah warna di sini, update juga src/styles/theme.css
 *    dan sebaliknya. Keduanya harus selalu sinkron.
 */

// ─── Raw Palette ────────────────────────────────────────────────────────────
// Nilai warna dasar (non-semantic). Jangan dipakai langsung di komponen —
// selalu gunakan semantic token di bawah.

export const palette = {
  /** Warna brand utama MyHalaqoh (teal/hijau pesantren) */
  primary: "#115D69",

  /** Warna status */
  blue: "#3b82f6",
  yellow: "#fbbf24",
  red: "#f43f5e",
  green: "#10b981",

  /** Warna netral */
  white: "#ffffff",
  neutral: {
    50: "#f9fafb",
    100: "#f5f5f5",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
    950: "#0f172a",
  },
} as const;

// ─── Light Theme Tokens ──────────────────────────────────────────────────────

export const lightColors = {
  primary: palette.primary,
  primaryForeground: palette.white,

  background: palette.neutral[100],
  foreground: palette.neutral[900],

  surface: palette.white,
  surfaceForeground: palette.neutral[900],

  /** card mengikuti surface */
  card: palette.white,
  cardForeground: palette.neutral[900],

  secondary: palette.neutral[100],
  secondaryForeground: palette.neutral[900],

  muted: palette.neutral[100],
  mutedForeground: palette.neutral[500],

  /** Tint primer untuk hover state */
  accent: "#e8f4f6",
  accentForeground: palette.primary,

  destructive: palette.red,
  destructiveForeground: palette.white,

  success: palette.green,
  successForeground: palette.white,

  warning: palette.yellow,
  warningForeground: palette.neutral[900],

  error: palette.red,
  errorForeground: palette.white,

  info: palette.blue,
  infoForeground: palette.white,

  border: palette.neutral[200],
  input: palette.neutral[200],
  ring: palette.primary,
} as const;

// ─── Dark Theme Tokens ───────────────────────────────────────────────────────

export const darkColors = {
  primary: palette.primary,
  primaryForeground: palette.white,

  background: palette.neutral[950],
  foreground: palette.neutral[50],

  surface: palette.neutral[900],
  surfaceForeground: palette.neutral[50],

  card: palette.neutral[900],
  cardForeground: palette.neutral[50],

  secondary: palette.neutral[800],
  secondaryForeground: palette.neutral[50],

  muted: palette.neutral[800],
  mutedForeground: palette.neutral[400],

  /** Dark tint primer untuk hover state */
  accent: "#1a3d44",
  accentForeground: "#a8d5db",

  destructive: palette.red,
  destructiveForeground: palette.white,

  success: palette.green,
  successForeground: palette.white,

  warning: palette.yellow,
  warningForeground: palette.neutral[900],

  error: palette.red,
  errorForeground: palette.white,

  info: palette.blue,
  infoForeground: palette.white,

  border: palette.neutral[700],
  input: palette.neutral[700],
  ring: palette.primary,
} as const;

// ─── Type Exports ─────────────────────────────────────────────────────────────

export type ColorPalette = typeof palette;
export type LightColors = typeof lightColors;
export type DarkColors = typeof darkColors;
