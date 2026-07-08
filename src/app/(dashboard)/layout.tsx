"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AuthGuard } from "@/features/auth/components/auth-guard";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

const routeTitles: Record<string, string> = {
  "/": "Dashboard",
  "/guru": "Data Guru",
  "/santri": "Data Santri",
  "/halaqoh": "Data Halaqoh",
  "/target-hafalan": "Target Hafalan",
  "/kelas-program": "Kelas & Program",
  "/pengaturan": "Pengaturan Sistem",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const title = routeTitles[pathname] || "Dashboard";
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

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