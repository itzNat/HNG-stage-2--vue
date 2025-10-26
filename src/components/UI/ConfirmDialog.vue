<!-- src/components/UI/ConfirmDialog.vue -->
<template>
  <div>
    <!-- Overlay -->
    <div
      v-if="isOpen"
      class="confirm-overlay"
      @click="$emit('close')"
    ></div>

    <!-- Dialog -->
    <Transition name="confirm">
      <div
        v-if="isOpen"
        class="confirm-container"
      >
        <div :class="['confirm-dialog', type]">
          <div class="confirm-header">
            <h3 class="confirm-title">{{ title }}</h3>
          </div>
          <div class="confirm-body">
            <p class="confirm-message">{{ message }}</p>
          </div>
          <div class="confirm-actions">
            <button
              @click="$emit('close')"
              class="confirm-btn cancel-btn"
            >
              {{ cancelText }}
            </button>
            <button
              @click="$emit('confirm')"
              :class="['confirm-btn', `${type}-btn`]"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Confirm Action'
  },
  message: {
    type: String,
    default: 'Are you sure you want to proceed?'
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  type: {
    type: String,
    default: 'default'
  }
})

defineEmits(['close', 'confirm'])
</script>

<style scoped>
.confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.confirm-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2001;
  padding: 1rem;
}

.confirm-dialog {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.confirm-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e9ecef;
}

.confirm-title {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.25rem;
  font-weight: 600;
}

.confirm-body {
  padding: 2rem;
}

.confirm-message {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.6;
  text-align: center;
}

.confirm-actions {
  display: flex;
  gap: 1rem;
  padding: 1.5rem 2rem;
  border-top: 1px solid #e9ecef;
}

.confirm-btn {
  flex: 1;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  font-size: 1rem;
}

.cancel-btn {
  background: #f8f9fa;
  color: var(--text-primary);
  border: 2px solid #e9ecef;
}

.cancel-btn:hover {
  background: #e9ecef;
}

.default-btn {
  background: var(--primary-color);
  color: white;
}

.default-btn:hover {
  background: #5a6fd8;
  transform: scale(1.05);
}

.danger-btn {
  background: var(--error-color);
  color: white;
}

.danger-btn:hover {
  background: #c0392b;
  transform: scale(1.05);
}

/* Transitions */
.confirm-enter-active,
.confirm-leave-active {
  transition: all 0.3s ease;
}

.confirm-enter-from,
.confirm-leave-to {
  opacity: 0;
  transform: scale(0.8) translateY(20px);
}

/* Responsive Design */
@media (max-width: 480px) {
  .confirm-dialog {
    max-width: 100%;
  }
  
  .confirm-header,
  .confirm-body,
  .confirm-actions {
    padding: 1.25rem 1.5rem;
  }
  
  .confirm-actions {
    flex-direction: column-reverse;
  }
}
</style>