<script setup lang="ts">
import ScrollReveal from '@/components/ScrollReveal.vue'
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { articleDetails } from '@/data/contents.js'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const route = useRoute()
const router = useRouter()

const article = computed(() => articleDetails[route.params.id as string])

function goBack() {
  router.push('/archive')
}
</script>

<template>
  <div class="min-h-[100dvh] bg-background pt-24 pb-20" v-if="article">
    <div class="max-w-[720px] mx-auto px-6 sm:px-10">
      <!-- Back -->
      <Button variant="ghost" size="sm" class="mb-8 gap-1.5" @click="goBack">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        返回归档
      </Button>

      <ScrollReveal>
      <article>
        <Badge variant="secondary" class="mb-4">{{ article.category }} · {{ article.date }}</Badge>
        <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-[1.15]">{{ article.title }}</h1>

        <div class="mt-10 prose-custom" v-html="article.content" />
      </article>
      </ScrollReveal>
    </div>
  </div>

  <!-- Not found -->
  <div v-else class="min-h-[100dvh] bg-background pt-24 pb-20 flex items-center justify-center">
    <div class="text-center">
      <p class="text-6xl mb-4">🔍</p>
      <h1 class="text-2xl font-bold text-foreground">文章未找到</h1>
      <Button variant="link" class="mt-4" @click="goBack">返回归档</Button>
    </div>
  </div>
</template>

<style scoped>
.prose-custom {
  font-size: 1rem;
  line-height: 1.8;
  color: hsl(var(--muted-foreground));
}
.prose-custom p { margin-bottom: 1.25rem; }
.prose-custom h2 {
  font-size: 1.35rem;
  font-weight: 700;
  color: hsl(var(--foreground));
  margin-top: 2rem;
  margin-bottom: 0.75rem;
}
.prose-custom ul { padding-left: 1.5rem; margin-bottom: 1.25rem; }
.prose-custom li { margin-bottom: 0.5rem; }
.prose-custom strong { color: hsl(var(--foreground)); font-weight: 600; }
</style>
