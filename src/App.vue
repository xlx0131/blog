<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, h } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useGsapEnhance } from '@/composables/useGsapEnhance'
import { initAllInteractions } from '@/composables/useInteractions'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import {
  MenuIcon,
  HomeIcon,
  FolderKanbanIcon,
  ArchiveIcon,
  BookmarkIcon,
  UserIcon,
  MailIcon,
} from '@lucide/vue'

const GithubIcon = {
  render() {
    return h('svg', {
      viewBox: '0 0 24 24',
      fill: 'currentColor',
      class: 'h-5 w-5',
    }, [
      h('path', {
        d: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z'
      })
    ])
  }
}

const router = useRouter()
const route = useRoute()
const mobileOpen = ref(false)
const scrolled = ref(false)

const navItems = [
  { path: '/', label: '首页', icon: HomeIcon },
  { path: '/projects', label: '项目', icon: FolderKanbanIcon },
  { path: '/archive', label: '归档', icon: ArchiveIcon },
  { path: '/bookmarks', label: '收藏夹', icon: BookmarkIcon },
  { path: '/about', label: '关于', icon: UserIcon },
]

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/xlx0131', icon: GithubIcon },
  { label: '邮箱', href: 'mailto:hello@xulixin.dev', icon: MailIcon },
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
      v-if="route.path !== '/' && route.path !== '/network-game'"
      class="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      :class="[
        scrolled
          ? route.path.startsWith('/bookmarks')
            ? 'bg-[#fffaef] border-b-2 border-[#161310]'
            : 'bg-card/80 backdrop-blur-xl border-b border-border'
          : route.path.startsWith('/bookmarks')
            ? 'bg-[#f5f0e8]'
            : 'bg-transparent',
        route.path.startsWith('/bookmarks') ? 'bookmarks-header' : ''
      ]"
    >
      <div class="max-w-[1400px] mx-auto px-6 lg:px-10 flex items-center justify-between h-16 lg:h-20">
        <button
          class="text-lg font-semibold tracking-tight transition-colors"
          :class="route.path.startsWith('/bookmarks') ? 'text-[#161310] font-mono' : 'text-foreground hover:text-primary'"
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
              v-if="route.path.startsWith('/bookmarks')"
              :variant="route.path === item.path ? 'default' : 'ghost'"
              size="sm"
              class="rounded-none font-mono text-sm tracking-wider uppercase"
              :class="route.path === item.path
                ? 'bg-[#161310] text-[#fffaef] hover:bg-[#161310]'
                : 'text-[#161310] hover:bg-[#161310]/10'"
            >
              {{ item.label }}
            </Button>
            <Button
              v-else
              :variant="route.path === item.path ? 'default' : 'ghost'"
              size="sm"
              class="rounded-full"
            >
              {{ item.label }}
            </Button>
          </RouterLink>
        </nav>

        <!-- Mobile Toggle with Sheet -->
        <Sheet v-model:open="mobileOpen">
          <SheetTrigger as-child>
            <Button
              variant="ghost"
              size="icon"
              class="md:hidden"
              :class="route.path.startsWith('/bookmarks') ? 'text-[#161310] hover:bg-[#161310]/10' : ''"
              aria-label="Menu"
            >
              <MenuIcon class="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" class="w-[85%] sm:max-w-sm"
            :class="route.path.startsWith('/bookmarks') ? 'bg-[#fffaef] border-l-2 border-[#161310]' : ''"
          >
            <SheetHeader>
              <SheetTitle class="text-left">
                <span class="text-lg font-semibold tracking-tight"
                  :class="route.path.startsWith('/bookmarks') ? 'text-[#161310] font-mono' : ''"
                >许立鑫</span>
              </SheetTitle>
            </SheetHeader>
            <Separator class="my-2" />
            <nav class="flex flex-col gap-1 py-2">
              <RouterLink
                v-for="item in navItems"
                :key="item.path"
                :to="item.path"
              >
                <SheetClose as-child>
                  <Button
                    :variant="route.path === item.path ? 'default' : 'ghost'"
                    class="w-full justify-start gap-3"
                  >
                    <component :is="item.icon" class="h-4 w-4" />
                    {{ item.label }}
                  </Button>
                </SheetClose>
              </RouterLink>
            </nav>
            <div class="mt-auto pt-4">
              <Separator class="mb-4" />
              <div class="flex items-center gap-3">
                <a
                  v-for="link in socialLinks"
                  :key="link.label"
                  :href="link.href"
                  target="_blank"
                  rel="noopener"
                >
                  <Button variant="ghost" size="icon" class="rounded-full">
                    <component :is="link.icon" class="h-5 w-5" />
                    <span class="sr-only">{{ link.label }}</span>
                  </Button>
                </a>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>

    <!-- Main -->
    <main class="flex-1" :class="route.path === '/' || route.path === '/network-game' ? 'overflow-hidden' : 'pt-16 lg:pt-20'">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <!-- Footer -->
    <footer v-if="route.path !== '/' && route.path !== '/network-game'"
      class="border-t mt-24"
      :class="route.path.startsWith('/bookmarks') ? 'border-[#161310] bg-[#f5f0e8] !mt-0' : 'border-border'"
    >
      <div class="max-w-[1400px] mx-auto px-6 lg:px-10 py-12">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="lg:col-span-2">
            <p class="text-lg font-semibold tracking-tight"
              :class="route.path.startsWith('/bookmarks') ? 'text-[#161310] font-mono' : 'text-foreground'"
            >许立鑫</p>
            <p class="text-sm mt-2 max-w-sm leading-relaxed"
              :class="route.path.startsWith('/bookmarks') ? 'text-[#3a332a]' : 'text-muted-foreground'"
            >
              写代码、做设计、思考人生。
            </p>
            <div class="flex items-center gap-2 mt-4">
              <a
                v-for="link in socialLinks"
                :key="link.label"
                :href="link.href"
                target="_blank"
                rel="noopener"
                class="inline-flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300"
                :class="route.path.startsWith('/bookmarks')
                  ? 'bg-[#161310]/10 text-[#161310] hover:bg-[#161310]/20'
                  : 'bg-muted/50 hover:bg-primary/10 hover:text-primary text-muted-foreground'"
              >
                <component :is="link.icon" class="h-4 w-4" />
                <span class="sr-only">{{ link.label }}</span>
              </a>
            </div>
          </div>

          <div>
            <p class="text-sm font-medium mb-3"
              :class="route.path.startsWith('/bookmarks') ? 'text-[#161310]' : 'text-foreground'"
            >导航</p>
            <ul class="space-y-2 text-sm"
              :class="route.path.startsWith('/bookmarks') ? 'text-[#3a332a]' : 'text-muted-foreground'"
            >
              <li v-for="item in navItems" :key="item.path">
                <RouterLink
                  :to="item.path"
                  class="hover:text-primary transition-colors link-underline"
                >
                  {{ item.label }}
                </RouterLink>
              </li>
            </ul>
          </div>

          <div>
            <p class="text-sm font-medium mb-3"
              :class="route.path.startsWith('/bookmarks') ? 'text-[#161310]' : 'text-foreground'"
            >更多</p>
            <ul class="space-y-2 text-sm"
              :class="route.path.startsWith('/bookmarks') ? 'text-[#3a332a]' : 'text-muted-foreground'"
            >
              <li>
                <a
                  href="https://github.com/xlx0131"
                  target="_blank"
                  rel="noopener"
                  class="hover:text-primary transition-colors link-underline"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@xulixin.dev"
                  class="hover:text-primary transition-colors link-underline"
                >
                  邮箱
                </a>
              </li>
              <li>
                <RouterLink
                  to="/about"
                  class="hover:text-primary transition-colors link-underline"
                >
                  关于我
                </RouterLink>
              </li>
            </ul>
          </div>
        </div>
        <Separator class="my-8" />
        <div class="flex flex-col md:flex-row items-center justify-between gap-4 text-xs"
          :class="route.path.startsWith('/bookmarks') ? 'text-[#3a332a]' : 'text-muted-foreground/60'"
        >
          <p>
            &copy; {{ new Date().getFullYear() }} 许立鑫. All rights reserved.
          </p>
          <p class="flex items-center gap-1">
            Made with
            <span class="text-primary">♥</span>
            with Vue & shadcn-vue
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.page-enter-active,
.page-leave-active { transition: opacity 0.2s ease; }
.page-enter-from,
.page-leave-to { opacity: 0; }
</style>
