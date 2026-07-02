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
    title: '用户画像分析：从数据清洗到 RFM 模型构建',
    date: '2026-01-15',
    category: '数据分析',
    readingTime: '12 min',
    words: '2,000',
    summary: '基于用户行为数据，使用 Python + SQL 进行全链路数据清洗，利用 RFM 模型构建用户标签体系。',
    tags: ['Python', '数据分析', 'RFM'],
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
  '2': {
    id: 2,
    title: '用户画像分析：从数据清洗到 RFM 模型构建',
    date: '2026-01-15',
    category: '数据分析',
    content: `
      <p>用户画像分析是数据挖掘领域的重要应用。本文分享了我如何基于用户行为数据，使用 Python 和 SQL 进行全链路数据清洗，并利用 RFM 模型构建用户标签体系。</p>

      <h2>项目背景</h2>
      <p>电商平台需要对用户进行精细化运营，而用户画像是实现精准营销的基础。本项目旨在通过分析用户的消费行为数据，为每个用户打上多维度的标签，构建完整的用户画像体系。</p>

      <h2>数据清洗</h2>
      <p>数据清洗是数据分析中最重要也是最耗时的环节。我使用 Pandas + SQL 实现了：</p>
      <ul>
        <li><strong>去重</strong> — 识别并移除重复的用户行为记录</li>
        <li><strong>缺失值填充</strong> — 对关键字段的缺失值进行合理填充</li>
        <li><strong>异常值过滤</strong> — 使用统计方法识别并处理异常数据</li>
        <li><strong>标准化</strong> — 统一数据格式，确保下游分析的一致性</li>
      </ul>

      <h2>RFM 模型</h2>
      <p>RFM 模型是用户价值分析的经典模型：</p>
      <ul>
        <li><strong>R (Recency)</strong> — 最近一次消费时间，越近价值越高</li>
        <li><strong>F (Frequency)</strong> — 消费频率，频率越高忠诚度越高</li>
        <li><strong>M (Monetary)</strong> — 消费金额，金额越高价值越高</li>
      </ul>
      <p>通过对三个维度的评分和加权，将用户分为不同层级，如高价值用户、重点发展用户、流失预警用户等。</p>

      <h2>可视化</h2>
      <p>使用 Matplotlib 生成可视化统计图表，直观展示用户分布、消费趋势和标签统计等信息，便于业务团队理解和决策。</p>
    `,
  },
}
