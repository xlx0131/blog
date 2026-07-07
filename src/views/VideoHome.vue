<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { mockVideoList, mockBanners, mockCategories } from '@/data/video-mock.js'

interface VideoItem {
  vod_id: number
  vod_name: string
  vod_pic: string
  vod_remarks: string
  type_name: string
  vod_year: number
  vod_area: string
}

interface Banner {
  id: number
  title: string
  subtitle: string
  pic: string
  vod_id: number
}

const router = useRouter()
const banners = ref<Banner[]>([])
const hotVideos = ref<VideoItem[]>([])
const movieVideos = ref<VideoItem[]>([])
const tvVideos = ref<VideoItem[]>([])
const animeVideos = ref<VideoItem[]>([])
const varietyVideos = ref<VideoItem[]>([])
const currentBanner = ref(0)
const loading = ref(true)
let bannerTimer: number | null = null

const categories = computed(() => mockCategories.filter((c: any) => [1, 2, 3, 4].includes(c.type_id)))

async function fetchVideoList(source: string, typeId: number, page = 1, pageSize = 6) {
  try {
    const res = await fetch(`/api/video/proxy?source=${source}&path=list&ac=list&t=${typeId}&pg=${page}&pagesize=${pageSize}`)
    if (!res.ok) throw new Error('API error')
    const data = await res.json()
    if (data.success && data.data && data.data.list) {
      return data.data.list
    }
    return null
  } catch {
    return null
  }
}

async function loadBanners() {
  banners.value = mockBanners
}

async function loadHotVideos() {
  const apiData = await fetchVideoList('heimuer', 1, 1, 6)
  if (apiData && apiData.length > 0) {
    hotVideos.value = apiData.slice(0, 6)
  } else {
    hotVideos.value = (mockVideoList as any)[1].slice(0, 6)
  }
}

async function loadCategoryVideos(typeId: number, targetRef: any) {
  const apiData = await fetchVideoList('heimuer', typeId, 1, 6)
  if (apiData && apiData.length > 0) {
    targetRef.value = apiData.slice(0, 6)
  } else {
    targetRef.value = (mockVideoList as any)[typeId]?.slice(0, 6) || []
  }
}

function startBannerAutoPlay() {
  bannerTimer = window.setInterval(() => {
    currentBanner.value = (currentBanner.value + 1) % banners.value.length
  }, 4000)
}

function stopBannerAutoPlay() {
  if (bannerTimer) {
    clearInterval(bannerTimer)
    bannerTimer = null
  }
}

function goToBanner(index: number) {
  currentBanner.value = index
}

function prevBanner() {
  currentBanner.value = (currentBanner.value - 1 + banners.value.length) % banners.value.length
}

function nextBanner() {
  currentBanner.value = (currentBanner.value + 1) % banners.value.length
}

function goToDetail(vodId: number) {
  router.push(`/video/detail/${vodId}`)
}

function goToList(typeId: number) {
  router.push(`/video/list?t=${typeId}`)
}

function goToSearch() {
  router.push('/video/search')
}

function goToHistory() {
  router.push('/video/history')
}

function goToFavorite() {
  router.push('/video/favorite')
}

onMounted(() => {
  loadBanners()
  loadHotVideos()
  loadCategoryVideos(1, movieVideos)
  loadCategoryVideos(2, tvVideos)
  loadCategoryVideos(3, animeVideos)
  loadCategoryVideos(4, varietyVideos)
  setTimeout(() => {
    loading.value = false
    startBannerAutoPlay()
  }, 300)
})
</script>

<template>
  <div class="min-h-[100dvh] bg-[#f5f0e8]">
    <header class="sticky top-0 z-50 bg-[#fffaef] border-b-2 border-[#161310] shadow-[0_4px_0_0_#161310]">
      <div class="max-w-[1400px] mx-auto px-6 py-4">
        <div class="flex items-center justify-between gap-6">
          <div class="flex items-center gap-8">
            <div class="flex items-center gap-3 cursor-pointer" @click="router.push('/video')">
              <div class="w-10 h-10 bg-[#ff6b35] border-2 border-[#161310] flex items-center justify-center">
                <span class="font-['Pixelify_Sans',monospace] text-xl font-black text-[#fffaef]">★</span>
              </div>
              <h1 class="font-['Pixelify_Sans',monospace] text-2xl font-black text-[#161310] tracking-wider">
                QQ星TV
              </h1>
            </div>
            <nav class="hidden md:flex items-center gap-2">
              <button
                v-for="cat in categories"
                :key="cat.type_id"
                class="px-3 py-1.5 font-mono text-sm border-2 border-[#161310] bg-[#fffaef] text-[#161310] hover:bg-[#161310] hover:text-[#fffaef] transition-colors duration-150"
                @click="goToList(cat.type_id)"
              >
                {{ cat.type_name }}
              </button>
            </nav>
          </div>
          <div class="flex items-center gap-3">
            <div class="relative hidden sm:block">
              <input
                type="text"
                placeholder="搜索视频..."
                class="w-48 lg:w-64 px-3 py-2 pl-9 font-mono text-sm border-2 border-[#161310] bg-[#f5f0e8] text-[#161310] placeholder-[#3a332a]/50 focus:outline-none focus:bg-[#fffaef] transition-colors"
                @keyup.enter="goToSearch"
              />
              <svg
                class="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3a332a]"
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
            <button
              class="p-2 border-2 border-[#161310] bg-[#fffaef] hover:bg-[#ff6b35] hover:text-[#fffaef] transition-colors"
              title="历史记录"
              @click="goToHistory"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                <path d="M3 3v5h5"/>
                <path d="M12 7v5l4 2"/>
              </svg>
            </button>
            <button
              class="p-2 border-2 border-[#161310] bg-[#fffaef] hover:bg-[#ff6b35] hover:text-[#fffaef] transition-colors"
              title="我的收藏"
              @click="goToFavorite"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-[1400px] mx-auto px-6 py-8">
      <section
        class="relative overflow-hidden border-2 border-[#161310] shadow-[6px_6px_0_0_#161310] bg-[#161310]"
        @mouseenter="stopBannerAutoPlay"
        @mouseleave="startBannerAutoPlay"
      >
        <div class="relative h-[300px] sm:h-[380px] lg:h-[450px]">
          <div
            v-for="(banner, index) in banners"
            :key="banner.id"
            class="absolute inset-0 transition-opacity duration-500"
            :class="currentBanner === index ? 'opacity-100' : 'opacity-0 pointer-events-none'"
          >
            <img
              :src="banner.pic"
              :alt="banner.title"
              class="w-full h-full object-cover image-rendering-pixelated cursor-pointer"
              @click="goToDetail(banner.vod_id)"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-[#161310] via-[#161310]/50 to-transparent" />
            <div class="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
              <div class="max-w-2xl">
                <span class="inline-block px-3 py-1 bg-[#ff6b35] text-[#fffaef] font-mono text-xs font-bold tracking-wider mb-3">
                  🔥 热门推荐
                </span>
                <h2
                  class="font-['Pixelify_Sans',monospace] text-3xl sm:text-4xl lg:text-5xl font-black text-[#fffaef] mb-2 cursor-pointer hover:text-[#ff6b35] transition-colors"
                  @click="goToDetail(banner.vod_id)"
                >
                  {{ banner.title }}
                </h2>
                <p class="font-mono text-sm sm:text-base text-[#fffaef]/80">
                  {{ banner.subtitle }}
                </p>
                <button
                  class="mt-4 px-6 py-2.5 bg-[#ff6b35] text-[#fffaef] font-mono text-sm font-bold border-2 border-[#fffaef] shadow-[4px_4px_0_0_#fffaef] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#fffaef] transition-all"
                  @click="goToDetail(banner.vod_id)"
                >
                  ▶ 立即观看
                </button>
              </div>
            </div>
          </div>
        </div>

        <button
          class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#fffaef]/90 border-2 border-[#161310] flex items-center justify-center hover:bg-[#ff6b35] hover:text-[#fffaef] transition-colors"
          @click="prevBanner"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
        <button
          class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#fffaef]/90 border-2 border-[#161310] flex items-center justify-center hover:bg-[#ff6b35] hover:text-[#fffaef] transition-colors"
          @click="nextBanner"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </button>

        <div class="absolute bottom-4 right-6 flex gap-2">
          <button
            v-for="(banner, index) in banners"
            :key="banner.id"
            class="w-3 h-3 border-2 border-[#fffaef] transition-colors"
            :class="currentBanner === index ? 'bg-[#ff6b35]' : 'bg-transparent hover:bg-[#fffaef]/50'"
            @click="goToBanner(index)"
          />
        </div>
      </section>

      <section class="mt-10">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <div class="w-2 h-8 bg-[#ff6b35]" />
            <h2 class="font-['Pixelify_Sans',monospace] text-2xl font-black text-[#161310]">
              🔥 热门推荐
            </h2>
          </div>
          <button
            class="font-mono text-sm text-[#3a332a] hover:text-[#ff6b35] transition-colors"
            @click="goToList(1)"
          >
            查看更多 →
          </button>
        </div>
        <div class="video-scroll-container">
          <div class="video-scroll-content">
            <div
              v-for="video in hotVideos"
              :key="video.vod_id"
              class="video-card flex-shrink-0 w-[160px] sm:w-[180px] md:w-[200px]"
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
                <p class="font-mono text-xs text-[#3a332a] mt-1">
                  {{ video.vod_year }} · {{ video.vod_area }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <template v-for="section in [
        { title: '🎬 电影', typeId: 1, list: movieVideos },
        { title: '📺 电视剧', typeId: 2, list: tvVideos },
        { title: '🎮 动漫', typeId: 3, list: animeVideos },
        { title: '🎤 综艺', typeId: 4, list: varietyVideos },
      ]" :key="section.typeId">
        <section class="mt-10">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <div class="w-2 h-8 bg-[#ff6b35]" />
              <h2 class="font-['Pixelify_Sans',monospace] text-2xl font-black text-[#161310]">
                {{ section.title }}
              </h2>
            </div>
            <button
              class="px-4 py-1.5 font-mono text-sm border-2 border-[#161310] bg-[#fffaef] text-[#161310] hover:bg-[#161310] hover:text-[#fffaef] transition-colors"
              @click="goToList(section.typeId)"
            >
              更多 +
            </button>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
            <div
              v-for="video in section.list"
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
        </section>
      </template>
    </main>

    <footer class="mt-16 border-t-2 border-[#161310] bg-[#fffaef]">
      <div class="max-w-[1400px] mx-auto px-6 py-10">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div class="flex items-center gap-2 mb-4">
              <div class="w-8 h-8 bg-[#ff6b35] border-2 border-[#161310] flex items-center justify-center">
                <span class="font-['Pixelify_Sans',monospace] text-lg font-black text-[#fffaef]">★</span>
              </div>
              <span class="font-['Pixelify_Sans',monospace] text-xl font-black text-[#161310]">QQ星TV</span>
            </div>
            <p class="font-mono text-xs text-[#3a332a] leading-relaxed">
              像素风格视频站，发现精彩影视内容。所有资源均来自网络，仅供学习交流使用。
            </p>
          </div>
          <div>
            <h4 class="font-['Pixelify_Sans',monospace] text-sm font-bold text-[#161310] mb-3">快速导航</h4>
            <ul class="space-y-2">
              <li><a href="#" class="font-mono text-xs text-[#3a332a] hover:text-[#ff6b35]">电影</a></li>
              <li><a href="#" class="font-mono text-xs text-[#3a332a] hover:text-[#ff6b35]">电视剧</a></li>
              <li><a href="#" class="font-mono text-xs text-[#3a332a] hover:text-[#ff6b35]">动漫</a></li>
              <li><a href="#" class="font-mono text-xs text-[#3a332a] hover:text-[#ff6b35]">综艺</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-['Pixelify_Sans',monospace] text-sm font-bold text-[#161310] mb-3">帮助中心</h4>
            <ul class="space-y-2">
              <li><a href="#" class="font-mono text-xs text-[#3a332a] hover:text-[#ff6b35]">常见问题</a></li>
              <li><a href="#" class="font-mono text-xs text-[#3a332a] hover:text-[#ff6b35]">播放问题</a></li>
              <li><a href="#" class="font-mono text-xs text-[#3a332a] hover:text-[#ff6b35]">意见反馈</a></li>
              <li><a href="#" class="font-mono text-xs text-[#3a332a] hover:text-[#ff6b35]">免责声明</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-['Pixelify_Sans',monospace] text-sm font-bold text-[#161310] mb-3">关于我们</h4>
            <ul class="space-y-2">
              <li><a href="#" class="font-mono text-xs text-[#3a332a] hover:text-[#ff6b35]">关于QQ星TV</a></li>
              <li><a href="#" class="font-mono text-xs text-[#3a332a] hover:text-[#ff6b35]">联系方式</a></li>
              <li><a href="#" class="font-mono text-xs text-[#3a332a] hover:text-[#ff6b35]">友情链接</a></li>
              <li><a href="#" class="font-mono text-xs text-[#3a332a] hover:text-[#ff6b35]">网站地图</a></li>
            </ul>
          </div>
        </div>
        <div class="mt-8 pt-6 border-t-2 border-[#161310]/20 text-center">
          <p class="font-mono text-xs text-[#3a332a]">
            © 2024 QQ星TV · 像素风格视频站 · Made with ♥
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.image-rendering-pixelated {
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}

.video-scroll-container {
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.video-scroll-container::-webkit-scrollbar {
  display: none;
}

.video-scroll-content {
  display: flex;
  gap: 1rem;
  padding-bottom: 0.5rem;
}

@media (min-width: 640px) {
  .video-scroll-content {
    gap: 1.5rem;
  }
}
</style>
