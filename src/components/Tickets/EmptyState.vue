<!-- src/components/Tickets/EmptyState.vue -->
<template>
  <div class="empty-state">
    <div class="empty-icon">🎫</div>
    <h3 class="empty-title">{{ emptyMessage }}</h3>
    <p class="empty-subtitle">{{ subMessage }}</p>
    <button
      v-if="filter === 'all'"
      @click="$emit('create-ticket')"
      class="empty-action-btn"
    >
      Create Your First Ticket
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  filter: {
    type: String,
    default: 'all'
  },
  searchTerm: {
    type: String,
    default: ''
  }
})

defineEmits(['create-ticket'])

const emptyMessage = computed(() => {
  if (props.searchTerm) {
    return `No tickets found for "${props.searchTerm}"`
  }
  
  switch (props.filter) {
    case 'open': return 'No open tickets'
    case 'in_progress': return 'No tickets in progress'
    case 'closed': return 'No closed tickets'
    case 'high': return 'No high priority tickets'
    case 'medium': return 'No medium priority tickets'
    case 'low': return 'No low priority tickets'
    default: return 'No tickets created yet'
  }
})

const subMessage = computed(() => {
  if (props.searchTerm) {
    return 'Try adjusting your search terms or clear the search'
  }
  return props.filter === 'all' 
    ? 'Get started by creating your first ticket'
    : 'All tickets are filtered out or none match the current filter'
})
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  animation: fadeIn 0.6s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  opacity: 0.7;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.empty-subtitle {
  font-size: 1.125rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
  max-width: 400px;
  line-height: 1.6;
}

.empty-action-btn {
  background: linear-gradient(45deg, var(--primary-color), #5a6fd8);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.empty-action-btn:hover {
  box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
  transform: translateY(-2px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .empty-state {
    padding: 3rem 1.5rem;
  }
  
  .empty-icon {
    font-size: 3rem;
  }
  
  .empty-title {
    font-size: 1.25rem;
  }
  
  .empty-subtitle {
    font-size: 1rem;
  }
}
</style>