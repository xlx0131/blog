<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { initTiltCards } from '@/composables/useInteractions'

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

const projects = ref<Project[]>([
  {
    id: 1,
    title: '用户画像分析系统',
    subtitle: '基于用户行为数据的标签体系构建',
    description:
      '通过对用户行为数据、业务数据进行清洗、建模、分析，构建一套完整的用户标签体系。涵盖全链路数据清洗、RFM 模型分析和可视化展示。',
    url: '/projects/1',
    tags: ['数据分析', '数据挖掘'],
    tech: ['Python', 'SQL', 'Pandas', 'Scikit-learn', 'Matplotlib'],
    cover: 'profile',
    year: '2025 - 2026',
    highlights: [
      '全链路数据清洗与质量治理 (Pandas + SQL)',
      'RFM 模型算法构建用户标签',
      '多源数据去重、缺失值填充与异常过滤',
      '生成可视化统计图片',
    ],
  },
  {
    id: 2,
    title: '个人主页 · SimonAKing',
    subtitle: 'Vue 3 + Vite 全栈个人站点',
    description:
      '基于 Vue 3、Vite、Tailwind CSS 和 GSAP 构建的沉浸式个人主页。包含项目展示、博客归档、收藏夹、网络运维模拟器等多个功能模块。',
    url: 'https://github.com/SimonAKing/HomePage',
    tags: ['全栈开发', 'Web 前端'],
    tech: ['Vue 3', 'Vite', 'TypeScript', 'GSAP', 'Tailwind CSS', 'Cloudflare Pages'],
    cover: 'homepage',
    year: '2026',
    highlights: [
      'GSAP 滚动动画与 ScrollTrigger 交互',
      'Tailwind CSS v4 响应式设计',
      'CLI 网络运维排障模拟器游戏',
      'Cloudflare Pages 自动部署',
    ],
  },
])

function viewProject(id: number) {
  router.push(`/projects/${id}`)
}
</script>

<template>
  <div class="min-h-[100dvh] bg-[#fafafa] pt-24 pb-20">
    <div class="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-20">
      <!-- Header -->
      <div class="animate-fade-up">
        <span class="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 tracking-[0.15em] uppercase">
          <span class="w-6 h-px bg-zinc-300" />
          项目
        </span>
        <h1 class="mt-4 text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
          作品集
        </h1>
        <p class="mt-2 text-base text-neutral-500 max-w-lg">
          亲手打造的项目，从数据到代码。
        </p>
      </div>

      <!-- Project Grid -->
      <div class="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <article
          v-for="project in projects"
          :key="project.id"
          class="group cursor-pointer bg-white rounded-xl border border-neutral-200 overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.12)] tilt-card"
          style="transition-timing-function: cubic-bezier(0.16,1,0.3,1)"
          @click="viewProject(project.id)"
        >
          <!-- Cover -->
          <div class="h-48 bg-gradient-to-br from-emerald-50 via-white to-emerald-100 flex items-center justify-center text-6xl relative overflow-hidden">
            <div class="absolute inset-0 opacity-[0.03]" style="background-image: repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(0,0,0,0.03) 19px, rgba(0,0,0,0.03) 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(0,0,0,0.03) 19px, rgba(0,0,0,0.03) 20px);"></div>
            <span class="relative z-10">{{ project.cover === 'profile' ? '📊' : '🌐' }}</span>
          </div>
          <!-- Body -->
          <div class="p-5">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-xs font-medium text-emerald-700 bg-emerald-50 rounded-full px-2.5 py-0.5">{{ project.year }}</span>
              <span v-for="tag in project.tags" :key="tag" class="text-xs text-neutral-400">· {{ tag }}</span>
            </div>
            <h2 class="text-lg font-bold tracking-tight text-neutral-900 group-hover:text-emerald-600 transition-colors">
              {{ project.title }}
            </h2>
            <p class="mt-1 text-sm text-neutral-500 line-clamp-2">{{ project.subtitle }}</p>
            <div class="mt-3 flex flex-wrap gap-1.5">
              <span v-for="t in project.tech.slice(0, 3)" :key="t" class="text-[11px] font-medium text-neutral-500 bg-neutral-100 rounded-md px-2 py-0.5">
                {{ t }}
              </span>
              <span v-if="project.tech.length > 3" class="text-[11px] text-neutral-400">+{{ project.tech.length - 3 }}</span>
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>
