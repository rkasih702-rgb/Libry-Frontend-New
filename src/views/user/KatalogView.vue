<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Ambil nama dari URL query, default ke 'Pengunjung'
const namaUser = computed(() => {
  return (route.query.nama as string) || 'Pengunjung'
})

// Ambil 2 huruf depan untuk inisial avatar
const inisialUser = computed(() => {
  return namaUser.value.substring(0, 2).toUpperCase()
})

// Daftar Katalog Buku
const daftarBuku = ref([
  { id: 1, judul: 'Laskar Pelangi', penulis: 'Andrea Hirata', kategori: 'Novel', stok: 5, statusTersedia: true },
  { id: 2, judul: 'Clean Code', penulis: 'Robert C. Martin', kategori: 'Teknologi', stok: 2, statusTersedia: true },
  { id: 3, judul: 'Algoritma & Pemrograman', penulis: 'Rinaldi Munir', kategori: 'Akademik', stok: 0, statusTersedia: false },
  { id: 4, judul: 'Bumi Manusia', penulis: 'Pramoedya Ananta Toer', kategori: 'Sejarah / Novel', stok: 3, statusTersedia: true },
])

const searchQuery = ref('')

// Filter pencarian buku
const bukuFiltered = computed(() => {
  return daftarBuku.value.filter(buku => 
    buku.judul.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    buku.penulis.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    buku.kategori.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// Fungsi Pinjam Buku
const pinjamBuku = (buku: any) => {
  if (buku.stok > 0) {
    buku.stok--
    if (buku.stok === 0) buku.statusTersedia = false
    alert(`Berhasil meminjam buku "${buku.judul}"! Silakan cek menu Pinjaman Saya.`)
  } else {
    alert(`Maaf, stok buku "${buku.judul}" sedang habis.`)
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#fdfbf7] text-stone-800 flex font-sans">
    
    <!-- Sidebar Pengunjung (Nuansa Cokelat Kayu) -->
    <aside class="w-64 bg-[#f4efe6] border-r border-stone-200 p-6 flex flex-col justify-between hidden md:flex shadow-sm">
      <div class="space-y-6">
        
        <!-- Logo SVG Vektor -->
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 bg-[#8B5A2B]/10 text-[#8B5A2B] rounded-xl border border-[#8B5A2B]/20 flex items-center justify-center shadow-inner">
            <svg class="w-5 h-5 text-[#8B5A2B]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
          </div>
          <span class="font-bold text-sm tracking-wide text-stone-900">Perpustakaan Digital</span>
        </div>

        <!-- Profil Pengunjung Dinamis -->
        <div class="bg-white p-3.5 rounded-2xl border border-stone-200/80 flex items-center gap-3 shadow-sm">
          <div class="w-10 h-10 rounded-full bg-[#8B5A2B] flex items-center justify-center font-bold text-sm text-white shadow-md">
            {{ inisialUser }}
          </div>
          <div class="overflow-hidden">
            <h2 class="font-bold text-xs text-stone-900 truncate capitalize">{{ namaUser }}</h2>
            <p class="text-[10px] text-stone-500">Pengunjung Perpustakaan</p>
          </div>
        </div>

        <!-- Navigasi Menu -->
        <nav class="space-y-1">
          <router-link 
            :to="{ path: '/user/katalog', query: { nama: namaUser } }" 
            class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-[#8B5A2B] text-white shadow-md transition cursor-pointer"
          >
            <span>📖</span> Katalog Buku
          </router-link>
          <router-link 
            :to="{ path: '/user/pinjaman', query: { nama: namaUser } }" 
            class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-200/50 hover:text-stone-900 transition cursor-pointer"
          >
            <span>📋</span> Pinjaman Saya
          </router-link>
        </nav>
      </div>

      <!-- Tombol Keluar / Logout -->
      <router-link 
        to="/login"
        class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
      >
        <span>🚪</span> Keluar Akun
      </router-link>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 p-8 overflow-y-auto">
      <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-4 border-b border-stone-200">
        <div>
          <h1 class="text-xl font-bold text-stone-900">Katalog Buku Perpustakaan</h1>
          <p class="text-xs text-stone-500">Cari dan temukan buku favoritmu untuk dibaca atau dipinjam.</p>
        </div>
        
        <!-- Kolom Pencarian & Akun Info -->
        <div class="flex items-center gap-3 w-full md:w-auto">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Cari judul, penulis, kategori..." 
            class="bg-white border border-stone-200 focus:border-[#8B5A2B] rounded-xl px-3.5 py-2 text-xs text-stone-800 placeholder-stone-400 focus:outline-none transition w-full md:w-64 shadow-sm"
          />
          <div class="hidden lg:flex items-center gap-2.5 bg-white border border-stone-200 px-3.5 py-2 rounded-xl text-xs text-stone-700 shadow-sm">
            <div class="w-6 h-6 rounded-full bg-[#8B5A2B] flex items-center justify-center font-bold text-[10px] text-white">
              {{ inisialUser }}
            </div>
            <span class="capitalize font-semibold text-[#8B5A2B]">{{ namaUser }}</span>
          </div>
        </div>
      </header>

      <!-- Grid Daftar Buku -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div 
          v-for="buku in bukuFiltered" 
          :key="buku.id" 
          class="bg-white border border-stone-200 rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition"
        >
          <div class="space-y-3">
            <div class="flex justify-between items-start">
              <span class="bg-[#f4efe6] text-[#8B5A2B] border border-stone-200 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                {{ buku.kategori }}
              </span>
              <span :class="buku.statusTersedia ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-200'" class="border text-[10px] font-semibold px-2 py-0.5 rounded-md">
                {{ buku.statusTersedia ? `Stok: ${buku.stok}` : 'Habis' }}
              </span>
            </div>
            <div>
              <h2 class="font-bold text-sm text-stone-900 leading-snug">{{ buku.judul }}</h2>
              <p class="text-xs text-stone-500 mt-1">Oleh: <span class="text-stone-700 font-medium">{{ buku.penulis }}</span></p>
            </div>
          </div>

          <div class="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
            <span class="text-[11px] text-stone-400">ID: BK-00{{ buku.id }}</span>
            <button 
              @click="pinjamBuku(buku)"
              :disabled="!buku.statusTersedia"
              :class="buku.statusTersedia ? 'bg-[#8B5A2B] hover:bg-[#704721] text-white shadow-sm cursor-pointer' : 'bg-stone-100 text-stone-400 cursor-not-allowed'"
              class="font-semibold text-xs px-3.5 py-2 rounded-xl transition"
            >
              {{ buku.statusTersedia ? 'Pinjam Buku' : 'Tidak Tersedia' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Pesan Jika Buku Tidak Ditemukan -->
      <div v-if="bukuFiltered.length === 0" class="text-center py-12 bg-white border border-stone-200 rounded-2xl mt-4 shadow-sm">
        <p class="text-xs text-stone-500">Buku yang kamu cari tidak ditemukan.</p>
      </div>
    </main>
  </div>
</template>