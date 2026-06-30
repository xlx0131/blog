<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

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

const projects = ref<Project[]>([
  {
    id: 1,
    title: '江彤 · 个人主页',
    subtitle: '交互式个人品牌网站',
    description:
      '为创作者江彤打造的沉浸式个人品牌站点。融合了 3D 粒子星系、交互式画廊、音乐推荐、漂流瓶、小游戏等多个模块，以独特的视觉语言呈现个人作品与故事。',
    url: 'https://jtweb.pages.dev/',
    tags: ['全栈开发', 'UI 设计'],
    tech: ['Vue 3', 'Three.js', 'GSAP', 'Tailwind CSS', 'Cloudflare Pages'],
    cover: 'jtweb',
    year: '2026',
    highlights: [
      '3D 粒子星系交互 (Three.js)',
      '沉浸式画廊空间',
      '响应式设计与动画 (GSAP)',
      'Cloudflare Pages 自动部署',
    ],
  },
  {
    id: 2,
    title: '网络运维模拟器',
    subtitle: '交互式网络排障闯关游戏',
    description:
      '一个模拟真实网络故障排查场景的交互式游戏。从网线松动到 VLAN 配置错误，每个关卡都配有可视化的网络拓扑图、终端模拟器和详细的复盘解释。适合网络运维新手学习。',
    url: '/network-game',
    tags: ['前端开发', '游戏化学习'],
    tech: ['Vue 3', 'SVG', 'GSAP', 'Tailwind CSS'],
    cover: 'network',
    year: '2026',
    highlights: [
      '6 个实战关卡（物理层→网络层→应用层）',
      '可视化 SVG 网络拓扑',
      '终端命令模拟器',
      '详细复盘与最优路径分析',
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
          一些亲手打造的项目，从设计到开发。
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
            <span class="relative z-10">🌐</span>
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
