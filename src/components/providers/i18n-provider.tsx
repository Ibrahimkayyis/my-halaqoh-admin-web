"use client";

import { useEffect } from "react";
import "@/lib/i18n/config"; // Initialize i18next
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n/config";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
      try {
        const savedLang = localStorage.getItem("myhalaqoh-language");
        if (savedLang && (savedLang === "id" || savedLang === "en") && savedLang !== i18n.language) {
          i18n.changeLanguage(savedLang);
        }
      } catch {
        // localStorage unavailable or restricted
      }
    }
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
