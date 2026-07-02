<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import WebGLFluidEnhanced from 'webgl-fluid-enhanced'

const containerRef = ref<HTMLElement | null>(null)
let fluid: WebGLFluidEnhanced | null = null

onMounted(() => {
  if (!containerRef.value) return

  fluid = new WebGLFluidEnhanced(containerRef.value)

  // 覆盖库设置的内联样式（position: relative → absolute, display: flex → block）
  // 确保容器用 inset: 0 铺满父元素，而非按 canvas 宽高比缩放
  const el = containerRef.value
  el.style.position = 'absolute'
  el.style.display = 'block'
  el.style.justifyContent = ''
  el.style.alignItems = ''

  fluid.setConfig({
    transparent: false,
    bloom: true,
    bloomIntensity: 0.4,
    bloomThreshold: 0.8,
    bloomSoftKnee: 0.7,
    curl: 30,
    densityDissipation: 1,
    velocityDissipation: 0.2,
    colorUpdateSpeed: 10,
    splatRadius: 0.25,
    shading: true,
    brightness: 0.5,
    hover: true,
  })
  fluid.start()

  // 初始生成几次 splat 让画面先有颜色
  setTimeout(() => fluid?.multipleSplats(6), 300)

  // 标签页不可见时暂停
  const handleVisibility = () => {
    if (document.hidden) fluid?.stop()
    else fluid?.start()
  }
  document.addEventListener('visibilitychange', handleVisibility)

  onBeforeUnmount(() => {
    fluid?.stop()
    fluid = null
    document.removeEventListener('visibilitychange', handleVisibility)
  })
})
</script>

<template>
  <div ref="containerRef" class="fluid-container" aria-hidden="true" />
</template>

<style scoped>
.fluid-container {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: auto;
  background: #1e1f21;
}
.fluid-container :deep(canvas) {
  display: block;
  width: 100% !important;
  height: 100% !important;
}
</style>
