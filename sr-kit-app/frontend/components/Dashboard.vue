<template>
  <!-- Komponen Dashboard Utama SR Kit -->
  <div class="flex flex-col min-h-screen">
    
    <!-- 1. NAVBAR DASHBOARD -->
    <header class="sticky top-0 z-40 glass-nav">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          
          <!-- Logo & Brand Name -->
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <i class="fa-solid fa-heart-pulse"></i>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h1 class="text-lg font-bold text-slate-900 leading-none">SR Kit Dashboard</h1>
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-200">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 pulse-dot"></span>
                  {{ isLiveApi ? 'Google Sheets Live' : 'Demo Local Mode' }}
                </span>
              </div>
              <p class="text-xs text-slate-500 hidden sm:block">Sistem Monitoring & Evaluasi Latihan Pasien Stroke</p>
            </div>
          </div>

          <!-- User Profile & Logout -->
          <div class="flex items-center gap-3">
            <button 
              @click="$emit('open-config')" 
              title="Konfigurasi API Endpoint"
              class="p-2 text-slate-500 hover:text-sky-600 hover:bg-slate-100 rounded-lg transition"
            >
              <i class="fa-solid fa-gear"></i>
            </button>

            <!-- Profil User -->
            <div class="flex items-center gap-3 pl-2 border-l border-slate-200">
              <img 
                :src="currentUser?.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150'" 
                alt="Avatar" 
                class="w-9 h-9 rounded-full object-cover ring-2 ring-sky-500/30"
              />
              <div class="hidden md:block text-left">
                <p class="text-xs font-bold text-slate-800 leading-tight">{{ currentUser?.name }}</p>
                <span class="text-[11px] font-semibold text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded">
                  {{ currentUser?.role }}
                </span>
              </div>
            </div>

            <!-- Tombol Logout -->
            <button 
              @click="$emit('logout')" 
              title="Keluar dari akun"
              class="ml-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200 transition flex items-center gap-1.5"
            >
              <i class="fa-solid fa-arrow-right-from-bracket"></i>
              <span class="hidden sm:inline">Logout</span>
            </button>
          </div>

        </div>
      </div>
    </header>

    <!-- 2. MAIN CONTENT -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full space-y-8">
      
      <!-- Welcome Banner -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-sky-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div class="relative z-10">
          <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sky-200 text-xs font-medium backdrop-blur-md mb-2">
            <i class="fa-solid fa-stethoscope"></i> Portal Rehabilitasi Medis
          </span>
          <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight">Selamat Bertugas, {{ currentUser?.name }}</h2>
          <p class="text-slate-300 text-sm mt-1 max-w-xl">
            Pantau perkembangan Range of Motion (ROM) dan durasi latihan pasien yang menggunakan perangkat rehabilitasi SR Kit.
          </p>
        </div>
        <div class="relative z-10 flex flex-wrap gap-3">
          <button 
            @click="$emit('open-add-patient')"
            class="px-4 py-2.5 bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white text-sm font-semibold rounded-xl shadow-lg transition flex items-center gap-2"
          >
            <i class="fa-solid fa-user-plus"></i>
            <span>Tambah Pasien Baru</span>
          </button>
          <button 
            @click="$emit('refresh-data')"
            class="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-xl backdrop-blur-md border border-white/20 transition flex items-center gap-2"
          >
            <i class="fa-solid fa-rotate" :class="{ 'fa-spin': isLoading }"></i>
            <span>Sinkronkan Data</span>
          </button>
        </div>
      </div>

      <!-- STATISTIK CARD (RINGKASAN DATA) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <!-- Total Pasien -->
        <div class="glass-card rounded-2xl p-5 border-l-4 border-l-sky-500 flex items-center justify-between">
          <div>
            <p class="text-xs font-bold uppercase tracking-wider text-slate-400">Total Pasien</p>
            <h3 class="text-3xl font-extrabold text-slate-800 mt-1">{{ totalCount }}</h3>
            <p class="text-xs text-slate-500 mt-1">Terdaftar dalam protokol SR Kit</p>
          </div>
          <div class="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center text-xl shadow-inner">
            <i class="fa-solid fa-users"></i>
          </div>
        </div>

        <!-- Pasien Stroke Ringan (Hijau / Biru Muda) -->
        <div class="glass-card rounded-2xl p-5 border-l-4 border-l-emerald-500 flex items-center justify-between">
          <div>
            <p class="text-xs font-bold uppercase tracking-wider text-emerald-600">Stroke Ringan</p>
            <h3 class="text-3xl font-extrabold text-slate-800 mt-1">{{ countRingan }}</h3>
            <p class="text-xs text-slate-500 mt-1">Fokus penguatan & kelenturan</p>
          </div>
          <div class="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl shadow-inner">
            <i class="fa-solid fa-user-check"></i>
          </div>
        </div>

        <!-- Pasien Stroke Sedang (Kuning / Orange) -->
        <div class="glass-card rounded-2xl p-5 border-l-4 border-l-amber-500 flex items-center justify-between">
          <div>
            <p class="text-xs font-bold uppercase tracking-wider text-amber-600">Stroke Sedang</p>
            <h3 class="text-3xl font-extrabold text-slate-800 mt-1">{{ countSedang }}</h3>
            <p class="text-xs text-slate-500 mt-1">Latihan terbimbing intensif</p>
          </div>
          <div class="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-xl shadow-inner">
            <i class="fa-solid fa-user-clock"></i>
          </div>
        </div>

        <!-- Pasien Stroke Berat (Merah) -->
        <div class="glass-card rounded-2xl p-5 border-l-4 border-l-rose-500 flex items-center justify-between">
          <div>
            <p class="text-xs font-bold uppercase tracking-wider text-rose-600">Stroke Berat</p>
            <h3 class="text-3xl font-extrabold text-slate-800 mt-1">{{ countBerat }}</h3>
            <p class="text-xs text-slate-500 mt-1">Mobilisasi pasif & sensorik</p>
          </div>
          <div class="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-xl shadow-inner">
            <i class="fa-solid fa-user-injured"></i>
          </div>
        </div>

      </div>

      <!-- TABEL DAFTAR PASIEN -->
      <div class="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
        
        <!-- Controls: Search & Category Filter -->
        <div class="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
          <div>
            <h3 class="text-lg font-bold text-slate-900">Daftar Pasien Rehabilitasi</h3>
            <p class="text-xs text-slate-500">Pilih pasien untuk membuka detail rekap latihan harian & grafik ROM</p>
          </div>

          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <!-- Search Bar -->
            <div class="relative min-w-[240px]">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <i class="fa-solid fa-magnifying-glass text-xs"></i>
              </span>
              <input 
                type="text" 
                v-model="searchQuery"
                placeholder="Cari nama atau ID..."
                class="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
              />
            </div>

            <!-- Filter Kategori -->
            <div class="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
              <button 
                v-for="cat in ['Semua', 'Ringan', 'Sedang', 'Berat']" 
                :key="cat"
                @click="filterCategory = cat"
                :class="[
                  'px-2.5 py-1 text-xs font-semibold rounded-lg transition',
                  filterCategory === cat ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                ]"
              >
                {{ cat }}
              </button>
            </div>
          </div>
        </div>

        <!-- Tabel Pasien Responsive -->
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th class="py-3.5 px-4 sm:px-6">ID Pasien</th>
                <th class="py-3.5 px-4 sm:px-6">Nama & Biodata</th>
                <th class="py-3.5 px-4 sm:px-6">Umur</th>
                <th class="py-3.5 px-4 sm:px-6">Kategori Stroke</th>
                <th class="py-3.5 px-4 sm:px-6">Dokter Penanggung Jawab</th>
                <th class="py-3.5 px-4 sm:px-6">Status Latihan</th>
                <th class="py-3.5 px-4 sm:px-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-sm font-medium">
              
              <tr v-if="isLoading && !patients.length">
                <td colspan="7" class="py-12 text-center text-slate-400">
                  <i class="fa-solid fa-circle-notch fa-spin text-2xl text-sky-600 mb-2"></i>
                  <p class="text-xs">Memuat data pasien...</p>
                </td>
              </tr>

              <tr v-else-if="!filteredPatients.length">
                <td colspan="7" class="py-12 text-center text-slate-400">
                  <i class="fa-regular fa-folder-open text-3xl mb-2 text-slate-300"></i>
                  <p class="text-sm font-semibold text-slate-600">Tidak ada pasien yang sesuai</p>
                </td>
              </tr>

              <tr 
                v-for="patient in filteredPatients" 
                :key="patient.id"
                class="hover:bg-sky-50/40 transition-colors"
              >
                <td class="py-4 px-4 sm:px-6 font-mono text-xs font-bold text-slate-600">
                  <span class="bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                    {{ patient.id }}
                  </span>
                </td>

                <td class="py-4 px-4 sm:px-6">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center text-xs">
                      {{ patient.name.charAt(0) }}
                    </div>
                    <div>
                      <p class="font-bold text-slate-800 leading-tight">{{ patient.name }}</p>
                      <span class="text-xs text-slate-400 flex items-center gap-1">
                        <i :class="patient.gender === 'Perempuan' ? 'fa-solid fa-venus text-pink-500' : 'fa-solid fa-mars text-blue-500'"></i>
                        {{ patient.gender }}
                      </span>
                    </div>
                  </div>
                </td>

                <td class="py-4 px-4 sm:px-6 text-slate-700">
                  {{ patient.age }} Tahun
                </td>

                <td class="py-4 px-4 sm:px-6">
                  <span 
                    :class="[
                      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold',
                      patient.strokeCategory === 'Ringan' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      patient.strokeCategory === 'Sedang' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-rose-50 text-rose-700 border border-rose-200'
                    ]"
                  >
                    <i class="fa-solid fa-circle text-[6px]"></i>
                    {{ patient.strokeCategory }}
                  </span>
                </td>

                <td class="py-4 px-4 sm:px-6 text-xs text-slate-600">
                  <div class="flex items-center gap-1.5">
                    <i class="fa-solid fa-user-doctor text-sky-600"></i>
                    <span>{{ patient.doctorInCharge }}</span>
                  </div>
                </td>

                <td class="py-4 px-4 sm:px-6">
                  <span 
                    :class="[
                      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold',
                      patient.exerciseStatus === 'Aktif' ? 'bg-emerald-100/70 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    ]"
                  >
                    <span v-if="patient.exerciseStatus === 'Aktif'" class="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-dot"></span>
                    {{ patient.exerciseStatus }}
                  </span>
                </td>

                <td class="py-4 px-4 sm:px-6 text-center">
                  <button 
                    @click="$emit('select-patient', patient)"
                    class="px-3 py-1.5 bg-sky-50 hover:bg-sky-600 text-sky-700 hover:text-white rounded-xl text-xs font-bold border border-sky-200 transition flex items-center justify-center gap-1.5 mx-auto"
                  >
                    <i class="fa-solid fa-chart-line"></i>
                    <span>Detail</span>
                  </button>
                </td>
              </tr>

            </tbody>
          </table>
        </div>

      </div>

    </main>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  name: 'DashboardView',
  props: {
    currentUser: Object,
    patients: {
      type: Array,
      default: () => []
    },
    isLoading: Boolean,
    isLiveApi: Boolean
  },
  emits: ['logout', 'select-patient', 'open-add-patient', 'open-config', 'refresh-data'],
  setup(props) {
    const searchQuery = ref('');
    const filterCategory = ref('Semua');

    const totalCount = computed(() => props.patients.length);
    const countRingan = computed(() => props.patients.filter(p => p.strokeCategory === 'Ringan').length);
    const countSedang = computed(() => props.patients.filter(p => p.strokeCategory === 'Sedang').length);
    const countBerat = computed(() => props.patients.filter(p => p.strokeCategory === 'Berat').length);

    const filteredPatients = computed(() => {
      let list = props.patients;
      if (filterCategory.value !== 'Semua') {
        list = list.filter(p => p.strokeCategory === filterCategory.value);
      }
      if (searchQuery.value.trim() !== '') {
        const q = searchQuery.value.toLowerCase().trim();
        list = list.filter(p =>
          (p.name && p.name.toLowerCase().includes(q)) ||
          (p.id && p.id.toLowerCase().includes(q)) ||
          (p.doctorInCharge && p.doctorInCharge.toLowerCase().includes(q))
        );
      }
      return list;
    });

    return {
      searchQuery,
      filterCategory,
      totalCount,
      countRingan,
      countSedang,
      countBerat,
      filteredPatients
    };
  }
};
</script>
