<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { Home, Folder, User, Menu } from '@lucide/vue'

const emit = defineEmits<{
  (e: 'openDrawer'): void
}>()

const route = useRoute()
const router = useRouter()

interface NavItem {
  icon: typeof Home
  label: string
  action: () => void
  isActive: () => boolean
}

const navItems: NavItem[] = [
  {
    icon: Home,
    label: '首页',
    action: () => router.push('/'),
    isActive: () => route.path === '/',
  },
  {
    icon: Folder,
    label: '作品',
    action: () => router.push('/projects'),
    isActive: () => route.path === '/projects',
  },
  {
    icon: User,
    label: '关于',
    action: () => router.push('/about'),
    isActive: () => route.path === '/about',
  },
  {
    icon: Menu,
    label: '更多',
    action: () => emit('openDrawer'),
    isActive: () => false,
  },
]

function handleClick(item: NavItem) {
  item.action()
}
</script>

<template>
  <nav class="mobile-nav">
    <button
      v-for="(item, index) in navItems"
      :key="index"
      class="nav-item"
      :class="{ active: item.isActive() }"
      @click="handleClick(item)"
    >
      <component :is="item.icon" class="nav-icon" />
      <span class="nav-label">{{ item.label }}</span>
    </button>
  </nav>
</template>

<style scoped>
.mobile-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 50;
  display: none;
  height: 56px;
  background: #fffaef;
  border-top: 2px solid #161310;
}

@media (max-width: 768px) {
  .mobile-nav {
    display: flex;
  }
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  height: 100%;
  background: transparent;
  border: none;
  border-top: 2px solid transparent;
  color: #8a7a68;
  cursor: pointer;
  font-family: ui-monospace, monospace;
  font-size: 10px;
  font-weight: 600;
  transition: all 150ms ease;
  margin-top: -2px;
  padding: 0;
}

.nav-item:hover {
  background: #f2ead6;
  color: #161310;
}

.nav-item:active {
  transform: scale(0.96);
}

.nav-item.active {
  color: #2e5dd6;
  border-top-color: #2e5dd6;
}

.nav-icon {
  width: 20px;
  height: 20px;
}

.nav-label {
  letter-spacing: 0.02em;
}
</style>
