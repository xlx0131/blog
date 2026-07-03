<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ScrollReveal from '@/components/ScrollReveal.vue'
import { projectDetails } from '@/data/contents.js'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

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

const highlights = [
  '全链路数据清洗与质量治理',
  'RFM 模型算法构建用户标签',
  '多源数据去重、缺失值填充与异常值过滤',
  '生成可视化统计图片',
]
</script>

<template>
  <div class="min-h-[100dvh] bg-background pt-24 pb-20" v-if="project">
    <div class="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-20">
      <Button variant="ghost" size="sm" class="mb-8 gap-1.5 hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors" @click="goBack">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        返回项目
      </Button>

      <ScrollReveal>
        <div class="relative">
          <div class="absolute -top-10 -left-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div class="absolute -bottom-10 -right-10 w-64 h-64 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none"></div>

          <div class="relative flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
            <div class="w-full lg:w-1/2">
              <div class="group relative aspect-video rounded-2xl overflow-hidden border border-border/50 bg-gradient-to-br from-emerald-900/20 via-card to-emerald-900/20">
                <div class="absolute inset-0 opacity-[0.06]" style="background-image: repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(255,255,255,0.03) 19px, rgba(255,255,255,0.03) 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(255,255,255,0.03) 19px, rgba(255,255,255,0.03) 20px);"></div>
                <div class="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent opacity-60"></div>
                <div class="absolute inset-0 flex items-center justify-center">
                  <span class="relative z-10 text-8xl sm:text-9xl drop-shadow-2xl">{{ id === 1 ? '📊' : '🌐' }}</span>
                </div>
                <div class="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                    <span class="text-xs text-muted-foreground/80">Project Overview</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="w-full lg:w-1/2 flex flex-col justify-center">
              <div class="flex items-center gap-3 mb-4 flex-wrap">
                <Badge variant="secondary" class="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20">
                  <svg class="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                  {{ project.year }}
                </Badge>
                <span v-for="tag in project.tags" :key="tag" class="text-xs text-muted-foreground">· {{ tag }}</span>
              </div>

              <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight">{{ project.title }}</h1>
              <p class="mt-3 text-lg text-muted-foreground leading-relaxed">{{ project.subtitle }}</p>

              <Separator class="my-6 bg-border/50" />

              <div class="space-y-4">
                <div>
                  <p class="text-xs font-medium text-muted-foreground/70 uppercase tracking-wider mb-2.5">技术栈</p>
                  <div class="flex flex-wrap gap-2">
                    <Badge v-for="t in project.tech" :key="t" variant="outline" class="border-border/60 bg-card/50 text-foreground/90 hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-400 transition-all duration-300">
                      {{ t }}
                    </Badge>
                  </div>
                </div>
              </div>

              <div class="mt-8 flex flex-wrap gap-3">
                <a v-if="project.url" :href="project.url" target="_blank" rel="noopener noreferrer">
                  <Button class="gap-2 bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                    查看源码
                  </Button>
                </a>
                <Button variant="outline" class="gap-2 border-border/60 hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-400 transition-all">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  在线预览
                </Button>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal>
        <section class="mt-20 sm:mt-24">
          <div class="flex items-center gap-3 mb-8">
            <div class="w-1 h-8 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600"></div>
            <h2 class="text-2xl font-bold tracking-tight text-foreground">项目亮点</h2>
            <span class="text-sm text-muted-foreground">Highlights</span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card v-for="(h, index) in project.highlights" :key="h" class="group border-border/50 bg-card/50 backdrop-blur-sm hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5">
              <CardContent class="flex items-start gap-4 p-5">
                <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/40 transition-all duration-300">
                  <span class="text-sm font-bold">{{ String(index + 1).padStart(2, '0') }}</span>
                </div>
                <div class="flex-1 pt-1">
                  <p class="text-sm text-foreground/90 leading-relaxed">{{ h }}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section class="mt-20 sm:mt-24">
          <div class="flex items-center gap-3 mb-8">
            <div class="w-1 h-8 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600"></div>
            <h2 class="text-2xl font-bold tracking-tight text-foreground">项目介绍</h2>
            <span class="text-sm text-muted-foreground">Details</span>
          </div>
          <Card class="border-border/50 bg-card/30 backdrop-blur-sm">
            <CardContent class="p-6 sm:p-8">
              <div class="prose-custom" v-html="project.details" />
            </CardContent>
          </Card>
        </section>
      </ScrollReveal>
    </div>
  </div>

  <div v-else class="min-h-[100dvh] bg-background pt-24 pb-20 flex items-center justify-center px-6">
    <div class="text-center max-w-md">
      <div class="relative mx-auto w-32 h-32 mb-8">
        <div class="absolute inset-0 bg-emerald-500/10 rounded-full blur-2xl animate-pulse"></div>
        <div class="relative w-full h-full rounded-2xl bg-card border border-border/50 flex items-center justify-center">
          <span class="text-5xl">🔍</span>
        </div>
      </div>
      <h1 class="text-2xl font-bold text-foreground mb-2">项目未找到</h1>
      <p class="text-muted-foreground mb-6">抱歉，您访问的项目不存在或已被移除。</p>
      <Button variant="outline" class="gap-2 border-border/60 hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-400 transition-all" @click="goBack">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        返回项目列表
      </Button>
    </div>
  </div>
</template>

<style scoped>
.prose-custom {
  font-size: 1rem;
  line-height: 1.8;
  color: hsl(var(--muted-foreground));
}
.prose-custom p { margin-bottom: 1rem; }
.prose-custom h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: hsl(var(--foreground));
  margin-top: 2rem;
  margin-bottom: 1rem;
  padding-left: 0.75rem;
  border-left: 3px solid hsl(var(--primary) / 0.5);
}
.prose-custom ul { 
  padding-left: 1.5rem; 
  margin-bottom: 1rem; 
  list-style: none;
}
.prose-custom ul li {
  position: relative;
  padding-left: 0.5rem;
  margin-bottom: 0.6rem;
}
.prose-custom ul li::before {
  content: "";
  position: absolute;
  left: -1.25rem;
  top: 0.7rem;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: hsl(var(--primary) / 0.6);
}
.prose-custom strong { color: hsl(var(--foreground)); font-weight: 600; }
.prose-custom code {
  background: hsl(var(--muted));
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.9em;
}
</style>
