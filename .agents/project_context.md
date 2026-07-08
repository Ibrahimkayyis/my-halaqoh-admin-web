# Project Context: MyHalaqoh Admin Web

> Dokumen ini adalah **satu-satunya sumber kebenaran (source of truth)** untuk AI agent yang bekerja di project ini. Baca seluruh isinya sebelum melakukan perubahan kode apa pun. Dokumen ini bersifat living document — akan terus diperbarui manual oleh developer seiring progress. Selalu cek **Bagian 10 — Progress & Status Saat Ini** untuk tahu apa yang sudah dan belum dikerjakan sebelum mulai kerja.

---

## 1. Gambaran Umum Proyek

**Nama:** MyHalaqoh Admin Web (`halaqoh-admin-web`)

**Apa ini:** Web admin panel pendamping aplikasi mobile Flutter "MyHalaqoh" — sistem manajemen pesantren (Islamic boarding school). Web ini dipakai staf admin pesantren untuk mengelola data guru, santri, halaqoh (kelompok hafalan Quran), target hafalan, dan struktur kelas/program.

**Relasi dengan mobile app:** Web ini **berbagi backend Firebase yang sama** dengan app mobile Flutter yang sudah eksis dan production. Tidak ada backend baru yang dibuat — web ini murni consumer/writer tambahan ke Firestore/Auth/Storage/Functions yang sama.

⚠️ **Aturan paling penting:** jangan pernah asumsikan skema data Firestore bisa diubah bebas. Perubahan skema akan berdampak ke app mobile juga. Model data (Bagian 4) sudah fix dari mobile app — mirror saja, jangan ubah field/tipe data.

**Developer background:** Kuat di Flutter/Dart, masih belajar ekosistem Next.js/React. AI agent harus memberi penjelasan yang cukup saat memakai konsep React/Next.js tingkat lanjut, jangan asumsikan sudah familiar.

**Environment:** Developer bekerja di **Windows PowerShell** (bukan Bash/Zsh/Git Bash). Semua command yang di-generate harus PowerShell-compatible:
- JANGAN pakai `\` untuk line continuation → tulis satu baris, atau pakai backtick `` ` ``
- JANGAN pakai brace expansion `mkdir -p {a,b,c}` → pakai `mkdir a, b, c` (koma) atau panggil `mkdir` terpisah per folder

---

## 2. Tech Stack (Terverifikasi & Aktif Dipakai)

```
Next.js 16.2.10 (App Router, Turbopack, src/ directory)
TypeScript 5
Tailwind CSS
shadcn/ui — preset "Rhea" (Lucide icons + Inter font), base style "Base (Recommended)"
Firebase Web SDK 11 (Auth + Firestore + Storage + Functions)
TanStack Table v8           → Tabel data dengan filter/sort/pagination
TanStack Query v5           → Server state cache + invalidasi otomatis
React Hook Form + Zod       → Form management + validasi schema (via Controller pattern)
Zustand                     → Client-side UI state
PapaParse                   → CSV parsing untuk bulk import
@react-pdf/renderer         → PDF generation (laporan)
next-themes                 → Dark/light mode (ThemeProvider sudah di-setup di root layout)
sonner                      → Toast notifications (Toaster sudah di-mount di root layout)
date-fns (+ locale id)      → Utility format tanggal (Indonesia) — helper di `src/lib/utils/date.ts`
motion                      → Animasi komponen (Framer Motion v12, import dari "motion/react")
nuqs                        → URL search params state — NuqsAdapter sudah di-mount di root layout
react-dropzone              → File drop zone untuk image/CSV upload
cmdk                        → Command palette primitives (untuk fitur search/command menu)
```

**Dev Dependencies tambahan:**
- **@tanstack/eslint-plugin-query** — ESLint rules untuk TanStack Query (sudah dikonfigurasi di `eslint.config.mjs`)

**Belum diputuskan / TBD:**
- **Recharts** — sempat direncanakan untuk chart dashboard, tapi keputusan desain final (Bagian 8) mengarah ke horizontal bar/progress list custom, bukan chart library. Evaluasi ulang saat mengerjakan Tahap 2C (isi dashboard) apakah tetap butuh Recharts atau cukup komponen progress custom dengan Tailwind.

### Keputusan Teknis Penting (Deviasi dari Estimasi Awal)

| Aspek | Keputusan Final | Alasan |
|---|---|---|
| **Form component** | Pakai `@/components/ui/field` (`Field`, `FieldGroup`, `FieldLabel`, `FieldError`) + `Controller` dari `react-hook-form` langsung. | `@/components/ui/form` (`Form`, `FormField`, `FormItem`, `FormControl`, `FormMessage`) **DEPRECATED sejak Okt 2025** di versi shadcn yang dipakai project ini. **JANGAN PERNAH generate kode yang import dari `@/components/ui/form` — akan error module not found.** |
| **Auth route protection** | **Client-side guard** — komponen `<AuthGuard>` + Zustand auth store, dipasang di `(dashboard)/layout.tsx`. **TIDAK memakai** Next.js middleware + session cookie. | Lebih cepat setup, tidak butuh Firebase Admin SDK / Service Account Key. Firestore Security Rules jadi garda keamanan sesungguhnya (client-side guard hanya UX, bukan security boundary). Bisa di-upgrade ke session cookie nanti di tahap Polish kalau waktu cukup — belum prioritas. |
| **Bundler** | Turbopack (default Next.js 16) | Bawaan Next.js 16, tidak perlu setup manual |

---

## 3. Arsitektur & Struktur Folder

Feature-first architecture, paralel dengan Clean Architecture di mobile.

### 3.1 Overview

```
halaqoh-admin-web/
├── public/
│   ├── favicon.ico
│   └── logo.svg
│
├── src/
│   ├── app/                          ← Next.js App Router
│   ├── components/                   ← Komponen UI reusable (bukan fitur spesifik)
│   ├── features/                     ← Fitur-fitur utama (feature-first)
│   ├── lib/                          ← Utilities & konfigurasi
│   ├── hooks/                        ← Custom React hooks global
│   ├── stores/                       ← Zustand stores
│   ├── types/                        ← TypeScript type definitions
│   └── styles/                       ← Global CSS
│
├── .env.local                        ← Firebase config (JANGAN commit)
├── .env.example                      ← Template env
├── firebase.json                     ← Firebase hosting config
├── .firebaserc
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### 3.2 Struktur `src/app/` (Next.js App Router)

```
src/app/
│
├── layout.tsx                        ← Root layout, dibungkus <AuthProvider>
├── globals.css
│
├── (auth)/                           ← Route group: tidak pakai sidebar
│   └── login/
│       ├── page.tsx
│       └── _components/
│           └── login-form.tsx
│
├── (dashboard)/                      ← Route group: dengan sidebar admin, dibungkus <AuthGuard>
│   ├── layout.tsx                    ← Layout dengan Sidebar + Header
│   ├── page.tsx                      ← Dashboard utama (/)
│   │
│   ├── guru/
│   │   └── page.tsx
│   │
│   ├── santri/
│   │   └── page.tsx
│   │
│   ├── halaqoh/
│   │   ├── page.tsx                  ← Daftar halaqoh
│   │   └── [id]/
│   │       └── page.tsx              ← Detail/edit halaqoh
│   │
│   ├── target-hafalan/
│   │   └── page.tsx
│   │
│   ├── settings/
│   │   ├── layout.tsx                ← Settings layout (sub-navigation)
│   │   ├── kelas-program/
│   │   │   └── page.tsx
│   │   └── preferensi/
│   │       └── page.tsx
│   │
│   └── not-found.tsx                 ← 404 page
│
└── api/                              ← Next.js API Routes (jika butuh server-side)
    └── health/
        └── route.ts
```

### 3.3 Struktur `src/features/` (Feature-First Architecture)

Setiap fitur konsisten memiliki: `actions/`, `hooks/`, `schemas/`, `components/`.

```
src/features/
│
├── auth/
│   ├── actions/auth.actions.ts       ← login(), logout() — dengan role-check admin-only
│   ├── hooks/use-auth.ts             ← useAuth(), useCurrentUser(), useAuthListener()
│   ├── schemas/login.schema.ts       ← Zod schema validasi form login
│   └── components/auth-guard.tsx     ← Wrapper proteksi route (client-side guard)
│
├── guru/
│   ├── actions/guru.actions.ts       ← addGuru(), updateGuru(), deleteGuru(), bulkAddGuru(), resetGuruPassword()
│   ├── hooks/use-guru.ts             ← useGuruList(), useGuruRealtime()
│   ├── schemas/guru.schema.ts        ← Zod: GuruFormSchema, BulkGuruRowSchema
│   └── components/
│       ├── guru-table.tsx            ← TanStack Table implementasi
│       ├── guru-form-dialog.tsx      ← Modal tambah/edit guru
│       ├── guru-delete-dialog.tsx
│       ├── guru-bulk-dialog.tsx      ← CSV import wizard
│       └── guru-reset-password-dialog.tsx
│
├── santri/
│   ├── actions/santri.actions.ts     ← CRUD + bulkAdd + resetPassword + promoteAll
│   ├── hooks/use-santri.ts
│   ├── schemas/santri.schema.ts
│   └── components/
│       ├── santri-table.tsx
│       ├── santri-form-dialog.tsx    ← Form dengan wali santri section
│       ├── santri-filter-bar.tsx     ← Filter kelas, program, alumni toggle
│       ├── santri-delete-dialog.tsx
│       ├── santri-bulk-dialog.tsx
│       └── kenaikan-kelas/
│           ├── kenaikan-kelas-wizard.tsx   ← Wizard multi-step
│           ├── step-preview.tsx            ← Preview santri yang akan naik
│           ├── step-confirm.tsx            ← Input tahun ajaran & semester
│           └── step-progress.tsx           ← Progress bar eksekusi
│
├── halaqoh/
│   ├── actions/halaqoh.actions.ts    ← CRUD + assignSantri + removeSantri
│   ├── hooks/use-halaqoh.ts
│   ├── schemas/halaqoh.schema.ts
│   └── components/
│       ├── halaqoh-grid.tsx          ← Card grid view
│       ├── halaqoh-card.tsx
│       ├── halaqoh-form.tsx          ← Form panjang (nama, kelas, program, guru, santri)
│       ├── halaqoh-delete-dialog.tsx
│       ├── guru-selector.tsx         ← Searchable dropdown pilih guru
│       └── santri-transfer-list.tsx  ← Transfer list pilih santri
│
├── target-hafalan/
│   ├── actions/target-hafalan.actions.ts
│   ├── hooks/use-target-hafalan.ts
│   ├── data/curriculum-data.ts       ← Data kurikulum statis (mirror dari Dart)
│   └── components/
│       ├── target-tab-view.tsx       ← Tab Reguler | Takhassus
│       ├── target-kelas-card.tsx     ← Kartu per kelas
│       └── edit-target-dialog.tsx    ← Dialog edit tahun ajaran & semester
│
├── kelas-program/
│   ├── actions/kelas-program.actions.ts
│   ├── hooks/use-kelas-program.ts
│   └── components/
│       ├── kelas-tab.tsx
│       ├── program-tab.tsx
│       ├── kelas-form-dialog.tsx
│       └── program-form-dialog.tsx
│
└── dashboard/
    ├── hooks/use-dashboard-stats.ts  ← Aggregasi data untuk stat card & progress list
    └── components/
        ├── stat-card.tsx
        ├── stats-row.tsx
        ├── hafalan-progress-list.tsx  ← Capaian target hafalan per kelas
        └── kehadiran-progress-list.tsx ← Capaian kehadiran per kelas
```

> Catatan: `menu-grid.tsx` / `MenuCard` **tidak dipakai** — lihat keputusan desain Bagian 8 (dashboard tidak punya quick-access menu karena navigasi sudah lewat sidebar).

### 3.4 Struktur `src/components/` (Shared UI, Bukan Fitur Spesifik)

```
src/components/
│
├── ui/                                ← shadcn/ui components (JANGAN diedit manual, auto-generated)
│   ├── button.tsx
│   ├── dialog.tsx
│   ├── table.tsx
│   ├── field.tsx                      ← Field, FieldGroup, FieldLabel, FieldError (pengganti form.tsx lama)
│   ├── input.tsx
│   ├── select.tsx
│   ├── badge.tsx
│   ├── tabs.tsx
│   ├── sheet.tsx
│   ├── sonner.tsx                     ← Toast notifications
│   └── ...
│
├── layout/
│   ├── sidebar.tsx                    ← Sidebar navigasi admin
│   ├── sidebar-nav-item.tsx
│   ├── header.tsx                     ← Top bar dengan user info & logout
│   ├── breadcrumb.tsx
│   └── page-container.tsx             ← Wrapper dengan padding & max-width
│
├── data-table/                        ← Reusable TanStack Table wrapper
│   ├── data-table.tsx                 ← Generic DataTable component
│   ├── data-table-column-header.tsx   ← Sort toggle header
│   ├── data-table-pagination.tsx
│   ├── data-table-toolbar.tsx         ← Search bar + filter slot
│   └── data-table-skeleton.tsx        ← Loading skeleton
│
├── forms/
│   ├── image-upload.tsx               ← Foto profil upload ke Firebase Storage
│   ├── csv-upload.tsx                 ← CSV file picker + preview
│   └── confirm-dialog.tsx             ← Reusable konfirmasi (hapus, reset, dsb)
│
└── providers/
    ├── query-provider.tsx             ← TanStack Query QueryClientProvider
    ├── theme-provider.tsx             ← next-themes
    ├── firebase-provider.tsx          ← Firebase app initialization
    └── auth-provider.tsx              ← Auth state listener wrapper
```

### 3.5 Struktur `src/lib/` (Utilities & Config)

```
src/lib/
│
├── firebase/
│   ├── config.ts                      ← Firebase app init (singleton)
│   ├── auth.ts                        ← getAuth(), signInWithIdentifier(), signOutUser(), dll
│   ├── firestore.ts                   ← getFirestore(), collection refs (type-safe)
│   ├── storage.ts                     ← getStorage(), upload helpers
│   └── functions.ts                   ← getFunctions(), callFunction() wrapper
│
├── firestore/
│   ├── collections.ts                 ← Typed collection references
│   ├── converters/
│   │   ├── guru.converter.ts          ← fromFirestore / toFirestore mapper
│   │   ├── santri.converter.ts
│   │   ├── halaqoh.converter.ts
│   │   ├── target-hafalan.converter.ts
│   │   ├── kelas.converter.ts
│   │   └── program.converter.ts
│   └── queries/
│       ├── user.queries.ts            ← getUserDoc()
│       ├── guru.queries.ts            ← getAllGuru(), watchGuru(), etc.
│       ├── santri.queries.ts
│       ├── halaqoh.queries.ts
│       └── ...
│
├── utils/
│   ├── csv.ts                         ← CSV parse & validate helpers
│   ├── date.ts                        ← Format tanggal (intl)
│   ├── program.ts                     ← programCodeToLabel('R') → 'Reguler'
│   ├── kelas.ts                       ← getNextKelas(), isValidKelas()
│   └── cn.ts                          ← clsx + twMerge (sudah ada di shadcn setup)
│
└── constants/
    ├── routes.ts                      ← Route path constants
    └── app.ts                         ← App-level constants
```

### 3.6 Struktur `src/types/`

```
src/types/
├── models/                            ← Mirror dari Dart domain models
│   ├── user.types.ts
│   ├── guru.types.ts
│   ├── santri.types.ts
│   ├── halaqoh.types.ts
│   ├── target-hafalan.types.ts
│   ├── kelas.types.ts
│   └── program.types.ts
├── forms/                             ← Inferred dari Zod schemas
│   └── index.ts
└── api.types.ts                       ← Cloud Function response types
```

**Pola tipe (contoh `guru.types.ts`):**
```typescript
// Tipe dokumen Firestore (raw)
export interface GuruDoc {
  nip: string;
  nama: string;
  phone?: string | null;
  profilePicture?: string | null;
  email?: string | null;
  program: 'R' | 'T';
  authUid?: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Tipe domain (setelah konversi)
export interface Guru extends Omit<GuruDoc, 'createdAt' | 'updatedAt'> {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Tipe untuk form
export type GuruFormValues = {
  nip: string;
  nama: string;
  phone?: string;
  program: 'R' | 'T';
  profilePicture?: File | string | null;
};
```

### 3.7 Struktur `src/hooks/` (Global Custom Hooks)

```
src/hooks/
├── use-firebase-auth.ts               ← Subscribe ke onAuthStateChanged
├── use-realtime-collection.ts         ← Generic onSnapshot hook
├── use-debounce.ts                    ← Debounce untuk search input
├── use-toast.ts                       ← Wrapper sonner toast
└── use-confirm.ts                     ← Programmatic confirm dialog
```

### 3.8 Struktur `src/stores/` (Zustand Global Stores)

```
src/stores/
├── auth.store.ts                      ← status, user, errorMessage (SUDAH ADA)
├── table-filter.store.ts              ← Filter state untuk setiap tabel
└── ui.store.ts                        ← Dialog open/close state, selected rows
```

### 3.9 Route Protection

**Pendekatan aktual: Client-side guard**, bukan Next.js middleware + session cookie.

- `<AuthProvider>` di root `layout.tsx` — subscribe ke Firebase auth state, isi Zustand `auth.store.ts`.
- `<AuthGuard>` di `(dashboard)/layout.tsx` — cek status auth dari store, redirect ke `/login` kalau belum login atau role bukan `admin`.
- Firestore Security Rules adalah garda keamanan sesungguhnya (client-side guard hanya untuk UX/routing, bukan boundary keamanan).
- **Tidak ada** `src/middleware.ts` di project ini. Jangan generate kode middleware kecuali developer eksplisit minta upgrade ke session cookie di tahap Polish.

### 3.10 Konvensi & Aturan Kode

| Aspek | Konvensi |
|---|---|
| Naming file | `kebab-case.tsx` untuk komponen, `camelCase.ts` untuk logic |
| Naming komponen | `PascalCase` |
| Naming hooks | file `use-nama-hook.ts`, function `useNamaHook` |
| Naming actions | `actionNama()` misal `addGuru()`, `deleteGuru()` |
| Tipe vs Interface | `interface` untuk object shapes, `type` untuk unions/utility |
| State management | Zustand **hanya** untuk UI state (dialog open/close, filter, auth status). Data dari Firestore **selalu** via TanStack Query — jangan taruh Firestore data mentah di Zustand |
| Form | **SELALU** Zod schema + `Controller` dari react-hook-form + komponen `Field`/`FieldGroup` dari shadcn. **BUKAN** `Form`/`FormField` (deprecated) |
| Error handling | Firestore errors di-catch di layer `actions/`, dilempar sebagai error terstruktur, jangan biarkan bocor ke komponen mentah |
| Import order | External → Internal (`@/...`) → Relative |
| Path alias | `@/*` mengarah ke `src/*` |

---

## 4. Model Data Inti (Firestore, Shared dengan Mobile App)

⚠️ Semua model di bawah ini **sudah fix** dari mobile app. Web hanya mirror — jangan mengubah field atau tipe data.

### 4.1 User (`/users/{uid}`) — dipakai untuk auth & role check

```typescript
interface User {
  uid: string;
  identifier: string;   // NIP (guru) atau NIS (santri), dipakai sebagai local-part email
  role: "admin" | "guru" | "santri";
  programType: "R" | "T" | null;
  displayName: string;
  linkedDocId: string;
}
```

⚠️ **Hanya role `"admin"` yang boleh mengakses Web Admin.** Login sebagai guru/santri harus ditolak & force sign-out (`auth.actions.ts`).

**Konvensi login:** identifier (NIP/NIS) di-convert ke email dengan pola `{identifier}@myhalaqoh.app` sebelum dikirim ke Firebase Auth — sama persis dengan konvensi di mobile app, supaya akun bisa dipakai lintas platform.

### 4.2 Guru

| Field | Tipe | Keterangan |
|---|---|---|
| `id` | String | Firestore auto-ID |
| `nip` | String | 13-digit unik, dipakai untuk login |
| `nama` | String | Nama lengkap |
| `phone` | String? | Nomor HP opsional |
| `profilePicture` | String? | URL foto (Firebase Storage) |
| `program` | String | `"R"` = Reguler, `"T"` = Takhassus |
| `authUid` | String? | Firebase Auth UID (set saat akun dibuat) |

### 4.3 Santri

| Field | Tipe | Keterangan |
|---|---|---|
| `nis` | String | 12-digit unik, juga nilai barcode kartu santri |
| `kelas` | String | `"7"` – `"12"` |
| `program` | String | `"R"` atau `"T"` |
| `halaqohId` | String? | ID halaqoh yang diikuti |
| `waliSantri` | WaliSantriModel? | Embedded: nama + phone orang tua |
| `isAlumni` | bool | Soft-archive saat kenaikan kelas dari kelas 12 |

### 4.4 Halaqoh

| Field | Tipe | Keterangan |
|---|---|---|
| `nama` | String | Nama bebas, misal `"AL FATIH 1"` |
| `kelas` / `program` | String | Level & program halaqoh |
| `guruId` + `guruNama` | String | Reference + denormalized nama guru |
| `santriIds` | List\<String\> | Daftar ID santri anggota |
| `jumlahSantri` | int | Denormalized count |

### 4.5 Target Hafalan

`id` (`"{kelas}_{program}"`), `kelas`, `program`, `tahunAjaran`, `semesterAktif`. Data kurikulum (juz target per kelas per semester) tersimpan statis di `curriculum-data.ts` (mirror dari `CurriculumData.dart`). Admin hanya mengkonfigurasi tahun ajaran & semester aktif per kelas per program.

### 4.6 Kelas & Program (Meta-data Struktural)

- **KelasModel:** `id`, `nama`, `urutan`, `nextKelasId?` (penting untuk kenaikan kelas)
- **ProgramModel:** `id` (`"R"`/`"T"`), `nama`

**Data institusi saat ini:** 261 santri, 40 guru, 23 kelompok halaqoh.

---

## 5. Inventaris Fitur Lengkap

Modul `master_data` adalah **inti administratif** MyHalaqoh — eksklusif untuk role `admin`, menjadi sumber data referensi bagi seluruh modul lain (absensi, hafalan, laporan) di mobile app.

### Fitur 1: Dashboard Admin

Halaman utama setelah login. Menampilkan ringkasan statistik realtime.

⚠️ **Revisi desain (lihat Bagian 8):** dashboard **TIDAK** memiliki quick-access menu/shortcut card (`MenuCard`) — semua navigasi sudah tersedia lewat sidebar. Isi dashboard final:
1. 3 stat card realtime: Total Santri, Total Guru, Total Halaqoh
2. Section "Capaian Target Hafalan per Kelas" — horizontal bar/progress list, persentase per kelas (7–12)
3. Section "Capaian Kehadiran Santri per Kelas" — pola visual sama, warna aksen berbeda dari section hafalan

**Cara kerja:** 3 stream Firestore (Santri, Guru, Halaqoh) aktif via TanStack Query, dihitung dan di-render reaktif ke stat card & progress list.

### Fitur 2: Manajemen Guru (CRUD + Bulk CSV + Reset Password)

Model: lihat Bagian 4.2. Sub-fitur: daftar dengan shimmer loading + realtime stream; pencarian client-side; tambah manual via dialog form; tambah bulk via CSV upload; edit; hapus dengan konfirmasi; reset password via Cloud Function.

### Fitur 3: Manajemen Santri (CRUD + Bulk + Filter + Alumni + Kenaikan Kelas)

Model: lihat Bagian 4.3. Sub-fitur: filter (kelas/program/alumni), pencarian, CRUD + bulk CSV, reset password, dan fitur unggulan:

**🎓 Kenaikan Kelas** — batch update semua santri aktif sekaligus:
- Kelas 7–11 → naik ke kelas berikutnya
- Kelas 12 → `isAlumni: true`, lepas dari halaqoh
- Semua `TargetHafalan` → update `tahunAjaran` + `semesterAktif`
- Ditulis dalam satu Firestore batch write

### Fitur 4: Manajemen Halaqoh (CRUD + Assign Guru & Santri)

Model: lihat Bagian 4.4. Sub-fitur: daftar (card view) + filter, pencarian; form buat/edit lengkap dengan pemilihan santri via layar khusus (filter otomatis santri tanpa halaqoh, sesuai kelas/program, maks 15 santri); hapus halaqoh (otomatis reset `halaqohId` di santri terkait).

### Fitur 5: Target Hafalan (Kurikulum per Kelas & Program)

Model: lihat Bagian 4.5. Sub-fitur: tab Reguler | Takhassus; kartu per kelas; dialog edit tahun ajaran & semester; integrasi daftar kelas dinamis dari Firestore.

### Fitur 6: Kelola Kelas & Program (Meta-data Struktural)

Model: lihat Bagian 4.6. Sub-fitur: CRUD kelas (dengan urutan & kelas berikutnya) dan CRUD program.

### Fitur 7: Pengaturan Admin

Ganti bahasa (ID/EN), ganti tema (Light/Dark/System), tentang aplikasi, logout dengan konfirmasi.

---

## 6. Kenapa Next.js? (Rasional Pemilihan Stack)

| Kebutuhan | Solusi Next.js |
|---|---|
| Realtime Firestore data | `onSnapshot` + TanStack Query invalidation |
| Form kompleks (halaqoh, santri) | React Hook Form + shadcn/ui Field/Controller |
| Tabel besar + filter + sort | TanStack Table (headless, fully customizable) |
| Bulk CSV import | PapaParse + batch Firestore writes |
| PDF laporan | `@react-pdf/renderer` |
| Auth + route protection | Firebase Auth + client-side `<AuthGuard>` |
| Deploy mudah | Firebase Hosting / Vercel (gratis) |
| TypeScript support | Native di Next.js |

Backend Firebase yang sudah dipakai di aplikasi mobile dipakai langsung — tidak perlu backend baru. Ini mengurangi risiko teknis migrasi data secara signifikan.

---

## 7. Keamanan

- [x] Firebase Security Rules sudah menolak write kalau role bukan `admin` (existing dari mobile, tidak diubah)
- [ ] Input validation Zod di semua form (baru ada di Login, belum di fitur lain)
- [ ] File upload validation (tipe + ukuran) untuk foto profil — belum dikerjakan
- [x] ~~Session cookie untuk auth~~ → **diganti** client-side guard (lihat Bagian 3.9)
- [x] `.env.local` sudah di `.gitignore` (default dari `create-next-app`)

---

## 8. Keputusan Desain — Dashboard & Sidebar

Setelah eksplorasi (termasuk mencoba adaptasi referensi desain e-commerce generic), diputuskan **desain dashboard dibuat dari nol**, bukan adaptasi template.

**Sidebar** (berlaku di semua halaman `(dashboard)` route group):
- Brand: "MyHalaqoh Admin", identitas warna hijau (cocok konteks pesantren)
- Grup nav "Kelola Data": Dashboard, Guru, Santri, Halaqoh
- Grup nav "Akademik": Target Hafalan, Kelas & Program
- Grup nav "Sistem": Pengaturan
- Bagian bawah: profile card admin (avatar, nama, role), dark mode toggle, logout

**Dashboard (halaman `/`)** — murni ringkasan/statistik, **tidak ada** quick-access menu/shortcut card (karena semua navigasi sudah ada di sidebar). Isi final: lihat Fitur 1 di Bagian 5.

**Style:** institusional, tenang, warna hijau, card-based, rounded corners, TIDAK flashy/e-commerce-style.

---

## 9. Timeline & Prioritas (Referensi)

```
Minggu 1     → Setup project, desain, konfigurasi Firebase        [SELESAI]
Minggu 2-3   → Auth, Layout, Dashboard                            [SEDANG DIKERJAKAN]
Minggu 4-5   → Manajemen Guru (CRUD + Bulk + Reset Password)
Minggu 6-7   → Manajemen Santri + Kenaikan Kelas
Minggu 8-9   → Manajemen Halaqoh + Transfer Santri
Minggu 10    → Target Hafalan + Kelas/Program + Pengaturan
Minggu 11    → Polish, Testing, Deployment
Minggu 12    → UAT bersama klien, bug fixing, serah terima
```

**Prioritas pengerjaan:**

| Prioritas | Fitur | Alasan |
|---|---|---|
| ⭐⭐⭐ Must Have | Auth, Guru, Santri, Halaqoh | Fitur inti, paling sering digunakan |
| ⭐⭐ Should Have | Target Hafalan, Kelas/Program, Kenaikan Kelas | Penting tapi bisa menyusul |
| ⭐ Nice to Have | Dashboard charts lanjutan, PDF export, CI/CD | Bonus jika waktu cukup |

---

## 10. Progress & Status Saat Ini

*(Update terakhir: setelah dependency setup tambahan selesai, sebelum mulai Layout)*

**Branch aktif:** `feature/dashboard-layout`

### ✅ Selesai

**Tahap 1 — Setup Project**
Next.js 16 + TS + Tailwind + shadcn (Rhea) + semua dependencies inti + struktur folder + Firebase config (`.env.local` terisi, `config.ts` jalan, terverifikasi via `npm run dev`).

**Tahap 1B — Dependency Setup Tambahan**
Install & integrasi: `motion`, `nuqs`, `react-dropzone`, `cmdk` (dependencies), `@tanstack/eslint-plugin-query` (devDependency).
Integrasi yang sudah dilakukan di root layout (`src/app/layout.tsx`):
- `ThemeProvider` dari `next-themes` — dark/light mode class-based (baru: `src/components/providers/theme-provider.tsx`)
- `NuqsAdapter` dari `nuqs/adapters/next/app` — URL search params state siap dipakai
- `Toaster` dari `@/components/ui/sonner` — toast notifications di-mount di root
- Font: hanya `Inter` (variable `--font-sans`), `suppressHydrationWarning` pada `<html>`
Integrasi utilitas: `src/lib/utils/date.ts` — helper date-fns dengan locale Indonesia.
ESLint: `@tanstack/eslint-plugin-query` dikonfigurasi di `eslint.config.mjs` (flat config recommended).

**Tahap 2A — Auth Feature** (client-side guard)
Types User, Firebase auth helpers, Firestore user query, Zustand auth store, Zod login schema, auth actions (login/logout dengan role-check admin-only), `useAuthListener`/`useAuth` hooks, `AuthProvider`, `AuthGuard`, Login Form (pakai `Field`/`Controller`, bukan `Form` lama), Login Page, `(dashboard)/layout.tsx` dibungkus `AuthGuard`, Dashboard page placeholder dengan tombol logout.

**Teruji end-to-end:** redirect ke `/login` saat belum auth, tolak login non-admin, login admin sukses, session persist saat refresh, logout berfungsi.

**Tahap 1C — Design System Foundation**
Buat fondasi design system yang menjadi standar seluruh development.
- `src/styles/theme.css` — CSS custom properties (sumber kebenaran warna untuk Tailwind & shadcn)
- `src/app/globals.css` — Bersih: import + `@theme inline` (color→Tailwind) + `@theme` (shadows) + `@layer base`
- `src/theme/colors.ts` — TypeScript mirror palette & semantic tokens (light + dark)
- `src/theme/typography.ts` — Skala tipografi: Display, Heading, Title, Body, Caption, Label
- `src/theme/radius.ts` — Radius scale: xs(4px)→2xl(16px)→full
- `src/theme/shadows.ts` — Shadow semantik: card, dropdown, dialog, popover, tooltip
- `src/theme/spacing.ts` — Spacing scale (4px base unit)
- `src/theme/theme.ts` — Aggregate theme object
- `src/theme/index.ts` — Barrel export
Seluruh komponen shadcn/ui otomatis menggunakan token baru tanpa modifikasi.

### 🔜 Sedang Berjalan / Berikutnya

- **Tahap 2B — Layout (Sidebar + Header)**: BELUM DIMULAI KODENYA. Spesifikasi desain sudah final (Bagian 8). Perlu dibuat: `src/components/layout/sidebar.tsx`, `sidebar-nav-item.tsx`, `header.tsx`, lalu wiring ke `(dashboard)/layout.tsx`.
- **Tahap 2C — Dashboard (isi asli)**: setelah layout ada. Perlu: TanStack Query provider (belum dibuat), `features/dashboard/hooks/use-dashboard-stats.ts`, komponen `stat-card.tsx`, komponen progress list untuk capaian hafalan & kehadiran per kelas.

### ⏳ Belum Dikerjakan Sama Sekali

Semua fitur di `src/features/`: guru, santri, halaqoh, target-hafalan, kelas-program (struktur folder sudah direncanakan di Bagian 3.3, kode belum ada). Middleware/session-cookie upgrade (opsional, di tahap Polish — saat ini tidak dipakai). PDF export, CI/CD.

---

## 11. Catatan untuk AI Agent

- Selalu cek **Bagian 10 — Progress & Status Saat Ini** sebelum mulai kerja — dokumen ini di-update manual oleh developer seiring progress, anggap ini paling update dibanding asumsi apa pun.
- Developer bekerja di **Windows PowerShell** — selalu generate command yang PowerShell-compatible (lihat Bagian 1).
- Developer masih belajar Next.js/React ecosystem (background kuat di Flutter/Dart) — berikan penjelasan yang cukup, jangan asumsikan familiar dengan konsep React/Next.js tingkat lanjut tanpa context singkat.
- **JANGAN** generate kode yang pakai `@/components/ui/form` (`Form`, `FormField`, `FormItem`, `FormControl`, `FormMessage`) — deprecated di versi shadcn project ini. Pakai `@/components/ui/field` + `Controller`.
- **JANGAN** generate Next.js middleware / session cookie auth kecuali developer eksplisit minta upgrade ke pendekatan itu.
- Jangan mengubah field/tipe data pada model Firestore (Bagian 4) tanpa konfirmasi eksplisit — model tersebut shared dengan mobile app production.

*Dokumen digabung dari `01-rencana-teknis-implementasi-web.md` + koreksi implementasi aktual | Terakhir diperbarui: 8 Juli 2026 (tambahan: Tahap 1C Design System Foundation)*

---

## 12. Design System Foundation

Project ini menggunakan design system berbasis CSS Variables + TypeScript tokens, konsisten dengan pendekatan ThemeExtension di Flutter.

### 12.1 Architecture Overview

```
CSS Variables (theme.css)          ← SUMBER KEBENARAN warna
        ↓
@theme inline (globals.css)        ← Memetakan ke Tailwind utilities
        ↓
Tailwind utility classes           ← Yang dipakai di komponen
(bg-primary, text-foreground, dll)

TypeScript (src/theme/*.ts)        ← Mirror untuk referensi developer
                                     & penggunaan programmatic
```

**Prinsip utama:** Komponen TIDAK boleh menggunakan hardcoded hex color. Selalu pakai Tailwind class yang mengacu ke CSS variable.

### 12.2 Color System

**File:** `src/styles/theme.css`, `src/theme/colors.ts`

| Token CSS Variable | Light | Dark | Kegunaan |
|---|---|---|---|
| `--primary` | `#115D69` | `#115D69` | Warna brand utama (teal) |
| `--background` | `#F5F5F5` | `#0F172A` | Background halaman |
| `--foreground` | `#111827` | `#F9FAFB` | Teks utama |
| `--surface` / `--card` | `#FFFFFF` | `#111827` | Layer di atas background |
| `--muted-foreground` | `#6B7280` | `#9CA3AF` | Teks sekunder |
| `--border` | `#E5E7EB` | `#374151` | Garis border |
| `--success` | `#10B981` | `#10B981` | Status sukses |
| `--warning` | `#FBBF24` | `#FBBF24` | Status peringatan |
| `--error` / `--destructive` | `#F43F5E` | `#F43F5E` | Status error |
| `--info` | `#3B82F6` | `#3B82F6` | Status informasi |

**Tailwind classes yang tersedia:**
`bg-primary`, `text-foreground`, `bg-card`, `text-muted-foreground`,
`bg-success`, `text-error`, `bg-info`, `border-border`, dll.

### 12.3 Typography

**File:** `src/theme/typography.ts`

Font tunggal: **Inter** (diload via `next/font/google`, variable `--font-sans`).

| Kategori | Style | Size | Weight | Tailwind equivalent |
|---|---|---|---|---|
| Display | `displayLg` | 48px | 700 | `text-5xl font-bold tracking-tighter` |
| Display | `displayMd` | 36px | 700 | `text-4xl font-bold tracking-tighter` |
| Heading | `h1` | 24px | 700 | `text-2xl font-bold` |
| Heading | `h2` | 20px | 600 | `text-xl font-semibold` |
| Heading | `h3` | 18px | 600 | `text-lg font-semibold` |
| Title | `titleMd` | 14px | 500 | `text-sm font-medium` |
| Body | `bodyMd` | 14px | 400 | `text-sm` |
| Caption | `caption` | 12px | 400 | `text-xs text-muted-foreground` |
| Label | `labelMd` | 12px | 500 | `text-xs font-medium` |

### 12.4 Border Radius

**File:** `src/theme/radius.ts`

Base: `--radius: 0.625rem` (10px). Semua radius lain dihitung secara proporsional.

| Tailwind class | Nilai | Kegunaan |
|---|---|---|
| `rounded-xs` | 4px | Badge compact, indicator |
| `rounded-sm` | 6px | Input field, chip |
| `rounded-md` | 8px | Tooltip, tag |
| `rounded-lg` | 10px | **Default** — card, button, modal |
| `rounded-xl` | 12px | Modal header, image container |
| `rounded-2xl` | 16px | Large card, drawer |
| `rounded-full` | 9999px | Avatar, pill badge |

### 12.5 Shadows

**File:** `src/theme/shadows.ts`

Shadow semantik (nama = konteks, bukan ukuran):

| Tailwind class | Kegunaan |
|---|---|
| `shadow-card` | Card dan panel konten |
| `shadow-dropdown` | Dropdown menu, select |
| `shadow-dialog` | Modal dan dialog |
| `shadow-popover` | Popover, tooltip besar |
| `shadow-tooltip` | Tooltip kecil |

### 12.6 Spacing

**File:** `src/theme/spacing.ts`

Mengikuti konvensi Tailwind default (4px base unit). Tidak perlu konfigurasi tambahan.
Gunakan Tailwind class standard: `p-4` (16px), `gap-6` (24px), `mb-8` (32px), dll.

### 12.7 Dark Mode

- Dikelola oleh `next-themes` dengan `attribute="class"`
- `ThemeProvider` dipasang di root `layout.tsx`
- Class `.dark` di-toggle pada `<html>` saat mode gelap aktif
- CSS variables di `.dark` block (theme.css) otomatis override `:root`
- Seluruh komponen shadcn/ui mengikuti dark mode otomatis
- Toggle UI (button di sidebar) dibuat di Tahap 2B Layout

### 12.8 Cara Penggunaan di Komponen

```tsx
// ✅ BENAR — gunakan token Tailwind
<div className="bg-card text-foreground border border-border rounded-lg shadow-card">
  <h2 className="text-xl font-semibold text-foreground">Judul</h2>
  <p className="text-sm text-muted-foreground">Deskripsi</p>
  <span className="text-success font-medium">Berhasil</span>
</div>

// ❌ SALAH — jangan hardcode warna
<div className="bg-white text-gray-900 border border-gray-200" style={{ color: '#111827' }}>
```

### 12.9 Cara Menambahkan Token Baru

**Menambahkan warna baru:**
1. Tambahkan CSS variable di `src/styles/theme.css` (`:root` dan `.dark`)
2. Tambahkan mapping di `src/app/globals.css` (`@theme inline`)
3. Update `src/theme/colors.ts` untuk TypeScript reference

**Menambahkan typography baru:**
1. Tambahkan entry di `textStyles` pada `src/theme/typography.ts`
2. Dokument Tailwind equivalent-nya di komentar di bawahnya

**Menambahkan semantic token baru:**
Sama dengan prosedur warna baru di atas. Gunakan naming yang deskriptif: `--feedback-positive`, `--badge-new`, dll.

**Mengganti branding (future):**
1. Ubah `--primary` di `src/styles/theme.css` (:root dan .dark)
2. Ubah `palette.primary` di `src/theme/colors.ts`
3. Tidak perlu menyentuh satupun komponen — semuanya akan ikut berubah.

---

## 13. ADR — Architecture Decision Records

### ADR-001: Design System Foundation

**Status:** Accepted | **Tanggal:** 8 Juli 2026

**Konteks:** Aplikasi membutuhkan visual language yang konsisten seperti yang ada di Flutter app (ThemeExtension). Tanpa design system, warna, radius, dan typography akan inconsistent antar developer dan antar fitur.

**Keputusan:** Buat design system berbasis CSS Variables sebagai sumber kebenaran tunggal, dengan TypeScript mirror untuk referensi developer. Tailwind utility classes menjadi interface ke token di komponen.

**Konsekuensi:**
- ✅ Seluruh komponen shadcn/ui otomatis mengikuti tema tanpa modifikasi
- ✅ Dark mode berfungsi dengan CSS cascade, tanpa logic JS di komponen
- ✅ Branding bisa diganti dari satu file (`theme.css`)
- ⚠️ Developer harus disiplin menggunakan Tailwind class, bukan hardcode hex

---

### ADR-002: CSS Variables sebagai Sumber Kebenaran

**Status:** Accepted | **Tanggal:** 8 Juli 2026

**Konteks:** Tailwind v4 mendukung CSS variables via `@theme inline`. shadcn/ui juga menggunakan CSS variables dengan naming convention spesifik (`--primary`, `--foreground`, dll).

**Keputusan:** Semua warna didefinisikan sebagai CSS custom properties di `src/styles/theme.css`, lalu dipetakan ke Tailwind utility class melalui `@theme inline` di `globals.css`. File TypeScript (`src/theme/colors.ts`) adalah mirror dokumentasi, bukan sumber kebenaran.

**Konsekuensi:**
- ✅ shadcn/ui component langsung kompatibel (naming convention selaras)
- ✅ Opacity modifier Tailwind (`bg-primary/50`) bekerja via `color-mix()`
- ✅ CSS variables bisa diinspect langsung di DevTools browser
- ⚠️ Harus menjaga sinkronisasi manual antara theme.css dan colors.ts

---

### ADR-003: Theme Management dengan next-themes

**Status:** Accepted | **Tanggal:** 8 Juli 2026

**Konteks:** Perlu dark/light mode yang persist dan menghormati system preference.

**Keputusan:** Gunakan `next-themes` dengan `attribute="class"` dan `defaultTheme="system"`. ThemeProvider dipasang di root layout. Dark mode diimplementasikan via `.dark` class pada `<html>`.

**Konsekuensi:**
- ✅ System preference dihormati secara default
- ✅ User preference di-persist via localStorage
- ✅ `suppressHydrationWarning` mencegah hydration mismatch
- ✅ Tailwind `dark:` variant bekerja via `@custom-variant dark (&:is(.dark *))`
- ⚠️ Toggle button perlu dibuat manual di UI sidebar (Tahap 2B)

---

### ADR-004: Typography Standard — Inter Only

**Status:** Accepted | **Tanggal:** 8 Juli 2026

**Konteks:** Perlu tipografi yang bersih dan profesional, konsisten di seluruh aplikasi.

**Keputusan:** Gunakan satu font saja: **Inter** via `next/font/google`. Skala tipografi semantik (Display/Heading/Title/Body/Caption/Label) terdokumentasi di `src/theme/typography.ts` beserta Tailwind class equivalentnya.

**Konsekuensi:**
- ✅ Satu font = ukuran bundle lebih kecil, tidak ada FOUT
- ✅ Inter excellent untuk UI/dashboard (readability tinggi)
- ✅ Skala tipografi semantik konsisten dengan Flutter TextTheme
- ⚠️ Tidak ada font berbeda untuk heading — konsistensi dijaga via font-weight

---

### ADR-005: Color Token Strategy

**Status:** Accepted | **Tanggal:** 8 Juli 2026

**Konteks:** shadcn/ui menggunakan CSS variable naming convention spesifik. Perlu menambahkan semantic token tambahan (success, warning, error, info) tanpa merusak kompatibilitas shadcn.

**Keputusan:**
- Ikuti shadcn naming convention untuk token inti (`--primary`, `--foreground`, `--card`, `--border`, dll)
- Tambahkan semantic token baru (`--success`, `--warning`, `--error`, `--info`) sebagai ekstensi
- Tambahkan `--surface` dan `--surface-foreground` sebagai alias dari `--card` untuk semantic clarity
- `--card` dan `--popover` di-alias ke `var(--surface)` sehingga surface menjadi satu titik kontrol

**Konsekuensi:**
- ✅ Semua komponen shadcn otomatis menggunakan token baru
- ✅ Semantic token status (`bg-success`, `text-error`) tersedia tanpa konfigurasi tambahan
- ✅ Ganti surface color = ganti card + popover sekaligus
- ⚠️ Harus mendaftarkan token baru di 3 tempat: theme.css, globals.css (@theme inline), colors.ts