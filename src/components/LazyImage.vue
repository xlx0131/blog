<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue"

const props = withDefaults(defineProps<{
  src: string
  alt?: string
  ratio?: number | string
}>(), {
  alt: "",
  ratio: undefined,
})

const isVisible = ref(false)
const isLoaded = ref(false)
const hasError = ref(false)
const containerRef = ref<HTMLElement | null>(null)

let observer: IntersectionObserver | null = null

const aspectRatioStyle = computed(() => {
  if (props.ratio === undefined) return {}
  return { aspectRatio: String(props.ratio) }
})

const handleLoad = () => {
  isLoaded.value = true
}

const handleError = () => {
  hasError.value = true
}

const startLoading = () => {
  const img = new Image()
  img.onload = handleLoad
  img.onerror = handleError
  img.src = props.src
}

onMounted(() => {
  if (typeof IntersectionObserver === "undefined") {
    isVisible.value = true
    startLoading()
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible.value = true
          startLoading()
          observer?.disconnect()
        }
      })
    },
    { rootMargin: "50px" }
  )

  if (containerRef.value) {
    observer.observe(containerRef.value)
  }
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <div
    ref="containerRef"
    data-slot="lazy-image"
    class="lazy-image-container relative w-full overflow-hidden"
    :style="aspectRatioStyle"
  >
    <div v-if="!isLoaded && !hasError" class="placeholder">
      <div class="pixel-loader">
        <span class="pixel-dot"></span>
        <span class="pixel-dot"></span>
        <span class="pixel-dot"></span>
        <span class="pixel-dot"></span>
      </div>
    </div>

    <img
      v-if="isVisible && !hasError"
      :src="src"
      :alt="alt"
      class="lazy-image absolute inset-0 w-full h-full object-cover"
      :class="{ 'is-loaded': isLoaded }"
      @load="handleLoad"
      @error="handleError"
    />

    <div v-if="hasError" class="error-state">
      <span>加载失败</span>
    </div>
  </div>
</template>

<style scoped>
.lazy-image-container {
  background-color: #f5f0e8;
}

.placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f0e8;
  background-image:
    linear-gradient(#d9d2c4 1px, transparent 1px),
    linear-gradient(90deg, #d9d2c4 1px, transparent 1px);
  background-size: 8px 8px;
}

.pixel-loader {
  display: flex;
  gap: 4px;
}

.pixel-dot {
  width: 6px;
  height: 6px;
  background-color: #8a7a68;
  animation: pixelBlink 0.6s ease-in-out infinite;
}

.pixel-dot:nth-child(1) {
  animation-delay: 0s;
}

.pixel-dot:nth-child(2) {
  animation-delay: 0.15s;
}

.pixel-dot:nth-child(3) {
  animation-delay: 0.3s;
}

.pixel-dot:nth-child(4) {
  animation-delay: 0.45s;
}

@keyframes pixelBlink {
  0%, 100% {
    background-color: #8a7a68;
  }
  50% {
    background-color: #2e5dd6;
  }
}

.lazy-image {
  opacity: 0;
  transition: opacity 150ms ease;
}

.lazy-image.is-loaded {
  opacity: 1;
}

.error-state {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f0e8;
  background-image:
    linear-gradient(#d9d2c4 1px, transparent 1px),
    linear-gradient(90deg, #d9d2c4 1px, transparent 1px);
  background-size: 8px 8px;
}

.error-state span {
  font-family: monospace;
  font-size: 12px;
  color: #c44a4a;
}
</style>
