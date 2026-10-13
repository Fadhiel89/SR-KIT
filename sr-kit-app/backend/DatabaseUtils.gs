/**
 * ============================================================================
 * SR Kit (Stroke Rehabilitation Kit) - Database Utilities
 * Google Apps Script Helper untuk CRUD ke Google Sheets
 * ============================================================================
 * File ini menangani koneksi, inisialisasi sheet, mapping data,
 * dan operasi CRUD untuk tabel:
 * 1. Users      : Akun tenaga medis (Dokter Sp.S & Perawat)
 * 2. Patients   : Data pasien rehabilitasi stroke
 * 3. DailyLogs  : Riwayat latihan harian, durasi & capaian ROM
 */

// Konfigurasi Nama Sheet / Tabel
var SHEET_NAMES = {
  USERS: 'Users',
  PATIENTS: 'Patients',
  DAILY_LOGS: 'DailyLogs'
};

/**
 * Mendapatkan instance Spreadsheet aktif.
 * Jika script terikat langsung (container-bound), gunakan getActiveSpreadsheet().
 * Jika script mandiri (standalone), isi SPREADSHEET_ID pada Script Properties.
 */
function getDb() {
  var propId = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (propId) {
    return SpreadsheetApp.openById(propId);
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

/**
 * Inisialisasi Database: Membuat Sheet dan Kolom Header secara otomatis
 * jika belum ada, serta mengisi data awal (seed data) untuk demo.
 */
function initDatabase() {
  var ss = getDb();
  if (!ss) {
    throw new Error('Spreadsheet tidak ditemukan. Pastikan script terhubung dengan Google Sheets.');
  }

  // 1. Inisialisasi Tabel Users
  var userSheet = getOrCreateSheet(ss, SHEET_NAMES.USERS);
  if (userSheet.getLastRow() === 0) {
    var userHeaders = ['id', 'name', 'email', 'password', 'role', 'avatar', 'createdAt'];
    userSheet.appendRow(userHeaders);
    styleHeaderRow(userSheet);

    // Data Awal Tenaga Medis
    var seedUsers = [
      ['USR-001', 'dr. Farhan Malik, Sp.S', 'dokter@srkit.med', 'dokter123', 'Dokter (Sp.S)', 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150', new Date().toISOString()],
      ['USR-002', 'Ns. Siti Rahayu, S.Kep', 'perawat@srkit.med', 'perawat123', 'Perawat', 'https://images.unsplash.com/photo-1594824813583-7c9b0e95ffcf?w=150', new Date().toISOString()]
    ];
    seedUsers.forEach(function(row) { userSheet.appendRow(row); });
  }

  // 2. Inisialisasi Tabel Patients
  var patientSheet = getOrCreateSheet(ss, SHEET_NAMES.PATIENTS);
  if (patientSheet.getLastRow() === 0) {
    var patientHeaders = ['id', 'name', 'age', 'gender', 'strokeCategory', 'doctorInCharge', 'exerciseStatus', 'targetRom', 'createdAt'];
    patientSheet.appendRow(patientHeaders);
    styleHeaderRow(patientSheet);

    // Data Awal Pasien (Kategori Ringan, Sedang, dan Berat)
    var seedPatients = [
      ['PST-101', 'Budi Santoso', 58, 'Laki-laki', 'Sedang', 'dr. Farhan Malik, Sp.S', 'Aktif', 85, new Date().toISOString()],
      ['PST-102', 'Siti Aminah', 64, 'Perempuan', 'Ringan', 'dr. Farhan Malik, Sp.S', 'Aktif', 90, new Date().toISOString()],
      ['PST-103', 'Hartono Wijaya', 52, 'Laki-laki', 'Berat', 'dr. Farhan Malik, Sp.S', 'Istirahat', 70, new Date().toISOString()],
      ['PST-104', 'Ratna Dewi', 61, 'Perempuan', 'Sedang', 'dr. Farhan Malik, Sp.S', 'Aktif', 80, new Date().toISOString()],
      ['PST-105', 'Agus Prasetyo', 49, 'Laki-laki', 'Ringan', 'dr. Farhan Malik, Sp.S', 'Aktif', 95, new Date().toISOString()],
      ['PST-106', 'Hendra Gunawan', 67, 'Laki-laki', 'Berat', 'dr. Farhan Malik, Sp.S', 'Aktif', 75, new Date().toISOString()],
      ['PST-107', 'Sri Wahyuni', 55, 'Perempuan', 'Sedang', 'dr. Farhan Malik, Sp.S', 'Aktif', 85, new Date().toISOString()]
    ];
    seedPatients.forEach(function(row) { patientSheet.appendRow(row); });
  }

  // 3. Inisialisasi Tabel DailyLogs
  var logSheet = getOrCreateSheet(ss, SHEET_NAMES.DAILY_LOGS);
  if (logSheet.getLastRow() === 0) {
    var logHeaders = ['id', 'patientId', 'date', 'session', 'durationMinutes', 'romPercentage', 'notes', 'recordedBy', 'createdAt'];
    logSheet.appendRow(logHeaders);
    styleHeaderRow(logSheet);

    // Data Awal Latihan Harian Lengkap untuk Semua Pasien Demo
    var seedLogs = [
      // PST-101 (Budi Santoso - Sedang)
      ['LOG-1001', 'PST-101', '2026-10-04', 'Pagi', 20, 55, 'Latihan fleksi siku dan pergelangan tangan.', 'Ns. Siti Rahayu, S.Kep', new Date().toISOString()],
      ['LOG-1002', 'PST-101', '2026-10-05', 'Sore', 25, 60, 'Kekuatan genggaman jari mulai meningkat.', 'dr. Farhan Malik, Sp.S', new Date().toISOString()],
      ['LOG-1003', 'PST-101', '2026-10-06', 'Pagi', 25, 65, 'Respon sensorik motorik membaik.', 'Ns. Siti Rahayu, S.Kep', new Date().toISOString()],
      ['LOG-1004', 'PST-101', '2026-10-07', 'Siang', 30, 70, 'ROM ekstensi bertambah 5 derajat.', 'Ns. Siti Rahayu, S.Kep', new Date().toISOString()],
      ['LOG-1005', 'PST-101', '2026-10-08', 'Pagi', 30, 72, 'Pasien tidak mengeluhkan kelelahan berlebih.', 'dr. Farhan Malik, Sp.S', new Date().toISOString()],
      ['LOG-1006', 'PST-101', '2026-10-09', 'Sore', 35, 78, 'Latihan koordinasi jemari dengan kit.', 'Ns. Siti Rahayu, S.Kep', new Date().toISOString()],
      ['LOG-1007', 'PST-101', '2026-10-10', 'Pagi', 35, 82, 'Mencapai target sesi mingguan.', 'dr. Farhan Malik, Sp.S', new Date().toISOString()],

      // PST-102 (Siti Aminah - Ringan)
      ['LOG-1008', 'PST-102', '2026-10-04', 'Pagi', 25, 68, 'Latihan fleksi pergelangan tangan awal.', 'dr. Farhan Malik, Sp.S', new Date().toISOString()],
      ['LOG-1009', 'PST-102', '2026-10-05', 'Sore', 25, 72, 'Pasien mampu menggenggam sensor SR Kit dengan stabil.', 'Ns. Siti Rahayu, S.Kep', new Date().toISOString()],
      ['LOG-1010', 'PST-102', '2026-10-06', 'Pagi', 25, 75, 'ROM ekstensi siku bertambah 4 derajat.', 'dr. Farhan Malik, Sp.S', new Date().toISOString()],
      ['LOG-1011', 'PST-102', '2026-10-07', 'Siang', 30, 80, 'Kekuatan motorik jemari meningkat signifikan.', 'Ns. Siti Rahayu, S.Kep', new Date().toISOString()],
      ['LOG-1012', 'PST-102', '2026-10-08', 'Pagi', 30, 83, 'Tidak tampak spastisitas berat saat latihan.', 'dr. Farhan Malik, Sp.S', new Date().toISOString()],
      ['LOG-1013', 'PST-102', '2026-10-09', 'Sore', 35, 86, 'Koordinasi motorik halus sangat responsif.', 'Ns. Siti Rahayu, S.Kep', new Date().toISOString()],
      ['LOG-1014', 'PST-102', '2026-10-10', 'Pagi', 35, 89, 'Mendekati target pemulihan optimal 90%.', 'dr. Farhan Malik, Sp.S', new Date().toISOString()],

      // PST-103 (Hartono Wijaya - Berat)
      ['LOG-1015', 'PST-103', '2026-10-05', 'Pagi', 15, 30, 'Latihan pasif terbimbing dengan kit asistif.', 'dr. Farhan Malik, Sp.S', new Date().toISOString()],
      ['LOG-1016', 'PST-103', '2026-10-06', 'Pagi', 15, 35, 'Stimulasi sensorik taktil dan proprioseptif.', 'Ns. Siti Rahayu, S.Kep', new Date().toISOString()],
      ['LOG-1017', 'PST-103', '2026-10-07', 'Sore', 20, 40, 'Mulai ada kontraksi sadar pada otot bisep.', 'dr. Farhan Malik, Sp.S', new Date().toISOString()],
      ['LOG-1018', 'PST-103', '2026-10-08', 'Pagi', 20, 44, 'Spastisitas menurun pasca latihan peregangan.', 'Ns. Siti Rahayu, S.Kep', new Date().toISOString()],
      ['LOG-1019', 'PST-103', '2026-10-09', 'Siang', 25, 48, 'Respon genggaman lemah namun konsisten.', 'dr. Farhan Malik, Sp.S', new Date().toISOString()],
      ['LOG-1020', 'PST-103', '2026-10-10', 'Pagi', 25, 52, 'Perkembangan motorik kasar bertahap.', 'Ns. Siti Rahayu, S.Kep', new Date().toISOString()],

      // PST-104 (Ratna Dewi - Sedang)
      ['LOG-1021', 'PST-104', '2026-10-04', 'Pagi', 20, 50, 'Mobilisasi aktif-asistif sendi pergelangan.', 'dr. Farhan Malik, Sp.S', new Date().toISOString()],
      ['LOG-1022', 'PST-104', '2026-10-05', 'Sore', 20, 55, 'Pasien mengikuti instruksi visual kit dengan baik.', 'Ns. Siti Rahayu, S.Kep', new Date().toISOString()],
      ['LOG-1023', 'PST-104', '2026-10-06', 'Pagi', 25, 60, 'Tremor berkurang saat melakukan ekstensi.', 'Ns. Siti Rahayu, S.Kep', new Date().toISOString()],
      ['LOG-1024', 'PST-104', '2026-10-07', 'Siang', 25, 65, 'Mampu mempertahankan posisi selama 10 detik.', 'dr. Farhan Malik, Sp.S', new Date().toISOString()],
      ['LOG-1025', 'PST-104', '2026-10-08', 'Pagi', 30, 70, 'Peningkatan kekuatan otot fleksor lengan bawah.', 'Ns. Siti Rahayu, S.Kep', new Date().toISOString()],
      ['LOG-1026', 'PST-104', '2026-10-09', 'Sore', 30, 74, 'Sesi latihan diselesaikan tanpa keluhan nyeri.', 'dr. Farhan Malik, Sp.S', new Date().toISOString()],
      ['LOG-1027', 'PST-104', '2026-10-10', 'Pagi', 35, 78, 'Target sesi mingguan tercapai memuaskan.', 'Ns. Siti Rahayu, S.Kep', new Date().toISOString()],

      // PST-105 (Agus Prasetyo - Ringan)
      ['LOG-1028', 'PST-105', '2026-10-04', 'Pagi', 25, 76, 'Fokus pada latihan ketangkasan jemari tangan.', 'Ns. Siti Rahayu, S.Kep', new Date().toISOString()],
      ['LOG-1029', 'PST-105', '2026-10-05', 'Pagi', 30, 80, 'Pinch grip dan power grip mendekati normal.', 'dr. Farhan Malik, Sp.S', new Date().toISOString()],
      ['LOG-1030', 'PST-105', '2026-10-06', 'Sore', 30, 84, 'Gerakan supinasi dan pronasi lancar.', 'Ns. Siti Rahayu, S.Kep', new Date().toISOString()],
      ['LOG-1031', 'PST-105', '2026-10-07', 'Pagi', 35, 88, 'Kecepatan respon sensorik sangat baik.', 'Ns. Siti Rahayu, S.Kep', new Date().toISOString()],
      ['LOG-1032', 'PST-105', '2026-10-08', 'Siang', 35, 90, 'Ketahanan otot bertambah hingga 35 menit.', 'dr. Farhan Malik, Sp.S', new Date().toISOString()],
      ['LOG-1033', 'PST-105', '2026-10-09', 'Pagi', 40, 92, 'Pasien sangat termotivasi dan mandiri.', 'Ns. Siti Rahayu, S.Kep', new Date().toISOString()],
      ['LOG-1034', 'PST-105', '2026-10-10', 'Sore', 40, 95, 'Target ROM 95% telah tercapai penuh!', 'dr. Farhan Malik, Sp.S', new Date().toISOString()],

      // PST-106 (Hendra Gunawan - Berat)
      ['LOG-1035', 'PST-106', '2026-10-06', 'Pagi', 15, 28, 'Fisioterapi pasif dengan bantuan kit SR.', 'dr. Farhan Malik, Sp.S', new Date().toISOString()],
      ['LOG-1036', 'PST-106', '2026-10-07', 'Pagi', 15, 32, 'Evaluasi tonus otot dan lingkup gerak pasif.', 'Ns. Siti Rahayu, S.Kep', new Date().toISOString()],
      ['LOG-1037', 'PST-106', '2026-10-08', 'Sore', 20, 38, 'Pasien mulai merasakan sensasi sentuhan kit.', 'dr. Farhan Malik, Sp.S', new Date().toISOString()],
      ['LOG-1038', 'PST-106', '2026-10-09', 'Pagi', 20, 42, 'Mampu menggerakkan jari telunjuk secara sadar.', 'Ns. Siti Rahayu, S.Kep', new Date().toISOString()],
      ['LOG-1039', 'PST-106', '2026-10-10', 'Siang', 25, 46, 'Kondisi stabil, motivasi keluarga sangat baik.', 'dr. Farhan Malik, Sp.S', new Date().toISOString()],

      // PST-107 (Sri Wahyuni - Sedang)
      ['LOG-1040', 'PST-107', '2026-10-06', 'Pagi', 20, 52, 'Latihan awal gerakan kit.', 'Ns. Siti Rahayu, S.Kep', new Date().toISOString()],
      ['LOG-1041', 'PST-107', '2026-10-07', 'Sore', 25, 60, 'Kekuatan fleksi membaik.', 'dr. Farhan Malik, Sp.S', new Date().toISOString()],
      ['LOG-1042', 'PST-107', '2026-10-08', 'Pagi', 30, 68, 'Respon motorik stabil.', 'Ns. Siti Rahayu, S.Kep', new Date().toISOString()],
      ['LOG-1043', 'PST-107', '2026-10-09', 'Siang', 30, 75, 'Peningkatan daya tahan genggam.', 'dr. Farhan Malik, Sp.S', new Date().toISOString()],
      ['LOG-1044', 'PST-107', '2026-10-10', 'Pagi', 35, 82, 'Mencapai target sesi mingguan.', 'dr. Farhan Malik, Sp.S', new Date().toISOString()]
    ];
    seedLogs.forEach(function(row) { logSheet.appendRow(row); });
  }

  return { success: true, message: 'Database SR Kit berhasil diinisialisasi dan di-seed dengan data lengkap.' };
}

/**
 * Helper: Ambil atau buat sheet jika belum ada
 */
function getOrCreateSheet(spreadsheet, name) {
  var sheet = spreadsheet.getSheetByName(name);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(name);
  }
  return sheet;
}

/**
 * Helper: Memberikan styling pada baris header agar rapi di Google Sheets
 */
function styleHeaderRow(sheet) {
  var headerRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());
  headerRange.setBackground('#0284c7'); // Sky Blue Primary
  headerRange.setFontColor('#ffffff');
  headerRange.setFontWeight('bold');
  sheet.setFrozenRows(1);
}

/**
 * Helper: Mengonversi data Sheet menjadi Array of Objects
 */
function sheetToObjects(sheetName) {
  var ss = getDb();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet || sheet.getLastRow() < 2) return [];

  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var rows = data.slice(1);

  return rows.map(function(row) {
    var obj = {};
    headers.forEach(function(header, idx) {
      obj[header] = row[idx];
    });
    return obj;
  });
}

/**
 * ============================================================================
 * FUNGSI CRUD: USERS
 * ============================================================================
 */

function authenticateUser(email, password) {
  var users = sheetToObjects(SHEET_NAMES.USERS);
  for (var i = 0; i < users.length; i++) {
    var u = users[i];
    if (String(u.email).trim().toLowerCase() === String(email).trim().toLowerCase() &&
        String(u.password) === String(password)) {
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        avatar: u.avatar
      };
    }
  }
  return null;
}

/**
 * ============================================================================
 * FUNGSI CRUD: PATIENTS
 * ============================================================================
 */

function getAllPatients() {
  return sheetToObjects(SHEET_NAMES.PATIENTS);
}

function getPatientById(patientId) {
  var patients = sheetToObjects(SHEET_NAMES.PATIENTS);
  for (var i = 0; i < patients.length; i++) {
    if (String(patients[i].id) === String(patientId)) {
      return patients[i];
    }
  }
  return null;
}

function insertPatient(patientData) {
  var ss = getDb();
  var sheet = ss.getSheetByName(SHEET_NAMES.PATIENTS);
  if (!sheet) initDatabase();
  sheet = ss.getSheetByName(SHEET_NAMES.PATIENTS);

  // Generate ID baru: PST-10X
  var newId = 'PST-' + (100 + sheet.getLastRow());
  var row = [
    newId,
    patientData.name || 'Tanpa Nama',
    Number(patientData.age) || 0,
    patientData.gender || 'Laki-laki',
    patientData.strokeCategory || 'Ringan',
    patientData.doctorInCharge || 'dr. Farhan Malik, Sp.S',
    patientData.exerciseStatus || 'Aktif',
    Number(patientData.targetRom) || 85,
    new Date().toISOString()
  ];

  sheet.appendRow(row);

  return {
    id: newId,
    name: patientData.name,
    age: Number(patientData.age),
    gender: patientData.gender,
    strokeCategory: patientData.strokeCategory,
    doctorInCharge: patientData.doctorInCharge,
    exerciseStatus: patientData.exerciseStatus,
    targetRom: Number(patientData.targetRom),
    createdAt: row[8]
  };
}

/**
 * ============================================================================
 * FUNGSI CRUD: DAILY LOGS (REKAP LATIHAN HARIAN)
 * ============================================================================
 */

function getDailyLogsByPatient(patientId) {
  var allLogs = sheetToObjects(SHEET_NAMES.DAILY_LOGS);
  var patientLogs = allLogs.filter(function(log) {
    return String(log.patientId) === String(patientId);
  });

  // Urutkan berdasarkan tanggal (ascending)
  patientLogs.sort(function(a, b) {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  return patientLogs;
}

function insertDailyLog(logData) {
  var ss = getDb();
  var sheet = ss.getSheetByName(SHEET_NAMES.DAILY_LOGS);
  if (!sheet) initDatabase();
  sheet = ss.getSheetByName(SHEET_NAMES.DAILY_LOGS);

  // Generate ID baru: LOG-100X
  var newId = 'LOG-' + (1000 + sheet.getLastRow());
  var row = [
    newId,
    String(logData.patientId),
    logData.date || Utilities.formatDate(new Date(), 'GMT+7', 'yyyy-MM-dd'),
    logData.session || 'Pagi',
    Number(logData.durationMinutes) || 0,
    Number(logData.romPercentage) || 0,
    logData.notes || '',
    logData.recordedBy || 'Tenaga Medis',
    new Date().toISOString()
  ];

  sheet.appendRow(row);

  return {
    id: newId,
    patientId: logData.patientId,
    date: row[2],
    session: row[3],
    durationMinutes: row[4],
    romPercentage: row[5],
    notes: row[6],
    recordedBy: row[7],
    createdAt: row[8]
  };
}
