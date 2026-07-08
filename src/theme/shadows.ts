/**
 * Design System — Shadows
 * MyHalaqoh Admin Web
 *
 * Shadow semantik per konteks UI — bukan shadow generik (sm/md/lg).
 * Didefinisikan sebagai token kontekstual agar lebih ekspresif:
 *   shadow-card     → Untuk card dan panel konten
 *   shadow-dropdown → Untuk dropdown menu dan select
 *   shadow-dialog   → Untuk modal dan dialog
 *   shadow-popover  → Untuk popover, tooltip besar
 *   shadow-tooltip  → Untuk tooltip kecil
 *
 * Tailwind utilities (via @theme di globals.css):
 *   shadow-card, shadow-dropdown, shadow-dialog,
 *   shadow-popover, shadow-tooltip
 */

export const shadows = {
  /**
   * Card shadow — subtle, untuk card di atas background.
   * Tailwind: `shadow-card`
   */
  card: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",

  /**
   * Dropdown shadow — sedikit lebih kuat dari card.
   * Tailwind: `shadow-dropdown`
   */
  dropdown: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",

  /**
   * Dialog shadow — shadow besar untuk modal yang mengambang di atas konten.
   * Tailwind: `shadow-dialog`
   */
  dialog: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",

  /**
   * Popover shadow — lebih dalam dari dropdown.
   * Tailwind: `shadow-popover`
   */
  popover: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",

  /**
   * Tooltip shadow — sangat minimal, hampir tidak terlihat.
   * Tailwind: `shadow-tooltip`
   */
  tooltip: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
} as const;

export type ShadowScale = typeof shadows;
export type ShadowKey = keyof ShadowScale;
