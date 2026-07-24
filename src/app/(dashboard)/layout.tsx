"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { AuthGuard } from "@/features/auth/components/auth-guard";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { I18nProvider } from "@/components/providers/i18n-provider";

const routeTitleKeys: Record<string, string> = {
  "/": "titles.dashboard",
  "/guru": "titles.guru",
  "/santri": "titles.santri",
  "/halaqoh": "titles.halaqoh",
  "/halaqoh/baru": "titles.halaqohNew",
  "/target-hafalan": "titles.targetHafalan",
  "/kelas-program": "titles.kelasProgram",
  "/pengaturan": "titles.pengaturan",
};

function DashboardContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t } = useTranslation("nav");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  let titleKey = routeTitleKeys[pathname];
  if (!titleKey) {
    if (pathname.startsWith("/halaqoh/")) {
      titleKey = "titles.halaqohDetail";
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
        />
        <div 
          className={`flex flex-1 flex-col transition-all duration-300 ${
            isSidebarExpanded ? "pl-72" : "pl-20"
          }`}
        >
          <Header title={title} />
          <main className="flex-1 overflow-y-auto p-8">
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