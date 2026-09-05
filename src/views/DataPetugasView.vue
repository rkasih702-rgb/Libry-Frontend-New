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
          <button @click="router.push('/data-buku')" class="w-full text-left px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/40 font-semibold text-sm transition">
            Data Buku
          </button>
          <button class="w-full text-left px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm shadow-md transition">
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
          <h1 class="text-2xl font-bold">Data Petugas Perpustakaan</h1>
          <p class="text-xs text-slate-400">Kelola profil, peran, dan status keaktifan petugas</p>
        </div>
        <button @click="openModalAdd" class="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-md transition flex items-center gap-2 w-fit">
          <span>+</span> Tambah Petugas
        </button>
      </div>

      <!-- Filter & Search Bar -->
      <div class="flex flex-col sm:flex-row gap-3">
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Cari nama petugas atau NIP..." 
          class="bg-[#141f36] border border-slate-700/60 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 flex-1"
        />
        <select 
          v-model="selectedRole"
          class="bg-[#141f36] border border-slate-700/60 rounded-xl px-4 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer"
        >
          <option value="">Semua Peran</option>
          <option value="Pustakawan Utama">Pustakawan Utama</option>
          <option value="Staf Sirkulasi">Staf Sirkulasi</option>
          <option value="Staf IT & Digital">Staf IT & Digital</option>
          <option value="Administrasi">Administrasi</option>
        </select>
      </div>

      <!-- Table Section -->
      <div class="bg-[#141f36] border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-300">
            <thead class="bg-[#1c2b4a] text-slate-200 uppercase font-semibold border-b border-slate-700/60">
              <tr>
                <th class="p-4 w-12">No</th>
                <th class="p-4">NIP</th>
                <th class="p-4">Nama Petugas</th>
                <th class="p-4">Peran / Jabatan</th>
                <th class="p-4">Email</th>
                <th class="p-4">Status</th>
                <th class="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60">
              <tr v-for="(petugas, index) in filteredPetugas" :key="petugas.id" class="hover:bg-slate-800/30 transition">
                <td class="p-4 font-semibold text-slate-400">{{ index + 1 }}</td>
                <td class="p-4 font-mono text-slate-300">{{ petugas.nip }}</td>
                <td class="p-4 font-bold text-white flex items-center gap-2">
                  <div class="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-blue-400">
                    {{ getInitials(petugas.nama) }}
                  </div>
                  {{ petugas.nama }}
                </td>
                <td class="p-4">
                  <span class="bg-blue-900/40 text-blue-300 px-2.5 py-1 rounded-md text-[11px] border border-blue-800/50">
                    {{ petugas.peran }}
                  </span>
                </td>
                <td class="p-4 text-slate-400">{{ petugas.email }}</td>
                <td class="p-4">
                  <span 
                    :class="petugas.status === 'Aktif' ? 'bg-emerald-900/40 text-emerald-300 border-emerald-800/50' : 'bg-rose-900/40 text-rose-300 border-rose-800/50'"
                    class="px-2.5 py-1 rounded-md text-[11px] border font-semibold"
                  >
                    {{ petugas.status }}
                  </span>
                </td>
                <td class="p-4 text-center space-x-2">
                  <button @click="openModalEdit(petugas)" class="bg-yellow-600/30 text-yellow-300 hover:bg-yellow-600/50 px-3 py-1.5 rounded-md text-[11px] font-semibold transition">
                    Edit
                  </button>
                  <button @click="deletePetugas(petugas.id)" class="bg-red-600/30 text-red-300 hover:bg-red-600/50 px-3 py-1.5 rounded-md text-[11px] font-semibold transition">
                    Hapus
                  </button>
                </td>
              </tr>
              <tr v-if="filteredPetugas.length === 0">
                <td colspan="7" class="p-8 text-center text-slate-400">
                  Tidak ada data petugas yang sesuai.
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
          {{ isEditing ? 'Edit Data Petugas' : 'Tambah Petugas Baru' }}
        </h2>

        <form @submit.prevent="savePetugas" class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">NIP (Nomor Induk Petugas)</label>
            <input 
              v-model="formPetugas.nip" 
              type="text" 
              required
              placeholder="Contoh: PTG-1005"
              class="w-full bg-[#0b132b] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Nama Lengkap</label>
            <input 
              v-model="formPetugas.nama" 
              type="text" 
              required
              class="w-full bg-[#0b132b] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Peran / Jabatan</label>
            <select 
              v-model="formPetugas.peran" 
              required
              class="w-full bg-[#0b132b] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="Pustakawan Utama">Pustakawan Utama</option>
              <option value="Staf Sirkulasi">Staf Sirkulasi</option>
              <option value="Staf IT & Digital">Staf IT & Digital</option>
              <option value="Administrasi">Administrasi</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Email</label>
            <input 
              v-model="formPetugas.email" 
              type="email" 
              required
              class="w-full bg-[#0b132b] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Status Keaktifan</label>
            <select 
              v-model="formPetugas.status" 
              required
              class="w-full bg-[#0b132b] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="Aktif">Aktif</option>
              <option value="Nonaktif">Nonaktif</option>
            </select>
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

// Data dummy petugas
const daftarPetugas = ref([
  { id: 1, nip: 'PTG-1001', nama: 'Gawin Caskey', peran: 'Pustakawan Utama', email: 'gawin@libry.com', status: 'Aktif' },
  { id: 2, nip: 'PTG-1002', nama: 'Krist Perawat', peran: 'Staf Sirkulasi', email: 'krist@libry.com', status: 'Aktif' },
  { id: 3, nip: 'PTG-1003', nama: 'Singto Prachaya', peran: 'Staf IT & Digital', email: 'singto@libry.com', status: 'Aktif' },
  { id: 4, nip: 'PTG-1004', nama: 'Gun Atthaphan', peran: 'Administrasi', email: 'gun@libry.com', status: 'Nonaktif' },
])

// Filter & Search
const searchQuery = ref('')
const selectedRole = ref('')

const filteredPetugas = computed(() => {
  return daftarPetugas.value.filter(petugas => {
    const matchSearch = petugas.nama.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                        petugas.nip.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchRole = selectedRole.value === '' || petugas.peran === selectedRole.value
    return matchSearch && matchRole
  })
})

// Function ambil inisial nama
const getInitials = (nama) => {
  return nama
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Modal & Form Handling
const showModal = ref(false)
const isEditing = ref(false)
const formPetugas = ref({ id: null, nip: '', nama: '', peran: 'Pustakawan Utama', email: '', status: 'Aktif' })

const openModalAdd = () => {
  isEditing.value = false
  formPetugas.value = { id: null, nip: '', nama: '', peran: 'Pustakawan Utama', email: '', status: 'Aktif' }
  showModal.value = true
}

const openModalEdit = (petugas) => {
  isEditing.value = true
  formPetugas.value = { ...petugas }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const savePetugas = () => {
  if (isEditing.value) {
    const index = daftarPetugas.value.findIndex(p => p.id === formPetugas.value.id)
    if (index !== -1) {
      daftarPetugas.value[index] = { ...formPetugas.value }
    }
  } else {
    daftarPetugas.value.push({
      ...formPetugas.value,
      id: Date.now()
    })
  }
  closeModal()
}

const deletePetugas = (id) => {
  if (confirm('Apakah Anda yakin ingin menghapus data petugas ini?')) {
    daftarPetugas.value = daftarPetugas.value.filter(p => p.id !== id)
  }
}

const logout = () => {
  router.push('/')
}
</script>