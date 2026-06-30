<script setup lang="ts">
import ScrollReveal from '@/components/ScrollReveal.vue'
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Mock article data keyed by id
interface ArticleData {
  id: number
  title: string
  date: string
  category: string
  content: string
}

const articles: Record<string, ArticleData> = {
  '1': {
    id: 1,
    title: '使用 Vue 3 和 TypeScript 构建设计系统',
    date: '2026-06-20',
    category: '工程',
    content: `
      <p>在过去的几年里，Vue 3 已成为前端开发不可或缺的一部分。随着 Composition API 的引入，Vue 3 带来了更好的代码组织和更强大的类型推断。</p>
      <h2>为什么选择 TypeScript</h2>
      <p>TypeScript 为 JavaScript 增加了静态类型检查。这不仅是为了减少运行时错误——它让代码意图更清晰，重构更安全，IDE 支持更智能。</p>
      <p>当使用 Vue 3 构建组件库时，TypeScript 提供了：</p>
      <ul>
        <li>精确的 Props 类型推断</li>
        <li>更好的 IDE 自动补全</li>
        <li>编译时类型检查，减少运行时错误</li>
        <li>通过类型定义更清晰的 API 文档</li>
      </ul>
      <h2>组件设计原则</h2>
      <p>良好的组件库设计基于几个原则。</p>
      <h3>1. 单一职责</h3>
      <p>每个组件只做一件事，并把它做好。当组件变得复杂时，将其拆分为更小的子组件。</p>
      <h3>2. 可组合性</h3>
      <p>组件应该自由组合而非紧密耦合。Vue 3 的插槽和 provide/inject 机制很好地支持了这一点。</p>
      <h3>3. 一致的 API</h3>
      <p>相似的组件应该共享一致的接口。例如，所有表单组件都支持 v-model、disabled 和 size 作为通用属性。</p>
      <h2>实践：Button 组件</h2>
      <p>从最简单的 Button 开始，我们逐步添加功能：</p>
      <pre><code>// Button.vue
&lt;script setup lang="ts"&gt;
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
}
withDefaults(defineProps&lt;ButtonProps&gt;(), {
  variant: 'secondary',
  size: 'md',
})
&lt;/script&gt;</code></pre>
      <p>这为我们提供了一个类型安全、功能完善的 Button 组件。</p>
      <h2>总结</h2>
      <p>Vue 3 和 TypeScript 的结合为前端开发开辟了许多可能性。无论你是构建个人项目还是企业级应用，审慎使用这些技术能让你的代码更加健壮和可维护。</p>
    `,
  },
  '2': {
    id: 2,
    title: '利用 CSS Containment 优化网页性能',
    date: '2026-06-15',
    category: '性能',
    content: `
      <p>CSS containment 是一个强大但常被忽视的提高渲染性能的工具。它允许浏览器隔离 DOM 的子树，并将样式重新计算和布局限制在该子树内。</p>
      <h2>Containment 的工作原理</h2>
      <p><code>contain</code> 属性告诉浏览器，给定的元素及其后代与文档树的其余部分独立。这使得浏览器在外部发生更改时可以跳过对包含子树的处理。</p>
      <h2>实际示例</h2>
      <p>一个渲染数百行的虚拟滚动器从 containment 中受益匪浅：</p>
      <pre><code>.virtual-row {
  contain: layout style paint;
}</code></pre>
      <p>有了这一声明，浏览器不再需要检查第 47 行的更改是否影响第 3 行。渲染管道变得更加可预测。</p>
    `,
  },
  '3': {
    id: 3,
    title: 'Git Worktrees 实用指南',
    date: '2026-06-10',
    category: '工具',
    content: `
      <p>Git worktrees 允许你在独立的工作目录中同时检出多个分支，共享同一个仓库。当你在功能开发和热修复之间切换上下文而无需暂存或克隆时，这非常宝贵。</p>
      <h2>基本用法</h2>
      <pre><code>git worktree add ../project-hotfix fix/login-error
cd ../project-hotfix
# work on the fix independently</code></pre>
      <p>新的工作树共享同一个 <code>.git</code> 目录，因此分支、远程仓库和提交立即可用。</p>
      <h2>何时使用 Worktrees</h2>
      <ul>
        <li>在保持当前功能分支不变的同时审查拉取请求</li>
        <li>在一个分支上运行长期集成测试，同时在另一个分支上开发</li>
        <li>并排比较两个分支的构建输出</li>
      </ul>
    `,
  },
}

const articleId = computed(() => route.params.id as string)
const article = computed(() => articles[articleId.value] || articles['1'])

const articleIds = Object.values(articles).sort((a, b) => b.id - a.id)
const currentIndex = computed(() => articleIds.findIndex(a => a.id === article.value.id))
const prevArticle = computed(() => currentIndex.value < articleIds.length - 1 ? articleIds[currentIndex.value + 1] : null)
const nextArticle = computed(() => currentIndex.value > 0 ? articleIds[currentIndex.value - 1] : null)

// Related articles (same category, excluding current)
const related = computed(() =>
  articleIds
    .filter(a => a.id !== article.value.id && a.category === article.value.category)
    .slice(0, 2)
)
</script>

<template>
  <div class="min-h-[100dvh] bg-[#fafafa]">
    <div class="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <!-- Back link -->
      <router-link
        to="/"
        class="btn-tactile group inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 transition-all duration-300 hover:text-emerald-600"
        style="transition-timing-function: cubic-bezier(0.16,1,0.3,1)"
      >
        <svg class="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        返回文章列表
      </router-link>

      <!-- Article header -->
      <article class="mt-8">
        <ScrollReveal><header class="border-b border-neutral-200 pb-8">
          <div class="flex items-center gap-3">
            <span class="inline-block rounded-full bg-emerald-600/10 px-3 py-0.5 text-xs font-semibold tracking-wide text-emerald-700">
              {{ article.category }}
            </span>
            <time class="text-sm text-neutral-400 tabular-nums">{{ article.date }}</time>
          </div>
          <h1 class="mt-4 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            {{ article.title }}
          </h1>
        </header></ScrollReveal>

        <!-- Body -->
        <ScrollReveal><div class="mt-10 max-w-[65ch]">
          <div class="prose-custom" v-html="article.content"></div>
        </div></ScrollReveal>

      <!-- Prev / Next links -->
      <nav class="mt-16 flex items-center justify-between border-t border-neutral-200 pt-8">
        <div>
          <router-link
            v-if="prevArticle"
            :to="`/article/${prevArticle.id}`"
            class="link-underline group flex flex-col items-start gap-0.5 text-sm transition-all duration-300"
            style="transition-timing-function: cubic-bezier(0.16,1,0.3,1)"
          >
            <span class="text-neutral-400">上一篇</span>
            <span class="font-medium text-neutral-700 transition-colors duration-300 group-hover:text-emerald-600">
              {{ prevArticle.title }}
            </span>
          </router-link>
        </div>
        <div class="text-right">
          <router-link
            v-if="nextArticle"
            :to="`/article/${nextArticle.id}`"
            class="link-underline group flex flex-col items-end gap-0.5 text-sm transition-all duration-300"
            style="transition-timing-function: cubic-bezier(0.16,1,0.3,1)"
          >
            <span class="text-neutral-400">下一篇</span>
            <span class="font-medium text-neutral-700 transition-colors duration-300 group-hover:text-emerald-600">
              {{ nextArticle.title }}
            </span>
          </router-link>
        </div>
      </nav>

      <!-- Related articles -->
      <ScrollReveal><section v-if="related.length" class="mt-16 border-t border-neutral-200 pt-10">
        <h2 class="text-lg font-semibold tracking-tight text-neutral-700">相关文章</h2>
        <div class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <router-link
            v-for="item in related"
            :key="item.id"
            :to="`/article/${item.id}`"
            class="group rounded-lg border border-neutral-200 bg-white p-5 transition-all duration-300 hover:border-emerald-200 hover:shadow-sm"
            style="transition-timing-function: cubic-bezier(0.16,1,0.3,1)"
          >
            <div class="flex items-center gap-3">
              <span class="inline-block rounded-full bg-emerald-600/10 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-emerald-700">
                {{ item.category }}
              </span>
            </div>
            <h3 class="mt-3 text-base font-medium tracking-tight text-neutral-800 transition-colors duration-300 group-hover:text-emerald-600">
              {{ item.title }}
            </h3>
            <time class="mt-2 block text-xs text-neutral-400">{{ item.date }}</time>
          </router-link>
        </div>
      </section></ScrollReveal>
    </article>
    </div>
  </div>
</template>

<style scoped>
.prose-custom {
  font-size: 1rem;
  line-height: 1.8;
  color: #404040;
}

.prose-custom :deep(h2) {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  color: #171717;
  margin: 2rem 0 0.75rem;
  line-height: 1.3;
}

.prose-custom :deep(h3) {
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: -0.025em;
  color: #262626;
  margin: 1.5rem 0 0.5rem;
}

.prose-custom :deep(p) {
  margin-bottom: 1.25rem;
}

.prose-custom :deep(ul) {
  margin: 0.75rem 0 1.25rem;
  padding-left: 1.5rem;
  list-style: disc;
}

.prose-custom :deep(li) {
  margin-bottom: 0.375rem;
}

.prose-custom :deep(code) {
  font-size: 0.875rem;
  background: #f0f0f0;
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  color: #059669;
  font-family: 'Geist Mono', ui-monospace, monospace;
}

.prose-custom :deep(pre) {
  background: #171717;
  border-radius: 0.75rem;
  padding: 1.5rem;
  overflow-x: auto;
  margin: 1.5rem 0;
  position: relative;
}

.prose-custom :deep(pre)::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 100%;
  background: #059669;
  border-radius: 0.75rem 0 0 0.75rem;
  opacity: 0.4;
}

.prose-custom :deep(pre code) {
  font-size: 0.8125rem;
  background: none;
  color: #d4d4d4;
  padding: 0;
  line-height: 1.7;
}

.prose-custom :deep(blockquote) {
  border-left: 3px solid #059669;
  padding: 0.75rem 1.25rem;
  margin: 1.25rem 0;
  background: #fafafa;
  border-radius: 0 0.5rem 0.5rem 0;
  color: #525252;
  font-style: italic;
}

.prose-custom :deep(a) {
  color: #059669;
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: color 0.2s;
}

.prose-custom :deep(a:hover) {
  color: #047857;
}

.prose-custom :deep(strong) {
  font-weight: 600;
  color: #171717;
}

.prose-custom :deep(img) {
  border-radius: 0.75rem;
  margin: 1.5rem 0;
}
</style>
