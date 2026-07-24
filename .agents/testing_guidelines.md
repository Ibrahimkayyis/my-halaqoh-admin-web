# Panduan & Aturan Standar Automated Testing (Vitest & Playwright)

Dokumen ini berisi fondasi arsitektur, konvensi folder, serta aturan wajib dalam membuat dan menjalankan **Automated Testing** di project `halaqoh-admin-web`. Seluruh AI Agent dan developer wajib mematuhi standar ini saat menambahkan pengujian untuk fitur baru atau melakukan refactoring.

---

## 1. Stack & Arsitektur Testing

| Lapisan Pengujian | Framework / Library | Tujuan Utama |
|---|---|---|
| **Unit & Integration** | **Vitest** + **React Testing Library (RTL)** + **jsdom** | Pengujian logika murni (utilities), skema validasi Zod, store state, hook, serta komponen UI & dialog modal. |
| **Firestore Security Rules** | **`@firebase/rules-unit-testing`** + **Firestore Emulator** | Pengujian aturan otorisasi Firestore (`firestore.rules`) untuk memastikan akses Admin vs Non-Admin. |
| **End-to-End (E2E)** | **Playwright (`@playwright/test`)** + **Firebase Emulator Suite** | Pengujian alur pengguna nyata secara otomatis di browser Chromium/Firefox (login, navigasi, ganti bahasa live, wizard). |

---

## 2. Konvensi Struktur Folder & Penamaan File Test

Setiap file test diletakkan di dalam folder `__tests__` bersebelahan dengan file sumber kodenya:

```text
src/features/<nama-fitur>/
├── actions/
│   ├── <fitur>.actions.ts
│   └── __tests__/
│       └── <fitur>.actions.test.ts        # Unit test untuk async actions & business logic
├── components/
│   ├── <komponen>.tsx
│   └── __tests__/
│       └── <komponen>.test.tsx            # Component & integration test (RTL)
├── schemas/
│   ├── <fitur>.schema.ts
│   └── __tests__/
│       └── <fitur>.schema.test.ts         # Unit test validasi Zod schema
└── utils/
    ├── <fitur>.utils.ts
    └── __tests__/
        └── <fitur>.utils.test.ts          # Unit test pure domain functions
```

- **File Utilitas & Helper Global**: `src/lib/utils/__tests__/<nama-util>.test.ts`
- **File Test E2E**: `e2e/<nama-alur>.spec.ts`

---

## 3. Aturan Wajib Saat Membuat & Menjalankan Test

### Aturan 1: Wajib Menggunakan `renderWithProviders()` untuk Komponen React
**JANGAN PERNAH** memanggil `render(<Component />)` langsung dari `@testing-library/react`. Selalu import `renderWithProviders` dari `@/test/test-utils` untuk menghindari error `"No QueryClient set"` dan masalah i18n hydration:

```tsx
import { renderWithProviders, screen } from "@/test/test-utils";

renderWithProviders(<MyFeatureComponent />);
```

### Aturan 2: Pengujian Navigasi Router
Untuk menguji pengalihan halaman (`router.push` atau `router.replace`), gunakan `mockRouter` yang diekspor dari `vitest.setup.ts`:

```tsx
import { mockRouter } from "../../../../../vitest.setup";

expect(mockRouter.replace).toHaveBeenCalledWith("/login");
```

### Aturan 3: Mocking Layanan Firebase pada Unit & Component Test
Unit test dan component test (Vitest) **TIDAK BOLEH** melakukan request jaringan langsung ke Firebase produksi. Selalu gunakan `vi.mock()` untuk membungkus fungsi Firebase Auth/Firestore:

```tsx
vi.mock("@/lib/firebase/auth", () => ({
  signInWithIdentifier: vi.fn(),
  signOutUser: vi.fn(),
}));

vi.mock("@/lib/firestore/queries/user.queries", () => ({
  getUserDoc: vi.fn(),
}));
```

### Aturan 4: Isolatasi State & Reset Otomatis (`afterEach`)
`vitest.setup.ts` sudah mengonfigurasi `afterEach` untuk me-reset mock (`vi.clearAllMocks()`) dan Zustand Store secara otomatis:

```ts
afterEach(() => {
  vi.clearAllMocks();
  useAuthStore.setState({ user: null, status: "unauthenticated", errorMessage: null });
  // Tambahkan reset store fitur lain jika ada module-level global state
});
```

### Aturan 5: Ekstraksi Pure Domain Logic
Logika bisnis yang rumit (contoh: kalkulasi kenaikan kelas & alumni, parsing file CSV/Excel, format penomoran) **HARUS DIEKSTRAKSI** menjadi *pure function* di folder `utils/` atau `helpers/`, sehingga dapat diuji secara terpisah tanpa perlu merender komponen UI yang kompleks.

### Aturan 6: Pencarian Teks UI yang Ramah Multi-Language (i18n)
Saat melakukan pencarian tombol atau label di UI, gunakan RegEx yang fleksibel terhadap Bahasa Indonesia maupun Bahasa Inggris (ID & EN):

```tsx
expect(screen.getByRole("button", { name: /Log In|Masuk|Sign In/i })).toBeInTheDocument();
```

---

## 4. Perintah Eksekusi Testing

```bash
# Menjalankan seluruh Unit & Component Test Suite sekali jalan
npm run test

# Menjalankan Vitest dalam mode watch (interaktif saat development)
npm run test:watch

# Menjalankan E2E Playwright Tests (setelah Firebase Emulator aktif)
npx playwright test
```

---

## 5. Checklist Verifikasi Sebelum Push / Merge
- [ ] `npm run test` berjalan 100% HIJAU (0 failed test).
- [ ] `npx tsc --noEmit` tidak menghasilkan error TypeScript.
- [ ] `npm run build` berhasil mengompilasi seluruh halaman tanpa error.
