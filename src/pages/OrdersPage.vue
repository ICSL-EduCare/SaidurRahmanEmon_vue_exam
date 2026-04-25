<template>
  <q-page>
    <div class="page-shell">
      <div class="page-title-row">
        <div class="page-title">
          <h1>Order Page</h1>
          <p>Select item cards, fill customer details, and submit the order.</p>
        </div>

        <q-btn unelevated no-caps color="amber-8" icon="receipt_long" label="Invoice Page" :to="{ name: 'invoices' }" />
      </div>

      <div class="grid-two">
        <div>
          <q-card class="panel-card q-mb-md">
            <q-card-section class="form-grid">
              <q-input v-model="search" outlined dense clearable label="Search menu items" debounce="200">
                <template #prepend><q-icon name="search" /></template>
              </q-input>
              <q-select
                v-model="category"
                outlined
                dense
                clearable
                label="Filter by category"
                :options="categories"
              >
                <template #prepend><q-icon name="filter_alt" /></template>
              </q-select>
            </q-card-section>
          </q-card>

          <div v-if="filteredItems.length" class="card-grid">
            <q-card
              v-for="item in filteredItems"
              :key="item.id"
              class="item-card cursor-pointer"
              :class="{ selected: cart[item.id] }"
              @click="addToCart(item)"
            >
              <q-card-section>
                <div class="row items-start justify-between no-wrap">
                  <div>
                    <div class="text-subtitle1 text-weight-bold">{{ item.name }}</div>
                    <div class="soft-text">{{ item.category }}</div>
                  </div>
                  <div class="text-weight-bold">${{ item.price.toFixed(2) }}</div>
                </div>
              </q-card-section>

              <q-card-section v-if="cart[item.id]" class="q-pt-none">
                <q-badge color="teal-8" class="q-pa-sm">Chosen x {{ cart[item.id] }}</q-badge>
              </q-card-section>
            </q-card>
          </div>

          <div v-else class="empty-box">
            <div>
              <q-icon name="restaurant" size="46px" />
              <div class="text-subtitle1 text-weight-bold q-mt-sm">No menu items yet</div>
              <div class="soft-text">Go to All Items and add food first.</div>
            </div>
          </div>
        </div>

        <q-card class="panel-card">
          <q-card-section>
            <div class="text-h6 text-weight-bold">Customer & Chosen Items</div>
            <div class="soft-text q-mt-xs">Order information will be saved in Local Storage.</div>
          </q-card-section>

          <q-form @submit="submitOrder">
            <q-card-section class="form-grid">
              <q-input v-model="form.customerName" outlined label="Customer Name" :rules="[required]" />
              <q-input v-model="form.phone" outlined label="Phone Number" :rules="[required]" />
              <q-input v-model="form.tableNumber" outlined label="Table Number" :rules="[required]" />
              <q-input v-model="form.seatNumber" outlined label="Seat Number" :rules="[required]" />
            </q-card-section>

            <q-separator />

            <q-card-section>
              <div v-if="cartItems.length" class="q-gutter-sm">
                <div v-for="item in cartItems" :key="item.id" class="invoice-line">
                  <div>
                    <div class="text-weight-bold">{{ item.name }}</div>
                    <div class="soft-text">${{ item.price.toFixed(2) }} each</div>
                  </div>
                  <div class="row items-center q-gutter-xs no-wrap">
                    <q-btn round dense flat icon="remove" @click="decrease(item.id)" />
                    <q-badge color="teal-8" class="q-pa-sm">{{ item.qty }}</q-badge>
                    <q-btn round dense flat icon="add" @click="addToCart(item)" />
                  </div>
                </div>

                <div class="total-row">
                  <span>Total</span>
                  <span>${{ total.toFixed(2) }}</span>
                </div>
              </div>

              <div v-else class="empty-box">
                <div>
                  <q-icon name="shopping_cart" size="40px" />
                  <div class="q-mt-sm">No chosen items</div>
                </div>
              </div>
            </q-card-section>

            <q-card-actions align="right" class="q-px-md q-pb-md">
              <q-btn flat no-caps icon="backspace" label="Clear" @click="clearCart" />
              <q-btn unelevated no-caps color="teal-8" icon="check_circle" label="Submit Order" type="submit" />
            </q-card-actions>
          </q-form>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAppStore } from '@/stores/appStore'

const router = useRouter()
const $q = useQuasar()
const store = useAppStore()

const search = ref('')
const category = ref(null)
const cart = reactive({})

const form = reactive({
  customerName: '',
  phone: '',
  tableNumber: '',
  seatNumber: ''
})

const required = (value) => Boolean(String(value || '').trim()) || 'Required'

const categories = computed(() => {
  return [...new Set(store.items.map((item) => item.category).filter(Boolean))].sort()
})

const filteredItems = computed(() => {
  const text = search.value.trim().toLowerCase()

  return store.sortedItems.filter((item) => {
    const matchesText = !text || item.name.toLowerCase().includes(text) || item.category.toLowerCase().includes(text)
    const matchesCategory = !category.value || item.category === category.value
    return matchesText && matchesCategory
  })
})

const cartItems = computed(() => {
  return store.items
    .filter((item) => cart[item.id])
    .map((item) => ({
      ...item,
      qty: cart[item.id]
    }))
})

const total = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.price * item.qty, 0)
})

const addToCart = (item) => {
  cart[item.id] = (cart[item.id] || 0) + 1
}

const decrease = (id) => {
  if (!cart[id]) {
    return
  }

  cart[id] -= 1

  if (cart[id] <= 0) {
    delete cart[id]
  }
}

const clearCart = () => {
  Object.keys(cart).forEach((id) => {
    delete cart[id]
  })
}

const clearForm = () => {
  form.customerName = ''
  form.phone = ''
  form.tableNumber = ''
  form.seatNumber = ''
}

const submitOrder = () => {
  if (!cartItems.value.length) {
    $q.notify({ type: 'negative', message: 'Please choose at least one item' })
    return
  }

  const order = store.placeOrder(form, cartItems.value)
  $q.notify({ type: 'positive', message: 'Order submitted' })
  clearCart()
  clearForm()
  router.push({ name: 'invoices', query: { order: order.id } })
}
</script>
