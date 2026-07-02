<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { animate } from 'animejs'
import * as echarts from 'echarts'
import FluidBackground from '@/components/FluidBackground.vue'
import GridBackground from '@/components/GridBackground.vue'
import avatar from '@/assets/头像.jpg'
import { projects, articles } from '@/data/contents.js'

const router = useRouter()

const introRef = ref<HTMLElement | null>(null)
const wrapRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const pathRef = ref<SVGPathElement | null>(null)
const shapeRef = ref<SVGSVGElement | null>(null)
const enterRef = ref<HTMLElement | null>(null)
const cardInnerRef = ref<HTMLElement | null>(null)
const mainWrapperRef = ref<HTMLElement | null>(null)

const showFluid = ref(true)
const showMain = ref(false)
const switched = ref(false)
const showStats = ref(false)
const isAnimating = ref(false)
let introPath = ''

const projectCountRef = ref<HTMLElement | null>(null)
const articleCountRef = ref<HTMLElement | null>(null)
const starCountRef = ref<HTMLElement | null>(null)
const categoryChartRef = ref<HTMLElement | null>(null)
const skillsChartRef = ref<HTMLElement | null>(null)
let categoryChart: echarts.ECharts | null = null
let skillsChart: echarts.ECharts | null = null
const repoStars = ref(0)

async function fetchGitHubStars() {
  try {
    const cached = sessionStorage.getItem('github-stars')
    if (cached) { repoStars.value = Number(cached); return }
    const res = await fetch('https://api.github.com/users/xlx0131/repos?per_page=100')
    const repos = await res.json()
    const total = repos.reduce((sum: number, r: any) => sum + (r.stargazers_count || 0), 0)
    repoStars.value = total
    sessionStorage.setItem('github-stars', String(total))
  } catch { /* 静默失败 */ }
}

function animateCount(el: HTMLElement | null, target: number, delay = 0) {
  if (!el) return
  setTimeout(() => {
    const start = performance.now()
    const duration = 1500
    function step(now: number) {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      el!.textContent = String(Math.round(target * eased))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, delay)
}

const isPhone = /Mobile|Android|iOS|iPhone|iPad|iPod|Windows Phone|KFAPWI/i.test(navigator.userAgent)
const hiddenProperty = 'hidden' in document ? 'hidden' : 'webkitHidden' in document ? 'webkitHidden' : 'mozHidden' in document ? 'mozHidden' : null
const visibilityChangeEvent = hiddenProperty?.replace(/hidden/i, 'visibilitychange') ?? 'visibilitychange'

function loadIntro() {
  if (document[hiddenProperty as keyof Document] || !wrapRef.value) return
  wrapRef.value.classList.add('in')
  if (subtitleRef.value) {
    const text = subtitleRef.value.textContent || ''
    subtitleRef.value.innerHTML = `<span>${[...text].join('</span><span>')}</span>`
  }
}

function switchPage() {
  if (switched.value || isAnimating.value || !introRef.value || !pathRef.value || !shapeRef.value) return
  isAnimating.value = true
  switched.value = true

  const pathId = pathRef.value.getAttribute('pathdata:id')
  shapeRef.value.style.transformOrigin = '50% 0%'

  animate(introRef.value, {
    translateY: '-200vh',
    duration: 1100,
    easing: 'easeInOutSine',
  })

  animate(shapeRef.value, {
    scaleY: { from: 0.8, to: 1.8 },
    duration: 550,
    easing: 'easeInQuad',
  }).then(() => {
    if (shapeRef.value) {
      animate(shapeRef.value, {
        scaleY: 1,
        duration: 550,
        easing: 'easeOutQuad',
      })
    }
  })

  animate(pathRef.value, {
    d: pathId,
    duration: 1100,
    easing: 'easeOutQuad',
  }).then(() => {
    showFluid.value = false
    isAnimating.value = false
  })
}

function rollbackToIntro() {
  if (!switched.value || isAnimating.value || !introRef.value || !pathRef.value || !shapeRef.value) return
  isAnimating.value = true
  showFluid.value = true

  const pathId = pathRef.value.getAttribute('pathdata:id')
  shapeRef.value.style.transformOrigin = '50% 0%'

  pathRef.value.setAttribute('d', pathId || '')
  animate(pathRef.value, {
    d: introPath,
    duration: 1100,
    easing: 'easeInQuad',
  })

  animate(shapeRef.value, {
    scaleY: { from: 1, to: 1.8 },
    duration: 550,
    easing: 'easeInQuad',
  }).then(() => {
    if (shapeRef.value) {
      animate(shapeRef.value, {
        scaleY: 0.8,
        duration: 550,
        easing: 'easeOutQuad',
      })
    }
  })

  animate(introRef.value, {
    translateY: '0vh',
    duration: 1100,
    easing: 'easeInOutSine',
  }).then(() => {
    switched.value = false
    isAnimating.value = false
  })
}

function loadMain() {
  if (showMain.value) return
  setTimeout(() => {
    showMain.value = true
    setTimeout(() => {
      cardInnerRef.value?.classList.add('in')
    }, 50)
  }, 400)
}

function initCategoryChart() {
  if (!categoryChartRef.value) return
  categoryChart = echarts.init(categoryChartRef.value)
  const categoryMap = articles.reduce((acc: Record<string, number>, a: any) => {
    acc[a.category] = (acc[a.category] || 0) + 1
    return acc
  }, {})
  const data = Object.entries(categoryMap).map(([name, value]) => ({ name, value }))
  const option = {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(20,20,20,0.9)',
      borderColor: 'rgba(255,255,255,0.1)',
      textStyle: { color: '#e6edf3' },
    },
    series: [{
      type: 'pie',
      radius: ['55%', '75%'],
      center: ['50%', '50%'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderColor: '#0d1117',
        borderWidth: 2,
        borderRadius: 4,
      },
      label: {
        show: true,
        position: 'outside',
        color: '#8b949e',
        fontSize: 11,
        formatter: '{b}\n{c}篇',
      },
      labelLine: {
        lineStyle: { color: 'rgba(139,148,158,0.4)' },
      },
      data: [
        { value: data[0]?.value || 1, name: data[0]?.name || '运维', itemStyle: { color: '#34d399' } },
        { value: data[1]?.value || 1, name: data[1]?.name || '数据分析', itemStyle: { color: '#60a5fa' } },
      ],
      animationType: 'scale',
      animationEasing: 'elasticOut',
      animationDelay: () => Math.random() * 200,
    }],
  }
  categoryChart.setOption(option)
}

function initSkillsChart() {
  if (!skillsChartRef.value) return
  skillsChart = echarts.init(skillsChartRef.value)
  const allTech = projects.flatMap((p: any) => p.tech || [])
  const techCount: Record<string, number> = {}
  allTech.forEach((t: string) => { techCount[t] = (techCount[t] || 0) + 1 })
  articles.forEach((a: any) => {
    (a.tags || []).forEach((t: string) => {
      techCount[t] = (techCount[t] || 0) + 0.5
    })
  })
  const sorted = Object.entries(techCount).sort((a, b) => b[1] - a[1]).slice(0, 6)
  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(20,20,20,0.9)',
      borderColor: 'rgba(255,255,255,0.1)',
      textStyle: { color: '#e6edf3' },
      axisPointer: { type: 'shadow' },
    },
    grid: {
      left: '3%',
      right: '8%',
      bottom: '3%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#8b949e', fontSize: 10 },
      splitLine: { lineStyle: { color: 'rgba(139,148,158,0.1)' } },
    },
    yAxis: {
      type: 'category',
      data: sorted.map(s => s[0]).reverse(),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#c9d1d9', fontSize: 11 },
    },
    series: [{
      type: 'bar',
      data: sorted.map(s => s[1]).reverse(),
      barWidth: 12,
      itemStyle: {
        borderRadius: [0, 4, 4, 0],
        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          { offset: 0, color: '#10b981' },
          { offset: 1, color: '#34d399' },
        ]),
      },
      label: {
        show: true,
        position: 'right',
        color: '#8b949e',
        fontSize: 10,
        formatter: '{c}',
      },
      animationDelay: (idx: number) => idx * 100,
    }],
  }
  skillsChart.setOption(option)
}

function resizeCharts() {
  categoryChart?.resize()
  skillsChart?.resize()
}

function loadStats() {
  if (showStats.value || isAnimating.value) return
  isAnimating.value = true
  showStats.value = true
  mainWrapperRef.value?.classList.add('show-stats')
  animateCount(projectCountRef.value, projects.length, 300)
  animateCount(articleCountRef.value, articles.length, 450)
  animateCount(starCountRef.value, repoStars.value, 600)
  nextTick(() => {
    setTimeout(() => {
      initCategoryChart()
      initSkillsChart()
      window.addEventListener('resize', resizeCharts)
    }, 300)
  })
  setTimeout(() => {
    isAnimating.value = false
  }, 1000)
}

function disposeCharts() {
  window.removeEventListener('resize', resizeCharts)
  categoryChart?.dispose()
  skillsChart?.dispose()
  categoryChart = null
  skillsChart = null
}

function rollbackToMain() {
  if (!showStats.value || isAnimating.value) return
  isAnimating.value = true
  showStats.value = false
  mainWrapperRef.value?.classList.remove('show-stats')
  disposeCharts()
  setTimeout(() => {
    isAnimating.value = false
  }, 1000)
}

function loadAll() {
  switchPage()
  loadMain()
}

function handleScroll(e: Event) {
  const de = e as WheelEvent & { wheelDelta?: number }
  const deltaY = de.deltaY || (de.wheelDelta !== undefined ? -de.wheelDelta : 0)
  if (deltaY > 0) {
    if (!switched.value) { loadAll(); return }
    if (!showStats.value) { loadStats(); return }
  } else if (deltaY < 0) {
    if (showStats.value) { rollbackToMain(); return }
    if (switched.value) { rollbackToIntro(); return }
  }
}

let touchStartHandler: ((e: TouchEvent) => void) | null = null
let touchEndHandler: ((e: TouchEvent) => void) | null = null

onMounted(() => {
  if (pathRef.value) {
    introPath = pathRef.value.getAttribute('d') || ''
  }
  loadIntro()
  fetchGitHubStars()

  enterRef.value?.addEventListener('click', loadAll)
  window.addEventListener('wheel', handleScroll, { passive: true })

  if (isPhone) {
    touchStartHandler = (e: TouchEvent) => {
      ;(window as any).startx = e.touches[0].pageX
      ;(window as any).starty = e.touches[0].pageY
    }
    touchEndHandler = (e: TouchEvent) => {
      const endx = e.changedTouches[0].pageX
      const endy = e.changedTouches[0].pageY
      const angx = endx - ((window as any).startx || 0)
      const angy = endy - ((window as any).starty || 0)
      if (Math.abs(angx) < 2 && Math.abs(angy) < 2) return
      const angle = (Math.atan2(angy, angx) * 180) / Math.PI
      if (angle >= -135 && angle <= -45) {
        if (!switched.value) loadAll()
        else if (!showStats.value) loadStats()
      } else if (angle >= 45 && angle <= 135) {
        if (showStats.value) rollbackToMain()
        else if (switched.value) rollbackToIntro()
      }
    }
    document.addEventListener('touchstart', touchStartHandler, { passive: true })
    document.addEventListener('touchend', touchEndHandler, { passive: true })
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('wheel', handleScroll)
  if (touchStartHandler) document.removeEventListener('touchstart', touchStartHandler)
  if (touchEndHandler) document.removeEventListener('touchend', touchEndHandler)
  disposeCharts()
})
</script>

<template>
  <div class="page-wrapper">
    <!-- Main Section -->
    <div class="content-main">
      <div class="main-wrapper" ref="mainWrapperRef">
        <!-- 第二屏：卡片 -->
        <div id="card">
          <div class="card-inner" ref="cardInnerRef">
            <header>
              <img :src="avatar" alt="头像" class="avatar-img" width="80" height="80" />
              <h1>许立鑫</h1>
              <h2 id="signature">写代码 · 做设计 · 思考人生</h2>
            </header>
            <ul>
              <li>
                <router-link to="/archive" aria-label="归档">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M4 4h16v16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/></svg>
                  <span>归档</span>
                </router-link>
              </li>
              <li>
                <router-link to="/projects" aria-label="项目">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
                  <span>项目</span>
                </router-link>
              </li>
              <li>
                <router-link to="/about" aria-label="关于">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 10-16 0"/></svg>
                  <span>关于</span>
                </router-link>
              </li>
            </ul>
          </div>
        </div>

        <!-- 第三屏：数据看板 -->
        <div class="stats-section">
          <div class="stats-container">
            <h3 class="stats-title">数据概览</h3>
            <div class="stats-grid">
              <div class="stat-item">
                <svg class="stat-icon" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect x="4" y="10" width="32" height="26" rx="3" stroke="#34d399"/>
                  <path d="M4 16h32" stroke="#34d399"/>
                  <rect x="12" y="20" width="6" height="6" rx="1" fill="#34d399" opacity="0.3"/>
                  <rect x="22" y="20" width="6" height="6" rx="1" fill="#34d399" opacity="0.3"/>
                </svg>
                <span class="stat-number" ref="projectCountRef">0</span>
                <span class="stat-label">项目</span>
              </div>
              <div class="stat-item">
                <svg class="stat-icon" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M8 34V8a4 4 0 014-4h16a4 4 0 014 4v26" stroke="#34d399"/>
                  <path d="M8 34a4 4 0 014-4h20" stroke="#34d399"/>
                  <path d="M15 14h10" stroke="#34d399" stroke-linecap="round"/>
                  <path d="M15 20h10" stroke="#34d399" stroke-linecap="round"/>
                  <path d="M15 26h6" stroke="#34d399" stroke-linecap="round"/>
                </svg>
                <span class="stat-number" ref="articleCountRef">0</span>
                <span class="stat-label">博客</span>
              </div>
              <div class="stat-item">
                <svg class="stat-icon" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M20 4l4.5 9.5 10.5 1.5-7.5 7.5 1.8 10.5L20 28l-9.3 5 1.8-10.5L5 15l10.5-1.5L20 4z" fill="#34d399" fill-opacity="0.15" stroke="#34d399"/>
                </svg>
                <span class="stat-number" ref="starCountRef">0</span>
                <span class="stat-label">GitHub 星星</span>
              </div>
            </div>
            <div class="charts-row">
              <div class="chart-card">
                <div class="chart-title">文章分类</div>
                <div class="chart-wrapper" ref="categoryChartRef"></div>
              </div>
              <div class="chart-card">
                <div class="chart-title">技能标签</div>
                <div class="chart-wrapper" ref="skillsChartRef"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Grid Snake Background -->
    <GridBackground />

    <!-- Intro Section -->
    <div class="content-intro" ref="introRef">
      <div class="content-inner">
        <FluidBackground v-if="showFluid" />
        <div class="wrap" ref="wrapRef">
          <h2 class="content-title">许立鑫</h2>
          <h3 class="content-subtitle" ref="subtitleRef">写代码 · 做设计 · 思考人生</h3>
          <a class="enter" ref="enterRef">ENTER</a>
        </div>
        <div class="arrow arrow-1"></div>
        <div class="arrow arrow-2"></div>
      </div>
      <div class="shape-wrap">
        <svg class="shape" ref="shapeRef" width="100%" height="100vh" preserveAspectRatio="none" viewBox="0 0 1440 800">
          <path ref="pathRef" d="M -44,-50 C -52.71,28.52 15.86,8.186 184,14.69 383.3,22.39 462.5,12.58 638,14 835.5,15.6 987,6.4 1194,13.86 1661,30.68 1652,-36.74 1582,-140.1 1512,-243.5 15.88,-589.5 -44,-50 Z" pathdata:id="M -44,-50 C -137.1,117.4 67.86,445.5 236,452 435.3,459.7 500.5,242.6 676,244 873.5,245.6 957,522.4 1154,594 1593,753.7 1793,226.3 1582,-126 1371,-478.3 219.8,-524.2 -44,-50 Z" />
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ── Page Wrapper ── */
.page-wrapper {
  height: 100vh;
  width: 100%;
  overflow: hidden;
  position: relative;
  background: #060606;
}

/* ── Intro Section ── */
.content-intro {
  position: relative;
  z-index: 100;
  height: 200vh;
  background: transparent;
}

.content-inner {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: transparent;
}

.wrap {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  opacity: 0;
  transform: translateY(200px);
  transition: all 1s;
  z-index: 10;
  pointer-events: none;
}
.wrap.in {
  opacity: 1;
  transform: none;
}

.content-title {
  font-family: 'Comic Sans MS', 'Helvetica Neue', 'Microsoft Yahei', -apple-system, sans-serif;
  font-size: 4.7rem;
  font-weight: 200;
  color: #fff;
  line-height: 1;
  margin-top: 0.8em;
  margin-bottom: 0.3em;
  animation: whiteShadow 1.5s ease-in-out infinite alternate;
  text-shadow: rgb(69, 45, 45) 0 0 1px, rgb(255, 255, 251) 0 0 1px, rgb(255, 255, 251) 0 0 2px;
  pointer-events: auto;
}

@keyframes whiteShadow {
  from { text-shadow: 0 0 1px #fff, 0 0 2px #fff, 0 0 3px #fff, 0 0 5px #333, 0 0 8px #333, 0 0 9px #333, 0 0 10px #333, 0 0 15px #333; }
  to { text-shadow: 0 0 0.5px #fff, 0 0 1px #fff, 0 0 1.5px #fff, 0 0 2px #333, 0 0 4px #333, 0 0 5px #333, 0 0 6px #333, 0 0 8px #333; }
}

.content-subtitle {
  color: #fff;
  font-family: 'Comic Sans MS', 'Helvetica Neue', 'Microsoft Yahei', -apple-system, sans-serif;
  font-size: 1.2rem;
  font-weight: 200;
  margin-bottom: 2em;
  text-shadow: 0 0 4px #ffffff;
  pointer-events: auto;
}
.content-subtitle span { animation: letter-glow 0.7s 0s ease both; }

@keyframes letter-glow {
  0% { opacity: 0; text-shadow: 0 0 1px rgba(255,255,255,0.1); }
  66% { opacity: 1; text-shadow: 0 0 20px rgba(255,255,255,0.9); }
  77% { opacity: 1; }
  100% { opacity: 0.7; text-shadow: 0 0 20px rgba(255,255,255,0.2); }
}

.content-subtitle span:nth-child(1) { animation-delay: 0.05s; }
.content-subtitle span:nth-child(2) { animation-delay: 0.10s; }
.content-subtitle span:nth-child(3) { animation-delay: 0.15s; }
.content-subtitle span:nth-child(4) { animation-delay: 0.20s; }
.content-subtitle span:nth-child(5) { animation-delay: 0.25s; }
.content-subtitle span:nth-child(6) { animation-delay: 0.30s; }
.content-subtitle span:nth-child(7) { animation-delay: 0.35s; }
.content-subtitle span:nth-child(8) { animation-delay: 0.40s; }
.content-subtitle span:nth-child(9) { animation-delay: 0.45s; }
.content-subtitle span:nth-child(10) { animation-delay: 0.50s; }
.content-subtitle span:nth-child(11) { animation-delay: 0.55s; }
.content-subtitle span:nth-child(12) { animation-delay: 0.60s; }
.content-subtitle span:nth-child(13) { animation-delay: 0.65s; }
.content-subtitle span:nth-child(14) { animation-delay: 0.70s; }
.content-subtitle span:nth-child(15) { animation-delay: 0.75s; }
.content-subtitle span:nth-child(16) { animation-delay: 0.80s; }
.content-subtitle span:nth-child(17) { animation-delay: 0.85s; }

.enter {
  color: #fff;
  font-size: 0.8rem;
  letter-spacing: 3px;
  white-space: pre;
  pointer-events: auto;
  transition: all 0.4s;
  z-index: 999;
  position: relative;
  cursor: pointer;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent);
  background-size: 200% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 2s linear infinite;
  text-shadow: 0 0 10px rgba(255,255,255,0.3);
}

@keyframes shimmer {
  0% { background-position: 200% center; text-shadow: 0 0 10px rgba(255,255,255,0.3); }
  50% { text-shadow: 0 0 20px rgba(255,255,255,0.6); }
  100% { background-position: -200% center; text-shadow: 0 0 10px rgba(255,255,255,0.3); }
}

.arrow {
  position: absolute; left: 49.5%; top: 95%;
  transform-origin: 50% 50%;
  transform: translate3d(-50%, 0%, 0);
  cursor: pointer; pointer-events: auto; z-index: 20;
}
.arrow-1 { animation: arrow-movement 2s ease-in-out infinite; }
.arrow-2 { animation: arrow-movement 2s 1s ease-in-out infinite; }
.arrow:before, .arrow:after {
  background: #fff; content: ''; display: block;
  height: 3px; position: absolute; top: 0; left: 0;
  width: 13px; box-shadow: 1px 1px 20px 0px #fff;
}
.arrow:before { transform: rotate(45deg) translateX(-10%); transform-origin: top left; }
.arrow:after { transform: rotate(-45deg) translateX(10%); transform-origin: top right; }

@keyframes arrow-movement {
  0% { opacity: 0; top: 92%; }
  70% { opacity: 1; }
  100% { opacity: 0; }
}

/* ── SVG Shape ── */
.shape-wrap { position: relative; z-index: 0; background: transparent; }
.shape { display: block; background: transparent; }
.shape path { fill: #151515; }

/* ── Main Section ── */
.content-main {
  position: fixed;
  top: 0; left: 0;
  width: 100%;
  height: 100vh;
  background: #060606;
  overflow: hidden;
  pointer-events: none;
}

.main-wrapper {
  height: 200vh;
  transition: transform 1s cubic-bezier(0.16, 1, 0.3, 1);
  transform: translateY(0);
}
.main-wrapper.show-stats {
  transform: translateY(-100vh);
}

/* ── Card (第二屏) ── */
#card {
  height: 100vh;
  color: #93979e;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  z-index: 2;
  pointer-events: none;
}
#card a { pointer-events: auto; }

.card-inner {
  padding: 0; border: 0;
  width: 100%; max-width: 700px;
  opacity: 0;
  transform: translateY(200px);
  transition: all 1s;
}
.card-inner.in { opacity: 1; transform: none; }

.card-inner header { margin-bottom: 40px; text-align: center; }
.card-inner header .avatar-img { display: block; margin: 0 auto; }
.card-inner header img, .card-inner header .avatar-placeholder {
  border: 3px solid #fff; border-radius: 50%;
  box-shadow: 0 0 1px 1px rgba(0,0,0,0.3);
  transition: 0.4s ease-in-out;
  z-index: 2; position: relative;
}
.card-inner header h1 {
  margin: 15px 15px 0px; color: #fff;
  font-size: 2rem; line-height: 1.2em; font-weight: 300;
  z-index: 2; position: relative; letter-spacing: -0.02em;
}
.card-inner header h2 {
  color: #ccc; letter-spacing: 3px;
  font-size: 0.8rem; font-weight: lighter;
  z-index: 2; position: relative;
}

.card-inner ul {
  position: relative; margin: 0;
  list-style-type: none; display: inline-flex;
  width: 100%; justify-content: space-around;
  padding-bottom: 40px;
}
.card-inner ul li {
  z-index: 2; position: relative;
  display: inline-block; transition: all 0.2s;
  width: 100%; height: 100%;
}
.card-inner ul li a {
  color: #b6b6b6; transition: all 0.2s;
  text-decoration: none; outline: none;
  display: flex; flex-direction: column;
  align-items: center; gap: 8px; font-size: 0.9rem;
}
.card-inner ul li a:hover { color: #f6f6f6; text-shadow: 0 0 2px #f6f6f6; }

/* ── Stats Section (第三屏) ── */
.stats-section {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
}

.stats-container {
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.stats-title {
  text-align: center;
  color: #e6edf3;
  font-size: 1.3rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px 16px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  transition: all 0.3s ease;
}
.stat-item:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(52, 211, 153, 0.3);
  transform: translateY(-2px);
}

.stat-icon {
  width: 36px;
  height: 36px;
  margin-bottom: 2px;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #e6edf3;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.stat-label {
  font-size: 0.75rem;
  color: #8b949e;
  letter-spacing: 0.05em;
}

.charts-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.chart-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: all 0.3s ease;
}
.chart-card:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(52, 211, 153, 0.2);
}

.chart-title {
  color: #c9d1d9;
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  padding-left: 4px;
}

.chart-wrapper {
  width: 100%;
  height: 200px;
}

@media screen and (max-width: 720px) {
  .charts-row { grid-template-columns: 1fr; }
  .chart-wrapper { height: 180px; }
}

@media screen and (max-width: 540px) {
  .content-title { font-size: 2rem !important; }
  .content-subtitle { font-size: 1rem !important; }
  .card-inner header h1 { font-size: 1rem !important; }
  .card-inner header h2 { font-size: 0.8rem !important; }
  .card-inner ul li a { font-size: 0.8rem !important; }
  .stats-section { padding: 20px 12px; }
  .stats-title { font-size: 1rem; }
  .stats-grid { gap: 8px; }
  .stat-item { padding: 12px 8px; border-radius: 8px; }
  .stat-number { font-size: 1.4rem; }
  .stat-icon { width: 28px; height: 28px; }
  .stat-label { font-size: 0.7rem; }
  .chart-card { padding: 12px; border-radius: 8px; }
  .chart-title { font-size: 0.75rem; }
  .chart-wrapper { height: 160px; }
}
</style>
