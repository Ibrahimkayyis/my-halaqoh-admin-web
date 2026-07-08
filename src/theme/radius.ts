/**
 * Design System — Border Radius
 * MyHalaqoh Admin Web
 *
 * Semua nilai radius dalam rem, dihitung dari base radius 0.625rem (10px).
 * CSS variable --radius di theme.css menjadi dasar perhitungan.
 *
 * Tailwind utilities yang tersedia (via @theme inline di globals.css):
 *   rounded-xs   → 4px   (radius kecil, misal badge compact)
 *   rounded-sm   → 6px   (input, chip kecil)
 *   rounded-md   → 8px   (tooltip, tag)
 *   rounded-lg   → 10px  (card, button — default project)
 *   rounded-xl   → 12px  (modal header, image container)
 *   rounded-2xl  → 16px  (large card, drawer)
 *   rounded-full → 9999px (avatar, pill badge)
 */

export const radius = {
  /** 4px — sangat kecil, badge compact, indicator */
  xs: "0.25rem",
  /** 6px — input field, chip kecil */
  sm: "0.375rem",
  /** 8px — tooltip, dropdown item */
  md: "0.5rem",
  /** 10px — default card, button, modal */
  lg: "0.625rem",
  /** 12px — modal header, image container */
  xl: "0.75rem",
  /** 16px — large card, bottom sheet */
  "2xl": "1rem",
  /** 9999px — avatar, pill badge, FAB */
  full: "9999px",
} as const;

export type RadiusScale = typeof radius;
export type RadiusKey = keyof RadiusScale;
