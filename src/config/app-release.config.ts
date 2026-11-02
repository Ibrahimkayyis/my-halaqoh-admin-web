/**
 * Konfigurasi Rilis Resmi Aplikasi Mobile MyHalaqoh
 *
 * File ini merupakan Single Source of Truth (SSOT) untuk distribusi APK mobile.
 * Setiap kali merilis versi baru aplikasi:
 * 1. Buat Release baru di GitHub (tag contoh: `v1.1.0`) dan upload file APK sebagai Release Asset.
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
  downloadUrl: "https://github.com/Ibrahimkayyis/my-halaqoh-admin-web/releases/download/v1.1.0/my_halaqoh_v1.1.0.apk",
} as const;
