<script setup lang="ts">
import { ref } from 'vue'

// Tab aktif: 'reservasi' | 'peminjaman' | 'pengembalian'
const activeTab = ref<'reservasi' | 'peminjaman' | 'pengembalian'>('pengembalian')

// -----------------------------------------------------------
// DATA DUMMY UNTUK TAMPILAN
// -----------------------------------------------------------

// 1. Data Reservasi (Siapkan Buku)
const reservasiList = ref([
  { id_peminjaman: 'RES-001', nama_user: 'Zen Admin', judul_buku: 'Laskar Pelangi', tgl_reservasi: '2026-09-25', status: 'Perlu Disiapkan' },
  { id_peminjaman: 'RES-002', nama_user: 'Ray Pengunjung', judul_buku: 'Bumi Manusia', tgl_reservasi: '2026-09-26', status: 'Perlu Disiapkan' },
  { id_peminjaman: 'RES-003', nama_user: 'Budi Santoso', judul_buku: 'Pemrograman Go', tgl_reservasi: '2026-09-27', status: 'Siap Diambil' }
])

// 2. Data Peminjaman Aktif
const peminjamanList = ref([
  { id_peminjaman: 'PMJ-101', nama_user: 'Ahmad Supri', judul_buku: 'Filosofi Teras', tgl_pinjam: '2026-09-20', batas_waktu: '2026-09-27', status: 'Dipinjam' },
  { id_peminjaman: 'PMJ-102', nama_user: 'Siti Aminah', judul_buku: 'Teknik Vue 3 & Vite', tgl_pinjam: '2026-09-22', batas_waktu: '2026-09-29', status: 'Dipinjam' }
])

// 3. Data Antrean Konfirmasi Pengembalian dari User
const pengembalianList = ref([
  { 
    id_peminjaman: 'PJ-001', 
    nama_user: 'Ahmad Supri', 
    judul_buku: 'Laskar Pelangi', 
    tgl_pinjam: '2026-09-05', 
    tgl_tenggat: '2026-09-12', 
    denda: 120000, 
    status: 'Menunggu Konfirmasi' 
  },
  { 
    id_peminjaman: 'PJ-002', 
    nama_user: 'Siti Aminah', 
    judul_buku: 'Bumi Manusia', 
    tgl_pinjam: '2026-09-20', 
    tgl_tenggat: '2026-09-27', 
    denda: 0, 
    status: 'Menunggu Konfirmasi' 
  }
])

// Form Input Peminjaman Baru
const formPeminjaman = ref({
  nama_user: '',
  judul_buku: '',
  batas_waktu: ''
})

// Form Input Pengembalian Manual
const idPengembalianInput = ref('')

// -----------------------------------------------------------
// FUNGSI SIMULASI UI (TANPA API)
// -----------------------------------------------------------

// Process Reservasi
const tandaiSiap = (item: any) => {
  item.status = 'Siap Diambil'
  alert(`Buku "${item.judul_buku}" untuk ${item.nama_user} berhasil ditandai SIAP DIIAMBIL!`)
}

// Process Peminjaman Baru
const handlePeminjaman = () => {
  if (!formPeminjaman.value.nama_user || !formPeminjaman.value.judul_buku) {
    alert('Harap isi semua kolom!')
    return
  }

  peminjamanList.value.unshift({
    id_peminjaman: `PMJ-${Math.floor(100 + Math.random() * 900)}`,
    nama_user: formPeminjaman.value.nama_user,
    judul_buku: formPeminjaman.value.judul_buku,
    tgl_pinjam: new Date().toISOString().split('T')[0],
    batas_waktu: formPeminjaman.value.batas_waktu || '2026-10-05',
    status: 'Dipinjam'
  })

  alert('Transaksi peminjaman berhasil ditambahkan!')
  formPeminjaman.value = { nama_user: '', judul_buku: '', batas_waktu: '' }
}

// Process Konfirmasi Pengembalian dari List/Antrean
const konfirmasiPengembalian = (item: any) => {
  if (item.denda > 0) {
    const terbayar = confirm(
      `Pengguna ${item.nama_user} memiliki denda keterlambatan sebesar Rp ${item.denda.toLocaleString('id-ID')}.\n\nApakah denda telah dibayar dan Anda ingin mengonfirmasi pengembalian buku "${item.judul_buku}"?`
    )
    if (!terbayar) return
  } else {
    const yakin = confirm(`Konfirmasi pengembalian buku "${item.judul_buku}" dari ${item.nama_user}?`)
    if (!yakin) return
  }

  // Hapus dari antrean pengembalian pustakawan & tampilan user
  const index = pengembalianList.value.findIndex(p => p.id_peminjaman === item.id_peminjaman)
  if (index !== -1) {
    pengembalianList.value.splice(index, 1)
    alert(`Pengembalian transaksi "${item.id_peminjaman}" berhasil dikonfirmasi!`)
  }
}

// Process Pengembalian Manual via Input ID
const handlePengembalianInput = () => {
  if (!idPengembalianInput.value) {
    alert('Masukkan ID Peminjaman terlebih dahulu!')
    return
  }

  const index = pengembalianList.value.findIndex(
    p => p.id_peminjaman.toLowerCase() === idPengembalianInput.value.toLowerCase()
  )

  if (index !== -1) {
    konfirmasiPengembalian(pengembalianList.value[index])
    idPengembalianInput.value = ''
  } else {
    alert(`Data peminjaman "${idPengembalianInput.value}" tidak ditemukan di antrean pengembalian.`)
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#fdfbf7] text-stone-800 p-6 font-sans">
    <div class="max-w-6xl mx-auto space-y-6">
      
      <!-- Header Banner Pustakawan -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl border border-stone-200 shadow-sm gap-4">
        <div>
          <h1 class="text-2xl font-bold text-stone-900 tracking-tight">Halaman Pustakawan</h1>
          <p class="text-xs text-stone-500 mt-1">Kelola persiapan buku reservasi, peminjaman, dan pengembalian buku.</p>
        </div>
        <div class="bg-[#8B5A2B]/10 text-[#8B5A2B] px-4 py-2 rounded-xl text-xs font-semibold border border-[#8B5A2B]/20">
          Role: Pustakawan / Petugas
        </div>
      </div>

      <!-- Tab Menu Pustakawan -->
      <div class="flex flex-wrap gap-2 border-b border-stone-200 pb-3">
        <button 
          @click="activeTab = 'reservasi'" 
          :class="activeTab === 'reservasi' ? 'bg-[#8B5A2B] text-white shadow-md' : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'"
          class="px-4 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer"
        >
          Menyiapkan Buku (Reservasi)
        </button>

        <button 
          @click="activeTab = 'peminjaman'" 
          :class="activeTab === 'peminjaman' ? 'bg-[#8B5A2B] text-white shadow-md' : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'"
          class="px-4 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer"
        >
          Peminjaman Buku
        </button>

        <button 
          @click="activeTab = 'pengembalian'" 
          :class="activeTab === 'pengembalian' ? 'bg-[#8B5A2B] text-white shadow-md' : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'"
          class="px-4 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer"
        >
          Pengembalian Buku
        </button>
      </div>

      <!-- TAB 1: MENYIAPKAN BUKU (RESERVASI) -->
      <div v-if="activeTab === 'reservasi'" class="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
        <div class="flex justify-between items-center">
          <h2 class="text-base font-bold text-stone-800">Daftar Antrean Reservasi Buku</h2>
          <span class="text-xs text-stone-400">Total: {{ reservasiList.length }} Permintaan</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-stone-200 text-xs font-semibold text-stone-500 bg-stone-50">
                <th class="p-3">Kode Reservasi</th>
                <th class="p-3">Nama Peminjam</th>
                <th class="p-3">Judul Buku</th>
                <th class="p-3">Tanggal Reservasi</th>
                <th class="p-3">Status</th>
                <th class="p-3 text-right">Aksi Pustakawan</th>
              </tr>
            </thead>
            <tbody class="text-xs divide-y divide-stone-100">
              <tr v-for="item in reservasiList" :key="item.id_peminjaman" class="hover:bg-stone-50/50 transition">
                <td class="p-3 font-semibold text-stone-900">{{ item.id_peminjaman }}</td>
                <td class="p-3">{{ item.nama_user }}</td>
                <td class="p-3 font-medium text-[#8B5A2B]">{{ item.judul_buku }}</td>
                <td class="p-3 text-stone-500">{{ item.tgl_reservasi }}</td>
                <td class="p-3">
                  <span 
                    :class="item.status === 'Siap Diambil' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'"
                    class="px-2.5 py-1 rounded-lg text-[10px] font-semibold"
                  >
                    {{ item.status }}
                  </span>
                </td>
                <td class="p-3 text-right">
                  <button 
                    v-if="item.status !== 'Siap Diambil'"
                    @click="tandaiSiap(item)" 
                    class="bg-[#8B5A2B] hover:bg-[#704721] text-white px-3 py-1.5 rounded-xl text-xs font-medium transition shadow-sm cursor-pointer"
                  >
                    Tandai Siap Ambil
                  </button>
                  <span v-else class="text-xs text-emerald-600 font-semibold">Siap Ditukar</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 2: PEMINJAMAN BUKU -->
      <div v-if="activeTab === 'peminjaman'" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Form Peminjaman Langsung -->
        <div class="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4 h-fit">
          <h2 class="text-base font-bold text-stone-800">Catat Peminjaman Baru</h2>
          <form @submit.prevent="handlePeminjaman" class="space-y-3">
            <div>
              <label class="text-[11px] font-semibold text-stone-600">Nama / NISN Pengunjung</label>
              <input v-model="formPeminjaman.nama_user" type="text" placeholder="Contoh: Zen" required class="w-full mt-1 px-3.5 py-2.5 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#8B5A2B] bg-[#fdfbf7]" />
            </div>
            <div>
              <label class="text-[11px] font-semibold text-stone-600">Judul Buku</label>
              <input v-model="formPeminjaman.judul_buku" type="text" placeholder="Contoh: Laskar Pelangi" required class="w-full mt-1 px-3.5 py-2.5 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#8B5A2B] bg-[#fdfbf7]" />
            </div>
            <div>
              <label class="text-[11px] font-semibold text-stone-600">Batas Waktu Pengembalian</label>
              <input v-model="formPeminjaman.batas_waktu" type="date" required class="w-full mt-1 px-3.5 py-2.5 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#8B5A2B] bg-[#fdfbf7]" />
            </div>
            <button type="submit" class="w-full bg-[#8B5A2B] hover:bg-[#704721] text-white py-2.5 rounded-xl text-xs font-semibold shadow-md transition cursor-pointer">
              Simpan Peminjaman
            </button>
          </form>
        </div>

        <!-- Tabel List Peminjaman Aktif -->
        <div class="md:col-span-2 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <h2 class="text-base font-bold text-stone-800">Riwayat Peminjaman Aktif</h2>
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-stone-200 text-xs font-semibold text-stone-500 bg-stone-50">
                  <th class="p-3">ID Pinjam</th>
                  <th class="p-3">Nama User</th>
                  <th class="p-3">Buku</th>
                  <th class="p-3">Tgl Pinjam</th>
                  <th class="p-3">Batas Waktu</th>
                </tr>
              </thead>
              <tbody class="text-xs divide-y divide-stone-100">
                <tr v-for="item in peminjamanList" :key="item.id_peminjaman" class="hover:bg-stone-50/50 transition">
                  <td class="p-3 font-semibold text-stone-900">{{ item.id_peminjaman }}</td>
                  <td class="p-3">{{ item.nama_user }}</td>
                  <td class="p-3 font-medium text-[#8B5A2B]">{{ item.judul_buku }}</td>
                  <td class="p-3 text-stone-500">{{ item.tgl_pinjam }}</td>
                  <td class="p-3 text-rose-600 font-semibold">{{ item.batas_waktu }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- TAB 3: PENGEMBALIAN BUKU & KONFIRMASI DENDA -->
      <div v-if="activeTab === 'pengembalian'" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <!-- Form Pengembalian Manual ID -->
        <div class="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4 h-fit">
          <div class="space-y-1">
            <h2 class="text-base font-bold text-stone-800">Cari / Input ID Manual</h2>
            <p class="text-xs text-stone-500">Masukkan ID Peminjaman jika ingin memproses pengembalian secara cepat.</p>
          </div>

          <form @submit.prevent="handlePengembalianInput" class="space-y-3 pt-1">
            <div>
              <label class="text-[11px] font-semibold text-stone-600">ID Peminjaman / Transaksi</label>
              <input 
                v-model="idPengembalianInput" 
                type="text" 
                placeholder="Contoh: PJ-001" 
                required 
                class="w-full mt-1 px-3.5 py-2.5 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#8B5A2B] bg-[#fdfbf7]" 
              />
            </div>

            <button type="submit" class="w-full bg-[#8B5A2B] hover:bg-[#704721] text-white py-2.5 rounded-xl text-xs font-semibold shadow-md transition cursor-pointer">
              Proses Pengembalian
            </button>
          </form>
        </div>

        <!-- Tabel Antrean Konfirmasi Pengembalian Pengguna -->
        <div class="md:col-span-2 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <div class="flex justify-between items-center">
            <h2 class="text-base font-bold text-stone-800">Permintaan Konfirmasi Pengembalian</h2>
            <span class="text-xs text-stone-400">Total: {{ pengembalianList.length }} Pengajuan</span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-stone-200 text-xs font-semibold text-stone-500 bg-stone-50">
                  <th class="p-3">ID Transaksi</th>
                  <th class="p-3">Nama Peminjam</th>
                  <th class="p-3">Judul Buku</th>
                  <th class="p-3">Total Denda</th>
                  <th class="p-3 text-right">Aksi Konfirmasi</th>
                </tr>
              </thead>
              <tbody class="text-xs divide-y divide-stone-100">
                <tr v-if="pengembalianList.length === 0">
                  <td colspan="5" class="p-6 text-center text-stone-400">
                    Tidak ada antrean pengembalian buku saat ini.
                  </td>
                </tr>
                <tr v-for="item in pengembalianList" :key="item.id_peminjaman" class="hover:bg-stone-50/50 transition">
                  <td class="p-3 font-semibold text-stone-900">{{ item.id_peminjaman }}</td>
                  <td class="p-3">{{ item.nama_user }}</td>
                  <td class="p-3 font-medium text-[#8B5A2B]">{{ item.judul_buku }}</td>
                  <td class="p-3 font-bold">
                    <span v-if="item.denda > 0" class="text-rose-600">
                      Rp {{ item.denda.toLocaleString('id-ID') }}
                    </span>
                    <span v-else class="text-emerald-600">
                      Tidak Ada Denda
                    </span>
                  </td>
                  <td class="p-3 text-right">
                    <button 
                      @click="konfirmasiPengembalian(item)"
                      :class="item.denda > 0 ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'"
                      class="text-white px-3 py-1.5 rounded-xl text-xs font-medium transition shadow-sm cursor-pointer"
                    >
                      {{ item.denda > 0 ? 'Konfirmasi & Bayar' : 'Konfirmasi Pengembalian' }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>