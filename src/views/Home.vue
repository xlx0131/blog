<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { animate } from 'animejs'
import FluidBackground from '@/components/FluidBackground.vue'
import GridBackground from '@/components/GridBackground.vue'
import avatar from '@/assets/头像.jpg'

const router = useRouter()

const introRef = ref<HTMLElement | null>(null)
const wrapRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const pathRef = ref<SVGPathElement | null>(null)
const shapeRef = ref<SVGSVGElement | null>(null)
const enterRef = ref<HTMLElement | null>(null)
const cardInnerRef = ref<HTMLElement | null>(null)

const showFluid = ref(true)
const showMain = ref(false)
const switched = ref(false)

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
  if (switched.value || !introRef.value || !pathRef.value || !shapeRef.value) return
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

function loadAll() {
  switchPage()
  loadMain()
}

function handleScroll(e: Event) {
  const de = e as WheelEvent & { wheelDelta?: number }
  const deltaY = de.deltaY || (de.wheelDelta !== undefined ? -de.wheelDelta : 0)
  if (deltaY > 0) loadAll()
}

let touchStartHandler: ((e: TouchEvent) => void) | null = null
let touchEndHandler: ((e: TouchEvent) => void) | null = null

onMounted(() => {
  loadIntro()

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
      if (angle >= -135 && angle <= -45) loadAll()
    }
    document.addEventListener('touchstart', touchStartHandler, { passive: true })
    document.addEventListener('touchend', touchEndHandler, { passive: true })
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('wheel', handleScroll)
  if (touchStartHandler) document.removeEventListener('touchstart', touchStartHandler)
  if (touchEndHandler) document.removeEventListener('touchend', touchEndHandler)
})
</script>

<template>
  <div class="page-wrapper">
    <!-- Main Section (dark background base) -->
    <div class="content-main">
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
        <!-- 向下滑动提示箭头：放在流体区域内底部 -->
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
  from {
    text-shadow: 0 0 1px #fff, 0 0 2px #fff, 0 0 3px #fff, 0 0 5px #333, 0 0 8px #333, 0 0 9px #333, 0 0 10px #333, 0 0 15px #333;
  }
  to {
    text-shadow: 0 0 0.5px #fff, 0 0 1px #fff, 0 0 1.5px #fff, 0 0 2px #333, 0 0 4px #333, 0 0 5px #333, 0 0 6px #333, 0 0 8px #333;
  }
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

.content-subtitle span {
  animation: letter-glow 0.7s 0s ease both;
}

@keyframes letter-glow {
  0% {
    opacity: 0;
    text-shadow: 0 0 1px rgba(255, 255, 255, 0.1);
  }
  66% {
    opacity: 1;
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.9);
  }
  77% {
    opacity: 1;
  }
  100% {
    opacity: 0.7;
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
  }
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
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.7), transparent);
  background-size: 200% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 2s linear infinite;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

@keyframes shimmer {
  0% { background-position: 200% center; text-shadow: 0 0 10px rgba(255, 255, 255, 0.3); }
  50% { text-shadow: 0 0 20px rgba(255, 255, 255, 0.6); }
  100% { background-position: -200% center; text-shadow: 0 0 10px rgba(255, 255, 255, 0.3); }
}

.arrow {
  position: absolute;
  left: 49.5%;
  top: 95%;
  transform-origin: 50% 50%;
  transform: translate3d(-50%, 0%, 0);
  cursor: pointer;
  pointer-events: auto;
  z-index: 20;
}
.arrow-1 {
  animation: arrow-movement 2s ease-in-out infinite;
}
.arrow-2 {
  animation: arrow-movement 2s 1s ease-in-out infinite;
}
.arrow:before,
.arrow:after {
  background: #fff;
  content: '';
  display: block;
  height: 3px;
  position: absolute;
  top: 0;
  left: 0;
  width: 13px;
  box-shadow: 1px 1px 20px 0px #fff;
}
.arrow:before {
  transform: rotate(45deg) translateX(-10%);
  transform-origin: top left;
}
.arrow:after {
  transform: rotate(-45deg) translateX(10%);
  transform-origin: top right;
}

@keyframes arrow-movement {
  0% { opacity: 0; top: 92%; }
  70% { opacity: 1; }
  100% { opacity: 0; }
}

/* ── SVG Shape ── */
.shape-wrap {
  position: relative;
  z-index: 0;
  background: transparent;
}
.shape {
  display: block;
  background: transparent;
}
.shape path {
  fill: #151515;
}

/* ── Main Section ── */
.content-main {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: #060606;
  pointer-events: none;
}

#card {
  position: relative;
  width: 100%;
  height: 100%;
  color: #93979e;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  z-index: 2;
  pointer-events: none;
}

#card a {
  pointer-events: auto;
}

.card-inner {
  padding: 0;
  border: 0;
  width: 100%;
  max-width: 700px;
  opacity: 0;
  transform: translateY(200px);
  transition: all 1s;
}
.card-inner.in {
  opacity: 1;
  transform: none;
}

.card-inner header {
  margin-bottom: 40px;
  text-align: center;
}

.card-inner header .avatar-img {
  display: block;
  margin: 0 auto;
}

.card-inner header img,
.card-inner header .avatar-placeholder {
  border: 3px solid #fff;
  border-radius: 50%;
  box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.3);
  transition: 0.4s ease-in-out;
  z-index: 2;
  position: relative;
}

.card-inner header h1 {
  margin: 15px 15px 0px;
  color: #fff;
  font-size: 2rem;
  line-height: 1.2em;
  font-weight: 300;
  z-index: 2;
  position: relative;
  letter-spacing: -0.02em;
}

.card-inner header h2 {
  color: #ccc;
  letter-spacing: 3px;
  font-size: 0.8rem;
  font-weight: lighter;
  z-index: 2;
  position: relative;
}

.card-inner ul {
  position: relative;
  margin: 0;
  list-style-type: none;
  display: inline-flex;
  width: 100%;
  justify-content: space-around;
  padding-bottom: 40px;
}

.card-inner ul li {
  z-index: 2;
  position: relative;
  display: inline-block;
  transition: all 0.2s;
  width: 100%;
  height: 100%;
}

.card-inner ul li a {
  color: #b6b6b6;
  transition: all 0.2s;
  text-decoration: none;
  outline: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
}

.card-inner ul li a:hover {
  color: #f6f6f6;
  text-shadow: 0 0 2px #f6f6f6;
}

@media screen and (max-width: 540px) {
  .content-title {
    font-size: 2rem !important;
  }
  .content-subtitle {
    font-size: 1rem !important;
  }
  .card-inner header h1 {
    font-size: 1rem !important;
  }
  .card-inner header h2 {
    font-size: 0.8rem !important;
  }
  .card-inner ul li a {
    font-size: 0.8rem !important;
  }
}
</style>
