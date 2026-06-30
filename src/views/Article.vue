<script setup lang="ts">
import ScrollReveal from '@/components/ScrollReveal.vue'
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const articles = {
  '1': {
    id: 1,
    title: '从零开始：购买域名并部署到 Cloudflare 完整记录',
    date: '2026-06-30',
    category: '技术',
    content: `
      <p>这篇文章记录了我从零开始购买域名、配置 DNS、连接 GitHub 仓库并最终部署到 Cloudflare Pages 的全过程。</p>

      <h2>第一步：购买域名</h2>
      <p>我选择在 Cloudflare 购买域名，因为它的价格是成本价，没有额外加价，续费价格和首年一样。.com 域名大约 66 元/年。</p>
      <ul>
        <li>Cloudflare Dashboard → <strong>域名注册</strong> → <strong>购买域名</strong></li>
        <li>搜索想要的域名，加入购物车，支付完成</li>
      </ul>

      <h2>第二步：在 Cloudflare 添加站点</h2>
      <ul>
        <li>Cloudflare Dashboard → <strong>添加站点</strong></li>
        <li>输入域名 → 选择免费计划</li>
        <li>Cloudflare 会提供两个 NS 地址</li>
      </ul>

      <h2>第三步：修改域名的 NS 记录</h2>
      <p>在 Cloudflare 买的域名不用改这一步。如果在阿里云、Namecheap 买的，需要去原平台把 NS 改为 Cloudflare 提供的地址。</p>

      <h2>第四步：构建并部署</h2>
      <pre><code>npm run build
npx wrangler pages deploy dist --project-name=blog</code></pre>
      <p>也可以连接 GitHub 仓库，推送代码后自动部署。</p>

      <h2>第五步：绑定自定义域名</h2>
      <p>Pages 项目 → <strong>Custom domains</strong> → 输入域名，等待 SSL 证书生成即可。</p>

      <h2>遇到的问题</h2>
      <ul>
        <li>API Token 无效 — 重新在 Cloudflare 创建 API Token（选 Pages Edit）后解决</li>
        <li>Wrangler 部署超时 — 国内网络原因，多试几次即可</li>
        <li>wranger.toml 配置冲突 — Pages 不能同时有 main 和 pages_build_output_dir</li>
      </ul>
    `,
  },
}

const articleId = computed(() => route.params.id as string)
const article = computed(() => articles[articleId.value] || articles['1'])

function goBack() {
  router.push('/')
}
</script>

<template>
  <div class="min-h-[100dvh] bg-[#fafafa] pt-24 pb-20">
    <div class="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-20">
      <button class="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-emerald-600 transition-colors duration-300 mb-8" @click="goBack">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        返回首页
      </button>

      <ScrollReveal>
      <article class="max-w-[65ch]">
        <header class="border-b border-neutral-200 pb-8">
          <div class="flex items-center gap-3">
            <span class="inline-block rounded-full bg-emerald-600/10 px-3 py-0.5 text-xs font-semibold tracking-wide text-emerald-700">{{ article.category }}</span>
            <time class="text-sm text-neutral-400 tabular-nums">{{ article.date }}</time>
          </div>
          <h1 class="mt-4 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">{{ article.title }}</h1>
        </header>

        <div class="mt-10 prose-custom" v-html="article.content" />
      </article>
      </ScrollReveal>
    </div>
  </div>
</template>

<style scoped>
.delay-1 { animation-delay: 0.08s; }
.delay-2 { animation-delay: 0.16s; }
.delay-3 { animation-delay: 0.24s; }
</style>
