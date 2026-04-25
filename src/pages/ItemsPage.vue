<template>
  <q-page>
    <div class="page-shell">
      <div class="page-title-row">
        <div class="page-title">
          <h1>All Items</h1>
          <p>View all restaurant items in card format and manage menu prices.</p>
        </div>

        <q-btn unelevated no-caps color="teal-8" icon="add" label="Add New Item" @click="openAdd" />
      </div>

      <q-card class="panel-card q-mb-md">
        <q-card-section class="form-grid">
          <q-input v-model="search" outlined dense clearable label="Search items" debounce="200">
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
        <q-card v-for="item in filteredItems" :key="item.id" class="item-card">
          <q-card-section>
            <div class="row items-start justify-between no-wrap">
              <div>
                <div class="text-h6 text-weight-bold">{{ item.name }}</div>
                <q-chip dense color="blue-1" text-color="blue-9" icon="category">{{ item.category }}</q-chip>
              </div>
              <div class="price-text">${{ item.price.toFixed(2) }}</div>
            </div>
          </q-card-section>

          <q-card-actions align="right" class="q-px-md q-pb-md">
            <q-btn flat round color="blue-7" icon="edit" @click="openEdit(item)">
              <q-tooltip>Edit</q-tooltip>
            </q-btn>
            <q-btn flat round color="negative" icon="delete" @click="deleteItem(item.id)">
              <q-tooltip>Delete</q-tooltip>
            </q-btn>
          </q-card-actions>
        </q-card>
      </div>

      <div v-else class="empty-box">
        <div>
          <q-icon name="inventory_2" size="46px" />
          <div class="text-subtitle1 text-weight-bold q-mt-sm">No items found</div>
          <div class="soft-text">Add a new item or change your search filter.</div>
        </div>
      </div>
    </div>

    <q-dialog v-model="dialog">
      <q-card style="width: min(440px, 92vw)">
        <q-card-section>
          <div class="text-h6 text-weight-bold">{{ editingId ? 'Edit Item' : 'Add New Item' }}</div>
        </q-card-section>

        <q-form @submit="saveItem">
          <q-card-section class="q-gutter-md">
            <q-input v-model="form.name" outlined label="Item Name" :rules="[required]" />
            <q-input v-model="form.category" outlined label="Category" :rules="[required]" />
            <q-input v-model.number="form.price" outlined type="number" min="0" step="0.01" label="Price" :rules="[positivePrice]" />
          </q-card-section>

          <q-card-actions align="right" class="q-px-md q-pb-md">
            <q-btn flat no-caps label="Cancel" v-close-popup />
            <q-btn unelevated no-caps color="teal-8" icon="save" label="Save" type="submit" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useAppStore } from '@/stores/appStore'

const $q = useQuasar()
const store = useAppStore()

const dialog = ref(false)
const editingId = ref('')
const search = ref('')
const category = ref(null)

const form = reactive({
  name: '',
  category: '',
  price: 0
})

const required = (value) => Boolean(String(value || '').trim()) || 'Required'
const positivePrice = (value) => Number(value) > 0 || 'Price must be greater than zero'

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

const resetForm = () => {
  form.name = ''
  form.category = ''
  form.price = 0
  editingId.value = ''
}

const openAdd = () => {
  resetForm()
  dialog.value = true
}

const openEdit = (item) => {
  form.name = item.name
  form.category = item.category
  form.price = item.price
  editingId.value = item.id
  dialog.value = true
}

const saveItem = () => {
  if (editingId.value) {
    store.updateItem(editingId.value, form)
    $q.notify({ type: 'positive', message: 'Item updated' })
  } else {
    store.addItem(form)
    $q.notify({ type: 'positive', message: 'Item added' })
  }

  dialog.value = false
  resetForm()
}

const deleteItem = (id) => {
  store.deleteItem(id)
  $q.notify({ type: 'warning', message: 'Item deleted' })
}
</script>
