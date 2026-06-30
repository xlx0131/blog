# 许立鑫 · 个人博客

个人博客站点，包含博客文章、项目展示、收藏夹、网络运维模拟器等功能。

## 技术栈

| 技术 | 用途 |
|---|---|
| **Vue 3** (Composition API) | 前端框架 |
| **Vite 6** | 构建工具 |
| **Tailwind CSS v4** | 样式框架 |
| **GSAP + ScrollTrigger** | 页面动画和滚动交互 |
| **TypeScript** | 类型安全 |
| **Cloudflare Pages** | 部署托管 |

## 功能模块

| 页面 | 路由 | 说明 |
|---|---|---|
| 首页 | `/` | 个人介绍、精选文章 |
| 归档 | `/archive` | 按年份和标签浏览文章 |
| 项目 | `/projects` | 个人项目展示 |
| 关于 | `/about` | 简历、技能、联系方式 |
| 收藏夹 | `/bookmarks` | 收藏的网站（分类展示） |
| 网络运维模拟器 | `/network-game` | 交互式网络故障排查游戏 |
| 管理后台 | `/admin` | 文章和收藏夹管理（需登录） |

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 管理后台

访问 `/admin` 页面（无导航入口，需手动输入 URL）：

- **账号**: `admin`
- **密码**: `xlx1234`

支持文章和收藏夹的增删改查，数据存储在浏览器 localStorage 中。

## 网络运维模拟器

内置 13 个关卡，从物理层到应用层的真实网络故障排查场景：

| 关卡 | 难度 | 说明 |
|---|---|---|
| ①-③ | 📖 教学 | 认识拓扑、常用命令、IP 与端口 |
| ④-⑤ | ⭐ 实战 | 网线松动、交换机端口关闭 |
| ⑥-⑧ | ⭐⭐ 实战 | IP 冲突、VLAN 错误、DNS 故障 |
| ⑨-⑬ | ⭐⭐⭐ 实战 | 整层断网、光模块故障、ACL 策略等 |

## 部署

项目使用 Vite 构建，部署到 Cloudflare Pages：

```bash
npm run build
npx wrangler pages deploy dist --project-name=blog
```

## 数据库（开发中）

项目包含 Cloudflare D1 数据库 schema 文件 `schema.sql`，后续可将 localStorage 的管理后台数据迁移到云端数据库。

## 许可证

MIT
