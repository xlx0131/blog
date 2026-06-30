<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ScrollReveal from '@/components/ScrollReveal.vue'

const route = useRoute()
const router = useRouter()
const id = computed(() => Number(route.params.id))

const projects: Record<number, {
  title: string
  subtitle: string
  description: string
  url: string
  tags: string[]
  tech: string[]
  year: string
  highlights: string[]
  details: string
}> = {
  1: {
    title: '江彤 · 个人主页',
    subtitle: '交互式个人品牌网站',
    description: '为创作者江彤打造的沉浸式个人品牌站点。',
    url: 'https://jtweb.pages.dev/',
    tags: ['全栈开发', 'UI 设计'],
    tech: ['Vue 3', 'Three.js', 'GSAP', 'Tailwind CSS', 'Cloudflare Pages'],
    year: '2026',
    highlights: [
      '3D 粒子星系交互 (Three.js)',
      '沉浸式画廊空间',
      '响应式设计与动画 (GSAP)',
      'Cloudflare Pages 自动部署',
    ],
    details: `
      <p>这是一个为创作者江彤量身定制的个人品牌网站，旨在通过沉浸式的交互体验展示其作品与个人故事。</p>
      <p>网站采用 Vue 3 + Vite 构建，集成了多种前端技术：</p>
      <ul>
        <li><strong>3D 粒子星系</strong> — 使用 Three.js 构建可交互的星尘粒子系统，用户触摸或拖拽即可与星系互动</li>
        <li><strong>星环画廊</strong> — 沉浸式 3D 图片展览空间，鼠标悬停即可预览详情</li>
        <li><strong>时光漂流瓶</strong> — 一个有趣的情感分享功能，用户可以把心事装进瓶子</li>
        <li><strong>音乐推荐</strong> — 最近在听的歌和值得分享的旋律展示</li>
        <li><strong>小游戏</strong> — 内置 2048 等小游戏增加趣味性</li>
      </ul>
      <p>设计上以深色太空为主题，配合柔和的发光效果和流畅的 GSAP 动画，营造出沉浸式的浏览体验。网站部署在 Cloudflare Pages 上，通过 Git 自动构建部署。</p>
    `,
  },
  2: {
    title: '网络运维模拟器',
    subtitle: '交互式网络排障闯关游戏',
    description: '一个模拟真实网络故障排查场景的交互式游戏。',
    url: '/network-game',
    tags: ['前端开发', '游戏化学习'],
    tech: ['Vue 3', 'SVG', 'GSAP', 'Tailwind CSS'],
    year: '2026',
    highlights: [
      '6 个实战关卡（物理层→网络层→应用层）',
      '可视化 SVG 网络拓扑图',
      '终端命令模拟器',
      '详细复盘与最优路径分析',
    ],
    details: `
      <p>网络运维模拟器是一个交互式闯关游戏，旨在帮助网络运维新手通过实战场景学习故障排查技能。</p>
      <p>游戏特色：</p>
      <ul>
        <li><strong>真实场景还原</strong> — 从最简单的网线松动到 VLAN 配置错误，每个关卡都基于真实运维案例设计</li>
        <li><strong>可视化拓扑</strong> — 使用 SVG 绘制的网络拓扑图，设备状态、链路连接一目了然</li>
        <li><strong>终端模拟</strong> — 内置终端模拟器，支持 ping、ipconfig、tracert、nslookup 等多种排查命令</li>
        <li><strong>诊断修复</strong> — 发现问题后定位故障原因并执行修复操作</li>
        <li><strong>复盘机制</strong> — 每关结束后详细解释每一步的原理和更优的排查路径</li>
      </ul>
      <p>适合网络运维新手、IT 支持人员以及对网络技术感兴趣的学习者。</p>
    `,
  },
}

const project = computed(() => projects[id.value])

function goBack() {
  router.push('/projects')
}

function openUrl(url: string) {
  window.open(url, '_blank', 'noopener noreferrer')
}
</script>

<template>
  <div class="min-h-[100dvh] bg-[#fafafa] pt-24 pb-20" v-if="project">
    <div class="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-20">
      <!-- Back -->
      <button
        class="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-emerald-600 transition-colors duration-300 mb-8"
        @click="goBack"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        返回项目
      </button>

      <!-- Hero -->
      <ScrollReveal>
      <div class="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
        <!-- Left: cover -->
        <div class="w-full lg:w-1/2 aspect-video rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-emerald-100 border border-neutral-200 flex items-center justify-center text-8xl relative overflow-hidden">
          <div class="absolute inset-0 opacity-[0.04]" style="background-image: repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(0,0,0,0.03) 19px, rgba(0,0,0,0.03) 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(0,0,0,0.03) 19px, rgba(0,0,0,0.03) 20px);"></div>
          <span class="relative z-10">🌐</span>
        </div>

        <!-- Right: info -->
        <div class="w-full lg:w-1/2">
          <div class="flex items-center gap-3 mb-3">
            <span class="text-xs font-medium text-emerald-700 bg-emerald-50 rounded-full px-2.5 py-0.5">{{ project.year }}</span>
            <span v-for="tag in project.tags" :key="tag" class="text-xs text-neutral-400">· {{ tag }}</span>
          </div>
          <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">{{ project.title }}</h1>
          <p class="mt-2 text-lg text-neutral-500">{{ project.subtitle }}</p>

          <!-- Direct link -->
          <RouterLink
            v-if="project.url.startsWith('/')"
            :to="project.url"
            class="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-all duration-300 magnetic-btn ripple-btn"
            style="transition-timing-function: cubic-bezier(0.16,1,0.3,1)"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
            进入游戏
          </RouterLink>
          <a
            v-else
            :href="project.url"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-all duration-300 magnetic-btn ripple-btn"
            style="transition-timing-function: cubic-bezier(0.16,1,0.3,1)"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
            访问项目
          </a>

          <!-- Tech tags -->
          <div class="mt-6 flex flex-wrap gap-2">
            <span v-for="t in project.tech" :key="t" class="text-xs font-medium text-neutral-600 bg-neutral-100 rounded-full px-3 py-1">{{ t }}</span>
          </div>
        </div>
      </div>
      </ScrollReveal>

      <!-- Highlights -->
      <ScrollReveal>
      <section class="mt-16">
        <h2 class="text-xl font-bold tracking-tight text-neutral-900 mb-6">亮点</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div v-for="h in project.highlights" :key="h" class="border-l-2 border-emerald-500 pl-4 py-1">
            <p class="text-sm text-neutral-700">{{ h }}</p>
          </div>
        </div>
      </section>
      </ScrollReveal>

      <!-- Details -->
      <ScrollReveal>
      <section class="mt-16 max-w-[65ch]">
        <h2 class="text-xl font-bold tracking-tight text-neutral-900 mb-6">项目介绍</h2>
        <div class="prose-custom" v-html="project.details" />
      </section>
      </ScrollReveal>

      <!-- CTA link -->
      <ScrollReveal>
      <div class="mt-16 border-t border-neutral-200 pt-10 text-center">
        <p class="text-sm text-neutral-500 mb-4">查看在线效果</p>
        <a
          :href="project.url"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition-all duration-300 ripple-btn magnetic-btn"
          style="transition-timing-function: cubic-bezier(0.16,1,0.3,1)"
        >
          访问 {{ project.title }}
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
        </a>
      </div>
      </ScrollReveal>
    </div>
  </div>

  <!-- Not found -->
  <div v-else class="min-h-[100dvh] bg-[#fafafa] pt-24 pb-20 flex items-center justify-center">
    <div class="text-center">
      <p class="text-6xl mb-4">🔍</p>
      <h1 class="text-2xl font-bold text-neutral-900">项目未找到</h1>
      <button class="mt-4 text-sm text-emerald-600 hover:text-emerald-700" @click="goBack">返回项目列表</button>
    </div>
  </div>
</template>

<style scoped>
.prose-custom {
  font-size: 1rem;
  line-height: 1.75;
  color: #52525b;
}
.prose-custom p {
  margin-bottom: 1rem;
}
.prose-custom ul {
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}
.prose-custom li {
  margin-bottom: 0.5rem;
}
.prose-custom strong {
  color: #18181b;
  font-weight: 600;
}
</style>
