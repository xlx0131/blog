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
      <p>域名是在阿里云（万网）购买的。搜索了想要的域名后，阿里云给了几个可选的后缀，最后选择了 <strong>许立鑫.site</strong>。价格大约 30 元/年。</p>
      <ul>
        <li>打开阿里云官网 → 搜索"域名注册" → 输入想要的域名</li>
        <li>从可选的几个后缀中选定了 <strong>.site</strong> 后缀</li>
        <li>加入购物车 → 实名认证 → 支付完成</li>
      </ul>
      <blockquote>💡 如果是 .cn 后缀需要先实名认证才能使用，.site 也需要实名，建议提前准备好身份证信息。</blockquote>

      <h2>第二步：在 Cloudflare 添加站点</h2>
      <ul>
        <li>Cloudflare Dashboard → <strong>添加站点</strong></li>
        <li>输入域名 → 选择免费计划</li>
        <li>Cloudflare 会提供两个 NS 地址</li>
      </ul>

      <h2>第三步：修改域名的 NS 记录</h2>
      <p>在阿里云买的域名，需要把 NS 改成 Cloudflare 提供的地址：</p>
      <ul>
        <li>登录阿里云控制台 → 域名管理 → 找到 <strong>许立鑫.site</strong></li>
        <li>点击管理 → DNS 修改 → 自定义 DNS</li>
        <li>把 NS 改为 Cloudflare 添加站点后提供的两个地址</li>
        <li>保存后等待生效（几分钟到几小时）</li>
      </ul>

      <h2>第四步：构建并部署</h2>
      <pre><code>npm run build
npx wrangler pages deploy dist --project-name=blog</code></pre>
      <p>也可以连接 GitHub 仓库，推送代码后自动部署。</p>

      <h2>第五步：绑定自定义域名</h2>
      <p>Pages 项目 → <strong>Custom domains</strong> → 输入 <strong>许立鑫.site</strong>，等待 SSL 证书生成即可。</p>

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
</style>
