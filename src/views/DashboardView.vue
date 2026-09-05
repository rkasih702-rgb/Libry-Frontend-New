<template>
  <div class="flex min-h-screen bg-[#0b132b] text-white font-sans">
    
    <!-- SIDEBAR LEFT -->
    <aside class="w-64 bg-[#141f36] border-r border-slate-800/60 flex flex-col justify-between p-6 shrink-0">
      <div>
        <!-- Profil Admin Dinamis -->
        <div class="flex items-center gap-3 mb-10">
          <div class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm uppercase">
            {{ getInitial(adminName) }}
          </div>
          <span class="font-bold text-lg text-slate-100 truncate">{{ adminName }}</span>
        </div>

        <!-- Navigation Menu -->
        <nav class="space-y-3">
          <button @click="router.push('/dashboard')" class="w-full text-left px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm transition cursor-pointer">
            Dashboard
          </button>
          <button @click="router.push('/data-buku')" class="w-full text-left px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/40 font-semibold text-sm transition cursor-pointer">
            Data Buku
          </button>
          <button @click="router.push('/data-petugas')" class="w-full text-left px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/40 font-semibold text-sm transition cursor-pointer">
            Data Petugas
          </button>
          <button @click="router.push('/jadwal-shift')" class="w-full text-left px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/40 font-semibold text-sm transition cursor-pointer">
            Jadwal Shift
          </button>
          <button @click="router.push('/fasilitas')" class="w-full text-left px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/40 font-semibold text-sm transition cursor-pointer">
            Fasilitas
          </button>
        </nav>
      </div>

      <!-- Logout Button -->
      <button @click="logout" class="flex items-center gap-2 text-slate-400 hover:text-red-400 font-semibold text-sm px-4 py-2 transition cursor-pointer">
        Logout 🚪
      </button>
    </aside>

    <!-- MAIN CONTENT RIGHT -->
    <main class="flex-1 p-8 space-y-8 overflow-y-auto">
      
      <!-- Welcome Banner -->
      <div class="bg-linear-to-r from-[#213b80] to-[#1c2c5c] p-8 rounded-2xl border border-blue-500/20 shadow-lg">
        <h1 class="text-2xl font-bold mb-1">Selamat Datang, {{ adminName }}!</h1>
        <p class="text-xs text-slate-300">Manajemen Data & Pantauan Kehadiran Perpustakaan Libry</p>
      </div>

      <!-- Stats Cards Container -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <!-- Card 1: Total Buku -->
        <div class="bg-[#1c2b4a] p-5 rounded-xl border border-slate-700/40 text-center flex flex-col items-center shadow-md">
          <div class="w-12 h-12 bg-slate-700/40 rounded-full flex items-center justify-center mb-3 text-xl">
            📖
          </div>
          <p class="text-xs font-semibold text-slate-300">Total Buku</p>
          <h2 class="text-3xl font-extrabold my-1">120</h2>
          <p class="text-[11px] text-slate-400">Baru: 20</p>
        </div>

        <!-- Card 2: Total Petugas -->
        <div class="bg-[#1c2b4a] p-5 rounded-xl border border-slate-700/40 text-center flex flex-col items-center shadow-md">
          <div class="w-12 h-12 bg-slate-700/40 rounded-full flex items-center justify-center mb-3 text-xl">
            👥
          </div>
          <p class="text-xs font-semibold text-slate-300">Total Petugas</p>
          <h2 class="text-3xl font-extrabold my-1">6</h2>
          <p class="text-[11px] text-slate-400">Aktif: 6</p>
        </div>

        <!-- Card 3: Shift Aktif -->
        <div class="bg-[#1c2b4a] p-5 rounded-xl border border-slate-700/40 text-center flex flex-col items-center shadow-md">
          <div class="w-12 h-12 bg-slate-700/40 rounded-full flex items-center justify-center mb-3 text-xl">
            📅
          </div>
          <p class="text-xs font-semibold text-slate-300">Shift Aktif</p>
          <h2 class="text-3xl font-extrabold my-1">2</h2>
          <p class="text-[11px] text-slate-400">Pagi, siang</p>
        </div>

        <!-- Card 4: Total Fasilitas -->
        <div class="bg-[#1c2b4a] p-5 rounded-xl border border-slate-700/40 text-center flex flex-col items-center shadow-md">
          <div class="w-12 h-12 bg-slate-700/40 rounded-full flex items-center justify-center mb-3 text-xl">
            🏛️
          </div>
          <p class="text-xs font-semibold text-slate-300">Total Fasilitas</p>
          <h2 class="text-3xl font-extrabold my-1">12</h2>
          <p class="text-[11px] text-slate-400">Meja, Kursi, Lemari</p>
        </div>

      </div>

    </main>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const adminName = ref('Kasih Rizal')

onMounted(() => {
  const savedName = localStorage.getItem('adminName')
  if (savedName) {
    adminName.value = savedName
  }
})

const getInitial = (name) => {
  if (!name) return 'A'
  const parts = name.trim().split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

const logout = () => {
  localStorage.removeItem('adminName')
  router.push('/')
}
</script>