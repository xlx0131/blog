// 作品列表
export const projects = [
  {
    id: 1,
    title: '用户画像分析系统',
    subtitle: '基于用户行为数据的标签体系构建',
    description:
      '通过对用户行为数据、业务数据进行清洗、建模、分析，构建一套完整的用户标签体系。涵盖全链路数据清洗、RFM 模型分析和可视化展示。',
    url: '/projects/1',
    tags: ['数据分析', '数据挖掘'],
    tech: ['Python', 'SQL', 'Pandas', 'Scikit-learn', 'Matplotlib'],
    cover: 'profile',
    year: '2025 - 2026',
    highlights: [
      '全链路数据清洗与质量治理 (Pandas + SQL)',
      'RFM 模型算法构建用户标签',
      '多源数据去重、缺失值填充与异常过滤',
      '生成可视化统计图片',
    ],
  },
  {
    id: 2,
    title: '运维模拟平台',
    subtitle: '交互式网络运维排障模拟游戏',
    description:
      '沉浸式网络故障排查模拟器，还原真实企业运维场景。从物理层到应用层，循序渐进的关卡设计，配合终端命令实战和故障诊断复盘，在游戏中掌握运维排障技能。',
    url: '/projects/2',
    tags: ['运维', '网络', '游戏化'],
    tech: ['Vue 3', 'TypeScript', 'ECharts', 'Linux', '网络'],
    cover: 'ops',
    year: '2025 - 2026',
    highlights: [
      '10+ 关卡循序渐进，覆盖物理层到应用层故障',
      '真实终端命令模拟，支持 ping / tracert / telnet 等',
      '可视化拓扑图，三视角切换（全局/机房/设备）',
      '故障诊断系统，分层排查训练运维思维',
      '完整复盘机制，评分体系与知识点扩展',
    ],
  },
  {
    id: 3,
    title: 'QQ星TV',
    subtitle: '像素风专属视频站，海量影视资源聚合',
    description:
      '聚合多个视频资源站的专属视频网站，支持电影、电视剧、动漫、综艺全分类浏览和搜索。多源切换、播放历史、收藏夹、自动续播，打造你的私人影院。',
    url: '/video',
    tags: ['视频', '影音', '聚合'],
    tech: ['Vue 3', 'TypeScript', 'Cloudflare Functions', 'maccms10', 'DPlayer'],
    cover: 'video',
    year: '2026',
    highlights: [
      '聚合 5+ 视频资源站，海量影视内容',
      '电影 / 电视剧 / 动漫 / 综艺 全分类',
      '多源一键切换，高清秒播',
      '观看历史 + 收藏夹，跨设备同步',
      '像素风沉浸式界面设计',
      'Cloudflare 边缘部署，全球加速',
    ],
  },
  {
    id: 4,
    title: '奶龙list',
    subtitle: '桌面待办与效率工具，融合 RPG 成长与时间胶囊',
    description:
      '基于 Electron 的桌面多功能效率工具。涵盖待办管理、朋友圈动态、时间胶囊、RPG 角色成长系统等模块。支持分类标签、优先级排序、重复任务、到期提醒、统计图表与主题切换，让日常事务管理变得有趣而有温度。',
    url: '',
    tags: ['效率工具', '桌面应用', '游戏化'],
    tech: ['Electron', 'JavaScript', 'Chart.js', 'HTML/CSS'],
    cover: 'todo',
    year: '2025 - 2026',
    highlights: [
      '完整的待办生命周期管理，支持分类/优先级/标签/重复/截止日期',
      '朋友圈模块 — 图文动态发布，图片/视频上传，评论与点赞',
      '时间胶囊 — XOR 加密写入未来内容，到期自动解密展示',
      'RPG 角色成长系统 — 完成任务获得经验值升级，称号体系激励',
      '日历视图 + 打卡追踪，连续天数统计培养习惯',
      'Chart.js 可视化统计图表，数据导出与自定义存储路径',
    ],
    downloadUrl: 'https://github.com/xlx0131/nailonglist/releases/download/v1.0.0/nailonglist-v1.0.0-win32-x64.zip',
  },
  {
    id: 5,
    title: 'Marvis Skills',
    subtitle: 'AI 自动化技能集合，赋能智能助手',
    description:
      '基于 Marvis 平台的 AI 技能集合仓库，将 AI Agent 能力封装为可复用的技能包。目前包含「抖音评论自动回复」「文件智能归类」「微博评论自动回复」三大技能，覆盖社交媒体自动化与文件管理场景。',
    url: 'https://github.com/xlx0131/skills-',
    tags: ['AI', '自动化', '技能'],
    tech: ['Marvis', 'Browser Agent', 'AI', '文件管理'],
    cover: 'skills',
    year: '2026',
    highlights: [
      'Marvis 平台技能包，将 AI 能力封装为可复用技能',
      '抖音评论自动回复 — Browser Agent 驱动网页自动化',
      '文件智能归类 — 11种分类维度+三级主题分类',
      '微博评论自动回复 — 定时发布+周期性检测回复',
      '智能登录检测与人机交互扫码登录流程',
      '批量读取评论区，逐条智能生成个性化回复',
      '回复语气自然、不重复，避免 AI 模板化',
      '完整的容错处理与安全提示机制',
    ],
  },
  {
    id: 6,
    title: 'JXAU教务一体化',
    subtitle: '江西农大教务系统自动化工具集',
    description:
      '基于 Python 的江西农业大学教务系统自动化工具集，涵盖自动抢课、成绩查询与课表查询三大场景。配合 ddddocr 离线 OCR 实现验证码自动识别，无需人工干预。同时提供 GUI 一体化桌面应用，三标签页切换 + 共享登录会话。',
    url: 'https://github.com/xlx0131/-JXAU-',
    tags: ['Python', '自动化', '教务系统'],
    tech: ['Python', 'requests', 'ddddocr', 'PyQt', 'GUI'],
    cover: 'course',
    year: '2026',
    highlights: [
      '抢课脚本 — 定时轮询检测课程余量，有余量立即提交',
      '成绩查询 — 全学期成绩拉取，按学期分组展示，CSV导出',
      '课表查询 — 网格化课表展示，上午/下午/晚上分区',
      '验证码自动识别 — ddddocr离线OCR，识别失败降级手动输入',
      'GUI一体化应用 — 三标签页切换，共享登录会话，免安装即用',
      '登录重试机制 — 验证码错误/网络波动时自动重试',
      '会话自动维护 — Session过期自动检测并重新登录',
    ],
  },
]

// 作品详情
export const projectDetails = {
  1: {
    title: '用户画像分析系统',
    subtitle: '基于用户行为数据的标签体系构建',
    description: '通过对用户行为数据、业务数据进行清洗、建模、分析，构建一套完整的用户标签体系。',
    url: '',
    tags: ['数据分析', '数据挖掘'],
    tech: ['Python', 'SQL', 'Pandas', 'Scikit-learn', 'Matplotlib'],
    year: '2025.12 - 2026.01',
    highlights: [
      '全链路数据清洗与质量治理',
      'RFM 模型算法构建用户标签',
      '多源数据去重、缺失值填充与异常值过滤',
      '生成可视化统计图片',
    ],
    details: `
      <p>通过对用户行为数据、业务数据进行清洗、建模、分析，构建一套完整的用户标签体系。</p>
      <h3>主要技术</h3>
      <ul>
        <li><strong>SQL</strong> — 多源数据查询与整合</li>
        <li><strong>Python (Pandas)</strong> — 数据清洗与预处理</li>
        <li><strong>聚类算法</strong> — 用户分群与标签构建</li>
        <li><strong>数据可视化</strong> — 统计图表生成</li>
      </ul>
      <h3>项目分工</h3>
      <ul>
        <li>数据来源与数据采集</li>
        <li>数据清洗与预处理</li>
        <li>利用 RFM 模型算法对用户构建标签</li>
        <li>生成可视化统计图片</li>
      </ul>
      <h3>核心职责</h3>
      <ul>
        <li>负责全链路数据清洗与质量治理，使用 Pandas + SQL 实现多源数据（用户行为、业务日志、交易数据）的去重、缺失值填充与异常值过滤，构建标准化数据清洗流程，保障下游分析与建模数据准确性。</li>
        <li>采用规则校验 + 统计检测相结合的方式，识别并处理重复数据、格式错误、逻辑异常等问题，结合自定义清洗脚本，将数据质量合格率提升，减少因脏数据导致的分析偏差。</li>
      </ul>
    `,
  },
  2: {
    title: '运维模拟平台',
    subtitle: '交互式网络运维排障模拟游戏',
    description: '沉浸式网络故障排查模拟器，还原真实企业运维场景。循序渐进的关卡设计，配合终端命令实战和故障诊断复盘，在游戏中掌握运维排障技能。',
    url: '',
    tags: ['运维', '网络', '游戏化'],
    tech: ['Vue 3', 'TypeScript', 'ECharts', 'Linux', '网络'],
    year: '2025.09 - 2026.02',
    highlights: [
      '10+ 关卡循序渐进，覆盖物理层到应用层故障',
      '真实终端命令模拟，支持 ping / tracert / telnet 等',
      '可视化拓扑图，三视角切换（全局/机房/设备）',
      '故障诊断系统，分层排查训练运维思维',
      '完整复盘机制，评分体系与知识点扩展',
    ],
    details: `
      <p>一款沉浸式网络运维排障模拟游戏，以真实企业网络环境为原型，将枯燥的运维知识转化为互动式闯关体验。从最简单的网线松动到复杂的 VLAN 错配和 ACL 拦截，每一关都是一次完整的排障实战。</p>
      <h3>核心特色</h3>
      <ul>
        <li><strong>赛博运维控制台</strong> — 沉浸式深色主题，霓虹风格 UI，打造真实运维监控中心氛围</li>
        <li><strong>真实终端模拟</strong> — 完整的命令行环境，支持 Tab 自动补全、Ctrl+R 历史搜索、语法高亮</li>
        <li><strong>可视化拓扑图</strong> — SVG 绘制的网络拓扑，数据流动效、设备状态实时显示</li>
        <li><strong>分层诊断系统</strong> — 按 OSI 七层模型组织故障选项，训练规范的排障思路</li>
        <li><strong>星级评分体系</strong> — 用时、准确率、方案选择、命令效率四维评分</li>
        <li><strong>复盘学习系统</strong> — 操作时间线、最优路径对比、知识点扩展卡片</li>
      </ul>
      <h3>关卡体系</h3>
      <ul>
        <li><strong>教学关卡</strong> — 认识网络拓扑、常用排查命令入门、IP 地址与端口</li>
        <li><strong>物理层故障</strong> — 网线松动、交换机端口未启用、光模块故障</li>
        <li><strong>网络层故障</strong> — IP 地址冲突、VLAN 端口划分错误、网关配置错误</li>
        <li><strong>应用层故障</strong> — DNS 服务器故障、端口映射错误、上联链路中断</li>
        <li><strong>综合挑战</strong> — 多故障点排查，综合运用所学技能</li>
      </ul>
      <h3>技术实现</h3>
      <ul>
        <li><strong>前端框架</strong> — Vue 3 + TypeScript，组合式 API 开发</li>
        <li><strong>UI 组件</strong> — shadcn-vue 组件库 + 自定义赛博风格样式</li>
        <li><strong>拓扑图</strong> — 原生 SVG 绘制，支持动画与交互</li>
        <li><strong>终端模拟器</strong> — 自研轻量级终端组件，命令解析与输出格式化</li>
        <li><strong>状态管理</strong> — Vue Composition API + localStorage 进度持久化</li>
      </ul>
      <h3>项目收获</h3>
      <ul>
        <li>深入理解网络 OSI 七层模型与各层常见故障</li>
        <li>掌握规范化的故障排查思路与方法论</li>
        <li>熟练使用 ping、tracert、ipconfig、telnet 等诊断工具</li>
        <li>提升问题分析与逻辑推理能力</li>
        <li>积累游戏化学习产品的设计与开发经验</li>
      </ul>
    `,
  },
  4: {
    title: '奶龙list',
    subtitle: '桌面待办与效率工具，融合 RPG 成长与时间胶囊',
    description:
      '基于 Electron 的桌面多功能效率工具。涵盖待办管理、朋友圈动态、时间胶囊、RPG 角色成长系统等模块，让日常事务管理变得有趣而有温度。',
    url: 'https://github.com/xlx0131/nailonglist',
    tags: ['效率工具', '桌面应用', '游戏化'],
    tech: ['Electron', 'JavaScript', 'Chart.js', 'HTML/CSS'],
    year: '2025 - 2026',
    downloadUrl: 'https://github.com/xlx0131/nailonglist/releases/download/v1.0.0/nailonglist-v1.0.0-win32-x64.zip',
    highlights: [
      '完整的待办生命周期管理，支持分类/优先级/标签/重复/截止日期',
      '朋友圈模块 — 图文动态发布，图片/视频上传，评论与点赞',
      '时间胶囊 — XOR 加密写入未来内容，到期自动解密展示',
      'RPG 角色成长系统 — 完成任务获得经验值升级，称号体系激励',
      '日历视图 + 打卡追踪，连续天数统计培养习惯',
      'Chart.js 可视化统计图表，数据导出与自定义存储路径',
    ],
    details: `
      <p>奶龙list 是一款基于 Electron 构建的桌面多功能效率工具，以可爱的"奶龙"IP 为设计灵感，将日常待办管理与游戏化元素巧妙融合。它不只是一个待办清单，更是一个有温度的效率伴侣。</p>
      <h3>核心功能模块</h3>
      <ul>
        <li><strong>待办事项管理</strong> — 全生命周期管理，支持四级分类（工作/生活/学习/自定义）、三档优先级（高/中/低）、标签系统、自定义截止日期、重复模式（每日/工作日/每周/每月），到期自动弹出系统通知</li>
        <li><strong>朋友圈模块</strong> — 仿微信朋友圈的动态发布功能，支持文字、图片、视频的混合发布，以及评论互动与点赞功能</li>
        <li><strong>时间胶囊</strong> — 写给未来的信。将内容以 XOR 加密写入本地，设定未来的解锁时间。到期前内容完全加密不可见，到期后自动解密展示。支持图片附件，是独一无二的数字时间胶囊</li>
        <li><strong>日历视图</strong> — 日历模式浏览待办分布，配合重复任务的每日打卡追踪，自动统计连续打卡天数，培养好习惯</li>
        <li><strong>RPG 角色成长系统</strong> — 完成任务获得经验值，经验累积升级。称号体系从"初心者"到"冒险家"、"勇士"、"英雄"、"传说"直至"奶龙大师"。紧急任务和到期任务提供额外经验加成，用游戏化反馈提升效率</li>
      </ul>
      <h3>技术亮点</h3>
      <ul>
        <li><strong>Electron 桌面框架</strong> — 使用 Electron 28 构建跨平台桌面应用，Node.js 原生文件 IO，支持自定义数据存储路径</li>
        <li><strong>纯原生 JavaScript</strong> — 不依赖前端框架，全部使用原生 JavaScript + HTML/CSS 实现，轻量高效</li>
        <li><strong>客户端加密</strong> — 时间胶囊采用 XOR 加密算法保护内容隐私，密钥固定校验，保证到期前不可读</li>
        <li><strong>Chart.js 可视化</strong> — 集成 Chart.js 统计图表，任务完成趋势、分类分布、优先级分布一目了然</li>
        <li><strong>暗色主题</strong> — 支持亮色/暗色/跟随系统三种主题模式，CSS 变量管理全局配色方案</li>
        <li><strong>数据持久化</strong> — JSON 文件本地存储，支持导出/导入和自定义目录，数据完全自主可控</li>
      </ul>
      <h3>项目结构</h3>
      <ul>
        <li><strong>main.js</strong> — Electron 主进程，IPC 通信桥梁，文件读写，系统通知</li>
        <li><strong>renderer.js</strong> — 渲染进程，页面加载和模块初始化</li>
        <li><strong>js/todo.js</strong> — 待办模块完整逻辑，含 CRUD、筛选过滤、统计、搜索、数据导入导出</li>
        <li><strong>js/moments.js</strong> — 朋友圈模块，动态发布与交互</li>
        <li><strong>js/capsule.js</strong> — 时间胶囊模块，加密/解密逻辑</li>
        <li><strong>js/calendar.js</strong> — 日历视图与打卡追踪</li>
        <li><strong>js/common.js</strong> — 通用工具函数，Toast 通知，ID 生成，日期格式化</li>
        <li><strong>数据/</strong> — 本地 JSON 数据存储目录</li>
      </ul>
      <h3>运行与构建</h3>
      <p>基于 npm + Electron 生态：<code>npm start</code> 启动开发模式，<code>npm run build</code> 使用 electron-packager 打包为 Windows 可执行程序。同时也发布了可直接运行的 exe 发行版（奶龙list.exe）。</p>
    `,
  },
  5: {
    title: 'Marvis Skills',
    subtitle: 'AI 自动化技能集合，赋能智能助手',
    description:
      '基于 Marvis 平台的 AI 技能集合仓库，将 AI Agent 能力封装为可复用的技能包。目前包含「抖音评论自动回复」「文件智能归类」「微博评论自动回复」三大技能，覆盖社交媒体自动化与文件管理场景。',
    url: 'https://github.com/xlx0131/skills-',
    tags: ['AI', '自动化', '技能'],
    tech: ['Marvis', 'Browser Agent', 'AI', '文件管理'],
    year: '2026',
    highlights: [
      'Marvis 平台技能包，将 AI 能力封装为可复用技能',
      '抖音评论自动回复 — Browser Agent 驱动网页自动化',
      '文件智能归类 — 11种分类维度+三级主题分类',
      '微博评论自动回复 — 定时发布+周期性检测回复',
      '智能登录检测与人机交互扫码登录流程',
      '批量读取评论区，逐条智能生成个性化回复',
      '回复语气自然、不重复，避免 AI 模板化',
      '完整的容错处理与安全提示机制',
    ],
    details: `
      <p>Marvis Skills 是一个基于 <a href="https://marvis.tencent.com" target="_blank" rel="noopener noreferrer">Marvis</a> 平台的 AI 自动化技能集合仓库。Marvis 是一个 AI 智能助手平台，而 Skills 是其技能扩展体系——将 AI Agent 的能力封装为可复用的技能包，让智能助手能完成更多实际工作任务。</p>
      <h3>技能体系</h3>
      <p>每个技能以标准化的 <code>SKILL.md</code> 文件定义，按照 Marvis 平台的 YAML frontmatter + Markdown 格式组织。技能文件包含 <code>name</code>（技能名称）和 <code>description</code>（触发条件描述），正文则详细描述执行流程。</p>
      <h3>已收录技能</h3>
      <ul>
        <li><strong>抖音评论自动回复</strong> — <code>douyin-comment-replier</code></li>
        <li><strong>文件智能归类</strong> — <code>file-organizer</code></li>
        <li><strong>微博评论自动回复</strong> — <code>weibo-comment-replier</code></li>
      </ul>
      <h3>抖音评论自动回复详解</h3>
      <p>该技能通过 Browser Agent（浏览器自动化代理）操作网页版抖音，完成以下完整流程：</p>
      <ol>
        <li><strong>需求分析</strong> — 从用户输入中提取抖音链接（支持短链接和完整链接）、回复范围（全部/最新N条/特定类型）、自定义回复风格要求</li>
        <li><strong>浏览器自动化</strong> — 使用 <code>dispatch_task</code> 将任务派发给 Browser Agent，打开抖音网页版</li>
        <li><strong>登录检测</strong> — 自动检测登录状态，未登录时提示用户手动扫码/输入账号</li>
        <li><strong>评论加载</strong> — 滚动加载全部评论，直到没有新评论出现</li>
        <li><strong>智能回复生成</strong> — 逐条阅读评论内容，AI 生成个性化回复：
          <ul>
            <li>理解评论意图，贴合内容生成自然回复</li>
            <li>语气自然、像真人对话，不使用 AI 模板化语言</li>
            <li>每条回复各不相同，避免千篇一律</li>
            <li>支持用户自定义回复风格</li>
          </ul>
        </li>
        <li><strong>批量发送</strong> — 逐一点击回复按钮，输入生成的回复内容并发送</li>
        <li><strong>结果呈现</strong> — 输出评论-回复对照表，标注每条的发送状态</li>
      </ol>
      <h3>文件智能归类详解</h3>
      <p>对指定目录下的混杂文件进行智能扫描、自动分类并归档整理，支持三级分类体系：</p>
      <ol>
        <li><strong>扫描分析</strong> — 扫描目标目录，获取文件类型、大小等元数据</li>
        <li><strong>一级分类</strong> — 按 11 种分类维度（文件类型、用途、软件项目、开发工具、游戏资源等）自动分析</li>
        <li><strong>二级细分</strong> — 大类下支持二级细分（文档→Word/Excel/PPT/PDF，图片→照片/截图/矢量等）</li>
        <li><strong>三级主题分类</strong> — 文档类二级目录下支持三级主题分类，根据文件名和文档内容标题自动识别课程/项目主题（如Hadoop相关、Java编程、数据库技术等），将同一主题文档归入三级子文件夹</li>
        <li><strong>执行整理</strong> — 创建「序号-中文名称」式分类文件夹并移动文件</li>
        <li><strong>结果展示</strong> — 展示整理前后对比结果</li>
      </ol>
      <h3>微博评论自动回复详解</h3>
      <p>在微博发布 AI 帖子，并创建定时任务周期性检测评论区，自动智能回复每条新评论：</p>
      <ol>
        <li><strong>登录发布</strong> — 通过 Edge 浏览器打开微博，完成登录后发布指定内容的帖子</li>
        <li><strong>定时任务创建</strong> — 自动创建定时任务，按设定周期检测评论区</li>
        <li><strong>评论检测</strong> — 周期性检测评论区新增评论</li>
        <li><strong>智能回复生成</strong> — 对新评论智能生成个性化回复，支持自定义回复风格</li>
        <li><strong>自动发送</strong> — 自动发送回复并记录发送状态</li>
        <li><strong>频率控制</strong> — 支持自定义检测频率（如每隔30分钟检测一次）</li>
      </ol>
      <h3>容错机制</h3>
      <ul>
        <li>链接无效时提示用户确认</li>
        <li>登录失败时引导用户手动完成</li>
        <li>评论加载不全时告知已回复数量</li>
        <li>发送失败时标注原因（频率限制、内容审核等）</li>
        <li>文件移动失败时记录并跳过，继续处理其他文件</li>
      </ul>
      <h3>项目结构</h3>
      <pre><code>marvis-skills/
├── README.md                    # 项目说明
├── douyin-comment-replier/
│   └── SKILL.md                # 抖音评论自动回复技能
├── file-organizer/
│   ├── SKILL.md                # 文件智能归类技能
│   └── references/
│       └── classification-guide.md  # 分类规则指南
└── weibo-comment-replier/
    └── SKILL.md                # 微博评论自动回复技能
</code></pre>
      <p>这是一个持续扩展的项目，未来将收录更多 AI 自动化技能，覆盖更多实际应用场景。</p>
    `,
  },
  6: {
    title: 'JXAU教务一体化',
    subtitle: '江西农大教务系统自动化工具集',
    description:
      '基于 Python 的江西农业大学教务系统自动化工具集，涵盖自动抢课、成绩查询与课表查询三大场景。配合 ddddocr 离线 OCR 实现验证码自动识别，无需人工干预。同时提供 GUI 一体化桌面应用，三标签页切换 + 共享登录会话。',
    url: 'https://github.com/xlx0131/-JXAU-',
    tags: ['Python', '自动化', '教务系统'],
    tech: ['Python', 'requests', 'ddddocr', 'PyQt', 'GUI'],
    year: '2026',
    highlights: [
      '抢课脚本 — 定时轮询检测课程余量，有余量立即提交',
      '成绩查询 — 全学期成绩拉取，按学期分组展示，CSV导出',
      '课表查询 — 网格化课表展示，上午/下午/晚上分区',
      '验证码自动识别 — ddddocr离线OCR，识别失败降级手动输入',
      'GUI一体化应用 — 三标签页切换，共享登录会话，免安装即用',
      '登录重试机制 — 验证码错误/网络波动时自动重试',
      '会话自动维护 — Session过期自动检测并重新登录',
    ],
    details: `
      <p>JXAU教务一体化是一套基于 Python 的江西农业大学教务系统自动化工具集，利用 <code>requests</code> 库模拟自研 ASP.NET MVC 教务系统 HTTP 请求，配合 <code>ddddocr</code> 离线 OCR 实现验证码自动识别，无需人工干预。项目包含三个独立脚本和一个 GUI 一体化桌面应用。</p>
      <h3>工具一：抢课脚本</h3>
      <p><code>jxau_course_grabber.py</code> — 自动化抢课脚本，支持定时轮询、验证码自动识别、交互式课程选择。</p>
      <ul>
        <li><strong>课程浏览与筛选</strong> — 登录后自动拉取全校公选课列表，以规整表格展示（序号/JxbBh/课程名/教师/学分/余量）</li>
        <li><strong>交互式选课</strong> — 支持按序号、JxbBh 编号、课程名称关键词选择目标课程</li>
        <li><strong>定时抢课</strong> — 单线程轮询 + 随机延时（0.5~1.5s），自动检测课程余量，有余量立即提交</li>
        <li><strong>结构化日志</strong> — 同时输出控制台和文件，方便排查问题</li>
      </ul>
      <h3>工具二：成绩查询脚本</h3>
      <p><code>jxau_grade_query.py</code> — 快速查询全部学期成绩并导出，支持按学期分组展示与 CSV 导出。</p>
      <ul>
        <li><strong>全学期成绩拉取</strong> — 一键拉取教务系统中全部已有成绩数据</li>
        <li><strong>按学期分组展示</strong> — 每学期独立表格，自动汇总学期学分、及格/不及格统计</li>
        <li><strong>详细统计汇总</strong> — 总课程数、总学分、平均绩点（仅统计有效绩点课程）</li>
        <li><strong>CSV 导出</strong> — 支持将全部成绩导出为 UTF-8 BOM 编码的 CSV 文件，可用 Excel 直接打开</li>
      </ul>
      <h3>工具三：课表查询脚本</h3>
      <p><code>jxau_schedule_query.py</code> — 查询本人课表，支持按学期切换、网格化课表展示。</p>
      <ul>
        <li><strong>网格化课表展示</strong> — 按星期 X 节次组织，上午（1-2节）、下午（5-6节）、晚上（9-11节）清晰分区</li>
        <li><strong>课程详情</strong> — 每门课程展示课程名称、授课周次、任课教师、教室、教室类型</li>
        <li><strong>学期切换</strong> — 支持交互式切换学期，查看过往或未来学期课表</li>
      </ul>
      <h3>工具四：GUI 一体化桌面应用</h3>
      <p><code>JXAU教务一体化.exe</code> — 将上述三个脚本整合为统一的 Windows 桌面应用程序，免安装 Python 环境，双击即用。</p>
      <ul>
        <li><strong>三标签页界面</strong> — 抢课选课、成绩查询、课表查询三个模块集成在一个窗口</li>
        <li><strong>共享登录会话</strong> — 登录一次后三个模块共用 Session，无需重复输入账号密码</li>
        <li><strong>可视化课表</strong> — Canvas 网格化渲染，上午/下午/晚上分区，支持垂直滚动</li>
        <li><strong>成绩 Treeview</strong> — 表格化成绩明细，学期切换 + 汇总统计</li>
        <li><strong>实时运行日志</strong> — 底部日志面板，所有操作可见、可追踪</li>
        <li><strong>便携免安装</strong> — 单文件 exe，拷贝即用，无需 Python 环境</li>
      </ul>
      <h3>核心技术实现</h3>
      <ul>
        <li><strong>HTTP 请求模拟</strong> — 使用 <code>requests.Session</code> 维护登录状态，模拟教务系统的 POST/GET 请求</li>
        <li><strong>验证码自动识别</strong> — <code>ddddocr</code> 离线 OCR 引擎，无需联网即可识别验证码</li>
        <li><strong>登录重试机制</strong> — 自动处理验证码错误、网络波动等异常情况，支持配置最大重试次数与间隔</li>
        <li><strong>会话自动维护</strong> — 检测 Session 过期并自动重新登录，支持长时间运行</li>
        <li><strong>GUI 界面</strong> — PyQt 开发，Canvas 绘制课表，Treeview 展示成绩，多标签页切换</li>
      </ul>
      <h3>项目结构</h3>
      <pre><code>-JXAU-/
├── jxau_course_grabber.py      # 抢课脚本
├── jxau_grade_query.py         # 成绩查询脚本
├── jxau_schedule_query.py      # 课表查询脚本
├── JXAU教务一体化.exe           # GUI桌面应用
├── requirements.txt            # 依赖列表
└── README.md                   # 项目说明
</code></pre>
      <h3>使用方式</h3>
      <p>Python 脚本模式：安装依赖后运行对应脚本，按提示输入学号密码即可。支持环境变量配置实现非交互模式。</p>
      <p>GUI 桌面模式：直接下载并运行 <code>JXAU教务一体化.exe</code>，无需安装 Python 环境。</p>
    `,
  },
}

// 文章列表
export const articles = [
  {
    id: 1,
    title: '从零购买域名并配置 Cloudflare：许立鑫.site 实战记录',
    date: '2026-07-02',
    category: '运维',
    readingTime: '8 min',
    words: '1,200',
    summary: '记录在阿里云购买域名「许立鑫.site」，并将 DNS 解析迁移到 Cloudflare，配置 Pages 自定义域名与 SSL 的全过程。',
    tags: ['域名', 'Cloudflare', '阿里云', '部署'],
  },
  {
    id: 2,
    title: 'AI运维完全学习手册：从0基础到AI大模型运维专家',
    date: '2026-07-09',
    category: '运维',
    readingTime: '120 min',
    words: '50,000',
    summary: '10大阶段 · 33章 · 230+知识点 · 10大项目实战，涵盖Linux、网络、数据库、中间件、云原生、DevOps、AI大模型运维全链路知识体系。',
    tags: ['运维', 'Linux', 'K8s', 'AI大模型', 'DevOps'],
    url: '/ai-ops-handbook',
  },
]

// 文章详情
export const articleDetails = {
  '1': {
    id: 1,
    title: '从零购买域名并配置 Cloudflare：许立鑫.site 实战记录',
    date: '2026-07-02',
    category: '运维',
    content: `
      <p>一个属于自己的域名，是个人网站的"门牌号"。本文记录了我在阿里云购买域名「许立鑫.site」，并将其配置到 Cloudflare 的全流程。</p>

      <h2>为什么需要自定义域名</h2>
      <p>Cloudflare Pages 部署后会分配一个 <code>*.pages.dev</code> 的二级域名，虽然可以直接访问，但自定义域名更有专业感，也更方便记忆和传播。</p>

      <h2>在阿里云购买域名</h2>
      <p>阿里云是国内主流的域名注册商，购买流程非常便捷：</p>
      <ul>
        <li>进入阿里云官网，搜索"域名注册"</li>
        <li>输入想要的域名「许立鑫.site」，检查可用性</li>
        <li><strong>.site</strong> 后缀价格实惠，适合个人站点</li>
        <li>完成实名认证后即可下单购买</li>
      </ul>
      <p>购买完成后，在"域名控制台"可以管理已注册的域名。</p>

      <h2>将 DNS 迁移到 Cloudflare</h2>
      <p>Cloudflare 提供免费的 DNS 托管服务，解析速度快且自带 DDoS 防护：</p>
      <ul>
        <li>在 Cloudflare 控制台添加站点，输入「许立鑫.site」</li>
        <li>Cloudflare 会自动扫描现有 DNS 记录</li>
        <li>复制 Cloudflare 分配的 DNS 服务器地址（如 <code>alice.ns.cloudflare.com</code>）</li>
        <li>回到阿里云域名控制台，将 DNS 服务器修改为 Cloudflare 的地址</li>
      </ul>
      <p>DNS 修改通常需要几分钟到几小时生效，Cloudflare 会实时检测状态。</p>

      <h2>配置 Cloudflare Pages 自定义域名</h2>
      <p>DNS 生效后，就可以将域名绑定到 Pages 项目了：</p>
      <ul>
        <li>进入 Cloudflare Pages 项目 → 自定义域</li>
        <li>输入「许立鑫.site」，点击继续</li>
        <li>Cloudflare 会自动添加一条 CNAME 记录指向 Pages 项目</li>
        <li>开启 <strong>SSL/TLS 加密</strong>，选择 Full(strict) 模式</li>
        <li>开启 <strong>自动 HTTPS 重写</strong>，确保所有访问走 HTTPS</li>
      </ul>
      <p>配置完成后，访问「许立鑫.site」就能看到个人主页了。</p>

      <h2>优化建议</h2>
      <ul>
        <li>开启 Cloudflare 的 <strong>Auto Minify</strong> 自动压缩 HTML/CSS/JS</li>
        <li>配置 <strong>页面规则</strong> 实现 301 重定向（如 www 到根域名）</li>
        <li>开启 <strong>Brotli 压缩</strong> 提升页面加载速度</li>
        <li>配置 <strong>缓存规则</strong> 提高静态资源命中率</li>
      </ul>

      <h2>总结</h2>
      <p>从阿里云购买域名到配置 Cloudflare 托管，全程不需要服务器，所有操作在网页控制台即可完成。有了自己的域名，个人主页才算真正拥有了独立的身份标识。</p>
    `,
  },
}

// 随笔列表
export const essays = [
  {
    id: 1,
    date: '2026-07-13',
    title: '脑机接口刷抖音',
    content: '能不能发明一种芯片，插在脑子里，闭着眼睛能在眼皮上刷抖音。',
  },
]

// 小说列表
export const novels = []

// 日记列表
export const diaries = []
