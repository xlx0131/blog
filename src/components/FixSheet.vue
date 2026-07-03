<script setup lang="ts">
import { ref } from 'vue'
import { Wrench, CheckCircle2, ArrowRight } from '@lucide/vue'
import type { FixAction } from '@/composables/useDeviceEngine'

const props = defineProps<{
  show: boolean
  fixActions: FixAction[]
  faultType: string
  faultDevice: string
}>()

const emit = defineEmits<{
  select: [action: FixAction]
  close: []
}>()

const selectedIndex = ref<number | null>(null)

function selectAction(index: number) {
  selectedIndex.value = index
}

function confirmFix() {
  if (selectedIndex.value !== null) {
    emit('select', props.fixActions[selectedIndex.value])
  }
}

function getActionDetail(action: FixAction): string {
  const map: Record<string, string> = {
    'plug-cable': '● 在「设备操作」面板点击"插入网线"',
    'change-dns': `● 在「设备操作」面板将 DNS 改为 ${action.to || '新地址'}`,
    'change-ip': '● 在「设备操作」面板修改电脑 IP 地址',
    'enable-port': '● 在「设备操作」面板点击"启用端口"',
    'change-vlan': '● 在「设备操作」面板修改 VLAN 配置',
    'restart-device': '● 在「设备操作」面板点击"重启设备"',
    'replace-cable': '● 在「设备操作」面板点击"更换网线"',
    'change-subnet': '● 在「设备操作」面板修改子网掩码',
    'change-gateway': '● 在「设备操作」面板修改默认网关',
    'disable-port': '● 在「设备操作」面板点击"禁用端口"',
  }
  return map[action.type] || '● 在「设备操作」面板执行对应操作'
}
</script>

<template>
  <Teleport to="body">
    <Transition name="sheet">
      <div v-if="show" class="fix-overlay" @click.self="emit('close')">
        <div class="fix-sheet">
          <div class="fix-header">
            <Wrench :size="20" />
            <span>修复操作</span>
          </div>
          <p class="fix-desc">已定位故障原因，请选择修复方案：</p>

          <div class="fix-options">
            <div
              v-for="(action, i) in fixActions"
              :key="i"
              class="fix-option"
              :class="{ selected: selectedIndex === i }"
              @click="selectAction(i)"
            >
              <div class="fix-option-header">
                <span class="fix-option-label">方案 {{ i + 1 }}: {{ action.label }}</span>
                <CheckCircle2 v-if="selectedIndex === i" :size="16" class="check-icon" />
              </div>
              <div class="fix-option-detail">{{ getActionDetail(action) }}</div>
            </div>
          </div>

          <div class="fix-tip">
            <ArrowRight :size="14" />
            <span>选择方案后，到右侧「设备操作」面板执行对应操作</span>
          </div>

          <div class="fix-actions">
            <button class="fix-btn cancel" @click="emit('close')">取消</button>
            <button class="fix-btn confirm" :disabled="selectedIndex === null" @click="confirmFix">确认并开始修复</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fix-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.6);
  backdrop-filter: blur(4px); display: flex; align-items: center;
  justify-content: center; z-index: 1000;
}
.fix-sheet {
  width: 480px; max-width: 90vw; max-height: 80vh; overflow-y: auto;
  background: #0f1629; border: 1px solid rgba(0,212,255,0.3);
  border-radius: 16px; padding: 28px; box-shadow: 0 0 40px rgba(0,212,255,0.1);
}
.fix-header { display: flex; align-items: center; gap: 10px; font-size: 18px; font-weight: 700; color: #00d4ff; margin-bottom: 8px; }
.fix-desc { font-size: 14px; color: #8892b0; margin-bottom: 20px; }
.fix-options { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }
.fix-option {
  padding: 14px 16px; background: rgba(30,58,95,0.25); border: 1px solid #1e3a5f;
  border-radius: 10px; cursor: pointer; transition: all 0.2s ease;
}
.fix-option:hover { border-color: rgba(0,212,255,0.4); background: rgba(30,58,95,0.35); }
.fix-option.selected { border-color: #00d4ff; background: rgba(0,212,255,0.08); box-shadow: 0 0 15px rgba(0,212,255,0.1); }
.fix-option-header { display: flex; justify-content: space-between; align-items: center; }
.fix-option-label { font-size: 14px; font-weight: 600; color: #e6f1ff; }
.check-icon { color: #00ff88; }
.fix-option-detail { font-size: 12px; color: #64748b; margin-top: 6px; line-height: 1.5; }
.fix-tip { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #ffaa00; margin-bottom: 20px; padding: 10px 14px; background: rgba(255,170,0,0.08); border-radius: 8px; }
.fix-actions { display: flex; gap: 12px; justify-content: flex-end; }
.fix-btn { padding: 10px 24px; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; border: none; transition: all 0.2s; }
.fix-btn.cancel { background: rgba(30,58,95,0.4); color: #8892b0; }
.fix-btn.cancel:hover { background: rgba(30,58,95,0.6); }
.fix-btn.confirm { background: rgba(0,212,255,0.15); color: #00d4ff; border: 1px solid rgba(0,212,255,0.3); }
.fix-btn.confirm:hover:not(:disabled) { background: rgba(0,212,255,0.25); }
.fix-btn.confirm:disabled { opacity: 0.4; cursor: not-allowed; }

.sheet-enter-active, .sheet-leave-active { transition: all 0.3s ease; }
.sheet-enter-from, .sheet-leave-to { opacity: 0; transform: scale(0.95); }
</style>
