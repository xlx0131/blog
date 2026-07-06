<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import githubData from '@/data/github-projects.json'

const router = useRouter()

interface GitHubProject {
  id: number
  name: string
  fullName: string
  description: string
  language: string
  topics: string[]
  stars: number
  forks: number
  watchers: number
  openIssues: number
  htmlUrl: string
  homepage: string
  license: string
  readmeSummary: string
  addedDate: string
  lastUpdatedDate: string
}

const projects = ref<GitHubProject[]>(githubData.projects)

const searchQuery = ref('')
const selectedLanguage = ref('all')
const selectedDomain = ref('all')
const sortBy = ref<'stars' | 'updated'>('stars')

const searchInputRef = ref<HTMLInputElement | null>(null)

const allLanguages = computed(() => {
  const langSet = new Set<string>()
  projects.value.forEach(p => langSet.add(p.language))
  return Array.from(langSet)
})

const domains = [
  { key: 'all', label: '全部' },
  { key: 'frontend', label: '前端' },
  { key: 'backend', label: '后端' },
  { key: 'ai-ml', label: 'AI/ML' },
  { key: 'devtools', label: '开发工具' },
  { key: 'game', label: '游戏' },
  { key: 'design', label: '设计资源' },
  { key: 'database', label: '数据库' },
  { key: 'devops', label: 'DevOps' },
]

const domainTopicMap: Record<string, string[]> = {
  frontend: ['frontend', 'framework', 'vue', 'react', 'ssr', 'ui', 'css', 'html', 'web'],
  backend: ['backend', 'server', 'api', 'rest', 'graphql', 'microservice'],
  'ai-ml': ['ai', 'ml', 'machine-learning', 'deep-learning', 'neural-network', 'nlp', 'computer-vision'],
  devtools: ['devtools', 'editor', 'electron', 'cli', 'build', 'tool', 'developer-tools'],
  game: ['game', 'gamedev', 'game-engine', 'unity', 'unreal'],
  design: ['design', 'ui', 'ux', 'design-system', 'figma', 'icon', 'illustration'],
  database: ['database', 'sql', 'nosql', 'redis', 'postgres', 'mongodb', 'mysql'],
  devops: ['devops', 'docker', 'kubernetes', 'k8s', 'ci', 'cd', 'terraform', 'ansible'],
}

function matchesDomain(topics: string[], domainKey: string): boolean {
  if (domainKey === 'all') return true
  const domainTopics = domainTopicMap[domainKey] || []
  return topics.some(topic => domainTopics.includes(topic.toLowerCase()))
}

const filteredProjects = computed(() => {
  let result = [...projects.value]

  if (selectedLanguage.value !== 'all') {
    result = result.filter(p => p.language === selectedLanguage.value)
  }

  if (selectedDomain.value !== 'all') {
    result = result.filter(p => matchesDomain(p.topics, selectedDomain.value))
  }

  const q = searchQuery.value.trim().toLowerCase()
  if (q) {
    result = result.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.topics.some(t => t.toLowerCase().includes(q))
    )
  }

  if (sortBy.value === 'stars') {
    result.sort((a, b) => b.stars - a.stars)
  } else {
    result.sort((a, b) => new Date(b.lastUpdatedDate).getTime() - new Date(a.lastUpdatedDate).getTime())
  }

  return result
})

const lastUpdated = computed(() => {
  const date = new Date(githubData.lastUpdated)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

const languageColors: Record<string, string> = {
  TypeScript: '#f7df1e',
  JavaScript: '#f7df1e',
  Python: '#3776ab',
  Go: '#00add8',
  Rust: '#dea584',
  Java: '#b07219',
  'C++': '#f34b7d',
  Ruby: '#701516',
  PHP: '#4f5d95',
}

function getLanguageColor(lang: string): string {
  return languageColors[lang] || '#6e7681'
}

function viewProject(id: number) {
  router.push(`/github-hot/${id}`)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
    e.preventDefault()
    searchInputRef.value?.focus()
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div class="min-h-[100dvh] bg-[#f5f0e8] py-24 px-6 sm:px-10 lg:px-20">
    <div class="max-w-[1400px] mx-auto">
      <!-- 标题区 -->
      <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-8 gap-4">
        <div class="animate-fade-up">
          <span class="font-mono text-sm tracking-widest text-[#2e5dd6] uppercase block mb-4">项目三</span>
          <h1 class="text-[2.5rem] sm:text-[3.5rem] font-black tracking-tight text-[#161310] leading-none" style="font-family: 'Pixelify Sans', ui-monospace, monospace;">
            GitHub 热榜
          </h1>
          <p class="mt-3 text-sm text-[#3a332a] max-w-lg" style="font-family: 'Inter', ui-sans-serif, sans-serif;">
            精选 GitHub 上最受欢迎的开源项目，每日更新。
          </p>
        </div>
        <div class="shrink-0 animate-fade-up delay-1">
          <div class="px-4 py-3 bg-[#fffaef] border-2 border-[#161310] shadow-[4px_4px_0_0_#161310]">
            <p class="text-xs uppercase tracking-widest text-[#3a332a] mb-1" style="font-family: 'VT323', ui-monospace, monospace;">
              最后更新
            </p>
            <p class="text-lg font-bold text-[#161310]" style="font-family: 'VT323', ui-monospace, monospace;">
              {{ lastUpdated }}
            </p>
          </div>
        </div>
      </div>

      <!-- 搜索框 -->
      <div class="gh-search mb-8 animate-fade-up delay-1">
        <label class="gh-search__label" for="gh-search-input">SEARCH REPOS</label>
        <div class="gh-search__field">
          <svg class="gh-search__icon" viewBox="0 0 256 256" aria-hidden="true">
            <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
          </svg>
          <input
            ref="searchInputRef"
            id="gh-search-input"
            class="gh-search__input"
            type="text"
            placeholder="搜索项目名、描述或话题..."
            v-model="searchQuery"
          />
          <kbd class="gh-search__kbd">/</kbd>
        </div>
        <p class="gh-search__help">
          按 <span>/</span> 快速聚焦。按项目名、描述或 topics 搜索。
        </p>
      </div>

      <!-- 筛选区 -->
      <div class="mb-6 animate-fade-up delay-2">
        <p class="text-xs uppercase tracking-widest text-[#3a332a] mb-3" style="font-family: 'VT323', ui-monospace, monospace;">
          语言筛选
        </p>
        <div class="flex flex-wrap gap-2">
          <button
            class="text-xs tracking-wider uppercase px-3 py-2 border-2 border-[#161310] shadow-[3px_3px_0_0_#161310] transition-all duration-200 hover:-translate-y-0.5"
            :class="selectedLanguage === 'all' ? 'bg-[#161310] text-[#fffaef]' : 'bg-[#fffaef] text-[#161310]'"
            style="font-family: 'VT323', ui-monospace, monospace;"
            @click="selectedLanguage = 'all'"
          >
            全部语言
          </button>
          <button
            v-for="lang in allLanguages"
            :key="lang"
            class="text-xs tracking-wider uppercase px-3 py-2 border-2 border-[#161310] shadow-[3px_3px_0_0_#161310] transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2"
            :class="selectedLanguage === lang ? 'bg-[#161310] text-[#fffaef]' : 'bg-[#fffaef] text-[#161310]'"
            style="font-family: 'VT323', ui-monospace, monospace;"
            @click="selectedLanguage = lang"
          >
            <span
              class="w-3 h-3 rounded-full border border-[#161310]"
              :style="{ backgroundColor: getLanguageColor(lang) }"
            ></span>
            {{ lang }}
          </button>
        </div>
      </div>

      <div class="mb-8 animate-fade-up delay-2">
        <p class="text-xs uppercase tracking-widest text-[#3a332a] mb-3" style="font-family: 'VT323', ui-monospace, monospace;">
          领域筛选
        </p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="domain in domains"
            :key="domain.key"
            class="text-xs tracking-wider uppercase px-3 py-2 border-2 border-[#161310] shadow-[3px_3px_0_0_#161310] transition-all duration-200 hover:-translate-y-0.5"
            :class="selectedDomain === domain.key ? 'bg-[#161310] text-[#fffaef]' : 'bg-[#fffaef] text-[#161310]'"
            style="font-family: 'VT323', ui-monospace, monospace;"
            @click="selectedDomain = domain.key"
          >
            {{ domain.label }}
          </button>
        </div>
      </div>

      <!-- 排序 -->
      <div class="mb-8 flex items-center justify-between animate-fade-up delay-3">
        <p class="text-sm text-[#3a332a]" style="font-family: 'VT323', ui-monospace, monospace;">
          共 <span class="font-bold text-[#161310]">{{ filteredProjects.length }}</span> 个项目
        </p>
        <div class="flex items-center gap-2">
          <span class="text-xs uppercase tracking-widest text-[#3a332a]" style="font-family: 'VT323', ui-monospace, monospace;">
            排序:
          </span>
          <button
            class="text-xs tracking-wider uppercase px-3 py-1.5 border-2 border-[#161310] shadow-[2px_2px_0_0_#161310] transition-all duration-200"
            :class="sortBy === 'stars' ? 'bg-[#161310] text-[#fffaef]' : 'bg-[#fffaef] text-[#161310]'"
            style="font-family: 'VT323', ui-monospace, monospace;"
            @click="sortBy = 'stars'"
          >
            Stars
          </button>
          <button
            class="text-xs tracking-wider uppercase px-3 py-1.5 border-2 border-[#161310] shadow-[2px_2px_0_0_#161310] transition-all duration-200"
            :class="sortBy === 'updated' ? 'bg-[#161310] text-[#fffaef]' : 'bg-[#fffaef] text-[#161310]'"
            style="font-family: 'VT323', ui-monospace, monospace;"
            @click="sortBy = 'updated'"
          >
            更新时间
          </button>
        </div>
      </div>

      <!-- 项目卡片网格 -->
      <div v-if="filteredProjects.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <article
          v-for="project in filteredProjects"
          :key="project.id"
          class="gh-card group cursor-pointer animate-fade-up"
          @click="viewProject(project.id)"
        >
          <div class="gh-card__body">
            <div class="gh-card__lang">
              <span
                class="w-3 h-3 rounded-full border border-[#161310]"
                :style="{ backgroundColor: getLanguageColor(project.language) }"
              ></span>
              <span class="gh-card__lang-text">{{ project.language }}</span>
            </div>
            <h3 class="gh-card__title">{{ project.name }}</h3>
            <p class="gh-card__desc">{{ project.description }}</p>
            <div class="gh-card__topics">
              <span
                v-for="topic in project.topics.slice(0, 3)"
                :key="topic"
                class="gh-card__topic"
              >
                {{ topic }}
              </span>
            </div>
            <div class="gh-card__meta">
              <div class="gh-card__stat">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                <span>{{ formatNumber(project.stars) }}</span>
              </div>
              <div class="gh-card__stat">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="6" cy="3" r="2"/>
                  <circle cx="18" cy="3" r="2"/>
                  <circle cx="12" cy="21" r="2"/>
                  <path d="M6 5v4a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V5"/>
                  <path d="M12 11v8"/>
                </svg>
                <span>{{ formatNumber(project.forks) }}</span>
              </div>
            </div>
            <div class="gh-card__footer">
              <span class="gh-card__btn">查看详情 ▸</span>
            </div>
          </div>
        </article>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredProjects.length === 0" class="mt-16 flex flex-col items-center py-16 text-center">
        <div class="w-20 h-20 bg-[#fffaef] border-2 border-[#161310] shadow-[8px_8px_0_0_#161310] flex items-center justify-center text-3xl mb-4" style="font-family: 'Pixelify Sans', ui-monospace, monospace;">?</div>
        <h3 class="text-xl font-bold text-[#161310]" style="font-family: 'Pixelify Sans', ui-monospace, monospace;">暂无匹配项目</h3>
        <p class="text-sm text-[#3a332a] mt-1" style="font-family: 'VT323', ui-monospace, monospace;">试试修改搜索关键词或筛选条件</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gh-search {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 420px;
  max-width: 100%;
}

.gh-search__label {
  font-family: 'VT323', ui-monospace, monospace;
  font-size: 18px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #161310;
  line-height: 1;
}

.gh-search__field {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 10px 0 12px;
  height: 52px;
  background-color: #fffaef;
  border: 2px solid #161310;
  box-shadow: 4px 4px 0 0 #161310;
  transition: box-shadow 120ms ease, border-color 120ms ease;
}

.gh-search__field:focus-within {
  border-color: #2e5dd6;
  box-shadow: 4px 4px 0 0 #2e5dd6;
}

.gh-search__icon {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  fill: #161310;
}

.gh-search__input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-family: 'VT323', ui-monospace, monospace;
  font-size: 22px;
  line-height: 1;
  color: #161310;
  padding: 0;
  margin: 0;
}

.gh-search__input::placeholder {
  color: #3a332a;
  opacity: 0.7;
}

.gh-search__kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  padding: 0 8px;
  font-family: 'VT323', ui-monospace, monospace;
  font-size: 18px;
  background-color: #f2ead6;
  color: #161310;
  border: 2px solid #161310;
  line-height: 1;
  flex-shrink: 0;
}

.gh-search__help {
  font-family: 'VT323', ui-monospace, monospace;
  font-size: 16px;
  color: #3a332a;
  line-height: 1.2;
  margin: 0;
  letter-spacing: 0.02em;
}

.gh-search__help span {
  font-family: 'VT323', ui-monospace, monospace;
  background-color: #f2ead6;
  border: 2px solid #161310;
  padding: 0 6px;
  display: inline-block;
  line-height: 1.1;
  color: #161310;
}

.gh-card {
  width: 100%;
  background-color: #fffaef;
  color: #161310;
  border: 2px solid #161310;
  box-shadow: 6px 6px 0 0 #161310;
  clip-path: polygon(
    0 0,
    calc(100% - 12px) 0,
    100% 12px,
    100% 100%,
    12px 100%,
    0 calc(100% - 12px)
  );
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.gh-card:hover {
  transform: translate(-2px, -2px);
  box-shadow: 10px 10px 0 0 #161310;
}

.gh-card__body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.gh-card__lang {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.gh-card__lang-text {
  font-family: 'VT323', ui-monospace, monospace;
  font-size: 16px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #3a332a;
  line-height: 1;
}

.gh-card__title {
  font-family: 'Pixelify Sans', ui-monospace, monospace;
  font-weight: 700;
  font-size: 26px;
  line-height: 1.04;
  color: #161310;
  margin: 0 0 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.gh-card__desc {
  font-family: 'Inter', ui-sans-serif, sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: #161310;
  margin: 0 0 14px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.gh-card__topics {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}

.gh-card__topic {
  font-family: 'VT323', ui-monospace, monospace;
  font-size: 13px;
  letter-spacing: 0.04em;
  padding: 2px 8px;
  background-color: #f2ead6;
  color: #3a332a;
  border: 1px solid #d9cdb3;
  line-height: 1.4;
}

.gh-card__meta {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-top: 12px;
  border-top: 2px dotted #d9cdb3;
  margin-bottom: 14px;
}

.gh-card__stat {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #3a332a;
}

.gh-card__stat span {
  font-family: 'VT323', ui-monospace, monospace;
  font-size: 18px;
  line-height: 1;
  color: #161310;
}

.gh-card__footer {
  display: flex;
  justify-content: flex-end;
}

.gh-card__btn {
  font-family: 'VT323', ui-monospace, monospace;
  font-size: 16px;
  letter-spacing: 0.04em;
  color: #e2522e;
  line-height: 1;
  text-transform: uppercase;
  transition: transform 0.2s ease;
}

.gh-card:hover .gh-card__btn {
  transform: translateX(4px);
}
</style>
