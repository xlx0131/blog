<script setup lang="ts">
import { ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

const props = withDefaults(defineProps<{
  threshold?: number
  className?: string
}>(), {
  threshold: 0.15,
  className: '',
})

const target = ref<HTMLElement | null>(null)
const isVisible = ref(false)

useIntersectionObserver(
  target,
  ([entry]) => {
    if (entry.isIntersecting && !isVisible.value) {
      isVisible.value = true
    }
  },
  { threshold: props.threshold }
)
</script>

<template>
  <div
    ref="target"
    :class="[
      'transition-all duration-700',
      className,
      isVisible
        ? 'opacity-100 translate-y-0'
        : 'opacity-0 translate-y-8'
    ]"
    style="transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1)"
  >
    <slot />
  </div>
</template>
