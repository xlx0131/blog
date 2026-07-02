<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ScrollReveal from '@/components/ScrollReveal.vue'
import { bookmarks } from '@/data/bookmarks.js'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

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
  <div class="min-h-[100dvh] bg-background pt-24 pb-20" v-if="item">
    <div class="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-20">
      <Button variant="ghost" size="sm" class="mb-8 gap-1.5" @click="goBack">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        返回收藏夹
      </Button>

      <ScrollReveal>
      <div class="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
        <div class="w-full lg:w-1/3">
          <div class="aspect-square rounded-2xl bg-gradient-to-br from-emerald-950 via-background to-emerald-900 border border-border flex items-center justify-center text-8xl relative overflow-hidden">
            <div class="absolute inset-0 opacity-[0.06]" style="background-image: repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(255,255,255,0.03) 19px, rgba(255,255,255,0.03) 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(255,255,255,0.03) 19px, rgba(255,255,255,0.03) 20px);"></div>
            <span class="relative z-10 text-6xl">📎</span>
          </div>
        </div>

        <div class="w-full lg:w-2/3">
          <Badge variant="secondary" class="mb-3">{{ item.category }}</Badge>
          <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">{{ item.name }}</h1>
          <p class="mt-4 text-base text-muted-foreground leading-relaxed max-w-[65ch]">{{ item.desc }}</p>

          <Button class="mt-8 gap-2" @click="openUrl(item.url)">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
            直达链接
          </Button>
        </div>
      </div>
      </ScrollReveal>

      <ScrollReveal>
      <div class="mt-16 border-t border-border pt-10 text-center">
        <p class="text-sm text-muted-foreground mb-4">访问该网站</p>
        <Button variant="secondary" size="lg" class="gap-2" @click="openUrl(item.url)">
          前往 {{ item.name }}
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
        </Button>
      </div>
      </ScrollReveal>
    </div>
  </div>

  <div v-else class="min-h-[100dvh] bg-background pt-24 pb-20 flex items-center justify-center">
    <div class="text-center">
      <p class="text-6xl mb-4">🔍</p>
      <h1 class="text-2xl font-bold text-foreground">收藏未找到</h1>
      <Button variant="link" class="mt-4" @click="goBack">返回收藏夹</Button>
    </div>
  </div>
</template>
