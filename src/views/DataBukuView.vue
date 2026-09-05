<template>
  <div class="flex min-h-screen bg-[#0b132b] text-white font-sans">
    
    <!-- SIDEBAR LEFT -->
    <aside class="w-64 bg-[#141f36] border-r border-slate-800/60 flex flex-col justify-between p-6 shrink-0">
      <div>
        <!-- Profil Admin -->
        <div class="flex items-center gap-3 mb-10">
          <div class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm">
            GC
          </div>
          <span class="font-bold text-lg text-slate-100">Gawin Caskey</span>
        </div>

        <!-- Navigation Menu -->
        <nav class="space-y-3">
          <button @click="router.push('/dashboard')" class="w-full text-left px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/40 font-semibold text-sm transition">
            Dashboard
          </button>
          <button class="w-full text-left px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm shadow-md transition">
            Data Buku
          </button>
          <button @click="router.push('/data-petugas')" class="w-full text-left px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/40 font-semibold text-sm transition">
            Data Petugas
          </button>
          <button @click="router.push('/jadwal-shift')" class="w-full text-left px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/40 font-semibold text-sm transition">
            Jadwal Shift
          </button>
          <button @click="router.push('/fasilitas')" class="w-full text-left px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/40 font-semibold text-sm transition">
            Fasilitas
          </button>
        </nav>
      </div>

      <!-- Logout Button -->
      <button @click="logout" class="flex items-center gap-2 text-slate-400 hover:text-red-400 font-semibold text-sm px-4 py-2 transition">
        Logout 🚪
      </button>
    </aside>

    <!-- MAIN CONTENT RIGHT -->
    <main class="flex-1 p-8 space-y-6 overflow-x-hidden">
      
      <!-- Header Area -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold">Data Buku Perpustakaan</h1>
          <p class="text-xs text-slate-400">Kelola daftar koleksi buku, kategori, dan stok persediaan</p>
        </div>
        <button @click="openModalAdd" class="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-md transition flex items-center gap-2 w-fit">
          <span>+</span> Tambah Buku
        </button>
      </div>

      <!-- Filter & Search Bar -->
      <div class="flex flex-col sm:flex-row gap-3">
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Cari judul buku atau penulis..." 
          class="bg-[#141f36] border border-slate-700/60 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 flex-1"
        />
      </div>

      <!-- Table Section -->
      <div class="bg-[#141f36] border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-300">
            <thead class="bg-[#1c2b4a] text-slate-200 uppercase font-semibold border-b border-slate-700/60">
              <tr>
                <th class="p-4 w-12">NO</th>
                <th class="p-4">JUDUL BUKU</th>
                <th class="p-4">KATEGORI</th>
                <th class="p-4">PENULIS</th>
                <th class="p-4">STOK</th>
                <th class="p-4 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60">
              <tr v-for="(buku, index) in filteredBuku" :key="buku.id" class="hover:bg-slate-800/30 transition">
                <td class="p-4 font-semibold text-slate-400">{{ index + 1 }}</td>
                <td class="p-4 font-bold text-white">{{ buku.judul }}</td>
                <td class="p-4">
                  <span class="bg-blue-900/40 text-blue-300 px-2.5 py-1 rounded-md text-[11px] border border-blue-800/50 font-medium">
                    {{ buku.kategori }}
                  </span>
                </td>
                <td class="p-4 text-slate-300">{{ buku.penulis }}</td>
                <td class="p-4 font-semibold text-slate-200">{{ buku.stok }} pcs</td>
                <td class="p-4 text-center space-x-2">
                  <button @click="openModalEdit(buku)" class="bg-yellow-600/30 text-yellow-300 hover:bg-yellow-600/50 px-3 py-1.5 rounded-md text-[11px] font-semibold transition">
                    Edit
                  </button>
                  <button @click="deleteBuku(buku.id)" class="bg-red-600/30 text-red-300 hover:bg-red-600/50 px-3 py-1.5 rounded-md text-[11px] font-semibold transition">
                    Hapus
                  </button>
                </td>
              </tr>
              <tr v-if="filteredBuku.length === 0">
                <td colspan="6" class="p-8 text-center text-slate-400">
                  Tidak ada buku yang sesuai dengan pencarian.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </main>

    <!-- MODAL POPUP (Tambah/Edit) -->
    <div v-if="showModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-[#141f36] border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
        <h2 class="text-lg font-bold text-white">
          {{ isEditing ? 'Edit Buku' : 'Tambah Buku Baru' }}
        </h2>

        <form @submit.prevent="saveBuku" class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Judul Buku</label>
            <input 
              v-model="formBuku.judul" 
              type="text" 
              required
              placeholder="Masukkan judul buku..."
              class="w-full bg-[#0b132b] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <!-- INPUT KATEGORI TEKS BEBAS (BEBAS KETIK APA SAJA / REKOMENDASI) -->
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Kategori</label>
            <input 
              v-model="formBuku.kategori" 
              list="kategori-list"
              type="text" 
              required
              placeholder="Contoh: Novel, Romance, Fiksi, Komik, dll."
              class="w-full bg-[#0b132b] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
            <datalist id="kategori-list">
              <option value="Novel"></option>
              <option value="Romance"></option>
              <option value="Fiksi"></option>
              <option value="Sastra"></option>
              <option value="Desain"></option>
              <option value="Teknologi"></option>
              <option value="Filsafat"></option>
              <option value="Komik"></option>
              <option value="Pengembangan Diri"></option>
            </datalist>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Penulis</label>
            <input 
              v-model="formBuku.penulis" 
              type="text" 
              required
              placeholder="Masukkan nama penulis..."
              class="w-full bg-[#0b132b] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Jumlah Stok</label>
            <input 
              v-model.number="formBuku.stok" 
              type="number" 
              min="0"
              required
              class="w-full bg-[#0b132b] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div class="flex justify-end gap-2 pt-4">
            <button 
              type="button" 
              @click="closeModal" 
              class="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-700 text-slate-300 hover:bg-slate-600 transition"
            >
              Batal
            </button>
            <button 
              type="submit" 
              class="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-500 transition"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const daftarBuku = ref([
  { id: 1, judul: 'Mariposa', kategori: 'Novel', penulis: 'Luluk HF', stok: 12 },
  { id: 2, judul: 'Desain UI/UX dengan Figma', kategori: 'Desain', penulis: 'Gawin Caskey', stok: 8 },
  { id: 3, judul: 'Belajar Tailwind CSS v4', kategori: 'Teknologi', penulis: 'Admin Libry', stok: 15 },
  { id: 4, judul: 'Filosofi Teras', kategori: 'Filsafat', penulis: 'Henry Manampiring', stok: 5 },
])

const searchQuery = ref('')

const filteredBuku = computed(() => {
  return daftarBuku.value.filter(buku => {
    return buku.judul.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
           buku.penulis.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
           buku.kategori.toLowerCase().includes(searchQuery.value.toLowerCase())
  })
})

const showModal = ref(false)
const isEditing = ref(false)
const formBuku = ref({ id: null, judul: '', kategori: '', penulis: '', stok: 1 })

const openModalAdd = () => {
  isEditing.value = false
  formBuku.value = { id: null, judul: '', kategori: '', penulis: '', stok: 1 }
  showModal.value = true
}

const openModalEdit = (buku) => {
  isEditing.value = true
  formBuku.value = { ...buku }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const saveBuku = () => {
  if (isEditing.value) {
    const index = daftarBuku.value.findIndex(b => b.id === formBuku.value.id)
    if (index !== -1) {
      daftarBuku.value[index] = { ...formBuku.value }
    }
  } else {
    daftarBuku.value.push({
      ...formBuku.value,
      id: Date.now()
    })
  }
  closeModal()
}

const deleteBuku = (id) => {
  if (confirm('Apakah Anda yakin ingin menghapus buku ini?')) {
    daftarBuku.value = daftarBuku.value.filter(b => b.id !== id)
  }
}

const logout = () => {
  router.push('/')
}
</script>