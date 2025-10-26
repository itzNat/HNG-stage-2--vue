<!-- src/views/Tickets.vue -->
<template>
  <Layout>
    <div class="tickets-page">
      <!-- Header -->
      <div class="tickets-header">
        <div class="header-content">
          <h1 class="tickets-title">Ticket Management</h1>
          <p class="tickets-subtitle">
            Manage all your support tickets in one place
          </p>
        </div>
        
        <button
          @click="handleCreateTicket"
          class="create-ticket-btn"
        >
          <span class="btn-icon">➕</span>
          Create Ticket
        </button>
      </div>

      <!-- Filters and Search -->
      <TicketFilters 
        :searchTerm="searchTerm"
        @update:searchTerm="searchTerm = $event"
        :currentFilter="ticketsStore.filter"
        @filter-change="ticketsStore.setFilter($event)"
      />

      <!-- Tickets Grid -->
      <div class="tickets-content">
        <div v-if="ticketsStore.loading" class="tickets-loading">
          <div class="loading-spinner large"></div>
          <p>Loading tickets...</p>
        </div>

        <EmptyState 
          v-else-if="filteredTickets.length === 0"
          :filter="ticketsStore.filter"
          :searchTerm="searchTerm"
          @create-ticket="handleCreateTicket"
        />

        <div v-else class="tickets-grid">
          <TransitionGroup name="ticket-list">
            <TicketCard
              v-for="(ticket, index) in filteredTickets"
              :key="ticket.id"
              :ticket="ticket"
              :index="index"
              @edit="handleEditTicket"
              @delete="handleDeleteTicket"
            />
          </TransitionGroup>
        </div>
      </div>

      <!-- Ticket Form Modal -->
      <TicketForm
        :ticket="editingTicket"
        :isOpen="isFormOpen"
        @close="handleCloseForm"
        @saved="handleFormSaved"
      />
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTicketsStore } from '@/stores/tickets'
import Layout from '@/components/Layout/Layout.vue'
import TicketCard from '@/components/Tickets/TicketCard.vue'
import TicketForm from '@/components/Tickets/TicketForm.vue'
import TicketFilters from '@/components/Tickets/TicketFilters.vue'
import EmptyState from '@/components/Tickets/EmptyState.vue'

const ticketsStore = useTicketsStore()

const searchTerm = ref('')
const isFormOpen = ref(false)
const editingTicket = ref(null)

const filteredTickets = computed(() => {
  return ticketsStore.tickets.filter(ticket =>
    ticket.title.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    ticket.description.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
})

const handleCreateTicket = () => {
  editingTicket.value = null
  isFormOpen.value = true
}

const handleEditTicket = (ticket) => {
  editingTicket.value = ticket
  isFormOpen.value = true
}

const handleDeleteTicket = (ticketId) => {
  // Delete is handled in the TicketCard component
}

const handleCloseForm = () => {
  isFormOpen.value = false
  editingTicket.value = null
}

const handleFormSaved = () => {
  isFormOpen.value = false
  editingTicket.value = null
}
</script>

<style scoped>
.tickets-page {
  min-height: 100vh;
  padding-bottom: 2rem;
}

.tickets-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.header-content {
  flex: 1;
}

.tickets-title {
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  line-height: 1.2;
}

.tickets-subtitle {
  font-size: 1.125rem;
  color: var(--text-secondary);
  max-width: 500px;
}

.create-ticket-btn {
  background: linear-gradient(45deg, var(--primary-color), #5a6fd8);
  color: white;
  border: none;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
  white-space: nowrap;
}

.create-ticket-btn:hover {
  box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
  transform: translateY(-2px);
}

.btn-icon {
  font-size: 1.25rem;
}

.tickets-content {
  margin-top: 2rem;
}

.tickets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.tickets-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 1rem;
}

/* Transition animations */
.ticket-list-enter-active,
.ticket-list-leave-active {
  transition: all 0.4s ease;
}

.ticket-list-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}

.ticket-list-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.9);
}

.ticket-list-move {
  transition: transform 0.4s ease;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .tickets-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

@media (max-width: 768px) {
  .tickets-header {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }
  
  .tickets-title {
    font-size: 2rem;
  }
  
  .tickets-grid {
    grid-template-columns: 1fr;
  }
  
  .create-ticket-btn {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .tickets-title {
    font-size: 1.75rem;
  }
  
  .tickets-grid {
    grid-template-columns: 1fr;
  }
}
</style>