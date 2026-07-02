<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useGsapEnhance } from '@/composables/useGsapEnhance'
import { initAllInteractions } from '@/composables/useInteractions'
import { Button } from '@/components/ui/button'

const router = useRouter()
const route = useRoute()
const mobileOpen = ref(false)
const scrolled = ref(false)

const navItems = [
  { path: '/', label: '首页' },
  { path: '/projects', label: '项目' },
  { path: '/archive', label: '归档' },
  { path: '/about', label: '关于' },
]

let cleanup: (() => void) | null = null

onMounted(() => {
  const onScroll = () => { scrolled.value = window.scrollY > 20 }
  window.addEventListener('scroll', onScroll, { passive: true })
  cleanup = () => window.removeEventListener('scroll', onScroll)

  useGsapEnhance()

  setTimeout(() => {
    initAllInteractions()
  }, 100)
})
onBeforeUnmount(() => cleanup?.())
</script>

<template>
  <div class="min-h-[100dvh] flex flex-col bg-background">
    <!-- Header -->
    <header
      v-if="route.path !== '/'"
      class="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      :class="scrolled
        ? 'bg-card/80 backdrop-blur-xl border-b border-border'
        : 'bg-transparent'"
    >
      <div class="max-w-[1400px] mx-auto px-6 lg:px-10 flex items-center justify-between h-16 lg:h-20">
        <button
          class="text-lg font-semibold tracking-tight text-foreground hover:text-muted-foreground transition-colors"
          @click="router.push('/')"
        >
          许立鑫
        </button>

        <!-- Desktop Nav -->
        <nav class="hidden md:flex items-center gap-1">
          <RouterLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
          >
            <Button
              :variant="route.path === item.path ? 'default' : 'ghost'"
              size="sm"
              class="rounded-full"
            >
              {{ item.label }}
            </Button>
          </RouterLink>
        </nav>

        <!-- Mobile Toggle -->
        <button
          class="md:hidden relative w-6 h-6"
          aria-label="Menu"
          @click="mobileOpen = !mobileOpen"
        >
          <span
            class="absolute top-[5px] left-0 w-full h-[1.5px] bg-foreground transition-all duration-300"
            :class="mobileOpen ? 'rotate-45 top-[11px]' : ''"
          />
          <span
            class="absolute top-[11px] left-0 w-full h-[1.5px] bg-foreground transition-all duration-300"
            :class="mobileOpen ? 'opacity-0' : ''"
          />
          <span
            class="absolute top-[17px] left-0 w-full h-[1.5px] bg-foreground transition-all duration-300"
            :class="mobileOpen ? '-rotate-45 top-[11px]' : ''"
          />
        </button>
      </div>

      <!-- Mobile Menu -->
      <Transition name="mobile">
        <nav v-if="mobileOpen" class="md:hidden border-t border-border bg-card/95 backdrop-blur-xl">
          <div class="px-6 py-4 space-y-1">
            <RouterLink
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              @click="mobileOpen = false"
            >
              <Button
                :variant="route.path === item.path ? 'default' : 'ghost'"
                class="w-full justify-start rounded-xl"
              >
                {{ item.label }}
              </Button>
            </RouterLink>
          </div>
        </nav>
      </Transition>
    </header>

    <!-- Main -->
    <main class="flex-1" :class="route.path === '/' ? 'overflow-hidden' : 'pt-16 lg:pt-20'">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <!-- Footer -->
    <footer v-if="route.path !== '/'" class="border-t border-border mt-24">
      <div class="max-w-[1400px] mx-auto px-6 lg:px-10 py-12">
        <div class="flex flex-col md:flex-row items-start justify-between gap-8">
          <div>
            <p class="text-base font-semibold tracking-tight text-foreground">许立鑫</p>
            <p class="text-sm text-muted-foreground mt-1 max-w-xs leading-relaxed">
             写代码、做设计、思考人生。
            </p>
          </div>
          <div class="flex gap-8 text-sm text-muted-foreground">
            <a href="https://github.com/xlx0131" target="_blank" rel="noopener" class="hover:text-foreground transition-colors">GitHub</a>
            <a href="mailto:hello@xulixin.dev" class="hover:text-foreground transition-colors">邮箱</a>
            <RouterLink to="/about" class="hover:text-foreground transition-colors">关于</RouterLink>
            <span class="opacity-25 font-light" aria-hidden="true">·</span>
            <RouterLink to="/bookmarks" class="hover:text-foreground transition-colors">收藏夹</RouterLink>
          </div>
        </div>
        <div class="border-t border-border mt-8 pt-6 text-xs text-muted-foreground/60">
          &copy; {{ new Date().getFullYear() }} 许立鑫. All rights reserved.
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.mobile-enter-active,
.mobile-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}
.mobile-enter-from,
.mobile-leave-to { max-height: 0; opacity: 0; }
.mobile-enter-to,
.mobile-leave-from { max-height: 300px; opacity: 1; }

.page-enter-active,
.page-leave-active { transition: opacity 0.2s ease; }
.page-enter-from,
.page-leave-to { opacity: 0; }
</style>
