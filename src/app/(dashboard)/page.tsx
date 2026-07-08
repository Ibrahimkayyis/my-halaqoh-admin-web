"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { logout } from "@/features/auth/actions/auth.actions";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Selamat datang, {user?.displayName}</h1>
      <p className="text-muted-foreground">Role: {user?.role}</p>
      <button onClick={handleLogout} className="mt-4 text-sm underline">
        Logout
      </button>
    </div>
  );
}