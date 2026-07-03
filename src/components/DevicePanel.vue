<script setup lang="ts">
import { computed } from 'vue'
import { Plug, Cable, Network, Globe, Wrench, Terminal, Activity, PlugZap, Gauge, RefreshCw } from '@lucide/vue'
import type { DeviceConfig } from '@/composables/useDeviceEngine'

const props = defineProps<{
  device: DeviceConfig | null
  deviceType: string | null
}>()

const emit = defineEmits<{
  operate: [operation: string, value?: string]
}>()

const operations = computed(() => {
  if (!props.device) return []
  const ops: { id: string; label: string; type: 'toggle' | 'input' | 'view'; category: 'physical' | 'network' | 'system'; icon: any; action: string }[] = []
  const d = props.device

  if (d.type === 'computer') {
    const plugged = d.cableStatus === 'unplugged'
    ops.push({ id: 'plug-cable', label: plugged ? '插入网线' : '拔出网线', type: 'toggle', category: 'physical', icon: Plug, action: 'plug-cable' })
    ops.push({ id: 'replace-cable', label: '更换网线', type: 'toggle', category: 'physical', icon: Cable, action: 'replace-cable' })
    ops.push({ id: 'change-ip', label: `修改 IP (${d.ipAddress || '未设置'})`, type: 'input', category: 'network', icon: Network, action: 'change-ip' })
    ops.push({ id: 'change-subnet', label: `修改子网掩码 (${d.subnetMask || '未设置'})`, type: 'input', category: 'network', icon: Gauge, action: 'change-subnet' })
    ops.push({ id: 'change-gateway', label: `修改网关 (${d.defaultGateway || '未设置'})`, type: 'input', category: 'network', icon: Globe, action: 'change-gateway' })
    ops.push({ id: 'change-dns', label: `修改 DNS (${d.dnsServer || '未设置'})`, type: 'input', category: 'network', icon: Activity, action: 'change-dns' })
  }

  if (d.type === 'switch') {
    ops.push({ id: 'enable-port', label: '启用端口', type: 'input', category: 'physical', icon: PlugZap, action: 'enable-port' })
    ops.push({ id: 'disable-port', label: '禁用端口', type: 'input', category: 'physical', icon: Wrench, action: 'disable-port' })
  }

  if (d.type === 'router' || d.type === 'firewall') {
    ops.push({ id: 'restart-device', label: '重启设备', type: 'toggle', category: 'system', icon: RefreshCw, action: 'restart-device' })
  }

  if (d.type === 'server') {
    ops.push({ id: 'restart-device', label: '重启服务', type: 'toggle', category: 'system', icon: RefreshCw, action: 'restart-device' })
  }

  return ops
})

function handleOperation(op: typeof operations.value[0]) {
  if (op.type === 'toggle') {
    emit('operate', op.action)
  } else if (op.type === 'input') {
    const value = prompt(`请输入新值:`)
    if (value) emit('operate', op.action, value)
  } else if (op.type === 'view') {
    emit('operate', op.action)
  }
}

function getCategoryLabel(cat: string): string {
  return { physical: '物理操作', network: '网络配置', system: '系统操作' }[cat] || cat
}
</script>

<template>
  <div class="device-panel">
    <div v-if="!device" class="empty-state">
      <p>点击拓扑图中的设备查看操作选项</p>
    </div>
    <template v-else>
      <div v-for="cat in ['physical', 'network', 'system']" :key="cat" class="op-group">
        <div class="op-group-title">{{ getCategoryLabel(cat) }}</div>
        <div class="op-list">
          <button
            v-for="op in operations.filter(o => o.category === cat)"
            :key="op.id"
            class="op-btn"
            @click="handleOperation(op)"
          >
            <component :is="op.icon" :size="16" />
            <span class="op-label">{{ op.label }}</span>
            <span class="op-type-badge">{{ op.type === 'toggle' ? '开关' : op.type === 'input' ? '输入' : '查看' }}</span>
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.device-panel { padding: 4px 0; display: flex; flex-direction: column; gap: 16px; }
.empty-state { padding: 40px 16px; text-align: center; color: #64748b; font-size: 13px; }
.op-group { display: flex; flex-direction: column; gap: 8px; }
.op-group-title { font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; padding: 0 4px; }
.op-list { display: flex; flex-direction: column; gap: 6px; }
.op-btn {
  display: flex; align-items: center; gap: 10px; padding: 10px 12px;
  background: rgba(30,58,95,0.2); border: 1px solid #1e3a5f; border-radius: 8px;
  color: #c8d6e5; font-size: 13px; cursor: pointer; transition: all 0.2s ease; text-align: left; width: 100%;
}
.op-btn:hover { background: rgba(30,58,95,0.4); border-color: #00d4ff; color: #e6f1ff; }
.op-label { flex: 1; }
.op-type-badge { font-size: 10px; padding: 2px 6px; border-radius: 4px; background: rgba(0,212,255,0.1); color: #00d4ff; white-space: nowrap; }
</style>
