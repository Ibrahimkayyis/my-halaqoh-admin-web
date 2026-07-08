/**
 * Design System — Spacing
 * MyHalaqoh Admin Web
 *
 * Spacing scale standar berbasis 4px (0.25rem per unit).
 * Mengikuti konvensi Tailwind default sehingga nilai ini selaras
 * dengan angka pada utility class (p-4 = spacing[4] = 1rem = 16px).
 *
 * Tidak perlu mendaftarkan ulang ke Tailwind — Tailwind v4 sudah
 * punya spacing scale ini secara built-in. File ini berfungsi sebagai
 * dokumentasi eksplisit nilai mana yang dipakai di project ini.
 *
 * Panduan penggunaan Tailwind:
 *   p-1  → 4px    | p-2  → 8px    | p-3  → 12px
 *   p-4  → 16px   | p-5  → 20px   | p-6  → 24px
 *   p-8  → 32px   | p-10 → 40px   | p-12 → 48px
 *   p-16 → 64px   | p-20 → 80px   | p-24 → 96px
 */

export const spacing = {
  /** 4px — gap antar icon dan teks kecil */
  1: "0.25rem",
  /** 8px — padding inner kecil, gap antar elemen */
  2: "0.5rem",
  /** 12px — padding komponen kecil */
  3: "0.75rem",
  /** 16px — padding default card, button */
  4: "1rem",
  /** 20px — padding section kecil */
  5: "1.25rem",
  /** 24px — padding card standar */
  6: "1.5rem",
  /** 32px — gap antar section */
  8: "2rem",
  /** 40px — padding page section */
  10: "2.5rem",
  /** 48px — jarak antar block besar */
  12: "3rem",
  /** 64px — padding page container */
  16: "4rem",
  /** 80px — section besar */
  20: "5rem",
  /** 96px — hero section, jarak sangat besar */
  24: "6rem",
} as const;

export type SpacingScale = typeof spacing;
export type SpacingKey = keyof SpacingScale;
