# Page Override: Landing Page — MyHalaqoh

> **LOGIC:** These rules override `MASTER.md` for the public landing page only.
> For anything not explicitly overridden here, follow `MASTER.md`.

---

**Page:** Public Landing Page (`/`)
**Purpose:** Pengenalan aplikasi MyHalaqoh (mobile & web), download APK, dan akses Web Admin
**Audience:** Guru/Asatidz, Wali Santri, Staf Admin Pesantren (non-technical users)
**Language:** Bahasa Indonesia (primary)

---

## Landing Pattern: App Store Style + Feature Showcase (Hybrid)

Menggabungkan pola **App Store Style Landing** (device mockup, download CTAs) dengan **Feature-Rich Showcase** (fitur highlight dengan ikon).

### Section Order

```
1. Navigation Bar (Sticky)
   - Logo MyHalaqoh + Nama Aplikasi
   - Nav Links: Fitur | Screenshot | Download | FAQ
   - Theme Toggle (Light/Dark)
   - CTA Button: "Masuk Web Admin" → /login

2. Hero Section
   - Headline (Outfit 700): Tagline utama MyHalaqoh
   - Subheadline (Inter 400): Deskripsi singkat (1-2 kalimat)
   - Primary CTA: "Download Aplikasi" (Amber accent, prominent)
   - Secondary CTA: "Masuk Web Admin" (Teal outline)
   - Device Mockup: Screenshot aplikasi mobile dalam frame HP

3. Features Section (Grid 2x3 atau 3x2)
   - 6 fitur utama dengan ikon Lucide + judul + deskripsi singkat:
     a. Pencatatan Presensi Digital (5 sesi harian)
     b. Setoran Hafalan Al-Qur'an (Ziyadah & Murajaah)
     c. Scanner Kartu Santri (NIS Barcode)
     d. Notifikasi Realtime untuk Wali Santri
     e. Laporan & Rekapitulasi Otomatis (PDF)
     f. Dashboard Admin Web Terpadu

4. App Screenshots / Preview Section
   - Carousel atau grid screenshot aplikasi mobile
   - 3-5 screenshot utama (presensi, setoran hafalan, dashboard, progres)
   - Dengan device frame mockup

5. User Roles Section (Siapa Saja yang Menggunakan?)
   - 3 kartu role:
     a. Guru / Asatidz — mencatat presensi & setoran hafalan
     b. Wali Santri — memantau progres anak secara realtime
     c. Admin Pesantren — mengelola data master via Web Admin

6. Download Section (Prominent CTA)
   - Headline: "Download MyHalaqoh Sekarang"
   - Deskripsi: Penjelasan singkat cara install APK
   - Primary CTA: "Download APK Android" (Amber, large, with download icon)
   - Note: "Segera hadir di Google Play Store & App Store"
   - QR Code (optional): Link langsung ke download APK

7. Web Admin Access Section
   - Headline: "Akses Web Admin MyHalaqoh"
   - Deskripsi: Untuk staf admin dan Waka Tahfidz
   - CTA: "Masuk Dashboard Admin" → /login (Teal primary button)

8. FAQ Section (Accordion)
   - 5-7 pertanyaan umum:
     a. Apa itu MyHalaqoh?
     b. Siapa saja yang bisa menggunakan?
     c. Bagaimana cara download dan install?
     d. Apakah gratis?
     e. Bagaimana jika tidak ada koneksi internet?
     f. Apa perbedaan aplikasi mobile dan web admin?
     g. Bagaimana cara mendapatkan akun?

9. Footer
   - Logo + Nama Pesantren (Pondok Pesantren Hidayatullah Luqman Al-Hakim)
   - Kontak (WhatsApp, Email)
   - Copyright
   - Made with ❤️ (optional: credit developer)
```

---

## Color Overrides (Landing-Specific)

Inherit semua warna dari MASTER.md, plus:

| Role | Light | Dark | Usage |
|------|-------|------|-------|
| Hero Gradient Start | `#115D69` | `#0F172A` | Hero background gradient |
| Hero Gradient End | `#0E4F5A` | `#1E293B` | Hero background gradient |
| Hero Text | `#FFFFFF` | `#F9FAFB` | Teks di atas hero gradient |
| Download CTA | `#D97706` | `#F59E0B` | Tombol download (amber) |
| Download CTA Hover | `#B45309` | `#D97706` | Hover state download |
| Admin CTA | `#115D69` | `#14B8A6` | Tombol akses web admin |
| Section Alt BG | `#F1F5F9` | `#1E293B` | Background section alternating |

---

## Typography Overrides

| Element | Font | Size (Mobile) | Size (Desktop) | Weight |
|---------|------|---------------|----------------|--------|
| Hero Headline | Outfit | 32px / 2rem | 56px / 3.5rem | 800 |
| Hero Subheadline | Inter | 16px / 1rem | 20px / 1.25rem | 400 |
| Section Title | Outfit | 24px / 1.5rem | 36px / 2.25rem | 700 |
| Feature Title | Outfit | 16px / 1rem | 18px / 1.125rem | 600 |
| Feature Description | Inter | 14px / 0.875rem | 15px / 0.9375rem | 400 |
| CTA Button | Inter | 15px | 16px | 600 |
| Nav Link | Inter | 14px | 15px | 500 |
| FAQ Question | Inter | 15px | 16px | 600 |
| FAQ Answer | Inter | 14px | 15px | 400 |
| Footer Text | Inter | 13px | 14px | 400 |

---

## Layout & Responsive Behavior

### Breakpoints

| Breakpoint | Width | Layout Changes |
|-----------|-------|---------------|
| Mobile | < 640px | Single column, stacked hero (text above mockup), hamburger nav, full-width CTAs |
| Tablet | 640–1024px | 2-column feature grid, side-by-side hero, visible nav links |
| Desktop | 1024–1440px | 3-column feature grid, hero with large mockup, max-width container 1200px |
| Wide | > 1440px | Centered container, increased side padding |

### Container

```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px; /* Mobile: 16px */
}
```

### Section Spacing

| Section | Vertical Padding (Mobile) | Vertical Padding (Desktop) |
|---------|--------------------------|---------------------------|
| Hero | 64px top, 48px bottom | 96px top, 80px bottom |
| Features | 48px | 80px |
| Screenshots | 48px | 80px |
| User Roles | 48px | 64px |
| Download | 48px | 80px |
| Web Admin | 48px | 64px |
| FAQ | 48px | 64px |
| Footer | 32px | 48px |

---

## Animation & Motion Guidelines

| Element | Animation | Duration | Trigger |
|---------|-----------|----------|---------|
| Hero content | Fade in + slide up (20px) | 600ms ease-out | On page load |
| Feature cards | Fade in + slide up (16px), staggered | 400ms ease-out, 100ms stagger | Scroll into view |
| Screenshots | Fade in + scale (0.95→1) | 500ms ease-out | Scroll into view |
| Role cards | Fade in + slide up | 400ms ease-out, 150ms stagger | Scroll into view |
| CTA buttons | Subtle lift + shadow grow | 200ms ease | Hover |
| Nav links | Opacity transition | 150ms | Hover |
| FAQ accordion | Height expand + fade in | 250ms ease | Click |

**Reduced Motion:** Semua animasi dinonaktifkan, hanya opacity fade yang dipertahankan.

---

## Download CTA Specifications

Karena aplikasi MyHalaqoh **belum tersedia di Play Store / App Store**, tombol download mengarah langsung ke file APK:

```
- Label: "Download APK Android"
- Icon: Lucide `Download` (left)
- Style: Amber accent, large (py-4 px-8), rounded-xl, shadow-lg
- Behavior: Direct download link ke file APK
- Below CTA: Teks kecil "Versi X.X.X • Android 5.0+" + "Segera hadir di Play Store"
```

Saat Play Store tersedia di masa depan, section ini bisa diupdate dengan badge resmi Google Play & App Store.

---

## Web Admin Access Specifications

```
- Label: "Masuk Dashboard Admin"
- Icon: Lucide `LayoutDashboard` (left)
- Style: Teal primary, medium (py-3 px-6), rounded-lg, border-2
- Behavior: href="/login" (internal navigation ke halaman login)
- Below CTA: Teks kecil "Untuk Admin & Waka Tahfidz"
```

---

## Anti-Patterns (Landing Page Specific)

Selain anti-patterns dari MASTER.md:

- ❌ **Technical jargon** — Jangan gunakan istilah teknis (API, Firebase, Firestore, SDK)
- ❌ **English-heavy copy** — Semua teks utama dalam Bahasa Indonesia
- ❌ **Fake Play Store badges** — Jangan tampilkan badge Play Store / App Store jika belum tersedia
- ❌ **Auto-playing carousel** — Screenshots harus manual scroll/click, bukan auto-rotate
- ❌ **Heavy hero animations** — Hero cukup fade-in sederhana, bukan parallax/particle effects
- ❌ **Generic stock illustrations** — Gunakan screenshot asli aplikasi atau mockup realistis
