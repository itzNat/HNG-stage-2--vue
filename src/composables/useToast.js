// src/composables/useToast.js
import { ref } from 'vue'

const toasts = ref([])
export function useToast() {

  const showToast = (message, type = 'success', duration = 4000) => {
    const id = Date.now().toString()
    const newToast = {
      id,
      message,
      type,
      duration
    }

    toasts.value.push(newToast)

    setTimeout(() => {
      removeToast(id)
    }, duration)
  }

  const removeToast = (id) => {
    toasts.value = toasts.value.filter(toast => toast.id !== id)
  }

  return {
    toasts,
    showToast,
    removeToast
  }
}