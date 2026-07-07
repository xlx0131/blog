<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { mockVideoList, parsePlayUrl } from '@/data/video-mock.js'

interface VideoDetail {
  vod_id: number
  vod_name: string
  vod_pic: string
  vod_remarks: string
  type_name: string
  vod_year: number
  vod_area: string
  vod_actor: string
  vod_director: string
  vod_content: string
  vod_play_from: string
  vod_play_url: string
}

interface PlaySource {
  source: string
  episodes: { name: string; url: string }[]
}

const router = useRouter()
const route = useRoute()

const video = ref<VideoDetail | null>(null)
const playSources = ref<PlaySource[]>([])
const loading = ref(true)
const activeSourceIndex = ref(0)
const relatedVideos = ref<any[]>([])

async function fetchVideoDetail(vodId: number) {
  loading.value = true
  try {
    const res = await fetch(`/api/video/heimuer/detail?ac=detail&ids=${vodId}`)
    if (!res.ok) throw new Error('API error')
    const data = await res.json()
    
    if (data.success && data.data && data.data.list && data.data.list.length > 0) {
      video.value = data.data.list[0]
    } else {
      throw new Error('no data')
    }
  } catch {
    const allVideos: VideoDetail[] = []
    Object.values(mockVideoList as any).forEach((list: VideoDetail[]) => {
      allVideos.push(...list)
    })
    
    const found = allVideos.find(v => v.vod_id === vodId)
    if (found) {
      video.value = found
    } else {
      video.value = allVideos[0]
    }
  }
  
  if (video.value) {
    playSources.value = parsePlayUrl(video.value.vod_play_from, video.value.vod_play_url)
    if (playSources.value.length === 0) {
      playSources.value = [
        {
          source: 'ikun',
          episodes: Array.from({ length: 12 }, (_, i) => ({
            name: `第${i + 1}集`,
            url: `https://example.com/video/${vodId}-${i + 1}.mp4`
          }))
        },
        {
          source: 'heimuer',
          episodes: Array.from({ length: 12 }, (_, i) => ({
            name: `第${i + 1}集`,
            url: `https://example.com/video/${vodId}-${i + 1}.mp4`
          }))
        },
        {
          source: 'ffzy',
          episodes: Array.from({ length: 12 }, (_, i) => ({
            name: `第${i + 1}集`,
            url: `https://example.com/video/${vodId}-${i + 1}.mp4`
          }))
        },
      ]
    }
  }
  
  loadRelatedVideos()
  loading.value = false
}

function loadRelatedVideos() {
  const allVideos: any[] = []
  Object.values(mockVideoList as any).forEach((list: any[]) => {
    allVideos.push(...list)
  })
  relatedVideos.value = allVideos
    .filter(v => v.vod_id !== video.value?.vod_id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 8)
}

function selectSource(index: number) {
  activeSourceIndex.value = index
}

function playEpisode(episodeIndex: number) {
  if (!video.value) return
  const source = playSources.value[activeSourceIndex.value]?.source || 'ikun'
  router.push(`/video/player/${video.value.vod_id}?source=${source}&ep=${episodeIndex + 1}`)
}

function goToHome() {
  router.push('/video')
}

function goBack() {
  router.back()
}

const sourceNames: Record<string, string> = {
  ikun: 'IKUN源',
  heimuer: '黑木耳',
  ffzy: '非凡资源',
  subo: '速播资源',
  kuaikan: '快看资源',
  okzyw: 'OK资源',
}

const getSourceName = (source: string) => sourceNames[source] || source

const currentEpisodes = computed(() => {
  return playSources.value[activeSourceIndex.value]?.episodes || []
})

const isMovie = computed(() => {
  return currentEpisodes.value.length <= 1
})

onMounted(() => {
  const vodId = parseInt(route.params.id as string)
  if (vodId) {
    fetchVideoDetail(vodId)
  }
})
</script>

<template>
  <div class="min-h-[100dvh] bg-[#f5f0e8]">
    <header class="sticky top-0 z-50 bg-[#fffaef] border-b-2 border-[#161310] shadow-[0_4px_0_0_#161310]">
      <div class="max-w-[1400px] mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button
              class="p-2 border-2 border-[#161310] bg-[#fffaef] hover:bg-[#ff6b35] hover:text-[#fffaef] transition-colors"
              @click="goBack"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>
            <div class="flex items-center gap-3 cursor-pointer" @click="goToHome">
              <div class="w-10 h-10 bg-[#ff6b35] border-2 border-[#161310] flex items-center justify-center">
                <span class="font-['Pixelify_Sans',monospace] text-xl font-black text-[#fffaef]">★</span>
              </div>
              <h1 class="font-['Pixelify_Sans',monospace] text-2xl font-black text-[#161310] tracking-wider">
                QQ星TV
              </h1>
            </div>
          </div>
          <button
            class="px-4 py-2 font-mono text-sm border-2 border-[#161310] bg-[#fffaef] text-[#161310] hover:bg-[#161310] hover:text-[#fffaef] transition-colors"
            @click="goToHome"
          >
            首页
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-[1400px] mx-auto px-6 py-8">
      <div v-if="loading" class="py-20 flex flex-col items-center justify-center">
        <div class="w-12 h-12 border-4 border-[#161310] border-t-[#ff6b35] animate-spin" />
        <p class="mt-4 font-mono text-sm text-[#3a332a]">加载中...</p>
      </div>

      <template v-else-if="video">
        <div class="bg-[#fffaef] border-2 border-[#161310] shadow-[6px_6px_0_0_#161310] p-6 sm:p-8">
          <div class="flex flex-col md:flex-row gap-8">
            <div class="md:w-64 flex-shrink-0">
              <div class="relative aspect-[3/4] overflow-hidden border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] bg-[#f5f0e8]">
                <img
                  :src="video.vod_pic"
                  :alt="video.vod_name"
                  class="w-full h-full object-cover image-rendering-pixelated"
                />
                <div class="absolute top-2 right-2 px-2 py-0.5 bg-[#ff6b35] text-[#fffaef] font-mono text-[10px] font-bold border border-[#161310]">
                  {{ video.vod_remarks }}
                </div>
              </div>
            </div>

            <div class="flex-1 min-w-0">
              <h1 class="font-['Pixelify_Sans',monospace] text-3xl sm:text-4xl font-black text-[#161310] mb-4">
                {{ video.vod_name }}
              </h1>
              
              <div class="space-y-2 mb-6">
                <div class="flex flex-wrap gap-2">
                  <span class="px-2 py-1 bg-[#ff6b35] text-[#fffaef] font-mono text-xs font-bold border-2 border-[#161310]">
                    {{ video.type_name }}
                  </span>
                  <span class="px-2 py-1 bg-[#f5f0e8] text-[#161310] font-mono text-xs border-2 border-[#161310]">
                    {{ video.vod_year }}
                  </span>
                  <span class="px-2 py-1 bg-[#f5f0e8] text-[#161310] font-mono text-xs border-2 border-[#161310]">
                    {{ video.vod_area }}
                  </span>
                </div>
              </div>

              <div class="space-y-3 mb-6">
                <div class="flex gap-2">
                  <span class="font-mono text-sm text-[#3a332a] w-16 flex-shrink-0">导演:</span>
                  <span class="font-mono text-sm text-[#161310]">{{ video.vod_director }}</span>
                </div>
                <div class="flex gap-2">
                  <span class="font-mono text-sm text-[#3a332a] w-16 flex-shrink-0">演员:</span>
                  <span class="font-mono text-sm text-[#161310] flex-1">{{ video.vod_actor }}</span>
                </div>
                <div class="flex gap-2">
                  <span class="font-mono text-sm text-[#3a332a] w-16 flex-shrink-0">状态:</span>
                  <span class="font-mono text-sm text-[#ff6b35] font-bold">{{ video.vod_remarks }}</span>
                </div>
              </div>

              <div class="mb-6">
                <h3 class="font-mono text-sm font-bold text-[#161310] mb-2">简介</h3>
                <p class="font-mono text-sm text-[#3a332a] leading-relaxed">
                  {{ video.vod_content }}
                </p>
              </div>

              <button
                class="px-8 py-3 bg-[#ff6b35] text-[#fffaef] font-mono text-base font-bold border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#161310] transition-all"
                @click="playEpisode(0)"
              >
                ▶ 立即播放
              </button>
            </div>
          </div>
        </div>

        <div v-if="playSources.length > 0" class="mt-8 bg-[#fffaef] border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] overflow-hidden">
          <div class="px-6 py-4 bg-[#161310] text-[#fffaef] border-b-2 border-[#161310]">
            <h3 class="font-['Pixelify_Sans',monospace] text-lg font-bold">
              {{ isMovie ? '播放地址' : '选集播放' }}
            </h3>
          </div>
          
          <div class="p-6">
            <div v-if="playSources.length > 1" class="mb-6">
              <p class="font-mono text-sm text-[#3a332a] mb-3">播放源:</p>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="(src, index) in playSources"
                  :key="src.source"
                  class="px-4 py-2 font-mono text-sm border-2 border-[#161310] transition-colors"
                  :class="activeSourceIndex === index
                    ? 'bg-[#ff6b35] text-[#fffaef]'
                    : 'bg-[#f5f0e8] text-[#161310] hover:bg-[#161310] hover:text-[#fffaef]'"
                  @click="selectSource(index)"
                >
                  {{ getSourceName(src.source) }}
                  <span class="text-xs opacity-70 ml-1">({{ src.episodes.length }})</span>
                </button>
              </div>
            </div>

            <div>
              <p class="font-mono text-sm text-[#3a332a] mb-3">
                {{ isMovie ? '播放列表:' : '选择集数:' }}
              </p>
              <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                <button
                  v-for="(ep, index) in currentEpisodes"
                  :key="index"
                  class="px-2 py-2 font-mono text-xs border-2 border-[#161310] bg-[#f5f0e8] text-[#161310] hover:bg-[#ff6b35] hover:text-[#fffaef] transition-colors truncate"
                  @click="playEpisode(index)"
                >
                  {{ ep.name }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="relatedVideos.length > 0" class="mt-10">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-2 h-8 bg-[#ff6b35]" />
            <h2 class="font-['Pixelify_Sans',monospace] text-2xl font-black text-[#161310]">
              相关推荐
            </h2>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
            <div
              v-for="v in relatedVideos"
              :key="v.vod_id"
              class="video-card"
            >
              <div class="relative aspect-[3/4] overflow-hidden border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] bg-[#fffaef] cursor-pointer group hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#161310] transition-all duration-200">
                <img
                  :src="v.vod_pic"
                  :alt="v.vod_name"
                  class="w-full h-full object-cover image-rendering-pixelated group-hover:scale-105 transition-transform duration-300"
                  @click="router.push(`/video/detail/${v.vod_id}`)"
                />
                <div class="absolute top-2 right-2 px-2 py-0.5 bg-[#ff6b35] text-[#fffaef] font-mono text-[10px] font-bold border border-[#161310]">
                  {{ v.vod_remarks }}
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
                  @click="router.push(`/video/detail/${v.vod_id}`)"
                >
                  {{ v.vod_name }}
                </h3>
                <p class="font-mono text-xs text-[#3a332a] mt-1 truncate">
                  {{ v.vod_year }} · {{ v.vod_area }}
                </p>
              </div>
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
