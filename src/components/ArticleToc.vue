<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'

interface TocItem {
  id: string
  text: string
  level: 2 | 3
  element: HTMLElement
}

const props = withDefaults(defineProps<{
  contentSelector?: string
}>(), {
  contentSelector: '.prose-custom'
})

const tocItems = ref<TocItem[]>([])
const activeId = ref<string>('')
const isVisible = ref(false)

let observer: IntersectionObserver | null = null
let scrollTimeout: number | null = null

function generateId(text: string, index: number): string {
  return `heading-${index}-${text.replace(/\s+/g, '-').toLowerCase().replace(/[^\w-]/g, '')}`
}

function extractHeadings() {
  const container = document.querySelector(props.contentSelector)
  if (!container) return

  const headings = container.querySelectorAll('h2, h3')
  const items: TocItem[] = []

  headings.forEach((heading, index) => {
    const element = heading as HTMLElement
    const text = element.textContent?.trim() || ''
    const level = element.tagName === 'H2' ? 2 : 3
    const id = generateId(text, index)

    if (!element.id) {
      element.id = id
    }

    items.push({
      id: element.id,
      text,
      level: level as 2 | 3,
      element
    })
  })

  tocItems.value = items
  isVisible.value = items.length > 0
}

function setupObserver() {
  if (observer) {
    observer.disconnect()
  }

  observer = new IntersectionObserver(
    (entries) => {
      const visibleEntries = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => {
          const aIndex = tocItems.value.findIndex(item => item.id === a.target.id)
          const bIndex = tocItems.value.findIndex(item => item.id === b.target.id)
          return aIndex - bIndex
        })

      if (visibleEntries.length > 0) {
        activeId.value = visibleEntries[0].target.id
      }
    },
    {
      rootMargin: '-80px 0px -60% 0px',
      threshold: 0
    }
  )

  tocItems.value.forEach(item => {
    if (item.element) {
      observer?.observe(item.element)
    }
  })
}

function scrollToHeading(id: string) {
  const element = document.getElementById(id)
  if (!element) return

  const offsetTop = element.getBoundingClientRect().top + window.scrollY - 80
  window.scrollTo({
    top: offsetTop,
    behavior: 'smooth'
  })
}

function handleScroll() {
  if (scrollTimeout) {
    cancelAnimationFrame(scrollTimeout)
  }

  scrollTimeout = requestAnimationFrame(() => {
    if (tocItems.value.length === 0) return

    const scrollPosition = window.scrollY + 100

    let currentId = tocItems.value[0].id

    for (let i = tocItems.value.length - 1; i >= 0; i--) {
      const item = tocItems.value[i]
      if (item.element.offsetTop <= scrollPosition) {
        currentId = item.id
        break
      }
    }

    activeId.value = currentId
  })
}

onMounted(async () => {
  await nextTick()
  extractHeadings()
  await nextTick()
  setupObserver()
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
  if (scrollTimeout) {
    cancelAnimationFrame(scrollTimeout)
  }
  window.removeEventListener('scroll', handleScroll)
})

watch(() => props.contentSelector, () => {
  extractHeadings()
  setupObserver()
})
</script>

<template>
  <div v-if="isVisible" class="article-toc">
    <div class="toc-header">目录</div>
    <div class="toc-list">
      <div
        v-for="item in tocItems"
        :key="item.id"
        class="toc-item"
        :class="{
          'toc-item--h3': item.level === 3,
          'toc-item--active': activeId === item.id
        }"
        @click="scrollToHeading(item.id)"
        :title="item.text"
      >
        {{ item.text }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.article-toc {
  position: fixed;
  left: 24px;
  top: 140px;
  width: 220px;
  max-height: calc(100vh - 180px);
  background: #fffaef;
  border: 2px solid #161310;
  box-shadow: 4px 4px 0 0 #161310;
  display: none;
  flex-direction: column;
  overflow: hidden;
  z-index: 40;
}

@media (min-width: 1024px) {
  .article-toc {
    display: flex;
  }
}

.toc-header {
  font-family: "Pixelify Sans", ui-monospace, monospace;
  font-size: 14px;
  font-weight: 700;
  background: #f2ead6;
  border-bottom: 2px solid #161310;
  padding: 12px 16px;
  color: #161310;
  flex-shrink: 0;
}

.toc-list {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.toc-list::-webkit-scrollbar {
  width: 6px;
}

.toc-list::-webkit-scrollbar-track {
  background: #f2ead6;
}

.toc-list::-webkit-scrollbar-thumb {
  background: #161310;
  border: none;
}

.toc-list::-webkit-scrollbar-thumb:hover {
  background: #3a332a;
}

.toc-item {
  font-family: ui-monospace, monospace;
  font-size: 12px;
  color: #3a332a;
  padding: 8px 16px;
  border-left: 2px solid transparent;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.15s ease;
}

.toc-item:hover {
  background: #f2ead6;
  color: #161310;
}

.toc-item--active {
  color: #2e5dd6;
  border-left-color: #2e5dd6;
  background: #e8eef8;
  font-weight: 700;
}

.toc-item--h3 {
  padding-left: 32px;
  font-size: 11px;
}
</style>
