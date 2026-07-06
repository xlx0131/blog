# GitHub 热榜项目设计文档

> 项目三：每日自动更新的 GitHub 热门项目精选页面

## 1. 项目概述

### 1.1 目标
在个人博客中新增一个「GitHub 热榜」项目页面，展示每日自动更新的 GitHub 热门开源项目，支持按语言、领域筛选和关键词搜索，提供项目详情展示。

### 1.2 核心功能
- 📊 **热门项目展示** — 按分类展示 GitHub 热门开源项目
- 🔍 **搜索功能** — 支持按项目名、描述、话题搜索
- 🏷️ **多维筛选** — 按编程语言 + 领域/话题双维度筛选
- 📈 **排序选项** — 按 Stars 总数 / 今日新增 / 更新时间排序
- 📄 **项目详情** — 展示项目介绍、README 摘要、统计数据
- ⏰ **每日更新** — GitHub Actions 每日定时自动爬取并更新数据
- 💾 **历史积累** — 每天新增项目数据，保留历史收录记录

### 1.3 设计风格
- 延续全站像素风格（Pixel Art）
- 米黄色背景 `#f5f0e8` + 深棕色文字 `#161310`
- 硬边框、硬阴影、像素字体（Pixelify Sans / VT323）
- 与现有项目页、收藏夹页保持视觉一致性

---

## 2. 技术架构

### 2.1 技术选型

| 层级 | 技术 | 说明 |
|------|------|------|
| 前端 | Vue 3 + TypeScript | 与现有项目保持一致 |
| 样式 | 原生 CSS (scoped) | 像素风格自定义样式 |
| 数据存储 | JSON 文件 | 静态数据，前端直接引用 |
| 数据爬取 | Node.js 脚本 | 调用 GitHub API 获取热门项目 |
| 定时任务 | GitHub Actions | 每日定时运行爬取脚本 |
| 部署 | 静态页面 | 与博客一起部署 |

### 2.2 架构图

```
┌─────────────────────────────────────────────────────────┐
│                     前端 (Vue 3)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  项目列表页   │  │  项目详情页   │  │  搜索/筛选   │   │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘   │
│         │                  │                  │           │
│         └──────────────────┼──────────────────┘           │
│                            │                              │
│                  ┌─────────▼─────────┐                    │
│                  │ github-projects.json │                 │
│                  └────────────────────┘                    │
└──────────────────────────────────────────────────────────┘
                            ▲
                            │ 每日更新
                            │
┌──────────────────────────────────────────────────────────┐
│                   GitHub Actions                          │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ 1. 定时触发 (每天 02:00 CST)                         │ │
│  │ 2. 运行 fetch-github.js 爬取 GitHub API             │ │
│  │ 3. 合并数据，去重，更新 JSON 文件                     │ │
│  │ 4. 自动 commit + push 到仓库                         │ │
│  └──────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
                            ▲
                            │
                  ┌─────────▼─────────┐
                  │   GitHub API       │
                  │  /search/repos     │
                  └────────────────────┘
```

### 2.3 为什么选这个方案
- **简单可靠** — 纯静态，无服务器依赖，不会挂
- **完全免费** — GitHub Actions 免费额度够用
- **性能好** — 前端直接读 JSON，首屏快
- **易于维护** — 逻辑简单，出问题好排查

---

## 3. 数据结构设计

### 3.1 JSON 文件结构
位置：`src/data/github-projects.json`

```typescript
interface GithubProject {
  id: number;                    // 自增ID
  name: string;                  // 项目名 (短名)
  fullName: string;              // 完整名 (owner/repo)
  description: string;           // 项目描述
  language: string;              // 主要编程语言
  topics: string[];              // 话题标签
  stars: number;                 // Stars 总数
  forks: number;                 // Forks 总数
  watchers: number;              // Watchers 数
  openIssues: number;            // 未解决 Issues 数
  htmlUrl: string;               // GitHub 仓库地址
  homepage: string | null;       // 项目官网
  license: string | null;        // 开源协议
  readmeSummary: string;         // README 摘要 (前500字)
  addedDate: string;             // 收录日期 (YYYY-MM-DD)
  lastUpdatedDate: string;       // 最近更新日期 (YYYY-MM-DD)
  todayStars?: number;           // 今日新增 Stars (可选)
}

interface GithubData {
  lastUpdated: string;           // 数据最后更新时间
  totalProjects: number;         // 项目总数
  projects: GithubProject[];     // 项目列表
}
```

### 3.2 分类维度

**编程语言：**
- JavaScript / TypeScript / Python / Go / Rust / Java / C++ / Ruby / PHP / 其他

**领域/话题：**
- 前端 (frontend)
- 后端 (backend)
- AI / 机器学习 (ai, ml)
- 开发工具 (devtools)
- 游戏 (game)
- 设计资源 (design)
- 数据库 (database)
- DevOps (devops)
- 移动端 (mobile)
- 其他 (other)

---

## 4. 前端页面设计

### 4.1 路由设计

| 路由 | 页面 | 说明 |
|------|------|------|
| `/github-hot` | GitHubHot.vue | 项目列表页（也可作为项目三） |
| `/github-hot/:id` | GithubHotDetail.vue | 项目详情页 |

> 同时在项目列表页 `/projects` 中作为「项目三」展示，点击跳转到 `/github-hot`

### 4.2 列表页 (GitHubHot.vue)

#### 页面结构（从上到下）：

**1. 标题区**
- 左侧：
  - 小副标题：「项目三」或「GITHUB HOT」
  - 大标题：「GitHub 热榜」
  - 描述：「每日自动更新的 GitHub 热门项目精选」
- 右侧：
  - 最后更新时间（如：更新于 2026-07-06 02:00）
  - 数据状态徽章

**2. 搜索框**
- 左侧搜索图标
- 输入框，placeholder：「搜索项目名称、描述或话题...」
- 右侧「/」快捷键提示
- 按 `/` 快速聚焦

**3. 筛选区**
- 第一行：语言筛选标签
  - 全部、JavaScript、TypeScript、Python、Go、Rust、Java、更多...
- 第二行：领域筛选标签
  - 全部、前端、后端、AI/ML、开发工具、游戏、设计资源、数据库、DevOps
- 选中状态：深色背景 + 浅色文字 + 硬阴影
- 未选中状态：浅色背景 + 深色文字

**4. 排序选项**
- 「按 Stars 数」「按今日新增」「按更新时间」
- 单选按钮或标签样式

**5. 项目卡片网格**
- 布局：4 列（大屏）/ 3 列（中屏）/ 2 列（平板）/ 1 列（手机）
- 间距：gap-6
- 每张卡片内容：
  ```
  ┌─────────────────────────────────┐
  │  ● JavaScript    NEW  ⭐ 12.3k  │
  │  project-name                    │
  │                                  │
  │  这是项目描述，两行截断显示...    │
  │                                  │
  │  🍴 1.2k    查看详情 ▸           │
  └─────────────────────────────────┘
  ```
  - 左上角：语言标签（彩色小圆点 + 语言名）
  - 右上角：NEW 徽章（如果是今天新收录的）
  - 标题：项目名称（大字体，Pixelify Sans）
  - 描述：两行截断
  - 底部：Forks 数 + 「查看详情 ▸」按钮
  - Stars 数可以放在右上角或标题下面

**6. 空状态**
- 搜索/筛选无结果时显示
- 像素风格的「?」图标 + 提示文字

#### 交互细节：
- 卡片 hover：轻微上浮 + 阴影加大
- 点击卡片：进入详情页
- 筛选标签：点击切换，支持多维度叠加（语言 + 领域）
- 搜索：实时过滤，防抖 200ms

### 4.3 详情页 (GithubHotDetail.vue)

#### 页面结构：

**1. 返回按钮 + 面包屑**
- 「← 返回列表」按钮
- 面包屑：首页 / GitHub 热榜 / 项目名

**2. 项目头部信息**
- 项目名（大标题）
- 完整路径（owner/repo）
- 语言标签
- 一排统计数据：⭐ Stars / 🍴 Forks / 👀 Watchers / 🐛 Issues

**3. 项目描述**
- 完整的项目描述文字

**4. README 摘要**
- README 前几段内容
- 太长的话可以折叠/展开

**5. 项目信息卡片**
- 开源协议
- 收录日期
- 最近更新
- 项目官网（如果有）

**6. 操作按钮**
- 主按钮：「在 GitHub 上查看 →」（跳转到 GitHub）
- 次按钮：「访问官网」（如果有 homepage）

---

## 5. 数据爬取与更新

### 5.1 爬取脚本
位置：`scripts/fetch-github.js`

**功能：**
1. 调用 GitHub Search API 获取热门项目
2. 按语言和分类分别爬取
3. 读取现有 JSON 数据
4. 合并新旧数据（按 fullName 去重）
5. 更新项目的 stars 等动态数据
6. 新收录的项目添加 addedDate
7. 写入 JSON 文件

**爬取策略：**
- 按语言分别搜索：JavaScript、TypeScript、Python、Go、Rust、Java 等
- 每个语言取 top 10-20 个项目
- 按 stars 数降序排列
- 使用 GitHub Personal Access Token 提高 rate limit

### 5.2 GitHub Actions 工作流
位置：`.github/workflows/github-hot.yml`

**触发条件：**
- 定时：每天北京时间 02:00
- 手动触发：workflow_dispatch

**工作流程：**
1. checkout 仓库
2. 设置 Node.js 环境
3. 运行爬取脚本
4. 检查是否有变更
5. 如有变更，自动 commit + push

### 5.3 GitHub API 使用
- 接口：`GET /search/repositories`
- 认证：使用 GitHub Token（secrets.GITHUB_TOKEN 或个人 token）
- 搜索参数示例：
  ```
  q=stars:>1000 language:javascript topic:frontend
  sort=stars
  order=desc
  per_page=20
  ```

---

## 6. 项目列表页集成

### 6.1 在 projects 数据中添加项目三
在 `src/data/contents.js` 的 `projects` 数组中添加：
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
  ]
}
```

### 6.2 点击跳转
- 在项目列表页点击「项目三」卡片
- 跳转到 `/github-hot` 页面
- 而不是 `/projects/3`（如果不想做通用的项目详情页）

---

## 7. 实施步骤

1. **创建数据文件** — 初始化 `github-projects.json`，添加示例数据
2. **创建列表页组件** — GitHubHot.vue，实现布局和筛选搜索
3. **创建详情页组件** — GithubHotDetail.vue，展示项目详情
4. **配置路由** — 添加 `/github-hot` 和 `/github-hot/:id` 路由
5. **集成到项目页** — 在 projects 数据中添加项目三
6. **编写爬取脚本** — fetch-github.js，调用 GitHub API
7. **配置 GitHub Actions** — 定时工作流
8. **测试验证** — 本地测试 + 手动触发一次工作流

---

## 8. 后续可扩展功能

- 🔥 **Trending 趋势** — 展示近一周/一月上升最快的项目
- 📊 **历史趋势图** — 展示项目 Stars 增长曲线
- ⭐ **个人收藏** — 登录后可以收藏喜欢的项目
- 📧 **订阅推送** — 每周邮件推送热门项目
- 🌙 **深色模式** — 像素风深色主题
- 📱 **PWA** — 可以添加到桌面

