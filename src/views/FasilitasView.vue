<template>
  <div class="flex min-h-screen bg-[#0b132b] text-white font-sans">
    
    <!-- SIDEBAR LEFT (SAMA PERSIS) -->
    <aside class="w-64 bg-[#141f36] border-r border-slate-800/60 flex flex-col justify-between p-6">
      <div>
        <div class="flex items-center gap-3 mb-10">
          <div class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm">
            GC
          </div>
          <span class="font-bold text-lg text-slate-100">Gawin Caskey</span>
        </div>

        <nav class="space-y-3">
          <button @click="router.push('/dashboard')" class="w-full text-left px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/40 font-semibold text-sm transition cursor-pointer">
            Dashboard
          </button>
          <button @click="router.push('/data-buku')" class="w-full text-left px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/40 font-semibold text-sm transition cursor-pointer">
            Data Buku
          </button>
          <button @click="router.push('/data-petugas')" class="w-full text-left px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/40 font-semibold text-sm transition cursor-pointer">
            Data Petugas
          </button>
          <button @click="router.push('/jadwal-shift')" class="w-full text-left px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/40 font-semibold text-sm transition cursor-pointer">
            Jadwal Shift
          </button>
          <button @click="router.push('/fasilitas')" class="w-full text-left px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm transition cursor-pointer">
            Fasilitas
          </button>
        </nav>
      </div>

      <button @click="logout" class="flex items-center gap-2 text-slate-400 hover:text-red-400 font-semibold text-sm px-4 py-2 transition cursor-pointer">
        Logout 🚪
      </button>
    </aside>

    <!-- MAIN CONTENT RIGHT -->
    <main class="flex-1 p-8 space-y-8">
      
      <!-- Banner Header + Tombol Tambah -->
      <div class="bg-[#1c2c5c] p-8 rounded-2xl border border-blue-500/20 shadow-lg flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold mb-1">Fasilitas Perpustakaan</h1>
          <p class="text-xs text-slate-300">Kelola inventaris, meja, kursi, dan sarana baca</p>
        </div>
        <button @click="showModal = true" class="bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-xl font-semibold text-sm transition cursor-pointer">
          + Tambah Fasilitas
        </button>
      </div>

      <!-- Cards Grid Fasilitas -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div v-for="item in facilityList" :key="item.id" class="bg-[#1c2b4a] p-5 rounded-xl border border-slate-700/40 flex flex-col justify-between space-y-4">
          <div class="space-y-3">
            <div class="w-12 h-12 bg-slate-700/40 rounded-full flex items-center justify-center text-2xl">
              {{ item.icon }}
            </div>
            <h3 class="font-bold text-lg text-white">{{ item.nama }}</h3>
            <p class="text-xs text-slate-300 leading-relaxed">{{ item.deskripsi }}</p>
          </div>
          <div class="flex justify-between items-center pt-3 border-t border-slate-700/40">
            <span class="text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 font-semibold">
              Kuantitas: {{ item.jumlah }}
            </span>
            <button @click="deleteFacility(item.id)" class="text-red-400 hover:text-red-300 text-xs font-semibold cursor-pointer">
              Hapus
            </button>
          </div>
        </div>
      </div>

    </main>

    <!-- MODAL FORM TAMBAH FASILITAS -->
    <div v-if="showModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-[#1c2b4a] border border-slate-700/60 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-xl">
        <div class="flex justify-between items-center border-b border-slate-700/60 pb-3">
          <h2 class="text-lg font-bold">Tambah Fasilitas Baru</h2>
          <button @click="showModal = false" class="text-slate-400 hover:text-white text-lg">✕</button>
        </div>

        <form @submit.prevent="addFacility" class="space-y-4 text-sm">
          <div>
            <label class="block text-slate-300 mb-1">Ikon Emoji</label>
            <input v-model="newFacility.icon" type="text" placeholder="Contoh: 🪑 / 🛜 / 💻" class="w-full bg-[#0b132b] border border-slate-700/60 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500" required />
          </div>
          <div>
            <label class="block text-slate-300 mb-1">Nama Fasilitas</label>
            <input v-model="newFacility.nama" type="text" placeholder="Contoh: Meja Belajar" class="w-full bg-[#0b132b] border border-slate-700/60 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500" required />
          </div>
          <div>
            <label class="block text-slate-300 mb-1">Kuantitas / Jumlah</label>
            <input v-model="newFacility.jumlah" type="text" placeholder="Contoh: 12 Unit" class="w-full bg-[#0b132b] border border-slate-700/60 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500" required />
          </div>
          <div>
            <label class="block text-slate-300 mb-1">Deskripsi</label>
            <textarea v-model="newFacility.deskripsi" rows="3" placeholder="Keterangan singkat..." class="w-full bg-[#0b132b] border border-slate-700/60 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500" required></textarea>
          </div>

          <div class="flex gap-3 pt-2">
            <button type="button" @click="showModal = false" class="w-1/2 bg-slate-700 hover:bg-slate-600 py-2.5 rounded-xl font-semibold transition">Batal</button>
            <button type="submit" class="w-1/2 bg-blue-600 hover:bg-blue-500 py-2.5 rounded-xl font-semibold transition">Simpan</button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const showModal = ref(false)

const facilityList = ref([
  { id: 1, icon: '🪑', nama: 'Meja & Kursi Baca', jumlah: '30 Set', deskripsi: 'Meja kayu jati dengan lampu baca individu' },
  { id: 2, icon: '💻', nama: 'Komputer Katalog', jumlah: '5 Unit', deskripsi: 'Akses cepat pencarian buku secara digital' }
])

const newFacility = ref({ icon: '🏛️', nama: '', jumlah: '', deskripsi: '' })

const addFacility = () => {
  facilityList.value.push({ id: Date.now(), ...newFacility.value })
  newFacility.value = { icon: '🏛️', nama: '', jumlah: '', deskripsi: '' }
  showModal.value = false
}

const deleteFacility = (id) => {
  facilityList.value = facilityList.value.filter(item => item.id !== id)
}

const logout = () => {
  router.push('/')
}
</script>