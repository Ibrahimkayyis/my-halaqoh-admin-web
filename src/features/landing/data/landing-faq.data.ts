export interface FaqItem {
  question: string;
  answer: string;
}

export const landingFaqs: FaqItem[] = [
  {
    question: "Apa itu MyHalaqoh?",
    answer:
      "MyHalaqoh adalah aplikasi digital untuk mencatat presensi halaqoh dan perkembangan setoran hafalan Al-Qur'an santri. Aplikasi ini dirancang khusus untuk kebutuhan pondok pesantren dan menghubungkan guru, wali santri, serta manajemen pesantren dalam satu platform.",
  },
  {
    question: "Siapa saja yang bisa menggunakan MyHalaqoh?",
    answer:
      "MyHalaqoh memiliki tiga jenis pengguna: Guru/Asatidz yang mencatat presensi dan setoran hafalan, Wali Santri yang memantau perkembangan anak, serta Admin/Waka Tahfidz yang mengelola data pesantren melalui Web Admin.",
  },
  {
    question: "Bagaimana cara mengunduh dan menginstal aplikasinya?",
    answer:
      "Klik tombol 'Download Aplikasi Android' di halaman ini untuk mengunduh file APK langsung. Setelah terunduh, buka file APK, izinkan instalasi dari sumber tidak dikenal di pengaturan perangkat Anda, lalu ikuti langkah instalasi. Hubungi admin pesantren untuk mendapatkan akun login.",
  },
  {
    question: "Apakah aplikasi ini gratis?",
    answer:
      "Ya, MyHalaqoh disediakan secara gratis untuk seluruh civitas Pondok Pesantren Hidayatullah Luqman Al-Hakim. Tidak ada biaya berlangganan yang dikenakan kepada guru maupun wali santri.",
  },
  {
    question: "Bagaimana jika tidak ada koneksi internet di area pesantren?",
    answer:
      "MyHalaqoh dirancang dengan teknologi offline-first. Guru tetap dapat mencatat presensi dan setoran hafalan meskipun tanpa koneksi internet. Data akan tersinkronisasi secara otomatis ke server begitu koneksi tersedia kembali.",
  },
  {
    question: "Apa perbedaan antara aplikasi mobile dan Web Admin?",
    answer:
      "Aplikasi mobile digunakan oleh guru untuk mencatat presensi dan setoran hafalan sehari-hari, serta oleh wali santri untuk memantau perkembangan anak. Web Admin digunakan oleh staf administrasi dan Waka Tahfidz untuk mengelola data master santri, guru, struktur halaqoh, kurikulum, dan mencetak laporan.",
  },
];
