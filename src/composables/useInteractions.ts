import { onMounted, onBeforeUnmount } from 'vue'
import { gsap } from 'gsap'

/**
 * 更多炫酷交互动画
 */

// ─── 1. 磁吸按钮 ───
export function initMagneticButtons() {
  document.querySelectorAll('.magnetic-btn').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = (btn as HTMLElement).getBoundingClientRect()
      const x = (e.clientX - rect.left - rect.width / 2) * 0.25
      const y = (e.clientY - rect.top - rect.height / 2) * 0.25
      gsap.to(btn, { x, y, duration: 0.4, ease: 'power2.out', overwrite: 'auto' })
    })
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.2)' })
    })
  })
}

// ─── 2. 鼠标跟随光点 ───
export function initCursorFollower() {
  const existing = document.getElementById('cursor-dot')
  if (existing) return

  const dot = document.createElement('div')
  dot.id = 'cursor-dot'
  dot.style.cssText = `
    position: fixed;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #059669;
    pointer-events: none;
    z-index: 999999;
    transform: translate(-50%, -50%);
    transition: width 0.3s, height 0.3s, opacity 0.3s;
    opacity: 0;
  `
  document.body.appendChild(dot)

  let mouseX = 0, mouseY = 0
  let currentX = 0, currentY = 0

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX
    mouseY = e.clientY
    dot.style.opacity = '1'
  })

  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0'
  })

  // 平滑跟随
  gsap.ticker.add(() => {
    currentX += (mouseX - currentX) * 0.15
    currentY += (mouseY - currentY) * 0.15
    dot.style.left = currentX + 'px'
    dot.style.top = currentY + 'px'
  })

  // 悬停可点击元素时放大
  const hoverTargets = 'a, button, .magnetic-btn, .btn-tactile, .card-3d, [role="button"]'
  document.addEventListener('mouseover', (e) => {
    const target = e.target as HTMLElement
    if (target.closest(hoverTargets)) {
      dot.style.width = '16px'
      dot.style.height = '16px'
      dot.style.background = 'rgba(5, 150, 105, 0.3)'
      dot.style.backdropFilter = 'blur(4px)'
    }
  })
  document.addEventListener('mouseout', (e) => {
    const target = e.target as HTMLElement
    if (target.closest(hoverTargets)) {
      dot.style.width = '8px'
      dot.style.height = '8px'
      dot.style.background = '#059669'
    }
  })
}

// ─── 3. 滚动进度条 ───
export function initScrollProgress() {
  const existing = document.getElementById('scroll-progress')
  if (existing) return

  const bar = document.createElement('div')
  bar.id = 'scroll-progress'
  bar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 2px;
    background: linear-gradient(90deg, #059669, #34d399);
    z-index: 99999;
    width: 0%;
    transition: width 0.1s linear;
    pointer-events: none;
  `
  document.body.appendChild(bar)

  const update = () => {
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
    bar.style.width = progress + '%'
  }
  window.addEventListener('scroll', update, { passive: true })
  update()
}

// ─── 4. 3D 倾角卡片 ───
export function initTiltCards(selector = '.tilt-card') {
  document.querySelectorAll(selector).forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = (card as HTMLElement).getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      gsap.to(card, {
        rotationY: x * 10,
        rotationX: y * -10,
        transformPerspective: 800,
        duration: 0.4,
        ease: 'power2.out',
      })
    })
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotationY: 0,
        rotationX: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.2)',
      })
    })
  })
}

// ─── 5. 涟漪点击效果 ───
export function initRippleEffect(selector = '.ripple-btn') {
  document.querySelectorAll(selector).forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const rect = (this as HTMLElement).getBoundingClientRect()
      const ripple = document.createElement('span')
      const size = Math.max(rect.width, rect.height) * 1.5
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: rgba(5, 150, 105, 0.25);
        left: ${e.clientX - rect.left - size / 2}px;
        top: ${e.clientY - rect.top - size / 2}px;
        pointer-events: none;
        transform: scale(0);
      `
      this.appendChild(ripple)
      gsap.to(ripple, {
        scale: 1,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => ripple.remove(),
      })
    })
  })
}

// ─── 6. 浮动粒子背景 ───
export function initFloatingParticles(containerSelector = '#hero-particles') {
  const container = document.querySelector(containerSelector)
  if (!container) return

  for (let i = 0; i < 15; i++) {
    const dot = document.createElement('div')
    const size = Math.random() * 6 + 2
    dot.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: rgba(5, 150, 105, ${Math.random() * 0.12 + 0.03});
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      pointer-events: none;
    `
    container.appendChild(dot)

    gsap.to(dot, {
      y: -(Math.random() * 80 + 30),
      x: (Math.random() - 0.5) * 60,
      opacity: 0,
      duration: Math.random() * 4 + 3,
      repeat: -1,
      delay: Math.random() * 3,
      ease: 'power1.inOut',
    })
  }
}

// ─── 7. 数字递增 ───
export function initCountUp(selector = '.count-up') {
  document.querySelectorAll(selector).forEach((el) => {
    const target = parseFloat(el.getAttribute('data-target') || '0')
    const suffix = el.getAttribute('data-suffix') || ''
    const obj = { val: 0 }
    gsap.to(obj, {
      val: target,
      duration: 1.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom-=15%',
        toggleActions: 'play none none reset',
      },
      onUpdate: () => { el.textContent = Math.round(obj.val) + suffix },
    })
  })
}

// ─── 初始化全部交互 ───
export function initAllInteractions() {
  initCursorFollower()
  initScrollProgress()
  initMagneticButtons()
  initTiltCards()
  initRippleEffect()
  setTimeout(() => initFloatingParticles(), 500)
}
