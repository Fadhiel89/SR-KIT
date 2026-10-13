/**
 * ============================================================================
 * SR Kit (Stroke Rehabilitation Kit) - Backend API Router
 * Google Apps Script Web App REST API
 * ============================================================================
 * Panduan Singkat Deployment Google Apps Script:
 * 1. Buka Google Sheets baru di Google Drive Anda.
 * 2. Klik menu "Extensions" (Ekstensi) > "Apps Script".
 * 3. Copy-paste isi file DatabaseUtils.gs dan Code.gs ke project Apps Script.
 * 4. Klik menu "Deploy" > "New deployment" (Terapkan > Deployment baru).
 * 5. Pilih tipe: "Web app".
 * 6. Konfigurasi:
 *    - Description: "SR Kit REST API v1.0"
 *    - Execute as: "Me" (Email pemilik akun)
 *    - Who has access: "Anyone" (Siapa saja, penting agar Frontend bisa akses tanpa login Google)
 * 7. Klik "Deploy", izinkan hak akses (Authorize access).
 * 8. Salin "Web app URL" (akhiran /exec) dan masukkan ke Frontend / api.js.
 */

/**
 * Handler GET Request
 * Menangani query data (Patients, DailyLogs, Ping Status, Init DB)
 */
function doGet(e) {
  try {
    var params = e ? e.parameter : {};
    var action = params.action || 'ping';
    var response;

    switch (action) {
      case 'ping':
        response = {
          success: true,
          message: 'SR Kit REST API is active and operational',
          timestamp: new Date().toISOString()
        };
        break;

      case 'init':
      case 'seed':
        // Setup tabel otomatis dan seed data lengkap
        response = initDatabase();
        break;

      case 'getPatients':
        var patients = getAllPatients();
        response = {
          success: true,
          data: patients,
          total: patients.length
        };
        break;

      case 'getPatient':
        var patientId = params.id;
        if (!patientId) {
          throw new Error('Parameter "id" pasien wajib disertakan.');
        }
        var patient = getPatientById(patientId);
        response = {
          success: true,
          data: patient
        };
        break;

      case 'getDailyLogs':
        var targetPatientId = params.patientId;
        if (!targetPatientId) {
          throw new Error('Parameter "patientId" wajib disertakan.');
        }
        var logs = getDailyLogsByPatient(targetPatientId);
        response = {
          success: true,
          patientId: targetPatientId,
          data: logs,
          total: logs.length
        };
        break;

      case 'login':
        // Dukungan login via GET
        var email = params.email;
        var password = params.password;
        var user = authenticateUser(email, password);
        if (user) {
          response = { success: true, user: user, message: 'Login berhasil.' };
        } else {
          response = { success: false, message: 'Email atau password salah.' };
        }
        break;

      case 'addPatient':
        if (!params.name) throw new Error('Nama pasien wajib diisi.');
        var createdPatient = insertPatient(params);
        response = { success: true, data: createdPatient, message: 'Pasien baru berhasil didaftarkan.' };
        break;

      case 'addDailyLog':
        if (!params.patientId) throw new Error('ID Pasien wajib disertakan.');
        var createdLog = insertDailyLog(params);
        response = { success: true, data: createdLog, message: 'Rekap latihan harian berhasil disimpan.' };
        break;

      default:
        response = {
          success: false,
          message: 'Aksi GET tidak dikenali: ' + action
        };
        break;
    }

    return createJsonResponse(response);

  } catch (error) {
    return createJsonResponse({
      success: false,
      error: error.message || 'Terjadi kesalahan internal server.',
      stack: error.stack
    });
  }
}

/**
 * Handler POST Request
 * Menangani mutasi data (Login, Tambah Pasien, Tambah Rekap Latihan)
 */
function doPost(e) {
  try {
    var payload = {};

    // Parsing payload baik dari JSON body maupun form parameter
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        payload = e.parameter || {};
      }
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    var action = payload.action;
    var response;

    switch (action) {
      case 'login':
        var user = authenticateUser(payload.email, payload.password);
        if (user) {
          response = {
            success: true,
            user: user,
            message: 'Autentikasi berhasil.'
          };
        } else {
          response = {
            success: false,
            message: 'Email atau kata sandi tidak valid. Silakan periksa kembali.'
          };
        }
        break;

      case 'addPatient':
        if (!payload.name) {
          throw new Error('Nama pasien wajib diisi.');
        }
        var createdPatient = insertPatient(payload);
        response = {
          success: true,
          data: createdPatient,
          message: 'Pasien baru berhasil didaftarkan.'
        };
        break;

      case 'addDailyLog':
        if (!payload.patientId) {
          throw new Error('ID Pasien wajib disertakan.');
        }
        var createdLog = insertDailyLog(payload);
        response = {
          success: true,
          data: createdLog,
          message: 'Rekap latihan harian berhasil disimpan.'
        };
        break;

      case 'init':
        response = initDatabase();
        break;

      default:
        response = {
          success: false,
          message: 'Aksi POST tidak dikenali: ' + action
        };
        break;
    }

    return createJsonResponse(response);

  } catch (error) {
    return createJsonResponse({
      success: false,
      error: error.message || 'Terjadi kegagalan saat memproses permintaan POST.'
    });
  }
}

/**
 * Helper Format Response JSON Standard
 * Memastikan header MIME Type terkonfigurasi sebagai JSON dan ramah CORS
 */
function createJsonResponse(data) {
  var output = JSON.stringify(data);
  return ContentService
    .createTextOutput(output)
    .setMimeType(ContentService.MimeType.JSON);
}
