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
  <div class="min-h-[100dvh] bg-[#0d1117] pt-24 pb-20" v-if="article">
    <div class="max-w-[720px] mx-auto px-6 sm:px-10">
      <!-- Back -->
      <button
        class="inline-flex items-center gap-1.5 text-sm text-[#8b949e] hover:text-[#34d399] transition-colors duration-300 mb-8"
        @click="goBack"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        返回归档
      </button>

      <ScrollReveal>
      <article>
        <span class="inline-flex items-center gap-2 text-xs font-semibold text-[#34d399] bg-[#059669]/10 rounded-full px-3 py-1 mb-4">{{ article.category }} · {{ article.date }}</span>
        <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-[#e6edf3] leading-[1.15]">{{ article.title }}</h1>

        <div class="mt-10 prose-custom" v-html="article.content" />
      </article>
      </ScrollReveal>
    </div>
  </div>

  <!-- Not found -->
  <div v-else class="min-h-[100dvh] bg-[#0d1117] pt-24 pb-20 flex items-center justify-center">
    <div class="text-center">
      <p class="text-6xl mb-4">🔍</p>
      <h1 class="text-2xl font-bold text-[#e6edf3]">文章未找到</h1>
      <button class="mt-4 text-sm text-[#34d399] hover:text-[#34d399]/80" @click="goBack">返回归档</button>
    </div>
  </div>
</template>

<style scoped>
.prose-custom {
  font-size: 1rem;
  line-height: 1.8;
  color: #8b949e;
}
.prose-custom p {
  margin-bottom: 1.25rem;
}
.prose-custom h2 {
  font-size: 1.35rem;
  font-weight: 700;
  color: #e6edf3;
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
  color: #e6edf3;
  font-weight: 600;
}
</style>
