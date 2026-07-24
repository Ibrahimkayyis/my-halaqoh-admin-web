"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const themeOptions = [
  {
    value: "light",
    icon: Sun,
    tKey: "light" as const,
    descKey: "lightDesc" as const,
  },
  {
    value: "dark",
    icon: Moon,
    tKey: "dark" as const,
    descKey: "darkDesc" as const,
  },
  {
    value: "system",
    icon: Monitor,
    tKey: "system" as const,
    descKey: "systemDesc" as const,
  },
];

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation("settings");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {themeOptions.map(({ value, icon: Icon, tKey, descKey }) => {
        const isActive = theme === value;
        return (
          <button
            key={value}
            onClick={() => setTheme(value)}
            className={cn(
              "group relative flex flex-col items-start gap-3 rounded-xl border-2 p-4 text-left transition-all duration-200",
              "hover:border-primary/50 hover:bg-primary/5 hover:shadow-sm",
              isActive
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border bg-card"
            )}
          >
            {/* Active indicator dot */}
            <span
              className={cn(
                "absolute right-3 top-3 h-2.5 w-2.5 rounded-full transition-all duration-200",
                isActive ? "bg-primary scale-100" : "bg-transparent scale-0"
              )}
            />

            {/* Icon */}
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-200",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
              )}
            >
              <Icon className="h-5 w-5" />
            </div>

            {/* Label */}
            <div>
              <p
                className={cn(
                  "text-sm font-semibold transition-colors duration-200",
                  isActive ? "text-primary" : "text-foreground"
                )}
              >
                {t(`appearance.theme.${tKey}`)}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground leading-snug">
                {t(`appearance.theme.${descKey}`)}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
