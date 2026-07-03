<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { articles as articlesData } from '@/data/contents.js'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

const router = useRouter()

interface Article {
  id: number
  title: string
  date: string
  category: string
  readingTime: string
  words: string
  summary: string
  tags: string[]
}

const articles = ref<Article[]>(articlesData)
const activeCategory = ref('all')

const allCategories = computed(() => {
  const catSet = new Set<string>()
  articles.value.forEach((a) => catSet.add(a.category))
  return Array.from(catSet)
})

const filteredArticles = computed(() => {
  if (activeCategory.value === 'all') return articles.value
  return articles.value.filter((a) => a.category === activeCategory.value)
})

const totalWords = computed(() => {
  return articles.value.reduce((sum, a) => sum + parseInt(a.words.replace(',', '')), 0)
})

const totalTags = computed(() => {
  return [...new Set(articles.value.flatMap((a) => a.tags))].length
})

const totalCategories = computed(() => allCategories.value.length)

function viewArticle(id: number) {
  router.push(`/article/${id}`)
}

function formatNumber(num: number): string {
  return num.toLocaleString()
}
</script>

<template>
  <div class="min-h-[100dvh] bg-background pt-24 pb-20">
    <div class="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16">
      <!-- Header -->
      <div class="animate-fade-up">
        <Badge variant="outline" class="mb-4 w-fit text-xs tracking-[0.15em] border-emerald-500/30 text-emerald-400">
          时间线
        </Badge>
        <h1 class="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          写作时间线
        </h1>
        <p class="mt-3 text-base text-muted-foreground max-w-xl">
          {{ articles.length }} 篇文章 · 记录学习与思考的轨迹
        </p>
      </div>

      <!-- Stats Cards -->
      <div class="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card class="group border-border/60 bg-card/50 backdrop-blur-sm hover:border-emerald-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5">
          <CardContent class="p-5">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/15 transition-colors">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
              </div>
              <div>
                <p class="text-2xl font-bold text-foreground tabular-nums group-hover:text-emerald-400 transition-colors">
                  {{ articles.length }}
                </p>
                <p class="text-xs text-muted-foreground mt-0.5">文章总数</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card class="group border-border/60 bg-card/50 backdrop-blur-sm hover:border-emerald-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5">
          <CardContent class="p-5">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/15 transition-colors">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                </svg>
              </div>
              <div>
                <p class="text-2xl font-bold text-foreground tabular-nums group-hover:text-emerald-400 transition-colors">
                  {{ formatNumber(totalWords) }}
                </p>
                <p class="text-xs text-muted-foreground mt-0.5">总字数</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card class="group border-border/60 bg-card/50 backdrop-blur-sm hover:border-emerald-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5">
          <CardContent class="p-5">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/15 transition-colors">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                  <line x1="7" y1="7" x2="7.01" y2="7"/>
                </svg>
              </div>
              <div>
                <p class="text-2xl font-bold text-foreground tabular-nums group-hover:text-emerald-400 transition-colors">
                  {{ totalTags }}
                </p>
                <p class="text-xs text-muted-foreground mt-0.5">标签数</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card class="group border-border/60 bg-card/50 backdrop-blur-sm hover:border-emerald-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5">
          <CardContent class="p-5">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/15 transition-colors">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <div>
                <p class="text-2xl font-bold text-foreground tabular-nums group-hover:text-emerald-400 transition-colors">
                  {{ totalCategories }}
                </p>
                <p class="text-xs text-muted-foreground mt-0.5">分类数</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Category Tabs -->
      <div class="mt-10">
        <Tabs value="all" @update:model-value="(v: string) => (activeCategory = v)">
          <TabsList class="w-full h-auto flex-wrap gap-1.5 bg-transparent p-0">
            <TabsTrigger
              value="all"
              class="data-active:bg-emerald-500/15 data-active:text-emerald-400 data-active:border-emerald-500/30"
            >
              全部
              <Badge variant="outline" class="ml-1.5 text-[10px] h-4 px-1.5 border-border/50 text-muted-foreground data-active:text-emerald-400">
                {{ articles.length }}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              v-for="cat in allCategories"
              :key="cat"
              :value="cat"
              class="data-active:bg-emerald-500/15 data-active:text-emerald-400 data-active:border-emerald-500/30"
            >
              {{ cat }}
              <Badge variant="outline" class="ml-1.5 text-[10px] h-4 px-1.5 border-border/50 text-muted-foreground">
                {{ articles.filter(a => a.category === cat).length }}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <!-- Timeline -->
      <div class="mt-10 relative">
        <!-- Timeline Line -->
        <div class="absolute left-0 sm:left-[7px] top-0 bottom-0 w-px bg-gradient-to-b from-emerald-500/30 via-border to-transparent hidden sm:block" />

        <div
          v-for="(item, idx) in filteredArticles"
          :key="item.id"
          class="relative pl-0 sm:pl-12 pb-12 last:pb-0 group/item"
        >
          <!-- Timeline Dot -->
          <div class="absolute left-0 top-1.5 hidden sm:block">
            <div class="relative">
              <div class="w-4 h-4 rounded-full bg-emerald-500 border-4 border-background shadow-[0_0_0_1px_rgba(16,185,129,0.3)] group-hover/item:shadow-[0_0_0_1px_rgba(16,185,129,0.6),0_0_20px_rgba(16,185,129,0.4)] transition-all duration-300" />
              <div class="absolute inset-0 w-4 h-4 rounded-full bg-emerald-500/30 animate-ping" />
            </div>
          </div>

          <!-- Date Badge -->
          <div class="inline-flex items-center gap-2 mb-3">
            <Badge variant="secondary" class="text-xs bg-secondary/50 text-muted-foreground border-border/40">
              {{ item.date }}
            </Badge>
            <span class="text-xs text-muted-foreground/70 flex items-center gap-1">
              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              {{ item.readingTime }} · {{ item.words }} 字
            </span>
          </div>

          <!-- Article Card -->
          <Card
            class="group cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/[0.07] border-border/60 bg-card/50 backdrop-blur-sm hover:border-emerald-500/40 tilt-card"
            style="transition-timing-function: cubic-bezier(0.16,1,0.3,1)"
            @click="viewArticle(item.id)"
          >
            <CardContent class="p-6">
              <!-- Category & Tags -->
              <div class="flex items-center gap-2 mb-3 flex-wrap">
                <Badge
                  variant="default"
                  class="text-[11px] bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/20"
                >
                  {{ item.category }}
                </Badge>
                <Badge
                  v-for="tag in item.tags.slice(0, 4)"
                  :key="tag"
                  variant="outline"
                  class="text-[11px] font-normal border-border/50 text-muted-foreground hover:border-emerald-500/30 hover:text-emerald-400/80 transition-colors"
                >
                  #{{ tag }}
                </Badge>
                <span v-if="item.tags.length > 4" class="text-[11px] text-muted-foreground/60">
                  +{{ item.tags.length - 4 }}
                </span>
              </div>

              <!-- Title -->
              <h2 class="text-xl font-bold tracking-tight text-foreground mb-2 group-hover:text-emerald-400 transition-colors duration-300">
                {{ item.title }}
              </h2>

              <!-- Summary -->
              <p class="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">
                {{ item.summary }}
              </p>

              <!-- Read More -->
              <div class="flex items-center justify-between">
                <span class="text-xs text-emerald-400/80 flex items-center gap-1 group-hover:gap-1.5 transition-all">
                  阅读全文
                  <svg class="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </span>
                <span class="text-[11px] text-muted-foreground/50">
                  #{{ item.id }}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Empty State -->
        <div v-if="filteredArticles.length === 0" class="py-20 flex flex-col items-center justify-center text-center">
          <div class="w-16 h-16 rounded-2xl bg-emerald-500/5 flex items-center justify-center mb-4">
            <svg class="w-8 h-8 text-emerald-400/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-foreground">暂无相关文章</h3>
          <p class="mt-1 text-sm text-muted-foreground">试试选择其他分类</p>
        </div>
      </div>
    </div>
  </div>
</template>
