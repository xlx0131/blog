<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { bookmarks } from '@/data/bookmarks.js'

const router = useRouter()

const activeTab = ref('all')

const allItems = computed(() => {
  return bookmarks.flatMap((cat: any) =>
    cat.items.map((item: any) => ({ ...item, category: cat.name }))
  )
})

const filteredItems = computed(() => {
  if (activeTab.value === 'all') return allItems.value
  return allItems.value.filter((item: any) => item.category === activeTab.value)
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
</script>

<template>
  <div class="min-h-[100dvh] bg-[#f5f0e8] py-24 px-6 sm:px-10 lg:px-20">
    <div class="max-w-[1400px] mx-auto">
      <!-- 标题区 -->
      <div class="mb-8">
        <span class="font-mono text-sm tracking-widest text-[#2e5dd6] uppercase">收藏夹</span>
        <h1 class="font-mono text-4xl sm:text-5xl font-black tracking-tight text-[#161310] mt-1">我的收藏</h1>
        <p class="font-mono text-sm text-[#3a332a] mt-2">{{ bookmarks.length }} 个分类，共 {{ totalCount }} 个精选网站</p>
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

      <!-- 卡片网格 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <article
          v-for="item in filteredItems"
          :key="item.id"
          class="ow-quest-card group cursor-pointer"
          @click="openDetail(item)"
        >
          <!-- 像素艺术区 -->
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

          <!-- 内容区 -->
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
