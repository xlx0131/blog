# 运维模拟平台 — 完整设备模拟沙盒设计文档

## 概述

对项目2（运维模拟平台）进行全面优化，将现有的"诊断即修复"模式升级为完整的**排查 → 修复 → 验证**三阶段闭环流程，构建具备真实设备特性的模拟环境，实现可交互的物理与网络操作。

---

## 一、核心架构：设备模拟引擎

### 1.1 设备状态接口

```typescript
interface DeviceState {
  id: string
  label: string
  type: 'computer' | 'switch' | 'router' | 'server' | 'firewall'
  
  // 物理层状态
  cableStatus: 'connected' | 'unplugged' | 'faulty'
  portStatus: Record<string, 'up' | 'down' | 'disabled'>
  powerStatus: 'on' | 'off'
  
  // 网络层配置（电脑/服务器）
  ipAddress: string
  subnetMask: string
  defaultGateway: string
  dnsServer: string
  
  // 交换机/路由器
  vlanConfig: Record<string, string>
  aclRules: AclRule[]
  
  // 运行状态
  cpuUsage: number
  memoryUsage: number
  uptime: number
  isOnline: boolean
}
```

### 1.2 命令执行引擎

终端命令读取/修改设备状态，输出实时反馈。

**核心命令映射**：
- `ping <target>` → 检查目标设备连通性（基于设备状态计算）
- `ipconfig` / `ifconfig` → 显示当前设备网络配置
- `nslookup <domain>` → 检查 DNS 解析（基于 DNS 服务器状态）
- `tracert <target>` → 路由追踪
- `telnet <device>` → 切换设备上下文
- `show interfaces` → 显示端口状态
- `show vlan brief` → 显示 VLAN 配置

### 1.3 文件拆分

| 文件 | 内容 |
|------|------|
| `src/composables/useDeviceEngine.ts` | 设备状态管理、命令执行引擎 |
| `src/composables/useGameFlow.ts` | 游戏阶段管理（排查→修复→验证） |
| `src/components/DevicePanel.vue` | 设备操作面板（物理+配置操作） |
| `src/components/FixSheet.vue` | 修复操作引导面板 |
| `src/components/VerificationPanel.vue` | 修复验证面板 |
| `src/views/NetworkGame.vue` | 精简为主布局+状态协调 |

---

## 二、三阶段游戏流程

### 2.1 阶段状态机

```
playing
  ├── investigating (排查阶段)
  │   ├── 运行诊断命令、检查设备状态
  │   ├── 排查日志追踪
  │   └── 确认故障原因 → 进入 repairing
  │
  ├── repairing (修复阶段)
  │   ├── 选择修复方案（FixSheet 面板）
  │   ├── 执行修复操作（DevicePanel）
  │   └── 修复完成 → 进入 verifying
  │
  ├── verifying (验证阶段)
  │   ├── 执行验证命令
  │   ├── 自动检测修复生效状态
  │   └── 全部通过 → 完成
  │
  └── completed (庆祝+复盘)
```

### 2.2 排查阶段（诊断面板升级）

**保留现有分层诊断面板**，新增排查日志追踪功能：
- 每个诊断选项标记"已排查/待排查"
- 执行相关命令后自动标记对应选项（如 `show interface` → 端口状态相关选项标记为已排查）
- 排查到正确答案后，显示"发现故障原因！"进入修复阶段
- 不再自动设置 `fixed = true`

### 2.3 修复阶段（新增 FixSheet 组件）

诊断正确后弹出修复面板：

**修复方案选择**：
- 每个关卡提供 2-3 个修复方案（1 个最优 + 1-2 个次优/错误选项）
- 选择方案后，需要在设备操作面板或终端执行对应操作

**双轨修复方式**：
- **终端路径**：在终端输入命令完成修复（如 `no shutdown`）
- **面板路径**：在设备操作面板点击操作按钮

### 2.4 验证阶段（新增 VerificationPanel）

修复完成后进入验证阶段：

**验证项列表**（每关 2-3 项）：
- ping 网关/服务器 → 检测网络连通性
- nslookup 域名 → 检测 DNS 解析
- 访问具体服务 → 检测应用层连通性

**自动检测**：用户在终端执行对应命令时，系统自动判断是否验证通过

**完成条件**（三条件）：
```
通关 = 排查正确 ✅ + 修复有效 ✅ + 验证通过 ✅
```

---

## 三、设备操作面板

### 3.1 布局

右侧面板新增「设备操作」Tab，位于设备详情之后。

### 3.2 操作分类

**💻 电脑**：
- 物理操作：拔插网线、更换网线、重启网卡
- 网络配置：修改 IP/子网掩码/网关/DNS
- 系统操作：查看网络状态

**🔀 交换机**：
- 端口管理：启用/禁用端口、修改 VLAN
- 配置管理：查看配置、保存配置、重启

**🌐 路由器/防火墙**：
- 路由配置：查看路由表、修改静态路由
- 安全策略：查看/修改 ACL 规则

**🖥️ 服务器**：
- 服务管理：启动/停止 DNS/HTTP/DHCP 服务
- 日志查看：系统日志、错误日志

### 3.3 交互方式

- **直接操作型**：点击按钮即时生效
- **配置输入型**：弹出输入框填写新值
- **查看信息型**：终端显示对应信息

### 3.4 反馈层次

每个操作提供四层反馈：
1. **终端输出**：操作结果文本
2. **拓扑图视觉**：链路颜色/设备指示灯变化
3. **告警面板**：新增/清除告警
4. **性能指标**：带宽/丢包率等数值变化

---

## 四、关卡数据增强

每个关卡新增三个字段：

```javascript
{
  // ... 现有字段
  deviceState: {
    // 设备初始状态覆盖
    'pc8': { dnsServer: '错误的DNS地址' },
    'dns5': { isOnline: false },
  },
  fixActions: [
    // 修复操作定义（路径/面板）
    { type: 'change-dns', device: 'pc8', from: '错误的DNS地址', to: '114.114.114.114' },
  ],
  verifyConditions: [
    // 验证条件
    { type: 'ping', target: '8.8.8.8', expect: 'success' },
    { type: 'nslookup', target: 'www.baidu.com', expect: 'resolve' },
  ],
}
```

---

## 五、实施计划

### 第一阶段：基础架构
1. 创建 `useDeviceEngine.ts` — 设备状态管理和命令执行引擎
2. 创建 `useGameFlow.ts` — 三阶段状态机
3. 添加关卡数据增强字段

### 第二阶段：修复与验证
4. 创建 `FixSheet.vue` — 修复方案选择面板
5. 创建 `VerificationPanel.vue` — 验证状态面板
6. 修改 NetworkGame.vue — 集成三阶段流程

### 第三阶段：设备操作
7. 创建 `DevicePanel.vue` — 设备操作面板
8. 实现各类型设备的操作交互
9. 拓扑图联动（操作→视觉反馈）

### 第四阶段：关卡适配
10. 为每个故障关卡配置 deviceState 和 fixActions
11. 测试所有关卡的完整诊→修→验流程
12. 移动端适配
