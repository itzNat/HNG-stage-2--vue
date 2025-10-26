// src/stores/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useToast } from '@/composables/useToast'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(true)
  const { showToast } = useToast()

  const isAuthenticated = computed(() => !!user.value)

  const initialized = ref(false)

  const initialize = () => {
    if (initialized.value) return
    
    const token = localStorage.getItem('ticketapp_session')
    if (token) {
      try {
        user.value = JSON.parse(token)
      } catch (error) {
        console.error('Error parsing auth token:', error)
        localStorage.removeItem('ticketapp_session')
      }
    }
    loading.value = false
    initialized.value = true
  }

  const login = async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const existingUsers = JSON.parse(localStorage.getItem('ticketapp_users') || '[]')
        const userExists = existingUsers.find(user => user.email === email && user.password === password)
        
        if (userExists) {
          const userData = { email, id: userExists.id }
          const token = JSON.stringify(userData)
          localStorage.setItem('ticketapp_session', token)
          user.value = userData
          showToast('Welcome back! Login successful.', 'success')
          resolve(userData)
        } else {
          const error = 'Invalid email or password. Please sign up first.'
          showToast(error, 'error')
          reject(new Error(error))
        }
      }, 1500)
    })
  }

  const signup = async (email, password, confirmPassword) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (password !== confirmPassword) {
          const error = 'Passwords do not match'
          showToast(error, 'error')
          reject(new Error(error))
          return
        }

        const existingUsers = JSON.parse(localStorage.getItem('ticketapp_users') || '[]')
        const userExists = existingUsers.find(user => user.email === email)
        
        if (userExists) {
          const error = 'User already exists. Please login instead.'
          showToast(error, 'error')
          reject(new Error(error))
          return
        }

        if (!email || !password) {
          const error = 'Please fill all fields'
          showToast(error, 'error')
          reject(new Error(error))
          return
        }

        if (password.length < 6) {
          const error = 'Password must be at least 6 characters'
          showToast(error, 'error')
          reject(new Error(error))
          return
        }

        const newUser = { 
          email, 
          password,
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        }

        const updatedUsers = [...existingUsers, newUser]
        localStorage.setItem('ticketapp_users', JSON.stringify(updatedUsers))

        const userData = { email, id: newUser.id }
        const token = JSON.stringify(userData)
        localStorage.setItem('ticketapp_session', token)
        user.value = userData
        
        showToast('Account created successfully! Welcome to TicketFlow.', 'success')
        resolve(userData)
      }, 1500)
    })
  }

  const logout = () => {
    localStorage.removeItem('ticketapp_session')
    user.value = null
    showToast('You have been logged out successfully.', 'info')
  }

  return {
    user,
    loading,
    isAuthenticated,
    initialized, // Add this
    initialize,
    login,
    signup,
    logout
  }
})