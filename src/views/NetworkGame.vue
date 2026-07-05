<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { levels } from '@/data/network-levels.js'
import TopoGraph from '@/components/TopoGraph.vue'
import Terminal from '@/components/Terminal.vue'
import {
  ArrowLeft,
  Clock,
  XCircle,
  Terminal as TerminalIcon,
  MoreVertical,
  Activity,
  Route,
  Globe,
  MonitorSmartphone,
  Scan,
  Settings,
  Stethoscope,
  FileText,
  ChevronLeft,
  ChevronRight,
  Info,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  X,
  Minimize2,
  Maximize2,
  Trophy,
  BookOpen,
  Zap,
  Cpu,
  HardDrive,
  Wifi,
  ChevronDown,
  Play,
  GripHorizontal,
  Star,
  History,
  Layers,
  Lightbulb,
  Power,
  Server,
  Shield,
  Gauge,
  Sparkles,
  Trash2,
  Wrench,
  RefreshCw,
} from '@lucide/vue'

import { useDeviceEngine, executeCommand, executeDeviceOperation, checkVerifyCondition } from '@/composables/useDeviceEngine'
import type { FixAction, VerifyCondition } from '@/composables/useDeviceEngine'
import { useGameFlow } from '@/composables/useGameFlow'
import FixSheet from '@/components/FixSheet.vue'
import DevicePanel from '@/components/DevicePanel.vue'
import VerificationPanel from '@/components/VerificationPanel.vue'

const router = useRouter()
const deviceEngine = useDeviceEngine()
const gameFlow = useGameFlow()
const showFixSheet = ref(false)
const currentLevel = ref<any>(null)
const gamePhase = ref<'select' | 'playing' | 'review'>('select')
const foundFault = ref(false)
const fixed = ref(false)
const terminalRef = ref<InstanceType<typeof Terminal> | null>(null)
const deviceContext = ref<'pc' | 'switch' | 'router' | 'firewall'>('pc')
const deviceName = ref('本地电脑')
const hintIndex = ref(0)
const showCompleteModal = ref(false)
const currentCompleteType = ref('')
const completed = ref<Record<number, boolean>>({})

// 教程引导
const showTutorial = ref(false)
const tutorialStepIndex = ref(0)
const isTutorialLevel = computed(() => currentLevel.value?.tutorial && currentLevel.value.tutorial.steps?.length > 0)
const currentTutorialStep = computed(() => {
  if (!currentLevel.value?.tutorial) return null
  return currentLevel.value.tutorial.steps[tutorialStepIndex.value] || null
})
const isLastTutorialStep = computed(() => {
  if (!currentLevel.value?.tutorial) return true
  return tutorialStepIndex.value >= currentLevel.value.tutorial.steps.length - 1
})
const isFirstTutorialStep = computed(() => tutorialStepIndex.value === 0)

const elapsedTime = ref(0)
const errorCount = ref(0)
const commandCount = ref(0)
let timerInterval: number | null = null

const leftPanelCollapsed = ref(false)
const terminalMinimized = ref(false)
const terminalHeight = ref(280)
const isDragging = ref(false)
const viewMode = ref<'global' | 'room' | 'device'>('global')
const rightPanelTab = ref<'description' | 'device' | 'alert' | 'metric'>('description')
const selectedDeviceId = ref<string | null>(null)
const showMenu = ref(false)

const commandHistory = ref<Array<{
  time: number
  cmd: string
  args: string
  result: string
  type: 'command' | 'diagnose' | 'fix'
}>>([])

const progressData = ref<{
  completedLevels: number[]
  stars: Record<number, number>
  bestTime: Record<number, number>
  bestCommands: Record<number, number>
  totalPlayTime: number
}>({
  completedLevels: [],
  stars: {},
  bestTime: {},
  bestCommands: {},
  totalPlayTime: 0,
})

const diagnosisAttempts = ref(0)
const showDiagnosisSheet = ref(false)
const excludedDiagnoses = ref<string[]>([])
const expandedLayers = ref<string[]>(['physical', 'datalink', 'network', 'application'])
const diagnosisShake = ref(false)

const showCelebration = ref(false)
const starsLit = ref(0)
const finalScore = ref(0)

const expandedKnowledgeCards = ref<number[]>([0])

const tools = [
  { id: 'ping', name: 'Ping', icon: Activity, cmd: 'ping 192.168.1.1' },
  { id: 'traceroute', name: 'Traceroute', icon: Route, cmd: 'tracert 8.8.8.8' },
  { id: 'dns', name: 'DNS 查询', icon: Globe, cmd: 'nslookup baidu.com' },
  { id: 'telnet', name: '远程连接', icon: MonitorSmartphone, cmd: 'telnet 192.168.1.1' },
  { id: 'portscan', name: '端口扫描', icon: Scan, cmd: 'show interfaces' },
  { id: 'config', name: '配置管理', icon: Settings, cmd: 'show running-config' },
  { id: 'diagnose', name: '诊断工具', icon: Stethoscope, cmd: 'diagnose' },
  { id: 'notes', name: '笔记', icon: FileText, cmd: 'help' },
]

const levelAlerts = computed(() => {
  const lv = currentLevel.value
  if (!lv) return []
  const alerts: { id: number; level: string; title: string; desc: string; time: string }[] = []
  if (lv.fault && lv.fault.type !== 'none') {
    const device = lv.topology.devices.find((d: any) => d.id === lv.fault.device)
    const deviceName = device ? device.label : lv.fault.device
    // 根据故障类型生成对应的告警
    const alertMap: Record<string, { level: string; title: string; desc: string }> = {
      'cable-unplugged': { level: 'critical', title: '链路中断', desc: `${deviceName} 网线脱落，端口无信号` },
      'port-disabled': { level: 'critical', title: '端口关闭', desc: `${deviceName} 端口 shutdown，无法通信` },
      'ip-conflict': { level: 'warning', title: 'IP 地址冲突', desc: '检测到重复 IP 地址，网络时断时续' },
      'vlan-mismatch': { level: 'warning', title: 'VLAN 不匹配', desc: `${deviceName} 端口 VLAN 配置错误，跨段访问受限` },
      'dns-down': { level: 'critical', title: 'DNS 解析失败', desc: `${deviceName} 无响应，域名无法解析` },
      'uplink-down': { level: 'critical', title: '上联链路中断', desc: `${deviceName} 到核心链路断开，整层断网` },
      'port-mapping': { level: 'warning', title: '端口映射错误', desc: `${deviceName} 跳线插错端口，VLAN 归属异常` },
      'ip-config': { level: 'warning', title: 'IP 配置错误', desc: `${deviceName} 子网掩码/网关配置异常` },
      'sfp-fault': { level: 'warning', title: '光模块异常', desc: `${deviceName} 光衰过大，CRC 错误包激增` },
      'acl-misconfig': { level: 'warning', title: 'ACL 规则异常', desc: `${deviceName} ACL 规则顺序错误，部分源地址被拦截` },
    }
    const matched = alertMap[lv.fault.type]
    if (matched) {
      alerts.push({ id: 1, ...matched, time: '刚刚' })
    }
  }
  // 添加关联的二级告警（基于故障设备的上下游连接状态）
  if (lv.topology && lv.topology.connections) {
    lv.topology.connections.forEach((conn: any, i: number) => {
      if (conn.status === 'down' || conn.status === 'unstable') {
        const fromDev = lv.topology.devices.find((d: any) => d.id === conn.from)
        const toDev = lv.topology.devices.find((d: any) => d.id === conn.to)
        alerts.push({
          id: 10 + i,
          level: conn.status === 'down' ? 'critical' : 'warning',
          title: conn.status === 'down' ? '链路中断' : '链路不稳定',
          desc: `${fromDev?.label || conn.from} → ${toDev?.label || conn.to}`,
          time: conn.status === 'down' ? '2分钟前' : '5分钟前',
        })
      }
    })
  }
  return alerts.slice(0, 6)
})

const levelMetrics = computed(() => {
  const lv = currentLevel.value
  if (!lv) return { cpu: 0, memory: 0, bandwidth: '0 Gbps', packetLoss: '0%', latency: '0ms', sessions: 0 }
  // 基于故障类型调整指标值，反映当前故障的影响
  const hasFault = lv.fault && lv.fault.type !== 'none'
  const hasUnstable = lv.topology?.connections?.some((c: any) => c.status === 'unstable')
  const hasDown = lv.topology?.connections?.some((c: any) => c.status === 'down')
  const cpu = hasFault ? (hasDown ? 85 : hasUnstable ? 72 : 58) : 32
  const memory = hasFault ? (hasDown ? 91 : hasUnstable ? 78 : 63) : 45
  const bandwidth = hasDown ? '0.8 Gbps' : hasUnstable ? '1.2 Gbps' : '2.4 Gbps'
  const packetLoss = hasDown ? '12.5%' : hasUnstable ? '3.8%' : '0.02%'
  const latency = hasDown ? '∞' : hasUnstable ? '380ms' : '3.2ms'
  const sessions = hasDown ? 342 : hasUnstable ? 689 : 1247
  return { cpu, memory, bandwidth, packetLoss, latency, sessions }
})

const diagnosisLayers = [
  {
    id: 'physical',
    name: '物理层',
    icon: Zap,
    color: '#ff4757',
    options: [
      { value: 'cable-unplugged', label: '网线松了/未插好' },
      { value: 'sfp-fault', label: '光模块故障或光纤线路问题' },
      { value: 'power-fault', label: '电源故障' },
    ],
  },
  {
    id: 'datalink',
    name: '数据链路层',
    icon: Layers,
    color: '#ffaa00',
    options: [
      { value: 'port-disabled', label: '交换机端口关闭 (shutdown)' },
      { value: 'vlan-mismatch', label: 'VLAN 配置错误' },
      { value: 'port-security', label: '端口安全限制' },
    ],
  },
  {
    id: 'network',
    name: '网络层',
    icon: Globe,
    color: '#00d4ff',
    options: [
      { value: 'ip-conflict', label: 'IP 地址冲突' },
      { value: 'ip-config', label: '子网掩码/网关配置错误' },
      { value: 'uplink-down', label: '路由不可达' },
      { value: 'acl-misconfig', label: 'ACL 拦截' },
    ],
  },
  {
    id: 'application',
    name: '应用层',
    icon: Server,
    color: '#a855f7',
    options: [
      { value: 'dns-down', label: 'DNS 服务器故障' },
      { value: 'port-mapping', label: '服务端口未开放' },
    ],
  },
]

const knowledgeBase: Record<string, Array<{
  icon: any
  title: string
  description: string
}>> = {
  'cable-unplugged': [
    { icon: Zap, title: '物理层故障排查', description: '物理层是OSI七层模型的最底层，负责传输原始比特流。常见故障包括：网线松动、光纤断裂、电源故障、接口损坏等。排查时应先检查物理连接，遵循"从下到上"的原则。' },
    { icon: Activity, title: '网线状态指示灯', description: '网线接口通常有两个指示灯：LINK灯（常亮表示物理连接正常）和ACT灯（闪烁表示有数据传输）。如果LINK灯不亮，说明物理层有问题。' },
    { icon: Info, title: '常见物理层故障原因', description: '1. 网线未插紧或卡扣断裂\n2. 水晶头压制不良\n3. 网线中间断裂\n4. 设备端口损坏\n5. 光纤模块故障\n6. 设备断电' },
  ],
  'port-disabled': [
    { icon: Power, title: '交换机端口状态', description: '交换机端口有多种状态：up（正常工作）、down（物理断开）、administratively down（管理关闭）、err-disabled（错误禁用）。shutdown命令会将端口置为管理关闭状态。' },
    { icon: Layers, title: '数据链路层概述', description: '数据链路层负责在同一网络内传输数据帧，主要设备是交换机。常见故障包括：端口关闭、VLAN配置错误、MAC地址表异常、生成树协议问题等。' },
    { icon: Shield, title: '端口安全机制', description: '端口安全（Port Security）可以限制端口上允许的MAC地址数量，防止未经授权的设备接入。当违规发生时，端口可能被自动关闭（shutdown）或丢弃数据。' },
  ],
  'ip-conflict': [
    { icon: Globe, title: 'IP 地址冲突原理', description: '当两台设备在同一局域网中使用相同的IP地址时，会发生IP地址冲突。这会导致两台设备都无法正常通信，因为交换机会在两个端口之间频繁切换MAC地址表项。' },
    { icon: Activity, title: 'ARP 协议与冲突检测', description: 'ARP（地址解析协议）用于将IP地址映射为MAC地址。当设备检测到ARP应答中返回的MAC地址与自己不同时，就会检测到IP冲突。Windows系统会自动检测并弹出警告。' },
    { icon: Info, title: '如何避免 IP 冲突', description: '1. 使用DHCP自动分配IP地址\n2. 静态IP地址做好记录和规划\n3. 启用IP地址管理（IPAM）系统\n4. 在交换机上配置IP源防护（IPSG）' },
  ],
  'vlan-mismatch': [
    { icon: Layers, title: 'VLAN 基本概念', description: 'VLAN（虚拟局域网）可以将一个物理交换机划分为多个逻辑上独立的广播域。不同VLAN之间默认无法直接通信，需要通过三层设备（路由器或三层交换机）转发。' },
    { icon: Shield, title: 'VLAN 的作用', description: '1. 隔离广播风暴，提高网络性能\n2. 增强网络安全性，不同部门隔离\n3. 灵活的组织结构，不受物理位置限制\n4. 简化网络管理' },
    { icon: Info, title: 'VLAN 端口类型', description: 'Access端口：属于单个VLAN，用于连接终端设备\nTrunk端口：承载多个VLAN，用于交换机之间的互联\nNative VLAN：Trunk端口上不打标签的VLAN' },
  ],
  'dns-down': [
    { icon: Globe, title: 'DNS 工作原理', description: 'DNS（域名系统）将人类可读的域名（如baidu.com）转换为机器可读的IP地址。DNS采用层级结构：根域名服务器 → 顶级域名服务器 → 权威域名服务器 → 本地DNS服务器。' },
    { icon: Server, title: '常见 DNS 故障', description: '1. DNS服务器宕机或无响应\n2. DNS缓存污染\n3. 防火墙拦截DNS请求（UDP 53端口）\n4. DNS配置错误（指向错误的DNS服务器）\n5. 域名解析记录过期或错误' },
    { icon: Info, title: 'DNS 排查工具', description: 'nslookup：最常用的DNS诊断工具\ndig：功能更强大的DNS查询工具\nipconfig /flushdns：清除本地DNS缓存\nping 域名：间接测试DNS是否正常' },
  ],
  'uplink-down': [
    { icon: Route, title: '上联链路故障', description: '上联链路（Uplink）是指连接到更上层网络设备的链路（如接入交换机到汇聚交换机，汇聚到核心）。上联中断会导致下联所有设备无法访问上层网络。' },
    { icon: Activity, title: '链路聚合与冗余', description: '为提高可靠性，重要链路通常会配置冗余：\n• EtherChannel/链路聚合：多条物理链路绑定为一条逻辑链路\n• STP生成树：防止环路，同时提供备份链路\n• 动态路由协议：自动选择最佳路径' },
    { icon: Zap, title: '光纤链路排查', description: '光纤故障排查步骤：\n1. 观察端口指示灯状态\n2. 检查光模块是否插紧\n3. 清洁光纤端面\n4. 使用光功率计测量光衰\n5. 更换光模块或尾纤测试' },
  ],
  'port-mapping': [
    { icon: Layers, title: '综合布线系统', description: '完整的综合布线包括：工作区子系统（信息面板）、水平子系统（网线）、管理子系统（配线架）、垂直子系统、设备间子系统。每个工位的信息面板通过网线连接到配线架，再通过跳线连接到交换机。' },
    { icon: Info, title: '配线架与标签管理', description: '配线架是综合布线的核心组件，用于端接水平网线。每个配线架端口都应该有清晰的标签，标明对应的工位编号。良好的标签管理可以大大降低排障时间。' },
    { icon: Shield, title: 'VLAN 规划最佳实践', description: '1. 按部门或业务划分VLAN\n2. VLAN编号要有规划（如10-19=销售，20-29=研发）\n3. 管理VLAN与业务VLAN分离\n4. 语音VLAN单独规划\n5. 预留扩展空间' },
  ],
  'ip-config': [
    { icon: Globe, title: '子网掩码详解', description: '子网掩码用于区分IP地址中的网络位和主机位。255.255.255.0（/24）表示前24位是网络号，后8位是主机号，可容纳254台主机。255.255.0.0（/16）可容纳65534台主机。' },
    { icon: Route, title: '默认网关的作用', description: '默认网关是设备访问其他网络时的"出口"。当目标IP不在同一子网时，设备会将数据包发送给默认网关，由网关负责路由转发。如果网关配置错误，设备将无法访问其他网络。' },
    { icon: Info, title: 'IP 地址计算方法', description: '判断两个IP是否在同一子网：\n1. 将IP地址和子网掩码都转换为二进制\n2. 进行按位与运算\n3. 得到的网络地址如果相同，则在同一子网\n例：192.168.1.10 & 255.255.255.0 = 192.168.1.0' },
  ],
  'sfp-fault': [
    { icon: Zap, title: '光模块基础知识', description: 'SFP（小型可插拔）光模块用于交换机、路由器等设备的光纤接口。常见类型：SFP（千兆）、SFP+（万兆）、QSFP+（40G）、QSFP28（100G）。参数包括：传输距离、波长、接口类型（LC/SC）、单模/多模。' },
    { icon: Gauge, title: '光功率与接收灵敏度', description: '光模块的接收光功率必须在正常范围内：\n• 过高（> -3dBm）：可能烧坏光模块\n• 正常（-10 ~ -3dBm）：工作良好\n• 过低（< -18dBm）：丢包或链路中断\n光功率单位是dBm（分贝毫瓦）。' },
    { icon: Info, title: 'CRC 错误分析', description: 'CRC（循环冗余校验）错误是指数据包在传输过程中发生了比特错误。大量CRC错误通常由物理层问题引起：光衰过大、网线质量差、电磁干扰、接口松动等。CRC错误计数持续增长是需要排查的信号。' },
  ],
  'acl-misconfig': [
    { icon: Shield, title: 'ACL 工作原理', description: 'ACL（访问控制列表）是一组按顺序排列的规则，用于控制网络流量的允许或拒绝。ACL按顺序匹配（top-down），一旦匹配到一条规则就停止检查（first-match）。因此规则的顺序非常重要。' },
    { icon: Info, title: 'ACL 规则类型', description: '标准ACL：仅根据源IP地址过滤，编号1-99\n扩展ACL：根据源IP、目的IP、协议、端口号过滤，编号100-199\n命名ACL：用名称代替编号，更易管理\n建议将精确的规则放在前面，宽泛的规则放在后面。' },
    { icon: Activity, title: 'ACL 调试技巧', description: '1. 查看每条规则的匹配次数（hits）\n2. 使用 log 关键字记录匹配日志\n3. 在末尾添加 explicit deny 观察被拒绝的流量\n4. 先在测试环境验证再上线\n5. 注意ACL的应用方向（in/out）' },
  ],
}

const quickCmds = computed(() => {
  if (!currentLevel.value) return []
  return ['ping 192.168.1.1', 'ipconfig', 'display interface brief', 'help']
})

const selectedDevice = computed(() => {
  if (!currentLevel.value || !selectedDeviceId.value) return null
  return currentLevel.value.topology.devices.find((d: any) => d.id === selectedDeviceId.value)
})

const formattedTime = computed(() => {
  const mins = Math.floor(elapsedTime.value / 60)
  const secs = elapsedTime.value % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
})

const scoreDetails = computed(() => {
  const timeScore = Math.max(0, Math.min(100, ((180 - Math.min(elapsedTime.value, 300)) / 180) * 100))
  const accuracyScore = Math.max(0, 100 - diagnosisAttempts.value * 20)
  const fixScore = diagnosisAttempts.value === 0 ? 100 : (diagnosisAttempts.value <= 1 ? 60 : 30)
  const cmdEfficiencyScore = Math.max(0, Math.min(100, (5 / Math.max(commandCount.value, 1)) * 100))
  const total = Math.round((timeScore + accuracyScore + fixScore + cmdEfficiencyScore) / 4)
  let stars = 0
  if (total >= 90) stars = 3
  else if (total >= 70) stars = 2
  else if (total >= 50) stars = 1
  return {
    time: Math.round(timeScore),
    accuracy: Math.round(accuracyScore),
    fix: fixScore,
    cmdEfficiency: Math.round(cmdEfficiencyScore),
    total,
    stars,
  }
})

const currentKnowledgeCards = computed(() => {
  if (!currentLevel.value) return []
  const faultType = currentLevel.value.fault.type
  return knowledgeBase[faultType] || knowledgeBase['cable-unplugged'].slice(0, 2)
})

function loadProgress() {
  try {
    const saved = localStorage.getItem('ops-sim-progress')
    if (saved) {
      const data = JSON.parse(saved)
      progressData.value = { ...progressData.value, ...data }
      progressData.value.completedLevels.forEach((id) => {
        completed.value[id] = true
      })
    }
  } catch (e) {
    // ignore
  }
}

function saveProgress() {
  try {
    localStorage.setItem('ops-sim-progress', JSON.stringify(progressData.value))
  } catch (e) {
    // ignore
  }
}

const showClearConfirm = ref(false)

function clearProgress() {
  localStorage.removeItem('ops-sim-progress')
  progressData.value = {
    completedLevels: [],
    stars: {},
    bestTime: {},
    bestCommands: {},
    totalPlayTime: 0,
  }
  completed.value = {}
  showClearConfirm.value = false
}

function updateLevelProgress(levelId: number, stars: number, time: number, commands: number) {
  if (!progressData.value.completedLevels.includes(levelId)) {
    progressData.value.completedLevels.push(levelId)
    completed.value[levelId] = true
  }
  if (!progressData.value.stars[levelId] || stars > progressData.value.stars[levelId]) {
    progressData.value.stars[levelId] = stars
  }
  if (!progressData.value.bestTime[levelId] || time < progressData.value.bestTime[levelId]) {
    progressData.value.bestTime[levelId] = time
  }
  if (!progressData.value.bestCommands[levelId] || commands < progressData.value.bestCommands[levelId]) {
    progressData.value.bestCommands[levelId] = commands
  }
  progressData.value.totalPlayTime += time
  saveProgress()
}

function startTimer() {
  if (timerInterval) clearInterval(timerInterval)
  timerInterval = window.setInterval(() => {
    elapsedTime.value++
  }, 1000)
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

function resetState() {
  foundFault.value = false
  fixed.value = false
  hintIndex.value = 0
  showCompleteModal.value = false
  showCelebration.value = false
  deviceContext.value = 'pc'
  deviceName.value = '本地电脑'
  elapsedTime.value = 0
  errorCount.value = 0
  commandCount.value = 0
  selectedDeviceId.value = null
  viewMode.value = 'global'
  rightPanelTab.value = 'device'
  terminalMinimized.value = false
  terminalHeight.value = 280
  commandHistory.value = []
  diagnosisAttempts.value = 0
  excludedDiagnoses.value = []
  expandedLayers.value = ['physical', 'datalink', 'network', 'application']
  diagnosisShake.value = false
  starsLit.value = 0
  expandedKnowledgeCards.value = [0]
  terminalRef.value?.setPrompt('C:\\Users\\Admin>')
  terminalRef.value?.clear()
}

function showHintFn() {
  const lv = currentLevel.value
  if (!lv) return
  const hints = lv.hint ? [lv.hint] : ['查看当前配置，找到异常']
  if (hintIndex.value < hints.length) {
    terminalRef.value?.addLine(`提示：${hints[hintIndex.value]}`, 'system')
    hintIndex.value++
  } else {
    terminalRef.value?.addLine('已经没有更多提示了', 'system')
  }
}

function runTool(cmd: string) {
  terminalRef.value?.focus()
  const input = document.querySelector('.terminal-input') as HTMLInputElement
  if (input) {
    input.value = cmd
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
  }
}

function triggerComplete(type = 'normal') {
  currentCompleteType.value = type
  stopTimer()
  if (currentLevel.value && currentLevel.value.fault.type !== 'none') {
    const { stars, total } = scoreDetails.value
    finalScore.value = total
    updateLevelProgress(currentLevel.value.id, stars, elapsedTime.value, commandCount.value)
    startCelebration()
  } else {
    showCompleteModal.value = true
    if (currentLevel.value) {
      completed.value[currentLevel.value.id] = true
    }
  }
}

function startCelebration() {
  showCelebration.value = true
  starsLit.value = 0
  const totalStars = scoreDetails.value.stars
  setTimeout(() => {
    let lit = 0
    const interval = setInterval(() => {
      if (lit < totalStars) {
        lit++
        starsLit.value = lit
      } else {
        clearInterval(interval)
      }
    }, 400)
  }, 800)
  setTimeout(() => {
    showCelebration.value = false
    enterReview()
  }, 2800)
}

function getCommands(level: any, ctx: string): Record<string, (args: string) => string> {
  const fault = level.fault
  const baseCommands: Record<string, (args: string) => string> = {
    help: () => {
      if (ctx === 'pc') return '可用命令:\n  ping <IP/域名>     — 测试网络连通性\n  ipconfig            — 查看本机 IP 配置\n  tracert <IP/域名>   — 追踪路由路径\n  nslookup <域名>     — 测试 DNS 解析\n  netstat             — 查看网络连接\n  telnet <IP>         — 远程登录设备\n  cls / clear          — 清屏'
      if (ctx === 'switch') return '可用命令:\n  show vlan brief               — 查看 VLAN 配置\n  show mac-address-table        — 查看 MAC 地址表\n  show interfaces               — 查看接口状态\n  show running-config           — 查看运行配置\n  show port <num>               — 查看端口详情\n  configure terminal            — 进入配置模式\n  exit                          — 返回'
      if (ctx === 'firewall') return '可用命令:\n  show access-list        — 查看 ACL 规则\n  show running-config     — 查看当前配置\n  configure terminal      — 进入配置模式\n  exit                    — 返回'
      return '可用命令:\n  show running-config     — 查看配置\n  show interfaces         — 查看接口\n  ping <IP>               — 测试连通性\n  exit                    — 返回'
    },
    cls: () => '',
    clear: () => '',
    ping: (args: string) => {
      if (!args) return '用法: ping [-t] [-a] [-n count] [-l size] <目标IP/域名>'
      let result = ''
      if (fault.type === 'dns-down' && !args.match(/^\d/)) {
        result = '!ERROR:ping 请求找不到主机 ' + args + '。请检查名称然后重试。'
      } else if (fault.type === 'ip-conflict') {
        result = '!WARN:来自 192.168.1.15 的回复: 无法访问目标主机\n!WARN:来自 192.168.1.15 的回复: TTL 传输中过期\n!INFO:检测到 IP 地址冲突。'
      } else if (fault.type === 'uplink-down' || fault.type === 'cable-unplugged') {
        result = args === '192.168.1.1' || args.startsWith('192.168')
          ? '!ERROR:请求超时\n!ERROR:请求超时\n!ERROR:请求超时\n!INFO:对 192.168.1.1 的 Ping 统计信息:\n    数据包: 已发送 = 4，已接收 = 0，丢失 = 4 (100% 丢失)'
          : '!ERROR:请求超时'
      } else if (fault.type === 'port-disabled') {
        result = '!ERROR:请求超时\n!ERROR:请求超时\n!ERROR:请求超时\n!INFO:对 192.168.1.1 的 Ping 统计信息:\n    数据包: 已发送 = 4，已接收 = 0，丢失 = 4 (100% 丢失)\n!INFO:DHCP 获取 IP 失败，使用自动配置地址。'
      } else if (fault.type === 'vlan-mismatch') {
        result = args.includes('192.168.10')
          ? '!ERROR:请求超时'
          : '!SUCCESS:来自 192.168.1.1 的回复: 字节=32 时间=2ms TTL=64'
      } else if (fault.type === 'ip-config') {
        if (args === '192.168.2.100') {
          result = '!ERROR:请求超时\n!WARN:跨子网通信需要通过网关转发，请检查默认网关配置。'
        } else if (args === '192.168.2.1') {
          result = '!ERROR:请求超时\n!INFO:子网掩码不匹配导致网关无法正确路由。'
        } else {
          result = '!SUCCESS:来自 127.0.0.1 的回复: 字节=32 时间<1ms TTL=128'
        }
      } else if (fault.type === 'sfp-fault') {
        result = '!WARN:来自核心交换机的回复: 字节=32 时间=200ms TTL=255\n!WARN:来自核心交换机的回复: 字节=32 时间=350ms TTL=255\n!ERROR:请求超时\n!WARN:来自核心交换机的回复: 字节=32 时间=500ms TTL=255\n!INFO:延迟不稳定，存在丢包现象。'
      } else {
        result = '!SUCCESS:来自 ' + args + ' 的回复: 字节=32 时间=2ms TTL=64\n!SUCCESS:来自 ' + args + ' 的回复: 字节=32 时间=1ms TTL=64'
      }
      return result
    },
    ipconfig: () => {
      let result = ''
      if (fault.type === 'cable-unplugged') {
        result = 'Windows IP 配置\n\n以太网适配器 以太网:\n   媒体状态: 媒体已断开\n   连接特定的 DNS 后缀: . . . :\n   IPv4 地址: . . . . . . . : 0.0.0.0\n   子网掩码: . . . . . . . : 0.0.0.0\n   默认网关: . . . . . . . :\n!WARN:检测到物理层连接中断，请检查网线。'
      } else if (fault.type === 'port-disabled') {
        result = 'Windows IP 配置\n\n以太网适配器 以太网:\n   自动配置 IPv4 地址: 169.254.12.34\n   子网掩码: . . . . . . . : 255.255.0.0\n   默认网关: . . . . . . . :\n!WARN:无法从 DHCP 服务器获取 IP 地址。使用自动专用地址。'
      } else if (fault.type === 'ip-conflict') {
        result = 'Windows IP 配置\n\n以太网适配器 以太网:\n   IPv4 地址: . . . . . . . : 192.168.1.15\n   子网掩码: . . . . . . . : 255.255.255.0\n   默认网关: . . . . . . . : 192.168.1.1\n!WARN:检测到 IP 地址冲突。系统检测到 192.168.1.15 已被其他设备使用。'
      } else if (fault.type === 'vlan-mismatch') {
        result = 'Windows IP 配置\n\n以太网适配器 以太网:\n   IPv4 地址: . . . . . . . : 192.168.20.12\n   子网掩码: . . . . . . . : 255.255.255.0\n   默认网关: . . . . . . . : 192.168.20.1\n!INFO:DHCP 下发的 IP 地址在 VLAN 20 网段。'
      } else if (fault.type === 'dns-down') {
        result = 'Windows IP 配置\n\n以太网适配器 以太网:\n   IPv4 地址: . . . . . . . : 192.168.1.15\n   子网掩码: . . . . . . . : 255.255.255.0\n   默认网关: . . . . . . . : 192.168.1.1\n   DNS 服务器: . . . . . . : 192.168.1.100'
      } else if (fault.type === 'ip-config') {
        result = 'Windows IP 配置\n\n以太网适配器 以太网:\n   IPv4 地址: . . . . . . . : 192.168.2.50\n   子网掩码: . . . . . . . : 255.255.0.0\n   默认网关: . . . . . . . : 192.168.2.1\n!WARN:子网掩码 255.255.0.0 与网关配置不匹配。'
      } else {
        result = 'Windows IP 配置\n\n以太网适配器 以太网:\n   IPv4 地址: . . . . . . . : 192.168.1.x\n   子网掩码: . . . . . . . : 255.255.255.0\n   默认网关: . . . . . . . : 192.168.1.1'
      }
      return result
    },
    tracert: () => {
      let result = ''
      if (fault.type === 'uplink-down') {
        result = '1  <1ms  <1ms  <1ms 192.168.1.1\n2  * * * 请求超时'
      } else {
        result = '1  <1ms  <1ms  <1ms 192.168.1.1\n2  2ms  3ms  2ms 10.0.0.1\n3  15ms  16ms  15ms ...'
      }
      return result
    },
    nslookup: (args: string) => {
      let result = ''
      if (fault.type === 'dns-down') {
        result = '*** 请求 DNS 服务器超时\n无法解析 ' + (args || '域名')
      } else {
        result = '服务器: dns.company.com\nAddress: 192.168.1.100\n名称: ' + (args || '') + '\nAddress: 1.2.3.4'
      }
      return result
    },
    netstat: () => '活动连接: (无活动连接)',
    show: (args: string) => {
      if (args.includes('vlan brief') || args.includes('vlan')) {
        if (fault.type === 'vlan-mismatch') return 'VLAN Name                             Status    Ports\n---- -------------------------------- --------- -------------------------------\n1    default                          active    Gi0/1-8, Gi0/13-24\n10   Sales                            active    Gi0/1-8\n20   R&D                              active    Gi0/9-16\n!INFO:当前端口属于 VLAN 20 (研发部)'
        if (fault.type === 'port-mapping') return 'VLAN Name                             Status    Ports\n---- -------------------------------- --------- -------------------------------\n1    default                          active    Gi0/1-24\n10   Sales                            active    Gi0/1-11, Gi0/13-24\n99   Management                        active    Gi0/12\n!WARN:端口 Gi0/12 在 VLAN 99 (管理 VLAN)，其他销售部端口在 VLAN 10'
        return 'VLAN Name                             Status    Ports\n---- -------------------------------- --------- -------------------------------\n1    default                          active    Gi0/1-24'
      }
      if (args.includes('mac-address') || args.includes('mac')) {
        if (fault.type === 'port-mapping') return '  Mac Address Table\n-------------------------------------------\n  Vlan    Mac Address       Type        Ports\n  ----    -----------       --------    -----\n  10      aaaa.bbbb.cccc    DYNAMIC     Gi0/5\n  99      xxxx.yyyy.zzzz    DYNAMIC     Gi0/12\n!INFO:A-03 工位的 MAC 地址出现在 Gi0/12 (VLAN 99)，应属于 VLAN 10'
        return '  Mac Address Table\n-------------------------------------------\n  Vlan    Mac Address       Type        Ports\n  ----    -----------       --------    -----\n  1       aaaa.bbbb.cccc    DYNAMIC     Gi0/1'
      }
      if (args.includes('interface') || args.includes('int')) {
        if (fault.type === 'sfp-fault') return 'GigabitEthernet1/0/1 is up, line protocol is up (unstable)\n  Hardware: SFP-10GBase-LR, MAC: xxxx.xxxx.xxxx\n  Internet address: 10.0.1.1/30\n  MTU 1500 bytes\n  RX packets: 1523340, errors: 1287, CRC errors: 1245\n!WARN:CRC 错误计数 1245 且持续增长。光模块接收功率: -18.5dBm (异常)'
        return 'GigabitEthernet1/0/1 is up, line protocol is up\n  Hardware: SFP-10GBase-LR\n  MTU 1500 bytes\n  RX packets: 1523340, errors: 0'
      }
      if (args.includes('running-config') || args.includes('run')) {
        if (ctx === 'firewall' && fault.type === 'acl-misconfig') return '! 防火墙运行配置\n!\naccess-list 100 permit tcp host 10.0.0.10 host 10.0.10.50 eq 8443\naccess-list 100 permit tcp host 10.0.0.11 host 10.0.10.50 eq 8443\naccess-list 100 deny   ip 10.0.0.0 0.0.255.255 any\naccess-list 100 permit ip any any\n!WARN:ACL 规则 5 (deny) 在规则 2-3 (permit) 之后，permit 规则已匹配 13 次，deny 匹配 0 次'
        return '! 运行配置...\n! (内容已省略)'
      }
      if (args.includes('access-list') || args.includes('acl')) {
        if (fault.type === 'acl-misconfig') return 'Extended IP access list 100\n    10 permit tcp host 10.0.0.10 host 10.0.10.50 eq 8443 (13 matches)\n    20 permit tcp host 10.0.0.11 host 10.0.10.50 eq 8443 (8 matches)\n    30 deny   ip 10.0.0.0 0.0.255.255 any (0 matches)\n    40 permit ip any any (1523 matches)\n!INFO:ACL 当前顺序允许 10.0.0.10 和 10.0.0.11 访问 HR 系统。其他 10.0.0.x 地址被 deny 规则拦截。'
      }
      if (args.includes('port') || args.includes('端口') || args.match(/Gi|Eth/)) {
        if (fault.type === 'port-disabled') return '端口 5: shutdown (管理关闭)\n端口 5 状态: down\n!WARN:端口被管理员手动关闭。'
        if (fault.type === 'uplink-down') return '端口 48 (GigabitEthernet0/48): down\n光模块: 未检测到信号\n!WARN:上联链路中断。'
        return 'GigabitEthernet0/1 is up, line protocol is up'
      }
      return '!ERROR:需要指定参数。可用: show vlan brief, show mac-address-table, show interfaces, show running-config, show port <端口号>'
    },
    telnet: (args: string) => {
      if (!args) return '!ERROR:用法: telnet <IP 地址>'
      if (args === '192.168.1.1' || args.includes('交换机') || args.includes('switch') || args.includes('firewall') || args.includes('防火墙')) {
        deviceContext.value = 'switch'
        deviceName.value = '楼层交换机'
        terminalRef.value?.setPrompt('Switch>')
        return '正在连接到 ' + args + '...\n!SUCCESS:连接成功。\n\n用户名: admin\n密码: ****\n\nSwitch> 输入 enable 进入特权模式\nSwitch> 输入 help 查看可用命令\n!INFO:输入 exit 返回本地电脑终端。'
      }
      if (args.includes('核心') || args.includes('core')) {
        deviceContext.value = 'switch'
        deviceName.value = '核心交换机'
        terminalRef.value?.setPrompt('CoreSwitch>')
        return '连接到核心交换机...\n!SUCCESS:连接成功。\n密码: ****\nCoreSwitch>'
      }
      return '!ERROR:无法连接到 ' + args + '。连接超时。'
    },
    enable: () => {
      if (deviceContext.value === 'pc') { deviceContext.value = 'switch'; terminalRef.value?.setPrompt('Switch#'); return '!SUCCESS:特权模式已开启。\nSwitch#' }
      if (deviceContext.value === 'switch' || deviceContext.value === 'firewall') {
        terminalRef.value?.setPrompt((deviceContext.value === 'switch' ? 'Switch' : 'Firewall') + '#')
        return '!SUCCESS:特权模式已开启。'
      }
      return '!SUCCESS:'
    },
    'configure terminal': () => {
      if (deviceContext.value === 'switch' || deviceContext.value === 'firewall') {
        terminalRef.value?.setPrompt((deviceContext.value === 'switch' ? 'Switch' : 'Firewall') + '(config)#')
        return '!SUCCESS:进入全局配置模式。'
      }
      return '!ERROR:当前设备不支持配置模式。'
    },
    exit: () => {
      if (deviceContext.value !== 'pc' && deviceName.value !== '本地电脑') {
        deviceContext.value = 'pc'
        deviceName.value = '本地电脑'
        terminalRef.value?.setPrompt('C:\\Users\\Admin>')
        return '!INFO:已断开远程连接，返回本地终端。'
      }
      return ''
    },
    diagnose: (args: string) => {
      if (!foundFault.value) {
        foundFault.value = true
        return '已记录诊断结果。请在操作面板确认你的诊断。'
      }
      return '请先在操作面板确认诊断结果。'
    },
    restart: () => {
      return '设备已重启... 启动完成。'
    },
  }
  return baseCommands
}

const commandHandlers = computed(() => {
  if (!currentLevel.value) return {}
  return getCommands(currentLevel.value, deviceContext.value)
})

function onCommandExecuted(cmd: string, args: string) {
  commandCount.value++
  const handlers = commandHandlers.value
  let result = ''
  if (handlers[cmd]) {
    try {
      result = handlers[cmd](args)
      if (result.includes('!ERROR:')) {
        errorCount.value++
      }
    } catch (e) {
      // ignore
    }
  } else if (cmd !== 'help' && cmd !== 'cls' && cmd !== 'clear') {
    errorCount.value++
    result = '命令未找到'
  }
  const summary = result.length > 60 ? result.substring(0, 60) + '...' : result
  commandHistory.value.push({
    time: Date.now(),
    cmd,
    args,
    result: summary.replace(/!SUCCESS:|!ERROR:|!WARN:|!INFO:/g, '').trim(),
    type: 'command',
  })
}

function startLevel(level: any) {
  currentLevel.value = level
  gameFlow.reset()
  const devs = level.topology.devices.map((d: any) => ({
    ...d,
    ipAddress: '',
    subnetMask: '255.255.255.0',
    dnsServer: '8.8.8.8',
  }))
  deviceEngine.initDevices(devs)
  if (level.deviceState) {
    Object.entries(level.deviceState).forEach(([id, state]: [string, any]) => {
      deviceEngine.updateDevice(id, state)
    })
  }
  resetState()
  gamePhase.value = 'playing'
  
  // 初始化教程
  tutorialStepIndex.value = 0
  if (level.tutorial && level.tutorial.steps?.length > 0) {
    showTutorial.value = true
  } else {
    showTutorial.value = false
  }
  
  startTimer()
}

function nextTutorialStep() {
  if (!currentLevel.value?.tutorial) return
  if (tutorialStepIndex.value < currentLevel.value.tutorial.steps.length - 1) {
    tutorialStepIndex.value++
  }
}

function prevTutorialStep() {
  if (tutorialStepIndex.value > 0) {
    tutorialStepIndex.value--
  }
}

function finishTutorial() {
  showTutorial.value = false
  // 如果是教学关卡且没有故障，直接标记为完成并进入复盘
  if (currentLevel.value?.fault.type === 'none') {
    setTimeout(() => {
      foundFault.value = true
      fixed.value = true
      enterReview()
    }, 300)
  }
}

function closeTutorial() {
  showTutorial.value = false
}

function enterReview() {
  stopTimer()
  gamePhase.value = 'review'
}

function backToSelect() {
  stopTimer()
  gamePhase.value = 'select'
  currentLevel.value = null
}

function openDiagnosisSheet() {
  showDiagnosisSheet.value = true
}

function toggleLayer(layerId: string) {
  const idx = expandedLayers.value.indexOf(layerId)
  if (idx > -1) {
    expandedLayers.value.splice(idx, 1)
  } else {
    expandedLayers.value.push(layerId)
  }
}

function toggleExclude(value: string) {
  const idx = excludedDiagnoses.value.indexOf(value)
  if (idx > -1) {
    excludedDiagnoses.value.splice(idx, 1)
  } else {
    excludedDiagnoses.value.push(value)
  }
}

function submitDiagnosis(answer: string) {
  if (!currentLevel.value) return
  if (excludedDiagnoses.value.includes(answer)) return
  if (answer === currentLevel.value.fault.type) {
    foundFault.value = true
    showDiagnosisSheet.value = false
    gameFlow.logInvestigation(answer, getAnswerLabel ? getAnswerLabel(answer) : answer, 'correct')
    gameFlow.setSubPhase('repairing')
    showFixSheet.value = true
  } else {
    diagnosisAttempts.value++
    gameFlow.logInvestigation(answer, getAnswerLabel ? getAnswerLabel(answer) : answer, 'wrong')
    errorCount.value++
    diagnosisShake.value = true
    setTimeout(() => { diagnosisShake.value = false }, 500)
    commandHistory.value.push({
      time: Date.now(),
      cmd: 'diagnose',
      args: answer,
      result: '诊断错误',
      type: 'diagnose',
    })
    if (diagnosisAttempts.value >= 3) {
      terminalRef.value?.addLine('提示：已经错了3次了，可以看看提示或者执行更多命令收集信息', 'system')
    }
  }
}

function handleFixSelect(action: FixAction) {
  showFixSheet.value = false
  gameFlow.selectedFixAction = action.type
}

function handleDeviceOperation(operation: string, value?: string) {
  if (!selectedDeviceId.value && operation !== 'view-config') return
  const deviceId = selectedDeviceId.value || ''
  const result = executeDeviceOperation(operation, deviceId, deviceEngine.deviceStates.value, value)
  terminalRef.value?.addLine(result.output, result.success ? 'success' : 'error')

  if (gameFlow.subPhase.value === 'repairing' && currentLevel.value?.fixActions) {
    const fixAction = currentLevel.value.fixActions.find((a: FixAction) => a.type === operation)
    if (fixAction) {
      if (!fixAction.to || value === fixAction.to) {
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
  const contextDeviceId = selectedDeviceId.value
  const result = executeCommand(cmd, args, contextDeviceId, deviceEngine.deviceStates.value)
  if (result.output) {
    terminalRef.value?.addLine(result.output, result.type || 'output')
  }

  if (gameFlow.subPhase.value === 'verifying' && currentLevel.value?.verifyConditions) {
    currentLevel.value.verifyConditions.forEach((cond: VerifyCondition) => {
      const condId = cond.type + ':' + cond.target
      if (!gameFlow.verifiedItems.value.includes(condId)) {
        if (result.success && cmd === cond.type && args.includes(cond.target)) {
          gameFlow.markVerified(condId)
          terminalRef.value?.addLine('✅ ' + cond.label, 'success')
        }
      }
    })

    if (gameFlow.verifiedItems.value.length >= currentLevel.value.verifyConditions.length) {
      gameFlow.setSubPhase('completed')
      triggerComplete('normal')
    }
  }
}

function handleDeviceClick(id: string) {
  selectedDeviceId.value = id
  rightPanelTab.value = 'device'
}

function startDrag(e: MouseEvent) {
  isDragging.value = true
  e.preventDefault()
}

function onMouseMove(e: MouseEvent) {
  if (!isDragging.value) return
  const container = document.querySelector('.terminal-drag-container')
  if (container) {
    const rect = container.getBoundingClientRect()
    const newHeight = rect.bottom - e.clientY
    if (newHeight >= 120 && newHeight <= 500) {
      terminalHeight.value = newHeight
    }
  }
}

function onMouseUp() {
  isDragging.value = false
}

function getDifficultyStars(difficulty: string): number {
  if (difficulty.includes('⭐⭐⭐')) return 3
  if (difficulty.includes('⭐⭐')) return 2
  if (difficulty.includes('⭐')) return 1
  return 0
}

function getDeviceTypeLabel(type: string): string {
  const map: Record<string, string> = {
    computer: '终端设备',
    switch: '交换机',
    router: '路由器',
    server: '服务器',
    firewall: '防火墙',
    wifi: '无线AP',
  }
  return map[type] || '未知设备'
}

function getStatusLabel(status?: string): string {
  if (status === 'offline') return '离线'
  if (status === 'unstable') return '不稳定'
  return '在线'
}

function getFaultDeviceName(): string {
  const lv = currentLevel.value
  if (!lv?.fault || !lv.topology) return '-'
  const device = lv.topology.devices.find((d: any) => d.id === lv.fault.device)
  return device ? device.label : lv.fault.device
}

const faultTypeLabels: Record<string, string> = {
  'cable-unplugged': '网线脱落',
  'port-disabled': '端口关闭',
  'ip-conflict': 'IP 地址冲突',
  'vlan-mismatch': 'VLAN 不匹配',
  'dns-down': 'DNS 故障',
  'uplink-down': '上联链路中断',
  'port-mapping': '端口映射错误',
  'ip-config': 'IP 配置错误',
  'sfp-fault': '光模块故障',
  'acl-misconfig': 'ACL 规则错误',
  none: '无故障',
}

function getFaultTypeLabel(type?: string): string {
  return faultTypeLabels[type || 'none'] || '未知'
}

function toggleKnowledgeCard(index: number) {
  const idx = expandedKnowledgeCards.value.indexOf(index)
  if (idx > -1) {
    expandedKnowledgeCards.value.splice(idx, 1)
  } else {
    expandedKnowledgeCards.value.push(index)
  }
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

function getLevelStars(levelId: number): number {
  return progressData.value.stars[levelId] || 0
}

onMounted(() => {
  loadProgress()
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
})

onUnmounted(() => {
  stopTimer()
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
})

watch(gamePhase, (newPhase) => {
  if (newPhase === 'playing') {
    startTimer()
  } else {
    stopTimer()
  }
})
</script>

<template>
  <div class="pixel-game-container bg-[#f5f0e8]">

    <!-- ═══ 关卡选择页 ═══ -->
    <template v-if="gamePhase === 'select'">
      <div class="select-page">
        <div class="select-header">
          <button @click="router.push('/projects')" class="back-btn">
            <ArrowLeft :size="18" />
            <span>返回项目</span>
          </button>
        </div>

        <div class="progress-section">
          <div class="progress-summary">
            <Trophy :size="14" />
            <span>已完成 {{ progressData.completedLevels.length }}/{{ levels.length }} 关</span>
            <span class="total-time">总时长: {{ formatTime(progressData.totalPlayTime) }}</span>
          </div>
          <button
            v-if="progressData.completedLevels.length > 0"
            class="clear-progress-btn"
            @click="showClearConfirm = true"
            title="清除游玩记录"
          >
            <Trash2 :size="14" />
            <span>清除记录</span>
          </button>
        </div>

        <div class="select-hero">
          <div class="hero-badge">
            <Zap :size="14" />
            <span>网络运维模拟器</span>
          </div>
          <h1 class="hero-title">
            <span class="title-accent">NETWORK</span>
            <span class="title-main">运维控制台</span>
          </h1>
          <p class="hero-desc">选择关卡，开始你的网络故障排查之旅</p>
        </div>

        <div class="level-grid">
          <div
            v-for="level in levels"
            :key="level.id"
            class="level-card"
            :class="{ 'level-completed': completed[level.id] }"
            @click="startLevel(level)"
          >
            <div class="level-card-header">
              <div class="level-num">L{{ level.id }}</div>
              <div v-if="completed[level.id]" class="level-check">
                <CheckCircle2 :size="18" />
              </div>
            </div>
            <div class="level-card-body">
              <h3 class="level-title">{{ level.title }}</h3>
              <p class="level-desc">{{ level.description }}</p>
            </div>
            <div class="level-card-footer">
              <div class="level-difficulty">
                <span v-for="i in getDifficultyStars(level.difficulty)" :key="i" class="star">★</span>
                <span v-if="getDifficultyStars(level.difficulty) === 0" class="difficulty-text">教学</span>
              </div>
              <div class="level-stars-earned">
                <Star
                  v-for="i in 3"
                  :key="i"
                  :size="12"
                  class="earned-star"
                  :class="{ active: i <= getLevelStars(level.id) }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 清除记录确认弹窗 -->
      <Teleport to="body">
        <div v-if="showClearConfirm" class="confirm-overlay" @click.self="showClearConfirm = false">
          <div class="confirm-dialog">
            <div class="confirm-icon">
              <Trash2 :size="24" />
            </div>
            <h3 class="confirm-title">清除游玩记录</h3>
            <p class="confirm-desc">确定要清除所有关卡游玩记录吗？此操作不可恢复。</p>
            <div class="confirm-actions">
              <button class="confirm-btn cancel" @click="showClearConfirm = false">取消</button>
              <button class="confirm-btn danger" @click="clearProgress()">确认清除</button>
            </div>
          </div>
        </div>
      </Teleport>
    </template>

    <!-- ═══ 游戏主界面 ═══ -->
    <template v-if="gamePhase === 'playing' && currentLevel">
      <FixSheet
        :show="showFixSheet"
        :fix-actions="currentLevel?.fixActions || []"
        :fault-type="currentLevel?.fault?.type || ''"
        :fault-device="currentLevel?.fault?.device || ''"
        @select="handleFixSelect"
        @close="showFixSheet = false"
      />
      <div class="game-layout">
        <!-- 顶部状态栏 -->
        <header class="top-bar">
          <div class="top-bar-left">
            <button class="icon-btn" @click="backToSelect">
              <ArrowLeft :size="18" />
            </button>
            <div class="level-info">
              <span class="level-name">L{{ currentLevel.id }} {{ currentLevel.title }}</span>
              <span class="level-status">{{ foundFault ? (fixed ? '已修复' : '已定位') : '排查中' }}</span>
            </div>
          </div>

          <div class="top-bar-center">
            <div class="stat-item timer">
              <Clock :size="16" />
              <span>{{ formattedTime }}</span>
            </div>
          </div>

          <div class="top-bar-right">
            <div class="stat-item error">
              <XCircle :size="16" />
              <span>{{ errorCount }}</span>
            </div>
            <div class="stat-item cmd-count">
              <TerminalIcon :size="16" />
              <span>{{ commandCount }}</span>
            </div>
            <button class="icon-btn hint-btn" @click="showHintFn" title="提示">
              <BookOpen :size="18" />
            </button>
            <div class="menu-wrapper">
              <button class="icon-btn" @click="showMenu = !showMenu">
                <MoreVertical :size="18" />
              </button>
              <div v-if="showMenu" class="menu-dropdown">
                <button @click="showMenu = false; backToSelect()">返回选关</button>
                <button @click="showMenu = false; resetState()">重新开始</button>
                <button @click="showMenu = false; enterReview()">查看复盘</button>
              </div>
            </div>
          </div>
        </header>

        <!-- 主内容区 -->
        <div class="main-content">
          <!-- 左侧工具面板 -->
          <aside class="left-panel" :class="{ collapsed: leftPanelCollapsed }">
            <button class="panel-toggle" @click="leftPanelCollapsed = !leftPanelCollapsed">
              <ChevronLeft v-if="!leftPanelCollapsed" :size="16" />
              <ChevronRight v-else :size="16" />
            </button>

            <div v-if="!leftPanelCollapsed" class="panel-title">
              <TerminalIcon :size="16" />
              <span>快捷命令</span>
            </div>

            <div class="tools-list">
              <button
                v-for="tool in tools"
                :key="tool.id"
                class="tool-btn"
                :title="tool.name"
                @click="runTool(tool.cmd)"
              >
                <component :is="tool.icon" :size="24" color="#161310" class="tool-icon" />
                <span v-if="!leftPanelCollapsed" class="tool-name">{{ tool.name }}</span>
              </button>
            </div>
          </aside>

          <!-- 中央区域 -->
          <main class="center-area">
            <!-- 拓扑图区域 -->
            <div class="topo-section">
              <div class="topo-header">
                <div class="view-tabs">
                  <button
                    class="view-tab"
                    :class="{ active: viewMode === 'global' }"
                    @click="viewMode = 'global'"
                  >
                    全局
                  </button>
                  <button
                    class="view-tab"
                    :class="{ active: viewMode === 'room' }"
                    @click="viewMode = 'room'"
                  >
                    机房
                  </button>
                  <button
                    class="view-tab"
                    :class="{ active: viewMode === 'device' }"
                    @click="viewMode = 'device'"
                  >
                    设备
                  </button>
                </div>
              </div>

              <div class="topo-content">
                <template v-if="viewMode === 'global'">
                  <TopoGraph
                    :devices="currentLevel.topology.devices"
                    :connections="currentLevel.topology.connections"
                    :highlight="selectedDeviceId || undefined"
                    :device-states="deviceEngine.deviceStates.value"
                    @click-device="handleDeviceClick"
                  />
                </template>
                <template v-else>
                  <div class="dev-placeholder">
                    <div class="placeholder-icon">
                      <Settings :size="48" />
                    </div>
                    <h3>{{ viewMode === 'room' ? '机房视图' : '设备特写' }}</h3>
                    <p>该功能开发中，敬请期待</p>
                    <button class="back-global-btn" @click="viewMode = 'global'">
                      <ChevronDown :size="16" />
                      返回全局视图
                    </button>
                  </div>
                </template>
              </div>
            </div>

            <!-- 底部终端区域 -->
            <div class="terminal-section terminal-drag-container" :style="{ height: terminalMinimized ? '40px' : terminalHeight + 'px' }">
              <div class="terminal-drag-bar" @mousedown="startDrag">
                <GripHorizontal :size="16" />
              </div>
              <div class="terminal-wrapper" v-show="!terminalMinimized">
                <Terminal
                  ref="terminalRef"
                  :commands="commandHandlers"
                  :device-name="deviceName"
                  @command="onCommandExecuted"
                />
              </div>
              <div class="terminal-minimized-bar" v-show="terminalMinimized" @click="terminalMinimized = false">
                <TerminalIcon :size="14" />
                <span>终端已收起 - 点击展开</span>
              </div>
              <button class="terminal-toggle-btn" @click="terminalMinimized = !terminalMinimized">
                <Minimize2 v-if="!terminalMinimized" :size="14" />
                <Maximize2 v-else :size="14" />
              </button>
            </div>
          </main>

          <!-- 右侧信息面板 -->
          <aside class="right-panel">
            <div class="panel-tabs">
              <button
                class="panel-tab"
                :class="{ active: rightPanelTab === 'description' }"
                @click="rightPanelTab = 'description'"
              >
                <FileText :size="16" />
                <span>关卡描述</span>
              </button>
              <button
                class="panel-tab"
                :class="{ active: rightPanelTab === 'device' }"
                @click="rightPanelTab = 'device'"
              >
                <Info :size="16" />
                <span>设备详情</span>
              </button>
              <button
                class="panel-tab"
                :class="{ active: rightPanelTab === 'operation' }"
                @click="rightPanelTab = 'operation'"
              >
                <Wrench :size="16" />
                <span>设备操作</span>
              </button>
              <button
                class="panel-tab"
                :class="{ active: rightPanelTab === 'alert' }"
                @click="rightPanelTab = 'alert'"
              >
                <AlertTriangle :size="16" />
                <span>告警列表</span>
              </button>
              <button
                class="panel-tab"
                :class="{ active: rightPanelTab === 'metric' }"
                @click="rightPanelTab = 'metric'"
              >
                <BarChart3 :size="16" />
                <span>性能指标</span>
              </button>
            </div>

            <div class="panel-content">
              <!-- 关卡描述 -->
              <div v-if="rightPanelTab === 'description'" class="level-description">
                <div class="desc-scenario">
                  <div class="desc-title">
                    <FileText :size="16" />
                    <span>故障场景</span>
                  </div>
                  <p class="desc-text">{{ currentLevel?.description || '暂无描述' }}</p>
                </div>

                <div v-if="currentLevel?.fault?.type !== 'none'" class="desc-fault">
                  <div class="desc-title fault">
                    <XCircle :size="16" />
                    <span>异常表现</span>
                  </div>
                  <div class="fault-detail">
                    <div class="fault-row">
                      <span class="fault-label">故障设备</span>
                      <span class="fault-value">{{ getFaultDeviceName() }}</span>
                    </div>
                    <div class="fault-row">
                      <span class="fault-label">故障类型</span>
                      <span class="fault-value type-badge">{{ getFaultTypeLabel(currentLevel?.fault?.type) }}</span>
                    </div>
                    <div class="fault-desc">{{ currentLevel?.fault?.detail }}</div>
                  </div>
                </div>

                <div class="desc-hint">
                  <div class="desc-title hint">
                    <Lightbulb :size="16" />
                    <span>排查提示</span>
                  </div>
                  <p class="hint-text">{{ currentLevel?.hint || '根据现象分析可能的故障原因，使用诊断工具逐步排查。' }}</p>
                </div>

                <div class="desc-info">
                  <div class="info-chip">
                    <span class="chip-label">难度</span>
                    <span class="chip-value">{{ currentLevel?.difficulty || '-' }}</span>
                  </div>
                  <div class="info-chip">
                    <span class="chip-label">分类</span>
                    <span class="chip-value">{{ currentLevel?.category || '-' }}</span>
                  </div>
                  <div class="info-chip">
                    <span class="chip-label">设备数</span>
                    <span class="chip-value">{{ currentLevel?.topology?.devices?.length || 0 }}</span>
                  </div>
                </div>
              </div>

              <!-- 设备详情 -->
              <div v-if="rightPanelTab === 'device'" class="device-detail">
                <template v-if="selectedDevice">
                  <div class="device-detail-header">
                    <div class="device-icon-big" :class="selectedDevice.type">
                      <component :is="selectedDevice.type === 'computer' ? MonitorSmartphone : (selectedDevice.type === 'server' ? HardDrive : (selectedDevice.type === 'router' ? Wifi : Activity))" :size="28" />
                    </div>
                    <div class="device-info-main">
                      <h3 class="device-name">{{ selectedDevice.label }}</h3>
                      <span class="device-type">{{ getDeviceTypeLabel(selectedDevice.type) }}</span>
                    </div>
                  </div>
                  <div class="device-detail-body">
                    <div class="info-row">
                      <span class="info-label">状态</span>
                      <span class="info-value status" :class="selectedDevice.status || 'online'">
                        <span class="status-dot"></span>
                        {{ getStatusLabel(selectedDevice.status) }}
                      </span>
                    </div>
                    <div class="info-row">
                      <span class="info-label">端口数</span>
                      <span class="info-value">{{ selectedDevice.ports || 'N/A' }}</span>
                    </div>
                    <div class="info-row">
                      <span class="info-label">设备ID</span>
                      <span class="info-value mono">{{ selectedDevice.id }}</span>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="empty-state">
                    <Info :size="32" />
                    <p>点击拓扑图中的设备查看详情</p>
                  </div>
                </template>
              </div>

              <!-- 设备操作 -->
              <div v-if="rightPanelTab === 'operation'" class="device-operation">
                <DevicePanel
                  :device="selectedDevice"
                  :device-type="selectedDevice?.type || null"
                  @operate="handleDeviceOperation"
                />
              </div>

              <!-- 告警列表 -->
              <div v-if="rightPanelTab === 'alert'" class="alert-list">
                <div
                  v-for="alert in levelAlerts"
                  :key="alert.id"
                  class="alert-item"
                  :class="alert.level"
                >
                  <div class="alert-icon">
                    <AlertTriangle :size="16" v-if="alert.level === 'warning'" />
                    <XCircle :size="16" v-else-if="alert.level === 'critical'" />
                    <Info :size="16" v-else />
                  </div>
                  <div class="alert-content">
                    <div class="alert-title">{{ alert.title }}</div>
                    <div class="alert-desc">{{ alert.desc }}</div>
                    <div class="alert-time">{{ alert.time }}</div>
                  </div>
                </div>
              </div>

              <!-- 性能指标 -->
              <div v-if="rightPanelTab === 'metric'" class="metrics-panel">
                <div class="metric-card">
                  <div class="metric-header">
                    <Cpu :size="18" />
                    <span>CPU 使用率</span>
                  </div>
                  <div class="metric-value">{{ levelMetrics.cpu }}%</div>
                  <div class="metric-bar">
                    <div class="metric-bar-fill" :style="{ width: levelMetrics.cpu + '%' }"></div>
                  </div>
                </div>

                <div class="metric-card">
                  <div class="metric-header">
                    <HardDrive :size="18" />
                    <span>内存使用率</span>
                  </div>
                  <div class="metric-value">{{ levelMetrics.memory }}%</div>
                  <div class="metric-bar">
                    <div class="metric-bar-fill memory" :style="{ width: levelMetrics.memory + '%' }"></div>
                  </div>
                </div>

                <div class="metric-grid">
                  <div class="metric-mini">
                    <div class="metric-mini-label">带宽</div>
                    <div class="metric-mini-value">{{ levelMetrics.bandwidth }}</div>
                  </div>
                  <div class="metric-mini">
                    <div class="metric-mini-label">丢包率</div>
                    <div class="metric-mini-value warn">{{ levelMetrics.packetLoss }}</div>
                  </div>
                  <div class="metric-mini">
                    <div class="metric-mini-label">延迟</div>
                    <div class="metric-mini-value">{{ levelMetrics.latency }}</div>
                  </div>
                  <div class="metric-mini">
                    <div class="metric-mini-label">会话数</div>
                    <div class="metric-mini-value">{{ levelMetrics.sessions }}</div>
                  </div>
                </div>
              </div>

              <!-- 操作时间线 -->
              <div class="history-section">
                <div class="history-header">
                  <History :size="14" />
                  <span>操作时间线</span>
                </div>
                <div class="history-list" v-if="commandHistory.length > 0">
                  <div
                    v-for="(item, idx) in commandHistory.slice().reverse().slice(0, 10)"
                    :key="idx"
                    class="history-item"
                    :class="item.type"
                  >
                    <div class="history-cmd">{{ item.cmd }} {{ item.args }}</div>
                    <div class="history-result">{{ item.result }}</div>
                  </div>
                </div>
                <div v-else class="empty-history">
                  <span>暂无操作记录</span>
                </div>
              </div>
            </div>

            <!-- 诊断区域 -->
            <div class="diagnose-section">
              <div class="diagnose-header">
                <Stethoscope :size="16" />
                <span>故障诊断</span>
              </div>
              <template v-if="gameFlow.subPhase.value === 'investigating' && !foundFault">
                <button class="diagnose-btn" @click="openDiagnosisSheet">
                  <Stethoscope :size="16" />
                  <span>开始诊断</span>
                </button>
                <div class="diagnose-errors">错误: {{ diagnosisAttempts }}/3</div>
              </template>
              <template v-else-if="gameFlow.subPhase.value === 'repairing'">
                <div class="phase-badge repairing">
                  <Wrench :size="16" />
                  <span>修复中 — 请在「设备操作」面板执行修复</span>
                </div>
              </template>
              <template v-else-if="gameFlow.subPhase.value === 'verifying'">
                <div class="phase-badge verifying">
                  <RefreshCw :size="16" />
                  <span>验证中 — 用终端命令验证修复效果</span>
                </div>
              </template>
              <template v-else-if="foundFault">
                <div class="phase-badge done">
                  <CheckCircle2 :size="16" />
                  <span>已完成</span>
                </div>
              </template>
            </div>
          </aside>
        </div>

        <!-- 分层诊断面板 (Sheet) -->
        <Transition name="sheet-fade">
          <div v-if="showDiagnosisSheet" class="diagnosis-sheet-overlay" @click.self="showDiagnosisSheet = false">
            <Transition name="sheet-slide">
              <div v-if="showDiagnosisSheet" class="diagnosis-sheet" :class="{ shake: diagnosisShake }">
                <div class="sheet-header">
                  <h3>
                    <Stethoscope :size="18" />
                    分层诊断
                  </h3>
                  <button class="sheet-close" @click="showDiagnosisSheet = false">
                    <X :size="20" />
                  </button>
                </div>
                <div class="sheet-subtitle">
                  选择你认为的故障原因，错误 {{ diagnosisAttempts }}/3 次
                </div>
                <div class="sheet-content">
                  <div
                    v-for="layer in diagnosisLayers"
                    :key="layer.id"
                    class="diagnosis-layer"
                  >
                    <div class="layer-header" @click="toggleLayer(layer.id)">
                      <div class="layer-title" :style="{ color: layer.color }">
                        <component :is="layer.icon" :size="16" />
                        <span>{{ layer.name }}</span>
                      </div>
                      <ChevronDown
                        :size="16"
                        class="layer-arrow"
                        :class="{ expanded: expandedLayers.includes(layer.id) }"
                      />
                    </div>
                    <Transition name="layer-expand">
                      <div v-show="expandedLayers.includes(layer.id)" class="layer-options">
                        <button
                          v-for="opt in layer.options"
                          :key="opt.value"
                          class="diagnosis-option"
                          :class="{ excluded: excludedDiagnoses.includes(opt.value) }"
                          @click="submitDiagnosis(opt.value)"
                          @contextmenu.prevent="toggleExclude(opt.value)"
                        >
                          <span class="option-label">{{ opt.label }}</span>
                          <span class="exclude-btn" @click.stop="toggleExclude(opt.value)">
                            <X :size="12" />
                          </span>
                        </button>
                      </div>
                    </Transition>
                  </div>
                </div>
                <div class="sheet-footer">
                  <div class="tip-text">
                    <Lightbulb :size="12" />
                    右键点击选项可标记为已排除
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </Transition>

        <!-- 完成弹窗 -->
        <Transition name="modal-fade">
          <div v-if="showCompleteModal" class="complete-overlay" @click.self="showCompleteModal = false">
            <div class="complete-modal">
              <div class="modal-icon-wrap">
                <Trophy :size="48" />
              </div>
              <h2 class="modal-title">排障成功！</h2>
              <p class="modal-msg">你已成功修复本次故障。</p>
              <div class="modal-stats">
                <div class="modal-stat">
                  <Clock :size="16" />
                  <span>用时 {{ formattedTime }}</span>
                </div>
                <div class="modal-stat">
                  <TerminalIcon :size="16" />
                  <span>{{ commandCount }} 条命令</span>
                </div>
                <div class="modal-stat">
                  <XCircle :size="16" />
                  <span>{{ errorCount }} 次错误</span>
                </div>
              </div>
              <div class="modal-actions">
                <button class="modal-btn secondary" @click="showCompleteModal = false">继续探索</button>
                <button class="modal-btn primary" @click="showCompleteModal = false; enterReview()">
                  <BookOpen :size="16" />
                  查看复盘
                </button>
              </div>
            </div>
          </div>
        </Transition>

        <!-- 庆祝动画 -->
        <Transition name="celebration-fade">
          <div v-if="showCelebration" class="celebration-overlay">
            <div class="celebration-bg"></div>
            <div class="celebration-content">
              <div class="celebration-title">
                <Sparkles :size="24" class="sparkle-left" />
                <span>SYSTEM RESTORED</span>
                <Sparkles :size="24" class="sparkle-right" />
              </div>
              <div class="celebration-subtitle">故障已成功修复</div>
              <div class="score-card-slide">
                <div class="score-card">
                  <div class="score-stars">
                    <Star
                      v-for="i in 3"
                      :key="i"
                      :size="36"
                      class="score-star"
                      :class="{ lit: i <= starsLit }"
                    />
                  </div>
                  <div class="score-total">{{ finalScore }} 分</div>
                  <div class="score-bars">
                    <div class="score-bar-item">
                      <span class="score-bar-label">⏱️ 用时</span>
                      <div class="score-bar-bg">
                        <div class="score-bar-fill time" :style="{ width: scoreDetails.time + '%' }"></div>
                      </div>
                    </div>
                    <div class="score-bar-item">
                      <span class="score-bar-label">🎯 准确率</span>
                      <div class="score-bar-bg">
                        <div class="score-bar-fill accuracy" :style="{ width: scoreDetails.accuracy + '%' }"></div>
                      </div>
                    </div>
                    <div class="score-bar-item">
                      <span class="score-bar-label">🔧 修复方案</span>
                      <div class="score-bar-bg">
                        <div class="score-bar-fill fix" :style="{ width: scoreDetails.fix + '%' }"></div>
                      </div>
                    </div>
                    <div class="score-bar-item">
                      <span class="score-bar-label">📝 命令效率</span>
                      <div class="score-bar-bg">
                        <div class="score-bar-fill cmd" :style="{ width: scoreDetails.cmdEfficiency + '%' }"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>

        <!-- 教程引导弹窗 -->
        <Teleport to="body">
          <Transition name="tutorial-fade">
            <div v-if="showTutorial && currentTutorialStep" class="tutorial-overlay">
              <div class="tutorial-dialog">
                <div class="tutorial-header">
                  <div class="tutorial-step-indicator">
                    <span class="step-current">{{ tutorialStepIndex + 1 }}</span>
                    <span class="step-separator">/</span>
                    <span class="step-total">{{ currentLevel.tutorial.steps.length }}</span>
                  </div>
                  <button class="tutorial-close" @click="closeTutorial" title="跳过教程">
                    <X :size="18" />
                  </button>
                </div>
                
                <div class="tutorial-icon-title">
                  <h3 class="tutorial-title">{{ currentTutorialStep.title }}</h3>
                </div>
                
                <div class="tutorial-content">
                  <p v-for="(paragraph, i) in currentTutorialStep.content.split('\n\n')" :key="i" class="tutorial-paragraph">
                    {{ paragraph }}
                  </p>
                </div>
                
                <div class="tutorial-actions">
                  <button 
                    v-if="!isFirstTutorialStep" 
                    class="tutorial-btn secondary" 
                    @click="prevTutorialStep"
                  >
                    <ChevronLeft :size="16" />
                    上一步
                  </button>
                  <button 
                    v-if="isLastTutorialStep" 
                    class="tutorial-btn primary" 
                    @click="finishTutorial"
                  >
                    完成教学
                    <CheckCircle2 :size="16" />
                  </button>
                  <button 
                    v-else 
                    class="tutorial-btn primary" 
                    @click="nextTutorialStep"
                  >
                    下一步
                    <ChevronRight :size="16" />
                  </button>
                </div>
                
                <div class="tutorial-progress-dots">
                  <span 
                    v-for="(_, i) in currentLevel.tutorial.steps" 
                    :key="i" 
                    class="progress-dot"
                    :class="{ active: i === tutorialStepIndex }"
                  ></span>
                </div>
              </div>
            </div>
          </Transition>
        </Teleport>
      </div>
    </template>

    <!-- ═══ 复盘界面 ═══ -->
    <template v-if="gamePhase === 'review' && currentLevel">
      <div class="review-page">
        <div class="review-header">
          <button @click="gamePhase = 'playing'" class="back-btn">
            <ArrowLeft :size="18" />
            <span>返回游戏</span>
          </button>
        </div>

        <div class="review-content">
          <!-- 评分卡片 -->
          <div v-if="currentLevel.fault.type !== 'none'" class="review-score-card">
            <div class="score-main">
              <div class="score-big-stars">
                <Star
                  v-for="i in 3"
                  :key="i"
                  :size="48"
                  class="big-star"
                  :class="{ active: i <= scoreDetails.stars }"
                />
              </div>
              <div class="score-big-num">{{ scoreDetails.total }}</div>
              <div class="score-big-label">总分</div>
            </div>
            <div class="score-dims">
              <div class="score-dim-item">
                <div class="score-dim-header">
                  <span class="dim-icon">⏱️</span>
                  <span class="dim-name">用时评分</span>
                  <span class="dim-score">{{ scoreDetails.time }}%</span>
                </div>
                <div class="dim-bar-bg">
                  <div class="dim-bar-fill time" :style="{ width: scoreDetails.time + '%' }"></div>
                </div>
              </div>
              <div class="score-dim-item">
                <div class="score-dim-header">
                  <span class="dim-icon">🎯</span>
                  <span class="dim-name">诊断准确率</span>
                  <span class="dim-score">{{ scoreDetails.accuracy }}%</span>
                </div>
                <div class="dim-bar-bg">
                  <div class="dim-bar-fill accuracy" :style="{ width: scoreDetails.accuracy + '%' }"></div>
                </div>
              </div>
              <div class="score-dim-item">
                <div class="score-dim-header">
                  <span class="dim-icon">🔧</span>
                  <span class="dim-name">修复方案</span>
                  <span class="dim-score">{{ scoreDetails.fix }}%</span>
                </div>
                <div class="dim-bar-bg">
                  <div class="dim-bar-fill fix" :style="{ width: scoreDetails.fix + '%' }"></div>
                </div>
              </div>
              <div class="score-dim-item">
                <div class="score-dim-header">
                  <span class="dim-icon">📝</span>
                  <span class="dim-name">命令效率</span>
                  <span class="dim-score">{{ scoreDetails.cmdEfficiency }}%</span>
                </div>
                <div class="dim-bar-bg">
                  <div class="dim-bar-fill cmd" :style="{ width: scoreDetails.cmdEfficiency + '%' }"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="review-hero">
            <div class="review-badge">
              <Trophy :size="16" />
              <span>关卡完成</span>
            </div>
            <h1 class="review-title">{{ currentLevel.title }}</h1>
            <p class="review-subtitle">故障类型：{{ currentLevel.fault.detail }}</p>
          </div>

          <div class="review-stats">
            <div class="review-stat-card">
              <Clock :size="24" />
              <div class="stat-num">{{ formattedTime }}</div>
              <div class="stat-label">用时</div>
            </div>
            <div class="review-stat-card">
              <TerminalIcon :size="24" />
              <div class="stat-num">{{ commandCount }}</div>
              <div class="stat-label">执行命令</div>
            </div>
            <div class="review-stat-card">
              <XCircle :size="24" />
              <div class="stat-num">{{ errorCount }}</div>
              <div class="stat-label">错误次数</div>
            </div>
          </div>

          <div class="review-summary">
            <div class="section-header">
              <BookOpen :size="18" />
              <h2>总结</h2>
            </div>
            <p>{{ currentLevel.review.summary }}</p>
          </div>

          <div class="review-steps">
            <div class="section-header">
              <Activity :size="18" />
              <h2>排查步骤详解</h2>
            </div>
            <div class="steps-list">
              <div
                v-for="(step, i) in currentLevel.review.steps"
                :key="i"
                class="step-item"
              >
                <div class="step-num">{{ i + 1 }}</div>
                <div class="step-content">
                  <div class="step-command">
                    <code>{{ step.command }}</code>
                    <span class="step-arrow">→</span>
                    <span class="step-result">{{ step.result }}</span>
                  </div>
                  <p class="step-explanation">{{ step.explanation }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="review-optimal">
            <div class="section-header">
              <Zap :size="18" />
              <h2>更优排查路径</h2>
            </div>
            <p>{{ currentLevel.review.optimalPath }}</p>
          </div>

          <!-- 知识点扩展卡片 -->
          <div v-if="currentKnowledgeCards.length > 0" class="knowledge-section">
            <div class="section-header">
              <Lightbulb :size="18" />
              <h2>知识点扩展</h2>
            </div>
            <div class="knowledge-cards">
              <div
                v-for="(card, idx) in currentKnowledgeCards"
                :key="idx"
                class="knowledge-card"
                :class="{ expanded: expandedKnowledgeCards.includes(idx) }"
              >
                <div class="knowledge-card-header" @click="toggleKnowledgeCard(idx)">
                  <div class="knowledge-card-icon">
                    <component :is="card.icon" :size="20" />
                  </div>
                  <div class="knowledge-card-title">{{ card.title }}</div>
                  <ChevronDown
                    :size="18"
                    class="knowledge-card-arrow"
                    :class="{ expanded: expandedKnowledgeCards.includes(idx) }"
                  />
                </div>
                <Transition name="knowledge-expand">
                  <div v-show="expandedKnowledgeCards.includes(idx)" class="knowledge-card-body">
                    <p>{{ card.description }}</p>
                  </div>
                </Transition>
              </div>
            </div>
          </div>

          <div class="review-actions">
            <button class="action-btn secondary" @click="backToSelect">
              返回关卡列表
            </button>
            <button class="action-btn primary" @click="startLevel(currentLevel)">
              <Play :size="16" />
              再玩一次
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.pixel-game-container {
  position: fixed;
  inset: 0;
  background: #f5f0e8;
  color: #161310;
  font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace;
  overflow: hidden;
}

/* ═══════ 选关页面 ═══════ */
.select-page {
  position: relative;
  z-index: 10;
  height: 100%;
  overflow-y: auto;
  padding: 40px 60px;
}

.select-header {
  margin-bottom: 24px;
  display: flex;
  align-items: center;
}

.progress-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 40px;
}

.progress-summary {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  background: #fffaef;
  border: 2px solid #161310;
  color: #161310;
  font-size: 12px;
  font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace;
  box-shadow: 3px 3px 0 0 #161310;
}

.progress-summary .total-time {
  color: #3a332a;
  margin-left: 10px;
  padding-left: 10px;
  border-left: 2px solid #161310;
}

.clear-progress-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  background: #fffaef;
  border: 2px solid #161310;
  color: #161310;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace;
  box-shadow: 3px 3px 0 0 #161310;
}

.clear-progress-btn:hover {
  background: #f2ead6;
  transform: translateY(-1px);
  box-shadow: 4px 4px 0 0 #161310;
}

/* 确认弹窗 */
.confirm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(22, 19, 16, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.confirm-dialog {
  background: #fffaef;
  border: 2px solid #161310;
  padding: 32px;
  width: 360px;
  max-width: 90vw;
  text-align: center;
  box-shadow: 6px 6px 0 0 #161310;
}

.confirm-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  margin: 0 auto 16px;
  background: #f2ead6;
  border: 2px solid #161310;
  color: #2e5dd6;
}

.confirm-title {
  font-size: 18px;
  font-weight: 600;
  color: #161310;
  margin: 0 0 8px;
  font-family: 'Pixelify Sans', monospace;
}

.confirm-desc {
  font-size: 14px;
  color: #3a332a;
  margin: 0 0 24px;
  line-height: 1.5;
}

.confirm-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.confirm-btn {
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid #161310;
  font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace;
  box-shadow: 3px 3px 0 0 #161310;
}

.confirm-btn.cancel {
  background: #fffaef;
  color: #161310;
}

.confirm-btn.cancel:hover {
  background: #f2ead6;
  transform: translateY(-1px);
  box-shadow: 4px 4px 0 0 #161310;
}

.confirm-btn.danger {
  background: #2e5dd6;
  color: #fffaef;
}

.confirm-btn.danger:hover {
  transform: translateY(-1px);
  box-shadow: 4px 4px 0 0 #161310;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #fffaef;
  border: 2px solid #161310;
  color: #161310;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace;
  box-shadow: 3px 3px 0 0 #161310;
}

.back-btn:hover {
  background: #f2ead6;
  transform: translateY(-1px);
  box-shadow: 4px 4px 0 0 #161310;
}

.select-hero {
  text-align: center;
  margin-bottom: 50px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  background: #f2ead6;
  border: 2px solid #161310;
  color: #2e5dd6;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 20px;
  font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace;
  box-shadow: 3px 3px 0 0 #161310;
}

.hero-title {
  font-size: 56px;
  font-weight: 800;
  margin: 0;
  line-height: 1.1;
  letter-spacing: -2px;
  font-family: 'Pixelify Sans', monospace;
}

.title-accent {
  color: #2e5dd6;
  margin-right: 12px;
}

.title-main {
  color: #161310;
}

.hero-desc {
  color: #3a332a;
  font-size: 16px;
  margin-top: 16px;
}

.level-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.level-card {
  position: relative;
  background: #fffaef;
  border: 2px solid #161310;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: hidden;
  box-shadow: 4px 4px 0 0 #161310;
}

.level-card:hover {
  transform: translateY(-2px);
  box-shadow: 6px 6px 0 0 #161310;
}

.level-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.level-num {
  font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace;
  font-size: 14px;
  font-weight: 700;
  color: #2e5dd6;
  background: #f2ead6;
  padding: 2px 8px;
  border: 2px solid #161310;
}

.level-check {
  color: #2e5dd6;
}

.level-title {
  font-size: 17px;
  font-weight: 600;
  color: #161310;
  margin: 0 0 8px 0;
  font-family: 'Pixelify Sans', monospace;
}

.level-desc {
  font-size: 13px;
  color: #3a332a;
  line-height: 1.6;
  margin: 0 0 16px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.level-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 14px;
  border-top: 2px solid #161310;
}

.level-difficulty {
  display: flex;
  gap: 2px;
}

.star {
  color: #2e5dd6;
  font-size: 14px;
}

.difficulty-text {
  color: #2e5dd6;
  font-size: 12px;
  font-weight: 500;
  background: #f2ead6;
  padding: 2px 8px;
  border: 1px solid #161310;
}

.level-stars-earned {
  display: flex;
  gap: 2px;
}

.earned-star {
  color: #d9cdb3;
  transition: all 0.3s;
}

.earned-star.active {
  color: #2e5dd6;
  fill: #2e5dd6;
}

.level-category {
  font-size: 11px;
  color: #3a332a;
  letter-spacing: 0.5px;
}

.level-completed {
  border-color: #2e5dd6;
}

/* ═══════ 游戏主布局 ═══════ */
.game-layout {
  position: relative;
  z-index: 10;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 顶部状态栏 */
.top-bar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 56px;
  background: #fffaef;
  border-bottom: 2px solid #161310;
  flex-shrink: 0;
}

.top-bar-left,
.top-bar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.top-bar-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: #fffaef;
  border: 2px solid #161310;
  color: #161310;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 2px 2px 0 0 #161310;
}

.icon-btn:hover {
  background: #f2ead6;
  transform: translateY(-1px);
  box-shadow: 3px 3px 0 0 #161310;
}

.hint-btn:hover {
  background: #f2ead6;
}

.level-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.level-name {
  font-size: 14px;
  font-weight: 600;
  color: #161310;
  font-family: 'Pixelify Sans', monospace;
}

.level-status {
  font-size: 11px;
  color: #2e5dd6;
  letter-spacing: 0.5px;
  font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #f2ead6;
  border: 2px solid #161310;
  font-size: 13px;
  font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace;
  color: #161310;
  box-shadow: 2px 2px 0 0 #161310;
}

.stat-item.timer {
  color: #2e5dd6;
  font-weight: 600;
}

.stat-item.error {
  color: #161310;
}

.stat-item.cmd-count {
  color: #161310;
}

.menu-wrapper {
  position: relative;
}

.menu-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: #fffaef;
  border: 2px solid #161310;
  padding: 6px;
  min-width: 140px;
  z-index: 100;
  box-shadow: 4px 4px 0 0 #161310;
}

.menu-dropdown button {
  display: block;
  width: 100%;
  padding: 8px 12px;
  background: none;
  border: none;
  color: #161310;
  font-size: 13px;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s;
  font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace;
}

.menu-dropdown button:hover {
  background: #f2ead6;
  color: #2e5dd6;
}

/* 主内容区 */
.main-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* 左侧工具面板 */
.left-panel {
  position: relative;
  width: 200px;
  background: #fffaef;
  border-right: 2px solid #161310;
  display: flex;
  flex-direction: column;
  transition: width 0.3s;
  flex-shrink: 0;
}

.left-panel.collapsed {
  width: 68px;
}

.panel-toggle {
  position: absolute;
  top: 12px;
  right: -12px;
  width: 24px;
  height: 24px;
  background: #fffaef;
  border: 2px solid #161310;
  color: #161310;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: all 0.2s;
  box-shadow: 2px 2px 0 0 #161310;
}

.panel-toggle:hover {
  background: #f2ead6;
}

.tools-list {
  padding: 12px 12px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 14px 10px;
  font-family: 'Pixelify Sans', ui-monospace, monospace;
  font-size: 15px;
  font-weight: 700;
  color: #161310;
  border-bottom: 2px solid #161310;
  margin: 0 12px;
}

.tool-btn {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 14px;
  background: #fffaef;
  border: 2px solid #161310;
  color: #161310 !important;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
  font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace;
  font-weight: 600;
  box-shadow: 3px 3px 0 0 #161310;
  width: 100%;
}

.tool-btn:hover {
  background: #f2ead6;
  transform: translate(-1px, -1px);
  box-shadow: 4px 4px 0 0 #161310;
}

.tool-btn:active {
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0 0 #161310;
}

.tool-name {
  font-size: 13px;
  font-weight: 600;
}

.tool-icon {
  flex-shrink: 0;
  color: #161310 !important;
  stroke: #161310 !important;
  stroke-width: 2;
  width: 24px;
  height: 24px;
  display: block;
  min-width: 24px;
  min-height: 24px;
}

.left-panel.collapsed .tool-btn {
  justify-content: center;
  padding: 12px;
}

/* 中央区域 */
.center-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 16px;
  gap: 16px;
}

.topo-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}
.topo-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}

.view-tabs {
  display: flex;
  background: #fffaef;
  border: 2px solid #161310;
  padding: 4px;
  box-shadow: 3px 3px 0 0 #161310;
}

.view-tab {
  padding: 6px 16px;
  background: transparent;
  border: none;
  color: #3a332a;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace;
}

.view-tab:hover {
  color: #2e5dd6;
}

.view-tab.active {
  background: #2e5dd6;
  color: #fffaef;
}

.topo-content {
  flex: 1;
  min-height: 0;
  border: 2px solid #161310;
  overflow: hidden;
  background: #fffaef;
  box-shadow: 4px 4px 0 0 #161310;
}

.dev-placeholder {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fffaef;
  border: 2px dashed #161310;
  color: #3a332a;
}

.placeholder-icon {
  margin-bottom: 16px;
  opacity: 0.5;
  animation: spin 8s linear infinite;
  color: #2e5dd6;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.dev-placeholder h3 {
  font-size: 18px;
  margin: 0 0 8px 0;
  color: #161310;
  font-family: 'Pixelify Sans', monospace;
}

.dev-placeholder p {
  font-size: 13px;
  margin: 0 0 20px 0;
  color: #3a332a;
}

.back-global-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #f2ead6;
  border: 2px solid #161310;
  color: #161310;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace;
  box-shadow: 2px 2px 0 0 #161310;
}

.back-global-btn:hover {
  background: #2e5dd6;
  color: #fffaef;
  transform: translateY(-1px);
  box-shadow: 3px 3px 0 0 #161310;
}

/* 终端区域 */
.terminal-section {
  position: relative;
  flex-shrink: 0;
  transition: height 0.3s;
  border: 2px solid #161310;
  background: #fffaef;
  box-shadow: 4px 4px 0 0 #161310;
}

.terminal-drag-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: row-resize;
  color: #161310;
  z-index: 10;
  background: #f2ead6;
  border-bottom: 2px solid #161310;
}

.terminal-drag-bar:hover {
  color: #2e5dd6;
}

.terminal-wrapper {
  height: 100%;
  padding-top: 20px;
}

.terminal-toggle-btn {
  position: absolute;
  top: 24px;
  right: 12px;
  width: 28px;
  height: 28px;
  background: #fffaef;
  border: 2px solid #161310;
  color: #161310;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
  transition: all 0.2s;
  box-shadow: 2px 2px 0 0 #161310;
}

.terminal-toggle-btn:hover {
  background: #f2ead6;
}

.terminal-minimized-bar {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #f2ead6;
  color: #161310;
  font-size: 12px;
  cursor: pointer;
  font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace;
}

.terminal-minimized-bar:hover {
  background: #e2d6b8;
}

/* 右侧信息面板 */
.right-panel {
  width: 280px;
  background: #fffaef;
  border-left: 2px solid #161310;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.panel-tabs {
  display: flex;
  border-bottom: 2px solid #161310;
  padding: 0 8px;
  background: #f2ead6;
}

.panel-tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 8px;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: #161310;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: -2px;
  font-family: 'Pixelify Sans', ui-monospace, monospace;
  font-weight: 600;
}

.panel-tab:hover {
  color: #2e5dd6;
  background: rgba(46, 93, 214, 0.08);
}

.panel-tab.active {
  color: #2e5dd6;
  border-bottom-color: #2e5dd6;
  font-weight: 700;
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 设备详情 */
.device-detail-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid #161310;
}

.device-icon-big {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f2ead6;
  border: 2px solid #161310;
  color: #2e5dd6;
  box-shadow: 2px 2px 0 0 #161310;
}

.device-icon-big.switch {
  color: #2e5dd6;
}

.device-icon-big.router {
  color: #2e5dd6;
}

.device-icon-big.server {
  color: #2e5dd6;
}

.device-info-main {
  flex: 1;
  min-width: 0;
}

.device-name {
  font-size: 15px;
  font-weight: 600;
  color: #161310;
  margin: 0 0 4px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: 'Pixelify Sans', monospace;
}

.device-type {
  font-size: 12px;
  color: #3a332a;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 2px solid #f2ead6;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 12px;
  color: #3a332a;
}

.info-value {
  font-size: 13px;
  color: #161310;
}

.info-value.mono {
  font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace;
  font-size: 11px;
  color: #3a332a;
}

.info-value.status {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #2e5dd6;
  border: 2px solid #161310;
}

.status.offline .status-dot {
  background: #161310;
}

.status.offline {
  color: #161310;
}

.status.unstable .status-dot {
  background: #2e5dd6;
}

.status.unstable {
  color: #2e5dd6;
}

.status.online {
  color: #2e5dd6;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #3a332a;
  text-align: center;
}

.empty-state p {
  font-size: 12px;
  margin: 12px 0 0 0;
}

/* 关卡描述 */
.level-description {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 4px 0;
}

.desc-scenario,
.desc-fault,
.desc-hint {
  background: #f2ead6;
  border: 2px solid #161310;
  padding: 14px;
  box-shadow: 3px 3px 0 0 #161310;
}

.desc-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #2e5dd6;
  margin-bottom: 10px;
  font-family: 'Pixelify Sans', monospace;
}

.desc-title.fault {
  color: #161310;
}

.desc-title.hint {
  color: #2e5dd6;
}

.desc-text {
  font-size: 13px;
  line-height: 1.7;
  color: #161310;
  margin: 0;
}

.fault-detail {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.fault-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.fault-label {
  color: #3a332a;
  min-width: 64px;
  flex-shrink: 0;
}

.fault-value {
  color: #161310;
  font-weight: 500;
}

.fault-value.type-badge {
  display: inline-block;
  padding: 1px 10px;
  background: #fffaef;
  border: 2px solid #161310;
  font-size: 12px;
  color: #161310;
  font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace;
}

.fault-desc {
  margin-top: 6px;
  padding: 8px 10px;
  background: #fffaef;
  border-left: 2px solid #161310;
  font-size: 12px;
  line-height: 1.6;
  color: #161310;
  border: 2px solid #161310;
}

.hint-text {
  font-size: 13px;
  line-height: 1.7;
  color: #161310;
  margin: 0;
}

.desc-info {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.info-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #fffaef;
  border: 2px solid #161310;
  font-size: 12px;
  box-shadow: 2px 2px 0 0 #161310;
}

.chip-label {
  color: #3a332a;
}

.chip-value {
  color: #161310;
  font-weight: 500;
}

/* 告警列表 */
.alert-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.alert-item {
  display: flex;
  gap: 10px;
  padding: 10px 12px;
  background: #fffaef;
  border: 2px solid #161310;
  border-left-width: 4px;
  box-shadow: 2px 2px 0 0 #161310;
}

.alert-item.critical {
  border-left-color: #161310;
}

.alert-item.warning {
  border-left-color: #2e5dd6;
}

.alert-item.info {
  border-left-color: #2e5dd6;
}

.alert-icon {
  flex-shrink: 0;
  margin-top: 2px;
}

.alert-item.critical .alert-icon { color: #161310; }
.alert-item.warning .alert-icon { color: #2e5dd6; }
.alert-item.info .alert-icon { color: #2e5dd6; }

.alert-content {
  flex: 1;
  min-width: 0;
}

.alert-title {
  font-size: 12px;
  font-weight: 600;
  color: #161310;
  margin-bottom: 3px;
  font-family: 'Pixelify Sans', monospace;
}

.alert-desc {
  font-size: 11px;
  color: #3a332a;
  margin-bottom: 4px;
  line-height: 1.4;
}

.alert-time {
  font-size: 10px;
  color: #3a332a;
  font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace;
}

/* 性能指标 */
.metrics-panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.metric-card {
  padding: 12px;
  background: #f2ead6;
  border: 2px solid #161310;
  box-shadow: 3px 3px 0 0 #161310;
}

.metric-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #161310;
  margin-bottom: 8px;
  font-family: 'Pixelify Sans', monospace;
}

.metric-value {
  font-size: 24px;
  font-weight: 700;
  color: #2e5dd6;
  font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace;
  margin-bottom: 8px;
}

.metric-bar {
  height: 8px;
  background: #fffaef;
  border: 2px solid #161310;
  overflow: hidden;
}

.metric-bar-fill {
  height: 100%;
  background: #2e5dd6;
}

.metric-bar-fill.memory {
  background: #2e5dd6;
}

.metric-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.metric-mini {
  padding: 10px;
  background: #f2ead6;
  border: 2px solid #161310;
  text-align: center;
  box-shadow: 2px 2px 0 0 #161310;
}

.metric-mini-label {
  font-size: 10px;
  color: #3a332a;
  margin-bottom: 4px;
}

.metric-mini-value {
  font-size: 14px;
  font-weight: 600;
  color: #2e5dd6;
  font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace;
}

.metric-mini-value.warn {
  color: #2e5dd6;
}

/* 操作时间线 */
.history-section {
  background: #f2ead6;
  border: 2px solid #161310;
  padding: 12px;
  box-shadow: 3px 3px 0 0 #161310;
}

.history-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #161310;
  margin-bottom: 10px;
  font-family: 'Pixelify Sans', monospace;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 180px;
  overflow-y: auto;
}

.history-item {
  padding: 6px 8px;
  background: #fffaef;
  border: 2px solid #161310;
  border-left-width: 4px;
  border-left-color: #2e5dd6;
}

.history-item.diagnose {
  border-left-color: #2e5dd6;
}

.history-item.fix {
  border-left-color: #2e5dd6;
}

.history-cmd {
  font-size: 11px;
  font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace;
  color: #2e5dd6;
  margin-bottom: 2px;
}

.history-item.diagnose .history-cmd {
  color: #2e5dd6;
}

.history-item.fix .history-cmd {
  color: #2e5dd6;
}

.history-result {
  font-size: 10px;
  color: #3a332a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.empty-history {
  text-align: center;
  padding: 20px;
  color: #3a332a;
  font-size: 12px;
}

/* 诊断区域 */
.diagnose-section {
  padding: 16px;
  border-top: 2px solid #161310;
}

.diagnose-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #161310;
  margin-bottom: 12px;
  font-family: 'Pixelify Sans', cursive;
}

.diagnose-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.diagnose-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px;
  background: #fffaef;
  border: 2px solid #161310;
  border-radius: 0;
  color: #161310;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.1s;
  box-shadow: 3px 3px 0 0 #161310;
}

.diagnose-btn:hover {
  background: #f2ead6;
  transform: translate(-1px, -1px);
  box-shadow: 4px 4px 0 0 #161310;
}

.diagnose-btn:active {
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0 0 #161310;
}

.attempts-info {
  text-align: center;
  font-size: 11px;
  color: #d94848;
  font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace;
}

.diagnose-result {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: #d4edda;
  border: 2px solid #161310;
  border-radius: 0;
  color: #161310;
  font-size: 13px;
  font-weight: 500;
  box-shadow: 3px 3px 0 0 #161310;
}

/* 分层诊断 Sheet */
.diagnosis-sheet-overlay {
  position: fixed;
  inset: 0;
  background: rgba(22, 19, 16, 0.6);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
}

.diagnosis-sheet {
  width: 380px;
  max-width: 100%;
  height: 100%;
  background: #f5f0e8;
  border-left: 2px solid #161310;
  display: flex;
  flex-direction: column;
}

.diagnosis-sheet.shake {
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
  20%, 40%, 60%, 80% { transform: translateX(8px); }
}

.sheet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 2px solid #161310;
  background: #fffaef;
}

.sheet-header h3 {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #161310;
  font-family: 'Pixelify Sans', cursive;
}

.sheet-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #fffaef;
  border: 2px solid #161310;
  border-radius: 0;
  color: #161310;
  cursor: pointer;
  transition: all 0.1s;
  box-shadow: 2px 2px 0 0 #161310;
}

.sheet-close:hover {
  background: #f2ead6;
  transform: translate(-1px, -1px);
  box-shadow: 3px 3px 0 0 #161310;
}

.sheet-subtitle {
  padding: 12px 20px;
  font-size: 12px;
  color: #3a332a;
  border-bottom: 2px solid #161310;
}

.sheet-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.diagnosis-layer {
  margin-bottom: 12px;
  background: #fffaef;
  border: 2px solid #161310;
  border-radius: 0;
  overflow: hidden;
  box-shadow: 3px 3px 0 0 #161310;
}

.layer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  cursor: pointer;
  transition: background 0.1s;
}

.layer-header:hover {
  background: #f2ead6;
}

.layer-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  font-weight: 600;
  color: #161310;
}

.layer-arrow {
  color: #3a332a;
  transition: transform 0.3s;
}

.layer-arrow.expanded {
  transform: rotate(180deg);
}

.layer-options {
  padding: 0 14px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.diagnosis-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  background: #f5f0e8;
  border: 2px solid #161310;
  border-radius: 0;
  color: #161310;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.1s;
  text-align: left;
}

.diagnosis-option:hover {
  background: #fffaef;
  transform: translate(-1px, -1px);
  box-shadow: 3px 3px 0 0 #161310;
}

.diagnosis-option.excluded {
  opacity: 0.4;
  text-decoration: line-through;
}

.diagnosis-option.excluded:hover {
  background: #ffe0e0;
}

.option-label {
  flex: 1;
}

.exclude-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 0;
  color: #3a332a;
  opacity: 0;
  transition: all 0.1s;
}

.diagnosis-option:hover .exclude-btn {
  opacity: 1;
}

.exclude-btn:hover {
  background: #d94848;
  color: #fffaef;
}

.sheet-footer {
  padding: 16px 20px;
  border-top: 2px solid #161310;
  background: #fffaef;
}

.tip-text {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #3a332a;
  justify-content: center;
}

/* Sheet 动画 */
.sheet-fade-enter-active,
.sheet-fade-leave-active {
  transition: opacity 0.3s;
}

.sheet-fade-enter-from,
.sheet-fade-leave-to {
  opacity: 0;
}

.sheet-slide-enter-active,
.sheet-slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.sheet-slide-enter-from,
.sheet-slide-leave-to {
  transform: translateX(100%);
}

.layer-expand-enter-active,
.layer-expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.layer-expand-enter-from,
.layer-expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.layer-expand-enter-to,
.layer-expand-leave-from {
  max-height: 200px;
}

/* 完成弹窗 */
.complete-overlay {
  position: fixed;
  inset: 0;
  background: rgba(22, 19, 16, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.complete-modal {
  position: relative;
  width: 90%;
  max-width: 420px;
  background: #f5f0e8;
  border: 2px solid #161310;
  border-radius: 0;
  padding: 40px 32px;
  text-align: center;
  box-shadow: 6px 6px 0 0 #161310;
}

.modal-icon-wrap {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  background: #fffaef;
  border: 2px solid #161310;
  border-radius: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f5a623;
  box-shadow: 3px 3px 0 0 #161310;
}

.modal-title {
  font-size: 24px;
  font-weight: 700;
  color: #161310;
  margin: 0 0 10px 0;
  font-family: 'Pixelify Sans', cursive;
}

.modal-msg {
  font-size: 14px;
  color: #3a332a;
  margin: 0 0 24px 0;
}

.modal-stats {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 28px;
}

.modal-stat {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #3a332a;
}

.modal-actions {
  display: flex;
  gap: 12px;
}

.modal-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 0;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.1s;
  border: 2px solid #161310;
}

.modal-btn.secondary {
  background: #fffaef;
  color: #161310;
  box-shadow: 3px 3px 0 0 #161310;
}

.modal-btn.secondary:hover {
  background: #f2ead6;
  transform: translate(-1px, -1px);
  box-shadow: 4px 4px 0 0 #161310;
}

.modal-btn.primary {
  background: #2e5dd6;
  color: #fffaef;
  box-shadow: 3px 3px 0 0 #161310;
}

.modal-btn.primary:hover {
  background: #2550b8;
  transform: translate(-1px, -1px);
  box-shadow: 4px 4px 0 0 #161310;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* 庆祝动画 */
.celebration-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.celebration-bg {
  position: absolute;
  inset: 0;
  background: #f5f0e8;
}

.celebration-content {
  position: relative;
  z-index: 10;
  text-align: center;
}

.celebration-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  font-size: 48px;
  font-weight: 800;
  color: #2e5dd6;
  letter-spacing: 4px;
  margin-bottom: 8px;
  animation: pixelPulse 2s ease-in-out infinite;
  font-family: 'Pixelify Sans', cursive;
}

@keyframes pixelPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.sparkle-left,
.sparkle-right {
  color: #f5a623;
  animation: sparkle 1.5s ease-in-out infinite;
}

.sparkle-right {
  animation-delay: 0.5s;
}

@keyframes sparkle {
  0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
  50% { transform: scale(1.2) rotate(15deg); opacity: 0.7; }
}

.celebration-subtitle {
  font-size: 16px;
  color: #3a332a;
  margin-bottom: 40px;
}

.score-card-slide {
  animation: slideUp 1s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(100px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.score-card {
  width: 360px;
  background: #fffaef;
  border: 2px solid #161310;
  border-radius: 0;
  padding: 32px;
  box-shadow: 6px 6px 0 0 #161310;
}

.score-stars {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 16px;
}

.score-star {
  color: #d4c9b5;
  transition: all 0.3s;
}

.score-star.lit {
  color: #f5a623;
  fill: #f5a623;
  animation: starPop 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes starPop {
  0% { transform: scale(0); }
  70% { transform: scale(1.3); }
  100% { transform: scale(1); }
}

.score-total {
  font-size: 36px;
  font-weight: 700;
  color: #161310;
  font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace;
  margin-bottom: 24px;
}

.score-bars {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.score-bar-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.score-bar-label {
  font-size: 11px;
  color: #3a332a;
  white-space: nowrap;
  width: 70px;
  text-align: right;
}

.score-bar-bg {
  flex: 1;
  height: 8px;
  background: #f2ead6;
  border: 1px solid #161310;
  border-radius: 0;
  overflow: hidden;
}

.score-bar-fill {
  height: 100%;
  border-radius: 0;
  transition: width 1s ease-out;
}

.score-bar-fill.time {
  background: #2e5dd6;
}

.score-bar-fill.accuracy {
  background: #9c27b0;
}

.score-bar-fill.fix {
  background: #4caf50;
}

.score-bar-fill.cmd {
  background: #f5a623;
}

.celebration-fade-enter-active,
.celebration-fade-leave-active {
  transition: opacity 0.5s;
}

.celebration-fade-enter-from,
.celebration-fade-leave-to {
  opacity: 0;
}

/* ═══════ 复盘页面 ═══════ */
.review-page {
  position: relative;
  z-index: 10;
  height: 100%;
  overflow-y: auto;
  padding: 40px 60px;
}

.review-header {
  margin-bottom: 40px;
}

.review-content {
  max-width: 800px;
  margin: 0 auto;
}

/* 评分卡片 */
.review-score-card {
  display: flex;
  gap: 32px;
  background: #fffaef;
  border: 2px solid #161310;
  border-radius: 0;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 4px 4px 0 0 #161310;
}

.score-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 180px;
  padding-right: 32px;
  border-right: 2px solid #161310;
}

.score-big-stars {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.big-star {
  color: #d4c9b5;
  transition: all 0.3s;
}

.big-star.active {
  color: #f5a623;
  fill: #f5a623;
}

.score-big-num {
  font-size: 48px;
  font-weight: 800;
  color: #161310;
  font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace;
  line-height: 1;
  margin-bottom: 4px;
}

.score-big-label {
  font-size: 12px;
  color: #3a332a;
  letter-spacing: 2px;
  text-transform: uppercase;
  font-family: 'Pixelify Sans', cursive;
}

.score-dims {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
}

.score-dim-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.score-dim-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dim-icon {
  font-size: 14px;
}

.dim-name {
  flex: 1;
  font-size: 13px;
  color: #3a332a;
}

.dim-score {
  font-size: 13px;
  font-weight: 600;
  color: #161310;
  font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace;
}

.dim-bar-bg {
  height: 8px;
  background: #f2ead6;
  border: 1px solid #161310;
  border-radius: 0;
  overflow: hidden;
}

.dim-bar-fill {
  height: 100%;
  border-radius: 0;
  transition: width 1s ease-out;
}

.dim-bar-fill.time {
  background: #2e5dd6;
}

.dim-bar-fill.accuracy {
  background: #9c27b0;
}

.dim-bar-fill.fix {
  background: #4caf50;
}

.dim-bar-fill.cmd {
  background: #f5a623;
}

.review-hero {
  text-align: center;
  margin-bottom: 40px;
}

.review-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  background: #d4edda;
  border: 2px solid #161310;
  border-radius: 0;
  color: #161310;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 20px;
  box-shadow: 3px 3px 0 0 #161310;
  font-family: 'Pixelify Sans', cursive;
}

.review-title {
  font-size: 36px;
  font-weight: 700;
  color: #161310;
  margin: 0 0 10px 0;
  font-family: 'Pixelify Sans', cursive;
}

.review-subtitle {
  font-size: 14px;
  color: #3a332a;
  margin: 0;
}

.review-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 40px;
}

.review-stat-card {
  background: #fffaef;
  border: 2px solid #161310;
  border-radius: 0;
  padding: 24px;
  text-align: center;
  box-shadow: 3px 3px 0 0 #161310;
}

.review-stat-card svg {
  color: #2e5dd6;
  margin-bottom: 12px;
}

.stat-num {
  font-size: 28px;
  font-weight: 700;
  color: #161310;
  font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #3a332a;
}

.review-summary,
.review-steps,
.review-optimal,
.knowledge-section {
  background: #fffaef;
  border: 2px solid #161310;
  border-radius: 0;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 4px 4px 0 0 #161310;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #161310;
}

.section-header h2 {
  font-size: 16px;
  font-weight: 600;
  color: #161310;
  margin: 0;
  font-family: 'Pixelify Sans', cursive;
}

.section-header svg {
  color: #2e5dd6;
}

.review-summary p,
.review-optimal p {
  color: #3a332a;
  line-height: 1.8;
  font-size: 14px;
  margin: 0;
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.step-item {
  display: flex;
  gap: 16px;
}

.step-num {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  background: #2e5dd6;
  border: 2px solid #161310;
  border-radius: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: #fffaef;
  font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace;
  box-shadow: 2px 2px 0 0 #161310;
}

.step-content {
  flex: 1;
}

.step-command {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.step-command code {
  padding: 4px 10px;
  background: #f2ead6;
  border: 1px solid #161310;
  border-radius: 0;
  color: #161310;
  font-size: 12px;
  font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace;
}

.step-arrow {
  color: #3a332a;
}

.step-result {
  font-size: 12px;
  color: #3a332a;
}

.step-explanation {
  font-size: 13px;
  color: #3a332a;
  line-height: 1.7;
  margin: 0;
}

.review-optimal {
  border-color: #161310;
}

.review-optimal .section-header svg {
  color: #4caf50;
}

/* 知识点卡片 */
.knowledge-section .section-header svg {
  color: #f5a623;
}

.knowledge-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.knowledge-card {
  background: #f5f0e8;
  border: 2px solid #161310;
  border-radius: 0;
  overflow: hidden;
  transition: all 0.1s;
  box-shadow: 3px 3px 0 0 #161310;
}

.knowledge-card:hover {
  transform: translate(-1px, -1px);
  box-shadow: 4px 4px 0 0 #161310;
}

.knowledge-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  cursor: pointer;
  transition: background 0.1s;
}

.knowledge-card-header:hover {
  background: #f2ead6;
}

.knowledge-card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: #fffaef;
  border: 2px solid #161310;
  border-radius: 0;
  color: #f5a623;
  box-shadow: 2px 2px 0 0 #161310;
}

.knowledge-card-title {
  flex: 1;
  font-size: 14px;
  font-weight: 600;
  color: #161310;
}

.knowledge-card-arrow {
  color: #3a332a;
  transition: transform 0.3s;
}

.knowledge-card-arrow.expanded {
  transform: rotate(180deg);
}

.knowledge-card-body {
  padding: 0 16px 16px 64px;
}

.knowledge-card-body p {
  font-size: 13px;
  color: #3a332a;
  line-height: 1.8;
  margin: 0;
  white-space: pre-line;
}

.knowledge-expand-enter-active,
.knowledge-expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.knowledge-expand-enter-from,
.knowledge-expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.knowledge-expand-enter-to,
.knowledge-expand-leave-from {
  max-height: 300px;
}

.review-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 40px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  border-radius: 0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.1s;
  border: 2px solid #161310;
}

.action-btn.secondary {
  background: #fffaef;
  color: #161310;
  box-shadow: 3px 3px 0 0 #161310;
}

.action-btn.secondary:hover {
  background: #f2ead6;
  transform: translate(-1px, -1px);
  box-shadow: 4px 4px 0 0 #161310;
}

.action-btn.primary {
  background: #2e5dd6;
  color: #fffaef;
  box-shadow: 3px 3px 0 0 #161310;
}

.action-btn.primary:hover {
  background: #2550b8;
  transform: translate(-1px, -1px);
  box-shadow: 4px 4px 0 0 #161310;
}

/* 滚动条 */
.panel-content::-webkit-scrollbar,
.select-page::-webkit-scrollbar,
.review-page::-webkit-scrollbar,
.sheet-content::-webkit-scrollbar,
.history-list::-webkit-scrollbar {
  width: 8px;
}

.panel-content::-webkit-scrollbar-track,
.select-page::-webkit-scrollbar-track,
.review-page::-webkit-scrollbar-track,
.sheet-content::-webkit-scrollbar-track,
.history-list::-webkit-scrollbar-track {
  background: #f2ead6;
  border-left: 1px solid #161310;
}

.panel-content::-webkit-scrollbar-thumb,
.select-page::-webkit-scrollbar-thumb,
.review-page::-webkit-scrollbar-thumb,
.sheet-content::-webkit-scrollbar-thumb,
.history-list::-webkit-scrollbar-thumb {
  background: #2e5dd6;
  border: 1px solid #161310;
  border-radius: 0;
}

.panel-content::-webkit-scrollbar-thumb:hover,
.select-page::-webkit-scrollbar-thumb:hover,
.review-page::-webkit-scrollbar-thumb:hover,
.sheet-content::-webkit-scrollbar-thumb:hover,
.history-list::-webkit-scrollbar-thumb:hover {
  background: #2550b8;
}

/* 响应式 */
@media (max-width: 1200px) {
  .right-panel {
    width: 240px;
  }
  .left-panel {
    width: 60px;
  }
  .tool-name {
    display: none;
  }
  .panel-toggle {
    display: none;
  }
}

@media (max-width: 900px) {
  .right-panel {
    display: none;
  }
}

/* 阶段标识 */
.phase-badge {
  display: flex; align-items: center; gap: 8px; padding: 10px 14px;
  border-radius: 0; font-size: 12px; font-weight: 500;
  border: 2px solid #161310;
  box-shadow: 2px 2px 0 0 #161310;
}
.phase-badge.repairing { background: #e3f2fd; color: #161310; }
.phase-badge.verifying { background: #fff3e0; color: #161310; }
.phase-badge.done { background: #e8f5e9; color: #161310; }
.verify-section { padding: 12px; border-top: 2px solid #161310; }

@media (max-width: 768px) {
  .verify-section { padding: 8px; }
  .fix-sheet { width: 95vw; padding: 20px; }
  .fix-option { padding: 12px 14px; }
  .device-panel { gap: 12px; }
  .op-btn { padding: 8px 10px; font-size: 12px; }
}

/* ═══════ 教程引导弹窗 ═══════ */
.tutorial-overlay {
  position: fixed;
  inset: 0;
  background: rgba(22, 19, 16, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(2px);
}

.tutorial-dialog {
  background: #fffaef;
  border: 3px solid #161310;
  box-shadow: 6px 6px 0 0 #161310;
  width: 90%;
  max-width: 480px;
  padding: 24px;
  position: relative;
}

.tutorial-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.tutorial-step-indicator {
  font-family: 'Pixelify Sans', ui-monospace, monospace;
  font-size: 14px;
  font-weight: 600;
  color: #6a5f52;
}

.step-current {
  color: #161310;
  font-size: 18px;
}

.step-separator {
  margin: 0 4px;
  color: #a89888;
}

.tutorial-close {
  width: 32px;
  height: 32px;
  border: 2px solid #161310;
  background: #f5e6d0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
  color: #161310;
}

.tutorial-close:hover {
  background: #e8d5b8;
  transform: translate(-1px, -1px);
  box-shadow: 2px 2px 0 0 #161310;
}

.tutorial-icon-title {
  margin-bottom: 16px;
}

.tutorial-title {
  font-family: 'Pixelify Sans', ui-monospace, monospace;
  font-size: 20px;
  font-weight: 700;
  color: #161310;
  margin: 0;
  line-height: 1.4;
}

.tutorial-content {
  margin-bottom: 24px;
  min-height: 120px;
}

.tutorial-paragraph {
  font-size: 14px;
  line-height: 1.7;
  color: #3a332a;
  margin: 0 0 12px 0;
  white-space: pre-wrap;
}

.tutorial-paragraph:last-child {
  margin-bottom: 0;
}

.tutorial-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  margin-bottom: 16px;
}

.tutorial-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  font-family: 'Pixelify Sans', ui-monospace, monospace;
  font-size: 14px;
  font-weight: 600;
  border: 2px solid #161310;
  cursor: pointer;
  transition: all 0.15s;
}

.tutorial-btn.secondary {
  background: #f5e6d0;
  color: #161310;
  box-shadow: 3px 3px 0 0 #161310;
}

.tutorial-btn.secondary:hover {
  background: #e8d5b8;
  transform: translate(-1px, -1px);
  box-shadow: 4px 4px 0 0 #161310;
}

.tutorial-btn.primary {
  background: #4a7c59;
  color: #fffaef;
  box-shadow: 3px 3px 0 0 #161310;
}

.tutorial-btn.primary:hover {
  background: #3a6a49;
  transform: translate(-1px, -1px);
  box-shadow: 4px 4px 0 0 #161310;
}

.tutorial-progress-dots {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.progress-dot {
  width: 10px;
  height: 10px;
  background: #d4c8b8;
  border: 2px solid #161310;
  transition: all 0.2s;
}

.progress-dot.active {
  background: #4a7c59;
  transform: scale(1.2);
}

.tutorial-fade-enter-active,
.tutorial-fade-leave-active {
  transition: opacity 0.25s ease;
}

.tutorial-fade-enter-from,
.tutorial-fade-leave-to {
  opacity: 0;
}
</style>
