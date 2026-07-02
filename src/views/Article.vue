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
    title: '从零购买域名并配置 Cloudflare：许立鑫.site 实战记录',
    date: '2026-07-02',
    category: '运维',
    content: `
      <p>一个属于自己的域名，是个人网站的"门牌号"。本文记录了我在阿里云购买域名「许立鑫.site」，并将其配置到 Cloudflare 的全流程。</p>

      <h2>为什么需要自定义域名</h2>
      <p>Cloudflare Pages 部署后会分配一个 <code>*.pages.dev</code> 的二级域名，虽然可以直接访问，但自定义域名更有专业感，也更方便记忆和传播。</p>

      <h2>在阿里云购买域名</h2>
      <p>阿里云是国内主流的域名注册商，购买流程非常便捷：</p>
      <ul>
        <li>进入阿里云官网，搜索"域名注册"</li>
        <li>输入想要的域名「许立鑫.site」，检查可用性</li>
        <li><strong>.site</strong> 后缀价格实惠，适合个人站点</li>
        <li>完成实名认证后即可下单购买</li>
      </ul>
      <p>购买完成后，在"域名控制台"可以管理已注册的域名。</p>

      <h2>将 DNS 迁移到 Cloudflare</h2>
      <p>Cloudflare 提供免费的 DNS 托管服务，解析速度快且自带 DDoS 防护：</p>
      <ul>
        <li>在 Cloudflare 控制台添加站点，输入「许立鑫.site」</li>
        <li>Cloudflare 会自动扫描现有 DNS 记录</li>
        <li>复制 Cloudflare 分配的 DNS 服务器地址（如 <code>alice.ns.cloudflare.com</code>）</li>
        <li>回到阿里云域名控制台，将 DNS 服务器修改为 Cloudflare 的地址</li>
      </ul>
      <p>DNS 修改通常需要几分钟到几小时生效，Cloudflare 会实时检测状态。</p>

      <h2>配置 Cloudflare Pages 自定义域名</h2>
      <p>DNS 生效后，就可以将域名绑定到 Pages 项目了：</p>
      <ul>
        <li>进入 Cloudflare Pages 项目 → 自定义域</li>
        <li>输入「许立鑫.site」，点击继续</li>
        <li>Cloudflare 会自动添加一条 CNAME 记录指向 Pages 项目</li>
        <li>开启 <strong>SSL/TLS 加密</strong>，选择 Full(strict) 模式</li>
        <li>开启 <strong>自动 HTTPS 重写</strong>，确保所有访问走 HTTPS</li>
      </ul>
      <p>配置完成后，访问「许立鑫.site」就能看到个人主页了。</p>

      <h2>优化建议</h2>
      <ul>
        <li>开启 Cloudflare 的 <strong>Auto Minify</strong> 自动压缩 HTML/CSS/JS</li>
        <li>配置 <strong>页面规则</strong> 实现 301 重定向（如 www 到根域名）</li>
        <li>开启 <strong>Brotli 压缩</strong> 提升页面加载速度</li>
        <li>配置 <strong>缓存规则</strong> 提高静态资源命中率</li>
      </ul>

      <h2>总结</h2>
      <p>从阿里云购买域名到配置 Cloudflare 托管，全程不需要服务器，所有操作在网页控制台即可完成。有了自己的域名，个人主页才算真正拥有了独立的身份标识。</p>
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
