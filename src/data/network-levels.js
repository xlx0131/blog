// 网络运维模拟器 — 关卡数据
// 每个关卡包含：拓扑、故障、排查步骤、复盘

export const levels = [
  // ═══════════════════════════════════════
  // 教学关1：认识网络拓扑
  // ═══════════════════════════════════════
  {
    id: 1, title: '认识网络拓扑', difficulty: '📖', category: '教学',
    description: '欢迎来到网络运维模拟器！这一关带你认识网络拓扑图。了解图中的各种设备图标、连线含义和状态指示灯，为后续的实战排查打好基础。',
    hint: '注意观察不同设备的图标和颜色。绿色连线表示链路正常，红色表示中断。设备上的小圆点代表运行状态。',
    topology: {
      devices: [
        { id: 'pc_t1', type: 'computer', label: '办公电脑', x: 80, y: 200 },
        { id: 'sw_t1', type: 'switch', label: '接入交换机', x: 300, y: 200, ports: 24 },
        { id: 'rt_t1', type: 'router', label: '核心路由器', x: 520, y: 100 },
        { id: 'svr_t1', type: 'server', label: '公司服务器', x: 520, y: 300 },
      ],
      connections: [
        { from: 'pc_t1', to: 'sw_t1', fromPort: null, toPort: 5, status: 'up' },
        { from: 'sw_t1', to: 'rt_t1', fromPort: 24, toPort: 1, status: 'up' },
        { from: 'rt_t1', to: 'svr_t1', fromPort: 2, toPort: null, status: 'up' },
      ],
    },
    fault: { type: 'none', device: '', detail: '这是一个教学关卡，没有故障' },
    expectedSteps: [
      { type: 'diagnose', answer: '认识设备类型和连接方式' },
    ],
    review: {
      summary: '网络拓扑图是网络工程师的第一语言。通过拓扑图你可以快速了解整个网络的设备组成和连接关系。',
      steps: [
        { command: '观察拓扑图', result: '电脑 → 交换机 → 路由器 → 服务器', explanation: '典型的办公网络拓扑结构：电脑通过网线连接到交换机，交换机汇聚后连接到路由器，路由器再连接到外部网络或内部服务器。数据从电脑发出，逐级向上传递。' },
        { command: '设备类型', result: '💻电脑 🔀交换机 🌐路由器 🖥️服务器', explanation: '电脑（终端设备）通过网线连接到交换机。交换机（二层设备）负责在同一网络内转发数据。路由器（三层设备）负责连接不同网络。服务器提供网络服务（网站、文件等）。' },
        { command: '连线状态', result: '绿色=正常，红色=中断', explanation: '拓扑图中的连线颜色表示链路状态：绿色表示连接正常，红色表示链路中断（故障），灰色表示未使用。虚线表示链路不稳定。' },
      ],
      optimalPath: '这是教学关卡，没有特定的排查路径。重点是熟悉拓扑图的阅读方法。',
    },
  },

  // ═══════════════════════════════════════
  // 教学关2：常用排查命令入门
  // ═══════════════════════════════════════
  {
    id: 2, title: '常用排查命令入门', difficulty: '📖', category: '教学',
    description: '这一关带你学习网络故障排查中最常用的几个命令：ping、ipconfig、tracert、nslookup。了解每个命令的作用和输出信息的含义。',
    hint: '在终端中输入每个命令试试，看看它们的输出有什么区别。可以先用 help 查看可用命令列表。',
    topology: {
      devices: [
        { id: 'pc_t2', type: 'computer', label: '你的电脑', x: 80, y: 200 },
        { id: 'sw_t2', type: 'switch', label: '楼层交换机', x: 300, y: 200, ports: 24 },
        { id: 'rt_t2', type: 'router', label: '核心路由器', x: 520, y: 200 },
      ],
      connections: [
        { from: 'pc_t2', to: 'sw_t2', fromPort: null, toPort: 10, status: 'up' },
        { from: 'sw_t2', to: 'rt_t2', fromPort: 24, toPort: 1, status: 'up' },
      ],
    },
    fault: { type: 'none', device: '', detail: '教学关卡，没有故障' },
    expectedSteps: [
      { type: 'diagnose', answer: '了解各命令的用途' },
    ],
    review: {
      summary: '掌握这五个命令，你可以排查 90% 以上的常见网络故障。每个命令都有其特定的使用场景。',
      steps: [
        { command: 'ping', result: '测试网络连通性', explanation: 'ping 是最常用的网络诊断命令。它发送 ICMP 数据包到目标主机，通过是否能收到回复来判断网络是否连通。ping 网关（路由器）可以判断局域网是否正常；ping 外网可以判断互联网连接是否正常。' },
        { command: 'ipconfig', result: '查看本机网络配置', explanation: 'ipconfig 查看本机的 IP 地址、子网掩码、默认网关和 DNS 服务器信息。"媒体已断开"表示物理层有问题（网线没插好）。169.254.x.x 的 IP 表示 DHCP 获取失败。' },
        { command: 'tracert', result: '追踪路由路径', explanation: 'tracert 追踪数据包到达目标主机的完整路径。每一跳代表经过的一个路由器。通过查看在哪一跳中断，可以判断故障发生在网络的哪个位置。' },
        { command: 'nslookup', result: '测试 DNS 解析', explanation: 'nslookup 测试域名是否能正确解析为 IP 地址。如果 ping 域名失败但 ping IP 成功，问题很可能在 DNS。这个命令能帮你快速确认 DNS 是否正常工作。' },
      ],
      optimalPath: '排查时建议先用 ping 测试连通性，不通的话用 ipconfig 查看本机配置，再用 tracert 定位中断位置。涉及域名问题用 nslookup。',
    },
  },

  // ═══════════════════════════════════════
  // 教学关3：认识 IP 地址和端口
  // ═══════════════════════════════════════
  {
    id: 3, title: '认识 IP 地址和端口', difficulty: '📖', category: '教学',
    description: '了解 IP 地址、子网掩码、默认网关和端口号的基本概念。这些是网络排障中最常遇到的基础知识，理解它们有助于快速定位问题。',
    hint: 'IP 地址就像门牌号，端口就像房门号。子网掩码决定哪些地址在同一个"小区"内。',
    topology: {
      devices: [
        { id: 'pc_t3a', type: 'computer', label: '办公电脑A', x: 80, y: 120 },
        { id: 'pc_t3b', type: 'computer', label: '办公电脑B', x: 80, y: 280 },
        { id: 'sw_t3', type: 'switch', label: '办公室交换机', x: 300, y: 200, ports: 16 },
        { id: 'rt_t3', type: 'router', label: '网关路由器', x: 520, y: 200 },
      ],
      connections: [
        { from: 'pc_t3a', to: 'sw_t3', fromPort: null, toPort: 1, status: 'up' },
        { from: 'pc_t3b', to: 'sw_t3', fromPort: null, toPort: 2, status: 'up' },
        { from: 'sw_t3', to: 'rt_t3', fromPort: 16, toPort: 1, status: 'up' },
      ],
    },
    fault: { type: 'none', device: '', detail: '教学关卡，没有故障' },
    expectedSteps: [
      { type: 'diagnose', answer: '理解 IP 地址和端口的概念' },
    ],
    review: {
      summary: 'IP 地址和端口是网络通信的基础。理解它们的关系对排查网络故障至关重要。',
      steps: [
        { command: 'IP 地址', result: '192.168.1.x — 局域网专用地址段', explanation: 'IP 地址是网络中每台设备的唯一标识。192.168.x.x 是预留的私有地址段，只能在局域网内部使用。电脑、手机、打印机等设备都需要一个唯一的 IP 地址才能通信。' },
        { command: '子网掩码', result: '255.255.255.0 — 决定网络规模', explanation: '子网掩码用来区分网络位和主机位。255.255.255.0 表示前 24 位是网络号，后 8 位是主机号，一个子网最多容纳 254 台设备。相同子网的设备可以直接通信，不同子网需要通过路由器转发。' },
        { command: '默认网关', result: '192.168.1.1 — 通往外部网络的大门', explanation: '默认网关是设备访问外部网络时必须经过的路由器地址。当电脑要访问其他网络的设备时，会把数据包发送给网关，由网关负责转发。ping 网关是排查网络故障的第一步——如果连网关都 ping 不通，肯定无法上外网。' },
        { command: '端口号', result: '80=网页, 443=安全网页, 53=DNS, 22=SSH', explanation: '端口号用于区分不同的网络服务。一台服务器上可以同时运行多个服务（网页、邮件、文件传输等），每个服务使用不同的端口号。排查时如果 ping 通但网页打不开，可能是 80/443 端口被防火墙阻拦。' },
      ],
      optimalPath: '排查网络问题时，先确认 IP 配置是否正确（ipconfig），再 ping 网关确认局域网连通性，最后检查特定端口是否开放。',
    },
  },

  // ═══════════════════════════════════════
  // 第4关：物理层 — 网线松了
  // ═══════════════════════════════════════
  {
    id: 4, title: '电脑网线松了', difficulty: '⭐', category: '物理层',
    description: '前台小王说他的电脑突然上不了网了，右下角网络图标显示红叉。你去看看怎么回事。',
    hint: '先从最简单的物理连接开始检查。看看电脑背后的网线指示灯。',
    topology: {
      devices: [
        { id: 'pc1', type: 'computer', label: '小王电脑', x: 80, y: 200, status: 'offline' },
        { id: 'sw1', type: 'switch', label: '办公室交换机', x: 300, y: 200, ports: 8 },
        { id: 'rt1', type: 'router', label: '机柜路由器', x: 520, y: 200 },
      ],
      connections: [
        { from: 'pc1', to: 'sw1', fromPort: null, toPort: 3, status: 'down' },
        { from: 'sw1', to: 'rt1', fromPort: 8, toPort: 1, status: 'up' },
      ],
    },
    fault: { type: 'cable-unplugged', device: 'pc1', detail: '网线从电脑端脱落' },
    deviceState: {
      'pc1': { cableStatus: 'unplugged', ipAddress: '192.168.1.15' },
    },
    fixActions: [
      { type: 'plug-cable', device: 'pc1', label: '插紧电脑网线' },
    ],
    verifyConditions: [
      { type: 'ping', target: '192.168.1.1', expect: 'success', label: 'ping 通网关' },
    ],
    expectedSteps: [
      { type: 'ping', target: '192.168.1.1', expectedResult: '请求超时' },
      { type: 'ipconfig', target: '', expectedResult: '媒体状态: 媒体已断开' },
      { type: 'diagnose', answer: '电脑网线松了/未插好' },
      { type: 'fix', command: '插紧网线' },
    ],
    review: {
      summary: '这次故障是最常见的物理层问题——网线脱落。排查时先从 ping 网关发现不通，然后 ipconfig 看到"媒体已断开"的提示，说明物理连接有问题，最后检查发现网线松了。',
      steps: [
        { command: 'ping 192.168.1.1', result: '请求超时', explanation: 'ping 网关不通，说明本地网络链路有问题。网关是设备出网的第一个跳点，ping 不通意味着连路由器都到不了。' },
        { command: 'ipconfig', result: '媒体状态: 媒体已断开', explanation: 'ipconfig 显示了"媒体已断开"，这是 Windows 网络适配器检测到物理层没有信号的典型提示。说明问题出在物理连接上。' },
        { command: '检查网线', result: '网线插口松动', explanation: '检查电脑背后的网线接口，发现网线没有完全插入，卡扣没有卡住。重新插紧后网络恢复。' },
      ],
      optimalPath: '先 ipconfig 看网卡状态，再 ping 网关，比先 ping 再 ipconfig 更快定位物理层问题。ipconfig 直接告诉你"媒体已断开"，就不用再花时间 ping 了。',
    },
  },

  // ═══════════════════════════════════════
  // 第2关：物理层 — 交换机端口没开
  // ═══════════════════════════════════════════════════════════════
  {
    id: 5, title: '交换机端口未启用', difficulty: '⭐', category: '物理层',
    description: '财务部新来了一个同事，网线已经插好了，但是电脑显示"未识别的网络"，无法上网。',
    hint: '网线插好了但还是不通，可能是交换机的端口没有开启。可以用工具检查交换机端口状态。',
    topology: {
      devices: [
        { id: 'pc2', type: 'computer', label: '新同事电脑', x: 80, y: 200, status: 'offline' },
        { id: 'sw2', type: 'switch', label: '财务部交换机', x: 300, y: 200, ports: 24 },
        { id: 'rt2', type: 'router', label: '核心路由器', x: 520, y: 200 },
      ],
      connections: [
        { from: 'pc2', to: 'sw2', fromPort: null, toPort: 5, status: 'down' },
        { from: 'sw2', to: 'rt2', fromPort: 24, toPort: 2, status: 'up' },
      ],
    },
    fault: { type: 'port-disabled', device: 'sw2', detail: '交换机 5 号端口处于 shutdown 状态' },
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
    expectedSteps: [
      { type: 'ping', target: '192.168.1.1', expectedResult: '请求超时' },
      { type: 'ipconfig', target: '', expectedResult: '自动配置 IPv4: 169.254.x.x' },
      { type: 'show', target: 'switch port 5', expectedResult: '端口 5: shutdown' },
      { type: 'diagnose', answer: '交换机端口未开启' },
      { type: 'enable', target: 'switch port 5', command: 'no shutdown' },
    ],
    review: {
      summary: '网线插好了但无法获取 IP 地址（出现 169.254.x.x 自动配置地址），说明链路层有问题。检查交换机发现端口被 shutdown 了，执行 no shutdown 开启端口后恢复。',
      steps: [
        { command: 'ping 192.168.1.1', result: '请求超时', explanation: 'ping 不通网关，但这次网络图标没有红叉，说明物理连接是通的，问题可能在更高层。' },
        { command: 'ipconfig', result: '自动配置 IPv4: 169.254.x.x', explanation: '出现 169.254.x.x 是 Windows 没有从 DHCP 获取到 IP 时自动分配的地址。说明 DHCP 请求没有得到响应。有可能是交换机端口没有转发 DHCP 广播。' },
        { command: 'show port 5', result: '端口 5 shutdown', explanation: '登录交换机查看端口状态，发现 5 号端口处于 shutdown（管理关闭）状态。可能是之前管理员做了端口安全策略忘记开启了。' },
        { command: 'no shutdown (端口5)', result: '端口 5 已启用', explanation: '在交换机上对端口 5 执行 no shutdown 命令，端口变为 up 状态，电脑获取到 IP 后网络恢复。' },
      ],
      optimalPath: '先 ipconfig 看到 169.254.x.x 就应该怀疑 DHCP/链路问题，接着查看交换机端口状态。如果先 ping 浪费时间。',
    },
  },

  // ═══════════════════════════════════════
  // 第3关：网络层 — IP 地址冲突
  // ═══════════════════════════════════════════════════════════════
  {
    id: 6, title: 'IP 地址冲突', difficulty: '⭐⭐', category: '网络层',
    description: '销售部的小张和小李都反映上网时断时续，经常掉线。两人用的是同一个网段的固定 IP。',
    hint: '固定 IP 的环境下，如果两台电脑设置了相同的 IP 就会冲突，导致交替掉线。',
    topology: {
      devices: [
        { id: 'pc3a', type: 'computer', label: '小张电脑', x: 80, y: 120, status: 'unstable' },
        { id: 'pc3b', type: 'computer', label: '小李电脑', x: 80, y: 280, status: 'unstable' },
        { id: 'sw3', type: 'switch', label: '销售部交换机', x: 300, y: 200, ports: 16 },
        { id: 'rt3', type: 'router', label: '核心路由器', x: 520, y: 200 },
      ],
      connections: [
        { from: 'pc3a', to: 'sw3', fromPort: null, toPort: 1, status: 'up' },
        { from: 'pc3b', to: 'sw3', fromPort: null, toPort: 2, status: 'up' },
        { from: 'sw3', to: 'rt3', fromPort: 16, toPort: 3, status: 'up' },
      ],
    },
    fault: { type: 'ip-conflict', device: 'pc3a', detail: '小张和小李的 IP 都设为 192.168.1.15' },
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
    expectedSteps: [
      { type: 'ipconfig', target: 'pc3a', expectedResult: 'IPv4: 192.168.1.15' },
      { type: 'ipconfig', target: 'pc3b', expectedResult: 'IPv4: 192.168.1.15' },
      { type: 'ping', target: '192.168.1.1', expectedResult: '时通时不通' },
      { type: 'diagnose', answer: 'IP 地址冲突' },
      { type: 'fix', command: '修改其中一台电脑的 IP 地址' },
    ],
    review: {
      summary: '两台电脑设置相同固定 IP 导致地址冲突，网络交替中断。通过 ipconfig 对比发现 IP 相同，修改其中一台的 IP 后解决。',
      steps: [
        { command: 'ipconfig (两台电脑)', result: '两台 IPv4 都是 192.168.1.15', explanation: '对比两台电脑的 IP 配置，发现 IP 地址完全一致。Windows 会检测到 IP 冲突并给出提示"检测到 IP 地址冲突"。' },
        { command: 'ping 网关', result: '时通时不通', explanation: '因为两台电脑在抢同一个 IP，交换机的 MAC 地址表在两个端口之间反复切换，导致网络时断时续。' },
        { command: '修改 IP', result: '两台电脑分配不同 IP 后网络恢复', explanation: '将其中一台改为 192.168.1.16，并确保子网掩码和网关一致。之后两台都能稳定上网。最佳实践是用 DHCP 自动分配 IP，避免手动设置。' },
      ],
      optimalPath: '看到时断时续就应该怀疑 IP 冲突，直接 ipconfig 对比是最快的验证方式。不需要先 ping 再查。',
    },
  },

  // ═══════════════════════════════════════
  // 第4关：网络层 — VLAN 配置错误
  // ═══════════════════════════════════════════════════════════════
  {
    id: 7, title: 'VLAN 端口划分错误', difficulty: '⭐⭐', category: '网络层',
    description: '研发部搬到新的办公区后，所有电脑都能获取 IP 地址，但是无法访问财务部的服务器。两个部门在不同楼层。',
    hint: '能获取 IP 但访问不了特定服务器，看看是不是 VLAN 隔离导致的。',
    topology: {
      devices: [
        { id: 'pc4', type: 'computer', label: '研发部电脑', x: 80, y: 100 },
        { id: 'sv4', type: 'server', label: '财务部服务器', x: 80, y: 300 },
        { id: 'sw4a', type: 'switch', label: '研发部交换机', x: 300, y: 100, ports: 24 },
        { id: 'sw4b', type: 'switch', label: '财务部交换机', x: 300, y: 300, ports: 24 },
        { id: 'rt4', type: 'router', label: '三层交换机', x: 520, y: 200 },
      ],
      connections: [
        { from: 'pc4', to: 'sw4a', fromPort: null, toPort: 5, status: 'up' },
        { from: 'sv4', to: 'sw4b', fromPort: null, toPort: 5, status: 'up' },
        { from: 'sw4a', to: 'rt4', fromPort: 24, toPort: 1, status: 'up' },
        { from: 'sw4b', to: 'rt4', fromPort: 24, toPort: 2, status: 'up' },
      ],
    },
    fault: { type: 'vlan-mismatch', device: 'sw4a', detail: '研发部电脑插在了 VLAN 20 的端口上，而服务器在 VLAN 10' },
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
    expectedSteps: [
      { type: 'ping', target: '服务器 IP', expectedResult: '请求超时' },
      { type: 'ipconfig', target: '', expectedResult: 'IPv4: 192.168.20.x (VLAN 20 网段)' },
      { type: 'show', target: 'switch vlan', expectedResult: 'VLAN 10: 端口 1-8, VLAN 20: 端口 9-16' },
      { type: 'diagnose', answer: '电脑接入的 VLAN 与服务器不同' },
      { type: 'fix', command: '将端口划入正确的 VLAN 或配置 VLAN 间路由' },
    ],
    review: {
      summary: '研发部电脑被分配到了 VLAN 20，财务服务器在 VLAN 10，默认 VLAN 间不通。可以通过将端口改到同一 VLAN 或配置三层路由来解决。',
      steps: [
        { command: 'ping 服务器 IP', result: '不通', explanation: '能获取 IP 但 ping 不通服务器，说明网络层连通性有问题。' },
        { command: 'ipconfig', result: 'IP 在 192.168.20.x 网段', explanation: 'IP 地址在 VLAN 20 的网段，而服务器在 VLAN 10。VLAN 隔离了广播域，没有三层路由的话不同 VLAN 之间默认不通。' },
        { command: '查看交换机 VLAN 配置', result: '端口 5 在 VLAN 20', explanation: '登录交换机查看 VLAN 配置，发现研发部交换机上端口 5 被划分到了 VLAN 20。' },
        { command: '修改端口 VLAN', result: '网络恢复', explanation: '将端口 5 改到 VLAN 10 或者配置 VLAN 间路由（interface vlan 10/20 + IP routing）。' },
      ],
      optimalPath: '先看 IP 是否在同一网段，再检查 VLAN 配置。ping 不通时 ipconfig 是最快的诊断工具。',
    },
  },

  // ═══════════════════════════════════════
  // 第5关：应用层 — DNS 解析故障
  // ═══════════════════════════════════════════════════════════════
  {
    id: 8, title: 'DNS 解析故障', difficulty: '⭐⭐', category: '应用层',
    description: '市场部的同事们说可以上微信、钉钉，但所有的网页都打不开，浏览器显示"无法解析域名"。',
    hint: '能上聊天软件但打不开网页，典型的 DNS 问题。',
    topology: {
      devices: [
        { id: 'pc5', type: 'computer', label: '市场部电脑', x: 80, y: 200 },
        { id: 'sw5', type: 'switch', label: '接入交换机', x: 300, y: 200, ports: 24 },
        { id: 'rt5', type: 'router', label: '核心路由器', x: 520, y: 100 },
        { id: 'dns5', type: 'server', label: 'DNS 服务器', x: 520, y: 300 },
      ],
      connections: [
        { from: 'pc5', to: 'sw5', fromPort: null, toPort: 3, status: 'up' },
        { from: 'sw5', to: 'rt5', fromPort: 24, toPort: 1, status: 'up' },
        { from: 'rt5', to: 'dns5', fromPort: 2, toPort: null, status: 'up' },
      ],
    },
    fault: { type: 'dns-down', device: 'dns5', detail: 'DNS 服务未启动或 DNS 指向错误' },
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
    expectedSteps: [
      { type: 'ping', target: 'baidu.com', expectedResult: 'ping 请求找不到主机' },
      { type: 'ping', target: '8.8.8.8', expectedResult: '成功' },
      { type: 'nslookup', target: 'baidu.com', expectedResult: 'DNS 请求超时' },
      { type: 'ipconfig', target: '', expectedResult: 'DNS 服务器: 192.168.1.100' },
      { type: 'diagnose', answer: 'DNS 服务器故障或 DNS 配置错误' },
      { type: 'fix', command: '检查 DNS 服务或更换 DNS 为 114.114.114.114' },
    ],
    review: {
      summary: '能上聊天软件说明网络连接是通的，但打不开网页说明域名解析出了问题。用 ping 域名和 ping IP 对比确认是 DNS 问题，nslookup 验证 DNS 无响应后，更换 DNS 服务器解决。',
      steps: [
        { command: 'ping baidu.com', result: '找不到主机', explanation: 'ping 域名失败，说明无法将域名解析为 IP，问题可能在 DNS。' },
        { command: 'ping 8.8.8.8', result: '成功', explanation: '直接 ping 公网 IP 成功，说明网络连接本身是通的，排除了路由和物理层问题。确定问题在 DNS 解析环节。' },
        { command: 'nslookup baidu.com', result: 'DNS 请求超时', explanation: 'nslookup 专门用来测试 DNS 解析，超时说明 DNS 服务器没有响应。' },
        { command: 'ipconfig /all', result: 'DNS 服务器: 192.168.1.100', explanation: '查看当前使用的 DNS 服务器地址，检查是否配置正确。如果 DNS 服务器 IP 错了或者服务器宕机了，所有域名都会解析失败。' },
        { command: '更换 DNS', result: '网页恢复正常', explanation: '将 DNS 临时改为 114.114.114.114（国内公共 DNS），再次访问网页，正常打开。确认是原 DNS 服务器的问题。' },
      ],
      optimalPath: '直接用 nslookup 测试域名解析是最快的方式，不需要先 ping 域名再 ping IP。建议先将公司 DNS 配置为 114.114.114.114 和 223.5.5.5 作为主备。',
    },
  },

  // ═══════════════════════════════════════
  // 第6关：综合 — 办公室全部断网
  // ═══════════════════════════════════════════════════════════════
  {
    id: 9, title: '整层楼断网', difficulty: '⭐⭐⭐', category: '综合',
    description: '3 楼整个楼层所有同事都说网络断了，手机连 WiFi 也不行。你赶到弱电井发现机柜的灯不正常。',
    hint: '整层楼断网大概率是机柜级别的故障。检查交换机的电源和上联链路。',
    topology: {
      devices: [
        { id: 'pc6a', type: 'computer', label: '工位A', x: 50, y: 80, status: 'offline' },
        { id: 'pc6b', type: 'computer', label: '工位B', x: 50, y: 160, status: 'offline' },
        { id: 'pc6c', type: 'computer', label: '工位C', x: 50, y: 240, status: 'offline' },
        { id: 'ap6', type: 'wifi', label: '无线 AP', x: 50, y: 320, status: 'offline' },
        { id: 'sw6a', type: 'switch', label: '楼层汇聚交换机', x: 250, y: 200, ports: 48 },
        { id: 'rt6', type: 'router', label: '核心路由器', x: 450, y: 200 },
      ],
      connections: [
        { from: 'pc6a', to: 'sw6a', fromPort: null, toPort: 1, status: 'up' },
        { from: 'pc6b', to: 'sw6a', fromPort: null, toPort: 2, status: 'up' },
        { from: 'pc6c', to: 'sw6a', fromPort: null, toPort: 3, status: 'up' },
        { from: 'ap6', to: 'sw6a', fromPort: null, toPort: 4, status: 'up' },
        { from: 'sw6a', to: 'rt6', fromPort: 48, toPort: 1, status: 'down' },
      ],
    },
    fault: { type: 'uplink-down', device: 'sw6a', detail: '楼层交换机到核心路由器的光纤链路中断' },
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
    expectedSteps: [
      { type: 'ping', target: '192.168.1.1', expectedResult: '请求超时' },
      { type: 'tracert', target: '8.8.8.8', expectedResult: '第一跳就超时' },
      { type: 'show', target: 'switch uplink', expectedResult: '端口 48 (GigabitEthernet0/48) down' },
      { type: 'diagnose', answer: '交换机到路由器的上联链路中断' },
      { type: 'fix', command: '检查光纤线路、更换尾纤或修复端口' },
    ],
    review: {
      summary: '整层楼断网一定是公共链路出了问题。检查发现汇聚交换机到核心路由器的上联端口 down 了，说明光纤链路中断。可能是尾纤损坏、光模块故障或线路被误拔。',
      steps: [
        { command: 'ping 网关', result: '不通', explanation: '网关都不通，说明本层与核心网络之间的连接断了。' },
        { command: 'tracert 8.8.8.8', result: '第一跳就超时', explanation: 'tracert 显示第一跳（网关）就出不去，确认是上联链路问题。' },
        { command: '查看交换机上联端口', result: 'G0/48 down', explanation: '登录汇聚交换机查看，上联到核心的 48 号端口状态为 down，说明物理层没有信号。' },
        { command: '检查光模块和尾纤', result: '尾纤弯曲过度导致光衰过大', explanation: '检查机柜后发现尾纤被机柜门夹住、弯曲过度，光信号衰减严重。更换尾纤后端口恢复。' },
      ],
      optimalPath: '整层断网不需要逐台排查电脑。直接登录汇聚交换机看上联端口状态是最快的方式。同时检查机柜环境和设备指示灯。',
    },
  },

  // ═══════════════════════════════════════
  // 第10关：办公室端口对应关系
  // ═══════════════════════════════════════
  {
    id: 10, title: '办公室端口对应排查', difficulty: '⭐⭐', category: '综合',
    description: '公司最近重新装修，搬回来之后销售部办公室 A 区 3 号工位的电脑插上任何网线口都上不了网。其他工位正常。你需要找到这个工位对应的交换机端口。办公室的墙上信息面板编号是 A-03。',
    hint: '每个工位的信息面板都连接到了弱电间的配线架上，再通过跳线连接到交换机对应端口。你需要根据信息面板编号找到对应的配线架端口和交换机端口。',
    topology: {
      devices: [
        { id: 'pc10', type: 'computer', label: 'A-03 工位电脑', x: 80, y: 200, status: 'offline' },
        { id: 'patch10', type: 'switch', label: '配线架 (Patch Panel)', x: 280, y: 200, ports: 24 },
        { id: 'sw10', type: 'switch', label: '销售部交换机', x: 480, y: 200, ports: 24 },
        { id: 'rt10', type: 'router', label: '核心路由器', x: 680, y: 200 },
      ],
      connections: [
        { from: 'pc10', to: 'patch10', fromPort: null, toPort: 3, status: 'up' },
        { from: 'patch10', to: 'sw10', fromPort: 3, toPort: 12, status: 'up' },
        { from: 'sw10', to: 'rt10', fromPort: 24, toPort: 1, status: 'up' },
      ],
    },
    fault: { type: 'port-mapping', device: 'sw10', detail: '配线架端口 3 对应的跳线插到了交换机端口 12，但该端口属于 VLAN 99(管理 VLAN)，而销售部在 VLAN 10' },
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
    expectedSteps: [
      { type: 'show', target: 'switch vlan brief', expectedResult: 'VLAN 10: Gi0/1-11,13-24 / VLAN 99: Gi0/12' },
      { type: 'show', target: 'switch mac-address-table', expectedResult: 'A-03 工位 MAC 在 Gi0/12 上' },
      { type: 'diagnose', answer: '跳线插错了交换机端口' },
      { type: 'fix', command: '将跳线从 Gi0/12 换到 Gi0/10 (VLAN 10 的空闲端口)' },
    ],
    review: {
      summary: '办公室信息面板到交换机之间经过配线架（Patch Panel）。每个工位的信息面板编号对应配线架的一个端口，配线架再通过跳线连接到交换机的端口。这次故障是因为装修后跳线被重新插过，插错了端口，导致 A-03 工位被分配到了错误的 VLAN。',
      steps: [
        { command: '查看信息面板编号', result: 'A-03 — 销售部 A 区 3 号工位', explanation: '每个工位的墙上信息面板都有编号，格式为"区域-工位号"。这个编号对应弱电间配线架上的端口号。A-03 表示 A 区 3 号工位，对应配线架端口 3。' },
        { command: 'show vlan brief', result: 'Gi0/12 在 VLAN 99，其他销售部端口在 VLAN 10', explanation: '登录交换机查看 VLAN 配置，发现端口 12 属于 VLAN 99（管理 VLAN），而销售部的其他端口都在 VLAN 10。VLAN 不同无法通信。' },
        { command: 'show mac-address-table', result: 'A-03 电脑的 MAC 地址出现在 Gi0/12', explanation: '查看 MAC 地址表，确认 A-03 电脑确实连接在 Gi0/12 上。再次确认是跳线插错了位置。' },
        { command: '重新插拔跳线', result: '将跳线从 Gi0/12 换到 VLAN 10 的空闲端口 Gi0/10', explanation: '跳线应该插在销售部 VLAN 10 的空闲端口上。信息面板编号和配线架端口一一对应，但跳线可能被误插。重新插到正确的端口后，A-03 电脑获取到正确的 IP 地址，网络恢复。' },
      ],
      optimalPath: '先查看信息面板编号确认工位位置，再到交换机查看 VLAN 配置和 MAC 地址表，确认端口归属。信息面板、配线架、交换机端口三者之间的关系要搞清楚。',
    },
  },

  // ═══════════════════════════════════════
  // 第11关：电脑 IP 配置错误
  // ═══════════════════════════════════════
  {
    id: 11, title: '电脑静态 IP 配置错误', difficulty: '⭐⭐', category: '网络层',
    description: '设计部新来的设计师需要连接一台网络打印机。IT 同事给她分配了静态 IP：192.168.2.50。配置后她能 ping 通自己，但 ping 不通打印机（192.168.2.100），也无法上网。打印机和其他同事的电脑都在同一网段且正常工作。',
    hint: '检查新来的设计师的 IP 配置，特别注意子网掩码和网关是否正确。能 ping 通自己说明网卡工作正常。',
    topology: {
      devices: [
        { id: 'pc11', type: 'computer', label: '设计师电脑', x: 80, y: 120, status: 'offline' },
        { id: 'printer11', type: 'server', label: '网络打印机', x: 80, y: 280 },
        { id: 'sw11', type: 'switch', label: '设计部交换机', x: 300, y: 200, ports: 24 },
        { id: 'rt11', type: 'router', label: '核心网关', x: 520, y: 200 },
      ],
      connections: [
        { from: 'pc11', to: 'sw11', fromPort: null, toPort: 5, status: 'up' },
        { from: 'printer11', to: 'sw11', fromPort: null, toPort: 6, status: 'up' },
        { from: 'sw11', to: 'rt11', fromPort: 24, toPort: 1, status: 'up' },
      ],
    },
    fault: { type: 'ip-config', device: 'pc11', detail: '设计师电脑的子网掩码被设成了 255.255.0.0 (应该为 255.255.255.0)' },
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
    expectedSteps: [
      { type: 'ipconfig', target: '', expectedResult: 'IPv4: 192.168.2.50 / 掩码: 255.255.0.0' },
      { type: 'ping', target: '192.168.2.100', expectedResult: '请求超时 (跨子网)' },
      { type: 'diagnose', answer: '子网掩码配置错误' },
      { type: 'fix', command: '将子网掩码改为 255.255.255.0' },
    ],
    review: {
      summary: '子网掩码决定了哪些 IP 地址在同一个"网络"内，可以直接通信。255.255.0.0 表示前 16 位是网络位，后 16 位是主机位，覆盖了 192.168.0.0~192.168.255.255 范围。但公司实际使用的是 255.255.255.0（前 24 位），范围只有 192.168.2.0~192.168.2.255。由于子网掩码不匹配，电脑认为打印机在"同一个子网"，但网关认为它们在不同子网，导致通信失败。',
      steps: [
        { command: 'ipconfig', result: 'IPv4: 192.168.2.50 / 子网掩码: 255.255.0.0', explanation: '电脑配置的 IP 地址是 192.168.2.50，但子网掩码是 255.255.0.0。这个掩码意味着前 16 位是网络号，后 16 位是主机号，网络地址是 192.168.0.0。' },
        { command: 'ping 192.168.2.100', result: '不通', explanation: '虽然电脑认为打印机在"同一个子网"（192.168.x.x），但网关（路由器）使用 255.255.255.0 的掩码来判断。当电脑发送数据包时，网关发现目标地址 192.168.2.100 不在 192.168.2.0/24 网段内（按网关的掩码计算），因此不会转发 ARP 请求，导致通信失败。' },
        { command: '修改子网掩码', result: '改为 255.255.255.0 后恢复正常', explanation: '将子网掩码从 255.255.0.0 改为 255.255.255.0（前 24 位）。这样电脑和网关使用相同的子网掩码，网络地址都是 192.168.2.0，打印机就在同一子网内，可以正常通信了。' },
      ],
      optimalPath: '遇到网络不通时，ipconfig 是最先应该执行的命令。仔细检查 IP、子网掩码、网关这三项配置。一个常见的错误是子网掩码输错了导致"能 ping 自己但不能 ping 别人"。',
    },
  },

  // ═══════════════════════════════════════
  // 第12关：机房光模块故障
  // ═══════════════════════════════════════
  {
    id: 12, title: '机房光模块故障排查', difficulty: '⭐⭐⭐', category: '综合',
    description: '周一早晨，客服部和运营部反映网络非常卡顿，部分网页打不开。你来到机房检查，发现核心交换机和汇聚交换机之间的光纤链路指示灯在闪烁不稳定。客服部与运营部分别连接到两台不同的汇聚交换机。',
    hint: '光纤链路指示灯不稳定表示可能有光衰或者光模块故障。登录交换机检查光模块的收发功率。',
    topology: {
      devices: [
        { id: 'pc12a', type: 'computer', label: '客服部电脑', x: 60, y: 80 },
        { id: 'pc12b', type: 'computer', label: '运营部电脑', x: 60, y: 220 },
        { id: 'sw12a', type: 'switch', label: '客服部汇聚交换机', x: 250, y: 80, ports: 24 },
        { id: 'sw12b', type: 'switch', label: '运营部汇聚交换机', x: 250, y: 220, ports: 24 },
        { id: 'core12', type: 'switch', label: '核心交换机', x: 460, y: 150, ports: 48 },
        { id: 'rt12', type: 'router', label: '出口路由器', x: 660, y: 150 },
      ],
      connections: [
        { from: 'pc12a', to: 'sw12a', fromPort: null, toPort: 1, status: 'up' },
        { from: 'pc12b', to: 'sw12b', fromPort: null, toPort: 1, status: 'up' },
        { from: 'sw12a', to: 'core12', fromPort: 24, toPort: 1, status: 'unstable' },
        { from: 'sw12b', to: 'core12', fromPort: 24, toPort: 2, status: 'unstable' },
        { from: 'core12', to: 'rt12', fromPort: 48, toPort: 1, status: 'up' },
      ],
    },
    fault: { type: 'sfp-fault', device: 'core12', detail: '核心交换机上连接汇聚的万兆光模块光衰过大，CRC 错误包激增' },
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
    expectedSteps: [
      { type: 'show', target: 'interface gigabitethernet 1/0/1', expectedResult: '大量 CRC 错误, 输入错误' },
      { type: 'show', target: 'interface gigabitethernet 1/0/2', expectedResult: '同样有 CRC 错误' },
      { type: 'diagnose', answer: '光模块故障或光纤线路问题' },
      { type: 'fix', command: '清洁光纤接口并更换光模块' },
    ],
    review: {
      summary: '两个不同部门的网络同时出现卡顿，问题很可能出在共同的上游链路上。检查发现核心交换机上连接汇聚交换机的光模块接口有大量 CRC 错误。CRC（循环冗余校验）错误通常由物理层信号质量问题引起——可能是光模块老化、光纤接口脏污或尾纤损坏。',
      steps: [
        { command: 'show interface', result: 'CRC 错误计数持续增长', explanation: '登录核心交换机查看接口状态，发现连接到两台汇聚交换机的端口都有大量的 CRC 校验错误。CRC 错误意味着数据在传输过程中发生了比特错误，通常是由物理层信号质量差引起的。' },
        { command: '检查收发功率', result: '接收光功率 -18dBm (正常范围 -10~-3dBm)', explanation: '进一步检查光模块的收发功率，发现接收功率远低于正常水平。光模块接收不到足够的光信号，导致数据在传输过程中频繁出错。' },
        { command: '清洁光纤端面', result: '光功率恢复正常', explanation: '用光纤清洁笔清洁了光纤端面（连接器端面容易沾上灰尘和油污），重新插上后发现光功率有所改善但仍然不稳定。' },
        { command: '更换光模块', result: 'CRC 错误停止增长，网络恢复稳定', explanation: '更换了一个新的万兆光模块，再次检查接口状态，CRC 错误不再增长，网络恢复正常。光模块是有寿命的，长时间使用后可能出现光衰。' },
      ],
      optimalPath: '两个不相关的部门同时出现问题，找它们的共同点——核心交换机的端口。先检查端口错误计数，再查光模块收发功率，这是机房级故障的标准排查流程。',
    },
  },

  // ═══════════════════════════════════════
  // 第13关：ACL 访问控制列表误配置
  // ═══════════════════════════════════════
  {
    id: 13, title: 'ACL 配置导致无法访问', difficulty: '⭐⭐⭐', category: '网络层',
    description: '人事部新上了一套 HR 系统，服务器 IP 是 10.0.10.50 端口 8443。IT 经理配置了防火墙规则允许访问。但是人事部的同事说只有部分人能访问，另一部分人打不开页面。能访问和不能访问的人都在同一个办公室、同一个网段。',
    hint: '能访问和不能访问的人在同一网段，说明问题不在物理连接或路由。检查防火墙或交换机的 ACL 配置，看看规则顺序是否有问题。',
    topology: {
      devices: [
        { id: 'pc13a', type: 'computer', label: '人事A (能访问)', x: 60, y: 80 },
        { id: 'pc13b', type: 'computer', label: '人事B (不能访问)', x: 60, y: 200 },
        { id: 'sw13', type: 'switch', label: '接入交换机', x: 260, y: 140, ports: 24 },
        { id: 'fw13', type: 'router', label: '防火墙', x: 460, y: 140 },
        { id: 'svr13', type: 'server', label: 'HR 系统服务器', x: 660, y: 140 },
      ],
      connections: [
        { from: 'pc13a', to: 'sw13', fromPort: null, toPort: 3, status: 'up' },
        { from: 'pc13b', to: 'sw13', fromPort: null, toPort: 4, status: 'up' },
        { from: 'sw13', to: 'fw13', fromPort: 24, toPort: 1, status: 'up' },
        { from: 'fw13', to: 'svr13', fromPort: 2, toPort: null, status: 'up' },
      ],
    },
    fault: { type: 'acl-misconfig', device: 'fw13', detail: '防火墙 ACL 第 5 条规则 deny 了 10.0.0.0/16 段的所有访问，但前面有一条 permit 规则只允许了特定 IP' },
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
    ],
    expectedSteps: [
      { type: 'telnet', target: '防火墙', expectedResult: '进入防火墙 CLI' },
      { type: 'show', target: 'access-list', expectedResult: 'ACL 规则顺序有误' },
      { type: 'diagnose', answer: 'ACL 规则顺序导致部分 IP 被拦截' },
      { type: 'fix', command: '调整 ACL 规则顺序' },
    ],
    review: {
      summary: 'ACL（访问控制列表）按顺序匹配规则，一旦匹配就停止继续检查。如果 deny 规则放在了 permit 规则前面，或者 deny 规则覆盖的范围比预期更大，就会导致不该拦截的流量被拦截。',
      steps: [
        { command: 'show access-list', result: '查看 ACL 规则及匹配次数', explanation: '在防火墙上查看 ACL 配置。发现第 5 条规则 deny ip 10.0.0.0 0.0.255.255 any——这条规则拒绝了所有源 IP 属于 10.0.0.0/16 段的流量。而人事部的部分同事的 IP 恰好在这个范围。' },
        { command: '检查规则顺序', result: 'deny 规则放在了 permit 规则之前', explanation: 'permit 规则只开放了特定 IP 访问 10.0.10.50:8443，但 deny 规则放在了它前面。ACL 是顺序匹配的，流量先匹配到 deny 规则被拒绝，后面的 permit 规则就没有机会执行了。' },
        { command: '调整规则顺序', result: '将 permit 规则移到 deny 规则之前', explanation: '将允许访问 HR 系统的规则移到 deny 规则之前。调整后，人事部同事的访问请求先匹配到 permit 规则，被允许通过。网络访问恢复。' },
      ],
      optimalPath: 'ACL 调试时，除了看规则内容，还要看每条规则的匹配次数（hits）。如果 deny 规则的 hits 在增长但 permit 规则的 hits 为 0，基本可以确定是规则顺序问题。',
    },
  },
]
