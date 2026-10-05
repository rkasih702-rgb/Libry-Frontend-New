<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import API from '@/services/api' // Import Axios instance

const route = useRoute()
const router = useRouter()

const namaUser = computed(() => (route.query.nama as string) || 'Kasih')
const inisialUser = computed(() => namaUser.value.substring(0, 2).toUpperCase())

const searchQuery = ref('')
const selectedCategory = ref('Semua')

// State Modal Peringatan / Blokir Denda
const showModal = ref(false)
const modalType = ref<'konfirmasi' | 'blokir'>('konfirmasi')
const modalMessage = ref('')
const selectedBook = ref<any>(null)
const tanggalKembaliFormatted = ref('')

const categories = ['Semua', 'Teknologi', 'Fiksi', 'Pemrograman', 'Bisnis']

// State Data dari Backend Go
const books = ref<any[]>([])
const activeLoans = ref<any[]>([])
const isLoading = ref(false)

// Function Helper untuk mendapatkan Token dari LocalStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('token') || localStorage.getItem('access_token') || ''
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
}

// 1. Fetch Data Buku Publik (GET /buku)
const fetchBooks = async () => {
  try {
    isLoading.value = true
    const response = await API.get('/buku')
    const dataBuku = Array.isArray(response.data) ? response.data : (response.data.data || [])
    
    // Pemetaan data JSON backend Go
    books.value = dataBuku.map((b: any) => ({
      id: b.id_buku || b.id,
      title: b.judul || b.title,
      author: b.penulis || b.author || b.pengarang,
      category: b.kategori || b.category || b.genre || 'Umum',
      year: b.tahun_terbit || b.tahun || b.year,
      stok: b.stok !== undefined ? b.stok : 1,
      gambar: b.gambar || '',
      deskripsi: b.deskripsi || '',
      status: (b.stok && b.stok > 0) ? 'Tersedia' : 'Dipinjam'
    }))
  } catch (error) {
    console.error('Gagal mengambil data buku dari server Go:', error)
  } finally {
    isLoading.value = false
  }
}

// 2. Fetch Data Riwayat Peminjaman User (GET /histori/riwayat dengan Auth Middleware)
const fetchUserLoans = async () => {
  try {
    const response = await API.get('/histori/riwayat', getAuthHeaders())
    const dataPinjam = Array.isArray(response.data) ? response.data : (response.data.data || [])
    activeLoans.value = dataPinjam
  } catch (error) {
    console.error('Gagal mengambil riwayat peminjaman:', error)
  }
}

// Sinkronisasi data saat halaman dimuat
const syncData = async () => {
  await fetchBooks()
  await fetchUserLoans()
  
  // Update status buku jika sedang dipinjam / dikirimkan oleh user
  books.value.forEach(book => {
    const isBorrowed = activeLoans.value.some((l: any) => 
      ((l.id_buku && l.id_buku === book.id) || 
       (l.title || l.judul || '').trim().toLowerCase() === book.title.trim().toLowerCase()) && 
      (l.status !== 'selesai' && l.status !== 'dikembalikan')
    )
    if (isBorrowed) {
      book.status = 'Dipinjam'
    }
  })
}

onMounted(() => {
  syncData()
})

const filteredBooks = computed(() => {
  return books.value.filter(book => {
    const matchesCategory = selectedCategory.value === 'Semua' || book.category === selectedCategory.value
    const matchesSearch = (book.title || '').toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          (book.author || '').toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesCategory && matchesSearch
  })
})

// Logika ketika tombol Pinjam diklik
const handlePinjamClick = async (book: any) => {
  await fetchUserLoans()

  const hasActiveOrPending = activeLoans.value.find((l: any) => l.status !== 'selesai' && l.status !== 'dikembalikan')

  if (book.status === 'Dipinjam' || hasActiveOrPending) {
    const loanTitle = hasActiveOrPending?.title || hasActiveOrPending?.judul || ''
    
    if (hasActiveOrPending && loanTitle.trim().toLowerCase() === book.title.trim().toLowerCase()) {
      modalType.value = 'blokir'
      modalMessage.value = `Buku "${book.title}" sedang dalam status booking / tanggungan di Pustakawan.`
      selectedBook.value = book
      showModal.value = true
      return
    }

    if (hasActiveOrPending) {
      modalType.value = 'blokir'
      modalMessage.value = `Anda masih memiliki pinjaman/tanggungan aktif. Harap selesaikan terlebih dahulu.`
      selectedBook.value = book
      showModal.value = true
      return
    }

    router.push({ path: '/user/peminjaman', query: { nama: namaUser.value } })
    return
  }

  selectedBook.value = book
  modalType.value = 'konfirmasi'

  const tanggalPinjam = new Date()
  const tanggalKembali = new Date()
  tanggalKembali.setDate(tanggalPinjam.getDate() + 7)

  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }
  tanggalKembaliFormatted.value = tanggalKembali.toLocaleDateString('id-ID', options)

  showModal.value = true
}

// 3. Tembak HTTP POST Booking ke Backend Go (POST /booking)
const konfirmasiPinjam = async () => {
  if (!selectedBook.value) return

  const payload = {
    id_buku: Number(selectedBook.value.id)
  }

  try {
    await API.post('/booking', payload, getAuthHeaders())

    selectedBook.value.status = 'Dipinjam'
    showModal.value = false

    router.push({
      path: '/user/peminjaman',
      query: { nama: namaUser.value }
    })
  } catch (error: any) {
    console.error('Gagal membuat booking ke server Go:', error)
    if (error.response && error.response.status === 401) {
      alert('Sesi login Anda telah berakhir atau belum terautentikasi. Silakan login kembali.')
      router.push('/login')
    } else {
      alert('Terjadi kesalahan saat memproses peminjaman ke server backend Go.')
    }
  }
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
          <router-link :to="{ path: '/user/katalog', query: { nama: namaUser } }" class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-[#8B5A2B] text-white shadow-md transition">
            <span>📖</span> Katalog Buku
          </router-link>
          <router-link :to="{ path: '/user/peminjaman', query: { nama: namaUser } }" class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-200/50 transition">
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
        
        <div class="bg-white border border-stone-200 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 class="text-xl font-bold text-stone-900 mb-1 font-serif">Katalog Buku Perpustakaan</h1>
            <p class="text-xs text-stone-500">Temukan dan pinjam buku favoritmu dengan mudah di sini.</p>
          </div>
          <div class="w-full md:w-auto flex items-center gap-3">
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Cari judul atau penulis..." 
              class="px-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#8B5A2B] w-full md:w-64"
            />
          </div>
        </div>

        <div class="flex items-center gap-2 overflow-x-auto pb-2">
          <button 
            v-for="cat in categories" 
            :key="cat"
            @click="selectedCategory = cat"
            :class="[
              'px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer',
              selectedCategory === cat 
                ? 'bg-[#8B5A2B] text-white shadow-md' 
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
            ]"
          >
            {{ cat }}
          </button>
        </div>

        <!-- LOADING STATE -->
        <div v-if="isLoading" class="text-center py-12 text-xs text-stone-500">
          Memuat data buku dari server Go...
        </div>

        <!-- BOOKS GRID -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="book in filteredBooks" :key="book.id" class="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition">
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-stone-100 text-stone-600">{{ book.category }}</span>
                <span :class="['text-[10px] font-bold px-2.5 py-1 rounded-lg', book.status === 'Tersedia' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700']">
                  {{ book.status }}
                </span>
              </div>
              <div>
                <h3 class="font-bold text-sm text-stone-900 mb-1">{{ book.title }}</h3>
                <p class="text-xs text-stone-500">{{ book.author }} {{ book.year ? `(${book.year})` : '' }}</p>
              </div>
            </div>
            <div class="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
              <span class="text-[10px] text-stone-400">ID: BK-00{{ book.id }}</span>
              <button 
                @click="handlePinjamClick(book)"
                :class="[
                  'px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer',
                  book.status === 'Tersedia' 
                    ? 'bg-stone-900 text-white hover:bg-stone-800' 
                    : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                ]"
              >
                {{ book.status === 'Tersedia' ? 'Pinjam Buku' : 'Dipinjam' }}
              </button>
            </div>
          </div>
        </div>

      </div>
    </main>

    <!-- MODAL / POPUP -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl space-y-4 border border-stone-200">
        
        <!-- Mode Blokir -->
        <template v-if="modalType === 'blokir'">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-lg shrink-0">
              🚫
            </div>
            <div>
              <h3 class="font-bold text-sm text-stone-900">Peminjaman Ditolak</h3>
              <p class="text-xs text-rose-600 font-semibold">Tanggungan / Status Menunggu</p>
            </div>
          </div>

          <div class="bg-rose-50 p-4 rounded-xl border border-rose-200 space-y-2 text-xs text-stone-700">
            <p>{{ modalMessage }}</p>
          </div>

          <div class="flex items-center justify-end gap-2 pt-2">
            <button @click="showModal = false" class="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-100 text-stone-600 hover:bg-stone-200 transition cursor-pointer">
              Tutup
            </button>
            <button @click="router.push({ path: '/user/peminjaman', query: { nama: namaUser } })" class="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 transition cursor-pointer shadow-md">
              Cek Pinjaman Saya
            </button>
          </div>
        </template>

        <!-- Mode Konfirmasi Normal -->
        <template v-else>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-lg shrink-0">
              ⚠️
            </div>
            <div>
              <h3 class="font-bold text-sm text-stone-900">Konfirmasi Peminjaman Buku</h3>
              <p class="text-xs text-stone-500">Kebijakan Pengembalian Perpustakaan</p>
            </div>
          </div>

          <div class="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2 text-xs text-stone-700">
            <p>Anda akan meminjam buku: <strong class="text-stone-900">"{{ selectedBook?.title }}"</strong></p>
            <p>📅 Batas waktu pengembalian: <strong class="text-[#8B5A2B]">{{ tanggalKembaliFormatted }}</strong> (1 minggu dari sekarang).</p>
            <p class="text-rose-600 font-semibold">⚠️ Perhatian: Keterlambatan pengembalian akan dikenakan denda sebesar <strong class="underline">Rp15.000</strong>.</p>
          </div>

          <div class="flex items-center justify-end gap-2 pt-2">
            <button @click="showModal = false" class="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-100 text-stone-600 hover:bg-stone-200 transition cursor-pointer">
              Batal
            </button>
            <button @click="konfirmasiPinjam" class="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-900 text-white hover:bg-stone-800 transition cursor-pointer shadow-md">
              Setuju & Pinjam
            </button>
          </div>
        </template>

      </div>
    </div>

  </div>
</template>