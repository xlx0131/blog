<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import GithubProjectCard from '@/components/GithubProjectCard.vue'
import AiSkillCard from '@/components/AiSkillCard.vue'
import { mockAiSkills, dailyArchives } from '@/data/github-mock.js'

interface GithubProject {
  id: number | string
  originalId?: number | string
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

interface DailyArchive {
  date: string
  label: string
  projectCount: number
  aiCount: number
  projects: GithubProject[]
  isToday: boolean
}

type TabType = 'total' | 'ai' | 'daily'

const router = useRouter()
const activeTab = ref<TabType>('total')
const searchQuery = ref('')
const activeDate = ref(dailyArchives[0].date)
const aiSkills = ref<AiSkill[]>([])

const currentArchive = computed<DailyArchive>(() => {
  return dailyArchives.find((d) => d.date === activeDate.value) || dailyArchives[0]
})

const lastUpdate = computed(() => currentArchive.value.date + ' 02:00')

const filteredProjects = computed(() => {
  let result = [...currentArchive.value.projects]

  if (activeTab.value === 'ai') {
    result = result.filter((p) =>
      p.topics.some((t) => ['AI', '大模型', 'AI工具', 'AI应用', 'AI编程', 'AI平台', 'AI助手', '智能体', '知识库'].some((kw) => t.includes(kw) || kw.includes(t)))
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

const tabCounts = computed(() => {
  const projects = currentArchive.value.projects
  return {
    total: projects.length,
    ai: projects.filter((p) =>
      p.topics.some((t) => ['AI', '大模型', 'AI工具', 'AI应用', 'AI编程', 'AI平台', 'AI助手', '智能体', '知识库'].some((kw) => t.includes(kw) || kw.includes(t)))
    ).length,
    daily: projects.filter((p) => (p.daily_growth || 0) > 0).length,
  }
})

const totalProjects = computed(() => dailyArchives.reduce((sum, d) => sum + d.projectCount, 0))
const totalDays = computed(() => dailyArchives.length)

function selectDate(date: string) {
  activeDate.value = date
  searchQuery.value = ''
}

function goToDetail(project: GithubProject) {
  const id = project.originalId || project.id
  router.push(`/github-daily/${id}`)
}

function loadAiSkills() {
  aiSkills.value = mockAiSkills
}

onMounted(() => {
  loadAiSkills()
})
</script>

<template>
  <div class="min-h-[100dvh] bg-[#f5f0e8] pt-24 pb-20">
    <div class="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
      <!-- Header -->
      <div class="animate-fade-up">
        <span class="font-mono text-sm tracking-widest text-[#2e5dd6] uppercase block mb-4">每日热榜</span>
        <h1 class="font-mono text-4xl sm:text-5xl font-black tracking-tight text-[#161310]">
          GitHub 每日项目
        </h1>
        <p class="mt-3 font-mono text-sm text-[#3a332a] max-w-xl">
          每日精选 GitHub 热门项目，发现最酷的开源工具和技术趋势
        </p>
      </div>

      <!-- Main Layout: Left Sidebar + Right Content -->
      <div class="mt-10 flex flex-col lg:flex-row gap-8">
        <!-- Left Sidebar: Date Navigation -->
        <div class="lg:w-64 lg:flex-shrink-0">
          <div class="lg:sticky lg:top-28">
            <!-- Stats Cards -->
            <div class="grid grid-cols-2 lg:grid-cols-1 gap-3 mb-6">
              <div class="bg-[#fffaef] border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] p-4">
                <p class="font-mono text-2xl font-bold text-[#161310] tabular-nums">{{ totalDays }}</p>
                <p class="font-mono text-xs text-[#3a332a] mt-0.5">更新天数</p>
              </div>
              <div class="bg-[#fffaef] border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] p-4">
                <p class="font-mono text-2xl font-bold text-[#161310] tabular-nums">{{ totalProjects }}</p>
                <p class="font-mono text-xs text-[#3a332a] mt-0.5">项目总数</p>
              </div>
            </div>

            <!-- Date List -->
            <div class="bg-[#fffaef] border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] overflow-hidden">
              <div class="px-4 py-3 bg-[#161310] text-[#fffaef] border-b-2 border-[#161310]">
                <p class="font-mono text-sm font-bold tracking-wider">📅 日期归档</p>
              </div>
              <div class="max-h-[400px] lg:max-h-[500px] overflow-y-auto">
                <button
                  v-for="archive in dailyArchives"
                  :key="archive.date"
                  class="w-full px-4 py-3 text-left border-b border-[#161310]/10 last:border-b-0 transition-colors duration-150"
                  :class="activeDate === archive.date
                    ? 'bg-[#2e5dd6] text-[#fffaef]'
                    : 'bg-[#fffaef] text-[#161310] hover:bg-[#161310]/5'"
                  @click="selectDate(archive.date)"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="font-mono text-sm font-bold">{{ archive.label }}</span>
                      <span
                        v-if="archive.isToday"
                        class="px-1.5 py-0.5 bg-[#ff6b35] text-[#fffaef] text-[10px] font-mono font-bold tracking-wider"
                      >
                        NEW
                      </span>
                    </div>
                    <span class="font-mono text-xs opacity-70">{{ archive.projectCount }}个</span>
                  </div>
                  <p class="font-mono text-xs mt-1 opacity-60">{{ archive.date }} · AI {{ archive.aiCount }}个</p>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Content -->
        <div class="flex-1 min-w-0">
          <!-- Date Header -->
          <div class="mb-6 flex items-end justify-between flex-wrap gap-4">
            <div>
              <h2 class="font-mono text-2xl font-bold text-[#161310]">
                {{ currentArchive.label }}的榜单
              </h2>
              <p class="font-mono text-xs text-[#3a332a] mt-1">
                最后更新：{{ lastUpdate }}
              </p>
            </div>
          </div>

          <!-- Tab Navigation -->
          <div class="flex flex-wrap gap-2">
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
          <div class="mt-6">
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
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
          </div>

          <!-- Project Grid -->
          <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              v-for="(project, index) in filteredProjects"
              :key="project.id"
              @click="goToDetail(project)"
            >
              <GithubProjectCard
                :project="project"
                :rank="index + 1"
              />
            </div>

            <!-- Empty State -->
            <div v-if="filteredProjects.length === 0" class="col-span-full py-16 flex flex-col items-center justify-center text-center">
              <div class="w-16 h-16 bg-[#fffaef] border-2 border-[#161310] shadow-[6px_6px_0_0_#161310] flex items-center justify-center font-mono text-2xl mb-4">?</div>
              <h3 class="font-mono text-lg font-bold text-[#161310]">暂无相关项目</h3>
              <p class="font-mono text-sm text-[#3a332a] mt-1">试试其他关键词或榜单分类</p>
            </div>
          </div>

          <!-- AI Skills Section -->
          <div class="mt-16">
            <div class="flex items-center gap-4 mb-6">
              <div class="h-[2px] flex-1 bg-[#161310]/20"></div>
              <h2 class="font-mono text-xl font-bold text-[#161310] whitespace-nowrap">
                AI 开发技能树
              </h2>
              <div class="h-[2px] flex-1 bg-[#161310]/20"></div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <AiSkillCard
                v-for="skill in aiSkills"
                :key="skill.id"
                :skill="skill"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
