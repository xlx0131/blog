<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { articles as articlesData } from '@/data/contents.js'

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
  <div class="min-h-[100dvh] bg-[#f5f0e8] pt-24 pb-20">
    <div class="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16">
      <!-- Header -->
      <div class="animate-fade-up">
        <span class="font-mono text-sm tracking-widest text-[#2e5dd6] uppercase block mb-4">书架</span>
        <h1 class="font-mono text-4xl sm:text-5xl font-black tracking-tight text-[#161310]">
          写作书架
        </h1>
        <p class="mt-3 font-mono text-sm text-[#3a332a] max-w-xl">
          {{ articles.length }} 篇文章 · 翻开一本书，阅读一段思考
        </p>
      </div>

      <!-- Stats Cards -->
      <div class="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-[#fffaef] border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] rounded-none p-5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-[#161310]/10 flex items-center justify-center text-[#161310]">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-[#161310] tabular-nums font-mono">{{ articles.length }}</p>
              <p class="text-xs text-[#3a332a] mt-0.5 font-mono">文章总数</p>
            </div>
          </div>
        </div>
        <div class="bg-[#fffaef] border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] rounded-none p-5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-[#161310]/10 flex items-center justify-center text-[#161310]">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-[#161310] tabular-nums font-mono">{{ formatNumber(totalWords) }}</p>
              <p class="text-xs text-[#3a332a] mt-0.5 font-mono">总字数</p>
            </div>
          </div>
        </div>
        <div class="bg-[#fffaef] border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] rounded-none p-5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-[#161310]/10 flex items-center justify-center text-[#161310]">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                <line x1="7" y1="7" x2="7.01" y2="7"/>
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-[#161310] tabular-nums font-mono">{{ totalTags }}</p>
              <p class="text-xs text-[#3a332a] mt-0.5 font-mono">标签数</p>
            </div>
          </div>
        </div>
        <div class="bg-[#fffaef] border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] rounded-none p-5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-[#161310]/10 flex items-center justify-center text-[#161310]">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-[#161310] tabular-nums font-mono">{{ totalCategories }}</p>
              <p class="text-xs text-[#3a332a] mt-0.5 font-mono">分类数</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Category Tabs -->
      <div class="mt-10 flex flex-wrap gap-2">
        <button
          class="font-mono text-sm tracking-wider uppercase px-4 py-2 border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] transition-all duration-200 hover:-translate-y-0.5 hover:translate-x-0.5"
          :class="activeCategory === 'all' ? 'bg-[#161310] text-[#fffaef]' : 'bg-[#fffaef] text-[#161310]'"
          @click="activeCategory = 'all'"
        >
          全部 ({{ articles.length }})
        </button>
        <button
          v-for="cat in allCategories"
          :key="cat"
          class="font-mono text-sm tracking-wider uppercase px-4 py-2 border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] transition-all duration-200 hover:-translate-y-0.5 hover:translate-x-0.5"
          :class="activeCategory === cat ? 'bg-[#161310] text-[#fffaef]' : 'bg-[#fffaef] text-[#161310]'"
          @click="activeCategory = cat"
        >
          {{ cat }} ({{ articles.filter(a => a.category === cat).length }})
        </button>
      </div>

      <!-- Book Grid -->
      <div class="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
        <div
          v-for="item in filteredArticles"
          :key="item.id"
          class="book"
          @click="viewArticle(item.id)"
        >
          <p>{{ item.summary }}</p>
          <div class="cover">
            <p>{{ item.title }}</p>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredArticles.length === 0" class="col-span-full py-20 flex flex-col items-center justify-center text-center">
          <div class="w-20 h-20 bg-[#fffaef] border-2 border-[#161310] shadow-[8px_8px_0_0_#161310] flex items-center justify-center font-mono text-3xl mb-4">?</div>
          <h3 class="font-mono text-xl font-bold text-[#161310]">暂无相关文章</h3>
          <p class="font-mono text-sm text-[#3a332a] mt-1">试试选择其他分类</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.book {
  position: relative;
  width: 220px;
  height: 300px;
  background-color: #fffaef;
  border: 3px solid #161310;
  box-shadow: 6px 6px 0 0 #161310;
  -webkit-transform: preserve-3d;
  -ms-transform: preserve-3d;
  transform: preserve-3d;
  -webkit-perspective: 2000px;
  perspective: 2000px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  color: #161310;
  cursor: pointer;
  padding: 20px;
  text-align: center;
  /* Pixel grid pattern on book body */
  background-image:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 20px,
      rgba(22, 19, 16, 0.03) 20px,
      rgba(22, 19, 16, 0.03) 21px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 20px,
      rgba(22, 19, 16, 0.03) 20px,
      rgba(22, 19, 16, 0.03) 21px
    ),
    linear-gradient(to bottom, #fffaef, #f5f0e8);
}

.book p {
  font-family: "VT323", ui-monospace, monospace;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.5;
  word-break: break-word;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 8;
  -webkit-box-orient: vertical;
  position: relative;
  z-index: 0;
  pointer-events: none;
}

.cover {
  top: 0;
  position: absolute;
  background-color: #fffaef;
  width: 100%;
  height: 100%;
  cursor: pointer;
  -webkit-transition: all 0.5s;
  transition: all 0.5s;
  -webkit-transform-origin: 0;
  -ms-transform-origin: 0;
  transform-origin: 0;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  padding: 20px;
  text-align: center;
  z-index: 2;
  /* Same pixel clip */
  clip-path: polygon(
    0 0,
    calc(100% - 8px) 0,
    100% 8px,
    100% 100%,
    8px 100%,
    0 calc(100% - 8px)
  );
  /* Cover decorative border - pixel inner frame */
  border: 3px solid #161310;
  background: #fffaef;
}

.cover::before {
  content: '';
  position: absolute;
  top: 14px;
  left: 14px;
  right: 14px;
  bottom: 14px;
  border: 2px solid #161310;
  pointer-events: none;
  opacity: 0.3;
  clip-path: polygon(
    0 0,
    calc(100% - 4px) 0,
    100% 4px,
    100% 100%,
    4px 100%,
    0 calc(100% - 4px)
  );
}

/* Pixel art bookmark hanging from bottom */
.cover::after {
  content: '';
  position: absolute;
  bottom: -12px;
  right: 20px;
  width: 12px;
  height: 16px;
  background-color: #e2522e;
  border: 2px solid #161310;
  clip-path: polygon(
    0 0,
    100% 0,
    100% calc(100% - 4px),
    50% 100%,
    0 calc(100% - 4px)
  );
  z-index: 5;
}

.cover p {
  font-family: "Pixelify Sans", ui-monospace, monospace;
  font-size: 20px;
  font-weight: 700;
  -webkit-line-clamp: 6;
  color: #161310;
  position: relative;
  z-index: 2;
  text-shadow: 1px 1px 0 rgba(0,0,0,0.08);
}

.book:hover .cover {
  -webkit-transition: all 0.5s;
  transition: all 0.5s;
  -webkit-transform: rotateY(-120deg);
  -ms-transform: rotateY(-120deg);
  transform: rotateY(-120deg);
}
</style>
