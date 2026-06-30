import { onMounted, onBeforeUnmount } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

/**
 * 全站 GSAP 动画增强
 * 使用 GSAP 官方 skill 推荐的最佳实践
 */
export function useGsapEnhance() {
  let ctx: gsap.Context | null = null
  let mm: gsap.MatchMedia | null = null

  onMounted(() => {
    ctx = gsap.context(() => {
      mm = gsap.matchMedia()

      // 响应式 + prefers-reduced-motion
      mm.add({
        isDesktop: '(min-width: 768px)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
      }, (context) => {
        const conditions = context.conditions
        const reduceMotion = conditions?.reduceMotion
        const speed = reduceMotion ? 0 : 1

        // 1. Hero 入场 — 文字分段动画
        const heroTitle = document.querySelector('.hero-title')
        if (heroTitle && !reduceMotion) {
          const split = new SplitText(heroTitle, { type: 'words,chars' })
          gsap.from(split.chars, {
            y: 60,
            opacity: 0,
            rotationX: -40,
            duration: 0.6,
            stagger: 0.02,
            ease: 'back.out(1.7)',
            delay: 0.3,
          })
        }

        // 2. Hero 副标题淡入
        const heroSub = document.querySelector('.hero-subtitle')
        if (heroSub) {
          gsap.from(heroSub, {
            y: 30,
            opacity: 0,
            duration: 0.8 * speed,
            delay: 0.8,
            ease: 'power3.out',
          })
        }

        // 3. Hero 按钮磁吸入场
        const heroBtns = document.querySelectorAll('.hero-cta')
        if (heroBtns.length) {
          gsap.from(heroBtns, {
            y: 20,
            opacity: 0,
            duration: 0.5 * speed,
            stagger: 0.12,
            delay: 1.1,
            ease: 'power2.out',
          })
        }

        // 4. Hero 视差 (仅桌面端)
        const isDesktop = conditions?.isDesktop
        const heroSection = document.querySelector('.hero-section')
        if (heroSection && isDesktop && !reduceMotion) {
          gsap.fromTo(heroSection,
            { y: 0 },
            {
              y: -80,
              ease: 'none',
              scrollTrigger: {
                trigger: heroSection,
                start: 'top top',
                end: 'bottom top',
                scrub: 1.5,
              },
            }
          )
        }

        // 5. 全局滚动区块显现 — ScrollTrigger.batch
        ScrollTrigger.batch('.reveal-up', {
          start: 'top 85%',
          once: true,
          onEnter: (batch) => {
            gsap.fromTo(batch,
              { y: 50, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out', overwrite: true }
            )
          },
        })

        // 6. 精选卡片 — 交错滚动入场
        ScrollTrigger.batch('.card-reveal', {
          start: 'top 88%',
          once: true,
          onEnter: (batch) => {
            gsap.fromTo(batch,
              { y: 30, opacity: 0, scale: 0.98 },
              { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
            )
          },
        })

        // 7. 时间线条目 — 依次入场
        ScrollTrigger.batch('.timeline-item', {
          start: 'top 88%',
          once: true,
          onEnter: (batch) => {
            gsap.fromTo(batch,
              { x: -30, opacity: 0 },
              { x: 0, opacity: 1, duration: 0.5, stagger: 0.12, ease: 'power3.out' }
            )
          },
        })

        // 8. 技能条填充 — gsap.to 配合 scrollTrigger
        document.querySelectorAll('.skill-bar-fill').forEach((bar) => {
          const w = bar.getAttribute('data-width') || '0%'
          gsap.fromTo(bar,
            { width: '0%' },
            {
              width: w,
              duration: 1.2,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: bar,
                start: 'top bottom-=10%',
                toggleActions: 'play none none reset',
              },
            }
          )
        })

        // 9. 文章列表项 — 逐条显现
        ScrollTrigger.batch('.article-item', {
          start: 'top 88%',
          once: true,
          onEnter: (batch) => {
            gsap.fromTo(batch,
              { y: 20, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.4, stagger: 0.06, ease: 'power2.out' }
            )
          },
        })

        // 10. 统计数字 — 递增动画
        document.querySelectorAll('.count-up').forEach((el) => {
          const target = parseFloat(el.getAttribute('data-target') || '0')
          const suffix = el.getAttribute('data-suffix') || ''
          const obj = { val: 0 }
          gsap.to(obj, {
            val: target,
            duration: 1.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom-=10%',
              toggleActions: 'play none none reset',
            },
            onUpdate: () => {
              el.textContent = Math.round(obj.val) + suffix
            },
          })
        })

        // 11. 归档条目 — 按年分组显现
        ScrollTrigger.batch('.archive-year', {
          start: 'top 85%',
          once: true,
          onEnter: (batch) => {
            gsap.fromTo(batch,
              { y: 15, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: 'power2.out' }
            )
          },
        })
      })
    })
  })

  onBeforeUnmount(() => {
    mm?.revert()
    ctx?.revert()
    ScrollTrigger.getAll().forEach(t => t.kill())
  })
}

/** 磁吸按钮效果 */
export function useMagneticEffect(el: HTMLElement | null, strength = 0.3) {
  if (!el) return
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) * strength
    const y = (e.clientY - rect.top - rect.height / 2) * strength
    gsap.to(el, { x, y, duration: 0.3, ease: 'power2.out', overwrite: 'auto' })
  })
  el.addEventListener('mouseleave', () => {
    gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' })
  })
}

export { gsap, ScrollTrigger, SplitText }
