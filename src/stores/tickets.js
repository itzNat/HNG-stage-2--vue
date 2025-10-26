// src/stores/tickets.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useToast } from '@/composables/useToast'

export const useTicketsStore = defineStore('tickets', () => {
  const tickets = ref([])
  const activities = ref([])
  const loading = ref(true)
  const filter = ref('all')
  const { showToast } = useToast()

  const filteredTickets = computed(() => {
    switch (filter.value) {
      case 'open': return tickets.value.filter(t => t.status === 'open')
      case 'in_progress': return tickets.value.filter(t => t.status === 'in_progress')
      case 'closed': return tickets.value.filter(t => t.status === 'closed')
      case 'high': return tickets.value.filter(t => t.priority === 'high')
      case 'medium': return tickets.value.filter(t => t.priority === 'medium')
      case 'low': return tickets.value.filter(t => t.priority === 'low')
      default: return tickets.value
    }
  })

  const stats = computed(() => ({
    total: tickets.value.length,
    open: tickets.value.filter(t => t.status === 'open').length,
    inProgress: tickets.value.filter(t => t.status === 'in_progress').length,
    closed: tickets.value.filter(t => t.status === 'closed').length,
    high: tickets.value.filter(t => t.priority === 'high').length,
    medium: tickets.value.filter(t => t.priority === 'medium').length,
    low: tickets.value.filter(t => t.priority === 'low').length,
  }))

  const initialized = ref(false)

  const initialize = () => {
    if (initialized.value) return
    
    const savedTickets = localStorage.getItem('ticketapp_tickets')
    const savedActivities = localStorage.getItem('ticketapp_activities')
    
    if (savedTickets) {
      tickets.value = JSON.parse(savedTickets)
    } else {
      const demoData = createDemoData()
      tickets.value = demoData.tickets
      activities.value = demoData.activities
    }
    
    if (savedActivities) {
      activities.value = JSON.parse(savedActivities)
    }
    
    loading.value = false
    initialized.value = true
  }

  const createDemoData = () => {
    const demoTickets = [
      {
        id: '1',
        title: 'Login Issue - Unable to access account',
        description: 'Users are reporting they cannot login to their accounts. Getting authentication errors.',
        status: 'open',
        priority: 'high',
        assignee: 'Sarah Chen',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        createdBy: 'system'
      },
      {
        id: '2',
        title: 'Payment Gateway Integration',
        description: 'Integrate new payment gateway for international transactions.',
        status: 'in_progress',
        priority: 'high',
        assignee: 'Mike Ross',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        createdBy: 'system'
      },
      {
        id: '3',
        title: 'Mobile App Crash on iOS',
        description: 'App crashes when navigating to profile section on iOS devices.',
        status: 'open',
        priority: 'medium',
        assignee: 'Alex Johnson',
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        createdBy: 'system'
      },
      {
        id: '4',
        title: 'Update Documentation',
        description: 'Update API documentation with new endpoints and examples.',
        status: 'closed',
        priority: 'low',
        assignee: 'You',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        createdBy: 'system'
      }
    ]

    const demoActivities = [
      {
        id: '1',
        action: 'created',
        ticket: 'Login Issue - Unable to access account',
        ticketId: '1',
        user: 'Sarah Chen',
        time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        icon: '➕'
      },
      {
        id: '2',
        action: 'updated',
        ticket: 'Payment Gateway Integration',
        ticketId: '2',
        user: 'Mike Ross',
        time: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        icon: '✏️'
      }
    ]

    return { tickets: demoTickets, activities: demoActivities }
  }

  const addActivity = (action, ticket, user = 'You') => {
    const newActivity = {
      id: Date.now().toString(),
      action,
      ticket: ticket.title,
      ticketId: ticket.id,
      user,
      time: new Date().toISOString(),
      icon: getActivityIcon(action)
    }
    
    activities.value = [newActivity, ...activities.value.slice(0, 9)]
  }

  const getActivityIcon = (action) => {
    switch (action) {
      case 'created': return '➕'
      case 'updated': return '✏️'
      case 'deleted': return '🗑️'
      case 'resolved': return '✅'
      case 'commented': return '💬'
      default: return '📝'
    }
  }

  const createTicket = async (ticketData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const newTicket = {
            id: Date.now().toString(),
            title: ticketData.title,
            description: ticketData.description || '',
            status: ticketData.status,
            priority: ticketData.priority || 'medium',
            assignee: ticketData.assignee || 'Unassigned',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: 'current-user'
          }
          
          tickets.value = [newTicket, ...tickets.value]
          addActivity('created', newTicket)
          showToast('Ticket created successfully!', 'success')
          resolve(newTicket)
        } catch (error) {
          showToast('Failed to create ticket. Please try again.', 'error')
          reject(error)
        }
      }, 500)
    })
  }

  const updateTicket = async (id, ticketData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          tickets.value = tickets.value.map(ticket => {
            if (ticket.id === id) {
              const updatedTicket = { 
                ...ticket, 
                ...ticketData, 
                updatedAt: new Date().toISOString() 
              }
              addActivity('updated', updatedTicket)
              return updatedTicket
            }
            return ticket
          })
          showToast('Ticket updated successfully!', 'success')
          resolve()
        } catch (error) {
          showToast('Failed to update ticket. Please try again.', 'error')
          reject(error)
        }
      }, 500)
    })
  }

  const deleteTicket = async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const ticketToDelete = tickets.value.find(ticket => ticket.id === id)
          tickets.value = tickets.value.filter(ticket => ticket.id !== id)
          if (ticketToDelete) {
            addActivity('deleted', ticketToDelete)
          }
          showToast('Ticket deleted successfully!', 'success')
          resolve()
        } catch (error) {
          showToast('Failed to delete ticket. Please try again.', 'error')
          reject(error)
        }
      }, 500)
    })
  }

  const getTicketById = (id) => {
    return tickets.value.find(ticket => ticket.id === id)
  }

  // Watch for changes and save to localStorage
  // const stopTicketsWatch = watch(tickets, (newTickets) => {
  //   localStorage.setItem('ticketapp_tickets', JSON.stringify(newTickets))
  // }, { deep: true })

  // const stopActivitiesWatch = watch(activities, (newActivities) => {
  //   localStorage.setItem('ticketapp_activities', JSON.stringify(newActivities))
  // }, { deep: true })

  return {
    tickets: filteredTickets,
    allTickets: tickets,
    activities,
    loading,
    filter,
    stats,
    initialize,
    createTicket,
    updateTicket,
    deleteTicket,
    getTicketById,
    setFilter: (newFilter) => { filter.value = newFilter },
    initialized,
    initialize
  }
})