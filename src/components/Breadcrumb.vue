<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface BreadcrumbItem {
  label: string
  path?: string
  isCurrent: boolean
}

const route = useRoute()
const router = useRouter()

const routeMap: Record<string, { label: string; parent?: string; parentPath?: string }> = {
  home: { label: '首页' },
  about: { label: '关于', parent: 'home', parentPath: '/' },
  projects: { label: '作品集', parent: 'home', parentPath: '/' },
  'project-detail': { label: '项目详情', parent: 'projects', parentPath: '/projects' },
  archive: { label: '归档', parent: 'home', parentPath: '/' },
  article: { label: '文章', parent: 'archive', parentPath: '/archive' },
  bookmarks: { label: '书签', parent: 'home', parentPath: '/' },
  'bookmark-detail': { label: '书签详情', parent: 'bookmarks', parentPath: '/bookmarks' },
  'network-game': { label: '网络运维游戏', parent: 'home', parentPath: '/' },
  admin: { label: '管理后台', parent: 'home', parentPath: '/' },
  writing: { label: '创作', parent: 'home', parentPath: '/' },
}

const breadcrumbs = computed<BreadcrumbItem[]>(() => {
  const routeName = route.name as string
  if (!routeName || routeName === 'home') return []

  const current = routeMap[routeName]
  if (!current) return []

  const items: BreadcrumbItem[] = []

  items.push({
    label: '首页',
    path: '/',
    isCurrent: false,
  })

  if (current.parent && current.parent !== 'home') {
    const parent = routeMap[current.parent]
    if (parent && current.parentPath) {
      items.push({
        label: parent.label,
        path: current.parentPath,
        isCurrent: false,
      })
    }
  }

  items.push({
    label: current.label,
    isCurrent: true,
  })

  return items
})

function handleClick(path?: string) {
  if (path) {
    router.push(path)
  }
}
</script>

<template>
  <nav v-if="breadcrumbs.length > 0" class="breadcrumb">
    <div class="breadcrumb-inner">
      <span
        v-for="(item, index) in breadcrumbs"
        :key="index"
        class="breadcrumb-item"
        :class="{ 'breadcrumb-current': item.isCurrent, 'breadcrumb-link': !item.isCurrent }"
        @click="handleClick(item.path)"
      >
        {{ item.label }}
      </span>
    </div>
  </nav>
</template>

<style scoped>
.breadcrumb {
  background: #fffaef;
  border-bottom: 2px solid #161310;
  font-family: 'Courier New', ui-monospace, monospace;
  font-size: 12px;
}

.breadcrumb-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 36px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.breadcrumb-item {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
}

.breadcrumb-item + .breadcrumb-item::before {
  content: '/';
  margin-right: 8px;
  color: #161310;
  font-weight: normal;
}

.breadcrumb-link {
  cursor: pointer;
  color: #161310;
  border: 1px solid transparent;
  transition: all 0.15s ease;
}

.breadcrumb-link:hover {
  background: #f2ead6;
  border-color: #161310;
}

.breadcrumb-current {
  color: #2e5dd6;
  font-weight: bold;
  cursor: default;
}
</style>
