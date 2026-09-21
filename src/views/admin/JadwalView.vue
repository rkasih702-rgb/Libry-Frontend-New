<script setup lang="ts">
import { ref } from 'vue'

const showModal = ref(false)
const jadwal = ref([
  { id: 1, hari: 'Senin', petugas: 'Ray Admin & Budi', jamMasuk: '08:00', jamPulang: '16:00' },
  { id: 2, hari: 'Selasa', petugas: 'Siti Staff', jamMasuk: '09:00', jamPulang: '17:00' }
])

const form = ref({ hari: 'Rabu', petugas: '', jamMasuk: '08:00', jamPulang: '16:00' })

const tambahJadwal = () => {
  if (!form.value.petugas) return
  jadwal.value.push({ id: Date.now(), ...form.value })
  showModal.value = false
  form.value = { hari: 'Rabu', petugas: '', jamMasuk: '08:00', jamPulang: '16:00' }
}

const hapusJadwal = (id: number) => {
  jadwal.value = jadwal.value.filter(j => j.id !== id)
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
          <router-link to="/admin/petugas" class="block px-4 py-3 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-200/50">Data Petugas</router-link>
          <router-link to="/admin/jadwal" class="block px-4 py-3 rounded-xl text-xs font-semibold bg-[#8B5A2B] text-white shadow-md">Jadwal Shift</router-link>
          <router-link to="/admin/fasilitas" class="block px-4 py-3 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-200/50">Fasilitas</router-link>
        </nav>
      </div>
      <router-link to="/admin/login" class="text-xs text-stone-500 hover:text-rose-600 flex items-center justify-between pt-6 border-t border-stone-200 font-medium"><span>Logout</span><span class="w-2 h-2 rounded-full bg-amber-500"></span></router-link>
    </aside>

    <main class="flex-1 p-8 overflow-y-auto">
      <div class="max-w-6xl mx-auto space-y-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-xl font-bold text-stone-900 mb-1">Jadwal Shift Petugas</h1>
            <p class="text-xs text-stone-500">Pengaturan jadwal piket dan jam operasional tugas.</p>
          </div>
          <button @click="showModal = true" class="bg-[#8B5A2B] hover:bg-[#724822] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm">+ Tambah Jadwal</button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="j in jadwal" :key="j.id" class="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-3">
            <div class="flex justify-between items-center">
              <h2 class="font-bold text-stone-900 text-sm">{{ j.hari }}</h2>
              <button @click="hapusJadwal(j.id)" class="text-[10px] text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">Hapus</button>
            </div>
            <p class="text-xs text-stone-700 font-medium">Petugas: <span class="text-stone-500 font-normal">{{ j.petugas }}</span></p>
            <div class="flex gap-2 pt-1 text-[11px]">
              <span class="bg-[#f4efe6] text-[#8B5A2B] px-2.5 py-1 rounded-lg border border-stone-200 font-medium">Masuk: {{ j.jamMasuk }} WIB</span>
              <span class="bg-stone-100 text-stone-600 px-2.5 py-1 rounded-lg border border-stone-200 font-medium">Pulang: {{ j.jamPulang }} WIB</span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <div v-if="showModal" class="fixed inset-0 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white border border-stone-200 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-xl">
        <h2 class="text-base font-bold text-stone-900">Tambah Jadwal Shift</h2>
        <div class="space-y-3 text-xs">
          <select v-model="form.hari" class="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:border-[#8B5A2B]">
            <option>Senin</option><option>Selasa</option><option>Rabu</option><option>Kamis</option><option>Jumat</option><option>Sabtu</option>
          </select>
          <input v-model="form.petugas" type="text" placeholder="Nama Petugas Piket" class="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:border-[#8B5A2B]" />
          <div class="flex gap-2">
            <div class="flex-1"><label class="text-[10px] text-stone-500">Jam Masuk</label><input v-model="form.jamMasuk" type="text" placeholder="08:00" class="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 focus:outline-none" /></div>
            <div class="flex-1"><label class="text-[10px] text-stone-500">Jam Pulang</label><input v-model="form.jamPulang" type="text" placeholder="16:00" class="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 focus:outline-none" /></div>
          </div>
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <button @click="showModal = false" class="px-4 py-2 rounded-xl text-xs bg-stone-100 text-stone-600">Batal</button>
          <button @click="tambahJadwal" class="px-4 py-2 rounded-xl text-xs bg-[#8B5A2B] text-white">Simpan</button>
        </div>
      </div>
    </div>
  </div>
</template>