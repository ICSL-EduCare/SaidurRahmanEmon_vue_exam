<template>
  <q-page class="auth-page">
    <div class="auth-wrap">
      <section class="brand-side">
        <div>
          <q-icon name="point_of_sale" size="56px" />
          <h1>Retail POS for Restaurants</h1>
          <p>Manage setup, menu items, orders, invoices, and customer details from one clean responsive screen.</p>
        </div>

        <div class="q-mt-xl">
          <q-chip color="white" text-color="teal-9" icon="storage">Local Storage</q-chip>
          <q-chip color="white" text-color="teal-9" icon="dark_mode">Theme</q-chip>
          <q-chip color="white" text-color="teal-9" icon="search">Search</q-chip>
        </div>
      </section>

      <div class="auth-card-stack">
        <q-card class="panel-card">
          <q-card-section>
            <div class="text-h5 text-weight-bold">Login</div>
            <div class="soft-text q-mt-xs">Use a registered account only.</div>
          </q-card-section>

          <q-form @submit="submitLogin">
            <q-card-section class="q-gutter-md">
              <q-input
                v-model="login.email"
                outlined
                type="email"
                label="Email"
                autocomplete="email"
                :rules="[required]"
              />
              <q-input
                v-model="login.password"
                outlined
                :type="showLoginPassword ? 'text' : 'password'"
                label="Password"
                autocomplete="current-password"
                :rules="[required]"
              >
                <template #append>
                  <q-btn
                    flat
                    round
                    dense
                    :icon="showLoginPassword ? 'visibility_off' : 'visibility'"
                    @click="showLoginPassword = !showLoginPassword"
                  />
                </template>
              </q-input>
            </q-card-section>

            <q-card-actions align="between" class="q-px-md q-pb-md">
              <q-btn flat no-caps color="teal-8" label="Register" @click="showRegister = !showRegister" />
              <q-btn unelevated no-caps color="teal-8" icon="login" label="Login" type="submit" />
            </q-card-actions>
          </q-form>
        </q-card>

        <q-card v-if="showRegister" class="panel-card">
          <q-card-section>
            <div class="text-h6 text-weight-bold">Registration Card</div>
            <div class="soft-text q-mt-xs">This opens in the same view, not another route.</div>
          </q-card-section>

          <q-form @submit="submitRegister">
            <q-card-section class="form-grid">
              <q-input v-model="register.name" outlined label="Name" :rules="[required]" />
              <q-input v-model="register.phone" outlined label="Phone" :rules="[required]" />
              <q-input v-model="register.email" outlined type="email" label="Email" :rules="[required]" />
              <q-input
                v-model="register.password"
                outlined
                type="password"
                label="Password"
                :rules="[required, minPassword]"
              />
              <q-input
                v-model="register.confirmPassword"
                outlined
                type="password"
                label="Confirm Password"
                class="span-full"
                :rules="[required, passwordMatch]"
              />
            </q-card-section>

            <q-card-actions align="right" class="q-px-md q-pb-md">
              <q-btn flat no-caps label="Cancel" @click="showRegister = false" />
              <q-btn unelevated no-caps color="teal-8" icon="person_add" label="Create Account" type="submit" />
            </q-card-actions>
          </q-form>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAppStore } from '@/stores/appStore'

const router = useRouter()
const $q = useQuasar()
const store = useAppStore()

const showRegister = ref(false)
const showLoginPassword = ref(false)

const login = reactive({
  email: '',
  password: ''
})

const register = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: ''
})

const required = (value) => Boolean(String(value || '').trim()) || 'Required'
const minPassword = (value) => String(value || '').length >= 4 || 'Minimum 4 characters'
const passwordMatch = () => register.password === register.confirmPassword || 'Password does not match'

const submitLogin = () => {
  try {
    store.login(login.email, login.password)
    $q.notify({ type: 'positive', message: 'Login successful' })
    router.push({ name: 'restaurant' })
  } catch (error) {
    $q.notify({ type: 'negative', message: error.message })
  }
}

const submitRegister = () => {
  try {
    store.registerUser(register)
    $q.notify({ type: 'positive', message: 'Registration successful' })
    router.push({ name: 'restaurant' })
  } catch (error) {
    $q.notify({ type: 'negative', message: error.message })
  }
}
</script>
