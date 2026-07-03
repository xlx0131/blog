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

import { ref } from 'vue'
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

export function executeCommand(
  cmd: string,
  args: string,
  currentDeviceId: string | null,
  deviceStates: Record<string, DeviceConfig>,
): { output: string; success: boolean; type?: string } {
  const device = currentDeviceId ? deviceStates[currentDeviceId] : undefined

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

  if (cmd === 'nslookup' && args) {
    const dnsDevice = Object.values(deviceStates).find(d => d.type === 'server' && d.id.includes('dns'))
    const dnsOnline = dnsDevice ? dnsDevice.isOnline : true
    if (!dnsOnline) {
      return { output: `DNS request timed out.\n*** ${Object.values(deviceStates).find(d => d.type === 'server')?.ipAddress || ''} 无响应`, success: false, type: 'error' }
    }
    if (device?.dnsServer === '错误的DNS地址' || device?.dnsServer === '0.0.0.0') {
      return { output: `DNS request timed out.\n*** ${args} 找不到主机`, success: false, type: 'error' }
    }
    return { output: `服务器: ${device?.dnsServer || '未知'}\nAddress: ${device?.dnsServer || '未知'}\n\n名称: ${args}\nAddress: 1.2.4.8`, success: true, type: 'success' }
  }

  if (cmd === 'show' && args?.includes('interfaces')) {
    if (!device || device.type !== 'switch') return { output: '此命令需要在交换机上执行', success: false, type: 'error' }
    const ports = device.portStatus || {}
    const portLines = Object.entries(ports).slice(0, 8).map(([port, status]) => {
      const statusText = status === 'up' ? 'up' : (status === 'down' ? 'down' : 'disabled')
      return `GigabitEthernet0/${port} is ${statusText}, line protocol is ${statusText}`
    }).join('\n')
    return { output: portLines || '没有端口信息', success: true }
  }

  if (cmd === 'show' && args?.includes('vlan')) {
    return { output: 'VLAN Name                             Status    Ports\n---- -------------------------------- --------- -------------------------------\n1    default                          active    Gi0/1-8\n10   Sales                            active    Gi0/9-16\n20   R&D                              active    Gi0/17-24', success: true }
  }

  if (cmd === 'telnet' && args) {
    const targetDevice = Object.values(deviceStates).find(d => d.label.includes(args) || d.id === args)
    if (targetDevice) {
      return { output: `正在连接 ${targetDevice.label} ...\n连接成功。`, success: true, type: 'success' }
    }
    return { output: `无法连接到 ${args}`, success: false, type: 'error' }
  }

  return { output: `'${cmd}' 不是内部或外部命令，也不是可运行的程序或批处理文件。`, success: false, type: 'error' }
}

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
