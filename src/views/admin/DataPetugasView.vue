<script setup lang="ts">
import { ref } from 'vue'

const showModal = ref(false)
const petugasList = ref([
  { id: 1, nama: 'Ray Admin', nip: 'PST-01', jabatan: 'Super Admin', status: 'Aktif' },
  { id: 2, nama: 'Budi Pustakawan', nip: 'PST-02', jabatan: 'Layanan', status: 'Aktif' }
])

const form = ref({ nip: '', nama: '', jabatan: 'Layanan', status: 'Aktif' })

const tambahPetugas = () => {
  if (!form.value.nama || !form.value.nip) return
  petugasList.value.push({ id: Date.now(), ...form.value })
  form.value = { nip: '', nama: '', jabatan: 'Layanan', status: 'Aktif' }
  showModal.value = false
}

const hapusPetugas = (id: number) => {
  petugasList.value = petugasList.value.filter(p => p.id !== id)
}
</script>

<template>
  <div class="min-h-screen bg-[#fdfbf7] text-stone-800 flex font-sans">
    <aside class="w-64 bg-[#f4efe6] border-r border-stone-200 p-6 flex flex-col justify-between shrink-0 min-h-screen shadow-sm">
      <div class="space-y-8">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-[#8B5A2B] flex items-center justify-center font-bold text-sm text-white shadow-md">RA</div>
          <div><h2 class="font-bold text-xs text-stone-900">Ray</h2><p class="text-[10px] text-stone-500">Administrator</p></div>
        </div>
        <nav class="space-y-1.5">
          <router-link to="/dashboard" class="block px-4 py-3 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-200/50">Dashboard</router-link>
          <router-link to="/admin/buku" class="block px-4 py-3 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-200/50">Data Buku</router-link>
          <router-link to="/admin/petugas" class="block px-4 py-3 rounded-xl text-xs font-semibold bg-[#8B5A2B] text-white shadow-md">Data Petugas</router-link>
          <router-link to="/admin/jadwal" class="block px-4 py-3 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-200/50">Jadwal Shift</router-link>
          <router-link to="/admin/fasilitas" class="block px-4 py-3 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-200/50">Fasilitas</router-link>
        </nav>
      </div>
      <router-link to="/admin/login" class="text-xs text-stone-500 hover:text-rose-600 flex items-center justify-between pt-6 border-t border-stone-200 font-medium"><span>Logout</span><span class="w-2 h-2 rounded-full bg-amber-500"></span></router-link>
    </aside>

    <main class="flex-1 p-8 overflow-y-auto">
      <div class="max-w-6xl mx-auto space-y-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-xl font-bold text-stone-900 mb-1">Manajemen Petugas</h1>
            <p class="text-xs text-stone-500">Daftar staf pengelola perpustakaan.</p>
          </div>
          <button @click="showModal = true" class="bg-[#8B5A2B] hover:bg-[#724822] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm">+ Tambah Petugas</button>
        </div>

        <div class="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="border-b border-stone-200 text-stone-500 font-medium">
                <th class="pb-3">NIP</th>
                <th class="pb-3">NAMA</th>
                <th class="pb-3">JABATAN</th>
                <th class="pb-3">STATUS</th>
                <th class="pb-3 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-100">
              <tr v-for="p in petugasList" :key="p.id" class="hover:bg-stone-50/50">
                <td class="py-3.5 font-mono text-stone-500">{{ p.nip }}</td>
                <td class="py-3.5 font-bold text-stone-900">{{ p.nama }}</td>
                <td class="py-3.5 text-stone-600">{{ p.jabatan }}</td>
                <td class="py-3.5"><span class="bg-emerald-50 text-emerald-700 text-[10px] px-2.5 py-1 rounded-lg border border-emerald-200 font-medium">{{ p.status }}</span></td>
                <td class="py-3.5 text-center">
                  <button @click="hapusPetugas(p.id)" class="px-2.5 py-1 text-[11px] bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg border border-rose-200">Hapus</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <div v-if="showModal" class="fixed inset-0 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white border border-stone-200 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-xl">
        <h2 class="text-base font-bold text-stone-900">Tambah Petugas Baru</h2>
        <div class="space-y-3 text-xs">
          <input v-model="form.nip" type="text" placeholder="NIP (Contoh: PST-03)" class="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:border-[#8B5A2B]" />
          <input v-model="form.nama" type="text" placeholder="Nama Lengkap" class="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:border-[#8B5A2B]" />
          <input v-model="form.jabatan" type="text" placeholder="Jabatan" class="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:border-[#8B5A2B]" />
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <button @click="showModal = false" class="px-4 py-2 rounded-xl text-xs bg-stone-100 text-stone-600">Batal</button>
          <button @click="tambahPetugas" class="px-4 py-2 rounded-xl text-xs bg-[#8B5A2B] text-white">Simpan</button>
        </div>
      </div>
    </div>
  </div>
</template>