<script setup lang="ts">
import { computed } from 'vue'
import type { Device, Connection } from '@/data/network-levels'

const props = defineProps<{
  devices: Device[]
  connections: Connection[]
  highlight?: string
}>()

const emit = defineEmits<{
  clickDevice: [id: string]
}>()

// Simple grid-based layout
const svgW = 560
const svgH = 340

const deviceColors: Record<string, string> = {
  computer: '#3b82f6', server: '#8b5cf6', switch: '#10b981',
  router: '#f59e0b', wifi: '#06b6d4',
}
const deviceLabels: Record<string, string> = {
  computer: '💻', server: '🖥️', switch: '🔀', router: '🌐', wifi: '📶',
}

function getDeviceIcon(type: string) {
  return deviceLabels[type] || '📦'
}

// Generate connection paths
function getConnectionPath(conn: Connection, devices: Device[]) {
  const from = devices.find(d => d.id === conn.from)
  const to = devices.find(d => d.id === conn.to)
  if (!from || !to) return ''
  const x1 = from.x, y1 = from.y, x2 = to.x, y2 = to.y
  const midX = (x1 + x2) / 2
  return `M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`
}
</script>

<template>
  <div class="topo-container">
    <svg :viewBox="`0 0 ${svgW} ${svgH}`" class="topo-svg">
      <!-- Grid background -->
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e4e4e7" stroke-width="0.5" opacity="0.3"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />

      <!-- Connections -->
      <g v-for="(conn, i) in connections" :key="'conn-'+i">
        <path
          :d="getConnectionPath(conn, devices)"
          fill="none"
          :stroke="conn.status === 'up' ? '#34d399' : conn.status === 'down' ? '#f87171' : '#d4d4d8'"
          :stroke-width="conn.status === 'down' ? 2.5 : 2"
          :stroke-dasharray="conn.status === 'down' ? '6,4' : 'none'"
          class="topo-line"
        />
        <!-- Port label -->
        <text
          v-if="conn.toPort"
          :x="devices.find(d => d.id === conn.to)!.x - 30"
          :y="devices.find(d => d.id === conn.to)!.y - 14"
          class="topo-port"
        >端口{{ conn.toPort }}</text>
      </g>

      <!-- Devices -->
      <g
        v-for="(dev, i) in devices"
        :key="'dev-'+i"
        :class="['topo-device', { 'topo-device-highlight': highlight === dev.id }]"
        @click="emit('clickDevice', dev.id)"
      >
        <!-- Device rect -->
        <rect
          :x="dev.x - 40"
          :y="dev.y - 25"
          width="80"
          height="50"
          rx="8"
          :fill="`${deviceColors[dev.type] || '#71717a'}15`"
          :stroke="highlight === dev.id ? '#059669' : `${deviceColors[dev.type] || '#71717a'}40`"
          :stroke-width="highlight === dev.id ? 2.5 : 1.5"
          class="topo-device-rect"
        />
        <!-- Icon -->
        <text :x="dev.x" :y="dev.y - 4" text-anchor="middle" font-size="18" class="topo-icon">
          {{ getDeviceIcon(dev.type) }}
        </text>
        <!-- Label -->
        <text :x="dev.x" :y="dev.y + 16" text-anchor="middle" font-size="10" fill="#52525b" class="topo-label">
          {{ dev.label }}
        </text>
        <!-- Status indicator -->
        <circle
          :cx="dev.x + 35" :cy="dev.y - 18" r="4"
          :fill="dev.status === 'offline' ? '#f87171' : dev.status === 'unstable' ? '#fbbf24' : '#34d399'"
        />
      </g>
    </svg>
  </div>
</template>

<style scoped>
.topo-container {
  background: #fafafa;
  border: 1px solid #e4e4e7;
  border-radius: 12px;
  overflow: hidden;
}
.topo-svg {
  width: 100%;
  height: 100%;
  min-height: 300px;
}
.topo-device { cursor: pointer; }
.topo-device-rect {
  transition: all 0.25s cubic-bezier(0.16,1,0.3,1);
}
.topo-device:hover .topo-device-rect {
  stroke: #059669 !important;
  stroke-width: 2.5 !important;
}
.topo-device-highlight .topo-device-rect {
  stroke: #059669 !important;
  stroke-width: 2.5 !important;
  fill: #ecfdf5 !important;
}
.topo-line { transition: all 0.3s; }
.topo-port { font-size: 9px; fill: #a1a1aa; }
.topo-icon { pointer-events: none; }
.topo-label { pointer-events: none; }
</style>
