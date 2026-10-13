/**
 * ============================================================================
 * SR Kit (Stroke Rehabilitation Kit) - Vue 3 Application Logic
 * ============================================================================
 * Menggunakan Vue 3 Composition API:
 * - State Management terpusat
 * - SPA View Switcher (Login <-> Dashboard)
 * - Chart.js Dual Axis (Durasi Latihan vs Capaian ROM)
 * - Filtering, Searching, CRUD Pasien & Rekap Harian
 * - Toast Notification System
 */

const { createApp, ref, reactive, computed, onMounted, nextTick } = Vue;

const app = createApp({
  setup() {
    // -------------------------------------------------------------------------
    // 1. STATE DASAR & AUTENTIKASI
    // -------------------------------------------------------------------------
    const currentView = ref('login'); // 'login' | 'dashboard'
    const currentUser = ref(null);
    const isLoading = ref(false);
    const isSubmittingLog = ref(false);
    const isSubmittingPatient = ref(false);

    // Form Login
    const loginForm = reactive({
      email: '',
      password: ''
    });

    // -------------------------------------------------------------------------
    // 2. STATE DATA PASIEN & MODAL
    // -------------------------------------------------------------------------
    const patients = ref([]);
    const selectedPatient = ref(null);
    const dailyLogs = ref([]);
    const isPatientModalOpen = ref(false);
    const isAddPatientModalOpen = ref(false);
    const isConfigModalOpen = ref(false);

    // Filter & Pencarian
    const searchQuery = ref('');
    const filterCategory = ref('Semua'); // 'Semua' | 'Ringan' | 'Sedang' | 'Berat'

    // Form Tambah Rekap Latihan Harian
    const todayStr = new Date().toISOString().split('T')[0];
    const logForm = reactive({
      date: todayStr,
      durationMinutes: 30,
      romPercentage: 75,
      session: 'Pagi',
      notes: ''
    });

    // Form Tambah Pasien Baru
    const patientForm = reactive({
      name: '',
      age: 55,
      gender: 'Laki-laki',
      strokeCategory: 'Ringan',
      doctorInCharge: 'dr. Farhan Malik, Sp.S',
      exerciseStatus: 'Aktif',
      targetRom: 85
    });

    // Konfigurasi Google Apps Script Endpoint
    const gasEndpointInput = ref(window.srKitApi.getEndpointUrl());
    const isLiveApi = ref(window.srKitApi.isLiveMode());
    const connectionTestLoading = ref(false);

    // Toast Notifications
    const toasts = ref([]);
    let toastIdCounter = 0;

    function showToast(message, type = 'success', duration = 3500) {
      const id = ++toastIdCounter;
      toasts.value.push({ id, message, type });
      setTimeout(() => {
        toasts.value = toasts.value.filter(t => t.id !== id);
      }, duration);
    }

    // -------------------------------------------------------------------------
    // 3. CHART.JS INSTANCE & LIFECYCLE
    // -------------------------------------------------------------------------
    let chartInstance = null;

    /**
     * Inisialisasi atau pembaruan grafik Chart.js
     * Visualisasi gabungan Bar Chart (Durasi) dan Line Chart (ROM %)
     */
    function renderExerciseChart() {
      const canvas = document.getElementById('exerciseChartCanvas');
      if (!canvas) return;

      if (chartInstance) {
        chartInstance.destroy();
      }

      // Ambil 7 sesi terakhir untuk visualisasi yang rapi
      const displayLogs = [...dailyLogs.value].slice(-7);

      const labels = displayLogs.map(l => {
        const cleanDate = String(l.date).split('T')[0];
        const parts = cleanDate.split('-');
        const dateFormatted = parts.length === 3 ? `${parts[2]}/${parts[1]}` : cleanDate;
        return `${dateFormatted} (${l.session})`;
      });

      const durationData = displayLogs.map(l => Number(l.durationMinutes));
      const romData = displayLogs.map(l => Number(l.romPercentage));

      const ctx = canvas.getContext('2d');

      chartInstance = new Chart(ctx, {
        data: {
          labels: labels.length ? labels : ['Belum Ada Sesi'],
          datasets: [
            {
              type: 'bar',
              label: 'Durasi Latihan (Menit)',
              data: durationData.length ? durationData : [0],
              backgroundColor: 'rgba(2, 132, 199, 0.75)', // Sky 600
              hoverBackgroundColor: 'rgba(2, 132, 199, 0.95)',
              borderRadius: 6,
              barThickness: 24,
              yAxisID: 'yDuration'
            },
            {
              type: 'line',
              label: 'Capaian ROM (%)',
              data: romData.length ? romData : [0],
              borderColor: '#0d9488', // Teal 600
              backgroundColor: 'rgba(13, 148, 136, 0.1)',
              borderWidth: 3,
              pointBackgroundColor: '#ffffff',
              pointBorderColor: '#0d9488',
              pointBorderWidth: 2,
              pointRadius: 5,
              pointHoverRadius: 7,
              tension: 0.35,
              fill: true,
              yAxisID: 'yRom'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false
          },
          plugins: {
            legend: {
              position: 'top',
              labels: {
                usePointStyle: true,
                padding: 16,
                font: {
                  family: "'Plus Jakarta Sans', sans-serif",
                  size: 12,
                  weight: '600'
                }
              }
            },
            tooltip: {
              backgroundColor: '#0f172a',
              titleFont: { family: "'Plus Jakarta Sans', sans-serif", size: 13, weight: '700' },
              bodyFont: { family: "'Plus Jakarta Sans', sans-serif", size: 12 },
              padding: 12,
              cornerRadius: 8,
              callbacks: {
                label: function (context) {
                  if (context.dataset.yAxisID === 'yDuration') {
                    return ` ⏱ Durasi: ${context.parsed.y} Menit`;
                  }
                  return ` 📈 Capaian ROM: ${context.parsed.y}%`;
                }
              }
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: {
                font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 }
              }
            },
            yDuration: {
              type: 'linear',
              position: 'left',
              title: {
                display: true,
                text: 'Durasi (Menit)',
                color: '#0284c7',
                font: { weight: '600', size: 11 }
              },
              min: 0,
              max: Math.max(45, Math.ceil((Math.max(...durationData, 30) + 10) / 10) * 10),
              ticks: { stepSize: 10 }
            },
            yRom: {
              type: 'linear',
              position: 'right',
              title: {
                display: true,
                text: 'Capaian ROM (%)',
                color: '#0d9488',
                font: { weight: '600', size: 11 }
              },
              min: 0,
              max: 100,
              ticks: {
                stepSize: 20,
                callback: function (val) {
                  return val + '%';
                }
              },
              grid: {
                drawOnChartArea: false // Mencegah tumpang tindih garis grid
              }
            }
          }
        }
      });
    }

    // -------------------------------------------------------------------------
    // 4. COMPUTED PROPERTIES
    // -------------------------------------------------------------------------
    // Statistik Ringkasan Kartu Dashboard
    const totalPatientsCount = computed(() => patients.value.length);
    const countRingan = computed(() => patients.value.filter(p => p.strokeCategory === 'Ringan').length);
    const countSedang = computed(() => patients.value.filter(p => p.strokeCategory === 'Sedang').length);
    const countBerat = computed(() => patients.value.filter(p => p.strokeCategory === 'Berat').length);

    // Pasien Terfilter (Pencarian & Kategori)
    const filteredPatients = computed(() => {
      let list = patients.value;

      // Filter Kategori
      if (filterCategory.value !== 'Semua') {
        list = list.filter(p => p.strokeCategory === filterCategory.value);
      }

      // Filter Pencarian (Nama, ID, atau Dokter)
      if (searchQuery.value.trim() !== '') {
        const query = searchQuery.value.toLowerCase().trim();
        list = list.filter(p =>
          (p.name && p.name.toLowerCase().includes(query)) ||
          (p.id && p.id.toLowerCase().includes(query)) ||
          (p.doctorInCharge && p.doctorInCharge.toLowerCase().includes(query))
        );
      }

      return list;
    });

    // Statistik Pasien Terpilih pada Modal
    const averageRom = computed(() => {
      if (!dailyLogs.value.length) return 0;
      const total = dailyLogs.value.reduce((acc, curr) => acc + Number(curr.romPercentage), 0);
      return Math.round(total / dailyLogs.value.length);
    });

    const totalMinutesTrained = computed(() => {
      if (!dailyLogs.value.length) return 0;
      return dailyLogs.value.reduce((acc, curr) => acc + Number(curr.durationMinutes), 0);
    });

    // -------------------------------------------------------------------------
    // 5. METODE & AKSI PENGGUNA
    // -------------------------------------------------------------------------

    /**
     * Demo Login Cepat (Dokter atau Perawat)
     */
    function quickLogin(roleName) {
      if (roleName === 'dokter') {
        loginForm.email = 'dokter@srkit.med';
        loginForm.password = 'dokter123';
      } else {
        loginForm.email = 'perawat@srkit.med';
        loginForm.password = 'perawat123';
      }
      handleLogin();
    }

    /**
     * Proses Login
     */
    async function handleLogin() {
      if (!loginForm.email || !loginForm.password) {
        showToast('Harap masukkan email dan kata sandi.', 'warning');
        return;
      }

      isLoading.value = true;
      try {
        const result = await window.srKitApi.login(loginForm.email, loginForm.password);
        if (result && result.success) {
          currentUser.value = result.user;
          currentView.value = 'dashboard';
          showToast(`Selamat datang kembali, ${result.user.name}!`, 'success');
          await loadPatients();
        } else {
          showToast(result.message || 'Login gagal.', 'error');
        }
      } catch (err) {
        showToast('Terjadi kesalahan saat memproses login.', 'error');
      } finally {
        isLoading.value = false;
      }
    }

    /**
     * Logout
     */
    function handleLogout() {
      window.srKitApi.logout();
      currentUser.value = null;
      currentView.value = 'login';
      loginForm.email = '';
      loginForm.password = '';
      showToast('Anda telah keluar dari sistem.', 'info');
    }

    /**
     * Memuat Seluruh Data Pasien
     */
    async function loadPatients() {
      isLoading.value = true;
      try {
        const data = await window.srKitApi.getPatients();
        patients.value = data;
      } catch (err) {
        showToast('Gagal memuat data pasien.', 'error');
      } finally {
        isLoading.value = false;
      }
    }

    /**
     * Buka Modal Detail Pasien & Rekap Harian
     */
    async function openPatientDetail(patient) {
      selectedPatient.value = patient;
      isPatientModalOpen.value = true;
      isLoading.value = true;

      // Reset form rekap harian
      logForm.date = new Date().toISOString().split('T')[0];
      logForm.durationMinutes = 25;
      logForm.romPercentage = 70;
      logForm.session = 'Pagi';
      logForm.notes = '';

      try {
        const logs = await window.srKitApi.getDailyLogs(patient.id);
        dailyLogs.value = logs;

        // Render grafik setelah elemen canvas ter-mount ke DOM
        nextTick(() => {
          renderExerciseChart();
        });
      } catch (err) {
        showToast('Gagal memuat riwayat latihan pasien.', 'error');
      } finally {
        isLoading.value = false;
      }
    }

    /**
     * Tutup Modal Detail Pasien
     */
    function closePatientDetail() {
      isPatientModalOpen.value = false;
      selectedPatient.value = null;
      if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
      }
    }

    /**
     * Simpan Rekap Latihan Harian Baru
     */
    async function submitDailyLog() {
      if (!selectedPatient.value) return;
      if (logForm.durationMinutes <= 0) {
        showToast('Durasi latihan harus lebih dari 0 menit.', 'warning');
        return;
      }
      if (logForm.romPercentage < 0 || logForm.romPercentage > 100) {
        showToast('Capaian ROM harus bernilai antara 0% hingga 100%.', 'warning');
        return;
      }

      isSubmittingLog.value = true;
      try {
        const payload = {
          patientId: selectedPatient.value.id,
          date: logForm.date,
          session: logForm.session,
          durationMinutes: Number(logForm.durationMinutes),
          romPercentage: Number(logForm.romPercentage),
          notes: logForm.notes || 'Latihan selesai dengan lancar.',
          recordedBy: currentUser.value ? currentUser.value.name : 'Tenaga Medis'
        };

        const newLog = await window.srKitApi.addDailyLog(payload);
        dailyLogs.value.push(newLog);

        showToast('Rekap latihan berhasil disimpan!', 'success');

        // Bersihkan catatan & update visual chart
        logForm.notes = '';
        nextTick(() => {
          renderExerciseChart();
        });

      } catch (err) {
        showToast('Gagal menyimpan rekap latihan.', 'error');
      } finally {
        isSubmittingLog.value = false;
      }
    }

    /**
     * Buka Modal Tambah Pasien Baru
     */
    function openAddPatientModal() {
      patientForm.name = '';
      patientForm.age = 55;
      patientForm.gender = 'Laki-laki';
      patientForm.strokeCategory = 'Ringan';
      patientForm.doctorInCharge = currentUser.value?.role.includes('Dokter') ? currentUser.value.name : 'dr. Farhan Malik, Sp.S';
      patientForm.exerciseStatus = 'Aktif';
      patientForm.targetRom = 85;
      isAddPatientModalOpen.value = true;
    }

    /**
     * Submit Pendaftaran Pasien Baru
     */
    async function submitNewPatient() {
      if (!patientForm.name.trim()) {
        showToast('Nama pasien wajib diisi.', 'warning');
        return;
      }

      isSubmittingPatient.value = true;
      try {
        const newPatient = await window.srKitApi.addPatient({
          name: patientForm.name,
          age: Number(patientForm.age),
          gender: patientForm.gender,
          strokeCategory: patientForm.strokeCategory,
          doctorInCharge: patientForm.doctorInCharge,
          exerciseStatus: patientForm.exerciseStatus,
          targetRom: Number(patientForm.targetRom)
        });

        patients.value.unshift(newPatient);
        isAddPatientModalOpen.value = false;
        showToast(`Pasien ${newPatient.name} berhasil didaftarkan!`, 'success');
      } catch (err) {
        showToast('Gagal menambahkan pasien baru.', 'error');
      } finally {
        isSubmittingPatient.value = false;
      }
    }

    /**
     * Simpan Pengaturan URL Google Apps Script
     */
    function saveGasConfig() {
      window.srKitApi.setEndpointUrl(gasEndpointInput.value);
      isLiveApi.value = window.srKitApi.isLiveMode();
      isConfigModalOpen.value = false;
      showToast(isLiveApi.value ? 'Endpoint Google Apps Script tersimpan.' : 'Mode demo lokal aktif.', 'info');
      loadPatients();
    }

    /**
     * Uji Koneksi Google Apps Script
     */
    async function testGasConnection() {
      if (!gasEndpointInput.value.trim()) {
        showToast('Masukkan URL Web App terlebih dahulu.', 'warning');
        return;
      }
      connectionTestLoading.value = true;
      const res = await window.srKitApi.testConnection(gasEndpointInput.value);
      connectionTestLoading.value = false;
      if (res.success) {
        showToast('Koneksi ke Google Apps Script berhasil!', 'success');
      } else {
        showToast(res.message, 'error', 5000);
      }
    }

    /**
     * Cetak / Export Rekap Pasien
     */
    function printPatientReport() {
      window.print();
    }

    // -------------------------------------------------------------------------
    // 6. LIFECYCLE HOOKS
    // -------------------------------------------------------------------------
    onMounted(() => {
      // Periksa apakah pengguna sebelumnya sudah tersimpan di session
      const savedUser = window.srKitApi.getCurrentUser();
      if (savedUser) {
        currentUser.value = savedUser;
        currentView.value = 'dashboard';
        loadPatients();
      }
    });

    return {
      // State
      currentView,
      currentUser,
      isLoading,
      isSubmittingLog,
      isSubmittingPatient,
      loginForm,
      patients,
      selectedPatient,
      dailyLogs,
      isPatientModalOpen,
      isAddPatientModalOpen,
      isConfigModalOpen,
      searchQuery,
      filterCategory,
      logForm,
      patientForm,
      gasEndpointInput,
      isLiveApi,
      connectionTestLoading,
      toasts,

      // Computed
      totalPatientsCount,
      countRingan,
      countSedang,
      countBerat,
      filteredPatients,
      averageRom,
      totalMinutesTrained,

      // Methods
      quickLogin,
      handleLogin,
      handleLogout,
      loadPatients,
      openPatientDetail,
      closePatientDetail,
      submitDailyLog,
      openAddPatientModal,
      submitNewPatient,
      saveGasConfig,
      testGasConnection,
      printPatientReport
    };
  }
});

// Mount Vue ke DOM
app.mount('#app');
