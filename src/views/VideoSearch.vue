<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { mockVideoList } from '@/data/video-mock.js'

interface VideoItem {
  vod_id: number
  vod_name: string
  vod_pic: string
  vod_remarks: string
  type_name: string
  vod_year: number
  vod_area: string
  _source?: string
  _sourceName?: string
}

interface SourceInfo {
  key: string
  name: string
  active: boolean
}

const router = useRouter()
const route = useRoute()

const searchQuery = ref('')
const searchResults = ref<VideoItem[]>([])
const loading = ref(false)
const hasSearched = ref(false)
const activeSource = ref('all')

const sources: SourceInfo[] = [
  { key: 'all', name: '全部', active: true },
  { key: 'heimuer', name: '黑木耳', active: false },
  { key: 'ffzy', name: '非凡资源', active: false },
  { key: 'subo', name: '速播资源', active: false },
]

const hotSearches = [
  '星际远征', '像素勇士', '末日之城', '时光旅人',
  '黑客纪元', '龙骑士传说', '海洋之心', '暗夜追击'
]

const filteredResults = computed(() => {
  if (activeSource.value === 'all') return searchResults.value
  return searchResults.value.filter(v => v._source === activeSource.value)
})

async function doSearch() {
  const query = searchQuery.value.trim()
  if (!query) return
  
  loading.value = true
  hasSearched.value = true
  
  try {
    const res = await fetch(`/api/video/search?wd=${encodeURIComponent(query)}`)
    if (!res.ok) throw new Error('API error')
    const data = await res.json()
    
    if (data.success && data.data && data.data.list) {
      searchResults.value = data.data.list
    } else {
      throw new Error('no data')
    }
  } catch {
    const allVideos: VideoItem[] = []
    Object.values(mockVideoList as any).forEach((list: VideoItem[]) => {
      allVideos.push(...list)
    })
    
    const queryLower = query.toLowerCase()
    searchResults.value = allVideos.filter(v => 
      v.vod_name.toLowerCase().includes(queryLower) ||
      (v.vod_actor && v.vod_actor.toLowerCase().includes(queryLower)) ||
      (v.vod_director && v.vod_director.toLowerCase().includes(queryLower))
    ).slice(0, 40).map((v, i) => ({
      ...v,
      _source: ['heimuer', 'ffzy', 'subo'][i % 3],
      _sourceName: ['黑木耳', '非凡资源', '速播资源'][i % 3],
    }))
  }
  
  loading.value = false
}

function selectSource(sourceKey: string) {
  activeSource.value = sourceKey
}

function searchHotKeyword(keyword: string) {
  searchQuery.value = keyword
  doSearch()
}

function goToDetail(vodId: number) {
  router.push(`/video/detail/${vodId}`)
}

function goToHome() {
  router.push('/video')
}

onMounted(() => {
  const wd = route.query.wd
  if (wd && typeof wd === 'string') {
    searchQuery.value = wd
    doSearch()
  }
})
</script>

<template>
  <div class="min-h-[100dvh] bg-[#f5f0e8]">
    <header class="sticky top-0 z-50 bg-[#fffaef] border-b-2 border-[#161310] shadow-[0_4px_0_0_#161310]">
      <div class="max-w-[1400px] mx-auto px-6 py-4">
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-3 cursor-pointer" @click="goToHome">
            <div class="w-10 h-10 bg-[#ff6b35] border-2 border-[#161310] flex items-center justify-center">
              <span class="font-['Pixelify_Sans',monospace] text-xl font-black text-[#fffaef]">★</span>
            </div>
            <h1 class="font-['Pixelify_Sans',monospace] text-2xl font-black text-[#161310] tracking-wider">
              QQ星TV
            </h1>
          </div>
          <div class="flex-1 max-w-2xl">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="搜索电影、电视剧、动漫..."
                class="w-full px-4 py-2.5 pl-12 font-mono text-sm border-2 border-[#161310] bg-[#f5f0e8] text-[#161310] placeholder-[#3a332a]/50 focus:outline-none focus:bg-[#fffaef] transition-colors"
                @keyup.enter="doSearch"
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
              <button
                class="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-[#ff6b35] text-[#fffaef] font-mono text-sm font-bold border-2 border-[#161310] hover:bg-[#161310] transition-colors"
                @click="doSearch"
              >
                搜索
              </button>
            </div>
          </div>
          <button
            class="hidden sm:block px-4 py-2 font-mono text-sm border-2 border-[#161310] bg-[#fffaef] text-[#161310] hover:bg-[#161310] hover:text-[#fffaef] transition-colors"
            @click="goToHome"
          >
            ← 返回
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-[1400px] mx-auto px-6 py-8">
      <div v-if="!hasSearched" class="py-10">
        <div class="bg-[#fffaef] border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] p-6 sm:p-8">
          <h2 class="font-['Pixelify_Sans',monospace] text-xl font-black text-[#161310] mb-4">
            🔥 热门搜索
          </h2>
          <div class="flex flex-wrap gap-3">
            <button
              v-for="keyword in hotSearches"
              :key="keyword"
              class="px-4 py-2 font-mono text-sm border-2 border-[#161310] bg-[#f5f0e8] text-[#161310] hover:bg-[#ff6b35] hover:text-[#fffaef] transition-colors"
              @click="searchHotKeyword(keyword)"
            >
              {{ keyword }}
            </button>
          </div>
        </div>

        <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-[#fffaef] border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] p-6">
            <div class="w-12 h-12 bg-[#ff6b35] border-2 border-[#161310] flex items-center justify-center mb-4">
              <span class="text-2xl">🎬</span>
            </div>
            <h3 class="font-['Pixelify_Sans',monospace] text-lg font-bold text-[#161310] mb-2">海量资源</h3>
            <p class="font-mono text-xs text-[#3a332a] leading-relaxed">
              聚合多个资源站，电影、电视剧、动漫、综艺应有尽有
            </p>
          </div>
          <div class="bg-[#fffaef] border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] p-6">
            <div class="w-12 h-12 bg-[#ff6b35] border-2 border-[#161310] flex items-center justify-center mb-4">
              <span class="text-2xl">⚡</span>
            </div>
            <h3 class="font-['Pixelify_Sans',monospace] text-lg font-bold text-[#161310] mb-2">极速搜索</h3>
            <p class="font-mono text-xs text-[#3a332a] leading-relaxed">
              多源同时搜索，快速找到你想看的内容
            </p>
          </div>
          <div class="bg-[#fffaef] border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] p-6">
            <div class="w-12 h-12 bg-[#ff6b35] border-2 border-[#161310] flex items-center justify-center mb-4">
              <span class="text-2xl">🎮</span>
            </div>
            <h3 class="font-['Pixelify_Sans',monospace] text-lg font-bold text-[#161310] mb-2">像素风格</h3>
            <p class="font-mono text-xs text-[#3a332a] leading-relaxed">
              复古像素风界面，给你不一样的观影体验
            </p>
          </div>
        </div>
      </div>

      <template v-else>
        <div class="mb-6">
          <h2 class="font-['Pixelify_Sans',monospace] text-xl font-bold text-[#161310] mb-4">
            搜索结果: "<span class="text-[#ff6b35]">{{ searchQuery }}</span>"
            <span class="font-mono text-sm text-[#3a332a] ml-2 font-normal">
              共 {{ filteredResults.length }} 个结果
            </span>
          </h2>
          
          <div class="flex flex-wrap gap-2">
            <span class="font-mono text-sm text-[#3a332a] self-center mr-2">播放源:</span>
            <button
              v-for="source in sources"
              :key="source.key"
              class="px-3 py-1 font-mono text-xs border-2 border-[#161310] transition-colors"
              :class="activeSource === source.key
                ? 'bg-[#ff6b35] text-[#fffaef]'
                : 'bg-[#fffaef] text-[#161310] hover:bg-[#161310] hover:text-[#fffaef]'"
              @click="selectSource(source.key)"
            >
              {{ source.name }}
            </button>
          </div>
        </div>

        <div v-if="loading" class="py-20 flex flex-col items-center justify-center">
          <div class="w-12 h-12 border-4 border-[#161310] border-t-[#ff6b35] animate-spin" />
          <p class="mt-4 font-mono text-sm text-[#3a332a]">搜索中...</p>
        </div>

        <div v-else-if="filteredResults.length === 0" class="py-20 flex flex-col items-center justify-center text-center">
          <div class="w-16 h-16 bg-[#fffaef] border-2 border-[#161310] shadow-[6px_6px_0_0_#161310] flex items-center justify-center font-mono text-2xl mb-4">?</div>
          <h3 class="font-mono text-lg font-bold text-[#161310]">未找到相关视频</h3>
          <p class="font-mono text-sm text-[#3a332a] mt-1">试试其他关键词吧</p>
          <div class="mt-6 flex flex-wrap justify-center gap-2">
            <span class="font-mono text-xs text-[#3a332a]">热门搜索:</span>
            <button
              v-for="keyword in hotSearches.slice(0, 4)"
              :key="keyword"
              class="px-3 py-1 font-mono text-xs border-2 border-[#161310] bg-[#fffaef] text-[#161310] hover:bg-[#ff6b35] hover:text-[#fffaef] transition-colors"
              @click="searchHotKeyword(keyword)"
            >
              {{ keyword }}
            </button>
          </div>
        </div>

        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          <div
            v-for="video in filteredResults"
            :key="video.vod_id + '_' + (video._source || '')"
            class="video-card"
          >
            <div class="relative aspect-[3/4] overflow-hidden border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] bg-[#fffaef] cursor-pointer group hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#161310] transition-all duration-200">
              <img
                :src="video.vod_pic"
                :alt="video.vod_name"
                class="w-full h-full object-cover image-rendering-pixelated group-hover:scale-105 transition-transform duration-300"
                @click="goToDetail(video.vod_id)"
              />
              <div class="absolute top-2 right-2 px-2 py-0.5 bg-[#ff6b35] text-[#fffaef] font-mono text-[10px] font-bold border border-[#161310]">
                {{ video.vod_remarks }}
              </div>
              <div v-if="video._sourceName" class="absolute top-2 left-2 px-2 py-0.5 bg-[#161310] text-[#fffaef] font-mono text-[10px] font-bold border border-[#fffaef]">
                {{ video._sourceName }}
              </div>
              <div class="absolute inset-0 bg-[#161310]/0 group-hover:bg-[#161310]/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div class="w-12 h-12 bg-[#ff6b35] border-2 border-[#fffaef] flex items-center justify-center">
                  <svg class="w-6 h-6 text-[#fffaef] ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            </div>
            <div class="mt-3">
              <h3
                class="font-mono text-sm font-bold text-[#161310] truncate cursor-pointer hover:text-[#ff6b35] transition-colors"
                @click="goToDetail(video.vod_id)"
              >
                {{ video.vod_name }}
              </h3>
              <p class="font-mono text-xs text-[#3a332a] mt-1 truncate">
                {{ video.vod_year }} · {{ video.vod_area }}
              </p>
            </div>
          </div>
        </div>
      </template>
    </main>

    <footer class="mt-16 border-t-2 border-[#161310] bg-[#fffaef]">
      <div class="max-w-[1400px] mx-auto px-6 py-8 text-center">
        <p class="font-mono text-xs text-[#3a332a]">
          © 2024 QQ星TV · 像素风格视频站 · Made with ♥
        </p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.image-rendering-pixelated {
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
