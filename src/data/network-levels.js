// 网络运维模拟器 — 关卡数据
// 每个关卡包含：拓扑、故障、排查步骤、复盘

export const levels = [
  // ═══════════════════════════════════════
  // 教学关1：欢迎来到网络运维世界
  // ═══════════════════════════════════════
  {
    id: 1, title: '第1课：认识游戏界面', difficulty: '📖', category: '教学',
    description: '欢迎来到网络运维模拟器！这是你的第一堂课。在这一关里，你将认识游戏界面的各个区域，了解它们的作用。准备好了吗？让我们开始吧！',
    hint: '仔细看看屏幕上有哪些区域。左边是工具栏，上面是网络拓扑图，下面是命令终端。试着点击各个区域看看会发生什么。',
    tutorial: {
      steps: [
        {
          title: '👋 欢迎！',
          content: '你好，网络工程师！欢迎来到网络运维模拟器。\n\n在这个游戏里，你将扮演一名网络工程师，解决各种网络故障。\n\n让我先带你认识一下游戏界面。',
          highlight: null,
        },
        {
          title: '🗺️ 拓扑图区域',
          content: '屏幕上方的大区域是【网络拓扑图】。\n\n这里展示了整个网络的结构，包括各种设备（电脑、交换机、路由器等）和它们之间的连接线路。\n\n💡 小提示：绿色的线表示链路正常，红色表示链路中断。',
          highlight: 'topo',
        },
        {
          title: '🛠️ 左侧工具栏',
          content: '屏幕左边是【快捷命令工具栏】。\n\n这里有一些常用的排查工具按钮，点击它们可以快速执行对应的命令，不用手动输入。\n\n包含：ping命令、ipconfig、tracert路由追踪、nslookup域名解析等。',
          highlight: 'toolbar',
        },
        {
          title: '💻 终端区域',
          content: '屏幕下方是【命令终端】。\n\n这就像真实的电脑命令行一样，你可以在这里输入各种网络命令来排查问题。\n\n试着在终端里输入 help 然后按回车，看看会发生什么！',
          highlight: 'terminal',
        },
        {
          title: '📋 任务说明栏',
          content: '屏幕右上角是【当前任务说明】。\n\n这里会告诉你当前关卡的故障现象和需要解决的问题。\n\n右边还有关卡进度和提示按钮，卡住的时候可以点提示获得帮助。',
          highlight: 'mission',
        },
        {
          title: '🎮 开始你的冒险吧！',
          content: '好啦，界面介绍完毕！\n\n总结一下：\n• 拓扑图 = 看网络结构\n• 工具栏 = 快速点命令\n• 终端 = 输入命令排查\n• 任务栏 = 知道该做什么\n\n点击"完成教学"按钮，进入下一关学习真正的网络知识吧！',
          highlight: null,
        },
      ],
    },
    topology: {
      devices: [
        { id: 'pc_t1', type: 'computer', label: '你的电脑', x: 80, y: 180 },
        { id: 'sw_t1', type: 'switch', label: '交换机', x: 280, y: 180, ports: 8 },
        { id: 'rt_t1', type: 'router', label: '路由器', x: 480, y: 180 },
      ],
      connections: [
        { from: 'pc_t1', to: 'sw_t1', fromPort: null, toPort: 1, status: 'up' },
        { from: 'sw_t1', to: 'rt_t1', fromPort: 8, toPort: 1, status: 'up' },
      ],
    },
    fault: { type: 'none', device: '', detail: '这是一个教学关卡，没有故障' },
    expectedSteps: [
      { type: 'diagnose', answer: '完成界面认识' },
    ],
    review: {
      summary: '恭喜你完成了第一课！现在你已经认识了游戏的基本界面。在接下来的关卡中，你将学习网络知识，解决各种故障。',
      steps: [
        { command: '拓扑图', result: '展示网络设备和连接', explanation: '通过拓扑图可以直观地看到整个网络的结构，包括电脑、交换机、路由器等设备，以及它们之间的连接线路。' },
        { command: '工具栏', result: '快捷执行常用命令', explanation: '左侧工具栏提供了 ping、ipconfig、tracert、nslookup 等常用命令的快捷按钮，点击即可快速执行。' },
        { command: '终端', result: '手动输入命令', explanation: '终端就像真实的命令行一样，可以输入各种网络命令来排查故障。支持上下方向键查看历史命令。' },
        { command: '任务栏', result: '显示当前任务和进度', explanation: '右上角的任务说明告诉你当前关卡需要解决什么问题，还可以查看进度和获取提示。' },
      ],
      optimalPath: '这是教学关卡，重点是熟悉界面。下一关我们将学习网络基础知识。',
    },
  },

  // ═══════════════════════════════════════
  // 教学关2：认识网络设备
  // ═══════════════════════════════════════
  {
    id: 2, title: '第2课：认识网络设备', difficulty: '📖', category: '教学',
    description: '网络中有很多不同的设备，它们各司其职。在这一关里，我们来认识一下最常见的几种网络设备：电脑、交换机、路由器和服务器。',
    hint: '仔细观察拓扑图中的每个设备，它们的图标和名字都不一样。想想看，你家里的网络都有哪些设备？',
    tutorial: {
      steps: [
        {
          title: '💻 电脑（终端设备）',
          content: '首先来认识【电脑】，也叫终端设备。\n\n这就是我们日常使用的电脑、手机、打印机等。\n\n它们是网络的"使用者"，发送和接收数据。\n\n💡 特点：位于网络的边缘，是数据的起点和终点。',
          highlight: 'device:pc_t2',
        },
        {
          title: '🔀 交换机（Switch）',
          content: '接下来是【交换机】。\n\n交换机就像一个"交通枢纽"，它把同一个网络里的所有设备连接起来。\n\n同一楼层或同一办公室的电脑，通常都连到同一台交换机上。\n\n💡 特点：负责同一个网络内的数据转发，有很多端口可以插网线。',
          highlight: 'device:sw_t2',
        },
        {
          title: '🌐 路由器（Router）',
          content: '然后是【路由器】。\n\n路由器就像"邮局"，负责把数据从一个网络送到另一个网络。\n\n你家里的路由器就是把你家的局域网和互联网连起来。\n\n💡 特点：连接不同的网络，是网络与网络之间的桥梁。',
          highlight: 'device:rt_t2',
        },
        {
          title: '🖥️ 服务器（Server）',
          content: '最后是【服务器】。\n\n服务器是提供服务的电脑，比如网站、文件存储、游戏等。\n\n当你访问一个网站时，你的电脑就是"客户端"，网站所在的电脑就是"服务器"。\n\n💡 特点：24小时开机，为其他设备提供各种网络服务。',
          highlight: 'device:svr_t2',
        },
        {
          title: '📡 无线AP（WiFi）',
          content: '还有一种常见设备是【无线AP】，也就是WiFi热点。\n\n它把有线网络转换成无线信号，让手机、笔记本等设备可以无线上网。\n\n你家里的无线路由器其实就是路由器 + 无线AP的组合。',
          highlight: null,
        },
        {
          title: '🎉 设备认识完毕！',
          content: '好啦，现在你认识了五种常见网络设备：\n\n💻 电脑 —— 使用者，数据的起点和终点\n🔀 交换机 —— 交通枢纽，连接同一网络的设备\n🌐 路由器 —— 邮局，连接不同的网络\n🖥️ 服务器 —— 服务提供者，24小时工作\n📡 无线AP —— WiFi热点，提供无线上网\n\n下一关我们来学习数据是怎么在网络中传输的！',
          highlight: null,
        },
      ],
    },
    topology: {
      devices: [
        { id: 'pc_t2', type: 'computer', label: '办公电脑', x: 80, y: 180 },
        { id: 'sw_t2', type: 'switch', label: '接入交换机', x: 280, y: 180, ports: 24 },
        { id: 'rt_t2', type: 'router', label: '核心路由器', x: 480, y: 100 },
        { id: 'svr_t2', type: 'server', label: '公司服务器', x: 480, y: 260 },
      ],
      connections: [
        { from: 'pc_t2', to: 'sw_t2', fromPort: null, toPort: 5, status: 'up' },
        { from: 'sw_t2', to: 'rt_t2', fromPort: 24, toPort: 1, status: 'up' },
        { from: 'rt_t2', to: 'svr_t2', fromPort: 2, toPort: null, status: 'up' },
      ],
    },
    fault: { type: 'none', device: '', detail: '教学关卡，没有故障' },
    expectedSteps: [
      { type: 'diagnose', answer: '认识各种网络设备' },
    ],
    review: {
      summary: '网络设备是构成网络的基础。每种设备都有自己的角色和功能，就像一个公司里不同岗位的员工一样。',
      steps: [
        { command: '电脑（终端）', result: '发送和接收数据的设备', explanation: '电脑、手机、打印机都是终端设备，它们是网络数据的生产者和消费者。' },
        { command: '交换机', result: '同一网络内的数据转发', explanation: '交换机有很多端口，用来连接同一网络内的多台设备，在它们之间转发数据。' },
        { command: '路由器', result: '连接不同的网络', explanation: '路由器负责在不同网络之间转发数据，是网络的"十字路口"。家里的路由器连接着你的局域网和互联网。' },
        { command: '服务器', result: '提供网络服务的设备', explanation: '服务器是专门提供服务的电脑，比如网页服务、文件服务、邮件服务等。它们通常24小时不间断运行。' },
      ],
      optimalPath: '这是教学关卡，重点是认识各种网络设备。下一关我们将学习网络排查的常用命令。',
    },
  },

  // ═══════════════════════════════════════
  // 教学关3：第一个命令 —— ping
  // ═══════════════════════════════════════
  {
    id: 3, title: '第3课：你的第一个命令 ping', difficulty: '📖', category: '教学',
    description: '现在来学习网络排障中最最常用的命令——ping！它就像网络世界的"敲门"，你敲一下，看看对方有没有回应。',
    hint: '在下面的终端里输入 ping 192.168.1.1 然后按回车试试。或者直接点击左边工具栏的 ping 按钮。',
    tutorial: {
      steps: [
        {
          title: '📡 什么是 ping？',
          content: 'ping 是网络工程师最常用的命令，没有之一！\n\n它的作用是：测试你和目标设备之间网络通不通。\n\n原理很简单：你发一个"小数据包"给对方，对方收到后回复一个。能收到回复 = 网络通。',
          highlight: 'terminal',
        },
        {
          title: '🔧 怎么用 ping？',
          content: '使用方法超简单：\n\nping + 目标IP地址\n\n比如：\nping 192.168.1.1\n\n💡 小技巧：左边工具栏有 ping 的快捷按钮，点一下就能快速执行！',
          highlight: 'toolbar',
        },
        {
          title: '✅ 成功的样子',
          content: '如果网络通，你会看到类似这样的回复：\n\n来自 192.168.1.1 的回复: 字节=32 时间<1ms TTL=64\n来自 192.168.1.1 的回复: 字节=32 时间<1ms TTL=64\n\n每一行都代表收到了一次回复。',
          highlight: 'terminal',
        },
        {
          title: '❌ 失败的样子',
          content: '如果网络不通，你会看到：\n\n请求超时。\n请求超时。\n\n这说明数据包发出去了，但没有收到回复。\n网络不通的原因有很多，可能是网线没插好、对方关机了、防火墙拦截了等等。',
          highlight: 'terminal',
        },
        {
          title: '🎯 试着 ping 一下！',
          content: '现在轮到你动手啦！\n\n试着 ping 一下网关路由器：\n\n目标IP：192.168.1.1\n\n你可以直接在终端输入 ping 192.168.1.1，或者点击左边工具栏的 ping 按钮。\n\n试试看吧！',
          highlight: 'terminal',
        },
        {
          title: '🎉 恭喜！你学会了 ping！',
          content: '太棒了！你已经掌握了网络排障的第一个命令！\n\nping 是排查网络问题的第一步，遇到网络不通时，先 ping 一下看看通不通。\n\n下一关我们将学习更多有用的命令！',
          highlight: null,
        },
      ],
    },
    topology: {
      devices: [
        { id: 'pc_t3', type: 'computer', label: '你的电脑', x: 80, y: 200 },
        { id: 'sw_t3', type: 'switch', label: '楼层交换机', x: 300, y: 200, ports: 24 },
        { id: 'rt_t3', type: 'router', label: '网关路由器', x: 520, y: 200 },
      ],
      connections: [
        { from: 'pc_t3', to: 'sw_t3', fromPort: null, toPort: 10, status: 'up' },
        { from: 'sw_t3', to: 'rt_t3', fromPort: 24, toPort: 1, status: 'up' },
      ],
    },
    fault: { type: 'none', device: '', detail: '教学关卡，没有故障' },
    expectedSteps: [
      { type: 'ping', target: '192.168.1.1', expectedResult: '成功' },
      { type: 'diagnose', answer: '学会了 ping 命令' },
    ],
    review: {
      summary: 'ping 是网络排障最基础也是最重要的命令。任何网络问题，第一步都是用 ping 来确认连通性。',
      steps: [
        { command: 'ping 命令', result: '测试网络连通性', explanation: 'ping 发送 ICMP 数据包到目标地址，通过是否收到回复来判断网络是否连通。是网络排障的第一神器。' },
        { command: '成功回复', result: '来自 x.x.x.x 的回复: 字节=32 时间<1ms', explanation: '能收到回复说明网络是通的。"时间"越小说明速度越快，"TTL"表示数据包经过了多少跳。' },
        { command: '请求超时', result: '网络不通或对方未响应', explanation: '"请求超时"表示数据包发出去了但没有收到回复。可能原因：网线故障、对方关机、防火墙拦截等。' },
        { command: '排查思路', result: '先 ping 网关，再 ping 外网', explanation: '遇到上不了网时，先 ping 网关（192.168.1.1）确认局域网是否通，再 ping 外网IP确认互联网是否通。' },
      ],
      optimalPath: '先 ping 网关确认局域网连通性，再 ping 外网确认互联网连通性。这是网络排障的标准第一步。',
    },
  },

  // ═══════════════════════════════════════
  // 教学关4：ipconfig —— 查看自己的配置
  // ═══════════════════════════════════════
  {
    id: 4, title: '第4课：ipconfig 查看配置', difficulty: '📖', category: '教学',
    description: '这节课我们来学习 ipconfig 命令。它可以查看你自己电脑的网络配置信息，比如 IP 地址、网关、DNS 等等。',
    hint: '在终端里输入 ipconfig 然后按回车，看看你的电脑网络配置是什么样的。',
    tutorial: {
      steps: [
        {
          title: '🏠 什么是 ipconfig？',
          content: 'ipconfig 是用来查看你自己电脑网络配置的命令。\n\n它会告诉你：\n• 你的IP地址是什么\n• 你的网关路由器地址是什么\n• 你的DNS服务器是什么\n• 网线有没有插好\n\n💡 就像查你自己的"身份证"一样。',
          highlight: 'terminal',
        },
        {
          title: '🔢 IP地址是什么？',
          content: 'IP地址就像你家的门牌号。\n\n网络中的每台设备都有一个唯一的IP地址，这样数据才能准确地送到正确的设备。\n\n常见的局域网IP格式：192.168.1.x\n\n比如：192.168.1.100',
          highlight: null,
        },
        {
          title: '🚪 什么是默认网关？',
          content: '默认网关就是你通往外部网络的"大门"。\n\n通常就是你家里的路由器地址。\n\n当你要访问外网（比如百度）时，数据会先发给网关，由网关帮你转发出去。\n\n常见网关地址：192.168.1.1',
          highlight: 'device:rt_t4',
        },
        {
          title: '📚 什么是DNS？',
          content: 'DNS 就像"电话簿"。\n\n你记住的是域名（比如 baidu.com），但电脑需要的是IP地址。\nDNS服务器负责把域名翻译成IP地址。\n\n没有DNS，你就只能记住一串串数字来访问网站了！',
          highlight: null,
        },
        {
          title: '🔧 试试 ipconfig！',
          content: '现在动手试试吧！\n\n在终端输入 ipconfig 然后按回车，\n或者点击左边工具栏的 ipconfig 按钮。\n\n看看你的电脑IP地址、网关、DNS都是什么？',
          highlight: 'terminal',
        },
        {
          title: '🎉 你又学会一个命令！',
          content: '太棒了！现在你学会了 ipconfig。\n\n记住几个关键点：\n• IP地址 = 你的门牌号\n• 默认网关 = 出外网的大门\n• DNS = 域名翻译电话簿\n\n下一关我们继续学习更多命令！',
          highlight: null,
        },
      ],
    },
    topology: {
      devices: [
        { id: 'pc_t4', type: 'computer', label: '你的电脑', x: 80, y: 200 },
        { id: 'sw_t4', type: 'switch', label: '接入交换机', x: 300, y: 200, ports: 16 },
        { id: 'rt_t4', type: 'router', label: '网关路由器', x: 520, y: 200 },
      ],
      connections: [
        { from: 'pc_t4', to: 'sw_t4', fromPort: null, toPort: 3, status: 'up' },
        { from: 'sw_t4', to: 'rt_t4', fromPort: 16, toPort: 1, status: 'up' },
      ],
    },
    fault: { type: 'none', device: '', detail: '教学关卡，没有故障' },
    expectedSteps: [
      { type: 'ipconfig', target: '', expectedResult: '看到IP配置信息' },
      { type: 'diagnose', answer: '学会了 ipconfig 命令' },
    ],
    review: {
      summary: 'ipconfig 让你了解自己电脑的网络配置。排查问题时，先看看自己的配置对不对，这是非常重要的一步。',
      steps: [
        { command: 'ipconfig', result: '查看本机网络配置', explanation: '显示本机的 IP 地址、子网掩码、默认网关、DNS 服务器等信息。是排查网络问题的基础命令。' },
        { command: 'IP 地址', result: '192.168.1.x 格式', explanation: 'IP 地址是设备在网络中的唯一标识，就像门牌号。同一局域网内不能有两台设备使用相同的 IP。' },
        { command: '默认网关', result: '通常是 192.168.1.1', explanation: '默认网关是访问外部网络的出口，一般就是路由器的地址。ping 不通网关说明局域网有问题。' },
        { command: '媒体已断开', result: '物理连接有问题', explanation: '如果 ipconfig 显示"媒体已断开"，说明网线没插好或者网卡被禁用了，是物理层问题。' },
      ],
      optimalPath: '网络不通时，先 ipconfig 查看自己的配置是否正确，再 ping 网关测试连通性。',
    },
  },

  // ═══════════════════════════════════════
  // 教学关5：tracert 和 nslookup
  // ═══════════════════════════════════════
  {
    id: 5, title: '第5课：tracert 与 nslookup', difficulty: '📖', category: '教学',
    description: '继续学习两个实用命令：tracert（路由追踪）和 nslookup（域名解析测试）。有了这两个命令，排查问题就更精准了！',
    hint: '试着用 tracert 追踪到 8.8.8.8 的路径，再用 nslookup 解析 baidu.com 的IP地址。',
    tutorial: {
      steps: [
        {
          title: '🗺️ tracert 是什么？',
          content: 'tracert 是"路由追踪"命令。\n\n它能告诉你：从你的电脑到目标地址，中间经过了哪些路由器（也就是"几跳"）。\n\n💡 用途：当网络不通时，用 tracert 可以看出是在哪一跳出问题的。',
          highlight: 'terminal',
        },
        {
          title: '📊 怎么看 tracert 结果？',
          content: 'tracert 的结果是这样的：\n\n  1    <1 ms   网关 [192.168.1.1]\n  2     5 ms   运营商路由器 [10.0.0.1]\n  3    20 ms   目标地址 [8.8.8.8]\n\n每一行代表经过的一个路由器。\n如果某一行显示"请求超时"，说明问题出在那一跳。',
          highlight: 'terminal',
        },
        {
          title: '🔍 nslookup 是什么？',
          content: 'nslookup 用来测试 DNS 解析。\n\n也就是：域名能不能正确翻译成 IP 地址。\n\n比如：nslookup baidu.com\n\n它会告诉你 baidu.com 对应的 IP 地址是什么。',
          highlight: 'terminal',
        },
        {
          title: '🎯 什么时候用 nslookup？',
          content: '当你遇到这种情况时：\n• ping IP地址能通\n• 但 ping 域名却不通\n\n这时候就用 nslookup 来确认 DNS 是否正常工作。\n\n如果 nslookup 失败，说明是 DNS 的问题。',
          highlight: null,
        },
        {
          title: '💪 动手试试吧！',
          content: '现在来练习一下这两个命令：\n\n1. 输入 tracert 8.8.8.8 看看经过几跳\n2. 输入 nslookup baidu.com 试试域名解析\n\n也可以点击左边工具栏的快捷按钮哦！',
          highlight: 'terminal',
        },
        {
          title: '🎉 命令全部学会啦！',
          content: '恭喜你！现在你已经掌握了网络排障的四大神器：\n\n🔧 ping —— 测试连通性\n🔧 ipconfig —— 查看本机配置\n🔧 tracert —— 追踪路由路径\n🔧 nslookup —— 测试DNS解析\n\n下一关开始，我们就要解决真正的网络故障啦！准备好了吗？',
          highlight: null,
        },
      ],
    },
    topology: {
      devices: [
        { id: 'pc_t5', type: 'computer', label: '你的电脑', x: 80, y: 200 },
        { id: 'sw_t5', type: 'switch', label: '接入交换机', x: 300, y: 200, ports: 24 },
        { id: 'rt_t5', type: 'router', label: '核心路由器', x: 520, y: 100 },
        { id: 'dns_t5', type: 'server', label: 'DNS 服务器', x: 520, y: 300 },
      ],
      connections: [
        { from: 'pc_t5', to: 'sw_t5', fromPort: null, toPort: 3, status: 'up' },
        { from: 'sw_t5', to: 'rt_t5', fromPort: 24, toPort: 1, status: 'up' },
        { from: 'rt_t5', to: 'dns_t5', fromPort: 2, toPort: null, status: 'up' },
      ],
    },
    fault: { type: 'none', device: '', detail: '教学关卡，没有故障' },
    expectedSteps: [
      { type: 'tracert', target: '8.8.8.8', expectedResult: '看到路由路径' },
      { type: 'nslookup', target: 'baidu.com', expectedResult: '解析出IP地址' },
      { type: 'diagnose', answer: '学会了 tracert 和 nslookup' },
    ],
    review: {
      summary: 'tracert 和 nslookup 是 ping 和 ipconfig 的好搭档。四个命令配合使用，几乎可以定位所有常见网络问题。',
      steps: [
        { command: 'tracert', result: '追踪数据包的路径', explanation: 'tracert 显示从本机到目标地址经过的每一跳路由器。通过在哪一跳超时，可以精准定位故障发生的位置。' },
        { command: 'nslookup', result: '测试 DNS 解析', explanation: 'nslookup 测试域名是否能正确解析为 IP 地址。能 ping IP 但不能 ping 域名时，用它确认 DNS 是否正常。' },
        { command: '排查思路', result: '分层排查，逐步缩小范围', explanation: '物理层 → 数据链路层 → 网络层 → 应用层。从下往上排查，先排除低级问题。' },
        { command: '四大命令总结', result: 'ping/ipconfig/tracert/nslookup', explanation: '四个命令配合使用：ipconfig看配置、ping测连通、tracert定位、nslookup查DNS。' },
      ],
      optimalPath: '遇到网络问题时，按这个顺序排查最快：ipconfig → ping网关 → ping外网 → tracert → nslookup。',
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
