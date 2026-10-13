
const STORAGE_KEYS = {
  GAS_URL: 'srkit_gas_api_url',
  MODE: 'srkit_api_mode', // 'live' atau 'mock'
  PATIENTS: 'srkit_mock_patients',
  LOGS: 'srkit_mock_logs',
  USER: 'srkit_current_user'
};

// Data Awal Mock Pasien
const DEFAULT_PATIENTS = [
  {
    id: 'PST-101',
    name: 'Budi Santoso',
    age: 58,
    gender: 'Laki-laki',
    strokeCategory: 'Sedang',
    doctorInCharge: 'dr. Farhan Malik, Sp.S',
    exerciseStatus: 'Aktif',
    targetRom: 85,
    createdAt: '2026-10-01T08:00:00Z'
  },
  {
    id: 'PST-102',
    name: 'Siti Aminah',
    age: 64,
    gender: 'Perempuan',
    strokeCategory: 'Ringan',
    doctorInCharge: 'dr. Farhan Malik, Sp.S',
    exerciseStatus: 'Aktif',
    targetRom: 90,
    createdAt: '2026-10-02T09:30:00Z'
  },
  {
    id: 'PST-103',
    name: 'Hartono Wijaya',
    age: 52,
    gender: 'Laki-laki',
    strokeCategory: 'Berat',
    doctorInCharge: 'dr. Farhan Malik, Sp.S',
    exerciseStatus: 'Istirahat',
    targetRom: 70,
    createdAt: '2026-10-03T11:15:00Z'
  },
  {
    id: 'PST-104',
    name: 'Ratna Dewi',
    age: 61,
    gender: 'Perempuan',
    strokeCategory: 'Sedang',
    doctorInCharge: 'dr. Farhan Malik, Sp.S',
    exerciseStatus: 'Aktif',
    targetRom: 80,
    createdAt: '2026-10-04T14:00:00Z'
  },
  {
    id: 'PST-105',
    name: 'Agus Prasetyo',
    age: 49,
    gender: 'Laki-laki',
    strokeCategory: 'Ringan',
    doctorInCharge: 'dr. Farhan Malik, Sp.S',
    exerciseStatus: 'Aktif',
    targetRom: 95,
    createdAt: '2026-10-05T10:00:00Z'
  },
  {
    id: 'PST-106',
    name: 'Hendra Gunawan',
    age: 67,
    gender: 'Laki-laki',
    strokeCategory: 'Berat',
    doctorInCharge: 'dr. Farhan Malik, Sp.S',
    exerciseStatus: 'Aktif',
    targetRom: 75,
    createdAt: '2026-10-06T13:45:00Z'
  }
];

// Data Awal Mock Riwayat Latihan (7 sesi per pasien)
const DEFAULT_LOGS = [
  // Pasien PST-101 (Budi Santoso) - 7 Hari Terakhir
  { id: 'LOG-1001', patientId: 'PST-101', date: '2026-10-04', session: 'Pagi', durationMinutes: 20, romPercentage: 55, notes: 'Latihan fleksi siku dan pergelangan tangan.', recordedBy: 'Ns. Siti Rahayu, S.Kep' },
  { id: 'LOG-1002', patientId: 'PST-101', date: '2026-10-05', session: 'Sore', durationMinutes: 25, romPercentage: 60, notes: 'Kekuatan genggaman jari mulai meningkat.', recordedBy: 'dr. Farhan Malik, Sp.S' },
  { id: 'LOG-1003', patientId: 'PST-101', date: '2026-10-06', session: 'Pagi', durationMinutes: 25, romPercentage: 65, notes: 'Respon sensorik motorik membaik.', recordedBy: 'Ns. Siti Rahayu, S.Kep' },
  { id: 'LOG-1004', patientId: 'PST-101', date: '2026-10-07', session: 'Siang', durationMinutes: 30, romPercentage: 70, notes: 'ROM ekstensi bertambah 5 derajat.', recordedBy: 'Ns. Siti Rahayu, S.Kep' },
  { id: 'LOG-1005', patientId: 'PST-101', date: '2026-10-08', session: 'Pagi', durationMinutes: 30, romPercentage: 72, notes: 'Pasien tidak mengeluhkan kelelahan berlebih.', recordedBy: 'dr. Farhan Malik, Sp.S' },
  { id: 'LOG-1006', patientId: 'PST-101', date: '2026-10-09', session: 'Sore', durationMinutes: 35, romPercentage: 78, notes: 'Latihan koordinasi jemari dengan kit.', recordedBy: 'Ns. Siti Rahayu, S.Kep' },
  { id: 'LOG-1007', patientId: 'PST-101', date: '2026-10-10', session: 'Pagi', durationMinutes: 35, romPercentage: 82, notes: 'Mencapai target sesi mingguan dengan sangat baik.', recordedBy: 'dr. Farhan Malik, Sp.S' },

  // Pasien PST-102 (Siti Aminah)
  { id: 'LOG-2001', patientId: 'PST-102', date: '2026-10-05', session: 'Pagi', durationMinutes: 25, romPercentage: 70, notes: 'Ekstensi pergelangan tangan lancar.', recordedBy: 'dr. Farhan Malik, Sp.S' },
  { id: 'LOG-2002', patientId: 'PST-102', date: '2026-10-07', session: 'Sore', durationMinutes: 30, romPercentage: 78, notes: 'Gerakan memegang balok kit stabil.', recordedBy: 'Ns. Siti Rahayu, S.Kep' },
  { id: 'LOG-2003', patientId: 'PST-102', date: '2026-10-09', session: 'Pagi', durationMinutes: 35, romPercentage: 86, notes: 'ROM mendekati ambang normal.', recordedBy: 'Ns. Siti Rahayu, S.Kep' },

  // Pasien PST-103 (Hartono Wijaya)
  { id: 'LOG-3001', patientId: 'PST-103', date: '2026-10-06', session: 'Pagi', durationMinutes: 15, romPercentage: 35, notes: 'Latihan pasif terbimbing kit asistif.', recordedBy: 'dr. Farhan Malik, Sp.S' },
  { id: 'LOG-3002', patientId: 'PST-103', date: '2026-10-08', session: 'Pagi', durationMinutes: 20, romPercentage: 42, notes: 'Mulai timbul kontraksi otot sadar.', recordedBy: 'Ns. Siti Rahayu, S.Kep' }
];

// Akun Demo Tenaga Medis
const DEMO_USERS = [
  {
    id: 'USR-001',
    name: 'dr. Farhan Malik, Sp.S',
    email: 'dokter@srkit.med',
    password: 'dokter123',
    role: 'Dokter (Sp.S)',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150'
  },
  {
    id: 'USR-002',
    name: 'Ns. Siti Rahayu, S.Kep',
    email: 'perawat@srkit.med',
    password: 'perawat123',
    role: 'Perawat',
    avatar: 'https://images.unsplash.com/photo-1594824813583-7c9b0e95ffcf?w=150'
  }
];

/**
 * Inisialisasi Mock Data di LocalStorage jika belum ada
 */
function initLocalStorageMock() {
  if (!localStorage.getItem(STORAGE_KEYS.PATIENTS)) {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(DEFAULT_PATIENTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.LOGS)) {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(DEFAULT_LOGS));
  }
}

initLocalStorageMock();

// Default Endpoint Google Apps Script (Kosongkan secara default agar URL database tidak terekspos di repo publik. Masukkan URL melalui modal pengaturan di UI aplikasi)
const DEFAULT_GAS_URL = '';

/**
 * Objek Service API SR Kit
 */
const api = {
  /**
   * Mengambil URL Google Apps Script yang tersimpan
   */
  getEndpointUrl() {
    const saved = localStorage.getItem(STORAGE_KEYS.GAS_URL);
    if (saved !== null && saved !== undefined) {
      return saved;
    }
    return DEFAULT_GAS_URL;
  },

  /**
   * Menyimpan URL Google Apps Script baru
   */
  setEndpointUrl(url) {
    if (url) {
      localStorage.setItem(STORAGE_KEYS.GAS_URL, url.trim());
      localStorage.setItem(STORAGE_KEYS.MODE, 'live');
    } else {
      localStorage.removeItem(STORAGE_KEYS.GAS_URL);
      localStorage.setItem(STORAGE_KEYS.MODE, 'mock');
    }
  },

  /**
   * Cek apakah sedang dalam Live API mode atau Mock mode
   */
  isLiveMode() {
    return !!this.getEndpointUrl() && localStorage.getItem(STORAGE_KEYS.MODE) !== 'mock';
  },

  /**
   * Ubah mode operasi (live / mock)
   */
  setMode(mode) {
    localStorage.setItem(STORAGE_KEYS.MODE, mode);
  },

  /**
   * Helper request universal: fetch ke GAS Web App
   * Menggunakan query string GET untuk komunikasi bebas blokir CORS Google
   */
  async request(action, method = 'GET', data = null) {
    const endpoint = this.getEndpointUrl();
    if (!endpoint || !this.isLiveMode()) {
      return null; // Arahkan ke fallback mock
    }

    try {
      const query = new URLSearchParams({ action, ...(data || {}) }).toString();
      const url = `${endpoint}?${query}`;
      const response = await fetch(url, {
        method: 'GET',
        redirect: 'follow'
      });
      return await response.json();
    } catch (err) {
      console.warn(`[SR-KIT API] Request live gagal, beralih ke local fallback:`, err);
      return null;
    }
  },

  /**
   * 1. Autentikasi Pengguna
   */
  async login(email, password) {
    // Coba ke Live API terlebih dahulu jika URL tersedia
    if (this.isLiveMode()) {
      const res = await this.request('login', 'GET', { email, password });
      if (res && res.success) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(res.user));
        return { success: true, user: res.user, isLive: true };
      }
    }

    // Fallback Mock Login
    const user = DEMO_USERS.find(
      u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );

    if (user) {
      const sanitizedUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(sanitizedUser));
      return { success: true, user: sanitizedUser, isMock: true };
    }

    return {
      success: false,
      message: 'Email atau kata sandi tidak sesuai. Silakan gunakan tombol Demo Login.'
    };
  },

  /**
   * 2. Mendapatkan Akun Login yang Aktif
   */
  getCurrentUser() {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    return saved ? JSON.parse(saved) : null;
  },

  /**
   * 3. Logout
   */
  logout() {
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  /**
   * 4. Mengambil Daftar Semua Pasien
   */
  async getPatients() {
    if (this.isLiveMode()) {
      const res = await this.request('getPatients', 'GET');
      if (res && res.success && Array.isArray(res.data)) {
        return res.data;
      }
    }

    // Mock Data dari LocalStorage
    const stored = localStorage.getItem(STORAGE_KEYS.PATIENTS);
    return stored ? JSON.parse(stored) : DEFAULT_PATIENTS;
  },

  /**
   * 5. Mendaftarkan Pasien Baru
   */
  async addPatient(patientData) {
    if (this.isLiveMode()) {
      const res = await this.request('addPatient', 'GET', patientData);
      if (res && res.success) {
        return res.data;
      }
    }

    // Mock Insert ke LocalStorage
    const list = await this.getPatients();
    const newId = `PST-${100 + list.length + 1}`;
    const newPatient = {
      id: newId,
      name: patientData.name,
      age: Number(patientData.age),
      gender: patientData.gender || 'Laki-laki',
      strokeCategory: patientData.strokeCategory || 'Ringan',
      doctorInCharge: patientData.doctorInCharge || 'dr. Farhan Malik, Sp.S',
      exerciseStatus: patientData.exerciseStatus || 'Aktif',
      targetRom: Number(patientData.targetRom) || 85,
      createdAt: new Date().toISOString()
    };

    list.unshift(newPatient);
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(list));
    return newPatient;
  },

  /**
   * 6. Mengambil Riwayat Latihan Pasien
   */
  async getDailyLogs(patientId) {
    if (this.isLiveMode()) {
      const res = await this.request('getDailyLogs', 'GET', { patientId });
      if (res && res.success && Array.isArray(res.data)) {
        return res.data;
      }
    }

    // Mock Logs dari LocalStorage
    const storedLogs = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOGS) || '[]');
    const filtered = storedLogs
      .filter(l => String(l.patientId) === String(patientId))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    return filtered;
  },

  /**
   * 7. Menyimpan Rekap Latihan Harian Baru
   */
  async addDailyLog(logData) {
    if (this.isLiveMode()) {
      const res = await this.request('addDailyLog', 'GET', logData);
      if (res && res.success) {
        return res.data;
      }
    }

    // Mock Insert Daily Log
    const storedLogs = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOGS) || '[]');
    const newLog = {
      id: `LOG-${1000 + storedLogs.length + 1}`,
      patientId: logData.patientId,
      date: logData.date || new Date().toISOString().split('T')[0],
      session: logData.session || 'Pagi',
      durationMinutes: Number(logData.durationMinutes) || 0,
      romPercentage: Number(logData.romPercentage) || 0,
      notes: logData.notes || '',
      recordedBy: logData.recordedBy || 'Tenaga Medis',
      createdAt: new Date().toISOString()
    };

    storedLogs.push(newLog);
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(storedLogs));
    return newLog;
  },

  /**
   * 8. Tes Koneksi ke Google Apps Script Web App
   */
  async testConnection(url) {
    if (!url) return { success: false, message: 'URL tidak boleh kosong.' };
    try {
      const pingUrl = `${url.trim()}?action=ping`;
      const response = await fetch(pingUrl, {
        method: 'GET',
        redirect: 'follow'
      });
      const data = await response.json();
      return { success: !!data.success, message: data.message || 'Koneksi berhasil.' };
    } catch (e) {
      return {
        success: false,
        message: 'Gagal terhubung ke URL Google Apps Script. Pastikan Web App di-deploy dengan akses "Anyone".'
      };
    }
  },

  /**
   * 9. Reset Demo Data ke Pengaturan Default
   */
  resetDemoData() {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(DEFAULT_PATIENTS));
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(DEFAULT_LOGS));
  }
};

// Export ke window scope untuk Vue SPA
window.srKitApi = api;
window.DEMO_USERS = DEMO_USERS;
