-- Cloudflare D1 数据库 Schema
-- 部署后运行: wrangler d1 execute blog-db --file=schema.sql

CREATE TABLE IF NOT EXISTS articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  excerpt TEXT NOT NULL DEFAULT '',
  date TEXT NOT NULL DEFAULT (date('now')),
  category TEXT NOT NULL DEFAULT '技术',
  tags TEXT NOT NULL DEFAULT '[]',
  slug TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS bookmark_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS bookmarks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  desc TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (category_id) REFERENCES bookmark_categories(id) ON DELETE CASCADE
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_bookmarks_category ON bookmarks(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_date ON articles(date DESC);

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
