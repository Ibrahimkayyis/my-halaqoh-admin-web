/**
 * Konfigurasi Rilis Resmi Aplikasi Mobile MyHalaqoh
 *
 * File ini merupakan Single Source of Truth (SSOT) untuk distribusi APK mobile.
 * Setiap kali merilis versi baru aplikasi:
 * 1. Letakkan file APK baru di `public/downloads/` (contoh: `my_halaqoh_v1.1.0.apk`)
 * 2. Cukup ubah nilai `version`, `fileName`, dan `fileSize` di file konfigurasi ini.
 *
 * Seluruh tautan download dan badge informasi di landing page akan otomatis terupdate!
 */
export const APP_RELEASE_CONFIG = {
  version: "1.1.0",
  buildType: "Build Release",
  fileSize: "~85 MB",
  compatibility: "Android & iOS",
  fileName: "my_halaqoh_v1.1.0.apk",
  downloadUrl: "/downloads/my_halaqoh_v1.1.0.apk",
} as const;
