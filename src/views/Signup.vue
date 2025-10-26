<!-- src/views/Signup.vue -->
<template>
  <div class="auth-page">
    <!-- Animated Background Elements -->
    <div class="auth-background">
      <div class="auth-circle circle-1"></div>
      <div class="auth-circle circle-2"></div>
    </div>

    <div class="auth-container">
      <div class="auth-card glass-card">
        <!-- Header -->
        <div class="auth-header">
          <RouterLink to="/" class="back-home">
            ← Back to home
          </RouterLink>
          <h1 class="auth-title">Create Account</h1>
          <p class="auth-subtitle">Join TicketFlow and streamline your workflow</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="auth-form">
          <div class="form-group">
            <label for="fullName" class="form-label">Full Name</label>
            <input
              type="text"
              id="fullName"
              v-model="formData.fullName"
              :class="['form-input', { error: errors.fullName }]"
              placeholder="Enter your full name"
            />
            <span v-if="errors.fullName" class="error-message">{{ errors.fullName }}</span>
          </div>

          <div class="form-group">
            <label for="email" class="form-label">Email Address</label>
            <input
              type="email"
              id="email"
              v-model="formData.email"
              :class="['form-input', { error: errors.email }]"
              placeholder="Enter your email"
            />
            <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <input
              type="password"
              id="password"
              v-model="formData.password"
              :class="['form-input', { error: errors.password }]"
              placeholder="Create a password"
            />
            <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
          </div>

          <div class="form-group">
            <label for="confirmPassword" class="form-label">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              v-model="formData.confirmPassword"
              :class="['form-input', { error: errors.confirmPassword }]"
              placeholder="Confirm your password"
            />
            <span v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span>
          </div>

          <div class="form-options">
            <label class="checkbox-label">
              <input type="checkbox" required />
              <span class="checkmark"></span>
              I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
            </label>
          </div>

          <button
            type="submit"
            :class="['auth-btn', { loading: isLoading }]"
            :disabled="isLoading"
          >
            <div v-if="isLoading" class="loading-spinner"></div>
            <span v-else>Create Account</span>
          </button>
        </form>

        <!-- Footer -->
        <div class="auth-footer">
          <p>
            Already have an account?
            <RouterLink to="/auth/login" class="auth-link">Sign in</RouterLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const formData = reactive({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const errors = reactive({})
const isLoading = ref(false)

const validateForm = () => {
  const newErrors = {}

  if (!formData.fullName) {
    newErrors.fullName = 'Full name is required'
  }

  if (!formData.email) {
    newErrors.email = 'Email is required'
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = 'Email is invalid'
  }

  if (!formData.password) {
    newErrors.password = 'Password is required'
  } else if (formData.password.length < 6) {
    newErrors.password = 'Password must be at least 6 characters'
  }

  if (!formData.confirmPassword) {
    newErrors.confirmPassword = 'Please confirm your password'
  } else if (formData.password !== formData.confirmPassword) {
    newErrors.confirmPassword = 'Passwords do not match'
  }

  Object.assign(errors, newErrors)
  return Object.keys(newErrors).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return

  isLoading.value = true

  try {
    await authStore.signup(formData.email, formData.password, formData.confirmPassword)
    router.push('/dashboard')
  } catch (error) {
    // Error handling is done in the store
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

/* Animated Background */
.auth-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.auth-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation-duration: 8s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}

.auth-background .circle-1 {
  width: 150px;
  height: 150px;
  top: 10%;
  right: 10%;
  animation-name: floatAuth1;
}

.auth-background .circle-2 {
  width: 100px;
  height: 100px;
  bottom: 20%;
  left: 10%;
  animation-name: floatAuth2;
  animation-delay: 1s;
}

@keyframes floatAuth1 {
  0%, 100% { transform: translateY(0) rotate(0); }
  50% { transform: translateY(-40px) rotate(10deg); }
}

@keyframes floatAuth2 {
  0%, 100% { transform: translateY(0) rotate(0); }
  50% { transform: translateY(30px) rotate(-15deg); }
}

/* Auth Container */
.auth-container {
  width: 100%;
  max-width: 440px;
  position: relative;
  z-index: 2;
}

.auth-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  width: 100%;
}

/* Header */
.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.back-home {
  display: inline-flex;
  align-items: center;
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  margin-bottom: 1rem;
  transition: color 0.3s ease;
}

.back-home:hover {
  color: var(--primary-color);
}

.auth-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.auth-subtitle {
  color: var(--text-secondary);
  font-size: 1rem;
}

/* Form */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.form-input {
  padding: 1rem 1.25rem;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input.error {
  border-color: var(--error-color);
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
}

.error-message {
  color: var(--error-color);
  font-size: 0.875rem;
  font-weight: 500;
}

/* Form Options */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.checkbox-label input {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid #ddd;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.checkbox-label input:checked + .checkmark {
  background: var(--primary-color);
  border-color: var(--primary-color);
}

.checkbox-label input:checked + .checkmark::after {
  content: '✓';
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.forgot-password {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: #5a6fd8;
}

/* Auth Button */
.auth-btn {
  background: linear-gradient(45deg, var(--primary-color), #5a6fd8);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.auth-btn:disabled {
  cursor: not-allowed;
  opacity: 0.8;
}

.auth-btn.loading {
  color: transparent;
}

/* Auth Footer */
.auth-footer {
  text-align: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e9ecef;
  color: var(--text-secondary);
}

.auth-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.auth-link:hover {
  color: #5a6fd8;
}

/* Demo Credentials */
.demo-credentials {
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.demo-credentials h3 {
  margin-bottom: 0.5rem;
  color: var(--text-primary);
  font-size: 1rem;
}

.demo-credentials p {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.demo-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

/* Responsive Design */
@media (max-width: 768px) {
  .auth-page {
    padding: 1rem;
  }
  
  .auth-card {
    padding: 2rem 1.5rem;
  }
  
  .auth-title {
    font-size: 1.75rem;
  }
  
  .form-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}

.auth-background .circle-1 {
  animation-name: floatSignup1;
}

.auth-background .circle-2 {
  animation-name: floatSignup2;
}

@keyframes floatSignup1 {
  0%, 100% { transform: translateY(0) rotate(0); }
  50% { transform: translateY(-30px) rotate(-10deg); }
}

@keyframes floatSignup2 {
  0%, 100% { transform: translateY(0) rotate(0); }
  50% { transform: translateY(25px) rotate(12deg); }
}
</style>