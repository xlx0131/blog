import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.resolve(__dirname, '../src/data/github-projects.json');

const LANGUAGES = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Go',
  'Rust',
  'Java',
  'C++',
  'Ruby',
  'PHP'
];

const TOPIC_CATEGORIES = {
  frontend: ['frontend', 'ui', 'component', 'vue', 'react', 'angular', 'svelte', 'css', 'html'],
  backend: ['backend', 'server', 'api', 'framework', 'node', 'django', 'flask', 'spring'],
  ai: ['ai', 'ml', 'machine-learning', 'deep-learning', 'neural-network', 'llm', 'gpt'],
  devtools: ['devtools', 'cli', 'editor', 'ide', 'vscode', 'debug', 'build', 'compiler'],
  game: ['game', 'game-engine', 'unity', 'unreal', 'pixel', 'retro'],
  design: ['design', 'uiux', 'icon', 'font', 'template', 'figma'],
  database: ['database', 'db', 'sql', 'nosql', 'redis', 'mongodb', 'postgres', 'mysql'],
  devops: ['devops', 'docker', 'kubernetes', 'k8s', 'ci', 'cd', 'deploy', 'cloud', 'terraform'],
  mobile: ['mobile', 'android', 'ios', 'react-native', 'flutter', 'swift', 'kotlin']
};

const PER_PAGE = 15;
const REQUEST_DELAY = 1000;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}

function categorizeTopics(description, topics) {
  const text = `${description || ''} ${(topics || []).join(' ')}`.toLowerCase();
  const categories = [];

  for (const [category, keywords] of Object.entries(TOPIC_CATEGORIES)) {
    if (keywords.some(keyword => text.includes(keyword.toLowerCase()))) {
      categories.push(category);
    }
  }

  return categories.length > 0 ? categories : ['other'];
}

function buildSummary(description) {
  if (!description) return '';
  return description.length > 300 ? description.slice(0, 300) + '...' : description;
}

async function fetchReposForLanguage(language) {
  const url = `https://api.github.com/search/repositories?q=stars:>1000+language:${encodeURIComponent(language)}&sort=stars&order=desc&per_page=${PER_PAGE}`;
  
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'blog-github-hot'
  };

  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
  }

  console.log(`  → 正在爬取 ${language}...`);

  const response = await fetch(url, { headers });
  
  if (!response.ok) {
    const remaining = response.headers.get('X-RateLimit-Remaining');
    const reset = response.headers.get('X-RateLimit-Reset');
    console.error(`  ✗ ${language} 请求失败: ${response.status} ${response.statusText}`);
    if (remaining === '0') {
      const resetTime = new Date(parseInt(reset) * 1000);
      console.error(`    Rate limit 耗尽，重置时间: ${resetTime.toLocaleString()}`);
    }
    return [];
  }

  const data = await response.json();
  console.log(`  ✓ ${language}: 爬取到 ${data.items.length} 个项目`);
  return data.items || [];
}

function readExistingData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('读取现有数据失败，将创建新文件:', err.message);
  }
  return { lastUpdated: '', totalProjects: 0, projects: [] };
}

function mapRepoToProject(repo) {
  const topicsFromGithub = repo.topics || [];
  const categories = categorizeTopics(repo.description, topicsFromGithub);
  const allTopics = [...new Set([...categories, ...topicsFromGithub])];

  return {
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description || '',
    language: repo.language || '',
    topics: allTopics,
    stars: repo.stargazers_count || 0,
    forks: repo.forks_count || 0,
    watchers: repo.watchers_count || 0,
    openIssues: repo.open_issues_count || 0,
    htmlUrl: repo.html_url,
    homepage: repo.homepage && repo.homepage.trim() !== '' ? repo.homepage : null,
    license: repo.license ? repo.license.spdx_id : null,
    readmeSummary: buildSummary(repo.description),
    addedDate: getTodayDate(),
    lastUpdatedDate: getTodayDate()
  };
}

function mergeProjects(existingProjects, newRepos) {
  const projectMap = new Map();

  for (const project of existingProjects) {
    projectMap.set(project.fullName, { ...project });
  }

  let addedCount = 0;
  let updatedCount = 0;

  for (const repo of newRepos) {
    const mapped = mapRepoToProject(repo);
    const existing = projectMap.get(mapped.fullName);

    if (existing) {
      existing.stars = mapped.stars;
      existing.forks = mapped.forks;
      existing.watchers = mapped.watchers;
      existing.openIssues = mapped.openIssues;
      existing.lastUpdatedDate = mapped.lastUpdatedDate;
      existing.description = mapped.description;
      existing.topics = mapped.topics;
      existing.homepage = mapped.homepage;
      existing.license = mapped.license;
      existing.readmeSummary = mapped.readmeSummary;
      updatedCount++;
    } else {
      projectMap.set(mapped.fullName, mapped);
      addedCount++;
    }
  }

  const projects = Array.from(projectMap.values())
    .sort((a, b) => b.stars - a.stars)
    .map((project, index) => ({ ...project, id: index + 1 }));

  return { projects, addedCount, updatedCount };
}

async function main() {
  console.log('========================================');
  console.log('  GitHub 热榜项目爬取');
  console.log('========================================');
  console.log('');

  const existingData = readExistingData();
  console.log(`现有项目: ${existingData.totalProjects} 个`);
  console.log('');

  const allRepos = [];

  for (let i = 0; i < LANGUAGES.length; i++) {
    const lang = LANGUAGES[i];
    const repos = await fetchReposForLanguage(lang);
    allRepos.push(...repos);
    
    if (i < LANGUAGES.length - 1) {
      await sleep(REQUEST_DELAY);
    }
  }

  console.log('');
  console.log(`共爬取到 ${allRepos.length} 个项目（含重复）`);
  console.log('');

  const { projects, addedCount, updatedCount } = mergeProjects(existingData.projects, allRepos);

  const result = {
    lastUpdated: new Date().toISOString(),
    totalProjects: projects.length,
    projects
  };

  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(result, null, 2), 'utf-8');

  console.log('========================================');
  console.log('  爬取完成');
  console.log('========================================');
  console.log(`  总项目数: ${projects.length}`);
  console.log(`  新增项目: +${addedCount}`);
  console.log(`  更新项目: ~${updatedCount}`);
  console.log(`  数据文件: ${DATA_FILE}`);
  console.log('========================================');
}

main().catch(err => {
  console.error('爬取失败:', err);
  process.exit(1);
});
