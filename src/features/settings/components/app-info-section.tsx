"use client";

import { useTranslation } from "react-i18next";
import {
  QrCode,
  BookOpen,
  Bell,
  Users,
  WifiOff,
  Info,
  MessageCircle,
} from "lucide-react";
import { APP_CONFIG } from "@/lib/constants/app";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Icon map matching APP_CONFIG.features icon names
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  QrCode,
  BookOpen,
  Bell,
  Users,
  WifiOff,
};

export function AppInfoSection() {
  const { t } = useTranslation("settings");

  return (
    <div className="space-y-6">
      {/* App Branding */}
      <div className="flex flex-col items-center gap-3 py-2 sm:py-4 text-center">
        <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-primary/10 shadow-xs">
          <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">{APP_CONFIG.name}</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{APP_CONFIG.tagline}</p>
          <Badge
            variant="secondary"
            className="mt-2 bg-primary/10 text-primary border-primary/20 text-xs font-semibold"
          >
            Versi {APP_CONFIG.version}
          </Badge>
        </div>
        <p className="max-w-lg text-xs sm:text-sm text-muted-foreground leading-relaxed px-2 sm:px-0">
          {t("about.description")}
        </p>
      </div>

      {/* Feature Grid */}
      <div>
        <h3 className="mb-3 sm:mb-4 flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          {t("about.features")}
          <span className="h-px flex-1 bg-border" />
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {APP_CONFIG.features.map((feature) => {
            const Icon = ICON_MAP[feature.icon] ?? Info;
            return (
              <div
                key={feature.title}
                className="flex items-start gap-3 rounded-xl border border-border bg-card p-3.5 sm:p-4 shadow-xs transition-shadow hover:shadow-sm"
              >
                <div className="mt-0.5 flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">{feature.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground leading-snug">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* App Info Table */}
      <div>
        <h3 className="mb-3 sm:mb-4 flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          {t("about.appInfo")}
          <span className="h-px flex-1 bg-border" />
        </h3>
        <div className="overflow-hidden rounded-xl border border-border">
          {[
            { label: t("about.appName"), value: APP_CONFIG.name },
            { label: t("about.version"), value: APP_CONFIG.version },
            { label: t("about.platform"), value: APP_CONFIG.platform },
            { label: t("about.institution"), value: APP_CONFIG.institution },
          ].map((row, i, arr) => (
            <div
              key={row.label}
              className={cn(
                "flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 bg-card px-4 sm:px-5 py-3 sm:py-3.5",
                i < arr.length - 1 && "border-b border-border"
              )}
            >
              <span className="text-xs sm:text-sm text-muted-foreground shrink-0">{row.label}</span>
              <span className="text-left sm:text-right text-xs sm:text-sm font-medium text-foreground break-words">
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Contact / WhatsApp */}
      <div>
        <h3 className="mb-2 flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          {t("about.contact")}
          <span className="h-px flex-1 bg-border" />
        </h3>
        <p className="mb-4 text-center text-xs sm:text-sm text-muted-foreground">
          {t("about.contactDesc")}
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 w-full">
          {APP_CONFIG.whatsapp.map((contact) => (
            <a
              key={contact.number}
              href={`https://wa.me/${contact.number.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "default", size: "default" }),
                "w-full sm:w-auto h-11 sm:h-10 text-sm font-medium gap-2 bg-[#25D366] text-white hover:bg-[#1da851] shadow-xs cursor-pointer"
              )}
            >
              <MessageCircle className="h-4 w-4 shrink-0" />
              <span>{t("about.contactDeveloper")} ({contact.display})</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
