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
  computer: '#00d4ff',
  server: '#00ff88',
  switch: '#a855f7',
  router: '#ffaa00',
  firewall: '#ff4757',
  wifi: '#06b6d4',
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
  if (status === 'offline') return '#ff4757'
  if (status === 'unstable') return '#ffaa00'
  return '#00ff88'
}

function getConnColor(status: string): string {
  if (status === 'down') return '#ff4757'
  if (status === 'unstable') return '#ffaa00'
  return '#00d4ff'
}
</script>

<template>
  <div class="topo-container">
    <div class="topo-scroll-wrapper">
      <svg :viewBox="viewBox" class="topo-svg" preserveAspectRatio="xMidYMid meet">
      <defs>
        <pattern id="cyber-grid" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1e3a5f" stroke-width="0.5" opacity="0.4" />
        </pattern>

        <filter id="glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="glow-green" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="glow-red" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="glow-purple" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="glow-amber" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <linearGradient id="line-gradient-up" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#00d4ff;stop-opacity:0.6" />
          <stop offset="50%" style="stop-color:#00d4ff;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#00d4ff;stop-opacity:0.6" />
        </linearGradient>
      </defs>

      <rect width="100%" height="100%" fill="#0a0e17" />
      <rect width="100%" height="100%" fill="url(#cyber-grid)" />

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
            :stroke-width="hoveredConn === i ? 3.5 : (conn.status === 'down' ? 2.5 : 2)"
            :stroke-dasharray="conn.status === 'down' ? '8,5' : (conn.status === 'unstable' ? '4,3' : 'none')"
            :opacity="conn.status === 'down' ? 0.8 : 1"
            :filter="hoveredConn === i ? 'url(#glow-cyan)' : 'none'"
            class="connection-line"
          />

          <circle
            v-if="conn.status === 'up'"
            r="4"
            fill="#00d4ff"
            filter="url(#glow-cyan)"
            class="data-particle"
          >
            <animateMotion
              :dur="(getPathLength(conn, adjustedDevices) / 200) + 's'"
              repeatCount="indefinite"
              :path="getConnectionPath(conn, adjustedDevices)"
            />
          </circle>

          <circle
            v-if="conn.status === 'up'"
            r="3"
            fill="#00d4ff"
            filter="url(#glow-cyan)"
            class="data-particle"
          >
            <animateMotion
              :dur="(getPathLength(conn, adjustedDevices) / 200) + 's'"
              begin="-0.8s"
              repeatCount="indefinite"
              :path="getConnectionPath(conn, adjustedDevices)"
            />
          </circle>

          <g v-if="hoveredConn === i" class="conn-tooltip-group">
            <rect
              :x="(adjustedDevices.find(d => d.id === conn.from)!.x + adjustedDevices.find(d => d.id === conn.to)!.x) / 2 - 60"
              :y="(adjustedDevices.find(d => d.id === conn.from)!.y + adjustedDevices.find(d => d.id === conn.to)!.y) / 2 - 45"
              width="120"
              height="55"
              rx="6"
              fill="rgba(15, 22, 41, 0.95)"
              stroke="#00d4ff"
              stroke-width="1"
              filter="url(#glow-cyan)"
            />
            <text
              :x="(adjustedDevices.find(d => d.id === conn.from)!.x + adjustedDevices.find(d => d.id === conn.to)!.x) / 2"
              :y="(adjustedDevices.find(d => d.id === conn.from)!.y + adjustedDevices.find(d => d.id === conn.to)!.y) / 2 - 25"
              text-anchor="middle"
              fill="#00d4ff"
              font-size="10"
              font-weight="600"
            >链路信息</text>
            <text
              :x="(adjustedDevices.find(d => d.id === conn.from)!.x + adjustedDevices.find(d => d.id === conn.to)!.x) / 2 - 52"
              :y="(adjustedDevices.find(d => d.id === conn.from)!.y + adjustedDevices.find(d => d.id === conn.to)!.y) / 2 - 8"
              fill="#94a3b8"
              font-size="9"
            >带宽: {{ getConnMockData(i).bandwidth }}</text>
            <text
              :x="(adjustedDevices.find(d => d.id === conn.from)!.x + adjustedDevices.find(d => d.id === conn.to)!.x) / 2 - 52"
              :y="(adjustedDevices.find(d => d.id === conn.from)!.y + adjustedDevices.find(d => d.id === conn.to)!.y) / 2 + 5"
              fill="#94a3b8"
              font-size="9"
            >延迟: {{ getConnMockData(i).latency }}</text>
            <text
              :x="(adjustedDevices.find(d => d.id === conn.from)!.x + adjustedDevices.find(d => d.id === conn.to)!.x) / 2 - 52"
              :y="(adjustedDevices.find(d => d.id === conn.from)!.y + adjustedDevices.find(d => d.id === conn.to)!.y) / 2 + 18"
              fill="#94a3b8"
              font-size="9"
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
  background: rgba(15, 22, 41, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 12px;
  overflow: hidden;
  box-shadow:
    0 0 30px rgba(0, 212, 255, 0.1),
    inset 0 0 60px rgba(0, 212, 255, 0.03);
  position: relative;
  padding: 20px;
}

.topo-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #00d4ff, transparent);
  opacity: 0.6;
  z-index: 10;
  pointer-events: none;
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
  scrollbar-color: rgba(0, 212, 255, 0.3) transparent;
}

.topo-scroll-wrapper::-webkit-scrollbar {
  height: 6px;
}

.topo-scroll-wrapper::-webkit-scrollbar-track {
  background: rgba(0, 212, 255, 0.05);
  border-radius: 3px;
}

.topo-scroll-wrapper::-webkit-scrollbar-thumb {
  background: rgba(0, 212, 255, 0.3);
  border-radius: 3px;
}

.topo-scroll-wrapper::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 212, 255, 0.5);
}

.topo-svg {
  min-width: 100%;
  height: auto;
  max-height: 100%;
  display: block;
  flex-shrink: 0;
}

.connection-line {
  transition: stroke-width 0.25s ease, filter 0.25s ease;
  cursor: pointer;
}

.connection-group:hover .connection-line {
  stroke-width: 3.5;
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
  border-radius: 10px;
  background: color-mix(in srgb, var(--device-color) 12%, transparent);
  border: 1.5px solid color-mix(in srgb, var(--device-color) 40%, transparent);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  position: relative;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  box-sizing: border-box;
  overflow: visible;
}

.device-card:hover {
  border-color: var(--device-color);
  background: color-mix(in srgb, var(--device-color) 20%, transparent);
  transform: scale(1.06);
  box-shadow:
    0 0 20px color-mix(in srgb, var(--device-color) 50%, transparent),
    0 0 40px color-mix(in srgb, var(--device-color) 25%, transparent);
}

.device-highlighted {
  border-width: 2.5px !important;
  border-color: var(--device-color) !important;
  background: color-mix(in srgb, var(--device-color) 25%, rgba(0, 0, 0, 0.3)) !important;
  box-shadow:
    0 0 25px color-mix(in srgb, var(--device-color) 60%, transparent),
    0 0 50px color-mix(in srgb, var(--device-color) 30%, transparent) !important;
  transform: scale(1.04);
}

.device-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
}

.device-label {
  font-size: 10px;
  color: #cbd5e1;
  font-weight: 500;
  letter-spacing: 0.3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 80px;
}

.status-dot {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--status-color);
}

.device-online .status-dot {
  animation: breathe-green 2s ease-in-out infinite;
  box-shadow: 0 0 6px #00ff88, 0 0 12px rgba(0, 255, 136, 0.5);
}

.device-unstable .status-dot {
  animation: blink-amber 1s ease-in-out infinite;
  box-shadow: 0 0 6px #ffaa00, 0 0 12px rgba(255, 170, 0, 0.5);
}

.device-offline .status-dot {
  animation: pulse-red 1.5s ease-in-out infinite;
  box-shadow: 0 0 8px #ff4757, 0 0 16px rgba(255, 71, 87, 0.6);
}

@keyframes breathe-green {
  0%, 100% {
    opacity: 0.6;
    transform: scale(0.9);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

@keyframes blink-amber {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

@keyframes pulse-red {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
    box-shadow: 0 0 8px #ff4757, 0 0 16px rgba(255, 71, 87, 0.6);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.3);
    box-shadow: 0 0 12px #ff4757, 0 0 24px rgba(255, 71, 87, 0.8);
  }
}

.device-unstable.device-card {
  animation: borderPulseAmber 2s ease-in-out infinite;
}

@keyframes borderPulseAmber {
  0%, 100% {
    border-color: color-mix(in srgb, var(--device-color) 40%, transparent);
  }
  50% {
    border-color: color-mix(in srgb, #ffaa00 70%, transparent);
  }
}

.device-offline.device-card {
  animation: borderGlowRed 1.5s ease-in-out infinite;
}

@keyframes borderGlowRed {
  0%, 100% {
    box-shadow: 0 0 5px rgba(255, 71, 87, 0.3);
  }
  50% {
    box-shadow: 0 0 15px rgba(255, 71, 87, 0.6), 0 0 30px rgba(255, 71, 87, 0.3);
  }
}

.device-indicator {
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 1px solid rgba(0,0,0,0.3);
  transition: all 0.3s ease;
}
.device-indicator.online { background: #00ff88; box-shadow: 0 0 6px rgba(0,255,136,0.6); }
.device-indicator.offline { background: #ff4757; box-shadow: 0 0 6px rgba(255,71,87,0.6); }
.device-indicator.faulty { background: #ffaa00; box-shadow: 0 0 6px rgba(255,170,0,0.6); }
</style>
