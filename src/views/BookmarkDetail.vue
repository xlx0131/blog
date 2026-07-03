<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { bookmarks } from '@/data/bookmarks.js'

const route = useRoute()
const router = useRouter()
const id = computed(() => Number(route.params.id))

const allItems = bookmarks.flatMap(cat => cat.items.map(item => ({ ...item, category: cat.name })))
const item = computed(() => allItems.find(i => i.id === id.value))

const relatedItems = computed(() => {
  if (!item.value) return []
  return allItems
    .filter(i => i.category === item.value!.category && i.id !== item.value!.id)
    .slice(0, 4)
})

function goBack() {
  router.push('/bookmarks')
}

function openUrl(url: string) {
  window.open(url, '_blank', 'noopener noreferrer')
}

function getInitials(name: string) {
  return name.slice(0, 2).toUpperCase()
}

function getDomain(url: string) {
  try {
    return new URL(url).hostname.replace('www.', '')
  } catch {
    return url
  }
}

onMounted(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})
</script>

<template>
  <div class="min-h-[100dvh] bg-[#f5f0e8] pt-24 pb-20" v-if="item">
    <div class="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-20">
      <button
        class="font-mono text-sm tracking-wider uppercase px-4 py-2 border-2 border-[#161310] bg-[#fffaef] text-[#161310] shadow-[4px_4px_0_0_#161310] transition-all duration-200 hover:-translate-y-0.5 hover:translate-x-0.5 mb-8"
        @click="goBack"
      >
        ← 返回收藏夹
      </button>

      <div class="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
        <!-- 左侧图标区 -->
        <div class="w-full lg:w-2/5">
          <div class="sticky top-28">
            <div class="relative aspect-square rounded-none bg-[#fffaef] border-2 border-[#161310] shadow-[8px_8px_0_0_#161310] flex items-center justify-center overflow-hidden group">
              <div class="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
                <span class="font-mono text-xs tracking-wider uppercase px-3 py-1 bg-[#161310] text-[#fffaef]">
                  {{ item.category }}
                </span>
                <div class="w-2.5 h-2.5 rounded-full bg-[#2e5dd6] animate-pulse"></div>
              </div>
              <div class="relative z-10 w-28 h-28 rounded-none bg-[#f5f0e8] border-2 border-[#161310] flex items-center justify-center text-[#161310] font-mono font-bold text-3xl shadow-[4px_4px_0_0_#161310] transition-all duration-500 group-hover:scale-110">
                {{ getInitials(item.name) }}
              </div>
              <div class="absolute bottom-4 left-4 right-4 z-10">
                <div class="flex items-center gap-2 font-mono text-xs text-[#3a332a]">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M2 12h20"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                  <span class="truncate">{{ getDomain(item.url) }}</span>
                </div>
              </div>
            </div>

            <div class="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                class="flex-1 font-mono text-sm tracking-wider uppercase px-4 py-3 border-2 border-[#161310] bg-[#f5f0e8] text-[#161310] shadow-[4px_4px_0_0_#161310] transition-all duration-200 hover:-translate-y-0.5 hover:translate-x-0.5"
                @click="openUrl(item.url)"
              >
                直达链接 ▸
              </button>
              <button
                class="font-mono text-sm tracking-wider uppercase px-4 py-3 border-2 border-[#161310] bg-[#fffaef] text-[#161310] shadow-[4px_4px_0_0_#161310] transition-all duration-200 hover:-translate-y-0.5 hover:translate-x-0.5"
                @click="goBack"
              >
                ← 返回
              </button>
            </div>
          </div>
        </div>

        <!-- 右侧详情区 -->
        <div class="w-full lg:w-3/5">
          <div class="mb-6">
            <span class="font-mono text-xs tracking-wider uppercase px-3 py-1 bg-[#161310] text-[#fffaef] inline-block mb-3">
              {{ item.category }}
            </span>
            <h1 class="font-mono text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#161310]">
              {{ item.name }}
            </h1>
          </div>

          <!-- 简介 -->
          <div class="bg-[#fffaef] border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] p-6">
            <div class="flex items-center gap-2 mb-4">
              <svg class="w-4 h-4 text-[#2e5dd6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4"/>
                <path d="M12 8h.01"/>
              </svg>
              <span class="font-mono text-sm font-bold text-[#161310]">简介</span>
            </div>
            <p class="font-mono text-sm text-[#3a332a] leading-relaxed">
              {{ item.desc }}
            </p>
          </div>

          <!-- 功能介绍 -->
          <div v-if="item.detail" class="mt-6 bg-[#fffaef] border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] p-6">
            <div class="flex items-center gap-2 mb-4">
              <svg class="w-4 h-4 text-[#2e5dd6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
              </svg>
              <span class="font-mono text-sm font-bold text-[#161310]">功能介绍</span>
            </div>
            <div class="font-mono text-sm text-[#3a332a] leading-relaxed whitespace-pre-line">
              {{ item.detail }}
            </div>
          </div>

          <!-- 分类 & 域名 -->
          <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="bg-[#fffaef] border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] p-5">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-[#161310]/10 border-2 border-[#161310] flex items-center justify-center text-[#161310]">
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <div>
                  <p class="font-mono text-xs text-[#3a332a]">分类</p>
                  <p class="font-mono text-sm font-bold text-[#161310] mt-0.5">{{ item.category }}</p>
                </div>
              </div>
            </div>

            <div class="bg-[#fffaef] border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] p-5">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-[#161310]/10 border-2 border-[#161310] flex items-center justify-center text-[#161310]">
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M2 12h20"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                </div>
                <div class="min-w-0">
                  <p class="font-mono text-xs text-[#3a332a]">域名</p>
                  <p class="font-mono text-sm font-bold text-[#161310] mt-0.5 truncate">{{ getDomain(item.url) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 访问按钮 -->
          <div class="mt-10">
            <button
              class="w-full sm:w-auto font-mono text-sm tracking-wider uppercase px-6 py-3 border-2 border-[#161310] bg-[#f5f0e8] text-[#161310] shadow-[4px_4px_0_0_#161310] transition-all duration-200 hover:-translate-y-0.5 hover:translate-x-0.5"
              @click="openUrl(item.url)"
            >
              立即访问 {{ item.name }} ▸
            </button>
          </div>
        </div>
      </div>

      <!-- 相关推荐 -->
      <div v-if="relatedItems.length > 0" class="mt-20">
        <div class="flex items-center justify-between mb-6">
          <h2 class="font-mono text-xl font-black text-[#161310]">相关推荐</h2>
          <span class="font-mono text-xs text-[#3a332a]">{{ relatedItems.length }} 个</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            v-for="related in relatedItems"
            :key="related.id"
            class="cursor-pointer bg-[#fffaef] border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] transition-all duration-200 hover:-translate-y-0.5 group p-4"
            @click="router.push(`/bookmarks/${related.id}`)"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-[#f5f0e8] border-2 border-[#161310] flex items-center justify-center text-[#161310] font-mono font-bold text-sm shrink-0 transition-all duration-300 group-hover:scale-105">
                {{ getInitials(related.name) }}
              </div>
              <div class="min-w-0 flex-1">
                <h4 class="font-mono text-sm font-bold text-[#161310] truncate">
                  {{ related.name }}
                </h4>
                <p class="font-mono text-xs text-[#3a332a] line-clamp-1 mt-0.5">
                  {{ related.desc }}
                </p>
              </div>
              <svg class="w-4 h-4 text-[#3a332a] opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 404 -->
  <div v-else class="min-h-[100dvh] bg-[#f5f0e8] pt-24 pb-20 flex items-center justify-center px-6">
    <div class="text-center max-w-md">
      <div class="w-20 h-20 bg-[#fffaef] border-2 border-[#161310] shadow-[8px_8px_0_0_#161310] flex items-center justify-center font-mono text-3xl mx-auto mb-6">?</div>
      <h1 class="font-mono text-2xl font-bold text-[#161310] mb-2">收藏未找到</h1>
      <p class="font-mono text-sm text-[#3a332a] mb-6">
        你访问的收藏不存在，可能已被移除或链接有误。
      </p>
      <button
        class="font-mono text-sm tracking-wider uppercase px-4 py-2 border-2 border-[#161310] bg-[#fffaef] text-[#161310] shadow-[4px_4px_0_0_#161310] transition-all duration-200 hover:-translate-y-0.5 hover:translate-x-0.5"
        @click="goBack"
      >
        ← 返回收藏夹
      </button>
    </div>
  </div>
</template>
