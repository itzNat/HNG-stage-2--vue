<!-- src/components/Tickets/TicketForm.vue -->
<template>
  <div>
    <!-- Modal Overlay -->
    <div
      v-if="isOpen"
      class="modal-overlay"
      @click="handleClose"
    ></div>

    <!-- Modal -->
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="modal-container"
      >
        <div class="ticket-form-modal">
          <!-- Header -->
          <div class="form-header">
            <h2>{{ ticket ? 'Edit Ticket' : 'Create New Ticket' }}</h2>
            <button 
              @click="handleClose"
              class="close-btn"
            >
              ×
            </button>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleSubmit" class="ticket-form">
            <div class="form-group">
              <label for="title" class="form-label">Title *</label>
              <input
                type="text"
                id="title"
                v-model="formData.title"
                :class="['form-input', { error: errors.title }]"
                placeholder="Enter ticket title"
              />
              <span v-if="errors.title" class="error-message">{{ errors.title }}</span>
            </div>

            <div class="form-group">
              <label for="description" class="form-label">Description</label>
              <textarea
                id="description"
                v-model="formData.description"
                class="form-textarea"
                placeholder="Describe the issue or request..."
                rows="4"
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="status" class="form-label">Status *</label>
                <select
                  id="status"
                  v-model="formData.status"
                  :class="['form-select', { error: errors.status }]"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="closed">Closed</option>
                </select>
                <span v-if="errors.status" class="error-message">{{ errors.status }}</span>
              </div>

              <div class="form-group">
                <label for="priority" class="form-label">Priority</label>
                <select
                  id="priority"
                  v-model="formData.priority"
                  class="form-select"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label for="assignee" class="form-label">Assignee</label>
              <input
                type="text"
                id="assignee"
                v-model="formData.assignee"
                class="form-input"
                placeholder="Assign to team member"
              />
            </div>

            <div v-if="errors.submit" class="form-error">
              {{ errors.submit }}
            </div>

            <!-- Form Actions -->
            <div class="form-actions">
              <button
                type="button"
                @click="handleClose"
                class="btn btn-secondary"
                :disabled="isSubmitting"
              >
                Cancel
              </button>
              <button
                type="submit"
                :class="['btn btn-primary', { loading: isSubmitting }]"
                :disabled="isSubmitting"
              >
                <div v-if="isSubmitting" class="loading-spinner"></div>
                <span v-else>{{ ticket ? 'Update Ticket' : 'Create Ticket' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, watch, nextTick } from 'vue'
import { useTicketsStore } from '@/stores/tickets'

const props = defineProps({
  ticket: {
    type: Object,
    default: null
  },
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'saved'])

const ticketsStore = useTicketsStore()

const formData = reactive({
  title: '',
  description: '',
  status: 'open',
  priority: 'medium',
  assignee: ''
})

const errors = reactive({})
const isSubmitting = ref(false)

// Reset form when modal opens/closes or ticket changes
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    resetForm()
    if (props.ticket) {
      Object.assign(formData, {
        title: props.ticket.title,
        description: props.ticket.description,
        status: props.ticket.status,
        priority: props.ticket.priority,
        assignee: props.ticket.assignee
      })
    }
  }
})

const resetForm = () => {
  Object.assign(formData, {
    title: '',
    description: '',
    status: 'open',
    priority: 'medium',
    assignee: ''
  })
  Object.keys(errors).forEach(key => delete errors[key])
}

const validateForm = () => {
  const newErrors = {}

  if (!formData.title.trim()) {
    newErrors.title = 'Title is required'
  } else if (formData.title.length < 3) {
    newErrors.title = 'Title must be at least 3 characters'
  }

  if (!formData.status) {
    newErrors.status = 'Status is required'
  }

  Object.assign(errors, newErrors)
  return Object.keys(newErrors).length === 0
}

const handleClose = () => {
  emit('close')
}

const handleSubmit = async () => {
  if (!validateForm()) return

  isSubmitting.value = true

  try {
    if (props.ticket) {
      await ticketsStore.updateTicket(props.ticket.id, formData)
    } else {
      await ticketsStore.createTicket(formData)
    }
    
    emit('saved')
  } catch (error) {
    // Error handling is done in the store
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  padding: 1rem;
}

.ticket-form-modal {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e9ecef;
  position: sticky;
  top: 0;
  background: white;
  border-radius: 20px 20px 0 0;
  z-index: 1;
}

.form-header h2 {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: var(--text-secondary);
  padding: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #f8f9fa;
  color: var(--text-primary);
}

.ticket-form {
  padding: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--text-primary);
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  font-family: inherit;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input.error,
.form-select.error {
  border-color: var(--error-color);
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.error-message {
  display: block;
  color: var(--error-color);
  font-size: 0.875rem;
  margin-top: 0.5rem;
  font-weight: 500;
}

.form-error {
  background: rgba(231, 76, 60, 0.1);
  border: 1px solid rgba(231, 76, 60, 0.2);
  color: var(--error-color);
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  font-weight: 500;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e9ecef;
}

.btn {
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-width: 120px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: linear-gradient(45deg, var(--primary-color), #5a6fd8);
  color: white;
}

.btn-primary:not(:disabled):hover {
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

.btn-secondary {
  background: #f8f9fa;
  color: var(--text-primary);
  border: 2px solid #e9ecef;
}

.btn-secondary:not(:disabled):hover {
  background: #e9ecef;
}

.btn.loading {
  color: transparent;
  position: relative;
}

/* Modal Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

/* Responsive Design */
@media (max-width: 768px) {
  .modal-container {
    padding: 0.5rem;
  }
  
  .ticket-form-modal {
    max-height: 95vh;
  }
  
  .form-header {
    padding: 1.25rem 1.5rem;
  }
  
  .ticket-form {
    padding: 1.5rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column-reverse;
  }
  
  .btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .form-header h2 {
    font-size: 1.25rem;
  }
  
  .ticket-form {
    padding: 1rem;
  }
}
</style>