# 运维模拟平台 — 完整设备模拟沙盒实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将现有"诊断即修复"模式升级为排查→修复→验证三阶段闭环，构建可交互的设备模拟环境

**Architecture:** 新增设备状态引擎(useDeviceEngine.ts)管理每个设备的独立状态，新增三阶段状态机(useGameFlow.ts)管理游戏流程，新增 FixSheet/DevicePanel/VerificationPanel 三个组件，增强关卡数据定义

**Tech Stack:** Vue 3 + TypeScript + Vite

---

### Task 1: 创建设备状态引擎

**Files:**
- Create: `src/composables/useDeviceEngine.ts`

- [ ] **Step 1: 定义 TypeScript 类型**

创建 `useDeviceEngine.ts`，在文件开头定义设备状态相关的类型：

```typescript
export interface DeviceConfig {
  id: string
  label: string
  type: 'computer' | 'switch' | 'router' | 'server' | 'firewall'
  ipAddress?: string
  subnetMask?: string
  defaultGateway?: string
  dnsServer?: string
  cableStatus?: 'connected' | 'unplugged' | 'faulty'
  portStatus?: Record<string, 'up' | 'down' | 'disabled'>
  isOnline?: boolean
}

export interface FixAction {
  type: 'plug-cable' | 'change-dns' | 'change-ip' | 'change-subnet' | 'enable-port' | 'disable-port' | 'change-vlan' | 'restart-device' | 'change-gateway' | 'replace-cable'
  device: string
  target?: string
  from?: string
  to?: string
  label: string
}

export interface VerifyCondition {
  type: 'ping' | 'nslookup' | 'web-access'
  target: string
  expect: 'success' | 'resolve' | 'connected'
  label: string
}

export interface DeviceOperation {
  id: string
  label: string
  type: 'toggle' | 'input' | 'view'
  category: 'physical' | 'network' | 'system'
  icon: string
  action: (deviceId: string) => { output: string; success: boolean }
}
```

- [ ] **Step 2: 创建 useDeviceEngine composable**

```typescript
import { ref, computed, reactive } from 'vue'
import type { DeviceConfig, FixAction, VerifyCondition, DeviceOperation } from './useDeviceEngine'

export function useDeviceEngine() {
  const deviceStates = ref<Record<string, DeviceConfig>>({})

  function initDevices(devices: DeviceConfig[]) {
    const map: Record<string, DeviceConfig> = {}
    devices.forEach(d => {
      const defaults: DeviceConfig = {
        ...d,
        cableStatus: d.cableStatus || 'connected',
        portStatus: d.portStatus || {},
        isOnline: d.isOnline ?? true,
        ipAddress: d.ipAddress || '',
        subnetMask: d.subnetMask || '255.255.255.0',
        defaultGateway: d.defaultGateway || '',
        dnsServer: d.dnsServer || '',
      }
      map[d.id] = defaults
    })
    deviceStates.value = map
  }

  function getDevice(id: string): DeviceConfig | undefined {
    return deviceStates.value[id]
  }

  function updateDevice(id: string, partial: Partial<DeviceConfig>) {
    if (deviceStates.value[id]) {
      deviceStates.value[id] = { ...deviceStates.value[id], ...partial }
    }
  }

  function getDeviceByIp(ip: string): DeviceConfig | undefined {
    return Object.values(deviceStates.value).find(d => d.ipAddress === ip)
  }

  return {
    deviceStates,
    initDevices,
    getDevice,
    updateDevice,
    getDeviceByIp,
  }
}
```

- [ ] **Step 3: 实现命令执行函数**

在 `useDeviceEngine.ts` 中添加核心命令执行逻辑。命令接收当前设备上下文，读取/修改设备状态，返回输出文本：

```typescript
export function executeCommand(
  cmd: string,
  args: string,
  currentDeviceId: string | null,
  deviceStates: Record<string, DeviceConfig>,
): { output: string; success: boolean; type?: string } {
  const device = currentDeviceId ? deviceStates[currentDeviceId] : undefined

  // ping 命令
  if (cmd === 'ping' && args) {
    const targetDevice = Object.values(deviceStates).find(d => d.ipAddress === args || d.id === args)
    if (!targetDevice) {
      return { output: `正在 Ping ${args} ...\n请求超时 (100% 丢失)`, success: false, type: 'error' }
    }
    if (targetDevice.cableStatus !== 'connected' || !targetDevice.isOnline) {
      return { output: `正在 Ping ${targetDevice.ipAddress || args} ...\n请求超时 (100% 丢失)`, success: false, type: 'error' }
    }
    if (currentDeviceId) {
      const curDev = deviceStates[currentDeviceId]
      if (curDev?.cableStatus !== 'connected') {
        return { output: `正在 Ping ${targetDevice.ipAddress || args} ...\n请求超时 (100% 丢失)`, success: false, type: 'error' }
      }
    }
    return { output: `正在 Ping ${targetDevice.ipAddress || args} 具有 32 字节的数据:\n来自 ${targetDevice.ipAddress || args} 的回复: 字节=32 时间<1ms TTL=64`, success: true, type: 'success' }
  }

  // ipconfig 命令
  if (cmd === 'ipconfig') {
    if (!device) return { output: '未选择设备', success: false, type: 'error' }
    const cableStatus = device.cableStatus === 'unplugged' ? '媒体已断开' : (device.cableStatus === 'faulty' ? '网线故障' : '已连接')
    const ipInfo = device.cableStatus === 'connected' ? `   IPv4 地址: ${device.ipAddress || '未配置'}\n   子网掩码: ${device.subnetMask || '未配置'}\n   默认网关: ${device.defaultGateway || '未配置'}` : '   自动配置 IPv4: 169.254.x.x'
    return {
      output: `Windows IP 配置\n\n以太网适配器 本地连接:\n   媒体状态: ${cableStatus}\n${ipInfo}`,
      success: device.cableStatus === 'connected',
      type: device.cableStatus === 'connected' ? 'success' : 'warning',
    }
  }

  // nslookup 命令
  if (cmd === 'nslookup' && args) {
    const dnsDevice = Object.values(deviceStates).find(d => d.type === 'server' && d.id.includes('dns'))
    const dnsOnline = dnsDevice ? dnsDevice.isOnline : true
    if (!dnsOnline) {
      return { output: `DNS request timed out.\n*** ${Object.values(deviceStates).find(d => d.type === 'server')?.ipAddress || ''} 无响应`, success: false, type: 'error' }
    }
    // 检查当前设备的 DNS 配置
    if (device?.dnsServer === '错误的DNS地址' || device?.dnsServer === '0.0.0.0') {
      return { output: `DNS request timed out.\n*** ${args} 找不到主机`, success: false, type: 'error' }
    }
    return { output: `服务器: ${device?.dnsServer || '未知'}\nAddress: ${device?.dnsServer || '未知'}\n\n名称: ${args}\nAddress: 1.2.4.8`, success: true, type: 'success' }
  }

  // show interfaces 命令（交换机）
  if (cmd === 'show' && args?.includes('interfaces')) {
    if (!device || device.type !== 'switch') return { output: '此命令需要在交换机上执行', success: false, type: 'error' }
    const ports = device.portStatus || {}
    const portLines = Object.entries(ports).slice(0, 8).map(([port, status]) => {
      const statusText = status === 'up' ? 'up' : (status === 'down' ? 'down' : 'disabled')
      return `GigabitEthernet0/${port} is ${statusText}, line protocol is ${statusText}`
    }).join('\n')
    return { output: portLines || '没有端口信息', success: true }
  }

  // show vlan brief
  if (cmd === 'show' && args?.includes('vlan')) {
    return { output: 'VLAN Name                             Status    Ports\n---- -------------------------------- --------- -------------------------------\n1    default                          active    Gi0/1-8\n10   Sales                            active    Gi0/9-16\n20   R&D                              active    Gi0/17-24', success: true }
  }

  // telnet 命令 - 切换设备上下文
  if (cmd === 'telnet' && args) {
    const targetDevice = Object.values(deviceStates).find(d => d.label.includes(args) || d.id === args)
    if (targetDevice) {
      return { output: `正在连接 ${targetDevice.label} ...\n连接成功。`, success: true, type: 'success' }
    }
    return { output: `无法连接到 ${args}`, success: false, type: 'error' }
  }

  // 默认命令提示
  return { output: `'${cmd}' 不是内部或外部命令，也不是可运行的程序或批处理文件。`, success: false, type: 'error' }
}
```

- [ ] **Step 4: 实现设备操作函数**

```typescript
export function executeDeviceOperation(
  operation: string,
  deviceId: string,
  deviceStates: Record<string, DeviceConfig>,
  value?: string,
): { output: string; success: boolean } {
  const device = deviceStates[deviceId]
  if (!device) return { output: '设备不存在', success: false }

  switch (operation) {
    case 'plug-cable':
      deviceStates[deviceId] = { ...device, cableStatus: value === 'unplug' ? 'unplugged' : 'connected' }
      return { output: value === 'unplug' ? '网线已拔出' : '网线已插入', success: true }

    case 'replace-cable':
      deviceStates[deviceId] = { ...device, cableStatus: 'connected' }
      return { output: '网线已更换', success: true }

    case 'change-dns':
      if (value) {
        deviceStates[deviceId] = { ...device, dnsServer: value }
        return { output: `DNS 服务器已更改为 ${value}`, success: true }
      }
      return { output: '请输入 DNS 地址', success: false }

    case 'change-ip':
      if (value) {
        deviceStates[deviceId] = { ...device, ipAddress: value }
        return { output: `IP 地址已更改为 ${value}`, success: true }
      }
      return { output: '请输入 IP 地址', success: false }

    case 'change-subnet':
      if (value) {
        deviceStates[deviceId] = { ...device, subnetMask: value }
        return { output: `子网掩码已更改为 ${value}`, success: true }
      }
      return { output: '请输入子网掩码', success: false }

    case 'change-gateway':
      if (value) {
        deviceStates[deviceId] = { ...device, defaultGateway: value }
        return { output: `默认网关已更改为 ${value}`, success: true }
      }
      return { output: '请输入网关地址', success: false }

    case 'enable-port':
      if (device.portStatus) {
        const portKey = value || Object.keys(device.portStatus)[0]
        deviceStates[deviceId] = { ...device, portStatus: { ...device.portStatus, [portKey]: 'up' as const } }
        return { output: `端口 ${portKey} 已启用`, success: true }
      }
      return { output: '此设备不支持端口管理', success: false }

    case 'disable-port':
      if (device.portStatus) {
        const portKey = value || Object.keys(device.portStatus)[0]
        deviceStates[deviceId] = { ...device, portStatus: { ...device.portStatus, [portKey]: 'disabled' as const } }
        return { output: `端口 ${portKey} 已禁用`, success: true }
      }
      return { output: '此设备不支持端口管理', success: false }

    case 'restart-device':
      deviceStates[deviceId] = { ...device, isOnline: false }
      setTimeout(() => { deviceStates[deviceId] = { ...deviceStates[deviceId], isOnline: true } }, 2000)
      return { output: '设备正在重启...', success: true }

    default:
      return { output: '不支持的操作', success: false }
  }
}

export function checkVerifyCondition(
  condition: VerifyCondition,
  deviceStates: Record<string, DeviceConfig>,
): boolean {
  switch (condition.type) {
    case 'ping': {
      const targetDevice = Object.values(deviceStates).find(d => d.ipAddress === condition.target || d.id === condition.target)
      if (!targetDevice) return false
      return targetDevice.cableStatus === 'connected' && targetDevice.isOnline && targetDevice.ipAddress !== '错误的DNS地址'
    }
    case 'nslookup': {
      const dnsDevice = Object.values(deviceStates).find(d => d.type === 'server' && d.id.includes('dns'))
      if (dnsDevice && !dnsDevice.isOnline) return false
      const pcDevice = Object.values(deviceStates).find(d => d.type === 'computer')
      if (pcDevice && (pcDevice.dnsServer === '错误的DNS地址' || pcDevice.dnsServer === '0.0.0.0')) return false
      return true
    }
    case 'web-access': {
      return true
    }
    default:
      return false
  }
}
```

- [ ] **Step 5: Commit**

```bash
git add src/composables/useDeviceEngine.ts
git commit -m "feat: 创建设备状态引擎 useDeviceEngine - 设备状态管理、命令执行、设备操作、验证条件检测"
```

---

### Task 2: 创建三阶段状态机

**Files:**
- Create: `src/composables/useGameFlow.ts`

- [ ] **Step 1: 定义游戏阶段类型和 composable**

```typescript
import { ref, computed } from 'vue'

export type GameSubPhase = 'investigating' | 'repairing' | 'verifying' | 'completed'

export interface InvestigationLog {
  optionValue: string
  optionLabel: string
  timestamp: number
  result: 'correct' | 'wrong' | 'excluded'
}

export function useGameFlow() {
  const subPhase = ref<GameSubPhase>('investigating')
  const investigationLogs = ref<InvestigationLog[]>([])
  const selectedFixAction = ref<string | null>(null)
  const fixAttempts = ref(0)
  const verifiedItems = ref<string[]>([])
  const verifyFailed = ref(false)

  function setSubPhase(phase: GameSubPhase) {
    subPhase.value = phase
  }

  const isInvestigating = computed(() => subPhase.value === 'investigating')
  const isRepairing = computed(() => subPhase.value === 'repairing')
  const isVerifying = computed(() => subPhase.value === 'verifying')
  const isCompleted = computed(() => subPhase.value === 'completed')

  function logInvestigation(optionValue: string, optionLabel: string, result: 'correct' | 'wrong' | 'excluded') {
    investigationLogs.value.push({ optionValue, optionLabel, timestamp: Date.now(), result })
  }

  function markVerified(itemId: string) {
    if (!verifiedItems.value.includes(itemId)) {
      verifiedItems.value.push(itemId)
    }
  }

  const allVerified = computed(() => {
    return verifiedItems.value.length > 0
  })

  function reset() {
    subPhase.value = 'investigating'
    investigationLogs.value = []
    selectedFixAction.value = null
    fixAttempts.value = 0
    verifiedItems.value = []
    verifyFailed.value = false
  }

  return {
    subPhase, investigationLogs, selectedFixAction, fixAttempts, verifiedItems, verifyFailed,
    setSubPhase, isInvestigating, isRepairing, isVerifying, isCompleted,
    logInvestigation, markVerified, allVerified, reset,
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/composables/useGameFlow.ts
git commit -m "feat: 创建三阶段状态机 useGameFlow - investigating/repairing/verifying 三阶段管理"
```

---

### Task 3: 创建 FixSheet 组件

**Files:**
- Create: `src/components/FixSheet.vue`

- [ ] **Step 1: 编写组件模板和逻辑**

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Wrench, CheckCircle2, XCircle, ArrowRight } from '@lucide/vue'
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
          <p class="fix-desc">已定位故障，请选择修复方案并执行操作：</p>

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
              <div class="fix-option-detail">
                {{ action.type === 'plug-cable' ? '● 在设备操作面板点击"插入网线"' : '' }}
                {{ action.type === 'change-dns' ? `● 将 DNS 从 ${action.from} 改为 ${action.to}` : '' }}
                {{ action.type === 'change-ip' ? '● 修改电脑 IP 地址' : '' }}
                {{ action.type === 'enable-port' ? '● 在交换机操作面板点击"启用端口"' : '' }}
                {{ action.type === 'change-vlan' ? '● 修改 VLAN 配置' : '' }}
                {{ action.type === 'restart-device' ? '● 重启设备' : '' }}
                {{ action.type === 'replace-cable' ? '● 更换网线' : '' }}
                {{ action.type === 'change-subnet' ? '● 修改子网掩码' : '' }}
                {{ action.type === 'change-gateway' ? '● 修改默认网关' : '' }}
              </div>
            </div>
          </div>

          <div class="fix-tip">
            <ArrowRight :size="14" />
            <span>选择一个方案后，在右侧「设备操作」面板执行对应操作</span>
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
```

（CSS 样式与现有诊断面板 Sheet 风格一致，使用相同的深色主题+霓虹配色）

- [ ] **Step 2: 添加 CSS 样式**

在组件中添加 `<style scoped>`：

```css
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
```

- [ ] **Step 3: Commit**

```bash
git add src/components/FixSheet.vue
git commit -m "feat: 创建 FixSheet 修复操作引导面板组件"
```

---

### Task 4: 创建设备操作面板组件

**Files:**
- Create: `src/components/DevicePanel.vue`

- [ ] **Step 1: 编写组件模板和逻辑**

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { Plug, Cable, Network, Globe, Wrench, Terminal, Activity, HardDrive, PlugZap, Gauge, RefreshCw } from '@lucide/vue'
import type { DeviceConfig, DeviceOperation } from '@/composables/useDeviceEngine'

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
  const type = props.device.type
  if (type === 'computer') {
    const plugged = props.device.cableStatus === 'unplugged'
    ops.push({ id: 'plug-cable', label: plugged ? '插入网线' : '拔出网线', type: 'toggle', category: 'physical', icon: Plug, action: 'plug-cable' })
    ops.push({ id: 'replace-cable', label: '更换网线', type: 'toggle', category: 'physical', icon: Cable, action: 'replace-cable' })
    ops.push({ id: 'change-ip', label: `修改 IP (${props.device.ipAddress || '未设置'})`, type: 'input', category: 'network', icon: Network, action: 'change-ip' })
    ops.push({ id: 'change-subnet', label: `修改子网掩码 (${props.device.subnetMask || '未设置'})`, type: 'input', category: 'network', icon: Gauge, action: 'change-subnet' })
    ops.push({ id: 'change-gateway', label: `修改网关 (${props.device.defaultGateway || '未设置'})`, type: 'input', category: 'network', icon: Globe, action: 'change-gateway' })
    ops.push({ id: 'change-dns', label: `修改 DNS (${props.device.dnsServer || '未设置'})`, type: 'input', category: 'network', icon: Activity, action: 'change-dns' })
  }
  if (type === 'switch') {
    ops.push({ id: 'enable-port', label: '启用端口', type: 'input', category: 'physical', icon: PlugZap, action: 'enable-port' })
    ops.push({ id: 'disable-port', label: '禁用端口', type: 'input', category: 'physical', icon: Wrench, action: 'disable-port' })
    ops.push({ id: 'view-config', label: '查看配置', type: 'view', category: 'system', icon: Terminal, action: 'view-config' })
  }
  if (type === 'router' || type === 'firewall') {
    ops.push({ id: 'restart-device', label: '重启设备', type: 'toggle', category: 'system', icon: RefreshCw, action: 'restart-device' })
    ops.push({ id: 'view-config', label: '查看配置', type: 'view', category: 'system', icon: Terminal, action: 'view-config' })
  }
  if (type === 'server') {
    ops.push({ id: 'restart-device', label: '重启服务', type: 'toggle', category: 'system', icon: RefreshCw, action: 'restart-device' })
  }
  return ops
})

function handleOperation(op: typeof operations.value[0]) {
  if (op.type === 'toggle') {
    emit('operate', op.action)
  } else if (op.type === 'input') {
    const value = prompt(`请输入新值 (${op.label}):`)
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
  color: #c8d6e5; font-size: 13px; cursor: pointer; transition: all 0.2s ease; text-align: left;
}
.op-btn:hover { background: rgba(30,58,95,0.4); border-color: #00d4ff; color: #e6f1ff; }
.op-label { flex: 1; }
.op-type-badge { font-size: 10px; padding: 2px 6px; border-radius: 4px; background: rgba(0,212,255,0.1); color: #00d4ff; }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/DevicePanel.vue
git commit -m "feat: 创建设备操作面板 DevicePanel - 支持电脑/交换机/路由器/服务器的物理与网络操作"
```

---

### Task 5: 创建验证面板组件

**Files:**
- Create: `src/components/VerificationPanel.vue`

- [ ] **Step 1: 编写组件**

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { CheckCircle2, XCircle, Clock, RefreshCw } from '@lucide/vue'
import type { VerifyCondition } from '@/composables/useDeviceEngine'

const props = defineProps<{
  conditions: VerifyCondition[]
  verifiedItems: string[]
  isComplete: boolean
}>()

const progress = computed(() => {
  return Math.round((props.verifiedItems.length / props.conditions.length) * 100)
})

const allDone = computed(() => props.verifiedItems.length >= props.conditions.length)
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
      <div v-for="(cond, i) in conditions" :key="i" class="verify-item" :class="{ done: verifiedItems.includes(cond.type + ':' + cond.target) }">
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
      <span>所有验证已通过！</span>
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
.verify-item { display: flex; gap: 10px; padding: 10px 12px; background: rgba(30,58,95,0.2); border: 1px solid #1e3a5f; border-radius: 8px; transition: all 0.3s; }
.verify-item.done { border-color: rgba(0,255,136,0.3); background: rgba(0,255,136,0.05); }
.icon-done { color: #00ff88; } .icon-pending { color: #64748b; }
.verify-info { flex: 1; }
.verify-label { font-size: 13px; font-weight: 500; color: #e6f1ff; }
.verify-hint { font-size: 11px; color: #64748b; margin-top: 2px; font-family: 'JetBrains Mono', monospace; }
.verify-success { display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: rgba(0,255,136,0.1); border: 1px solid rgba(0,255,136,0.3); border-radius: 8px; color: #00ff88; font-size: 13px; font-weight: 500; }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/VerificationPanel.vue
git commit -m "feat: 创建验证面板 VerificationPanel - 修复验证进度与条件检测"
```

---

### Task 6: 增强关卡数据定义

**Files:**
- Modify: `src/data/network-levels.js`

- [ ] **Step 1: 为所有故障关卡添加 deviceState、fixActions 和 verifyConditions**

在第4-13关的每个关卡对象中，在现有字段后添加三个新字段：

**第4关 — 网线松了**（约第 144 行之后）：
```javascript
  deviceState: {
    'pc1': { cableStatus: 'unplugged', ipAddress: '192.168.1.15' },
  },
  fixActions: [
    { type: 'plug-cable', device: 'pc1', label: '插紧电脑网线' },
  ],
  verifyConditions: [
    { type: 'ping', target: '192.168.1.1', expect: 'success', label: 'ping 通网关' },
  ],
```

**第5关 — 端口关闭**（约第 182 行之后）：
```javascript
  deviceState: {
    'pc2': { cableStatus: 'connected', ipAddress: '0.0.0.0' },
    'sw2': { portStatus: { '5': 'disabled' } },
  },
  fixActions: [
    { type: 'enable-port', device: 'sw2', target: '5', label: '在交换机上启用端口 5' },
    { type: 'restart-device', device: 'sw2', label: '重启交换机' },
  ],
  verifyConditions: [
    { type: 'ping', target: '192.168.1.1', expect: 'success', label: 'ping 通网关' },
  ],
```

**第6关 — IP 冲突**（约第 221 行之后）：
```javascript
  deviceState: {
    'pc3a': { cableStatus: 'connected', ipAddress: '192.168.1.15' },
    'pc3b': { cableStatus: 'connected', ipAddress: '192.168.1.15' },
  },
  fixActions: [
    { type: 'change-ip', device: 'pc3b', from: '192.168.1.15', to: '192.168.1.16', label: '修改小李电脑 IP 为 192.168.1.16' },
  ],
  verifyConditions: [
    { type: 'ping', target: '192.168.1.1', expect: 'success', label: 'ping 通网关' },
    { type: 'ping', target: '192.168.1.16', expect: 'success', label: 'ping 通另一台电脑' },
  ],
```

**第7关 — VLAN 错配**（约第 268 行之后）：
```javascript
  deviceState: {
    'pc4a': { cableStatus: 'connected', ipAddress: '192.168.10.5' },
    'svr4': { cableStatus: 'connected', ipAddress: '192.168.10.100' },
    'sw4a': { portStatus: { '5': 'up', '24': 'up' } },
  },
  fixActions: [
    { type: 'change-vlan', device: 'sw4a', from: '20', to: '10', label: '将电脑端口从 VLAN 20 改到 VLAN 10' },
  ],
  verifyConditions: [
    { type: 'ping', target: '192.168.10.100', expect: 'success', label: 'ping 通财务部服务器' },
  ],
```

**第8关 — DNS 故障**（约第 310 行之后）：
```javascript
  deviceState: {
    'pc5': { cableStatus: 'connected', ipAddress: '192.168.1.50', dnsServer: '错误的DNS地址' },
    'dns5': { cableStatus: 'connected', isOnline: false },
  },
  fixActions: [
    { type: 'change-dns', device: 'pc5', from: '错误的DNS地址', to: '114.114.114.114', label: '将 DNS 改为 114.114.114.114' },
    { type: 'restart-device', device: 'dns5', label: '重启 DNS 服务器' },
  ],
  verifyConditions: [
    { type: 'nslookup', target: 'www.baidu.com', expect: 'resolve', label: 'DNS 解析百度' },
    { type: 'ping', target: '114.114.114.114', expect: 'success', label: 'ping 通 DNS 服务器' },
  ],
```

**第9关 — 上联链路中断**（约第 352 行之后）：
```javascript
  deviceState: {
    'pc6a': { cableStatus: 'connected', ipAddress: '192.168.1.10' },
    'pc6b': { cableStatus: 'connected', ipAddress: '192.168.1.11' },
    'sw6a': { cableStatus: 'connected' },
  },
  fixActions: [
    { type: 'replace-cable', device: 'sw6a', label: '更换上联光纤' },
    { type: 'restart-device', device: 'sw6a', label: '重启楼层交换机' },
  ],
  verifyConditions: [
    { type: 'ping', target: '192.168.1.1', expect: 'success', label: 'ping 通核心路由器' },
    { type: 'ping', target: '10.0.0.1', expect: 'success', label: 'ping 通外网网关' },
  ],
```

**第10关 — 端口映射**（约第 392 行之后）：
```javascript
  deviceState: {
    'pc10': { cableStatus: 'unplugged', ipAddress: '0.0.0.0' },
    'patch10': { portStatus: { '3': 'up' } },
    'sw10': { portStatus: { '10': 'up', '12': 'disabled' } },
  },
  fixActions: [
    { type: 'plug-cable', device: 'pc10', label: '插好 A-03 工位网线' },
  ],
  verifyConditions: [
    { type: 'ping', target: '192.168.1.1', expect: 'success', label: 'ping 通网关' },
  ],
```

**第11关 — IP 配置错误**（约第 430 行之后）：
```javascript
  deviceState: {
    'pc11': { cableStatus: 'connected', ipAddress: '192.168.2.50', subnetMask: '255.255.0.0', defaultGateway: '192.168.2.1' },
  },
  fixActions: [
    { type: 'change-subnet', device: 'pc11', from: '255.255.0.0', to: '255.255.255.0', label: '将子网掩码改为 255.255.255.0' },
  ],
  verifyConditions: [
    { type: 'ping', target: '192.168.2.100', expect: 'success', label: 'ping 通打印机' },
    { type: 'ping', target: '192.168.2.1', expect: 'success', label: 'ping 通网关' },
  ],
```

**第12关 — 光模块故障**（约第 472 行之后）：
```javascript
  deviceState: {
    'pc12a': { cableStatus: 'connected', ipAddress: '10.0.10.5' },
    'pc12b': { cableStatus: 'connected', ipAddress: '10.0.20.5' },
    'core12': { portStatus: { '1': 'up', '2': 'up' }, cableStatus: 'faulty' },
  },
  fixActions: [
    { type: 'replace-cable', device: 'core12', label: '清洁光纤接口并更换光模块' },
  ],
  verifyConditions: [
    { type: 'ping', target: '10.0.0.1', expect: 'success', label: 'ping 通出口路由器' },
    { type: 'ping', target: '10.0.10.1', expect: 'success', label: '客服部 ping 通网关' },
  ],
```

**第13关 — ACL 拦截**（约第 518 行之后）：
```javascript
  deviceState: {
    'pc13a': { cableStatus: 'connected', ipAddress: '10.0.10.10' },
    'pc13b': { cableStatus: 'connected', ipAddress: '10.0.10.11' },
    'fw13': { cableStatus: 'connected' },
    'svr13': { cableStatus: 'connected', ipAddress: '10.0.10.50' },
  },
  fixActions: [
    { type: 'change-dns', device: 'fw13', label: '调整 ACL 规则顺序' },
  ],
  verifyConditions: [
    { type: 'ping', target: '10.0.10.50', expect: 'success', label: 'ping 通 HR 服务器' },
    { type: 'ping', target: '10.0.10.50', expect: 'success', label: '从两台电脑均能访问' },
  ],
```

- [ ] **Step 2: Commit**

```bash
git add src/data/network-levels.js
git commit -m "feat: 为所有故障关卡添加 deviceState/fixActions/verifyConditions 数据"
```

---

### Task 7: 集成到 NetworkGame.vue（核心改造）

**Files:**
- Modify: `src/views/NetworkGame.vue`
- This is the largest task. The file is ~4200 lines. Key changes:

- [ ] **Step 1: 导入新模块**

在文件顶部的 import 部分添加：
```typescript
import { useDeviceEngine, executeCommand, executeDeviceOperation, checkVerifyCondition } from '@/composables/useDeviceEngine'
import { useGameFlow } from '@/composables/useGameFlow'
import FixSheet from '@/components/FixSheet.vue'
import DevicePanel from '@/components/DevicePanel.vue'
import VerificationPanel from '@/components/VerificationPanel.vue'
```

- [ ] **Step 2: 初始化引擎实例**

在 `const router = useRouter()` 之后添加：
```typescript
const deviceEngine = useDeviceEngine()
const gameFlow = useGameFlow()
```

- [ ] **Step 3: 修改 startLevel 函数**

在 `startLevel` 函数中，加载关卡时同时初始化设备状态：
```typescript
function startLevel(level: any) {
  currentLevel.value = level
  // ... 现有逻辑 ...
  gameFlow.reset()
  // 初始化设备状态
  const devices = level.topology.devices.map((d: any) => ({
    ...d,
    ipAddress: d.id === 'pc' + level.id ? '192.168.1.' + (10 + level.id) : '',
    subnetMask: '255.255.255.0',
    dnsServer: '8.8.8.8',
  }))
  deviceEngine.initDevices(devices)
  // 应用关卡初始状态覆盖
  if (level.deviceState) {
    Object.entries(level.deviceState).forEach(([id, state]: [string, any]) => {
      deviceEngine.updateDevice(id, state)
    })
  }
  gamePhase.value = 'playing'
}
```

- [ ] **Step 4: 修改 submitDiagnosis 函数**

诊断正确后不再直接完成，而是进入修复阶段：
```typescript
function submitDiagnosis(answer: string) {
  if (excludedDiagnoses.value.includes(answer)) return
  if (answer === currentLevel.value.fault.type) {
    foundFault.value = true
    showDiagnosisSheet.value = false
    gameFlow.logInvestigation(answer, getAnswerLabel(answer), 'correct')
    gameFlow.setSubPhase('repairing')
    showFixSheet.value = true  // 新增 ref: const showFixSheet = ref(false)
  } else {
    diagnosisAttempts.value++
    errorCount.value++
    diagnosisShake.value = true
    setTimeout(() => { diagnosisShake.value = false }, 500)
    gameFlow.logInvestigation(answer, getAnswerLabel(answer), 'wrong')
    if (diagnosisAttempts.value >= 3) {
      terminalRef.value?.addLine('提示：已经错了3次了，建议查看提示', 'system')
    }
  }
}
```

- [ ] **Step 5: 添加修复和验证处理函数**

```typescript
function handleFixSelect(action: FixAction) {
  showFixSheet.value = false
  gameFlow.selectedFixAction = action.type
}

function handleDeviceOperation(operation: string, value?: string) {
  if (!selectedDeviceId.value && operation !== 'view-config') return
  const deviceId = selectedDeviceId.value || ''
  const result = executeDeviceOperation(operation, deviceId, deviceEngine.deviceStates.value, value)
  terminalRef.value?.addLine(result.output, result.success ? 'success' : 'error')

  // 检查是否完成了修复操作（对比 fixActions）
  if (gameFlow.subPhase.value === 'repairing' && currentLevel.value?.fixActions) {
    const fixAction = currentLevel.value.fixActions.find((a: FixAction) => a.type === operation)
    if (fixAction) {
      // 检查操作是否匹配修复要求
      if (!fixAction.to || value === fixAction.to || !fixAction.to) {
        gameFlow.setSubPhase('verifying')
        terminalRef.value?.addLine('修复操作已完成！请执行验证命令检验修复效果。', 'system')
      } else {
        gameFlow.fixAttempts++
        terminalRef.value?.addLine('修复值不匹配，请检查配置。', 'warning')
      }
    }
  }
}

function handleCommandExecuted(cmd: string, args: string) {
  // 使用设备引擎执行命令
  const contextDeviceId = selectedDeviceId.value
  const result = executeCommand(cmd, args, contextDeviceId, deviceEngine.deviceStates.value)
  if (result.output) {
    terminalRef.value?.addLine(result.output, result.type || 'output')
  }

  // 验证阶段自动检测
  if (gameFlow.subPhase.value === 'verifying' && currentLevel.value?.verifyConditions) {
    currentLevel.value.verifyConditions.forEach((cond: VerifyCondition) => {
      const condId = cond.type + ':' + cond.target
      if (!gameFlow.verifiedItems.value.includes(condId)) {
        if (result.success && cmd === cond.type && (args === cond.target || args.includes(cond.target))) {
          gameFlow.markVerified(condId)
          terminalRef.value?.addLine(`✅ 验证项完成: ${cond.label}`, 'success')
        }
      }
    })

    // 全部验证通过 → 完成
    if (gameFlow.verifiedItems.value.length >= currentLevel.value.verifyConditions.length) {
      gameFlow.setSubPhase('completed')
      triggerComplete('normal')
    }
  }
}
```

- [ ] **Step 6: 在右侧面板 Tab 中添加"设备操作"**

在 panel-tabs 中添加新标签（在设备详情之后，告警列表之前）：
```vue
<button
  class="panel-tab"
  :class="{ active: rightPanelTab === 'operation' }"
  @click="rightPanelTab = 'operation'"
>
  <Wrench :size="16" />
  <span>设备操作</span>
</button>
```

更新 rightPanelTab 类型：
```typescript
const rightPanelTab = ref<'description' | 'device' | 'operation' | 'alert' | 'metric'>('description')
```

- [ ] **Step 7: 添加设备操作面板和验证面板的渲染**

在 panel-content 中添加（在设备详情之后，告警列表之前）：
```vue
<!-- 设备操作 -->
<div v-if="rightPanelTab === 'operation'" class="device-operation">
  <DevicePanel
    :device="selectedDevice"
    :device-type="selectedDevice?.type || null"
    @operate="handleDeviceOperation"
  />
</div>
```

在右侧面板底部的操作时间线区域之前，添加验证面板（仅验证阶段显示）：
```vue
<div v-if="gameFlow.subPhase.value === 'verifying' && currentLevel?.verifyConditions" class="verify-section">
  <VerificationPanel
    :conditions="currentLevel.verifyConditions"
    :verified-items="gameFlow.verifiedItems.value"
    :is-complete="gameFlow.subPhase.value === 'completed'"
  />
</div>
```

- [ ] **Step 8: 添加 FixSheet 修复面板**

在 game-layout 内部添加（在任意位置）：
```vue
<FixSheet
  :show="showFixSheet"
  :fix-actions="currentLevel?.fixActions || []"
  :fault-type="currentLevel?.fault?.type || ''"
  :fault-device="currentLevel?.fault?.device || ''"
  @select="handleFixSelect"
  @close="showFixSheet = false"
/>
```

- [ ] **Step 9: 修改右侧面板底部诊断区域**

将现有的诊断按钮区域改为根据阶段显示不同内容：
```vue
<div class="diagnose-section">
  <template v-if="gameFlow.subPhase.value === 'investigating' && !foundFault">
    <button class="diagnose-btn" @click="openDiagnosisSheet">
      <Stethoscope :size="16" />
      <span>开始诊断</span>
    </button>
    <div class="diagnose-errors">错误: {{ diagnosisAttempts }}/3</div>
  </template>
  <template v-else-if="gameFlow.subPhase.value === 'repairing'">
    <div class="phase-badge repairing">
      <span>修复阶段 — 请在「设备操作」面板执行修复</span>
    </div>
  </template>
  <template v-else-if="gameFlow.subPhase.value === 'verifying'">
    <div class="phase-badge verifying">
      <span>验证阶段 — 用终端命令验证修复效果</span>
    </div>
  </template>
  <template v-else-if="foundFault && gameFlow.subPhase.value === 'completed'">
    <div class="phase-badge done">
      <span>已完成</span>
    </div>
  </template>
</div>
```

- [ ] **Step 10: 将终端命令执行与新引擎对接**

找到现有的 `onCommandExecuted` 处理函数（约第 690 行附近），在其中调用 `handleCommandExecuted`：

```typescript
function onCommandExecuted(cmd: string, args: string, result: string) {
  // ... 现有逻辑 ...
  handleCommandExecuted(cmd, args)
}
```

同时新增 `showFixSheet` 响应式变量：
```typescript
const showFixSheet = ref(false)
```

- [ ] **Step 11: 添加 CSS 样式**

在 NetworkGame.vue 的样式部分添加新组件的样式：

```css
/* 修复阶段标识 */
.phase-badge {
  display: flex; align-items: center; gap: 8px; padding: 10px 14px;
  border-radius: 8px; font-size: 12px; font-weight: 500;
}
.phase-badge.repairing { background: rgba(0,212,255,0.1); border: 1px solid rgba(0,212,255,0.3); color: #00d4ff; }
.phase-badge.verifying { background: rgba(255,170,0,0.1); border: 1px solid rgba(255,170,0,0.3); color: #ffaa00; }
.phase-badge.done { background: rgba(0,255,136,0.1); border: 1px solid rgba(0,255,136,0.3); color: #00ff88; }

/* 验证区域 */
.verify-section { padding: 12px; border-top: 1px solid #1e3a5f; }
```

- [ ] **Step 12: 清除不再需要的 mockAlerts/mockMetrics**

确认之前已替换为 `levelAlerts`/`levelMetrics` 计算属性，删除旧的 mockAlerts 和 mockMetrics 定义。

- [ ] **Step 13: Commit**

```bash
git add src/views/NetworkGame.vue
git commit -m "feat: 集成三阶段流程到 NetworkGame - 排查/修复/验证闭环 + 设备引擎对接"
```

---

### Task 8: TopoGraph 视觉联动

**Files:**
- Modify: `src/components/TopoGraph.vue`

- [ ] **Step 1: 添加设备状态变化监听 prop**

添加 props 接收设备状态，用于更新拓扑图视觉：

```typescript
const props = defineProps<{
  devices: Device[]
  connections: Connection[]
  highlight?: string
  deviceStates?: Record<string, any>  // 新增
}>()
```

- [ ] **Step 2: 在设备卡片上显示状态指示**

修改设备 foreignObject 渲染，根据 `deviceStates` 显示不同状态：

```vue
<div v-if="deviceStates?.[dev.id]" class="device-indicator" :class="{
  'online': deviceStates[dev.id].cableStatus === 'connected' && deviceStates[dev.id].isOnline,
  'offline': deviceStates[dev.id].cableStatus === 'unplugged',
  'faulty': deviceStates[dev.id].cableStatus === 'faulty',
}"></div>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/TopoGraph.vue
git commit -m "feat: TopoGraph 支持 deviceStates 视觉联动 - 设备状态指示"
```

---

### Task 9: 移动端适配

**Files:**
- Modify: `src/views/NetworkGame.vue`

- [ ] **Step 1: 添加响应式调整**

在移动端设备操作面板和验证面板全屏显示：
```css
@media (max-width: 768px) {
  .verify-section { padding: 8px; }
  .device-panel { gap: 12px; }
  .fix-sheet { width: 95vw; padding: 20px; }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/views/NetworkGame.vue
git commit -m "fix: 移动端适配 - 设备操作面板和验证面板响应式优化"
```
