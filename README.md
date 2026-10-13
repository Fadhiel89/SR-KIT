# 🏥 SR-KIT (Stroke Rehabilitation Kit)

Sistem Web Application untuk monitoring, evaluasi, dan visualisasi data pemulihan pasien stroke berbasis web modern yang terintegrasi dengan Google Sheets sebagai basis data dan Google Apps Script sebagai REST API.

---

## 📁 Struktur Direktori Repositori

```text
SR-KIT/
│
├── .gitignore
├── README.md
│
└── sr-kit-app/
    ├── README.md
    │
    ├── frontend/
    │   ├── index.html           # File HTML utama (Vue 3, Tailwind CSS, Chart.js, FontAwesome)
    │   ├── app.js               # Logic Vue 3 Composition API (State, Dashboard, Chart.js, CRUD)
    │   ├── api.js               # Service layer fetch() ke Google Apps Script + Fallback Mock
    │   ├── style.css            # Custom CSS medis & Glassmorphism
    │   └── components/          # Komponen modular Vue SFC
    │       ├── Login.vue        # Halaman Login
    │       ├── Dashboard.vue    # Dashboard Utama
    │       └── PatientModal.vue # Modal Rekap Harian & Visualisasi Grafik
    │
    └── backend/
        ├── Code.gs              # REST API Router Google Apps Script (doGet, doPost, CORS)
        └── DatabaseUtils.gs     # Helper CRUD Google Sheets & Inisialisasi otomatis tabel
```

---

## 🚀 Fitur Utama

1. **Autentikasi Medis & Role Access**:
   - Dukungan Role: **Dokter (Sp.S)** dan **Perawat**.
   - Demo login instan untuk pengujian cepat.

2. **Dashboard Monitoring Pasien**:
   - Ringkasan metrik statistik (Total Pasien, Stroke Ringan, Sedang, Berat).
   - Indikator status sensor kit aktif.
   - Pencarian instan dan filter kategori.
   - Pendaftaran pasien baru.

3. **Visualisasi Grafik Evaluasi (Chart.js)**:
   - Grafik interaktif dual-axis: **Durasi Latihan (Menit)** vs **Capaian ROM (%)**.
   - Input rekap latihan harian langsung tersinkronisasi.
   - Cetak laporan evaluasi (*Print Report*).

4. **Konektivitas Google Sheets**:
   - Dapat berjalan secara offline/lokal dengan data mock di browser LocalStorage.
   - Dapat dihubungkan langsung ke Google Sheets melalui Google Apps Script Web App.

---

## 🔑 Akun Demo (Default)

| Peran | Email | Password |
|---|---|---|
| **Dokter (Sp.S)** | `dokter@srkit.med` | `dokter123` |
| **Perawat** | `perawat@srkit.med` | `perawat123` |

---

## 🛠️ Panduan Menghubungkan Google Sheets (Database)

1. Buat Google Sheets baru di [Google Sheets](https://sheets.new).
2. Buka menu **Ekstensi (Extensions)** > **Apps Script**.
3. Masukkan kode dari `sr-kit-app/backend/DatabaseUtils.gs` dan `sr-kit-app/backend/Code.gs`.
4. Klik **Deploy** > **New deployment** > pilih jenis **Web app**.
   - *Execute as*: `Me` (Email Anda)
   - *Who has access*: `Anyone`
5. Salin URL Web App (`/exec`) yang didapatkan.
6. Buka aplikasi web di browser, klik tombol **Pengaturan (Ikon Gir)** di pojok kanan atas, lalu tempelkan URL tersebut.

---

## 💻 Cara Menjalankan

Cukup buka `sr-kit-app/frontend/index.html` di browser Anda, atau jalankan menggunakan local server:

```bash
npx serve sr-kit-app/frontend
# atau
python -m http.server 8000 --directory sr-kit-app/frontend
```
Buka browser pada alamat `http://localhost:8000`.
