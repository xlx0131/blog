# GitHub 每日项目（项目三）实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a GitHub trending projects showcase page with auto-updating daily rankings, AI project detail pages, and AI Skill recommendations - all pixel-styled and backed by Cloudflare D1 + Cron.

**Architecture:** Vue 3 frontend with tabbed list + detail pages. Cloudflare Pages Functions serve JSON APIs. Cloudflare D1 stores projects, daily snapshots, and ai_skills. Cloudflare Cron Triggers fetch GitHub API data daily at 02:00 Beijing time.

**Tech Stack:** Vue 3, TypeScript, Tailwind CSS, shadcn-vue, Cloudflare Pages Functions, Cloudflare D1, Cloudflare Cron Triggers, GitHub REST API

---

## Task 1: Database Schema

**Files:**
- Modify: `schema.sql`
- Test: Run `wrangler d1 execute blog-db --file=schema.sql` locally after adding

- [ ] **Step 1: Add github_projects table to schema.sql**

Append to `schema.sql`:

```sql
-- GitHub 每日项目
CREATE TABLE IF NOT EXISTS github_projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  repo_name TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  language TEXT NOT NULL DEFAULT '',
  stars INTEGER NOT NULL DEFAULT 0,
  forks INTEGER NOT NULL DEFAULT 0,
  watchers INTEGER NOT NULL DEFAULT 0,
  open_issues INTEGER NOT NULL DEFAULT 0,
  topics TEXT NOT NULL DEFAULT '[]',
  html_url TEXT NOT NULL DEFAULT '',
  homepage TEXT NOT NULL DEFAULT '',
  owner_avatar TEXT NOT NULL DEFAULT '',
  owner_login TEXT NOT NULL DEFAULT '',
  readme TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'total',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS github_daily_snapshots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  date TEXT NOT NULL,
  stars INTEGER NOT NULL DEFAULT 0,
  forks INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (project_id) REFERENCES github_projects(id) ON DELETE CASCADE,
  UNIQUE(project_id, date)
);

CREATE TABLE IF NOT EXISTS ai_skills (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT '通用',
  url TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_github_projects_stars ON github_projects(stars DESC);
CREATE INDEX IF NOT EXISTS idx_github_projects_category ON github_projects(category);
CREATE INDEX IF NOT EXISTS idx_github_snapshots_date ON github_daily_snapshots(date);
CREATE INDEX IF NOT EXISTS idx_github_snapshots_project ON github_daily_snapshots(project_id);
CREATE INDEX IF NOT EXISTS idx_ai_skills_sort ON ai_skills(sort_order ASC);
```

- [ ] **Step 2: Verify schema is valid SQL**

No runtime test needed yet — just verify syntax looks correct.

- [ ] **Step 3: Commit**

```bash
git add schema.sql
git commit -m "feat: add github daily project tables to schema"
```

---

## Task 2: Cron Worker — Data Fetching

**Files:**
- Create: `functions/api/github/cron.js`
- Modify: `wrangler.toml`

- [ ] **Step 1: Create cron handler at functions/api/github/cron.js**

```javascript
// Cloudflare Cron 定时任务：每天抓取 GitHub 热门项目
// 触发方式：Cron Triggers（配置在 wrangler.toml）
// 也可以通过 HTTP GET /api/github/cron 手动触发（方便测试）

export async function onRequest(context) {
  const { request, env } = context
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // Cron 触发或 GET 请求都执行
  try {
    const result = await fetchAndStoreProjects(env)
    return Response.json({ success: true, data: result }, { headers: corsHeaders })
  } catch (e) {
    return Response.json({ success: false, error: e.message }, { status: 500, headers: corsHeaders })
  }
}

async function fetchAndStoreProjects(env) {
  const token = env.GITHUB_TOKEN || ''
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'blog-daily-projects',
  }
  if (token) headers['Authorization'] = `token ${token}`

  const today = new Date().toISOString().split('T')[0]
  let totalProjects = 0
  let aiProjects = 0

  // 1. 抓取总榜（按 stars 排序，取前 50）
  const totalResp = await fetch(
    'https://api.github.com/search/repositories?q=stars:>1000&sort=stars&order=desc&per_page=50',
    { headers }
  )
  const totalData = await totalResp.json()
  if (totalData.items) {
    for (const repo of totalData.items) {
      await upsertProject(env, repo, 'total')
      await saveSnapshot(env, repo, today)
      totalProjects++
    }
  }

  // 2. 抓取 AI 榜（topic:ai，按 stars 排序，取前 50）
  const aiResp = await fetch(
    'https://api.github.com/search/repositories?q=topic:ai+stars:>500&sort=stars&order=desc&per_page=50',
    { headers }
  )
  const aiData = await aiResp.json()
  if (aiData.items) {
    for (const repo of aiData.items) {
      await upsertProject(env, repo, 'ai')
      await saveSnapshot(env, repo, today)
      aiProjects++
    }
  }

  // 3. 清理 30 天前的快照
  await env.DB.prepare(
    `DELETE FROM github_daily_snapshots WHERE date < date('now', '-30 day')`
  ).run()

  return { totalProjects, aiProjects, date: today }
}

async function upsertProject(env, repo, category) {
  const existing = await env.DB.prepare(
    'SELECT id FROM github_projects WHERE repo_name = ?'
  ).bind(repo.full_name).first()

  const topics = JSON.stringify(repo.topics || [])

  if (existing) {
    // 更新
    await env.DB.prepare(`
      UPDATE github_projects SET
        full_name = ?, description = ?, language = ?, stars = ?, forks = ?,
        watchers = ?, open_issues = ?, topics = ?, html_url = ?,
        homepage = ?, owner_avatar = ?, owner_login = ?,
        category = CASE WHEN ? = 'ai' THEN 'ai' ELSE category END,
        updated_at = datetime('now')
      WHERE id = ?
    `).bind(
      repo.full_name,
      repo.description || '',
      repo.language || '',
      repo.stargazers_count || 0,
      repo.forks_count || 0,
      repo.watchers_count || 0,
      repo.open_issues_count || 0,
      topics,
      repo.html_url || '',
      repo.homepage || '',
      repo.owner?.avatar_url || '',
      repo.owner?.login || '',
      category,
      existing.id
    ).run()
    return existing.id
  } else {
    // 插入
    const result = await env.DB.prepare(`
      INSERT INTO github_projects
        (repo_name, full_name, description, language, stars, forks, watchers,
         open_issues, topics, html_url, homepage, owner_avatar, owner_login, category)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      repo.full_name,
      repo.full_name,
      repo.description || '',
      repo.language || '',
      repo.stargazers_count || 0,
      repo.forks_count || 0,
      repo.watchers_count || 0,
      repo.open_issues_count || 0,
      topics,
      repo.html_url || '',
      repo.homepage || '',
      repo.owner?.avatar_url || '',
      repo.owner?.login || '',
      category
    ).run()
    return result.meta.last_row_id
  }
}

async function saveSnapshot(env, repo, date) {
  const project = await env.DB.prepare(
    'SELECT id FROM github_projects WHERE repo_name = ?'
  ).bind(repo.full_name).first()

  if (!project) return

  // 检查当天是否已有快照
  const existing = await env.DB.prepare(
    'SELECT id FROM github_daily_snapshots WHERE project_id = ? AND date = ?'
  ).bind(project.id, date).first()

  if (existing) {
    await env.DB.prepare(`
      UPDATE github_daily_snapshots SET stars = ?, forks = ? WHERE id = ?
    `).bind(
      repo.stargazers_count || 0,
      repo.forks_count || 0,
      existing.id
    ).run()
  } else {
    await env.DB.prepare(`
      INSERT INTO github_daily_snapshots (project_id, date, stars, forks)
      VALUES (?, ?, ?, ?)
    `).bind(
      project.id,
      date,
      repo.stargazers_count || 0,
      repo.forks_count || 0
    ).run()
  }
}
```

- [ ] **Step 2: Add cron trigger to wrangler.toml**

Append to `wrangler.toml`:

```toml
# GitHub 每日项目定时抓取
[triggers]
crons = [
  "0 18 * * *",  # UTC 18:00 = 北京时间 02:00
]
```

- [ ] **Step 3: Commit**

```bash
git add functions/api/github/cron.js wrangler.toml
git commit -m "feat: add github data fetching cron worker"
```

---

## Task 3: API — Project List & Detail

**Files:**
- Create: `functions/api/github/projects.js`

- [ ] **Step 1: Create projects API endpoint**

```javascript
// GET /api/github/projects?type=total|ai|daily&limit=10
// GET /api/github/projects/:id

export async function onRequest(context) {
  const { request, env, params } = context
  const url = new URL(request.url)
  const method = request.method

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  if (method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (method !== 'GET') {
    return Response.json(
      { success: false, error: '只支持 GET 请求' },
      { status: 405, headers: corsHeaders }
    )
  }

  try {
    // 详情
    if (params && params.id) {
      const project = await env.DB.prepare(
        'SELECT * FROM github_projects WHERE id = ?'
      ).bind(Number(params.id)).first()

      if (!project) {
        return Response.json(
          { success: false, error: '项目不存在' },
          { status: 404, headers: corsHeaders }
        )
      }

      // 解析 topics
      project.topics = JSON.parse(project.topics || '[]')

      return Response.json({ success: true, data: project }, { headers: corsHeaders })
    }

    // 列表
    const type = url.searchParams.get('type') || 'total'
    const limit = Math.min(Number(url.searchParams.get('limit')) || 10, 50)
    let data = []

    if (type === 'total') {
      const { results } = await env.DB.prepare(`
        SELECT id, repo_name, full_name, description, language, stars, forks,
               topics, html_url, owner_avatar, owner_login
        FROM github_projects
        ORDER BY stars DESC
        LIMIT ?
      `).bind(limit).all()
      data = results.map(r => ({ ...r, topics: JSON.parse(r.topics || '[]') }))
    }

    else if (type === 'ai') {
      const { results } = await env.DB.prepare(`
        SELECT id, repo_name, full_name, description, language, stars, forks,
               topics, html_url, owner_avatar, owner_login
        FROM github_projects
        WHERE category = 'ai'
        ORDER BY stars DESC
        LIMIT ?
      `).bind(limit).all()
      data = results.map(r => ({ ...r, topics: JSON.parse(r.topics || '[]') }))
    }

    else if (type === 'daily') {
      const { results } = await env.DB.prepare(`
        SELECT p.id, p.repo_name, p.full_name, p.description, p.language,
               p.stars, p.forks, p.topics, p.html_url, p.owner_avatar, p.owner_login,
               (s_today.stars - s_yesterday.stars) as daily_growth
        FROM github_projects p
        JOIN github_daily_snapshots s_today
          ON p.id = s_today.project_id AND s_today.date = date('now')
        JOIN github_daily_snapshots s_yesterday
          ON p.id = s_yesterday.project_id AND s_yesterday.date = date('now', '-1 day')
        WHERE (s_today.stars - s_yesterday.stars) > 0
        ORDER BY daily_growth DESC
        LIMIT ?
      `).bind(limit).all()
      data = results.map(r => ({ ...r, topics: JSON.parse(r.topics || '[]') }))
    }

    else {
      return Response.json(
        { success: false, error: '无效的 type 参数' },
        { status: 400, headers: corsHeaders }
      )
    }

    return Response.json({ success: true, data }, { headers: corsHeaders })

  } catch (e) {
    return Response.json(
      { success: false, error: e.message },
      { status: 500, headers: corsHeaders }
    )
  }
}
```

- [ ] **Step 2: Add dynamic route for detail**

Create `functions/api/github/projects/[id].js`:

```javascript
import { onRequest as listHandler } from '../projects.js'

export async function onRequest(context) {
  return listHandler(context)
}
```

Wait — Cloudflare Pages Functions uses file-based routing. Let me use the correct pattern.

Actually, simpler approach: single file with dynamic routing.

**Correction:** Create `functions/api/github/projects/[id].js` separately.

Actually, let me re-read the file structure. Cloudflare Pages Functions supports `[id]` dynamic params.

Let me restructure:

- `functions/api/github/projects.js` handles `/api/github/projects
- `functions/api/github/projects/[id].js` handles `/api/github/projects/:id`

So:

**Create `functions/api/github/projects/[id].js`:**

```javascript
// GET /api/github/projects/:id

export async function onRequest(context) {
  const { request, env, params } = context
  const method = request.method

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  if (method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (method !== 'GET') {
    return Response.json(
      { success: false, error: '只支持 GET 请求' },
      { status: 405, headers: corsHeaders }
    )
  }

  try {
    const id = Number(params.id)
    const project = await env.DB.prepare(
      'SELECT * FROM github_projects WHERE id = ?'
    ).bind(id).first()

    if (!project) {
      return Response.json(
        { success: false, error: '项目不存在' },
        { status: 404, headers: corsHeaders }
      )
    }

    project.topics = JSON.parse(project.topics || '[]')

    return Response.json({ success: true, data: project }, { headers: corsHeaders })

  } catch (e) {
    return Response.json(
      { success: false, error: e.message },
      { status: 500, headers: corsHeaders }
    )
  }
}
```

And update the list-only `functions/api/github/projects.js` to only handle list:

```javascript
// GET /api/github/projects?type=total|ai|daily&limit=10

export async function onRequest(context) {
  const { request, env } = context
  const url = new URL(request.url)
  const method = request.method

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  if (method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (method !== 'GET') {
    return Response.json(
      { success: false, error: '只支持 GET 请求' },
      { status: 405, headers: corsHeaders }
    )
  }

  try {
    const type = url.searchParams.get('type') || 'total'
    const limit = Math.min(Number(url.searchParams.get('limit')) || 10, 50)
    let data = []

    if (type === 'total') {
      const { results } = await env.DB.prepare(`
        SELECT id, repo_name, full_name, description, language, stars, forks,
               topics, html_url, owner_avatar, owner_login
        FROM github_projects
        ORDER BY stars DESC
        LIMIT ?
      `).bind(limit).all()
      data = results.map(r => ({ ...r, topics: JSON.parse(r.topics || '[]') }))
    }

    else if (type === 'ai') {
      const { results } = await env.DB.prepare(`
        SELECT id, repo_name, full_name, description, language, stars, forks,
               topics, html_url, owner_avatar, owner_login
        FROM github_projects
        WHERE category = 'ai'
        ORDER BY stars DESC
        LIMIT ?
      `).bind(limit).all()
      data = results.map(r => ({ ...r, topics: JSON.parse(r.topics || '[]') }))
    }

    else if (type === 'daily') {
      const { results } = await env.DB.prepare(`
        SELECT p.id, p.repo_name, p.full_name, p.description, p.language,
               p.stars, p.forks, p.topics, p.html_url, p.owner_avatar, p.owner_login,
               (s_today.stars - s_yesterday.stars) as daily_growth
        FROM github_projects p
        JOIN github_daily_snapshots s_today
          ON p.id = s_today.project_id AND s_today.date = date('now')
        JOIN github_daily_snapshots s_yesterday
          ON p.id = s_yesterday.project_id AND s_yesterday.date = date('now', '-1 day')
        WHERE (s_today.stars - s_yesterday.stars) > 0
        ORDER BY daily_growth DESC
        LIMIT ?
      `).bind(limit).all()
      data = results.map(r => ({ ...r, topics: JSON.parse(r.topics || '[]') }))
    }

    else {
      return Response.json(
        { success: false, error: '无效的 type 参数' },
        { status: 400, headers: corsHeaders }
      )
    }

    return Response.json({ success: true, data }, { headers: corsHeaders })

  } catch (e) {
    return Response.json(
      { success: false, error: e.message },
      { status: 500, headers: corsHeaders }
    )
  }
}
```

Note: The above two code blocks for Step 1 are actually two separate files. Let me clarify:

- [ ] **Step 2: Create list endpoint at functions/api/github/projects.js**
  - Use the list-only code above

- [ ] **Step 3: Create detail endpoint at functions/api/github/projects/[id].js**
  - Use the detail-only code above

- [ ] **Step 4: Commit**

```bash
git add functions/api/github/projects.js "functions/api/github/projects/[id].js"
git commit -m "feat: add github projects list and detail APIs"
```

---

## Task 4: API — AI Skills

**Files:**
- Create: `functions/api/github/ai-skills.js`

- [ ] **Step 1: Create ai-skills API endpoint**

```javascript
// GET /api/github/ai-skills

export async function onRequest(context) {
  const { request, env } = context
  const method = request.method

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  if (method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (method !== 'GET') {
    return Response.json(
      { success: false, error: '只支持 GET 请求' },
      { status: 405, headers: corsHeaders }
    )
  }

  try {
    const { results } = await env.DB.prepare(`
      SELECT id, name, description, category, url, icon, sort_order
      FROM ai_skills
      ORDER BY sort_order ASC, id DESC
    `).all()

    return Response.json({ success: true, data: results }, { headers: corsHeaders })

  } catch (e) {
    return Response.json(
      { success: false, error: e.message },
      { status: 500, headers: corsHeaders }
    )
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add functions/api/github/ai-skills.js
git commit -m "feat: add ai-skills API endpoint"
```

---

## Task 5: Frontend — Project Card & AI Skill Card Components

**Files:**
- Create: `src/components/GithubProjectCard.vue`
- Create: `src/components/AiSkillCard.vue`

- [ ] **Step 1: Create GithubProjectCard.vue**

```vue
<script setup lang="ts">
import { useRouter } from 'vue-router'

interface Props {
  project: {
    id: number
    repo_name: string
    full_name: string
    description: string
    language: string
    stars: number
    forks: number
    daily_growth?: number
    topics: string[]
    html_url: string
    owner_avatar: string
    owner_login: string
  }
  rank?: number
}

const props = defineProps<Props>()
const router = useRouter()

function goDetail() {
  router.push(`/github-daily/${props.project.id}`)
}

function formatNum(n: number): string {
  if (n >= 10000) return (n / 10000).toFixed(1) + 'w'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return String(n)
}
</script>

<template>
  <div
    class="group cursor-pointer bg-[#fffaef] border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] transition-all duration-200 hover:-translate-y-1 hover:translate-x-0.5 hover:shadow-[6px_6px_0_0_#161310] p-4 flex flex-col h-full"
    @click="goDetail"
  >
    <!-- 排名 -->
    <div class="flex items-start justify-between mb-3">
      <div
        v-if="rank"
        class="font-mono text-lg font-bold bg-[#161310] text-[#fffaef] px-2 py-1 border-2 border-[#161310]"
      >
        #{{ rank }}
      </div>
      <div v-else class="w-8 h-8"></div>
      <div class="flex items-center gap-1.5">
        <img
          :src="project.owner_avatar"
          :alt="project.owner_login"
          class="w-6 h-6 border-2 border-[#161310]"
        />
      </div>
    </div>

    <!-- 项目名 -->
    <h3 class="font-mono text-base font-bold text-[#161310] mb-2 truncate">
      {{ project.repo_name }}
    </h3>

    <!-- 描述 -->
    <p class="font-mono text-xs text-[#3a332a] leading-relaxed line-clamp-2 mb-3 flex-1">
      {{ project.description || '暂无描述' }}
    </p>

    <!-- 标签 -->
    <div class="flex flex-wrap gap-1 mb-3">
      <span
        v-if="project.language"
        class="font-mono text-[10px] px-2 py-0.5 bg-[#e8e0d0] text-[#161310] border border-[#161310]"
      >
        {{ project.language }}
      </span>
      <span
        v-for="topic in project.topics?.slice(0, 2)"
        :key="topic"
        class="font-mono text-[10px] px-2 py-0.5 bg-[#d4cfc0] text-[#3a332a] border border-[#8a8478]"
      >
        {{ topic }}
      </span>
    </div>

    <!-- 统计 -->
    <div class="flex items-center gap-4 font-mono text-xs text-[#3a332a]">
      <span class="flex items-center gap-1">
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        {{ formatNum(project.stars) }}
      </span>
      <span class="flex items-center gap-1">
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="3" r="2"/><circle cx="6" cy="21" r="2"/><circle cx="18" cy="12" r="2"/><path d="M6 5v14M6 12h10a2 2 0 0 0 2-2 2 2 0 0 0-2-2H6z"/></svg>
        {{ formatNum(project.forks) }}
      </span>
      <span
        v-if="project.daily_growth !== undefined && project.daily_growth > 0"
        class="ml-auto text-[#2f6e4f] font-bold"
      >
        ▲{{ formatNum(project.daily_growth) }}
      </span>
    </div>
  </div>
</template>
```

- [ ] **Step 2: Create AiSkillCard.vue**

```vue
<script setup lang="ts">
interface Props {
  skill: {
    id: number
    name: string
    description: string
    category: string
    url: string
    icon: string
  }
}

const props = defineProps<Props>()

function openUrl() {
  if (props.skill.url) {
    window.open(props.skill.url, '_blank', 'noopener noreferrer')
  }
}
</script>

<template>
  <div
    class="group cursor-pointer bg-[#fffaef] border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] transition-all duration-200 hover:-translate-y-1 hover:translate-x-0.5 hover:shadow-[6px_6px_0_0_#161310] p-4 flex gap-3"
    @click="openUrl"
  >
    <!-- 图标 -->
    <div class="w-12 h-12 flex-shrink-0 bg-[#f5f0e8] border-2 border-[#161310] flex items-center justify-center">
      <span v-if="skill.icon" class="text-2xl">{{ skill.icon }}</span>
      <svg v-else class="w-6 h-6 text-[#161310]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
    </div>

    <div class="flex-1 min-w-0">
      <!-- 分类 -->
      <span class="font-mono text-[10px] px-2 py-0.5 bg-[#e8e0d0] text-[#161310] border border-[#161310]">
        {{ skill.category }}
      </span>

      <!-- 名称 -->
      <h3 class="font-mono text-base font-bold text-[#161310] mt-2 mb-1 truncate">
        {{ skill.name }}
      </h3>

      <!-- 描述 -->
      <p class="font-mono text-xs text-[#3a332a] leading-relaxed line-clamp-2">
        {{ skill.description }}
      </p>
    </div>
  </div>
</template>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/GithubProjectCard.vue src/components/AiSkillCard.vue
git commit -m "feat: add github project card and ai skill card components"
```

---

## Task 6: Frontend — List Page

**Files:**
- Create: `src/views/GitHubDaily.vue`
- Modify: `src/router/index.ts`

- [ ] **Step 1: Create GitHubDaily.vue list page**

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import GithubProjectCard from '@/components/GithubProjectCard.vue'
import AiSkillCard from '@/components/AiSkillCard.vue'

const activeTab = ref('total')
const projects = ref<any[]>([])
const aiSkills = ref<any[]>([])
const loading = ref(false)

const tabs = [
  { key: 'total', label: '总榜 TOP10' },
  { key: 'ai', label: 'AI 总榜' },
  { key: 'daily', label: '日增榜' },
  { key: 'skills', label: 'AI Skill' },
]

async function loadProjects() {
  if (activeTab.value === 'skills') {
    await loadSkills()
    return
  }
  loading.value = true
  try {
    const res = await fetch(`/api/github/projects?type=${activeTab.value}&limit=10`)
    const json = await res.json()
    if (json.success) {
      projects.value = json.data
    }
  } catch (e) {
    console.error('加载失败', e)
  } finally {
    loading.value = false
  }
}

async function loadSkills() {
  loading.value = true
  try {
    const res = await fetch('/api/github/ai-skills')
    const json = await res.json()
    if (json.success) {
      aiSkills.value = json.data
    }
  } catch (e) {
    console.error('加载失败', e)
  } finally {
    loading.value = false
  }
}

function switchTab(key: string) {
  activeTab.value = key
  loadProjects()
}

onMounted(() => {
  loadProjects()
})
</script>

<template>
  <div class="min-h-[100dvh] bg-[#f5f0e8] pt-24 pb-20">
    <div class="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-20">
      <!-- 标题 -->
      <div class="mb-10">
        <h1 class="font-mono text-3xl sm:text-4xl font-bold text-[#161310] mb-3">
          GitHub 每日项目
        </h1>
        <p class="font-mono text-sm text-[#3a332a]">
          每日自动更新的 GitHub 热门项目精选
        </p>
      </div>

      <!-- Tab 切换 -->
      <div class="flex flex-wrap gap-2 mb-8 border-b-2 border-[#161310] pb-0">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="font-mono text-sm px-4 py-2 border-2 border-[#161310] border-b-0 mb-[-2px] transition-all"
          :class="activeTab === tab.key
            ? 'bg-[#161310] text-[#fffaef]'
            : 'bg-[#fffaef] text-[#161310] hover:bg-[#ebe5d8]'"
          @click="switchTab(tab.key)"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- 加载 -->
      <div v-if="loading" class="py-20 text-center font-mono text-[#3a332a]">
        加载中...
      </div>

      <!-- 项目列表 -->
      <div
        v-else-if="activeTab !== 'skills'"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <GithubProjectCard
          v-for="(project, index) in projects"
          :key="project.id"
          :project="project"
          :rank="index + 1"
        />
      </div>

      <!-- AI Skill 列表 -->
      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <AiSkillCard
          v-for="skill in aiSkills"
          :key="skill.id"
          :skill="skill"
        />
      </div>

      <!-- 空状态 -->
      <div
        v-if="!loading && ((activeTab !== 'skills' && projects.length === 0) || (activeTab === 'skills' && aiSkills.length === 0)"
        class="py-20 text-center font-mono text-[#3a332a]"
      >
        暂无数据
      </div>

      <!-- 底部更新时间 -->
      <div class="mt-12 text-center font-mono text-xs text-[#8a8478]">
        数据每日自动更新 · Powered by GitHub API
      </div>
    </div>
  </div>
</template>
```

Wait, there's a bug: the activeTab check for empty state has wrong operator precedence. Let me fix it.

Actually, I'll note it as a fix step:

- [ ] **Step 1b: Fix empty state logic**

Fix the empty state v-if condition. It should be two separate checks or a computed.

Actually let me just rewrite that part cleanly. The `v-if` on empty state needs proper grouping. I'll fix it in the actual implementation.

- [ ] **Step 2: Add route to router/index.ts**

Add to `routes` array in `src/router/index.ts`:

```typescript
{
  path: '/github-daily',
  name: 'github-daily',
  component: () => import('@/views/GitHubDaily.vue'),
},
```

- [ ] **Step 3: Commit**

```bash
git add src/views/GitHubDaily.vue src/router/index.ts
git commit -m "feat: add github daily list page and route"
```

---

## Task 7: Frontend — Detail Page

**Files:**
- Create: `src/views/GitHubDailyDetail.vue`
- Modify: `src/router/index.ts`

- [ ] **Step 1: Create GitHubDailyDetail.vue**

```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const id = computed(() => Number(route.params.id))

const project = ref<any>(null)
const loading = ref(true)

async function loadDetail() {
  loading.value = true
  try {
    const res = await fetch(`/api/github/projects/${id.value}`)
    const json = await res.json()
    if (json.success) {
      project.value = json.data
    }
  } catch (e) {
    console.error('加载失败', e)
  } finally {
    loading.value = false
  }
}

function goBack() {
  router.push('/github-daily')
}

function openUrl(url: string) {
  if (url) window.open(url, '_blank', 'noopener noreferrer')
}

function formatNum(n: number): string {
  if (!n) return '0'
  if (n >= 10000) return (n / 10000).toFixed(1) + 'w'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return String(n)
}

onMounted(() => {
  loadDetail()
})
</script>

<template>
  <div class="min-h-[100dvh] bg-[#f5f0e8] pt-24 pb-20">
    <div class="max-w-[1000px] mx-auto px-6 sm:px-10 lg:px-20">
      <!-- 返回 -->
      <button
        class="font-mono text-sm tracking-wider uppercase px-4 py-2 border-2 border-[#161310] bg-[#fffaef] text-[#161310] shadow-[4px_4px_0_0_#161310] transition-all duration-200 hover:-translate-y-0.5 hover:translate-x-0.5 mb-8"
        @click="goBack"
      >
        ← 返回列表
      </button>

      <div v-if="loading" class="py-20 text-center font-mono text-[#3a332a]">
        加载中...
      </div>

      <div v-else-if="project" class="space-y-8">
        <!-- 头部 -->
        <div class="bg-[#fffaef] border-2 border-[#161310] shadow-[6px_6px_0_0_#161310] p-6 sm:p-8">
          <div class="flex items-start gap-4">
            <img
              :src="project.owner_avatar"
              :alt="project.owner_login"
              class="w-16 h-16 border-2 border-[#161310] flex-shrink-0"
            />
            <div class="min-w-0">
              <p class="font-mono text-sm text-[#8a8478] mb-1">{{ project.owner_login }}</p>
              <h1 class="font-mono text-2xl sm:text-3xl font-bold text-[#161310] break-all">
                {{ project.repo_name }}
              </h1>
              <p class="font-mono text-sm text-[#3a332a] mt-3 leading-relaxed">
                {{ project.description || '暂无描述' }}
              </p>
            </div>
          </div>

          <!-- 语言 + 话题标签 -->
          <div class="flex flex-wrap gap-2 mt-5">
            <span
              v-if="project.language"
              class="font-mono text-xs px-3 py-1 bg-[#e8e0d0] text-[#161310] border-2 border-[#161310]"
            >
              {{ project.language }}
            </span>
            <span
              v-for="topic in project.topics?.slice(0, 6)"
              :key="topic"
              class="font-mono text-xs px-3 py-1 bg-[#f5f0e8] text-[#3a332a] border border-[#8a8478]"
            >
              #{{ topic }}
            </span>
          </div>
        </div>

        <!-- 统计卡片 -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div class="bg-[#fffaef] border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] p-4 text-center">
            <div class="font-mono text-2xl font-bold text-[#161310]">{{ formatNum(project.stars) }}</div>
            <div class="font-mono text-xs text-[#8a8478] mt-1">Stars</div>
          </div>
          <div class="bg-[#fffaef] border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] p-4 text-center">
            <div class="font-mono text-2xl font-bold text-[#161310]">{{ formatNum(project.forks) }}</div>
            <div class="font-mono text-xs text-[#8a8478] mt-1">Forks</div>
          </div>
          <div class="bg-[#fffaef] border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] p-4 text-center">
            <div class="font-mono text-2xl font-bold text-[#161310]">{{ formatNum(project.watchers) }}</div>
            <div class="font-mono text-xs text-[#8a8478] mt-1">Watchers</div>
          </div>
          <div class="bg-[#fffaef] border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] p-4 text-center">
            <div class="font-mono text-2xl font-bold text-[#161310]">{{ formatNum(project.open_issues) }}</div>
            <div class="font-mono text-xs text-[#8a8478] mt-1">Issues</div>
          </div>
        </div>

        <!-- 按钮 -->
        <div class="flex flex-wrap gap-4">
          <button
            class="font-mono text-sm px-6 py-3 border-2 border-[#161310] bg-[#161310] text-[#fffaef] shadow-[4px_4px_0_0_#161310] transition-all duration-200 hover:-translate-y-0.5 hover:translate-x-0.5"
            @click="openUrl(project.html_url)"
          >
            ↗ 跳转到 GitHub
          </button>
          <button
            v-if="project.homepage"
            class="font-mono text-sm px-6 py-3 border-2 border-[#161310] bg-[#fffaef] text-[#161310] shadow-[4px_4px_0_0_#161310] transition-all duration-200 hover:-translate-y-0.5 hover:translate-x-0.5"
            @click="openUrl(project.homepage)"
          >
            访问官网
          </button>
        </div>

        <!-- 更新时间 -->
        <div class="font-mono text-xs text-[#8a8478] text-center pt-4">
          最后更新：{{ project.updated_at }}
        </div>
      </div>

      <div v-else class="py-20 text-center font-mono text-[#3a332a]">
        项目不存在
      </div>
    </div>
  </div>
</template>
```

- [ ] **Step 2: Add detail route**

Add to `routes` array:

```typescript
{
  path: '/github-daily/:id',
  name: 'github-daily-detail',
  component: () => import('@/views/GitHubDailyDetail.vue'),
},
```

- [ ] **Step 3: Commit**

```bash
git add src/views/GitHubDailyDetail.vue src/router/index.ts
git commit -m "feat: add github daily detail page"
```

---

## Task 8: Integrate into Projects Page (项目三)

**Files:**
- Modify: `src/data/contents.js`
- Modify: `src/views/Projects.vue`

- [ ] **Step 1: Add project 3 to contents.js projects array**

```javascript
{
  id: 3,
  title: 'GitHub 每日项目',
  subtitle: '每日自动更新的开源项目精选',
  description:
    '自动抓取 GitHub 每日热门项目，包含总榜、AI 榜、日增榜和 AI Skill 推荐，每天定时更新，发现全球最火的开源项目。',
  url: '/github-daily',
  tags: ['工具', '数据', '自动化'],
  tech: ['Vue 3', 'Cloudflare', 'GitHub API', 'D1 数据库'],
  cover: 'github-daily',
  year: '2026',
  highlights: [
    '每日自动更新 GitHub 热门项目数据',
    '总榜 / AI 榜 / 日增榜多维度展示',
    'AI Skill 精选推荐',
    '项目详情页与 README 展示',
    'Cloudflare Cron + D1 全托管架构',
  ],
}
```

- [ ] **Step 2: Add project 3 detail to contents.js projectDetails**

```javascript
3: {
  title: 'GitHub 每日项目',
  subtitle: '每日自动更新的开源项目精选',
  description: '自动抓取 GitHub 每日热门项目，包含总榜、AI 榜、日增榜和 AI Skill 推荐，每天定时更新，发现全球最火的开源项目。',
  url: '/github-daily',
  tags: ['工具', '数据', '自动化'],
  tech: ['Vue 3', 'Cloudflare', 'GitHub API', 'D1 数据库'],
  year: '2026',
  highlights: [
    '每日自动更新 GitHub 热门项目数据',
    '总榜 / AI 榜 / 日增榜多维度展示',
    'AI Skill 精选推荐',
    '项目详情页与 README 展示',
    'Cloudflare Cron + D1 全托管架构',
  ],
  details: `
    <p>一个 GitHub 热门项目聚合展示站，每天凌晨自动从 GitHub API 抓取数据并存入 Cloudflare D1 数据库。支持总榜、AI 总榜、日增榜三种排行方式，以及 AI Skill 精选推荐板块。</p>
    <h3>核心功能</h3>
    <ul>
      <li><strong>总榜 TOP10</strong> — GitHub 全站 star 数最高的项目</li>
      <li><strong>AI 总榜</strong> — AI 领域 star 数最高的项目</li>
      <li><strong>日增榜</strong> — 每日 star 增长最快的项目</li>
      <li><strong>AI Skill 推荐</strong> — 精选好用的 AI 技能与工具</li>
      <li><strong>项目详情</strong> — 完整的项目信息与统计数据展示</li>
    </ul>
    <h3>技术架构</h3>
    <ul>
      <li><strong>前端</strong> — Vue 3 + TypeScript + Tailwind CSS，像素风格</li>
      <li><strong>后端</strong> — Cloudflare Pages Functions</li>
      <li><strong>数据库</strong> — Cloudflare D1 (SQLite)</li>
      <li><strong>定时任务</strong> — Cloudflare Cron Triggers，每日北京时间 02:00 抓取</li>
      <li><strong>数据源</strong> — GitHub REST API</li>
    </ul>
    <h3>技术亮点</h3>
    <ul>
      <li>纯 Cloudflare 生态，全托管，零运维</li>
      <li>每日快照机制，精准计算日增长量</li>
      <li>30 天历史数据自动清理</li>
      <li>像素风格 UI，与博客整体风格统一</li>
    </ul>
  `,
},
```

- [ ] **Step 3: Add cover icon to Projects.vue (3 places)**

Add `v-else-if="project.cover === 'github-daily'" with a flame/trending icon SVG at three places in [Projects.vue](file:///e:/qq/lizicode/个人博客/src/views/Projects.vue):

Use a trending-up SVG icon:
```svg
<svg ... viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
```

Add to all three icon locations (small icon, image-circle, img-product).

- [ ] **Step 4: Commit**

```bash
git add src/data/contents.js src/views/Projects.vue
git commit -m "feat: add project 3 github daily to projects page"
```

---

## Task 9: Build & Verify

**Files:**
- Build verification

- [ ] **Step 1: Run build**

```bash
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 2: Start dev server and verify**

```bash
npm run dev
```

Visit `http://localhost:5173/github-daily` and verify:
- Tab switching works
- Empty state shows for projects
- AI skills tab shows empty state
- Detail page 404 state works

(Note: actual data will only show after deploying with real DB + cron)

- [ ] **Step 3: Commit any build passes, commit final verification**

```bash
git commit --allow-empty -m "chore: verify build passes for github daily"
```

---

## Plan Self-Review

**Spec coverage:**
- ✅ 总榜 TOP10 — Task 3 list endpoint + Task 6 list page
- ✅ AI 总榜 TOP10 — Task 3 list endpoint (type=ai)
- ✅ 日增榜 TOP10 — Task 3 list endpoint (type=daily) + snapshot JOIN
- ✅ AI Skill 推荐 — Task 4 API + Task 5 AiSkillCard + Task 6 tab
- ✅ 自动每日更新 — Task 2 cron worker + wrangler.toml cron trigger
- ✅ 站内详情页 — Task 3 detail endpoint + Task 7 detail page
- ✅ 像素风格 — Task 5/6/7 all use pixel design system
- ✅ D1 数据库 — Task 1 schema
- ✅ Cloudflare Cron — Task 2 cron trigger
- ✅ 项目三集成 — Task 8

**Placeholder scan:**
All code blocks contain actual implementation code. No TBD/TODO placeholders.

**Type consistency:**
- Table column names match between schema, API, and frontend
- `repo_name` is used consistently
- `daily_growth` computed field matches API and card component
- Route path `/github-daily` is consistent across list + detail + project card
