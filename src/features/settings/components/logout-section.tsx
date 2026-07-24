"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { LogOut } from "lucide-react";
import { logout } from "@/features/auth/actions/auth.actions";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuthStore } from "@/stores/auth.store";

export function LogoutSection() {
  const { t } = useTranslation("settings");
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-destructive/20 bg-destructive/5 px-5 py-4">
      {/* User info */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
          <LogOut className="h-4.5 w-4.5 text-destructive" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">
            {t("account.logout")}
          </p>
          <p className="text-xs text-muted-foreground">
            {t("account.loggedInAs")}{" "}
            <span className="font-medium text-foreground">
              {user?.displayName ?? "Admin"}
            </span>
          </p>
        </div>
      </div>

      {/* Logout button with confirm dialog */}
      <AlertDialog>
        <AlertDialogTrigger
          render={
            <Button
              variant="destructive"
              size="sm"
              className="shrink-0 gap-2"
              disabled={isLoggingOut}
            >
              <LogOut className="h-4 w-4" />
              {isLoggingOut ? "Keluar..." : t("account.logout")}
            </Button>
          }
        />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("account.logoutConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("account.logoutConfirmDesc")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("account.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("account.logoutConfirmBtn")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
