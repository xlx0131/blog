import { ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

/**
 * 滚动进入视口时触发动画
 * @param threshold 可见比例阈值 (0-1)
 */
export function useScrollReveal(threshold = 0.15) {
  const target = ref<HTMLElement | null>(null)
  const isVisible = ref(false)

  useIntersectionObserver(
    target,
    ([entry]) => {
      if (entry.isIntersecting && !isVisible.value) {
        isVisible.value = true
      }
    },
    { threshold }
  )

  return { target, isVisible }
}
