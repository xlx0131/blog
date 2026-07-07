<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import GithubProjectCard from '@/components/GithubProjectCard.vue'
import AiSkillCard from '@/components/AiSkillCard.vue'

interface GithubProject {
  id: number | string
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

interface AiSkill {
  id: number | string
  name: string
  description: string
  category: string
  url?: string
  icon?: string
}

type TabType = 'total' | 'ai' | 'daily'

const activeTab = ref<TabType>('total')
const searchQuery = ref('')
const lastUpdate = ref('2026-07-07 10:00')
const projects = ref<GithubProject[]>([])
const aiSkills = ref<AiSkill[]>([])

const mockProjects: GithubProject[] = [
  {
    id: 1,
    repo_name: 'awesome-ai-tools',
    full_name: 'microsoft/awesome-ai-tools',
    description: 'A curated list of awesome AI tools, libraries, and resources for developers building intelligent applications.',
    language: 'TypeScript',
    stars: 125000,
    forks: 15600,
    daily_growth: 320,
    topics: ['ai', 'machine-learning', 'tools'],
    html_url: 'https://github.com/microsoft/awesome-ai-tools',
    owner_avatar: 'https://avatars.githubusercontent.com/u/6154722?v=4',
    owner_login: 'microsoft',
  },
  {
    id: 2,
    repo_name: 'langchain',
    full_name: 'langchain-ai/langchain',
    description: 'Build context-aware reasoning applications with LLMs through composable chains and agents.',
    language: 'Python',
    stars: 98500,
    forks: 14200,
    daily_growth: 280,
    topics: ['llm', 'ai', 'python'],
    html_url: 'https://github.com/langchain-ai/langchain',
    owner_avatar: 'https://avatars.githubusercontent.com/u/126733545?v=4',
    owner_login: 'langchain-ai',
  },
  {
    id: 3,
    repo_name: 'vue',
    full_name: 'vuejs/vue',
    description: 'The Progressive JavaScript Framework. Vue is a progressive framework for building user interfaces.',
    language: 'TypeScript',
    stars: 215000,
    forks: 35600,
    daily_growth: 150,
    topics: ['vue', 'frontend', 'framework'],
    html_url: 'https://github.com/vuejs/vue',
    owner_avatar: 'https://avatars.githubusercontent.com/u/6128107?v=4',
    owner_login: 'vuejs',
  },
  {
    id: 4,
    repo_name: 'open-interpreter',
    full_name: 'KillianLucas/open-interpreter',
    description: 'A natural language interface for computers. Let LLMs run code on your computer.',
    language: 'Python',
    stars: 52000,
    forks: 6800,
    daily_growth: 420,
    topics: ['ai', 'llm', 'code-interpreter'],
    html_url: 'https://github.com/KillianLucas/open-interpreter',
    owner_avatar: 'https://avatars.githubusercontent.com/u/46334387?v=4',
    owner_login: 'KillianLucas',
  },
  {
    id: 5,
    repo_name: 'tailwindcss',
    full_name: 'tailwindlabs/tailwindcss',
    description: 'A utility-first CSS framework for rapid UI development. Build beautiful designs without leaving your HTML.',
    language: 'TypeScript',
    stars: 82000,
    forks: 9200,
    daily_growth: 95,
    topics: ['css', 'tailwindcss', 'frontend'],
    html_url: 'https://github.com/tailwindlabs/tailwindcss',
    owner_avatar: 'https://avatars.githubusercontent.com/u/67109815?v=4',
    owner_login: 'tailwindlabs',
  },
  {
    id: 6,
    repo_name: 'screenshot-to-code',
    full_name: 'abi/screenshot-to-code',
    description: 'Drop in a screenshot and convert it to clean code (HTML/Tailwind/React/Vue). Powered by GPT-4V.',
    language: 'TypeScript',
    stars: 48000,
    forks: 5600,
    daily_growth: 560,
    topics: ['ai', 'code-generation', 'design'],
    html_url: 'https://github.com/abi/screenshot-to-code',
    owner_avatar: 'https://avatars.githubusercontent.com/u/2460973?v=4',
    owner_login: 'abi',
  },
  {
    id: 7,
    repo_name: 'rust',
    full_name: 'rust-lang/rust',
    description: 'Empowering everyone to build reliable and efficient software. The Rust programming language.',
    language: 'Rust',
    stars: 95000,
    forks: 12800,
    daily_growth: 85,
    topics: ['rust', 'language', 'systems'],
    html_url: 'https://github.com/rust-lang/rust',
    owner_avatar: 'https://avatars.githubusercontent.com/u/5430905?v=4',
    owner_login: 'rust-lang',
  },
  {
    id: 8,
    repo_name: 'dify',
    full_name: 'langgenius/dify',
    description: 'Dify is an open-source LLM app development platform. Visual workflow builder, RAG engine, and more.',
    language: 'TypeScript',
    stars: 42000,
    forks: 5800,
    daily_growth: 380,
    topics: ['ai', 'llm', 'no-code'],
    html_url: 'https://github.com/langgenius/dify',
    owner_avatar: 'https://avatars.githubusercontent.com/u/130821368?v=4',
    owner_login: 'langgenius',
  },
  {
    id: 9,
    repo_name: 'go',
    full_name: 'golang/go',
    description: 'The Go programming language. Go is an open source programming language that makes it easy to build software.',
    language: 'Go',
    stars: 122000,
    forks: 17500,
    daily_growth: 75,
    topics: ['go', 'language', 'backend'],
    html_url: 'https://github.com/golang/go',
    owner_avatar: 'https://avatars.githubusercontent.com/u/4314092?v=4',
    owner_login: 'golang',
  },
  {
    id: 10,
    repo_name: 'cursor',
    full_name: 'getcursor/cursor',
    description: 'An AI-first code editor. Cursor is a fork of VS Code that is built for AI pair programming.',
    language: 'TypeScript',
    stars: 38000,
    forks: 3200,
    daily_growth: 620,
    topics: ['ai', 'ide', 'editor'],
    html_url: 'https://github.com/getcursor/cursor',
    owner_avatar: 'https://avatars.githubusercontent.com/u/102781808?v=4',
    owner_login: 'getcursor',
  },
]

const mockAiSkills: AiSkill[] = [
  {
    id: 1,
    name: '代码审查助手',
    description: 'AI 驱动的代码审查工具，自动检测代码缺陷、安全漏洞和最佳实践问题。',
    category: '开发工具',
    url: 'https://example.com/code-review',
    icon: '🔍',
  },
  {
    id: 2,
    name: '文档生成器',
    description: '自动从代码生成 API 文档、README 和技术文档，支持多种格式输出。',
    category: '文档工具',
    url: 'https://example.com/docs-gen',
    icon: '📝',
  },
  {
    id: 3,
    name: '测试用例生成',
    description: '智能分析代码逻辑，自动生成全面的单元测试和集成测试用例。',
    category: '测试工具',
    url: 'https://example.com/test-gen',
    icon: '🧪',
  },
  {
    id: 4,
    name: 'UI 设计转代码',
    description: '将设计稿一键转换为高质量的前端代码，支持 React、Vue、Tailwind 等。',
    category: '前端开发',
    url: 'https://example.com/ui2code',
    icon: '🎨',
  },
  {
    id: 5,
    name: '数据库优化顾问',
    description: '分析查询性能，提供索引建议和 SQL 优化方案，提升数据库效率。',
    category: '数据库',
    url: 'https://example.com/db-opt',
    icon: '💾',
  },
  {
    id: 6,
    name: 'DevOps 智能助手',
    description: '自动化 CI/CD 流水线优化、容器配置和基础设施即代码生成。',
    category: 'DevOps',
    url: 'https://example.com/devops-ai',
    icon: '🚀',
  },
]

const filteredProjects = computed(() => {
  let result = [...projects.value]

  if (activeTab.value === 'ai') {
    result = result.filter((p) =>
      p.topics.some((t) => ['ai', 'llm', 'machine-learning', 'code-generation', 'no-code', 'ide'].includes(t))
    )
  } else if (activeTab.value === 'daily') {
    result = result.sort((a, b) => (b.daily_growth || 0) - (a.daily_growth || 0))
  } else {
    result = result.sort((a, b) => b.stars - a.stars)
  }

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (p) =>
        p.repo_name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.full_name.toLowerCase().includes(query)
    )
  }

  return result
})

const tabCounts = computed(() => ({
  total: projects.value.length,
  ai: projects.value.filter((p) =>
    p.topics.some((t) => ['ai', 'llm', 'machine-learning', 'code-generation', 'no-code', 'ide'].includes(t))
  ).length,
  daily: projects.value.filter((p) => (p.daily_growth || 0) > 0).length,
}))

async function loadProjects() {
  // TODO: 部署后启用真实 API 调用
  // const response = await fetch('/api/github-daily')
  // const data = await response.json()
  // projects.value = data.projects
  // lastUpdate.value = data.lastUpdate

  projects.value = mockProjects
}

async function loadAiSkills() {
  // TODO: 部署后启用真实 API 调用
  // const response = await fetch('/api/ai-skills')
  // const data = await response.json()
  // aiSkills.value = data.skills

  aiSkills.value = mockAiSkills
}

onMounted(() => {
  loadProjects()
  loadAiSkills()
})
</script>

<template>
  <div class="min-h-[100dvh] bg-[#f5f0e8] pt-24 pb-20">
    <div class="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16">
      <!-- Hero Section -->
      <div class="animate-fade-up">
        <span class="font-mono text-sm tracking-widest text-[#2e5dd6] uppercase block mb-4">每日热榜</span>
        <h1 class="font-mono text-4xl sm:text-5xl font-black tracking-tight text-[#161310]">
          GitHub 每日项目
        </h1>
        <p class="mt-3 font-mono text-sm text-[#3a332a] max-w-xl">
          每日精选 GitHub 热门项目，发现最酷的开源工具和技术趋势
        </p>
        <p class="mt-2 font-mono text-xs text-[#3a332a]/70">
          最后更新：{{ lastUpdate }}
        </p>
      </div>

      <!-- Tab Navigation -->
      <div class="mt-10 flex flex-wrap gap-2">
        <button
          class="font-mono text-sm tracking-wider uppercase px-4 py-2 border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] transition-all duration-200 hover:-translate-y-0.5 hover:translate-x-0.5"
          :class="activeTab === 'total' ? 'bg-[#161310] text-[#fffaef]' : 'bg-[#fffaef] text-[#161310]'"
          @click="activeTab = 'total'"
        >
          总榜 ({{ tabCounts.total }})
        </button>
        <button
          class="font-mono text-sm tracking-wider uppercase px-4 py-2 border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] transition-all duration-200 hover:-translate-y-0.5 hover:translate-x-0.5"
          :class="activeTab === 'ai' ? 'bg-[#161310] text-[#fffaef]' : 'bg-[#fffaef] text-[#161310]'"
          @click="activeTab = 'ai'"
        >
          AI 榜 ({{ tabCounts.ai }})
        </button>
        <button
          class="font-mono text-sm tracking-wider uppercase px-4 py-2 border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] transition-all duration-200 hover:-translate-y-0.5 hover:translate-x-0.5"
          :class="activeTab === 'daily' ? 'bg-[#161310] text-[#fffaef]' : 'bg-[#fffaef] text-[#161310]'"
          @click="activeTab = 'daily'"
        >
          日增榜 ({{ tabCounts.daily }})
        </button>
      </div>

      <!-- Search Box -->
      <div class="mt-8">
        <div class="relative max-w-md">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索项目名称或描述..."
            class="w-full px-4 py-3 pl-12 font-mono text-sm border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] bg-[#fffaef] text-[#161310] placeholder-[#3a332a]/50 focus:outline-none focus:shadow-[2px_2px_0_0_#161310] focus:translate-x-0.5 focus:translate-y-0.5 transition-all duration-200"
          />
          <svg
            class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#3a332a]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
        </div>
      </div>

      <!-- Project Grid -->
      <div class="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <GithubProjectCard
          v-for="(project, index) in filteredProjects"
          :key="project.id"
          :project="project"
          :rank="index + 1"
        />

        <!-- Empty State -->
        <div v-if="filteredProjects.length === 0" class="col-span-full py-20 flex flex-col items-center justify-center text-center">
          <div class="w-20 h-20 bg-[#fffaef] border-2 border-[#161310] shadow-[8px_8px_0_0_#161310] flex items-center justify-center font-mono text-3xl mb-4">?</div>
          <h3 class="font-mono text-xl font-bold text-[#161310]">暂无相关项目</h3>
          <p class="font-mono text-sm text-[#3a332a] mt-1">试试其他关键词或榜单分类</p>
        </div>
      </div>

      <!-- AI Skills Section -->
      <div class="mt-20">
        <div class="flex items-center gap-4 mb-8">
          <div class="h-[2px] flex-1 bg-[#161310]/20"></div>
          <h2 class="font-mono text-2xl font-bold text-[#161310] whitespace-nowrap">
            AI 开发技能树
          </h2>
          <div class="h-[2px] flex-1 bg-[#161310]/20"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AiSkillCard
            v-for="skill in aiSkills"
            :key="skill.id"
            :skill="skill"
          />
        </div>
      </div>
    </div>
  </div>
</template>
