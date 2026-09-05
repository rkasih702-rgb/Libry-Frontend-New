import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue' // Pastikan file LoginView kamu ada di folder views

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView // Halaman utama langsung menampilkan form login
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue')
    },
    {
      path: '/data-buku',
      name: 'data-buku',
      component: () => import('../views/DataBukuView.vue')
    },
    {
      path: '/data-petugas',
      name: 'data-petugas',
      component: () => import('../views/DataPetugasView.vue')
    },
    {
      path: '/jadwal-shift',
      name: 'jadwal-shift',
      component: () => import('../views/JadwalShiftView.vue')
    },
    {
      path: '/fasilitas',
      name: 'fasilitas',
      component: () => import('../views/FasilitasView.vue')
    }
  ]
})

export default router