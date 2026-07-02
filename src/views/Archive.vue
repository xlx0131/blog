<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const articles = [
  {
    id: 1,
    title: '从零搭建个人主页：Vue 3 + Vite + Cloudflare Pages 实战记录',
    date: '2026-07-01',
    category: '技术',
    readingTime: '10 min',
    words: '1,500',
    summary: '记录使用 Vue 3、Vite、Tailwind CSS 和 GSAP 从零搭建个人主页，并部署到 Cloudflare Pages 的全过程。',
    tags: ['Vue 3', 'Cloudflare', '部署'],
  },
  {
    id: 2,
    title: '用户画像分析：从数据清洗到 RFM 模型构建',
    date: '2026-01-15',
    category: '数据分析',
    readingTime: '12 min',
    words: '2,000',
    summary: '基于用户行为数据，使用 Python + SQL 进行全链路数据清洗，利用 RFM 模型构建用户标签体系。',
    tags: ['Python', '数据分析', 'RFM'],
  },
]

function viewArticle(id: number) {
  router.push(`/article/${id}`)
}
</script>

<template>
  <div class="min-h-[100dvh] bg-[#fafafa] pt-24 pb-20">
    <div class="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-20">
      <!-- Header -->
      <div class="animate-fade-up">
        <span class="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 tracking-[0.15em] uppercase">
          <span class="w-6 h-px bg-zinc-300" />
          时间线
        </span>
        <h1 class="mt-4 text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">写作时间线</h1>
        <p class="mt-2 text-base text-neutral-500">{{ articles.length }} 篇文章 · 记录学习与思考</p>
      </div>

      <!-- Timeline -->
      <div class="mt-14 relative">
        <!-- Vertical line -->
        <div class="absolute left-0 top-0 bottom-0 w-px bg-zinc-200 hidden sm:block" />

        <div v-for="(item, idx) in articles" :key="item.id" class="relative pl-0 sm:pl-10 pb-14 last:pb-0">
          <!-- Timeline dot -->
          <div class="absolute left-[-5px] top-1 w-[11px] h-[11px] rounded-full bg-emerald-500 border-2 border-white shadow-sm hidden sm:block" />

          <!-- Date badge -->
          <div class="inline-flex items-center gap-2 mb-3">
            <span class="text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-full px-3 py-1">{{ item.date }}</span>
            <span class="text-[11px] text-zinc-400">{{ item.readingTime }} · {{ item.words }} 字</span>
          </div>

          <!-- Card -->
          <div
            class="bg-white border border-zinc-200 rounded-xl p-6 hover:border-emerald-300 hover:shadow-[0_4px_20px_-8px_rgba(5,150,105,0.12)] transition-all duration-300 cursor-pointer tilt-card"
            @click="viewArticle(item.id)"
          >
            <div class="flex items-center gap-3 mb-3">
              <span class="text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-full px-2.5 py-0.5">{{ item.category }}</span>
              <span v-for="tag in item.tags" :key="tag" class="text-[11px] text-zinc-400 bg-zinc-100 rounded-full px-2 py-0.5">{{ tag }}</span>
            </div>
            <h2 class="text-xl font-bold tracking-tight text-neutral-900 mb-2">{{ item.title }}</h2>
            <p class="text-sm text-zinc-500 leading-relaxed">{{ item.summary }}</p>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="mt-16 border-t border-zinc-200 pt-10">
        <div class="grid grid-cols-3 gap-6 max-w-md mx-auto text-center">
          <div>
            <p class="text-2xl font-bold text-zinc-900 tabular-nums">{{ articles.length }}</p>
            <p class="text-xs text-zinc-500 mt-0.5">文章</p>
          </div>
          <div>
            <p class="text-2xl font-bold text-zinc-900 tabular-nums">{{ articles.reduce((sum, a) => sum + parseInt(a.words.replace(',','')), 0) }}</p>
            <p class="text-xs text-zinc-500 mt-0.5">总字数</p>
          </div>
          <div>
            <p class="text-2xl font-bold text-zinc-900 tabular-nums">{{ [...new Set(articles.flatMap(a => a.tags))].length }}</p>
            <p class="text-xs text-zinc-500 mt-0.5">标签</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
