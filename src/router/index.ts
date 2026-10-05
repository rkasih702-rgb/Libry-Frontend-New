import { createRouter, createWebHistory } from 'vue-router'

// Import Halaman Autentikasi
import LoginView from '@/views/LoginView.vue'
import LoginAdmin from '@/views/admin/LoginAdmin.vue'

// Import Halaman Admin
import DashboardAdmin from '@/views/admin/DashboardView.vue'
import DataBukuAdmin from '@/views/admin/DataBukuView.vue'
import DataPetugasAdmin from '@/views/admin/DataPetugasView.vue'
import JadwalAdmin from '@/views/admin/JadwalView.vue'
import FasilitasAdmin from '@/views/admin/FasilitasView.vue'

// Import Halaman User / Pengunjung
import KatalogUser from '@/views/user/KatalogView.vue'
import PinjamanUser from '@/views/user/PinjamanView.vue'
import FasilitasUser from '@/views/user/FasilitasUserView.vue'

// Import Halaman Pustakawan
import PustakawanView from '@/views/pustakawan/PustakawanView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/admin/login',
      name: 'login-admin',
      component: LoginAdmin
    },
    
    // --- Rute Panel Admin ---
    {
      path: '/dashboard',
      name: 'dashboard-admin',
      component: DashboardAdmin
    },
    {
      path: '/admin/buku',
      alias: '/data-buku', // Ditambahkan alias agar jalur /data-buku maupun /admin/buku sama-sama valid
      name: 'admin-buku',
      component: DataBukuAdmin
    },
    {
      path: '/admin/petugas',
      name: 'admin-petugas',
      component: DataPetugasAdmin
    },
    {
      path: '/admin/jadwal',
      name: 'admin-jadwal',
      component: JadwalAdmin
    },
    {
      path: '/admin/fasilitas',
      name: 'admin-fasilitas',
      component: FasilitasAdmin
    },

    // --- Rute Panel User ---
    {
      path: '/user/katalog',
      name: 'katalog-user',
      component: KatalogUser
    },
    {
      path: '/user/peminjaman',
      name: 'pinjaman-user',
      component: PinjamanUser
    },
    {
      path: '/user/fasilitas',
      name: 'fasilitas-user',
      component: FasilitasUser
    },

    // --- Rute Panel Pustakawan ---
    {
      path: '/pustakawan',
      alias: ['/pustakawan/dashboard', '/pustakawan/transaksi'],
      name: 'pustakawan',
      component: PustakawanView
    }
  ]
})

export default router