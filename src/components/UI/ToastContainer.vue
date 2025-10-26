<!-- src/components/UI/ToastContainer.vue -->
<template>
  <div class="toast-container">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast"
        :style="getToastStyle(toast.type)"
      >
        <div class="toast-content">
          <span class="toast-icon">{{ getToastIcon(toast.type) }}</span>
          <span class="toast-message">{{ toast.message }}</span>
        </div>
        <button 
          @click="removeToast(toast.id)"
          class="toast-close"
        >
          ×
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useToast } from '@/composables/useToast'

const { toasts, removeToast } = useToast()

const getToastStyle = (type) => {
  const styles = {
    success: { backgroundColor: 'var(--success-color)' },
    error: { backgroundColor: 'var(--error-color)' },
    warning: { backgroundColor: 'var(--warning-color)' },
    info: { backgroundColor: 'var(--primary-color)' }
  }
  return styles[type] || styles.info
}

const getToastIcon = (type) => {
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  }
  return icons[type] || icons.info
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100px);
}
</style>