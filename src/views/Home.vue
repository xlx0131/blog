<script setup lang="ts">
import { useRouter } from 'vue-router'
import { RouterLink } from 'vue-router'
import { PhArrowRight, PhRss } from '@phosphor-icons/vue'
import ScrollReveal from '@/components/ScrollReveal.vue'
import ParallaxHero from '@/components/ParallaxHero.vue'

const router = useRouter()

function openAgent() {
  // @ts-ignore
  const agent = window.pageAgent
  if (agent && agent.panel) {
    // @ts-ignore
    if (agent.panel.wrapper && document.body.contains(agent.panel.wrapper)) {
      agent.panel.show()
      return
    }
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
</script>

<template>
  <div>
    <ParallaxHero>
      <section class="min-h-[100dvh] flex items-center hero-gradient hero-section" aria-label="Hero">
        <div id="hero-particles" class="absolute inset-0 overflow-hidden" aria-hidden="true" />
        <div class="flex flex-col justify-center px-6 sm:px-10 lg:px-20 py-20 lg:py-0 w-full">
          <div class="max-w-[1400px] mx-auto w-full">
            <div class="max-w-[65ch]">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-xs font-medium text-zinc-600 tracking-wide uppercase mb-6 animate-fade-up">
                <PhRss :size="14" weight="duotone" class="text-emerald-600" />
                博客
              </div>
              <h1 class="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-zinc-900 leading-[1.05] mb-6 animate-fade-up hero-title">
                记录 <span class="gradient-text">代码、设计</span><br />与生活
              </h1>
              <p class="text-base sm:text-lg text-zinc-500 leading-relaxed max-w-[50ch] mb-10 animate-fade-up hero-subtitle">
                关于软件工程、产品设计和创作过程的思考。由许立鑫撰写。
              </p>
              <div class="flex flex-wrap gap-4 animate-fade-up">
                <RouterLink to="/archive" class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-all duration-300 hero-cta magnetic-btn">
                  浏览文章
                  <PhArrowRight :size="16" weight="bold" />
                </RouterLink>
                <RouterLink to="/about" class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-100 text-zinc-700 text-sm font-medium hover:bg-zinc-200 transition-all duration-300 hero-cta magnetic-btn">
                  关于我
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </ParallaxHero>

    <ScrollReveal>
      <section class="reveal-up max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-20 py-24 lg:py-32 border-t border-zinc-100" aria-label="AI Agent">
        <div class="animate-fade-up text-center glass-panel rounded-2xl p-10 md:p-14 max-w-2xl mx-auto gradient-border">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-xs font-medium text-emerald-700 tracking-wide uppercase mb-6">AI Agent</div>
          <h2 class="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900 mb-4">立即体验网页专属 AI Agent</h2>
          <p class="text-base text-zinc-500 leading-relaxed max-w-[50ch] mx-auto mb-10">用自然语言操控网页——点击下方按钮，试试对 AI 说"帮我找篇文章"或"介绍一下博主"。</p>
          <button class="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-all duration-300 hover:scale-[1.02] active:scale-[0.97] ripple-btn" @click="openAgent">
            打开 AI 助手
            <PhArrowRight :size="16" weight="bold" />
          </button>
        </div>
      </section>
    </ScrollReveal>
  </div>
</template>

<style scoped>
.iai-illustration { margin: 24px 0; border-radius: 12px; overflow: hidden; }
.iai-illustration svg { display: block; width: 100%; height: auto; max-width: 400px; }
</style>
