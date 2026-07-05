<script setup lang="ts">
import { ref, computed } from 'vue'
import { Monitor, Server, Network, Router, Shield, Wifi } from '@lucide/vue'
import type { Device, Connection } from '@/data/network-levels'

const props = defineProps<{
  devices: Device[]
  connections: Connection[]
  highlight?: string
  deviceStates?: Record<string, any>
}>()

const emit = defineEmits<{
  clickDevice: [id: string]
}>()

const svgW = 600
const svgH = 380

const viewBox = computed(() => {
  if (props.devices.length === 0) return `0 0 ${svgW} ${svgH}`
  const maxX = Math.max(...props.devices.map(d => d.x))
  const minX = Math.min(...props.devices.map(d => d.x))
  const contentWidth = maxX - minX + 120
  const totalW = Math.max(svgW, contentWidth)
  return `0 0 ${totalW} ${svgH}`
})

const adjustedDevices = computed(() => {
  if (props.devices.length === 0) return []
  const minY = Math.min(...props.devices.map(d => d.y))
  const maxY = Math.max(...props.devices.map(d => d.y))
  const centerY = (minY + maxY) / 2
  const targetCenterY = svgH / 2 - 10
  const offsetY = targetCenterY - centerY
  return props.devices.map(d => ({
    ...d,
    y: d.y + offsetY,
  }))
})

const hoveredConn = ref<number | null>(null)

const deviceColors: Record<string, string> = {
  computer: '#2e5dd6',
  server: '#a33a3a',
  switch: '#7c3aed',
  router: '#d4a017',
  firewall: '#a33a3a',
  wifi: '#0891b2',
}

const iconComponents: Record<string, any> = {
  computer: Monitor,
  server: Server,
  switch: Network,
  router: Router,
  firewall: Shield,
  wifi: Wifi,
}

function getDeviceColor(type: string): string {
  return deviceColors[type] || '#6b7280'
}

function getDeviceIcon(type: string) {
  return iconComponents[type] || Monitor
}

function getConnectionPath(conn: Connection, devices: Device[]): string {
  const from = devices.find(d => d.id === conn.from)
  const to = devices.find(d => d.id === conn.to)
  if (!from || !to) return ''
  let x1 = from.x, y1 = from.y, x2 = to.x, y2 = to.y
  // 偏移起点/终点到卡片边缘（卡片半宽 45），让路径从卡片边缘开始/结束
  const dirX = Math.sign(x2 - x1)
  const halfCardW = 45
  const midX = (x1 + x2) / 2
  if (dirX !== 0) {
    const x1Edge = x1 + dirX * halfCardW
    const x2Edge = x2 - dirX * halfCardW
    // 如果设备很近，限制不越过中点，保证路径形状正确
    x1 = dirX > 0 ? Math.min(x1Edge, midX) : Math.max(x1Edge, midX)
    x2 = dirX > 0 ? Math.max(x2Edge, midX) : Math.min(x2Edge, midX)
  }
  const adjMidX = (x1 + x2) / 2
  return `M ${x1} ${y1} L ${adjMidX} ${y1} L ${adjMidX} ${y2} L ${x2} ${y2}`
}

function getPathLength(conn: Connection, devices: Device[]): number {
  const from = devices.find(d => d.id === conn.from)
  const to = devices.find(d => d.id === conn.to)
  if (!from || !to) return 0
  const dx = Math.abs(to.x - from.x)
  const dy = Math.abs(to.y - from.y)
  return dx + dy
}

const connMockData = [
  { bandwidth: '1Gbps', latency: '0.5ms', loss: '0%' },
  { bandwidth: '10Gbps', latency: '0.2ms', loss: '0%' },
  { bandwidth: '1Gbps', latency: '1.2ms', loss: '0.1%' },
  { bandwidth: '100Mbps', latency: '2ms', loss: '0%' },
  { bandwidth: '1Gbps', latency: '0.8ms', loss: '0%' },
  { bandwidth: '10Gbps', latency: '0.3ms', loss: '0%' },
]

function getConnMockData(index: number) {
  return connMockData[index % connMockData.length]
}

function getStatusColor(status?: string): string {
  if (status === 'offline') return '#a33a3a'
  if (status === 'unstable') return '#d4a017'
  return '#2f9e44'
}

function getConnColor(status: string): string {
  if (status === 'down') return '#a33a3a'
  if (status === 'unstable') return '#d4a017'
  return '#2e5dd6'
}
</script>

<template>
  <div class="topo-container">
    <div class="topo-scroll-wrapper">
      <svg :viewBox="viewBox" class="topo-svg" preserveAspectRatio="xMidYMid meet">
      <defs>
        <pattern id="pixel-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill="none" />
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#d9d2c4" stroke-width="1" />
        </pattern>
      </defs>

      <rect width="100%" height="100%" fill="#f5f0e8" />
      <rect width="100%" height="100%" fill="url(#pixel-grid)" />

      <g class="connections-group">
        <g
          v-for="(conn, i) in connections"
          :key="'conn-'+i"
          class="connection-group"
          @mouseenter="hoveredConn = i"
          @mouseleave="hoveredConn = null"
        >
          <path
            :d="getConnectionPath(conn, adjustedDevices)"
            fill="none"
            :stroke="getConnColor(conn.status)"
            :stroke-width="hoveredConn === i ? 4 : (conn.status === 'down' ? 3 : 3)"
            :stroke-dasharray="conn.status === 'down' ? '10,6' : (conn.status === 'unstable' ? '6,4' : 'none')"
            :opacity="conn.status === 'down' ? 0.9 : 1"
            class="connection-line"
          />

          <rect
            v-if="conn.status === 'up'"
            width="6"
            height="6"
            :fill="getConnColor(conn.status)"
            class="data-particle"
          >
            <animateMotion
              :dur="(getPathLength(conn, adjustedDevices) / 180) + 's'"
              repeatCount="indefinite"
              :path="getConnectionPath(conn, adjustedDevices)"
            />
          </rect>

          <g v-if="hoveredConn === i" class="conn-tooltip-group">
            <rect
              :x="(adjustedDevices.find(d => d.id === conn.from)!.x + adjustedDevices.find(d => d.id === conn.to)!.x) / 2 - 65"
              :y="(adjustedDevices.find(d => d.id === conn.from)!.y + adjustedDevices.find(d => d.id === conn.to)!.y) / 2 - 50"
              width="130"
              height="60"
              fill="#fffaef"
              stroke="#161310"
              stroke-width="2"
            />
            <text
              :x="(adjustedDevices.find(d => d.id === conn.from)!.x + adjustedDevices.find(d => d.id === conn.to)!.x) / 2"
              :y="(adjustedDevices.find(d => d.id === conn.from)!.y + adjustedDevices.find(d => d.id === conn.to)!.y) / 2 - 28"
              text-anchor="middle"
              fill="#161310"
              font-size="11"
              font-weight="700"
              font-family="'Pixelify Sans', monospace"
            >链路信息</text>
            <text
              :x="(adjustedDevices.find(d => d.id === conn.from)!.x + adjustedDevices.find(d => d.id === conn.to)!.x) / 2 - 55"
              :y="(adjustedDevices.find(d => d.id === conn.from)!.y + adjustedDevices.find(d => d.id === conn.to)!.y) / 2 - 10"
              fill="#3a332a"
              font-size="10"
              font-family="ui-monospace, monospace"
            >带宽: {{ getConnMockData(i).bandwidth }}</text>
            <text
              :x="(adjustedDevices.find(d => d.id === conn.from)!.x + adjustedDevices.find(d => d.id === conn.to)!.x) / 2 - 55"
              :y="(adjustedDevices.find(d => d.id === conn.from)!.y + adjustedDevices.find(d => d.id === conn.to)!.y) / 2 + 4"
              fill="#3a332a"
              font-size="10"
              font-family="ui-monospace, monospace"
            >延迟: {{ getConnMockData(i).latency }}</text>
            <text
              :x="(adjustedDevices.find(d => d.id === conn.from)!.x + adjustedDevices.find(d => d.id === conn.to)!.x) / 2 - 55"
              :y="(adjustedDevices.find(d => d.id === conn.from)!.y + adjustedDevices.find(d => d.id === conn.to)!.y) / 2 + 18"
              fill="#3a332a"
              font-size="10"
              font-family="ui-monospace, monospace"
            >丢包: {{ getConnMockData(i).loss }}</text>
          </g>
        </g>
      </g>

      <g
        v-for="(dev, i) in adjustedDevices"
        :key="'dev-'+i"
        :class="['topo-device', { 'topo-device-highlight': highlight === dev.id }]"
        @click="emit('clickDevice', dev.id)"
      >
        <foreignObject
          :x="dev.x - 45"
          :y="dev.y - 30"
          width="90"
          height="60"
        >
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            class="device-card"
            :style="{
              '--device-color': getDeviceColor(dev.type),
              '--status-color': getStatusColor(dev.status),
            }"
            :class="{
              'device-online': !dev.status || dev.status === 'online',
              'device-unstable': dev.status === 'unstable',
              'device-offline': dev.status === 'offline',
              'device-highlighted': highlight === dev.id,
            }"
          >
            <div class="device-icon-wrap">
              <component :is="getDeviceIcon(dev.type)" :size="24" :color="getDeviceColor(dev.type)" />
            </div>
            <div class="device-label">{{ dev.label }}</div>
            <div v-if="deviceStates?.[dev.id]" class="device-indicator" :class="deviceStates[dev.id].cableStatus === 'connected' && deviceStates[dev.id].isOnline ? 'online' : (deviceStates[dev.id].cableStatus === 'unplugged' ? 'offline' : 'faulty')"></div>
            <div class="status-dot" />
          </div>
        </foreignObject>
      </g>
    </svg>
    </div>
  </div>
</template>

<style scoped>
.topo-container {
  background: #f5f0e8;
  border: 3px solid #161310;
  box-shadow: 6px 6px 0 0 #161310;
  overflow: hidden;
  position: relative;
  padding: 16px;
}

.topo-scroll-wrapper {
  width: 100%;
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  scrollbar-width: thin;
  scrollbar-color: #161310 #f5f0e8;
}

.topo-scroll-wrapper::-webkit-scrollbar {
  height: 8px;
}

.topo-scroll-wrapper::-webkit-scrollbar-track {
  background: #e8e0d0;
}

.topo-scroll-wrapper::-webkit-scrollbar-thumb {
  background: #161310;
}

.topo-svg {
  min-width: 100%;
  height: auto;
  max-height: 100%;
  display: block;
  flex-shrink: 0;
}

.connection-line {
  transition: stroke-width 0.2s ease;
  cursor: pointer;
  stroke-linecap: square;
}

.connection-group:hover .connection-line {
  stroke-width: 4;
}

.data-particle {
  pointer-events: none;
}

.conn-tooltip-group {
  pointer-events: none;
  animation: fadeInTooltip 0.2s ease-out;
}

@keyframes fadeInTooltip {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.topo-device {
  cursor: pointer;
}

.device-card {
  width: 100%;
  height: 100%;
  background: #fffaef;
  border: 2px solid #161310;
  box-shadow: 3px 3px 0 0 #161310;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  position: relative;
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-sizing: border-box;
  overflow: visible;
}

.device-card:hover {
  border-color: var(--device-color);
  transform: translate(-2px, -2px);
  box-shadow: 5px 5px 0 0 var(--device-color);
}

.device-highlighted {
  border-width: 3px !important;
  border-color: var(--device-color) !important;
  background: #fffaef !important;
  box-shadow: 5px 5px 0 0 var(--device-color) !important;
  transform: translate(-2px, -2px);
}

.device-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
}

.device-label {
  font-size: 10px;
  color: #161310;
  font-weight: 600;
  font-family: 'Pixelify Sans', ui-monospace, monospace;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 80px;
}

.status-dot {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 8px;
  height: 8px;
  background: var(--status-color);
  border: 1px solid #161310;
}

.device-online .status-dot {
  animation: blink-green 2s steps(2) infinite;
}

.device-unstable .status-dot {
  animation: blink-amber 1s steps(2) infinite;
}

.device-offline .status-dot {
  animation: blink-red 1.5s steps(2) infinite;
}

@keyframes blink-green {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes blink-amber {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

@keyframes blink-red {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.device-unstable.device-card {
  animation: borderBlinkAmber 2s steps(2) infinite;
}

@keyframes borderBlinkAmber {
  0%, 100% { border-color: #161310; }
  50% { border-color: #d4a017; }
}

.device-offline.device-card {
  animation: borderBlinkRed 1.5s steps(2) infinite;
}

@keyframes borderBlinkRed {
  0%, 100% { border-color: #161310; }
  50% { border-color: #a33a3a; }
}
</style>
