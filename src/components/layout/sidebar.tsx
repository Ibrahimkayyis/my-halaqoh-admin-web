"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Target, 
  School, 
  Settings, 
  LogOut,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { logout } from "@/features/auth/actions/auth.actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navGroups = [
  {
    title: "KELOLA DATA",
    items: [
      { title: "Dashboard", href: "/", icon: LayoutDashboard },
      { title: "Guru", href: "/guru", icon: Users },
      { title: "Santri", href: "/santri", icon: GraduationCap },
      { title: "Halaqoh", href: "/halaqoh", icon: BookOpen },
    ],
  },
  {
    title: "AKADEMIK",
    items: [
      { title: "Target Hafalan", href: "/target-hafalan", icon: Target },
      { title: "Kelas & Program", href: "/kelas-program", icon: School },
    ],
  },
  {
    title: "SISTEM",
    items: [
      { title: "Pengaturan", href: "/pengaturan", icon: Settings },
    ],
  },
];

interface SidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export function Sidebar({ isExpanded, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-300",
        isExpanded ? "w-72" : "w-20"
      )}
    >
      {/* Brand Header & Toggle */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        <div className={cn("flex items-center gap-3 overflow-hidden transition-all duration-300", isExpanded ? "w-auto opacity-100" : "w-0 opacity-0")}>
          <div className="relative h-8 w-8 shrink-0">
            <Image src="/logo.svg" alt="MyHalaqoh Logo" fill className="object-contain" />
          </div>
          <span className="text-lg font-bold tracking-tight text-primary whitespace-nowrap">
            MyHalaqoh Admin
          </span>
        </div>
        
        {/* Toggle Button */}
        <button 
          onClick={onToggle}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          {isExpanded ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-6 space-y-8">
        {navGroups.map((group) => (
          <div key={group.title} className="flex flex-col">
            {isExpanded && (
              <h4 className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {group.title}
              </h4>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={!isExpanded ? item.title : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      !isExpanded && "justify-center px-0 py-3"
                    )}
                  >
                    <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-primary" : "text-muted-foreground")} />
                    {isExpanded && <span className="truncate">{item.title}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Profile & Footer Actions */}
      <div className="border-t p-4 space-y-4">
        {/* Dark Mode Toggle */}
        <div className={cn("flex items-center", isExpanded ? "justify-between px-2" : "justify-center")}>
          {isExpanded && <span className="text-sm text-muted-foreground font-medium">Dark Mode</span>}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex h-6 w-10 shrink-0 items-center rounded-full bg-muted p-1 transition-colors"
            title="Toggle Theme"
          >
            <div
              className={cn(
                "flex h-4 w-4 items-center justify-center rounded-full bg-background shadow-sm transition-transform",
                theme === "dark" ? "translate-x-4" : "translate-x-0"
              )}
            >
              {theme === "dark" ? (
                <Moon className="h-3 w-3 text-foreground" />
              ) : (
                <Sun className="h-3 w-3 text-foreground" />
              )}
            </div>
          </button>
        </div>

        {/* Profile Card */}
        <div className={cn("flex items-center rounded-xl bg-muted/50 p-3", isExpanded ? "gap-3" : "justify-center flex-col gap-2 p-2")}>
          <Avatar className="h-10 w-10 shrink-0 border border-border">
            <AvatarImage alt={user?.displayName || "Admin"} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {user?.displayName?.charAt(0).toUpperCase() || "A"}
            </AvatarFallback>
          </Avatar>
          {isExpanded && (
            <div className="flex flex-1 flex-col overflow-hidden">
              <span className="truncate text-sm font-semibold text-foreground">
                {user?.displayName || "Admin"}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                Admin Pesantren
              </span>
            </div>
          )}
          <button
            onClick={() => logout()}
            className="shrink-0 rounded-md p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
