<script setup lang="ts">
import { useRouter } from 'vue-router'
import { bookmarks } from '@/data/bookmarks.js'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

const router = useRouter()

function openDetail(bookmark: { id: number }) {
  router.push(`/bookmarks/${bookmark.id}`)
}
</script>

<template>
  <div class="min-h-[100dvh] bg-background pt-24 pb-20">
    <div class="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-20">
      <div class="animate-fade-up">
        <Badge variant="outline" class="mb-4 w-fit text-xs tracking-[0.15em]">收藏夹</Badge>
        <h1 class="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">我的收藏</h1>
        <p class="mt-2 text-base text-muted-foreground">{{ bookmarks.length }} 个分类，共 {{ bookmarks.reduce((sum, c) => sum + c.items.length, 0) }} 个网站</p>
      </div>

      <div class="mt-12 space-y-16">
        <section v-for="cat in bookmarks" :key="cat.name" class="animate-fade-up">
          <h2 class="text-lg font-bold tracking-tight text-[#34d399] mb-5">{{ cat.name }}</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <Card
              v-for="item in cat.items"
              :key="item.id"
              class="cursor-pointer transition-all duration-300 hover:-translate-y-1 tilt-card"
              @click="openDetail(item)"
            >
              <CardContent class="p-4">
                <div class="flex items-center gap-3 mb-2">
                  <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-900/20 to-emerald-800/10 text-[#34d399] flex items-center justify-center text-sm font-bold truncate">{{ item.name.slice(0, 2) }}</div>
                </div>
                <h4 class="text-sm font-semibold text-foreground truncate">{{ item.name }}</h4>
                <p class="mt-1 text-xs text-muted-foreground line-clamp-2">{{ item.desc }}</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
