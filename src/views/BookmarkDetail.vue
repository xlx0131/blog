<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ScrollReveal from '@/components/ScrollReveal.vue'
import { bookmarks } from '@/data/bookmarks.js'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'

const route = useRoute()
const router = useRouter()
const id = computed(() => Number(route.params.id))

const allItems = bookmarks.flatMap(cat => cat.items.map(item => ({ ...item, category: cat.name })))
const item = computed(() => allItems.find(i => i.id === id.value))

const relatedItems = computed(() => {
  if (!item.value) return []
  return allItems
    .filter(i => i.category === item.value!.category && i.id !== item.value!.id)
    .slice(0, 4)
})

function goBack() {
  router.push('/bookmarks')
}

function openUrl(url: string) {
  window.open(url, '_blank', 'noopener noreferrer')
}

function getInitials(name: string) {
  return name.slice(0, 2).toUpperCase()
}

function getDomain(url: string) {
  try {
    return new URL(url).hostname.replace('www.', '')
  } catch {
    return url
  }
}
</script>

<template>
  <div class="min-h-[100dvh] bg-background pt-24 pb-20" v-if="item">
    <div class="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-20">
      <Button variant="ghost" size="sm" class="mb-8 gap-1.5 group" @click="goBack">
        <svg class="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        返回收藏夹
      </Button>

      <ScrollReveal>
        <div class="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
          <div class="w-full lg:w-2/5">
            <div class="sticky top-28">
              <div class="relative aspect-square rounded-2xl bg-gradient-to-br from-emerald-950 via-card to-emerald-900 border border-border flex items-center justify-center overflow-hidden group">
                <div class="absolute inset-0 opacity-[0.06]" style="background-image: repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(255,255,255,0.03) 19px, rgba(255,255,255,0.03) 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(255,255,255,0.03) 19px, rgba(255,255,255,0.03) 20px);"></div>
                <div class="absolute inset-0 bg-gradient-to-t from-emerald-950/50 via-transparent to-transparent opacity-60"></div>
                <div class="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
                  <Badge variant="secondary" class="bg-background/60 backdrop-blur-sm border-border/40">
                    {{ item.category }}
                  </Badge>
                  <div class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                </div>
                <div class="relative z-10 w-28 h-28 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-emerald-600/10 to-emerald-800/5 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-3xl shadow-lg shadow-emerald-500/10 transition-all duration-500 group-hover:scale-110 group-hover:shadow-emerald-500/20">
                  {{ getInitials(item.name) }}
                </div>
                <div class="absolute bottom-4 left-4 right-4 z-10">
                  <div class="flex items-center gap-2 text-xs text-muted-foreground">
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M2 12h20"/>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                    <span class="truncate">{{ getDomain(item.url) }}</span>
                  </div>
                </div>
              </div>

              <div class="mt-6 flex flex-col sm:flex-row gap-3">
                <Button class="flex-1 gap-2 btn-tactile" @click="openUrl(item.url)">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                  直达链接
                </Button>
                <Button variant="secondary" class="sm:w-auto gap-2 btn-tactile" @click="goBack">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                  </svg>
                  返回列表
                </Button>
              </div>
            </div>
          </div>

          <div class="w-full lg:w-3/5">
            <div class="mb-6">
              <Badge variant="outline" class="mb-3 text-xs border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                {{ item.category }}
              </Badge>
              <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                {{ item.name }}
              </h1>
            </div>

            <Card class="border-border/60 bg-card/50 backdrop-blur-sm">
              <CardHeader class="p-6 pb-4">
                <CardTitle class="text-base font-semibold flex items-center gap-2">
                  <svg class="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 16v-4"/>
                    <path d="M12 8h.01"/>
                  </svg>
                  简介
                </CardTitle>
              </CardHeader>
              <CardContent class="p-6 pt-0">
                <p class="text-base text-muted-foreground leading-relaxed">
                  {{ item.desc }}
                </p>
              </CardContent>
            </Card>

            <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card class="border-border/60 bg-card/50 backdrop-blur-sm">
                <CardContent class="p-5">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <svg class="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                      </svg>
                    </div>
                    <div>
                      <p class="text-xs text-muted-foreground">分类</p>
                      <p class="text-sm font-medium text-foreground mt-0.5">{{ item.category }}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card class="border-border/60 bg-card/50 backdrop-blur-sm">
                <CardContent class="p-5">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <svg class="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M2 12h20"/>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                      </svg>
                    </div>
                    <div class="min-w-0">
                      <p class="text-xs text-muted-foreground">域名</p>
                      <p class="text-sm font-medium text-foreground mt-0.5 truncate">{{ getDomain(item.url) }}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div class="mt-10">
              <Button
                size="lg"
                class="w-full sm:w-auto gap-2.5 btn-tactile bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"
                @click="openUrl(item.url)"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
                立即访问 {{ item.name }}
              </Button>
            </div>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal v-if="relatedItems.length > 0">
        <div class="mt-20">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold tracking-tight text-foreground">相关推荐</h2>
            <Badge variant="outline" class="text-xs">{{ relatedItems.length }} 个</Badge>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card
              v-for="related in relatedItems"
              :key="related.id"
              class="group cursor-pointer border-border/60 bg-card/50 backdrop-blur-sm hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-0.5"
              @click="router.push(`/bookmarks/${related.id}`)"
            >
              <CardContent class="p-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-800/5 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm shrink-0 transition-all duration-300 group-hover:scale-105">
                    {{ getInitials(related.name) }}
                  </div>
                  <div class="min-w-0 flex-1">
                    <h4 class="text-sm font-semibold text-foreground truncate group-hover:text-emerald-400 transition-colors duration-300">
                      {{ related.name }}
                    </h4>
                    <p class="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                      {{ related.desc }}
                    </p>
                  </div>
                  <svg class="w-4 h-4 text-muted-foreground opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-emerald-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </ScrollReveal>
    </div>
  </div>

  <div v-else class="min-h-[100dvh] bg-background pt-24 pb-20 flex items-center justify-center">
    <div class="text-center max-w-md mx-auto px-6">
      <ScrollReveal>
        <div class="relative w-24 h-24 mx-auto mb-6">
          <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-800/5 border border-emerald-500/20 animate-pulse"></div>
          <div class="relative w-full h-full rounded-2xl bg-card border border-border flex items-center justify-center text-4xl">
            🔍
          </div>
        </div>
        <h1 class="text-2xl font-bold text-foreground mb-2">收藏未找到</h1>
        <p class="text-base text-muted-foreground mb-6">
          你访问的收藏不存在，可能已被移除或链接有误。
        </p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <Button class="gap-2 btn-tactile" @click="goBack">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            返回收藏夹
          </Button>
          <Button variant="secondary" class="gap-2 btn-tactile" @click="router.push('/')">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            返回首页
          </Button>
        </div>
      </ScrollReveal>
    </div>
  </div>
</template>
