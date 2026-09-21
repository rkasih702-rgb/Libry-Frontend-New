<script setup lang="ts">
import { ref } from 'vue'

const showModal = ref(false)
const fasilitas = ref([
  { id: 1, nama: 'Ruang Baca Utama', kapasitas: '50 Orang', status: 'Tersedia', kondisi: 'Baik' },
  { id: 2, nama: 'Komputer Riset 03', kapasitas: '1 Orang', status: 'Perbaikan', kondisi: 'Rusak Ringan' }
])

const form = ref({ nama: '', kapasitas: '', status: 'Tersedia', kondisi: 'Baik' })

const tambahFasilitas = () => {
  if (!form.value.nama) return
  fasilitas.value.push({ id: Date.now(), ...form.value })
  showModal.value = false
  form.value = { nama: '', kapasitas: '', status: 'Tersedia', kondisi: 'Baik' }
}

const hapusFasilitas = (id: number) => {
  fasilitas.value = fasilitas.value.filter(f => f.id !== id)
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
          <router-link to="/admin/jadwal" class="block px-4 py-3 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-200/50">Jadwal Shift</router-link>
          <router-link to="/admin/fasilitas" class="block px-4 py-3 rounded-xl text-xs font-semibold bg-[#8B5A2B] text-white shadow-md">Fasilitas</router-link>
        </nav>
      </div>
      <router-link to="/admin/login" class="text-xs text-stone-500 hover:text-rose-600 flex items-center justify-between pt-6 border-t border-stone-200 font-medium"><span>Logout</span><span class="w-2 h-2 rounded-full bg-amber-500"></span></router-link>
    </aside>

    <main class="flex-1 p-8 overflow-y-auto">
      <div class="max-w-6xl mx-auto space-y-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-xl font-bold text-stone-900 mb-1">Fasilitas Perpustakaan</h1>
            <p class="text-xs text-stone-500">Kelola kondisi ruangan, inventaris, dan status kerusakannya.</p>
          </div>
          <button @click="showModal = true" class="bg-[#8B5A2B] hover:bg-[#724822] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm">+ Tambah Fasilitas</button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="f in fasilitas" :key="f.id" class="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-3">
            <div class="flex justify-between items-start">
              <div>
                <h2 class="font-bold text-stone-900 text-sm">{{ f.nama }}</h2>
                <p class="text-xs text-stone-500">Kapasitas: {{ f.kapasitas }}</p>
              </div>
              <button @click="hapusFasilitas(f.id)" class="text-[10px] text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">Hapus</button>
            </div>
            <div class="flex gap-2 pt-1 text-[10px]">
              <span class="px-2.5 py-1 rounded-lg border font-medium" :class="f.status === 'Tersedia' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'">{{ f.status }}</span>
              <span class="px-2.5 py-1 rounded-lg border font-medium" :class="f.kondisi === 'Baik' ? 'bg-sky-50 text-sky-700 border-sky-200' : 'bg-rose-50 text-rose-700 border-rose-200'">Kondisi: {{ f.kondisi }}</span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <div v-if="showModal" class="fixed inset-0 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white border border-stone-200 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-xl">
        <h2 class="text-base font-bold text-stone-900">Tambah Fasilitas Baru</h2>
        <div class="space-y-3 text-xs">
          <input v-model="form.nama" type="text" placeholder="Nama Fasilitas / Ruangan" class="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:border-[#8B5A2B]" />
          <input v-model="form.kapasitas" type="text" placeholder="Kapasitas (Contoh: 20 Orang)" class="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:border-[#8B5A2B]" />
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="text-[10px] text-stone-500">Status</label>
              <select v-model="form.status" class="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 focus:outline-none">
                <option>Tersedia</option><option>Perbaikan</option><option>Penuh</option>
              </select>
            </div>
            <div>
              <label class="text-[10px] text-stone-500">Kondisi Fisik</label>
              <select v-model="form.kondisi" class="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 focus:outline-none">
                <option>Baik</option><option>Rusak Ringan</option><option>Rusak Berat</option>
              </select>
            </div>
          </div>
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <button @click="showModal = false" class="px-4 py-2 rounded-xl text-xs bg-stone-100 text-stone-600">Batal</button>
          <button @click="tambahFasilitas" class="px-4 py-2 rounded-xl text-xs bg-[#8B5A2B] text-white">Simpan</button>
        </div>
      </div>
    </div>
  </div>
</template>