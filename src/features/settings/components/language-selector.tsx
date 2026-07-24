"use client";

import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { supportedLngs, type SupportedLanguage } from "@/lib/i18n/config";
import i18n from "@/lib/i18n/config";

const languageOptions: { value: SupportedLanguage; label: string; nativeLabel: string; flag: string }[] = [
  { value: "id", label: "Bahasa Indonesia", nativeLabel: "Indonesia", flag: "🇮🇩" },
  { value: "en", label: "English", nativeLabel: "English", flag: "🇬🇧" },
];

export function LanguageSelector() {
  const { t, i18n: i18nInstance } = useTranslation("settings");
  const currentLang = i18nInstance.language?.startsWith("en") ? "en" : "id";

  const handleChange = (lang: SupportedLanguage) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="flex flex-wrap gap-3">
      {languageOptions.map(({ value, label, nativeLabel, flag }) => {
        const isActive = currentLang === value;
        return (
          <button
            key={value}
            onClick={() => handleChange(value)}
            className={cn(
              "group flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all duration-200",
              "hover:border-primary/50 hover:bg-primary/5 hover:shadow-sm",
              isActive
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border bg-card"
            )}
          >
            {/* Flag */}
            <span className="text-2xl leading-none select-none">{flag}</span>

            {/* Labels */}
            <div>
              <p
                className={cn(
                  "text-sm font-semibold transition-colors",
                  isActive ? "text-primary" : "text-foreground"
                )}
              >
                {nativeLabel}
              </p>
              <p className="text-xs text-muted-foreground">{label}</p>
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
