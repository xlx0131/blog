<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { initTiltCards } from '@/composables/useInteractions'
import { projects as projectsData } from '@/data/contents.js'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { BarChart3, Globe2, Server, Play } from '@lucide/vue'

const router = useRouter()

interface Project {
  id: number
  title: string
  subtitle: string
  description: string
  url: string
  tags: string[]
  tech: string[]
  cover: string
  year: string
  highlights: string[]
}

const projects = ref<Project[]>(projectsData)
const activeTab = ref('all')

const allTechTags = computed(() => {
  const techSet = new Set<string>()
  projects.value.forEach((p) => {
    p.tech.forEach((t) => techSet.add(t))
  })
  return Array.from(techSet)
})

const filteredProjects = computed(() => {
  if (activeTab.value === 'all') return projects.value
  return projects.value.filter((p) => p.tech.includes(activeTab.value))
})

function viewProject(id: number) {
  router.push(`/projects/${id}`)
}

function reInitTilt() {
  nextTick(() => {
    setTimeout(() => initTiltCards(), 50)
  })
}

onMounted(() => {
  reInitTilt()
})
</script>

<template>
  <div class="min-h-[100dvh] bg-background pt-24 pb-20">
    <div class="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-20">
      <!-- Header -->
      <div class="animate-fade-up">
        <Badge variant="outline" class="mb-4 w-fit text-xs tracking-[0.15em]">项目</Badge>
        <h1 class="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">作品集</h1>
        <p class="mt-2 text-base text-muted-foreground max-w-lg">亲手打造的项目，从数据到代码。</p>
      </div>

      <!-- Tabs Filter -->
      <div class="mt-8">
        <Tabs value="all" @update:model-value="(v: string) => { activeTab = v; reInitTilt() }">
          <TabsList class="w-full h-auto flex-wrap gap-1 bg-transparent p-0">
            <TabsTrigger value="all" class="data-active:bg-emerald-500/15 data-active:text-emerald-400 data-active:border-emerald-500/30">
              全部
            </TabsTrigger>
            <TabsTrigger
              v-for="tech in allTechTags"
              :key="tech"
              :value="tech"
              class="data-active:bg-emerald-500/15 data-active:text-emerald-400 data-active:border-emerald-500/30"
            >
              {{ tech }}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <!-- Project Grid -->
      <div class="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          v-for="project in filteredProjects"
          :key="project.id"
          class="group cursor-pointer overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-emerald-500/5 tilt-card border-border/60 bg-card/50 backdrop-blur-sm hover:border-emerald-500/30"
          style="transition-timing-function: cubic-bezier(0.16,1,0.3,1)"
          @click="viewProject(project.id)"
        >
          <!-- Cover -->
          <div class="relative h-52 bg-gradient-to-br from-emerald-900/20 via-card to-emerald-900/10 flex items-center justify-center overflow-hidden">
            <div class="absolute inset-0 opacity-[0.03]" style="background-image: repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(255,255,255,0.03) 19px, rgba(255,255,255,0.03) 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(255,255,255,0.03) 19px, rgba(255,255,255,0.03) 20px);"></div>
            <div class="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60"></div>
            <div
              class="relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl ring-1 transition-all duration-500 group-hover:scale-110 shadow-lg"
              :class="project.cover === 'ops'
                ? 'bg-gradient-to-br from-cyan-500/20 to-blue-600/20 text-cyan-400 ring-cyan-400/30 group-hover:from-cyan-500/30 group-hover:ring-cyan-400/50 shadow-cyan-500/10'
                : 'bg-gradient-to-br from-emerald-500/20 to-teal-500/10 text-emerald-400 ring-emerald-400/30 group-hover:from-emerald-500/30 group-hover:ring-emerald-400/50 shadow-emerald-500/10'"
            >
              <BarChart3 v-if="project.cover === 'profile'" class="h-10 w-10" />
              <Server v-else-if="project.cover === 'ops'" class="h-10 w-10" />
              <Globe2 v-else class="h-10 w-10" />
            </div>
            <div class="absolute top-3 left-3 z-10 flex gap-2">
              <Badge variant="secondary" class="text-[11px] bg-background/80 backdrop-blur-sm border-border/40">
                {{ project.year }}
              </Badge>
              <Badge
                v-if="project.cover === 'ops'"
                class="text-[11px] bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 text-cyan-300 border-cyan-400/30 backdrop-blur-sm flex items-center gap-1"
              >
                <Play class="h-3 w-3" />
                在线体验
              </Badge>
            </div>
          </div>

          <CardHeader class="p-5 pb-0">
            <div class="flex items-center gap-2 mb-2 flex-wrap">
              <span v-for="tag in project.tags" :key="tag" class="text-xs text-muted-foreground">· {{ tag }}</span>
            </div>
            <CardTitle class="text-lg font-bold tracking-tight text-foreground group-hover:text-emerald-400 transition-colors duration-300">
              {{ project.title }}
            </CardTitle>
            <CardDescription class="mt-1 text-sm text-muted-foreground line-clamp-2">
              {{ project.subtitle }}
            </CardDescription>
          </CardHeader>

          <CardContent class="p-5 pt-3">
            <div class="flex flex-wrap gap-1.5">
              <Badge
                v-for="t in project.tech.slice(0, 4)"
                :key="t"
                variant="outline"
                class="text-[11px] font-normal border-border/60 text-muted-foreground"
              >
                {{ t }}
              </Badge>
              <span v-if="project.tech.length > 4" class="text-[11px] text-muted-foreground self-center px-1">+{{ project.tech.length - 4 }}</span>
            </div>
          </CardContent>

          <CardFooter class="p-5 pt-0 flex items-center justify-between">
            <span class="text-xs text-muted-foreground group-hover:text-emerald-400 transition-colors duration-300 flex items-center gap-1">
              查看详情
              <svg class="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </span>
          </CardFooter>
        </Card>
      </div>

      <!-- Empty State -->
      <div v-if="filteredProjects.length === 0" class="mt-16 flex flex-col items-center justify-center py-16 text-center">
        <div class="text-5xl mb-4 opacity-30">🔍</div>
        <h3 class="text-lg font-medium text-foreground">暂无相关项目</h3>
        <p class="mt-1 text-sm text-muted-foreground">试试选择其他技术标签</p>
      </div>
    </div>
  </div>
</template>
