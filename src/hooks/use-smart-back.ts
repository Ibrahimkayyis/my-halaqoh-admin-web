"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useCallback, useMemo } from "react";
import type { TFunction } from "i18next";

export interface UseSmartBackResult {
  backHref: string;
  backLabel: string;
  isFromExternal: boolean;
  handleBack: () => void;
}

/**
 * Validates that a route is a safe internal relative path.
 * Must start with exactly one '/' and not '//' or '\\' to prevent open-redirect vulnerabilities.
 */
export function sanitizeInternalPath(path: string | null | undefined): string | null {
  if (!path) return null;
  const trimmed = path.trim();
  if (
    trimmed.startsWith("/") &&
    !trimmed.startsWith("//") &&
    !trimmed.startsWith("/\\") &&
    !trimmed.includes(":") // prevent javascript: or data: URLs inside path strings
  ) {
    return trimmed;
  }
  return null;
}

/**
 * Returns a human-friendly localized back label based on the target return path.
 */
export function getContextualBackLabel(
  path: string,
  t: TFunction,
  defaultLabel?: string
): string {
  if (path.startsWith("/halaqoh/detail")) {
    return t("common:actions.backToHalaqohDetail", "Kembali ke Detail Halaqoh");
  }
  if (path.startsWith("/halaqoh")) {
    return t("common:actions.backToHalaqoh", "Kembali ke Daftar Halaqoh");
  }
  if (path.startsWith("/dashboard")) {
    return t("common:actions.backToDashboard", "Kembali ke Dashboard");
  }
  if (path.startsWith("/sertifikasi")) {
    return t("common:actions.backToSertifikasi", "Kembali ke Sertifikasi");
  }
  if (path.startsWith("/santri")) {
    return t("common:actions.backToSantri", "Kembali ke Daftar Santri");
  }
  if (path.startsWith("/guru")) {
    return t("common:actions.backToGuru", "Kembali ke Daftar Guru");
  }
  return defaultLabel || t("common:actions.back", "Kembali");
}

/**
 * Hook to provide context-aware back navigation.
 * Reads the `from` query parameter from the URL, sanitizes it, and returns the appropriate
 * target path and contextual label. Falls back to defaultHref if not provided or invalid.
 */
export function useSmartBack(
  defaultHref: string,
  defaultLabel?: string,
  customFrom?: string | null
): UseSmartBackResult {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation(["common"]);

  const fromParam = customFrom !== undefined ? customFrom : searchParams?.get("from");
  const validPath = useMemo(() => sanitizeInternalPath(fromParam), [fromParam]);

  const backHref = validPath || defaultHref;
  const isFromExternal = Boolean(validPath);

  const backLabel = useMemo(() => {
    if (validPath) {
      return getContextualBackLabel(validPath, t as unknown as TFunction, defaultLabel);
    }
    return defaultLabel || t("common:actions.back", "Kembali");
  }, [validPath, t, defaultLabel]);

  const handleBack = useCallback(() => {
    router.push(backHref);
  }, [router, backHref]);

  return {
    backHref,
    backLabel,
    isFromExternal,
    handleBack,
  };
}
