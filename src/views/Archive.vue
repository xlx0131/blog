<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const articles = [
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
  <div class="min-h-[100dvh] bg-[#0d1117] pt-24 pb-20">
    <div class="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-20">
      <!-- Header -->
      <div class="animate-fade-up">
        <span class="inline-flex items-center gap-2 text-xs font-medium text-[#6e7681] tracking-[0.15em] uppercase">
          <span class="w-6 h-px bg-[#30363d]" />
          时间线
        </span>
        <h1 class="mt-4 text-4xl font-bold tracking-tight text-[#e6edf3] sm:text-5xl">写作时间线</h1>
        <p class="mt-2 text-base text-[#8b949e]">{{ articles.length }} 篇文章 · 记录学习与思考</p>
      </div>

      <!-- Timeline -->
      <div class="mt-14 relative">
        <!-- Vertical line -->
        <div class="absolute left-0 top-0 bottom-0 w-px bg-[#30363d] hidden sm:block" />

        <div v-for="(item, idx) in articles" :key="item.id" class="relative pl-0 sm:pl-10 pb-14 last:pb-0">
          <!-- Timeline dot -->
          <div class="absolute left-[-5px] top-1 w-[11px] h-[11px] rounded-full bg-[#34d399] border-2 border-[#0d1117] shadow-sm hidden sm:block" />

          <!-- Date badge -->
          <div class="inline-flex items-center gap-2 mb-3">
            <span class="text-xs font-semibold text-[#34d399] bg-[#059669]/10 rounded-full px-3 py-1">{{ item.date }}</span>
            <span class="text-[11px] text-[#6e7681]">{{ item.readingTime }} · {{ item.words }} 字</span>
          </div>

          <!-- Card -->
          <div
            class="bg-[#161b22] border border-[#30363d] rounded-xl p-6 hover:border-[#34d399] hover:shadow-[0_4px_20px_-8px_rgba(52,211,153,0.08)] transition-all duration-300 cursor-pointer tilt-card"
            @click="viewArticle(item.id)"
          >
            <div class="flex items-center gap-3 mb-3">
              <span class="text-xs font-semibold text-[#34d399] bg-[#059669]/10 rounded-full px-2.5 py-0.5">{{ item.category }}</span>
              <span v-for="tag in item.tags" :key="tag" class="text-[11px] text-[#8b949e] bg-[#21262d] rounded-full px-2 py-0.5">{{ tag }}</span>
            </div>
            <h2 class="text-xl font-bold tracking-tight text-[#e6edf3] mb-2">{{ item.title }}</h2>
            <p class="text-sm text-[#8b949e] leading-relaxed">{{ item.summary }}</p>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="mt-16 border-t border-[#30363d] pt-10">
        <div class="grid grid-cols-3 gap-6 max-w-md mx-auto text-center">
          <div>
            <p class="text-2xl font-bold text-[#e6edf3] tabular-nums">{{ articles.length }}</p>
            <p class="text-xs text-[#8b949e] mt-0.5">文章</p>
          </div>
          <div>
            <p class="text-2xl font-bold text-[#e6edf3] tabular-nums">{{ articles.reduce((sum, a) => sum + parseInt(a.words.replace(',','')), 0) }}</p>
            <p class="text-xs text-[#8b949e] mt-0.5">总字数</p>
          </div>
          <div>
            <p class="text-2xl font-bold text-[#e6edf3] tabular-nums">{{ [...new Set(articles.flatMap(a => a.tags))].length }}</p>
            <p class="text-xs text-[#8b949e] mt-0.5">标签</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
