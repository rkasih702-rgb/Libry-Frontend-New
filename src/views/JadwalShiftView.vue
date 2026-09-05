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
          <button @click="router.push('/jadwal-shift')" class="w-full text-left px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm transition cursor-pointer">
            Jadwal Shift
          </button>
          <button @click="router.push('/fasilitas')" class="w-full text-left px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/40 font-semibold text-sm transition cursor-pointer">
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
          <h1 class="text-2xl font-bold mb-1">Jadwal Shift Petugas</h1>
          <p class="text-xs text-slate-300">Pengaturan jam kerja & pembagian waktu tugas</p>
        </div>
        <button @click="showModal = true" class="bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-xl font-semibold text-sm transition cursor-pointer">
          + Tambah Shift
        </button>
      </div>

      <!-- Tabel Jadwal Shift -->
      <div class="bg-[#1c2b4a] rounded-xl border border-slate-700/40 overflow-hidden">
        <table class="w-full text-left text-sm text-slate-200">
          <thead class="bg-[#141f36] text-slate-400 text-xs uppercase border-b border-slate-700/60">
            <tr>
              <th class="p-4">Hari / Waktu</th>
              <th class="p-4">Nama Petugas</th>
              <th class="p-4">Shift</th>
              <th class="p-4">Jam Kerja</th>
              <th class="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60">
            <tr v-for="item in shiftList" :key="item.id" class="hover:bg-slate-800/30 transition">
              <td class="p-4 font-semibold">{{ item.hari }}</td>
              <td class="p-4 text-blue-400 font-semibold">{{ item.nama }}</td>
              <td class="p-4">
                <span class="px-3 py-1 rounded-full text-xs font-semibold bg-blue-600/20 text-blue-400 border border-blue-500/30">
                  {{ item.shift }}
                </span>
              </td>
              <td class="p-4 text-slate-300">{{ item.jam }}</td>
              <td class="p-4 text-center">
                <button @click="deleteShift(item.id)" class="bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer">
                  Hapus
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </main>

    <!-- MODAL FORM TAMBAH SHIFT -->
    <div v-if="showModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-[#1c2b4a] border border-slate-700/60 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-xl">
        <div class="flex justify-between items-center border-b border-slate-700/60 pb-3">
          <h2 class="text-lg font-bold">Tambah Jadwal Shift</h2>
          <button @click="showModal = false" class="text-slate-400 hover:text-white text-lg">✕</button>
        </div>

        <form @submit.prevent="addShift" class="space-y-4 text-sm">
          <div>
            <label class="block text-slate-300 mb-1">Hari / Waktu</label>
            <input v-model="newShift.hari" type="text" placeholder="Contoh: Senin - Rabu" class="w-full bg-[#0b132b] border border-slate-700/60 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500" required />
          </div>
          <div>
            <label class="block text-slate-300 mb-1">Nama Petugas</label>
            <input v-model="newShift.nama" type="text" placeholder="Masukkan nama..." class="w-full bg-[#0b132b] border border-slate-700/60 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500" required />
          </div>
          <div>
            <label class="block text-slate-300 mb-1">Shift</label>
            <select v-model="newShift.shift" class="w-full bg-[#0b132b] border border-slate-700/60 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500">
              <option value="Pagi">Pagi</option>
              <option value="Siang">Siang</option>
              <option value="Malam">Malam</option>
            </select>
          </div>
          <div>
            <label class="block text-slate-300 mb-1">Jam Kerja</label>
            <input v-model="newShift.jam" type="text" placeholder="Contoh: 08:00 - 14:00" class="w-full bg-[#0b132b] border border-slate-700/60 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500" required />
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

const shiftList = ref([
  { id: 1, hari: 'Senin - Rabu', nama: 'Gawin Caskey', shift: 'Pagi', jam: '08:00 - 14:00' },
  { id: 2, hari: 'Kamis - Sabtu', nama: 'Siti Sarah', shift: 'Siang', jam: '13:00 - 19:00' }
])

const newShift = ref({ hari: '', nama: '', shift: 'Pagi', jam: '' })

const addShift = () => {
  shiftList.value.push({ id: Date.now(), ...newShift.value })
  newShift.value = { hari: '', nama: '', shift: 'Pagi', jam: '' }
  showModal.value = false
}

const deleteShift = (id) => {
  shiftList.value = shiftList.value.filter(item => item.id !== id)
}

const logout = () => {
  router.push('/')
}
</script>