"use client";

import { useTranslation } from "react-i18next";
import { Globe, Palette, Info, LogOut } from "lucide-react";

import { ThemeSelector } from "@/features/settings/components/theme-selector";
import { LanguageSelector } from "@/features/settings/components/language-selector";
import { AppInfoSection } from "@/features/settings/components/app-info-section";
import { LogoutSection } from "@/features/settings/components/logout-section";

interface SettingsSectionProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}

function SettingsSection({ icon: Icon, title, children }: SettingsSectionProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      {/* Section Header */}
      <div className="flex items-center gap-3 border-b border-border bg-muted/30 px-6 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      </div>

      {/* Section Content */}
      <div className="p-6">{children}</div>
    </section>
  );
}

interface SettingsRowProps {
  label: string;
  description?: string;
  children: React.ReactNode;
}

function SettingsRow({ label, description, children }: SettingsRowProps) {
  return (
    <div className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-border">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description && (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

export default function PengaturanPage() {
  const { t } = useTranslation("settings");

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      {/* Section 1: Tampilan */}
      <SettingsSection icon={Palette} title={t("appearance.title")}>
        <SettingsRow label={t("appearance.language.label")}>
          <LanguageSelector />
        </SettingsRow>

        <SettingsRow label={t("appearance.theme.label")}>
          <ThemeSelector />
        </SettingsRow>
      </SettingsSection>

      {/* Section 2: Tentang Aplikasi */}
      <SettingsSection icon={Info} title={t("about.title")}>
        <AppInfoSection />
      </SettingsSection>

      {/* Section 3: Akun */}
      <SettingsSection icon={LogOut} title={t("account.title")}>
        <LogoutSection />
      </SettingsSection>
    </div>
  );
}
