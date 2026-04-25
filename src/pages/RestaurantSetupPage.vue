<template>
  <q-page>
    <div class="page-shell">
      <div class="page-title-row">
        <div class="page-title">
          <h1>My Restaurant Setup</h1>
          <p>Add your restaurant details before selling items and creating invoices.</p>
        </div>

        <div class="dense-actions">
          <q-btn unelevated no-caps color="teal-8" icon="inventory_2" label="All Items" :to="{ name: 'items' }" />
          <q-btn unelevated no-caps color="blue-7" icon="point_of_sale" label="Orders" :to="{ name: 'orders' }" />
          <q-btn unelevated no-caps color="amber-8" icon="receipt_long" label="Invoice" :to="{ name: 'invoices' }" />
        </div>
      </div>

      <div class="grid-two">
        <q-card class="panel-card" v-if="store.restaurant && !editing">
          <q-card-section class="row items-start q-col-gutter-md">
            <div class="col-auto">
              <img v-if="store.restaurant.logo" :src="store.restaurant.logo" class="logo-preview" alt="Restaurant logo">
              <div v-else class="logo-preview logo-placeholder">
                <q-icon name="storefront" size="44px" color="grey-6" />
              </div>
            </div>

            <div class="col">
              <div class="text-h5 text-weight-bold">{{ store.restaurant.name }}</div>
              <div class="soft-text q-mt-xs">{{ store.restaurant.address }}</div>
              <div class="q-mt-sm">
                <q-chip color="teal-1" text-color="teal-9" icon="call">{{ store.restaurant.phone }}</q-chip>
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <div class="text-subtitle1 text-weight-bold q-mb-sm">Branch Name(s)</div>
            <div class="q-gutter-sm">
              <q-chip
                v-for="branch in store.restaurant.branches"
                :key="branch"
                color="blue-1"
                text-color="blue-9"
                icon="apartment"
              >
                {{ branch }}
              </q-chip>
            </div>
          </q-card-section>

          <q-card-actions align="right" class="q-px-md q-pb-md">
            <q-btn flat no-caps color="negative" icon="delete" label="Delete" @click="deleteRestaurant" />
            <q-btn unelevated no-caps color="teal-8" icon="edit" label="Edit" @click="startEdit" />
          </q-card-actions>
        </q-card>

        <q-card v-else class="panel-card">
          <q-card-section>
            <div class="text-h6 text-weight-bold">{{ editing ? 'Edit Restaurant Info' : 'Add Restaurant Info' }}</div>
            <div class="soft-text q-mt-xs">All data will stay in Local Storage.</div>
          </q-card-section>

          <q-form @submit="saveRestaurant">
            <q-card-section class="form-grid">
              <q-input v-model="form.name" outlined label="Restaurant Name" :rules="[required]" />
              <q-input v-model="form.phone" outlined label="Phone Number" :rules="[required]" />
              <q-input v-model="form.address" outlined label="Address" class="span-full" :rules="[required]" />
              <q-file
                outlined
                clearable
                label="Logo Upload"
                accept="image/*"
                class="span-full"
                @update:model-value="readLogo"
              />

              <div class="span-full">
                <div class="row items-center justify-between q-mb-sm">
                  <div class="text-subtitle2 text-weight-bold">Branch Name(s)</div>
                  <q-btn flat round dense color="teal-8" icon="add" @click="addBranch">
                    <q-tooltip>Add branch</q-tooltip>
                  </q-btn>
                </div>

                <div class="q-gutter-sm">
                  <q-input
                    v-for="(branch, index) in form.branches"
                    :key="index"
                    v-model="form.branches[index]"
                    outlined
                    dense
                    label="Branch Name"
                    :rules="[required]"
                  >
                    <template #append>
                      <q-btn
                        flat
                        round
                        dense
                        color="negative"
                        icon="close"
                        :disable="form.branches.length === 1"
                        @click="removeBranch(index)"
                      />
                    </template>
                  </q-input>
                </div>
              </div>
            </q-card-section>

            <q-card-actions align="right" class="q-px-md q-pb-md">
              <q-btn v-if="editing" flat no-caps label="Cancel" @click="cancelEdit" />
              <q-btn unelevated no-caps color="teal-8" icon="save" label="Save Restaurant" type="submit" />
            </q-card-actions>
          </q-form>
        </q-card>

        <q-card class="panel-card">
          <q-card-section>
            <div class="text-h6 text-weight-bold">Quick POS Flow</div>
            <div class="soft-text q-mt-xs">The project follows the full hands-on test flow.</div>
          </q-card-section>

          <q-list separator>
            <q-item>
              <q-item-section avatar><q-icon name="how_to_reg" color="teal-8" /></q-item-section>
              <q-item-section>
                <q-item-label>Register and login</q-item-label>
                <q-item-label caption>Only saved users can enter the system.</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar><q-icon name="storefront" color="blue-7" /></q-item-section>
              <q-item-section>
                <q-item-label>Setup restaurant</q-item-label>
                <q-item-label caption>Add logo, address, phone, and branches.</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar><q-icon name="inventory_2" color="amber-8" /></q-item-section>
              <q-item-section>
                <q-item-label>Add menu items</q-item-label>
                <q-item-label caption>Cards include item name, category, price, edit, and delete.</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar><q-icon name="receipt_long" color="deep-orange-7" /></q-item-section>
              <q-item-section>
                <q-item-label>Place order and invoice</q-item-label>
                <q-item-label caption>Orders save to Local Storage and open invoice page.</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useAppStore } from '@/stores/appStore'

const $q = useQuasar()
const store = useAppStore()
const editing = ref(false)

const form = reactive({
  name: '',
  logo: '',
  address: '',
  phone: '',
  branches: ['']
})

const required = (value) => Boolean(String(value || '').trim()) || 'Required'

const fillForm = () => {
  form.name = store.restaurant?.name || ''
  form.logo = store.restaurant?.logo || ''
  form.address = store.restaurant?.address || ''
  form.phone = store.restaurant?.phone || ''
  form.branches = store.restaurant?.branches?.length ? [...store.restaurant.branches] : ['']
}

const startEdit = () => {
  fillForm()
  editing.value = true
}

const cancelEdit = () => {
  editing.value = false
  fillForm()
}

const addBranch = () => {
  form.branches.push('')
}

const removeBranch = (index) => {
  form.branches.splice(index, 1)
}

const readLogo = (file) => {
  if (!file) {
    form.logo = ''
    return
  }

  const reader = new FileReader()
  reader.onload = () => {
    form.logo = reader.result
  }
  reader.readAsDataURL(file)
}

const saveRestaurant = () => {
  store.saveRestaurant(form)
  editing.value = false
  fillForm()
  $q.notify({ type: 'positive', message: 'Restaurant information saved' })
}

const deleteRestaurant = () => {
  store.deleteRestaurant()
  fillForm()
  editing.value = false
  $q.notify({ type: 'warning', message: 'Restaurant information deleted' })
}

fillForm()
</script>
