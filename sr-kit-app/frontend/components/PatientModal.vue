<template>
  <!-- Komponen Modal Detail Pasien & Rekap Harian SR Kit -->
  <div class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-sm transition-all">
    <div class="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl my-auto max-h-[92vh] flex flex-col overflow-hidden modal-enter-active">
      
      <!-- MODAL HEADER: Profil Singkat Pasien -->
      <div class="p-5 sm:p-6 bg-gradient-to-r from-sky-900 via-slate-900 to-teal-900 text-white flex items-start justify-between relative overflow-hidden">
        <div class="relative z-10 flex flex-wrap sm:flex-nowrap items-center gap-4">
          <div class="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-2xl font-black text-sky-300 border border-white/20">
            {{ patient?.name ? patient.name.charAt(0) : 'P' }}
          </div>
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <h2 class="text-xl sm:text-2xl font-extrabold">{{ patient?.name }}</h2>
              <span class="font-mono text-xs px-2 py-0.5 rounded bg-white/20 text-sky-200 font-bold">
                {{ patient?.id }}
              </span>
              <span 
                :class="[
                  'text-xs font-bold px-2.5 py-0.5 rounded-full',
                  patient?.strokeCategory === 'Ringan' ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30' :
                  patient?.strokeCategory === 'Sedang' ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' :
                  'bg-rose-400/20 text-rose-300 border border-rose-400/30'
                ]"
              >
                Stroke {{ patient?.strokeCategory }}
              </span>
            </div>
            <p class="text-xs text-slate-300 mt-1 flex items-center gap-3 flex-wrap">
              <span><i class="fa-solid fa-cake-candles mr-1 text-sky-400"></i>{{ patient?.age }} Thn ({{ patient?.gender }})</span>
              <span><i class="fa-solid fa-user-doctor mr-1 text-teal-400"></i>DPJP: {{ patient?.doctorInCharge }}</span>
              <span><i class="fa-solid fa-bullseye mr-1 text-amber-400"></i>Target ROM: {{ patient?.targetRom }}%</span>
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2 relative z-10 no-print">
          <button 
            @click="printReport"
            title="Cetak Ringkasan"
            class="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition"
          >
            <i class="fa-solid fa-print"></i>
          </button>
          <button 
            @click="$emit('close')"
            title="Tutup Modal"
            class="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition"
          >
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>
      </div>

      <!-- MODAL BODY -->
      <div class="p-5 sm:p-6 overflow-y-auto space-y-6 flex-grow bg-slate-50/50">
        
        <!-- Quick Stats -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div class="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm">
            <span class="text-[11px] font-bold text-slate-400 uppercase">Capaian ROM Rata-rata</span>
            <p class="text-xl font-extrabold text-teal-600 mt-0.5">{{ averageRom }}%</p>
          </div>
          <div class="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm">
            <span class="text-[11px] font-bold text-slate-400 uppercase">Total Menit Latihan</span>
            <p class="text-xl font-extrabold text-sky-600 mt-0.5">{{ totalMinutes }} Menit</p>
          </div>
          <div class="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm">
            <span class="text-[11px] font-bold text-slate-400 uppercase">Jumlah Sesi Latihan</span>
            <p class="text-xl font-extrabold text-slate-800 mt-0.5">{{ logs.length }} Sesi</p>
          </div>
          <div class="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm">
            <span class="text-[11px] font-bold text-slate-400 uppercase">Target ROM Medis</span>
            <p class="text-xl font-extrabold text-amber-600 mt-0.5">{{ patient?.targetRom }}%</p>
          </div>
        </div>

        <!-- 1. Visualisasi Data: Chart.js Canvas -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h4 class="text-sm font-bold text-slate-900 flex items-center gap-2">
                <i class="fa-solid fa-chart-area text-sky-600"></i>
                <span>Grafik Tren Durasi & Capaian ROM (7 Sesi Terakhir)</span>
              </h4>
              <p class="text-xs text-slate-500">Korelasi antara durasi pemakaian alat SR Kit dan capaian Range of Motion</p>
            </div>
            <span class="text-xs bg-sky-50 text-sky-700 px-2 py-1 rounded-md font-semibold border border-sky-200">
              Dual Axis Metric
            </span>
          </div>

          <div class="chart-container">
            <canvas ref="chartCanvas"></canvas>
          </div>
        </div>

        <!-- 2. Form Tambah Rekap Latihan Harian -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm no-print">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center text-xs">
              <i class="fa-solid fa-notes-medical"></i>
            </div>
            <h4 class="text-sm font-bold text-slate-900">Input Rekap Sesi Latihan Harian Baru</h4>
          </div>

          <form @submit.prevent="submitLog" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-slate-600 uppercase mb-1">Tanggal</label>
              <input 
                type="date" 
                v-model="newLog.date" 
                required
                class="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
              />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-600 uppercase mb-1">Durasi (Menit)</label>
              <input 
                type="number" 
                v-model.number="newLog.durationMinutes" 
                min="1" 
                max="180" 
                required
                class="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
              />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-600 uppercase mb-1">Capaian ROM (%)</label>
              <input 
                type="number" 
                v-model.number="newLog.romPercentage" 
                min="0" 
                max="100" 
                required
                class="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
              />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-600 uppercase mb-1">Sesi</label>
              <select 
                v-model="newLog.session"
                class="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
              >
                <option value="Pagi">Pagi</option>
                <option value="Siang">Siang</option>
                <option value="Sore">Sore</option>
              </select>
            </div>
            <div class="sm:col-span-2 lg:col-span-1 flex items-end">
              <button 
                type="submit" 
                :disabled="isSubmitting"
                class="w-full py-2 px-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5 h-[34px] disabled:opacity-70"
              >
                <i v-if="isSubmitting" class="fa-solid fa-circle-notch fa-spin"></i>
                <i v-else class="fa-solid fa-floppy-disk"></i>
                <span>Simpan Rekap</span>
              </button>
            </div>
            <div class="sm:col-span-2 lg:col-span-5">
              <label class="block text-[11px] font-bold text-slate-600 uppercase mb-1">Catatan Evaluasi</label>
              <input 
                type="text" 
                v-model="newLog.notes" 
                placeholder="Evaluasi respon gerak pasien..."
                class="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
              />
            </div>
          </form>
        </div>

        <!-- 3. Tabel Riwayat Latihan Lengkap -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="p-4 bg-slate-50/60 border-b border-slate-100 flex items-center justify-between">
            <h4 class="text-sm font-bold text-slate-800 flex items-center gap-2">
              <i class="fa-solid fa-clock-rotate-left text-slate-500"></i>
              <span>Riwayat Latihan SR Kit</span>
            </h4>
            <span class="text-xs text-slate-500 font-semibold">{{ logs.length }} Catatan</span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <th class="py-2.5 px-4">Tanggal</th>
                  <th class="py-2.5 px-4">Sesi</th>
                  <th class="py-2.5 px-4">Durasi</th>
                  <th class="py-2.5 px-4">Capaian ROM</th>
                  <th class="py-2.5 px-4">Catatan Evaluasi</th>
                  <th class="py-2.5 px-4">Dicatat Oleh</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-medium text-slate-700">
                <tr v-if="!logs.length">
                  <td colspan="6" class="py-8 text-center text-slate-400">
                    Belum ada rekapan latihan untuk pasien ini.
                  </td>
                </tr>
                <tr v-for="log in logs" :key="log.id" class="hover:bg-slate-50/60 transition">
                  <td class="py-3 px-4 font-mono font-semibold">{{ log.date }}</td>
                  <td class="py-3 px-4">
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      {{ log.session }}
                    </span>
                  </td>
                  <td class="py-3 px-4 font-bold text-sky-700">
                    {{ log.durationMinutes }} Menit
                  </td>
                  <td class="py-3 px-4">
                    <div class="flex items-center gap-2">
                      <div class="w-16 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div class="bg-teal-500 h-2 rounded-full" :style="{ width: `${Math.min(100, log.romPercentage)}%` }"></div>
                      </div>
                      <span class="font-bold text-teal-700">{{ log.romPercentage }}%</span>
                    </div>
                  </td>
                  <td class="py-3 px-4 text-slate-600 max-w-xs truncate" :title="log.notes">
                    {{ log.notes || '-' }}
                  </td>
                  <td class="py-3 px-4 text-slate-500 text-[11px]">
                    {{ log.recordedBy }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <!-- MODAL FOOTER -->
      <div class="p-4 bg-white border-t border-slate-200 flex justify-end gap-2 no-print">
        <button 
          @click="$emit('close')"
          class="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
        >
          Tutup
        </button>
      </div>

    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue';

export default {
  name: 'PatientModal',
  props: {
    patient: Object,
    logs: {
      type: Array,
      default: () => []
    },
    isSubmitting: Boolean
  },
  emits: ['close', 'save-log'],
  setup(props, { emit }) {
    const chartCanvas = ref(null);
    let chartInstance = null;

    const newLog = reactive({
      date: new Date().toISOString().split('T')[0],
      durationMinutes: 30,
      romPercentage: 75,
      session: 'Pagi',
      notes: ''
    });

    const averageRom = computed(() => {
      if (!props.logs.length) return 0;
      const sum = props.logs.reduce((acc, curr) => acc + Number(curr.romPercentage), 0);
      return Math.round(sum / props.logs.length);
    });

    const totalMinutes = computed(() => {
      if (!props.logs.length) return 0;
      return props.logs.reduce((acc, curr) => acc + Number(curr.durationMinutes), 0);
    });

    const updateChart = () => {
      if (!chartCanvas.value) return;
      if (chartInstance) chartInstance.destroy();

      const lastLogs = [...props.logs].slice(-7);
      const labels = lastLogs.map(l => `${l.date} (${l.session})`);
      const durations = lastLogs.map(l => Number(l.durationMinutes));
      const roms = lastLogs.map(l => Number(l.romPercentage));

      chartInstance = new Chart(chartCanvas.value.getContext('2d'), {
        data: {
          labels: labels.length ? labels : ['Belum Ada Sesi'],
          datasets: [
            {
              type: 'bar',
              label: 'Durasi (Menit)',
              data: durations.length ? durations : [0],
              backgroundColor: 'rgba(2, 132, 199, 0.75)',
              borderRadius: 6,
              yAxisID: 'yDuration'
            },
            {
              type: 'line',
              label: 'Capaian ROM (%)',
              data: roms.length ? roms : [0],
              borderColor: '#0d9488',
              backgroundColor: 'rgba(13, 148, 136, 0.1)',
              borderWidth: 3,
              fill: true,
              yAxisID: 'yRom'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            yDuration: { type: 'linear', position: 'left', min: 0 },
            yRom: { type: 'linear', position: 'right', min: 0, max: 100 }
          }
        }
      });
    };

    onMounted(() => {
      nextTick(updateChart);
    });

    watch(() => props.logs, () => {
      nextTick(updateChart);
    }, { deep: true });

    const submitLog = () => {
      emit('save-log', { ...newLog });
      newLog.notes = '';
    };

    const printReport = () => {
      window.print();
    };

    return {
      chartCanvas,
      newLog,
      averageRom,
      totalMinutes,
      submitLog,
      printReport
    };
  }
};
</script>
