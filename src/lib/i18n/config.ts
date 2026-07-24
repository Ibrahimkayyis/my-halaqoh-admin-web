import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import idCommon from "./locales/id/common.json";
import enCommon from "./locales/en/common.json";
import idNav from "./locales/id/nav.json";
import enNav from "./locales/en/nav.json";
import idAuth from "./locales/id/auth.json";
import enAuth from "./locales/en/auth.json";
import idDashboard from "./locales/id/dashboard.json";
import enDashboard from "./locales/en/dashboard.json";
import idGuru from "./locales/id/guru.json";
import enGuru from "./locales/en/guru.json";
import idSantri from "./locales/id/santri.json";
import enSantri from "./locales/en/santri.json";
import idHalaqoh from "./locales/id/halaqoh.json";
import enHalaqoh from "./locales/en/halaqoh.json";
import idTargetHafalan from "./locales/id/targetHafalan.json";
import enTargetHafalan from "./locales/en/targetHafalan.json";
import idKelasProgram from "./locales/id/kelasProgram.json";
import enKelasProgram from "./locales/en/kelasProgram.json";
import idSettings from "./locales/id/settings.json";
import enSettings from "./locales/en/settings.json";

export const defaultNS = "common";
export const supportedLngs = ["id", "en"] as const;
export type SupportedLanguage = (typeof supportedLngs)[number];

const resources = {
  id: {
    common: idCommon,
    nav: idNav,
    auth: idAuth,
    dashboard: idDashboard,
    guru: idGuru,
    santri: idSantri,
    halaqoh: idHalaqoh,
    targetHafalan: idTargetHafalan,
    kelasProgram: idKelasProgram,
    settings: idSettings.settings,
  },
  en: {
    common: enCommon,
    nav: enNav,
    auth: enAuth,
    dashboard: enDashboard,
    guru: enGuru,
    santri: enSantri,
    halaqoh: enHalaqoh,
    targetHafalan: enTargetHafalan,
    kelasProgram: enKelasProgram,
    settings: enSettings.settings,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    defaultNS,
    fallbackLng: "id",
    supportedLngs,
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: "myhalaqoh-language",
      caches: ["localStorage"],
    },
  });

export default i18n;
