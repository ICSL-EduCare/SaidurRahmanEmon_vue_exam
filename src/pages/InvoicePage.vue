<template>
  <q-page>
    <div class="page-shell">
      <div class="page-title-row">
        <div class="page-title">
          <h1>Invoice Page</h1>
          <p>Show all saved orders, latest upcoming orders first and older previous orders below.</p>
        </div>

        <q-btn unelevated no-caps color="teal-8" icon="point_of_sale" label="New Order" :to="{ name: 'orders' }" />
      </div>

      <q-card class="panel-card q-mb-md">
        <q-card-section>
          <q-input v-model="search" outlined dense clearable label="Search orders by customer, phone, table, or item" debounce="200">
            <template #prepend><q-icon name="search" /></template>
          </q-input>
        </q-card-section>
      </q-card>

      <section class="q-mb-xl">
        <div class="row items-center justify-between q-mb-md">
          <div class="text-h6 text-weight-bold">Upcoming Orders (Latest First)</div>
          <q-badge color="teal-8" class="q-pa-sm">{{ upcoming.length }}</q-badge>
        </div>

        <div v-if="upcoming.length" class="card-grid">
          <q-card v-for="order in upcoming" :key="order.id" class="order-card">
            <q-card-section>
              <div class="row items-start justify-between no-wrap">
                <div>
                  <div class="text-h6 text-weight-bold">{{ order.invoiceNo }}</div>
                  <div class="soft-text">{{ formatDate(order.createdAt) }}</div>
                </div>
                <q-chip dense color="teal-1" text-color="teal-9">Upcoming</q-chip>
              </div>

              <q-separator class="q-my-md" />

              <div class="q-gutter-xs">
                <div><b>Customer:</b> {{ order.customerName }}</div>
                <div><b>Phone:</b> {{ order.phone }}</div>
                <div><b>Table:</b> {{ order.tableNumber }} <b>Seat:</b> {{ order.seatNumber }}</div>
                <div><b>Total:</b> ${{ order.total.toFixed(2) }}</div>
              </div>
            </q-card-section>

            <q-card-actions class="q-px-md q-pb-md dense-actions">
              <q-btn flat round color="blue-7" icon="visibility" @click="viewOrder(order)">
                <q-tooltip>View Invoice</q-tooltip>
              </q-btn>
              <q-btn flat round color="teal-8" icon="download" @click="downloadOrder(order)">
                <q-tooltip>Download Invoice</q-tooltip>
              </q-btn>
              <q-btn flat round color="amber-8" icon="print" @click="printOrder(order)">
                <q-tooltip>Print Invoice</q-tooltip>
              </q-btn>
              <q-space />
              <q-btn outline no-caps color="teal-8" icon="done_all" label="Complete" @click="completeOrder(order.id)" />
            </q-card-actions>
          </q-card>
        </div>

        <div v-else class="empty-box">
          <div>
            <q-icon name="event_available" size="42px" />
            <div class="q-mt-sm">No upcoming orders</div>
          </div>
        </div>
      </section>

      <section>
        <div class="row items-center justify-between q-mb-md">
          <div class="text-h6 text-weight-bold">Previous Orders (Older Orders)</div>
          <q-badge color="blue-7" class="q-pa-sm">{{ previous.length }}</q-badge>
        </div>

        <div v-if="previous.length" class="card-grid">
          <q-card v-for="order in previous" :key="order.id" class="order-card">
            <q-card-section>
              <div class="row items-start justify-between no-wrap">
                <div>
                  <div class="text-h6 text-weight-bold">{{ order.invoiceNo }}</div>
                  <div class="soft-text">{{ formatDate(order.createdAt) }}</div>
                </div>
                <q-chip dense color="blue-1" text-color="blue-9">Previous</q-chip>
              </div>

              <q-separator class="q-my-md" />

              <div class="q-gutter-xs">
                <div><b>Customer:</b> {{ order.customerName }}</div>
                <div><b>Phone:</b> {{ order.phone }}</div>
                <div><b>Table:</b> {{ order.tableNumber }} <b>Seat:</b> {{ order.seatNumber }}</div>
                <div><b>Total:</b> ${{ order.total.toFixed(2) }}</div>
              </div>
            </q-card-section>

            <q-card-actions class="q-px-md q-pb-md dense-actions">
              <q-btn flat round color="blue-7" icon="visibility" @click="viewOrder(order)">
                <q-tooltip>View Invoice</q-tooltip>
              </q-btn>
              <q-btn flat round color="teal-8" icon="download" @click="downloadOrder(order)">
                <q-tooltip>Download Invoice</q-tooltip>
              </q-btn>
              <q-btn flat round color="amber-8" icon="print" @click="printOrder(order)">
                <q-tooltip>Print Invoice</q-tooltip>
              </q-btn>
              <q-space />
              <q-btn flat round color="negative" icon="delete" @click="deleteOrder(order.id)">
                <q-tooltip>Delete Order</q-tooltip>
              </q-btn>
            </q-card-actions>
          </q-card>
        </div>

        <div v-else class="empty-box">
          <div>
            <q-icon name="history" size="42px" />
            <div class="q-mt-sm">No previous orders</div>
          </div>
        </div>
      </section>
    </div>

    <q-dialog v-model="dialog">
      <q-card style="width: min(680px, 94vw)">
        <q-card-section class="row items-center">
          <div class="text-h6 text-weight-bold">Invoice</div>
          <q-space />
          <q-btn flat round dense icon="close" v-close-popup />
        </q-card-section>

        <q-card-section v-if="selectedOrder">
          <div class="invoice-paper">
            <div class="row items-start justify-between q-mb-md">
              <div>
                <div class="text-h5 text-weight-bold">{{ restaurantName }}</div>
                <div class="soft-text">{{ restaurantAddress }}</div>
                <div class="soft-text">{{ restaurantPhone }}</div>
              </div>
              <div class="text-right">
                <div class="text-h6 text-weight-bold">{{ selectedOrder.invoiceNo }}</div>
                <div class="soft-text">{{ formatDate(selectedOrder.createdAt) }}</div>
              </div>
            </div>

            <q-separator class="q-my-md" />

            <div class="q-mb-md">
              <div><b>Customer:</b> {{ selectedOrder.customerName }}</div>
              <div><b>Phone:</b> {{ selectedOrder.phone }}</div>
              <div><b>Table:</b> {{ selectedOrder.tableNumber }} <b>Seat:</b> {{ selectedOrder.seatNumber }}</div>
            </div>

            <div>
              <div v-for="item in selectedOrder.items" :key="item.id" class="invoice-line">
                <span>{{ item.name }} x {{ item.qty }}</span>
                <span>${{ (item.price * item.qty).toFixed(2) }}</span>
              </div>
            </div>

            <div class="total-row">
              <span>Total</span>
              <span>${{ selectedOrder.total.toFixed(2) }}</span>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-px-md q-pb-md" v-if="selectedOrder">
          <q-btn flat no-caps color="teal-8" icon="download" label="Download" @click="downloadOrder(selectedOrder)" />
          <q-btn unelevated no-caps color="amber-8" icon="print" label="Print" @click="printOrder(selectedOrder)" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAppStore } from '@/stores/appStore'

const $q = useQuasar()
const route = useRoute()
const store = useAppStore()
const search = ref('')
const dialog = ref(false)
const selectedOrder = ref(null)

const restaurantName = computed(() => store.restaurant?.name || 'Restaurant POS')
const restaurantAddress = computed(() => store.restaurant?.address || 'Restaurant address')
const restaurantPhone = computed(() => store.restaurant?.phone || 'Restaurant phone')

const orderMatches = (order) => {
  const text = search.value.trim().toLowerCase()

  if (!text) {
    return true
  }

  const itemText = order.items.map((item) => item.name).join(' ').toLowerCase()

  return [
    order.invoiceNo,
    order.customerName,
    order.phone,
    order.tableNumber,
    order.seatNumber,
    itemText
  ].some((value) => String(value).toLowerCase().includes(text))
}

const upcoming = computed(() => store.upcomingOrders.filter(orderMatches))
const previous = computed(() => store.previousOrders.filter(orderMatches))

const formatDate = (date) => {
  return new Date(date).toLocaleString()
}

const clean = (value) => {
  return String(value || '').replace(/[&<>"']/g, (match) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[match]))
}

const invoiceText = (order) => {
  const lines = [
    restaurantName.value,
    restaurantAddress.value,
    restaurantPhone.value,
    '',
    `Invoice: ${order.invoiceNo}`,
    `Date: ${formatDate(order.createdAt)}`,
    `Customer: ${order.customerName}`,
    `Phone: ${order.phone}`,
    `Table: ${order.tableNumber}`,
    `Seat: ${order.seatNumber}`,
    '',
    'Items'
  ]

  order.items.forEach((item) => {
    lines.push(`${item.name} x ${item.qty} = $${(item.price * item.qty).toFixed(2)}`)
  })

  lines.push('', `Total: $${order.total.toFixed(2)}`)
  return lines.join('\n')
}

const viewOrder = (order) => {
  selectedOrder.value = order
  dialog.value = true
}

const downloadOrder = (order) => {
  const blob = new Blob([invoiceText(order)], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${order.invoiceNo}.txt`
  link.click()
  URL.revokeObjectURL(url)
}

const printOrder = (order) => {
  const rows = order.items.map((item) => {
    return `<tr><td>${clean(item.name)}</td><td>${item.qty}</td><td>$${item.price.toFixed(2)}</td><td>$${(item.price * item.qty).toFixed(2)}</td></tr>`
  }).join('')
  const win = window.open('', '_blank')

  if (!win) {
    $q.notify({ type: 'negative', message: 'Please allow popups to print' })
    return
  }

  win.document.write(`
    <html>
      <head>
        <title>${clean(order.invoiceNo)}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; color: #111827; }
          h1, h2, p { margin: 0 0 8px; }
          table { width: 100%; border-collapse: collapse; margin-top: 18px; }
          th, td { border-bottom: 1px solid #d1d5db; padding: 10px; text-align: left; }
          .top { display: flex; justify-content: space-between; gap: 20px; margin-bottom: 20px; }
          .total { text-align: right; font-size: 22px; font-weight: 700; margin-top: 18px; }
        </style>
      </head>
      <body>
        <div class="top">
          <div>
            <h1>${clean(restaurantName.value)}</h1>
            <p>${clean(restaurantAddress.value)}</p>
            <p>${clean(restaurantPhone.value)}</p>
          </div>
          <div>
            <h2>${clean(order.invoiceNo)}</h2>
            <p>${clean(formatDate(order.createdAt))}</p>
          </div>
        </div>
        <p><b>Customer:</b> ${clean(order.customerName)}</p>
        <p><b>Phone:</b> ${clean(order.phone)}</p>
        <p><b>Table:</b> ${clean(order.tableNumber)} <b>Seat:</b> ${clean(order.seatNumber)}</p>
        <table>
          <thead>
            <tr><th>Item</th><th>Qty</th><th>Price</th><th>Amount</th></tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <div class="total">Total: $${order.total.toFixed(2)}</div>
      </body>
    </html>
  `)
  win.document.close()
  win.focus()
  win.print()
}

const completeOrder = (id) => {
  store.markOrderPrevious(id)
  $q.notify({ type: 'positive', message: 'Order moved to previous orders' })
}

const deleteOrder = (id) => {
  store.deleteOrder(id)
  $q.notify({ type: 'warning', message: 'Order deleted' })
}

const freshOrder = computed(() => {
  return store.orders.find((order) => order.id === route.query.order)
})

if (freshOrder.value) {
  viewOrder(freshOrder.value)
}
</script>
