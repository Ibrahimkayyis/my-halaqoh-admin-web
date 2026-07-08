/**
 * Design System — Typography
 * MyHalaqoh Admin Web
 *
 * Skala tipografi yang konsisten untuk seluruh aplikasi.
 * Menggunakan font Inter dari Google Fonts (diload via Next.js font).
 *
 * Pola serupa dengan TextTheme di Flutter:
 *   Display  → Judul besar halaman / hero text
 *   Heading  → Section heading (h1–h4)
 *   Title    → Card title, item label (medium weight)
 *   Body     → Konten utama (regular weight)
 *   Caption  → Teks kecil / helper text
 *   Label    → Badge, chip, button text kecil
 */

// ─── Font Family ─────────────────────────────────────────────────────────────

export const fontFamily = {
  /** Font utama seluruh aplikasi */
  sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
  /** Font monospace untuk kode / ID / NIP */
  mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
} as const;

// ─── Font Weight ─────────────────────────────────────────────────────────────

export const fontWeight = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
} as const;

// ─── Line Height ─────────────────────────────────────────────────────────────

export const lineHeight = {
  tight: "1.2",
  snug: "1.3",
  normal: "1.5",
  relaxed: "1.6",
} as const;

// ─── Letter Spacing ──────────────────────────────────────────────────────────

export const letterSpacing = {
  tighter: "-0.02em",
  tight: "-0.01em",
  normal: "0em",
  wide: "0.01em",
  wider: "0.05em",
} as const;

// ─── Text Styles (Semantic Scale) ────────────────────────────────────────────
// Referensi lengkap untuk setiap jenis teks di aplikasi.
// Gunakan ini sebagai panduan saat menulis Tailwind class.

export type TextStyle = {
  fontSize: string;
  lineHeight: string;
  fontWeight: string;
  letterSpacing?: string;
};

export const textStyles = {
  // Display — hero, page title besar
  displayLg: {
    fontSize: "3rem",       // 48px
    lineHeight: "1.2",
    fontWeight: "700",
    letterSpacing: "-0.02em",
  },
  displayMd: {
    fontSize: "2.25rem",    // 36px
    lineHeight: "1.2",
    fontWeight: "700",
    letterSpacing: "-0.02em",
  },
  displaySm: {
    fontSize: "1.875rem",   // 30px
    lineHeight: "1.3",
    fontWeight: "600",
    letterSpacing: "-0.01em",
  },

  // Heading — section/page heading
  h1: {
    fontSize: "1.5rem",     // 24px
    lineHeight: "1.4",
    fontWeight: "700",
  },
  h2: {
    fontSize: "1.25rem",    // 20px
    lineHeight: "1.4",
    fontWeight: "600",
  },
  h3: {
    fontSize: "1.125rem",   // 18px
    lineHeight: "1.5",
    fontWeight: "600",
  },
  h4: {
    fontSize: "1rem",       // 16px
    lineHeight: "1.5",
    fontWeight: "600",
  },

  // Title — card title, item label (medium weight)
  titleLg: {
    fontSize: "1rem",       // 16px
    lineHeight: "1.5",
    fontWeight: "500",
  },
  titleMd: {
    fontSize: "0.875rem",   // 14px
    lineHeight: "1.5",
    fontWeight: "500",
  },
  titleSm: {
    fontSize: "0.75rem",    // 12px
    lineHeight: "1.5",
    fontWeight: "500",
  },

  // Body — konten utama
  bodyLg: {
    fontSize: "1rem",       // 16px
    lineHeight: "1.6",
    fontWeight: "400",
  },
  bodyMd: {
    fontSize: "0.875rem",   // 14px
    lineHeight: "1.6",
    fontWeight: "400",
  },
  bodySm: {
    fontSize: "0.75rem",    // 12px
    lineHeight: "1.6",
    fontWeight: "400",
  },

  // Caption — helper text, timestamp, subtitle kecil
  caption: {
    fontSize: "0.75rem",    // 12px
    lineHeight: "1.4",
    fontWeight: "400",
  },

  // Label — badge, chip, button text
  labelLg: {
    fontSize: "0.875rem",   // 14px
    lineHeight: "1.4",
    fontWeight: "500",
  },
  labelMd: {
    fontSize: "0.75rem",    // 12px
    lineHeight: "1.4",
    fontWeight: "500",
  },
  labelSm: {
    fontSize: "0.625rem",   // 10px
    lineHeight: "1.4",
    fontWeight: "500",
  },
} as const satisfies Record<string, TextStyle>;

// ─── Panduan Penggunaan Tailwind ──────────────────────────────────────────────
// Mapping dari text style ke Tailwind class yang setara:
//
// displayLg  → text-5xl font-bold tracking-tighter
// displayMd  → text-4xl font-bold tracking-tighter
// displaySm  → text-3xl font-semibold tracking-tight
// h1         → text-2xl font-bold
// h2         → text-xl font-semibold
// h3         → text-lg font-semibold
// h4         → text-base font-semibold
// titleLg    → text-base font-medium
// titleMd    → text-sm font-medium
// titleSm    → text-xs font-medium
// bodyLg     → text-base
// bodyMd     → text-sm
// bodySm     → text-xs
// caption    → text-xs text-muted-foreground
// labelLg    → text-sm font-medium
// labelMd    → text-xs font-medium
