<template>
  <aside class="w-64 bg-[#141f36] border-r border-slate-800 hidden flex-col justify-between shrink-0 md:flex min-h-screen">
    <div>
      <!-- LOGO BRANDING -->
      <div class="p-6 flex items-center gap-3 border-b border-slate-800/80">
        <div class="w-10 h-10 rounded-xl bg-linear-to-r from-blue-600 to-indigo-500 hidden items-center justify-center text-xl shadow-lg shadow-blue-500/20">
          📚
        </div>
        <div>
          <h1 class="text-lg font-extrabold tracking-wider text-white">LIBRY</h1>
          <p class="text-[10px] text-slate-400">Digital Library System</p>
        </div>
      </div>

      <!-- 5 MAIN MENU -->
      <nav class="p-4 space-y-1">
        <p class="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Main Menu</p>
        
        <router-link 
          to="/dashboard" 
          active-class="bg-blue-600 text-white shadow-lg shadow-blue-600/30" 
          class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
        >
          <span>📊</span> Dashboard
        </router-link>

        <router-link 
          to="/data-buku" 
          active-class="bg-blue-600 text-white shadow-lg shadow-blue-600/30" 
          class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
        >
          <span>📖</span> Data Buku
        </router-link>

        <router-link 
          to="/data-petugas" 
          active-class="bg-blue-600 text-white shadow-lg shadow-blue-600/30" 
          class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
        >
          <span>👨‍💼</span> Data Petugas
        </router-link>

        <router-link 
          to="/jadwal-shift" 
          active-class="bg-blue-600 text-white shadow-lg shadow-blue-600/30" 
          class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
        >
          <span>📅</span> Jadwal Shift
        </router-link>

        <router-link 
          to="/fasilitas" 
          active-class="bg-blue-600 text-white shadow-lg shadow-blue-600/30" 
          class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
        >
          <span>🏛️</span> Fasilitas
        </router-link>
      </nav>
    </div>

    <!-- PROFILE / LOGOUT -->
    <div class="p-4 border-t border-slate-800/80">
      <div class="flex items-center justify-between p-2 rounded-xl bg-[#0b132b]/60 border border-slate-800">
        <div class="flex items-center gap-2.5 min-w-0">
          <div class="w-8 h-8 rounded-lg bg-blue-600/30 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
            GC
          </div>
          <div class="truncate">
            <p class="text-xs font-bold text-white truncate">Gawin Caskey</p>
            <p class="text-[10px] text-slate-400 truncate">Administrator</p>
          </div>
        </div>
        <button @click="handleLogout" class="text-slate-400 hover:text-rose-400 text-sm transition p-1 cursor-pointer" title="Keluar">
          🚪
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleLogout = () => {
  localStorage.removeItem('isLoggedIn')
  router.push('/login')
}
</script>