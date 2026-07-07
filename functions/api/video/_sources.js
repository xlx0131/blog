export const SOURCES = {
  heimuer: {
    name: '黑木耳',
    baseUrl: 'https://www.heimuer.tv/api.php/provide/vod',
    enabled: true,
    description: '高清影视资源站，更新速度快',
  },
  ffzy: {
    name: '非凡资源',
    baseUrl: 'https://api.ffzyapi.com/api.php/provide/vod',
    enabled: true,
    description: '海量影视资源，种类齐全',
  },
  subo: {
    name: '速播资源',
    baseUrl: 'https://www.suboziyuan.net/api.php/provide/vod',
    enabled: true,
    description: '快速稳定的影视资源站',
  },
  kuaikan: {
    name: '快看资源',
    baseUrl: 'https://www.kuaikanzy.net/api.php/provide/vod',
    enabled: true,
    description: '热门剧集每日更新',
  },
  okzyw: {
    name: 'OK资源网',
    baseUrl: 'https://okzyw.vip/api.php/provide/vod',
    enabled: true,
    description: '优质高清影视资源',
  },
}

export function getSource(sourceKey) {
  return SOURCES[sourceKey]
}

export function getEnabledSources() {
  return Object.entries(SOURCES)
    .filter(([, config]) => config.enabled)
    .map(([key, config]) => ({
      key,
      name: config.name,
      description: config.description,
    }))
}
