<script setup lang="ts">
import ScrollReveal from '@/components/ScrollReveal.vue'
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { articleDetails, articles } from '@/data/contents.js'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const route = useRoute()
const router = useRouter()

const article = computed(() => articleDetails[route.params.id as string])

const articleIndex = computed(() => {
  if (!article.value) return -1
  return articles.findIndex(a => a.id === article.value.id)
})

const prevArticle = computed(() => {
  if (articleIndex.value <= 0) return null
  return articles[articleIndex.value - 1]
})

const nextArticle = computed(() => {
  if (articleIndex.value === -1 || articleIndex.value >= articles.length - 1) return null
  return articles[articleIndex.value + 1]
})

const articleMeta = computed(() => {
  if (!article.value) return null
  return articles.find(a => a.id === article.value.id)
})

function goBack() {
  router.push('/archive')
}

function goToArticle(id: number) {
  router.push(`/article/${id}`)
}
</script>

<template>
  <div class="min-h-[100dvh] bg-[#f5f0e8] pt-24 pb-20" v-if="article">
    <div class="max-w-[760px] mx-auto px-6 sm:px-10">
      <button
        class="font-mono text-sm tracking-wider uppercase px-4 py-2 border-2 border-[#161310] bg-[#fffaef] text-[#161310] shadow-[4px_4px_0_0_#161310] transition-all duration-200 hover:-translate-y-0.5 hover:translate-x-0.5 mb-8"
        @click="goBack"
      >
        ← 返回归档
      </button>

      <ScrollReveal>
      <article>
        <header class="mb-10">
          <div class="flex items-center gap-3 mb-4 flex-wrap">
            <span class="font-mono text-xs tracking-wider uppercase px-3 py-1 bg-[#161310] text-[#fffaef]">{{ article.category }}</span>
            <span class="font-mono text-xs text-[#3a332a] flex items-center gap-1">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              {{ article.date }}
            </span>
            <template v-if="articleMeta">
              <span class="font-mono text-xs text-[#3a332a] flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ articleMeta.readingTime }}
              </span>
              <span class="font-mono text-xs text-[#3a332a] flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {{ articleMeta.words }} 字
              </span>
            </template>
          </div>
          <h1 class="font-mono text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#161310] leading-[1.2]">
            {{ article.title }}
          </h1>
          <template v-if="articleMeta && articleMeta.tags && articleMeta.tags.length">
            <div class="mt-6 flex flex-wrap gap-2">
              <span v-for="tag in articleMeta.tags" :key="tag" class="font-mono text-xs border-2 border-[#161310] px-3 py-1 bg-[#f2ead6] text-[#161310]">
                # {{ tag }}
              </span>
            </div>
          </template>
        </header>

        <div class="h-px w-full bg-gradient-to-r from-transparent via-[#d9cdb3] to-transparent my-8" />

        <div class="prose-custom" v-html="article.content" />
      </article>
      </ScrollReveal>

      <ScrollReveal>
      <div class="mt-16">
        <div class="h-px w-full bg-gradient-to-r from-transparent via-[#d9cdb3] to-transparent mb-10" />

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <template v-if="prevArticle">
            <div class="cursor-pointer bg-[#fffaef] border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] transition-all duration-200 hover:-translate-y-0.5 group" @click="goToArticle(prevArticle.id)">
              <div class="p-5">
                <div class="flex items-center gap-2 font-mono text-xs text-[#3a332a] mb-2">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                  上一篇
                </div>
                <p class="font-mono text-sm font-bold text-[#161310] line-clamp-2">
                  {{ prevArticle.title }}
                </p>
              </div>
            </div>
          </template>
          <div v-else></div>

          <template v-if="nextArticle">
            <div class="cursor-pointer bg-[#fffaef] border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] transition-all duration-200 hover:-translate-y-0.5 group" @click="goToArticle(nextArticle.id)">
              <div class="p-5 text-right">
                <div class="flex items-center justify-end gap-2 font-mono text-xs text-[#3a332a] mb-2">
                  下一篇
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
                <p class="font-mono text-sm font-bold text-[#161310] line-clamp-2">
                  {{ nextArticle.title }}
                </p>
              </div>
            </div>
          </template>
        </div>

        <div class="mt-10 flex justify-center">
          <button
            class="font-mono text-sm tracking-wider uppercase px-4 py-2 border-2 border-[#161310] bg-[#fffaef] text-[#161310] shadow-[4px_4px_0_0_#161310] transition-all duration-200 hover:-translate-y-0.5 hover:translate-x-0.5"
            @click="goBack"
          >
            ← 查看全部文章
          </button>
        </div>
      </div>
      </ScrollReveal>
    </div>
  </div>

  <div v-else class="min-h-[100dvh] bg-[#f5f0e8] pt-24 pb-20 flex items-center justify-center px-6">
    <div class="text-center max-w-md">
      <div class="w-20 h-20 bg-[#fffaef] border-2 border-[#161310] shadow-[8px_8px_0_0_#161310] flex items-center justify-center font-mono text-3xl mx-auto mb-6">?</div>
      <h1 class="font-mono text-2xl font-bold text-[#161310] mb-2">文章未找到</h1>
      <p class="font-mono text-sm text-[#3a332a] mb-6">
        抱歉，您访问的文章不存在或已被移除。
      </p>
      <button
        class="font-mono text-sm tracking-wider uppercase px-4 py-2 border-2 border-[#161310] bg-[#fffaef] text-[#161310] shadow-[4px_4px_0_0_#161310] transition-all duration-200 hover:-translate-y-0.5 hover:translate-x-0.5"
        @click="goBack"
      >
        ← 返回归档
      </button>
    </div>
  </div>
</template>

<style scoped>
.prose-custom {
  font-size: 1rem;
  line-height: 1.8;
  color: #161310;
}
.prose-custom :deep(p) {
  margin-bottom: 1.25rem;
}
.prose-custom :deep(h2) {
  font-family: "Pixelify Sans", ui-monospace, monospace;
  font-size: 1.5rem;
  font-weight: 700;
  color: #161310 !important;
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #d9cdb3;
  position: relative;
}
.prose-custom :deep(h2)::before {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 40px;
  height: 2px;
  background: #161310;
}
.prose-custom :deep(h3) {
  font-family: "Pixelify Sans", ui-monospace, monospace;
  font-size: 1.2rem;
  font-weight: 600;
  color: #161310 !important;
  margin-top: 1.75rem;
  margin-bottom: 0.75rem;
}
.prose-custom :deep(ul) {
  padding-left: 1.5rem;
  margin-bottom: 1.25rem;
  list-style: none;
}
.prose-custom :deep(ul li) {
  margin-bottom: 0.6rem;
  position: relative;
  color: #161310;
}
.prose-custom :deep(ul li)::before {
  content: '';
  position: absolute;
  left: -1.25rem;
  top: 0.7rem;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #161310;
}
.prose-custom :deep(strong) {
  color: #161310;
  font-weight: 600;
}
.prose-custom :deep(code) {
  background: #f2ead6;
  color: #161310;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.875em;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  border: 1px solid #d9cdb3;
}
.prose-custom :deep(pre) {
  background: #fffaef;
  border: 2px solid #d9cdb3;
  border-radius: 8px;
  padding: 1.25rem;
  margin-bottom: 1.25rem;
  overflow-x: auto;
}
.prose-custom :deep(pre code) {
  background: transparent;
  padding: 0;
  color: #161310;
  font-size: 0.875rem;
  line-height: 1.7;
  border: none;
}
.prose-custom :deep(blockquote) {
  border-left: 3px solid #161310;
  padding-left: 1.25rem;
  margin: 1.5rem 0;
  color: #3a332a;
  font-style: italic;
  background: #f2ead6;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  padding-right: 1rem;
  border-radius: 0 8px 8px 0;
}
.prose-custom :deep(a) {
  color: #2e5dd6;
  text-decoration: none;
  border-bottom: 2px solid transparent;
  transition: border-color 0.2s;
  font-weight: 600;
}
.prose-custom :deep(a):hover {
  border-bottom-color: #2e5dd6;
}
.prose-custom :deep(ol) {
  padding-left: 1.5rem;
  margin-bottom: 1.25rem;
}
.prose-custom :deep(ol li) {
  margin-bottom: 0.6rem;
  color: #161310;
}
.prose-custom :deep(img) {
  max-width: 100%;
  border-radius: 8px;
  border: 2px solid #d9cdb3;
  margin: 1.5rem 0;
}
.prose-custom :deep(hr) {
  border: none;
  border-top: 2px dotted #d9cdb3;
  margin: 2rem 0;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
