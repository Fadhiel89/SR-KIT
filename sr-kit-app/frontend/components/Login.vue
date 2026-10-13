<template>
  <!-- Komponen Halaman Login Medis SR Kit -->
  <div class="min-h-screen hero-pattern flex items-center justify-center p-4 sm:p-6">
    <div class="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-8 sm:p-10 relative overflow-hidden transition-all duration-300">
      
      <!-- Accent Garis Medis Atas -->
      <div class="absolute top-0 left-0 right-0 h-2 medical-gradient"></div>

      <!-- Header & Logo Brand -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-600 to-teal-500 text-white shadow-lg shadow-sky-500/25 mb-4">
          <i class="fa-solid fa-heart-pulse text-2xl"></i>
        </div>
        <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">SR Kit System</h1>
        <p class="text-xs uppercase tracking-widest font-semibold text-sky-600 mt-1">Stroke Rehabilitation Kit</p>
        <p class="text-sm text-slate-500 mt-2">Masuk ke sistem monitoring dan analisis data pasien</p>
      </div>

      <!-- Form Login -->
      <form @submit.prevent="submitLogin" class="space-y-5">
        <!-- Input Email -->
        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Email Tenaga Medis</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <i class="fa-regular fa-envelope"></i>
            </span>
            <input 
              type="email" 
              v-model="email" 
              placeholder="nama@srkit.med"
              required
              class="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
            />
          </div>
        </div>

        <!-- Input Password -->
        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Kata Sandi</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <i class="fa-solid fa-lock"></i>
            </span>
            <input 
              type="password" 
              v-model="password" 
              placeholder="••••••••"
              required
              class="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
            />
          </div>
        </div>

        <!-- Tombol Masuk -->
        <button 
          type="submit" 
          :disabled="isLoading"
          class="w-full py-3.5 px-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl shadow-lg shadow-sky-600/30 transition flex items-center justify-center gap-2 disabled:opacity-70"
        >
          <i v-if="isLoading" class="fa-solid fa-circle-notch fa-spin"></i>
          <span v-if="!isLoading">Masuk ke Dashboard</span>
          <span v-else>Memverifikasi...</span>
        </button>
      </form>

      <!-- Divider Akses Demo -->
      <div class="relative my-6 text-center">
        <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-slate-200"></div></div>
        <span class="relative px-3 bg-white text-xs font-medium text-slate-400 uppercase tracking-wider">Akses Cepat Demo</span>
      </div>

      <!-- Tombol Demo Login Cepat -->
      <div class="grid grid-cols-2 gap-3">
        <button 
          type="button" 
          @click="loginAs('dokter')"
          class="flex items-center justify-center gap-2 py-2.5 px-3 bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-semibold rounded-xl border border-sky-200 transition"
        >
          <i class="fa-solid fa-user-doctor text-sky-600"></i>
          <span>Demo Dokter (Sp.S)</span>
        </button>
        <button 
          type="button" 
          @click="loginAs('perawat')"
          class="flex items-center justify-center gap-2 py-2.5 px-3 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold rounded-xl border border-teal-200 transition"
        >
          <i class="fa-solid fa-user-nurse text-teal-600"></i>
          <span>Demo Perawat</span>
        </button>
      </div>

    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'LoginView',
  props: {
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['login', 'quick-login'],
  setup(props, { emit }) {
    const email = ref('');
    const password = ref('');

    const submitLogin = () => {
      emit('login', { email: email.value, password: password.value });
    };

    const loginAs = (role) => {
      if (role === 'dokter') {
        email.value = 'dokter@srkit.med';
        password.value = 'dokter123';
      } else {
        email.value = 'perawat@srkit.med';
        password.value = 'perawat123';
      }
      submitLogin();
    };

    return {
      email,
      password,
      submitLogin,
      loginAs
    };
  }
};
</script>
