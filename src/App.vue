<template>
  <q-layout view="hHh lpR fFf" class="app-layout">
    <q-header elevated class="app-header">
      <q-toolbar class="app-toolbar">
        <q-toolbar-title class="toolbar-title">
          <q-icon name="restaurant_menu" size="28px" />
          <span>Restaurant POS</span>
        </q-toolbar-title>

        <div class="nav-actions" v-if="store.isLoggedIn">
          <q-btn flat dense no-caps icon="storefront" label="Setup" :to="{ name: 'restaurant' }" />
          <q-btn flat dense no-caps icon="inventory_2" label="Items" :to="{ name: 'items' }" />
          <q-btn flat dense no-caps icon="point_of_sale" label="Orders" :to="{ name: 'orders' }" />
          <q-btn flat dense no-caps icon="receipt_long" label="Invoice" :to="{ name: 'invoices' }" />
        </div>

        <q-space />

        <q-toggle
          v-model="darkValue"
          color="amber"
          checked-icon="dark_mode"
          unchecked-icon="light_mode"
          keep-color
        />

        <q-btn
          v-if="store.isLoggedIn"
          flat
          round
          dense
          icon="logout"
          @click="logout"
        >
          <q-tooltip>Logout</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Dark } from 'quasar'
import { useAppStore } from '@/stores/appStore'

const store = useAppStore()
const router = useRouter()

const darkValue = computed({
  get: () => store.darkMode,
  set: (value) => {
    store.setDarkMode(value)
    Dark.set(value)
  }
})

onMounted(() => {
  Dark.set(store.darkMode)
})

const logout = () => {
  store.logout()
  router.push({ name: 'login' })
}
</script>
