<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const nip = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

const handleAdminLogin = () => {
  if (!nip.value || !password.value) {
    errorMessage.value = 'Silakan isi NIP / ID Petugas dan kata sandi.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  // Simulasi proses login admin
  setTimeout(() => {
    isLoading.value = false
    router.push('/dashboard')
  }, 1000)
}
</script>

<template>
  <div class="min-h-screen bg-[#f7f4ee] text-stone-800 flex items-center justify-center p-4 font-sans">
    
    <!-- Card Utama Login Admin (Murni Khusus Admin) -->
    <div class="w-full max-w-md bg-white border border-stone-200/80 rounded-3xl p-8 shadow-xl relative overflow-hidden">
      
      <!-- Efek Background Glow Khusus Admin -->
      <div class="absolute -top-12 -right-12 w-32 h-32 bg-[#5c3a21]/10 rounded-full blur-2xl"></div>
      <div class="absolute -bottom-12 -left-12 w-32 h-32 bg-stone-300/30 rounded-full blur-2xl"></div>

      <!-- Icon & Header -->
      <div class="text-center space-y-2 mb-8 relative z-10">
        <div class="inline-flex items-center justify-center w-14 h-14 bg-[#5c3a21] text-white rounded-2xl mb-2 shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h1 class="text-2xl font-extrabold tracking-tight text-stone-900">Perpustakaan Digital</h1>
        <p class="text-stone-500 text-xs">Sistem Pengelolaan Khusus Admin & Petugas</p>
      </div>

      <!-- Form Login -->
      <form @submit.prevent="handleAdminLogin" class="space-y-4 relative z-10">
        
        <!-- Pesan Error -->
        <div v-if="errorMessage" class="bg-rose-50 border border-rose-200 text-rose-600 text-xs p-3 rounded-xl text-center font-medium">
          {{ errorMessage }}
        </div>

        <div>
          <label class="block text-xs font-semibold text-stone-700 mb-1.5">NIP / ID Petugas</label>
          <input 
            v-model="nip"
            type="text" 
            placeholder="Contoh: PST-2026-001"
            class="w-full bg-[#fdfbf7] border border-stone-200 text-stone-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#5c3a21] transition placeholder:text-stone-400"
            required
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-stone-700 mb-1.5">Kata Sandi Admin</label>
          <div class="relative">
            <input 
              v-model="password"
              :type="showPassword ? 'text' : 'password'" 
              placeholder="••••••••"
              class="w-full bg-[#fdfbf7] border border-stone-200 text-stone-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#5c3a21] transition placeholder:text-stone-400 pr-12"
              required
            />
            <button 
              type="button" 
              @click="showPassword = !showPassword"
              class="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs cursor-pointer"
            >
              <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.032 10.032 0 013.388-4.529M6.5 6.5l11 11" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Tombol Aksi Masuk -->
        <button 
          type="submit"
          :disabled="isLoading"
          class="w-full bg-[#5c3a21] hover:bg-[#432a18] text-white font-bold py-3.5 rounded-xl transition shadow-sm text-xs flex items-center justify-center gap-2 mt-2 cursor-pointer"
        >
          <span v-if="isLoading" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
          <span>{{ isLoading ? 'Memverifikasi Akses...' : 'Masuk sebagai Admin' }}</span>
        </button>
      </form>

      <!-- Footer Info -->
      <div class="mt-8 text-center text-[11px] text-stone-400 relative z-10 border-t border-stone-100 pt-4 space-y-1">
        <p>Butuh bantuan teknis? Hubungi <span class="text-[#5c3a21] font-semibold underline cursor-pointer">Super Administrator</span></p>
        <p class="text-[10px] text-stone-400">Perpustakaan System v1.0 • Vue 3 & Vite</p>
      </div>
    </div>
  </div>
</template>