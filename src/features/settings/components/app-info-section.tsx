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
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 shadow-sm">
          <BookOpen className="h-10 w-10 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">{APP_CONFIG.name}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{APP_CONFIG.tagline}</p>
          <Badge
            variant="secondary"
            className="mt-2 bg-primary/10 text-primary border-primary/20 text-xs font-semibold"
          >
            Versi {APP_CONFIG.version}
          </Badge>
        </div>
        <p className="max-w-lg text-sm text-muted-foreground leading-relaxed">
          {t("about.description")}
        </p>
      </div>

      {/* Feature Grid */}
      <div>
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
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
                className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-4.5 w-4.5 text-primary" />
                </div>
                <div>
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
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
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
              className={`flex items-center justify-between gap-4 bg-card px-5 py-3.5 ${
                i < arr.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <span className="text-sm text-muted-foreground">{row.label}</span>
              <span className="text-right text-sm font-medium text-foreground">
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Contact / WhatsApp */}
      <div>
        <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          {t("about.contact")}
          <span className="h-px flex-1 bg-border" />
        </h3>
        <p className="mb-4 text-center text-sm text-muted-foreground">
          {t("about.contactDesc")}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {APP_CONFIG.whatsapp.map((admin, idx) => (
            <a
              key={admin.number}
              href={`https://wa.me/${admin.number.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "default", size: "default" }),
                "gap-2 bg-[#25D366] text-white hover:bg-[#1da851] shadow-sm"
              )}
            >
              <MessageCircle className="h-4 w-4" />
              {idx === 0 ? t("about.contactAdmin1") : t("about.contactAdmin2")} ({admin.display})
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
