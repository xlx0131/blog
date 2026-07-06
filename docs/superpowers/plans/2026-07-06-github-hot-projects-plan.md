# GitHub 热榜项目实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在个人博客中新增 GitHub 热榜页面，展示每日自动更新的 GitHub 热门开源项目，支持按语言/领域筛选、关键词搜索和项目详情查看。

**Architecture:** 纯静态架构，前端 Vue 3 页面直接读取本地 JSON 数据；GitHub Actions 每日定时运行 Node.js 爬取脚本，调用 GitHub API 获取热门项目，更新 JSON 文件并自动提交到仓库。

**Tech Stack:** Vue 3 + TypeScript + 原生 CSS (像素风格) + GitHub REST API + GitHub Actions + Node.js

---

## 项目文件结构

```
src/
  data/
    github-projects.json       # 项目数据 (创建)
  views/
    GitHubHot.vue              # 热榜列表页 (创建)
    GithubHotDetail.vue        # 项目详情页 (创建)
  router/
    index.ts                   # 路由配置 (修改)
  data/
    contents.js                # 项目列表数据，添加项目三 (修改)
scripts/
  fetch-github.js              # GitHub 数据爬取脚本 (创建)
.github/
  workflows/
    github-hot.yml             # GitHub Actions 定时工作流 (创建)
```

---

## Task 1: 初始化数据文件

**Files:**
- Create: `src/data/github-projects.json`

**Goal:** 创建初始 JSON 数据文件，包含示例数据，供前端页面开发使用。

- [ ] **Step 1: 创建数据文件**

在 `src/data/github-projects.json` 中写入：

```json
{
  "lastUpdated": "2026-07-06T02:00:00Z",
  "totalProjects": 6,
  "projects": [
    {
      "id": 1,
      "name": "vue",
      "fullName": "vuejs/vue",
      "description": "The Progressive JavaScript Framework",
      "language": "TypeScript",
      "topics": ["frontend", "framework", "vue"],
      "stars": 45000,
      "forks": 8200,
      "watchers": 1200,
      "openIssues": 600,
      "htmlUrl": "https://github.com/vuejs/vue",
      "homepage": "https://vuejs.org",
      "license": "MIT",
      "readmeSummary": "Vue.js is a progressive, incrementally-adoptable JavaScript framework for building UI on the web.",
      "addedDate": "2026-07-01",
      "lastUpdatedDate": "2026-07-06"
    },
    {
      "id": 2,
      "name": "react",
      "fullName": "facebook/react",
      "description": "The library for web and native user interfaces",
      "language": "JavaScript",
      "topics": ["frontend", "framework", "react"],
      "stars": 220000,
      "forks": 45000,
      "watchers": 6600,
      "openIssues": 1200,
      "htmlUrl": "https://github.com/facebook/react",
      "homepage": "https://react.dev",
      "license": "MIT",
      "readmeSummary": "React is a JavaScript library for building user interfaces.",
      "addedDate": "2026-07-01",
      "lastUpdatedDate": "2026-07-06"
    },
    {
      "id": 3,
      "name": "next.js",
      "fullName": "vercel/next.js",
      "description": "The React Framework for the Web",
      "language": "JavaScript",
      "topics": ["frontend", "framework", "react", "ssr"],
      "stars": 120000,
      "forks": 26000,
      "watchers": 2400,
      "openIssues": 2800,
      "htmlUrl": "https://github.com/vercel/next.js",
      "homepage": "https://nextjs.org",
      "license": "MIT",
      "readmeSummary": "Next.js is a React framework that enables several extra features, including server-side rendering and generating static websites.",
      "addedDate": "2026-07-02",
      "lastUpdatedDate": "2026-07-06"
    },
    {
      "id": 4,
      "name": "tensorflow",
      "fullName": "tensorflow/tensorflow",
      "description": "An end-to-end open source platform for machine learning",
      "language": "Python",
      "topics": ["ai", "ml", "deep-learning"],
      "stars": 180000,
      "forks": 74000,
      "watchers": 8900,
      "openIssues": 2100,
      "htmlUrl": "https://github.com/tensorflow/tensorflow",
      "homepage": "https://www.tensorflow.org",
      "license": "Apache-2.0",
      "readmeSummary": "TensorFlow is an end-to-end open source platform for machine learning.",
      "addedDate": "2026-07-03",
      "lastUpdatedDate": "2026-07-06"
    },
    {
      "id": 5,
      "name": "go",
      "fullName": "golang/go",
      "description": "The Go programming language",
      "language": "Go",
      "topics": ["backend", "language", "compiler"],
      "stars": 120000,
      "forks": 17000,
      "watchers": 6500,
      "openIssues": 9000,
      "htmlUrl": "https://github.com/golang/go",
      "homepage": "https://go.dev",
      "license": "BSD-3-Clause",
      "readmeSummary": "The Go programming language is an open source project to make programmers more productive.",
      "addedDate": "2026-07-04",
      "lastUpdatedDate": "2026-07-06"
    },
    {
      "id": 6,
      "name": "vscode",
      "fullName": "microsoft/vscode",
      "description": "Visual Studio Code",
      "language": "TypeScript",
      "topics": ["devtools", "editor", "electron"],
      "stars": 160000,
      "forks": 29000,
      "watchers": 3300,
      "openIssues": 7800,
      "htmlUrl": "https://github.com/microsoft/vscode",
      "homepage": "https://code.visualstudio.com",
      "license": "MIT",
      "readmeSummary": "Visual Studio Code is a lightweight but powerful source code editor.",
      "addedDate": "2026-07-05",
      "lastUpdatedDate": "2026-07-06"
    }
  ]
}
```

- [ ] **Step 2: 验证文件格式正确**

运行：`node -e "console.log(JSON.parse(require('fs').readFileSync('src/data/github-projects.json', 'utf8')).totalProjects)"`
Expected: 输出 `6`

- [ ] **Step 3: 提交**

```bash
git add src/data/github-projects.json
git commit -m "feat: 添加 GitHub 热榜初始数据文件"
```

---

## Task 2: 实现 GitHub 热榜列表页

**Files:**
- Create: `src/views/GitHubHot.vue`

**Goal:** 创建热榜列表页，包含搜索、筛选、项目卡片网格，像素风格。

- [ ] **Step 1: 创建组件基础结构**

在 `src/views/GitHubHot.vue` 中写入基础结构（script + template 骨架）：

```vue
<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import githubData from '@/data/github-projects.json'

const router = useRouter()

interface Project {
  id: number
  name: string
  fullName: string
  description: string
  language: string
  topics: string[]
  stars: number
  forks: number
  htmlUrl: string
  addedDate: string
  lastUpdatedDate: string
}

const searchQuery = ref('')
const activeLanguage = ref('all')
const activeCategory = ref('all')
const sortBy = ref<'stars' | 'date'>('stars')

const allProjects = computed(() => githubData.projects as Project[])

const languages = computed(() => {
  const set = new Set<string>()
  allProjects.value.forEach(p => set.add(p.language))
  return Array.from(set).sort()
})

const categories = [
  { key: 'all', label: '全部' },
  { key: 'frontend', label: '前端' },
  { key: 'backend', label: '后端' },
  { key: 'ai', label: 'AI/ML' },
  { key: 'devtools', label: '开发工具' },
  { key: 'game', label: '游戏' },
  { key: 'design', label: '设计资源' },
  { key: 'database', label: '数据库' },
  { key: 'devops', label: 'DevOps' },
]

const filteredProjects = computed(() => {
  let items = [...allProjects.value]

  // 语言筛选
  if (activeLanguage.value !== 'all') {
    items = items.filter(p => p.language === activeLanguage.value)
  }

  // 领域筛选（简单匹配 topics）
  if (activeCategory.value !== 'all') {
    items = items.filter(p => p.topics.includes(activeCategory.value))
  }

  // 搜索
  const q = searchQuery.value.trim().toLowerCase()
  if (q) {
    items = items.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.topics.some(t => t.toLowerCase().includes(q))
    )
  }

  // 排序
  if (sortBy.value === 'stars') {
    items.sort((a, b) => b.stars - a.stars)
  } else {
    items.sort((a, b) => new Date(b.lastUpdatedDate).getTime() - new Date(a.lastUpdatedDate).getTime())
  }

  return items
})

function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return String(num)
}

function viewDetail(id: number) {
  router.push(`/github-hot/${id}`)
}

// 搜索快捷键
function onKeydown(e: KeyboardEvent) {
  if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
    e.preventDefault()
    document.getElementById('gh-search-input')?.focus()
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>
```

- [ ] **Step 2: 编写 template 部分**

在 template 中写入页面结构：

```vue
<template>
  <div class="min-h-[100dvh] bg-[#f5f0e8] py-24 px-6 sm:px-10 lg:px-20">
    <div class="max-w-[1400px] mx-auto">
      <!-- 标题区 -->
      <div class="flex items-start justify-between mb-8">
        <div>
          <span class="font-mono text-sm tracking-widest text-[#2e5dd6] uppercase">项目三</span>
          <h1 class="font-mono text-4xl sm:text-5xl font-black tracking-tight text-[#161310] mt-1">GitHub 热榜</h1>
          <p class="font-mono text-sm text-[#3a332a] mt-2">每日自动更新的 GitHub 热门项目精选</p>
        </div>
        <div class="text-right">
          <span class="font-mono text-xs text-[#3a332a] block">最后更新</span>
          <span class="font-mono text-sm text-[#161310] mt-1 inline-block px-3 py-1 bg-[#fffaef] border-2 border-[#161310] shadow-[3px_3px_0_0_#161310]">
            {{ new Date(githubData.lastUpdated).toLocaleDateString('zh-CN') }}
          </span>
        </div>
      </div>

      <!-- 搜索框 -->
      <div class="ow-search mb-6">
        <div class="ow-search__field">
          <svg class="ow-search__icon" viewBox="0 0 256 256" aria-hidden="true">
            <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
          </svg>
          <input
            id="gh-search-input"
            class="ow-search__input"
            type="text"
            placeholder="搜索项目名称、描述或话题..."
            v-model="searchQuery"
          />
          <kbd class="ow-search__kbd">/</kbd>
        </div>
      </div>

      <!-- 筛选区 - 语言 -->
      <div class="mb-3 flex flex-wrap gap-2">
        <button
          class="font-mono text-xs tracking-wider uppercase px-3 py-2 border-2 border-[#161310] shadow-[3px_3px_0_0_#161310] transition-all duration-200 hover:-translate-y-0.5"
          :class="activeLanguage === 'all' ? 'bg-[#161310] text-[#fffaef]' : 'bg-[#fffaef] text-[#161310]'"
          @click="activeLanguage = 'all'"
        >
          全部语言
        </button>
        <button
          v-for="lang in languages"
          :key="lang"
          class="font-mono text-xs tracking-wider uppercase px-3 py-2 border-2 border-[#161310] shadow-[3px_3px_0_0_#161310] transition-all duration-200 hover:-translate-y-0.5"
          :class="activeLanguage === lang ? 'bg-[#161310] text-[#fffaef]' : 'bg-[#fffaef] text-[#161310]'"
          @click="activeLanguage = lang"
        >
          {{ lang }}
        </button>
      </div>

      <!-- 筛选区 - 领域 -->
      <div class="mb-6 flex flex-wrap gap-2">
        <button
          v-for="cat in categories"
          :key="cat.key"
          class="font-mono text-xs tracking-wider uppercase px-3 py-2 border-2 border-[#161310] shadow-[3px_3px_0_0_#161310] transition-all duration-200 hover:-translate-y-0.5"
          :class="activeCategory === cat.key ? 'bg-[#161310] text-[#fffaef]' : 'bg-[#fffaef] text-[#161310]'"
          @click="activeCategory = cat.key"
        >
          {{ cat.label }}
        </button>
      </div>

      <!-- 排序 & 统计 -->
      <div class="flex items-center justify-between mb-6">
        <p class="font-mono text-sm text-[#3a332a]">
          共 <span class="text-[#161310] font-bold">{{ filteredProjects.length }}</span> 个项目
        </p>
        <div class="flex gap-2">
          <button
            class="font-mono text-xs px-3 py-1 border-2 border-[#161310] transition-colors"
            :class="sortBy === 'stars' ? 'bg-[#161310] text-[#fffaef]' : 'bg-[#fffaef] text-[#161310]'"
            @click="sortBy = 'stars'"
          >
            按 Stars
          </button>
          <button
            class="font-mono text-xs px-3 py-1 border-2 border-[#161310] transition-colors"
            :class="sortBy === 'date' ? 'bg-[#161310] text-[#fffaef]' : 'bg-[#fffaef] text-[#161310]'"
            @click="sortBy = 'date'"
          >
            按更新时间
          </button>
        </div>
      </div>

      <!-- 项目卡片网格 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <article
          v-for="project in filteredProjects"
          :key="project.id"
          class="gh-card cursor-pointer"
          @click="viewDetail(project.id)"
        >
          <div class="gh-card__header">
            <span class="gh-card__lang">
              <span class="gh-card__lang-dot" :data-lang="project.language"></span>
              {{ project.language }}
            </span>
            <span class="gh-card__stars">⭐ {{ formatNumber(project.stars) }}</span>
          </div>
          <h3 class="gh-card__title">{{ project.name }}</h3>
          <p class="gh-card__desc">{{ project.description }}</p>
          <div class="gh-card__footer">
            <span class="gh-card__forks">🍴 {{ formatNumber(project.forks) }}</span>
            <span class="gh-card__detail">查看详情 ▸</span>
          </div>
        </article>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredProjects.length === 0" class="mt-16 flex flex-col items-center py-16 text-center">
        <div class="w-20 h-20 bg-[#fffaef] border-2 border-[#161310] shadow-[8px_8px_0_0_#161310] flex items-center justify-center font-mono text-3xl mb-4">?</div>
        <h3 class="font-mono text-xl font-bold text-[#161310]">暂无匹配项目</h3>
        <p class="font-mono text-sm text-[#3a332a] mt-1">试试其他筛选条件或关键词</p>
      </div>
    </div>
  </div>
</template>
```

- [ ] **Step 3: 编写样式**

在 style scoped 中写入像素风格的卡片样式：

```vue
<style scoped>
/* 搜索框样式复用收藏夹的，这里只写卡片样式 */
.ow-search {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 560px;
  font-family: "Inter", ui-sans-serif, system-ui, sans-serif;
  color: #161310;
}

.ow-search__field {
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

.ow-search__field:focus-within {
  border-color: #2e5dd6;
  box-shadow: 4px 4px 0 0 #2e5dd6;
}

.ow-search__icon {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  fill: #161310;
}

.ow-search__input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-family: "VT323", ui-monospace, monospace;
  font-size: 22px;
  line-height: 1;
  color: #161310;
  padding: 0;
  margin: 0;
}

.ow-search__input::placeholder {
  color: #3a332a;
  opacity: 0.7;
}

.ow-search__kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  padding: 0 8px;
  font-family: "VT323", ui-monospace, monospace;
  font-size: 18px;
  background-color: #f2ead6;
  color: #161310;
  border: 2px solid #161310;
  line-height: 1;
  flex-shrink: 0;
}

/* 卡片样式 */
.gh-card {
  background-color: #fffaef;
  border: 2px solid #161310;
  box-shadow: 6px 6px 0 0 #161310;
  padding: 18px;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  clip-path: polygon(
    0 0,
    calc(100% - 12px) 0,
    100% 12px,
    100% 100%,
    12px 100%,
    0 calc(100% - 12px)
  );
}

.gh-card:hover {
  transform: translate(-2px, -2px);
  box-shadow: 10px 10px 0 0 #161310;
}

.gh-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.gh-card__lang {
  font-family: "VT323", ui-monospace, monospace;
  font-size: 14px;
  color: #3a332a;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 6px;
}

.gh-card__lang-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid #161310;
  display: inline-block;
}

.gh-card__lang-dot[data-lang="TypeScript"],
.gh-card__lang-dot[data-lang="JavaScript"] {
  background-color: #f7df1e;
}
.gh-card__lang-dot[data-lang="Python"] {
  background-color: #3776ab;
}
.gh-card__lang-dot[data-lang="Go"] {
  background-color: #00add8;
}
.gh-card__lang-dot[data-lang="Rust"] {
  background-color: #dea584;
}
.gh-card__lang-dot[data-lang="Java"] {
  background-color: #b07219;
}
.gh-card__lang-dot[data-lang="C++"] {
  background-color: #f34b7d;
}
.gh-card__lang-dot[data-lang="Ruby"] {
  background-color: #701516;
}
.gh-card__lang-dot[data-lang="PHP"] {
  background-color: #4f5d95;
}

.gh-card__stars {
  font-family: "VT323", ui-monospace, monospace;
  font-size: 16px;
  color: #161310;
  font-weight: bold;
}

.gh-card__title {
  font-family: "Pixelify Sans", ui-monospace, monospace;
  font-size: 24px;
  font-weight: 700;
  color: #161310;
  margin: 0 0 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.gh-card__desc {
  font-family: "Inter", ui-sans-serif, sans-serif;
  font-size: 13px;
  line-height: 1.5;
  color: #161310;
  margin: 0 0 16px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.gh-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 10px;
  border-top: 2px dotted #d9cdb3;
}

.gh-card__forks {
  font-family: "VT323", ui-monospace, monospace;
  font-size: 16px;
  color: #3a332a;
}

.gh-card__detail {
  font-family: "VT323", ui-monospace, monospace;
  font-size: 16px;
  color: #e2522e;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
</style>
```

- [ ] **Step 4: 验证页面**

启动开发服务器并访问 `http://localhost:5173/github-hot`（需要先配路由，Task 4 做），先确认语法正确。

- [ ] **Step 5: 提交**

```bash
git add src/views/GitHubHot.vue
git commit -m "feat: 添加 GitHub 热榜列表页"
```

---

## Task 3: 实现项目详情页

**Files:**
- Create: `src/views/GithubHotDetail.vue`

**Goal:** 创建项目详情页，展示项目完整信息、README 摘要、统计数据和跳转按钮。

- [ ] **Step 1: 创建详情页组件**

在 `src/views/GithubHotDetail.vue` 中写入：

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import githubData from '@/data/github-projects.json'

const route = useRoute()
const router = useRouter()

const projectId = computed(() => Number(route.params.id))

const project = computed(() => {
  return githubData.projects.find((p: any) => p.id === projectId.value)
})

function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return String(num)
}

function goBack() {
  router.push('/github-hot')
}
</script>

<template>
  <div class="min-h-[100dvh] bg-[#f5f0e8] py-24 px-6 sm:px-10 lg:px-20">
    <div class="max-w-[900px] mx-auto">
      <!-- 返回按钮 -->
      <button
        class="font-mono text-sm mb-8 px-4 py-2 bg-[#fffaef] border-2 border-[#161310] shadow-[3px_3px_0_0_#161310] hover:-translate-y-0.5 transition-all"
        @click="goBack"
      >
        ← 返回列表
      </button>

      <div v-if="project" class="gh-detail">
        <!-- 项目头部 -->
        <div class="gh-detail__header">
          <div class="gh-detail__lang">
            <span class="gh-detail__lang-dot" :data-lang="project.language"></span>
            {{ project.language }}
          </div>
          <h1 class="gh-detail__title">{{ project.name }}</h1>
          <p class="gh-detail__fullname">{{ project.fullName }}</p>
          <p class="gh-detail__desc">{{ project.description }}</p>
        </div>

        <!-- 统计数据 -->
        <div class="gh-detail__stats">
          <div class="gh-detail__stat">
            <span class="gh-detail__stat-num">⭐ {{ formatNumber(project.stars) }}</span>
            <span class="gh-detail__stat-label">Stars</span>
          </div>
          <div class="gh-detail__stat">
            <span class="gh-detail__stat-num">🍴 {{ formatNumber(project.forks) }}</span>
            <span class="gh-detail__stat-label">Forks</span>
          </div>
          <div class="gh-detail__stat">
            <span class="gh-detail__stat-num">👀 {{ formatNumber(project.watchers) }}</span>
            <span class="gh-detail__stat-label">Watchers</span>
          </div>
          <div class="gh-detail__stat">
            <span class="gh-detail__stat-num">🐛 {{ formatNumber(project.openIssues) }}</span>
            <span class="gh-detail__stat-label">Issues</span>
          </div>
        </div>

        <!-- README 摘要 -->
        <div class="gh-detail__section">
          <h2 class="gh-detail__section-title">README</h2>
          <div class="gh-detail__readme">
            <p>{{ project.readmeSummary }}</p>
          </div>
        </div>

        <!-- 项目信息 -->
        <div class="gh-detail__section">
          <h2 class="gh-detail__section-title">项目信息</h2>
          <div class="gh-detail__info">
            <div class="gh-detail__info-item">
              <span class="gh-detail__info-label">开源协议</span>
              <span class="gh-detail__info-value">{{ project.license || '未知' }}</span>
            </div>
            <div class="gh-detail__info-item">
              <span class="gh-detail__info-label">收录日期</span>
              <span class="gh-detail__info-value">{{ project.addedDate }}</span>
            </div>
            <div class="gh-detail__info-item">
              <span class="gh-detail__info-label">最近更新</span>
              <span class="gh-detail__info-value">{{ project.lastUpdatedDate }}</span>
            </div>
            <div class="gh-detail__info-item" v-if="project.homepage">
              <span class="gh-detail__info-label">项目官网</span>
              <a :href="project.homepage" target="_blank" class="gh-detail__info-link">{{ project.homepage }}</a>
            </div>
          </div>
        </div>

        <!-- 话题标签 -->
        <div class="gh-detail__section">
          <h2 class="gh-detail__section-title">话题标签</h2>
          <div class="gh-detail__topics">
            <span v-for="topic in project.topics" :key="topic" class="gh-detail__topic">
              {{ topic }}
            </span>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="gh-detail__actions">
          <a
            :href="project.htmlUrl"
            target="_blank"
            class="gh-detail__btn gh-detail__btn--primary"
          >
            在 GitHub 上查看 →
          </a>
          <a
            v-if="project.homepage"
            :href="project.homepage"
            target="_blank"
            class="gh-detail__btn gh-detail__btn--secondary"
          >
            访问官网
          </a>
        </div>
      </div>

      <!-- 项目不存在 -->
      <div v-else class="mt-16 flex flex-col items-center py-16 text-center">
        <div class="w-20 h-20 bg-[#fffaef] border-2 border-[#161310] shadow-[8px_8px_0_0_#161310] flex items-center justify-center font-mono text-3xl mb-4">?</div>
        <h3 class="font-mono text-xl font-bold text-[#161310]">项目不存在</h3>
        <p class="font-mono text-sm text-[#3a332a] mt-1">该项目可能已被移除</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gh-detail {
  background-color: #fffaef;
  border: 2px solid #161310;
  box-shadow: 8px 8px 0 0 #161310;
  padding: 32px;
  clip-path: polygon(
    0 0,
    calc(100% - 16px) 0,
    100% 16px,
    100% 100%,
    16px 100%,
    0 calc(100% - 16px)
  );
}

.gh-detail__header {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 2px dotted #d9cdb3;
}

.gh-detail__lang {
  font-family: "VT323", ui-monospace, monospace;
  font-size: 16px;
  color: #3a332a;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.gh-detail__lang-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid #161310;
  display: inline-block;
}

.gh-detail__lang-dot[data-lang="TypeScript"],
.gh-detail__lang-dot[data-lang="JavaScript"] {
  background-color: #f7df1e;
}
.gh-detail__lang-dot[data-lang="Python"] {
  background-color: #3776ab;
}
.gh-detail__lang-dot[data-lang="Go"] {
  background-color: #00add8;
}
.gh-detail__lang-dot[data-lang="Rust"] {
  background-color: #dea584;
}
.gh-detail__lang-dot[data-lang="Java"] {
  background-color: #b07219;
}

.gh-detail__title {
  font-family: "Pixelify Sans", ui-monospace, monospace;
  font-size: 48px;
  font-weight: 700;
  color: #161310;
  margin: 0 0 8px;
}

.gh-detail__fullname {
  font-family: "VT323", ui-monospace, monospace;
  font-size: 20px;
  color: #3a332a;
  margin: 0 0 16px;
}

.gh-detail__desc {
  font-family: "Inter", ui-sans-serif, sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: #161310;
  margin: 0;
}

.gh-detail__stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

@media (min-width: 640px) {
  .gh-detail__stats {
    grid-template-columns: repeat(4, 1fr);
  }
}

.gh-detail__stat {
  background-color: #f2ead6;
  border: 2px solid #161310;
  padding: 16px;
  text-align: center;
}

.gh-detail__stat-num {
  display: block;
  font-family: "Pixelify Sans", ui-monospace, monospace;
  font-size: 28px;
  font-weight: 700;
  color: #161310;
  margin-bottom: 4px;
}

.gh-detail__stat-label {
  font-family: "VT323", ui-monospace, monospace;
  font-size: 14px;
  color: #3a332a;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.gh-detail__section {
  margin-bottom: 24px;
}

.gh-detail__section-title {
  font-family: "Pixelify Sans", ui-monospace, monospace;
  font-size: 24px;
  font-weight: 700;
  color: #161310;
  margin: 0 0 12px;
}

.gh-detail__readme {
  background-color: #f2ead6;
  border: 2px solid #161310;
  padding: 20px;
  font-family: "Inter", ui-sans-serif, sans-serif;
  font-size: 14px;
  line-height: 1.7;
  color: #161310;
}

.gh-detail__readme p {
  margin: 0;
}

.gh-detail__info {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

@media (min-width: 640px) {
  .gh-detail__info {
    grid-template-columns: 1fr 1fr;
  }
}

.gh-detail__info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #f2ead6;
  border: 2px solid #161310;
}

.gh-detail__info-label {
  font-family: "VT323", ui-monospace, monospace;
  font-size: 14px;
  color: #3a332a;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.gh-detail__info-value,
.gh-detail__info-link {
  font-family: "Inter", ui-sans-serif, sans-serif;
  font-size: 14px;
  color: #161310;
  font-weight: 500;
}

.gh-detail__info-link {
  color: #2e5dd6;
  text-decoration: underline;
}

.gh-detail__topics {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.gh-detail__topic {
  font-family: "VT323", ui-monospace, monospace;
  font-size: 14px;
  padding: 4px 12px;
  background-color: #f2ead6;
  border: 2px solid #161310;
  color: #161310;
  text-transform: lowercase;
  letter-spacing: 0.05em;
}

.gh-detail__actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 2px dotted #d9cdb3;
}

.gh-detail__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  font-family: "VT323", ui-monospace, monospace;
  font-size: 18px;
  text-decoration: none;
  border: 2px solid #161310;
  box-shadow: 4px 4px 0 0 #161310;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.gh-detail__btn:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0 0 #161310;
}

.gh-detail__btn--primary {
  background-color: #2e5dd6;
  color: #fffaef;
}

.gh-detail__btn--secondary {
  background-color: #fffaef;
  color: #161310;
}
</style>
```

- [ ] **Step 2: 提交**

```bash
git add src/views/GithubHotDetail.vue
git commit -m "feat: 添加 GitHub 热榜项目详情页"
```

---

## Task 4: 配置路由和项目集成

**Files:**
- Modify: `src/router/index.ts`
- Modify: `src/data/contents.js`

**Goal:** 添加路由配置，将项目三集成到项目列表页。

- [ ] **Step 1: 添加路由配置**

在 `src/router/index.ts` 中添加两条新路由（用懒加载方式，和其他路由保持一致）：

```typescript
{
  path: '/github-hot',
  name: 'github-hot',
  component: () => import('@/views/GitHubHot.vue'),
  meta: { title: 'GitHub 热榜' }
},
{
  path: '/github-hot/:id',
  name: 'github-hot-detail',
  component: () => import('@/views/GithubHotDetail.vue'),
  meta: { title: '项目详情' }
}
```

确保放在现有路由数组中，位置可以放在 `/projects/:id` 后面。

- [ ] **Step 2: 在项目数据中添加项目三**

在 `src/data/contents.js` 的 `projects` 数组末尾添加：

```javascript
{
  id: 3,
  title: 'GitHub 热榜',
  subtitle: '每日自动更新的开源项目精选',
  description: '自动爬取 GitHub 热门开源项目，按语言和领域分类展示，每天定时更新。',
  url: '/github-hot',
  tags: ['工具', '数据', '自动化'],
  tech: ['Vue 3', 'GitHub API', 'GitHub Actions', 'Node.js'],
  cover: 'github',
  year: '2026',
  highlights: [
    '每日自动更新 GitHub 热门项目',
    '按编程语言和领域双维度筛选',
    '支持关键词搜索项目',
    '项目详情与 README 摘要展示',
    'GitHub Actions 全自动化流水线'
  ],
}
```

- [ ] **Step 3: 修改项目列表页的跳转逻辑**

在 `src/views/Projects.vue` 中，`viewProject` 函数需要判断：如果是项目三（id=3），跳转到 `/github-hot` 而不是 `/projects/3`。

修改 `viewProject` 函数：

```typescript
function viewProject(id: number) {
  if (id === 3) {
    router.push('/github-hot')
  } else {
    router.push(`/projects/${id}`)
  }
}
```

- [ ] **Step 4: 验证跳转**

访问 `/projects` 页面，点击项目三卡片，确认跳转到 `/github-hot`。

- [ ] **Step 5: 提交**

```bash
git add src/router/index.ts src/data/contents.js src/views/Projects.vue
git commit -m "feat: 配置 GitHub 热榜路由和项目集成"
```

---

## Task 5: 编写数据爬取脚本

**Files:**
- Create: `scripts/fetch-github.js`

**Goal:** 编写 Node.js 脚本，调用 GitHub API 获取热门项目，合并到现有 JSON 数据中。

- [ ] **Step 1: 创建爬取脚本**

在 `scripts/fetch-github.js` 中写入：

```javascript
const fs = require('fs')
const path = require('path')

const DATA_FILE = path.join(__dirname, '..', 'src', 'data', 'github-projects.json')

// 要爬取的语言列表
const LANGUAGES = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Go',
  'Rust',
  'Java',
  'C++',
  'Ruby',
  'PHP',
]

// 领域映射（简单关键词匹配）
const CATEGORY_KEYWORDS = {
  frontend: ['frontend', 'ui', 'component', 'vue', 'react', 'angular', 'svelte', 'css', 'html'],
  backend: ['backend', 'server', 'api', 'framework', 'node', 'django', 'flask', 'spring'],
  ai: ['ai', 'ml', 'machine-learning', 'deep-learning', 'neural-network', 'llm', 'gpt'],
  devtools: ['devtools', 'cli', 'editor', 'ide', 'vscode', 'debug', 'build', 'compiler'],
  game: ['game', 'game-engine', 'unity', 'unreal', 'pixel', 'retro'],
  design: ['design', 'uiux', 'icon', 'font', 'template', 'figma'],
  database: ['database', 'db', 'sql', 'nosql', 'redis', 'mongodb', 'postgres', 'mysql'],
  devops: ['devops', 'docker', 'kubernetes', 'k8s', 'ci', 'cd', 'deploy', 'cloud', 'terraform'],
  mobile: ['mobile', 'android', 'ios', 'react-native', 'flutter', 'swift', 'kotlin'],
}

const GITHUB_API = 'https://api.github.com'

async function fetchReposForLanguage(language, perPage = 15) {
  const url = `${GITHUB_API}/search/repositories?q=stars:>1000+language:${encodeURIComponent(language)}&sort=stars&order=desc&per_page=${perPage}`

  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'blog-github-hot',
  }

  // 如果有 token 就加上，提高 rate limit
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`
  }

  const response = await fetch(url, { headers })
  if (!response.ok) {
    console.error(`Failed to fetch ${language}: ${response.status}`)
    return []
  }
  const data = await response.json()
  return data.items || []
}

function categorizeProject(repo) {
  const topics = repo.topics || []
  const description = (repo.description || '').toLowerCase()
  const categories = []

  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(kw =>
      topics.includes(kw) ||
      description.includes(kw)
    )) {
      categories.push(cat)
    }
  }

  if (categories.length === 0) {
    categories.push('other')
  }

  return categories
}

function extractReadmeSummary(description, maxLength = 300) {
  if (!description) return '暂无描述'
  if (description.length <= maxLength) return description
  return description.slice(0, maxLength) + '...'
}

async function main() {
  console.log('开始爬取 GitHub 热门项目...')

  // 读取现有数据
  let existingData = { lastUpdated: '', totalProjects: 0, projects: [] }
  if (fs.existsSync(DATA_FILE)) {
    try {
      existingData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
    } catch (e) {
      console.warn('读取现有数据失败，将从头创建')
    }
  }

  const existingMap = new Map()
  existingData.projects.forEach(p => existingMap.set(p.fullName, p))

  let nextId = existingData.projects.length > 0
    ? Math.max(...existingData.projects.map(p => p.id)) + 1
    : 1

  const today = new Date().toISOString().split('T')[0]

  // 按语言爬取
  for (const lang of LANGUAGES) {
    console.log(`正在爬取 ${lang} 项目...`)
    try {
      const repos = await fetchReposForLanguage(lang)

      for (const repo of repos) {
        const fullName = repo.full_name

        if (existingMap.has(fullName)) {
          // 更新已有项目的动态数据
          const existing = existingMap.get(fullName)
          existing.stars = repo.stargazers_count
          existing.forks = repo.forks_count
          existing.watchers = repo.watchers_count
          existing.openIssues = repo.open_issues_count
          existing.lastUpdatedDate = today
          existing.description = repo.description || existing.description
          existing.topics = categorizeProject(repo)
          existing.homepage = repo.homepage || null
          existing.license = repo.license?.spdx_id || null
        } else {
          // 新项目
          const project = {
            id: nextId++,
            name: repo.name,
            fullName: fullName,
            description: repo.description || '',
            language: repo.language || lang,
            topics: categorizeProject(repo),
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            watchers: repo.watchers_count,
            openIssues: repo.open_issues_count,
            htmlUrl: repo.html_url,
            homepage: repo.homepage || null,
            license: repo.license?.spdx_id || null,
            readmeSummary: extractReadmeSummary(repo.description),
            addedDate: today,
            lastUpdatedDate: today,
          }
          existingMap.set(fullName, project)
          console.log(`  新增项目: ${fullName}`)
        }
      }

      // 避免触发 rate limit，稍微等一下
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (err) {
      console.error(`爬取 ${lang} 失败:`, err.message)
    }
  }

  // 转换为数组并按 stars 排序
  const projects = Array.from(existingMap.values()).sort((a, b) => b.stars - a.stars)

  // 重新编号 id
  projects.forEach((p, i) => { p.id = i + 1 })

  const result = {
    lastUpdated: new Date().toISOString(),
    totalProjects: projects.length,
    projects: projects,
  }

  // 写入文件
  fs.writeFileSync(DATA_FILE, JSON.stringify(result, null, 2))
  console.log(`\n完成！共 ${projects.length} 个项目，数据已写入 ${DATA_FILE}`)
}

main().catch(err => {
  console.error('爬取失败:', err)
  process.exit(1)
})
```

- [ ] **Step 2: 本地测试脚本**

运行：`node scripts/fetch-github.js`
Expected: 输出爬取进度，最后显示完成，`src/data/github-projects.json` 被更新

注意：第一次运行可能因为 GitHub API rate limit（未认证每小时 10 次请求），部分语言可能失败。如果有 token 可以设置环境变量 `GITHUB_TOKEN`。

- [ ] **Step 3: 在 package.json 中添加脚本命令**

在 `package.json` 的 `scripts` 中添加：

```json
"fetch:github": "node scripts/fetch-github.js"
```

- [ ] **Step 4: 提交**

```bash
git add scripts/fetch-github.js package.json
git commit -m "feat: 添加 GitHub 数据爬取脚本"
```

---

## Task 6: 配置 GitHub Actions 定时工作流

**Files:**
- Create: `.github/workflows/github-hot.yml`

**Goal:** 配置 GitHub Actions，每天定时运行爬取脚本并自动提交更新。

- [ ] **Step 1: 创建工作流文件**

在 `.github/workflows/github-hot.yml` 中写入：

```yaml
name: Update GitHub Hot Projects

on:
  schedule:
    # 每天北京时间 02:00 运行（UTC 18:00）
    - cron: '0 18 * * *'
  workflow_dispatch:
    # 允许手动触发

jobs:
  update-projects:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies (if needed)
        run: npm install --no-package-lock || echo "No dependencies needed"

      - name: Run fetch script
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: node scripts/fetch-github.js

      - name: Check for changes
        id: git-check
        run: |
          git add src/data/github-projects.json
          if git diff --cached --quiet; then
            echo "changed=false" >> $GITHUB_OUTPUT
            echo "No changes detected"
          else
            echo "changed=true" >> $GITHUB_OUTPUT
            echo "Changes detected"
          fi

      - name: Commit and push if changed
        if: steps.git-check.outputs.changed == 'true'
        run: |
          git config --local user.email "github-actions[bot]@users.noreply.github.com"
          git config --local user.name "github-actions[bot]"
          git commit -m "chore: 自动更新 GitHub 热榜数据"
          git push
```

- [ ] **Step 2: 提交工作流文件**

```bash
git add .github/workflows/github-hot.yml
git commit -m "feat: 添加 GitHub Actions 定时更新工作流"
```

---

## Task 7: 测试和收尾

**Files:**
- 无新文件，主要是验证

**Goal:** 整体测试，确保所有功能正常工作。

- [ ] **Step 1: 验证列表页功能**
  - 访问 `/github-hot`
  - 确认搜索功能正常
  - 确认语言筛选正常
  - 确认领域筛选正常
  - 确认排序功能正常
  - 确认点击卡片跳转到详情页

- [ ] **Step 2: 验证详情页功能**
  - 确认项目信息正确显示
  - 确认统计数据正确
  - 确认 README 摘要显示
  - 确认「在 GitHub 上查看」按钮跳转正确
  - 确认返回按钮正常

- [ ] **Step 3: 验证项目三集成**
  - 访问 `/projects`
  - 确认项目三卡片显示
  - 点击项目三卡片，确认跳转到 `/github-hot`

- [ ] **Step 4: 最终提交和推送**

```bash
git push
```

---

## 自审检查

### Spec 覆盖度检查
- ✅ 热门项目展示 → Task 2 列表页
- ✅ 搜索功能 → Task 2 搜索框 + 实时过滤
- ✅ 多维筛选（语言 + 领域）→ Task 2 筛选标签
- ✅ 排序选项 → Task 2 排序按钮
- ✅ 项目详情 → Task 3 详情页
- ✅ 每日更新 → Task 6 GitHub Actions
- ✅ 历史积累 → Task 5 爬取脚本的合并去重逻辑
- ✅ 项目列表页集成 → Task 4

### Placeholder 检查
- 无 TBD / TODO
- 所有代码步骤都有完整代码
- 所有命令都有具体参数和预期结果

### 类型一致性检查
- 数据字段在 JSON、列表页、详情页、爬取脚本中保持一致
- 路由路径在多个文件中一致
