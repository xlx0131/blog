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
import Breadcrumb from '@/components/Breadcrumb.vue'
import MobileNav from '@/components/MobileNav.vue'
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

const DouyinIcon = {
  render() {
    return h('svg', {
      viewBox: '0 0 512 512',
      fill: 'currentColor',
      class: 'h-5 w-5',
    }, [
      h('path', {
        d: 'M412.19,118.66a109.27,109.27,0,0,1-9.45-5.5,132.87,132.87,0,0,1-24.27-20.62c-18.1-20.71-24.86-41.72-27.35-56.43h.1C349.14,23.9,350,16,350.13,16H267.69V334.78c0,4.28,0,8.51-.18,12.69,0,.52-.05,1-.08,1.56,0,.23,0,.47-.05.71,0,.06,0,.12,0,.18a70,70,0,0,1-35.22,55.56,68.8,68.8,0,0,1-34.11,9c-38.41,0-69.54-31.32-69.54-70s31.13-70,69.54-70a68.9,68.9,0,0,1,21.41,3.39l.1-83.94a153.14,153.14,0,0,0-118,34.52,161.79,161.79,0,0,0-35.3,43.53c-3.48,6-16.61,30.11-18.2,69.24-1,22.21,5.67,45.22,8.85,54.73v.2c2,5.6,9.75,24.71,22.38,40.82A167.53,167.53,0,0,0,115,470.66v-.2l.2.2C155.11,497.78,199.36,496,199.36,496c7.66-.31,33.32,0,62.46-13.81,32.32-15.31,50.72-38.12,50.72-38.12a158.46,158.46,0,0,0,27.64-45.93c7.46-19.61,9.95-43.13,9.95-52.53V176.49c1,.6,14.32,9.41,14.32,9.41s19.19,12.3,49.13,20.31c21.48,5.7,50.42,6.9,50.42,6.9V131.27C453.86,132.37,433.27,129.17,412.19,118.66Z'
      })
    ])
  }
}

const router = useRouter()
const route = useRoute()
const mobileOpen = ref(false)
const scrolled = ref(false)
const showBackTop = ref(false)
const showSecretModal = ref(false)
const secretUsername = ref('')
const secretPassword = ref('')
const secretError = ref('')

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
  { label: '抖音', href: 'https://www.douyin.com/user/MS4wLjABAAAANP0coDMAbHudr4XDL33le06LIbVV22r11vYKLPXzMr6-0EHRu-yIJ-qdliln74Qb', icon: DouyinIcon },
]

let cleanup: (() => void) | null = null

onMounted(() => {
  const onScroll = () => {
    scrolled.value = window.scrollY > 20
    showBackTop.value = window.scrollY > 400
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  cleanup = () => window.removeEventListener('scroll', onScroll)

  useGsapEnhance()

  setTimeout(() => {
    initAllInteractions()
  }, 100)
})

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function openSecretModal() {
  showSecretModal.value = true
  secretUsername.value = ''
  secretPassword.value = ''
  secretError.value = ''
}

function verifySecret() {
  if (secretUsername.value === '许立鑫' && secretPassword.value === '20050131') {
    showSecretModal.value = false
    sessionStorage.setItem('writingAuth', 'true')
    router.push('/writing')
  } else {
    secretError.value = '用户名或密码错误'
  }
}

function closeSecretModal() {
  showSecretModal.value = false
  secretError.value = ''
}

function openDrawer() {
  mobileOpen.value = true
}
onBeforeUnmount(() => cleanup?.())
</script>

<template>
  <div class="min-h-[100dvh] flex flex-col bg-[#f5f0e8]">
    <!-- Header -->
    <header
      v-if="route.path !== '/' && route.path !== '/network-game'"
      class="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      :class="[
        scrolled
          ? 'bg-[#fffaef] border-b-2 border-[#161310]'
          : 'bg-[#f5f0e8]',
      ]"
    >
      <div class="max-w-[1400px] mx-auto px-6 lg:px-10 flex items-center justify-between h-16 lg:h-20">
        <button
          class="text-lg font-semibold tracking-tight transition-colors text-[#161310] font-mono"
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
              class="rounded-none font-mono text-sm tracking-wider uppercase"
              :class="route.path === item.path
                ? 'bg-[#161310] text-[#fffaef] hover:bg-[#161310]'
                : 'text-[#161310] hover:bg-[#161310]/10'"
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
              class="md:hidden text-[#161310] hover:bg-[#161310]/10"
              aria-label="Menu"
            >
              <MenuIcon class="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" class="w-[85%] sm:max-w-sm bg-[#fffaef] border-l-2 border-[#161310]">
            <SheetHeader>
              <SheetTitle class="text-left">
                <span class="text-lg font-semibold tracking-tight text-[#161310] font-mono">许立鑫</span>
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
                    class="w-full justify-start gap-3 text-[#161310] hover:bg-[#161310]/10 hover:text-[#161310]"
                    :class="route.path === item.path ? 'bg-[#161310] text-[#fffaef] hover:bg-[#161310] hover:text-[#fffaef]' : ''"
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

    <!-- Breadcrumb -->
    <div
      v-if="route.path !== '/' && route.path !== '/network-game'"
      class="fixed left-0 right-0 z-40 top-16 lg:top-20"
    >
      <Breadcrumb />
    </div>

    <!-- Main -->
    <main class="flex-1 main-content" :class="route.path === '/' || route.path === '/network-game' ? 'overflow-hidden' : 'pt-[calc(4rem+36px)] lg:pt-[calc(5rem+36px)]'">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <!-- Footer -->
    <footer v-if="route.path !== '/' && route.path !== '/network-game'"
       class="border-t border-[#161310] bg-[#f5f0e8] !mt-0 footer-content"
     >
       <div class="max-w-[1400px] mx-auto px-6 lg:px-10 py-12">
         <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           <div class="lg:col-span-2">
             <p class="text-lg font-semibold tracking-tight text-[#161310] font-mono">许立鑫</p>
             <p class="text-sm mt-2 max-w-sm leading-relaxed text-[#3a332a]">
               写代码、做设计、思考人生。
             </p>
             <div class="card">
               <span>联系我</span>
               <a
                 v-for="link in socialLinks"
                 :key="link.label"
                 class="social-link"
                 :href="link.href"
                 target="_blank"
                 rel="noopener"
                 :title="link.label"
               >
                 <component :is="link.icon" />
               </a>
             </div>
          </div>

          <div>
            <p class="text-sm font-medium mb-3 text-[#161310]">导航</p>
            <ul class="space-y-2 text-sm text-[#3a332a]">
              <li v-for="item in navItems" :key="item.path">
                <RouterLink
                  :to="item.path"
                  class="hover:text-[#161310] transition-colors link-underline"
                >
                  {{ item.label }}
                </RouterLink>
              </li>
            </ul>
          </div>

          <div>
            <p class="text-sm font-medium mb-3 text-[#161310]">更多</p>
            <ul class="space-y-2 text-sm text-[#3a332a]">
              <li>
                <a
                  href="https://github.com/xlx0131"
                  target="_blank"
                  rel="noopener"
                  class="hover:text-[#161310] transition-colors link-underline"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@xulixin.dev"
                  class="hover:text-[#161310] transition-colors link-underline"
                >
                  邮箱
                </a>
              </li>
              <li>
                <a
                  href="https://www.douyin.com/user/MS4wLjABAAAANP0coDMAbHudr4XDL33le06LIbVV22r11vYKLPXzMr6-0EHRu-yIJ-qdliln74Qb"
                  target="_blank"
                  rel="noopener"
                  class="hover:text-[#161310] transition-colors link-underline"
                >
                  抖音
                </a>
              </li>
              <li>
                <RouterLink
                  to="/about"
                  class="hover:text-[#161310] transition-colors link-underline"
                >
                  关于我
                </RouterLink>
              </li>
            </ul>
          </div>
        </div>
        <Separator class="my-8" />
        <div class="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#3a332a]">
          <p>
            <button class="copyright-btn" @click="openSecretModal">
              &copy; {{ new Date().getFullYear() }} 许立鑫. All rights reserved.
            </button>
          </p>
          <p class="flex items-center gap-1">
            Made with
            <span class="text-primary">♥</span>
            with Vue & shadcn-vue
          </p>
        </div>
      </div>
    </footer>

    <!-- Back to Top Button -->
    <button
      v-if="showBackTop"
      class="back-to-top"
      @click="scrollToTop"
      aria-label="回到顶部"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter">
        <polyline points="18 15 12 9 6 15"></polyline>
      </svg>
      <span>TOP</span>
    </button>

    <!-- Mobile Bottom Nav -->
    <MobileNav @open-drawer="openDrawer" />

    <!-- Secret Modal -->
    <div v-if="showSecretModal" class="secret-modal-overlay" @click.self="closeSecretModal">
      <div class="secret-modal">
        <div class="secret-modal-header">
          <span class="font-mono text-xs text-[#fffaef] tracking-wider">ACCESS RESTRICTED</span>
        </div>
        <div class="secret-modal-body p-6">
          <h3 class="font-['Pixelify_Sans'] text-2xl text-[#161310] mb-1 text-center">管理员验证</h3>
          <p class="font-mono text-xs text-[#3a332a] mb-6 text-center">请输入管理员凭证</p>
          
          <div class="space-y-4">
            <div>
              <label class="font-mono text-xs text-[#161310] block mb-2">用户名</label>
              <input
                v-model="secretUsername"
                type="text"
                class="secret-input"
                placeholder="请输入用户名"
                @keyup.enter="verifySecret"
              />
            </div>
            <div>
              <label class="font-mono text-xs text-[#161310] block mb-2">密码</label>
              <input
                v-model="secretPassword"
                type="password"
                class="secret-input"
                placeholder="请输入密码"
                @keyup.enter="verifySecret"
              />
            </div>
            
            <p v-if="secretError" class="font-mono text-xs text-[#a33a3a] text-center">
              {{ secretError }}
            </p>
            
            <div class="flex gap-3 pt-2">
              <button class="secret-btn secondary flex-1" @click="closeSecretModal">
                取消
              </button>
              <button class="secret-btn primary flex-1" @click="verifySecret">
                确认
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s cubic-bezier(0.25, 0.8, 0.25, 1),
              transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.page-enter-from {
  opacity: 0;
  transform: translateX(16px);
}
.page-leave-to {
  opacity: 0;
  transform: translateX(-16px);
}

/* ─── 社交卡片 (像素风格) ─── */
.card {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fffaef;
  border: 2px solid #161310;
  box-shadow: 4px 4px 0 0 #161310;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  overflow: hidden;
  height: 50px;
  width: 200px;
  margin-top: 16px;
}

.card::before, .card::after {
  position: absolute;
  display: flex;
  align-items: center;
  width: 50%;
  height: 100%;
  transition: 0.25s linear;
  z-index: 1;
}

.card::before {
  content: "";
  left: 0;
  justify-content: flex-end;
  background: #161310;
}

.card::after {
  content: "";
  right: 0;
  justify-content: flex-start;
  background: #161310;
}

.card:hover {
  box-shadow: 6px 6px 0 0 #161310;
  transform: translate(-1px, -1px);
}

.card:hover span {
  opacity: 0;
  z-index: -3;
}

.card:hover::before {
  transform: translateY(-100%);
}

.card:hover::after {
  transform: translateY(100%);
}

.card span {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #ffffff;
  font-family: "VT323", ui-monospace, monospace;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 1;
  transition: opacity 0.25s;
  z-index: 2;
}

.card .social-link {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 25%;
  height: 100%;
  color: #161310;
  font-size: 24px;
  text-decoration: none;
  transition: 0.25s;
}

.card .social-link svg {
  height: 25px !important;
  width: 25px !important;
  filter: drop-shadow(0 1px 1px rgba(0,0,0,0.2));
  transform: scale(1);
}

.card .social-link:hover {
  background-color: rgba(22, 19, 16, 0.1);
  color: #000;
  animation: bounce_613 0.4s linear;
}

@keyframes bounce_613 {
  40% { transform: scale(1.4); }
  60% { transform: scale(0.8); }
  80% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.back-to-top {
  position: fixed;
  bottom: 32px;
  right: 32px;
  z-index: 40;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 64px;
  height: 64px;
  background: #fffaef;
  border: 3px solid #161310;
  box-shadow: 4px 4px 0 0 #161310;
  color: #161310;
  cursor: pointer;
  font-family: 'Pixelify Sans', ui-monospace, monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
  image-rendering: pixelated;
}

.back-to-top:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0 0 #161310;
  background: #f5f0e8;
}

.back-to-top:active {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 0 #161310;
  background: #ebe4d6;
}

.back-to-top svg {
  width: 24px;
  height: 24px;
}

@media (max-width: 768px) {
  .main-content {
    padding-bottom: 56px;
  }
  .footer-content {
    padding-bottom: 56px;
  }
  .back-to-top {
    bottom: 76px;
    right: 20px;
    width: 56px;
    height: 56px;
    font-size: 10px;
  }
  .back-to-top svg {
    width: 20px;
    height: 20px;
  }
}

.copyright-btn {
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  color: inherit;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.2s;
}

.copyright-btn:hover {
  color: #2e5dd6;
}

.secret-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(22, 19, 16, 0.6);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.secret-modal {
  background: #fffaef;
  border: 3px solid #161310;
  box-shadow: 8px 8px 0 0 #161310;
  width: 100%;
  max-width: 420px;
  animation: modalIn 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.secret-modal-header {
  background: #161310;
  padding: 10px 16px;
}

.secret-input {
  width: 100%;
  padding: 10px 14px;
  background: #f5f0e8;
  border: 2px solid #161310;
  color: #161310;
  font-family: ui-monospace, monospace;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;
  box-sizing: border-box;
}

.secret-input:focus {
  background: #fffaef;
  border-color: #2e5dd6;
  box-shadow: 3px 3px 0 0 #2e5dd6;
}

.secret-btn {
  padding: 10px 20px;
  border: 2px solid #161310;
  font-family: 'Pixelify Sans', ui-monospace, monospace;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.secret-btn.primary {
  background: #2e5dd6;
  color: #fffaef;
  box-shadow: 3px 3px 0 0 #161310;
}

.secret-btn.primary:hover {
  transform: translate(-1px, -1px);
  box-shadow: 4px 4px 0 0 #161310;
  background: #3a6ee8;
}

.secret-btn.primary:active {
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0 0 #161310;
}

.secret-btn.secondary {
  background: #fffaef;
  color: #161310;
  box-shadow: 3px 3px 0 0 #161310;
}

.secret-btn.secondary:hover {
  transform: translate(-1px, -1px);
  box-shadow: 4px 4px 0 0 #161310;
  background: #f5f0e8;
}

.secret-btn.secondary:active {
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0 0 #161310;
}
</style>
