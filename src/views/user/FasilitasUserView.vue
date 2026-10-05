<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const namaUser = computed(() => (route.query.nama as string) || 'Kasih')
const inisialUser = computed(() => namaUser.value.substring(0, 2).toUpperCase())

const facilities = ref([
  { id: 1, name: 'Ruang Baca AC & Nyaman', category: 'Ruangan', capacity: '40 Orang', status: 'Tersedia', desc: 'Ruangan ber-AC dengan pencahayaan optimal yang dirancang tenang untuk membaca buku dalam waktu lama.' },
  { id: 2, name: 'Komputer & Akses Internet', category: 'Teknologi', capacity: '10 Unit PC', status: 'Tersedia', desc: 'Fasilitas komputer untuk mencari referensi e-book, jurnal digital, dan pengerjaan tugas akademik.' },
  { id: 3, name: 'Ruang Diskusi Kelompok', category: 'Ruangan', capacity: '6 Orang / Ruang', status: 'Digunakan', desc: 'Ruang khusus kedap suara yang dilengkapi meja diskusi dan papan tulis untuk kerja kelompok.' },
  { id: 4, name: 'Loker Penyimpanan Barang', category: 'Fasilitas Umum', capacity: '30 Kotak', status: 'Tersedia', desc: 'Tempat titipan tas dan barang bawaan pengunjung yang aman menggunakan kunci pribadi.' }
])
</script>

<template>
  <div class="min-h-screen bg-[#fdfbf7] text-stone-800 flex font-sans">
    
    <!-- SIDEBAR -->
    <aside class="w-64 bg-[#f4efe6] border-r border-stone-200 p-6 flex flex-col justify-between shrink-0 hidden md:flex shadow-sm">
      <div class="space-y-6">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-[#f5ede4] border border-[#e6d5c3] flex items-center justify-center text-[#8B5A2B] shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8B5A2B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-0-5H20"/></svg>
          </div>
          <span class="font-bold text-sm tracking-wide text-stone-900">Perpustakaan Digital</span>
        </div>

        <div class="bg-white p-3.5 rounded-2xl border border-stone-200/80 flex items-center gap-3 shadow-sm">
          <div class="w-10 h-10 rounded-full bg-[#8B5A2B] flex items-center justify-center font-bold text-sm text-white shadow-md">
            {{ inisialUser }}
          </div>
          <div class="overflow-hidden">
            <h2 class="font-bold text-xs text-stone-900 truncate capitalize">{{ namaUser }}</h2>
            <p class="text-[10px] text-stone-500">Pengunjung Perpustakaan</p>
          </div>
        </div>

        <!-- NAVIGASI LENGKAP DENGAN /user/ -->
        <nav class="space-y-1.5">
          <router-link :to="{ path: '/user/katalog', query: { nama: namaUser } }" class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-200/50 transition">
            <span>📖</span> Katalog Buku
          </router-link>
          <router-link :to="{ path: '/user/peminjaman', query: { nama: namaUser } }" class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-200/50 transition">
            <span>📋</span> Pinjaman Saya
          </router-link>
          <router-link :to="{ path: '/user/fasilitas', query: { nama: namaUser } }" class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-[#8B5A2B] text-white shadow-md transition">
            <span>🏢</span> Fasilitas Gedung
          </router-link>
        </nav>
      </div>

      <router-link to="/login" class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition">
        <span>🚪</span> Keluar Akun
      </router-link>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="flex-1 p-8 overflow-y-auto">
      <div class="max-w-6xl mx-auto space-y-6">
        
        <!-- HEADER -->
        <div class="bg-white border border-stone-200 p-6 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <h1 class="text-xl font-bold text-stone-900 mb-1 font-serif">Fasilitas Perpustakaan</h1>
            <p class="text-xs text-stone-500">Daftar fasilitas penunjang kenyamanan yang bisa dinikmati oleh pengunjung.</p>
          </div>
          <div class="text-xs font-semibold text-stone-600 bg-stone-100 px-3.5 py-2 rounded-xl border border-stone-200">
            Akun: <span class="text-stone-900 font-bold capitalize">{{ namaUser }}</span>
          </div>
        </div>

        <!-- FACILITIES GRID -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="facility in facilities" :key="facility.id" class="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition">
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-stone-100 text-stone-600">{{ facility.category }}</span>
                <span :class="['text-[10px] font-bold px-2.5 py-1 rounded-lg', facility.status === 'Tersedia' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700']">
                  {{ facility.status }}
                </span>
              </div>
              <div>
                <h3 class="font-bold text-base text-stone-900 mb-1">{{ facility.name }}</h3>
                <p class="text-xs text-stone-500 leading-relaxed">{{ facility.desc }}</p>
              </div>
            </div>
            
            <div class="pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
              <span class="text-stone-500">Kapasitas: <strong class="text-stone-800">{{ facility.capacity }}</strong></span>
              <span class="text-stone-400 font-medium">Bebas Digunakan</span>
            </div>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>