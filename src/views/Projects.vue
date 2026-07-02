<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { initTiltCards } from '@/composables/useInteractions'
import { projects as projectsData } from '@/data/contents.js'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const router = useRouter()

onMounted(() => {
  setTimeout(() => initTiltCards(), 100)
})

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

function viewProject(id: number) {
  router.push(`/projects/${id}`)
}
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

      <!-- Project Grid -->
      <div class="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          v-for="project in projects"
          :key="project.id"
          class="group cursor-pointer overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-lg tilt-card"
          style="transition-timing-function: cubic-bezier(0.16,1,0.3,1)"
          @click="viewProject(project.id)"
        >
          <!-- Cover -->
          <div class="h-48 bg-gradient-to-br from-emerald-900/20 via-card to-emerald-900/20 flex items-center justify-center text-6xl relative overflow-hidden">
            <div class="absolute inset-0 opacity-[0.03]" style="background-image: repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(255,255,255,0.03) 19px, rgba(255,255,255,0.03) 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(255,255,255,0.03) 19px, rgba(255,255,255,0.03) 20px);"></div>
            <span class="relative z-10">{{ project.cover === 'profile' ? '📊' : '🌐' }}</span>
          </div>
          <CardContent class="p-5">
            <div class="flex items-center gap-2 mb-2 flex-wrap">
              <Badge variant="secondary" class="text-[11px]">{{ project.year }}</Badge>
              <span v-for="tag in project.tags" :key="tag" class="text-xs text-muted-foreground">· {{ tag }}</span>
            </div>
            <h2 class="text-lg font-bold tracking-tight text-foreground group-hover:text-[#34d399] transition-colors">
              {{ project.title }}
            </h2>
            <p class="mt-1 text-sm text-muted-foreground line-clamp-2">{{ project.subtitle }}</p>
            <div class="mt-3 flex flex-wrap gap-1.5">
              <Badge v-for="t in project.tech.slice(0, 3)" :key="t" variant="outline" class="text-[11px] font-normal">
                {{ t }}
              </Badge>
              <span v-if="project.tech.length > 3" class="text-xs text-muted-foreground">+{{ project.tech.length - 3 }}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
