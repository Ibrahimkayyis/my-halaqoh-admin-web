"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { AuthGuard } from "@/features/auth/components/auth-guard";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { I18nProvider } from "@/components/providers/i18n-provider";
import { cn } from "@/lib/utils";

const routeTitleKeys: Record<string, string> = {
  "/dashboard": "titles.dashboard",
  "/guru": "titles.guru",
  "/santri": "titles.santri",
  "/halaqoh": "titles.halaqoh",
  "/halaqoh/baru": "titles.halaqohNew",
  "/target-hafalan": "titles.targetHafalan",
  "/kehadiran-santri": "titles.kehadiranSantri",
  "/kehadiran-guru": "titles.kehadiranGuru",
  "/sertifikasi-tahfidz": "titles.sertifikasiTahfidz",
  "/kelas-program": "titles.kelasProgram",
  "/pengaturan": "titles.pengaturan",
};

function DashboardContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t } = useTranslation("nav");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile drawer automatically when navigating to another route
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  let titleKey = routeTitleKeys[pathname];
  if (!titleKey) {
    if (pathname.startsWith("/halaqoh/")) {
      titleKey = "titles.halaqohDetail";
    } else if (pathname.startsWith("/santri/")) {
      titleKey = "titles.santriDetail";
    } else {
      titleKey = "titles.dashboard";
    }
  }

  const title = t(titleKey);

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-surface">
        <Sidebar 
          isExpanded={isSidebarExpanded} 
          onToggle={() => setIsSidebarExpanded(!isSidebarExpanded)}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />
        <div 
          className={cn(
            "flex flex-1 flex-col transition-all duration-300 w-full min-w-0",
            isSidebarExpanded ? "lg:pl-72" : "lg:pl-20"
          )}
        >
          <Header 
            title={title} 
            onMenuClick={() => setMobileOpen(true)} 
          />
          <main className="flex-1 overflow-y-auto p-3.5 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <DashboardContent>{children}</DashboardContent>
    </I18nProvider>
  );
}