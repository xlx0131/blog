<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { levels } from '@/data/network-levels.js'
import TopoGraph from '@/components/TopoGraph.vue'
import Terminal from '@/components/Terminal.vue'

const router = useRouter()
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

const quickCmds = computed(() => {
  if (!currentLevel.value) return []
  return ['ping 192.168.1.1', 'ipconfig', 'display interface brief', 'help']
})

function resetState() {
  foundFault.value = false
  fixed.value = false
  hintIndex.value = 0
  showCompleteModal.value = false
  deviceContext.value = 'pc'
  deviceName.value = '本地电脑'
  terminalRef.value?.setPrompt('C:\\Users\\Admin>')
  terminalRef.value?.clear()
}

function showHintFn() {
  const lv = currentLevel.value
  if (!lv) return
  const hints = lv.hint ? [lv.hint] : ['查看当前配置，找到异常']
  if (hintIndex.value < hints.length) {
    terminalRef.value?.addLine(`💡 提示：${hints[hintIndex.value]}`, 'system')
    hintIndex.value++
  } else {
    terminalRef.value?.addLine('💡 已经没有更多提示了', 'system')
  }
}

function runQuickCmd(cmd: string) {
  terminalRef.value?.focus()
  // Use setTimeout to ensure the terminal processes the command
  const input = document.querySelector('.terminal-input') as HTMLInputElement
  if (input) {
    input.value = cmd
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
  }
}

function triggerComplete(type = 'normal') {
  currentCompleteType.value = type
  showCompleteModal.value = true
  if (currentLevel.value) {
    completed.value[currentLevel.value.id] = true
  }
}

// Simulated command responses per level
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
      if (fault.type === 'dns-down' && !args.match(/^\d/)) return '!ERROR:ping 请求找不到主机 ' + args + '。请检查名称然后重试。'
      if (fault.type === 'ip-conflict') return '!WARN:来自 192.168.1.15 的回复: 无法访问目标主机\n!WARN:来自 192.168.1.15 的回复: TTL 传输中过期\n!INFO:检测到 IP 地址冲突。'
      if (fault.type === 'uplink-down' || fault.type === 'cable-unplugged') {
        return args === '192.168.1.1' || args.startsWith('192.168') ? '!ERROR:请求超时\n!ERROR:请求超时\n!ERROR:请求超时\n!INFO:对 192.168.1.1 的 Ping 统计信息:\n    数据包: 已发送 = 4，已接收 = 0，丢失 = 4 (100% 丢失)' : '!ERROR:请求超时'
      }
      if (fault.type === 'port-disabled') {
        return '!ERROR:请求超时\n!ERROR:请求超时\n!ERROR:请求超时\n!INFO:对 192.168.1.1 的 Ping 统计信息:\n    数据包: 已发送 = 4，已接收 = 0，丢失 = 4 (100% 丢失)\n!INFO:DHCP 获取 IP 失败，使用自动配置地址。'
      }
      if (fault.type === 'vlan-mismatch') {
        return args.includes('192.168.10') ? '!ERROR:请求超时' : '!SUCCESS:来自 192.168.1.1 的回复: 字节=32 时间=2ms TTL=64'
      }
      if (fault.type === 'ip-config') {
        if (args === '192.168.2.100') return '!ERROR:请求超时\n!WARN:跨子网通信需要通过网关转发，请检查默认网关配置。'
        if (args === '192.168.2.1') return '!ERROR:请求超时\n!INFO:子网掩码不匹配导致网关无法正确路由。'
        return '!SUCCESS:来自 127.0.0.1 的回复: 字节=32 时间<1ms TTL=128'
      }
      if (fault.type === 'sfp-fault') {
        return '!WARN:来自核心交换机的回复: 字节=32 时间=200ms TTL=255\n!WARN:来自核心交换机的回复: 字节=32 时间=350ms TTL=255\n!ERROR:请求超时\n!WARN:来自核心交换机的回复: 字节=32 时间=500ms TTL=255\n!INFO:延迟不稳定，存在丢包现象。'
      }
      return '!SUCCESS:来自 ' + args + ' 的回复: 字节=32 时间=2ms TTL=64\n!SUCCESS:来自 ' + args + ' 的回复: 字节=32 时间=1ms TTL=64'
    },
    ipconfig: () => {
      if (fault.type === 'cable-unplugged') return 'Windows IP 配置\n\n以太网适配器 以太网:\n   媒体状态: 媒体已断开\n   连接特定的 DNS 后缀: . . . :\n   IPv4 地址: . . . . . . . : 0.0.0.0\n   子网掩码: . . . . . . . : 0.0.0.0\n   默认网关: . . . . . . . :\n!WARN:检测到物理层连接中断，请检查网线。'
      if (fault.type === 'port-disabled') return 'Windows IP 配置\n\n以太网适配器 以太网:\n   自动配置 IPv4 地址: 169.254.12.34\n   子网掩码: . . . . . . . : 255.255.0.0\n   默认网关: . . . . . . . :\n!WARN:无法从 DHCP 服务器获取 IP 地址。使用自动专用地址。'
      if (fault.type === 'ip-conflict') return 'Windows IP 配置\n\n以太网适配器 以太网:\n   IPv4 地址: . . . . . . . : 192.168.1.15\n   子网掩码: . . . . . . . : 255.255.255.0\n   默认网关: . . . . . . . : 192.168.1.1\n!WARN:检测到 IP 地址冲突。系统检测到 192.168.1.15 已被其他设备使用。'
      if (fault.type === 'vlan-mismatch') return 'Windows IP 配置\n\n以太网适配器 以太网:\n   IPv4 地址: . . . . . . . : 192.168.20.12\n   子网掩码: . . . . . . . : 255.255.255.0\n   默认网关: . . . . . . . : 192.168.20.1\n!INFO:DHCP 下发的 IP 地址在 VLAN 20 网段。'
      if (fault.type === 'dns-down') return 'Windows IP 配置\n\n以太网适配器 以太网:\n   IPv4 地址: . . . . . . . : 192.168.1.15\n   子网掩码: . . . . . . . : 255.255.255.0\n   默认网关: . . . . . . . : 192.168.1.1\n   DNS 服务器: . . . . . . : 192.168.1.100'
      if (fault.type === 'ip-config') return 'Windows IP 配置\n\n以太网适配器 以太网:\n   IPv4 地址: . . . . . . . : 192.168.2.50\n   子网掩码: . . . . . . . : 255.255.0.0\n   默认网关: . . . . . . . : 192.168.2.1\n!WARN:子网掩码 255.255.0.0 与网关配置不匹配。'
      return 'Windows IP 配置\n\n以太网适配器 以太网:\n   IPv4 地址: . . . . . . . : 192.168.1.x\n   子网掩码: . . . . . . . : 255.255.255.0\n   默认网关: . . . . . . . : 192.168.1.1'
    },
    tracert: () => {
      if (fault.type === 'uplink-down') return '1  <1ms  <1ms  <1ms 192.168.1.1\n2  * * * 请求超时'
      return '1  <1ms  <1ms  <1ms 192.168.1.1\n2  2ms  3ms  2ms 10.0.0.1\n3  15ms  16ms  15ms ...'
    },
    nslookup: (args: string) => {
      if (fault.type === 'dns-down') return '*** 请求 DNS 服务器超时\n无法解析 ' + (args || '域名')
      return '服务器: dns.company.com\nAddress: 192.168.1.100\n名称: ' + (args || '') + '\nAddress: 1.2.3.4'
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

function startLevel(level: any) {
  currentLevel.value = level
  resetState()
  gamePhase.value = 'playing'
}

function enterReview() {
  gamePhase.value = 'review'
}

function backToSelect() {
  gamePhase.value = 'select'
  currentLevel.value = null
}

// Diagnosis options
const diagnosisOptions = [
  { value: 'cable-unplugged', label: '网线松了/未插好' },
  { value: 'port-disabled', label: '交换机端口未开启 (shutdown)' },
  { value: 'ip-conflict', label: 'IP 地址冲突' },
  { value: 'vlan-mismatch', label: 'VLAN 配置错误 (端口划错)' },
  { value: 'dns-down', label: 'DNS 服务器故障或配置错误' },
  { value: 'uplink-down', label: '交换机到路由器的上联链路中断' },
  { value: 'port-mapping', label: '跳线/端口对应关系错误' },
  { value: 'ip-config', label: 'IP 配置错误 (子网掩码/网关)' },
  { value: 'sfp-fault', label: '光模块故障或光纤线路问题' },
  { value: 'acl-misconfig', label: 'ACL 规则配置错误' },
  { value: 'other', label: '其他问题' },
]

function submitDiagnosis(answer: string) {
  if (!currentLevel.value) return
  if (answer === currentLevel.value.fault.type) {
    foundFault.value = true
  }
}
</script>

<template>
  <div class="min-h-[100dvh] bg-[#0d1117] pt-24 pb-16">
    <div class="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-20">

      <!-- ═══ 关卡选择页 ═══ -->
      <template v-if="gamePhase === 'select'">
        <!-- Header -->
        <div class="animate-fade-up flex items-start gap-4 mb-10">
          <button @click="router.push('/projects')" class="text-sm text-[#8b949e] hover:text-[#34d399] transition-colors mt-1">
            ← 返回项目
          </button>
        </div>
        <div class="animate-fade-up">
          <span class="inline-flex items-center gap-2 text-xs font-medium text-[#8b949e] tracking-[0.15em] uppercase">
            <span class="w-6 h-px bg-[#30363d]" />
            网络运维模拟器
          </span>
          <h1 class="mt-4 text-4xl font-bold tracking-tight text-[#e6edf3] sm:text-5xl">关卡选择</h1>
          <p class="mt-2 text-base text-[#8b949e]">选择一个关卡开始学习网络故障排查</p>
        </div>

        <!-- Level Grid -->
        <div class="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div
            v-for="level in levels"
            :key="level.id"
            class="rounded-xl border border-[#30363d] bg-[#161b22] p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.4)] cursor-pointer tilt-card"
            @click="startLevel(level)"
          >
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-medium text-[#34d399] bg-[#059669]/10 rounded-full px-2.5 py-0.5">{{ level.difficulty }}</span>
              <span class="text-[11px] text-[#6e7681]">{{ level.category }}</span>
            </div>
            <h2 class="text-base font-bold tracking-tight text-[#e6edf3]">第{{ level.id }}关：{{ level.title }}</h2>
            <p class="mt-2 text-xs text-[#8b949e] line-clamp-2">{{ level.description }}</p>
          </div>
        </div>
      </template>

      <!-- ═══ 游戏主界面 (暗色终端风格) ═══ -->
      <template v-if="gamePhase === 'playing' && currentLevel">
        <div class="game-panel animate-fade-up">

          <!-- Top Bar -->
          <div class="game-topbar">
            <div class="game-level-badges">
              <button
                v-for="(lvl, i) in levels" :key="lvl.id"
                class="level-badge"
                :class="{ 'is-done': completed[i], 'is-active': currentLevel.id === lvl.id }"
                @click="currentLevel = lvl; resetState()"
              >L{{ i+1 }}</button>
            </div>
            <div class="game-title-area">
              <div class="game-title-text">网络运维大挑战</div>
              <div class="game-subtitle-text">{{ currentLevel.title }} · {{ levels.indexOf(currentLevel) + 1 }}/{{ levels.length }}</div>
            </div>
            <button class="hint-btn" @click="showHintFn">💡 提示</button>
          </div>

          <!-- Scenario -->
          <div class="game-scenario">
            <div class="scenario-header">第{{ levels.indexOf(currentLevel) + 1 }}关：{{ currentLevel.title }}</div>
            <div class="scenario-desc">{{ currentLevel.description }}</div>
            <div class="scenario-goal"><span class="goal-dot" /> 目标：排查故障并修复</div>
          </div>

          <!-- Terminal -->
          <Terminal ref="terminalRef" :commands="commandHandlers" :device-name="deviceName" />

          <!-- Quick Commands -->
          <div class="game-quick-cmds">
            <button v-for="cmd in quickCmds" :key="cmd" class="quick-cmd-btn" @click="runQuickCmd(cmd)">{{ cmd }}</button>
          </div>

          <!-- Status Bar -->
          <div class="game-statusbar">
            <span>状态: {{ foundFault ? '✅ 已定位' : '🔍 排查中' }}</span>
            <span v-if="foundFault" class="status-sep">|</span>
            <span v-if="foundFault">{{ fixed ? '✅ 已修复' : '🔧 待修复' }}</span>
            <span class="status-spacer" />
            <button v-if="foundFault && fixed" class="review-btn" @click="enterReview">📋 查看复盘</button>
          </div>
        </div>

        <!-- Completion Overlay -->
        <Transition name="fade">
          <div v-if="showCompleteModal" class="complete-overlay" @click.self="showCompleteModal = false">
            <div class="complete-modal">
              <div class="modal-icon">{{ currentCompleteType === 'all' ? '🏆' : '✅' }}</div>
              <div class="modal-title">排障成功！</div>
              <div class="modal-msg">你已成功修复本次故障。查看复盘了解详细排查思路。</div>
              <button class="modal-btn" @click="showCompleteModal = false; enterReview()">📖 查看复盘</button>
            </div>
          </div>
        </Transition>
      </template>

      <!-- ═══ 复盘界面 ═══ -->
      <template v-if="gamePhase === 'review' && currentLevel">
        <div class="animate-fade-up max-w-3xl mx-auto">
          <button @click="enterReview" class="text-sm text-[#8b949e] hover:text-[#34d399] transition-colors mb-6">← 返回游戏</button>
          <div class="flex items-center gap-3 mb-2">
            <span class="text-xs font-medium text-[#34d399] bg-[#059669]/10 rounded-full px-2.5 py-0.5">{{ currentLevel.difficulty }}</span>
            <span class="text-[11px] text-[#6e7681]">{{ currentLevel.category }}</span>
          </div>
          <h1 class="text-3xl font-bold tracking-tight text-[#e6edf3]">复盘：{{ currentLevel.title }}</h1>
          <p class="mt-1 text-sm text-[#8b949e]">故障类型：{{ currentLevel.fault.detail }}</p>

          <!-- Summary -->
          <div class="mt-8 rounded-xl bg-[#34d399]/10 border border-[#34d399]/20 p-5">
            <h2 class="text-sm font-bold text-[#34d399] mb-2">📋 总结</h2>
            <p class="text-sm text-[#34d399] leading-relaxed">{{ currentLevel.review.summary }}</p>
          </div>

          <!-- Step-by-step -->
          <div class="mt-8 space-y-4">
            <h2 class="text-sm font-bold text-[#e6edf3]">排查步骤详解</h2>
            <div
              v-for="(step, i) in currentLevel.review.steps"
              :key="i"
              class="rounded-xl bg-[#161b22] border border-[#30363d] p-4"
            >
              <div class="flex items-center gap-2 mb-2">
                <span class="w-6 h-6 rounded-full bg-[#059669] text-white text-xs flex items-center justify-center font-bold">{{ i + 1 }}</span>
                <code class="text-sm font-mono bg-[#21262d] px-2 py-0.5 rounded text-[#34d399]">{{ step.command }}</code>
                <span class="text-xs text-[#8b949e]">→ {{ step.result }}</span>
              </div>
              <p class="text-sm text-[#8b949e] leading-relaxed pl-8">{{ step.explanation }}</p>
            </div>
          </div>

          <!-- Optimal Path -->
          <div class="mt-8 rounded-xl bg-[#34d399]/10 border border-[#34d399]/20 p-5">
            <h2 class="text-sm font-bold text-[#34d399] mb-2">🎯 更优排查路径</h2>
            <p class="text-sm text-[#34d399] leading-relaxed">{{ currentLevel.review.optimalPath }}</p>
          </div>

          <div class="mt-10 text-center">
            <button
              class="px-6 py-2.5 rounded-full bg-[#e6edf3] text-[#0d1117] text-sm font-medium hover:bg-[#c9d1d9] transition-all"
              @click="backToSelect"
            >
              返回关卡列表
            </button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
@keyframes goalPulse {
  0%, 100% { opacity: 1 }
  50% { opacity: .3 }
}
@keyframes modalIn {
  from { opacity: 0; transform: scale(0.9) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

/* Game Panel */
.game-panel {
  background: #0d1117;
  border: 1px solid #21262d;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
}

/* Top Bar */
.game-topbar {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  gap: 12px;
  background: #161b22;
  border-bottom: 1px solid #21262d;
}
.game-level-badges {
  display: flex;
  gap: 6px;
}
.level-badge {
  font-family: 'Geist Mono', 'JetBrains Mono', monospace;
  font-size: 11px;
  padding: 5px 10px;
  border-radius: 5px;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.15s ease;
  border: 1px solid #21262d;
  background: #0d1117;
  color: #8b949e;
}
.level-badge:hover { border-color: #58a6ff; color: #c9d1d9; }
.level-badge.is-active { background: #1f6feb; color: #fff; border-color: #58a6ff; }
.level-badge.is-done { background: #2ea043; color: #fff; border-color: #3fb950; }

.game-title-area { flex: 1; }
.game-title-text { font-size: 14px; font-weight: 700; color: #e6edf3; letter-spacing: 0.3px; }
.game-subtitle-text { font-size: 10px; color: #8b949e; margin-top: 1px; }

.hint-btn {
  background: #0d1117;
  border: 1px solid #30363d;
  color: #d29922;
  border-radius: 6px;
  padding: 6px 14px;
  font-size: 12px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
}
.hint-btn:hover { background: #161b22; border-color: #d29922; }

/* Scenario */
.game-scenario {
  padding: 14px 16px;
  background: #0d1117;
  border-bottom: 1px solid #21262d;
}
.scenario-header {
  font-size: 14px;
  font-weight: 700;
  color: #f0883e;
  margin-bottom: 6px;
}
.scenario-desc {
  font-size: 13px;
  color: #8b949e;
  line-height: 1.6;
}
.scenario-goal {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  padding: 8px 12px;
  background: rgba(63,185,80,0.08);
  border: 1px solid rgba(63,185,80,0.2);
  border-radius: 8px;
  font-size: 12px;
  color: #3fb950;
  font-weight: 600;
}
.goal-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #3fb950;
  animation: goalPulse 2s infinite;
  box-shadow: 0 0 6px rgba(63,185,80,0.4);
}

/* Quick Commands */
.game-quick-cmds {
  display: flex;
  gap: 6px;
  padding: 8px 16px;
  background: #161b22;
  border-top: 1px solid #21262d;
  overflow-x: auto;
}
.game-quick-cmds::-webkit-scrollbar { height: 0; }
.quick-cmd-btn {
  font-family: 'Geist Mono', 'JetBrains Mono', monospace;
  font-size: 11px;
  padding: 5px 12px;
  border-radius: 5px;
  background: #0d1117;
  border: 1px solid #30363d;
  color: #8b949e;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.12s;
  flex-shrink: 0;
}
.quick-cmd-btn:hover { border-color: #58a6ff; color: #c9d1d9; background: #161b22; }
.quick-cmd-btn:active { background: #1f6feb; color: #fff; border-color: #58a6ff; }

/* Status Bar */
.game-statusbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #0d1117;
  border-top: 1px solid #21262d;
  font-size: 11px;
  color: #8b949e;
}
.status-sep { color: #30363d; }
.status-spacer { flex: 1; }
.review-btn {
  background: #2ea043;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 5px 12px;
  font-size: 11px;
  cursor: pointer;
  font-family: inherit;
  font-weight: 600;
  transition: all 0.15s;
}
.review-btn:hover { background: #3fb950; }

/* Completion Overlay */
.complete-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}
.complete-modal {
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 16px;
  padding: 32px 28px;
  max-width: 340px;
  width: 90%;
  text-align: center;
  animation: modalIn 0.3s cubic-bezier(0.16,1,0.3,1);
}
.modal-icon { font-size: 48px; margin-bottom: 12px; }
.modal-title { font-size: 20px; font-weight: 700; color: #e6edf3; margin-bottom: 8px; }
.modal-msg { font-size: 13px; color: #8b949e; margin-bottom: 20px; line-height: 1.6; }
.modal-btn {
  background: #2ea043;
  color: #fff;
  border: none;
  padding: 10px 32px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  font-family: inherit;
  font-weight: 600;
  transition: all 0.15s;
}
.modal-btn:hover { background: #3fb950; transform: translateY(-1px); }
.modal-btn:active { transform: scale(0.97); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
