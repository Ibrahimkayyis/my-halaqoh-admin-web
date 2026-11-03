/**
 * Konfigurasi Rilis Resmi Aplikasi Mobile MyHalaqoh
 *
 * File ini merupakan Single Source of Truth (SSOT) untuk distribusi APK mobile.
 *
 * Tautan download mengarah ke internal endpoint `/api/download/apk` yang secara otomatis
 * mendeteksi file APK dari rilis terbaru di repository mobile (Ibrahimkayyis/my_halaqoh).
 * Tautan App Store mengarah langsung ke halaman aplikasi di Apple App Store.
 */
export const APP_RELEASE_CONFIG = {
  version: "1.1.0",
  buildType: "Build Release",
  fileSize: "~85 MB",
  compatibility: "Android & iOS",
  fileName: "my_halaqoh.apk",
  downloadUrl: "/api/download/apk",
  appStoreUrl: "https://apps.apple.com/id/app/myhalaqoh/id6820783662",
} as const;
