<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ScrollReveal from '@/components/ScrollReveal.vue'
import { bookmarks } from '@/data/bookmarks.js'

const route = useRoute()
const router = useRouter()
const id = computed(() => Number(route.params.id))

const allItems = bookmarks.flatMap(cat => cat.items.map(item => ({ ...item, category: cat.name })))
const item = computed(() => allItems.find(i => i.id === id.value))

function goBack() {
  router.push('/bookmarks')
}

function openUrl(url: string) {
  window.open(url, '_blank', 'noopener noreferrer')
}
</script>

<template>
  <div class="min-h-[100dvh] bg-[#0d1117] pt-24 pb-20" v-if="item">
    <div class="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-20">
      <button
        class="inline-flex items-center gap-1.5 text-sm text-[#8b949e] hover:text-[#34d399] transition-colors duration-300 mb-8"
        @click="goBack"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        返回收藏夹
      </button>

      <ScrollReveal>
      <div class="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
        <div class="w-full lg:w-1/3">
          <div class="aspect-square rounded-2xl bg-gradient-to-br from-emerald-950 via-[#0d1117] to-emerald-900 border border-[#30363d] flex items-center justify-center text-8xl relative overflow-hidden">
            <div class="absolute inset-0 opacity-[0.06]" style="background-image: repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(255,255,255,0.03) 19px, rgba(255,255,255,0.03) 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(255,255,255,0.03) 19px, rgba(255,255,255,0.03) 20px);"></div>
            <span class="relative z-10 text-6xl">📎</span>
          </div>
        </div>

        <div class="w-full lg:w-2/3">
          <div class="flex items-center gap-3 mb-3">
            <span class="text-xs font-medium text-[#34d399] bg-[#059669]/10 rounded-full px-2.5 py-0.5">{{ item.category }}</span>
          </div>
          <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-[#e6edf3]">{{ item.name }}</h1>
          <p class="mt-4 text-base text-[#8b949e] leading-relaxed max-w-[65ch]">{{ item.desc }}</p>

          <a
            :href="item.url"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#059669] text-white text-sm font-medium hover:bg-emerald-500 transition-all duration-300 magnetic-btn ripple-btn"
            style="transition-timing-function: cubic-bezier(0.16,1,0.3,1)"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
            直达链接
          </a>
        </div>
      </div>
      </ScrollReveal>

      <ScrollReveal>
      <div class="mt-16 border-t border-[#30363d] pt-10 text-center">
        <p class="text-sm text-[#8b949e] mb-4">访问该网站</p>
        <a
          :href="item.url"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#e6edf3] text-[#0d1117] text-sm font-medium hover:bg-white transition-all duration-300 ripple-btn magnetic-btn"
          style="transition-timing-function: cubic-bezier(0.16,1,0.3,1)"
        >
          前往 {{ item.name }}
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
        </a>
      </div>
      </ScrollReveal>
    </div>
  </div>

  <div v-else class="min-h-[100dvh] bg-[#0d1117] pt-24 pb-20 flex items-center justify-center">
    <div class="text-center">
      <p class="text-6xl mb-4">🔍</p>
      <h1 class="text-2xl font-bold text-[#e6edf3]">收藏未找到</h1>
      <button class="mt-4 text-sm text-[#34d399] hover:text-emerald-400" @click="goBack">返回收藏夹</button>
    </div>
  </div>
</template>
