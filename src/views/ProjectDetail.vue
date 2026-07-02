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
    title: '用户画像分析系统',
    subtitle: '基于用户行为数据的标签体系构建',
    description: '通过对用户行为数据、业务数据进行清洗、建模、分析，构建一套完整的用户标签体系。',
    url: '',
    tags: ['数据分析', '数据挖掘'],
    tech: ['Python', 'SQL', 'Pandas', 'Scikit-learn', 'Matplotlib'],
    year: '2025.12 - 2026.01',
    highlights: [
      '全链路数据清洗与质量治理',
      'RFM 模型算法构建用户标签',
      '多源数据去重、缺失值填充与异常值过滤',
      '生成可视化统计图片',
    ],
    details: `
      <p>通过对用户行为数据、业务数据进行清洗、建模、分析，构建一套完整的用户标签体系。</p>
      <h3>主要技术</h3>
      <ul>
        <li><strong>SQL</strong> — 多源数据查询与整合</li>
        <li><strong>Python (Pandas)</strong> — 数据清洗与预处理</li>
        <li><strong>聚类算法</strong> — 用户分群与标签构建</li>
        <li><strong>数据可视化</strong> — 统计图表生成</li>
      </ul>
      <h3>项目分工</h3>
      <ul>
        <li>数据来源与数据采集</li>
        <li>数据清洗与预处理</li>
        <li>利用 RFM 模型算法对用户构建标签</li>
        <li>生成可视化统计图片</li>
      </ul>
      <h3>核心职责</h3>
      <ul>
        <li>负责全链路数据清洗与质量治理，使用 Pandas + SQL 实现多源数据（用户行为、业务日志、交易数据）的去重、缺失值填充与异常值过滤，构建标准化数据清洗流程，保障下游分析与建模数据准确性。</li>
        <li>采用规则校验 + 统计检测相结合的方式，识别并处理重复数据、格式错误、逻辑异常等问题，结合自定义清洗脚本，将数据质量合格率提升，减少因脏数据导致的分析偏差。</li>
      </ul>
    `,
  },
  2: {
    title: '个人主页 · SimonAKing',
    subtitle: 'Vue 3 + Vite 全栈个人站点',
    description: '基于 Vue 3、Vite、Tailwind CSS 和 GSAP 构建的沉浸式个人主页。',
    url: 'https://github.com/SimonAKing/HomePage',
    tags: ['全栈开发', 'Web 前端'],
    tech: ['Vue 3', 'Vite', 'TypeScript', 'GSAP', 'Tailwind CSS', 'Cloudflare Pages'],
    year: '2026',
    highlights: [
      'GSAP 滚动动画与 ScrollTrigger 交互',
      'Tailwind CSS v4 响应式设计',
      'CLI 网络运维排障模拟器游戏',
      'Cloudflare Pages 自动部署',
    ],
    details: `
      <p>一个功能丰富的个人品牌站点，融合了项目展示、博客归档、收藏夹管理、网络运维模拟器等多个功能模块。</p>
      <h3>技术亮点</h3>
      <ul>
        <li><strong>Vue 3 + Composition API</strong> — 采用 <code>&lt;script setup&gt;</code> 语法，以组合式 API 组织逻辑</li>
        <li><strong>GSAP + ScrollTrigger</strong> — 实现丰富的滚动动画、文本分割特效、视差滚动和 count-up 效果</li>
        <li><strong>Tailwind CSS v4</strong> — 最新的 Tailwind 版本，配合自定义设计令牌和 CSS 自定义属性</li>
        <li><strong>自定义交互</strong> — 磁性按钮、3D 倾角卡片、涟漪点击、鼠标跟随光点、滚动进度条等</li>
        <li><strong>网络运维排障游戏</strong> — 内置 CLI 模拟器游戏，覆盖物理层到安全策略的故障排查</li>
      </ul>
      <h3>部署</h3>
      <p>使用 Cloudflare Pages 托管，通过 Git 自动构建部署。支持 Cloudflare D1 数据库作为后端存储。</p>
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
          <span class="relative z-10">{{ id === 1 ? '📊' : '🌐' }}</span>
        </div>

        <!-- Right: info -->
        <div class="w-full lg:w-1/2">
          <div class="flex items-center gap-3 mb-3">
            <span class="text-xs font-medium text-emerald-700 bg-emerald-50 rounded-full px-2.5 py-0.5">{{ project.year }}</span>
            <span v-for="tag in project.tags" :key="tag" class="text-xs text-neutral-400">· {{ tag }}</span>
          </div>
          <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">{{ project.title }}</h1>
          <p class="mt-2 text-lg text-neutral-500">{{ project.subtitle }}</p>

          <!-- External link -->
          <a
            v-if="project.url"
            :href="project.url"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-all duration-300 magnetic-btn ripple-btn"
            style="transition-timing-function: cubic-bezier(0.16,1,0.3,1)"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
            查看源码
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
.prose-custom h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #18181b;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
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
.prose-custom code {
  background: #f1f5f9;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.9em;
}
</style>
