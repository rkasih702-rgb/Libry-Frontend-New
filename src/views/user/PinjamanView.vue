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

// Daftar Pinjaman Buku dengan status perpanjangan
const daftarPinjaman = ref([
  { 
    idPinjam: 'PJ-001', 
    judulBuku: 'Laskar Pelangi', 
    tglPinjam: '2026-09-05', 
    tenggat: '2026-09-12', 
    keterlambatan: 'Telat 8 Hari', 
    estDenda: 'Rp 80.000', 
    status: 'Aktif', 
  },
  { 
    idPinjam: 'PJ-002', 
    judulBuku: 'Clean Code', 
    tglPinjam: '2026-09-15', 
    tenggat: '2026-09-22', 
    keterlambatan: 'Tepat Waktu', 
    estDenda: 'Rp 0', 
    status: 'Aktif', 
  },
  { 
    idPinjam: 'PJ-003', 
    judulBuku: 'Algoritma & Pemrograman', 
    tglPinjam: '2026-09-01', 
    tenggat: '2026-09-08', 
    keterlambatan: '-', 
    estDenda: 'Rp 0', 
    status: 'Dikembalikan', 
  }
])

// Fungsi Mengajukan Perpanjangan Masa Pinjam
const ajukanPerpanjangan = (item: any) => {
  item.status = 'Menunggu Perpanjangan'
  alert(`Permohonan perpanjangan untuk buku "${item.judulBuku}" telah dikirim. Menunggu persetujuan pustakawan.`)
}

// Fungsi Mengajukan Pengembalian Buku
const ajukanPengembalian = (item: any) => {
  item.status = 'Dikembalikan'
  item.keterlambatan = '-'
  item.estDenda = 'Rp 0'
  alert(`Buku "${item.judulBuku}" berhasil dikembalikan.`)
}
</script>

<template>
  <div class="min-h-screen bg-[#fdfbf7] text-stone-800 flex font-sans">
    
    <!-- Sidebar Pengunjung (Nuansa Putih Cokelat) -->
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

        <!-- Navigasi Menu (Diperbaiki agar interaktif dengan :to) -->
        <nav class="space-y-1">
          <router-link 
            :to="{ path: '/user/katalog', query: { nama: namaUser } }" 
            class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-200/50 hover:text-stone-900 transition cursor-pointer"
          >
            <span>📖</span> Katalog Buku
          </router-link>
          <router-link 
            :to="{ path: '/user/pinjaman', query: { nama: namaUser } }" 
            class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-[#8B5A2B] text-white shadow-md transition cursor-pointer"
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
      <header class="flex justify-between items-center mb-8 pb-4 border-b border-stone-200">
        <div>
          <h1 class="text-xl font-bold text-stone-900">Daftar Pinjaman Saya</h1>
          <p class="text-xs text-stone-500">Tenggat pinjam 1 minggu (7 hari). Denda Rp 10.000/hari jika terlambat.</p>
        </div>
        
        <!-- Bagian Profil Header dengan Bulatan Inisial -->
        <div class="flex items-center gap-2.5 bg-white border border-stone-200 px-3.5 py-2 rounded-xl text-xs text-stone-700 shadow-sm">
          <div class="w-7 h-7 rounded-full bg-[#8B5A2B] flex items-center justify-center font-bold text-[11px] text-white shadow">
            {{ inisialUser }}
          </div>
          <span>Akun: <strong class="text-[#8B5A2B] capitalize">{{ namaUser }}</strong></span>
        </div>
      </header>

      <!-- Tabel Daftar Pinjaman -->
      <div class="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-stone-200 text-[11px] text-stone-500 bg-stone-50 uppercase tracking-wider">
                <th class="p-4">ID Pinjam</th>
                <th class="p-4">Judul Buku</th>
                <th class="p-4">Tgl Pinjam</th>
                <th class="p-4">Tenggat</th>
                <th class="p-4">Keterlambatan</th>
                <th class="p-4">Estimasi Denda</th>
                <th class="p-4 text-center">Status / Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-100 text-xs text-stone-700">
              <tr v-for="item in daftarPinjaman" :key="item.idPinjam" class="hover:bg-stone-50/80 transition">
                <td class="p-4 font-mono text-stone-500">{{ item.idPinjam }}</td>
                <td class="p-4 font-bold text-stone-900">{{ item.judulBuku }}</td>
                <td class="p-4 text-stone-600">{{ item.tglPinjam }}</td>
                <td class="p-4 text-amber-700 font-semibold">{{ item.tenggat }}</td>
                <td class="p-4">
                  <span :class="item.keterlambatan.includes('Telat') ? 'text-rose-600 font-semibold' : 'text-stone-600'">
                    {{ item.keterlambatan }}
                  </span>
                </td>
                <td class="p-4">
                  <span :class="item.estDenda !== 'Rp 0' ? 'text-rose-600 font-bold' : 'text-stone-600'">
                    {{ item.estDenda }}
                  </span>
                </td>
                <td class="p-4 text-center">
                  <!-- Jika status masih Aktif -->
                  <div v-if="item.status === 'Aktif'" class="flex items-center justify-center gap-2">
                    <button 
                      @click="ajukanPerpanjangan(item)"
                      class="bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-300 font-semibold px-3 py-1.5 rounded-lg transition text-[11px] cursor-pointer"
                    >
                      Perpanjang
                    </button>
                    <button 
                      @click="ajukanPengembalian(item)"
                      class="bg-[#8B5A2B] hover:bg-[#704721] text-white font-semibold px-3 py-1.5 rounded-lg transition shadow-sm text-[11px] cursor-pointer"
                    >
                      Kembalikan
                    </button>
                  </div>

                  <!-- Jika status Menunggu Perpanjangan -->
                  <span v-else-if="item.status === 'Menunggu Perpanjangan'" class="inline-block bg-amber-50 text-amber-700 border border-amber-300 px-3 py-1 rounded-lg text-[11px] font-semibold">
                    Menunggu Persetujuan Pustakawan
                  </span>

                  <!-- Jika sudah Dikembalikan -->
                  <span v-else class="inline-block bg-stone-100 text-stone-500 px-3 py-1 rounded-lg text-[11px] font-semibold">
                    Dikembalikan
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>