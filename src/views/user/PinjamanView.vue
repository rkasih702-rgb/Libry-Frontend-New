<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const namaUser = computed(() => (route.query.nama as string) || 'Kasih')
const inisialUser = computed(() => namaUser.value.substring(0, 2).toUpperCase())

const TARIF_DENDA = 15000

const loans = ref([
  { id: 'PJ-001', title: 'Laskar Pelangi', category: 'Fiksi', author: 'Andrea Hirata', tglPinjam: '2026-09-05', tenggat: '2026-09-12', jumlahHariTelat: 8, status: 'aktif' },
  { id: 'PJ-002', title: 'Clean Code', category: 'Pemrograman', author: 'Robert C. Martin', tglPinjam: '2026-09-15', tenggat: '2026-09-22', jumlahHariTelat: 0, status: 'aktif' },
  { id: 'PJ-003', title: 'Algoritma & Pemrograman', category: 'Teknologi', author: 'Rinaldi Munir', tglPinjam: '2026-09-01', tenggat: '2026-09-08', jumlahHariTelat: 0, status: 'selesai' }
])

// State untuk Modal Custom Popup
const showModal = ref(false)
const modalType = ref<'perpanjang' | 'kembalikan' | 'denda'>('perpanjang')
const selectedLoan = ref<any>(null)

onMounted(() => {
  const savedLoans = localStorage.getItem('pinjamanSaya')
  if (savedLoans) {
    const parsedBooks = JSON.parse(savedLoans)
    
    // Perbarui atau tambahkan data dari localStorage ke `loans`
    parsedBooks.forEach((book: any, index: number) => {
      const exists = loans.value.find(l => l.title === book.title)
      if (!exists) {
        loans.value.unshift({
          id: book.id || `PJ-00${4 + index}`,
          title: book.title,
          category: book.category || 'Umum',
          author: book.author || 'Penulis',
          tglPinjam: book.tanggalPinjam || '2026-09-22',
          tenggat: book.tanggalKembali || '2026-09-29',
          jumlahHariTelat: book.jumlahHariTelat !== undefined ? book.jumlahHariTelat : 0,
          status: book.status || 'aktif'
        })
      } else {
        // Update status dan denda jika ada perubahan dari pustakawan/localStorage
        exists.status = book.status || exists.status
        if (book.jumlahHariTelat !== undefined) {
          exists.jumlahHariTelat = book.jumlahHariTelat
        }
      }
    })
  }
})

// Computed untuk menyaring agar buku yang statusnya 'selesai' otomatis tidak muncul di tampilan
const activeOrPendingLoans = computed(() => {
  return loans.value.filter(loan => loan.status !== 'selesai')
})

// Fungsi untuk memicu Buka Modal
const bukaKonfirmasiPerpanjang = (loan: any) => {
  selectedLoan.value = loan
  modalType.value = 'perpanjang'
  showModal.value = true
}

const bukaKonfirmasiKembalikan = (loan: any) => {
  selectedLoan.value = loan
  if (loan.jumlahHariTelat > 0) {
    modalType.value = 'denda'
  } else {
    modalType.value = 'kembalikan'
  }
  showModal.value = true
}

// Aksi ketika dikonfirmasi di dalam modal kustom
const prosesAksiModal = () => {
  if (!selectedLoan.value) return

  if (modalType.value === 'perpanjang') {
    selectedLoan.value.status = 'menunggu'
    updateLocalStorage(selectedLoan.value.title, 'menunggu')
  } else if (modalType.value === 'denda') {
    selectedLoan.value.status = 'menunggu_denda'
    updateLocalStorage(selectedLoan.value.title, 'menunggu_denda')
  } else if (modalType.value === 'kembalikan') {
    selectedLoan.value.status = 'selesai'
    selectedLoan.value.jumlahHariTelat = 0
    updateLocalStorage(selectedLoan.value.title, 'selesai')
  }

  tutupModal()
}

const tutupModal = () => {
  showModal.value = false
  selectedLoan.value = null
}

const updateLocalStorage = (title: string, newStatus: string) => {
  const savedLoans = localStorage.getItem('pinjamanSaya')
  if (savedLoans) {
    let parsedBooks = JSON.parse(savedLoans)
    parsedBooks = parsedBooks.map((b: any) => {
      if (b.title === title) {
        return { 
          ...b, 
          status: newStatus,
          jumlahHariTelat: newStatus === 'selesai' ? 0 : b.jumlahHariTelat 
        }
      }
      return b
    })
    localStorage.setItem('pinjamanSaya', JSON.stringify(parsedBooks))
  } else {
    const initialData = loans.value.map(l => ({ 
      title: l.title, 
      status: l.status,
      jumlahHariTelat: l.jumlahHariTelat
    }))
    localStorage.setItem('pinjamanSaya', JSON.stringify(initialData))
  }
}

const formatRupiah = (angka: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka)
}
</script>

<template>
  <div class="min-h-screen bg-[#fdfbf7] text-stone-800 flex font-sans relative">
    
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

        <nav class="space-y-1.5">
          <router-link :to="{ path: '/user/katalog', query: { nama: namaUser } }" class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-200/50 transition">
            <span>📖</span> Katalog Buku
          </router-link>
          <router-link :to="{ path: '/user/peminjaman', query: { nama: namaUser } }" class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-[#8B5A2B] text-white shadow-md transition">
            <span>📋</span> Pinjaman Saya
          </router-link>
          <router-link :to="{ path: '/user/fasilitas', query: { nama: namaUser } }" class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-200/50 transition">
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
        <div class="bg-white border border-stone-200 p-6 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <h1 class="text-xl font-bold text-stone-900 mb-1 font-serif">Daftar Pinjaman Saya</h1>
            <p class="text-xs text-stone-500">Tenggat pinjam 1 minggu (7 hari). Denda <strong class="text-stone-800">Rp 15.000 / hari</strong> jika terlambat.</p>
          </div>
          <div class="text-xs font-semibold text-stone-600 bg-stone-100 px-3.5 py-2 rounded-xl border border-stone-200">
            Akun: <span class="text-stone-900 font-bold capitalize">{{ namaUser }}</span>
          </div>
        </div>

        <!-- DAFTAR KARTU PINJAMAN -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="loan in activeOrPendingLoans" :key="loan.id" :class="['bg-white border rounded-2xl p-5 shadow-sm flex flex-col justify-between transition hover:shadow-md', loan.jumlahHariTelat > 0 && loan.status === 'aktif' ? 'border-rose-300 bg-rose-50/20' : 'border-stone-200']">
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-stone-100 text-stone-600">{{ loan.category }}</span>
                
                <span v-if="loan.status === 'aktif' && loan.jumlahHariTelat === 0" class="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700">Dipinjam</span>
                <span v-else-if="loan.status === 'aktif' && loan.jumlahHariTelat > 0" class="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-rose-100 text-rose-700">Terlambat {{ loan.jumlahHariTelat }} Hari</span>
                <span v-else-if="loan.status === 'menunggu' || loan.status === 'menunggu_denda'" class="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700">Menunggu Konfirmasi</span>
              </div>

              <div>
                <h3 class="font-bold text-sm text-stone-900 mb-1">{{ loan.title }}</h3>
                <p class="text-xs text-stone-500">{{ loan.author }}</p>
              </div>

              <div :class="['p-3 rounded-xl border space-y-1 text-xs', loan.jumlahHariTelat > 0 && loan.status === 'aktif' ? 'bg-rose-50/60 border-rose-200 text-rose-900' : 'bg-stone-50 border-stone-100 text-stone-600']">
                <div class="flex justify-between">
                  <span>Pinjam:</span>
                  <span class="font-medium">{{ loan.tglPinjam }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Tenggat:</span>
                  <span class="font-medium">{{ loan.tenggat }}</span>
                </div>
                <div v-if="loan.jumlahHariTelat > 0" class="flex justify-between font-bold pt-1 border-t border-rose-200 text-rose-600">
                  <span>Total Denda:</span>
                  <span>{{ formatRupiah(loan.jumlahHariTelat * TARIF_DENDA) }}</span>
                </div>
              </div>
            </div>

            <div class="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
              <span class="text-[10px] text-stone-400">{{ loan.id }}</span>
              
              <div class="flex items-center gap-2">
                <!-- Status Aktif Normal -->
                <template v-if="loan.status === 'aktif' && loan.jumlahHariTelat === 0">
                  <button @click="bukaKonfirmasiPerpanjang(loan)" class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-100 text-amber-800 hover:bg-amber-200 transition cursor-pointer">
                    Perpanjang
                  </button>
                  <button @click="bukaKonfirmasiKembalikan(loan)" class="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-stone-900 text-white hover:bg-stone-800 transition cursor-pointer">
                    Kembalikan
                  </button>
                </template>

                <!-- Status Aktif tapi Terlambat (Denda) -->
                <template v-else-if="loan.status === 'aktif' && loan.jumlahHariTelat > 0">
                  <button @click="bukaKonfirmasiKembalikan(loan)" class="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 transition cursor-pointer shadow-sm">
                    Kembalikan & Bayar Denda
                  </button>
                </template>

                <!-- Status Menunggu Konfirmasi Pustakawan -->
                <template v-else-if="loan.status === 'menunggu' || loan.status === 'menunggu_denda'">
                  <span class="text-[11px] text-sky-600 font-medium italic">
                    Tunggu konfirmasi pustakawan
                  </span>
                </template>
              </div>
            </div>
          </div>
        </div>

        <!-- Pesan jika kosong -->
        <div v-if="activeOrPendingLoans.length === 0" class="text-center py-12 bg-white border border-stone-200 rounded-2xl shadow-sm space-y-2">
          <p class="text-2xl">📚</p>
          <p class="text-xs font-bold text-stone-800">Tidak ada pinjaman aktif saat ini.</p>
          <p class="text-[11px] text-stone-500">Semua buku yang Anda pinjam telah dikembalikan atau belum ada buku yang dipinjam.</p>
        </div>

      </div>
    </main>

    <!-- CUSTOM MODAL POPUP -->
    <div v-if="showModal" class="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl border border-stone-200 shadow-xl max-w-sm w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
        
        <!-- Ikon / Header Modal -->
        <div class="flex items-center gap-3">
          <div :class="['w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0', modalType === 'denda' ? 'bg-rose-100 text-rose-600' : 'bg-[#f5ede4] text-[#8B5A2B]']">
            {{ modalType === 'denda' ? '⚠️' : '📖' }}
          </div>
          <div>
            <h3 class="font-bold text-sm text-stone-900">
              {{ modalType === 'perpanjang' ? 'Konfirmasi Perpanjangan' : modalType === 'denda' ? 'Konfirmasi Bayar Denda' : 'Konfirmasi Pengembalian' }}
            </h3>
            <p class="text-[11px] text-stone-500 truncate max-w-[200px]">{{ selectedLoan?.title }}</p>
          </div>
        </div>

        <!-- Pesan Isi Modal -->
        <div class="text-xs text-stone-600 bg-stone-50 p-3.5 rounded-xl border border-stone-100 space-y-2">
          <p v-if="modalType === 'perpanjang'">
            Ajukan perpanjangan masa peminjaman buku ini? Status akan berubah menjadi <strong class="text-stone-800">Menunggu Konfirmasi</strong> dari pustakawan.
          </p>
          <p v-else-if="modalType === 'denda'">
            Total denda sebesar <strong class="text-rose-600">{{ formatRupiah(selectedLoan?.jumlahHariTelat * TARIF_DENDA) }}</strong> dibayarkan secara tunai/langsung kepada <strong class="text-stone-800">pustakawan di meja perpustakaan</strong>. Lanjutkan proses pengembalian?
          </p>
          <p v-else>
            Apakah Anda yakin ingin mengembalikan buku <strong class="text-stone-800">"{{ selectedLoan?.title }}"</strong> sekarang? Buku akan langsung dihapus dari daftar pinjaman aktif.
          </p>
        </div>

        <!-- Tombol Aksi Modal -->
        <div class="flex items-center justify-end gap-2 pt-2">
          <button @click="tutupModal" class="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-100 text-stone-600 hover:bg-stone-200 transition cursor-pointer">
            Batal
          </button>
          
          <button @click="prosesAksiModal" :class="['px-4 py-2 rounded-xl text-xs font-semibold text-white transition cursor-pointer shadow-sm', modalType === 'denda' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-[#8B5A2B] hover:bg-[#724822]']">
            {{ modalType === 'perpanjang' ? 'Ya, Ajukan' : modalType === 'denda' ? 'Ya, Bayar ke Pustakawan' : 'Ya, Kembalikan' }}
          </button>
        </div>

      </div>
    </div>

  </div>
</template>