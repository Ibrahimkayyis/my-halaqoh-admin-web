/**
 * Design System — Theme Object
 * MyHalaqoh Admin Web
 *
 * Object tema utama yang mengagregasi seluruh token desain.
 * Ini adalah titik akses tunggal ke seluruh design system dari TypeScript.
 *
 * Penggunaan:
 *   import { theme } from "@/theme";
 *   theme.colors.palette.primary      // "#115D69"
 *   theme.radius.lg                   // "0.625rem"
 *   theme.shadows.card                // "0 1px 3px ..."
 *
 * ⚠️ Untuk styling komponen, SELALU gunakan Tailwind class (bg-primary,
 *    text-foreground, dll) atau CSS variable langsung — bukan object ini.
 *    Object ini hanya untuk referensi developer / logika programmatic.
 */

import { palette, lightColors, darkColors } from "./colors";
import { fontFamily, fontWeight, lineHeight, letterSpacing, textStyles } from "./typography";
import { radius } from "./radius";
import { shadows } from "./shadows";
import { spacing } from "./spacing";

export const theme = {
  colors: {
    /** Raw palette — warna dasar tanpa semantik */
    palette,
    /** Semantic token light mode */
    light: lightColors,
    /** Semantic token dark mode */
    dark: darkColors,
  },

  typography: {
    fontFamily,
    fontWeight,
    lineHeight,
    letterSpacing,
    /** Semantic text style presets */
    textStyles,
  },

  /** Border radius scale */
  radius,

  /** Semantic shadow tokens */
  shadows,

  /** Spacing scale (4px base) */
  spacing,
} as const;

export type Theme = typeof theme;
