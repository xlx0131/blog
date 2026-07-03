<script setup lang="ts">
import { computed } from 'vue'
import { CheckCircle2, Clock, RefreshCw } from '@lucide/vue'
import type { VerifyCondition } from '@/composables/useDeviceEngine'

const props = defineProps<{
  conditions: VerifyCondition[]
  verifiedItems: string[]
  isComplete: boolean
}>()

const progress = computed(() => {
  if (props.conditions.length === 0) return 0
  return Math.round((props.verifiedItems.length / props.conditions.length) * 100)
})

const allDone = computed(() => props.verifiedItems.length > 0 && props.verifiedItems.length >= props.conditions.length)
</script>

<template>
  <div class="verify-panel">
    <div class="verify-header">
      <RefreshCw :size="16" />
      <span>验证修复效果</span>
      <span class="verify-progress">{{ verifiedItems.length }}/{{ conditions.length }}</span>
    </div>

    <div class="verify-bar">
      <div class="verify-bar-fill" :style="{ width: progress + '%' }"></div>
    </div>

    <div class="verify-list">
      <div
        v-for="(cond, i) in conditions"
        :key="i"
        class="verify-item"
        :class="{ done: verifiedItems.includes(cond.type + ':' + cond.target) }"
      >
        <div class="verify-icon">
          <CheckCircle2 v-if="verifiedItems.includes(cond.type + ':' + cond.target)" :size="18" class="icon-done" />
          <Clock v-else :size="18" class="icon-pending" />
        </div>
        <div class="verify-info">
          <div class="verify-label">{{ cond.label }}</div>
          <div class="verify-hint">在终端执行：{{ cond.type }} {{ cond.target }}</div>
        </div>
      </div>
    </div>

    <div v-if="allDone" class="verify-success">
      <CheckCircle2 :size="16" />
      <span>所有验证项已通过！即将完成关卡。</span>
    </div>
  </div>
</template>

<style scoped>
.verify-panel { padding: 4px 0; display: flex; flex-direction: column; gap: 12px; }
.verify-header { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: #00d4ff; }
.verify-progress { margin-left: auto; font-size: 12px; color: #64748b; font-family: 'JetBrains Mono', monospace; }
.verify-bar { height: 4px; background: rgba(30,58,95,0.4); border-radius: 2px; overflow: hidden; }
.verify-bar-fill { height: 100%; background: linear-gradient(90deg, #00d4ff, #00ff88); border-radius: 2px; transition: width 0.5s ease; }
.verify-list { display: flex; flex-direction: column; gap: 8px; }
.verify-item { display: flex; gap: 10px; padding: 10px 12px; background: rgba(30,58,95,0.2); border: 1px solid #1e3a5f; border-radius: 8px; transition: all 0.3s ease; }
.verify-item.done { border-color: rgba(0,255,136,0.3); background: rgba(0,255,136,0.05); }
.icon-done { color: #00ff88; }
.icon-pending { color: #64748b; }
.verify-info { flex: 1; }
.verify-label { font-size: 13px; font-weight: 500; color: #e6f1ff; }
.verify-hint { font-size: 11px; color: #64748b; margin-top: 2px; font-family: 'JetBrains Mono', monospace; }
.verify-success { display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: rgba(0,255,136,0.1); border: 1px solid rgba(0,255,136,0.3); border-radius: 8px; color: #00ff88; font-size: 13px; font-weight: 500; }
</style>
