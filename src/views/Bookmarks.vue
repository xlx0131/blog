<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { bookmarks } from '@/data/bookmarks.js'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { initTiltCards } from '@/composables/useInteractions'

const router = useRouter()

const activeTab = ref('all')

const allItems = computed(() => {
  return bookmarks.flatMap((cat: any) =>
    cat.items.map((item: any) => ({ ...item, category: cat.name }))
  )
})

const categoryNames = computed(() => bookmarks.map((cat: any) => cat.name))

const filteredItems = computed(() => {
  if (activeTab.value === 'all') return allItems.value
  return allItems.value.filter((item: any) => item.category === activeTab.value)
})

const totalCount = computed(() => allItems.value.length)

function openDetail(bookmark: { id: number }) {
  router.push(`/bookmarks/${bookmark.id}`)
}

function reInitTilt() {
  nextTick(() => {
    setTimeout(() => initTiltCards(), 50)
  })
}

function getInitials(name: string) {
  return name.slice(0, 2).toUpperCase()
}

onMounted(() => {
  reInitTilt()
})
</script>

<template>
  <div class="min-h-[100dvh] bg-background pt-24 pb-20">
    <div class="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-20">
      <div class="animate-fade-up">
        <Badge variant="outline" class="mb-4 w-fit text-xs tracking-[0.15em]">收藏夹</Badge>
        <h1 class="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">我的收藏</h1>
        <p class="mt-2 text-base text-muted-foreground">
          {{ bookmarks.length }} 个分类，共 {{ totalCount }} 个精选网站
        </p>
      </div>

      <div class="mt-8">
        <Tabs value="all" @update:model-value="(v: string) => { activeTab = v; reInitTilt() }">
          <TabsList class="w-full h-auto flex-wrap gap-1 bg-transparent p-0">
            <TabsTrigger
              value="all"
              class="data-active:bg-emerald-500/15 data-active:text-emerald-400 data-active:border-emerald-500/30"
            >
              全部
              <Badge variant="outline" class="ml-1.5 text-[10px] h-4 px-1 border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                {{ totalCount }}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              v-for="cat in bookmarks"
              :key="cat.name"
              :value="cat.name"
              class="data-active:bg-emerald-500/15 data-active:text-emerald-400 data-active:border-emerald-500/30"
            >
              {{ cat.name }}
              <Badge variant="outline" class="ml-1.5 text-[10px] h-4 px-1 border-border/50 text-muted-foreground">
                {{ cat.items.length }}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div class="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <Card
          v-for="item in filteredItems"
          :key="item.id"
          class="group cursor-pointer overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-emerald-500/5 tilt-card border-border/60 bg-card/50 backdrop-blur-sm hover:border-emerald-500/30"
          style="transition-timing-function: cubic-bezier(0.16,1,0.3,1)"
          @click="openDetail(item)"
        >
          <CardContent class="p-5">
            <div class="flex items-start gap-3 mb-3">
              <div class="relative shrink-0">
                <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500/20 via-emerald-600/10 to-emerald-800/5 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm transition-all duration-300 group-hover:from-emerald-500/30 group-hover:to-emerald-600/15 group-hover:border-emerald-500/40 group-hover:scale-105">
                  {{ getInitials(item.name) }}
                </div>
                <div class="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-card opacity-0 transition-all duration-300 group-hover:opacity-100"></div>
              </div>
              <div class="min-w-0 flex-1">
                <h4 class="text-sm font-semibold text-foreground truncate group-hover:text-emerald-400 transition-colors duration-300">
                  {{ item.name }}
                </h4>
                <Badge variant="outline" class="mt-1 text-[10px] font-normal border-border/50 text-muted-foreground h-4 px-1.5">
                  {{ item.category }}
                </Badge>
              </div>
            </div>
            <p class="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {{ item.desc }}
            </p>
          </CardContent>
          <CardFooter class="p-5 pt-0 flex items-center justify-between">
            <span class="text-xs text-muted-foreground group-hover:text-emerald-400 transition-colors duration-300 flex items-center gap-1">
              查看详情
              <svg class="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </span>
            <div class="w-7 h-7 rounded-lg bg-muted/50 flex items-center justify-center opacity-0 translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:bg-emerald-500/15">
              <svg class="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M7 17L17 7M17 7H8M17 7v9"/>
              </svg>
            </div>
          </CardFooter>
        </Card>
      </div>

      <div v-if="filteredItems.length === 0" class="mt-16 flex flex-col items-center justify-center py-16 text-center">
        <div class="w-16 h-16 rounded-2xl bg-muted/30 flex items-center justify-center text-3xl mb-4">
          🔍
        </div>
        <h3 class="text-lg font-medium text-foreground">暂无收藏</h3>
        <p class="mt-1 text-sm text-muted-foreground">该分类下还没有收藏的网站</p>
      </div>
    </div>
  </div>
</template>
