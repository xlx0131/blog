<script setup lang="ts">
import { useRouter } from 'vue-router'
import { articles } from '@/data/contents.js'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const router = useRouter()

function viewArticle(id: number) {
  router.push(`/article/${id}`)
}
</script>

<template>
  <div class="min-h-[100dvh] bg-background pt-24 pb-20">
    <div class="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-20">
      <!-- Header -->
      <div class="animate-fade-up">
        <Badge variant="outline" class="mb-4 w-fit text-xs tracking-[0.15em]">时间线</Badge>
        <h1 class="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">写作时间线</h1>
        <p class="mt-2 text-base text-muted-foreground">{{ articles.length }} 篇文章 · 记录学习与思考</p>
      </div>

      <!-- Timeline -->
      <div class="mt-14 relative">
        <div class="absolute left-0 top-0 bottom-0 w-px bg-border hidden sm:block" />

        <div v-for="(item, idx) in articles" :key="item.id" class="relative pl-0 sm:pl-10 pb-14 last:pb-0">
          <div class="absolute left-[-5px] top-1 w-[11px] h-[11px] rounded-full bg-[#34d399] border-2 border-background shadow-sm hidden sm:block" />

          <div class="inline-flex items-center gap-2 mb-3">
            <Badge variant="secondary" class="text-xs">{{ item.date }}</Badge>
            <span class="text-xs text-muted-foreground">{{ item.readingTime }} · {{ item.words }} 字</span>
          </div>

          <Card
            class="cursor-pointer transition-all duration-300 hover:border-[#34d399] hover:shadow-[0_4px_20px_-8px_rgba(52,211,153,0.08)] tilt-card"
            @click="viewArticle(item.id)"
          >
            <CardContent class="p-6">
              <div class="flex items-center gap-3 mb-3">
                <Badge variant="secondary" class="text-xs">{{ item.category }}</Badge>
                <Badge v-for="tag in item.tags" :key="tag" variant="outline" class="text-[11px] font-normal">{{ tag }}</Badge>
              </div>
              <h2 class="text-xl font-bold tracking-tight text-foreground mb-2">{{ item.title }}</h2>
              <p class="text-sm text-muted-foreground leading-relaxed">{{ item.summary }}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <!-- Stats -->
      <div class="mt-16 border-t border-border pt-10">
        <div class="grid grid-cols-3 gap-6 max-w-md mx-auto text-center">
          <div>
            <p class="text-2xl font-bold text-foreground tabular-nums">{{ articles.length }}</p>
            <p class="text-xs text-muted-foreground mt-0.5">文章</p>
          </div>
          <div>
            <p class="text-2xl font-bold text-foreground tabular-nums">{{ articles.reduce((sum, a) => sum + parseInt(a.words.replace(',','')), 0) }}</p>
            <p class="text-xs text-muted-foreground mt-0.5">总字数</p>
          </div>
          <div>
            <p class="text-2xl font-bold text-foreground tabular-nums">{{ [...new Set(articles.flatMap(a => a.tags))].length }}</p>
            <p class="text-xs text-muted-foreground mt-0.5">标签</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
