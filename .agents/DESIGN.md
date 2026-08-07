---
version: alpha
revision: 0.1.0
theme: light+dark
name: MyHalaqoh Admin Web
structural_reference: "Diadaptasi dari struktur DESIGN.md Atlassian (atlassian.design/DESIGN.md) — bagian Colors, Typography, Layout, Elevation, Shapes, Components mengikuti kerangka yang sama, tapi seluruh nilai token adalah milik project ini."
colors:
  # Neutral & surface
  'text': '#111827'
  'text-muted': '#6B7280'
  'background': '#F5F5F5'
  'surface': '#FFFFFF'
  'border': '#E5E7EB'
  # Brand
  'brand': '#115D69'
  # Semantic status
  'success': '#10B981'
  'warning': '#FBBF24'
  'danger': '#F43F5E'
  'info': '#3B82F6'
typography:
  family: 'Inter'
spacing:
  base: 4
radius:
  base: 10
---

## Overview

DESIGN.md ini adalah kontrak desain untuk **MyHalaqoh Admin Web** — dibaca oleh AI coding agent (Claude Code, Cursor, dsb.) sebelum generate UI apa pun di project ini. Prinsip inti: **calm, dense, institusional** — admin panel pesantren yang menampilkan banyak data (guru, santri, halaqoh, kehadiran) tanpa terasa ramai atau "generic AI dashboard".

**Urutan otoritas:** file ini melengkapi, bukan menggantikan, `project_context.md` Bagian 8 (Keputusan Desain) dan Bagian 12 (Design System Foundation). Kalau ada bentrok nilai, `project_context.md` yang menang — file ini adalah rangkuman yang lebih ringkas & terstruktur untuk konsumsi agent.

Struktur file ini mengikuti kerangka DESIGN.md Atlassian (Colors → Typography → Layout → Elevation → Shapes → Components → Do's/Don'ts → Icons → Motion → Voice → Accessibility → Responsive) karena karakter Atlassian — enterprise, dense, status-driven — paling dekat dengan kebutuhan admin panel ini. **Nilai warna, radius, dan tipografi di bawah adalah milik MyHalaqoh, bukan Atlassian.**

---

## Colors

### 1) Neutral & surface

| Token | Light | Dark | Kegunaan |
|---|---|---|---|
| `background` | `#F5F5F5` | `#0F172A` | Kanvas halaman (`<body>`, area di belakang sidebar/header) |
| `surface` / `card` | `#FFFFFF` | `#111827` | Layer di atas background — card, panel, table container |
| `text` / `foreground` | `#111827` | `#F9FAFB` | Teks utama |
| `text-muted` / `muted-foreground` | `#6B7280` | `#9CA3AF` | Label, caption, teks sekunder |
| `border` | `#E5E7EB` | `#374151` | Garis pemisah, outline card, divider |

**MUST** pakai `background` sebagai kanvas halaman (bukan `surface`). **MUST NOT** menggelapkan `background` sekadar untuk menciptakan kontras terhadap card — kontras dicapai lewat `border` + padding, bukan mewarnai kanvas.

### 2) Brand & semantic roles — _bermakna, bukan dekoratif_

| Token | Hex | Kegunaan |
|---|---|---|
| `brand` / `primary` | `#115D69` (teal-hijau institusional) | **Satu-satunya** warna yang boleh "berbicara" — tombol utama, link aktif, nav item terpilih, highlight status positif |
| `success` | `#10B981` | Status positif (Hadir, Aktif, berhasil) |
| `warning` | `#FBBF24` | Status butuh perhatian (Terlambat, mendekati batas) |
| `danger` / `error` | `#F43F5E` | Status negatif/kritis (Alfa, gagal, hapus) |
| `info` | `#3B82F6` | Informasi netral (Izin, catatan) |

**MUST** reservasi `brand` hanya untuk SATU aksi utama per layar (tombol primary, nav aktif) — bukan dipakai merata di banyak elemen sekaligus.
**MUST NOT** memberi lebih dari satu warna latar berbeda pada grup metrik/card yang sejajar (lihat kasus nyata di Do's and Don'ts). Kalau butuh membedakan >1 kategori dalam satu grup, gunakan **satu** warna aksen + variasi bobot teks (bold/regular), bukan rainbow background.

### 3) Status badge (pengganti "Lozenge" ala Atlassian)

Status di tabel (Aktif/Alumni untuk Santri, Aktif/Nonaktif untuk Guru) **MUST** memakai badge pil kecil bertoken semantik (`bg-success/10 text-success`, dst.) — **MUST NOT** mewarnai seluruh row atau card dengan warna status.

---

## Typography

### Family

Satu font: **Inter**, via `next/font/google`, variable `--font-sans`. **MUST NOT** memperkenalkan font kedua (termasuk untuk heading/display) — konsistensi dijaga lewat `font-weight`, bukan mengganti typeface (ADR-004).

### Skala

| Kategori | Size | Weight | Tailwind |
|---|---|---|---|
| Display | 48px / 36px | 700 | `text-5xl` / `text-4xl font-bold tracking-tighter` |
| Heading h1/h2/h3 | 24px / 20px / 18px | 700 / 600 / 600 | `text-2xl font-bold` dst. |
| Title | 14px | 500 | `text-sm font-medium` |
| Body | 14px | 400 | `text-sm` |
| Caption | 12px | 400 | `text-xs text-muted-foreground` |
| Label | 12px | 500 | `text-xs font-medium` |

### Skala "Metric" — khusus angka dashboard

Diadaptasi dari prinsip Atlassian: dashboard butuh skala terpisah untuk angka besar (Total Santri, Total Guru, Total Halaqoh) supaya terasa sebagai *metric*, bukan judul heading.

| Token | Size | Weight |
|---|---|---|
| `metric-lg` | 28px | 500 (medium — bukan bold penuh, biar tidak berat) |
| `metric-md` | 24px | 500 |
| `metric-sm` | 16px | 500 |

**MUST** memakai skala `metric-*` untuk angka di stat card, **bukan** skala heading biasa — supaya angka besar tidak "berebut" hierarki visual dengan judul section.

### Case

**MUST** pakai sentence case di semua label UI (tombol, judul dialog, nama field) — bukan Title Case atau ALL CAPS. Konsisten dengan Bahasa Indonesia formal tanpa kapitalisasi berlebihan.

---

## Layout & Spacing

Basis 4px (konvensi default Tailwind — lihat Bagian 12.6). **MUST** memakai kelipatan basis untuk semua padding/gap (`p-4`=16px, `gap-6`=24px, dst.) — **MUST NOT** menyisipkan nilai spacing custom di luar skala Tailwind default (`p-[13px]`, dsb.).

**Prinsip density:** admin panel ini data-heavy (tabel guru/santri, form multi-field). Density lebih tinggi (baris lebih rapat, padding lebih hemat) diprioritaskan di atas whitespace dekoratif — beda dengan landing page konsumer yang butuh spacing lega. **MUST NOT** menambah padding besar pada tabel/list demi kesan "lega" jika itu mengorbankan jumlah baris yang terlihat tanpa scroll.

---

## Elevation & Depth

Dipetakan dari token shadow semantik project (Bagian 12.5):

| Plane | Token | Kegunaan |
|---|---|---|
| **Default** | `surface` + `border` (tanpa shadow) | Kanvas datar. Card statis pakai border, bukan shadow. |
| **Raised** | `shadow-card` | Card yang dinamis/interaktif (row hover, card halaqoh yang bisa diklik). Maksimal satu region "raised" yang menonjol per layar. |
| **Overlay** | `shadow-dialog` / `shadow-popover` / `shadow-dropdown` / `shadow-tooltip` | Modal, dropdown, popover, tooltip — sesuai konteksnya masing-masing (lihat Components → Popover/Select di bawah). |

**MUST** memakai `background` (bukan warna lebih gelap) sebagai kanvas halaman — pola "halaman abu-abu, card putih" boleh, tapi kontras dicapai lewat `border`, bukan menggelapkan kanvas lebih jauh untuk efek dramatis.
**MUST NOT** memberi shadow besar yang sama rata ke semua elemen (card, badge, icon wrapper sekaligus) — ini pola AI-slop yang paling sering muncul (lihat kasus nyata di Do's and Don'ts).

---

## Shapes

### Corner radius

Basis `--radius: 10px` (Bagian 12.4), skala proporsional:

| Token | px | Kelas komponen |
|---|---|---|
| `rounded-xs` | 4px | Badge compact, indicator kecil |
| `rounded-sm` | 6px | Input field, chip |
| `rounded-md` | 8px | Tooltip, tag |
| `rounded-lg` | 10px | **Default** — card, button, modal |
| `rounded-xl` | 12px | Modal header, image container |
| `rounded-2xl` | 16px | Card besar, drawer |
| `rounded-full` | pill | Avatar, badge status |

**MUST** memilih radius berdasarkan kelas komponen di atas — **MUST NOT** memakai nilai radius acak di luar skala (`rounded-[7px]`, dst.).

### Border & Focus ring

- Border resting: 1px, token `border`.
- Focus ring: pakai ring bawaan shadcn/ui (`focus-visible:ring-2 ring-ring`) — **MUST NOT** menghapus `outline`/focus ring tanpa pengganti yang setara.

---

## Components

Pola konkret untuk komponen yang sering dibuat AI agent di project ini — termasuk perbaikan dari kasus nyata yang sudah ditemukan (lihat Bagian 16 di `project_context.md`).

### Stat / Metric card

- Satu container flat (`border` + `radius-lg`), **bukan** grid card berwarna-warni per kategori.
- Label kecil (`caption`, `text-muted-foreground`) di atas, angka besar (skala `metric-*`) di bawah.
- Icon 14–16px sejajar label, warna icon ikut token semantik — **bukan** icon besar di dalam lingkaran berwarna.
- Kelompokkan metrik secara makna (mis. "Hadir" terpisah dari "Tidak Hadir") dengan divider tipis, bukan flat grid rata semua sama bobot.

### Status badge

- Pil kecil (`rounded-full`, padding kecil), warna dari token semantik (`success`/`warning`/`danger`/`info`) di background sangat pudar (`/10`) dengan teks warna solid yang sama.
- Satu badge = satu status. **MUST NOT** dipakai untuk mewarnai seluruh row/card.

### Select, Popover, Date Picker

- **MUST** pakai `@/components/ui/select`, `@/components/ui/popover`, dan komponen Calendar dari shadcn/ui — yang sudah menangani portal rendering & collision detection secara otomatis.
- **MUST NOT** membangun dropdown/date-picker custom manual dengan posisi absolute yang di-hardcode — ini penyebab bug overlay menutupi konten di belakangnya (kasus nyata sudah pernah terjadi di widget Ringkasan Kehadiran).
- **MUST** diverifikasi: saat dropdown/popover dibuka, tidak ada elemen di sekitarnya yang tertutup/terpotong.

### Table

- Density tinggi: row height ringkas, padding hemat (lihat Layout & Spacing).
- Border horizontal antar row (`border` token), bukan shadow per row.
- Kolom angka rata kanan, kolom teks rata kiri.
- Empty state: ikon + teks singkat + CTA (misal "Tambah Guru"), bukan sekadar teks "Tidak ada data".

### Form

- **MUST** pakai `@/components/ui/field` (`Field`, `FieldGroup`, `FieldLabel`, `FieldError`) + `Controller` dari `react-hook-form` — **MUST NOT** memakai `@/components/ui/form` (deprecated, lihat Bagian 2 `project_context.md`).
- Label selalu visible di atas input (bukan hanya placeholder).
- Error message di bawah field terkait, warna `danger`.

### Sidebar & navigasi

- Grup nav sesuai Bagian 8: "Kelola Data", "Akademik", "Sistem".
- Item aktif memakai warna `brand` — hanya satu per waktu.
- Profile card + dark mode toggle + logout di bagian bawah, bukan tersebar.

---

## Do's and Don'ts

| Do | Don't |
|---|---|
| Satu warna aksen (`brand`) per grup elemen sejajar | Rainbow background per card dalam satu grid (kasus nyata: 6 stat card warna beda-beda) |
| Badge pil kecil untuk status | Mewarnai seluruh card/row sesuai status |
| Skala `metric-*` untuk angka dashboard | Angka dashboard pakai skala heading biasa |
| `shadow-card` untuk elemen interaktif, `border` untuk elemen statis | Shadow besar merata di semua elemen |
| Popover/Select/Calendar dari shadcn/ui dengan portal otomatis | Dropdown custom manual yang menutupi konten di belakangnya |
| Icon 14–16px sejajar teks | Icon besar di dalam lingkaran berwarna sebagai dekorasi |
| Container tunggal per grup informasi | Nesting card-dalam-card-dalam-lingkaran |
| Semua teks lewat `useTranslation` (Bagian 14) | Hardcode teks Bahasa Indonesia/Inggris di komponen |
| Warna dari token CSS variable | Hex hardcode (`bg-purple-500`, `style={{color:'#fff'}}`) |

---

## Icons

- Sumber: **Lucide** (bawaan preset shadcn "Rhea") — **MUST NOT** mencampur icon pack lain atau memakai emoji sebagai pengganti icon fungsional.
- Ukuran default 16px inline sejajar teks; 20–24px untuk konteks lebih menonjol (header section).
- Warna icon mengikuti token semantik yang sama dengan teks di sampingnya (icon `danger` berdampingan dengan teks `text-danger`, dst.).
- Icon dekoratif: `aria-hidden="true"`. Icon-only button: wajib `aria-label`.

---

## Motion

- Library: `motion` (Framer Motion v12, via `motion/react`).
- **MUST** dipakai untuk transisi fungsional (fade masuk/keluar dialog, slide sidebar) — **MUST NOT** dipakai untuk animasi dekoratif tanpa tujuan (bounce, confetti, pulse berulang).
- **MUST** menghormati `prefers-reduced-motion` — matikan animasi non-esensial jika preferensi ini aktif.
- Durasi singkat untuk interaksi (100–200ms: hover, klik), sedikit lebih panjang untuk transisi elemen masuk/keluar layar (200–300ms: dialog, dropdown).

---

## Voice and tone

- Bahasa utama **Indonesia**, dengan dukungan penuh English via i18n (Bagian 14 `project_context.md`) — **MUST** semua teks user-facing lewat `useTranslation`, **MUST NOT** hardcode string.
- **MUST** pakai kalimat aktif & to-the-point pada tombol/aksi ("Simpan", "Hapus", "Tambah Guru") — bukan "Submit" atau "OK" generik.
- Error message: sebutkan penyebab + tindakan yang bisa diambil, bukan pesan generik "Terjadi kesalahan".
- Istilah domain tetap konsisten sesuai Bagian 14.2 poin 5 (Santri→Student, Guru→Teacher, Halaqoh tetap "Halaqoh" di kedua bahasa).

---

## Accessibility

- **MUST** kontras teks memenuhi WCAG AA — token warna project ini sudah dirancang untuk itu, jangan override dengan hex di luar token.
- **MUST** setiap form input punya label visible (bukan hanya placeholder) — sudah standar lewat `FieldLabel`.
- **MUST** status tidak hanya disampaikan lewat warna — sertakan label teks/icon (badge selalu punya teks, bukan cuma dot warna).
- **MUST** seluruh interaksi bisa diakses via keyboard (tab order mengikuti urutan visual, `Esc` menutup dialog/popover — bawaan Radix/shadcn sudah menangani ini).
- **MUST** icon-only button punya `aria-label`.

---

## Responsive behaviour

- Admin panel ini utamanya dipakai di desktop (staf admin pesantren), tapi **MUST** tetap reflow dengan wajar di tablet/mobile — bukan mengorbankan akses ke aksi penting.
- Tabel dengan banyak kolom: **MUST** scroll horizontal pada layar sempit, **MUST NOT** memotong/menyembunyikan kolom penting secara diam-diam.
- Sidebar collapse menjadi menu di layar sempit, bukan dipaksa muat penuh.

---

*File ini adalah adaptasi struktural dari DESIGN.md Atlassian (atlassian.design/DESIGN.md), ditulis ulang dengan token dan konteks milik MyHalaqoh Admin Web. Lihat juga Bagian 16 (`project_context.md`) dan `.agents/reference-atlassian-design.md` untuk konteks tambahan.*
