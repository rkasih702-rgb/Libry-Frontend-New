<script setup lang="ts">
import { ref } from 'vue'

const stats = ref([
  { title: 'Total Buku', value: '1,240', desc: '+12 buku minggu ini' },
  { title: 'Total Petugas', value: '8', desc: 'Semua aktif' },
  { title: 'Fasilitas', value: '5 Ruang', desc: '4 Tersedia, 1 Perawatan' },
  { title: 'Peminjaman Aktif', value: '42', desc: '8 Perlu pengembalian' }
])

const recentActivities = ref([
  { id: 1, user: 'Ray Admin', action: 'Menambahkan fasilitas baru (Ruang TV)', time: '10 menit yang lalu' },
  { id: 2, user: 'Budi Pustakawan', action: 'Memperbarui jadwal shift kerja', time: '1 jam yang lalu' },
  { id: 3, user: 'Siti Staff', action: 'Menambahkan 5 data buku baru', time: '3 jam yang lalu' }
])
</script>

<template>
  <div class="min-h-screen bg-[#fdfbf7] text-stone-800 flex font-sans">
    <aside class="w-64 bg-[#f4efe6] border-r border-stone-200 p-6 flex flex-col justify-between shrink-0 min-h-screen shadow-sm">
      <div class="space-y-8">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-[#8B5A2B] flex items-center justify-center font-bold text-sm text-white shadow-md">RA</div>
          <div>
            <h2 class="font-bold text-xs text-stone-900 leading-tight">Ray</h2>
            <p class="text-[10px] text-stone-500">Administrator</p>
          </div>
        </div>
        <nav class="space-y-1.5">
          <router-link to="/dashboard" class="block px-4 py-3 rounded-xl text-xs font-semibold bg-[#8B5A2B] text-white shadow-md">Dashboard</router-link>
          <router-link to="/admin/buku" class="block px-4 py-3 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-200/50 hover:text-stone-900 transition">Data Buku</router-link>
          <router-link to="/admin/petugas" class="block px-4 py-3 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-200/50 hover:text-stone-900 transition">Data Petugas</router-link>
          <router-link to="/admin/jadwal" class="block px-4 py-3 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-200/50 hover:text-stone-900 transition">Jadwal Shift</router-link>
          <router-link to="/admin/fasilitas" class="block px-4 py-3 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-200/50 hover:text-stone-900 transition">Fasilitas</router-link>
        </nav>
      </div>
      <router-link to="/admin/login" class="text-xs text-stone-500 hover:text-rose-600 transition flex items-center justify-between pt-6 border-t border-stone-200 font-medium">
        <span>Logout</span>
        <span class="w-2 h-2 rounded-full bg-amber-500"></span>
      </router-link>
    </aside>

    <main class="flex-1 p-8 overflow-y-auto">
      <div class="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 class="text-xl font-bold text-stone-900 mb-1">Halaman Admin</h1>
          <p class="text-xs text-stone-500">Selamat datang kembali, Ray! Berikut ringkasan sistem perpustakaan saat ini.</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="(stat, index) in stats" :key="index" class="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-2">
            <p class="text-xs text-stone-400 font-medium">{{ stat.title }}</p>
            <h3 class="text-2xl font-bold text-stone-900">{{ stat.value }}</h3>
            <p class="text-[10px] text-stone-500">{{ stat.desc }}</p>
          </div>
        </div>

        <div class="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 class="text-sm font-bold text-stone-900">Aktivitas Terakhir Admin & Petugas</h2>
          <div class="space-y-3">
            <div v-for="act in recentActivities" :key="act.id" class="flex items-center justify-between p-3.5 rounded-xl bg-[#fdfbf7] border border-stone-200/80 text-xs">
              <div class="flex items-center gap-3">
                <div class="w-2 h-2 rounded-full bg-[#8B5A2B]"></div>
                <div>
                  <span class="font-bold text-stone-900">{{ act.user }}</span>
                  <span class="text-stone-600 ml-1.5">{{ act.action }}</span>
                </div>
              </div>
              <span class="text-[10px] text-stone-400">{{ act.time }}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>