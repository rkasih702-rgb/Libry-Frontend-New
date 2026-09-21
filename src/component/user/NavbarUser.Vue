<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const isLoggedIn = ref(true)
const username = ref('Anggota Demo')
const roleName = ref('Anggota')
const jumlahPinjaman = ref(2)
</script>

<template>
  <header class="bg-[#141f36] border-b border-slate-800 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
      
      <!-- LOGO / BRAND -->
      <div class="flex items-center gap-3 cursor-pointer" @click="router.push('/')">
        <div class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-blue-600/30">
          📚
        </div>
        <div>
          <h1 class="font-bold text-lg text-white leading-tight">RuangPustaka</h1>
          <p class="text-[10px] text-slate-400">Sistem Perpustakaan Digital</p>
        </div>
      </div>

      <!-- NAVIGASI UTAMA USER -->
      <nav class="hidden md:flex items-center gap-2">
        <button 
          @click="router.push('/')" 
          :class="route.path === '/' ? 'bg-blue-600/20 text-blue-400 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'"
          class="px-4 py-2 rounded-xl text-sm transition cursor-pointer"
        >
          Katalog Buku
        </button>

        <button 
          @click="router.push('/pinjaman-saya')" 
          :class="route.path === '/pinjaman-saya' ? 'bg-blue-600/20 text-blue-400 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'"
          class="px-4 py-2 rounded-xl text-sm transition cursor-pointer flex items-center gap-2"
        >
          <span>Pinjaman Saya</span>
          <span v-if="jumlahPinjaman > 0" class="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
            {{ jumlahPinjaman }}
          </span>
        </button>
      </nav>

      <!-- PROFIL / LOGIN -->
      <div class="flex items-center gap-3">
        <div v-if="isLoggedIn" class="flex items-center gap-3 bg-[#0b132b] border border-slate-800 px-3 py-1.5 rounded-xl">
          <div class="w-8 h-8 rounded-lg bg-blue-600/30 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-xs uppercase">
            {{ username.substring(0, 2) }}
          </div>
          <div class="hidden sm:block text-left">
            <p class="text-xs font-semibold text-slate-200">{{ username }}</p>
            <p class="text-[10px] text-emerald-400">● {{ roleName }}</p>
          </div>
        </div>

        <button v-else @click="router.push('/login')" class="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer shadow-md">
          Masuk / Login
        </button>
      </div>

    </div>
  </header>
</template>