# GitHub 每日项目（项目三）设计文档

## 一、项目概述

一个 GitHub 热门项目聚合展示站，作为个人博客的项目三。包含总榜、AI 总榜、日增榜和 AI Skill 推荐四个板块，数据自动每日更新，像素风格设计。

## 二、功能模块

| 模块 | 说明 | 数据来源 |
|------|------|----------|
| 总榜 TOP10 | GitHub 收藏数最多的项目 | GitHub API 自动抓取 |
| AI 总榜 TOP10 | AI 相关收藏数最多的项目 | GitHub API 自动抓取 |
| 日增榜 TOP10 | 每日 star 增长最快的项目 | 每日快照差值计算 |
| AI Skill 推荐 | AI 技能/工具/提示词推荐 | 手动维护 |

## 三、技术架构

### 整体架构

```
┌─────────────────────────────────────────────────────┐
│                    前端 (Vue 3)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │
│  │ 列表页    │  │ 详情页    │  │ AI Skill 卡片     │   │
│  │ (Tab 切换)│  │          │  │                  │   │
│  └────┬─────┘  └────┬─────┘  └──────────────────┘   │
│       │              │                                │
│       └──────┬───────┘                                │
│              │                                        │
│     Pages Functions (API)                             │
└──────────────┼────────────────────────────────────────┘
               │
     ┌─────────┴──────────┐
     │                    │
   D1 数据库        GitHub API
     │                    │
  ┌──┴───┐          ┌─────┴─────┐
  │项目表 │          │ Cron 定时任务│
  │快照表 │          │ (每天凌晨)  │
  │Skill表│          └───────────┘
  └──────┘
```

### 技术栈

- **前端**：Vue 3 + Vite + Tailwind CSS + shadcn-vue（像素风格）
- **后端**：Cloudflare Pages Functions
- **数据库**：Cloudflare D1（SQLite）
- **定时任务**：Cloudflare Cron Triggers
- **数据源**：GitHub REST API

## 四、数据库设计

### 表1：github_projects（项目基础信息）

```sql
CREATE TABLE IF NOT EXISTS github_projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  repo_name TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
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
```

### 表2：github_daily_snapshots（每日快照）

```sql
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
```

### 表3：ai_skills（AI Skill 推荐）

```sql
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
```

### 索引

```sql
CREATE INDEX IF NOT EXISTS idx_projects_stars ON github_projects(stars DESC);
CREATE INDEX IF NOT EXISTS idx_projects_category ON github_projects(category);
CREATE INDEX IF NOT EXISTS idx_snapshots_date ON github_daily_snapshots(date);
CREATE INDEX IF NOT EXISTS idx_snapshots_project ON github_daily_snapshots(project_id);
CREATE INDEX IF NOT EXISTS idx_skills_sort ON ai_skills(sort_order ASC);
```

## 五、接口设计

### 列表接口

**GET /api/github/projects**

查询参数：
- `type`：`total`（总榜）| `ai`（AI总榜）| `daily`（日增榜）
- `limit`：返回数量，默认 10

返回示例：
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "repo_name": "vuejs/core",
      "full_name": "vuejs/core",
      "description": "🖖 Vue.js is a progressive, incrementally-adoptable JavaScript framework...",
      "language": "TypeScript",
      "stars": 48000,
      "forks": 7200,
      "daily_growth": 128,
      "topics": ["vue", "framework", "frontend"],
      "html_url": "https://github.com/vuejs/core",
      "owner_avatar": "https://...",
      "owner_login": "vuejs"
    }
  ]
}
```

### 详情接口

**GET /api/github/projects/:id**

返回项目完整信息，含 README 摘要。

### AI Skill 接口

**GET /api/github/ai-skills**

返回 AI Skill 列表，按 sort_order 排序。

## 六、数据抓取逻辑

### Cron 定时任务

- 触发时间：每天北京时间 02:00
- Cron 表达式：`0 18 * * *`（UTC 时间 18:00 = 北京时间 02:00）

### 抓取流程

1. **抓取总榜**：调用 GitHub Search API
   - `GET /search/repositories?q=stars:>1000&sort=stars&order=desc&per_page=50`
   - 前 50 个项目入库 / 更新

2. **抓取 AI 榜**：调用 GitHub Search API
   - `GET /search/repositories?q=topic:ai+stars:>500&sort=stars&order=desc&per_page=50`
   - 标记 category = 'ai'

3. **插入今日快照**：为每个项目插入一条当天的 star/fork 快照

4. **清理旧数据**：删除 30 天前的快照数据

### 日增榜计算

```sql
SELECT 
  p.*,
  (s_today.stars - s_yesterday.stars) as daily_growth
FROM github_projects p
JOIN github_daily_snapshots s_today ON p.id = s_today.project_id AND s_today.date = date('now')
JOIN github_daily_snapshots s_yesterday ON p.id = s_yesterday.project_id AND s_yesterday.date = date('now', '-1 day')
ORDER BY daily_growth DESC
LIMIT 10
```

## 七、前端页面设计

### 1. 列表页（/github-daily）

**布局结构：**
- 页面标题：「GitHub 每日项目」
- Tab 切换栏：总榜 TOP10 | AI 总榜 | 日增榜 | AI Skill 推荐
- 卡片网格列表（响应式：1/2/3/4 列）
- 底部更新时间提示

**项目卡片元素：**
- 排名序号徽章（像素风格 1-10）
- 作者头像 + 项目名
- 项目描述（2 行截断）
- 语言标签
- Star 数 / Fork 数
- 日增榜额外显示：▲xxx 今日新增
- 像素风格边框 + 悬停微位移效果

**AI Skill 卡片元素：**
- 图标（可选）
- Skill 名称
- 简短描述
- 分类标签
- 点击跳转外部链接

### 2. 详情页（/github-daily/:id）

**布局结构：**
- 面包屑导航
- 项目头部：头像 + 名称 + 作者 + 描述
- 统计卡片：Stars / Forks / Watchers / Issues（四个像素风格数字卡片）
- README 摘要区域
- 话题标签云
- 操作按钮：「跳转到 GitHub」「访问官网」
- 底部信息：更新时间、语言

### 3. 风格规范

- 保持全站像素风格统一
- 配色：米黄色背景 + 深棕色文字 + 像素边框
- 字体：Pixelify Sans + 等宽字体
- 交互：硬边、像素阴影、无圆角

## 八、部署配置

### 环境变量

- `GITHUB_TOKEN`：GitHub Personal Access Token（用于提高 API 速率限制）

### wrangler.toml 配置

- 添加 Cron Triggers
- 绑定 D1 数据库（已存在）

### 数据库初始化

部署后执行：
```bash
wrangler d1 execute blog-db --file=schema.sql
```

## 九、文件结构

```
functions/api/github/
  ├── projects.js        # 项目列表/详情接口
  ├── ai-skills.js       # AI Skill 接口
  └── cron.js            # Cron 定时任务
src/
  ├── views/
  │   ├── GitHubDaily.vue       # 列表页
  │   └── GitHubDailyDetail.vue # 详情页
  ├── components/
  │   ├── GithubProjectCard.vue # 项目卡片
  │   └── AiSkillCard.vue       # AI Skill 卡片
  └── data/
      └── ...
```
