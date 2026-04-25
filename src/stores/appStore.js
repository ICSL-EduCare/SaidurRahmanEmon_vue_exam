import { defineStore } from 'pinia'

const readStorage = (key, fallback) => {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

const saveStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

const makeId = () => {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

const toPrice = (value) => Number(Number(value || 0).toFixed(2))

export const useAppStore = defineStore('restaurant-pos', {
  state: () => ({
    users: readStorage('pos_users', []),
    currentUser: readStorage('pos_current_user', null),
    restaurant: readStorage('pos_restaurant', null),
    items: readStorage('pos_items', []),
    orders: readStorage('pos_orders', []),
    darkMode: readStorage('pos_dark_mode', false)
  }),
  getters: {
    isLoggedIn: (state) => Boolean(state.currentUser),
    sortedItems: (state) => [...state.items].sort((a, b) => a.name.localeCompare(b.name)),
    upcomingOrders: (state) => state.orders
      .filter((order) => order.status === 'upcoming')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    previousOrders: (state) => state.orders
      .filter((order) => order.status === 'previous')
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  },
  actions: {
    persist() {
      saveStorage('pos_users', this.users)
      saveStorage('pos_current_user', this.currentUser)
      saveStorage('pos_restaurant', this.restaurant)
      saveStorage('pos_items', this.items)
      saveStorage('pos_orders', this.orders)
      saveStorage('pos_dark_mode', this.darkMode)
    },
    registerUser(form) {
      const email = form.email.trim().toLowerCase()
      const exists = this.users.some((user) => user.email === email)

      if (exists) {
        throw new Error('This email is already registered')
      }

      const user = {
        id: makeId(),
        name: form.name.trim(),
        email,
        password: form.password,
        phone: form.phone.trim(),
        createdAt: new Date().toISOString()
      }

      this.users.push(user)
      this.currentUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
      this.persist()
    },
    login(email, password) {
      const user = this.users.find((item) => item.email === email.trim().toLowerCase() && item.password === password)

      if (!user) {
        throw new Error('Email or password is not correct')
      }

      this.currentUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
      this.persist()
    },
    logout() {
      this.currentUser = null
      this.persist()
    },
    setDarkMode(value) {
      this.darkMode = value
      this.persist()
    },
    saveRestaurant(form) {
      this.restaurant = {
        id: this.restaurant?.id || makeId(),
        name: form.name.trim(),
        logo: form.logo,
        address: form.address.trim(),
        phone: form.phone.trim(),
        branches: form.branches.map((branch) => branch.trim()).filter(Boolean),
        updatedAt: new Date().toISOString()
      }
      this.persist()
    },
    deleteRestaurant() {
      this.restaurant = null
      this.persist()
    },
    addItem(form) {
      this.items.push({
        id: makeId(),
        name: form.name.trim(),
        category: form.category.trim(),
        price: toPrice(form.price),
        createdAt: new Date().toISOString()
      })
      this.persist()
    },
    updateItem(id, form) {
      const index = this.items.findIndex((item) => item.id === id)

      if (index >= 0) {
        this.items[index] = {
          ...this.items[index],
          name: form.name.trim(),
          category: form.category.trim(),
          price: toPrice(form.price)
        }
        this.persist()
      }
    },
    deleteItem(id) {
      this.items = this.items.filter((item) => item.id !== id)
      this.persist()
    },
    placeOrder(form, selectedItems) {
      const orderItems = selectedItems.map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        price: toPrice(item.price),
        qty: Number(item.qty)
      }))
      const total = toPrice(orderItems.reduce((sum, item) => sum + item.price * item.qty, 0))
      const order = {
        id: makeId(),
        invoiceNo: `INV-${Date.now().toString().slice(-7)}`,
        customerName: form.customerName.trim(),
        phone: form.phone.trim(),
        tableNumber: form.tableNumber.trim(),
        seatNumber: form.seatNumber.trim(),
        items: orderItems,
        total,
        status: 'upcoming',
        createdAt: new Date().toISOString()
      }

      this.orders.push(order)
      this.persist()
      return order
    },
    markOrderPrevious(id) {
      const order = this.orders.find((item) => item.id === id)

      if (order) {
        order.status = 'previous'
        order.completedAt = new Date().toISOString()
        this.persist()
      }
    },
    deleteOrder(id) {
      this.orders = this.orders.filter((order) => order.id !== id)
      this.persist()
    }
  }
})
