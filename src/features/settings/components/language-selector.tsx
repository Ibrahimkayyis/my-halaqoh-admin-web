"use client";

import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { type SupportedLanguage } from "@/lib/i18n/config";
import i18n from "@/lib/i18n/config";

const languageOptions: { value: SupportedLanguage; label: string; nativeLabel: string; flag: string }[] = [
  { value: "id", label: "Bahasa Indonesia", nativeLabel: "Indonesia", flag: "🇮🇩" },
  { value: "en", label: "English", nativeLabel: "English", flag: "🇬🇧" },
];

export function LanguageSelector() {
  const { i18n: i18nInstance } = useTranslation("settings");
  const currentLang = i18nInstance.language?.startsWith("en") ? "en" : "id";

  const handleChange = (lang: SupportedLanguage) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
      {languageOptions.map(({ value, label, nativeLabel, flag }) => {
        const isActive = currentLang === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => handleChange(value)}
            className={cn(
              "group flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all duration-200 w-full min-h-[52px] cursor-pointer",
              "hover:border-primary/50 hover:bg-primary/5 hover:shadow-xs",
              "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              isActive
                ? "border-primary bg-primary/5 shadow-xs"
                : "border-border bg-card"
            )}
          >
            {/* Flag */}
            <span className="text-2xl leading-none select-none">{flag}</span>

            {/* Labels */}
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  "text-sm font-semibold transition-colors truncate",
                  isActive ? "text-primary" : "text-foreground"
                )}
              >
                {nativeLabel}
              </p>
              <p className="text-xs text-muted-foreground truncate">{label}</p>
            </div>

            {/* Active dot */}
            {isActive && (
              <span className="ml-auto h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
            )}
          </button>
        );
      })}
    </div>
  );
}
