<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface GithubProjectDetail {
  id: number | string
  repo_name: string
  full_name: string
  description: string
  language: string
  stars: number
  forks: number
  watchers: number
  open_issues: number
  daily_growth?: number
  topics: string[]
  html_url: string
  homepage?: string
  owner_avatar: string
  owner_login: string
  readme: string
}

const route = useRoute()
const router = useRouter()
const id = computed(() => route.params.id)
const project = ref<GithubProjectDetail | null>(null)
const loading = ref(true)

const mockProject: GithubProjectDetail = {
  id: 1,
  repo_name: 'awesome-ai-tools',
  full_name: 'microsoft/awesome-ai-tools',
  description: 'A curated list of awesome AI tools, libraries, and resources for developers building intelligent applications.',
  language: 'TypeScript',
  stars: 125000,
  forks: 15600,
  watchers: 3200,
  open_issues: 128,
  daily_growth: 320,
  topics: ['ai', 'machine-learning', 'tools', 'deep-learning', 'nlp', 'computer-vision'],
  html_url: 'https://github.com/microsoft/awesome-ai-tools',
  homepage: 'https://ai-tools.microsoft.com',
  owner_avatar: 'https://avatars.githubusercontent.com/u/6154722?v=4',
  owner_login: 'microsoft',
  readme: `# Awesome AI Tools

A curated list of awesome AI tools, libraries, and resources for developers building intelligent applications.

## Features

- 🤖 100+ AI tools and libraries
- 📚 Comprehensive documentation
- 🚀 Quick start guides
- 💬 Active community support

## Categories

### Machine Learning
- TensorFlow
- PyTorch
- scikit-learn
- XGBoost

### Natural Language Processing
- Transformers
- spaCy
- NLTK
- Hugging Face

### Computer Vision
- OpenCV
- YOLO
- Detectron2
- Mediapipe

## Getting Started

\`\`\`bash
git clone https://github.com/microsoft/awesome-ai-tools.git
cd awesome-ai-tools
npm install
\`\`\`

## License

MIT License - feel free to use this project for learning and development.

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.`,
}

const mockTrendData = Array.from({ length: 30 }, (_, i) => {
  const base = 80 + Math.sin(i / 4) * 30
  const random = Math.random() * 40
  return Math.floor(base + random)
})

const maxTrendValue = computed(() => Math.max(...mockTrendData))

function formatNumber(num: number): string {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return String(num)
}

function goBack() {
  router.push('/github-daily')
}

function openUrl(url: string) {
  window.open(url, '_blank', 'noopener noreferrer')
}

function truncateReadme(text: string, maxLength: number = 500): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

async function loadProject() {
  loading.value = true
  // TODO: 部署后启用真实 API 调用
  // const response = await fetch(`/api/github-daily/${id.value}`)
  // const data = await response.json()
  // project.value = data.project

  await new Promise(resolve => setTimeout(resolve, 300))
  project.value = mockProject
  loading.value = false
}

onMounted(() => {
  loadProject()
  window.scrollTo({ top: 0, behavior: 'smooth' })
})
</script>

<template>
  <div class="min-h-[100dvh] bg-[#f5f0e8] pt-24 pb-20">
    <div class="max-w-[1000px] mx-auto px-6 sm:px-10 lg:px-16">
      <!-- 面包屑导航 -->
      <nav class="mb-8 animate-fade-up">
        <ol class="flex items-center gap-2 font-mono text-sm text-[#3a332a]">
          <li class="hover:text-[#161310] cursor-pointer transition-colors" @click="router.push('/')">
            首页
          </li>
          <li class="text-[#161310]/40">/</li>
          <li class="hover:text-[#161310] cursor-pointer transition-colors" @click="goBack">
            GitHub 每日
          </li>
          <li class="text-[#161310]/40">/</li>
          <li class="text-[#161310] font-bold truncate max-w-[200px]" v-if="project">
            {{ project.repo_name }}
          </li>
          <li class="text-[#161310] font-bold" v-else>
            加载中...
          </li>
        </ol>
      </nav>

      <!-- Loading State -->
      <div v-if="loading" class="py-20 flex flex-col items-center justify-center text-center">
        <div class="w-16 h-16 border-4 border-[#161310] border-t-transparent animate-spin" style="clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));"></div>
        <p class="font-mono text-sm text-[#3a332a] mt-4">加载中...</p>
      </div>

      <!-- 404 State -->
      <div v-else-if="!project" class="py-20 flex flex-col items-center justify-center text-center">
        <div class="w-20 h-20 bg-[#fffaef] border-2 border-[#161310] shadow-[8px_8px_0_0_#161310] flex items-center justify-center font-mono text-3xl mb-6">?</div>
        <h1 class="font-mono text-2xl font-bold text-[#161310] mb-2">项目未找到</h1>
        <p class="font-mono text-sm text-[#3a332a] mb-6">
          你访问的项目不存在，可能已被移除或链接有误。
        </p>
        <button
          class="font-mono text-sm tracking-wider uppercase px-4 py-2 border-2 border-[#161310] bg-[#fffaef] text-[#161310] shadow-[4px_4px_0_0_#161310] transition-all duration-200 hover:-translate-y-0.5 hover:translate-x-0.5"
          @click="goBack"
        >
          ← 返回列表
        </button>
      </div>

      <!-- Project Detail -->
      <div v-else class="animate-fade-up">
        <!-- 项目头部信息 -->
        <div class="mb-8">
          <div class="flex items-start gap-4 mb-4">
            <img
              :src="project.owner_avatar"
              :alt="project.owner_login"
              class="w-16 h-16 border-2 border-[#161310] bg-[#fffaef] shadow-[4px_4px_0_0_#161310]"
              style="image-rendering: pixelated;"
            />
            <div class="flex-1 min-w-0">
              <div class="flex items-baseline gap-2 flex-wrap mb-1">
                <span class="font-mono text-lg text-[#3a332a]">{{ project.owner_login }}</span>
                <span class="font-mono text-lg text-[#3a332a]">/</span>
                <h1 class="font-mono text-3xl sm:text-4xl font-black text-[#161310] tracking-tight">
                  {{ project.repo_name }}
                </h1>
              </div>
              <p class="font-mono text-sm text-[#3a332a] leading-relaxed">
                {{ project.description }}
              </p>
            </div>
          </div>

          <!-- 标签 -->
          <div class="flex flex-wrap gap-2 mb-6">
            <span class="inline-flex items-center gap-1.5 font-mono text-sm px-3 py-1 bg-[#161310] text-[#fffaef] border-2 border-[#161310]">
              <span class="w-2 h-2 bg-[#f24c00] border border-[#fffaef]"></span>
              {{ project.language }}
            </span>
            <span
              v-for="topic in project.topics.slice(0, 5)"
              :key="topic"
              class="font-mono text-sm px-3 py-1 bg-[#f5f0e8] text-[#3a332a] border-2 border-[#161310]"
            >
              {{ topic }}
            </span>
          </div>

          <!-- 统计数据卡片 -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div class="bg-[#fffaef] border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] p-4">
              <div class="flex items-center gap-2 mb-2">
                <svg class="w-5 h-5 text-[#e2522e]" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/>
                </svg>
                <span class="font-mono text-xs text-[#3a332a] uppercase tracking-wider">Stars</span>
              </div>
              <p class="font-mono text-2xl font-black text-[#161310]">{{ formatNumber(project.stars) }}</p>
            </div>

            <div class="bg-[#fffaef] border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] p-4">
              <div class="flex items-center gap-2 mb-2">
                <svg class="w-5 h-5 text-[#3a332a]" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"/>
                </svg>
                <span class="font-mono text-xs text-[#3a332a] uppercase tracking-wider">Forks</span>
              </div>
              <p class="font-mono text-2xl font-black text-[#161310]">{{ formatNumber(project.forks) }}</p>
            </div>

            <div class="bg-[#fffaef] border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] p-4">
              <div class="flex items-center gap-2 mb-2">
                <svg class="w-5 h-5 text-[#2e5dd6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <span class="font-mono text-xs text-[#3a332a] uppercase tracking-wider">Watchers</span>
              </div>
              <p class="font-mono text-2xl font-black text-[#161310]">{{ formatNumber(project.watchers) }}</p>
            </div>

            <div class="bg-[#fffaef] border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] p-4">
              <div class="flex items-center gap-2 mb-2">
                <svg class="w-5 h-5 text-[#059669]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                <span class="font-mono text-xs text-[#3a332a] uppercase tracking-wider">Issues</span>
              </div>
              <p class="font-mono text-2xl font-black text-[#161310]">{{ formatNumber(project.open_issues) }}</p>
            </div>
          </div>
        </div>

        <!-- 操作按钮区 -->
        <div class="flex flex-wrap gap-3 mb-8">
          <button
            class="font-mono text-sm tracking-wider uppercase px-5 py-3 border-2 border-[#161310] bg-[#161310] text-[#fffaef] shadow-[4px_4px_0_0_#161310] transition-all duration-200 hover:-translate-y-0.5 hover:translate-x-0.5"
            @click="openUrl(project.html_url)"
          >
            在 GitHub 查看 ↗
          </button>
          <button
            v-if="project.homepage"
            class="font-mono text-sm tracking-wider uppercase px-5 py-3 border-2 border-[#161310] bg-[#f5f0e8] text-[#161310] shadow-[4px_4px_0_0_#161310] transition-all duration-200 hover:-translate-y-0.5 hover:translate-x-0.5"
            @click="openUrl(project.homepage)"
          >
            访问官网 ↗
          </button>
          <button
            class="font-mono text-sm tracking-wider uppercase px-5 py-3 border-2 border-[#161310] bg-[#fffaef] text-[#161310] shadow-[4px_4px_0_0_#161310] transition-all duration-200 hover:-translate-y-0.5 hover:translate-x-0.5"
            @click="goBack"
          >
            ← 返回列表
          </button>
        </div>

        <!-- README 摘要区 -->
        <div class="mb-8">
          <div class="bg-[#fffaef] border-2 border-[#161310] shadow-[4px_4px_0_0_#161310]">
            <div class="border-b-2 border-[#161310] px-5 py-3 bg-[#161310]/5">
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-[#2e5dd6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
                <h2 class="font-mono text-lg font-bold text-[#161310]">项目介绍</h2>
              </div>
            </div>
            <div class="p-5">
              <div class="font-mono text-sm text-[#3a332a] leading-relaxed whitespace-pre-wrap">
                {{ truncateReadme(project.readme) }}
              </div>
              <button
                class="mt-4 font-mono text-sm text-[#2e5dd6] hover:text-[#161310] transition-colors underline underline-offset-4"
                @click="openUrl(project.html_url + '#readme')"
              >
                查看完整 README →
              </button>
            </div>
          </div>
        </div>

        <!-- 30天趋势图 -->
        <div>
          <div class="bg-[#fffaef] border-2 border-[#161310] shadow-[4px_4px_0_0_#161310]">
            <div class="border-b-2 border-[#161310] px-5 py-3 bg-[#161310]/5">
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-[#e2522e]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10"/>
                  <line x1="12" y1="20" x2="12" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
                <h2 class="font-mono text-lg font-bold text-[#161310]">近 30 天 Stars 趋势</h2>
              </div>
            </div>
            <div class="p-5">
              <div class="flex items-end justify-between gap-1 h-40">
                <div
                  v-for="(value, index) in mockTrendData"
                  :key="index"
                  class="flex-1 bg-[#e2522e] border-2 border-[#161310] border-b-0 transition-all duration-300 hover:bg-[#f24c00] cursor-pointer group relative"
                  :style="{ height: `${(value / maxTrendValue) * 100}%` }"
                >
                  <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#161310] text-[#fffaef] font-mono text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    +{{ value }}
                  </div>
                </div>
              </div>
              <div class="flex justify-between mt-3 font-mono text-xs text-[#3a332a]">
                <span>30 天前</span>
                <span>15 天前</span>
                <span>今天</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
