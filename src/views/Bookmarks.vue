<script setup lang="ts">
import { useRouter } from 'vue-router'
import { bookmarks } from '@/data/bookmarks.js'

const router = useRouter()

function openDetail(bookmark: { id: number }) {
  router.push(`/bookmarks/${bookmark.id}`)
}
</script>

<template>
  <div class="min-h-[100dvh] bg-[#0d1117] pt-24 pb-20">
    <div class="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-20">
      <div class="animate-fade-up">
        <span class="inline-flex items-center gap-2 text-xs font-medium text-[#6e7681] tracking-[0.15em] uppercase">
          <span class="w-6 h-px bg-[#30363d]" />
          收藏夹
        </span>
        <h1 class="mt-4 text-4xl font-bold tracking-tight text-[#e6edf3] sm:text-5xl">
          我的收藏
        </h1>
        <p class="mt-2 text-base text-[#8b949e]">{{ bookmarks.length }} 个分类，共 {{ bookmarks.reduce((sum, c) => sum + c.items.length, 0) }} 个网站</p>
      </div>

      <div class="mt-12 space-y-16">
        <section v-for="cat in bookmarks" :key="cat.name" class="animate-fade-up">
          <h2 class="text-lg font-bold tracking-tight text-[#34d399]">{{ cat.name }}</h2>
          <div class="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div
              v-for="item in cat.items"
              :key="item.id"
              class="block rounded-xl border border-[#30363d] bg-[#161b22] p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.4)] tilt-card cursor-pointer"
              @click="openDetail(item)"
            >
              <div class="flex items-center gap-3 mb-2">
                <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-[#059669]/20 to-[#059669]/10 text-[#34d399] flex items-center justify-center text-sm font-bold truncate">{{ item.name.slice(0, 2) }}</div>
              </div>
              <h4 class="text-sm font-semibold text-[#e6edf3] truncate">{{ item.name }}</h4>
              <p class="mt-1 text-xs text-[#6e7681] truncate line-clamp-2">{{ item.desc }}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
