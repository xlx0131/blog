<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { RouterLink } from 'vue-router'
import {
  PhArrowRight,
  PhRss,
  PhCaretRight,
} from '@phosphor-icons/vue'
import ScrollReveal from '@/components/ScrollReveal.vue'
import ParallaxHero from '@/components/ParallaxHero.vue'

const router = useRouter()

function openAgent() {
  // @ts-ignore
  const agent = window.pageAgent
  if (agent && agent.panel) {
    // 检查面板是否还在 DOM 中（可能被关闭按钮销毁了）
    // @ts-ignore
    if (agent.panel.wrapper && document.body.contains(agent.panel.wrapper)) {
      agent.panel.show()
      return
    }
    // 面板已销毁，清空引用以便重新创建
    // @ts-ignore
    window.pageAgent = null
  }

  // @ts-ignore
  const PageAgentClass = window.PageAgent
  if (!PageAgentClass) return

  // @ts-ignore
  window.pageAgent = new PageAgentClass({
    language: 'zh-CN',
    model: 'qwen3.5-plus',
    baseURL: 'https://page-ag-testing-ohftxirgbn.cn-shanghai.fcapp.run',
    apiKey: 'NA',
  })

  setTimeout(() => {
    // @ts-ignore
    window.pageAgent?.panel?.show?.()
  }, 100)
}

interface Post {
  title: string
  date: string
  category: string
  excerpt: string
  slug: string
  delay: number
}

const recentPosts = ref<Post[]>([
  {
    title: '分布式系统中的反馈循环架构',
    date: '2025-04-12',
    category: '工程',
    excerpt:
      '探索反馈模式如何在微服务中体现，以及理解这些模式如何改变你设计 API 的方式。',
    slug: '/article/1',
    delay: 1,
  },
  {
    title: '用 Vue 3 重写作品集学到的经验',
    date: '2025-03-28',
    category: '前端',
    excerpt:
      '一次坦诚的迁移回顾——好的、痛苦的，以及那些意外浮现的优雅模式。',
    slug: '/article/2',
    delay: 2,
  },
  {
    title: '为生产环境设计无障碍色彩系统',
    date: '2025-03-10',
    category: '设计',
    excerpt:
      '构建对所有人都适用的色彩调色板的实用技巧，同时不牺牲视觉吸引力。',
    slug: '/article/3',
    delay: 3,
  },
  {
    title: '软件工艺的短暂之美',
    date: '2025-02-22',
    category: '随笔',
    excerpt:
      '为什么你今天写的最佳代码明天可能就过时了，以及为什么这是一件值得庆祝而非恐惧的事。',
    slug: '/article/4',
    delay: 4,
  },
])

const featured = [
  {
    title: '从零构建组件库',
    description:
      '深入探讨创建生产级设计系统过程中的决策、权衡和经验教训。',
    slug: '/article/5',
  },
  {
    title: '错误信息的隐形艺术',
    description:
      '周到的错误沟通如何改变用户体验并减少支持负担。',
    slug: '/article/6',
  },
]
</script>

<template>
  <div>
    <!-- ═══════════════════════════════════════════════════════
    HERO — Split Screen (50/50)
    ════════════════════════════════════════════════════════ -->
    <ParallaxHero>
      <section
        class="min-h-[100dvh] flex items-center hero-gradient hero-section"
        aria-label="Hero"
      >
        <!-- 浮动粒子 -->
        <div id="hero-particles" class="absolute inset-0 overflow-hidden" aria-hidden="true" />

        <!-- Content -->
        <div
          class="flex flex-col justify-center px-6 sm:px-10 lg:px-20 py-20 lg:py-0 w-full hero-content hero-subtitle"
        >
          <div class="max-w-[1400px] mx-auto w-full">
            <div class="max-w-[65ch]">
              <!-- Eyebrow -->
              <div
                class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-xs font-medium text-zinc-600 tracking-wide uppercase mb-6 animate-fade-up"
              >
                <PhRss :size="14" weight="duotone" class="text-emerald-600" />
                博客
              </div>

              <!-- Heading -->
              <h1
                class="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-zinc-900 leading-[1.05] mb-6 animate-fade-up hero-title"
              >
                记录
                <span class="gradient-text">代码、设计</span>
                <br />与生活
              </h1>

              <!-- Subtitle -->
              <p
                class="text-base sm:text-lg text-zinc-500 leading-relaxed max-w-[50ch] mb-10 animate-fade-up"
              >
                关于软件工程、产品设计和创作过程的思考。由许立鑫撰写。
              </p>

              <!-- CTAs -->
              <div class="flex flex-wrap gap-4 animate-fade-up">
                <RouterLink
                  to="/archive"
                  class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-all duration-300 magnetic-btn hero-cta"
                  style="transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1)"
                >
                  浏览文章
                  <PhArrowRight :size="16" weight="bold" />
                </RouterLink>
                <RouterLink
                  to="/about"
                  class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-100 text-zinc-700 text-sm font-medium hover:bg-zinc-200 transition-all duration-300 btn-tactile"
                  style="transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1)"
                >
                  关于我
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </ParallaxHero>

    <!-- ═══════════════════════════════════════════════════════
    RECENT POSTS — Border-grouped list
    ════════════════════════════════════════════════════════ -->
    <ScrollReveal>
      <section
        class="reveal-up max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-20 py-24 lg:py-32"
        aria-label="Recent posts"
      >
        <!-- Section Eyebrow -->
        <div class="mb-16 animate-fade-up">
          <span
            class="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 tracking-[0.15em] uppercase"
          >
            <span class="w-6 h-px bg-zinc-300" />
            最新
          </span>
        </div>

        <!-- Grouped Posts -->
        <div class="border-t border-zinc-100">
          <article
            v-for="(post, idx) in recentPosts"
            :key="post.slug"
            class="border-b border-zinc-100 py-6 sm:py-8 group hover:-translate-y-0.5 card-3d"
            :class="[`delay-${post.delay}`, 'animate-fade-up']"
          >
            <div class="grid grid-cols-1 sm:grid-cols-[7rem_1fr_auto] gap-3 sm:gap-6 items-baseline">
              <!-- Date -->
              <time
                class="text-sm text-zinc-400 tabular-nums font-mono"
              >{{ post.date }}</time>

              <!-- Title + excerpt -->
              <div>
                <RouterLink
                  :to="post.slug"
                  class="text-lg font-medium tracking-tight text-zinc-900 group-hover:text-emerald-600 transition-colors duration-300"
                  style="transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1)"
                >
                  {{ post.title }}
                </RouterLink>
                <p
                  class="text-sm text-zinc-500 leading-relaxed mt-1.5 max-w-[65ch]"
                >
                  {{ post.excerpt }}
                </p>
              </div>

              <!-- Category tag -->
              <span
                class="hidden sm:inline-flex items-center px-3 py-1 rounded-full bg-zinc-100 text-xs font-medium text-zinc-500 whitespace-nowrap self-center"
              >{{ post.category }}</span>
            </div>
          </article>
        </div>

        <!-- Archive link -->
        <div class="mt-10 animate-fade-up">
          <RouterLink
            to="/archive"
            class="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-700 hover:text-emerald-600 transition-colors duration-300 link-underline"
            style="transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1)"
          >
            查看所有文章
            <PhCaretRight :size="14" weight="bold" />
          </RouterLink>
        </div>
      </section>
    </ScrollReveal>

    <!-- ═══════════════════════════════════════════════════════
    FEATURED — Asymmetric 2-col grid
    ════════════════════════════════════════════════════════ -->
    <ScrollReveal>
      <section
        class="reveal-up max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-20 py-24 lg:py-32 border-t border-zinc-100"
        aria-label="Featured"
      >
        <!-- Section Eyebrow -->
        <div class="mb-16 animate-fade-up">
          <span
            class="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 tracking-[0.15em] uppercase"
          >
            <span class="w-6 h-px bg-zinc-300" />
            精选
          </span>
        </div>

        <!-- Asymmetric grid: 2fr 1fr -->
        <div class="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
          <article
            v-for="(item, idx) in featured"
            :key="item.slug"
            class="border-l-2 border-emerald-500 pl-5 py-4 group animate-fade-up glass-panel rounded-xl px-5 tilt-card"
            :class="[`delay-${idx + 1}`]"
          >
            <RouterLink
              :to="item.slug"
              class="block"
            >
              <h3
                class="text-xl font-medium tracking-tight text-zinc-900 group-hover:text-emerald-600 transition-colors duration-300 mb-1.5"
                style="transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1)"
              >
                {{ item.title }}
              </h3>
              <p
                class="text-sm text-zinc-500 leading-relaxed max-w-[65ch]"
              >
                {{ item.description }}
              </p>
            </RouterLink>
          </article>
        </div>
      </section>
    </ScrollReveal>

    <!-- ═══════════════════════════════════════════════════════
    PAGE-AGENT CTA — 随页面滚动，到底部消失
    ════════════════════════════════════════════════════════ -->
    <ScrollReveal>
      <section
        class="reveal-up max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-20 py-24 lg:py-32 border-t border-zinc-100"
        aria-label="AI Agent"
      >
        <div class="animate-fade-up text-center glass-panel rounded-2xl p-10 md:p-14 max-w-2xl mx-auto gradient-border">
          <div
            class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-xs font-medium text-emerald-700 tracking-wide uppercase mb-6"
          >
            AI Agent
          </div>
          <h2
            class="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900 mb-4"
          >
            立即体验网页专属 AI Agent
          </h2>
          <p
            class="text-base text-zinc-500 leading-relaxed max-w-[50ch] mx-auto mb-10"
          >
            用自然语言操控网页——点击下方按钮，试试对 AI 说"帮我找篇文章"或"介绍一下博主"。
          </p>
          <button
            class="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-all duration-300 hover:scale-[1.02] active:scale-[0.97] ripple-btn"
            style="transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1)"
            @click="openAgent"
          >
            打开 AI 助手
            <PhArrowRight :size="16" weight="bold" />
          </button>
        </div>
      </section>
    </ScrollReveal>
  </div>
</template>

<style scoped>
/* ── Override animation duration from main.css for a snappier feel ── */
.delay-1 { animation-delay: 0.08s; }
.delay-2 { animation-delay: 0.16s; }
.delay-3 { animation-delay: 0.24s; }
.delay-4 { animation-delay: 0.32s; }
.delay-5 { animation-delay: 0.40s; }

/* ── Ensure border-b items fade in sequentially ── */
article.animate-fade-up {
  animation: fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}
</style>
