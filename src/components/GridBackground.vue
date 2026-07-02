<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = withDefaults(defineProps<{
  direction?: string
  speed?: number
  borderColor?: string
  squareSize?: number
  hoverFillColor?: string
  hoverShadowColor?: string
  transitionDuration?: number
  trailDuration?: number
  specialBlockColor?: string
  snakeHeadColor?: string
  snakeTailColor?: string
  snakeColorDecay?: number
  touchSensitivity?: number
  vibrationEnabled?: boolean
}>(), {
  direction: 'diagonal',
  speed: undefined,
  borderColor: undefined,
  squareSize: undefined,
  hoverFillColor: 'rgba(255, 255, 255, 0.8)',
  hoverShadowColor: 'rgba(255, 255, 255, 0.8)',
  transitionDuration: undefined,
  trailDuration: undefined,
  specialBlockColor: 'rgba(100, 255, 152, 0.8)',
  snakeHeadColor: 'rgba(255, 255, 255, 0.95)',
  snakeTailColor: 'rgba(218, 231, 255, 0.25)',
  snakeColorDecay: 0.85,
  touchSensitivity: undefined,
  vibrationEnabled: undefined,
})

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animationFrame: number | null = null
let ctx: CanvasRenderingContext2D | null = null
let gridOffset = { x: 0, y: 0 }
let hoveredSquare: { x: number; y: number } | null = null
let currentOpacity = 0
let targetOpacity = 0
let lastTimestamp = 0
let trailSquares = new Map<string, { x: number; y: number; opacity: number }>()
let specialBlock: { x: number; y: number; color: string } | null = null
let snakeBody: { x: number; y: number }[] = []
let shouldGrow = false

const isPhone = /Mobile|Android|iOS|iPhone|iPad|iPod|Windows Phone|KFAPWI/i.test(navigator.userAgent)
const hiddenProperty = 'hidden' in document ? 'hidden' : 'webkitHidden' in document ? 'webkitHidden' : 'mozHidden' in document ? 'mozHidden' : null
const visibilityChangeEvent = hiddenProperty?.replace(/hidden/i, 'visibilitychange') ?? 'visibilitychange'

const options = {
  direction: props.direction,
  speed: props.speed ?? (isPhone ? 0.03 : 0.05),
  borderColor: props.borderColor ?? (isPhone ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'),
  squareSize: props.squareSize ?? (isPhone ? 50 : 40),
  hoverFillColor: props.hoverFillColor,
  hoverShadowColor: props.hoverShadowColor,
  transitionDuration: props.transitionDuration ?? (isPhone ? 150 : 200),
  trailDuration: props.trailDuration ?? (isPhone ? 2000 : 1500),
  specialBlockColor: props.specialBlockColor,
  snakeHeadColor: props.snakeHeadColor,
  snakeTailColor: props.snakeTailColor,
  snakeColorDecay: props.snakeColorDecay,
  touchSensitivity: props.touchSensitivity ?? (isPhone ? 1.2 : 1.0),
  vibrationEnabled: props.vibrationEnabled ?? isPhone,
}

function resizeCanvas() {
  const canvas = canvasRef.value
  if (!canvas || !ctx) return
  const dpr = window.devicePixelRatio || 1
  const displayWidth = canvas.offsetWidth
  const displayHeight = canvas.offsetHeight

  canvas.width = Math.floor(displayWidth * dpr)
  canvas.height = Math.floor(displayHeight * dpr)
  canvas.style.width = `${displayWidth}px`
  canvas.style.height = `${displayHeight}px`

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
}

function isInsideCanvas(clientX: number, clientY: number): boolean {
  const canvas = canvasRef.value
  if (!canvas) return false
  const rect = canvas.getBoundingClientRect()
  return clientX >= rect.left && clientX <= rect.right &&
         clientY >= rect.top && clientY <= rect.bottom
}

function handleCanvasMouseLeave() {
  if (hoveredSquare) {
    const startX = Math.floor(gridOffset.x / options.squareSize) * options.squareSize
    const startY = Math.floor(gridOffset.y / options.squareSize) * options.squareSize
    trailSquares.set(`${hoveredSquare.x},${hoveredSquare.y}`, {
      x: hoveredSquare.x * options.squareSize + startX,
      y: hoveredSquare.y * options.squareSize + startY,
      opacity: 0.6,
    })
  }
  hoveredSquare = null
  targetOpacity = 0
}

function handleGlobalMouseMove(e: MouseEvent) {
  if (isInsideCanvas(e.clientX, e.clientY)) {
    const canvas = canvasRef.value!
    const rect = canvas.getBoundingClientRect()
    handleHover(e.clientX - rect.left, e.clientY - rect.top, 0.6)
  } else if (hoveredSquare) {
    handleCanvasMouseLeave()
  }
}

function createSpecialBlock() {
  const canvas = canvasRef.value
  if (!canvas) return
  const dpr = window.devicePixelRatio || 1
  const numSquaresX = Math.ceil(canvas.width / dpr / options.squareSize)
  const numSquaresY = Math.ceil(canvas.height / dpr / options.squareSize)

  let newX: number, newY: number
  do {
    newX = 1 + Math.floor(Math.random() * (numSquaresX - 2))
    newY = 1 + Math.floor(Math.random() * (numSquaresY - 2))
  } while (snakeBody.some((seg) => seg.x === newX && seg.y === newY))

  specialBlock = { x: newX, y: newY, color: options.specialBlockColor }
}

function handleHover(x: number, y: number, opacity: number) {
  const startX = Math.floor(gridOffset.x / options.squareSize) * options.squareSize
  const startY = Math.floor(gridOffset.y / options.squareSize) * options.squareSize
  const gridX = Math.floor((x + gridOffset.x - startX) / options.squareSize)
  const gridY = Math.floor((y + gridOffset.y - startY) / options.squareSize)

  if (hoveredSquare?.x !== gridX || hoveredSquare?.y !== gridY) {
    if (hoveredSquare) {
      snakeBody.unshift({ x: hoveredSquare.x, y: hoveredSquare.y })
      if (!shouldGrow && snakeBody.length > 0) snakeBody.pop()
      shouldGrow = false
    }

    hoveredSquare = { x: gridX, y: gridY }
    targetOpacity = opacity

    if (specialBlock && gridX === specialBlock.x && gridY === specialBlock.y) {
      shouldGrow = true
      createSpecialBlock()
      if (options.vibrationEnabled && navigator.vibrate) {
        navigator.vibrate(100)
      }
    }
  }
}

function drawGrid() {
  const canvas = canvasRef.value
  if (!canvas || !ctx) return

  const dpr = window.devicePixelRatio || 1
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  const startX = Math.floor(gridOffset.x / options.squareSize) * options.squareSize
  const startY = Math.floor(gridOffset.y / options.squareSize) * options.squareSize

  ctx.lineWidth = isPhone ? 1.0 : 0.5

  // Draw snake body
  snakeBody.forEach((segment, index) => {
    const sx = Math.round(segment.x * options.squareSize + startX - (gridOffset.x % options.squareSize))
    const sy = Math.round(segment.y * options.squareSize + startY - (gridOffset.y % options.squareSize))

    ctx.shadowColor = options.hoverShadowColor
    ctx.shadowBlur = 15

    if (index === 0) {
      ctx.fillStyle = options.snakeHeadColor
    } else {
      const factor = Math.pow(options.snakeColorDecay, index)
      const headMatch = options.snakeHeadColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([.\d]+))?\)/)
      const tailMatch = options.snakeTailColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([.\d]+))?\)/)

      if (headMatch && tailMatch) {
        const hR = +headMatch[1], hG = +headMatch[2], hB = +headMatch[3], hA = headMatch[4] ? +headMatch[4] : 1
        const tR = +tailMatch[1], tG = +tailMatch[2], tB = +tailMatch[3], tA = tailMatch[4] ? +tailMatch[4] : 1
        const p = 1 - factor
        ctx.fillStyle = `rgba(${Math.round(hR + (tR - hR) * p)}, ${Math.round(hG + (tG - hG) * p)}, ${Math.round(hB + (tB - hB) * p)}, ${hA + (tA - hA) * p})`
      } else {
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.2, factor)})`
      }
    }

    ctx.fillRect(sx, sy, options.squareSize, options.squareSize)
    ctx.shadowColor = 'transparent'
    ctx.shadowBlur = 0
  })

  // Draw grid cells + special block + hovered square
  for (let x = startX; x < canvas.width + options.squareSize; x += options.squareSize) {
    for (let y = startY; y < canvas.height + options.squareSize; y += options.squareSize) {
      const cx = Math.round(x - (gridOffset.x % options.squareSize))
      const cy = Math.round(y - (gridOffset.y % options.squareSize))
      const gx = Math.floor((x - startX) / options.squareSize)
      const gy = Math.floor((y - startY) / options.squareSize)

      if (specialBlock && gx === specialBlock.x && gy === specialBlock.y) {
        ctx.shadowColor = 'rgba(255, 255, 255, 0.5)'
        ctx.shadowBlur = 20
        ctx.fillStyle = specialBlock.color
        ctx.fillRect(cx, cy, options.squareSize, options.squareSize)
        ctx.shadowColor = 'transparent'
        ctx.shadowBlur = 0
      }

      if (hoveredSquare && gx === hoveredSquare.x && gy === hoveredSquare.y) {
        ctx.shadowColor = options.hoverShadowColor
        ctx.shadowBlur = 15
        ctx.fillStyle = options.hoverFillColor.replace('0.6', currentOpacity.toString())
        ctx.fillRect(cx, cy, options.squareSize, options.squareSize)
        ctx.shadowColor = 'transparent'
        ctx.shadowBlur = 0
      }

      ctx.strokeStyle = options.borderColor
      ctx.strokeRect(cx, cy, options.squareSize, options.squareSize)
    }
  }

  // Vignette effect
  const gradient = ctx.createRadialGradient(
    canvas.width / dpr / 2, canvas.height / dpr / 2, 0,
    canvas.width / dpr / 2, canvas.height / dpr / 2,
    Math.sqrt(Math.pow(canvas.width / dpr, 2) + Math.pow(canvas.height / dpr, 2)) / 2
  )
  gradient.addColorStop(0, 'rgba(6, 6, 6, 0)')
  gradient.addColorStop(1, '#060606')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr)
}

function updateAnimation(timestamp: number) {
  const canvas = canvasRef.value
  if (!canvas) return

  if (!lastTimestamp) lastTimestamp = timestamp
  const dt = timestamp - lastTimestamp
  lastTimestamp = timestamp

  // Opacity transition
  if (currentOpacity !== targetOpacity) {
    const p = Math.min(dt / options.transitionDuration, 1)
    currentOpacity += (targetOpacity - currentOpacity) * p
  }

  // Trail decay
  for (const [key, sq] of trailSquares) {
    sq.opacity -= dt / options.trailDuration
    if (sq.opacity <= 0) trailSquares.delete(key)
  }

  const dpr = window.devicePixelRatio || 1
  const speed = Math.max(isPhone ? options.speed * 0.8 : options.speed, 0)
  const move = isPhone ? Math.round(speed * 100) / 100 : speed

  switch (options.direction) {
    case 'right':
      gridOffset.x = (gridOffset.x - move + options.squareSize) % options.squareSize; break
    case 'left':
      gridOffset.x = (gridOffset.x + move + options.squareSize) % options.squareSize; break
    case 'up':
      gridOffset.y = (gridOffset.y + move + options.squareSize) % options.squareSize; break
    case 'down':
      gridOffset.y = (gridOffset.y - move + options.squareSize) % options.squareSize; break
    case 'diagonal':
      gridOffset.x = (gridOffset.x - move + options.squareSize) % options.squareSize
      gridOffset.y = (gridOffset.y - move + options.squareSize) % options.squareSize; break
  }

  // Check if special block moved off-screen
  if (specialBlock) {
    const sx = Math.floor(gridOffset.x / options.squareSize) * options.squareSize
    const sy = Math.floor(gridOffset.y / options.squareSize) * options.squareSize
    const fx = Math.round(specialBlock.x * options.squareSize + sx - (gridOffset.x % options.squareSize))
    const fy = Math.round(specialBlock.y * options.squareSize + sy - (gridOffset.y % options.squareSize))

    if (fx < -options.squareSize || fx > canvas.width / dpr || fy < -options.squareSize || fy > canvas.height / dpr) {
      createSpecialBlock()
    }
  }

  drawGrid()
  animationFrame = requestAnimationFrame(updateAnimation)
}

// ─── 文档级事件处理（Canvas pointer-events: none 后仍可追踪鼠标/触摸） ───

function handleGlobalTouchStart(e: TouchEvent) {
  if (!isPhone) return
  const canvas = canvasRef.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  const touch = e.touches[0]
  const x = touch.clientX - rect.left
  const y = touch.clientY - rect.top
  if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
    e.preventDefault()
    handleHover(x, y, 0.8 * options.touchSensitivity)
    if (options.vibrationEnabled && navigator.vibrate) navigator.vibrate(10)
  }
}

function handleGlobalTouchMove(e: TouchEvent) {
  if (!isPhone || e.touches.length !== 1) return
  const canvas = canvasRef.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  const touch = e.touches[0]
  const x = touch.clientX - rect.left
  const y = touch.clientY - rect.top
  if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
    e.preventDefault()
    handleHover(x, y, 0.8 * options.touchSensitivity)
  }
}

function handleGlobalTouchEnd(e: TouchEvent) {
  if (!isPhone) return
  e.preventDefault()
  if (hoveredSquare) {
    const startX = Math.floor(gridOffset.x / options.squareSize) * options.squareSize
    const startY = Math.floor(gridOffset.y / options.squareSize) * options.squareSize
    trailSquares.set(`${hoveredSquare.x},${hoveredSquare.y}`, {
      x: hoveredSquare.x * options.squareSize + startX,
      y: hoveredSquare.y * options.squareSize + startY,
      opacity: 0.8,
    })
  }
  targetOpacity = 0.4
}

function handleGlobalTouchCancel(e: TouchEvent) {
  if (!isPhone) return
  e.preventDefault()
}

function handleVisibility() {
  const canvas = canvasRef.value
  if (!canvas) return
  if (document[hiddenProperty as keyof Document]) {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame)
      animationFrame = null
    }
  } else {
    if (!animationFrame) {
      lastTimestamp = 0
      animationFrame = requestAnimationFrame(updateAnimation)
    }
  }
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  ctx = canvas.getContext('2d')

  resizeCanvas()
  createSpecialBlock()

  // 使用 document 级事件，Canvas 的 pointer-events: none 不影响追踪
  document.addEventListener('mousemove', handleGlobalMouseMove)

  if (isPhone) {
    document.addEventListener('touchstart', handleGlobalTouchStart, { passive: false })
    document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false })
    document.addEventListener('touchend', handleGlobalTouchEnd, { passive: false })
    document.addEventListener('touchcancel', handleGlobalTouchCancel, { passive: false })
  }

  window.addEventListener('resize', resizeCanvas)
  document.addEventListener(visibilityChangeEvent, handleVisibility)

  animationFrame = requestAnimationFrame(updateAnimation)
})

onBeforeUnmount(() => {
  if (animationFrame) cancelAnimationFrame(animationFrame)
  document.removeEventListener('mousemove', handleGlobalMouseMove)
  if (isPhone) {
    document.removeEventListener('touchstart', handleGlobalTouchStart)
    document.removeEventListener('touchmove', handleGlobalTouchMove)
    document.removeEventListener('touchend', handleGlobalTouchEnd)
    document.removeEventListener('touchcancel', handleGlobalTouchCancel)
  }
  window.removeEventListener('resize', resizeCanvas)
  document.removeEventListener(visibilityChangeEvent, handleVisibility)
})
</script>

<template>
  <canvas ref="canvasRef" class="grid-background" aria-hidden="true" />
</template>

<style scoped>
.grid-background {
  position: absolute;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  display: block;
}
</style>
