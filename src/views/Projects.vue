<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { initTiltCards } from '@/composables/useInteractions'
import { projects as projectsData } from '@/data/contents.js'

const router = useRouter()
const cardViewMode = ref<'pixel' | 'browser'>('pixel')

interface Project {
  id: number
  title: string
  subtitle: string
  description: string
  url: string
  tags: string[]
  tech: string[]
  cover: string
  year: string
  highlights: string[]
}

const projects = ref<Project[]>(projectsData)
const activeTab = ref('all')

const allTechTags = computed(() => {
  const techSet = new Set<string>()
  projects.value.forEach((p) => {
    p.tech.forEach((t) => techSet.add(t))
  })
  return Array.from(techSet)
})

const filteredProjects = computed(() => {
  if (activeTab.value === 'all') return projects.value
  return projects.value.filter((p) => p.tech.includes(activeTab.value))
})

function viewProject(id: number) {
  router.push(`/projects/${id}`)
}

function reInitTilt() {
  nextTick(() => {
    setTimeout(() => initTiltCards(), 50)
  })
}

onMounted(() => {
  reInitTilt()
})
</script>

<template>
  <div class="min-h-[100dvh] bg-[#f5f0e8] pt-24 pb-20">
    <div class="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-20">
      <!-- Header -->
      <div class="flex items-start justify-between mb-8">
        <div class="animate-fade-up">
          <span class="font-mono text-sm tracking-widest text-[#2e5dd6] uppercase block mb-4">项目</span>
          <h1 class="font-mono text-4xl sm:text-5xl font-black tracking-tight text-[#161310]">作品集</h1>
          <p class="mt-2 font-mono text-sm text-[#3a332a] max-w-lg">亲手打造的项目，从数据到代码。</p>
        </div>

        <!-- 切换开关 -->
        <div class="overflow-hidden shrink-0" style="width: 96px; height: 56px;">
          <div style="transform: scale(0.5); transform-origin: top left;">
          <div
            class="w-48 aspect-video rounded-xl border-4"
            :class="cardViewMode === 'pixel' ? 'bg-[#f5f0e8] border-[#121331]' : 'bg-[#ebe6ef] border-[#121331]'"
          >
            <div class="flex h-full w-full px-2 items-center gap-x-2">
              <div class="w-6 h-6 flex-shrink-0 rounded-full border-4 border-[#121331]"
                :class="cardViewMode === 'pixel' ? 'bg-[#f5f0e8]' : 'bg-[#ebe6ef]'"
              ></div>
              <label
                for="project-card-switch"
                class="w-full h-10 border-4 border-[#121331] rounded cursor-pointer"
                :class="cardViewMode === 'pixel' ? 'scale-x-[-1]' : ''"
              >
                <input
                  type="checkbox"
                  id="project-card-switch"
                  class="hidden"
                  :checked="cardViewMode === 'pixel'"
                  @change="cardViewMode = cardViewMode === 'browser' ? 'pixel' : 'browser'"
                />
                <div class="w-full h-full bg-[#f24c00] relative">
                  <div class="w-[24px] h-9 z-10 absolute top-[9px] left-0 bg-[#f24c00] border-r-2 border-b-4 border-[#121331] skew-y-[39deg]"></div>
                  <div class="w-[25px] h-9 z-10 absolute top-[9px] left-[24px] bg-[#c44002] border-r-4 border-l-2 border-b-4 border-[#121331] skew-y-[-39deg]"></div>
                </div>
              </label>
              <div class="w-6 h-1 flex-shrink-0 bg-[#121331] rounded-full"
                :class="cardViewMode === 'pixel' ? 'opacity-0' : ''"
              ></div>
            </div>
            </div>
          </div>
          </div>
      </div>

      <!-- Tech Filter Buttons (Pixel Style) -->
      <div class="mt-8 flex flex-wrap gap-2">
        <button
          class="font-mono text-xs tracking-wider uppercase px-3 py-2 border-2 border-[#161310] shadow-[3px_3px_0_0_#161310] transition-all duration-200 hover:-translate-y-0.5"
          :class="activeTab === 'all' ? 'bg-[#161310] text-[#fffaef]' : 'bg-[#fffaef] text-[#161310]'"
          @click="activeTab = 'all'"
        >
          全部 ({{ projects.length }})
        </button>
        <button
          v-for="tech in allTechTags"
          :key="tech"
          class="font-mono text-xs tracking-wider uppercase px-3 py-2 border-2 border-[#161310] shadow-[3px_3px_0_0_#161310] transition-all duration-200 hover:-translate-y-0.5"
          :class="activeTab === tech ? 'bg-[#161310] text-[#fffaef]' : 'bg-[#fffaef] text-[#161310]'"
          @click="activeTab = tech; reInitTilt()"
        >
          {{ tech }}
        </button>
      </div>

      <!-- Project Grid - Pixel Mode -->
      <div v-if="cardViewMode === 'pixel'" class="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="project in filteredProjects"
          :key="project.id"
          class="group cursor-pointer bg-[#fffaef] border-2 border-[#161310] shadow-[6px_6px_0_0_#161310] transition-all duration-200 hover:-translate-y-1 hover:translate-x-0.5 tilt-card"
          @click="viewProject(project.id)"
        >
          <!-- Art Area -->
          <div class="relative h-44 border-b-2 border-[#161310] overflow-hidden"
            :class="project.cover === 'ops' ? 'bg-[#2e5dd6]' : 'bg-[#2e5dd6]'"
          >
            <!-- Pixel sky gradient -->
            <div class="absolute inset-0"
              :style="{
                background: `linear-gradient(to bottom, ${project.cover === 'ops' ? '#2e5dd6' : '#2e5dd6'} 0%, ${project.cover === 'ops' ? '#2e5dd6' : '#2e5dd6'} 60%, ${project.cover === 'ops' ? '#1f47b0' : '#1f47b0'} 60%, ${project.cover === 'ops' ? '#1f47b0' : '#1f47b0'} 100%)`
              }"
            ></div>
            <!-- Pixel sun -->
            <div class="absolute top-4 right-6 w-7 h-7 bg-[#fffaef] border-2 border-[#161310] shadow-[-4px_0_0_#fffaef,4px_0_0_#fffaef,0_-4px_0_#fffaef,0_4px_0_#fffaef]"></div>
            <!-- Mountain -->
            <div class="absolute bottom-[30px] left-0 right-0 h-14 bg-[#2f6e4f] border-t-2 border-[#161310]"
              style="clip-path: polygon(0 100%, 8% 60%, 15% 75%, 25% 30%, 35% 60%, 45% 20%, 55% 50%, 65% 35%, 75% 60%, 88% 30%, 100% 50%, 100% 100%)"
            ></div>
            <!-- Ground -->
            <div class="absolute bottom-0 left-0 right-0 h-[32px] bg-[#e2522e] border-t-2 border-[#161310]"
              style="background-image: repeating-linear-gradient(to right, transparent 0 7px, rgba(22,19,16,0.15) 7px 10px)"
            ></div>
            <!-- Badge -->
            <span class="absolute bottom-[6px] left-2 font-mono text-xs tracking-wider uppercase px-2 py-1 bg-[#161310] text-[#fffaef] border-2 border-[#fffaef] leading-none z-10">
              {{ project.year }}
            </span>
            <!-- Icon -->
            <div class="absolute top-[60px] left-1/2 -translate-x-1/2 z-10 flex items-center justify-center w-14 h-14 bg-[#f5f0e8] border-2 border-[#161310] shadow-[3px_3px_0_0_#161310]">
              <svg v-if="project.cover === 'profile'" class="w-7 h-7 text-[#161310]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="M7 16l4-8 4 4 4-6"/></svg>
              <svg v-else-if="project.cover === 'ops'" class="w-7 h-7 text-[#161310]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><path d="M6 6h.01M6 18h.01"/></svg>
              <svg v-else class="w-7 h-7 text-[#161310]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            </div>
          </div>

          <!-- Body -->
          <div class="p-4">
            <!-- Tags -->
            <div class="flex items-center gap-2 mb-2 flex-wrap">
              <span v-for="tag in project.tags" :key="tag" class="font-mono text-[10px] text-[#3a332a]">· {{ tag }}</span>
            </div>
            <!-- Title -->
            <h3 class="font-mono text-xl font-bold text-[#161310] truncate">{{ project.title }}</h3>
            <!-- Subtitle -->
            <p class="font-mono text-xs text-[#3a332a] mt-1 line-clamp-2 leading-relaxed">{{ project.subtitle }}</p>
            <!-- Tech -->
            <div class="flex flex-wrap gap-1.5 mt-3">
              <span v-for="t in project.tech.slice(0, 4)" :key="t"
                class="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border border-[#161310] text-[#161310]"
              >{{ t }}</span>
              <span v-if="project.tech.length > 4" class="font-mono text-[10px] text-[#3a332a] self-center px-1">+{{ project.tech.length - 4 }}</span>
            </div>
            <!-- Footer -->
            <div class="flex items-center justify-between mt-4 pt-3 border-t-2 border-dotted border-[#d9cdb3]">
              <span class="font-mono text-xs text-[#3a332a] uppercase">查看详情 ▸</span>
              <span class="font-mono text-[10px] text-[#2e5dd6] uppercase">{{ project.year }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Browser Mode - Phone Cards -->
      <div v-if="cardViewMode === 'browser'" class="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 justify-items-center">
        <div
          v-for="project in filteredProjects"
          :key="project.id"
          class="group relative flex justify-center h-[360px] sm:h-[400px] w-[180px] sm:w-[200px] border-[3px] border-[#d9cdb3] rounded-[32px] bg-[#f5f0e8] shadow-xl ring-1 ring-[#161310]/20 transition-all duration-500 select-none cursor-pointer"
          @click="viewProject(project.id)"
        >
          <div class="absolute inset-0 rounded-[30px] border border-[#161310]/10 pointer-events-none"></div>

          <div class="relative h-full w-full overflow-hidden rounded-[28px] bg-[#fffaef]">
            <div class="absolute inset-0 bg-gradient-to-tr from-[#f5f0e8] via-[#fffaef] to-[#f5f0e8] transition-transform duration-700 group-hover:scale-110"></div>
            <div class="absolute top-0 right-0 w-[150px] h-[150px] bg-[#2e5dd6]/10 blur-[40px] rounded-full mix-blend-screen transition-all duration-700 group-hover:translate-x-4 group-hover:-translate-y-4"></div>
            <div class="absolute bottom-0 left-0 w-[150px] h-[150px] bg-[#e2522e]/10 blur-[40px] rounded-full mix-blend-screen transition-all duration-700 group-hover:-translate-x-4 group-hover:translate-y-4"></div>

            <!-- Status Bar -->
            <div class="absolute top-1 w-full px-4 py-1 flex justify-between items-center z-10 text-[#161310] text-[7px] sm:text-[8px] font-mono opacity-60">
              <span>9:41</span>
              <div class="flex gap-1 items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-2 h-2 sm:w-2.5 sm:h-2.5"><path d="M3 20h18V2L3 20z"></path></svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5"><path fill-rule="evenodd" d="M3 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H3.75a.75.75 0 01-.75-.75V5.25zm17.5 4.5a.75.75 0 01.75.75v3a.75.75 0 01-.75.75h-1.5v-4.5h1.5z" clip-rule="evenodd"></path></svg>
              </div>
            </div>

            <!-- Initial State: Lock Screen -->
            <div class="absolute inset-0 flex flex-col items-center pt-10 sm:pt-12 transition-all duration-500 ease-in-out group-hover:opacity-0 group-hover:-translate-y-4 group-hover:scale-95 group-hover:pointer-events-none z-10">
              <div class="flex flex-col items-center text-[#161310]/80">
                <span class="text-[7px] sm:text-[8px] font-mono tracking-wider">PROJECT</span>
                <span class="text-2xl sm:text-4xl font-['Pixelify_Sans'] font-thin tracking-tight mt-3 sm:mt-4 px-3 sm:px-4 text-center leading-tight">{{ project.title }}</span>
              </div>
              <div class="absolute bottom-6 w-full px-6 flex justify-between">
                <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#161310]/10 backdrop-blur-md flex items-center justify-center border border-[#161310]/10">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#161310" class="w-3 h-3 sm:w-4 sm:h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M11.412 15.655L9.75 21.75l3.745-4.012M9.257 13.5H3.75l2.659-2.849m2.048-2.194L14.25 2.25 12 10.5h8.25l-4.707 5.043M8.457 8.457L3 3m5.457 5.457l7.086 7.086m0 0L21 21"></path></svg>
                </div>
                <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#161310]/10 backdrop-blur-md flex items-center justify-center border border-[#161310]/10">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#161310" class="w-3 h-3 sm:w-4 sm:h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"></path></svg>
                </div>
              </div>
              <div class="absolute bottom-2 w-[35%] sm:w-[40%] h-[3px] bg-[#161310]/30 rounded-full"></div>
            </div>

            <!-- Hover Content -->
            <div class="absolute inset-0 pt-8 sm:pt-10 pb-4 sm:pb-4 px-3 sm:px-4 flex flex-col justify-center opacity-0 scale-105 translate-y-4 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 z-0">
              <!-- Project Info Panel - 占据整个屏幕 -->
               <div class="w-full bg-[#f5f0e8]/90 backdrop-blur-xl border border-[#161310]/20 rounded-[20px] flex flex-col px-4 sm:px-5 py-5 sm:py-6 shadow-lg gap-2 sm:gap-3">
                 <!-- 年份 + 标签 -->
                 <div class="flex items-center justify-between">
                   <span class="text-[#161310]/70 text-[9px] sm:text-[10px] font-mono tracking-wider">{{ project.year }}</span>
                   <div class="flex gap-1 flex-wrap justify-end">
                     <span v-for="tag in project.tags.slice(0, 2)" :key="tag" class="text-[7px] sm:text-[8px] font-mono text-[#161310]/60">· {{ tag }}</span>
                   </div>
                 </div>
                 <!-- 项目标题 -->
                 <span class="text-[#161310] text-sm sm:text-base font-['Pixelify_Sans'] font-bold leading-snug">{{ project.title }}</span>
                 <!-- 项目描述 -->
                 <span class="text-[#161310]/60 text-[9px] sm:text-[10px] font-mono leading-relaxed line-clamp-2 sm:line-clamp-3">{{ project.subtitle }}</span>
                 <!-- 技术栈 -->
                 <div class="flex flex-wrap gap-1 sm:gap-1.5 mt-1 sm:mt-2">
                   <span v-for="t in project.tech.slice(0, 4)" :key="t" class="text-[7px] sm:text-[8px] font-mono bg-[#161310]/10 text-[#161310]/80 px-2 sm:px-2.5 py-1 rounded-full">{{ t }}</span>
                   <span v-if="project.tech.length > 4" class="text-[7px] sm:text-[8px] font-mono text-[#161310]/50 px-1 self-center">+{{ project.tech.length - 4 }}</span>
                 </div>
                 <!-- 查看详情 -->
                 <div class="flex justify-end mt-1 sm:mt-2 pt-2 sm:pt-3 border-t border-[#161310]/10">
                   <span class="text-[9px] sm:text-[10px] font-mono text-[#2e5dd6] font-semibold flex items-center gap-1 hover:text-[#1f47b0] transition-colors tracking-wider uppercase">
                    查看详情
                    <svg class="w-3 h-3 sm:w-3.5 sm:h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Notch -->
          <div class="absolute top-[10px] z-30 h-5 w-16 rounded-full bg-[#d9cdb3] shadow-lg border border-[#161310]/10"></div>

          <!-- Side Buttons -->
          <span class="absolute -right-[4px] top-16 h-10 w-[3px] rounded-r-md bg-[#d9cdb3] shadow-sm border-l border-[#f5f0e8]"></span>
          <span class="absolute -left-[4px] top-12 h-6 w-[3px] rounded-l-md bg-[#d9cdb3] shadow-sm border-r border-[#f5f0e8]"></span>
          <span class="absolute -left-[4px] top-20 h-10 w-[3px] rounded-l-md bg-[#d9cdb3] shadow-sm border-r border-[#f5f0e8]"></span>
          <span class="absolute -left-[4px] top-32 h-10 w-[3px] rounded-l-md bg-[#d9cdb3] shadow-sm border-r border-[#f5f0e8]"></span>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredProjects.length === 0" class="mt-16 flex flex-col items-center justify-center py-16 text-center">
        <div class="w-20 h-20 bg-[#fffaef] border-2 border-[#161310] shadow-[8px_8px_0_0_#161310] flex items-center justify-center font-mono text-3xl mb-4">?</div>
        <h3 class="font-mono text-xl font-bold text-[#161310]">暂无相关项目</h3>
        <p class="font-mono text-sm text-[#3a332a] mt-1">试试选择其他技术标签</p>
      </div>
    </div>
  </div>
</template>
