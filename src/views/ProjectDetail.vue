<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ScrollReveal from '@/components/ScrollReveal.vue'
import { projectDetails } from '@/data/contents.js'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const route = useRoute()
const router = useRouter()
const id = computed(() => Number(route.params.id))

const project = computed(() => projectDetails[id.value])

function goBack() {
  router.push('/projects')
}

function openUrl(url: string) {
  window.open(url, '_blank', 'noopener noreferrer')
}
</script>

<template>
  <div class="min-h-[100dvh] bg-background pt-24 pb-20" v-if="project">
    <div class="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-20">
      <!-- Back -->
      <Button variant="ghost" size="sm" class="mb-8 gap-1.5" @click="goBack">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        返回项目
      </Button>

      <!-- Hero -->
      <ScrollReveal>
      <div class="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
        <!-- Cover -->
        <div class="w-full lg:w-1/2 aspect-video rounded-2xl bg-gradient-to-br from-emerald-900/10 via-card to-emerald-900/10 border border-border flex items-center justify-center text-8xl relative overflow-hidden">
          <div class="absolute inset-0 opacity-[0.04]" style="background-image: repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(255,255,255,0.03) 19px, rgba(255,255,255,0.03) 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(255,255,255,0.03) 19px, rgba(255,255,255,0.03) 20px);"></div>
          <span class="relative z-10">{{ id === 1 ? '📊' : '🌐' }}</span>
        </div>

        <!-- Info -->
        <div class="w-full lg:w-1/2">
          <div class="flex items-center gap-3 mb-3 flex-wrap">
            <Badge variant="secondary">{{ project.year }}</Badge>
            <span v-for="tag in project.tags" :key="tag" class="text-xs text-muted-foreground">· {{ tag }}</span>
          </div>
          <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">{{ project.title }}</h1>
          <p class="mt-2 text-lg text-muted-foreground">{{ project.subtitle }}</p>

          <a
            v-if="project.url"
            :href="project.url"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button class="mt-6 gap-2">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              查看源码
            </Button>
          </a>

          <div class="mt-6 flex flex-wrap gap-2">
            <Badge v-for="t in project.tech" :key="t" variant="outline">{{ t }}</Badge>
          </div>
        </div>
      </div>
      </ScrollReveal>

      <!-- Highlights -->
      <ScrollReveal>
      <section class="mt-16">
        <h2 class="text-xl font-bold tracking-tight text-foreground mb-6">亮点</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div v-for="h in project.highlights" :key="h" class="border-l-2 border-[#34d399] pl-4 py-1">
            <p class="text-sm text-muted-foreground">{{ h }}</p>
          </div>
        </div>
      </section>
      </ScrollReveal>

      <!-- Details -->
      <ScrollReveal>
      <section class="mt-16 max-w-[65ch]">
        <h2 class="text-xl font-bold tracking-tight text-foreground mb-6">项目介绍</h2>
        <div class="prose-custom" v-html="project.details" />
      </section>
      </ScrollReveal>
    </div>
  </div>

  <!-- Not found -->
  <div v-else class="min-h-[100dvh] bg-background pt-24 pb-20 flex items-center justify-center">
    <div class="text-center">
      <p class="text-6xl mb-4">🔍</p>
      <h1 class="text-2xl font-bold text-foreground">项目未找到</h1>
      <Button variant="link" class="mt-4" @click="goBack">返回项目列表</Button>
    </div>
  </div>
</template>

<style scoped>
.prose-custom {
  font-size: 1rem;
  line-height: 1.75;
  color: hsl(var(--muted-foreground));
}
.prose-custom p { margin-bottom: 1rem; }
.prose-custom h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: hsl(var(--foreground));
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}
.prose-custom ul { padding-left: 1.5rem; margin-bottom: 1rem; }
.prose-custom li { margin-bottom: 0.5rem; }
.prose-custom strong { color: hsl(var(--foreground)); font-weight: 600; }
.prose-custom code {
  background: hsl(var(--muted));
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.9em;
}
</style>
