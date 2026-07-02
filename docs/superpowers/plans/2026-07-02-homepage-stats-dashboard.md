# 首页数据看板 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在首页第二屏新增项目数、博客数、GitHub 星星数的统计看板

**Architecture:** 将分散在各视图文件中的作品/文章数据提取到 `src/data/contents.js` 共享文件，各视图从该文件导入数据；Home.vue 在此基础上读取项目数和文章数，并通过 GitHub API 获取星星总数，展示带计数动画的统计卡片。

**Tech Stack:** Vue 3, animejs (已依赖), GitHub REST API

---

### Task 1: 创建共享数据文件

**Files:**
- Create: `src/data/contents.js`

将以下四个视图中的静态数据提取到 `src/data/contents.js`：
- `src/views/Projects.vue` 中的 `projects` 数组
- `src/views/ProjectDetail.vue` 中的 `projects` Record
- `src/views/Archive.vue` 中的 `articles` 数组  
- `src/views/Article.vue` 中的 `articles` Record

文件结构：
```js
// 作品列表 & 详情
export const projects = [ ... ]
export const projectDetails = { ... }

// 文章列表 & 详情
export const articles = [ ... ]  
export const articleDetails = { ... }
```

- [ ] 创建 `src/data/contents.js`，将上述数据完整拷贝进去

---

### Task 2: 更新 Projects.vue

**Files:**
- Modify: `src/views/Projects.vue`

- [ ] 在 `<script setup>` 中移除内联的 `projects` 数组定义
- [ ] 添加导入：`import { projects } from '@/data/contents.js'`
- [ ] 确认接口（`Project` interface 保留在 Projects.vue 中）

---

### Task 3: 更新 ProjectDetail.vue

**Files:**
- Modify: `src/views/ProjectDetail.vue`

- [ ] 在 `<script setup>` 中移除内联的 `projects` Record 定义  
- [ ] 添加导入：`import { projects } from '@/data/contents.js'`
- [ ] 确认模板中对 `id === 1 ? '📊' : '🌐'` 的图标判断仍正常

---

### Task 4: 更新 Archive.vue

**Files:**
- Modify: `src/views/Archive.vue`

- [ ] 在 `<script setup>` 中移除内联的 `articles` 数组定义
- [ ] 添加导入：`import { articles } from '@/data/contents.js'`

---

### Task 5: 更新 Article.vue

**Files:**
- Modify: `src/views/Article.vue`

- [ ] 在 `<script setup>` 中移除内联的 `articles` Record 定义
- [ ] 添加导入：`import { articles } from '@/data/contents.js'`

---

### Task 6: 首页数据看板

**Files:**
- Modify: `src/views/Home.vue`

- [ ] 在 `<script setup>` 中添加导入：
  ```js
  import { projects, articles } from '@/data/contents.js'
  ```

- [ ] 添加响应式数据：
  ```js
  const repoStars = ref(0)
  
  // 从 GitHub API 获取星星数
  async function fetchGitHubStars() {
    try {
      const cached = sessionStorage.getItem('github-stars')
      if (cached) { repoStars.value = Number(cached); return }
      const res = await fetch('https://api.github.com/users/xlx0131/repos?per_page=100')
      const repos = await res.json()
      const total = repos.reduce((sum: number, r: any) => sum + (r.stargazers_count || 0), 0)
      repoStars.value = total
      sessionStorage.setItem('github-stars', String(total))
    } catch { /* 静默失败，保持 0 */ }
  }
  
  onMounted(() => {
    fetchGitHubStars()
    // ... 已有代码
  })
  ```

- [ ] 在卡片模板的 `<ul>` 导航下方添加统计看板 HTML：
  ```html
  <!-- Stats Dashboard -->
  <div class="stats-dashboard">
    <div class="stat-item">
      <span class="stat-icon">📦</span>
      <span class="stat-number" ref="projectCountRef">0</span>
      <span class="stat-label">项目</span>
    </div>
    <div class="stat-item">
      <span class="stat-icon">📝</span>
      <span class="stat-number" ref="articleCountRef">0</span>
      <span class="stat-label">博客</span>
    </div>
    <div class="stat-item">
      <span class="stat-icon">⭐</span>
      <span class="stat-number" ref="starCountRef">0</span>
      <span class="stat-label">GitHub 星星</span>
    </div>
  </div>
  ```

- [ ] 添加计数动画（card-inner 出现后触发）：
  ```js
  import { animate } from 'animejs'
  
  // 在 loadMain 中已有 card-inner 动画之后触发
  function animateStats() {
    animate('[data-count]', {
      innerText: (el: HTMLElement) => Number(el.dataset.count),
      round: 1,
      duration: 1500,
      easing: 'easeOutCubic',
      delay: 300,
    })
  }
  ```

- [ ] 添加样式：
  ```css
  .stats-dashboard {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-top: 40px;
    padding: 0 20px;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s ease;
  }
  .stats-dashboard.in {
    opacity: 1;
    transform: none;
  }
  .stat-item {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 12px;
    padding: 20px 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }
  .stat-icon { font-size: 1.5rem; }
  .stat-number {
    font-size: 1.8rem;
    font-weight: 700;
    color: #e6edf3;
    font-variant-numeric: tabular-nums;
  }
  .stat-label {
    font-size: 0.8rem;
    color: #8b949e;
  }
  @media (max-width: 540px) {
    .stats-dashboard { grid-template-columns: repeat(3, 1fr); gap: 8px; }
    .stat-item { padding: 12px 8px; }
    .stat-number { font-size: 1.3rem; }
  }
  ```
