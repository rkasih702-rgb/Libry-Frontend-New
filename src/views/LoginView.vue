<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import API from '@/services/api'

const router = useRouter()

const isRegisterMode = ref(false)
const role = ref<'pengunjung' | 'admin'>('pengunjung')

const username = ref('zen')
const password = ref('')
const namaLengkap = ref('')
const showPassword = ref(false)

const errorMessage = ref('')
const isLoading = ref(false)

const handleSubmit = async () => {
  errorMessage.value = ''
  isLoading.value = true

  try {
    if (isRegisterMode.value) {
      // ----------------------------------------------------
      // 1. PROSES REGISTER
      // ----------------------------------------------------
      const registerPayload = {
        username: username.value,
        password: password.value,
        nama: namaLengkap.value || username.value,
        role: role.value === 'admin' ? 'admin' : 'pengunjung'
      }

      await API.post('/register', registerPayload)

      alert(`Pendaftaran akun untuk "${namaLengkap.value || username.value}" berhasil! Silakan masuk.`)
      isRegisterMode.value = false
      password.value = ''
      namaLengkap.value = ''

    } else {
      // ----------------------------------------------------
      // 2. PROSES LOGIN
      // ----------------------------------------------------
      // BERSIHKAN DATA LAMA AGAR AKUN SEBELUMNYA (MISAL: RAY) TIDAK NYANGKUT
      localStorage.clear()

      const loginPayload = {
        username: username.value,
        password: password.value
      }

      const response = await API.post('/login', loginPayload)

      // Ambil token dari respon backend Go
      const token = response.data.token || response.data.data?.token || response.data.access_token
      const userRole = response.data.role || response.data.data?.role || role.value
      const loggedUsername = response.data.username || response.data.data?.username || username.value

      if (token) {
        // Simpan data sesi baru milik user yang sedang login (Zen)
        localStorage.setItem('token', token)
        localStorage.setItem('nama_user', loggedUsername)
        localStorage.setItem('role', userRole)

        // Redirect sesuai role
        if (role.value === 'admin' || userRole === 'admin' || userRole === 'petugas') {
          router.push('/admin/buku')
        } else {
          router.push({ 
            path: '/user/katalog', 
            query: { nama: loggedUsername } 
          })
        }
      } else {
        errorMessage.value = 'Login berhasil, tetapi token tidak ditemukan dari respon server.'
      }
    }
  } catch (error: any) {
    console.error('Terjadi kesalahan login:', error)
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage.value = error.response.data.message
    } else if (error.response && error.response.status === 401) {
      errorMessage.value = 'Username atau password salah!'
    } else {
      errorMessage.value = 'Gagal terhubung ke server Go. Pastikan server backend aktif.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#fdfbf7] text-stone-800 flex items-center justify-center p-4 font-sans">
    <div class="w-full max-w-md bg-white border border-stone-200 rounded-2xl p-8 shadow-xl space-y-6">
      
      <!-- Logo SVG -->
      <div class="text-center space-y-3">
        <div class="w-12 h-12 bg-[#8B5A2B]/10 text-[#8B5A2B] rounded-2xl border border-[#8B5A2B]/20 flex items-center justify-center mx-auto shadow-inner">
          <svg class="w-6 h-6 text-[#8B5A2B]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
          </svg>
        </div>
        <div>
          <h1 class="text-xl font-bold text-stone-900 tracking-wide">
            {{ isRegisterMode ? 'Daftar Akun Baru' : 'Perpustakaan Digital' }}
          </h1>
          <p class="text-xs text-stone-500 mt-1">
            {{ isRegisterMode ? 'Lengkapi data untuk mendaftar' : 'Masuk ke akun Anda untuk melanjutkan' }}
          </p>
        </div>
      </div>

      <!-- Tab Pilih Peran (Pengunjung / Admin) -->
      <div class="grid grid-cols-2 gap-2 bg-[#f4efe6] p-1.5 rounded-xl border border-stone-200">
        <button 
          type="button"
          @click="role = 'pengunjung'"
          :class="role === 'pengunjung' ? 'bg-[#8B5A2B] text-white shadow-md' : 'text-stone-600 hover:text-stone-900'"
          class="py-2 text-xs font-semibold rounded-lg transition duration-200 cursor-pointer"
        >
          Pengunjung / Anggota
        </button>
        <button 
          type="button"
          @click="role = 'admin'"
          :class="role === 'admin' ? 'bg-[#8B5A2B] text-white shadow-md' : 'text-stone-600 hover:text-stone-900'"
          class="py-2 text-xs font-semibold rounded-lg transition duration-200 cursor-pointer"
        >
          Admin / Petugas
        </button>
      </div>

      <!-- Peringatan Pesan Kesalahan -->
      <div v-if="errorMessage" class="bg-rose-50 border border-rose-200 text-rose-700 px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-2">
        <span>⚠️</span>
        <p>{{ errorMessage }}</p>
      </div>

      <!-- Form Utama -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        
        <!-- Input Nama Lengkap (Register Mode) -->
        <div v-if="isRegisterMode" class="space-y-1.5">
          <label class="text-[11px] font-semibold text-stone-700">Nama Lengkap</label>
          <input 
            v-model="namaLengkap" 
            type="text" 
            placeholder="Masukkan nama lengkap..." 
            required
            class="w-full bg-[#fdfbf7] border border-stone-200 focus:border-[#8B5A2B] rounded-xl px-3.5 py-2.5 text-xs text-stone-800 placeholder-stone-400 focus:outline-none transition"
          />
        </div>

        <div class="space-y-1.5">
          <label class="text-[11px] font-semibold text-stone-700">
            {{ role === 'admin' ? 'NIP / Username Admin' : 'Username / NISN' }}
          </label>
          <input 
            v-model="username" 
            type="text" 
            placeholder="Masukkan username..." 
            required
            class="w-full bg-[#fdfbf7] border border-stone-200 focus:border-[#8B5A2B] rounded-xl px-3.5 py-2.5 text-xs text-stone-800 placeholder-stone-400 focus:outline-none transition"
          />
        </div>

        <!-- Input Password -->
        <div class="space-y-1.5">
          <label class="text-[11px] font-semibold text-stone-700">Password</label>
          <div class="relative">
            <input 
              v-model="password" 
              :type="showPassword ? 'text' : 'password'" 
              placeholder="••••••••" 
              required
              class="w-full bg-[#fdfbf7] border border-stone-200 focus:border-[#8B5A2B] rounded-xl px-3.5 py-2.5 pr-10 text-xs text-stone-800 placeholder-stone-400 focus:outline-none transition"
            />
            <button 
              type="button" 
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8B5A2B] hover:text-[#704721] focus:outline-none cursor-pointer"
            >
              <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.027 10.027 0 014.132-5.411m3.89-1.315A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21m-4.125-2.175L9.88 9.88M3 3l18 18" />
              </svg>
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          :disabled="isLoading"
          class="w-full bg-[#8B5A2B] hover:bg-[#704721] text-white font-semibold text-xs py-3 rounded-xl shadow-md shadow-[#8B5A2B]/20 transition duration-200 mt-2 cursor-pointer disabled:opacity-50"
        >
          <span v-if="isLoading">Memproses...</span>
          <span v-else>
            {{ isRegisterMode ? 'Daftar Sekarang' : (role === 'pengunjung' ? 'Masuk sebagai Pengunjung' : 'Masuk sebagai Admin') }}
          </span>
        </button>
      </form>

      <!-- Toggle Register / Login -->
      <div class="text-center pt-2 border-t border-stone-100">
        <p class="text-xs text-stone-500">
          {{ isRegisterMode ? 'Sudah punya akun?' : 'Belum punya akun?' }}
          <button 
            type="button"
            @click="isRegisterMode = !isRegisterMode; errorMessage = ''"
            class="text-[#8B5A2B] font-semibold hover:underline ml-1 focus:outline-none cursor-pointer"
          >
            {{ isRegisterMode ? 'Masuk di sini' : 'Daftar sekarang' }}
          </button>
        </p>
      </div>

    </div>
  </div>
</template>