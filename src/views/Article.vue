<script setup lang="ts">
import ScrollReveal from '@/components/ScrollReveal.vue'
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const articles: Record<string, {
  id: number
  title: string
  date: string
  category: string
  content: string
}> = {
  '1': {
    id: 1,
    title: '从零搭建个人主页：Vue 3 + Vite + Cloudflare Pages 实战记录',
    date: '2026-07-01',
    category: '技术',
    content: `
      <p>这篇文章记录了我使用 Vue 3、Vite、Tailwind CSS 和 GSAP 从零搭建个人主页，并部署到 Cloudflare Pages 的全过程。</p>

      <h2>技术选型</h2>
      <p>选择技术栈时主要考虑了以下几点：</p>
      <ul>
        <li><strong>Vue 3</strong> — 轻量且高效的前端框架，Composition API 让逻辑组织更清晰</li>
        <li><strong>Vite</strong> — 极速的开发服务器和构建工具，原生 ESM 支持</li>
        <li><strong>Tailwind CSS v4</strong> — 最新的 Tailwind 版本，零配置即可使用</li>
        <li><strong>GSAP</strong> — 专业级动画库，ScrollTrigger 插件实现滚动动画</li>
        <li><strong>Cloudflare Pages</strong> — 免费托管，全球 CDN 加速，支持自动部署</li>
      </ul>

      <h2>项目结构</h2>
      <p>采用 SPA 单页应用架构，vue-router 实现客户端路由，所有页面组件延迟加载。</p>
      <p>主要功能模块包括：首页 Hero、项目展示、博客归档、收藏夹、网络运维模拟器和管理后台。</p>

      <h2>动画系统</h2>
      <p>GSAP 是项目的动画核心，配合 ScrollTrigger 实现了丰富的滚动动画效果：</p>
      <ul>
        <li>Hero 区域的文字分割动画</li>
        <li>滚动到视口的渐入动画</li>
        <li>卡片 3D 倾角效果</li>
        <li>磁性按钮和涟漪点击效果</li>
        <li>数字递增动画</li>
      </ul>

      <h2>部署</h2>
      <p>项目使用 Cloudflare Pages 托管。只需将代码推送到 GitHub 仓库，Cloudflare Pages 会自动检测并执行构建命令，将 dist 目录部署到全球 CDN 节点。</p>
      <p>整个过程无需服务器，无需配置域名证书，极致简单。</p>
    `,
  },
  '2': {
    id: 2,
    title: '用户画像分析：从数据清洗到 RFM 模型构建',
    date: '2026-01-15',
    category: '数据分析',
    content: `
      <p>用户画像分析是数据挖掘领域的重要应用。本文分享了我如何基于用户行为数据，使用 Python 和 SQL 进行全链路数据清洗，并利用 RFM 模型构建用户标签体系。</p>

      <h2>项目背景</h2>
      <p>电商平台需要对用户进行精细化运营，而用户画像是实现精准营销的基础。本项目旨在通过分析用户的消费行为数据，为每个用户打上多维度的标签，构建完整的用户画像体系。</p>

      <h2>数据清洗</h2>
      <p>数据清洗是数据分析中最重要也是最耗时的环节。我使用 Pandas + SQL 实现了：</p>
      <ul>
        <li><strong>去重</strong> — 识别并移除重复的用户行为记录</li>
        <li><strong>缺失值填充</strong> — 对关键字段的缺失值进行合理填充</li>
        <li><strong>异常值过滤</strong> — 使用统计方法识别并处理异常数据</li>
        <li><strong>标准化</strong> — 统一数据格式，确保下游分析的一致性</li>
      </ul>

      <h2>RFM 模型</h2>
      <p>RFM 模型是用户价值分析的经典模型：</p>
      <ul>
        <li><strong>R (Recency)</strong> — 最近一次消费时间，越近价值越高</li>
        <li><strong>F (Frequency)</strong> — 消费频率，频率越高忠诚度越高</li>
        <li><strong>M (Monetary)</strong> — 消费金额，金额越高价值越高</li>
      </ul>
      <p>通过对三个维度的评分和加权，将用户分为不同层级，如高价值用户、重点发展用户、流失预警用户等。</p>

      <h2>可视化</h2>
      <p>使用 Matplotlib 生成可视化统计图表，直观展示用户分布、消费趋势和标签统计等信息，便于业务团队理解和决策。</p>
    `,
  },
}

const articleId = computed(() => route.params.id as string)
const article = computed(() => articles[articleId.value])

function goBack() {
  router.push('/archive')
}
</script>

<template>
  <div class="min-h-[100dvh] bg-[#fafafa] pt-24 pb-20" v-if="article">
    <div class="max-w-[720px] mx-auto px-6 sm:px-10">
      <!-- Back -->
      <button
        class="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-emerald-600 transition-colors duration-300 mb-8"
        @click="goBack"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        返回归档
      </button>

      <ScrollReveal>
      <article>
        <span class="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-full px-3 py-1 mb-4">{{ article.category }} · {{ article.date }}</span>
        <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 leading-[1.15]">{{ article.title }}</h1>

        <div class="mt-10 prose-custom" v-html="article.content" />
      </article>
      </ScrollReveal>
    </div>
  </div>

  <!-- Not found -->
  <div v-else class="min-h-[100dvh] bg-[#fafafa] pt-24 pb-20 flex items-center justify-center">
    <div class="text-center">
      <p class="text-6xl mb-4">🔍</p>
      <h1 class="text-2xl font-bold text-neutral-900">文章未找到</h1>
      <button class="mt-4 text-sm text-emerald-600 hover:text-emerald-700" @click="goBack">返回归档</button>
    </div>
  </div>
</template>

<style scoped>
.prose-custom {
  font-size: 1rem;
  line-height: 1.8;
  color: #52525b;
}
.prose-custom p {
  margin-bottom: 1.25rem;
}
.prose-custom h2 {
  font-size: 1.35rem;
  font-weight: 700;
  color: #18181b;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
}
.prose-custom ul {
  padding-left: 1.5rem;
  margin-bottom: 1.25rem;
}
.prose-custom li {
  margin-bottom: 0.5rem;
}
.prose-custom strong {
  color: #18181b;
  font-weight: 600;
}
</style>
