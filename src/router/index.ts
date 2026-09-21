import { createRouter, createWebHistory } from 'vue-router'

// Wajib import kembali LoginAdmin yang asli di folder admin lu
import LoginAdmin from '@/views/admin/LoginAdmin.vue'
import LoginView from '@/views/LoginView.vue' // atau file login user lu
import DashboardAdmin from '@/views/admin/DashboardView.vue'
import Katalog from '@/views/user/KatalogView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/admin/login'
    },
    // INI JALUR ADMIN YANG TADI KETINGGALAN/KEHAPUS:
    {
      path: '/admin/login',
      name: 'login-admin',
      component: LoginAdmin
    },
    {
      path: '/login',
      name: 'login-user',
      component: LoginView
    },
    {
      path: '/dashboard',
      name: 'dashboard-admin',
      component: DashboardAdmin
    },
    {
      path: '/user/katalog',
      name: 'katalog-user',
      component: Katalog
    }
  ]
})

export default router