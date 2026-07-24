export const APP_CONFIG = {
  name: "MyHalaqoh",
  version: "1.0.0",
  tagline: "Platform Digital Manajemen Halaqoh",
  platform: "Web Admin",
  institution: "Pondok Pesantren Hidayatullah Luqman Al-Hakim Surabaya",
  description:
    "MyHalaqoh adalah platform digital terpadu yang dirancang khusus untuk membantu pengelolaan halaqoh di lingkungan pesantren secara efisien, transparan, dan mudah diakses. Dikembangkan untuk Pondok Pesantren Hidayatullah Luqman Al-Hakim, aplikasi ini menghubungkan Admin, Guru, dan Wali Santri dalam satu ekosistem digital yang terintegrasi.",
  whatsapp: [
    {
      label: "Admin 1",
      number: "+628585013221",
      display: "+62 858-5013-2215",
    },
    {
      label: "Admin 2",
      number: "+628533884410",
      display: "+62 853-3884-4410",
    },
  ],
  features: [
    {
      icon: "QrCode",
      title: "Absensi QR Code",
      description:
        "Rekam kehadiran santri dengan cepat menggunakan barcode scanner terintegrasi.",
    },
    {
      icon: "BookOpen",
      title: "Hafalan Al-Quran",
      description:
        "Pantau progress hafalan santri per juz dan per surat secara real-time.",
    },
    {
      icon: "Bell",
      title: "Notifikasi",
      description:
        "Informasi absensi dan hafalan langsung ke Wali Santri via push notification.",
    },
    {
      icon: "Users",
      title: "Multi-Role Dashboard",
      description:
        "Tampilan dan fitur yang disesuaikan untuk Admin, Guru, dan Wali Santri.",
    },
    {
      icon: "WifiOff",
      title: "Mode Offline",
      description:
        "Tampilan dan hafalan tetap bisa direkam meskipun tanpa koneksi internet.",
    },
  ],
} as const;
