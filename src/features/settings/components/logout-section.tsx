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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-destructive/20 bg-destructive/5 p-4 sm:px-5 sm:py-4">
      {/* User info */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
          <LogOut className="h-4.5 w-4.5 text-destructive" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">
            {t("account.logout")}
          </p>
          <p className="text-xs text-muted-foreground truncate">
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
              className="w-full sm:w-auto h-10 sm:h-9 shrink-0 gap-2 cursor-pointer"
              disabled={isLoggingOut}
            >
              <LogOut className="h-4 w-4" />
              {isLoggingOut ? "Keluar..." : t("account.logout")}
            </Button>
          }
        />
        <AlertDialogContent className="w-[95vw] sm:max-w-[425px] rounded-xl p-5 sm:p-6">
          <AlertDialogHeader>
            <AlertDialogTitle>{t("account.logoutConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("account.logoutConfirmDesc")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-2 mt-4 sm:mt-0">
            <AlertDialogCancel className="w-full sm:w-auto h-10 sm:h-9 cursor-pointer">
              {t("account.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="w-full sm:w-auto h-10 sm:h-9 cursor-pointer bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("account.logoutConfirmBtn")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
