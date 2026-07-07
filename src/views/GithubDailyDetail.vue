<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const id = computed(() => route.params.id)

function goBack() {
  router.push('/github-daily')
}
</script>

<template>
  <div class="min-h-[100dvh] bg-[#f5f0e8] pt-24 pb-20">
    <div class="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16">
      <button
        class="font-mono text-sm tracking-wider uppercase px-4 py-2 border-2 border-[#161310] bg-[#fffaef] text-[#161310] shadow-[4px_4px_0_0_#161310] transition-all duration-200 hover:-translate-y-0.5 hover:translate-x-0.5 mb-8"
        @click="goBack"
      >
        ← 返回列表
      </button>

      <div class="py-20 flex flex-col items-center justify-center text-center">
        <div class="w-24 h-24 bg-[#fffaef] border-2 border-[#161310] shadow-[8px_8px_0_0_#161310] flex items-center justify-center font-mono text-4xl mb-6">
          🚧
        </div>
        <h1 class="font-mono text-3xl font-bold text-[#161310]">项目详情页</h1>
        <p class="font-mono text-sm text-[#3a332a] mt-2">
          项目 ID: {{ id }}
        </p>
        <p class="font-mono text-xs text-[#3a332a]/70 mt-4">
          该页面正在建设中，敬请期待...
        </p>
      </div>
    </div>
  </div>
</template>
