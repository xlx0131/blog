<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { bookmarks } from '@/data/bookmarks.js'

const router = useRouter()

const activeTab = ref('all')
const searchQuery = ref('')
const cardViewMode = ref<'pixel' | 'browser'>('pixel')

const allItems = computed(() => {
  return bookmarks.flatMap((cat: any) =>
    cat.items.map((item: any) => ({ ...item, category: cat.name }))
  )
})

const filteredItems = computed(() => {
  let items = allItems.value
  // 分类过滤
  if (activeTab.value !== 'all') {
    items = items.filter((item: any) => item.category === activeTab.value)
  }
  // 搜索过滤（匹配名称、简介、详细功能）
  const q = searchQuery.value.trim().toLowerCase()
  if (q) {
    items = items.filter((item: any) =>
      item.name.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q) ||
      (item.detail && item.detail.toLowerCase().includes(q))
    )
  }
  return items
})

const totalCount = computed(() => allItems.value.length)

function openDetail(bookmark: { id: number }) {
  router.push(`/bookmarks/${bookmark.id}`)
}

function getInitials(name: string) {
  return name.slice(0, 2).toUpperCase()
}

const categorySkyColors: Record<string, { sky: string; skyPressed: string; mountain: string; ground: string; accent: string }> = {
  '开发工具': { sky: '#2e5dd6', skyPressed: '#1f47b0', mountain: '#2f6e4f', ground: '#e2522e', accent: '#2e5dd6' },
  'AI 工具': { sky: '#7c3aed', skyPressed: '#6d28d9', mountain: '#1e3a5f', ground: '#a855f7', accent: '#7c3aed' },
  '在线学习': { sky: '#059669', skyPressed: '#047857', mountain: '#166534', ground: '#f59e0b', accent: '#059669' },
  '设计资源': { sky: '#ea580c', skyPressed: '#c2410c', mountain: '#9a3412', ground: '#f97316', accent: '#ea580c' },
  '工具集合': { sky: '#475569', skyPressed: '#334155', mountain: '#1e293b', ground: '#64748b', accent: '#475569' },
  '娱乐生活': { sky: '#db2777', skyPressed: '#be185d', mountain: '#831843', ground: '#f43f5e', accent: '#db2777' },
}

function getCategoryColors(cat: string) {
  return categorySkyColors[cat] || categorySkyColors['开发工具']
}

// 搜索快捷键 /
function onKeydown(e: KeyboardEvent) {
  if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
    e.preventDefault()
    document.getElementById('ow-search-input')?.focus()
  }
}

import { onMounted, onBeforeUnmount } from 'vue'
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div class="min-h-[100dvh] bg-[#f5f0e8] py-24 px-6 sm:px-10 lg:px-20">
    <div class="max-w-[1400px] mx-auto">
      <!-- 标题区 -->
      <div class="flex items-start justify-between mb-8">
        <div>
          <span class="font-mono text-sm tracking-widest text-[#2e5dd6] uppercase">收藏夹</span>
          <h1 class="font-mono text-4xl sm:text-5xl font-black tracking-tight text-[#161310] mt-1">我的收藏</h1>
          <p class="font-mono text-sm text-[#3a332a] mt-2">{{ bookmarks.length }} 个分类，共 {{ totalCount }} 个精选网站</p>
        </div>

        <!-- 切换开关 -->
        <div class="overflow-hidden" style="width: 96px; height: 56px;">
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
                for="card-switch"
                class="w-full h-10 border-4 border-[#121331] rounded cursor-pointer"
                :class="cardViewMode === 'pixel' ? 'scale-x-[-1]' : ''"
              >
                <input
                  type="checkbox"
                  id="card-switch"
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

      <!-- 搜索栏 -->
      <div class="ow-search mb-8">
        <label class="ow-search__label" for="ow-search-input">QUEST LOG</label>
        <div class="ow-search__field">
          <svg class="ow-search__icon" viewBox="0 0 256 256" aria-hidden="true">
            <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
          </svg>
          <input
            id="ow-search-input"
            class="ow-search__input"
            type="text"
            placeholder="Search the overworld..."
            v-model="searchQuery"
          />
          <kbd class="ow-search__kbd">/</kbd>
        </div>
        <p class="ow-search__help">
          按 <span>/</span> 快速聚焦。搜索名称、简介或功能介绍。
        </p>
      </div>

      <!-- 分类 Tabs -->
      <div class="mb-10 flex flex-wrap gap-2">
        <button
          class="font-mono text-sm tracking-wider uppercase px-4 py-2 border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] transition-all duration-200 hover:-translate-y-0.5 hover:translate-x-0.5"
          :class="activeTab === 'all' ? 'bg-[#161310] text-[#fffaef]' : 'bg-[#fffaef] text-[#161310]'"
          @click="activeTab = 'all'"
        >
          全部 ({{ totalCount }})
        </button>
        <button
          v-for="cat in bookmarks"
          :key="cat.name"
          class="font-mono text-sm tracking-wider uppercase px-4 py-2 border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] transition-all duration-200 hover:-translate-y-0.5 hover:translate-x-0.5"
          :class="activeTab === cat.name ? 'bg-[#161310] text-[#fffaef]' : 'bg-[#fffaef] text-[#161310]'"
          @click="activeTab = cat.name"
        >
          {{ cat.name }} ({{ cat.items.length }})
        </button>
      </div>

      <!-- 卡片网格 - 网页模式 -->
      <div v-if="cardViewMode === 'browser'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="item in filteredItems"
          :key="item.id"
          class="browser group cursor-pointer"
          @click="openDetail(item)"
        >
          <div class="browser-tabs-head">
            <div class="browser-tabs">
              <div class="browser-tab-open">
                <div class="browser-rounded-l"><div class="browser-mask-round"></div></div>
                <span>{{ item.name }}</span>
                <div class="browser-close-tab">✕</div>
                <div class="browser-rounded-r"><div class="browser-mask-round"></div></div>
              </div>
            </div>
            <div class="browser-window-opt">
              <button class="browser-opt-btn">-</button>
              <button class="browser-opt-btn">□</button>
              <button class="browser-opt-btn browser-close-win">✕</button>
            </div>
          </div>
          <div class="browser-head-browser">
            <button disabled>←</button>
            <button disabled>→</button>
            <div class="browser-url-bar">
              <input type="text" readonly :value="item.url" />
            </div>
            <button>⋮</button>
            <button class="browser-star">✰</button>
          </div>
          <div class="browser-body">
            <p class="browser-desc">{{ item.desc }}</p>
            <span class="browser-category">{{ item.category }}</span>
          </div>
        </div>
      </div>

      <!-- 卡片网格 - 像素模式 -->
      <div v-if="cardViewMode === 'pixel'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <article
          v-for="item in filteredItems"
          :key="item.id"
          class="ow-quest-card group cursor-pointer"
          @click="openDetail(item)"
        >
          <div class="ow-quest-card__art" :style="{ backgroundColor: getCategoryColors(item.category).sky }">
            <div class="ow-quest-card__sky" :style="{
              background: `linear-gradient(to bottom, ${getCategoryColors(item.category).sky} 0%, ${getCategoryColors(item.category).sky} 64%, ${getCategoryColors(item.category).skyPressed} 64%, ${getCategoryColors(item.category).skyPressed} 100%)`
            }"></div>
            <div class="ow-quest-card__sun"></div>
            <div class="ow-quest-card__cloud ow-quest-card__cloud--a"></div>
            <div class="ow-quest-card__cloud ow-quest-card__cloud--b"></div>
            <div class="ow-quest-card__mountain" :style="{
              backgroundColor: getCategoryColors(item.category).mountain
            }"></div>
            <div class="ow-quest-card__ground" :style="{
              backgroundColor: getCategoryColors(item.category).ground
            }"></div>
            <span class="ow-quest-card__badge">{{ item.category }}</span>
          </div>
          <div class="ow-quest-card__body">
            <p class="ow-quest-card__kicker" :style="{ color: getCategoryColors(item.category).accent }">
              {{ getInitials(item.name) }} · {{ item.name.slice(0, 2).toUpperCase() }}
            </p>
            <h3 class="ow-quest-card__title">{{ item.name }}</h3>
            <p class="ow-quest-card__copy">{{ item.desc }}</p>
            <div class="ow-quest-card__meta">
              <span class="ow-quest-card__stamp">{{ item.category }}</span>
              <span class="ow-quest-card__stamp ow-quest-card__stamp--accent">查看详情 ▸</span>
            </div>
          </div>
        </article>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredItems.length === 0" class="mt-16 flex flex-col items-center py-16 text-center">
        <div class="w-20 h-20 bg-[#fffaef] border-2 border-[#161310] shadow-[8px_8px_0_0_#161310] flex items-center justify-center font-mono text-3xl mb-4">?</div>
        <h3 class="font-mono text-xl font-bold text-[#161310]">暂无收藏</h3>
        <p class="font-mono text-sm text-[#3a332a] mt-1">该分类下还没有收藏的网站</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ─── 浏览器卡片 (Browser Card) ─── */
.browser {
  width: 100%;
  height: 220px;
  background: #f5f0e8;
  border-radius: 7px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  box-shadow: 5px 5px 10px rgba(31, 31, 31, 0.15);
  transition: all 0.2s ease;
  border: 1px solid #d9cdb3;
}

.browser:hover {
  transform: translateY(-2px);
  box-shadow: 8px 8px 15px rgba(31, 31, 31, 0.2);
}

/* tabs-head */
.browser-tabs-head {
  background-color: #e8dcc8;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: end;
  padding-left: 20px;
}

.browser-tab-open {
  width: 100px;
  height: 34px;
  border-radius: 7px 7px 0 0;
  background-color: #f5f0e8;
  display: flex;
  gap: 5px;
  align-items: start;
  justify-content: space-between;
  padding: 4px 8px;
  position: relative;
}

.browser-tab-open .browser-close-tab {
  color: #666;
  font-size: 9px;
  padding: 1px 4px 1px 4px;
  border-radius: 50%;
  cursor: default;
}
.browser-tab-open .browser-close-tab:hover {
  background-color: #d9cdb3;
}

.browser-tab-open .browser-rounded-l {
  position: absolute;
  background-color: #f5f0e8;
  width: 20px;
  height: 24px;
  top: 0;
  right: 0;
  transform: translate(100%);
  overflow: hidden;
}
.browser-tab-open .browser-rounded-l .browser-mask-round {
  width: 100%;
  height: 100%;
  background-color: #e8dcc8;
  border-radius: 0 0 0 7px;
}

.browser-tab-open .browser-rounded-r {
  position: absolute;
  background-color: #f5f0e8;
  width: 20px;
  height: 24px;
  top: 0;
  left: 0;
  transform: translate(-100%);
  overflow: hidden;
}

.browser-tab-open .browser-rounded-r .browser-mask-round {
  width: 100%;
  height: 100%;
  background-color: #e8dcc8;
  border-radius: 0 0 7px 0;
}

.browser-tab-open span {
  color: #161310;
  font-size: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 70px;
}

.browser-window-opt {
  display: flex;
}

.browser-window-opt .browser-opt-btn {
  height: 30px;
  width: 30px;
  border: none;
  background-color: transparent;
  transition: 0.1s ease-out;
  color: #666;
  margin-bottom: 10px;
  cursor: default;
}

.browser-window-opt .browser-opt-btn:hover {
  background-color: #d9cdb3;
}

.browser-window-opt .browser-close-win:hover {
  background-color: rgb(255, 52, 52);
  color: #fff;
}

/* head-browser */
.browser-head-browser {
  position: absolute;
  top: 30px;
  width: 100%;
  height: 40px;
  background-color: #f5f0e8;
  padding: 7px;
  display: flex;
  border-radius: 7px 7px 0 0;
  gap: 5px;
}

.browser-url-bar {
  flex: 1;
  height: 100%;
}

.browser-url-bar input {
  background-color: #fffaef;
  border: 1px solid #d9cdb3;
  height: 100%;
  width: 100%;
  border-radius: 20px;
  outline: none;
  color: #161310;
  padding: 0 15px;
  font-size: 11px;
  transition: 0.2s ease-in-out;
  cursor: pointer;
}

.browser-url-bar input:hover {
  background-color: #fff;
  border-color: #161310;
}

.browser-url-bar input:focus {
  border-color: #2e5dd6;
  background-color: #fffaef;
  transition: none;
}

.browser-head-browser button {
  width: 27px;
  height: 25px;
  border: none;
  background-color: transparent;
  color: #666;
  border-radius: 50%;
  transition: 0.2s ease-in-out;
  cursor: default;
  flex-shrink: 0;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.browser-head-browser button:disabled {
  opacity: 0.3;
}

.browser-head-browser button:hover:not(:disabled) {
  background-color: #d9cdb3;
}

.browser-head-browser button:disabled:hover {
  background-color: transparent;
}

.browser-star {
  color: #666;
  font-size: 15px;
  opacity: 0.5;
}

/* body */
.browser-body {
  flex: 1;
  background: #fffaef;
  padding: 50px 14px 14px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
}

.browser-desc {
  font-size: 13px;
  color: #161310;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
}

.browser-category {
  font-size: 10px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* ─── 搜索框 (Quest Log) ─── */
.ow-search {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 360px;
  max-width: 100%;
  font-family: "Inter", ui-sans-serif, system-ui, sans-serif;
  color: #161310;
}

.ow-search__label {
  font-family: "VT323", ui-monospace, monospace;
  font-size: 18px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #161310;
  line-height: 1;
}

.ow-search__field {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 10px 0 12px;
  height: 52px;
  background-color: #fffaef;
  border: 2px solid #161310;
  box-shadow: 4px 4px 0 0 #161310;
  transition: box-shadow 120ms ease, border-color 120ms ease;
}

.ow-search__field:focus-within {
  border-color: #2e5dd6;
  box-shadow: 4px 4px 0 0 #2e5dd6;
}

.ow-search__icon {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  fill: #161310;
}

.ow-search__input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-family: "VT323", ui-monospace, monospace;
  font-size: 22px;
  line-height: 1;
  color: #161310;
  padding: 0;
  margin: 0;
}

.ow-search__input::placeholder {
  color: #3a332a;
  opacity: 0.7;
}

.ow-search__kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  padding: 0 8px;
  font-family: "VT323", ui-monospace, monospace;
  font-size: 18px;
  background-color: #f2ead6;
  color: #161310;
  border: 2px solid #161310;
  line-height: 1;
  flex-shrink: 0;
}

.ow-search__help {
  font-family: "VT323", ui-monospace, monospace;
  font-size: 16px;
  color: #3a332a;
  line-height: 1.2;
  margin: 0;
  letter-spacing: 0.02em;
}

.ow-search__help span {
  font-family: "VT323", ui-monospace, monospace;
  background-color: #f2ead6;
  border: 2px solid #161310;
  padding: 0 6px;
  display: inline-block;
  line-height: 1.1;
  color: #161310;
}

/* ─── Quest Card (像素风任务卡片) ─── */
.ow-quest-card {
  width: 100%;
  background-color: #fffaef;
  color: #161310;
  border: 2px solid #161310;
  box-shadow: 8px 8px 0 0 #161310;
  font-family: "Inter", ui-sans-serif, sans-serif;
  clip-path: polygon(
    0 0,
    calc(100% - 14px) 0,
    100% 14px,
    100% 100%,
    14px 100%,
    0 calc(100% - 14px)
  );
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.ow-quest-card:hover {
  transform: translate(-2px, -2px);
  box-shadow: 12px 12px 0 0 #161310;
}

.ow-quest-card__art {
  position: relative;
  height: 144px;
  border-bottom: 2px solid #161310;
  overflow: hidden;
  image-rendering: pixelated;
}

.ow-quest-card__sky {
  position: absolute;
  inset: 0;
}

.ow-quest-card__sun {
  position: absolute;
  top: 18px;
  right: 30px;
  width: 28px;
  height: 28px;
  background-color: #fffaef;
  border: 2px solid #161310;
  box-shadow:
    -6px 0 0 #fffaef,
    6px 0 0 #fffaef,
    0 -6px 0 #fffaef,
    0 6px 0 #fffaef;
}

.ow-quest-card__cloud {
  position: absolute;
  background-color: #fffaef;
  border: 2px solid #161310;
  height: 10px;
}

.ow-quest-card__cloud--a {
  top: 36px;
  left: 24px;
  width: 36px;
}

.ow-quest-card__cloud--b {
  top: 58px;
  left: 80px;
  width: 24px;
}

.ow-quest-card__mountain {
  position: absolute;
  bottom: 34px;
  left: -10px;
  right: -10px;
  height: 66px;
  clip-path: polygon(
    0 100%,
    10% 70%,
    18% 84%,
    28% 36%,
    38% 70%,
    48% 24%,
    58% 60%,
    68% 42%,
    78% 68%,
    88% 36%,
    100% 60%,
    100% 100%
  );
  border-top: 2px solid #161310;
}

.ow-quest-card__ground {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 36px;
  border-top: 2px solid #161310;
  background-image: repeating-linear-gradient(
    to right,
    transparent 0 8px,
    rgba(22, 19, 16, 0.18) 8px 12px
  );
}

.ow-quest-card__badge {
  position: absolute;
  bottom: 10px;
  left: 12px;
  font-family: "VT323", ui-monospace, monospace;
  font-size: 16px;
  letter-spacing: 0.08em;
  padding: 3px 8px 2px;
  background-color: #161310;
  color: #fffaef;
  border: 2px solid #fffaef;
  line-height: 1;
  text-transform: uppercase;
}

.ow-quest-card__body {
  padding: 18px 20px 20px;
}

.ow-quest-card__kicker {
  font-family: "VT323", ui-monospace, monospace;
  font-size: 16px;
  letter-spacing: 0.08em;
  margin: 0 0 6px;
  line-height: 1;
  text-transform: uppercase;
}

.ow-quest-card__title {
  font-family: "Pixelify Sans", ui-monospace, monospace;
  font-weight: 700;
  font-size: 28px;
  line-height: 1.04;
  color: #161310;
  letter-spacing: -0.015em;
  margin: 0 0 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ow-quest-card__copy {
  font-family: "Inter", ui-sans-serif, sans-serif;
  font-size: 14px;
  line-height: 1.45;
  color: #3a332a;
  margin: 0 0 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ow-quest-card__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding-top: 10px;
  border-top: 2px dotted #d9cdb3;
}

.ow-quest-card__stamp {
  font-family: "VT323", ui-monospace, monospace;
  font-size: 16px;
  letter-spacing: 0.04em;
  color: #3a332a;
  line-height: 1;
  text-transform: uppercase;
}

.ow-quest-card__stamp--accent {
  color: #e2522e;
}
</style>
