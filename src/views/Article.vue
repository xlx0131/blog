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
  <div class="min-h-[100dvh] bg-background pt-24 pb-20" v-if="article">
    <div class="max-w-[760px] mx-auto px-6 sm:px-10">
      <Button variant="ghost" size="sm" class="mb-8 gap-1.5 text-muted-foreground hover:text-foreground" @click="goBack">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        返回归档
      </Button>

      <ScrollReveal>
      <article>
        <header class="mb-10">
          <div class="flex items-center gap-3 mb-4 flex-wrap">
            <Badge variant="secondary" class="text-xs">{{ article.category }}</Badge>
            <span class="text-xs text-muted-foreground flex items-center gap-1">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              {{ article.date }}
            </span>
            <template v-if="articleMeta">
              <span class="text-xs text-muted-foreground flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ articleMeta.readingTime }}
              </span>
              <span class="text-xs text-muted-foreground flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {{ articleMeta.words }} 字
              </span>
            </template>
          </div>
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.2]">
            {{ article.title }}
          </h1>
          <template v-if="articleMeta && articleMeta.tags && articleMeta.tags.length">
            <div class="mt-6 flex flex-wrap gap-2">
              <Badge v-for="tag in articleMeta.tags" :key="tag" variant="outline" class="text-[11px] font-normal text-muted-foreground">
                # {{ tag }}
              </Badge>
            </div>
          </template>
        </header>

        <div class="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent my-8" />

        <div class="prose-custom" v-html="article.content" />
      </article>
      </ScrollReveal>

      <ScrollReveal>
      <div class="mt-16">
        <div class="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <template v-if="prevArticle">
            <Card class="cursor-pointer transition-all duration-300 hover:border-[#34d399] hover:shadow-[0_4px_20px_-8px_rgba(52,211,153,0.12)] group">
              <CardContent class="p-5" @click="goToArticle(prevArticle.id)">
                <div class="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                  上一篇
                </div>
                <p class="text-sm font-medium text-foreground line-clamp-2 group-hover:text-[#34d399] transition-colors">
                  {{ prevArticle.title }}
                </p>
              </CardContent>
            </Card>
          </template>
          <div v-else></div>

          <template v-if="nextArticle">
            <Card class="cursor-pointer transition-all duration-300 hover:border-[#34d399] hover:shadow-[0_4px_20px_-8px_rgba(52,211,153,0.12)] group">
              <CardContent class="p-5 text-right" @click="goToArticle(nextArticle.id)">
                <div class="flex items-center justify-end gap-2 text-xs text-muted-foreground mb-2">
                  下一篇
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
                <p class="text-sm font-medium text-foreground line-clamp-2 group-hover:text-[#34d399] transition-colors">
                  {{ nextArticle.title }}
                </p>
              </CardContent>
            </Card>
          </template>
        </div>

        <div class="mt-10 flex justify-center">
          <Button variant="outline" size="sm" class="gap-2" @click="goBack">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            查看全部文章
          </Button>
        </div>
      </div>
      </ScrollReveal>
    </div>
  </div>

  <div v-else class="min-h-[100dvh] bg-background pt-24 pb-20 flex items-center justify-center px-6">
    <div class="text-center max-w-md">
      <div class="relative inline-flex items-center justify-center mb-8">
        <div class="absolute inset-0 rounded-full bg-[#34d399]/10 blur-2xl scale-150" />
        <div class="relative w-24 h-24 rounded-2xl bg-card border border-border flex items-center justify-center text-5xl">
          🔍
        </div>
      </div>
      <h1 class="text-2xl font-bold text-foreground mb-2">文章未找到</h1>
      <p class="text-sm text-muted-foreground mb-6">
        抱歉，您访问的文章不存在或已被移除。
      </p>
      <Button class="gap-2" @click="goBack">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        返回归档
      </Button>
    </div>
  </div>
</template>

<style scoped>
.prose-custom {
  font-size: 1rem;
  line-height: 1.85;
  color: hsl(var(--muted-foreground));
}
.prose-custom p { margin-bottom: 1.25rem; }
.prose-custom h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: hsl(var(--foreground));
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid hsl(var(--border));
  position: relative;
}
.prose-custom h2::before {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 40px;
  height: 2px;
  background: #34d399;
  border-radius: 2px;
}
.prose-custom h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: hsl(var(--foreground));
  margin-top: 1.75rem;
  margin-bottom: 0.75rem;
}
.prose-custom ul {
  padding-left: 1.5rem;
  margin-bottom: 1.25rem;
  list-style: none;
}
.prose-custom ul li {
  margin-bottom: 0.6rem;
  position: relative;
}
.prose-custom ul li::before {
  content: '';
  position: absolute;
  left: -1.25rem;
  top: 0.7rem;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #34d399;
}
.prose-custom strong {
  color: hsl(var(--foreground));
  font-weight: 600;
}
.prose-custom code {
  background: hsl(var(--muted));
  color: #34d399;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 0.875em;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
}
.prose-custom pre {
  background: hsl(var(--muted) / 0.5);
  border: 1px solid hsl(var(--border));
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1.25rem;
  overflow-x: auto;
}
.prose-custom pre code {
  background: transparent;
  padding: 0;
  color: hsl(var(--muted-foreground));
  font-size: 0.875rem;
  line-height: 1.7;
}
.prose-custom blockquote {
  border-left: 3px solid #34d399;
  padding-left: 1.25rem;
  margin: 1.5rem 0;
  color: hsl(var(--muted-foreground));
  font-style: italic;
  background: hsl(var(--muted) / 0.3);
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  padding-right: 1rem;
  border-radius: 0 8px 8px 0;
}
.prose-custom a {
  color: #34d399;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s;
}
.prose-custom a:hover {
  border-bottom-color: #34d399;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
