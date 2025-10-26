<!-- src/components/Tickets/TicketCard.vue -->
<template>
  <div class="ticket-card">
    <!-- Header -->
    <div class="ticket-header">
      <div class="ticket-title-section">
        <h3 class="ticket-title">{{ ticket.title }}</h3>
        <div class="ticket-meta">
          <span class="ticket-id">#{{ ticket.id.slice(-6) }}</span>
          <span class="ticket-date">{{ formatDate(ticket.createdAt) }}</span>
        </div>
      </div>
      <div class="ticket-actions">
        <button
          @click="$emit('edit', ticket)"
          class="action-btn edit-btn"
          title="Edit ticket"
        >
          ✏️
        </button>
        <button
          @click="showDeleteDialog = true"
          class="action-btn delete-btn"
          title="Delete ticket"
        >
          🗑️
        </button>
      </div>
    </div>

    <!-- Description -->
    <p v-if="ticket.description" class="ticket-description">
      {{ ticket.description.length > 120 
        ? `${ticket.description.substring(0, 120)}...`
        : ticket.description
      }}
    </p>

    <!-- Status and Priority -->
    <div class="ticket-tags">
      <span 
        class="status-tag"
        :style="getStatusStyle(ticket.status)"
      >
        {{ ticket.status.replace('_', ' ') }}
      </span>
      <span 
        class="priority-tag"
        :style="getPriorityStyle(ticket.priority)"
      >
        {{ ticket.priority }} priority
      </span>
    </div>

    <!-- Footer -->
    <div class="ticket-footer">
      <div class="assignee">
        <span class="assignee-label">Assigned to:</span>
        <span class="assignee-name">{{ ticket.assignee }}</span>
      </div>
      <div class="ticket-updated">
        Updated {{ formatDate(ticket.updatedAt) }}
      </div>
    </div>

    <!-- Status Indicator -->
    <div 
      class="status-indicator"
      :style="{ backgroundColor: getStatusColor(ticket.status) }"
    />

  </div>
  <!-- Delete Confirmation Dialog -->
  <ConfirmDialog
    :isOpen="showDeleteDialog"
    @close="showDeleteDialog = false"
    @confirm="handleDelete"
    title="Delete Ticket"
    :message="`Are you sure you want to delete \'${ticket.title}\'? This action cannot be undone.`"
    confirmText="Delete"
    cancelText="Cancel"
    type="danger"
  />
</template>

<script setup>
import { ref } from 'vue'
import { useTicketsStore } from '@/stores/tickets'
import ConfirmDialog from '@/components/UI/ConfirmDialog.vue'

const props = defineProps({
  ticket: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['edit', 'delete'])

const ticketsStore = useTicketsStore()
const showDeleteDialog = ref(false)

const getStatusColor = (status) => {
  switch (status) {
    case 'open': return '#2ecc71'
    case 'in_progress': return '#f39c12'
    case 'closed': return '#95a5a6'
    default: return '#bdc3c7'
  }
}

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high': return '#e74c3c'
    case 'medium': return '#f39c12'
    case 'low': return '#27ae60'
    default: return '#95a5a6'
  }
}

const getStatusStyle = (status) => {
  const color = getStatusColor(status)
  return {
    backgroundColor: `${color}20`,
    color: color,
    border: `1px solid ${color}40`
  }
}

const getPriorityStyle = (priority) => {
  const color = getPriorityColor(priority)
  return {
    backgroundColor: `${color}20`,
    color: color,
    border: `1px solid ${color}40`
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const handleDelete = async () => {
  try {
    await ticketsStore.deleteTicket(props.ticket.id)
    emit('delete', props.ticket.id)
    showDeleteDialog.value = false
  } catch (error) {
    // Error handling is done in the store
  }
}
</script>

<style scoped>
.ticket-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  animation: slideIn 0.4s ease;
  animation-fill-mode: both;
}

.ticket-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  transform: translateY(-5px);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
}

.ticket-title-section {
  flex: 1;
}

.ticket-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ticket-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.ticket-id {
  font-family: 'Monaco', 'Consolas', monospace;
  background: rgba(102, 126, 234, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  color: var(--primary-color);
}

.ticket-date {
  display: flex;
  align-items: center;
}

.ticket-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: none;
  border: none;
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.125rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-btn:hover {
  background: rgba(52, 152, 219, 0.1);
}

.delete-btn:hover {
  background: rgba(231, 76, 60, 0.1);
}

.ticket-description {
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0 0 1rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ticket-tags {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.status-tag,
.priority-tag {
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.ticket-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
  font-size: 0.875rem;
}

.assignee {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.assignee-label {
  color: var(--text-secondary);
}

.assignee-name {
  color: var(--text-primary);
  font-weight: 500;
}

.ticket-updated {
  color: var(--text-secondary);
  font-size: 0.75rem;
}

.status-indicator {
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
}

/* Responsive Design */
@media (max-width: 480px) {
  .ticket-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .ticket-actions {
    align-self: flex-end;
  }
  
  .ticket-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>