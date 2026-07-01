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

      <div class="my-10 w-full rounded-xl border border-neutral-200/60 bg-white p-3 sm:p-6">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" class="w-full h-auto">
          <defs>
            <style>
              .xh-line { fill: none; stroke: #1a1a1a; stroke-linecap: round; stroke-linejoin: round; }
              .xh-body { stroke-width: 5; }
              .xh-thin { stroke-width: 2.5; }
              .xh-red { font-family: "STKaiti", "KaiTi", "楷体", serif; fill: #C0392B; font-size: 22px; }
              .xh-blue { font-family: "STKaiti", "KaiTi", "楷体", serif; fill: #2980B9; font-size: 22px; }
              .xh-org { font-family: "STKaiti", "KaiTi", "楷体", serif; fill: #D35400; font-size: 22px; }
              .xh-txt { font-family: "STKaiti", "KaiTi", "楷体", serif; fill: #1a1a1a; }
            </style>
          </defs>
          <rect width="1600" height="900" fill="#ffffff"/>
          <path class="xh-line xh-thin" stroke-dasharray="8 8" d="M 200 700 Q 800 780 1400 700"/>
          <text class="xh-txt" x="200" y="680" font-size="20" text-anchor="middle">阿里云买域名</text>
          <text class="xh-txt" x="1400" y="680" font-size="20" text-anchor="middle">Cloudflare 接入</text>
          <path class="xh-line" stroke-width="2.5" d="M 1350 700 L 1370 695 L 1370 705 Z" fill="#1a1a1a"/>
          <path class="xh-line xh-body" d="M 360 530 Q 350 580 330 610"/>
          <path class="xh-line xh-body" d="M 360 530 Q 370 580 390 610"/>
          <path class="xh-line xh-body" d="M 360 420 L 360 530"/>
          <circle cx="360" cy="378" r="42" fill="#1a1a1a"/>
          <circle cx="347" cy="372" r="5" fill="#ffffff"/>
          <circle cx="373" cy="372" r="5" fill="#ffffff"/>
          <path class="xh-line xh-body" d="M 360 445 Q 280 430 240 400"/>
          <path class="xh-line xh-body" d="M 360 450 Q 480 420 580 410"/>
          <path class="xh-line" stroke-width="3" d="M 575 405 L 585 415 M 575 415 L 585 405"/>
          <path class="xh-line xh-body" d="M 160 180 L 160 550"/>
          <path class="xh-line" stroke-width="4" d="M 100 160 Q 100 140 130 130 Q 200 110 270 130 Q 300 140 300 160 L 300 210 Q 300 230 270 240 Q 200 260 130 240 Q 100 230 100 210 Z"/>
          <text class="xh-txt" x="200" y="190" font-size="28" text-anchor="middle" font-weight="bold">许立鑫</text>
          <text class="xh-txt" x="200" y="225" font-size="26" text-anchor="middle">.site</text>
          <path class="xh-line" stroke-width="4" d="M 1150 410 Q 1130 370 1160 340 Q 1180 300 1230 310 Q 1280 280 1330 310 Q 1380 300 1400 340 Q 1430 360 1410 400 Q 1430 440 1390 460 Q 1380 480 1330 470 Q 1280 490 1230 470 Q 1180 480 1150 450 Q 1120 440 1150 410 Z"/>
          <path class="xh-line xh-body" d="M 1150 440 Q 1050 430 950 415"/>
          <path class="xh-line" stroke-width="3" d="M 955 410 L 945 420 M 955 420 L 945 410"/>
          <text class="xh-red" x="175" y="620">30元/年</text>
          <path class="xh-line" stroke-width="1.5" stroke="#C0392B" d="M 120 580 Q 140 590 160 570 Q 170 590 175 605" stroke-dasharray="3 3"/>
          <text class="xh-blue" x="1320" y="540">免费计划 ✓</text>
          <path class="xh-line" stroke-width="1.5" stroke="#2980B9" d="M 1350 510 Q 1340 520 1330 525" stroke-dasharray="3 3"/>
          <text class="xh-txt" x="800" y="80" font-size="18" fill="#aaa" text-anchor="middle" letter-spacing="6">STEP 1 · 域名入手 + 牵手 Cloudflare</text>
        </svg>
        <p class="mt-2 text-center text-xs text-neutral-400">← 阿里云买域名 · 牵手 Cloudflare 接入 →</p>
      </div>

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

      <div class="my-10 w-full rounded-xl border border-neutral-200/60 bg-white p-3 sm:p-6">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" class="w-full h-auto">
          <defs>
            <style>
              .xh-line { fill: none; stroke: #1a1a1a; stroke-linecap: round; stroke-linejoin: round; }
              .xh-body { stroke-width: 5; }
              .xh-thin { stroke-width: 2.5; }
              .xh-red { font-family: "STKaiti", "KaiTi", "楷体", serif; fill: #C0392B; font-size: 22px; }
              .xh-blue { font-family: "STKaiti", "KaiTi", "楷体", serif; fill: #2980B9; font-size: 22px; }
              .xh-org { font-family: "STKaiti", "KaiTi", "楷体", serif; fill: #D35400; font-size: 22px; }
              .xh-txt { font-family: "STKaiti", "KaiTi", "楷体", serif; fill: #1a1a1a; }
            </style>
          </defs>
          <rect width="1600" height="900" fill="#ffffff"/>
          <path class="xh-line" stroke-width="6" d="M 200 250 L 200 650"/>
          <path class="xh-line" stroke-width="4" d="M 150 250 L 250 250"/>
          <path class="xh-line" stroke-width="4" d="M 150 270 L 250 270"/>
          <rect x="160" y="310" width="80" height="40" rx="6" class="xh-line" stroke-width="3"/>
          <text class="xh-txt" x="200" y="337" font-size="20" text-anchor="middle">旧 NS</text>
          <text class="xh-txt" x="200" y="235" font-size="26" text-anchor="middle" font-weight="bold">阿里云</text>
          <text class="xh-txt" x="200" y="380" font-size="14" fill="#888" text-anchor="middle">dns1.aliyun.com</text>
          <text class="xh-txt" x="200" y="400" font-size="14" fill="#888" text-anchor="middle">dns2.aliyun.com</text>
          <path class="xh-line" stroke-width="6" d="M 1400 250 L 1400 650"/>
          <path class="xh-line" stroke-width="4" d="M 1350 250 L 1450 250"/>
          <path class="xh-line" stroke-width="4" d="M 1350 270 L 1450 270"/>
          <rect x="1360" y="310" width="80" height="40" rx="6" class="xh-line" stroke-width="3"/>
          <text class="xh-txt" x="1400" y="337" font-size="20" text-anchor="middle">新 NS</text>
          <text class="xh-txt" x="1400" y="235" font-size="26" text-anchor="middle" font-weight="bold">Cloudflare</text>
          <text class="xh-txt" x="1400" y="380" font-size="14" fill="#888" text-anchor="middle">dns1.cloudflare.com</text>
          <text class="xh-txt" x="1400" y="400" font-size="14" fill="#888" text-anchor="middle">dns2.cloudflare.com</text>
          <path class="xh-line xh-thin" stroke-dasharray="10 8" d="M 280 450 Q 600 550 1000 450 Q 1200 400 1360 450"/>
          <path class="xh-line" stroke-width="2.5" d="M 1320 440 L 1345 445 L 1325 465 Z" fill="#1a1a1a"/>
          <path class="xh-line xh-body" d="M 800 530 Q 830 540 850 580"/>
          <path class="xh-line xh-body" d="M 770 530 Q 740 540 720 580"/>
          <path class="xh-line xh-body" d="M 760 420 Q 780 460 780 530"/>
          <circle cx="750" cy="378" r="42" fill="#1a1a1a"/>
          <circle cx="737" cy="372" r="5" fill="#ffffff"/>
          <circle cx="763" cy="372" r="5" fill="#ffffff"/>
          <path class="xh-line xh-body" d="M 760 445 Q 700 440 670 460"/>
          <path class="xh-line xh-body" d="M 770 450 Q 820 430 850 400"/>
          <rect x="840" y="380" width="60" height="20" rx="4" class="xh-line" stroke-width="3"/>
          <text class="xh-txt" x="870" y="395" font-size="16" text-anchor="middle" font-weight="bold">NS</text>
          <path class="xh-line xh-thin" stroke-width="2" d="M 640 400 L 680 400"/>
          <path class="xh-line xh-thin" stroke-width="2" d="M 620 430 L 670 430"/>
          <path class="xh-line xh-thin" stroke-width="2" d="M 650 460 L 690 460"/>
          <path class="xh-line xh-thin" stroke-width="2" d="M 630 500 L 680 500"/>
          <path class="xh-line xh-thin" stroke-width="2" d="M 660 370 L 690 370"/>
          <path class="xh-line xh-thin" stroke-width="1.5" d="M 700 590 Q 680 570 670 590"/>
          <path class="xh-line xh-thin" stroke-width="1.5" d="M 670 585 Q 650 565 640 585"/>
          <text class="xh-org" x="620" y="320">修改 NS 地址</text>
          <path class="xh-line" stroke-width="1.5" stroke="#D35400" d="M 660 335 L 700 355" stroke-dasharray="3 3"/>
          <text class="xh-blue" x="980" y="530">等待生效…</text>
          <text class="xh-txt" x="980" y="558" font-size="18" fill="#888" text-anchor="middle">几分钟到几小时</text>
          <path class="xh-line" stroke-width="1.5" stroke="#2980B9" d="M 950 520 L 920 500" stroke-dasharray="3 3"/>
          <text class="xh-txt" x="800" y="80" font-size="18" fill="#aaa" text-anchor="middle" letter-spacing="6">STEP 2 · DNS 换乘接力</text>
        </svg>
        <p class="mt-2 text-center text-xs text-neutral-400">← 阿里云旧 NS · 小黑接力送到 Cloudflare 新 NS →</p>
      </div>

      <h2>第四步：构建并部署</h2>
      <pre><code>npm run build
npx wrangler pages deploy dist --project-name=blog</code></pre>
      <p>也可以连接 GitHub 仓库，推送代码后自动部署。</p>

      <h2>第五步：绑定自定义域名</h2>
      <p>Pages 项目 → <strong>Custom domains</strong> → 输入 <strong>许立鑫.site</strong>，等待 SSL 证书生成即可。</p>

      <h2>遇到的问题</h2>
      <div class="my-10 w-full rounded-xl border border-neutral-200/60 bg-white p-3 sm:p-6">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" class="w-full h-auto">
          <defs>
            <style>
              .xh-line { fill: none; stroke: #1a1a1a; stroke-linecap: round; stroke-linejoin: round; }
              .xh-body { stroke-width: 5; }
              .xh-thin { stroke-width: 2.5; }
              .xh-txt { font-family: "STKaiti", "KaiTi", "楷体", serif; fill: #1a1a1a; }
            </style>
          </defs>
          <rect width="1600" height="900" fill="#ffffff"/>
          <path class="xh-line" stroke-width="3" d="M 100 550 L 1500 550"/>
          <path class="xh-line xh-thin" stroke-width="1.5" d="M 120 560 L 180 560 M 300 570 L 350 570 M 600 555 L 650 555 M 900 565 L 960 565 M 1200 558 L 1260 558 M 1400 570 L 1460 570"/>
          <path class="xh-line" stroke-width="4" d="M 250 550 Q 220 600 240 650 Q 260 680 300 680 Q 340 680 360 650 Q 380 600 350 550"/>
          <path class="xh-line" stroke-width="2" d="M 260 560 Q 280 590 300 590 Q 320 590 340 560" stroke-dasharray="4 4"/>
          <circle cx="300" cy="590" r="30" fill="#1a1a1a"/>
          <circle cx="290" cy="586" r="4" fill="#ffffff"/>
          <circle cx="310" cy="586" r="4" fill="#ffffff"/>
          <path class="xh-line xh-body" d="M 280 610 Q 265 590 255 570"/>
          <path class="xh-line xh-body" d="M 320 610 Q 340 590 345 570"/>
          <rect x="230" y="410" width="140" height="36" rx="6" class="xh-line" stroke-width="2.5"/>
          <text class="xh-txt" x="300" y="434" font-size="18" text-anchor="middle">API Token 无效</text>
          <path class="xh-line xh-thin" d="M 300 445 L 300 550" stroke-dasharray="4 4"/>
          <path class="xh-line" stroke-width="3" stroke="#C0392B" d="M 240 420 L 248 428 M 248 420 L 240 428"/>
          <path class="xh-line" stroke-width="4" d="M 650 550 Q 620 600 640 650 Q 660 680 700 680 Q 740 680 760 650 Q 780 600 750 550"/>
          <path class="xh-line" stroke-width="2" d="M 660 560 Q 680 590 700 590 Q 720 590 740 560" stroke-dasharray="4 4"/>
          <rect x="630" y="410" width="140" height="36" rx="6" class="xh-line" stroke-width="2.5"/>
          <text class="xh-txt" x="700" y="434" font-size="18" text-anchor="middle">Wrangler 超时</text>
          <path class="xh-line xh-thin" d="M 700 445 L 700 550" stroke-dasharray="4 4"/>
          <path class="xh-line" stroke-width="3" stroke="#C0392B" d="M 640 420 L 648 428 M 648 420 L 640 428"/>
          <path class="xh-line" stroke-width="4" d="M 1050 550 Q 1020 600 1040 650 Q 1060 680 1100 680 Q 1140 680 1160 650 Q 1180 600 1150 550"/>
          <path class="xh-line" stroke-width="2" d="M 1060 560 Q 1080 590 1100 590 Q 1120 590 1140 560" stroke-dasharray="4 4"/>
          <rect x="1030" y="410" width="140" height="36" rx="6" class="xh-line" stroke-width="2.5"/>
          <text class="xh-txt" x="1100" y="434" font-size="18" text-anchor="middle">配置冲突</text>
          <path class="xh-line xh-thin" d="M 1100 445 L 1100 550" stroke-dasharray="4 4"/>
          <path class="xh-line" stroke-width="3" stroke="#C0392B" d="M 1040 420 L 1048 428 M 1048 420 L 1040 428"/>
          <path class="xh-line xh-body" d="M 130 550 L 110 640"/>
          <path class="xh-line xh-body" d="M 130 550 L 150 640"/>
          <path class="xh-line xh-body" d="M 130 420 L 130 550"/>
          <circle cx="130" cy="378" r="42" fill="#1a1a1a"/>
          <circle cx="117" cy="372" r="5" fill="#ffffff"/>
          <circle cx="143" cy="372" r="5" fill="#ffffff"/>
          <path class="xh-line xh-body" d="M 130 445 Q 190 430 250 430"/>
          <path class="xh-line xh-body" d="M 130 445 Q 100 470 95 500"/>
          <path class="xh-line xh-thin" stroke-width="2" stroke="#D35400" d="M 130 320 L 130 290 M 130 290 Q 130 260 160 260"/>
          <text x="165" y="275" font-family="'STKaiti','KaiTi','楷体',serif" font-size="22" fill="#D35400">经验总结</text>
          <text class="xh-txt" x="300" y="730" font-size="16" fill="#888" text-anchor="middle">重新创建 Pages Edit Token</text>
          <text class="xh-txt" x="700" y="730" font-size="16" fill="#888" text-anchor="middle">国内网络多试几次</text>
          <text class="xh-txt" x="1100" y="730" font-size="16" fill="#888" text-anchor="middle">删掉 wrangler.toml</text>
          <path class="xh-line xh-thin" fill="#888" d="M 300 710 L 300 695 M 700 710 L 700 695 M 1100 710 L 1100 695"/>
          <text class="xh-txt" x="800" y="80" font-size="18" fill="#aaa" text-anchor="middle" letter-spacing="6">STEP 3 · 部署三连坑</text>
        </svg>
        <p class="mt-2 text-center text-xs text-neutral-400">部署路上三个常见坑 · 附解决方案</p>
      </div>
      <ul>
        <li>API Token 无效 — 重新在 Cloudflare 创建 API Token（选 Pages Edit）后解决</li>
        <li>Wrangler 部署超时 — 国内网络原因，多试几次即可</li>
        <li>wranger.toml 配置冲突 — Pages 不能同时有 main 和 pages_build_output_dir</li>
      </ul>
    `,
  },
}

const articleId = computed(() => route.params.id as string)
const article = computed(() => articles[articleId.value as keyof typeof articles] || articles['1'])

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
