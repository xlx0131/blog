<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const heroRef = ref<HTMLElement | null>(null)
let ctx: gsap.Context | null = null

onMounted(() => {
  if (!heroRef.value) return

  ctx = gsap.context(() => {
    const contentEl = heroRef.value?.querySelector('.hero-content')
    if (!contentEl) return

    // Hero 内容淡入（首次加载动画）
    gsap.from(contentEl, {
      y: 60,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
      delay: 0.2,
    })

    // 视差滚动效果
    if (!heroRef.value) return
    ScrollTrigger.create({
      trigger: heroRef.value,
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
      onUpdate(self: any) {
        if (!heroRef.value) return
        const y = self.progress * 60
        heroRef.value.style.transform = `translateY(${y}px)`
        heroRef.value.style.opacity = `${1 - self.progress * 0.3}`
      },
    })
  })
})

onBeforeUnmount(() => {
  ctx?.revert()
})
</script>

<template>
  <div ref="heroRef" class="hero-content-wrapper">
    <slot />
  </div>
</template>
