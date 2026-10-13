# 🏥 SR Kit (Stroke Rehabilitation Kit) Web Application

Aplikasi sistem monitoring, evaluasi, dan visualisasi data rehabilitasi pasien stroke berbasis web modern yang terintegrasi dengan Google Sheets sebagai basis data dan Google Apps Script sebagai REST API.

---

## 📁 Struktur Direktori Proyek

```text
/sr-kit-app
│
├── /frontend
│   ├── index.html           # File HTML utama (Integrasi CDN Vue 3, Tailwind CSS, Chart.js, FontAwesome)
│   ├── app.js               # Logic Vue 3 Composition API (State, Dashboard, Chart.js, CRUD, Toast)
│   ├── api.js               # Service layer fetch() ke Google Apps Script + Fallback Local Mock Data
│   ├── style.css            # Custom CSS estetika medis, Glassmorphism, animasi & scrollbar
│   └── /components          # Komponen modular Vue SFC (Single File Components)
│       ├── Login.vue        # Komponen Halaman Login
│       ├── Dashboard.vue    # Komponen Dashboard Utama
│       └── PatientModal.vue # Modal Rekap Harian & Visualisasi Grafik
│
└── /backend
    ├── Code.gs              # REST API Router Google Apps Script (doGet, doPost, CORS, JSON output)
    └── DatabaseUtils.gs     # Helper CRUD Google Sheets & Inisialisasi otomatis tabel + data demo
```

---

## 🚀 Fitur Unggulan

1. **Halaman Autentikasi Medis (Login)**:
   - Desain modern bernuansa klinis higienis (*clean slate, sky blue, medical teal*).
   - Dukungan Role: **Dokter (Sp.S)** dan **Perawat**.
   - Tombol **Demo Login Cepat** (1-klik langsung masuk tanpa mengetik).

2. **Dashboard Monitoring & Statistik**:
   - Kartu ringkasan metrik:
     - Total Pasien
     - Pasien Stroke Ringan (aksen hijau/emerald)
     - Pasien Stroke Sedang (aksen kuning/amber)
     - Pasien Stroke Berat (aksen merah/rose)
   - Tabel Daftar Pasien lengkap dengan indikator status latihan aktif (*pulse sensor*).
   - Fitur pencarian instan berdasarkan Nama, ID Pasien, atau DPJP.
   - Filter cepat berdasarkan Kategori Tingkat Keparahan Stroke.
   - Fitur Pendaftaran Pasien Baru.

3. **Modal Rekap Harian & Visualisasi Grafik (Chart.js)**:
   - Profil klinis singkat pasien & target capaian Range of Motion (ROM).
   - **Grafik Interaktif Dual-Axis**:
     - *Bar Chart*: Durasi Latihan Harian (Menit) - Sumbu Y Kiri
     - *Line Chart*: Capaian Range of Motion (%) - Sumbu Y Kanan
   - Form input rekap harian (Tanggal, Durasi, ROM %, Sesi Pagi/Siang/Sore, Catatan Evaluasi).
   - Tabel riwayat latihan harian lengkap dengan progress bar.
   - Fitur cetak/ekspor ringkasan rekap medis (*Print Report*).

4. **Konektivitas Fleksibel**:
   - **Mode Demo Lokal**: Aplikasi langsung aktif dan dapat diuji sepenuhnya dengan data tersimpan di LocalStorage browser tanpa setup server.
   - **Mode Live REST API**: Hubungkan URL Google Apps Script Web App untuk otomatis tersinkronisasi dua arah ke Google Sheets.

---

## 🔑 Akun Demo (Default Credentials)

| Peran (Role) | Email | Password |
|---|---|---|
| **Dokter (Sp.S)** | `dokter@srkit.med` | `dokter123` |
| **Perawat** | `perawat@srkit.med` | `perawat123` |

*Catatan: Anda juga dapat langsung mengklik tombol **Demo Dokter (Sp.S)** atau **Demo Perawat** pada halaman login.*

---

## 🛠️ Panduan Integrasi Google Sheets & Google Apps Script (Backend)

Ikuti langkah mudah berikut untuk menghubungkan basis data ke Google Drive Anda:

1. Buat spreadsheet baru di [Google Sheets](https://sheets.new).
2. Beri nama spreadsheet, misalnya: `SR Kit Database`.
3. Buka menu **Ekstensi (Extensions)** > **Apps Script**.
4. Di editor Google Apps Script:
   - Buat file script baru bernama `DatabaseUtils.gs`, lalu salin seluruh isi dari `backend/DatabaseUtils.gs`.
   - Buka file `Code.gs`, lalu timpa dengan isi dari `backend/Code.gs`.
5. Klik ikon **Simpan (Save)** (ikon disket).
6. Lakukan Deployment Web App:
   - Klik tombol biru **Terapkan (Deploy)** di pojok kanan atas > **Deployment baru (New deployment)**.
   - Klik ikon gerigi (Pilih jenis) > pilih **Aplikasi web (Web app)**.
   - Isi konfigurasi:
     - **Deskripsi**: `SR Kit REST API v1.0`
     - **Jalankan sebagai (Execute as)**: `Saya (email@anda.com)`
     - **Siapa yang memiliki akses (Who has access)**: **`Siapa saja (Anyone)`** *(Sangat penting agar Frontend dapat melakukan request tanpa login akun Google)*.
   - Klik **Terapkan (Deploy)**.
   - Berikan izin akses Google saat diminta (*Review permissions* > *Advanced* > *Go to ... (unsafe)* > *Allow*).
7. Salin **URL Aplikasi Web (Web App URL)** yang berakhiran `/exec`.
8. Buka Frontend SR Kit di browser, klik tombol **Ikon Gir / Pengaturan (Konfigurasi API Endpoint)**, lalu tempel URL tersebut dan simpan. Database Google Sheets Anda akan otomatis membuat tabel `Users`, `Patients`, dan `DailyLogs` beserta data awal!

---

## 💻 Menjalankan Frontend

File frontend dibuat dengan arsitektur web modern yang sangat praktis:
- Cukup buka file `frontend/index.html` langsung di browser Anda (Chrome, Edge, Firefox, Safari).
- Atau jalankan menggunakan ekstensi **Live Server** di VS Code / Antigravity IDE, atau server lokal:
  ```bash
  npx serve frontend
  # atau
  python -m http.server 8000 --directory frontend
  ```
Buka browser pada alamat `http://localhost:8000`.
