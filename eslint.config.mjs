import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import tanstackQuery from "@tanstack/eslint-plugin-query";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  ...tanstackQuery.configs["flat/recommended"],
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Bukan kode produk (tooling agent, scratch, referensi desain):
    ".agents/**",
    "tmp/**",
    "design-system/**",
  ]),
  {
    // File test boleh memakai `any` pada mock dan komponen anonim.
    files: ["**/__tests__/**", "**/*.test.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "react/display-name": "off",
    },
  },
  {
    // Utang teknis yang terlacak: diturunkan ke warning dan dibatasi oleh
    // ratchet `--max-warnings` di script `lint:ci` (jumlahnya hanya boleh turun).
    files: ["src/**"],
    ignores: ["**/__tests__/**", "**/*.test.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/preserve-manual-memoization": "warn",
    },
  },
]);

export default eslintConfig;
