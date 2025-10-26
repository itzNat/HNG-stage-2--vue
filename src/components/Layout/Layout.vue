<!-- src/components/Layout/Layout.vue -->
<template>
  <div class="layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <!-- Logo -->
      <div class="sidebar-logo">
        <RouterLink to="/dashboard" class="logo-link">
          <span class="logo-icon">🎫</span>
          <span class="logo-text">TicketFlow</span>
        </RouterLink>
      </div>

      <!-- Navigation -->
      <nav class="sidebar-nav">
        <RouterLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          :class="['nav-item', { active: $route.path === item.path }]"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-label">{{ item.label }}</span>
          <div v-if="$route.path === item.path" class="active-indicator"></div>
        </RouterLink>
      </nav>

      <!-- User Info & Logout -->
      <div class="sidebar-footer">
        <div class="user-info">
          <div class="user-avatar">
            {{ authStore.user?.email?.charAt(0).toUpperCase() }}
          </div>
          <div class="user-details">
            <span class="user-name">{{ authStore.user?.email }}</span>
            <span class="user-role">Admin</span>
          </div>
        </div>
        <button @click="handleLogout" class="logout-btn">
          <span class="logout-icon">🚪</span>
          Logout
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Mobile Header -->
      <header class="mobile-header">
        <button class="mobile-menu-btn" @click="toggleMobileMenu">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div class="mobile-logo">
          <span>🎫</span>
          TicketFlow
        </div>
        <div class="user-mobile">
          {{ authStore.user?.email?.charAt(0).toUpperCase() }}
        </div>
      </header>

      <!-- Mobile Menu Overlay -->
      <div
        v-if="isMobileMenuOpen"
        class="mobile-overlay"
        @click="toggleMobileMenu"
      ></div>

      <!-- Mobile Menu -->
      <Transition name="slide">
        <div v-if="isMobileMenuOpen" class="mobile-menu">
          <div class="mobile-menu-header">
            <div class="user-info-mobile">
              <div class="user-avatar">
                {{ authStore.user?.email?.charAt(0).toUpperCase() }}
              </div>
              <div class="user-details">
                <span class="user-name">{{ authStore.user?.email }}</span>
                <span class="user-role">Admin</span>
              </div>
            </div>
            <button class="close-menu" @click="toggleMobileMenu">
              ×
            </button>
          </div>
          <nav class="mobile-nav">
            <RouterLink
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              :class="['mobile-nav-item', { active: $route.path === item.path }]"
              @click="toggleMobileMenu"
            >
              <span class="nav-icon">{{ item.icon }}</span>
              <span class="nav-label">{{ item.label }}</span>
            </RouterLink>
          </nav>
          <button class="mobile-logout-btn" @click="handleLogout">
            <span class="logout-icon">🚪</span>
            Logout
          </button>
        </div>
      </Transition>

      <!-- Page Content -->
      <div class="content-wrapper">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const isMobileMenuOpen = ref(false)

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/tickets', label: 'Tickets', icon: '🎫' },
]

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
</script>

<style scoped>
/* Copy the same Layout CSS from React version */
.layout {
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
}

/* Sidebar */
.sidebar {
  width: 280px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  flex-direction: column;
  padding: 2rem 1.5rem;
  position: fixed;
  height: 100vh;
  z-index: 100;
}

.sidebar-logo {
  margin-bottom: 3rem;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
}

.logo-icon {
  font-size: 2rem;
}

.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-item.active {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  backdrop-filter: blur(10px);
}

.active-indicator {
  position: absolute;
  right: 1rem;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: white;
}

.nav-icon {
  font-size: 1.25rem;
}

.nav-label {
  font-weight: 500;
}

.sidebar-footer {
  margin-top: auto;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  font-size: 0.9rem;
}

.user-role {
  font-size: 0.8rem;
  opacity: 0.7;
}

.logout-btn {
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Main Content */
.main-content {
  flex: 1;
  margin-left: 280px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.content-wrapper {
  flex: 1;
  padding: 2rem;
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
}

/* Mobile Header */
.mobile-header {
  display: none;
  padding: 1rem 1.5rem;
  background: white;
  border-bottom: 1px solid #e9ecef;
  align-items: center;
  justify-content: space-between;
}

.mobile-menu-btn {
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.mobile-menu-btn span {
  width: 20px;
  height: 2px;
  background: var(--text-primary);
  transition: all 0.3s ease;
}

.mobile-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: var(--text-primary);
}

.user-mobile {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.8rem;
}

/* Mobile Menu */
.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 199;
}

.mobile-menu {
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 100%;
  background: white;
  z-index: 200;
  display: flex;
  flex-direction: column;
  padding: 2rem 1.5rem;
}

.mobile-menu-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.user-info-mobile {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.close-menu {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: var(--text-secondary);
  padding: 0;
}

.mobile-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.mobile-nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  text-decoration: none;
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.mobile-nav-item:hover,
.mobile-nav-item.active {
  background: var(--primary-color);
  color: white;
}

.mobile-logout-btn {
  margin-top: auto;
  background: var(--error-color);
  color: white;
  border: none;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.mobile-logout-btn:hover {
  background: #c0392b;
}

/* Transitions */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .sidebar {
    display: none;
  }
  
  .main-content {
    margin-left: 0;
  }
  
  .mobile-header {
    display: flex;
  }
  
  .content-wrapper {
    padding: 1.5rem 1rem;
  }
}

@media (max-width: 768px) {
  .mobile-menu {
    width: 100%;
  }
  
  .content-wrapper {
    padding: 1rem;
  }
}
</style>