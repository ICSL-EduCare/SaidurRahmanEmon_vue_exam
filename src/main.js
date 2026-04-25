import { createApp } from 'vue'
import { Quasar, Notify, Dark } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'
import './css/app.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Use Quasar framework
app.use(Quasar, {
  config: {
    notify: {
      position: 'top-right',
      timeout: 1800
    }
  },
  plugins: {
    Notify,
    Dark
  }
})

app.mount('#app')
