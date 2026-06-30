import { ref, onMounted, onBeforeUnmount } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * GSAP 滚动触发动画
 */
export function useGsapAnimations() {
  const ready = ref(false)
  let ctx: gsap.Context | null = null
  let triggers: ScrollTrigger[] = []

  onMounted(() => {
    ctx = gsap.context(() => {
      ready.value = true
    })
  })

  onBeforeUnmount(() => {
    triggers.forEach(t => t.kill())
    triggers = []
    ctx?.revert()
  })

  /** 从下方淡入 */
  function fadeUp(el: string | Element, options?: {
    delay?: number
    duration?: number
    y?: number
    stagger?: number
    threshold?: number
  }) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: `top bottom-=${options?.threshold ? (1 - options.threshold) * 100 : 80}%`,
        toggleActions: 'play none none reverse',
      },
    })
    tl.from(el, {
      y: options?.y ?? 40,
      opacity: 0,
      duration: options?.duration ?? 0.8,
      ease: 'power3.out',
      stagger: options?.stagger ?? 0,
      delay: options?.delay ?? 0,
    })
    return tl
  }

  /** 缩放淡入 */
  function scaleIn(el: string | Element, options?: {
    duration?: number
    threshold?: number
  }) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: `top bottom-=${options?.threshold ? (1 - options.threshold) * 100 : 75}%`,
        toggleActions: 'play none none reverse',
      },
    })
    tl.from(el, {
      scale: 0.92,
      opacity: 0,
      duration: options?.duration ?? 0.7,
      ease: 'power2.out',
    })
    return tl
  }

  /** 数字递增动画 */
  function countUp(el: string | Element, target: number, options?: {
    duration?: number
    suffix?: string
  }) {
    const obj = { val: 0 }
    gsap.to(obj, {
      val: target,
      duration: options?.duration ?? 1.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom-=20%',
        toggleActions: 'play none none reset',
      },
      onUpdate: () => {
        if (typeof el === 'string') {
          document.querySelector(el)!.textContent = Math.round(obj.val) + (options?.suffix ?? '')
        }
      },
    })
  }

  /** 水平进度条填充 */
  function fillBar(el: string | Element, options?: {
    duration?: number
    threshold?: number
  }) {
    gsap.fromTo(el,
      { scaleX: 0, transformOrigin: 'left center' },
      {
        scaleX: 1,
        duration: options?.duration ?? 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: `top bottom-=${options?.threshold ? (1 - options.threshold) * 100 : 20}%`,
          toggleActions: 'play none none reset',
        },
      }
    )
  }

  /** 文字逐字出现 */
  function textReveal(el: string | Element, options?: {
    duration?: number
    threshold?: number
  }) {
    gsap.from(el, {
      clipPath: 'inset(0 100% 0 0)',
      duration: options?.duration ?? 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: `top bottom-=${options?.threshold ? (1 - options.threshold) * 100 : 30}%`,
        toggleActions: 'play none none reverse',
      },
    })
  }

  return {
    ready,
    fadeUp,
    scaleIn,
    countUp,
    fillBar,
    textReveal,
  }
}

export { gsap, ScrollTrigger }
