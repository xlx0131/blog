<script setup lang="ts">
import ScrollReveal from '@/components/ScrollReveal.vue'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

interface PostItem {
  id: number
  title: string
  date: string
  category: string
}

interface YearGroup {
  year: string
  posts: PostItem[]
}

const archives = ref([
  {
    year: '2026',
    posts: [
      { id: 1, title: '从零开始：购买域名并部署到 Cloudflare 完整记录', date: '2026-06-30', category: '技术' },
    ],
  },
])

interface Tag {
  name: string
  count: number
}

const tags = ref<Tag[]>([
  { name: '工程', count: 3 },
  { name: '工具', count: 2 },
  { name: '性能', count: 2 },
  { name: '测试', count: 2 },
  { name: '职业', count: 2 },
  { name: '文化', count: 1 },
  { name: '写作', count: 1 },
])

const activeTag = ref<string | null>(null)

const filteredArchives = computed(() => {
  if (!activeTag.value) return archives.value
  return archives.value
    .map(group => ({
      year: group.year,
      posts: group.posts.filter(p => p.category === activeTag.value),
    }))
    .filter(group => group.posts.length > 0)
})

// Filter by tag click
function filterByTag(name: string) {
  activeTag.value = activeTag.value === name ? null : name
}

function viewArticle(id: number) {
  router.push(`/article/${id}`)
}
</script>

<template>
  <div class="min-h-[100dvh] bg-[#fafafa]">
    <div class="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:px-8">
      <!-- Page header -->
      <ScrollReveal><div class="border-b border-neutral-200 pb-8">
        <h1 class="text-4xl font-bold tracking-tight text-neutral-900">归档</h1>
        <p class="mt-2 text-neutral-500">
          共 {{ archives.reduce((sum, g) => sum + g.posts.length, 0) }} 篇文章，跨越 {{ archives.length }} 年
        </p>
      </div></ScrollReveal>
      <div v-if="activeTag" class="mt-6 flex items-center gap-2">
        <span class="text-sm text-neutral-500">筛选于</span>
        <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-600/10 px-3 py-1 text-xs font-semibold text-emerald-700">
          {{ activeTag }}
          <button
            class="ml-0.5 inline-flex text-emerald-500 hover:text-emerald-700 transition-colors"
            @click="activeTag = null"
          >
            <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
      </div>

      <div class="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-4">
        <!-- Year groups -->
        <div class="lg:col-span-3">
          <ScrollReveal><div v-for="group in filteredArchives" :key="group.year">
            <div class="flex items-baseline gap-4 border-t border-neutral-200 pt-6">
              <h2 class="text-2xl font-bold tracking-tight text-emerald-700">
                {{ group.year }}
              </h2>
              <span class="text-xs font-medium text-neutral-400">{{ group.posts.length }} 篇</span>
            </div>

            <div class="mt-4 mb-12 space-y-1">
              <div
                v-for="post in group.posts"
                :key="post.id"
                class="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-300 hover:bg-neutral-100/60 hover:-translate-y-0.5 cursor-pointer"
                style="transition-timing-function: cubic-bezier(0.16,1,0.3,1)"
                @click="viewArticle(post.id)"
              >
                <!-- Compact date -->
                <time class="w-10 shrink-0 text-right text-xs font-medium tabular-nums text-neutral-400">
                  {{ post.date.slice(5) }}
                </time>

                <!-- Category pill -->
                <span class="shrink-0 rounded-full bg-emerald-600/10 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-emerald-700">
                  {{ post.category }}
                </span>

                <!-- Title -->
                <span class="flex-1 truncate text-sm font-medium text-neutral-700 link-underline transition-colors duration-300 group-hover:text-emerald-600">
                  {{ post.title }}
                </span>

                <!-- Arrow hint -->
                <svg class="h-3.5 w-3.5 shrink-0 text-neutral-300 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </div>
          </div></ScrollReveal>

          <div
            v-if="filteredArchives.length === 0"
            class="py-16 text-center"
          >
            <p class="text-neutral-400">没有匹配此标签的文章。</p>
            <button
              class="mt-3 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
              @click="activeTag = null"
            >
              清除筛选
            </button>
          </div>
        </div>

        <!-- Sidebar: tag cloud -->
        <aside class="lg:col-span-1">
          <div class="lg:sticky lg:top-24 top-20">
            <ScrollReveal><h3 class="text-sm font-semibold tracking-tight text-neutral-700">标签</h3>
            <div class="mt-4 flex flex-wrap gap-2">
              <button
                v-for="tag in tags"
                :key="tag.name"
                @click="filterByTag(tag.name)"
                class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all duration-300"
                :class="activeTag === tag.name
                  ? 'border-emerald-600 bg-emerald-600 text-white'
                  : 'border-neutral-200 bg-white text-neutral-600 hover:border-emerald-200 hover:text-emerald-700'"
                style="transition-timing-function: cubic-bezier(0.16,1,0.3,1)"
              >
                {{ tag.name }}
                <span
                  class="tabular-nums"
                  :class="activeTag === tag.name ? 'text-emerald-200' : 'text-neutral-400'"
                >
                  {{ tag.count }}
                </span>
              </button>
            </div></ScrollReveal>

            <!-- Mini stats -->
            <ScrollReveal><div class="mt-8 border-t border-neutral-200 pt-6">
              <h4 class="text-xs font-semibold tracking-tight text-neutral-500 uppercase">统计</h4>
              <dl class="mt-3 space-y-2">
                <div class="flex items-center justify-between text-sm">
                  <dt class="text-neutral-500">文章总数</dt>
                  <dd class="font-medium text-neutral-700 tabular-nums">{{ archives.reduce((s, g) => s + g.posts.length, 0) }}</dd>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <dt class="text-neutral-500">分类数</dt>
                  <dd class="font-medium text-neutral-700 tabular-nums">{{ tags.length }}</dd>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <dt class="text-neutral-500">活跃年数</dt>
                  <dd class="font-medium text-neutral-700 tabular-nums">{{ archives.length }}</dd>
                </div>
              </dl>
            </div></ScrollReveal>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>
