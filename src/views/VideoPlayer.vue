<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
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
const currentEpisodeIndex = ref(0)
const relatedVideos = ref<any[]>([])

const videoRef = ref<HTMLVideoElement | null>(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(1)
const isMuted = ref(false)
const isFullscreen = ref(false)
const showControls = ref(true)
const showVolumeSlider = ref(false)
let controlsTimer: number | null = null

async function fetchVideoDetail(vodId: number) {
  loading.value = true
  try {
    const res = await fetch(`/api/video/proxy?source=ffzy&path=detail&ac=detail&ids=${vodId}`)
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
          source: 'ffzy',
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
  currentEpisodeIndex.value = 0
  playCurrentEpisode()
}

function selectEpisode(index: number) {
  currentEpisodeIndex.value = index
  playCurrentEpisode()
}

function playCurrentEpisode() {
  if (videoRef.value) {
    const ep = currentEpisodes.value[currentEpisodeIndex.value]
    if (ep) {
      videoRef.value.src = ep.url
      videoRef.value.load()
      videoRef.value.play().catch(() => {})
    }
  }
}

function togglePlay() {
  if (!videoRef.value) return
  if (isPlaying.value) {
    videoRef.value.pause()
  } else {
    videoRef.value.play().catch(() => {})
  }
}

function onTimeUpdate() {
  if (videoRef.value) {
    currentTime.value = videoRef.value.currentTime
  }
}

function onLoadedMetadata() {
  if (videoRef.value) {
    duration.value = videoRef.value.duration
  }
}

function onPlay() {
  isPlaying.value = true
}

function onPause() {
  isPlaying.value = false
}

function seek(e: MouseEvent) {
  if (!videoRef.value || !duration.value) return
  const target = e.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const percent = (e.clientX - rect.left) / rect.width
  videoRef.value.currentTime = percent * duration.value
}

function setVolume(val: number) {
  volume.value = val
  if (videoRef.value) {
    videoRef.value.volume = val
  }
  isMuted.value = val === 0
}

function toggleMute() {
  if (videoRef.value) {
    isMuted.value = !isMuted.value
    videoRef.value.muted = isMuted.value
  }
}

function toggleFullscreen() {
  const container = document.querySelector('.player-container')
  if (!container) return
  
  if (!isFullscreen.value) {
    if (container.requestFullscreen) {
      container.requestFullscreen()
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    }
  }
}

function onFullscreenChange() {
  isFullscreen.value = !!document.fullscreenElement
}

function showControlsFn() {
  showControls.value = true
  if (controlsTimer) {
    clearTimeout(controlsTimer)
  }
  controlsTimer = window.setTimeout(() => {
    if (isPlaying.value) {
      showControls.value = false
    }
  }, 3000)
}

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '00:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

function goBack() {
  router.back()
}

function goToHome() {
  router.push('/video')
}

function goToDetail() {
  if (video.value) {
    router.push(`/video/detail/${video.value.vod_id}`)
  }
}

const sourceNames: Record<string, string> = {
    ikun: 'IKUN源',
    ffzy: '非凡资源',
    subo: '速播资源',
  kuaikan: '快看资源',
  okzyw: 'OK资源',
}

const getSourceName = (source: string) => sourceNames[source] || source

const currentEpisodes = computed(() => {
  return playSources.value[activeSourceIndex.value]?.episodes || []
})

const currentEpisodeName = computed(() => {
  return currentEpisodes.value[currentEpisodeIndex.value]?.name || ''
})

const progressPercent = computed(() => {
  if (!duration.value) return 0
  return (currentTime.value / duration.value) * 100
})

onMounted(() => {
  const vodId = parseInt(route.params.id as string)
  const source = route.query.source as string
  const ep = parseInt(route.query.ep as string) || 1
  
  if (vodId) {
    fetchVideoDetail(vodId).then(() => {
      if (source) {
        const idx = playSources.value.findIndex(s => s.source === source)
        if (idx >= 0) {
          activeSourceIndex.value = idx
        }
      }
      currentEpisodeIndex.value = Math.max(0, ep - 1)
      setTimeout(() => {
        playCurrentEpisode()
      }, 500)
    })
  }
  
  document.addEventListener('fullscreenchange', onFullscreenChange)
})

onUnmounted(() => {
  if (controlsTimer) {
    clearTimeout(controlsTimer)
  }
  document.removeEventListener('fullscreenchange', onFullscreenChange)
})
</script>

<template>
  <div class="min-h-[100dvh] bg-[#161310]">
    <header class="sticky top-0 z-50 bg-[#fffaef] border-b-2 border-[#161310] shadow-[0_4px_0_0_#161310]">
      <div class="max-w-[1400px] mx-auto px-6 py-3">
        <div class="flex items-center justify-between gap-4">
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
              <div class="w-8 h-8 bg-[#ff6b35] border-2 border-[#161310] flex items-center justify-center">
                <span class="font-['Pixelify_Sans',monospace] text-lg font-black text-[#fffaef]">★</span>
              </div>
              <span class="font-['Pixelify_Sans',monospace] text-xl font-black text-[#161310]">QQ星TV</span>
            </div>
          </div>
          <div class="flex-1 min-w-0 hidden sm:block">
            <h2 class="font-mono text-sm font-bold text-[#161310] truncate" :title="video?.vod_name">
              {{ video?.vod_name }}
              <span v-if="currentEpisodeName" class="text-[#ff6b35]"> - {{ currentEpisodeName }}</span>
            </h2>
          </div>
          <button
            class="px-4 py-1.5 font-mono text-sm border-2 border-[#161310] bg-[#fffaef] text-[#161310] hover:bg-[#161310] hover:text-[#fffaef] transition-colors"
            @click="goToHome"
          >
            首页
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-[1400px] mx-auto px-4 py-6">
      <div v-if="loading" class="py-32 flex flex-col items-center justify-center">
        <div class="w-12 h-12 border-4 border-[#fffaef] border-t-[#ff6b35] animate-spin" />
        <p class="mt-4 font-mono text-sm text-[#fffaef]/70">加载中...</p>
      </div>

      <template v-else>
        <div
          class="player-container relative bg-black border-2 border-[#fffaef] shadow-[6px_6px_0_0_#ff6b35] overflow-hidden group"
          @mousemove="showControlsFn"
          @mouseleave="showControls = isPlaying ? false : true"
        >
          <div class="aspect-video bg-[#161310]">
            <video
              ref="videoRef"
              class="w-full h-full object-contain"
              @timeupdate="onTimeUpdate"
              @loadedmetadata="onLoadedMetadata"
              @play="onPlay"
              @pause="onPause"
              @click="togglePlay"
              playsinline
            >
              您的浏览器不支持 video 标签。
            </video>
          </div>

          <div
            class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 transition-opacity duration-300"
            :class="showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'"
          >
            <div class="absolute top-4 left-4 right-4 flex items-center justify-between">
              <div>
                <h3 class="font-['Pixelify_Sans',monospace] text-lg font-bold text-[#fffaef] drop-shadow-lg">
                  {{ video?.vod_name }}
                </h3>
                <p class="font-mono text-xs text-[#fffaef]/80 mt-1">
                  {{ currentEpisodeName }}
                </p>
              </div>
            </div>

            <div
              class="absolute bottom-0 left-0 right-0 p-4"
            >
              <div
                class="h-2 bg-[#fffaef]/30 cursor-pointer mb-4 group/progress"
                @click="seek"
              >
                <div
                  class="h-full bg-[#ff6b35] transition-all"
                  :style="{ width: progressPercent + '%' }"
                >
                  <div class="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#ff6b35] border-2 border-[#fffaef] opacity-0 group-hover/progress:opacity-100 transition-opacity" />
                </div>
              </div>

              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <button
                    class="text-[#fffaef] hover:text-[#ff6b35] transition-colors"
                    @click="togglePlay"
                  >
                    <svg v-if="!isPlaying" class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    <svg v-else class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                    </svg>
                  </button>

                  <div class="relative">
                    <button
                      class="text-[#fffaef] hover:text-[#ff6b35] transition-colors"
                      @click="toggleMute"
                      @mouseenter="showVolumeSlider = true"
                      @mouseleave="showVolumeSlider = false"
                    >
                      <svg v-if="isMuted || volume === 0" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                        <line x1="22" y1="9" x2="16" y2="15"/>
                        <line x1="16" y1="9" x2="22" y2="15"/>
                      </svg>
                      <svg v-else class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                      </svg>
                    </button>
                    <div
                      v-if="showVolumeSlider"
                      class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-[#fffaef] border-2 border-[#161310]"
                      @mouseenter="showVolumeSlider = true"
                      @mouseleave="showVolumeSlider = false"
                    >
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        :value="isMuted ? 0 : volume"
                        class="w-20 h-2 appearance-none bg-[#161310] cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#ff6b35] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#161310]"
                        @input="(e: any) => setVolume(parseFloat(e.target.value))"
                      />
                    </div>
                  </div>

                  <span class="font-mono text-xs text-[#fffaef]">
                    {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
                  </span>
                </div>

                <div class="flex items-center gap-3">
                  <button
                    class="text-[#fffaef] hover:text-[#ff6b35] transition-colors"
                    @click="goToDetail"
                    title="详情页"
                  >
                    <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 16v-4"/>
                      <path d="M12 8h.01"/>
                    </svg>
                  </button>
                  <button
                    class="text-[#fffaef] hover:text-[#ff6b35] transition-colors"
                    @click="toggleFullscreen"
                    title="全屏"
                  >
                    <svg v-if="!isFullscreen" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M8 3H5a2 2 0 0 0-2 2v3"/>
                      <path d="M21 8V5a2 2 0 0 0-2-2h-3"/>
                      <path d="M3 16v3a2 2 0 0 0 2 2h3"/>
                      <path d="M16 21h3a2 2 0 0 0 2-2v-3"/>
                    </svg>
                    <svg v-else class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M8 3v3a2 2 0 0 1-2 2H3"/>
                      <path d="M21 8h-3a2 2 0 0 1-2-2V3"/>
                      <path d="M3 16h3a2 2 0 0 1 2 2v3"/>
                      <path d="M16 21v-3a2 2 0 0 1 2-2h3"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            v-if="!isPlaying && !loading"
            class="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
            @click="togglePlay"
          >
            <div class="w-20 h-20 bg-[#ff6b35] border-4 border-[#fffaef] flex items-center justify-center shadow-[4px_4px_0_0_#fffaef] hover:scale-110 transition-transform">
              <svg class="w-10 h-10 text-[#fffaef] ml-1" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 space-y-6">
            <div class="bg-[#fffaef] border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] p-6">
              <h2 class="font-['Pixelify_Sans',monospace] text-xl font-bold text-[#161310] mb-2">
                {{ video?.vod_name }}
              </h2>
              <p class="font-mono text-sm text-[#3a332a]">
                {{ video?.vod_year }} · {{ video?.vod_area }} · {{ video?.type_name }}
              </p>
              <p class="font-mono text-sm text-[#3a332a] mt-4 leading-relaxed">
                {{ video?.vod_content }}
              </p>
              <div class="mt-4 flex flex-wrap gap-4 text-xs font-mono text-[#3a332a]">
                <span>导演: {{ video?.vod_director }}</span>
                <span>演员: {{ video?.vod_actor }}</span>
              </div>
            </div>

            <div class="bg-[#fffaef] border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] overflow-hidden">
              <div class="px-6 py-3 bg-[#161310] text-[#fffaef] border-b-2 border-[#161310]">
                <h3 class="font-['Pixelify_Sans',monospace] text-lg font-bold">选集播放</h3>
              </div>
              <div class="p-6">
                <div v-if="playSources.length > 1" class="mb-4">
                  <p class="font-mono text-xs text-[#3a332a] mb-2">播放源:</p>
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="(src, index) in playSources"
                      :key="src.source"
                      class="px-3 py-1 font-mono text-xs border-2 border-[#161310] transition-colors"
                      :class="activeSourceIndex === index
                        ? 'bg-[#ff6b35] text-[#fffaef]'
                        : 'bg-[#f5f0e8] text-[#161310] hover:bg-[#161310] hover:text-[#fffaef]'"
                      @click="selectSource(index)"
                    >
                      {{ getSourceName(src.source) }}
                    </button>
                  </div>
                </div>
                <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-64 overflow-y-auto p-1">
                  <button
                    v-for="(ep, index) in currentEpisodes"
                    :key="index"
                    class="px-2 py-2 font-mono text-xs border-2 border-[#161310] transition-colors truncate"
                    :class="currentEpisodeIndex === index
                      ? 'bg-[#ff6b35] text-[#fffaef]'
                      : 'bg-[#f5f0e8] text-[#161310] hover:bg-[#161310] hover:text-[#fffaef]'"
                    @click="selectEpisode(index)"
                  >
                    {{ ep.name }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <div class="bg-[#fffaef] border-2 border-[#161310] shadow-[4px_4px_0_0_#161310] p-6">
              <h3 class="font-['Pixelify_Sans',monospace] text-lg font-bold text-[#161310] mb-4">
                相关推荐
              </h3>
              <div class="space-y-4">
                <div
                  v-for="v in relatedVideos.slice(0, 6)"
                  :key="v.vod_id"
                  class="flex gap-3 cursor-pointer group"
                  @click="router.push(`/video/player/${v.vod_id}`)"
                >
                  <div class="w-20 h-[70px] flex-shrink-0 border-2 border-[#161310] overflow-hidden bg-[#f5f0e8]">
                    <img
                      :src="v.vod_pic"
                      :alt="v.vod_name"
                      class="w-full h-full object-cover image-rendering-pixelated group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div class="flex-1 min-w-0">
                    <h4 class="font-mono text-sm font-bold text-[#161310] truncate group-hover:text-[#ff6b35] transition-colors">
                      {{ v.vod_name }}
                    </h4>
                    <p class="font-mono text-xs text-[#3a332a] mt-1 truncate">
                      {{ v.vod_year }} · {{ v.vod_area }}
                    </p>
                    <p class="font-mono text-[10px] text-[#ff6b35] mt-1">
                      {{ v.vod_remarks }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </main>

    <footer class="mt-16 border-t-2 border-[#fffaef]/20 bg-[#0d0b09]">
      <div class="max-w-[1400px] mx-auto px-6 py-8 text-center">
        <p class="font-mono text-xs text-[#fffaef]/50">
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

.player-container:fullscreen {
  width: 100vw;
  height: 100vh;
  border: none;
  box-shadow: none;
}

.player-container:fullscreen .aspect-video {
  aspect-ratio: auto;
  width: 100%;
  height: 100%;
}
</style>
