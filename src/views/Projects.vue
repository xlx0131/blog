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
          <div class="w-48 aspect-video rounded-xl border-4" :class="cardViewMode === 'pixel' ? 'bg-[#f5f0e8] border-[#121331]' : 'bg-[#ebe6ef] border-[#121331]'">
            <div class="flex h-full w-full px-2 items-center gap-x-2">
              <div class="w-6 h-6 flex-shrink-0 rounded-full border-4 border-[#121331]" :class="cardViewMode === 'pixel' ? 'bg-[#f5f0e8]' : 'bg-[#ebe6ef]'"></div>
              <label for="project-card-switch" class="w-full h-10 border-4 border-[#121331] rounded cursor-pointer" :class="cardViewMode === 'pixel' ? 'scale-x-[-1]' : ''">
                <input type="checkbox" id="project-card-switch" class="hidden" :checked="cardViewMode === 'pixel'" @change="cardViewMode = cardViewMode === 'browser' ? 'pixel' : 'browser'" />
                <div class="w-full h-full bg-[#f24c00] relative">
                  <div class="w-[24px] h-9 z-10 absolute top-[9px] left-0 bg-[#f24c00] border-r-2 border-b-4 border-[#121331] skew-y-[39deg]"></div>
                  <div class="w-[25px] h-9 z-10 absolute top-[9px] left-[24px] bg-[#c44002] border-r-4 border-l-2 border-b-4 border-[#121331] skew-y-[-39deg]"></div>
                </div>
              </label>
              <div class="w-6 h-1 flex-shrink-0 bg-[#121331] rounded-full" :class="cardViewMode === 'pixel' ? 'opacity-0' : ''"></div>
            </div>
            </div>
          </div>
          </div>
      </div>

      <!-- Tech Filter Buttons -->
      <div class="mt-8 flex flex-wrap gap-2">
        <button class="font-mono text-xs tracking-wider uppercase px-3 py-2 border-2 border-[#161310] shadow-[3px_3px_0_0_#161310] transition-all duration-200 hover:-translate-y-0.5" :class="activeTab === 'all' ? 'bg-[#161310] text-[#fffaef]' : 'bg-[#fffaef] text-[#161310]'" @click="activeTab = 'all'">全部 ({{ projects.length }})</button>
        <button v-for="tech in allTechTags" :key="tech" class="font-mono text-xs tracking-wider uppercase px-3 py-2 border-2 border-[#161310] shadow-[3px_3px_0_0_#161310] transition-all duration-200 hover:-translate-y-0.5" :class="activeTab === tech ? 'bg-[#161310] text-[#fffaef]' : 'bg-[#fffaef] text-[#161310]'" @click="activeTab = tech; reInitTilt()">{{ tech }}</button>
      </div>

      <!-- Pixel Mode -->
      <div v-if="cardViewMode === 'pixel'" class="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="project in filteredProjects" :key="project.id" class="group cursor-pointer bg-[#fffaef] border-2 border-[#161310] shadow-[6px_6px_0_0_#161310] transition-all duration-200 hover:-translate-y-1 hover:translate-x-0.5 tilt-card" @click="viewProject(project.id)">
          <div class="relative h-44 border-b-2 border-[#161310] overflow-hidden bg-[#2e5dd6]">
            <div class="absolute inset-0" style="background: linear-gradient(to bottom, #2e5dd6 0%, #2e5dd6 60%, #1f47b0 60%, #1f47b0 100%)"></div>
            <div class="absolute top-4 right-6 w-7 h-7 bg-[#fffaef] border-2 border-[#161310] shadow-[-4px_0_0_#fffaef,4px_0_0_#fffaef,0_-4px_0_#fffaef,0_4px_0_#fffaef]"></div>
            <div class="absolute bottom-[30px] left-0 right-0 h-14 bg-[#2f6e4f] border-t-2 border-[#161310]" style="clip-path: polygon(0 100%, 8% 60%, 15% 75%, 25% 30%, 35% 60%, 45% 20%, 55% 50%, 65% 35%, 75% 60%, 88% 30%, 100% 50%, 100% 100%)"></div>
            <div class="absolute bottom-0 left-0 right-0 h-[32px] bg-[#e2522e] border-t-2 border-[#161310]" style="background-image: repeating-linear-gradient(to right, transparent 0 7px, rgba(22,19,16,0.15) 7px 10px)"></div>
            <span class="absolute bottom-[6px] left-2 font-mono text-xs tracking-wider uppercase px-2 py-1 bg-[#161310] text-[#fffaef] border-2 border-[#fffaef] leading-none z-10">{{ project.year }}</span>
            <div class="absolute top-[60px] left-1/2 -translate-x-1/2 z-10 flex items-center justify-center w-14 h-14 bg-[#f5f0e8] border-2 border-[#161310] shadow-[3px_3px_0_0_#161310]">
              <svg v-if="project.cover === 'profile'" class="w-7 h-7 text-[#161310]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="M7 16l4-8 4 4 4-6"/></svg>
              <svg v-else-if="project.cover === 'ops'" class="w-7 h-7 text-[#161310]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><path d="M6 6h.01M6 18h.01"/></svg>
              <svg v-else class="w-7 h-7 text-[#161310]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            </div>
          </div>
          <div class="p-4">
            <div class="flex items-center gap-2 mb-2 flex-wrap"><span v-for="tag in project.tags" :key="tag" class="font-mono text-[10px] text-[#3a332a]">· {{ tag }}</span></div>
            <h3 class="font-mono text-xl font-bold text-[#161310] truncate">{{ project.title }}</h3>
            <p class="font-mono text-xs text-[#3a332a] mt-1 line-clamp-2 leading-relaxed">{{ project.subtitle }}</p>
            <div class="flex flex-wrap gap-1.5 mt-3">
              <span v-for="t in project.tech.slice(0, 4)" :key="t" class="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border border-[#161310] text-[#161310]">{{ t }}</span>
              <span v-if="project.tech.length > 4" class="font-mono text-[10px] text-[#3a332a] self-center px-1">+{{ project.tech.length - 4 }}</span>
            </div>
            <div class="flex items-center justify-between mt-4 pt-3 border-t-2 border-dotted border-[#d9cdb3]">
              <span class="font-mono text-xs text-[#3a332a] uppercase">查看详情 ▸</span>
              <span class="font-mono text-[10px] text-[#2e5dd6] uppercase">{{ project.year }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Browser Mode - from 展开风格1.txt -->
      <div v-if="cardViewMode === 'browser'" class="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
        <div v-for="project in filteredProjects" :key="project.id" class="card" @click="viewProject(project.id)">
      <div class="container-image">
        <svg v-if="project.cover === 'profile'" class="image-circle" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="M7 16l4-8 4 4 4-6"/></svg>
        <svg v-else-if="project.cover === 'ops'" class="image-circle" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><path d="M6 6h.01M6 18h.01"/></svg>
        <svg v-else class="image-circle" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
      </div>
      <div class="content">
        <div class="detail">
          <span>{{ project.title }}</span>
          <p>{{ project.year }}</p>
          <div class="detail-tech">
            <span v-for="t in project.tech.slice(0, 3)" :key="t" class="tech-tag">{{ t }}</span>
            <span v-if="project.tech.length > 3" class="tech-tag tech-more">+{{ project.tech.length - 3 }}</span>
          </div>
        </div>
        <div class="product-image">
          <div class="box-image">
            <div class="box-image-content">
              <svg v-if="project.cover === 'profile'" class="img-product" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="M7 16l4-8 4 4 4-6"/></svg>
              <svg v-else-if="project.cover === 'ops'" class="img-product" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><path d="M6 6h.01M6 18h.01"/></svg>
              <svg v-else class="img-product" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              <button class="detail-btn">查看详情</button>
            </div>
          </div>
        </div>
      </div>
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

<style scoped>
.card {
  position: relative;
  background: transparent;
  width: 300px;
  height: 300px;
  border: none;
}

.card:hover {
  width: 300px;
}

.card .container-image {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #f5f0e8;
  width: 190px;
  height: 190px;
  cursor: pointer;
  border: none;
  border-radius: 50%;
  box-shadow: 0 0 3px 1px #1818183d, 2px 2px 3px #18181865, inset 2px 2px 2px #ffffff;
  transition: all .3s ease-in-out, opacity .3s;
  transition-delay: .6s, 0s;
}

.card:hover .container-image {
  opacity: 0;
  border-radius: 8px;
  transition-delay: 0s, .6s;
}

.card .container-image .image-circle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 125px;
  height: auto;
  object-fit: contain;
  color: #333;
  filter: drop-shadow(2px 2px 2px #1818188a);
  transition: all .3s ease-in-out;
  transition-delay: .4s;
}

.card:hover .container-image .image-circle {
  opacity: 0;
  transition-delay: 0s;
}

.card .content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #f5f0e8;
  padding: 20px;
  width: 190px;
  height: 190px;
  cursor: pointer;
  border: none;
  border-radius: 8px;
  box-shadow: 0 0 3px 1px #1818183d, 2px 2px 3px #18181865, inset 2px 2px 2px #ffffff;
  visibility: hidden;
  transition: .3s ease-in-out;
  transition-delay: 0s;
  z-index: 1;
}

.card:hover .content {
  width: 290px;
  height: 190px;
  visibility: visible;
  transition-delay: .5s;
}

.card .content .detail {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: all .3s ease-in-out;
  transition-delay: 0s;
}

.card:hover .content .detail {
  color: #181818;
  opacity: 100%;
  transition: 1s;
  transition-delay: .3s;
}

.card .content .detail span {
  margin-bottom: 5px;
  font-size: 18px;
  font-weight: 800;
}

.card .content .detail p {
  margin: 0 0 8px;
  font-size: 14px;
  font-weight: 600;
  color: #b8854b;
}

.card .content .detail .detail-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 8px;
}

.card .content .detail .tech-tag {
  font-size: 12px;
  background: #e0e0e0;
  color: #333;
  padding: 4px 10px;
  border-radius: 12px;
}

.card .content .detail .tech-more {
  background: transparent;
  color: #999;
}

.card .content .detail button {
  background: #b8854b;
  margin-top: auto;
  width: 75px;
  height: 25px;
  color: #ffffff;
  font-size: 13px;
  border: none;
  border-radius: 8px;
  transition: .3s ease-in-out;
}

.card .content .detail button:hover {
  background: #d39f63;
}

.card .content .product-image {
  position: relative;
  width: 100%;
  height: 100%;
}

.card .content .product-image .box-image {
  display: flex;
  position: absolute;
  top: 0;
  left: -25%;
  width: 100%;
  height: 115%;
  opacity: 0;
  transform: scale(.5);
  transition: all .5s ease-in-out;
  transition-delay: 0s;
}

.card:hover .content .product-image .box-image {
  top: -25%;
  left: 0;
  opacity: 100%;
  transform: scale(1);
  transition-delay: .3s;
}

.card .content .product-image .box-image .box-image-content {
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  height: 100%;
}

.card .content .product-image .box-image .img-product {
  width: 10rem;
  max-width: 100%;
  height: auto;
  color: #333;
  flex-shrink: 0;
}

.card .content .product-image .box-image .detail-btn {
  background: #b8854b;
  width: 75px;
  height: 25px;
  color: #ffffff;
  font-size: 13px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: .3s ease-in-out;
  flex-shrink: 0;
}

.card .content .product-image .box-image .detail-btn:hover {
  background: #d39f63;
}

.fil-shoes1, .fil-shoes2 {
  fill: #333333
}
</style>
