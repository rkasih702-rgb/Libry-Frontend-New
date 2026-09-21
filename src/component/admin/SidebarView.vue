<template>
  <aside class="w-64 bg-[#111d40] border-r border-slate-800 p-6 flex flex-col justify-between shrink-0 min-h-screen">
    <div class="space-y-8">
      <!-- Profile User Admin -->
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm text-white shadow-md">
          RA
        </div>
        <div>
          <h2 class="font-bold text-sm text-white leading-tight">ray</h2>
          <p class="text-[10px] text-slate-400">Administrator</p>
        </div>
      </div>

      <!-- Navigasi Menu Admin -->
      <nav class="space-y-1.5">
        <router-link
          to="/admin/dashboard"
          class="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition"
          active-class="bg-blue-600 text-white shadow-lg shadow-blue-600/30"
        >
          <span>Dashboard</span>
        </router-link>

        <router-link
          to="/admin/data-buku"
          class="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition"
          active-class="bg-blue-600 text-white shadow-lg shadow-blue-600/30"
        >
          <span>Data Buku</span>
        </router-link>

        <router-link
          to="/admin/data-petugas"
          class="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition"
          active-class="bg-blue-600 text-white shadow-lg shadow-blue-600/30"
        >
          <span>Data Petugas</span>
        </router-link>

        <router-link
          to="/admin/jadwal"
          class="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition"
          active-class="bg-blue-600 text-white shadow-lg shadow-blue-600/30"
        >
          <span>Jadwal Shift</span>
        </router-link>

        <router-link
          to="/admin/fasilitas"
          class="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition"
          active-class="bg-blue-600 text-white shadow-lg shadow-blue-600/30"
        >
          <span>Fasilitas</span>
        </router-link>
      </nav>
    </div>

    <!-- Tombol Logout -->
    <router-link
      to="/admin/login"
      class="text-xs text-slate-400 hover:text-red-400 transition flex items-center justify-between pt-6 border-t border-slate-800/80 font-medium"
    >
      <span>Logout</span>
      <span class="w-2 h-2 rounded-full bg-amber-500"></span>
    </router-link>
  </aside>
</template>