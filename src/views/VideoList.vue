<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { mockVideoList, mockCategories } from '@/data/video-mock.js'

interface VideoItem {
  vod_id: number
  vod_name: string
  vod_pic: string
  vod_remarks: string
  type_name: string
  vod_year: number
  vod_area: string
}

interface FilterOption {
  id: string | number
  name: string
}

const router = useRouter()
const route = useRoute()

const videoList = ref<VideoItem[]>([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = 24
const total = ref(0)
const activeTypeId = ref<number>(1)
const activeArea = ref<string>('全部')
const activeYear = ref<string>('全部')
const sortBy = ref<'new' | 'hot' | 'rating'>('new')

const typeOptions = computed<FilterOption[]>(() => [
  { id: 0, name: '全部' },
  ...mockCategories.map((c: any) => ({ id: c.type_id, name: c.type_name }))
])

const areaOptions: FilterOption[] = [
  { id: '全部', name: '全部' },
  { id: '大陆', name: '大陆' },
  { id: '美国', name: '美国' },
  { id: '日本', name: '日本' },
  { id: '韩国', name: '韩国' },
  { id: '香港', name: '香港' },
  { id: '台湾', name: '台湾' },
  { id: '英国', name: '英国' },
  { id: '法国', name: '法国' },
  { id: '德国', name: '德国' },
]

const yearOptions: FilterOption[] = [
  { id: '全部', name: '全部' },
  { id: '2024', name: '2024' },
  { id: '2023', name: '2023' },
  { id: '2022', name: '2022' },
  { id: '2021', name: '2021' },
  { id: '2020', name: '2020' },
  { id: '2010s', name: '2010年代' },
  { id: '2000s', name: '2000年代' },
  { id: 'classic', name: '经典' },
]

const totalPages = computed(() => Math.ceil(total.value / pageSize) || 1)

const pageNumbers = computed(() => {
  const pages: number[] = []
  const total = totalPages.value
  const current = currentPage.value
  let start = Math.max(1, current - 2)
  let end = Math.min(total, current + 2)
  
  if (end - start < 4) {
    if (start === 1) {
      end = Math.min(5, total)
    } else if (end === total) {
      start = Math.max(1, total - 4)
    }
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

async function fetchVideoList() {
  loading.value = true
  try {
    const params = new URLSearchParams()
    params.set('ac', 'list')
    if (activeTypeId.value > 0) params.set('t', String(activeTypeId.value))
    params.set('pg', String(currentPage.value))
    params.set('pagesize', String(pageSize))
    
    const res = await fetch(`/api/video/proxy?source=heimuer&path=list&${params.toString()}`)
    if (!res.ok) throw new Error('API error')
    const data = await res.json()
    
    if (data.success && data.data && data.data.list) {
      videoList.value = data.data.list
      total.value = data.data.total || data.data.list.length
    } else {
      throw new Error('no data')
    }
  } catch {
    const mockData = (mockVideoList as any)[activeTypeId.value] || (mockVideoList as any)[1] || []
    let filtered = [...mockData]
    
    if (activeArea.value !== '全部') {
      filtered = filtered.filter((v: VideoItem) => v.vod_area === activeArea.value)
    }
    
    if (activeYear.value !== '全部') {
      const yearNum = parseInt(activeYear.value)
      if (!isNaN(yearNum)) {
        filtered = filtered.filter((v: VideoItem) => v.vod_year === yearNum)
      }
    }
    
    if (sortBy.value === 'new') {
      filtered.sort((a: VideoItem, b: VideoItem) => b.vod_year - a.vod_year)
    } else if (sortBy.value === 'hot') {
      filtered.sort(() => Math.random() - 0.5)
    }
    
    total.value = filtered.length
    const start = (currentPage.value - 1) * pageSize
    videoList.value = filtered.slice(start, start + pageSize)
  }
  loading.value = false
}

function selectType(typeId: number) {
  activeTypeId.value = typeId
  currentPage.value = 1
  fetchVideoList()
}

function selectArea(area: string) {
  activeArea.value = area
  currentPage.value = 1
  fetchVideoList()
}

function selectYear(year: string) {
  activeYear.value = year
  currentPage.value = 1
  fetchVideoList()
}

function changeSort(sort: 'new' | 'hot' | 'rating') {
  sortBy.value = sort
  currentPage.value = 1
  fetchVideoList()
}

function goToPage(page: number) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
  fetchVideoList()
}

function goToDetail(vodId: number) {
  router.push(`/video/detail/${vodId}`)
}

function goToHome() {
  router.push('/video')
}

const currentTypeName = computed(() => {
  const found = mockCategories.find((c: any) => c.type_id === activeTypeId.value)
  return found ? (found as any).type_name : '全部'
})

onMounted(() => {
  const t = route.query.t
  if (t && !isNaN(Number(t))) {
    activeTypeId.value = Number(t)
  }
  fetchVideoList()
})

watch(() => route.query.t, (newT) => {
  if (newT && !isNaN(Number(newT))) {
    activeTypeId.value = Number(newT)
    currentPage.value = 1
    fetchVideoList()
  }
})
</script>

<template>
  <div class="min-h-[100dvh] bg-[#f5f0e8]">
    <header class="sticky top-0 z-50 bg-[#fffaef] border-b-2 border-[#161310] shadow-[0_4px_0_0_#161310]">
      <div class="max-w-[1400px] mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3 cursor-pointer" @click="goToHome">
            <div class="w-10 h-10 bg-[#ff6b35] border-2 border-[#161310] flex items-center justify-center">
              <span class="font-['Pixelify_Sans',monospace] text-xl font-black text-[#fffaef]">★</span>
            </div>
            <h1 class="font-['Pixelify_Sans',monospace] text-2xl font-black text-[#161310] tracking-wider">
              QQ星TV
            </h1>
          </div>
          <button
            class="px-4 py-2 font-mono text-sm border-2 border-[#161310] bg-[#fffaef] text-[#161310] hover:bg-[#161310] hover:text-[#fffaef] transition-colors"
            @click="goToHome"
          >
            ← 返回首页
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-[1400px] mx-auto px-6 py-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <aside class="lg:w-56 lg:flex-shrink-0">
          <div class="lg:sticky lg:top-24 space-y-6">
            <div class="bg-[#fffaef] border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] overflow-hidden">
              <div class="px-4 py-3 bg-[#161310] text-[#fffaef] border-b-2 border-[#161310]">
                <p class="font-mono text-sm font-bold">🎬 类型</p>
              </div>
              <div class="p-3 flex flex-wrap gap-2">
                <button
                  v-for="type in typeOptions"
                  :key="type.id"
                  class="px-3 py-1 font-mono text-xs border-2 border-[#161310] transition-colors"
                  :class="activeTypeId === type.id
                    ? 'bg-[#ff6b35] text-[#fffaef]'
                    : 'bg-[#f5f0e8] text-[#161310] hover:bg-[#161310] hover:text-[#fffaef]'"
                  @click="selectType(type.id as number)"
                >
                  {{ type.name }}
                </button>
              </div>
            </div>

            <div class="bg-[#fffaef] border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] overflow-hidden">
              <div class="px-4 py-3 bg-[#161310] text-[#fffaef] border-b-2 border-[#161310]">
                <p class="font-mono text-sm font-bold">🌍 地区</p>
              </div>
              <div class="p-3 flex flex-wrap gap-2">
                <button
                  v-for="area in areaOptions"
                  :key="area.id"
                  class="px-3 py-1 font-mono text-xs border-2 border-[#161310] transition-colors"
                  :class="activeArea === area.id
                    ? 'bg-[#ff6b35] text-[#fffaef]'
                    : 'bg-[#f5f0e8] text-[#161310] hover:bg-[#161310] hover:text-[#fffaef]'"
                  @click="selectArea(area.id as string)"
                >
                  {{ area.name }}
                </button>
              </div>
            </div>

            <div class="bg-[#fffaef] border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] overflow-hidden">
              <div class="px-4 py-3 bg-[#161310] text-[#fffaef] border-b-2 border-[#161310]">
                <p class="font-mono text-sm font-bold">📅 年份</p>
              </div>
              <div class="p-3 flex flex-wrap gap-2">
                <button
                  v-for="year in yearOptions"
                  :key="year.id"
                  class="px-3 py-1 font-mono text-xs border-2 border-[#161310] transition-colors"
                  :class="activeYear === year.id
                    ? 'bg-[#ff6b35] text-[#fffaef]'
                    : 'bg-[#f5f0e8] text-[#161310] hover:bg-[#161310] hover:text-[#fffaef]'"
                  @click="selectYear(year.id as string)"
                >
                  {{ year.name }}
                </button>
              </div>
            </div>
          </div>
        </aside>

        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div class="flex items-center gap-3">
              <div class="w-2 h-8 bg-[#ff6b35]" />
              <h2 class="font-['Pixelify_Sans',monospace] text-2xl font-black text-[#161310]">
                {{ currentTypeName }}
              </h2>
              <span class="font-mono text-sm text-[#3a332a]">
                共 {{ total }} 部
              </span>
            </div>
            <div class="flex gap-2">
              <button
                class="px-3 py-1.5 font-mono text-xs border-2 border-[#161310] transition-colors"
                :class="sortBy === 'new'
                  ? 'bg-[#161310] text-[#fffaef]'
                  : 'bg-[#fffaef] text-[#161310] hover:bg-[#161310]/10'"
                @click="changeSort('new')"
              >
                最新
              </button>
              <button
                class="px-3 py-1.5 font-mono text-xs border-2 border-[#161310] transition-colors"
                :class="sortBy === 'hot'
                  ? 'bg-[#161310] text-[#fffaef]'
                  : 'bg-[#fffaef] text-[#161310] hover:bg-[#161310]/10'"
                @click="changeSort('hot')"
              >
                最热
              </button>
              <button
                class="px-3 py-1.5 font-mono text-xs border-2 border-[#161310] transition-colors"
                :class="sortBy === 'rating'
                  ? 'bg-[#161310] text-[#fffaef]'
                  : 'bg-[#fffaef] text-[#161310] hover:bg-[#161310]/10'"
                @click="changeSort('rating')"
              >
                评分
              </button>
            </div>
          </div>

          <div v-if="loading" class="py-20 flex flex-col items-center justify-center">
            <div class="w-12 h-12 border-4 border-[#161310] border-t-[#ff6b35] animate-spin" />
            <p class="mt-4 font-mono text-sm text-[#3a332a]">加载中...</p>
          </div>

          <div v-else-if="videoList.length === 0" class="py-20 flex flex-col items-center justify-center text-center">
            <div class="w-16 h-16 bg-[#fffaef] border-2 border-[#161310] shadow-[6px_6px_0_0_#161310] flex items-center justify-center font-mono text-2xl mb-4">?</div>
            <h3 class="font-mono text-lg font-bold text-[#161310]">暂无相关视频</h3>
            <p class="font-mono text-sm text-[#3a332a] mt-1">试试其他筛选条件</p>
          </div>

          <template v-else>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
              <div
                v-for="video in videoList"
                :key="video.vod_id"
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

            <div class="mt-10 flex items-center justify-center gap-2 flex-wrap">
              <button
                class="px-4 py-2 font-mono text-sm border-2 border-[#161310] bg-[#fffaef] text-[#161310] hover:bg-[#161310] hover:text-[#fffaef] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="currentPage === 1"
                @click="goToPage(currentPage - 1)"
              >
                上一页
              </button>
              
              <template v-if="pageNumbers[0] > 1">
                <button
                  class="w-10 h-10 font-mono text-sm border-2 border-[#161310] bg-[#fffaef] text-[#161310] hover:bg-[#161310] hover:text-[#fffaef] transition-colors"
                  @click="goToPage(1)"
                >
                  1
                </button>
                <span v-if="pageNumbers[0] > 2" class="font-mono text-[#161310]">...</span>
              </template>
              
              <button
                v-for="page in pageNumbers"
                :key="page"
                class="w-10 h-10 font-mono text-sm border-2 border-[#161310] transition-colors"
                :class="currentPage === page
                  ? 'bg-[#ff6b35] text-[#fffaef]'
                  : 'bg-[#fffaef] text-[#161310] hover:bg-[#161310] hover:text-[#fffaef]'"
                @click="goToPage(page)"
              >
                {{ page }}
              </button>
              
              <template v-if="pageNumbers[pageNumbers.length - 1] < totalPages">
                <span v-if="pageNumbers[pageNumbers.length - 1] < totalPages - 1" class="font-mono text-[#161310]">...</span>
                <button
                  class="w-10 h-10 font-mono text-sm border-2 border-[#161310] bg-[#fffaef] text-[#161310] hover:bg-[#161310] hover:text-[#fffaef] transition-colors"
                  @click="goToPage(totalPages)"
                >
                  {{ totalPages }}
                </button>
              </template>
              
              <button
                class="px-4 py-2 font-mono text-sm border-2 border-[#161310] bg-[#fffaef] text-[#161310] hover:bg-[#161310] hover:text-[#fffaef] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="currentPage === totalPages"
                @click="goToPage(currentPage + 1)"
              >
                下一页
              </button>
            </div>
          </template>
        </div>
      </div>
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
