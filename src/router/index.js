import { createRouter, createWebHistory } from 'vue-router'
import { useAppStore } from '@/stores/appStore'
import LoginPage from '@/pages/LoginPage.vue'
import RestaurantSetupPage from '@/pages/RestaurantSetupPage.vue'
import ItemsPage from '@/pages/ItemsPage.vue'
import OrdersPage from '@/pages/OrdersPage.vue'
import InvoicePage from '@/pages/InvoicePage.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginPage
  },
  {
    path: '/restaurant',
    name: 'restaurant',
    component: RestaurantSetupPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/items',
    name: 'items',
    component: ItemsPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/orders',
    name: 'orders',
    component: OrdersPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/invoices',
    name: 'invoices',
    component: InvoicePage,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const store = useAppStore()

  if (to.meta.requiresAuth && !store.isLoggedIn) {
    return { name: 'login' }
  }

  if (to.name === 'login' && store.isLoggedIn) {
    return { name: 'restaurant' }
  }

  return true
})

export default router
