import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MyHalaqoh — Platform Halaqoh & Tahfidz Al-Qur'an Digital",
  description:
    "Aplikasi pencatatan presensi halaqoh dan perkembangan hafalan Al-Qur'an santri yang menghubungkan Asatidz, Wali Santri, dan Manajemen Pesantren secara realtime.",
  keywords: ["halaqoh", "tahfidz", "pesantren", "quran", "hafalan", "santri", "myhalaqoh"],
  openGraph: {
    title: "MyHalaqoh — Platform Halaqoh Digital",
    description:
      "Digitalisasi pencatatan halaqoh dan hafalan Al-Qur'an untuk pesantren.",
    type: "website",
  },
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
