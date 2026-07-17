<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { projectDetails } from '@/data/contents.js'

const route = useRoute()
const router = useRouter()
const id = computed(() => Number(route.params.id))

const project = computed(() => projectDetails[id.value])

function goBack() {
  router.push('/projects')
}

function openUrl(url: string) {
  window.open(url, '_blank', 'noopener noreferrer')
}
</script>

<template>
  <div class="min-h-[100dvh] bg-[#f5f0e8] pt-24 pb-20" v-if="project">
    <div class="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-20">
      <!-- Back Button -->
      <button
        class="font-mono text-sm tracking-wider uppercase px-4 py-2 border-2 border-[#161310] bg-[#fffaef] text-[#161310] shadow-[4px_4px_0_0_#161310] transition-all duration-200 hover:-translate-y-0.5 hover:translate-x-0.5 mb-8"
        @click="goBack"
      >
        ← 返回项目
      </button>

      <div class="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
        <!-- Left: Art Area -->
        <div class="w-full lg:w-1/2">
          <div class="relative aspect-video border-2 border-[#161310] shadow-[6px_6px_0_0_#161310] overflow-hidden bg-[#2e5dd6]">
            <!-- Pixel sky -->
            <div class="absolute inset-0" style="background: linear-gradient(to bottom, #2e5dd6 0%, #2e5dd6 60%, #1f47b0 60%, #1f47b0 100%)"></div>
            <!-- Sun -->
            <div class="absolute top-6 right-8 w-10 h-10 bg-[#fffaef] border-2 border-[#161310] shadow-[-6px_0_0_#fffaef,6px_0_0_#fffaef,0_-6px_0_#fffaef,0_6px_0_#fffaef]"></div>
            <!-- Cloud -->
            <div class="absolute top-[50px] left-[40px] w-12 h-3 bg-[#fffaef] border-2 border-[#161310]"></div>
            <div class="absolute top-[70px] left-[100px] w-8 h-3 bg-[#fffaef] border-2 border-[#161310]"></div>
            <!-- Mountain -->
            <div class="absolute bottom-[40px] left-0 right-0 h-20 bg-[#2f6e4f] border-t-2 border-[#161310]"
              style="clip-path: polygon(0 100%, 8% 60%, 16% 80%, 25% 30%, 35% 65%, 48% 18%, 58% 55%, 68% 38%, 78% 60%, 88% 30%, 100% 55%, 100% 100%)"
            ></div>
            <!-- Ground -->
            <div class="absolute bottom-0 left-0 right-0 h-[40px] bg-[#e2522e] border-t-2 border-[#161310]"
              style="background-image: repeating-linear-gradient(to right, transparent 0 8px, rgba(22,19,16,0.15) 8px 12px)"
            ></div>
            <!-- Project Icon -->
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="relative z-10 flex items-center justify-center w-24 h-24 bg-[#f5f0e8] border-2 border-[#161310] shadow-[4px_4px_0_0_#161310]">
                <svg v-if="id === 1" class="w-12 h-12 text-[#161310]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="M7 16l4-8 4 4 4-6"/></svg>
                <svg v-else-if="id === 2" class="w-12 h-12 text-[#161310]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><path d="M6 6h.01M6 18h.01"/></svg>
                <svg v-else-if="id === 4" class="w-12 h-12 text-[#161310]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M9 12l2 2 4-4"/><path d="M9 16l2 2 4-4"/></svg>
                <svg v-else class="w-12 h-12 text-[#161310]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              </div>
            </div>
            <!-- Badge -->
            <span class="absolute bottom-[10px] left-3 font-mono text-xs tracking-wider uppercase px-3 py-1.5 bg-[#161310] text-[#fffaef] border-2 border-[#fffaef] leading-none z-20">
              {{ project.year }}
            </span>
          </div>
        </div>

        <!-- Right: Content -->
        <div class="w-full lg:w-1/2">
          <!-- Meta -->
          <div class="flex items-center gap-3 mb-4 flex-wrap">
            <span class="font-mono text-xs tracking-wider uppercase px-3 py-1 bg-[#161310] text-[#fffaef] inline-block">{{ project.year }}</span>
            <span v-for="tag in project.tags" :key="tag" class="font-mono text-xs text-[#3a332a]">· {{ tag }}</span>
          </div>

          <!-- Title -->
          <h1 class="font-mono text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#161310] leading-tight">{{ project.title }}</h1>
          <p class="mt-3 font-mono text-sm text-[#3a332a] leading-relaxed">{{ project.subtitle }}</p>

          <!-- Divider -->
          <div class="my-6 border-t-2 border-dotted border-[#d9cdb3]"></div>

          <!-- Tech Stack -->
          <div>
            <p class="font-mono text-xs text-[#2e5dd6] uppercase tracking-wider mb-2.5">技术栈</p>
            <div class="flex flex-wrap gap-2">
              <span v-for="t in project.tech" :key="t"
                class="font-mono text-[11px] uppercase tracking-wider px-2.5 py-1 border-2 border-[#161310] bg-[#fffaef] text-[#161310] shadow-[2px_2px_0_0_#161310]"
              >{{ t }}</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="mt-8 flex flex-wrap gap-3">
            <a v-if="project.url" :href="project.url" target="_blank" rel="noopener noreferrer">
              <button class="font-mono text-sm tracking-wider uppercase px-5 py-2.5 border-2 border-[#161310] bg-[#161310] text-[#fffaef] shadow-[4px_4px_0_0_#161310] transition-all duration-200 hover:-translate-y-0.5 hover:translate-x-0.5 flex items-center gap-2">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/></svg>
                查看源码
              </button>
            </a>
            <button
              v-if="id === 2"
              class="font-mono text-sm tracking-wider uppercase px-5 py-2.5 border-2 border-[#161310] bg-[#2e5dd6] text-[#fffaef] shadow-[4px_4px_0_0_#161310] transition-all duration-200 hover:-translate-y-0.5 hover:translate-x-0.5 flex items-center gap-2"
              @click="router.push('/network-game')"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              开始体验
            </button>
          </div>
        </div>
      </div>

      <!-- Highlights -->
      <section class="mt-20">
        <div class="flex items-center gap-3 mb-8">
          <span class="font-mono text-sm tracking-widest text-[#2e5dd6] uppercase">项目亮点</span>
          <span class="font-mono text-xs text-[#3a332a]">Highlights</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div v-for="(h, index) in project.highlights" :key="h"
            class="bg-[#fffaef] border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] transition-all duration-200 hover:-translate-y-0.5"
          >
            <div class="flex items-start gap-4 p-5">
              <div class="flex-shrink-0 w-10 h-10 bg-[#f5f0e8] border-2 border-[#161310] flex items-center justify-center font-mono text-sm font-bold text-[#161310]">
                {{ String(index + 1).padStart(2, '0') }}
              </div>
              <div class="flex-1 pt-1">
                <p class="font-mono text-sm text-[#161310] leading-relaxed">{{ h }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Project Details -->
      <section class="mt-20">
        <div class="flex items-center gap-3 mb-8">
          <span class="font-mono text-sm tracking-widest text-[#2e5dd6] uppercase">项目介绍</span>
          <span class="font-mono text-xs text-[#3a332a]">Details</span>
        </div>
        <div class="bg-[#fffaef] border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] p-6 sm:p-8">
          <div class="font-mono text-sm text-[#161310] leading-relaxed prose-custom" v-html="project.details" />
        </div>
      </section>
    </div>
  </div>

  <!-- 404 -->
  <div v-else class="min-h-[100dvh] bg-[#f5f0e8] pt-24 pb-20 flex items-center justify-center px-6">
    <div class="text-center max-w-md">
      <div class="w-20 h-20 bg-[#fffaef] border-2 border-[#161310] shadow-[8px_8px_0_0_#161310] flex items-center justify-center font-mono text-3xl mx-auto mb-6">?</div>
      <h1 class="font-mono text-2xl font-bold text-[#161310] mb-2">项目未找到</h1>
      <p class="font-mono text-sm text-[#3a332a] mb-6">抱歉，您访问的项目不存在或已被移除。</p>
      <button
        class="font-mono text-sm tracking-wider uppercase px-4 py-2 border-2 border-[#161310] bg-[#fffaef] text-[#161310] shadow-[4px_4px_0_0_#161310] transition-all duration-200 hover:-translate-y-0.5 hover:translate-x-0.5"
        @click="goBack"
      >
        ← 返回项目列表
      </button>
    </div>
  </div>
</template>

<style scoped>
.prose-custom {
  line-height: 1.8;
}
.prose-custom p { margin-bottom: 1rem; }
.prose-custom h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #161310;
  margin-top: 2rem;
  margin-bottom: 1rem;
  padding-left: 0.75rem;
  border-left: 3px solid #2e5dd6;
  font-family: "Pixelify Sans", ui-monospace, monospace;
}
.prose-custom ul { 
  padding-left: 1.5rem; 
  margin-bottom: 1rem; 
  list-style: none;
}
.prose-custom ul li {
  position: relative;
  padding-left: 0.5rem;
  margin-bottom: 0.6rem;
}
.prose-custom ul li::before {
  content: "";
  position: absolute;
  left: -1.25rem;
  top: 0.6rem;
  width: 6px;
  height: 6px;
  background-color: #2e5dd6;
}
.prose-custom strong { color: #161310; font-weight: 700; }
.prose-custom code {
  background: #f2ead6;
  padding: 2px 6px;
  border: 1px solid #d9cdb3;
  font-size: 0.9em;
  color: #161310;
}
</style>
