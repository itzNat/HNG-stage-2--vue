// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize stores before mounting
import { useAuthStore } from '@/stores/auth'
import { useTicketsStore } from '@/stores/tickets'

const authStore = useAuthStore()
const ticketsStore = useTicketsStore()

authStore.initialize()
ticketsStore.initialize()

app.mount('#app')