<template>
  <div class="min-h-screen bg-[#0b132b] flex items-center justify-center p-4 font-sans text-white">
    <div class="bg-[#1c2b4a] border border-slate-700/60 rounded-2xl p-8 w-full max-w-md shadow-2xl space-y-6">
      
      <!-- LOGO & HEADER -->
      <div class="text-center space-y-2">
        <div class="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-3xl mx-auto shadow-lg shadow-blue-600/30">
          📚
        </div>
        <h1 class="text-2xl font-extrabold tracking-wide">LIBRY SYSTEM</h1>
        <p class="text-xs text-slate-400">Masukkan akun admin untuk masuk ke sistem</p>
      </div>

      <!-- PESAN ERROR -->
      <div v-if="errorMessage" class="bg-red-500/20 border border-red-500/50 text-red-300 text-xs p-3 rounded-xl text-center">
        {{ errorMessage }}
      </div>

      <!-- FORM LOGIN -->
      <form @submit.prevent="handleLogin" class="space-y-4 text-sm">
        <div>
          <label class="block text-slate-300 mb-1 font-semibold">Email / Username</label>
          <input 
            v-model="username" 
            type="text" 
            placeholder="Masukkan email..." 
            class="w-full bg-[#0b132b] border border-slate-700/60 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
            required 
          />
        </div>

        <div>
          <label class="block text-slate-300 mb-1 font-semibold">Password</label>
          <input 
            v-model="password" 
            type="password" 
            placeholder="Masukkan password..." 
            class="w-full bg-[#0b132b] border border-slate-700/60 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
            required 
          />
        </div>

        <button 
          type="submit" 
          :disabled="isLoading"
          class="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-blue-600/30 cursor-pointer mt-2 flex items-center justify-center gap-2"
        >
          <span v-if="isLoading">Memproses...</span>
          <span v-else>Masuk ke Dashboard</span>
        </button>
      </form>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const username = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

// MINTA URL API INI DARI PARTNER BACKEND KAMU
const API_LOGIN_URL = 'http://localhost:8000/api/login' 

const handleLogin = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    // TEMBAK API VIA AXIOS
    const response = await axios.post(API_LOGIN_URL, {
      email: username.value,
      password: password.value
    })

    const adminName = response.data.user?.name || response.data.name || username.value
    const token = response.data.token

    localStorage.setItem('adminName', adminName)
    if (token) {
      localStorage.setItem('token', token)
    }

    router.push('/dashboard')

  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Gagal login. Periksa username & password!'
  } finally {
    isLoading.value = false
  }
}
</script>