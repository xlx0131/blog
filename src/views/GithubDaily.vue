<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import GithubProjectCard from '@/components/GithubProjectCard.vue'
import AiSkillCard from '@/components/AiSkillCard.vue'
import { mockProjects, mockAiSkills } from '@/data/github-mock.js'

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
  // const response = await fetch('/api/github/projects')
  // const data = await response.json()
  // projects.value = data.data
  // lastUpdate.value = data.lastUpdate

  projects.value = mockProjects
}

async function loadAiSkills() {
  // TODO: 部署后启用真实 API 调用
  // const response = await fetch('/api/github/ai-skills')
  // const data = await response.json()
  // aiSkills.value = data.data

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
